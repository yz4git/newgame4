import {poly,oval,gradient,shade} from './art-core.mjs';
import {CANDY,INK,star} from './casual-world.mjs';
export function brightColor(color){const n=['#75dba7','#f3ad70','#7ac9f1','#b5a0f3'].indexOf(color);return n<0?color:CANDY[n];}

export function drawCasualDebris(c,s,particles){
  c.save();c.lineJoin='round';
  for(const p of particles){
    c.save();c.globalAlpha=Math.min(1,p.life*3);c.translate(p.x*s,p.y*s);c.rotate(p.life*5);const r=p.size*s*.65,col=brightColor(p.color);
    c.lineWidth=.7;poly(c,[[-r,-r*.35],[r*.15,-r],[r,r*.25],[-r*.3,r*.7]],col,shade(col,-38));
    if(r>1.5)poly(c,[[-r,-r*.35],[r*.15,-r],[0,0]],'#fff9ddbd');c.restore();
  }
  c.restore();
}
export function drawCasualEffects(c,s,fx,clock){
  c.save();
  for(const f of fx){
    const t=Math.max(0,Math.min(1,1-f.life/f.max)),fade=1-t,col=brightColor(f.color);c.save();c.translate(f.x*s,f.y*s);c.scale(s,s);c.globalAlpha=fade;c.lineWidth=.025;
    if(f.kind==='blast'){
      const r=Math.max(.18,f.radius*(.3+t*.75));
      // A brief scalloped impact opens into outward strokes instead of rings.
      if(t<.5){c.globalAlpha=fade*.8;c.save();c.rotate(t*.35);star(c,0,0,r*(.78-t*.4),'#ffdf91',shade(col,-20),7,.58);c.restore();}
      for(let i=0;i<6;i++){const a=i*Math.PI/3+.3;c.strokeStyle=i%2?col:'#ffe7a4';c.lineWidth=.055*fade;c.lineCap='round';c.globalAlpha=fade*.8;c.beginPath();c.moveTo(Math.cos(a)*r*.75,Math.sin(a)*r*.75);c.lineTo(Math.cos(a)*r*1.14,Math.sin(a)*r*1.14);c.stroke();}
      for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*r*.53,y=Math.sin(a)*r*.53;c.globalAlpha=fade*.42;oval(c,x,y,r*.33,r*.29,gradient(c,x-r*.2,y-r*.2,x+r*.3,y+r*.3,['#fff1c0',col+'80']));}
      c.globalAlpha=fade;star(c,0,0,r*.5,'#fff1b8b0',null,6,.48);
      for(let i=0;i<7;i++){const a=i*Math.PI*2/7+.2,x=Math.cos(a)*r,y=Math.sin(a)*r;c.save();c.translate(x,y);c.rotate(a+t);star(c,0,0,.07+fade*.07,i%2?'#ffe18b':col,shade(col,-28),4,.4);c.restore();}
    }else if(f.kind==='shock'){
      for(const side of [-1,1]){
        const x=side*f.radius*t;c.strokeStyle=col;c.lineWidth=.065;c.lineCap='round';
        c.beginPath();c.moveTo(x-side*.36,-.13);c.quadraticCurveTo(x+side*.08,0,x-side*.36,.13);c.stroke();star(c,x,0,.17,'#fff1c5',shade(col,-25),4,.4);
      }
    }else if(f.kind==='beam'){
      const dx=f.x2-f.x,dy=f.y2-f.y;
      c.lineCap='round';for(const [width,color]of [[.11,shade(col,-26)],[.065,col],[.022,'#fff7d9']]){c.lineWidth=width;c.strokeStyle=color;c.beginPath();c.moveTo(0,0);c.lineTo(dx,dy);c.stroke();}
      star(c,dx,dy,.18,'#fff1c0',shade(col,-25),4,.4);
    }else if(f.kind==='strike'){
      star(c,0,0,.3+t*.2,'#ffe187',null,5,.32);
    }else{
      for(let i=0;i<7;i++){const a=i*Math.PI*2/7+clock*.3;star(c,Math.cos(a)*f.radius*t,Math.sin(a)*f.radius*t,.12,col,'#fff1d7',4,.45);}
    }
    c.restore();
  }
  c.restore();
}
export function drawCasualCaptions(c,s,texts,breaks=[]){
  c.save();c.textAlign='center';c.lineJoin='round';
  for(const f of texts){
    if(/^\d+ BREAK/.test(f.s)&&breaks.length>0)continue;
    c.globalAlpha=Math.min(1,f.life*3);const match=/^(\d+) BREAK · ×(\d+)$/.exec(f.s),text=match?`${+match[1]>=20?'MEGA':'NICE'}! ${match[1]}`:f.s==='BOUNCE!'?'OOPS!':f.s==='TREASURE!'?'BONUS!':f.s;
    c.font=`900 ${Math.max(11,s*.43)}px ui-rounded, sans-serif`;c.lineWidth=4.5;c.strokeStyle='#fffbdf';c.strokeText(text,f.x*s,f.y*s);c.lineWidth=1.1;c.strokeStyle=INK;c.strokeText(text,f.x*s,f.y*s);c.fillStyle=match?'#e97f4c':f.s==='TREASURE!'?'#dd9542':'#448ba0';c.fillText(text,f.x*s,f.y*s);
  }
  c.restore();
}
