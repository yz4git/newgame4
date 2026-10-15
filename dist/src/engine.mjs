export const VERSION = '1.0.0';
export const COLS = 11;
export const ROWS = 82;
export const PALETTE = ['#43d9c5', '#f8bd59', '#b58bfa', '#f27d91'];
export const BIOMES = [
  {name:'翠晶の洞窟', sub:'VERDANT HOLLOW', tint:'#43d9c5', bg:'#0b1e25', enemy:'moss', oxygen:1, hazard:'苔むす晶洞。色の連鎖を覚えよう。'},
  {name:'琥珀の埋葬都市', sub:'AMBER NECROPOLIS', tint:'#f8bd59', bg:'#241a1b', enemy:'scarab', oxygen:1.05, hazard:'硬岩が増える。最下層に守護者が眠る。'},
  {name:'深海の青い鉱脈', sub:'DROWNED VEIN', tint:'#62bffa', bg:'#0b1b32', enemy:'jelly', oxygen:1.18, hazard:'酸素消費が増加。青い補給槽を優先しよう。'},
  {name:'紫紺の菌糸庭園', sub:'MYCELIUM GARDEN', tint:'#bf8bfa', bg:'#21152e', enemy:'spore', oxygen:1.08, hazard:'毒胞子に注意。パルスは周囲の敵も払う。'},
  {name:'熔けた機械の心臓', sub:'MOLTEN ENGINE', tint:'#ff8b63', bg:'#2a151d', enemy:'ember', oxygen:1.12, hazard:'灼熱の岩盤。装甲と回復を整えよう。'},
  {name:'星の眠る最深部', sub:'THE ASTRAL CORE', tint:'#a3b7ff', bg:'#15182f', enemy:'void', oxygen:1.1, hazard:'地下1,200m。深層の核を打ち砕け。'},
];
export const EQUIPMENT = {
  drills:[
    {id:'starter',name:'探掘ドリル',desc:'標準の掘削機',power:0,speed:1},
    {id:'iron',name:'アイアンビット',desc:'攻撃力 +4 / 硬岩の掘削 +1',power:4,speed:1,hard:1},
    {id:'twin',name:'ツインスパイラル',desc:'掘削間隔 −20% / 攻撃力 +2',power:2,speed:.8},
    {id:'prism',name:'プリズムランス',desc:'攻撃力 +8 / 連鎖で酸素回復',power:8,speed:.94,air:1},
    {id:'star',name:'星穿ち',desc:'攻撃力 +14 / 硬岩の掘削 +2',power:14,speed:.85,hard:2},
  ],
  suits:[
    {id:'cloth',name:'探掘スーツ',desc:'標準の探査服',armor:0},
    {id:'guard',name:'落盤ガード',desc:'被ダメージ −22%',armor:.22},
    {id:'lung',name:'循環スーツ',desc:'酸素消費 −25%',armor:.08,air:.75},
    {id:'aegis',name:'深層イージス',desc:'被ダメージ −38% / 最大HP +20',armor:.38,hp:20},
  ],
};
export const UPGRADES = [
  {id:'edge',name:'螺旋研磨',kind:'DRILL',icon:'✦',desc:'攻撃力 +5。敵も硬岩も、力で貫く。'},
  {id:'quick',name:'高速ベアリング',kind:'DRILL',icon:'»',desc:'掘削間隔 −12%。連鎖のテンポが加速する。'},
  {id:'tank',name:'拡張エアタンク',kind:'OXYGEN',icon:'◉',desc:'最大酸素 +25。酸素も25回復。'},
  {id:'heart',name:'強化外殻',kind:'SURVIVAL',icon:'♥',desc:'最大HP +20。HPも25回復。'},
  {id:'chainAir',name:'呼吸する結晶',kind:'SYNERGY',icon:'♧',desc:'5個以上の連鎖で酸素を回復。大連鎖ほど効果増。'},
  {id:'leech',name:'生命の鉱脈',kind:'SYNERGY',icon:'♡',desc:'敵を倒すたびHPを5回復する。'},
  {id:'pulse',name:'共鳴増幅器',kind:'SKILL',icon:'◎',desc:'パルスの威力 +12、再使用時間 −18%。'},
  {id:'shield',name:'落盤のお守り',kind:'SURVIVAL',icon:'◇',desc:'ダメージを無効化するシールドを2枚獲得。'},
  {id:'pocket',name:'鉱石マグネット',kind:'WEALTH',icon:'◆',desc:'獲得ゴールド +35%。その場で20G獲得。'},
  {id:'heal',name:'救難カプセル',kind:'SUPPLY',icon:'✚',desc:'回復薬を2本獲得。HPも15回復。'},
  {id:'bombAir',name:'気圧リサイクル',kind:'SKILL',icon:'↟',desc:'パルス使用時に酸素を12回復。'},
  {id:'guard',name:'衝撃吸収材',kind:'SURVIVAL',icon:'⬡',desc:'被ダメージをさらに12%軽減する。'},
];
const DIRS = {left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
export function random(seed) { let s=seed>>>0; return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}; }
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
function freshMeta(){return {cores:0,best:0,runs:0,wins:0,talents:{hull:0,air:0,drill:0}};}
export function normalizeMeta(raw) {const d=freshMeta();if(!raw||typeof raw!=='object')return d;for(const k of ['cores','best','runs','wins'])d[k]=cap(Math.floor(Number(raw[k])||0),0,1e8);for(const k of ['hull','air','drill'])d.talents[k]=cap(Math.floor(Number(raw.talents?.[k])||0),0,5);return d;}
export function talentCost(level){return 5+level*5;}

export class Game {
  constructor(seed=Date.now(),meta=null){
    this.seed=seed>>>0;this.rng=random(this.seed);this.meta=normalizeMeta(meta);this.stage=0;this.mode='play';this.time=0;this.ticks=0;
    this.player={x:5,y:2,rx:5,ry:2,dir:'down',hp:100+this.meta.talents.hull*8,air:100+this.meta.talents.air*10,maxHp:100+this.meta.talents.hull*8,maxAir:100+this.meta.talents.air*10,invuln:1,shield:1,potions:2,power:10+this.meta.talents.drill*2,drill:'starter',suit:'cloth',level:1,xp:0,nextXp:90,gold:0,drillTimer:0,pulseTimer:0,fallTimer:0,upgrades:{}};
    this.stats={blocks:0,chains:0,maxChain:0,kills:0,depth:0,gold:0,bosses:0};this.particles=[];this.texts=[];this.events=[];this.falling=[];this.enemies=[];this.drops=[];this.hazards=[];
    this.choice=[];this.loot=null;this.pendingLevels=0;this.shake=0;this.flash=0;this.combo=0;this.comboTimer=0;this.message='';this.messageTimer=0;this.help=true;this.started=false;this.boss=null;this.shopStock=[];this.floorSettled=false;this.settleTimer=0;this.loadFloor();
  }
  get biome(){return BIOMES[this.stage];}
  get depth(){return Math.min(1200,this.stage*200+Math.min(200,Math.floor(Math.max(0,this.player.y-2)/(ROWS-5)*200)));}
  get power(){return this.player.power+this.player.level*1.5+this.drill.power+(this.player.upgrades.edge||0)*5;}
  get drill(){return EQUIPMENT.drills.find(x=>x.id===this.player.drill)||EQUIPMENT.drills[0];}
  get suit(){return EQUIPMENT.suits.find(x=>x.id===this.player.suit)||EQUIPMENT.suits[0];}
  get maxHp(){return this.player.maxHp+(this.suit.hp||0);}
  get airRate(){return (4.4+this.stage*.14)*this.biome.oxygen*(this.suit.air||1);}
  at(x,y){return x<0||x>=COLS||y<0||y>=ROWS?{c:9,hp:999}:this.grid[y][x];}
  emit(type,data={}){this.events.push({type,...data});}
  toast(s){this.message=s;this.messageTimer=3;}
  loadFloor(){
    const rand=random(this.seed+this.stage*7919+17);this.grid=Array.from({length:ROWS},()=>Array(COLS).fill(null));this.falling=[];this.enemies=[];this.drops=[];this.hazards=[];this.floorSettled=false;this.settleTimer=.1;this.boss=null;this.shopStock=[];
    // Paired cells form readable irregular seams, rather than independent confetti.
    const coarse=Array.from({length:Math.ceil(ROWS/2)},()=>Array.from({length:6},()=>Math.floor(rand()*4)));
    for(let y=5;y<ROWS-7;y++)for(let x=0;x<COLS;x++){
      let c=coarse[Math.floor(y/2)][Math.floor(x/2)];if(rand()<.16)c=Math.floor(rand()*4);
      if(y>10&&rand()<.038+this.stage*.005)c=4;
      this.grid[y][x]={c,hp:c===4?3:1};
    }
    // Every six rows has oxygen; side veins reward a deliberate detour.
    const supplies=[];for(let y=9;y<ROWS-9;y+=6){let x=1+Math.floor(rand()*9);supplies.push({x,y});if(rand()<.4)this.grid[y+1][cap(x+(rand()<.5?-2:2),0,10)]={c:6,hp:1};}
    for(let y=12;y<ROWS-11;y+=13){let x=1+Math.floor(rand()*9);this.grid[y][x]={c:7,hp:1};}
    // Sheltered chambers hold enemies and a predictable mid-floor treasure.
    for(let y=18;y<ROWS-12;y+=17){
      let x=1+Math.floor(rand()*7);for(let dy=0;dy<2;dy++)for(let dx=0;dx<3;dx++)this.grid[y+dy][x+dx]=null;
      this.enemies.push(this.makeEnemy(x+1,y+1,this.stage>2&&rand()<.3?'armored':'slime',rand));
    }
    for(const {x,y}of supplies)this.grid[y][x]={c:5,hp:1};
    let tx=2+Math.floor(rand()*7);this.grid[41][tx]={c:8,hp:1};this.grid[42][tx]={c:5,hp:1};
    // The bedrock at the bottom cannot fall; its door is always reachable.
    this.grid[ROWS-1]=Array.from({length:COLS},()=>({c:9,hp:999}));
    this.exit={x:5,y:ROWS-2,open:this.stage%2===0};
    if(this.stage%2===1){this.boss={x:5,y:ROWS-4,rx:5,ry:ROWS-4,hp:360+this.stage*140,maxHp:360+this.stage*140,timer:3.2,phase:0,stun:0,flash:0,id:this.stage===5?'星喰いの核':this.stage===3?'胞子の巨兵':'琥珀の守護者'};}
    this.player.x=5;this.player.y=2;this.player.rx=5;this.player.ry=2;this.player.invuln=1.2;this.player.fallTimer=0;this.player.dir='down';this.player.drillTimer=.15;
    this.player.air=cap(this.player.air+22,0,this.player.maxAir);this.player.pulseTimer=0;
    this.toast(this.biome.name);this.emit('floor');
  }
  makeEnemy(x,y,type,rand=this.rng){const hp=(type==='armored'?35:21)+this.stage*8;return {x,y,rx:x,ry:y,type,kind:this.biome.enemy,hp,maxHp:hp,timer:1+rand(),stun:0,flash:0,fallTimer:0};}
  component(x,y){
    const t=this.at(x,y);if(!t)return [];const c=t.c;if(c>3)return [{x,y}];
    const seen=new Set([`${x},${y}`]),q=[{x,y}];for(let i=0;i<q.length;i++){const p=q[i];for(const [dx,dy]of Object.values(DIRS)){const nx=p.x+dx,ny=p.y+dy,k=`${nx},${ny}`;if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&!seen.has(k)&&this.grid[ny][nx]?.c===c){seen.add(k);q.push({x:nx,y:ny});}}}return q;
  }
  burst(x,y,color,n=10){for(let i=0;i<Math.min(n,36);i++){const a=this.rng()*Math.PI*2,s=.6+this.rng()*3;this.particles.push({x:x+.5,y:y+.5,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:.35+this.rng()*.4,max:.8,size:.05+this.rng()*.13,color});}if(this.particles.length>380)this.particles.splice(0,this.particles.length-380);}
  float(s,x,y,color='#fff'){this.texts.push({s,x:x+.5,y:y+.2,color,life:1.2});}
  air(n){this.player.air=cap(this.player.air+n,0,this.player.maxAir);}
  heal(n){this.player.hp=cap(this.player.hp+n,0,this.maxHp);}
  gainGold(n){n=Math.ceil(n*(1+(this.player.upgrades.pocket||0)*.35));this.player.gold+=n;this.stats.gold+=n;return n;}
  gainXP(n){this.player.xp+=n;while(this.player.xp>=this.player.nextXp){this.player.xp-=this.player.nextXp;this.player.level++;this.player.nextXp=Math.ceil(this.player.nextXp*1.38);this.pendingLevels++;this.heal(9);}}
  damage(n,why='落盤'){if(this.player.invuln>0||this.mode!=='play')return;
    if(this.player.shield>0){this.player.shield--;this.player.invuln=1.4;this.burst(this.player.x,this.player.y,'#b3ffef',24);this.float('GUARD',this.player.x,this.player.y,'#8fffe4');this.emit('guard');return;}
    n=Math.max(1,Math.round(n*(1-this.suit.armor)*Math.pow(.88,this.player.upgrades.guard||0)));this.player.hp=Math.max(0,this.player.hp-n);this.player.invuln=1.35;this.shake=.25;this.flash=.2;this.float(`−${n}`,this.player.x,this.player.y,'#ff829c');this.emit('hurt');if(this.player.hp<=0)this.finish(false,why);
  }
  finish(win,why){if(this.mode==='dead'||this.mode==='win')return;this.stats.depth=Math.max(this.stats.depth,this.depth);if(win)this.stats.depth=1200;this.mode=win?'win':'dead';this.reason=why;this.reward=Math.max(1,Math.floor(this.stats.depth/55)+Math.floor(this.stats.gold/55)+(win?15:0));this.meta.cores+=this.reward;this.meta.best=Math.max(this.meta.best,this.stats.depth);this.meta.runs++;if(win)this.meta.wins++;this.emit('finish',{win});}
  clearCells(cells,{chain=true,rewards=true}={}){
    const count=cells.length;if(!count)return;
    let countColor=0;
    for(const {x,y}of cells){const t=this.at(x,y);if(!t||t.c===9)continue;this.grid[y][x]=null;this.stats.blocks++;if(t.c<4)countColor++;
      this.burst(x,y,PALETTE[t.c]||'#fff0a7',count>12?3:6);
      if(rewards){if(t.c===5){this.air(25);this.float('+25 AIR',x,y,'#a1ffe8');this.emit('air');}
      else if(t.c===6){const gold=this.gainGold(9+this.stage*2);this.float(`+${gold}G`,x,y,'#ffd56c');this.emit('gold');}
      else if(t.c===7){this.heal(12);this.gainXP(14);this.float('+12 HP',x,y,'#ff9dab');this.emit('heal');}
      else if(t.c===8){this.gainGold(18);this.gainXP(22);this.offerEquipment();}
      else this.gainXP(t.c===4?3:1);}
    }
    if(chain&&countColor>=5){this.combo=this.comboTimer>0?this.combo+1:1;this.comboTimer=2.5;this.stats.chains++;this.stats.maxChain=Math.max(this.stats.maxChain,countColor);this.gainXP(Math.ceil(countColor*1.15));this.gainGold(Math.max(1,Math.floor(countColor/5)));const a=(this.player.upgrades.chainAir||0)+(this.drill.air||0);if(a)this.air(Math.min(12,countColor*.6)*a);if(countColor>=12)this.heal(2);this.float(`${countColor} CHAIN`,cells[0].x,cells[0].y,'#ffe18e');this.shake=Math.max(this.shake,.1);this.emit('chain',{count:countColor});}
    this.settleTimer=Math.max(this.settleTimer,.12);
  }
  tryStep(dir,rush=false){if(this.mode!=='play')return false;const p=this.player,d=DIRS[dir];if(!d)return false;p.dir=dir;this.started=true;const x=p.x+d[0],y=p.y+d[1];if(x<0||x>=COLS||y<0||y>=ROWS-1)return false;
    const enemy=this.enemies.find(e=>e.x===x&&e.y===y);if(enemy){this.attackEnemy(enemy,this.power);return true;}
    if(this.boss&&Math.abs(x-this.boss.x)<=1&&Math.abs(y-this.boss.y)<=1){this.hitBoss(this.power);return true;}
    const t=this.at(x,y);if(t){if(t.c===9)return false;if(t.c===4){t.hp-=1+(this.drill.hard||0)+Math.floor((this.player.upgrades.edge||0)/2);this.air(-1.2);if(t.hp>0){this.burst(x,y,'#989da9',5);this.emit('stone');return true;}}
      this.clearCells(this.component(x,y));this.emit('dig',{rush});return true;
    }
    p.x=x;p.y=y;p.fallTimer=0;if(rush)this.air(-.025);this.collectDrops();this.emit('step');return true;
  }
  attackEnemy(enemy,power){enemy.hp-=power;enemy.stun=.4;enemy.flash=.15;this.burst(enemy.x,enemy.y,'#ffdb86',8);this.emit('hit');if(enemy.hp<=0){this.enemies.splice(this.enemies.indexOf(enemy),1);this.stats.kills++;this.gainXP(22+this.stage*3);this.gainGold(7+this.stage);if(this.player.upgrades.leech)this.heal(5*this.player.upgrades.leech);this.float('撃破',enemy.x,enemy.y,'#ffe4a7');this.emit('kill');}}
  hitBoss(power){if(!this.boss)return;const b=this.boss;const open=b.timer<.9;b.hp-=power*(open?1:.32);b.flash=.15;this.burst(b.x,b.y,open?'#ffc88a':'#9bacba',open?10:4);this.emit('hit');if(b.hp<=0){this.burst(b.x,b.y,this.biome.tint,36);this.boss=null;this.exit.open=true;this.stats.bosses++;this.gainXP(65);this.gainGold(45);this.air(25);this.heal(15);this.player.shield++;this.toast('守護者を撃破！ 奥のゲートへ');this.shake=.45;this.emit('bossDead');}}
  pulse(){if(this.mode!=='play'||this.player.pulseTimer>0)return false;this.started=true;const p=this.player;p.pulseTimer=8*Math.pow(.82,p.upgrades.pulse||0);const cells=[];for(let y=p.y-2;y<=p.y+2;y++)for(let x=p.x-2;x<=p.x+2;x++)if(x>=0&&x<COLS&&y>=0&&y<ROWS-1&&this.at(x,y)&&this.at(x,y).c!==9)cells.push({x,y});
    this.clearCells(cells,{chain:false});for(const e of [...this.enemies])if(Math.abs(e.x-p.x)<4&&Math.abs(e.y-p.y)<4)this.attackEnemy(e,32+(p.upgrades.pulse||0)*12);
    if(this.boss&&Math.abs(this.boss.y-p.y)<5&&Math.abs(this.boss.x-p.x)<5)this.hitBoss(35+(p.upgrades.pulse||0)*12);
    for(const f of this.falling)if(f.cells.some(c=>Math.abs(c.x-p.x)<3&&Math.abs(c.y-p.y)<3)){f.delay=Math.max(f.delay,.8);}
    this.hazards=this.hazards.filter(h=>Math.abs(h.x-p.x)>2||Math.abs(h.y-p.y)>2);
    p.invuln=Math.max(p.invuln,.65);this.air(-8+(p.upgrades.bombAir||0)*12);this.shake=.25;this.pulseFx={x:p.x+.5,y:p.y+.5,life:.45};this.emit('pulse');return true;
  }
  potion(){if(this.mode!=='play'||this.player.potions<=0||this.player.hp>=this.maxHp)return false;this.player.potions--;this.heal(45);this.float('+45 HP',this.player.x,this.player.y,'#ffb1bf');this.emit('heal');return true;}
  scanFalls(){
    const visited=new Set(),groups=[];const bottom=Math.min(ROWS-2,this.player.y+15),top=Math.max(0,this.player.y-19);
    for(let y=bottom;y>=top;y--)for(let x=0;x<COLS;x++){const t=this.grid[y][x];if(!t||t.c>4)continue;const key=`${x},${y}`;if(visited.has(key))continue;const group=this.component(x,y);for(const c of group)visited.add(`${c.x},${c.y}`);
      const members=new Set(group.map(c=>`${c.x},${c.y}`));let supported=false;
      for(const c of group){if(c.y>=ROWS-2){supported=true;break;}if(!members.has(`${c.x},${c.y+1}`)&&this.at(c.x,c.y+1)){supported=true;break;}}
      if(!supported&&group.length&&group.length<100){groups.push(group);}
    }
    for(const group of groups){const cells=group.map(c=>({...c,t:this.grid[c.y][c.x]})).filter(c=>c.t);if(!cells.length)continue;for(const c of cells)this.grid[c.y][c.x]=null;this.falling.push({cells,delay:.65,timer:0,offset:0,moved:0});}
  }
  updateFalls(dt){
    for(let i=this.falling.length-1;i>=0;i--){const f=this.falling[i];f.delay-=dt;if(f.delay>0)continue;f.timer+=dt;f.offset=Math.min(1,f.timer/.105);
      if(f.timer<.105)continue;f.timer=0;f.offset=0;
      // Settled terrain and lower moving groups support upper groups.
      const hit=f.cells.some(c=>c.y+1>=ROWS-1||this.at(c.x,c.y+1)||this.falling.some((o,j)=>j!==i&&o.cells.some(k=>k.x===c.x&&k.y===c.y+1)));
      if(hit){
        const landed=[];for(const c of f.cells){if(c.y>=0&&c.y<ROWS-1&&!this.grid[c.y][c.x]){if(c.x===this.player.x&&c.y===this.player.y){this.damage(29+this.stage*3,'落盤に巻き込まれた');continue;}this.grid[c.y][c.x]=c.t;landed.push(c);}}
        this.falling.splice(i,1);if(f.moved>0){this.emit('land');this.shake=Math.max(this.shake,.07);for(const c of landed){if(c.t.c<4){const component=this.component(c.x,c.y);if(component.length>=5){this.clearCells(component);break;}}}}
      }else{
        for(const c of f.cells){c.y++;if(c.x===this.player.x&&c.y===this.player.y){this.damage(29+this.stage*3,'落盤に巻き込まれた');this.grid[c.y][c.x]=null;}}
        // A fallen block never entombs the player: move it aside after impact.
        f.cells=f.cells.filter(c=>c.x!==this.player.x||c.y!==this.player.y);f.moved++;if(!f.cells.length)this.falling.splice(i,1);
        for(const e of [...this.enemies])if(f.cells.some(c=>c.x===e.x&&c.y===e.y))this.attackEnemy(e,100);
      }
    }
  }
  collectDrops(){for(let i=this.drops.length-1;i>=0;i--){const d=this.drops[i];if(d.x===this.player.x&&d.y===this.player.y){this.gainGold(d.value);this.drops.splice(i,1);}}}
  offerLevel(){const pool=[...UPGRADES];this.choice=[];for(let i=0;i<3;i++){const at=Math.floor(this.rng()*pool.length);this.choice.push(pool.splice(at,1)[0]);}this.mode='level';this.emit('level');}
  chooseUpgrade(id){if(this.mode!=='level'||!this.choice.some(u=>u.id===id))return false;const p=this.player;p.upgrades[id]=(p.upgrades[id]||0)+1;
    if(id==='tank'){p.maxAir+=25;this.air(25);}if(id==='heart'){p.maxHp+=20;this.heal(25);}if(id==='shield')p.shield+=2;if(id==='heal'){p.potions+=2;this.heal(15);}if(id==='pocket')this.gainGold(20);
    this.mode='play';p.invuln=Math.max(p.invuln,.6);this.toast(UPGRADES.find(x=>x.id===id).name+' を獲得');this.emit('upgrade');return true;
  }
  offerEquipment(){if(this.mode!=='play')return;const slot=this.rng()<.6?'drills':'suits',arr=EQUIPMENT[slot],max=Math.min(arr.length-1,2+Math.floor(this.stage/2));let idx=1+Math.floor(this.rng()*max);if(arr[idx].id===(slot==='drills'?this.player.drill:this.player.suit))idx=idx%max+1;this.loot={slot,item:arr[idx]};this.mode='loot';this.emit('loot');}
  takeEquipment(take){if(this.mode!=='loot')return false;if(take)this.player[this.loot.slot==='drills'?'drill':'suit']=this.loot.item.id;else this.gainGold(20);this.loot=null;this.mode='play';this.player.invuln=Math.max(this.player.invuln,.7);this.player.hp=cap(this.player.hp,0,this.maxHp);return true;}
  beginCamp(){this.stats.depth=Math.max(this.stats.depth,(this.stage+1)*200);if(this.stage===5){this.finish(true,'深層の核を解放した');return;}this.mode='camp';this.shopStock=[{id:'heal',name:'焚き火の治療',desc:'HPを60回復',cost:24,bought:false},{id:'air',name:'酸素のフル補給',desc:'酸素を最大まで補給',cost:18,bought:false},{id:'shield',name:'護りの結晶',desc:'シールドを2枚獲得',cost:30,bought:false},{id:'potion',name:'救難ポーション',desc:'HPを45回復する薬',cost:18,bought:false}];const item=EQUIPMENT.drills[Math.min(4,2+Math.floor(this.stage/2))];this.shopStock.push({id:'drill',name:item.name,desc:item.desc,cost:48+this.stage*12,bought:false,item});this.heal(15);this.air(25);this.emit('camp');}
  buy(id){if(this.mode!=='camp')return false;const it=this.shopStock.find(x=>x.id===id);if(!it||it.bought||this.player.gold<it.cost)return false;this.player.gold-=it.cost;it.bought=true;if(id==='heal')this.heal(60);if(id==='air')this.air(this.player.maxAir);if(id==='shield')this.player.shield+=2;if(id==='potion')this.player.potions++;if(id==='drill')this.player.drill=it.item.id;this.emit('buy');return true;}
  nextFloor(){if(this.mode!=='camp')return false;this.stage++;this.mode='play';this.loadFloor();return true;}
  step(dt,input={}){
    dt=cap(dt,0,.04);this.time+=dt;
    this.particles=this.particles.filter(p=>(p.life-=dt)>0);for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=7*dt;}
    this.texts=this.texts.filter(p=>(p.life-=dt)>0);for(const p of this.texts)p.y-=dt*.65;
    this.shake=Math.max(0,this.shake-dt);this.flash=Math.max(0,this.flash-dt);if(this.pulseFx){this.pulseFx.life-=dt;if(this.pulseFx.life<=0)this.pulseFx=null;}
    if(this.mode!=='play')return;const p=this.player;this.ticks++;this.comboTimer=Math.max(0,this.comboTimer-dt);this.messageTimer=Math.max(0,this.messageTimer-dt);p.invuln=Math.max(0,p.invuln-dt);p.pulseTimer=Math.max(0,p.pulseTimer-dt);p.drillTimer=Math.max(0,p.drillTimer-dt);
    if(input.pulse)this.pulse();if(input.heal)this.potion();
    if((input.dir||input.rush)&&p.drillTimer<=0){const dir=input.dir||p.dir;this.tryStep(dir,!!input.rush);p.drillTimer=(input.rush?.112:.185)*this.drill.speed*Math.pow(.88,p.upgrades.quick||0);}
    if(this.mode!=='play')return;
    // Gravity only moves a tile at a time. Manual upward drilling remains possible.
    if(!this.at(p.x,p.y+1)&&p.y<ROWS-2){p.fallTimer+=dt;if(p.fallTimer>.16){p.y++;p.fallTimer=0;this.collectDrops();}}else p.fallTimer=0;
    p.rx+=(p.x-p.rx)*Math.min(1,dt*22);p.ry+=(p.y-p.ry)*Math.min(1,dt*22);
    if(this.started){this.air(-this.airRate*dt);if(p.air<=0){p.hp=Math.max(0,p.hp-dt*9);if(p.hp<=0)this.finish(false,'酸素が尽きた');}}
    this.settleTimer-=dt;if(this.settleTimer<=0&&this.ticks%7===0){this.scanFalls();this.settleTimer=.17;}this.updateFalls(dt);
    if(this.mode!=='play')return;
    for(const h of this.hazards){h.delay-=dt;if(h.delay<=0&&!h.hit){h.hit=true;if(Math.abs(h.x-p.x)<=h.radius&&h.y===p.y)this.damage(h.damage,h.kind==='spore'?'毒胞子に包まれた':'灼熱の攻撃を受けた');this.burst(h.x,h.y,h.kind==='spore'?'#b4f7a2':'#ffa574',10);}}this.hazards=this.hazards.filter(h=>h.delay>-.3);
    for(const e of [...this.enemies]){e.timer-=dt;e.stun=Math.max(0,e.stun-dt);e.flash=Math.max(0,e.flash-dt);e.rx+=(e.x-e.rx)*Math.min(1,dt*12);e.ry+=(e.y-e.ry)*Math.min(1,dt*12);
      if(e.kind!=='jelly'&&!this.at(e.x,e.y+1)&&e.y<ROWS-2){e.fallTimer+=dt;if(e.fallTimer>.22){e.y++;e.fallTimer=0;}}else e.fallTimer=0;
      if(e.timer<=0&&e.stun<=0&&Math.abs(e.y-p.y)<12){const dx=Math.sign(p.x-e.x),dy=Math.sign(p.y-e.y);
        if(['spore','ember'].includes(e.kind)&&Math.abs(p.y-e.y)<7){this.hazards.push({x:p.x,y:p.y,delay:.9,radius:e.kind==='ember'?1:0,damage:16+this.stage*2,kind:e.kind,hit:false});e.timer=2.3;}
        else {if(dx&&!this.at(e.x+dx,e.y))e.x+=dx;else if(dy&&(e.kind==='jelly'||dy<0)&&!this.at(e.x,e.y+dy))e.y+=dy;else if(e.kind==='scarab'&&dx&&this.at(e.x+dx,e.y)?.c<4)this.clearCells([{x:e.x+dx,y:e.y}],{chain:false,rewards:false});e.timer=Math.max(.42,1.2-this.stage*.09);}
      }
      if(Math.abs(e.x-p.x)+Math.abs(e.y-p.y)<=1&&e.stun<=0)this.damage(13+this.stage*3,'地下の魔物に倒された');
    }
    if(this.boss){const b=this.boss;b.flash=Math.max(0,b.flash-dt);b.stun=Math.max(0,b.stun-dt);if(Math.abs(p.y-b.y)<11){b.timer-=dt;if(b.timer<=0){b.phase++;b.timer=b.hp<b.maxHp*.5?2.4:3.2;this.emit('bossAttack');const x=cap(p.x+Math.floor(this.rng()*3)-1,0,COLS-1);const cells=[{x,y:Math.max(p.y-5,ROWS-15),t:{c:4,hp:2}}];if(!this.at(x,cells[0].y))this.falling.push({cells,delay:.9,timer:0,offset:0,moved:0});if(b.phase%2===0&&this.enemies.length<5)this.enemies.push(this.makeEnemy(b.x+(b.phase%4===0?3:-3),b.y-1,'slime'));}if(Math.abs(p.x-b.x)<=1&&Math.abs(p.y-b.y)<=1)this.damage(20+this.stage*3,'守護者に倒された');}}
    this.stats.depth=Math.max(this.stats.depth,this.depth);if(p.y>=ROWS-3&&Math.abs(p.x-this.exit.x)<=1&&this.exit.open)this.beginCamp();
    if(this.mode==='play'&&this.pendingLevels>0){this.pendingLevels--;this.offerLevel();}
    if(this.mode==='play'&&this.ticks%180===0)this.emit('save');
  }
  serialize(){const copy={};for(const k of ['seed','stage','time','ticks','player','stats','grid','falling','enemies','drops','hazards','exit','boss','pendingLevels','choice','loot','shopStock','started','mode'])copy[k]=this[k];if(copy.mode==='pause')copy.mode='play';return {version:1,state:copy};}
  static restore(data,meta){
    if(data?.version!==1||!data.state)throw Error('Invalid save');const s=data.state;
    if(!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Array.isArray(s.grid)||s.grid.length!==ROWS||s.grid.some(r=>!Array.isArray(r)||r.length!==COLS))throw Error('Invalid map');
    if(!s.player||!Number.isInteger(s.player.x)||!Number.isInteger(s.player.y)||s.player.x<0||s.player.x>=COLS||s.player.y<0||s.player.y>=ROWS-1||!Number.isFinite(s.player.hp)||s.player.hp<=0||!Number.isFinite(s.player.air))throw Error('Invalid player');
    if(!['play','level','loot','camp'].includes(s.mode))throw Error('Invalid mode');
    const g=new Game(s.seed,meta);for(const [k,v]of Object.entries(s))if(k in g)g[k]=v;g.events=[];g.particles=[];g.texts=[];g.player.rx=g.player.x;g.player.ry=g.player.y;g.player.invuln=1.5;g.mode=s.mode;return g;
  }
}
