import {createRequire} from 'node:module';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {Game} from '../src/engine.mjs';
import {Renderer} from '../src/render.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require(require.resolve('@napi-rs/canvas',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const icon=createCanvas(180,180);icon.getContext('2d').drawImage(await loadImage(await readFile(new URL('../icon.svg',import.meta.url))),0,0,180,180);await writeFile(new URL('../icon.png',import.meta.url),icon.toBuffer('image/png'));
const output=process.argv[2]||'/workspace/scratch/c25cf6779864/relic-render';await mkdir(output,{recursive:true});
const sheet=createCanvas(1080,1130),c=sheet.getContext('2d');c.fillStyle='#0a1419';c.fillRect(0,0,1080,1130);
for(let stage=0;stage<6;stage++){const g=new Game(2177);g.stage=stage;g.room=stage%2===1?2:0;g.loadFloor(stage%2===1?'boss':'runes');g.started=true;g.messageTimer=0;
  const can=createCanvas(360,520),r=new Renderer(can.getContext('2d'));r.resize(360,520);r.draw(g);c.drawImage(can,(stage%3)*360,Math.floor(stage/3)*565+32);c.fillStyle=g.biome.tint;c.font='bold 12px sans-serif';c.fillText(`${stage+1}. ${g.biome.sub}`,(stage%3)*360+14,Math.floor(stage/3)*565+22);
}
await writeFile(output+'/six-ruins.png',sheet.toBuffer('image/png'));
for(const [label,w,h,type]of [['portrait',430,490,'relic'],['landscape',490,235,'boss']]){const g=new Game(12);if(type==='boss'){g.stage=5;g.room=2;}g.loadFloor(type);g.player.x=7;g.player.y=type==='boss'?15:12;g.player.rx=g.player.x;g.player.ry=g.player.y;g.messageTimer=0;g.started=true;const can=createCanvas(w,h),r=new Renderer(can.getContext('2d'));r.resize(w,h);r.draw(g);await writeFile(output+'/'+label+'.png',can.toBuffer('image/png'));}
console.log(output);
