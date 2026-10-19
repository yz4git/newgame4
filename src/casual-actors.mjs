import {poly,oval,box,gradient,shade} from './art-core.mjs';
import {INK,star,CANDY,toyGem} from './casual-world.mjs';
import {heading} from './enemies.mjs';

function bubble(c,x,y,rx,ry,col,stroke=INK){
  c.lineWidth=.027;
  oval(c,x,y,rx,ry,gradient(c,x-rx,y-ry,x+rx,y+ry,[shade(col,31),col,shade(col,-24)]),stroke);
  oval(c,x-rx*.3,y-ry*.48,rx*.28,ry*.13,'#fffdef8c');
}
function face(c,x,y,spacing=.11,blink=false,smile=true){
  c.save();c.lineWidth=.023;
  for(const side of [-1,1]){
    const xx=x+side*spacing;
    if(blink){c.strokeStyle=INK;c.beginPath();c.moveTo(xx-.043,y+.012);c.quadraticCurveTo(xx,y-.03,xx+.043,y+.012);c.stroke();}
    else {oval(c,xx,y,.06,.077,'#fffdf0',INK);oval(c,xx+.007,y+.006,.027,.043,'#29465e');oval(c,xx+.014,y-.015,.011,.015,'#fffef3');}
    oval(c,x+side*(spacing+.07),y+.09,.042,.022,'#f59ba17d');
  }
  if(smile){c.strokeStyle=INK;c.beginPath();c.moveTo(x-.047,y+.11);c.quadraticCurveTo(x,y+.16,x+.047,y+.11);c.stroke();}
  c.restore();
}
function glove(c,x,y,col='#fff4d6'){bubble(c,x,y,.105,.115,col);}

export function drawCasualMiner(c,s,p,clock){
  const x=(p.rx+.5)*s,y=(p.ry+.52)*s,bounce=Math.sin(clock*8)*.012;
  c.save();c.translate(x,y+bounce*s);c.scale(s,s);c.lineWidth=.027;c.lineJoin='round';
  oval(c,0,.43,.35,.075,'#275c6a40');
  // A cream silhouette rim keeps the explorer clear in every candy palette.
  oval(c,0,-.2,.355,.345,'#fff8e8');box(c,-.265,-.03,.53,.44,.13,'#fff8e8');
  box(c,-.35,-.04,.21,.33,.09,'#ffaa66',INK);box(c,-.32,.02,.14,.07,.025,'#ffdb89');
  for(const side of [-1,1]){
    bubble(c,side*.13,.32,.13,.12,'#297f96');box(c,side*.13-.11,.35,.22,.065,.025,'#ffe0a0',INK);
  }
  bubble(c,0,.13,.24,.25,'#60c4bd');box(c,-.11,.06,.22,.2,.05,'#399baf',INK);star(c,0,.14,.075,'#fff1ae');
  c.strokeStyle='#f9dc93';c.lineWidth=.07;poly(c,[[-.17,-.02],[-.1,.24]],null,c.strokeStyle);poly(c,[[.17,-.02],[.1,.24]],null,c.strokeStyle);
  glove(c,-.27,.14);glove(c,.27,.14);
  bubble(c,0,-.2,.31,.29,'#ffb65f');
  oval(c,0,-.12,.245,.19,'#fff0d1',INK);face(c,0,-.15,.095,p.invuln>0&&Math.floor(clock*9)%2===0||clock>1.2&&Math.floor(clock*4)%29===0);
  box(c,-.34,-.28,.68,.09,.045,'#ffcf72',INK);
  c.lineWidth=.022;box(c,-.08,-.5,.16,.15,.055,'#4da9bd',INK);oval(c,0,-.425,.042,.046,'#fff6ba');
  oval(c,-.13,-.36,.09,.035,'#fff5b89e');
  // A chunky toy drill stays aligned with the actual automatic mining direction.
  c.save();c.translate(.13,.22);
  box(c,-.1,-.06,.23,.19,.06,gradient(c,0,0,.2,.2,['#86def0','#35a5b9']),INK);box(c,-.06,-.07,.15,.06,.02,'#ffe099',INK);
  poly(c,[[-.115,.1],[.11,.1],[0,.38]],gradient(c,-.1,.1,.1,.35,['#f8fbdf','#99d0d2','#4699b7']),INK);
  c.strokeStyle='#548da8';c.lineWidth=.022;
  const shift=(clock*6)%1;
  for(let i=0;i<3;i++){const yy=.12+(i+shift)*.065,ww=Math.max(.01,.11*(.38-yy)/.28);poly(c,[[-ww,yy],[ww,yy+.035]],null,c.strokeStyle);}
  c.restore();c.restore();
}

export function drawCasualEnemy(c,s,e,g,clock){
  const col=e.flash>0?'#fff1bd':e.type==='rusher'?'#ffbc66':e.type==='burrower'?'#ddbc94':e.type==='spitter'?'#cba0f2':e.type==='splitter'?'#72e0c4':e.type==='bomber'?'#ffa1b1':e.type==='shield'?'#8ad2bd':e.type==='moth'?'#be9de6':CANDY[(g.stage||0)%4];
  c.save();c.translate((e.rx+.5)*s,(e.ry+.55+Math.sin(clock*6+e.x)*.018)*s);c.scale(s,s);c.lineWidth=.027;c.lineJoin='round';c.lineCap='round';
  oval(c,0,.34,.33,.07,'#2c536537');
  const [dx,dy]=e.intent?.dx!==undefined?[e.intent.dx,e.intent.dy]:heading(e,g.player),angle=Math.atan2(dy,dx)+Math.PI/2;
  if(e.type==='rusher'){
    c.save();c.rotate(angle);
    for(const side of [-1,1])for(let i=0;i<3;i++){c.strokeStyle='#a47763';c.lineWidth=.045;poly(c,[[side*.24,-.12+i*.16],[side*.42,-.07+i*.15]],null,c.strokeStyle);}
    bubble(c,0,.03,.31,.33,col);c.strokeStyle='#d69b52';c.lineWidth=.025;poly(c,[[0,-.26],[0,.34]],null,c.strokeStyle);
    for(const side of [-1,1]){bubble(c,side*.11,-.27,.065,.13,'#fff0b7');}face(c,0,-.06,.12);c.restore();
  }else if(e.type==='burrower'){
    for(const side of [-1,1]){bubble(c,side*.27,.16,.12,.13,'#c3a185');for(let i=0;i<2;i++)bubble(c,side*(.23+i*.07),.1,.038,.1,'#fff2cf');}
    bubble(c,0,.01,.32,.32,col);oval(c,0,.09,.2,.15,'#fff0d0',INK);face(c,0,-.09,.12);
    poly(c,[[-.075,.02],[0,-.08],[.075,.02]],'#75c8cf',INK);bubble(c,0,-.3,.25,.12,'#ffcf7d');
  }else if(e.type==='spitter'){
    box(c,-.055,.02,.11,.33,.05,'#72b98c',INK);
    for(const side of [-1,1]){c.save();c.translate(side*.17,.24);c.rotate(side*.5);bubble(c,0,0,.18,.07,'#9dd49b');c.restore();}
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5-Math.PI/2;oval(c,Math.cos(a)*.22,Math.sin(a)*.22-.08,.16,.16,gradient(c,0,-.4,0,.1,['#f2caff',col]),'#8e78b0');}
    bubble(c,0,-.075,.2,.2,'#fff0a1');face(c,0,-.1,.08,false,false);oval(c,0,.025,.045,.04,'#6d937b');
  }else if(e.type==='splitter'){
    for(const side of [-1,1]){bubble(c,side*.17,.04,.23,.29,col);face(c,side*.17,.015,.07,false,false);}
    c.strokeStyle='#459f9e';c.beginPath();c.moveTo(-.04,.22);c.quadraticCurveTo(0,.26,.05,.22);c.stroke();
  }else if(e.type==='bomber'){
    for(let i=0;i<8;i++){const a=i*Math.PI/4;bubble(c,Math.cos(a)*.31,Math.sin(a)*.31,.085,.08,'#ffc3a9');}
    bubble(c,0,0,.29,.3,col);face(c,0,-.035,.11);
    c.strokeStyle=INK;c.lineWidth=.035;poly(c,[[.02,-.28],[.07,-.4],[.15,-.37]],null,c.strokeStyle);star(c,.16,-.38,.07,e.intent?'#fff0aa':'#ffd477');
  }else if(e.type==='shield'){
    for(const side of [-1,1])for(const yy of [-.09,.24])bubble(c,side*.27,yy,.105,.09,'#95dec3');
    bubble(c,0,.05,.3,.3,col);bubble(c,0,-.24,.19,.14,'#b5e6b9');face(c,0,-.245,.085,false,false);
    poly(c,[[-.25,-.11],[0,-.23],[.25,-.11],[.24,.17],[0,.3],[-.24,.17]],gradient(c,0,-.2,0,.3,['#d7c6fa','#a694d2']),'#788faf');
    c.lineWidth=.02;poly(c,[[-.16,-.05],[0,-.12],[.16,-.05],[.14,.13],[0,.21],[-.14,.13]],'#c5b8ec','#ede9ff');star(c,0,.04,.08,'#ffecaa');
  }else if(e.type==='moth'){
    const flap=Math.sin(clock*19+e.x)*.06;
    for(const side of [-1,1]){c.beginPath();c.moveTo(side*.1,-.12);c.quadraticCurveTo(side*.39,-.4-flap,side*.46,-.22-flap);c.quadraticCurveTo(side*.5,.08,side*.22,.2);c.closePath();c.fillStyle=gradient(c,0,-.3,0,.2,['#e8b5f4','#b296d9']);c.fill();c.strokeStyle='#8878a8';c.stroke();oval(c,side*.28,-.03,.07,.11,'#f5d0ef8c');}
    bubble(c,0,.01,.18,.28,col);for(const side of [-1,1]){c.strokeStyle='#8878a8';poly(c,[[side*.07,-.22],[side*.12,-.39]],null,c.strokeStyle);oval(c,side*.12,-.39,.045,.045,'#ffda94',INK);}face(c,0,-.07,.075);
  }else if(e.kind==='spore'){
    bubble(c,0,.14,.2,.19,'#fce9c5');oval(c,0,-.1,.37,.24,gradient(c,0,-.4,0,.1,['#e5b5f2','#b692d4']),'#8f74a8');
    for(const xx of [-.2,0,.2])oval(c,xx,-.18,.055,.035,'#fff3dc');face(c,0,.12,.08);
  }else if(e.kind==='jelly'){
    for(let i=-1;i<=1;i++){c.strokeStyle='#6daecb';c.lineWidth=.065;c.beginPath();c.moveTo(i*.18,.12);c.quadraticCurveTo(i*.18+Math.sin(clock*4+i)*.04,.34,i*.2,.4);c.stroke();}
    bubble(c,0,-.02,.34,.28,'#78d9ef');face(c,0,-.04,.115);
  }else if(e.kind==='scarab'){
    for(const side of [-1,1]){oval(c,side*.25,-.12,.15,.21,'#f5f7dece','#b8c9af');glove(c,side*.22,.25,'#c59168');}
    bubble(c,0,.04,.28,.31,'#ffcf72');c.lineWidth=.055;poly(c,[[-.24,.04],[.24,.04]],null,'#cd9f5c');face(c,0,-.095,.1);
  }else if(e.kind==='ember'){
    for(const side of [-1,1]){bubble(c,side*.22,.24,.1,.08,'#b99c7a');oval(c,side*.15,-.28,.09,.15,'#ffe79b',INK);}
    bubble(c,0,.025,.3,.3,'#ffa77e');face(c,0,-.02,.11);star(c,0,.22,.06,'#fff3b5');
  }else if(e.kind==='void'||e.type==='hunter'){
    star(c,0,0,.44,'#c0a5f0',INK,5,.72);bubble(c,0,0,.25,.25,'#bca5e8');face(c,0,-.04,.1);
  }else{
    for(const side of [-1,1])bubble(c,side*.16,.29,.12,.075,'#4ca992');
    bubble(c,0,.025,.31,.3,'#7ddcb1');c.save();c.translate(.03,-.25);c.rotate(-.4);oval(c,.06,-.07,.14,.075,'#a0e69b',INK);c.restore();face(c,0,-.015,.11);
  }
  c.restore();
}
