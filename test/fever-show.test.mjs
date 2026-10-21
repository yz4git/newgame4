import test from 'node:test';
import assert from 'node:assert/strict';
import {FeverGame} from '../src/fever.mjs';
import {FeverShow,drawFeverImpact,drawFeverShow} from '../src/fever-show.mjs';

const ctx=()=>new Proxy({measureText:s=>({width:s.length*6})},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
test('celebrations are bounded, expire on game time, and never change world or RNG',()=>{
 const g=new FeverGame(42),show=new FeverShow();show.update(g);const before=JSON.stringify(g.serialize()),rng=g.rng.state();
 for(let i=0;i<300;i++){show.time=i*.1;show.burst(6,7,18);show.celebrate(44);}
 assert.ok(show.sparks.length<=72);assert.ok(show.impacts.length<=10);assert.ok(show.confetti.length<=60);
 show.receive(g,{type:'fever'});show.receive(g,{type:'chain',count:25,combo:20});drawFeverImpact(ctx(),30,g,show);drawFeverShow(ctx(),430,520,g,show);
 assert.equal(JSON.stringify(g.serialize()),before);assert.equal(g.rng.state(),rng);
 const snapshot=JSON.stringify([show.sparks,show.banner]);g.mode='pause';for(let i=0;i<60;i++)show.update(g);assert.equal(JSON.stringify([show.sparks,show.banner]),snapshot);
 g.time+=40;show.update(g);assert.equal(show.sparks.length,0);assert.equal(show.confetti.length,0);assert.equal(show.banner,null);
});
test('countdown crosses each second once, and restore/retry do not replay old celebrations',()=>{
 const g=new FeverGame(7),show=new FeverShow();g.started=true;g.fever.remaining=3.2;show.update(g);
 g.fever.remaining=2.99;g.time+=.21;assert.deepEqual(show.update(g),[{type:'feverTick',count:3}]);assert.deepEqual(show.update(g),[]);
 g.mode='pause';g.time+=.01;assert.deepEqual(show.update(g),[]);g.mode='play';g.fever.remaining=1.99;g.time++;assert.deepEqual(show.update(g),[{type:'feverTick',count:2}]);
 const restored=new FeverGame(8);restored.started=true;restored.fever.remaining=1.5;restored.fever.active=2;assert.deepEqual(show.update(restored),[]);assert.equal(show.banner,null);assert.equal(show.entryScore,null);
 show.receive(restored,{type:'fever'});restored.time+=10;restored.fever.score+=500;restored.fever.active=0;restored.fever.remaining=5;assert.deepEqual(show.update(restored),[{type:'feverOut'}]);assert.equal(show.banner.sub,'+500 POINTS');assert.deepEqual(show.update(restored),[]);
 show.update(new FeverGame(9));assert.equal(show.banner,null);assert.equal(show.confetti.length,0);
});
test('reduced motion keeps announcements and cues without moving particles',()=>{
 const g=new FeverGame(4),show=new FeverShow({reducedMotion:true});show.update(g);show.receive(g,{type:'fever'});assert.equal(show.banner.title,'FEVER!');show.receive(g,{type:'chain',combo:20,count:35});assert.equal(show.confetti.length,0);assert.equal(show.sparks.length,0);assert.equal(show.impacts.length,0);
});


test('crystal showers and kill relays stay bounded, freeze while paused, and clear across sectors',()=>{
 const g=new FeverGame(11),show=new FeverShow();show.update(g);const before=JSON.stringify(g.serialize()),rng=g.rng.state();
 for(let i=0;i<200;i++){g.time=i*.02;show.update(g);show.receive(g,{type:'kill',x:5+i%3,y:5});show.receive(g,{type:'chain',count:50,combo:1,x:6,y:5,color:2});}
 const j=show.juice;assert.ok(j.shards.length>0&&j.shards.length<=48);assert.ok(j.relays.length>0&&j.relays.length<=18);assert.ok(j.pickups.length<=20);assert.ok(j.labels.length<=1);
 g.mode='pause';const paused=JSON.stringify(j);for(let i=0;i<10;i++)show.update(g);assert.equal(JSON.stringify(j),paused);assert.equal(g.rng.state(),rng);
 const current=JSON.parse(JSON.stringify(g.serialize()));current.game.state.time=0;current.game.state.mode='play';assert.deepEqual(current,JSON.parse(before));
 g.sector++;show.update(g);for(const key of ['shards','pickups','relays','labels'])assert.equal(j[key].length,0);assert.equal(j.lastKill,null);
 show.receive(g,{type:'chain',count:50,combo:1});g.time+=4;show.update(g);for(const key of ['shards','pickups','relays','labels'])assert.equal(j[key].length,0);
 show.update(new FeverGame(12));assert.equal(show.juice.boost,false);assert.equal(show.juice.lastKill,null);
});
