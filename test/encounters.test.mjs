import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,COLS,ROWS} from '../src/engine.mjs';
import {prepareBoss,updateBoss} from '../src/boss.mjs';

const advance=(g,n,input={})=>{for(let i=0;i<n;i++)g.step(1/60,input);};
function arena(){
  const g=new Game(41);g.started=true;g.boss=null;g.enemies=[];g.falling=[];g.fixtures=[];g.broods=[];g.hazards=[];g.swarmBudget=0;
  g.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||x===COLS-1||y===0||y===ROWS-1?{c:9,hp:999}:null));
  Object.assign(g.player,{x:6,y:8,rx:6,ry:8,maxY:8,shield:0,invuln:100});return g;
}
function guardian(){
  const g=arena();g.stage=1;g.room=2;g.roomType='boss';Object.assign(g.player,{x:6,y:74,rx:6,ry:74,maxY:74});
  g.boss=prepareBoss({x:6,y:72,hp:400,maxHp:400,flash:0,id:'守護者'});return g;
}
test('waiting before the first input freezes every world system and its random state',()=>{
  for(const stage of [0,1,5]){
    const g=new Game(17);g.stage=stage;g.room=2;g.loadFloor();
    const snapshot=()=>{const s=structuredClone(g.serialize().state);delete s.time;return s;},before=snapshot();
    advance(g,1800);assert.deepEqual(snapshot(),before);assert.equal(g.player.y,2);assert.equal(g.stats.kills,0);
    g.step(1/60,{dir:'down',rush:true});assert.equal(g.started,true);assert.equal(g.player.y,3);advance(g,120,{dir:'down',rush:true});assert.ok(g.stats.blocks>0);
  }
});
test('falling explorer stops above a creature, can drill it, and never shares its cell',()=>{
  const g=arena(),e=g.makeEnemy(6,10,'swarm');e.timer=100;g.enemies=[e];g.grid[11][6]={c:9,hp:999};
  advance(g,45);assert.equal(g.player.y,9);assert.equal(e.y,10);const hp=e.hp;assert.equal(g.tryStep('down'),true);assert.ok(e.hp<hp);assert.equal(g.player.y,9);
});
test('enemy gravity, burrowing and ordinary movement cannot enter the explorer cell',()=>{
  const g=arena();g.grid[9][6]={c:9,hp:999};const e=g.makeEnemy(6,6,'swarm');e.timer=100;g.enemies=[e];advance(g,60);assert.equal(e.y,7);assert.equal(g.player.y,8);
  for(const type of ['swarm','burrower','moth']){const e=g.makeEnemy(5,8,type);g.enemies=[e];g.enemyStep(e);assert.notDeepEqual([e.x,e.y],[6,8]);}
});
test('a charge hits from the neighboring cell rather than hiding inside the explorer',()=>{
  const g=arena();g.player.invuln=0;g.grid[9][6]={c:9,hp:999};for(let x=2;x<6;x++)g.grid[9][x]={c:9,hp:999};
  const e=g.makeEnemy(3,8,'rusher');g.enemies=[e];g.enemyStep(e);advance(g,64);assert.equal(e.x,5);assert.equal(e.y,8);assert.ok(g.player.hp<100);assert.equal(e.intent,null);
});
test('resuming a legacy overlap separates the enemy without granting rewards or damaging the player',()=>{
  const g=arena();g.enemies=[g.makeEnemy(6,8,'swarm')];const saved=JSON.parse(JSON.stringify(g.serialize()));const h=Game.restore(saved,g.meta);
  assert.ok(h.enemies.every(e=>e.x!==h.player.x||e.y!==h.player.y));assert.equal(h.player.hp,100);assert.equal(h.stats.kills,0);assert.equal(h.player.gold,0);assert.equal(h.enemies[0].hp,g.enemies[0].hp);
});
test('unopened nests remain supported while specialist activation waits for a visible opening',()=>{
  const g=new Game(3);g.started=true;const enemies=g.enemies.slice();advance(g,60);assert.equal(g.stats.kills,0);assert.equal(g.enemies.length,enemies.length);
  const h=arena(),e=h.makeEnemy(3,8,'spitter');h.player.x=7;for(let x=1;x<12;x++)h.grid[9][x]={c:9,hp:999};h.grid[8][5]={c:11,hp:3};h.enemies=[e];advance(h,90);assert.equal(e.intent,null);assert.equal(e.awake,false);
  h.grid[8][5]=null;advance(h,18);assert.equal(e.awake,true);assert.equal(e.intent.kind,'spit');
});
test('guardian shell stops a cascade burst and requires three warned core openings',()=>{
  const g=guardian(),b=g.boss;
  for(let i=0;i<100;i++)g.hitBoss(1e9,'rock');assert.ok(b.hp>b.maxHp*2/3);assert.equal(b.phase,0);
  let warnings=0,prior=b.state;
  for(let i=0;i<1800&&g.boss;i++){
    g.hitBoss(1e9,'dig');updateBoss(g,1/60);
    if(g.boss?.state==='warn'&&prior!=='warn')warnings++;prior=g.boss?.state;
  }
  assert.equal(g.boss,null);assert.ok(warnings>=3);assert.equal(g.stats.bosses,1);
});
test('a guardian cannot attack, expose its core or lose health before the explorer reaches its arena',()=>{
  const g=guardian(),b=g.boss;g.player.y=60;
  for(let i=0;i<600;i++){g.hitBoss(100,'rock');updateBoss(g,1/60);}
  assert.equal(b.hp,b.maxHp);assert.equal(b.attacks,0);assert.equal(b.state,'guard');assert.equal(b.engaged,false);assert.ok(b.stagger>0);
  g.player.y=66;for(let i=0;i<90;i++)updateBoss(g,1/60);assert.equal(b.engaged,true);assert.equal(b.state,'warn');
});
test('a mineral pillar stores a single large hit for the next exposed core',()=>{
  const g=guardian(),b=g.boss;g.fixtures=[{x:3,y:61,kind:'seal',done:false}];g.checkObjective();assert.equal(b.sealCharges,1);assert.equal(b.hp,b.maxHp);g.checkObjective();assert.equal(b.sealCharges,1);
  for(let i=0;i<150;i++)updateBoss(g,1/60);assert.equal(b.state,'open');assert.equal(b.sealCharges,0);assert.ok(b.hp<=b.maxHp*.89);
});
test('warned columns can be dodged and a missed pillar never prevents direct victory from below',()=>{
  for(const dodge of [false,true]){const g=guardian(),b=g.boss;g.player.invuln=0;for(let i=0;i<90;i++)updateBoss(g,1/60);assert.equal(b.state,'warn');if(dodge)g.player.x=4;for(let i=0;i<70;i++)updateBoss(g,1/60);assert.equal(g.player.hp,dodge?100:74);}
  const g=guardian();g.fixtures=[{x:3,y:61,kind:'seal',done:false}];g.grid[61][3]={c:1,hp:1};
  for(let i=0;i<2400&&g.boss;i++){g.tryStep('up');updateBoss(g,1/60);}assert.equal(g.boss,null);assert.equal(g.fixtures[0].done,false);g.pendingLevels=0;g.checkObjective();assert.ok(['camp','loot','level'].includes(g.mode));
});
test('guardian summons count only nearby enemies and give emerging creatures a grace period',()=>{
  const g=guardian(),b=g.boss;b.engaged=true;b.state='warn';b.timer=0;b.attacks=2;b.attack={columns:[1,2,3],fromY:66};
  g.enemies=Array.from({length:8},(_,i)=>g.makeEnemy(i+1,4,'swarm'));updateBoss(g,1/60);const nearby=g.enemies.filter(e=>e.y>=70);assert.equal(nearby.length,2);assert.ok(nearby.every(e=>e.stun>0));
});
test('guardian warnings, stored pillar power and health gates survive pause and save restoration',()=>{
  const g=guardian();for(let i=0;i<90;i++)updateBoss(g,1/60);g.boss.sealCharges=1;const before=structuredClone(g.boss);g.mode='pause';advance(g,180);assert.deepEqual(g.boss,before);
  const h=Game.restore(JSON.parse(JSON.stringify(g.serialize())),g.meta);assert.deepEqual(h.boss,g.boss);
  for(let i=0;i<70;i++){updateBoss(g,1/60);updateBoss(h,1/60);}assert.deepEqual(h.boss,g.boss);
});
test('older saves reinforce only untouched nests ahead and retain guardian damage and build',()=>{
  const g=new Game(9);Object.assign(g.player,{y:20,maxY:20,level:7,drill:'prism'});g.started=true;
  const saved=JSON.parse(JSON.stringify(g.serialize()));delete saved.state.nestVersion;
  saved.state.grid[34][6]={c:10,hp:1};const h=Game.restore(saved,g.meta);
  assert.deepEqual(h.grid.slice(0,30),saved.state.grid.slice(0,30));assert.equal(h.player.level,7);assert.equal(h.player.drill,'prism');assert.equal(h.enemies.length,g.enemies.length);assert.equal(h.stats.kills,0);
  assert.equal(h.nestVersion,1);const again=Game.restore(JSON.parse(JSON.stringify(h.serialize())),g.meta);assert.deepEqual(again.grid,h.grid);assert.deepEqual(again.enemies,h.enemies);
  const b=guardian();delete b.boss.version;delete b.boss.state;b.boss.hp=170;
  const resumed=Game.restore(JSON.parse(JSON.stringify(b.serialize())),b.meta);assert.equal(resumed.boss.hp,170);assert.equal(resumed.boss.phase,1);assert.equal(resumed.boss.state,'guard');
});
