import {mkdir,rm,cp,readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const f of ['index.html','style.css','src','icon.svg','icon.png','manifest.webmanifest','sw.js']){await access(path.join(root,f));await cp(path.join(root,f),path.join(out,f),{recursive:true});}
const html=await readFile(path.join(out,'index.html'),'utf8');if(!html.includes('RELIC DELVE')||html.includes('codex-preview'))throw Error('Invalid game shell');
console.log('Built dependency-free static game in dist/');
