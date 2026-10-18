import {ENEMY_TYPES,heading} from './enemies.mjs';
import {poly as polygon,oval,box,gradient,shade,glow,crystal} from './art-core.mjs';
import {healthBar} from './actor-art.mjs';
function shell(c,x,y,rx,ry,col){oval(c,x,y,rx,ry,gradient(c,x-rx,y-ry,x+rx,y+ry,[shade(col,32),col,shade(col,-55)]),shade(col,56));}
export function drawSpecialEnemy(c,s,e,g,clock){
  const spec=ENEMY_TYPES[e.type];if(!spec)return false;
  const [dx,dy]=e.type==='shield'?(e.guardDir||[0,-1]):e.intent?.dx!==undefined?[e.intent.dx,e.intent.dy]:heading(e,g.player),angle=Math.atan2(dy,dx)+Math.PI/2;
  const body=e.flash>0?'#fff5d9':spec.color,ink='#24353c',light='#efdfb8',stride=Math.sin(clock*10+e.x)*.025;
  c.save();c.translate((e.rx+.5)*s,(e.ry+.56)*s);c.scale(s,s);c.lineWidth=.018;
  oval(c,0,.36,.37,.085,'#020812a0');
  if(e.type==='rusher'){
    c.save();c.rotate(angle);
    for(const side of [-1,1])for(let i=-1;i<=1;i++){
      polygon(c,[[side*.22,i*.17],[side*(.4+stride),i*.18+.05],[side*.44,i*.18+.14]],null,'#b39066');
      oval(c,side*.32,i*.18+.025,.035,.035,'#e5c28c');
    }
    shell(c,0,.02,.3,.34,body);polygon(c,[[0,-.29],[0,.34]],null,'#674b3b');
    for(const side of [-1,1]){
      polygon(c,[[side*.055,-.22],[side*.2,-.43],[side*.17,-.51],[side*.02,-.32]],gradient(c,0,-.5,0,-.2,['#fff0c9','#b6976d']),ink);
      polygon(c,[[side*.06,-.12],[side*.22,-.2],[side*.25,.17],[side*.08,.28]],null,'#ffe2ad66');
      box(c,side*.13-.045,-.2,.09,.055,.015,e.intent?'#fff5c4':'#543c36');
    }
    if(e.intent)glow(c,0,-.31,.26,'#ffdb90','5f');c.restore();
  }else if(e.type==='burrower'){
    c.save();c.rotate(angle);shell(c,0,.09,.31,.29,body);
    for(const y of [.1,.2])polygon(c,[[-.24,y],[0,y+.05],[.25,y]],null,'#6a56484f');
    shell(c,0,-.12,.25,.22,'#7c8178');
    polygon(c,[[-.14,-.23],[0,-.51],[.14,-.23]],gradient(c,-.1,-.45,.1,-.2,['#f2efd5','#afbab0','#47606b']),ink);
    for(let i=0;i<3;i++)polygon(c,[[-.09+i*.025,-.27-i*.055],[.1-i*.03,-.29-i*.055]],null,'#536971');
    for(const side of [-1,1]){
      shell(c,side*.28,.12+stride,.105,.15,'#9f8668');
      for(let i=0;i<3;i++)polygon(c,[[side*(.19+i*.065),.05+stride],[side*(.22+i*.065),-.13+stride],[side*(.25+i*.065),.09+stride]],gradient(c,0,-.15,0,.1,['#f9efd0','#8d9990']),ink);
      box(c,side*.16-.035,-.19,.07,.06,.012,'#ffe6a4');
    }
    c.restore();
  }else if(e.type==='spitter'){
    for(const side of [-1,1])polygon(c,[[0,.3],[side*.43,.13],[side*.29,.35],[0,.43]],gradient(c,0,.1,0,.4,['#9ab789','#3e645a']),'#b7d09c');
    box(c,-.08,-.14,.16,.5,.04,gradient(c,-.1,0,.1,0,['#7b9d7e','#40665b']),'#a7b99a');
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5+clock*.12,x=Math.cos(a)*.23,y=Math.sin(a)*.19-.12;
      c.save();c.translate(x,y);c.rotate(a);shell(c,0,0,.18,.13,body);polygon(c,[[-.1,0],[.1,0]],null,'#e9d2ee55');c.restore();
    }
    c.save();c.translate(0,-.11);c.rotate(angle);
    polygon(c,[[-.12,.1],[-.19,-.23],[.19,-.23],[.12,.1]],gradient(c,-.2,0,.2,0,['#d4b9d5','#8f709c','#574c77']),'#e9d8ec');
    oval(c,0,-.23,.19,.105,'#758068','#e8ebbd');oval(c,0,-.25,.135,.06,'#152d36');oval(c,0,-.25,.055,.036,'#e4efad');c.restore();
  }else if(e.type==='splitter'){
    shell(c,0,.11,.37,.25,shade(body,-19));
    for(const side of [-1,1]){
      shell(c,side*.18,-.025,.24,.27,body);oval(c,side*.18,.015,.13,.16,'#25667962');
      for(const xx of [-.045,.045])box(c,side*.18+xx-.017,-.06,.035,.065,.014,'#e8ffec');
      oval(c,side*.18-.06,-.18,.075,.027,'#ecfff68a');
    }
    polygon(c,[[0,-.18],[.04,.02],[-.03,.16],[0,.3]],null,'#c2fff058');oval(c,-.07,.23+stride,.05,.045,'#d4ffed83');
  }else if(e.type==='bomber'){
    const armed=e.intent?.kind==='bomb',pulse=armed?1+Math.sin(clock*28)*.035:1;c.save();c.scale(pulse,pulse);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;c.save();c.rotate(a);
      polygon(c,[[.22,-.055],[.39,-.08],[.45,.01],[.32,.055],[.24,.03]],gradient(c,.2,0,.45,0,['#bf9d83','#63545c']),'#d4b99c');c.restore();
    }
    shell(c,0,0,.3,.31,body);oval(c,0,0,.2,.22,'#482f43','#ffd4a0');
    glow(c,0,0,.31,armed?'#ffd07e':'#ee9982',armed?'68':'1c');
    for(const side of [-1,1])polygon(c,[[side*.21,-.15],[side*.11,-.08],[side*.2,.17]],null,'#ffe3ba65');
    polygon(c,[[.025,-.17],[-.12,.02],[0,.02],[-.03,.17],[.14,-.04],[.03,-.04]],armed?'#fff1bd':'#e6ba7b');
    polygon(c,[[0,-.3],[.04,-.41]],null,'#d1b892');oval(c,.04,-.4,.04,.04,armed?'#fff2af':'#d8c89d');c.restore();
  }else if(e.type==='shield'){
    c.save();c.rotate(angle);
    for(const side of [-1,1])for(const y of [-.1,.24])shell(c,side*.29,y+stride,.1,.1,'#7d9d9e');
    shell(c,0,.06,.29,.3,'#77949f');shell(c,0,-.17,.18,.15,'#c3be94');
    for(const side of [-1,1])box(c,side*.07-.025,-.23,.05,.05,.015,'#182e3d');
    if(!(e.guardBroken>0)){
      polygon(c,[[-.35,-.33],[0,-.49],[.35,-.33],[.29,-.04],[0,.15],[-.29,-.04]],gradient(c,-.3,-.4,.3,.1,[shade(body,33),body,shade(body,-60)]),'#dfe6cc');
      polygon(c,[[0,-.43],[.24,-.29],[.19,-.08],[0,.05],[-.19,-.08],[-.24,-.29]],shade(body,-12),'#f0e7c789');
      polygon(c,[[0,-.43],[0,.05]],null,'#455f79');
      crystal(c,0,-.18,.09,'#c8e0e1');
      if(e.guardHits){c.lineWidth=.025;polygon(c,[[-.15,-.34],[.035,-.2],[-.11,-.06],[.02,.09]],null,'#263e57');}
      if(e.guardHits>1)polygon(c,[[.035,-.2],[.25,-.28],[.18,-.07]],null,'#263e57');
    }else for(const side of [-1,1])polygon(c,[[side*.26,-.31],[side*.44,-.14],[side*.3,.04]],gradient(c,0,-.3,0,0,[body,shade(body,-40)]),light);
    c.restore();
  }
  healthBar(c,e,-.59);c.restore();return true;
}
export function drawEnemyIntent(c,s,e,g,clock){
  const a=e.intent;if(!a)return;c.save();c.lineWidth=1;
  const color=a.kind==='spit'?'#d2eca0':a.kind==='bomb'?'#ffb097':'#ffd295';c.strokeStyle=color;c.fillStyle=color+'20';
  if(a.kind==='bite'){
    c.fillRect(a.x*s,a.y*s,s,s);c.strokeRect(a.x*s+2,a.y*s+2,s-4,s-4);
    polygon(c,[[a.x*s+s*.22,a.y*s+s*.22],[a.x*s+s*.78,a.y*s+s*.78]],null,color);
    polygon(c,[[a.x*s+s*.78,a.y*s+s*.22],[a.x*s+s*.22,a.y*s+s*.78]],null,color);
    c.fillStyle=color;c.font=`bold ${s*.28}px sans-serif`;c.textAlign='right';c.fillText(g.turnBased?'1T':'!',(a.x+.88)*s,(a.y+.26)*s);
  }else if(a.kind==='bomb'){
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=(e.x+dx)*s,y=(e.y+dy)*s;c.fillRect(x,y,s,s);c.strokeRect(x+2,y+2,s-4,s-4);}
  }else for(let i=1;i<=(a.kind==='rush'?a.left:6);i++){
    const x=e.x+a.dx*i,y=e.y+a.dy*i,t=g.at(x,y),open=a.kind==='rush'?[0,1,2,3,10,11,12]:[12];if(g.occupied(x,y)||t&&(!open.includes(t.c)||g.isFixture(x,y)))break;c.fillRect(x*s,y*s,s,s);c.save();c.translate((x+.5)*s,(y+.5)*s);c.rotate(Math.atan2(a.dy,a.dx));polygon(c,[[-s*.14,-s*.12],[s*.1,0],[-s*.14,s*.12]],null,color);c.restore();if(a.kind==='spit'&&(t||g.enemies.some(o=>o!==e&&o.x===x&&o.y===y)))break;
  }
  c.globalAlpha=.6+Math.sin(clock*22)*.3;c.fillStyle=color;c.font=`bold ${s*.35}px sans-serif`;c.textAlign='center';c.fillText('!',(e.rx+.5)*s,(e.ry-.13)*s);c.restore();
}

// A target can contain the explorer. Its warning must survive the actor layer.
export function drawTargetReticle(c,s,e,turnBased){
  const a=e.intent;if(a?.kind!=='bite')return;const x=a.x*s,y=a.y*s;c.save();
  for(const [width,color]of [[3.5,'#142330'],[1.5,'#ffcf8c']]){
    c.lineWidth=width;c.strokeStyle=color;
    for(const [dx,dy]of [[0,0],[1,0],[0,1],[1,1]]){
      const xx=x+s*(dx?.93:.07),yy=y+s*(dy?.93:.07),sx=dx?-1:1,sy=dy?-1:1;
      c.beginPath();c.moveTo(xx+sx*s*.19,yy);c.lineTo(xx,yy);c.lineTo(xx,yy+sy*s*.19);c.stroke();
    }
  }
  box(c,x+s*.62,y-s*.07,s*.38,s*.28,s*.06,'#263238','#f2c98b');
  c.fillStyle='#ffe3aa';c.font=`800 ${s*.22}px sans-serif`;c.textAlign='center';c.fillText(turnBased?'1T':'!',x+s*.81,y+s*.14);c.restore();
}
