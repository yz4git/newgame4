export const ENEMY_TYPES={
  rusher:{name:'突進スカラベ',icon:'»',color:'#edac73',hp:23,growth:5,desc:'角を光らせ、直線上に3マス突進。横へ避けるか、凍結で止めよう。'},
  burrower:{name:'穿孔獣',icon:'▼',color:'#c9ab88',hp:25,growth:5,desc:'鉱脈を掘って接近する。通った穴で足場も崩れる。落盤を誘って迎え撃とう。'},
  spitter:{name:'胞子砲花',icon:'✿',color:'#c7b4ed',hp:21,growth:4,desc:'口を向けた直線に胞子弾。壁が弾を止めるので、射線を外そう。'},
  splitter:{name:'分裂ゼリー',icon:'◒',color:'#87d8d2',hp:26,growth:5,desc:'通常撃破で小さな2体に分裂。落盤・爆風・凍結で倒すと分裂を防げる。'},
  bomber:{name:'爆裂ダニ',icon:'✦',color:'#ee9a89',hp:18,growth:4,desc:'近づくと点滅して周囲に爆発。敵も岩も巻き込む。凍結して倒せば不発になる。'},
  shield:{name:'盾殻ガメ',icon:'⬡',color:'#a7bed5',hp:29,growth:6,desc:'正面を盾で守る。横・背後・落盤・共鳴が有効。正面も3回叩けば盾を崩せる。'},
};
export const SPECIAL_ENEMIES=Object.keys(ENEMY_TYPES);
const steps=[[0,-1],[1,0],[0,1],[-1,0]];
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export const heading=(a,b)=>Math.abs(b.x-a.x)>Math.abs(b.y-a.y)?[Math.sign(b.x-a.x)||1,0]:[0,Math.sign(b.y-a.y)||1];
export function enemyCanEnter(g,e,x,y){return !(g.player.x===x&&g.player.y===y)&&!g.at(x,y)&&!g.occupied(x,y)&&!g.enemies.some(o=>o!==e&&o.x===x&&o.y===y)&&!(g.boss&&Math.abs(x-g.boss.x)<=1&&Math.abs(y-g.boss.y)<=1);}
export function noticesPlayer(g,e){
  const p=g.player,d=dist(e,p);if(d>7)return false;if(e.type==='burrower'&&d<=4)return true;
  const n=Math.max(Math.abs(e.x-p.x),Math.abs(e.y-p.y));
  for(let i=1;i<n;i++){const x=Math.round(e.x+(p.x-e.x)*i/n),y=Math.round(e.y+(p.y-e.y)*i/n);if(g.at(x,y)||g.occupied(x,y))return false;}
  return true;
}
function warn(g,e,intent){e.intent=intent;g.emit('enemyWarn');}
export function specialEnemyStep(g,e){
  const p=g.player,[dx,dy]=heading(e,p),d=dist(e,p);
  if(e.type==='rusher'&&(e.x===p.x||e.y===p.y)&&d>1&&d<=7&&enemyCanEnter(g,e,e.x+dx,e.y+dy)){
    warn(g,e,{kind:'rush',dx,dy,delay:.7,left:3});e.timer=1.8;return true;
  }
  if(e.type==='burrower'){
    const choices=steps.map(([sx,sy])=>({x:e.x+sx,y:e.y+sy})).sort((a,b)=>dist(a,p)-dist(b,p));
    for(const q of choices){
      if(dist(q,p)<1||dist(q,p)>=d||g.occupied(q.x,q.y)||g.isFixture(q.x,q.y)||g.enemies.some(o=>o!==e&&o.x===q.x&&o.y===q.y)||g.boss&&Math.abs(q.x-g.boss.x)<=1&&Math.abs(q.y-g.boss.y)<=1)continue;
      const t=g.at(q.x,q.y);if(t&&![0,1,2,3,10].includes(t.c))continue;
      if(t)g.clearCells([q],{chain:false,rewards:false,source:'burrow'});e.x=q.x;e.y=q.y;e.timer=.75;return true;
    }
  }
  if(e.type==='spitter'){
    if(d<9&&enemyCanEnter(g,e,e.x+dx,e.y+dy)&&g.hazards.length<32)warn(g,e,{kind:'spit',dx,dy,delay:.75});
    e.timer=2.2;return true;
  }
  if(e.type==='bomber'&&d<=4){warn(g,e,{kind:'bomb',delay:1});e.timer=2;return true;}
  if(e.type==='shield')e.guardDir=[dx,dy];
  return false;
}
export function advanceEnemyIntent(g,e,dt){
  e.frozen=Math.max(0,(e.frozen||0)-dt);e.guardBroken=Math.max(0,(e.guardBroken||0)-dt);
  const a=e.intent;if(!a)return;
  if(e.stun>0){e.intent=null;e.timer=Math.max(.8,e.timer);return;}
  a.delay-=dt;if(a.delay>0)return;
  if(a.kind==='rush'){
    for(let i=0,n=g.turnBased?a.left:1;i<n&&e.intent;i++){
      const x=e.x+a.dx,y=e.y+a.dy;
      if(x===g.player.x&&y===g.player.y){g.damage(14+g.stage,'突進スカラベに突き飛ばされた');e.intent=null;e.stun=.4;e.timer=1.1;return;}
      if(enemyCanEnter(g,e,x,y)){e.x=x;e.y=y;a.left--;a.delay=.09;if(a.left<=0)e.intent=null;}
      else{e.intent=null;e.stun=.65;e.timer=1.1;}
    }
  }else if(a.kind==='spit'){
    e.intent=null;e.shots=(e.shots||0)+1;const volley=`${g.ticks}/${e.x}/${e.y}/${e.shots}`;
    for(let i=1;i<=6&&g.hazards.length<40;i++){const x=e.x+a.dx*i,y=e.y+a.dy*i;if(g.at(x,y)||g.occupied(x,y))break;g.hazards.push({x,y,delay:.08+i*.09,radius:0,damage:10+g.stage,kind:'spit',volley,hit:false});}
    g.emit('enemyFire');
  }else if(a.kind==='bomb'){e.intent=null;g.attackEnemy(e,e.hp+100,'self');}
}
export function spitBlocked(g,h){
  if(h.kind!=='spit')return false;
  if(h.blocked)return true;
  if(!g.at(h.x,h.y)&&!g.occupied(h.x,h.y))return false;
  for(const other of g.hazards)if(other.volley===h.volley)other.blocked=true;
  return true;
}
export function specialEnemyDeath(g,e,source,cold){
  if(e.type==='bomber'&&!cold)g.explode(e.x,e.y,1,52+g.stage*5,'barrel');
  if(e.type!=='splitter'||cold||['rock','barrel','lava','blast'].includes(source))return;
  let count=0;
  for(const [dx,dy]of steps){const x=e.x+dx,y=e.y+dy;if(count>=2||g.enemies.length>=105)break;if(!enemyCanEnter(g,e,x,y)||g.isFixture(x,y)||dist({x,y},g.player)<1)continue;const child=g.makeEnemy(x,y,'swarm');child.hp=child.maxHp=8+g.stage*2;child.rewardScale=.25;child.stun=.45;g.enemies.push(child);count++;}
  if(count){g.float('分裂！',e.x,e.y,'#a7ece7');g.emit('split');}
}
