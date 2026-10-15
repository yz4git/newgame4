import {createRequire} from 'node:module';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {Game,ROWS} from '../src/engine.mjs';
import {Renderer} from '../src/render.mjs';
const require=createRequire(import.meta.url);
const {createCanvas,loadImage}=require(require.resolve('@napi-rs/canvas',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const icon=createCanvas(180,180),ic=icon.getContext('2d');ic.drawImage(await loadImage(await readFile(new URL('../icon.svg',import.meta.url))),0,0,180,180);await writeFile(new URL('../icon.png',import.meta.url),icon.toBuffer('image/png'));
const output=process.argv[2]||'/workspace/scratch/c25cf6779864/render-check';await mkdir(output,{recursive:true});
const sheet=createCanvas(1056,1240),c=sheet.getContext('2d');c.fillStyle='#09111b';c.fillRect(0,0,1056,1240);
for(let stage=0;stage<6;stage++){const g=new Game(2177);g.stage=stage;g.loadFloor();g.player.x=5;g.player.y=25;g.player.rx=5;g.player.ry=25;g.messageTimer=0;
  // A short excavated route shows the playable scale, caves and character together.
  for(let y=12;y<27;y++){g.grid[y][5]=null;if(y%4<2)g.grid[y][4]=null;}
  const can=createCanvas(352,570),r=new Renderer(can.getContext('2d'));r.resize(352,570);r.draw(g,1/60);c.drawImage(can,(stage%3)*352,Math.floor(stage/3)*620+40);c.fillStyle=g.biome.tint;c.font='bold 14px sans-serif';c.textAlign='left';c.fillText(`${stage+1}. ${g.biome.sub}`,(stage%3)*352+18,Math.floor(stage/3)*620+25);
}
await writeFile(output+'/six-biomes.png',sheet.toBuffer('image/png'));
const can=createCanvas(430,530),r=new Renderer(can.getContext('2d')),g=new Game(9);r.resize(430,530);g.player.y=10;g.player.ry=10;for(let y=4;y<11;y++)g.grid[y][5]=null;g.clearCells(g.component(4,10));g.scanFalls();r.draw(g);await writeFile(output+'/portrait.png',can.toBuffer('image/png'));
const bossCanvas=createCanvas(400,360),br=new Renderer(bossCanvas.getContext('2d'));g.stage=5;g.loadFloor();g.player.y=ROWS-2;g.player.ry=ROWS-2;g.boss.timer=.6;g.messageTimer=0;br.resize(400,360);br.draw(g);await writeFile(output+'/boss.png',bossCanvas.toBuffer('image/png'));
console.log(output);
