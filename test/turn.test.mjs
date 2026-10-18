import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,COLS,ROWS,TURN_TIME} from '../src/engine.mjs';
import {prepareBoss} from '../src/boss.mjs';
import {TurnInput} from '../src/turn-input.mjs';
import {playRun} from './helpers/pilot.mjs';

function arena(){
  const g=new Game(42,null,'turn');g.enemies=[];g.falling=[];g.fixtures=[];g.hazards=[];g.broods=[];g.boss=null;g.swarmBudget=0;
  g.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||x===COLS-1||y===0||y===ROWS-1||y===9?{c:9,hp:999}:null));
  Object.assign(g.player,{x:6,y:8,rx:6,ry:8,maxY:8,shield:0,invuln:0});return g;
}
function world(g){const s=structuredClone(g.serialize().state);for(const e of s.enemies)delete e.flash;if(s.boss)delete s.boss.flash;return s;}
const idle=(g,n=1200)=>{for(let i=0;i<n;i++)g.step(1/60);};
test('turn mode freezes the complete world clock, actors, terrain, danger and cooldowns between actions',()=>{
  const g=arena();g.enemies=[g.makeEnemy(3,8,'spitter')];g.hazards=[{x:7,y:8,delay:.8,radius:0,damage:20,kind:'bolt',hit:false}];g.grid[4][3]={c:0,hp:1};
  g.takeTurn({wait:true});const before=world(g);idle(g,3600);assert.deepEqual(world(g),before);assert.equal(g.turnCount,1);assert.equal(g.time,TURN_TIME);
});
test('one movement, mining hit or attack gives the world exactly one response',()=>{
  const g=arena(),e=g.makeEnemy(2,8,'swarm');e.timer=0;g.enemies=[e];
  assert.equal(g.takeTurn({dir:'right'}),true);assert.equal(g.player.x,7);assert.equal(e.x,3);assert.equal(e.rx,3);assert.equal(g.turnCount,1);
  g.grid[8][8]={c:11,hp:3};g.takeTurn({dir:'right'});assert.equal(g.at(8,8).hp,2);assert.equal(g.player.x,7);assert.equal(g.turnCount,2);
  const foe=g.makeEnemy(8,8,'shield');g.grid[8][8]=null;g.enemies=[foe];const hp=foe.hp;g.takeTurn({dir:'right'});assert.ok(foe.hp<hp);assert.equal(g.turnCount,3);
});
test('an enemy approaches, then warns; a drill hit interrupts the warned strike',()=>{
  const g=arena(),e=g.makeEnemy(4,8,'swarm');e.timer=0;g.enemies=[e];g.takeTurn({wait:true});assert.equal(e.x,5);assert.equal(g.player.hp,100);
  g.takeTurn({wait:true});assert.equal(g.player.hp,100);assert.equal(e.intent.kind,'bite');g.takeTurn({dir:'left'});assert.equal(e.intent,null);assert.equal(g.player.hp,100);g.takeTurn({dir:'left'});assert.equal(g.enemies.length,0);assert.equal(g.player.hp,100);
});
test('damage and shield loss leave two actions to respond, while realtime damage timing is unchanged',()=>{
  for(const shield of [0,1]){
    const g=arena();g.player.shield=shield;const danger=()=>{g.hazards.push({x:6,y:8,delay:0,radius:0,damage:6,kind:'bolt',hit:false});g.takeTurn({wait:true});};
    danger();const hp=g.player.hp;assert.equal(hp,shield?100:94);assert.equal(g.player.shield,0);
    for(let i=0;i<2;i++){danger();assert.equal(g.player.hp,hp);}
    danger();assert.equal(g.player.hp,hp-6);
  }
  const g=arena();g.setClockMode('realtime');g.damage(6);assert.equal(g.player.invuln,1.05);g.player.invuln=0;g.player.shield=1;g.damage(6);assert.equal(g.player.invuln,1.1);
});
test('falling masses give a whole input opportunity of warning, then fall one cell per action',()=>{
  const g=arena();g.grid[4][3]={c:0,hp:1};g.takeTurn({wait:true});const f=g.falling.find(f=>f.cells.some(c=>c.x===3));assert.ok(f);assert.equal(f.cells[0].y,4);assert.ok(f.delay>0);
  const before=structuredClone(f);idle(g);assert.deepEqual(f,before);g.takeTurn({wait:true});assert.equal(f.cells[0].y,5);g.takeTurn({wait:true});assert.equal(f.cells[0].y,6);
});
test('down and a supported upward hop each move one vertical cell and remain there while idle',()=>{
  const g=arena();g.grid[9][6]=null;g.takeTurn({dir:'down'});assert.equal(g.player.y,9);idle(g);assert.equal(g.player.y,9);
  const h=arena();h.takeTurn({dir:'up'});assert.equal(h.player.y,7);idle(h);assert.equal(h.player.y,7);h.takeTurn({wait:true});assert.equal(h.player.y,8);
});
test('attributes, walls, unavailable actions and all modal screens consume no turns',()=>{
  const g=arena();g.grid[8][7]={c:9,hp:999};const before=world(g);assert.equal(g.takeTurn({dir:'right'}),false);assert.equal(g.takeTurn({heal:true}),false);assert.deepEqual(world(g),before);
  g.takeTurn({element:2});assert.equal(g.player.element,2);assert.equal(g.turnCount,0);assert.equal(g.time,0);
  for(const mode of ['pause','level','loot','route','camp','dead','win']){g.mode=mode;assert.equal(g.takeTurn({wait:true}),false);idle(g,10);assert.equal(g.time,0);}
});
test('potions and resonance consume one action each and cooldowns require more actions to elapse',()=>{
  const g=arena();g.player.hp=30;g.player.element=0;const pots=g.player.potions;
  g.takeTurn({heal:true,pulse:true,dir:'right'});assert.equal(g.player.potions,pots-1);assert.equal(g.player.x,6);assert.equal(g.stats.casts,0);assert.equal(g.turnCount,1);
  g.takeTurn({pulse:true});assert.equal(g.stats.casts,1);const cooldown=g.player.pulseTimer;idle(g);assert.equal(g.player.pulseTimer,cooldown);assert.equal(g.takeTurn({pulse:true}),false);assert.equal(g.turnCount,2);
  g.takeTurn({wait:true});assert.equal(g.player.pulseTimer,cooldown-1);
});
test('specialists expose their windup for a decision and rushes finish on the next action',()=>{
  const g=arena(),e=g.makeEnemy(3,8,'rusher');g.player.x=7;g.enemies=[e];g.takeTurn({wait:true});assert.equal(e.intent.kind,'rush');assert.equal(e.x,3);
  const intent=structuredClone(e.intent);idle(g);assert.deepEqual(e.intent,intent);g.takeTurn({dir:'up'});assert.equal(e.intent,null);assert.equal(e.x,6);assert.equal(e.rx,6);assert.equal(g.player.hp,100);
});
test('guardian column warnings allow two moves and do not progress while the player thinks',()=>{
  const g=arena();Object.assign(g.player,{x:6,y:74,rx:6,ry:74,maxY:74});g.boss=prepareBoss({x:6,y:72,hp:400,maxHp:400,flash:0});
  g.takeTurn({wait:true});g.takeTurn({wait:true});assert.equal(g.boss.state,'warn');const before=world(g);idle(g);assert.deepEqual(world(g),before);
  g.takeTurn({dir:'left'});assert.equal(g.boss.state,'warn');g.takeTurn({dir:'left'});assert.equal(g.player.x,4);assert.equal(g.boss.state,'open');assert.equal(g.player.hp,100);
});
test('crack warnings and newborn creatures do not act or hit in the turn they appear',()=>{
  const g=arena();g.broods=[{x:3,y:8,type:'bomber',delay:.6,max:.6}];g.swarmBudget=1;g.takeTurn({wait:true});const e=g.enemies[0];assert.ok(e);assert.equal(e.intent,null);assert.equal(e.x,3);assert.equal(g.player.hp,100);idle(g);assert.equal(e.intent,null);
  g.takeTurn({wait:true});assert.equal(e.intent.kind,'bomb');
});
test('a turn save resumes the same future without granting invulnerability or spending a turn',()=>{
  const g=arena();g.grid[4][3]={c:1,hp:1};g.enemies=[g.makeEnemy(3,8,'spitter')];g.takeTurn({wait:true});g.player.invuln=.2;
  const h=Game.restore(JSON.parse(JSON.stringify(g.serialize())),g.meta);assert.deepEqual(world(h),world(g));idle(h);assert.deepEqual(world(h),world(g));
  for(const input of [{dir:'right'},{wait:true},{dir:'left'},{pulse:true}]){g.takeTurn(input);h.takeTurn(input);assert.deepEqual(world(h),world(g));}
});
test('clock switching preserves the build and elapsed state, and old saves retain realtime behavior',()=>{
  const g=arena();g.takeTurn({wait:true});const before=world(g);g.setClockMode('realtime');assert.equal(g.player.hp,before.player.hp);assert.equal(g.turnCount,1);g.setClockMode('turn');assert.deepEqual(world(g),before);
  const saved=JSON.parse(JSON.stringify(g.serialize()));delete saved.state.clockMode;delete saved.state.turnCount;const old=Game.restore(saved,g.meta);assert.equal(old.clockMode,'realtime');old.step(1/60);assert.ok(old.time>g.time);
});
test('quick taps survive release before a frame, while cancelling and focus loss remove pending input',()=>{
  const q=new TurnInput();q.press('p:1',{dir:'left'},0);q.release('p:1');assert.deepEqual(q.next(16),{dir:'left'});assert.equal(q.next(1000),null);
  q.press('p:2',{wait:true},1000);q.release('p:2',true);assert.equal(q.next(1100),null);q.press('p:3',{dir:'down'},1200);q.clear();assert.equal(q.next(2000),null);
});
test('held input has a deliberate repeat delay and never catches up missed frames',()=>{
  const q=new TurnInput();q.press('k:down',{dir:'down'},0);assert.deepEqual(q.next(0),{dir:'down'});assert.equal(q.next(449),null);assert.deepEqual(q.next(450),{dir:'down'});assert.equal(q.next(451),null);
  assert.deepEqual(q.next(100000),{dir:'down'});assert.equal(q.next(100001),null);q.release('k:down');assert.equal(q.next(200000),null);
});
test('direction plus the large button always digs, without inserting or repeating a wait',()=>{
  for(const order of [['dir','wait'],['wait','dir']]){
    const q=new TurnInput(),actions={dir:{dir:'down'},wait:{wait:true}};
    order.forEach((id,i)=>q.press(id,actions[id],i));assert.deepEqual(q.next(16),{dir:'down'});assert.equal(q.next(32),null);
    assert.deepEqual(q.next(500),{dir:'down'});q.release('dir');assert.equal(q.next(2000),null);
    q.release('wait');q.press('wait',{wait:true},2100);assert.deepEqual(q.next(2100),{wait:true});assert.equal(q.next(9000),null);
  }
});
test('a danger stop requires a fresh directional press and preserves deliberate recovery commands',()=>{
  const q=new TurnInput();q.press('down',{dir:'down'},0);q.next(0);q.enqueue({heal:true});q.suspend();
  assert.equal(q.suspended,true);assert.deepEqual(q.next(16),{heal:true});assert.equal(q.next(10000),null);
  q.press('down',{dir:'down'},10001);assert.equal(q.next(11000),null);
  q.release('down');q.press('down',{dir:'down'},12000);assert.equal(q.suspended,false);assert.deepEqual(q.next(12001),{dir:'down'});
  const g=arena();assert.equal(g.turnDanger,false);g.enemies=[g.makeEnemy(4,8,'swarm')];assert.equal(g.turnDanger,true);
  g.grid[8][5]={c:10,hp:1};assert.equal(g.turnDanger,false);g.enemies=[];
  g.hazards=[{x:7,y:8,radius:0,hit:false}];assert.equal(g.turnDanger,true);g.hazards=[];
  g.falling=[{cells:[{x:6,y:5}]}];assert.equal(g.turnDanger,true);g.falling=[];
  g.collapseFront=4;assert.equal(g.turnDanger,true);
});
test('lethal responses end a turn without allowing later kill healing to revive the explorer',()=>{
  const g=arena();g.player.hp=1;const e=g.makeEnemy(5,8,'swarm');e.timer=0;g.enemies=[e];g.takeTurn({wait:true});assert.equal(g.mode,'play');g.takeTurn({wait:true});assert.equal(g.mode,'dead');assert.equal(g.player.hp,0);g.heal(40);assert.equal(g.player.hp,0);assert.equal(g.takeTurn({wait:true}),false);
});
test('a new explorer can cross the first stratum with simple digging and potions, without a spell or dodge build',()=>{
  for(let seed=1;seed<=24;seed++){
    const g=new Game(seed,null,'turn');
    for(let i=0;i<240&&g.mode==='play';i++){
      const input=g.player.hp<45&&g.player.potions?{heal:true}:{dir:'down'};
      if(!g.takeTurn(input))g.takeTurn({wait:true});
      g.events=[];
    }
    assert.equal(g.stats.rooms,1,`seed ${seed}: ${g.mode} at ${g.turnCount} turns`);assert.ok(g.player.hp>0);assert.ok(g.stats.kills>=30);assert.ok(g.stats.cascades>2);assert.equal(g.stats.casts,0);
  }
});
test('ordinary turn inputs can complete all eighteen strata, keep cascades and defeat three guardians',()=>{
  const {game:g,frames}=playRun(1,null,4000,'turn');assert.equal(g.mode,'win');assert.equal(g.stats.rooms,18);assert.equal(g.stats.bosses,3);assert.ok(g.stats.cascades>100);assert.ok(frames<3000);assert.ok(g.turnCount>1000);
});
