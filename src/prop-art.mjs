import {poly,oval,box,gradient,glow,crystal,shade} from './art-core.mjs';

export function drawFixture(c,s,f,clock){
  const col=f.done?'#a4c4af':'#f5d396';c.save();c.translate((f.x+.5)*s,(f.y+.5)*s);c.scale(s,s);c.lineWidth=.018;
  glow(c,0,-.2,1.2,col,f.done?'0d':'23');oval(c,0,.34,.45,.15,'#030914b0');
  box(c,-.38,.06,.76,.23,.04,gradient(c,0,0,0,.3,['#a7a38a','#52686a','#2b424b']),'#c8c3a0');
  box(c,-.32,-.03,.64,.15,.035,'#7d8d7a','#d9cf9b');for(const side of [-1,1])box(c,side*.23-.03,.13,.06,.12,.01,'#b2a678');
  if(f.kind==='seal'){
    poly(c,[[-.24,.02],[-.24,-.47],[0,-.69],[.24,-.47],[.24,.02]],gradient(c,-.2,-.6,.2,0,f.done?['#5b776f','#2c4b4f']:['#d1c593','#829078','#3d5d60']),'#dfd7ae');
    poly(c,[[-.16,-.45],[0,-.58],[.16,-.45],[.16,-.04],[-.16,-.04]],'#20363d','#c8c5a150');
    crystal(c,0,-.3,.16,f.done?'#8cbdac':'#ffdd96');
    for(const side of [-1,1])poly(c,[[side*.31,.07],[side*.37,-.19],[side*.3,-.27]],null,'#d3bb85');
  }else{
    const bob=f.done?0:Math.sin(clock*3+f.x)*.035;
    if(f.kind==='relic'){
      c.save();c.translate(0,-.3+bob);c.rotate(-.15+Math.sin(clock)*.04);
      poly(c,[[-.29,-.09],[-.12,-.28],[.13,-.25],[.29,-.06],[.16,.15],[-.14,.18]],gradient(c,-.2,-.2,.2,.2,['#ffdfa0','#b68c51','#5c594a']),'#f3dfa4');
      crystal(c,0,-.03,.13,f.done?'#9fc8ac':'#fff1b4');c.restore();
    }else{crystal(c,0,-.32+bob,.34,f.done?'#739b91':'#c6a2ee');}
    for(const side of [-1,1])poly(c,[[side*.24,.02],[side*.32,-.2],[side*.25,-.32]],null,'#d3bd86');
  }
  c.fillStyle=f.done?'#b8dbbd':'#f0ddb1';c.font='700 .29px sans-serif';c.textAlign='center';c.fillText(f.done?'✓':f.kind==='seal'?'◇':'✧',0,f.done?-.6:-.83);c.restore();
}

export function drawGate(c,s,e,biome,final,clock){
  const col=e.open?biome.tint:'#b49b70';c.save();c.translate((e.x+.5)*s,(e.y+.5)*s);c.scale(s,s);c.lineWidth=.025;
  glow(c,0,-.35,2,col,e.open?'2c':'0d');oval(c,0,.51,.91,.2,'#030912d0');
  box(c,-.85,.38,1.7,.17,.04,'#777e6c','#c0bc91');box(c,-.7,.23,1.4,.18,.03,'#465e60','#b5b78c');
  // Heavy arch rim, recessed portal and engraved keystone.
  box(c,-.71,-1.2,1.42,1.62,.55,gradient(c,-.7,-1.2,.7,.4,['#c3bf96','#6e8580','#344e5b']),col);
  box(c,-.52,-1.01,1.04,1.39,.43,'#071724',shade(col,-20));
  if(e.open){
    c.save();c.beginPath();c.roundRect(-.46,-.97,.92,1.3,.4);c.clip();
    c.fillStyle=gradient(c,0,-1,0,.4,[biome.tint+'30','#143b50',biome.tint+'70']);c.fillRect(-.5,-1,1,1.4);
    for(let i=0;i<11;i++){const yy=((i*.13+clock*.18)%1.3)-.97;c.strokeStyle=biome.tint+(i%3?'42':'7d');c.lineWidth=.012;poly(c,[[-.45,yy],[-.1,yy+.035],[.45,yy-.01]],null,c.strokeStyle);}
    glow(c,0,.12,.65,biome.tint,'4c');c.restore();
  }else{
    for(const side of [-1,1])poly(c,[[side*.34,-.76],[-side*.3,.16]],null,'#b39a6e99');
    box(c,-.15,-.55,.3,.34,.05,'#a49569','#dec995');oval(c,0,-.43,.045,.055,'#31454b');
  }
  for(const side of [-1,1])for(let i=0;i<4;i++){
    const y=-.6+i*.23;poly(c,[[side*.65,y],[side*.57,y+.05],[side*.64,y+.12]],null,col+'b0');
  }
  crystal(c,0,-1.1,.17,e.open?biome.tint:'#dcc18a');
  c.strokeStyle=e.open?'#d9ffe0':'#b5a47f';c.lineWidth=.04;
  for(let i=0;i<2;i++){const yy=-.05+i*.23;poly(c,[[-.13,yy],[0,yy+.11],[.13,yy]],null,c.strokeStyle);}
  c.fillStyle=e.open?'#e0ffeb':'#e0cba1';c.font='700 .19px sans-serif';c.textAlign='center';c.fillText(e.open?(final?'CORE':'EXIT'):'LOCKED',0,-.7);c.restore();
}
