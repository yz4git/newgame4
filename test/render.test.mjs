import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.mjs';
import {FeverGame} from '../src/fever.mjs';
import {Renderer} from '../src/render.mjs';

function recordingContext(){
  const calls=[],values={},gradient={addColorStop(...a){calls.push(['stop',...a]);}};
  let depth=0;
  const ctx=new Proxy({},{
    get:(_,name)=>name in values?values[name]:name==='measureText'?text=>({width:text.length*6}):(...args)=>{
      if(name==='save')depth++;if(name==='restore')assert.ok(--depth>=0,'unbalanced canvas restore');
      calls.push([name,...args]);if(name==='createLinearGradient'||name==='createRadialGradient')return gradient;
    },
    set:(_,name,value)=>{values[name]=value;calls.push(['set',name,value===gradient?'gradient':value]);return true;}
  });return {ctx,calls,depth:()=>depth};
}
function freeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value))return;Object.freeze(value);for(const v of Object.values(value))freeze(v);}

test('painting all regions and guardian states leaves the world, cosmetics and RNG untouched',()=>{
  const {ctx,depth}=recordingContext(),r=new Renderer(ctx,{surfaceFactory:()=>null});r.resize(430,490);
  for(let stage=0;stage<6;stage++){
    const g=new Game(2177,null,'turn');g.stage=stage;g.room=stage%2?2:0;g.loadFloor(stage%2?'boss':'runes');
    for(let i=0;i<18&&g.mode==='play';i++)g.takeTurn({dir:'down'});
    const before=JSON.stringify(g),rng=g.rng.state();freeze(g);r.draw(g);
    if(g.boss)for(const state of ['warn','open']){const preview=Object.create(g,{boss:{value:{...g.boss,state,attack:{columns:[3,6],fromY:68}}}});r.draw(preview);}
    assert.equal(JSON.stringify(g),before);assert.equal(g.rng.state(),rng);assert.equal(depth(),0);
  }
});

test('turn-mode artwork stays still while the same decision is displayed',()=>{
  const g=new Game(9,null,'turn');for(let i=0;i<12;i++)g.takeTurn({dir:'down'});
  const {ctx,calls}=recordingContext(),r=new Renderer(ctx,{surfaceFactory:()=>null});r.resize(529,272);
  r.draw(g);const first=calls.slice();calls.length=0;r.draw(g,.5);assert.deepEqual(calls,first);
});

test('casual artwork can paint every arcade palette without changing the run or RNG',()=>{
  const {ctx,depth}=recordingContext(),r=new Renderer(ctx,{surfaceFactory:()=>null});r.resize(529,272);
  for(let stage=0;stage<6;stage++){
    const g=new FeverGame(42);g.sector=stage;g.loadArcadeFloor();
    for(let i=0;i<120;i++)g.step(1/60,{rush:true,dir:'right',pulse:i===60});g.gainFever(100);
    const before=JSON.stringify(g),rng=g.rng.state();freeze(g);r.draw(g);
    assert.equal(JSON.stringify(g),before);assert.equal(g.rng.state(),rng);assert.equal(depth(),0);
  }
});
