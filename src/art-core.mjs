export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export function shade(hex,n){const v=parseInt(hex.slice(1),16);return '#'+[16,8,0].map(k=>Math.round(clamp((v>>k&255)+n,0,255)).toString(16).padStart(2,'0')).join('');}
export function blend(a,b,t){const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);return '#'+[16,8,0].map(k=>Math.round((x>>k&255)*(1-t)+(y>>k&255)*t).toString(16).padStart(2,'0')).join('');}
export const noise=(x,y=0)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export function poly(c,points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function oval(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,Math.max(.001,rx),Math.max(.001,ry),0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function box(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function gradient(c,x,y,x2,y2,colors){const g=c.createLinearGradient(x,y,x2,y2);colors.forEach((col,i)=>g.addColorStop(i/(colors.length-1),col));return g;}
export function glow(c,x,y,r,color,alpha='30'){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color+alpha);g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
export function crystal(c,x,y,r,color,tilt=0){
  c.save();c.translate(x,y);c.rotate(tilt);c.lineWidth=.012;
  const points=[[-r*.45,-r*.75],[r*.13,-r],[r*.55,-r*.24],[r*.47,r*.66],[-r*.16,r],[-r*.55,r*.35]];
  poly(c,points,gradient(c,-r,-r,r,r,[shade(color,40),color,shade(color,-65)]),shade(color,58));
  poly(c,[points[0],points[1],[r*.06,r*.12],points[5]],shade(color,23));
  poly(c,[points[1],points[2],points[3],[r*.06,r*.12]],shade(color,-27));
  poly(c,[points[5],[r*.06,r*.12],points[3],points[4]],shade(color,-7));
  poly(c,[[-r*.31,-r*.58],[-r*.12,-r*.67],[-r*.2,-r*.04],[-r*.35,r*.17]],'#f0fff380');
  c.restore();
}
