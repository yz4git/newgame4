import {poly,oval,gradient,glow,noise,shade} from './art-core.mjs';

// Existing simulation particles are the only source of motion. Painting never
// consumes the simulation RNG or creates entities, including while time is held.
export function drawDebris(c,s,particles){
  c.save();
  for(const p of particles){
    const size=p.size*s;c.globalAlpha=Math.min(1,p.life*3);c.translate(p.x*s,p.y*s);
    if(size>2.4){
      c.strokeStyle=p.color+'55';c.lineWidth=Math.max(.7,size*.3);c.beginPath();c.moveTo(0,0);c.lineTo(-p.vx*s*.025,-p.vy*s*.025);c.stroke();
    }
    c.rotate(p.life*4);poly(c,[[-size*.5,-size*.23],[size*.12,-size*.57],[size*.55,size*.11],[-size*.14,size*.45]],p.color);
    if(size>2.6)poly(c,[[-size*.5,-size*.23],[size*.12,-size*.57],[0,0]],'#fff6d875');
    c.rotate(-p.life*4);c.translate(-p.x*s,-p.y*s);
  }
  c.restore();
}

export function drawEffects(c,s,effects,clock){
  c.save();
  for(const f of effects){
    const t=Math.max(0,Math.min(1,1-f.life/f.max)),fade=1-t;c.save();c.translate(f.x*s,f.y*s);c.scale(s,s);c.lineWidth=.025;c.globalAlpha=fade;
    if(f.kind==='beam'){
      const dx=f.x2-f.x,dy=f.y2-f.y,length=Math.max(1,Math.hypot(dx,dy)),arc=f.color==='#b5a0f3';
      for(const [width,col]of [[.18,f.color+'29'],[.055,f.color],[.018,'#f4fff0']]){
        c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(0,0);
        for(let i=1;i<7;i++){const k=i/7,j=arc?Math.sin(i*13+clock*28)*.14*fade:0;c.lineTo(dx*k-dy/length*j,dy*k+dx/length*j);}c.lineTo(dx,dy);c.stroke();
      }
      for(let i=1;i<5;i++){const k=i/5;oval(c,dx*k,dy*k,.04,.04,'#e6ffe7');}
    }else if(f.kind==='blast'){
      const radius=f.radius*(.15+t*.85);
      glow(c,0,0,Math.max(.2,radius),f.color,'3b');
      for(let i=0;i<9;i++){
        const a=i*Math.PI*2/9,rr=radius*(.4+noise(i)*.4),x=Math.cos(a)*rr,y=Math.sin(a)*rr;
        c.globalAlpha=fade*.6;oval(c,x,y,.16+radius*.15,.12+radius*.13,gradient(c,x,y-.3,x,y+.3,[f.color+'c0','#624e4a10']));
        c.globalAlpha=fade;const tip=radius*(.8+noise(i+8)*.22);
        poly(c,[[Math.cos(a-.1)*radius*.35,Math.sin(a-.1)*radius*.35],[Math.cos(a)*tip,Math.sin(a)*tip],[Math.cos(a+.1)*radius*.35,Math.sin(a+.1)*radius*.35]],i%3===0?'#ffedb6':f.color);
      }
    }else if(f.kind==='shock'){
      for(const side of [-1,1])for(let i=0;i<3;i++){
        const x=side*f.radius*t-side*i*.18;c.globalAlpha=fade*(1-i*.24);c.lineWidth=.04;
        poly(c,[[x-side*.15,-.25],[x,0],[x-side*.15,.25]],null,f.color);
        poly(c,[[x-side*.13,.3],[x+side*.08,.37],[x+side*.15,.3]],null,'#e1ffe488');
      }
    }else if(f.kind==='strike'){
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;poly(c,[[Math.cos(a)*.08,Math.sin(a)*.08],[Math.cos(a)*(.24+t*.35),Math.sin(a)*(.24+t*.35)]],null,i%2?f.color:'#fff0ca');}
      oval(c,0,0,.1*fade,.1*fade,'#fff5d5');
    }else{
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4+clock*.45,r=f.radius*t,x=Math.cos(a)*r,y=Math.sin(a)*r;
        c.save();c.translate(x,y);c.rotate(a-.5);poly(c,[[0,-.13],[.075,0],[0,.13],[-.045,0]],gradient(c,0,-.13,0,.13,['#edffdb',f.color,shade(f.color,-20)]));c.restore();
      }
    }
    c.restore();
  }
  c.restore();
}
