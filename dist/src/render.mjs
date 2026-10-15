import {COLS,ROWS,PALETTE} from './engine.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tint=(hex,n)=>{const v=parseInt(hex.slice(1),16);return `rgb(${clamp((v>>16)+n,0,255)},${clamp(((v>>8)&255)+n,0,255)},${clamp((v&255)+n,0,255)})`;};
function path(ctx,points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export class Renderer {
  constructor(ctx){this.c=ctx;this.w=500;this.h=700;this.cam=0;this.clock=0;this.lastStage=-1;}
  resize(w,h){this.w=w;this.h=h;this.cell=Math.min(w/12.2,h/12.5);this.left=(w-COLS*this.cell)/2;}
  draw(g,dt=1/60,home=false){
    const c=this.c,w=this.w,h=this.h,s=this.cell;this.clock+=dt;
    const visible=h/s,target=clamp(g.player.ry-4.8,0,Math.max(0,ROWS-visible));if(this.lastStage!==g.stage){this.cam=target;this.lastStage=g.stage;}this.cam+=(target-this.cam)*Math.min(1,dt*7);
    const grad=c.createLinearGradient(0,0,w,h);grad.addColorStop(0,g.biome.bg);grad.addColorStop(1,'#070d18');c.fillStyle=grad;c.fillRect(0,0,w,h);
    c.save();if(g.shake>0)c.translate(Math.sin(this.clock*153)*g.shake*9,Math.cos(this.clock*117)*g.shake*7);
    c.save();c.translate(this.left,-this.cam*s);
    this.drawCave(g);
    const start=Math.max(0,Math.floor(this.cam)-1),end=Math.min(ROWS,Math.ceil(this.cam+visible)+2);
    // Depth lines make progress visible without obscuring the playable area.
    for(let y=start;y<end;y++){if(y%8===0){c.fillStyle='#ffffff10';c.fillRect(0,y*s,COLS*s,1);c.fillStyle='#a9bed552';c.font=`600 ${s*.19}px monospace`;c.textAlign='left';c.fillText(`${g.stage*200+Math.round(y/80*200)}m`,2,y*s-4);}}
    for(let y=start;y<end;y++)for(let x=0;x<COLS;x++){const t=g.grid[y][x];if(t)this.tile(x,y,t,s,false,g);}
    for(const f of g.falling){const warning=f.delay>0;
      if(warning){for(const p of f.cells){if(!f.cells.some(k=>k.x===p.x&&k.y>p.y)){c.fillStyle=`rgba(255,174,85,${.05+Math.sin(this.clock*15)*.025})`;c.fillRect(p.x*s,(p.y+1)*s,s,6*s);}}}
      for(const p of f.cells){if(p.y<start-1||p.y>end)continue;const off=warning?Math.sin(this.clock*35)*.025:f.offset;this.tile(p.x+(warning?off:0),p.y+(warning?0:off),p.t,s,warning,g);}
      if(warning){const low=f.cells.reduce((a,b)=>a.y>b.y?a:b);c.fillStyle='#ffc979';c.font=`bold ${s*.32}px sans-serif`;c.textAlign='center';c.fillText('▼',(low.x+.5)*s,(low.y+1.35)*s);}
    }
    this.gate(g);
    for(const hz of g.hazards||[]){const xx=(hz.x+.5)*s,yy=(hz.y+.5)*s,col=hz.kind==='spore'?'#bef0a0':'#ffb078';c.globalAlpha=hz.delay>0?.3+Math.sin(this.clock*19)*.12:Math.max(0,1+hz.delay*3);c.fillStyle=col;c.fillRect((hz.x-hz.radius)*s,hz.y*s,s*(1+hz.radius*2),s);c.strokeStyle=col;c.lineWidth=1.5;rr(c,(hz.x-hz.radius)*s+2,hz.y*s+2,s*(1+hz.radius*2)-4,s-4,4,null,col);c.globalAlpha=1;c.fillStyle=col;c.font=`800 ${s*.4}px monospace`;c.textAlign='center';c.fillText('!',xx,yy+s*.14);}
    if(g.boss&&g.boss.y>=start-3&&g.boss.y<=end+3)this.boss(g);
    for(const e of g.enemies)if(e.ry>=start-2&&e.ry<=end+2)this.enemy(e,g);
    for(const p of g.particles){if(p.y<start||p.y>end)continue;c.globalAlpha=Math.min(1,p.life*3);c.fillStyle=p.color;c.save();c.translate(p.x*s,p.y*s);c.rotate(p.life*4);c.fillRect(-p.size*s/2,-p.size*s/2,p.size*s,p.size*s);c.restore();}c.globalAlpha=1;
    this.miner(g);
    if(g.pulseFx){const f=g.pulseFx,progress=1-f.life/.45;c.globalAlpha=(1-progress)*.7;c.strokeStyle='#a3ffdf';c.lineWidth=s*.1*(1-progress);c.beginPath();c.arc(f.x*s,f.y*s,s*(.5+progress*3.2),0,Math.PI*2);c.stroke();c.globalAlpha=1;}
    for(const f of g.texts){c.globalAlpha=Math.min(1,f.life*3);c.font=`800 ${s*(f.s.includes('CHAIN')?.42:.32)}px sans-serif`;c.textAlign='center';c.lineWidth=4;c.strokeStyle='#101928';c.strokeText(f.s,f.x*s,f.y*s);c.fillStyle=f.color;c.fillText(f.s,f.x*s,f.y*s);}c.globalAlpha=1;
    c.restore();
    // Subtle top/bottom shade establishes depth; the player's cell stays bright.
    const v=c.createLinearGradient(0,0,0,h);v.addColorStop(0,'#080e1855');v.addColorStop(.12,'#080e1800');v.addColorStop(.82,'#080e1800');v.addColorStop(1,'#080e1877');c.fillStyle=v;c.fillRect(0,0,w,h);
    if(g.player.air<25&&g.started&&g.mode==='play'){c.strokeStyle=`rgba(255,112,130,${.3+Math.sin(this.clock*5)*.18})`;c.lineWidth=6;c.strokeRect(3,3,w-6,h-6);}
    if(g.flash>0){c.fillStyle=`rgba(255,81,112,${g.flash*.8})`;c.fillRect(0,0,w,h);}
    if(g.messageTimer>0&&!home){c.textAlign='center';c.font=`600 ${Math.min(13,w*.032)}px sans-serif`;const tw=Math.min(w-24,c.measureText(g.message).width+34);rr(c,(w-tw)/2,14,tw,32,16,'#101e30df','#97f1d82f');c.fillStyle='#d7f7ee';c.fillText(g.message,w/2,35);}
    if(!g.started&&!home){c.textAlign='center';c.font=`600 ${Math.min(13,w*.033)}px sans-serif`;rr(c,w/2-123,h-56,246,34,17,'#101e30e8','#ffffff1f');c.fillStyle='#e3f7ed';c.fillText('▼ 十字キーで掘り進もう',w/2,h-34);}
    c.restore();
  }
  drawCave(g){const c=this.c,s=this.cell;const top=Math.max(0,Math.floor(this.cam)-2),end=Math.min(ROWS,Math.ceil(this.cam+this.h/s)+2);
    // Individual silhouettes and strata live outside the mining grid.
    for(let y=top;y<end;y++){
      const n=Math.sin(y*57.17+g.stage*31);c.fillStyle=y%2?'#1b2a35':'#17232e';path(c,[[-s,y*s],[n*s*.12,y*s],[-s*.08,(y+1)*s],[-s,(y+1)*s]]);c.fill();path(c,[[COLS*s,y*s],[(COLS+1)*s,y*s],[(COLS+1)*s,(y+1)*s],[(COLS-.06+n*.06)*s,(y+1)*s]]);c.fill();
      if(y%3===0){c.strokeStyle=g.biome.tint+'25';c.lineWidth=1;c.beginPath();c.moveTo(-s*.3,y*s);c.lineTo(s*.06,(y+.4)*s);c.lineTo(-s*.25,(y+.8)*s);c.stroke();c.beginPath();c.moveTo((COLS+.3)*s,y*s);c.lineTo((COLS-.02)*s,(y+.45)*s);c.stroke();}
      if(y%5===0){for(const x of [-.23,COLS+.23]){const gl=c.createRadialGradient(x*s,(y+.5)*s,0,x*s,(y+.5)*s,s*1.4);gl.addColorStop(0,g.biome.tint+'24');gl.addColorStop(1,g.biome.tint+'00');c.fillStyle=gl;c.fillRect((x-1.4)*s,(y-.9)*s,2.8*s,2.8*s);c.fillStyle=g.biome.tint;path(c,[[x*s,(y+.2)*s],[(x+.10)*s,(y+.5)*s],[x*s,(y+.67)*s],[(x-.1)*s,(y+.5)*s]]);c.fill();}}
    }
    if(top<5){c.fillStyle='#192d36';c.fillRect(0,4.95*s,COLS*s,.04*s);for(let x=0;x<3;x++){const px=(x*4+1)*s;c.fillStyle='#284750';c.fillRect(px,0,s*.1,s*1.1);c.fillStyle='#70b59a';path(c,[[px-s*.25,s*.7],[px+s*.06,s],[px+s*.33,s*.6],[px+s*.06,s*.9]]);c.fill();}c.fillStyle='#a4cab6';c.font=`700 ${s*.22}px monospace`;c.textAlign='center';c.fillText('SURFACE CAMP  /  00',COLS*s/2,s*1.05);}
    // Sparse drifting motes in the empty shaft.
    c.fillStyle=g.biome.tint+'30';for(let i=0;i<20;i++){const x=((Math.sin(i*76.5)*.5+.5)*COLS)*s,y=((i*79.13+this.clock*3)%(this.h+80))-40+this.cam*s;c.fillRect(x,y,i%3===0?2:1,i%3===0?2:1);}
  }
  tile(x,y,t,s,warning,g){const c=this.c,px=x*s,py=y*s,p=s*.045,w=s-p*2;
    if(t.c===9){c.fillStyle='#30414d';c.fillRect(px,py,s,s);c.strokeStyle='#8198a02f';c.lineWidth=1;path(c,[[px,py+s*.25],[px+s*.4,py+s*.4],[px+s*.55,py+s*.1],[px+s,py+s*.35]]);c.stroke();return;}
    if(t.c>=5){this.item(px,py,t.c,s);return;}
    const base=t.c===4?'#667483':PALETTE[t.c],n=((x*13+y*7)%5-2)*3;const face=tint(base,n);
    rr(c,px+p,py+p+2,w,w,s*.13,'#02071188');rr(c,px+p,py+p,w,w,s*.12,face);
    c.fillStyle=tint(base,29);path(c,[[px+p,py+p+s*.1],[px+p+s*.12,py+p],[px+s-p-s*.1,py+p],[px+s-p,py+p+s*.1],[px+s-p-s*.10,py+s*.20],[px+s*.19,py+s*.20]]);c.fill();
    c.fillStyle=tint(base,-36);path(c,[[px+p,py+s*.76],[px+s*.19,py+s*.83],[px+s*.84,py+s*.83],[px+s-p,py+s*.72],[px+s-p,py+s-p-s*.08],[px+s*.83,py+s-p],[px+s*.15,py+s-p],[px+p,py+s*.85]]);c.fill();
    c.strokeStyle='#ffffff36';c.lineWidth=1;rr(c,px+s*.105,py+s*.105,s*.79,s*.72,s*.085,null,'#ffffff36');
    if(t.c===4){c.strokeStyle='#263542';c.lineWidth=s*.045;path(c,[[px+s*.12,py+s*.3],[px+s*.43,py+s*.48],[px+s*.37,py+s*.77]]);c.stroke();path(c,[[px+s*.6,py+s*.2],[px+s*.68,py+s*.46],[px+s*.86,py+s*.58]]);c.stroke();if(t.hp<3){c.lineWidth=1.7;c.beginPath();c.moveTo(px+s*.3,py+s*.1);c.lineTo(px+s*.6,py+s*.6);c.lineTo(px+s*.4,py+s*.9);c.stroke();}}
    else {const z=(x*11+y*17)%7;c.fillStyle='#ffffff24';path(c,[[px+s*.21,py+s*.28],[px+s*(z%2?.52:.42),py+s*.23],[px+s*.38,py+s*.54],[px+s*.22,py+s*.57]]);c.fill();c.fillStyle=tint(base,-21);if(z<3){path(c,[[px+s*.66,py+s*.5],[px+s*.77,py+s*.61],[px+s*.64,py+s*.75],[px+s*.54,py+s*.62]]);c.fill();}else {c.fillRect(px+s*.64,py+s*.36,s*.08,s*.08);c.fillRect(px+s*.53,py+s*.58,s*.05,s*.05);}}
    if(t.c<4&&(x+y)%3===0){c.lineWidth=s*.028;c.strokeStyle='#10263530';const cx=px+s*.52,cy=py+s*.49;
      if(g.stage===1){c.beginPath();c.arc(cx,cy,s*.14,.3,5.6);c.stroke();c.beginPath();c.arc(cx,cy,s*.065,.3,5.2);c.stroke();}
      if(g.stage===2){c.strokeStyle='#e7f9ff40';c.beginPath();c.arc(cx+s*.12,cy,s*.07,0,7);c.stroke();c.beginPath();c.arc(cx-s*.1,cy+s*.1,s*.04,0,7);c.stroke();}
      if(g.stage===3){c.fillStyle='#edf5dd35';for(let n=0;n<3;n++){c.beginPath();c.arc(cx+(n-1)*s*.14,cy-Math.sin(n*2)*s*.11,s*.045,0,7);c.fill();}}
      if(g.stage===4){c.beginPath();c.moveTo(px+s*.17,cy);c.lineTo(cx,cy);c.lineTo(cx,py+s*.27);c.lineTo(px+s*.82,py+s*.27);c.stroke();c.fillStyle='#12243130';c.fillRect(cx-s*.04,cy-s*.04,s*.08,s*.08);}
      if(g.stage===5){path(c,[[cx,cy-s*.15],[cx+s*.11,cy],[cx,cy+s*.15],[cx-s*.11,cy]]);c.stroke();}
    }
    if(warning){rr(c,px+p,py+p,w,w,s*.12,null,`rgba(255,224,155,${.5+Math.sin(this.clock*25)*.3})`);}
  }
  item(x,y,type,s){const c=this.c,t=this.clock;const bob=Math.sin(t*3+x)*s*.035;
    const glow=c.createRadialGradient(x+s*.5,y+s*.5,1,x+s*.5,y+s*.5,s*.7);const color=type===5?'#70efd5':type===6?'#ffda72':type===7?'#ff8aab':'#f8cc7c';glow.addColorStop(0,color+'28');glow.addColorStop(1,color+'00');c.fillStyle=glow;c.fillRect(x-s*.2,y-s*.2,s*1.4,s*1.4);
    c.save();c.translate(x+s*.5,y+s*.5+bob);
    if(type===5){rr(c,-s*.24,-s*.36,s*.48,s*.72,s*.13,'#123d43','#89ffe0');rr(c,-s*.14,-s*.23,s*.28,s*.30,s*.06,'#65e8c9');c.fillStyle='#aaffdf';c.font=`800 ${s*.21}px sans-serif`;c.textAlign='center';c.fillText('O₂',0,s*.25);c.fillStyle='#d4ffec';c.fillRect(-s*.12,-s*.43,s*.24,s*.07);}
    if(type===6){path(c,[[0,-s*.36],[s*.27,-s*.11],[s*.22,s*.17],[0,s*.35],[-s*.24,s*.16],[-s*.25,-s*.12]]);c.fillStyle='#ffce68';c.fill();path(c,[[0,-s*.36],[s*.03,-s*.02],[s*.27,-s*.11]]);c.fillStyle='#fff0b1';c.fill();path(c,[[0,s*.35],[s*.03,-s*.02],[s*.22,s*.17]]);c.fillStyle='#d59136';c.fill();c.strokeStyle='#fff1c0';c.lineWidth=1;c.stroke();}
    if(type===7){rr(c,-s*.29,-s*.29,s*.58,s*.58,s*.15,'#6b304b','#ffc2ca');c.fillStyle='#ffb4bc';c.fillRect(-s*.055,-s*.19,s*.11,s*.38);c.fillRect(-s*.19,-s*.055,s*.38,s*.11);}
    if(type===8){rr(c,-s*.37,-s*.24,s*.74,s*.53,s*.08,'#9b623c','#ffdc8c');rr(c,-s*.36,-s*.26,s*.72,s*.20,s*.06,'#d5a45c');c.fillStyle='#ffe8a4';c.fillRect(-s*.055,-s*.26,s*.11,s*.54);c.fillStyle='#442735';c.fillRect(-s*.07,-s*.08,s*.14,s*.14);c.fillStyle='#ffdf82';c.beginPath();c.arc(s*.31,-s*.43,s*.035+Math.sin(t*4)*s*.015,0,7);c.fill();}
    c.restore();
  }
  miner(g){const c=this.c,s=this.cell,p=g.player,x=(p.rx+.5)*s,y=(p.ry+.52)*s;const moving=Math.abs(p.rx-p.x)+Math.abs(p.ry-p.y)>.05,bob=moving?Math.sin(this.clock*28)*s*.035:Math.sin(this.clock*3)*s*.012;
    const halo=c.createRadialGradient(x,y,2,x,y,s*2.2);halo.addColorStop(0,'#fff1b91b');halo.addColorStop(1,'#fff1b900');c.fillStyle=halo;c.fillRect(x-s*2.2,y-s*2.2,s*4.4,s*4.4);
    c.save();c.translate(x,y+bob);if(p.invuln>0&&Math.floor(this.clock*14)%2)c.globalAlpha=.55;
    c.fillStyle='#0005';c.beginPath();c.ellipse(0,s*.39,s*.32,s*.09,0,0,7);c.fill();
    if(p.shield>0){c.strokeStyle='#7ff6d87f';c.lineWidth=1.3;c.beginPath();c.arc(0,0,s*.53,0,Math.PI*2);c.stroke();for(let i=0;i<Math.min(3,p.shield);i++){c.fillStyle='#b7ffe8';c.beginPath();c.arc(Math.cos(this.clock+i*2.1)*s*.53,Math.sin(this.clock+i*2.1)*s*.53,s*.035,0,7);c.fill();}}
    const flip=p.dir==='left'?-1:1;c.scale(flip,1);
    // Backpack, boots, spacesuit, scarf, and a helmet with an animated drill.
    rr(c,-s*.32,-s*.05,s*.19,s*.38,s*.05,'#687880','#b9cec0');c.fillStyle='#91f0d0';c.fillRect(-s*.30,s*.03,s*.05,s*.14);
    rr(c,-s*.18,s*.21,s*.14,s*.20,s*.04,'#2b3448');rr(c,s*.045,s*.21,s*.15,s*.20,s*.04,'#2b3448');c.fillStyle='#e8ad64';c.fillRect(-s*.20,s*.34,s*.19,s*.07);c.fillRect(s*.035,s*.34,s*.19,s*.07);
    rr(c,-s*.23,-s*.08,s*.46,s*.37,s*.11,'#397c7d','#99cbb4');c.fillStyle='#b1d7c5';c.fillRect(-s*.14,s*.11,s*.28,s*.055);c.fillStyle='#f2c78c';c.fillRect(-s*.045,s*.15,s*.09,s*.06);
    path(c,[[-s*.18,-s*.1],[-s*.42,s*.10],[-s*.29,s*.13],[-s*.1,-s*.07]]);c.fillStyle='#ee8062';c.fill();rr(c,-s*.24,-s*.10,s*.49,s*.10,s*.04,'#fa9b70');
    rr(c,-s*.29,-s*.44,s*.58,s*.39,s*.16,'#f6b65e','#ffe1a0');rr(c,-s*.19,-s*.28,s*.41,s*.15,s*.07,'#182f3f');c.fillStyle='#b2f3df';c.fillRect(s*.01,-s*.245,s*.07,s*.055);c.fillRect(s*.125,-s*.245,s*.04,s*.055);rr(c,-s*.11,-s*.5,s*.21,s*.12,s*.04,'#edf4bd');c.fillStyle='#fffce0';c.fillRect(-s*.065,-s*.51,s*.12,s*.06);
    c.save();c.translate(s*.18,s*.04);const a=p.dir==='down'?Math.PI/2:p.dir==='up'?-Math.PI/2:0;c.rotate(a);rr(c,0,-s*.10,s*.23,s*.21,s*.06,'#edaa5b','#ffe0a2');path(c,[[s*.19,-s*.11],[s*.50,0],[s*.19,s*.11]]);c.fillStyle='#bcd6cf';c.fill();c.strokeStyle='#4d777e';c.lineWidth=s*.035;for(let i=0;i<3;i++){const xx=s*(.21+i*.075);c.beginPath();c.moveTo(xx,-s*(.09-i*.023));c.lineTo(xx+s*.035,s*(.08-i*.023));c.stroke();}if(moving||p.drillTimer>.05){c.fillStyle='#fff2b8';c.fillRect(s*.36+Math.sin(this.clock*60)*s*.03,-s*.025,s*.10,s*.05);}c.restore();
    c.restore();
    // The aim diamond stays separate from the character silhouette.
    const d={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[p.dir],ax=x+d[0]*s*.69,ay=y+d[1]*s*.69;c.strokeStyle='#fff3b6ba';c.lineWidth=1.5;path(c,[[ax,ay-s*.085],[ax+s*.085,ay],[ax,ay+s*.085],[ax-s*.085,ay]]);c.stroke();
  }
  enemy(e,g){const c=this.c,s=this.cell,x=(e.rx+.5)*s,y=(e.ry+.63)*s,hop=Math.sin(this.clock*5+e.x)*s*.04;c.save();c.translate(x,y+hop);c.fillStyle='#0005';c.beginPath();c.ellipse(0,s*.23,s*.31,s*.07,0,0,7);c.fill();const col=e.flash>0?'#fff2cf':e.type==='armored'?'#9aa3b1':g.biome.tint;c.fillStyle=col;c.beginPath();c.moveTo(-s*.35,s*.16);c.bezierCurveTo(-s*.4,-s*.45,s*.33,-s*.45,s*.35,s*.16);c.quadraticCurveTo(s*.25,s*.29,0,s*.19);c.quadraticCurveTo(-s*.21,s*.3,-s*.35,s*.16);c.fill();c.strokeStyle='#fff5';c.lineWidth=1;c.stroke();c.fillStyle='#142331';c.fillRect(-s*.17,-s*.12,s*.08,s*.11);c.fillRect(s*.10,-s*.12,s*.08,s*.11);c.fillRect(-s*.04,s*.04,s*.09,s*.045);if(e.type==='armored'){c.strokeStyle='#3e4c61';c.lineWidth=s*.06;path(c,[[-s*.25,-s*.20],[0,0],[s*.27,-s*.18]]);c.stroke();}else{c.fillStyle='#ffffff40';c.beginPath();c.ellipse(-s*.12,-s*.24,s*.1,s*.04,-.4,0,7);c.fill();}if(e.kind==='scarab'){c.strokeStyle='#59442e';c.lineWidth=s*.04;c.beginPath();c.moveTo(0,-s*.32);c.lineTo(0,s*.2);c.stroke();for(const side of [-1,1])for(let i=0;i<2;i++){c.beginPath();c.moveTo(side*s*.27,(i*.2-.1)*s);c.lineTo(side*s*.44,(i*.2-.02)*s);c.stroke();}}if(e.kind==='jelly'){c.strokeStyle=col+'99';c.lineWidth=s*.035;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*s*.18,s*.13);c.quadraticCurveTo(i*s*.18+Math.sin(this.clock*5+i)*s*.12,s*.33,i*s*.2,s*.46);c.stroke();}}if(e.kind==='spore'){c.fillStyle='#453352';c.beginPath();c.ellipse(0,-s*.23,s*.38,s*.14,0,0,7);c.fill();c.fillStyle='#e0b9e8';for(let i=-1;i<=1;i++){c.beginPath();c.arc(i*s*.18,-s*.25,s*.04,0,7);c.fill();}}if(e.kind==='ember'){c.fillStyle='#ffd98c';for(const side of [-1,1]){path(c,[[side*s*.12,-s*.2],[side*s*.25,-s*.48],[side*s*.28,-s*.19]]);c.fill();}}if(e.kind==='void'){c.strokeStyle='#e4d8ff77';c.lineWidth=1;c.beginPath();c.ellipse(0,-s*.05,s*.45,s*.13,-.3,0,7);c.stroke();}if(e.hp<e.maxHp){rr(c,-s*.34,-s*.47,s*.68,s*.06,2,'#070e18');rr(c,-s*.34,-s*.47,s*.68*e.hp/e.maxHp,s*.06,2,'#ffb091');}c.restore();}
  boss(g){const c=this.c,s=this.cell,b=g.boss,x=(b.x+.5)*s,y=(b.y+.4)*s;const col=b.flash>0?'#fff2ce':g.biome.tint;c.save();c.translate(x,y+Math.sin(this.clock*2)*s*.06);for(const side of [-1,1]){rr(c,side*s*.78-s*.3,-s*.37,s*.6,s*.9,s*.13,tint(col,-60),col);rr(c,side*s*.78-s*.3,s*.55,s*.62,s*.36,s*.08,tint(col,-70),col);}path(c,[[-s*.7,-s*.62],[0,-s*.9],[s*.7,-s*.62],[s*.56,s*.58],[0,s*.82],[-s*.56,s*.58]]);c.fillStyle=tint(col,-65);c.fill();c.strokeStyle=col;c.lineWidth=2;c.stroke();path(c,[[0,-s*.43],[s*.30,0],[0,s*.4],[-s*.30,0]]);c.fillStyle=col;c.fill();c.fillStyle='#fff0c4';path(c,[[0,-s*.43],[s*.08,-s*.04],[-s*.30,0]]);c.fill();rr(c,-s*.39,-s*.92,s*.78,s*.33,s*.12,'#263243',col);c.fillStyle='#fff0ae';c.fillRect(-s*.24,-s*.82,s*.16,s*.065);c.fillRect(s*.08,-s*.82,s*.16,s*.065);if(b.timer<.85){c.strokeStyle='#ffbe6e';c.lineWidth=2;c.beginPath();c.arc(0,0,s*(1.4+Math.sin(this.clock*20)*.04),0,7);c.stroke();}c.restore();}
  gate(g){const c=this.c,s=this.cell,e=g.exit,x=(e.x+.5)*s,y=(e.y+.5)*s;if(y<this.cam*s-3*s||y>(this.cam*s+this.h+3*s))return;c.save();c.translate(x,y);const glow=c.createRadialGradient(0,0,0,0,0,s*2);glow.addColorStop(0,e.open?g.biome.tint+'55':'#e4ac4920');glow.addColorStop(1,'#07101a00');c.fillStyle=glow;c.fillRect(-2*s,-2*s,4*s,4*s);rr(c,-s*.65,-s*1.15,s*1.3,s*1.65,s*.55,'#152e38',e.open?g.biome.tint:'#8d764f');rr(c,-s*.45,-s*.96,s*.90,s*1.43,s*.37,e.open?'#71d5bd30':'#101c2a');c.strokeStyle=e.open?'#baffdf':'#85755e';c.lineWidth=2;for(let i=0;i<3;i++){const yy=s*(.09+i*.21)+(e.open?Math.sin(this.clock*3)*s*.06:0);path(c,[[-s*.14,yy-s*.08],[0,yy+s*.06],[s*.14,yy-s*.08]]);c.stroke();}c.fillStyle=e.open?'#d2ffe8':'#d9c19a';c.font=`700 ${s*.20}px sans-serif`;c.textAlign='center';c.fillText(e.open?(g.stage===5?'CORE':'NEXT'):'LOCKED',0,-s*.58);c.restore();}
}
