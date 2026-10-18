import {blend,shade,noise,poly,oval,box,gradient,glow,crystal} from './art-core.mjs';
const COLORS=['#71dcae','#f5af66','#78cfee','#b6a0f6'];
const SKY=[['#071211','#142f28'],['#130e0d','#3c2b20'],['#070f1c','#163c50'],['#100c1c','#30213d'],['#160f14','#44291f'],['#090c1c','#202845']];

// Backgrounds occupy a deeper plane; all detail is seeded without game RNG.
export function drawRuins(c,w,h,cell,cam,stage,clock){
  const [dark,light]=SKY[stage];c.fillStyle=gradient(c,0,0,w,h,[dark,light,dark]);c.fillRect(0,0,w,h);
  const scale=cell,depth=cam*.43,rows=h/scale;
  c.save();c.translate(w/2,0);c.scale(scale,scale);c.lineWidth=.035;
  const top=Math.floor(depth/9)-1;
  for(let k=top;k<top+Math.ceil(rows/9)+3;k++){
    const y=k*9-depth,seed=k+stage*73;
    c.save();c.translate(0,y);
    if(stage===0){
      // Terraced shrine, broken arches and hanging roots.
      for(const side of [-1,1]){
        const x=side*(3.7+noise(seed)*1.8);box(c,x-.42,-1,.84,10,.12,gradient(c,x-.4,0,x+.4,0,['#0e201e','#2e4e3e','#122820']));
        for(let j=0;j<5;j++)box(c,x-.55,j*2,1.1,.18,.04,'#344e3a');
        c.strokeStyle='#3c664557';c.lineWidth=.12;c.beginPath();c.moveTo(side*6,-2);c.bezierCurveTo(side*1,1,side*5,5,side*2.8,9);c.stroke();
        for(let j=0;j<7;j++){const yy=j*1.2,xx=side*(3.6+Math.sin(j+seed)*.6);oval(c,xx,yy,.26,.08,'#567d513d');}
      }
      c.strokeStyle='#46765a45';c.lineWidth=.2;c.beginPath();c.arc(0,5,3.7,Math.PI,Math.PI*2);c.stroke();c.lineWidth=.04;c.beginPath();c.arc(0,5,3.2,Math.PI,Math.PI*2);c.stroke();
      glow(c,0,3.7,3.4,'#58b687','10');
    }else if(stage===1){
      // A buried city receding through sandstone arcades.
      for(let j=-2;j<=2;j++){
        const x=j*3.4;box(c,x-.7,1,1.4,7,.04,gradient(c,x-1,0,x+1,0,['#34271e','#624c32','#2b241d']));
        box(c,x-.95,.8,1.9,.36,.05,'#77603a55');
        c.strokeStyle='#9e815a3d';c.lineWidth=.16;c.beginPath();c.arc(x+1.7,2.6,1.7,Math.PI,Math.PI*2);c.stroke();
        for(let n=0;n<3;n++){c.strokeStyle='#a58e6026';c.lineWidth=.025;poly(c,[[x-.3,3+n],[x+.2,3.2+n],[x-.2,3.5+n]],null,c.strokeStyle);}
      }
      poly(c,[[-9,9],[-4,7.8],[2,8.7],[7,7.9],[10,9.3]],'#55412b44');
    }else if(stage===2){
      // Drowned astrolabes, light shafts and drifting water.
      for(const side of [-1,1])poly(c,[[side*6,-2],[side*4,-2],[side*.8,11],[side*3.5,11]],'#80d8ec08');
      c.save();c.translate(0,4.8);c.rotate(seed*.7);c.strokeStyle='#689aaa42';c.lineWidth=.055;
      for(const r of [2.5,3,3.35]){c.beginPath();c.arc(0,0,r,0,7);c.stroke();}
      for(let i=0;i<12;i++){const a=i*Math.PI/6;poly(c,[[Math.cos(a)*2.7,Math.sin(a)*2.7],[Math.cos(a)*3.25,Math.sin(a)*3.25]],null,'#97bdbe52');}
      poly(c,[[-3.8,0],[3.8,0]],null,'#497c8a80');poly(c,[[0,-3.8],[0,3.8]],null,'#497c8a80');c.restore();
      for(let j=0;j<4;j++){const yy=2+j*2+Math.sin(clock*.4+j)*.08;c.strokeStyle='#78c9dc15';c.beginPath();c.moveTo(-10,yy);c.bezierCurveTo(-4,yy-.3,4,yy+.3,10,yy);c.stroke();}
      glow(c,0,5,4,'#559bb9','12');
    }else if(stage===3){
      // Fungal buttresses, caps and bioluminescent filaments.
      for(const side of [-1,1])for(let j=0;j<3;j++){
        const x=side*(2.7+j*1.9),yy=3+j*.9+noise(seed,j),r=.9+noise(j,seed)*.8;
        poly(c,[[x-.16,yy],[x+.1,yy],[x+.34,9],[x-.4,9]],gradient(c,x,yy,x,9,['#70627e50','#292638']));
        c.beginPath();c.moveTo(x-r,yy);c.bezierCurveTo(x-r*.6,yy-r,x+r*.65,yy-r,x+r,yy);c.quadraticCurveTo(x,yy+.4,x-r,yy);c.fillStyle=gradient(c,x,yy-r,x,yy+.4,['#74628385','#43394e']);c.fill();
        for(let q=-2;q<=2;q++){c.strokeStyle='#c2a5d735';poly(c,[[x+q*r*.32,yy+.02],[x,yy-.2]],null,c.strokeStyle);}
        glow(c,x,yy+.25,r*1.4,'#b198db','0a');
      }
    }else if(stage===4){
      // Bronze machinery, cooling ribs and distant furnace apertures.
      for(const side of [-1,1]){
        const x=side*4.3;box(c,x-.4,-1,.8,11,.1,gradient(c,x-.4,0,x+.4,0,['#251c1c','#615044','#2d2221']));
        for(let j=0;j<9;j++)box(c,x-.55,j,1.1,.11,.02,'#a3774638');
        c.save();c.translate(side*2.7,4.5);c.rotate(clock*.035*side+seed);c.strokeStyle='#85624647';c.lineWidth=.22;c.beginPath();c.arc(0,0,1.7,0,7);c.stroke();
        for(let j=0;j<10;j++){c.rotate(Math.PI/5);box(c,1.5,-.2,.5,.4,.03,'#78583c45');}c.restore();
      }
      box(c,-1.2,2.2,2.4,4.8,.6,'#140e12','#754d3c66');
      for(let j=0;j<7;j++)box(c,-.95,2.7+j*.55,1.9,.17,.04,'#cf704932');glow(c,0,5,3.3,'#ff8446','12');
    }else{
      // The shattered celestial archive suspended over the void.
      c.save();c.translate(0,4.5);c.rotate(seed*.4+clock*.012);c.strokeStyle='#8291bf40';c.lineWidth=.06;
      for(const r of [2.5,3.5]){const pts=Array.from({length:6},(_,i)=>[Math.cos(i*Math.PI/3)*r,Math.sin(i*Math.PI/3)*r]);poly(c,pts,null,c.strokeStyle);}
      for(let j=0;j<6;j++){const a=j*Math.PI/3;poly(c,[[Math.cos(a)*3.5,Math.sin(a)*3.5],[Math.cos(a)*5,Math.sin(a)*5]],null,'#54628c44');}c.restore();
      for(let j=0;j<18;j++){const x=(noise(seed,j)-.5)*18,yy=noise(j,seed)*9;oval(c,x,yy,.025,.025,'#c4d5ef65');if(j%3===0)poly(c,[[x,yy],[x+1,yy-.7]],null,'#7a8fc125');}
      glow(c,0,4.5,3.6,'#829ef2','12');
    }
    c.restore();
  }
  c.restore();
  // A near layer of soft shafts gives the camera motion depth without hiding cells.
  c.save();for(let i=0;i<18;i++){
    const x=noise(i,stage)*w,y=((i*83+clock*(stage===2?-5:2)-cam*cell*.16)%(h+60)+h+60)%(h+60)-30;
    c.fillStyle=(stage===4?'#ffb576':stage===3?'#d3abed':'#b7e8d4')+'38';c.fillRect(x,y,i%3===0?2:1,i%3===0?2:1);
  }c.restore();
}

function surface(width,height){
  if(typeof OffscreenCanvas==='function')return new OffscreenCanvas(width,height);
  if(typeof document!=='undefined'&&typeof document.createElement==='function'){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
  return null;
}
export class TerrainAtlas{
  constructor(factory=surface){this.factory=factory;this.stage=-1;this.cache=new Map();this.variants=new WeakMap();}
  draw(c,x,y,t,s,biome,stage){
    if(this.stage!==stage){this.stage=stage;this.cache.clear();this.variants=new WeakMap();}
    if(!this.variants.has(t))this.variants.set(t,(Math.round(x)*7+Math.round(y)*17)%3);
    const variant=this.variants.get(t),key=(t.ice?'ice':t.c)+'/'+variant;
    if(!this.cache.has(key)){
      let canvas=null;try{canvas=this.factory(96,96);const ctx=canvas?.getContext('2d');if(ctx){ctx.scale(96,96);paintTile(ctx,t,biome,variant);}else canvas=null;}catch{canvas=null;}
      this.cache.set(key,canvas);
    }
    const image=this.cache.get(key);
    if(image)c.drawImage(image,x*s,y*s,s,s);
    else{c.save();c.translate(x*s,y*s);c.scale(s,s);paintTile(c,t,biome,variant);c.restore();}
  }
}
function paintTile(c,t,b,v){
  c.lineWidth=.015;
  if(t.ice){
    poly(c,[[.08,.16],[.37,.04],[.88,.11],[.97,.42],[.85,.93],[.18,.98],[.03,.65]],gradient(c,0,0,1,1,['#d0f6ff','#5a9dc0','#284a6c']),'#b7edff');
    poly(c,[[.08,.16],[.37,.04],[.43,.6],[.18,.98],[.03,.65]],'#c6f4ff77');poly(c,[[.37,.04],[.88,.11],[.69,.68],[.43,.6]],'#eefcff55');
    poly(c,[[.16,.2],[.45,.31],[.3,.48],[.61,.67],[.55,.89]],null,'#d8f8ffc0');return;
  }
  if(t.c>=5&&t.c<=8){paintItem(c,t.c);return;}
  if(t.c===12){
    oval(c,.5,.87,.37,.1,'#02050985');box(c,.18,.18,.64,.64,.09,gradient(c,.2,0,.8,0,['#684438','#ad7655','#603d35']),'#d1a370');
    oval(c,.5,.18,.32,.11,'#a37b55','#e6bf86');for(let i=0;i<5;i++)poly(c,[[.25+i*.11,.3],[.24+i*.11,.76]],null,'#362c2855');
    for(const y of [.31,.65])box(c,.15,y,.7,.09,.02,gradient(c,0,y,1,y,['#405057','#9bafa7','#35434d']),'#c5cdb160');
    poly(c,[[.5,.38],[.65,.51],[.5,.65],[.35,.51]],'#c05e47','#ffd59a');poly(c,[[.51,.42],[.44,.53],[.51,.52],[.48,.61],[.58,.49],[.51,.5]],'#ffe4b4');return;
  }
  if(t.c===4){
    oval(c,.51,.86,.43,.11,'#02060b90');
    poly(c,[[.12,.2],[.48,.06],[.8,.14],[.95,.43],[.86,.8],[.56,.94],[.16,.8],[.04,.46]],gradient(c,.2,.1,.8,.9,[shade(b.rock,57),b.rock,shade(b.rock,-40)]),'#b2b7a281');
    poly(c,[[.12,.2],[.48,.06],[.48,.38],[.04,.46]],shade(b.rock,33));poly(c,[[.48,.38],[.8,.14],[.95,.43],[.86,.8],[.62,.62]],shade(b.rock,-11));
    poly(c,[[.16,.8],[.48,.38],[.62,.62],[.56,.94]],shade(b.rock,13));poly(c,[[.2,.3],[.44,.21],[.39,.38]],'#e4e0b731');
    poly(c,[[.29,.46],[.42,.54],[.39,.68]],null,'#26353a70');return;
  }
  if(t.c===9){
    c.fillStyle='#080f14';c.fillRect(0,0,1,1);box(c,.015,.015,.97,.97,.04,gradient(c,0,0,1,1,[shade(b.rock,16),shade(b.rock,-30),shade(b.rock,-51)]),'#b9c1a734');
    box(c,.11,.11,.78,.74,.02,gradient(c,0,0,1,1,[shade(b.rock,-15),shade(b.rock,-42)]),'#152128');
    poly(c,[[.11,.85],[.89,.85],[.97,.97],[.03,.97]],'#060d1655');
    if(v!==1){c.strokeStyle=b.tint+'6a';c.lineWidth=.028;poly(c,[[.37,.23],[.37,.64],[.62,.4],[.62,.72]],null,c.strokeStyle);poly(c,[[.26,.18],[.72,.18]],null,'#dee6ca24');}
    for(const x of [.07,.93])oval(c,x,.08,.021,.021,'#d3d0aa5a');return;
  }
  const base=t.c<4?blend(b.rock,COLORS[t.c],.14):t.c===11?shade(b.rock,-15):b.rock;
  c.fillStyle=shade(base,-35);c.fillRect(0,0,1,1);
  poly(c,[[0,.04],[.36,.015],[.74,.05],[1,.01],[1,.87],[.63,.98],[.18,.94],[0,.9]],gradient(c,.15,.03,.8,1,[shade(base,24),base,shade(base,-33)]));
  poly(c,[[0,.04],[.36,.015],[.74,.05],[1,.01],[.91,.15],[.53,.2],[.2,.14],[0,.2]],shade(base,35)+'60');
  poly(c,[[0,.9],[.18,.94],[.63,.98],[1,.87],[1,1],[0,1]],'#06101c65');
  for(let i=0;i<24;i++){const x=noise(i,v+7),y=noise(i+31,v);c.fillStyle=i%2?'#f2e7cb13':'#030b1326';c.fillRect(x,y,.01+noise(i)*.035,.008+noise(i,3)*.014);}
  c.lineWidth=.012;poly(c,[[.04,.35],[.3,.28],[.47,.39],[.78,.28],[.97,.39]],null,'#07121e70');
  poly(c,[[.14,.69],[.35,.57],[.61,.74],[.81,.65]],null,'#d4d4b823');
  if(t.c===11){
    poly(c,[[.09,.08],[.52,.38],[.4,.91]],null,'#101c2b');poly(c,[[.52,.38],[.88,.13]],null,'#071321');
    for(const x of [.12,.82]){box(c,x,.73,.09,.12,.01,'#9e9d8560');}return;
  }
  if(t.c<4){
    const col=COLORS[t.c];glow(c,.5,.5,.63,col,'31');
    poly(c,[[0,.57],[.26,.39],[.55,.59],[1,.33]],null,col+'70');c.lineWidth=.035;poly(c,[[.26,.39],[.29,.02]],null,col+'40');
    crystal(c,.29,.36,.23,col,-.28+v*.18);crystal(c,.62,.61,.3,col,.18-v*.13);crystal(c,.84,.23,.13,col,.2);
    oval(c,.24,.15,.018,.018,'#f4ffebce');oval(c,.66,.4,.014,.014,'#f4ffebad');
  }
}
function paintItem(c,type){
  oval(c,.5,.84,.31,.095,'#02060c90');
  if(type===5){
    box(c,.25,.2,.5,.61,.09,gradient(c,0,0,1,1,['#b7beb0','#4a636d','#293e4c']),'#dce6d0');box(c,.31,.3,.38,.36,.04,'#172536');
    for(let i=0;i<4;i++)box(c,.34+i*.082,.34,.053,.26,.015,COLORS[i]);box(c,.35,.13,.3,.1,.03,'#8b9e98','#dce7c7');
  }else if(type===6){
    for(let i=0;i<5;i++){const x=.28+i%3*.2,y=.69-Math.floor(i/3)*.17;oval(c,x,y,.16,.09,'#a77d36','#f7d389');oval(c,x,y-.035,.16,.07,'#e1b65d','#ffe7a4');}
    crystal(c,.69,.4,.18,'#ffd37a',.3);
  }else if(type===7){
    box(c,.32,.31,.36,.43,.07,gradient(c,0,0,1,0,['#e9b1b0','#ae596c','#7b3e56']),'#f2c9bc');box(c,.36,.16,.28,.17,.03,'#b2b8a1','#eceac9');
    c.fillStyle='#fff2db';c.fillRect(.47,.4,.07,.25);c.fillRect(.38,.49,.25,.07);poly(c,[[.37,.37],[.37,.64]],null,'#ffe4d78a');
  }else{
    box(c,.16,.36,.68,.42,.05,gradient(c,.2,.3,.8,.85,['#a0804b','#63482f','#352b29']),'#dab36c');
    box(c,.16,.24,.68,.25,.09,gradient(c,0,.2,0,.5,['#d3b36f','#80603d']),'#ead195');
    for(const x of [.28,.64])box(c,x,.25,.06,.51,.01,'#c2b47d','#f1d59b');box(c,.43,.43,.14,.17,.03,'#d9bc73','#fff1b4');
    oval(c,.5,.52,.025,.025,'#3a3840');
  }
}
