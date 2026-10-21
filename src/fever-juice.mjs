// Bounded, deterministic decoration. This module never advances or writes a run.
import {poly,shade} from './art-core.mjs';
import {star,INK,CANDY} from './casual-world.mjs';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export function resetJuice(show){show.juice={shards:[],pickups:[],relays:[],labels:[],lastKill:null,relayCount:0,lastSmash:-1,lastRelayCue:-1,impactUntil:0,impactSize:0,boost:false};}
export function updateJuice(show,g){
  const j=show.juice,t=show.time;
  if(show.sector!==g.sector){j.shards=[];j.pickups=[];j.relays=[];j.labels=[];j.lastKill=null;j.relayCount=0;}
  for(const key of ['shards','pickups','relays','labels'])j[key]=j[key].filter(p=>t-p.start<p.life);
  if(show.reducedMotion){j.shards=[];j.pickups=[];j.relays=[];}
}
function shardBurst(show,x,y,color,n){
  if(show.reducedMotion)return;const j=show.juice;
  for(let i=0;i<n;i++){const k=show.serial++,a=k*2.39996;j.shards.push({x,y,color,start:show.time,life:.5+(k%4)*.1,vx:Math.cos(a)*(2+k%3),vy:Math.sin(a)*2-3,r:.12+(k%3)*.045,spin:(k%2?1:-1)*(3+k%3),phase:a});}
  j.shards=j.shards.slice(-48);
}
export function receiveJuice(show,g,e){
  const j=show.juice,t=show.time,cues=[],x=e.x??g.player.x+.5,y=e.y??g.player.y+.5;
  if(e.type==='chain'&&e.count>=18&&t-j.lastSmash>=.45){
    j.lastSmash=t;const color=CANDY[e.color]||'#ffc65c',huge=e.count>=40;
    shardBurst(show,x,y,color,huge?16:10);
    if(!show.reducedMotion){
      for(let i=0;i<5;i++)j.pickups.push({x:x+(i-2)*.3,y:y-i*.12,color,start:t+i*.035,life:.55,bend:(i-2)*.6});j.pickups=j.pickups.slice(-20);
      j.impactUntil=t+.16;j.impactSize=huge?1.8:1;
    }
    j.labels.push({x:clamp(x,2.8,10.2),y:clamp(y,g.player.ry-2.1,g.player.ry-.6),count:e.count,title:huge?'GEM SHOWER!':'CRYSTAL BREAK!',color,start:t,life:.85});j.labels=j.labels.slice(-1);
    cues.push({type:'crystalBreak',count:e.count});
  }
  if(e.type==='kill'){
    const prev=j.lastKill,linked=prev&&t-prev.time<.55&&Math.hypot(x-prev.x,y-prev.y)<=6;
    j.relayCount=linked?j.relayCount+1:1;
    if(linked&&!show.reducedMotion){j.relays.push({x:prev.x,y:prev.y,x2:x,y2:y,start:t+Math.min(5,j.relayCount-2)*.022,life:.34,count:j.relayCount});j.relays=j.relays.slice(-18);}
    j.lastKill={x,y,time:t};
    if(j.relayCount>=3&&t-j.lastRelayCue>.55){j.lastRelayCue=t;cues.push({type:'relayPop',count:j.relayCount});}
    if(!show.reducedMotion){j.impactUntil=t+.1;j.impactSize=Math.min(1.5,.5+j.relayCount*.15);}
  }
  if(e.type==='pulse'){shardBurst(show,g.player.x+.5,g.player.y+2.5,'#bba0f4',16);if(!show.reducedMotion){j.impactUntil=t+.2;j.impactSize=1.7;}}
  return cues;
}
function gem(c,r,color){
  c.lineWidth=.8;const pts=[[-r*.75,-r*.4],[0,-r],[r*.75,-r*.4],[r*.65,r*.35],[0,r],[-r*.65,r*.35]];
  poly(c,pts,color,shade(color,-40));poly(c,[pts[0],pts[1],[0,0],pts[5]],'#fff7da9c');poly(c,[pts[1],pts[2],pts[3],[0,0]],shade(color,-22));poly(c,[[0,0],pts[3],pts[4]],shade(color,-45));
}
export function drawFeverAtmosphere(c,w,h,g,show){
  if(!show||show.game!==g||!g.started||show.reducedMotion||g.mode==='fever-result')return;
  const t=show.time,fever=g.fever.active>0,boost=show.juice.boost;
  if(!fever&&!boost&&!g.fever.finale)return;c.save();
  // Edge spotlights and perspective streaks never wash out the central shaft.
  if(fever||g.fever.finale){for(const side of [-1,1]){const x=side<0?0:w,a=Math.sin(t*1.6+side)*w*.04;c.globalAlpha=.1;poly(c,[[x,h],[x+side*(-w*.23)+a,0],[x+side*(-w*.08)+a,0]],'#ffe7a0');}}
  const n=boost?22:12;for(let i=0;i<n;i++){const side=i%2?1:-1,k=Math.floor(i/2),u=(t*(boost?1.7:1.1)+k*.137)%1,edge=.01+(k%4)*.022,x=side<0?w*edge:w*(1-edge),y=h*(1-u),len=h*(.025+u*.07);c.globalAlpha=(1-u)*.55;c.strokeStyle=fever?'#fff4c2':'#e5fff2';c.lineWidth=1+(k%2);c.beginPath();c.moveTo(x,y);c.lineTo(x+side*w*.008,y-len);c.stroke();}
  c.restore();
}
export function drawFeverJuice(c,s,g,show){
  if(!show||show.game!==g||show.reducedMotion)return;const j=show.juice,t=show.time;c.save();c.lineCap='round';
  for(const a of j.relays){const age=t-a.start;if(age<0)continue;const u=clamp(age/a.life),v=clamp(u*3),x=a.x*s,y=a.y*s,dx=(a.x2-a.x)*s,dy=(a.y2-a.y)*s;c.globalAlpha=(1-u)*.8;
    for(const [width,col]of [[s*.13,'#edab5b'],[s*.065,'#fff4c5']]){c.lineWidth=width;c.strokeStyle=col;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+dx*.5-dy*.12,y+dy*.5+dx*.12,x+dx*v,y+dy*v);c.stroke();}
    star(c,x+dx*v,y+dy*v,s*(.12+(1-u)*.12),'#fff3b0',null,4);
  }
  for(const a of j.shards){const age=t-a.start,u=clamp(age/a.life),x=(a.x+a.vx*age)*s,y=(a.y+a.vy*age+4*age*age)*s;c.globalAlpha=(1-u)*.95;c.save();c.translate(x,y);c.rotate(a.phase+age*a.spin);gem(c,s*a.r*(1-u*.35),a.color);c.restore();}
  for(const a of j.pickups){const age=t-a.start;if(age<0)continue;const u=clamp(age/a.life),v=u*u,tx=g.player.rx+.5,ty=g.player.ry+.45,x=a.x+(tx-a.x)*v+Math.sin(u*Math.PI)*a.bend,y=a.y+(ty-a.y)*v-Math.sin(u*Math.PI)*1.3;c.globalAlpha=1-u*.8;c.lineWidth=s*.035;c.strokeStyle=a.color;c.beginPath();c.moveTo(x*s,y*s);c.lineTo((x+(a.x-tx)*.06)*s,(y-.2)*s);c.stroke();c.save();c.translate(x*s,y*s);gem(c,s*.12*(1-u*.4),a.color);c.restore();}
  if(j.boost&&g.mode==='play'){
    const p=g.player;for(const side of [-1,1]){const x=p.rx+.5+side*.3,u=(t*9+side*.3)%1;c.globalAlpha=.65;poly(c,[[x*s,(p.ry+.45)*s],[(x+side*.12)*s,(p.ry-.12)*s],[x*s,(p.ry-.65-u*.4)*s],[(x-side*.06)*s,(p.ry-.05)*s]],g.fever.active>0?'#ffda78':'#98f0dc');}
  }c.restore();
}
export function drawFeverReadouts(c,s,g,show,cam=0){
  if(!show||show.game!==g)return;c.save();c.textAlign='center';c.lineJoin='round';
  const j=show.juice;
  if(!j.labels.length&&j.relayCount>=3&&j.lastKill&&show.time-j.lastKill.time<.6){c.font=`900 ${Math.max(10,s*.35)}px sans-serif`;c.lineWidth=4;c.strokeStyle='#fff8df';c.strokeText(`CHAIN ×${j.relayCount}`,(g.player.rx+.5)*s,(g.player.ry-.65)*s);c.fillStyle='#d27a48';c.fillText(`CHAIN ×${j.relayCount}`,(g.player.rx+.5)*s,(g.player.ry-.65)*s);}
  for(const a of j.labels){const u=clamp((show.time-a.start)/a.life),rise=show.reducedMotion?0:Math.sin(Math.min(1,u*2)*Math.PI/2)*.45,scale=show.reducedMotion?1:1+Math.sin(Math.min(1,u*4)*Math.PI)*.14;
    c.save();c.translate(a.x*s,Math.max((a.y-rise)*s,cam*s+48+s*.65));c.scale(scale,scale);c.globalAlpha=Math.min(1,(1-u)*4);c.rotate(show.reducedMotion?0:-.055);c.font=`900 ${Math.max(14,s*.64)}px sans-serif`;c.strokeStyle='#fff8df';c.lineWidth=5;c.strokeText(`${a.count} BREAK!`,0,-s*.65);c.lineWidth=1.2;c.strokeStyle=INK;c.strokeText(`${a.count} BREAK!`,0,-s*.65);c.fillStyle='#d27843';c.fillText(`${a.count} BREAK!`,0,-s*.65);c.font=`800 ${Math.max(7,s*.24)}px sans-serif`;c.lineWidth=3;c.strokeStyle='#fff8df';c.strokeText(a.title,0,-s*.25);c.fillStyle=INK;c.fillText(a.title,0,-s*.25);star(c,-s*1.65,-s*.8,s*.16,a.color,null,4);star(c,s*1.65,-s*.6,s*.12,a.color,null,4);c.restore();
  }c.restore();
}
