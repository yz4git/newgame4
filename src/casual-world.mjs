import {blend,shade,noise,poly,oval,box,gradient} from './art-core.mjs';
export const CANDY=['#39cf9c','#ffa74a','#43c9ee','#ad81ee'];
export const INK='#355b70';
export const TOY_THEMES=[
  {sky:'#c7efe1',deep:'#438e8c',light:'#8cc9aa',stone:'#cda77b',edge:'#6ea9a0'},
  {sky:'#ffe7ae',deep:'#ac795b',light:'#e4ba7a',stone:'#d9ae74',edge:'#c69f6d'},
  {sky:'#c8f5f3',deep:'#458faa',light:'#8ed2db',stone:'#b6bec1',edge:'#73b7c4'},
  {sky:'#efe1fa',deep:'#83619f',light:'#c0a0cd',stone:'#c6a3ad',edge:'#aa8fbb'},
  {sky:'#ffe5cd',deep:'#a46b69',light:'#e4ab91',stone:'#d0a17d',edge:'#c1907b'},
  {sky:'#e8e7ff',deep:'#626da8',light:'#a7b0de',stone:'#b8accb',edge:'#909ac2'},
];
export function star(c,x,y,r,fill,stroke,points=5,inner=.48){
  poly(c,Array.from({length:points*2},(_,i)=>{const a=i*Math.PI/points-Math.PI/2,rr=r*(i%2?inner:1);return [x+Math.cos(a)*rr,y+Math.sin(a)*rr];}),fill,stroke);
}
function sparkle(c,x,y,r,col='#fff9dc'){
  poly(c,[[x,y-r],[x+r*.24,y-r*.24],[x+r,y],[x+r*.24,y+r*.24],[x,y+r],[x-r*.24,y+r*.24],[x-r,y],[x-r*.24,y-r*.24]],col);
}
export function toyGem(c,x,y,r,index,tilt=0){
  const col=CANDY[index];c.save();c.translate(x,y);c.rotate(tilt);c.lineWidth=.025;
  let pts;
  if(index===0)pts=[[-r*.65,-r*.68],[r*.38,-r*.94],[r*.89,-r*.33],[r*.67,r*.65],[-r*.33,r*.92],[-r*.86,r*.31]];
  else if(index===1)pts=[[-r*.52,-r*.9],[r*.52,-r*.9],[r*.95,-r*.2],[r*.57,r*.78],[-r*.57,r*.78],[-r*.95,-r*.2]];
  else if(index===2)pts=[[0,-r],[r*.86,-r*.15],[r*.66,r*.73],[-r*.66,r*.73],[-r*.86,-r*.15]];
  else pts=[[-r*.61,-r*.8],[r*.61,-r*.8],[r*.92,0],[r*.61,r*.8],[-r*.61,r*.8],[-r*.92,0]];
  poly(c,pts,gradient(c,-r,-r,r,r,[shade(col,37),col,shade(col,-37)]),shade(col,-65));
  poly(c,[pts[0],pts[1],[r*.16,-r*.14],[-r*.28,r*.08]],shade(col,42));
  poly(c,[pts[1],pts[2],pts[3],[r*.16,-r*.14]],shade(col,-8));
  poly(c,[pts[pts.length-1],[-r*.28,r*.08],[r*.16,-r*.14],pts[3],pts[4]],shade(col,-21));
  c.lineWidth=.016;poly(c,[pts[0],pts[1],pts[2]],null,'#fff9e8d9');
  oval(c,-r*.3,-r*.4,r*.21,r*.095,'#ffffedbd');sparkle(c,r*.38,-r*.34,r*.12);
  c.restore();
}

export function drawCasualTile(c,t,b,v){
  const stone=b.stone||TOY_THEMES[0].stone;
  c.lineWidth=.026;
  if(t.ice){box(c,.08,.1,.84,.86,.18,gradient(c,0,0,1,1,['#e5ffff','#8edbf2']),'#5d9fbe');poly(c,[[.21,.29],[.39,.49],[.28,.72],[.64,.61]],null,'#fff8ec');sparkle(c,.67,.3,.13);return;}
  if(t.c===9){
    box(c,.01,.02,.98,.98,.12,shade(b.edge||'#80b9ad',-26));box(c,.035,.02,.93,.88,.11,gradient(c,0,0,1,1,[shade(b.edge||'#80b9ad',25),b.edge||'#80b9ad',shade(b.edge||'#80b9ad',-10)]),'#477d863b');
    c.lineWidth=.02;poly(c,[[.15,.18],[.38,.11],[.75,.13]],null,'#f1ffe177');if(v===0)star(c,.53,.48,.12,'#e4f5d73d');return;
  }
  if(t.c===4){
    oval(c,.5,.86,.4,.085,'#315d6333');oval(c,.5,.47,.41,.39,gradient(c,0,0,1,1,['#f2e7c4','#c8bb99','#a89a82']),'#8b8d78');
    oval(c,.37,.3,.16,.08,'#fff5d6aa');poly(c,[[.61,.25],[.55,.48],[.72,.55]],null,'#a09478');return;
  }
  if(t.c===12){
    oval(c,.5,.88,.35,.08,'#4d626133');box(c,.19,.18,.62,.66,.14,gradient(c,0,0,1,1,['#ffcf79','#f4906d']),'#bd6b64');
    for(const y of [.31,.66])box(c,.16,y,.68,.1,.035,'#ffe9ae','#d9926d');
    star(c,.5,.51,.18,'#f8617c','#fff1c0');c.lineWidth=.05;poly(c,[[.5,.2],[.58,.07],[.72,.13]],null,'#866b7c');sparkle(c,.72,.12,.07,'#ffe87a');return;
  }
  if(t.c>=5&&t.c<=8){
    oval(c,.5,.86,.35,.08,'#315d6333');
    if(t.c===6){for(let i=0;i<3;i++){const x=.28+i*.21,y=.65-i%2*.16;oval(c,x,y,.19,.16,'#e6a840','#b9824e');oval(c,x,y-.055,.19,.15,'#ffd96b','#fff0ba');star(c,x,y-.055,.09,'#e8a948');}sparkle(c,.72,.22,.12);}
    else if(t.c===8){box(c,.12,.33,.76,.46,.12,'#c490d8','#8b6ab5');box(c,.12,.24,.76,.28,.13,gradient(c,0,.2,0,.6,['#f3beee','#ba84d0']),'#8b6ab5');box(c,.43,.26,.14,.53,.03,'#ffda6c');star(c,.5,.52,.13,'#fff3b6','#dca24f');}
    else {box(c,.28,.2,.44,.6,.15,gradient(c,.2,0,.8,1,['#fffbe7',t.c===7?'#ffb8c1':'#8cdde2']),'#5e9d9e');box(c,.34,.12,.32,.14,.045,'#ffce69','#c19958');if(t.c===7){c.fillStyle='#ee7f97';c.fillRect(.46,.38,.08,.27);c.fillRect(.37,.48,.26,.08);}else toyGem(c,.5,.49,.2,3);}
    return;
  }
  // The warm rounded rock remains visible around one large jewel.
  box(c,.012,.035,.976,.965,.13,shade(stone,-30));box(c,.025,.025,.95,.87,.12,gradient(c,0,0,1,1,[shade(stone,24),stone,shade(stone,-13)]),shade(stone,-23));
  c.lineWidth=.018;poly(c,[[.13,.18],[.3,.12],[.54,.15]],null,'#fff1ce89');
  for(let i=0;i<4;i++)oval(c,.1+noise(i,v)*.79,.23+noise(v,i)*.56,.016,.011,'#885f5034');
  if(t.c<4){
    oval(c,.52,.57,.37,.29,'#724e434d');toyGem(c,.5,.47,.36,t.c,(v-1)*.07);
  }else{
    c.lineWidth=.03;poly(c,[[.13,.5],[.41,.43],[.56,.61],[.84,.56]],null,shade(stone,-37));
    if(t.c===11){for(const x of [.22,.72])box(c,x,.31,.09,.42,.03,'#c6c5ac','#fff0c1');}
    else oval(c,.67,.28,.12,.055,'#fff2ce51');
  }
}

export function drawCasualBackground(c,w,h,s,cam,stage,clock,active=false){
  const t=TOY_THEMES[stage];c.fillStyle=gradient(c,0,0,w,h,[t.sky,blend(t.sky,t.light,.6),t.sky]);c.fillRect(0,0,w,h);
  c.save();c.translate(w/2,0);c.scale(s,s);c.lineWidth=.045;
  // A rounded cave silhouette is visually deeper than the occupied clay cells.
  box(c,-6.45,-2,12.9,h/s+4,.8,gradient(c,0,0,0,h/s,[t.deep,blend(t.deep,t.light,.32),t.deep]));
  const depth=cam*.36,top=Math.floor(depth/10)-1;
  for(let band=top;band<top+Math.ceil(h/s/10)+3;band++){
    const yy=band*10-depth;c.save();c.translate(0,yy);
    for(const side of [-1,1]){
      const x=side*(5.0+noise(band,stage)*.4);
      if(stage===0){
        c.strokeStyle='#9bdaad45';c.lineWidth=.15;c.beginPath();c.moveTo(x,-1);c.bezierCurveTo(x-side*1,2,x+side*.4,5,x-side*1.5,10);c.stroke();
        for(let j=0;j<4;j++){c.save();c.translate(x-side*.3,1+j*2.1);c.rotate(side*.4);oval(c,0,0,.65,.22,'#a3d7a45c');c.restore();}
      }else if(stage===1){
        for(let j=0;j<4;j++)box(c,x-side*.5,1+j*1.7,side*1.4,1.05,.45,'#e7bf8352');
        box(c,x-side*.4,2.7,.32,3.7,.16,'#a7bc7c60');box(c,x-side*1,3.7,.75,.28,.13,'#b5cc8960');
      }else if(stage===2){
        for(let j=0;j<5;j++){const y=1+j*1.7+Math.sin(clock*.55+j)*.12;oval(c,x-side*(.5+j%2*.4),y,.24+j%3*.09,.24+j%3*.09,'#c9f8f51a','#d8ffff45');}
        poly(c,[[x,-1],[x-side*1.1,-1],[x-side*3.1,11],[x-side*2,11]],'#d6fff00a');
      }else if(stage===3){
        for(let j=0;j<3;j++){const xx=x-side*(.3+j*.6),y=2+j*2.8;box(c,xx-.12,y,.24,2,.12,'#e6bfd958');oval(c,xx,y,.85,.42,'#e9b0db5e');for(const dx of [-.4,0,.4])oval(c,xx+dx,y-.08,.08,.045,'#fff0e458');}
      }else if(stage===4){
        c.save();c.translate(x-side*.7,4);c.rotate(clock*.07*side+band);for(let j=0;j<8;j++){c.rotate(Math.PI/4);box(c,.9,-.22,.5,.44,.12,'#e9c39852');}oval(c,0,0,1.15,1.15,'#efbc945e');oval(c,0,0,.55,.55,t.deep+'65');c.restore();
        box(c,x-.18,-1,.36,11,.18,'#ffd1a43a');
      }else{
        for(let j=0;j<4;j++)star(c,x-side*(.6+noise(j,band)*1.7),1+j*2.2,.14+j%2*.12,'#f9ebbd72');
        c.strokeStyle='#d0d9f847';c.lineWidth=.035;poly(c,[[x-side,2],[x-side*2.5,4],[x-side*.8,6]],null,c.strokeStyle);
      }
    }
    if(stage===0||stage===1){c.strokeStyle=t.sky+'22';c.lineWidth=.09;c.beginPath();c.arc(0,6,4.2,Math.PI,Math.PI*2);c.stroke();}
    c.restore();
  }
  // Soft mineral glints sit far behind the playable layer.
  for(let i=0;i<16;i++){
    const x=(noise(i,stage)-.5)*11.5,y=((i*2.17-depth*.4+clock*.05)%(h/s+2)+h/s+2)%(h/s+2)-1;
    c.globalAlpha=.18+noise(i)*.13;sparkle(c,x,y,.04+i%3*.012,t.sky);
  }
  c.restore();
  if(active){c.save();c.globalAlpha=.09;c.fillStyle=gradient(c,0,0,w,h,['#ffd35c','#ffb98b','#ffd35c']);c.fillRect(0,0,w,h);c.restore();}
}
