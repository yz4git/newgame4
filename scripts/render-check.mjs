import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.mjs';
import {Renderer} from '../src/render.mjs';
const require=createRequire(import.meta.url),{createCanvas}=require(require.resolve('@napi-rs/canvas',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const output=process.argv[2]||'/workspace/scratch/relic-render';await mkdir(output,{recursive:true});
function descend(stage,room=0){
  const g=new Game(2177,null,'turn');g.stage=stage;g.room=room;g.loadFloor(room===2?'boss':'runes');
  for(let i=0;i<22&&g.mode==='play';i++){
    if(!g.takeTurn(g.player.hp<45&&g.player.potions?{heal:true}:{dir:'down'}))g.takeTurn({wait:true});
  }
  assert.equal(g.mode,'play');assert.equal(g.at(g.player.x,g.player.y),null);g.messageTimer=0;
  for(let i=0;i<80;i++)g.step(1/60);return g;
}
function paint(g,w,h){const can=createCanvas(w,h),r=new Renderer(can.getContext('2d'),{surfaceFactory:createCanvas});r.resize(w,h);r.draw(g);return can;}
const sheet=createCanvas(1080,1130),c=sheet.getContext('2d');c.fillStyle='#0a1419';c.fillRect(0,0,1080,1130);
for(let stage=0;stage<6;stage++){
  const g=descend(stage),can=paint(g,360,520);c.drawImage(can,(stage%3)*360,Math.floor(stage/3)*565+32);c.fillStyle=g.biome.tint;c.font='bold 12px sans-serif';c.fillText(`${stage+1}. ${g.biome.sub}`,(stage%3)*360+14,Math.floor(stage/3)*565+22);
}
await writeFile(output+'/six-ruins.png',sheet.toBuffer('image/png'));
for(const [label,w,h]of [['portrait',430,490],['landscape',529,272]])await writeFile(output+'/'+label+'.png',paint(descend(0),w,h).toBuffer('image/png'));
console.log(output);
