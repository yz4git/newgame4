import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,COLS,ROWS} from '../src/engine.mjs';
import {FeverGame,FEVER_DURATION} from '../src/fever.mjs';

const save=g=>JSON.stringify(g.serialize());
const tick=(g,n,input={})=>{for(let i=0;i<n;i++){g.step(1/60,input);g.events=[];}};
test('the arcade waits for its first gesture, then automatically mines for exactly 90 active seconds',()=>{
  const g=new FeverGame(42),before=save(g);tick(g,3600);assert.equal(save(g),before);
  g.step(1/60,{start:true});assert.ok(g.started);tick(g,600);assert.ok(g.depth>150);assert.ok(g.stats.blocks>100);assert.ok(g.fever.remaining<81);
  g.mode='pause';const paused=save(g);tick(g,3600,{rush:true,pulse:true,dir:'left'});assert.equal(save(g),paused);g.mode='play';
  tick(g,4800);assert.equal(g.mode,'fever-result');assert.equal(g.fever.remaining,0);assert.ok(Math.abs(g.time-FEVER_DURATION)<1e-6);assert.equal(g.player.hp,100);
  const result=save(g);tick(g,600,{rush:true,dir:'right',pulse:true});assert.equal(save(g),result);
});

test('a quick steering tap cuts through a seam and one hit starts a bounded enemy cascade',()=>{
  const g=new FeverGame(7);g.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||x===COLS-1||y===0||y===ROWS-1?{c:9,hp:999}:null));g.enemies=[];g.falling=[];
  Object.assign(g.player,{x:6,y:8,rx:6,ry:8});g.grid[8][7]={c:11,hp:3};g.step(1/60,{tap:'right'});assert.equal(g.player.x,7);assert.equal(g.at(7,8),null);
  const a=g.makeEnemy(4,14,'shield'),b=g.makeEnemy(5,14,'bomber'),c=g.makeEnemy(6,14,'rusher');g.enemies=[a,b,c];g.grid[14][7]={c:12,hp:1};g.attackEnemy(a,1,'dig');assert.equal(g.enemies.includes(a),false);
  g.processBlasts();assert.equal(g.enemies.length,0);assert.equal(g.stats.kills,3);assert.equal(g.at(7,14),null);assert.equal(g.blastQueue.length,0);assert.ok(g.fx.length<=35);
});

test('fever lasts ten seconds, grants three-column drilling and changes the score multiplier',()=>{
  const g=new FeverGame(1);g.started=true;const normal=g.multiplier;g.gainFever(100);assert.equal(g.fever.active,10);assert.equal(g.digColumns.length,3);assert.equal(g.multiplier,normal*3);assert.equal(g.fever.activations,1);
  g.gainFever(100);assert.equal(g.fever.activations,1);assert.equal(g.fever.meter,0);
  g.enemies=[];g.grid=g.grid.map(row=>row.map(t=>t?.c===9?t:null));g.autoTimer=1000;g.player.fallTimer=-1000;
  tick(g,599);assert.ok(g.fever.active>0);tick(g,2);assert.equal(g.fever.active,0);assert.equal(g.digColumns.length,1);
});

test('bumps reduce the bonus rather than ending the run, with time to recover',()=>{
  const g=new FeverGame(1);g.started=true;g.combo=20;g.fever.meter=60;g.damage(999);assert.equal(g.player.hp,100);assert.equal(g.mode,'play');assert.equal(g.combo,10);assert.equal(g.fever.mistakes,1);assert.equal(g.fever.meter,52);
  g.damage(999);assert.equal(g.fever.mistakes,1);g.player.invuln=0;g.damage(999);assert.equal(g.fever.mistakes,2);assert.equal(g.player.hp,100);
});

test('automatic upgrades and the final giant seam arrive without choice screens or expedition rewards',()=>{
  const g=new FeverGame(2177);g.step(1/60,{rush:true});tick(g,1200);assert.equal(g.fever.upgrades,1);assert.equal(g.mode,'play');tick(g,1500);assert.equal(g.fever.upgrades,2);tick(g,1980);assert.ok(g.fever.finale);assert.ok(g.stats.cascades>0);assert.equal(g.player.level,1);assert.equal(g.pendingLevels,0);
  tick(g,730);assert.equal(g.mode,'fever-result');assert.ok(g.fever.score>0);assert.equal(g.meta.cores,0);assert.equal(g.meta.runs,0);assert.ok(g.stats.rooms>=5);
});

test('resuming an arcade preserves its countdown, queued cascades, RNG and complete future',()=>{
  const g=new FeverGame(42);const input=i=>({rush:true,dir:Math.floor(i/57)%2?'left':'right',pulse:i%211===0});
  for(let i=0;i<1453;i++){g.step(1/60,input(i));g.events=[];}
  g.queueBlast(g.player.x,Math.min(70,g.player.y+2),2,'barrel');
  const h=FeverGame.restore(JSON.parse(save(g)));assert.equal(save(h),save(g));
  for(let i=1453;i<5405;i++){g.step(1/60,input(i));h.step(1/60,input(i));g.events=[];h.events=[];}
  assert.equal(save(h),save(g));assert.equal(h.mode,'fever-result');
  assert.throws(()=>FeverGame.restore(new Game(42).serialize()));const invalid=g.serialize();invalid.fever.remaining=Infinity;assert.throws(()=>FeverGame.restore(invalid));
});
