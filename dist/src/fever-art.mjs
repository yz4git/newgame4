import {poly,gradient,oval} from './art-core.mjs';
import {INK} from './casual-world.mjs';
import {brightColor} from './casual-effects.mjs';

export function drawFeverDrill(c,s,g){
  if(!g.started||g.mode==='fever-result')return;
  const p=g.player,active=g.fever.active>0,col=active?'#ffd579':'#8ad9d0';
  c.save();c.lineWidth=1;c.lineJoin='round';
  for(const x of g.digColumns){
    const yy=(p.ry+1.06)*s,xx=(x+.5)*s;
    if(x!==p.x){
      c.strokeStyle=INK;c.lineWidth=s*.05;c.beginPath();c.moveTo((p.rx+.5)*s,(p.ry+.8)*s);c.quadraticCurveTo(xx,yy-s*.35,xx,yy-s*.12);c.stroke();
      c.strokeStyle=col;c.lineWidth=s*.026;c.stroke();
      oval(c,xx,yy-s*.13,s*.14,s*.085,col,INK);
      c.lineWidth=1;poly(c,[[xx-s*.12,yy-s*.12],[xx,yy+s*.19],[xx+s*.12,yy-s*.12]],gradient(c,xx-s*.1,yy-s*.1,xx+s*.1,yy+s*.18,['#fff7d7','#a2d8db','#5ba8be']),INK);
      const shift=(g.time*6)%1;
      for(let i=0;i<3;i++){const off=(i+shift)*.065,half=s*.1*(.3-off)/.3;poly(c,[[xx-half,yy+s*(off-.08)],[xx+half,yy+s*(off-.03)]],null,'#6ba0b9');}
    }
    if(active){c.fillStyle='#ffdf7b20';c.fillRect(x*s,(p.y+1)*s,s,s);}
  }
  c.restore();
}
export function drawFeverGems(c,s,g){
  c.save();c.lineWidth=.7;
  for(const a of g.gems){
    c.globalAlpha=Math.min(1,a.life*3);const x=a.x*s,y=a.y*s,r=s*.1;
    poly(c,[[x,y-r],[x+r*.75,y],[x,y+r],[x-r*.75,y]],brightColor(a.color),INK+'a0');
    poly(c,[[x,y-r],[x,y],[x-r*.75,y]],'#fff4ca70');
  }
  c.restore();
}
