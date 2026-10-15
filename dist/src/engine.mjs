export const VERSION='2.2.0';
export const COLS=13, ROWS=76;
export const PALETTE=['#75dba7','#f3ad70','#7ac9f1','#b5a0f3'];
export const ELEMENTS=[
  {id:0,name:'翠命',short:'回復',icon:'✚',description:'HPを回復し、迫る崩落を一時減速',color:PALETTE[0]},
  {id:1,name:'熾火',short:'爆破',icon:'✦',description:'前方を爆破。岩壁を崩し、敵へ大ダメージ',color:PALETTE[1]},
  {id:2,name:'霜晶',short:'凍結',icon:'❄',description:'貫通する冷気で敵と落盤を凍結',color:PALETTE[2]},
  {id:3,name:'紫電',short:'連雷',icon:'ϟ',description:'周囲の敵と鉱脈に連鎖する雷',color:PALETTE[3]},
];
export const BIOMES=[
  {name:'翠晶の忘却庭園',sub:'THE VERDANT ARCHIVE',tint:'#7acbab',bg:'#152923',rock:'#54665b',enemy:'moss',hazard:'つながる鉱脈を掘り、落下連鎖で一気に潜ろう。'},
  {name:'琥珀の埋葬都市',sub:'AMBER NECROPOLIS',tint:'#e6bb7d',bg:'#2d2522',rock:'#756657',enemy:'scarab',hazard:'重装の番兵は落石や爆薬で倒すと有利。'},
  {name:'水没した星見の院',sub:'THE DROWNED OBSERVATORY',tint:'#7ebed9',bg:'#172b38',rock:'#536b77',enemy:'jelly',hazard:'青い鉱脈を集め、凍結の共鳴で落盤を止めよう。'},
  {name:'菌糸の大聖堂',sub:'MYCELIUM CATHEDRAL',tint:'#b89ae5',bg:'#2a2034',rock:'#6c607a',enemy:'spore',hazard:'胞子の予告を避け、鉱脈の力で反撃しよう。'},
  {name:'熔けた機械の聖域',sub:'THE MOLTEN SANCTUM',tint:'#e89c77',bg:'#34211f',rock:'#78615b',enemy:'ember',hazard:'爆薬のある断層。爆風で支えを崩すと大きな連鎖になる。'},
  {name:'星の記憶の中枢',sub:'THE ASTRAL ARCHIVE',tint:'#a6b8ee',bg:'#22283d',rock:'#626d87',enemy:'void',hazard:'支柱の鉱脈を崩し、星喰いの核を解放せよ。'},
];
export const ROOM_TYPES={
  runes:{name:'共鳴の鉱脈',goal:'連鎖をつないで地底ゲートへ',hint:'つながる鉱脈が豊富。足場を崩し、連鎖で一気に潜る。',icon:'◇'},
  relic:{name:'黄金の断層',goal:'宝の脇道を選びながら下へ',hint:'金鉱・宝箱が多い。寄り道と崩落の距離を見極めよう。',icon:'✧'},
  purge:{name:'巨岩の断層',goal:'落石をかわして地底ゲートへ',hint:'大きな岩と硬い層が多い。凍結の共鳴で落盤を止められる。',icon:'▼'},
  escape:{name:'崩落前線',goal:'迫る崩落より先に掘り抜く',hint:'崩落が速い地層。大連鎖と高速掘削が近道になる。',icon:'»'},
  boss:{name:'守護者の断層',goal:'鉱脈の支柱を崩し、核を砕く',hint:'支柱の鉱脈を砕くと守護者に大ダメージ。掘削で攻略しよう。',icon:'⬡'},
};
export const EQUIPMENT={
  drills:[
    {id:'starter',name:'遺跡ブレイカー',desc:'岩盤と鉱脈を砕く標準装備',power:0,speed:1},
    {id:'iron',name:'アイアンビット',desc:'攻撃力 +5 / 硬岩への掘削 +1',power:5,speed:1,hard:1},
    {id:'twin',name:'ツインスパイラル',desc:'掘削間隔 −20% / 攻撃力 +3',power:3,speed:.8},
    {id:'prism',name:'共鳴のランス',desc:'攻撃力 +8 / 術式威力 +25%',power:8,speed:.95,magic:1.25},
    {id:'star',name:'星穿ち',desc:'攻撃力 +14 / 硬岩への掘削 +2',power:14,speed:.85,hard:2},
  ],
  suits:[
    {id:'cloth',name:'遺跡探査服',desc:'標準の探査装備',armor:0},
    {id:'guard',name:'落石ガード',desc:'被ダメージ −22%',armor:.22},
    {id:'lung',name:'晶格のローブ',desc:'術式威力 +30% / 被ダメージ −8%',armor:.08,magic:1.3},
    {id:'aegis',name:'深層イージス',desc:'被ダメージ −38% / 最大HP +20',armor:.38,hp:20},
  ],
};
export const UPGRADES=[
  {id:'edge',name:'螺旋研磨',kind:'BREAKER',icon:'✦',desc:'攻撃力 +5。硬岩の掘削も強化。'},
  {id:'quick',name:'高速ベアリング',kind:'BREAKER',icon:'»',desc:'掘削・移動の間隔 −12%。'},
  {id:'tank',name:'晶格拡張',kind:'CRYSTAL',icon:'◈',desc:'各属性の容量 +10。全属性を8補充。'},
  {id:'heart',name:'強化外殻',kind:'SURVIVAL',icon:'♥',desc:'最大HP +20。HPを25回復。'},
  {id:'chainAir',name:'共鳴回路',kind:'SYNERGY',icon:'♧',desc:'術式の結晶消費 −1。連鎖で追加の結晶を得る。'},
  {id:'leech',name:'生命の鉱脈',kind:'SYNERGY',icon:'♡',desc:'敵を倒すたびHPを5回復。'},
  {id:'pulse',name:'共鳴増幅器',kind:'SKILL',icon:'◎',desc:'パルス威力 +12、再使用時間 −18%。'},
  {id:'shield',name:'遺跡のお守り',kind:'SURVIVAL',icon:'◇',desc:'ダメージを無効にするシールドを2枚獲得。'},
  {id:'pocket',name:'鉱石マグネット',kind:'WEALTH',icon:'◆',desc:'獲得ゴールド +35%。その場で20G獲得。'},
  {id:'heal',name:'救難カプセル',kind:'SUPPLY',icon:'✚',desc:'回復薬を2本獲得。HPを15回復。'},
  {id:'bombAir',name:'崩壊の錬金術',kind:'TERRAIN',icon:'↟',desc:'地形で敵を倒すと全属性 +5、HP +8。'},
  {id:'guard',name:'衝撃吸収材',kind:'SURVIVAL',icon:'⬡',desc:'被ダメージをさらに12%軽減。'},
  {id:'magic',name:'古代の術式',kind:'ELEMENTAL',icon:'ϟ',desc:'全属性術式の威力と翠命の回復量 +25%。'},
  {id:'collapse',name:'崩落の達人',kind:'TERRAIN',icon:'▼',desc:'落石・爆薬・溶岩で与えるダメージ +50%。'},
];
export const DIRS={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
export function random(seed){let s=seed>>>0;const fn=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};fn.state=()=>s;fn.restore=n=>s=n>>>0;return fn;}
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const inside=(x,y)=>x>0&&x<COLS-1&&y>0&&y<ROWS-1;
export function normalizeMeta(raw){const d={cores:0,best:0,runs:0,wins:0,talents:{hull:0,air:0,drill:0}};if(!raw||typeof raw!=='object')return d;for(const k of ['cores','best','runs','wins'])d[k]=cap(Math.floor(Number(raw[k])||0),0,1e8);for(const k of ['hull','air','drill'])d.talents[k]=cap(Math.floor(Number(raw.talents?.[k])||0),0,5);return d;}
export function talentCost(level){return 5+level*5;}

export class Game{
  constructor(seed=Date.now(),meta=null){
    this.seed=seed>>>0;this.rng=random(this.seed);this.meta=normalizeMeta(meta);this.stage=0;this.room=0;this.roomType='runes';this.mode='play';this.time=0;this.roomTime=0;this.ticks=0;
    this.player={x:6,y:2,rx:6,ry:2,dir:'down',hp:100+this.meta.talents.hull*8,maxHp:100+this.meta.talents.hull*8,invuln:1,shield:1,potions:2,power:12+this.meta.talents.drill*2,drill:'starter',suit:'cloth',level:1,xp:0,nextXp:150,gold:0,drillTimer:0,pulseTimer:0,castTimer:0,fallTimer:0,jumpTimer:0,maxY:2,element:1,chargeMax:30+this.meta.talents.air*3,charges:[10,10,10,10],upgrades:{}};
    this.stats={blocks:0,chains:0,maxChain:0,kills:0,depth:0,gold:0,bosses:0,rooms:0,terrainKills:0,casts:0,cascades:0,reinforcements:0};
    this.particles=[];this.texts=[];this.events=[];this.falling=[];this.enemies=[];this.hazards=[];this.fluids=[];this.sources=[];this.fixtures=[];this.fx=[];this.visited=[];
    this.choice=[];this.routeOptions=[];this.pendingLevels=0;this.loot=null;this.pendingLoot=null;this.postCheckpointMode='play';this.shopStock=[];this.boss=null;this.goal=null;this.exit=null;this.entrance={x:2,y:3};this.shake=0;this.flash=0;this.pulseFx=null;this.combo=0;this.comboTimer=0;this.message='';this.messageTimer=0;this.started=false;this.settleTimer=0;this.fluidTimer=0;this.hunterSpawned=false;this.collapseFront=-10;this.collapseSlow=0;this.postUpgradeMode='play';this.loadFloor('runes');
  }
  get biome(){return BIOMES[this.stage];}
  get roomNumber(){return this.stage*3+this.room+1;}
  get depth(){return Math.min(1200,Math.max(this.stats.depth,Math.floor(((this.roomNumber-1)+(Math.max(2,this.player.maxY||this.player.y)-2)/(ROWS-5))*1200/18)));}
  get drill(){return EQUIPMENT.drills.find(x=>x.id===this.player.drill)||EQUIPMENT.drills[0];}
  get suit(){return EQUIPMENT.suits.find(x=>x.id===this.player.suit)||EQUIPMENT.suits[0];}
  get power(){return this.player.power+this.player.level*1.4+this.drill.power+(this.player.upgrades.edge||0)*5;}
  get maxHp(){return this.player.maxHp+(this.suit.hp||0);}
  get magic(){return (this.drill.magic||1)*(this.suit.magic||1)*(1+(this.player.upgrades.magic||0)*.25);}
  get castCost(){return Math.max(4,8-(this.player.upgrades.chainAir||0));}
  at(x,y){x=Math.floor(x);y=Math.floor(y);return !inside(x,y)?{c:9,hp:999}:this.grid[y][x];}
  emit(type,data={}){this.events.push({type,...data});}
  toast(text){this.message=text;this.messageTimer=3.2;}
  carve(x,y,w=1,h=1){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(inside(xx,yy))this.grid[yy][xx]=null;}
  loadFloor(forcedType){
    const rand=random(this.seed+this.roomNumber*7919);this.roomType=this.room===2&&this.stage%2===1?'boss':forcedType||'runes';
    this.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>!inside(x,y)?{c:9,hp:999}:null));
    this.falling=[];this.enemies=[];this.broods=[];this.swarmTimer=.65;this.swarmBudget=40+this.stage*4;this.hazards=[];this.fluids=[];this.sources=[];this.fixtures=[];this.fx=[];this.visited=[];this.boss=null;this.shopStock=[];this.hunterSpawned=false;this.roomTime=0;this.started=false;this.settleTimer=.18;this.fluidTimer=.4;this.collapseFront=-10;this.collapseSlow=0;
    const coarse=Array.from({length:Math.ceil(ROWS/2)},()=>Array.from({length:Math.ceil(COLS/2)},()=>Math.floor(rand()*4)));
    for(let y=5;y<ROWS-7;y++)for(let x=1;x<COLS-1;x++){
      let c=coarse[Math.floor(y/2)][Math.floor(x/2)];if(rand()<.13)c=Math.floor(rand()*4);
      if(rand()<.19)c=10;if(rand()<.035+this.stage*.004)c=11;
      this.grid[y][x]={c,hp:c===11?3:1};
    }
    // Hard seams demand a route choice, but always include softer openings.
    for(const y of [25,47]){const gap=2+Math.floor(rand()*8);for(let x=1;x<COLS-1;x++)this.grid[y][x]={c:Math.abs(x-gap)<2?Math.floor(rand()*4):11,hp:Math.abs(x-gap)<2?1:2};}
    for(let y=12;y<ROWS-10;y+=12){const x=1+Math.floor(rand()*11);this.grid[y][x]={c:y%24===0?7:5,hp:1};this.grid[y+1][cap(x+(rand()<.5?-2:2),1,COLS-2)]={c:6,hp:1};}
    const tx=2+Math.floor(rand()*9);this.grid[38][tx]={c:8,hp:1};
    if(this.roomType==='relic'){for(const y of [19,45,60]){const x=1+Math.floor(rand()*11);this.grid[y][x]={c:y===45?8:6,hp:1};this.fixtures.push({x,y,kind:'relic',done:false});}}
    if(this.roomType==='purge'){for(const [x,y]of [[3,13],[9,33],[5,56]]){this.grid[y][x]={c:4,hp:4};this.grid[y+1][x]={c:10,hp:1};this.carve(x,y+2,1,2);this.enemies.push(this.makeEnemy(x,y+3,'sentry',rand));}}
    if(this.stage===4){this.grid[33][10]={c:12,hp:1};this.grid[55][2]={c:12,hp:1};}
    this.exit={x:6,y:ROWS-2,open:this.roomType!=='boss'};this.entrance={x:6,y:2};
    if(this.roomType==='boss'){
      const hp=330+this.stage*70;this.boss={x:6,y:ROWS-4,rx:6,ry:ROWS-4,hp,maxHp:hp,timer:3.3,phase:0,flash:0,id:this.stage===5?'星喰いの核':this.stage===3?'菌糸の大司祭':'琥珀の守護者'};
      for(const [x,y,color]of [[3,ROWS-15,1],[9,ROWS-12,3]]){for(let dx=-1;dx<=1;dx++)this.grid[y][x+dx]={c:color,hp:1};this.fixtures.push({x,y,kind:'seal',done:false});}
      this.grid[ROWS-10][6]={c:4,hp:4};this.grid[ROWS-9][6]={c:10,hp:1};
    }
    this.populateEnemies();
    this.goal={type:this.roomType,progress:0,total:100,complete:false};
    const p=this.player;p.x=6;p.y=2;p.rx=6;p.ry=2;p.maxY=2;p.dir='down';p.invuln=1.2;p.drillTimer=.12;p.pulseTimer=0;p.castTimer=0;p.fallTimer=0;p.jumpTimer=0;
    this.toast(ROOM_TYPES[this.roomType].name+' / 下へ掘り抜こう');this.emit('floor');
  }
  populateEnemies(fromY=0){
    const rand=random(this.seed+this.roomNumber*104729),size=this.stage>=3?8:6;
    // Eight crowded nests cross the descent route, with intact seams between them.
    // A separate seed also lets old saves gain only the nests ahead of their explorer.
    for(let y=7;y<=56;y+=7){
      const center=5+Math.floor(rand()*3),xs=[center,center-1,center+1,center-2,center+2];
      if(y<fromY)continue;
      for(let yy=y;yy<=y+1;yy++)for(const x of xs){const t=this.at(x,yy);if(!this.isFixture(x,yy)&&!this.occupied(x,yy)&&(!t||t.c<4||t.c===10||t.c===11))this.carve(x,yy);}
      let placed=0;
      for(const yy of [y+1,y])for(const x of xs){
        if(placed>=size||this.at(x,yy)||this.occupied(x,yy)||this.isFixture(x,yy)||this.enemies.some(e=>e.x===x&&e.y===yy))continue;
        const type=placed===0?(this.stage>=2&&y%21===0?'armored':'slime'):'swarm';
        this.enemies.push(this.makeEnemy(x,yy,type,rand));placed++;
      }
    }
    this.encounterVersion=2;
  }
  makeEnemy(x,y,type,rand=this.rng){const hp=type==='moth'?12+this.stage*3:type==='swarm'?14+this.stage*4:(type==='sentry'?64:type==='armored'?52:type==='hunter'?180:28)+this.stage*8;return {x,y,rx:x,ry:y,type,kind:type==='hunter'?'void':this.biome.enemy,hp,maxHp:hp,timer:type==='moth'?.28:1+rand(),stun:0,flash:0,objective:false};}
  updateSwarms(dt){
    if(!this.started)return;
    const p=this.player,near=e=>Math.abs(e.y-p.y)<=6;
    // Revealed cracks give the player time to steer away. Recheck every cell at hatching.
    for(let i=this.broods.length-1;i>=0;i--){
      const b=this.broods[i];b.delay-=dt;if(b.delay>0)continue;
      const tile=this.at(b.x,b.y),danger=dist(b,p)<2||this.occupied(b.x,b.y);
      if(danger&&b.delay>-.7)continue;
      this.broods.splice(i,1);
      if(danger||dist(b,p)>10||b.y<this.collapseFront+1||this.isFixture(b.x,b.y)||tile&&![0,1,2,3,10,11].includes(tile.c)||this.enemies.some(e=>e.x===b.x&&e.y===b.y)||this.boss&&Math.abs(b.x-this.boss.x)<=1&&Math.abs(b.y-this.boss.y)<=1)continue;
      if(this.enemies.filter(near).length>=14)continue;
      this.carve(b.x,b.y);const e=this.makeEnemy(b.x,b.y,'moth');e.stun=.55;this.enemies.push(e);this.swarmBudget--;this.stats.reinforcements=(this.stats.reinforcements||0)+1;this.burst(b.x,b.y,'#ffc196',5);
    }
    this.swarmTimer-=dt;
    if(this.swarmTimer>0||this.swarmBudget<=this.broods.length)return;
    this.swarmTimer=1.35;
    const nearby=this.enemies.filter(near).length+this.broods.filter(near).length;
    if(nearby>=9)return;
    // Search the open shaft and its bordering stone, so reinforcements appear beside
    // the current mining route instead of being stranded in a distant side pocket.
    const queue=[{x:p.x,y:p.y}],seen=new Set([`${p.x},${p.y}`]),candidates=[];
    for(let i=0;i<queue.length;i++)for(const [dx,dy]of Object.values(DIRS)){
      const x=queue[i].x+dx,y=queue[i].y+dy,key=`${x},${y}`,d=dist({x,y},p);
      if(seen.has(key)||!inside(x,y)||d>7||y<p.y-3||y>p.y+5||y<this.collapseFront+2)continue;seen.add(key);
      if(this.occupied(x,y)||this.isFixture(x,y)||this.boss&&Math.abs(x-this.boss.x)<=2&&Math.abs(y-this.boss.y)<=2)continue;
      const tile=this.at(x,y);if(!tile)queue.push({x,y});
      if(d<3||tile&&![0,1,2,3,10,11].includes(tile.c)||this.enemies.some(e=>e.x===x&&e.y===y)||this.broods.some(b=>b.x===x&&b.y===y))continue;
      candidates.push({x,y,score:Math.abs(y-p.y-2)*2+Math.abs(d-4)+this.rng()});
    }
    candidates.sort((a,b)=>a.score-b.score);
    const count=Math.min(6,10-nearby,this.swarmBudget-this.broods.length);
    for(const b of candidates.slice(0,count))this.broods.push({x:b.x,y:b.y,delay:.6,max:.6});
  }
  component(x,y){const t=this.at(x,y);if(!t)return [];if(t.c>3)return [{x,y}];const seen=new Set([`${x},${y}`]),q=[{x,y}];for(let i=0;i<q.length;i++)for(const [dx,dy]of Object.values(DIRS)){const nx=q[i].x+dx,ny=q[i].y+dy,k=`${nx},${ny}`;if(inside(nx,ny)&&!seen.has(k)&&this.grid[ny][nx]?.c===t.c){seen.add(k);q.push({x:nx,y:ny});}}return q;}
  burst(x,y,color,n=9){for(let i=0;i<Math.min(n,30);i++){const a=this.rng()*Math.PI*2,s=.4+this.rng()*3;this.particles.push({x:x+.5,y:y+.5,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.3+this.rng()*.4,size:.04+this.rng()*.12,color});}if(this.particles.length>300)this.particles.splice(0,this.particles.length-300);}
  float(s,x,y,color='#fff'){this.texts.push({s,x:x+.5,y:y+.2,color,life:1.2});}
  heal(n){this.player.hp=cap(this.player.hp+n,0,this.maxHp);}
  charge(n,color=null){for(let i=0;i<4;i++)if(color===null||color===i)this.player.charges[i]=cap(this.player.charges[i]+n,0,this.player.chargeMax);}
  gainGold(n){n=Math.ceil(n*(1+(this.player.upgrades.pocket||0)*.35));this.player.gold+=n;this.stats.gold+=n;return n;}
  gainXP(n){this.player.xp+=n;while(this.player.xp>=this.player.nextXp){this.player.xp-=this.player.nextXp;this.player.level++;this.player.nextXp=Math.ceil(this.player.nextXp*1.32);this.pendingLevels=1;this.heal(4);}}
  damage(n,reason='遺跡の罠に倒された'){const p=this.player;if(p.invuln>0||this.mode!=='play')return;if(p.shield>0){p.shield--;p.invuln=1.1;this.float('GUARD',p.x,p.y,'#b4ffdb');this.burst(p.x,p.y,'#b3ffdf',16);this.emit('guard');return;}
    n=Math.max(1,Math.round(n*(1-this.suit.armor)*Math.pow(.88,p.upgrades.guard||0)));p.hp=Math.max(0,p.hp-n);p.invuln=1.05;this.shake=.2;this.flash=.17;this.float('−'+n,p.x,p.y,'#ff9daa');this.emit('hurt');if(p.hp<=0)this.finish(false,reason);}
  finish(win,reason){if(['dead','win'].includes(this.mode))return;this.mode=win?'win':'dead';this.reason=reason;if(win)this.stats.depth=1200;this.reward=Math.max(1,this.stats.rooms*2+this.stats.terrainKills+Math.floor(this.stats.gold/65)+(win?15:0));this.meta.cores+=this.reward;this.meta.best=Math.max(this.meta.best,this.stats.depth);this.meta.runs++;if(win)this.meta.wins++;this.emit('finish',{win});}
  clearCells(cells,{chain=true,rewards=true,source='dig'}={}){
    const removed=[],colors=[0,0,0,0],bombs=[];
    for(const {x,y}of cells){const t=this.at(x,y);if(!t||t.c===9)continue;this.grid[y][x]=null;removed.push({x,y});this.stats.blocks++;this.burst(x,y,PALETTE[t.c]||this.biome.rock,cells.length>10?3:7);if(t.c===12)bombs.push({x,y});
      if(rewards){if(t.c<4){colors[t.c]++;this.charge(2,t.c);this.gainXP(3);}else if(t.c===5){this.charge(10);this.float('全属性 +10',x,y,'#ddc9ff');this.emit('air');}else if(t.c===6){this.float('+'+this.gainGold(12+this.stage*2)+'G',x,y,'#ffd995');this.emit('gold');}else if(t.c===7){this.heal(18);this.float('+18 HP',x,y,'#ffb6c3');this.emit('heal');}else if(t.c===8){this.gainGold(12);this.gainXP(15);this.offerEquipment();}else this.gainXP(t.c===11?2:1);}
    }
    const count=colors.reduce((a,b)=>a+b,0);
    if(chain&&count>=3){this.combo=this.comboTimer>0?this.combo+1:1;this.comboTimer=2.8;this.stats.chains++;this.stats.maxChain=Math.max(this.stats.maxChain,count);this.gainXP(count*2);this.gainGold(Math.ceil(count/3));for(let i=0;i<4;i++)if(colors[i])this.charge(Math.ceil(colors[i]*.7)+(this.player.upgrades.chainAir||0),i);this.float(`${count} ${source==='landing'?'落下連鎖':'RESONANCE'}`,removed[0].x,removed[0].y,'#ffe2a3');this.shake=.09;this.emit('chain',{count});}
    for(const b of bombs)this.explode(b.x,b.y,1,70+this.stage*6,'barrel');this.settleTimer=.08;return removed.length;
  }
  occupied(x,y){return this.falling.some(f=>f.cells.some(c=>c.x===x&&c.y===y));}
  tryStep(dir){if(this.mode!=='play'||!DIRS[dir])return false;const p=this.player,[dx,dy]=DIRS[dir];p.dir=dir;this.started=true;const x=p.x+dx,y=p.y+dy;if(!inside(x,y))return false;
    const e=this.enemies.find(e=>e.x===x&&e.y===y);if(e){this.attackEnemy(e,this.power,'dig');return true;}
    if(this.boss&&Math.abs(x-this.boss.x)<=1&&Math.abs(y-this.boss.y)<=1){this.hitBoss(this.power,'dig');return true;}
    if(this.occupied(x,y))return false;const t=this.at(x,y);
    if(t){if(t.c===9)return false;if([4,11].includes(t.c)){t.hp-=1+(this.drill.hard||0)+Math.floor((p.upgrades.edge||0)/2);if(t.hp>0){this.burst(x,y,'#bdbaa5',4);this.emit('stone');return true;}}
      this.clearCells(this.component(x,y));this.emit('dig');return true;
    }
    // Up is a one-cell hop from a supported ledge; it cannot become flight.
    if(dir==='up'){if((!this.at(p.x,p.y+1)&&!this.occupied(p.x,p.y+1))||p.jumpTimer>0)return false;p.jumpTimer=.32;p.fallTimer=-.12;}
    p.x=x;p.y=y;if(dir!=='up')p.fallTimer=0;this.visit();this.emit('step');return true;
  }
  visit(){const k=`${this.player.x},${this.player.y}`;if(!this.visited.includes(k))this.visited.push(k);}
  attackEnemy(e,power,source='magic'){if(!this.enemies.includes(e))return;const terrain=['rock','barrel','lava'].includes(source);if(e.type==='armored'||e.type==='sentry')power*=source==='dig'?.45:1;if(terrain)power*=1+(this.player.upgrades.collapse||0)*.5;e.hp-=power;e.stun=Math.max(e.stun,source==='frost'?2.5:.3);e.flash=.15;this.burst(e.x,e.y,terrain?'#ffcf89':'#d6ecff',7);this.emit('hit');
    if(e.hp<=0){const reward=e.type==='moth'?.25:e.type==='swarm'?.5:1;this.enemies.splice(this.enemies.indexOf(e),1);this.stats.kills++;this.gainXP((18+this.stage*2)*reward);this.gainGold((6+this.stage)*reward);this.charge(2*reward);if(terrain){this.stats.terrainKills++;this.gainXP(12*reward);this.float('地形撃破！',e.x,e.y,'#ffda8f');this.emit('chain',{count:6});if(this.player.upgrades.bombAir){this.charge(5*this.player.upgrades.bombAir);this.heal(8*this.player.upgrades.bombAir);}}
      if(this.player.upgrades.leech)this.heal(5*this.player.upgrades.leech);this.emit('kill');}
  }
  hitBoss(power,source='magic'){if(!this.boss)return;const b=this.boss,terrain=['rock','barrel','lava'].includes(source),seals=this.fixtures.some(f=>!f.done)&&this.player.y<b.y+2;power*=terrain?(1+(this.player.upgrades.collapse||0)*.5):seals?.18:b.timer<1?1.3:.65;b.hp-=power;b.flash=.15;this.burst(b.x,b.y,terrain?'#ffc783':seals?'#9cacc2':'#efe0aa',8);this.emit('hit');if(b.hp<=0){this.burst(b.x,b.y,this.biome.tint,30);this.boss=null;this.stats.bosses++;this.gainXP(65);this.gainGold(40);this.heal(18);this.player.shield++;this.shake=.4;this.toast('守護者を撃破。封印を解いてゲートへ！');this.emit('bossDead');}}
  explode(x,y,radius=1,power=60,source='blast'){
    const cells=[];for(let yy=y-radius;yy<=y+radius;yy++)for(let xx=x-radius;xx<=x+radius;xx++)if(inside(xx,yy)&&this.at(xx,yy)?.c!==9)cells.push({x:xx,y:yy});
    this.clearCells(cells,{chain:true,source});for(const e of [...this.enemies])if(Math.abs(e.x-x)<=radius+1&&Math.abs(e.y-y)<=radius+1)this.attackEnemy(e,power,source);
    if(this.boss&&Math.abs(this.boss.x-x)<=radius+2&&Math.abs(this.boss.y-y)<=radius+2)this.hitBoss(power,source);
    if(source==='barrel'&&Math.abs(this.player.x-x)<=radius&&Math.abs(this.player.y-y)<=radius)this.damage(17,'爆薬の爆風に巻き込まれた');
    this.fx.push({kind:'blast',x:x+.5,y:y+.5,radius:radius+.8,color:PALETTE[1],life:.35,max:.35});this.burst(x,y,'#ffc487',20);this.shake=Math.max(this.shake,.14);this.emit('pulse');
  }
  cast(){const p=this.player;if(this.mode!=='play'||p.castTimer>0||p.charges[p.element]<this.castCost)return false;this.started=true;p.charges[p.element]-=this.castCost;p.castTimer=.65;this.stats.casts++;const [dx,dy]=DIRS[p.dir],element=p.element;this.emit('cast',{element});
    if(element===0){this.collapseSlow=2.5;this.heal(Math.round(18*this.magic));for(const e of [...this.enemies])if(dist(e,p)<4){e.stun=Math.max(e.stun,1.4);this.attackEnemy(e,13*this.magic,'vital');}this.fx.push({kind:'vital',x:p.x+.5,y:p.y+.5,radius:2.5,color:PALETTE[0],life:.4,max:.4});this.float('+HP',p.x,p.y,PALETTE[0]);}
    if(element===1)this.explode(cap(p.x+dx*3,1,COLS-2),cap(p.y+dy*3,1,ROWS-2),1,(48+(p.upgrades.edge||0)*3)*this.magic,'blast');
    if(element===2){const cells=[],hit=new Set();let bossHit=false;for(let i=1;i<=6;i++){const x=p.x+dx*i,y=p.y+dy*i;if(!inside(x,y)||this.at(x,y)?.c===9)break;if(this.at(x,y))cells.push(...this.component(x,y));for(const e of [...this.enemies])if(Math.abs(e.x-x)+Math.abs(e.y-y)<=1&&!hit.has(e)){hit.add(e);e.stun=2.5;this.attackEnemy(e,28*this.magic,'frost');}if(this.boss&&!bossHit&&Math.abs(this.boss.x-x)<=1&&Math.abs(this.boss.y-y)<=1){bossHit=true;this.hitBoss(28*this.magic,'frost');}for(const f of this.falling)if(f.cells.some(c=>c.x===x&&Math.abs(c.y-y)<2))f.delay=Math.max(f.delay,2.5);}
      this.clearCells(cells);this.fx.push({kind:'beam',x:p.x+.5,y:p.y+.5,x2:p.x+dx*6+.5,y2:p.y+dy*6+.5,color:PALETTE[2],life:.3,max:.3});}
    if(element===3){const foes=this.enemies.filter(e=>dist(e,p)<8).sort((a,b)=>dist(a,p)-dist(b,p)).slice(0,4);for(const e of foes){this.fx.push({kind:'beam',x:p.x+.5,y:p.y+.5,x2:e.x+.5,y2:e.y+.5,color:PALETTE[3],life:.3,max:.3});this.attackEnemy(e,38*this.magic,'arc');}if(this.boss&&dist(this.boss,p)<9)this.hitBoss(45*this.magic,'arc');const veins=[];for(let y=p.y-3;y<=p.y+3;y++)for(let x=p.x-3;x<=p.x+3;x++)if(inside(x,y)&&this.at(x,y)?.c===3)veins.push(...this.component(x,y));this.clearCells(veins);this.fx.push({kind:'vital',x:p.x+.5,y:p.y+.5,radius:3,color:PALETTE[3],life:.3,max:.3});}
    return true;
  }
  resonate(){const p=this.player;if(this.mode!=='play'||p.pulseTimer>0)return false;if(p.charges[p.element]>=this.castCost){p.castTimer=0;if(!this.cast())return false;p.pulseTimer=6*Math.pow(.82,p.upgrades.pulse||0);return true;}return this.pulse();}
  pulse(){if(this.mode!=='play'||this.player.pulseTimer>0)return false;const p=this.player;p.pulseTimer=8*Math.pow(.82,p.upgrades.pulse||0);this.started=true;p.invuln=Math.max(p.invuln,.65);const cells=[];for(let y=p.y-1;y<=p.y+1;y++)for(let x=p.x-1;x<=p.x+1;x++)if(inside(x,y)&&this.at(x,y)?.c!==9)cells.push({x,y});this.clearCells(cells);for(const e of [...this.enemies])if(dist(e,p)<=4)this.attackEnemy(e,30+(p.upgrades.pulse||0)*12,'pulse');if(this.boss&&dist(this.boss,p)<5)this.hitBoss(35+(p.upgrades.pulse||0)*12,'pulse');this.hazards=this.hazards.filter(h=>dist(h,p)>2);this.pulseFx={x:p.x+.5,y:p.y+.5,life:.4};this.shake=.18;this.emit('pulse');return true;}
  potion(){if(this.mode!=='play'||this.player.potions<=0||this.player.hp>=this.maxHp)return false;this.player.potions--;this.heal(45);this.float('+45 HP',this.player.x,this.player.y,'#ffb7c7');this.emit('heal');return true;}
  fallGroup(x,y){const t=this.at(x,y);if(!t)return [];if(t.c<4)return this.component(x,y);if(t.c!==10)return [{x,y}];
    const q=[{x,y}],seen=new Set([`${x},${y}`]);for(let i=0;i<q.length;i++)for(const [dx,dy]of Object.values(DIRS)){const xx=q[i].x+dx,yy=q[i].y+dy,key=`${xx},${yy}`;if(inside(xx,yy)&&!seen.has(key)&&this.at(xx,yy)?.c===10){seen.add(key);q.push({x:xx,y:yy});}}return q;
  }
  scanFalls(){const visited=new Set(),groups=[],top=Math.max(1,this.player.y-18),bottom=Math.min(ROWS-2,this.player.y+7);
    for(let y=bottom;y>=top;y--)for(let x=1;x<COLS-1;x++){const t=this.grid[y][x],key=`${x},${y}`;if(!t||!([0,1,2,3,4,10,11].includes(t.c))||visited.has(key))continue;const group=this.fallGroup(x,y),members=new Set(group.map(c=>`${c.x},${c.y}`));for(const c of group)visited.add(`${c.x},${c.y}`);
      const supported=group.some(c=>c.y>=ROWS-2||!members.has(`${c.x},${c.y+1}`)&&(this.at(c.x,c.y+1)||this.occupied(c.x,c.y+1)));
      if(!supported&&group.length<90)groups.push(group);
    }
    for(const group of groups){const cells=group.map(c=>({...c,t:this.grid[c.y][c.x]})).filter(c=>c.t);for(const c of cells)this.grid[c.y][c.x]=null;if(cells.length)this.falling.push({cells,delay:.6,timer:0,offset:0,moved:0});}
  }
  updateFalls(dt){
    for(let i=this.falling.length-1;i>=0;i--){const f=this.falling[i];f.delay-=dt;if(f.delay>0)continue;f.timer+=dt;f.offset=Math.min(1,f.timer/.12);if(f.timer<.12)continue;f.timer=0;f.offset=0;
      const members=new Set(f.cells.map(c=>`${c.x},${c.y}`));const stopped=f.cells.some(c=>!members.has(`${c.x},${c.y+1}`)&&(!inside(c.x,c.y+1)||this.at(c.x,c.y+1)||this.falling.some((o,j)=>j!==i&&o.cells.some(k=>k.x===c.x&&k.y===c.y+1))));
      if(stopped){const landed=[];for(const c of f.cells){if(!inside(c.x,c.y)||this.at(c.x,c.y)||c.x===this.exit.x&&c.y===this.exit.y)continue;if(c.x===this.player.x&&c.y===this.player.y){this.damage(26+this.stage*2,'崩れた鉱脈に押し潰された');continue;}this.grid[c.y][c.x]=c.t;landed.push(c);}this.falling.splice(i,1);
        if(f.moved){this.emit('land');this.shake=Math.max(this.shake,.06);const checked=new Set();for(const c of landed){if(c.t.c>3||checked.has(`${c.x},${c.y}`))continue;const match=this.component(c.x,c.y);for(const m of match)checked.add(`${m.x},${m.y}`);if(match.length>=4){this.stats.cascades++;this.clearCells(match,{source:'landing'});}}}continue;
      }
      for(const c of f.cells)c.y++;f.moved++;
      for(const e of [...this.enemies])if(f.cells.some(c=>c.x===e.x&&c.y===e.y))this.attackEnemy(e,100,'rock');
      if(this.boss&&f.cells.some(c=>Math.abs(c.x-this.boss.x)<=1&&Math.abs(c.y-this.boss.y)<=1)){this.hitBoss(f.cells.some(c=>c.t.c===4)?180:65,'rock');f.cells=f.cells.filter(c=>!this.boss||Math.abs(c.x-this.boss.x)>1||Math.abs(c.y-this.boss.y)>1);}
      if(f.cells.some(c=>c.x===this.player.x&&c.y===this.player.y)){this.damage(26+this.stage*2,'崩れた鉱脈に押し潰された');f.cells=f.cells.filter(c=>c.x!==this.player.x||c.y!==this.player.y);}
      if(!f.cells.length)this.falling.splice(i,1);
    }
  }
  isFixture(x,y){return this.fixtures.some(f=>f.x===x&&f.y===y)||this.exit.x===x&&this.exit.y===y;}
  updateFluids(dt){for(const f of this.fluids)f.age+=dt;this.fluidTimer-=dt;if(this.fluidTimer<=0){this.fluidTimer=.42;for(const source of this.sources){if(source.budget<=0)continue;const same=this.fluids.filter(f=>f.kind===source.kind),candidates=[];for(const f of same)for(const [dx,dy]of Object.values(DIRS)){const x=f.x+dx,y=f.y+dy;if(inside(x,y)&&!this.at(x,y)&&!this.isFixture(x,y)&&!this.fluids.some(k=>k.x===x&&k.y===y))candidates.push({x,y});}if(candidates.length){const q=candidates[Math.floor(this.rng()*candidates.length)];this.fluids.push({...q,kind:source.kind,age:0});source.budget--;}}}
    for(const f of this.fluids){if(f.kind==='lava'&&f.age>.7){f.damageTimer=(f.damageTimer||0)-dt;if(f.damageTimer<=0){f.damageTimer=.5;for(const e of [...this.enemies])if(e.x===f.x&&e.y===f.y)this.attackEnemy(e,18,'lava');if(this.player.x===f.x&&this.player.y===f.y)this.damage(14,'溶岩に飲まれた');if(this.boss&&Math.abs(this.boss.x-f.x)<=1&&Math.abs(this.boss.y-f.y)<=1)this.hitBoss(6,'lava');}}if(f.kind==='water')for(const e of this.enemies)if(e.x===f.x&&e.y===f.y)e.timer+=dt*.6;}
  }
  spawnHunter(){if(this.hunterSpawned)return;this.hunterSpawned=true;const relic=this.fixtures.find(f=>f.kind==='relic');const x=relic?relic.x:this.entrance.x,y=relic?relic.y:this.entrance.y;this.carve(x,y);this.enemies.push(this.makeEnemy(x,y,'hunter'));this.toast('追跡者が目覚めた！ 遺物を持ってゲートへ');this.emit('bossAttack');}
  checkObjective(){const p=this.player;for(const f of this.fixtures)if(!f.done&&!this.at(f.x,f.y)&&!this.occupied(f.x,f.y)){f.done=true;this.charge(3);this.gainGold(f.kind==='seal'?15:12);this.gainXP(12);this.burst(f.x,f.y,'#f5d49d',12);this.float(f.kind==='seal'?'支柱破壊！':'遺物回収',f.x,f.y,'#ffe0a0');if(f.kind==='seal'&&this.boss)this.hitBoss(this.boss.maxHp*.36,'rock');this.emit('upgrade');}
    p.maxY=Math.max(p.maxY||2,p.y);this.stats.depth=Math.max(this.stats.depth,this.depth);this.goal.progress=Math.min(this.boss?99:100,Math.floor((p.maxY-2)/(ROWS-5)*100));this.goal.complete=this.goal.progress>=100&&!this.boss;this.exit.open=!this.boss;
    if(p.y>=ROWS-3&&Math.abs(p.x-this.exit.x)<=1&&this.exit.open)this.completeRoom();
  }
  completeRoom(){if(this.mode!=='play')return;this.stats.rooms++;this.stats.depth=Math.round(this.stats.rooms*1200/18);this.heal(5);this.charge(3);this.gainGold(12);this.gainXP(20);
    if(this.room===2){if(this.stage===5)this.finish(true,'星の記憶を解放した');else this.beginCamp();}
    else{const pool=Object.keys(ROOM_TYPES).filter(k=>k!=='boss'&&k!==this.roomType);this.routeOptions=[];if(this.room===1&&this.stage%2===1)this.routeOptions=['boss'];else for(let i=0;i<2;i++)this.routeOptions.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);this.mode='route';this.emit('camp');}if(['route','camp'].includes(this.mode))this.queueCheckpoint(this.mode);}
  queueCheckpoint(nextMode){this.postCheckpointMode=nextMode;if(this.pendingLoot){this.loot=this.pendingLoot;this.pendingLoot=null;this.mode='loot';this.emit('loot');}else if(this.pendingLevels>0){this.pendingLevels=0;this.postUpgradeMode=nextMode;this.offerLevel();}}
  chooseRoute(id){if(this.mode!=='route'||!this.routeOptions.includes(id))return false;this.room++;this.mode='play';this.loadFloor(id);return true;}
  offerLevel(){const pool=[...UPGRADES];this.choice=[];for(let i=0;i<3;i++)this.choice.push(pool.splice(Math.floor(this.rng()*pool.length),1)[0]);this.mode='level';this.emit('level');}
  chooseUpgrade(id){if(this.mode!=='level'||!this.choice.some(u=>u.id===id))return false;const p=this.player;p.upgrades[id]=(p.upgrades[id]||0)+1;if(id==='tank'){p.chargeMax+=10;this.charge(8);}if(id==='heart'){p.maxHp+=20;this.heal(25);}if(id==='shield')p.shield+=2;if(id==='heal'){p.potions+=2;this.heal(15);}if(id==='pocket')this.gainGold(20);this.mode=this.postUpgradeMode||'play';this.postUpgradeMode='play';p.invuln=Math.max(.6,p.invuln);this.toast(UPGRADES.find(u=>u.id===id).name+' を獲得');this.emit('upgrade');return true;}
  offerEquipment(){if(this.mode!=='play')return;const slot=this.rng()<.6?'drills':'suits',arr=EQUIPMENT[slot],max=Math.min(arr.length-1,2+Math.floor(this.stage/2));let i=1+Math.floor(this.rng()*max);if(arr[i].id===(slot==='drills'?this.player.drill:this.player.suit))i=i%max+1;if(this.pendingLoot){this.gainGold(20);return;}this.pendingLoot={slot,item:arr[i]};this.float('装備を確保',this.player.x,this.player.y,'#e5ca93');this.toast('装備を確保。地層の出口で比較できます');}
  takeEquipment(take){if(this.mode!=='loot')return false;if(take)this.player[this.loot.slot==='drills'?'drill':'suit']=this.loot.item.id;else this.gainGold(20);this.loot=null;this.mode=this.postCheckpointMode||'play';if(this.pendingLevels>0){this.pendingLevels=0;this.postUpgradeMode=this.mode;this.offerLevel();}this.player.hp=cap(this.player.hp,0,this.maxHp);this.player.invuln=Math.max(.7,this.player.invuln);return true;}
  beginCamp(){this.mode='camp';this.shopStock=[{id:'heal',name:'焚き火の治療',desc:'HPを60回復',cost:24,bought:false},{id:'charge',name:'四色の結晶瓶',desc:'全属性の結晶を最大まで補充',cost:20,bought:false},{id:'shield',name:'護りの結晶',desc:'シールドを2枚獲得',cost:30,bought:false},{id:'potion',name:'救難ポーション',desc:'HP45回復の薬を1本',cost:18,bought:false}];const item=EQUIPMENT.drills[Math.min(4,2+Math.floor(this.stage/2))];this.shopStock.push({id:'drill',name:item.name,desc:item.desc,cost:48+this.stage*12,bought:false,item});this.heal(20);this.charge(6);this.emit('camp');}
  buy(id){if(this.mode!=='camp')return false;const it=this.shopStock.find(i=>i.id===id);if(!it||it.bought||this.player.gold<it.cost)return false;this.player.gold-=it.cost;it.bought=true;if(id==='heal')this.heal(60);if(id==='charge')this.charge(this.player.chargeMax);if(id==='shield')this.player.shield+=2;if(id==='potion')this.player.potions++;if(id==='drill')this.player.drill=it.item.id;this.emit('buy');return true;}
  nextFloor(){if(this.mode!=='camp'||this.stage>=5)return false;this.stage++;this.room=0;this.mode='play';this.loadFloor('runes');return true;}
  enemyStep(e){const p=this.player;if(e.type==='sentry'){if(dist(e,p)<=8){this.hazards.push({x:p.x,y:p.y,delay:.95,radius:0,damage:15+this.stage*2,kind:'bolt',hit:false});}e.timer=2.4;return;}
    if(!['swarm','moth'].includes(e.type)&&['spore','ember'].includes(e.kind)&&dist(e,p)<8){this.hazards.push({x:p.x,y:p.y,delay:.9,radius:e.kind==='ember'?1:0,damage:15+this.stage*2,kind:e.kind,hit:false});e.timer=2.1;return;}
    const dirs=Object.values(DIRS).map(([dx,dy])=>({x:e.x+dx,y:e.y+dy})).filter(q=>inside(q.x,q.y)&&!this.occupied(q.x,q.y)&&!this.enemies.some(o=>o!==e&&o.x===q.x&&o.y===q.y)&&!(this.boss&&Math.abs(q.x-this.boss.x)<=1&&Math.abs(q.y-this.boss.y)<=1)).sort((a,b)=>dist(a,p)-dist(b,p));const target=dirs.find(q=>!this.at(q.x,q.y));
    if(target&&dist(target,p)<dist(e,p)){e.x=target.x;e.y=target.y;}else if(e.type==='hunter'&&dirs[0]&&this.at(dirs[0].x,dirs[0].y)?.c!==9)this.clearCells([dirs[0]],{chain:false,rewards:false});
    e.timer=e.type==='moth'?Math.max(.2,.28-this.stage*.012):e.type==='hunter'?.42:Math.max(.52,1.1-this.stage*.07);
  }
  step(dt,input={}){
    dt=cap(dt,0,.04);this.time+=dt;for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.98;p.vy*=.98;}this.particles=this.particles.filter(p=>p.life>0);for(const f of this.texts){f.life-=dt;f.y-=dt*.55;}this.texts=this.texts.filter(f=>f.life>0);for(const f of this.fx)f.life-=dt;this.fx=this.fx.filter(f=>f.life>0);this.shake=Math.max(0,this.shake-dt);this.flash=Math.max(0,this.flash-dt);if(this.pulseFx){this.pulseFx.life-=dt;if(this.pulseFx.life<=0)this.pulseFx=null;}
    if(this.mode!=='play')return;const p=this.player;this.ticks++;if(this.started)this.roomTime+=dt;this.messageTimer=Math.max(0,this.messageTimer-dt);this.comboTimer=Math.max(0,this.comboTimer-dt);for(const k of ['invuln','drillTimer','pulseTimer','castTimer','jumpTimer'])p[k]=Math.max(0,p[k]-dt);
    if(Number.isInteger(input.element)&&input.element>=0&&input.element<4)p.element=input.element;if(input.dir&&DIRS[input.dir])p.dir=input.dir;
    if(input.heal)this.potion();if(input.pulse||input.cast)this.resonate();if((input.dir||input.rush)&&p.drillTimer<=0){this.tryStep(input.dir||p.dir);p.drillTimer=(input.rush?.105:.17)*this.drill.speed*Math.pow(.88,p.upgrades.quick||0);}
    if(!this.at(p.x,p.y+1)&&!this.occupied(p.x,p.y+1)&&p.y<ROWS-2){p.fallTimer+=dt;if(p.fallTimer>.14){p.y++;p.fallTimer=0;}}else p.fallTimer=0;
    if(this.started){this.collapseSlow=Math.max(0,this.collapseSlow-dt);const gap=p.y-this.collapseFront,speed=(this.roomType==='escape'?1.05:.65)+Math.max(0,gap-19)*.65;this.collapseFront+=speed*dt*(this.collapseSlow>0?.2:1);if(this.collapseFront>=p.y-.5)this.damage(12,'迫る崩落に飲み込まれた');}
    p.rx+=(p.x-p.rx)*Math.min(1,dt*20);p.ry+=(p.y-p.ry)*Math.min(1,dt*20);if(this.mode!=='play')return;
    this.settleTimer-=dt;if(this.settleTimer<=0){this.scanFalls();this.settleTimer=.15;}this.updateFalls(dt);this.updateFluids(dt);if(this.mode!=='play')return;

    this.updateSwarms(dt);
    for(const h of this.hazards){h.delay-=dt;if(h.delay<=0&&!h.hit){h.hit=true;if(dist(h,p)<=h.radius)this.damage(h.damage,h.kind==='spore'?'毒胞子に倒された':'遺跡の術式に倒された');this.burst(h.x,h.y,h.kind==='spore'?'#bef7a6':'#ffba88',8);}}this.hazards=this.hazards.filter(h=>h.delay>-.3);
    for(const e of [...this.enemies]){if(e.y>p.y+8)continue;e.fallTimer=(e.fallTimer||0)+dt;const below=e.y+1,blocked=this.at(e.x,below)||this.occupied(e.x,below)||this.enemies.some(o=>o!==e&&o.x===e.x&&o.y===below)||this.boss&&Math.abs(e.x-this.boss.x)<=1&&Math.abs(below-this.boss.y)<=1;if(e.kind!=='jelly'&&e.type!=='moth'&&!blocked&&e.y<ROWS-2&&e.fallTimer>.2){e.y++;e.fallTimer=0;}else if(blocked)e.fallTimer=0;e.timer-=dt;e.stun=Math.max(0,e.stun-dt);e.flash=Math.max(0,e.flash-dt);e.rx+=(e.x-e.rx)*Math.min(1,dt*12);e.ry+=(e.y-e.ry)*Math.min(1,dt*12);if(e.timer<=0&&e.stun<=0&&this.started&&dist(e,p)<13)this.enemyStep(e);if(dist(e,p)<=1&&e.stun<=0)this.damage(e.type==='hunter'?22:e.type==='moth'?5+this.stage:e.type==='swarm'?6+this.stage:11+this.stage*2,'遺跡の魔物に倒された');}
    if(this.boss){const b=this.boss;b.flash=Math.max(0,b.flash-dt);if(this.started&&dist(b,p)<16){b.timer-=dt;if(b.timer<=0){b.phase++;b.timer=b.hp<b.maxHp*.5?2.4:3.3;for(let i=-1;i<=1;i++)if(inside(p.x+i,p.y))this.hazards.push({x:p.x+i,y:p.y,delay:.85,radius:0,damage:24+this.stage*2,kind:'bolt',hit:false});if(b.phase%3===0){for(const x of [b.x-3,b.x+3]){const y=b.y+2;if(this.enemies.filter(e=>dist(e,b)<8).length>=6)break;if(this.occupied(x,y)||this.enemies.some(e=>e.x===x&&e.y===y)||dist({x,y},p)<2)continue;this.carve(x,y);this.enemies.push(this.makeEnemy(x,y,'swarm'));}}this.emit('bossAttack');}if(Math.abs(p.x-b.x)<=1&&Math.abs(p.y-b.y)<=1)this.damage(24,'守護者に倒された');}}
    if(this.mode!=='play')return;this.checkObjective();if(this.mode==='play'&&this.ticks%180===0)this.emit('save');
  }
  serialize(){const state={};for(const k of ['seed','stage','room','roomType','time','roomTime','ticks','player','stats','grid','falling','enemies','broods','swarmTimer','swarmBudget','hazards','fluids','sources','fixtures','goal','exit','entrance','boss','pendingLevels','choice','loot','pendingLoot','postCheckpointMode','shopStock','routeOptions','started','hunterSpawned','visited','collapseFront','collapseSlow','postUpgradeMode','encounterVersion','mode'])state[k]=this[k];state.rngState=this.rng.state();if(state.mode==='pause')state.mode='play';return {version:3,state};}
  static restore(data,meta){const s=data?.state;if(data?.version===2&&s){if(!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Number.isInteger(s.room)||s.room<0||s.room>2||!s.player||!Number.isFinite(s.player.hp)||s.player.hp<=0||!Array.isArray(s.player.charges)||s.player.charges.length!==4)throw Error('Invalid legacy save');const g=new Game(s.seed,meta);g.stage=s.stage;g.room=s.room;g.player={...g.player,...structuredClone(s.player),fallTimer:0,jumpTimer:0,maxY:2};g.stats={...g.stats,...s.stats};g.pendingLevels=Math.min(1,s.pendingLevels||0);const legacyLoot=s.pendingLoot||s.loot;if(legacyLoot&&['drills','suits'].includes(legacyLoot.slot)&&EQUIPMENT[legacyLoot.slot].some(i=>i.id===legacyLoot.item?.id))g.pendingLoot=structuredClone(legacyLoot);g.loadFloor(ROOM_TYPES[s.roomType]?s.roomType:'runes');g.toast('探索記録を引き継いで地層の入口から再開');return g;}
    if(data?.version!==3||!s)throw Error('Invalid save');if(!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Number.isInteger(s.room)||s.room<0||s.room>2||!ROOM_TYPES[s.roomType])throw Error('Invalid room');if(!Array.isArray(s.grid)||s.grid.length!==ROWS||s.grid.some(r=>!Array.isArray(r)||r.length!==COLS||r.some(t=>t!==null&&(!t||!Number.isInteger(t.c)||t.c<0||t.c>12))))throw Error('Invalid map');const p=s.player;if(!p||!Number.isInteger(p.element)||p.element<0||p.element>3||!Number.isFinite(p.chargeMax)||p.chargeMax<=0||!Number.isInteger(p.x)||!Number.isInteger(p.y)||!inside(p.x,p.y)||!Number.isFinite(p.hp)||p.hp<=0||!Array.isArray(p.charges)||p.charges.length!==4||p.charges.some(n=>!Number.isFinite(n)||n<0))throw Error('Invalid player');if(!['play','level','loot','camp','route'].includes(s.mode)||!s.goal||!s.exit||!Array.isArray(s.fixtures)||!Array.isArray(s.hazards)||!Array.isArray(s.fluids))throw Error('Invalid state');
    const g=new Game(s.seed,meta);for(const [k,v]of Object.entries(s))if(Object.hasOwn(g,k))g[k]=v;g.rng.restore(s.rngState);if(s.encounterVersion!==2){g.broods=[];g.swarmTimer=.5;g.swarmBudget=40+g.stage*4;g.encounterVersion=2;if(s.mode==='play'){g.grid=structuredClone(g.grid);g.enemies=structuredClone(g.enemies);g.populateEnemies(Math.max(p.y,p.maxY||p.y)+5);}}g.events=[];g.particles=[];g.texts=[];g.fx=[];g.player.rx=p.x;g.player.ry=p.y;g.player.invuln=1.5;return g;}
}
