import {shade,blend,poly,oval,box,gradient,glow,crystal} from './art-core.mjs';
const COLORS=['#71dcae','#f5af66','#78cfee','#b6a0f6'];
export function healthBar(c,e,y=-.49){if(e.hp>=e.maxHp)return;box(c,-.36,y,.72,.065,.02,'#07101e','#ccd9c038');box(c,-.34,y+.014,.68*Math.max(0,e.hp/e.maxHp),.037,.01,'#f4bb82');}
function eye(c,x,y,col='#fff0ae'){oval(c,x,y,.055,.065,'#14252a',col);oval(c,x+.012,y-.01,.023,.032,col);}
function body(c,x,y,rx,ry,col){oval(c,x,y,rx,ry,gradient(c,x-rx,y-ry,x+rx,y+ry,[shade(col,39),col,shade(col,-52)]),shade(col,50));}

export function drawMiner(c,s,p,clock){
  const x=(p.rx+.5)*s,y=(p.ry+.53)*s,col=COLORS[p.element],moving=Math.abs(p.rx-p.x)+Math.abs(p.ry-p.y)>.04;
  glow(c,x,y-s*.12,s*2.1,'#ffe2a2','10');
  c.save();c.translate(x,y);c.scale(s,s);c.lineWidth=.018;
  if(p.invuln>0&&Math.floor(clock*14)%2)c.globalAlpha=.68;
  oval(c,0,.4,.36,.09,'#020a12a0');
  if(p.shield){c.strokeStyle='#b7e9d05a';c.lineWidth=.025;c.beginPath();c.arc(0,-.03,.54,-2.7,1.1);c.stroke();}
  c.scale(p.dir==='left'?-1:1,1);
  box(c,-.34,-.12,.22,.37,.07,gradient(c,-.35,0,-.1,0,['#252f38','#806b49','#b69b68']),'#d7bc83');
  for(const yy of [-.01,.13])box(c,-.36,yy,.25,.045,.015,'#374a4a','#b6b88d');
  const stride=moving?Math.sin(clock*22)*.045:0;
  for(const [xx,off]of [[-.17,stride],[.07,-stride]]){
    box(c,xx,.2+off,.16,.22,.04,gradient(c,0,.2,0,.43,['#506e69','#243c3c']),'#91ab93');
    box(c,xx-.015,.34+off,.2,.095,.025,'#867151','#d7bd84');poly(c,[[xx,.38+off],[xx+.16,.38+off]],null,'#e2ce9d');
  }
  poly(c,[[-.23,-.16],[.2,-.18],[.29,.25],[.07,.31],[-.26,.25]],gradient(c,-.2,-.2,.25,.3,['#83a697','#3e6e69','#213d42']),'#bad2ad');
  poly(c,[[-.14,-.12],[-.08,.24],[.06,.26],[.08,-.15]],'#a7946360');
  box(c,-.23,.15,.49,.06,.015,'#c0a66d','#f0d79f');box(c,-.04,.13,.1,.1,.02,'#535d54','#f2d598');
  crystal(c,.04,-.04,.085,col);
  // Neck scarf and a domed exploration helmet with a glass visor.
  poly(c,[[-.22,-.14],[.16,-.18],[.24,-.09],[-.03,-.02],[-.24,-.08]],'#b18a56','#e1c28a');
  oval(c,0,-.32,.3,.27,gradient(c,-.3,-.55,.25,-.1,['#a8c1b0','#496f6c','#243d49']),'#d5d9ad');
  box(c,-.25,-.35,.5,.21,.08,gradient(c,-.2,-.37,.2,-.15,['#b8c9b1','#dfbb89','#9b7758']),'#e5d0a2');
  box(c,-.19,-.32,.39,.135,.055,'#293a3d','#a6c6b5');
  poly(c,[[-.15,-.3],[.03,-.31],[-.06,-.2],[-.17,-.22]],'#a5ded235');
  for(const xx of [-.08,.1])box(c,xx,-.279,.04,.045,.01,'#f1d6a1');
  poly(c,[[-.26,-.39],[.24,-.39]],null,'#d0d3ad');
  box(c,-.08,-.57,.16,.15,.045,'#6e684b','#e6d7a7');oval(c,0,-.5,.048,.045,'#fff4c6');
  glow(c,0,-.5,.26,'#ffdf90','38');
  body(c,-.26,.02,.095,.13,'#a18d64');
  // The spiral tool follows the input direction; pose and spin freeze in turn mode.
  c.save();c.translate(.19,.04);c.rotate(p.dir==='down'?Math.PI/2:p.dir==='up'?-Math.PI/2:0);
  const recoil=p.drillTimer>0?Math.sin(clock*40)*.018:0;c.translate(recoil,0);
  box(c,-.02,-.12,.3,.24,.055,gradient(c,0,-.12,0,.12,['#e8d5a3','#9a9474','#445e62']),'#e4d8aa');
  box(c,.05,-.1,.07,.2,.015,'#384e56');box(c,.06,-.055,.05,.11,.01,col);
  poly(c,[[.25,-.14],[.51,0],[.25,.14]],gradient(c,.25,-.14,.4,.14,['#e4eee0','#a0b2aa','#43616c']),'#ced8bf');
  for(let i=0;i<4;i++){const a=.27+i*.047,hh=(.5-a)*.52;poly(c,[[a,-hh],[a+.045,hh*.7]],null,'#3e5862');}
  poly(c,[[.28,-.11],[.45,-.015]],null,'#fcf3d7');c.restore();c.restore();
  const d={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[p.dir],ax=x+d[0]*s*.72,ay=y+d[1]*s*.72;
  c.save();c.lineWidth=1.5;poly(c,[[ax,ay-s*.08],[ax+s*.08,ay],[ax,ay+s*.08],[ax-s*.08,ay]],'#10232b99',col);c.restore();
}

export function drawCommonEnemy(c,s,e,g,clock){
  const col=e.flash>0?'#fff0c9':e.type==='armored'||e.type==='sentry'?'#8fa7b6':g.biome.tint;
  c.save();c.translate((e.rx+.5)*s,(e.ry+.57)*s);c.scale(s,s);c.lineWidth=.016;
  oval(c,0,.33,.36,.08,'#0207119c');if(e.type==='swarm')c.scale(.87,.87);
  if(e.type==='armored'||e.type==='sentry'){
    for(const side of [-1,1]){box(c,side*.3-.1,-.02,.2,.31,.06,gradient(c,0,-.1,0,.3,['#b3bbaa','#4d6779']),'#d1d7b8');box(c,side*.18-.09,.23,.18,.16,.04,'#576c77','#b8c7b8');}
    poly(c,[[-.31,-.24],[0,-.39],[.31,-.24],[.29,.25],[0,.34],[-.29,.25]],gradient(c,-.2,-.3,.2,.3,['#abb9aa','#607e88','#314d63']),'#c9d2b8');
    box(c,-.21,-.34,.42,.23,.06,'#718e91','#d1d9bb');box(c,-.16,-.27,.32,.075,.02,'#172d3b');
    eye(c,0,-.23,'#ffdda5');crystal(c,0,.06,.15,e.type==='sentry'?'#e5ae72':'#9ac5cf');
    for(const side of [-1,1])poly(c,[[side*.25,-.16],[side*.05,.02],[side*.2,.22]],null,'#334f60');
  }else if(e.kind==='scarab'){
    for(const side of [-1,1])for(let j=0;j<3;j++)poly(c,[[side*.23,-.16+j*.17],[side*.44,-.22+j*.2],[side*.47,-.08+j*.18]],null,'#bda16c');
    body(c,0,.02,.31,.35,blend(col,'#d1a368',.3));poly(c,[[0,-.29],[0,.33]],null,'#523c31');
    for(const side of [-1,1])poly(c,[[side*.04,-.25],[side*.13,-.46],[side*.2,-.39]],'#ceb677','#f1dab0');eye(c,-.12,-.19);eye(c,.12,-.19);
  }else if(e.kind==='jelly'){
    for(let j=-1;j<=1;j++){const xx=j*.2;c.strokeStyle=shade(col,-3);c.lineWidth=.055;c.beginPath();c.moveTo(xx,.17);c.quadraticCurveTo(xx+Math.sin(clock*4+j)*.1,.38,xx-.03,.47);c.stroke();}
    body(c,0,0,.37,.3,col);oval(c,0,.04,.23,.2,'#306b8350');body(c,-.09,-.15,.17,.08,shade(col,24));
    eye(c,-.13,-.02,'#edffe0');eye(c,.13,-.02,'#edffe0');oval(c,.2,.13,.04,.04,'#d3ffed5c');
  }else if(e.kind==='spore'){
    for(const side of [-1,1])poly(c,[[side*.09,.13],[side*.29,.36],[side*.4,.32],[side*.24,.43],[0,.29]],'#76918a','#bdc3aa');
    body(c,0,.09,.22,.24,shade(col,-20));
    c.beginPath();c.moveTo(-.41,-.11);c.bezierCurveTo(-.3,-.48,.28,-.48,.41,-.11);c.quadraticCurveTo(0,.07,-.41,-.11);c.fillStyle=gradient(c,0,-.4,0,0,[shade(col,28),shade(col,-46)]);c.fill();c.strokeStyle=shade(col,55);c.stroke();
    for(const x of [-.22,0,.22])oval(c,x,-.19,.052,.035,'#e4d0df');eye(c,-.08,.1);eye(c,.08,.1);
  }else if(e.kind==='ember'){
    for(const side of [-1,1])poly(c,[[side*.23,-.06],[side*.42,.18],[side*.26,.28]],'#655051','#b79269');
    poly(c,[[-.3,-.22],[.03,-.43],[.31,-.15],[.28,.24],[-.03,.37],[-.34,.12]],gradient(c,-.3,-.3,.3,.3,['#8f7766','#3d414d','#292e40']),'#c4a279');
    poly(c,[[-.12,-.32],[.01,-.1],[-.08,.03],[.12,.16],[.06,.32]],null,'#f6ad64');crystal(c,0,.02,.12,'#ffbe70');eye(c,-.14,-.13,'#ffe1a0');eye(c,.14,-.13,'#ffe1a0');
    for(const side of [-1,1])poly(c,[[side*.17,-.23],[side*.25,-.49+Math.sin(clock*5)*.03],[side*.31,-.18]],'#d6945f','#ffe1a26a');
  }else if(e.kind==='void'||e.type==='hunter'){
    const r=e.type==='hunter'?.43:.34;
    for(let j=0;j<5;j++){const a=j*Math.PI*2/5+clock*.25;poly(c,[[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a+.16)*(r+.12),Math.sin(a+.16)*(r+.12)],[Math.cos(a+.32)*r,Math.sin(a+.32)*r]],'#64799c','#bdc9eb');}
    body(c,0,0,r,r,'#424d76');oval(c,0,0,r*.7,r*.72,'#13253f');crystal(c,0,-.01,.2,'#bbbbea');
    c.strokeStyle='#a9bde060';c.beginPath();c.ellipse(0,0,r*1.4,r*.4,-.4,0,7);c.stroke();
  }else{
    // Garden creatures have root legs, leaf armour and a luminous seed core.
    for(const side of [-1,1]){poly(c,[[side*.2,.13],[side*.32,.33],[side*.43,.26]],null,'#b7c499');poly(c,[[side*.18,-.1],[side*.4,-.31],[side*.34,.05]],shade(col,-12),shade(col,39));}
    body(c,0,.02,.33,.31,col);poly(c,[[-.2,-.19],[-.06,-.34],[.07,-.11],[.01,.06]],shade(col,21));
    poly(c,[[.03,-.19],[.2,-.32],[.27,-.08],[.08,.07]],shade(col,-14));
    eye(c,-.12,.03);eye(c,.12,.03);box(c,-.07,.15,.14,.04,.01,'#314c4a');
    oval(c,-.13,-.16,.09,.03,'#d9edbc55');
  }
  healthBar(c,e);c.restore();
}

export function drawMoth(c,s,e,clock){
  c.save();c.translate((e.rx+.5)*s,(e.ry+.52+Math.sin(clock*7+e.x)*.025)*s);c.scale(s,s);c.lineWidth=.018;
  const flash=e.flash>0,flap=Math.sin(clock*28+e.x)*.13;
  oval(c,0,.39,.31,.07,'#02061080');
  for(const side of [-1,1]){
    poly(c,[[side*.08,-.11],[side*.47,-.4-flap],[side*.43,.13+flap],[side*.27,.07],[side*.17,.27]],gradient(c,side*.1,-.2,side*.45,.2,flash?['#fff0bd','#ffe1af']:['#b78385','#5a4b6e','#b1857b']),'#eed0ac');
    for(let j=0;j<3;j++)poly(c,[[side*.1,-.06],[side*(.24+j*.1),-.23+j*.15+flap*.4]],null,'#e0b6a483');
  }
  body(c,0,.02,.17,.28,flash?'#fff1c9':'#596077');
  for(const side of [-1,1]){poly(c,[[side*.08,-.2],[side*.16,-.42],[side*.21,-.24]],'#a9a294','#f4ddba');eye(c,side*.085,-.1,'#ffe6a3');}
  healthBar(c,e,-.52);c.restore();
}

export function drawGuardian(c,s,b,stage,clock){
  const col=stage===1?'#c7ad78':stage===3?'#b39acb':'#a8bce8',open=b.state==='open',warn=b.state==='warn';
  c.save();c.translate((b.x+.5)*s,(b.y+.38+Math.sin(clock*2)*.025)*s);c.scale(s,s);c.lineWidth=.025;
  oval(c,0,1.1,1.18,.22,'#01060dd0');glow(c,0,.03,1.7,open?'#ffe0a2':col,open?'27':'0d');
  if(stage===3){
    for(const side of [-1,1])for(let j=0;j<3;j++){
      c.strokeStyle=shade(col,-40);c.lineWidth=.13;c.beginPath();c.moveTo(side*.45,.15);c.bezierCurveTo(side*(1+j*.13),.18,side*(.6+j*.1),1.15,side*(.95+j*.12),.88);c.stroke();
    }
    poly(c,[[-.55,-.56],[-.39,1.02],[0,1.2],[.4,1.02],[.55,-.56]],gradient(c,-.5,0,.5,0,['#74657f','#bbb0aa','#534c6c']),'#c8c0c9');
    c.beginPath();c.moveTo(-1.25,-.43);c.bezierCurveTo(-.8,-1.28,.8,-1.28,1.25,-.43);c.quadraticCurveTo(0,-.09,-1.25,-.43);c.fillStyle=gradient(c,0,-1.2,0,-.1,['#c1a5c4','#75628e','#43394f']);c.fill();c.strokeStyle='#e1cbe0';c.stroke();
    for(let i=-3;i<=3;i++)oval(c,i*.27,-.57-Math.cos(i)*.1,.055,.04,'#e7cfde');
  }else if(stage===5){
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3+clock*.09;c.save();c.rotate(a);
      poly(c,[[.48,-.18],[1.12,-.27],[1.35,0],[1.1,.27],[.48,.18]],gradient(c,.5,-.2,1.3,.2,['#8b9dbb','#344763','#172d46']),'#bdcbe2');
      poly(c,[[.73,-.07],[1.13,0],[.73,.07]],'#a4bdeb');c.restore();
    }
    poly(c,[[-.56,-.72],[0,-1],[.56,-.72],[.66,.54],[0,1.05],[-.66,.54]],gradient(c,-.6,-.9,.6,1,['#8b9ebe','#3b526f','#1e324e']),'#d1d9e9');
  }else{
    for(const side of [-1,1]){
      box(c,side*.84-.28,-.35,.56,1.05,.12,gradient(c,0,-.4,0,.7,['#b3a275','#5b6260','#303f4c']),'#dac693');
      box(c,side*.84-.33,.64,.66,.35,.07,'#645b48','#bfaa7a');
      poly(c,[[side*.58,-.5],[side*.84,-1.05],[side*1.04,-1.16],[side*.96,-.58]],'#cfb67d','#f1dfb5');
    }
    poly(c,[[-.65,-.64],[0,-.94],[.65,-.64],[.6,.56],[0,.98],[-.6,.56]],gradient(c,-.6,-.7,.6,.9,['#c6b480','#707b70','#374a55']),'#e6d5a5');
    for(const yy of [-.5,-.2,.65])poly(c,[[-.44,yy],[.44,yy]],null,'#e4d3a544');
  }
  box(c,-.34,-.72,.68,.21,.07,'#334756','#c1c7ac');
  for(const side of [-1,1])box(c,side*.15-.07,-.66,.14,.05,.015,warn?'#ffb66e':'#ead8ad');
  crystal(c,0,.1,open?.57:.35,b.flash>0?'#fff0c2':open?'#ffe2a2':col);
  if(!open)for(let i=0;i<3-(b.phase||0);i++){
    const a=-Math.PI/2+i*Math.PI*2/3;c.save();c.translate(Math.cos(a)*.43,Math.sin(a)*.43+.1);c.rotate(a+Math.PI/2);
    poly(c,[[-.26,-.18],[0,-.29],[.26,-.18],[.2,.18],[-.2,.18]],gradient(c,0,-.3,0,.2,['#b8c4ba','#526e80','#2b425a']),'#dae1bd');c.restore();
  }
  if(open){for(const side of [-1,1])for(let i=0;i<3;i++)poly(c,[[side*(.7+i*.12),-.1+i*.15],[side*(.91+i*.13),.01+i*.15]],null,'#ffe6b9');}
  if(warn){c.strokeStyle='#f2b071';c.lineWidth=.04;poly(c,[[-1.3,.9],[-1.43,.62],[-1.23,.34]],null,c.strokeStyle);poly(c,[[1.3,.9],[1.43,.62],[1.23,.34]],null,c.strokeStyle);}
  c.restore();
}
