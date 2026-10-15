import {ENEMY_TYPES,heading} from './enemies.mjs';
function polygon(c,points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function oval(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function drawSpecialEnemy(c,s,e,g,clock){
  const spec=ENEMY_TYPES[e.type];if(!spec)return false;
  const [dx,dy]=e.type==='shield'?(e.guardDir||[0,-1]):e.intent?.dx!==undefined?[e.intent.dx,e.intent.dy]:heading(e,g.player),angle=Math.atan2(dy,dx)+Math.PI/2;
  const body=e.flash>0?'#fff5d9':spec.color,ink='#24353c',light='#f5e5bf',stride=Math.sin(clock*10+e.x)*.04;
  c.save();c.translate((e.rx+.5)*s,(e.ry+.57)*s);c.scale(s,s);c.lineWidth=.028;
  oval(c,0,.33,.35,.09,'#0005');
  if(e.type==='rusher'){
    c.save();c.rotate(angle);
    for(const side of [-1,1])for(let i=-1;i<=1;i++)polygon(c,[[side*.23,i*.18],[side*(.42+stride),i*.18+.08],[side*.4,i*.18+.14]],null,'#cba77a');
    oval(c,0,.02,.3,.35,body,light);polygon(c,[[0,-.3],[0,.33]],null,'#805142');
    for(const side of [-1,1])polygon(c,[[side*.08,-.2],[side*.23,-.39],[side*.17,-.48],[side*.03,-.3]],light,ink);
    c.fillStyle=ink;c.fillRect(-.18,-.19,.09,.075);c.fillRect(.09,-.19,.09,.075);c.restore();
  }else if(e.type==='burrower'){
    c.save();c.rotate(angle);oval(c,0,.04,.32,.3,body,light);oval(c,0,-.13,.26,.21,'#7c6958',light);
    polygon(c,[[-.16,-.21],[0,-.49],[.16,-.21]],'#d6d7c5',ink);
    for(const side of [-1,1]){oval(c,side*.28,.12+stride,.12,.16,'#927861',light);for(let i=0;i<3;i++)polygon(c,[[side*(.19+i*.07),.05+stride],[side*(.23+i*.07),-.14+stride],[side*(.27+i*.07),.07+stride]],'#f3dfba',ink);}
    c.fillStyle='#ffe49d';c.fillRect(-.2,-.19,.07,.07);c.fillRect(.13,-.19,.07,.07);c.restore();
  }else if(e.type==='spitter'){
    for(const side of [-1,1])polygon(c,[[0,.31],[side*.4,.15],[side*.27,.37],[0,.42]],'#648d76','#bfd5a2');
    polygon(c,[[-.12,.35],[-.09,-.17],[.09,-.17],[.12,.35]],'#658d78',light);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5+clock*.35;oval(c,Math.cos(a)*.22,Math.sin(a)*.17-.13,.16,.13,body,'#efd9f4');}
    c.save();c.translate(0,-.12);c.rotate(angle);polygon(c,[[-.12,.08],[-.18,-.26],[.18,-.26],[.12,.08]],'#7f668f',light);oval(c,0,-.25,.18,.10,'#263a3c','#d8dda4');oval(c,0,-.26,.065,.04,'#e2eb9c');c.restore();
  }else if(e.type==='splitter'){
    oval(c,0,.05,.39,.31,body,light);oval(c,-.2,-.04,.21,.24,body,light);oval(c,.2,-.04,.21,.24,body,light);
    for(const x of [-.2,.2]){oval(c,x,-.04,.11,.13,'#527f8b');c.fillStyle='#e5fff0';c.fillRect(x-.06,-.07,.04,.06);c.fillRect(x+.02,-.07,.04,.06);}
    oval(c,-.06,.17+stride,.07,.055,'#c4fff05f');
  }else if(e.type==='bomber'){
    const pulse=e.intent?.kind==='bomb'?1+Math.sin(clock*32)*.06:1;c.save();c.scale(pulse,pulse);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;polygon(c,[[Math.cos(a)*.26,Math.sin(a)*.26],[Math.cos(a)*.44,Math.sin(a)*.44],[Math.cos(a+.3)*.29,Math.sin(a+.3)*.29]],'#85645d',light);}
    oval(c,0,0,.29,.31,body,light);oval(c,0,0,.18,.2,'#5a404a');polygon(c,[[.02,-.17],[-.12,.02],[0,.02],[-.03,.18],[.14,-.04],[.03,-.04]],'#ffda92');
    oval(c,0,-.4,.045,.045,e.intent?'#fff0ab':'#cfac7f');c.restore();
  }else if(e.type==='shield'){
    c.save();c.rotate(angle);for(const side of [-1,1])for(const y of [-.12,.24])oval(c,side*.3,y+stride,.10,.1,'#718da2',light);
    oval(c,0,.06,.29,.3,'#617f91',light);oval(c,0,-.15,.19,.16,body,light);c.fillStyle='#ffe19c';c.fillRect(-.1,-.22,.06,.06);c.fillRect(.04,-.22,.06,.06);
    if(!(e.guardBroken>0)){polygon(c,[[-.34,-.33],[0,-.46],[.34,-.33],[.27,-.03],[0,.12],[-.27,-.03]],body,light);polygon(c,[[0,-.38],[0,.02]],null,'#5f7e9b');if(e.guardHits)polygon(c,[[-.14,-.32],[.04,-.17],[-.1,-.04]],null,'#3d596e');}
    else for(const side of [-1,1])polygon(c,[[side*.28,-.26],[side*.43,-.1],[side*.27,.03]],body,light);c.restore();
  }
  if(e.frozen>0){polygon(c,[[-.43,-.26],[0,-.48],[.43,-.26],[.4,.29],[0,.44],[-.4,.29]],'#b7efff19','#c8f4ff');}
  if(e.hp<e.maxHp){c.fillStyle='#0a1721';c.fillRect(-.35,-.59,.7,.06);c.fillStyle='#ffd19c';c.fillRect(-.35,-.59,.7*Math.max(0,e.hp/e.maxHp),.06);}
  c.restore();return true;
}
export function drawEnemyIntent(c,s,e,g,clock){
  const a=e.intent;if(!a)return;c.save();c.lineWidth=1;
  const color=a.kind==='spit'?'#d2eca0':a.kind==='bomb'?'#ffb097':'#ffd295';c.strokeStyle=color;c.fillStyle=color+'20';
  if(a.kind==='bomb'){
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=(e.x+dx)*s,y=(e.y+dy)*s;c.fillRect(x,y,s,s);c.strokeRect(x+2,y+2,s-4,s-4);}
  }else for(let i=1;i<=(a.kind==='rush'?a.left:6);i++){
    const x=e.x+a.dx*i,y=e.y+a.dy*i;if(g.at(x,y)||g.occupied(x,y))break;c.fillRect(x*s,y*s,s,s);c.save();c.translate((x+.5)*s,(y+.5)*s);c.rotate(Math.atan2(a.dy,a.dx));polygon(c,[[-s*.14,-s*.12],[s*.1,0],[-s*.14,s*.12]],null,color);c.restore();
  }
  c.globalAlpha=.6+Math.sin(clock*22)*.3;c.fillStyle=color;c.font=`bold ${s*.35}px sans-serif`;c.textAlign='center';c.fillText('!',(e.rx+.5)*s,(e.ry-.13)*s);c.restore();
}
