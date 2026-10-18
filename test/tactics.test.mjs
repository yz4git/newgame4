import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,COLS,ROWS} from '../src/engine.mjs';
import {advanceEnemyIntent} from '../src/enemies.mjs';
import {forecastFall,canPush,TACTICAL_UPGRADES} from '../src/tactics.mjs';

function arena(mode='turn'){
  const g=new Game(42,null,mode);g.enemies=[];g.falling=[];g.fixtures=[];g.hazards=[];g.broods=[];g.boss=null;g.swarmBudget=0;g.setpieces=[];
  g.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||x===COLS-1||y===0||y===ROWS-1||y===9?{c:9,hp:999}:null));
  Object.assign(g.player,{x:6,y:8,rx:6,ry:8,maxY:8,shield:0,invuln:0});return g;
}
const idle=g=>{for(let i=0;i<3600;i++)g.step(1/60);};
test('a sideways push gives a warning, drops the rock onto a creature, and consumes one turn',()=>{
  const g=arena();g.grid[8][7]={c:4,hp:4};g.grid[9][8]=null;g.grid[12][8]={c:9,hp:999};
  const e=g.makeEnemy(8,10,'swarm');e.timer=100;g.enemies=[e];g.takeTurn({dir:'right'});
  assert.equal(g.turnCount,1);assert.equal(g.player.x,7);assert.equal(g.at(7,8),null);assert.ok(g.falling.some(f=>f.cells.some(c=>c.x===8&&c.y===8)));
  const before=JSON.stringify(g.serialize());idle(g);assert.equal(JSON.stringify(g.serialize()),before);
  for(let i=0;i<4;i++)g.takeTurn({wait:true});assert.equal(g.enemies.length,0);assert.equal(g.stats.terrainKills,1);assert.equal(g.stats.pushes,1);assert.equal(g.player.hp,100);
});
test('blocked pushes preserve fixtures and creatures, and the rock can still be mined',()=>{
  for(const obstruction of ['enemy','fixture','falling','wall']){
    const g=arena();g.grid[8][7]={c:4,hp:4};
    if(obstruction==='enemy')g.enemies=[g.makeEnemy(8,8,'swarm')];
    if(obstruction==='fixture')g.fixtures=[{x:8,y:8,kind:'seal',done:false}];
    if(obstruction==='falling')g.falling=[{cells:[{x:8,y:8,t:{c:10,hp:1}}]}];
    if(obstruction==='wall')g.grid[8][8]={c:9,hp:999};
    assert.equal(canPush(g,7,8,1),false);g.tryStep('right');assert.equal(g.at(7,8).hp,3);assert.equal(g.player.x,6);
  }
});
test('fall forecasts match the resting location and leave the saved world and RNG untouched',()=>{
  const g=arena(),f={cells:[{x:3,y:5,t:{c:4,hp:4}}],delay:0,timer:0,offset:0,moved:0};g.falling=[f];
  const before=JSON.stringify(g.serialize()),q=forecastFall(g,f.cells);assert.equal(q.distance,3);assert.deepEqual(q.landing,[{x:3,y:8}]);assert.equal(JSON.stringify(g.serialize()),before);
  for(let i=0;i<4;i++)g.updateFalls(.13);assert.equal(g.at(3,8).c,4);assert.equal(g.falling.length,0);
});
test('a scarab charge breaks a seam and tramples another creature instead of stopping at it',()=>{
  const g=arena(),e=g.makeEnemy(2,8,'rusher'),victim=g.makeEnemy(4,8,'swarm');g.enemies=[e,victim];g.grid[8][3]={c:11,hp:3};g.enemyStep(e);
  assert.equal(e.intent.kind,'rush');advanceEnemyIntent(g,e,1);assert.equal(g.at(3,8),null);assert.equal(g.enemies.includes(victim),false);assert.equal(e.x,5);assert.equal(e.intent,null);assert.ok(e.recovery>0);assert.equal(g.stats.luredKills,1);assert.equal(g.player.hp,100);
});
test('charging a blast tick can detonate the charger and nearby foes without reviving the removed charger',()=>{
  const g=arena(),e=g.makeEnemy(2,8,'rusher'),tick=g.makeEnemy(4,8,'bomber'),foe=g.makeEnemy(5,8,'swarm');g.player.x=8;g.enemies=[e,tick,foe];g.enemyStep(e);advanceEnemyIntent(g,e,1);
  assert.equal(g.enemies.length,0);assert.equal(g.stats.kills,3);assert.equal(g.player.hp,100);
});
test('spores hit the first foe or barrel and block the rest of that volley',()=>{
  for(const barrel of [false,true]){
    const g=arena(),flower=g.makeEnemy(3,8,'spitter');g.player.x=7;g.enemies=[flower];
    if(barrel)g.grid[8][5]={c:12,hp:1};else g.enemies.push(g.makeEnemy(5,8,'swarm'));
    g.enemyStep(flower);advanceEnemyIntent(g,flower,1);assert.ok(g.hazards.some(h=>h.x===(barrel?5:7)));g.takeTurn({wait:true});
    assert.equal(g.player.hp,100);assert.ok(!g.enemies.some(e=>e.x===5&&e.y===8));if(barrel)assert.equal(g.at(5,8),null);else assert.equal(g.stats.luredKills,1);
  }
});
test('a melee warning fixes its target, allows a dodge, and leaves a recovery opening',()=>{
  const g=arena(),e=g.makeEnemy(5,8,'swarm');e.timer=0;g.enemies=[e];g.takeTurn({wait:true});assert.deepEqual([e.intent.x,e.intent.y],[6,8]);assert.equal(g.player.hp,100);
  const before=JSON.stringify(g.serialize());idle(g);assert.equal(JSON.stringify(g.serialize()),before);
  g.takeTurn({dir:'right'});assert.equal(e.intent,null);assert.ok(e.recovery>0);assert.equal(g.player.hp,100);assert.equal(g.stats.feints,1);
  g.takeTurn({wait:true});assert.equal(g.player.hp,100);
  const h=arena(),foe=h.makeEnemy(5,8,'swarm');foe.timer=0;h.enemies=[foe];h.takeTurn({wait:true});h.takeTurn({wait:true});assert.equal(h.player.hp,94);
});
test('frozen kills create movable ice that supports the explorer, freezes while idle and expires on the same saved turn',()=>{
  const g=arena();g.player.upgrades.ice=1;const e=g.makeEnemy(7,8,'splitter');g.enemies=[e];g.attackEnemy(e,100,'frost');assert.equal(g.enemies.length,0);assert.ok(g.at(7,8).ice);
  g.takeTurn({dir:'right'});assert.equal(g.player.x,7);assert.ok(g.at(8,8).ice);g.takeTurn({dir:'up'});g.takeTurn({dir:'right'});assert.deepEqual([g.player.x,g.player.y],[8,7]);
  const h=Game.restore(JSON.parse(JSON.stringify(g.serialize())),g.meta),expires=h.at(8,8).expires;idle(h);assert.equal(h.at(8,8).expires,expires);assert.equal(h.time,3);
  while(g.time<expires){g.takeTurn({wait:true});h.takeTurn({wait:true});}
  assert.equal(g.at(8,8),null);assert.equal(h.at(8,8),null);assert.equal(g.player.y,8);assert.equal(h.player.y,8);assert.equal(g.player.hp,100);
});
test('a living frozen foe can be pushed without taking another mining hit',()=>{
  const g=arena();g.player.upgrades.ice=1;const e=g.makeEnemy(7,8,'armored');g.enemies=[e];g.attackEnemy(e,1,'frost');const hp=e.hp;g.takeTurn({dir:'right'});
  assert.deepEqual([g.player.x,e.x],[7,8]);assert.equal(e.hp,hp);assert.ok(e.frozen>0);assert.equal(e.intent,null);
});
test('realtime pause and guide time do not spend the lifetime of an ice platform',()=>{
  const g=arena('realtime');g.started=true;g.player.upgrades.ice=1;const e=g.makeEnemy(7,8,'splitter');g.enemies=[e];g.attackEnemy(e,100,'frost');
  g.mode='pause';for(let i=0;i<3600;i++)g.step(1/60);assert.equal(g.roomTime,0);assert.ok(g.at(7,8).ice);
  g.mode='play';for(let i=0;i<120;i++)g.step(1/60);assert.ok(g.at(7,8).ice);
  for(let i=0;i<420;i++)g.step(1/60);assert.equal(g.at(7,8),null);
});
test('one landing shock hits each nearby creature once and hard walls stop its horizontal reach',()=>{
  for(const wall of [false,true]){
    const g=arena();g.player.x=2;g.player.upgrades.shock=1;const e=g.makeEnemy(wall?7:6,8,'armored');e.hp=e.maxHp=80;g.enemies=[e];
    if(wall)g.grid[8][6]={c:11,hp:3};g.falling=[{cells:[4,5].map(x=>({x,y:8,t:{c:10,hp:1}})),delay:0,timer:0,offset:0,moved:3}];g.updateFalls(.13);assert.equal(e.hp,wall?80:44);assert.ok(g.fx.some(f=>f.kind==='shock'));
  }
});
test('a large mineral chain stores one wider resonance, preserves cooldowns and spends no extra crystals',()=>{
  const g=arena();g.player.x=3;g.player.dir='right';g.player.element=1;g.player.upgrades.wide=1;
  for(let x=2;x<=10;x++)g.grid[5][x]={c:1,hp:1};g.clearCells(g.component(2,5));assert.equal(g.player.wideReady,1);
  g.player.pulseTimer=4;assert.equal(g.takeTurn({pulse:true}),false);assert.equal(g.player.wideReady,1);g.player.pulseTimer=0;
  const e=g.makeEnemy(9,8,'swarm');e.hp=e.maxHp=100;g.enemies=[e];const charges=g.player.charges[1];g.resonate();assert.equal(e.hp,52);assert.equal(g.player.charges[1],charges-g.castCost);assert.equal(g.player.wideReady,0);
  const h=arena();h.player.x=3;h.player.upgrades.wide=1;h.player.wideReady=1;h.player.charges=[0,0,0,0];h.enemies=[h.makeEnemy(8,8,'swarm')];h.resonate();assert.equal(h.enemies.length,0);assert.equal(h.player.wideReady,0);
});
test('setpieces vary with the seed while retaining dense nests, specialist diversity and open gates',()=>{
  const types=new Set();
  for(let seed=1;seed<=8;seed++)for(let stage=0;stage<6;stage++){
    const g=new Game(seed);g.stage=stage;g.loadFloor('runes');assert.equal(g.enemies.length,stage<3?48:64);assert.ok(g.setpieces.length>=2);
    for(const a of g.setpieces)types.add(a.type);assert.ok(g.enemies.every(e=>!g.at(e.x,e.y)));assert.equal(g.at(g.exit.x,g.exit.y),null);
  }
  assert.deepEqual([...types].sort(),['blast','drop','flank']);
});
test('old saves gain only unexplored setpieces, and resume does not duplicate their layouts',()=>{
  const g=new Game(7,null,'turn');g.player.y=g.player.maxY=20;g.player.hp=57;g.player.upgrades.edge=2;
  const save=JSON.parse(JSON.stringify(g.serialize()));delete save.state.tacticsVersion;delete save.state.setpieces;
  const h=Game.restore(save,g.meta);assert.deepEqual(h.grid.slice(0,30),save.state.grid.slice(0,30));assert.deepEqual(h.enemies.filter(e=>e.y<30),save.state.enemies.filter(e=>e.y<30));assert.equal(h.player.hp,57);assert.equal(h.player.upgrades.edge,2);assert.equal(h.tacticsVersion,1);
  const again=Game.restore(JSON.parse(JSON.stringify(h.serialize())),h.meta);assert.deepEqual(again.grid,h.grid);assert.deepEqual(again.setpieces,h.setpieces);assert.deepEqual(again.enemies,h.enemies);
});
test('checkpoint tactics are offered alongside other choices and stop stacking at their advertised cap',()=>{
  const ids=new Set(TACTICAL_UPGRADES.map(u=>u.id)),g=arena();g.stats.rooms=1;g.offerLevel();assert.ok(g.choice.some(u=>ids.has(u.id)));assert.equal(new Set(g.choice.map(u=>u.id)).size,3);assert.ok(g.choice.some(u=>!ids.has(u.id)));
  for(const u of TACTICAL_UPGRADES)g.player.upgrades[u.id]=u.max;g.offerLevel();assert.ok(g.choice.every(u=>!ids.has(u.id)));
});
