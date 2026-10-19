import {poly,gradient,glow} from './art-core.mjs';

export function drawFeverDrill(c,s,g){
  if(!g.started||g.mode==='fever-result')return;
  const p=g.player,active=g.fever.active>0,col=active?'#ffe19b':'#a9dfc4';
  c.save();c.lineWidth=1;
  for(const x of g.digColumns){
    const yy=(p.ry+1.06)*s,xx=(x+.5)*s;
    if(x!==p.x){
      c.strokeStyle=col+'83';c.beginPath();c.moveTo((p.rx+.5)*s,(p.ry+.82)*s);c.lineTo(xx,yy-s*.17);c.stroke();
      poly(c,[[xx-s*.11,yy-s*.14],[xx,yy+s*.16],[xx+s*.11,yy-s*.14]],gradient(c,xx-s*.1,yy-s*.1,xx+s*.1,yy+s*.14,['#f8e9c0','#8faba8','#315966']),col);
      for(let i=0;i<3;i++)poly(c,[[xx-s*(.08-i*.02),yy+s*(i*.055-.1)],[xx+s*(.08-i*.02),yy+s*(i*.055-.04)]],null,'#274d5c');
    }
    c.fillStyle=col+(active?'15':'0a');c.fillRect(x*s,(p.y+1)*s,s,s);
    if(active)glow(c,xx,yy,s*.48,col,'19');
  }
  c.restore();
}
export function drawFeverGems(c,s,g){
  c.save();
  for(const a of g.gems){
    c.globalAlpha=Math.min(1,a.life*3);const x=a.x*s,y=a.y*s,r=s*.075;
    poly(c,[[x,y-r],[x+r*.7,y],[x,y+r],[x-r*.7,y]],a.color,'#fff6cd8a');
  }
  c.restore();
}
