import {drawSpecialEnemy,drawEnemyIntent,drawTargetReticle} from './enemy-art.mjs';
import {TerrainAtlas,drawRuins} from './world-art.mjs';
import {drawMiner,drawCommonEnemy,drawMoth,drawGuardian} from './actor-art.mjs';
import {drawDebris,drawEffects} from './effects-art.mjs';
import {drawFixture,drawGate} from './prop-art.mjs';
import {COLS,ROWS,PALETTE} from './engine.mjs';
import {forecastFall,canPush,SETPIECES} from './tactics.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function path(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export class Renderer{
  constructor(ctx,options={}){this.atlas=new TerrainAtlas(options.surfaceFactory);this.c=ctx;this.w=400;this.h=500;this.cam=0;this.clock=0;this.lastStage=-1;}
  resize(w,h){this.w=w;this.h=h;this.cell=Math.min(w/(COLS+.8),h/12.5);this.left=(w-COLS*this.cell)/2;}
  draw(g,dt=1/60,home=false){
    const c=this.c,w=this.w,h=this.h,s=this.cell;if(g.turnBased&&!home)this.clock=g.time;else this.clock+=dt;const visible=h/s,target=visible>=ROWS?-(visible-ROWS)/2:clamp(g.player.ry-visible*.48,0,ROWS-visible);
    if(this.lastStage!==g.roomNumber){this.cam=target;this.lastStage=g.roomNumber;}this.cam+=(target-this.cam)*Math.min(1,dt*9);
    drawRuins(c,w,h,s,this.cam,g.stage,this.clock);c.save();if(g.shake)c.translate(Math.sin(this.clock*111)*g.shake*8,Math.cos(this.clock*131)*g.shake*7);c.save();c.translate(this.left,-this.cam*s);
    this.floor(g);const start=Math.max(0,Math.floor(this.cam)-1),end=Math.min(ROWS,Math.ceil(this.cam+visible)+1);
    if(!home)this.predictions(g,start,end);
    for(const f of g.fluids)this.fluid(f,s);
    for(let y=start;y<end;y++)for(let x=0;x<COLS;x++)if(g.grid[y][x])this.tile(x,y,g.grid[y][x],s,false,g);
    if(!home)this.setupMarks(g,start,end);
    for(const f of g.fixtures)this.fixture(f,g);
    this.gate(g);
    for(const f of g.falling){const warning=f.delay>0,off=warning?Math.sin(this.clock*33)*.022:f.offset;
      const low=new Map();for(const p of f.cells){if(!low.has(p.x)||low.get(p.x)<p.y)low.set(p.x,p.y);if(p.y<start-1||p.y>end)continue;this.tile(p.x+(warning?off:0),p.y+(warning?0:off),p.t,s,warning,g);if(warning){c.strokeStyle='#f6cf9288';c.lineWidth=1;rr(c,p.x*s+1,p.y*s+1,s-2,s-2,3,null,'#f6cf9260');}}
      if(warning){for(const [x,y]of low){if(y<start-1||y>end)continue;c.fillStyle='rgba(240,173,100,.09)';for(let yy=y+1;yy<Math.min(ROWS-1,y+5)&&!g.at(x,yy);yy++)c.fillRect(x*s,yy*s,s,s);c.fillStyle='#f7c487';c.font=`800 ${s*.3}px sans-serif`;c.textAlign='center';c.fillText('▼',(x+.5)*s,(y+1.2)*s);}}
    }
    for(const hz of g.hazards){const col=['spore','spit'].includes(hz.kind)?'#caed9c':'#f7b181';c.globalAlpha=hz.delay>0?.23+Math.sin(this.clock*19)*.09:Math.max(0,1+hz.delay*3);c.fillStyle=col;for(let dy=-hz.radius;dy<=hz.radius;dy++)for(let dx=-hz.radius;dx<=hz.radius;dx++)if(Math.abs(dx)+Math.abs(dy)<=hz.radius)c.fillRect((hz.x+dx)*s,(hz.y+dy)*s,s,s);c.globalAlpha=1;c.lineWidth=1;rr(c,hz.x*s+2,hz.y*s+2,s-4,s-4,3,null,col);c.fillStyle=col;c.font=`800 ${s*.45}px sans-serif`;c.textAlign='center';c.fillText(hz.kind==='spit'?'●':'!',(hz.x+.5)*s,(hz.y+.67)*s);}
    if(g.boss?.state==='warn'&&g.boss.attack){const a=g.boss.attack;c.save();for(const x of a.columns){const top=Math.max(a.fromY,this.cam),bottom=ROWS-1;c.fillStyle=`rgba(255,167,100,${.16+Math.sin(this.clock*22)*.06})`;c.fillRect(x*s,a.fromY*s,s,(bottom-a.fromY)*s);c.strokeStyle='#ffcb89';c.lineWidth=1.5;c.setLineDash([s*.15,s*.12]);c.strokeRect(x*s+2,a.fromY*s+2,s-4,(bottom-a.fromY)*s-4);c.setLineDash([]);c.fillStyle='#ffe1b3';c.font=`900 ${s*.46}px sans-serif`;c.textAlign='center';c.fillText('!',(x+.5)*s,(top+.85)*s);}c.restore();}
    for(const b of g.broods||[]){if(b.y<start||b.y>end)continue;const x=(b.x+.5)*s,y=(b.y+.5)*s;c.save();c.translate(x,y);c.globalAlpha=.65+Math.sin(this.clock*24+b.x)*.25;rr(c,-s*.4,-s*.4,s*.8,s*.8,s*.16,'#e5a37922','#ffba91');c.strokeStyle='#ffc096';c.lineWidth=1.5;path(c,[[-s*.27,-s*.3],[-s*.1,-s*.06],[-s*.22,s*.25],[s*.1,s*.08],[s*.27,s*.3]]);c.stroke();c.fillStyle='#ffe0ae';c.fillRect(-s*.17,-s*.12,s*.11,s*.09);c.fillRect(s*.07,-s*.12,s*.11,s*.09);c.restore();}
    if(g.boss){for(const f of g.fixtures.filter(f=>!f.done)){c.strokeStyle=g.biome.tint+'35';c.lineWidth=1;c.setLineDash([4,5]);c.beginPath();c.moveTo((f.x+.5)*s,(f.y+.5)*s);c.lineTo((g.boss.x+.5)*s,(g.boss.y+.5)*s);c.stroke();c.setLineDash([]);}this.boss(g);}
    for(const e of g.enemies){if(e.ry<start-1||e.ry>end)continue;drawEnemyIntent(c,s,e,g,this.clock);this.enemy(e,g);
      if(e.frozen>0){rr(c,(e.rx+.08)*s,(e.ry+.06)*s,s*.84,s*.87,s*.15,'#b7efff22','#c8f4ff');c.fillStyle='#dbf9ff';c.font=`700 ${s*.28}px sans-serif`;c.textAlign='center';c.fillText('❄',(e.rx+.5)*s,(e.ry+.18)*s);}
      else if(e.recovery>0){c.fillStyle='#bad6c3';c.font=`700 ${s*.27}px sans-serif`;c.textAlign='center';c.fillText('OPEN',(e.rx+.5)*s,(e.ry-.02)*s);}
      if(e.objective||e.type==='hunter'){c.fillStyle=e.type==='hunter'?'#ffbc96':'#f2d99a';c.font=`700 ${s*.36}px sans-serif`;c.textAlign='center';c.fillText(e.type==='hunter'?'!':'◇',(e.rx+.5)*s,(e.ry-.02)*s);}}
    drawDebris(c,s,g.particles);
    this.miner(g);
    drawEffects(c,s,g.fx,this.clock);
    if(g.pulseFx){const f=g.pulseFx,t=1-f.life/.4;c.globalAlpha=(1-t)*.7;c.strokeStyle='#b1f0d3';c.lineWidth=2;c.beginPath();c.arc(f.x*s,f.y*s,s*(.3+t*(f.radius||2)),0,7);c.stroke();c.globalAlpha=1;}
    for(const e of g.enemies)if(e.intent?.y>=start&&e.intent?.y<=end)drawTargetReticle(c,s,e,g.turnBased);
    if(g.collapseFront>this.cam-2){const yy=g.collapseFront*s;c.fillStyle='#242426f2';c.fillRect(0,0,COLS*s,Math.max(0,yy));c.fillStyle='#9b866433';c.fillRect(0,yy,COLS*s,s*.55);c.strokeStyle='#d5b77b77';c.lineWidth=1;c.beginPath();for(let x=0;x<=COLS;x++){const y=yy+Math.sin(x*3+this.clock*5)*s*.11;if(x===0)c.moveTo(0,y);else c.lineTo(x*s,y);}c.stroke();for(let i=0;i<25;i++){const x=(Math.sin(i*42.7)*.5+.5)*COLS*s,y=yy+s*(.2+((this.clock*1.8+i*.37)%1.3));c.fillStyle='#d6b17c33';c.fillRect(x,y,2,2);}}
    for(const f of g.texts){c.globalAlpha=Math.min(1,f.life*3);c.font=`800 ${Math.max(10,s*.36)}px sans-serif`;c.textAlign='center';c.lineWidth=3;c.strokeStyle='#142326';c.strokeText(f.s,f.x*s,f.y*s);c.fillStyle=f.color;c.fillText(f.s,f.x*s,f.y*s);}c.globalAlpha=1;c.restore();
    const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,'#050b132c');shade.addColorStop(.15,'#050b1300');shade.addColorStop(.85,'#050b1300');shade.addColorStop(1,'#050b1355');c.fillStyle=shade;c.fillRect(0,0,w,h);
    if(g.flash){const edge=c.createRadialGradient(w/2,h/2,h*.13,w/2,h/2,Math.max(w,h)*.68);edge.addColorStop(0,'#ff696900');edge.addColorStop(1,`rgba(255,101,109,${Math.min(.65,g.flash*1.5)})`);c.fillStyle=edge;c.fillRect(0,0,w,h);}
    if(g.messageTimer>0&&!home){const text=g.message,fontsize=Math.min(11,w*.028);c.font=`600 ${fontsize}px sans-serif`;c.textAlign='center';const width=Math.min(w-20,c.measureText(text).width+24);rr(c,(w-width)/2,8,width,28,12,'#13242ae8','#bdd2ac38');c.fillStyle='#e1e8cc';c.fillText(text,w/2,26,w-36);}
    if(!g.started&&!home){rr(c,w/2-119,h-44,238,28,14,'#122329e8','#c3dcc62a');c.fillStyle='#c3d9cf';c.font='600 10px sans-serif';c.textAlign='center';c.fillText(g.turnBased?'方向タップで1手 / 待つで周囲を進める':'▼ 下へ掘る / 掘る長押しで高速 / 上は小ジャンプ',w/2,h-26);}
    c.restore();
  }
  predictions(g,start,end){
    const c=this.c,s=this.cell;
    const draw=(cells,color)=>{
      const q=forecastFall(g,cells);if(!q.distance)return;c.save();c.strokeStyle=color;c.fillStyle=color+'12';c.lineWidth=1;c.setLineDash([s*.12,s*.12]);
      for(const [i,a]of q.bottom.entries()){const b=q.landing[i];if(b.y<start||a.y>end)continue;c.beginPath();c.moveTo((a.x+.5)*s,(a.y+1)*s);c.lineTo((b.x+.5)*s,(b.y+.8)*s);c.stroke();c.fillRect(b.x*s,b.y*s,s,s);c.strokeRect(b.x*s+2,b.y*s+2,s-4,s-4);}
      c.restore();
    };
    for(const f of g.falling)if(f.cells.some(a=>a.y>=start-3&&a.y<=end))draw(f.cells,'#e5b87e');
    for(const dx of [-1,1]){const x=g.player.x+dx,y=g.player.y;if(g.at(x,y)?.c===4&&canPush(g,x,y,dx))draw([{x:x+dx,y}],'#b4ded5');}
  }
  setupMarks(g,start,end){const c=this.c,s=this.cell;for(const a of g.setpieces||[])if(a.y>=start&&a.y<=end&&g.player.y<=a.packY+2){c.save();c.fillStyle='#e0c58e';c.font=`700 ${s*.4}px sans-serif`;c.textAlign='center';c.shadowBlur=3;c.shadowColor='#101d22';c.fillText(SETPIECES[a.type].icon,(a.x+.5)*s,(a.y-.25)*s);c.restore();}}
  floor(g){
    const c=this.c,s=this.cell,start=Math.max(1,Math.floor(this.cam)-1),end=Math.min(ROWS-1,Math.ceil(this.cam+this.h/s)+1);
    // Quiet near-plane grid corners separate traversable cells from the ruins.
    c.save();c.strokeStyle=g.biome.tint+'10';c.lineWidth=.65;
    for(let y=start;y<end;y++)for(let x=1;x<COLS-1;x++){
      if(g.at(x,y))continue;const px=x*s,py=y*s;
      c.beginPath();c.moveTo(px+s*.08,py+s*.25);c.lineTo(px+s*.08,py+s*.08);c.lineTo(px+s*.25,py+s*.08);c.stroke();
      if((x*13+y*7)%23===0){c.fillStyle=g.biome.tint+'20';for(let i=0;i<3;i++)c.fillRect((x+.3+i*.13)*s,(y+.78)*s,s*.04,s*.03);}
    }
    c.restore();
  }
  tile(x,y,t,s,warning,g){
    const c=this.c,px=x*s,py=y*s;c.save();
    this.atlas.draw(c,x,y,t,s,g.biome,g.stage);
    if(t.ice){
      c.fillStyle='#efffff';c.font=`700 ${s*.24}px sans-serif`;c.textAlign='center';c.lineWidth=2;c.strokeStyle='#21445f';
      const ttl=Math.max(1,Math.ceil(t.expires-g.roomTime))+(g.turnBased?'T':'s');c.strokeText(ttl,px+s*.5,py+s*.83);c.fillText(ttl,px+s*.5,py+s*.83);
    }else if(t.c===4){
      c.fillStyle='#f1dbab';c.strokeStyle='#243540';c.lineWidth=2;c.font=`800 ${s*.29}px sans-serif`;c.textAlign='center';c.strokeText('↔',px+s*.51,py+s*.76);c.fillText('↔',px+s*.51,py+s*.76);
    }else if(t.c<4){
      const col=PALETTE[t.c];c.lineWidth=s*.035;c.strokeStyle=col+'9a';
      // Vein connections describe the actual connected cluster, never a cached neighbour.
      for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])if(g.at(Math.round(x)+dx,Math.round(y)+dy)?.c===t.c){
        c.beginPath();c.moveTo(px+s*(.5+dx*.31),py+s*(.5+dy*.31));c.lineTo(px+s*(.5+dx*.5),py+s*(.5+dy*.5));c.stroke();
      }
    }else if(t.c===11&&t.hp<3){
      c.strokeStyle='#e4dec3b0';c.lineWidth=1;path(c,[[px+s*.4,py+s*.08],[px+s*.6,py+s*.65],[px+s*.3,py+s*.9]]);c.stroke();
      if(t.hp<2){path(c,[[px+s*.59,py+s*.54],[px+s*.83,py+s*.69],[px+s*.96,py+s*.58]]);c.stroke();}
    }
    if([0,1,2,3,10,11].includes(t.c)){
      // Exposed faces carry a rim; the cell itself remains the exact collision footprint.
      if(!g.at(Math.round(x),Math.round(y)-1)){c.fillStyle='#e8e6c235';c.fillRect(px+1,py+1,s-2,Math.max(1,s*.04));}
      if(!g.at(Math.round(x),Math.round(y)+1)){c.fillStyle='#020a1570';c.fillRect(px,py+s*.92,s,s*.08);}
    }
    if(warning){c.fillStyle='#ffca7b16';c.fillRect(px,py,s,s);}c.restore();
  }
  fluid(f,s){const c=this.c,x=f.x*s,y=f.y*s,water=f.kind==='water',col=water?'#61c1df':'#f6a26d';c.fillStyle=water?'#24576ca8':'#bb5935b0';c.fillRect(x,y,s,s);c.strokeStyle=col+'70';c.lineWidth=1;for(let i=0;i<2;i++){const yy=y+s*(.25+i*.45)+Math.sin(this.clock*3+f.x+i)*s*.04;c.beginPath();c.moveTo(x+s*.12,yy);c.quadraticCurveTo(x+s*.4,yy-s*.1,x+s*.86,yy);c.stroke();}if(!water){c.fillStyle='#ffdf9655';c.beginPath();c.arc(x+s*.3,y+s*.4,s*(.04+Math.sin(this.clock*4+f.y)*.015),0,7);c.fill();}}
  fixture(f,g){drawFixture(this.c,this.cell,f,this.clock);}
  miner(g){drawMiner(this.c,this.cell,g.player,this.clock);}
  enemy(e,g){if(drawSpecialEnemy(this.c,this.cell,e,g,this.clock))return;if(e.type==='moth')drawMoth(this.c,this.cell,e,this.clock);else drawCommonEnemy(this.c,this.cell,e,g,this.clock);}
  boss(g){drawGuardian(this.c,this.cell,g.boss,g.stage,this.clock);}
  gate(g){const e=g.exit,s=this.cell;if(e.y<this.cam-3||e.y>this.cam+this.h/s+3)return;drawGate(this.c,s,e,g.biome,g.roomNumber===18,this.clock);}
}
