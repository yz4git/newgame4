// Ephemeral presentation only: no world writes, simulation RNG, saves or timers.
import {star,INK,CANDY} from './casual-world.mjs';
import {resetJuice,updateJuice,receiveJuice} from './fever-juice.mjs';
export class FeverShow{
  constructor({reducedMotion=false}={}){this.reducedMotion=reducedMotion;this.game=null;}
  bind(g){if(this.game===g)return;this.game=g;this.time=g.time;this.remaining=g.fever?.remaining??90;this.active=g.fever?.active??0;this.sector=g.sector;this.sparks=[];this.confetti=[];this.impacts=[];this.banner=null;this.comboBeat=0;this.lastBurst=-1;this.milestone=Math.floor((g.combo||0)/20);this.serial=0;this.entryScore=null;resetJuice(this);}
  drive(g,boost){this.bind(g);this.juice.boost=!!boost;}
  announce(title,sub,color='#ffcf6a',priority=1,duration=1.25){if(this.banner&&this.banner.until>this.time&&this.banner.priority>priority)return;this.banner={title,sub,color,priority,start:this.time,until:this.time+duration};}
  celebrate(n=30){if(this.reducedMotion)return;for(let i=0;i<n;i++){const k=this.serial++;this.confetti.push({start:this.time,life:1.5+(k%7)*.1,side:k%2,u:(k%11)/11,color:[...CANDY,'#ffd567'][k%5],phase:k*2.4});}this.confetti=this.confetti.slice(-60);}
  burst(x,y,count=12,color='#ffd567'){
    if(this.reducedMotion||this.time-this.lastBurst<.075)return;this.lastBurst=this.time;
    this.impacts.push({x,y,start:this.time,color});this.impacts=this.impacts.slice(-10);
    for(let i=0;i<Math.min(18,count);i++){const k=this.serial++,a=k*2.39996;this.sparks.push({x,y,start:this.time,life:.35+(k%5)*.07,vx:Math.cos(a)*(1.5+k%4),vy:Math.sin(a)*(1.5+k%3)-1.5,color:k%3?color:'#fff6cb',star:k%3===0});}this.sparks=this.sparks.slice(-72);
  }
  update(g){
    this.bind(g);if(g.arcade!=='fever')return [];
    const cues=[],f=g.fever;this.time=g.time;updateJuice(this,g);
    if(g.sector!==this.sector){this.sparks=[];this.impacts=[];this.sector=g.sector;}
    this.sparks=this.sparks.filter(p=>this.time-p.start<p.life);this.confetti=this.confetti.filter(p=>this.time-p.start<p.life);this.impacts=this.impacts.filter(p=>this.time-p.start<.24);
    if(this.banner?.until<=this.time)this.banner=null;
    // Thresholds depend on active game time. Resuming does not replay old cues.
    if(g.mode==='play'&&g.started){
      const n=Math.ceil(f.remaining);if(n>0&&n<=3&&n<Math.ceil(this.remaining)){this.announce(String(n),'LAST SPURT','#ffbd83',5,.72);cues.push({type:'feverTick',count:n});}
      if(this.active>0&&f.active===0){const points=this.entryScore===null?'':`+${Math.max(0,f.score-this.entryScore).toLocaleString('ja-JP')} POINTS`;if(f.remaining>3)this.announce('FEVER CLEAR!',points||'KEEP THE COMBO','#8bdfc5',2,1.1);this.entryScore=null;cues.push({type:'feverOut'});}
    }
    this.remaining=f.remaining;this.active=f.active;return cues;
  }
  receive(g,e){
    this.bind(g);if(g.arcade!=='fever')return [];this.time=g.time;const cues=receiveJuice(this,g,e);
    if(e.type==='chain'){
      this.comboBeat=this.time+.2;
      this.burst(e.x??g.player.x+.5,e.y??g.player.y+.8,Math.min(18,e.count),CANDY[e.color]||'#ffd567');
      const mark=Math.floor(e.combo/20);if(mark>this.milestone){this.milestone=mark;this.announce(`${mark*20} COMBO!`,mark>=5?'UNSTOPPABLE!':'KEEP IT GOING!','#a7e9d0',1,1);this.celebrate(12);cues.push({type:'comboMilestone',combo:mark*20});}
    }
    if(e.type==='kill')this.burst(e.x??g.player.x+.5,e.y??g.player.y+.5,10,'#ffca77');
    if(e.type==='pulse')this.burst(g.player.x+.5,g.player.y+2.5,18,'#bba0f4');
    if(e.type==='fever'){this.entryScore=g.fever.score;this.active=g.fever.active;this.announce('FEVER!','3 LANES  /  SCORE ×3','#ffd064',4,1.65);this.celebrate(44);}
    if(e.type==='finale'){this.announce('GOLD RUSH!','LAST 12 SECONDS','#ffd064',4,1.55);this.celebrate(48);}
    if(e.type==='upgrade')this.announce('POWER UP!',g.fever.upgrades>=2?'BIGGER CHAIN REACTIONS':'DOUBLE DRILL','#b8e7d3',2,1.2);
    if(e.type==='feverFinish'){this.announce('NICE DIG!','90 SECONDS COMPLETE','#ffce70',6,2);this.celebrate(60);}
    return cues;
  }
}
export function drawFeverImpact(c,s,g,show){
  if(!show||show.game!==g||show.reducedMotion)return;const t=show.time;c.save();
  if(g.fever.active>0&&g.started&&g.mode==='play'){
    // Slim exhaust ribbons flank the miner; the collision cell stays unobscured.
    const p=g.player;for(const dx of [-.43,.43]){c.strokeStyle='#fff2b2';c.lineWidth=s*.09;c.beginPath();c.moveTo((p.rx+.5+dx)*s,(p.ry+.15)*s);c.quadraticCurveTo((p.rx+.5+dx*1.4)*s,(p.ry-.5)*s,(p.rx+.5+dx)*s,(p.ry-1.2)*s);c.stroke();}
    for(let i=0;i<6;i++){const u=(t*2+i/6)%1,x=p.rx+.5+(i%2?1:-1)*(.65+u*.4),y=p.ry+.7-u*1.8;c.globalAlpha=1-u;star(c,x*s,y*s,s*(.04+.04*(1-u)),'#fff3b4',null,4);}
  }
  for(const p of show.impacts){const u=(t-p.start)/.24;c.globalAlpha=(1-u)*.7;for(let i=0;i<5;i++){const a=i*1.2566;c.strokeStyle=p.color;c.lineWidth=s*.055;c.beginPath();c.moveTo((p.x+Math.cos(a)*(.2+u*.55))*s,(p.y+Math.sin(a)*(.2+u*.55))*s);c.lineTo((p.x+Math.cos(a)*(.45+u*.8))*s,(p.y+Math.sin(a)*(.45+u*.8))*s);c.stroke();}}
  for(const p of show.sparks){const a=t-p.start,u=a/p.life,x=(p.x+p.vx*a)*s,y=(p.y+p.vy*a+a*a*3)*s,r=s*.09*(1-u*.6);c.globalAlpha=1-u;c.save();c.translate(x,y);c.rotate(a*5);if(p.star)star(c,0,0,r*1.5,p.color,null,4);else{c.fillStyle=p.color;c.fillRect(-r,-r,r*1.4,r*2);}c.restore();}c.restore();
}
export function drawFeverShow(c,w,h,g,show){
  if(!show||show.game!==g)return;c.save();const t=show.time,f=g.fever,small=h<350;
  if(g.started&&g.mode==='play'&&(f.active>0||f.finale)){
    const gold=f.finale?'#ffc060':'#ffd571',a=show.reducedMotion?.35:.35+Math.sin(t*8)*.12;
    c.globalAlpha=a;c.fillStyle=gold;c.fillRect(0,0,4,h);c.fillRect(w-4,0,4,h);c.globalAlpha=1;
    for(let i=0;i<8;i++){const y=(i+.5)*h/8;star(c,10,y,3,gold,null,4);star(c,w-10,y,3,gold,null,4);}
    c.fillStyle='#fff4d8ed';c.strokeStyle='#e5b968';c.lineWidth=1;c.beginPath();c.roundRect(w/2-83,7,166,23,11);c.fill();c.stroke();c.fillStyle='#946141';c.textAlign='center';c.font='900 11px sans-serif';c.fillText(f.active>0?`FEVER ×3   ${f.active.toFixed(1)}s`:'GOLD RUSH · LAST SPURT',w/2,23);
  }
  for(const p of show.confetti){const a=t-p.start,u=a/p.life;c.globalAlpha=Math.min(1,(1-u)*3);const x=p.side?w-w*(.02+p.u*.14+Math.sin(a*3+p.phase)*.02):w*(.02+p.u*.14+Math.sin(a*3+p.phase)*.02),y=h*(u*.95-.04);c.save();c.translate(x,y);c.rotate(p.phase+a*4);c.fillStyle=p.color;c.fillRect(-2,-4,4,8*(.3+Math.abs(Math.cos(a*6+p.phase))*.7));c.restore();}
  const b=show.banner;if(b&&t<b.until){const age=t-b.start,life=b.until-t,scale=show.reducedMotion?1:Math.min(1.08,.8+age*2.2),alpha=Math.min(1,age*12+.2,life*6),bw=Math.min(290,w-44),y=small?39:48;
    c.globalAlpha=alpha;c.translate(w/2,y);c.scale(scale,scale);c.fillStyle='#a474492a';c.beginPath();c.roundRect(-bw/2,4,bw,65,20);c.fill();c.fillStyle='#fff8df';c.strokeStyle=b.color;c.lineWidth=3;c.beginPath();c.roundRect(-bw/2,0,bw,62,19);c.fill();c.stroke();star(c,-bw/2+17,30,8,b.color,null,4);star(c,bw/2-17,30,8,b.color,null,4);
    c.textAlign='center';c.fillStyle=INK;c.font=`900 ${b.title.length>13?23:30}px sans-serif`;c.fillText(b.title,0,31,bw-40);c.font='800 9px sans-serif';c.fillStyle='#9b7857';c.fillText(b.sub,0,49,bw-30);
  }c.restore();
}
