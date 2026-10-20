import {Game,COLS,ROWS,PALETTE,random} from './engine.mjs';

export const FEVER_DURATION=90;
export const FEVER_LENGTH=10;
const inside=(x,y)=>x>0&&x<COLS-1&&y>0&&y<ROWS-1;
const near=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const TYPES=['rusher','swarm','bomber','splitter','spitter','shield','moth','burrower'];

// The arcade has its own world loop, rewards and save envelope. Only the shared
// mineral connectivity, falling terrain, enemy movement and artwork are reused.
export class FeverGame extends Game{
  constructor(seed=Date.now()){
    super(seed,null,'realtime');
    this.arcade='fever';this.sector=0;
    this.fever={remaining:FEVER_DURATION,score:0,meter:0,active:0,activations:0,maxCombo:0,mistakes:0,upgrades:0,finale:false};
    Object.assign(this.player,{hp:100,maxHp:100,shield:0,potions:0,invuln:0,drill:'star',charges:[0,0,0,0]});
    this.blastQueue=[];this.gems=[];this.steerTimer=0;this.autoTimer=0;this.steerSide=1;this.captionTimer=0;
    this.loadArcadeFloor();this.toast('左右かGOでスタート！ 下へは自動で掘り進みます');
  }
  get roomNumber(){return this.arcade?this.sector+1:super.roomNumber;}
  get depth(){return this.arcade?(this.sector*(ROWS-9)+Math.max(0,this.player.maxY-2))*5:super.depth;}
  get multiplier(){return Math.min(8,1+Math.floor(this.combo/3))*(this.fever?.active>0?3:1);}
  get elapsed(){return FEVER_DURATION-this.fever.remaining;}
  get digColumns(){
    const x=this.player.x;if(this.fever.active>0)return [x-1,x,x+1].filter(n=>n>0&&n<COLS-1);
    return this.fever.upgrades>=1?[x,clamp(x+this.steerSide,1,COLS-2)].filter((n,i,a)=>a.indexOf(n)===i):[x];
  }
  setClockMode(){return false;}
  loadArcadeFloor(){
    const rand=random(this.seed+this.sector*104729+15313);this.stage=this.sector%6;this.room=0;this.roomType='runes';
    this.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>inside(x,y)?null:{c:9,hp:999}));
    const coarse=Array.from({length:26},()=>Array.from({length:5},()=>Math.floor(rand()*4)));
    for(let y=5;y<ROWS-2;y++)for(let x=1;x<COLS-1;x++){
      let c=coarse[Math.floor(y/3)][Math.floor(x/3)];if(rand()<.06)c=10;if(rand()<.008)c=4;
      this.grid[y][x]={c,hp:1};
    }
    this.enemies=[];this.falling=[];this.broods=[];this.hazards=[];this.fluids=[];this.sources=[];this.fixtures=[];this.setpieces=[];this.boss=null;this.blastQueue=[];
    this.exit={x:6,y:ROWS-2,open:false};this.entrance={x:6,y:2};this.goal={progress:0,total:100,complete:false};
    this.collapseFront=-100;this.swarmBudget=0;this.swarmTimer=999;this.settleTimer=.15;this.roomTime=0;
    this.nestVersion=1;this.enemyVersion=2;this.encounterVersion=2;this.tacticsVersion=1;
    for(let y=10,pack=0;y<ROWS-8;y+=8,pack++){
      const center=3+Math.floor(rand()*7);this.carve(center-1,y,3,1);
      for(let i=-1;i<=1;i++){
        const e=this.makeEnemy(center+i,y,TYPES[(pack*3+i+1+this.sector)%TYPES.length],rand);
        e.hp=e.maxHp=1;e.timer=.8+rand()*.6;e.stun=.4;this.enemies.push(e);
      }
      const side=center<6?center+2:center-2;this.grid[y-1][side]={c:12,hp:1};
      this.grid[y+2][clamp(12-center,1,11)]={c:6,hp:1};
    }
    Object.assign(this.player,{x:6,y:2,rx:6,ry:2,maxY:2,dir:'down',fallTimer:0,drillTimer:0});
    this.particles=[];this.texts=[];this.fx=[];this.gems=[];this.visited=[];this.autoTimer=0;this.steerTimer=0;
    if(this.fever.finale)this.seedFinale();
  }
  gainXP(){}
  gainGold(n){if(!this.fever)return 0;this.addScore(n*10);return n;}
  addScore(n){this.fever.score+=Math.round(n*this.multiplier);this.player.gold=this.fever.score;}
  caption(text,x,y,color){if(this.captionTimer>0)return;this.float(text,x,y,color);this.captionTimer=.2;}
  gainFever(n){
    const f=this.fever;if(f.active>0||this.mode!=='play')return;f.meter=Math.min(100,f.meter+n);
    if(f.meter>=100){f.meter=0;f.active=FEVER_LENGTH;f.activations++;this.autoTimer=0;this.toast('FEVER! 10秒間、3列まとめて粉砕！');this.emit('fever');}
  }
  clearCells(cells,{chain=true,rewards=true,source='dig'}={}){
    if(!this.fever)return super.clearCells(cells,{chain,rewards,source});
    const removed=[],bombs=[];let minerals=0,treasure=0,gemColor=-1;
    for(const {x,y}of cells){
      const t=this.at(x,y);if(!t||t.c===9||!inside(x,y))continue;this.grid[y][x]=null;removed.push({x,y});this.stats.blocks++;
      if(t.c<4){minerals++;gemColor=t.c;}if(t.c>=5&&t.c<=8)treasure+=t.c===8?240:t.c===6?100:60;if(t.c===12)bombs.push({x,y});
      if(removed.length<40)this.burst(x,y,PALETTE[t.c]||this.biome.rock,cells.length>12?2:4);
      if(this.gems.length<55&&(t.c<4||t.c===6))this.gems.push({x:x+.5,y:y+.5,life:.65,color:PALETTE[t.c]||'#ffe1a0'});
    }
    if(!removed.length)return 0;
    if(chain&&minerals>=3){
      this.combo=this.comboTimer>0?Math.min(999,this.combo+1):1;this.comboTimer=4.5;
      this.stats.chains++;this.stats.maxChain=Math.max(this.stats.maxChain,minerals);this.fever.maxCombo=Math.max(this.fever.maxCombo,this.combo);
      this.emit('chain',{count:minerals,combo:this.combo,x:removed[0].x+.5,y:removed[0].y+.5,color:gemColor});this.gainFever(Math.min(6,1+minerals*.08));this.shake=Math.max(this.shake,.045);
      if(!treasure&&(minerals>=6||source==='landing'))this.caption(`${minerals} BREAK · ×${this.multiplier}`,removed[0].x,removed[0].y,'#ffe3a3');
    }
    if(rewards)this.addScore(removed.length*10+minerals*5+treasure+(source==='landing'?minerals*15:0));
    if(treasure){this.emit('gold');this.caption('TREASURE!',removed[0].x,removed[0].y,'#ffe0a1');}
    for(const b of bombs)this.queueBlast(b.x,b.y,2,'barrel');this.settleTimer=.06;return removed.length;
  }
  queueBlast(x,y,radius=1,kind='burst'){
    if(this.blastQueue.length<96)this.blastQueue.push({x,y,radius,kind});
  }
  explode(x,y,radius=1,power=1,source='blast'){this.queueBlast(x,y,radius,source);}
  processBlasts(){
    // A bounded breadth-first queue turns crowds into a readable rolling cascade.
    for(let n=0;n<8&&this.blastQueue.length;n++){
      const b=this.blastQueue.shift(),cells=[];
      if(b.kind==='shock'){
        for(let dx=-b.radius;dx<=b.radius;dx++){const x=b.x+dx;if(inside(x,b.y)&&this.at(x,b.y)?.c!==9)cells.push({x,y:b.y});}
        for(const e of [...this.enemies])if(Math.abs(e.y-b.y)<=1&&Math.abs(e.x-b.x)<=b.radius)this.attackEnemy(e,1,'shock');
        this.fx.push({kind:'shock',x:b.x+.5,y:b.y+.5,radius:b.radius,color:'#a9e7d2',life:.3,max:.3});
      }else{
        for(let dy=-b.radius;dy<=b.radius;dy++)for(let dx=-b.radius;dx<=b.radius;dx++)if(inside(b.x+dx,b.y+dy)&&Math.abs(dx)+Math.abs(dy)<=b.radius+1)cells.push({x:b.x+dx,y:b.y+dy});
        for(const e of [...this.enemies])if(near(e,b)<=b.radius+1)this.attackEnemy(e,1,'blast');
        this.fx.push({kind:'blast',x:b.x+.5,y:b.y+.5,radius:b.radius+.4,color:b.kind==='barrel'?'#f3ad70':'#b5a0f3',life:.3,max:.3});
      }
      this.clearCells(cells,{source:b.kind});
    }
    if(this.fx.length>35)this.fx.splice(0,this.fx.length-35);
  }
  attackEnemy(e,power,source='dig'){
    if(!this.enemies.includes(e)||power<=0)return;
    this.enemies.splice(this.enemies.indexOf(e),1);this.stats.kills++;
    if(['rock','barrel','blast','shock','enemyRush','enemySpit'].includes(source))this.stats.terrainKills++;
    this.addScore(180);this.gainFever(2);this.burst(e.x,e.y,'#ffe0aa',8);this.emit('kill',{x:e.x+.5,y:e.y+.5});
    const shock=['rusher','burrower'].includes(e.type),radius=this.fever.upgrades>=2?2:1;
    this.queueBlast(e.x,e.y,shock?3:e.type==='bomber'?2:radius,shock?'shock':'burst');
  }
  damage(){
    const p=this.player;if(this.mode!=='play'||p.invuln>0)return;
    this.fever.mistakes++;this.combo=Math.floor(this.combo/2);this.fever.meter=Math.max(0,this.fever.meter-8);
    p.invuln=1.4;p.rx=p.x+(this.steerSide>0?-.14:.14);p.ry=p.y-.16;
    this.shake=Math.max(this.shake,.07);this.flash=.045;this.float('BOUNCE!',p.x,p.y,'#ffcc9c');this.emit('bump');
  }
  tryStep(dir){
    if(!['left','right'].includes(dir)||this.mode!=='play')return false;
    const p=this.player,dx=dir==='left'?-1:1,x=p.x+dx,y=p.y;if(!inside(x,y)||this.occupied(x,y))return false;
    this.steerSide=dx;const e=this.enemies.find(e=>e.x===x&&e.y===y);if(e)this.attackEnemy(e,1);
    if(this.at(x,y))this.clearCells(this.component(x,y));p.x=x;this.emit('step');return true;
  }
  drillDown(){
    const p=this.player,y=p.y+1,cells=[];
    for(const x of this.digColumns){
      for(const e of [...this.enemies])if(e.x===x&&e.y===y)this.attackEnemy(e,1);
      const t=this.at(x,y);if(t&&t.c!==9)cells.push(...this.component(x,y));
    }
    if(this.clearCells(cells)){this.emit('dig');p.drillTimer=.11;}
    if(inside(p.x,y)&&!this.at(p.x,y)&&!this.occupied(p.x,y)&&!this.actorAt(p.x,y)){p.y=y;p.fallTimer=0;}
  }
  resonate(){
    const p=this.player;if(this.mode!=='play'||p.pulseTimer>0)return false;
    p.pulseTimer=3.5;this.stats.casts++;this.queueBlast(p.x,Math.min(ROWS-2,p.y+2),2,'barrel');this.emit('pulse');return true;
  }
  potion(){return false;}
  seedFinale(){
    const top=Math.min(ROWS-12,this.player.y+3);
    for(let y=top;y<top+7;y++)for(let x=1;x<COLS-1;x++)if(!this.occupied(x,y)&&!this.actorAt(x,y))this.grid[y][x]={c:1,hp:1};
  }
  checkObjective(){
    const p=this.player;p.maxY=Math.max(p.maxY,p.y);this.stats.depth=this.depth;this.goal.progress=Math.floor((p.y-2)/(ROWS-9)*100);
    if(p.y>=ROWS-7){this.sector++;this.stats.rooms++;this.loadArcadeFloor();this.emit('arcadeSector');}
  }
  finish(){if(this.mode!=='play')return;this.fever.remaining=0;this.mode='fever-result';this.blastQueue=[];this.emit('feverFinish');}
  updateVisuals(dt){
    super.updateVisuals(dt);this.captionTimer=Math.max(0,(this.captionTimer||0)-Math.min(dt,.04));if(!this.gems)return;
    for(const a of this.gems){a.life-=Math.min(dt,.04);const t=Math.min(1,dt*9);a.x+=(this.player.rx+.5-a.x)*t;a.y+=(this.player.ry+.5-a.y)*t;}
    this.gems=this.gems.filter(a=>a.life>0);
  }
  advanceWorld(dt,input={}){
    this.updateVisuals(dt);if(this.mode!=='play')return;
    if(!this.started){if(!input.dir&&!input.tap&&!input.rush&&!input.pulse&&!input.start)return;this.started=true;this.messageTimer=0;this.emit('arcadeStart');}
    dt=Math.min(dt,this.fever.remaining);if(dt<=0){this.finish();return;}
    const f=this.fever,p=this.player;f.remaining=Math.max(0,f.remaining-dt);this.time+=dt;this.roomTime+=dt;this.ticks++;
    f.active=Math.max(0,f.active-dt);this.comboTimer=Math.max(0,this.comboTimer-dt);if(!this.comboTimer)this.combo=0;
    for(const k of ['invuln','pulseTimer','drillTimer'])p[k]=Math.max(0,p[k]-dt);this.autoTimer-=dt;this.steerTimer-=dt;this.messageTimer=Math.max(0,this.messageTimer-dt);
    const upgrades=this.elapsed>=45?2:this.elapsed>=20?1:0;
    if(upgrades>f.upgrades){f.upgrades=upgrades;this.toast(upgrades===1?'AUTO UPGRADE · 通常掘削も2列に！':'AUTO UPGRADE · 敵の誘爆がパワーアップ！');this.emit('upgrade');}
    if(!f.finale&&f.remaining<=12){f.finale=true;this.seedFinale();this.gainFever(100);this.toast('LAST 12s · 黄金の巨大鉱脈を砕こう！');this.emit('finale');}
    const steer=input.tap||input.dir;
    if(['left','right'].includes(steer)&&(this.steerTimer<=0||input.tap)){this.tryStep(steer);this.steerTimer=.13;}
    if(input.pulse)this.resonate();
    if(this.autoTimer<=0){this.drillDown();this.autoTimer=input.rush?.11:f.active>0?.14:.18;}
    this.processBlasts();
    p.fallTimer+=dt;
    if(!this.at(p.x,p.y+1)&&!this.occupied(p.x,p.y+1)&&!this.actorAt(p.x,p.y+1)&&p.y<ROWS-2&&p.fallTimer>.22){p.y++;p.fallTimer=0;}
    this.settleTimer-=dt;if(this.settleTimer<=0){this.scanFalls();this.settleTimer=.16;}this.updateFalls(dt);
    this.enemies=this.enemies.filter(e=>e.y>=p.y-14);this.falling=this.falling.filter(f=>f.cells.some(a=>a.y>=p.y-18));
    this.updateEnemies(dt);
    for(const h of this.hazards){h.delay-=dt;if(h.delay<=0&&!h.hit){h.hit=true;if(near(h,p)<=h.radius)this.damage();}}this.hazards=this.hazards.filter(h=>h.delay>-.25);
    p.rx+=(p.x-p.rx)*Math.min(1,dt*20);p.ry+=(p.y-p.ry)*Math.min(1,dt*20);p.dir='down';
    this.checkObjective();if(this.ticks%120===0)this.emit('save');if(f.remaining<=1e-8)this.finish();
  }
  serialize(){return {type:'fever',version:1,game:super.serialize(),fever:structuredClone(this.fever),sector:this.sector,autoTimer:this.autoTimer,steerTimer:this.steerTimer,steerSide:this.steerSide,blastQueue:structuredClone(this.blastQueue)};}
  static restore(data){
    const f=data?.fever;if(data?.type!=='fever'||data.version!==1||!f||!Number.isFinite(f.remaining)||f.remaining<=0||f.remaining>90||!Number.isSafeInteger(f.score)||f.score<0||!Number.isInteger(data.sector)||data.sector<0||data.sector>10000)throw Error('Invalid arcade save');
    for(const k of ['meter','active','activations','maxCombo','mistakes','upgrades'])if(!Number.isFinite(f[k])||f[k]<0)throw Error('Invalid arcade state');
    if(f.meter>100||f.active>10||f.upgrades>2||!Array.isArray(data.blastQueue)||data.blastQueue.length>96||data.blastQueue.some(b=>!inside(b.x,b.y)||!Number.isInteger(b.radius)||b.radius<1||b.radius>3||!['shock','burst','barrel','blast'].includes(b.kind)))throw Error('Invalid cascade');
    const world=Game.restore(structuredClone(data.game),null),g=new FeverGame(world.seed);Object.assign(g,world);
    g.arcade='fever';g.sector=data.sector;g.fever=structuredClone(f);g.blastQueue=structuredClone(data.blastQueue);g.gems=[];
    for(const k of ['rx','ry','invuln'])g.player[k]=data.game.state.player[k];g.autoTimer=Number.isFinite(data.autoTimer)?data.autoTimer:0;g.steerTimer=Number.isFinite(data.steerTimer)?data.steerTimer:0;g.steerSide=data.steerSide===-1?-1:1;
    return g;
  }
}

export function feverRank(score){return score>=2800000?'S':score>=2000000?'A':score>=1200000?'B':score>=600000?'C':'D';}
