// Every sound is synthesized locally. Nothing is fetched or played before a gesture.
export class Sound {
  constructor(){this.enabled=true;this.ctx=null;this.master=null;this.nextNote=0;this.beat=0;this.stage=0;this.music=true;this.lastDig=0;this.lastFx={};}
  unlock(){if(!this.enabled)return;try{if(!this.ctx){this.ctx=new (globalThis.AudioContext||globalThis.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.3;this.master.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}catch{this.enabled=false;}}
  note(freq,time,dur=.1,type='sine',vol=.12,slide=0){if(!this.ctx||!this.enabled)return;const o=this.ctx.createOscillator(),v=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),time+dur);v.gain.setValueAtTime(.001,time);v.gain.linearRampToValueAtTime(vol,time+.008);v.gain.exponentialRampToValueAtTime(.001,time+dur);o.connect(v);v.connect(this.master);o.start(time);o.stop(time+dur+.02);}
  noise(dur=.08,vol=.07,cutoff=1300){if(!this.ctx||!this.enabled)return;const len=Math.floor(this.ctx.sampleRate*dur),buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const source=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),v=this.ctx.createGain();source.buffer=buf;f.type='lowpass';f.frequency.value=cutoff;v.gain.value=vol;source.connect(f);f.connect(v);v.connect(this.master);source.start();}
  play(type,data={}){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime,cooldown={chain:.1,hit:.045,kill:.065,land:.07,gold:.045,enemyWarn:.18,enemyFire:.12,split:.1}[type];if(cooldown){if(t-(this.lastFx[type]??-Infinity)<cooldown)return;this.lastFx[type]=t;}
    if(type==='enemyWarn')this.note(260,t,.12,'triangle',.06,90);
    if(type==='enemyFire')this.note(740,t,.10,'triangle',.07,-340);
    if(type==='split')this.note(400,t,.12,'sine',.06,180);
    if(type==='cast'){this.note([480,110,850,660][data.element]||440,t,.22,'triangle',.15,200);this.noise(.08,.08,2100);}
    if(type==='dig'){if(t-this.lastDig<.065)return;this.lastDig=t;this.noise(.055,.15,2300);this.note(210+Math.random()*70,t,.055,'triangle',.13,-100);}
    if(type==='chain'){const base=440*2**(Math.min(5,Math.floor((data.combo||0)/8))/12);[0,4,7,12].slice(0,data.count>10?4:3).forEach((n,i)=>this.note(base*2**(n/12),t+i*.045,.17,'sine',.13));}
    if(type==='air'||type==='heal'){[540,810,1080].forEach((f,i)=>this.note(f,t+i*.07,.18,'sine',.11));}
    if(type==='gold'||type==='buy')this.note(1200,t,.16,'triangle',.13,220);
    if(type==='stone'||type==='land')this.noise(.08,.12,600);
    if(type==='hit'){this.noise(.07,.2,1400);this.note(140,t,.07,'sawtooth',.1,-90);}
    if(type==='kill'){this.note(220,t,.14,'triangle',.12,350);this.noise(.1,.12,1400);}
    if(type==='hurt'){this.note(160,t,.24,'sawtooth',.2,-100);this.noise(.18,.17,500);}
    if(type==='guard'){[650,970].forEach(f=>this.note(f,t,.25,'sine',.14));}
    if(type==='pulse'){this.note(80,t,.35,'triangle',.28,600);this.noise(.25,.18,2000);}
    if(type==='level'||type==='upgrade'||type==='loot'||type==='floor'){[262,330,392,524].forEach((f,i)=>this.note(f,t+i*.08,.3,'triangle',.1));}
    if(type==='bossDead'){this.noise(.6,.26,800);[130,196,262,330,392,524].forEach((f,i)=>this.note(f,t+i*.1,.5,'triangle',.15));}
    if(type==='bossAttack')this.note(90,t,.25,'sawtooth',.1,-50);
    if(type==='finish'){(data.win?[262,330,392,524]:[262,247,220,130]).forEach((f,i)=>this.note(f,t+i*.2,.5,'triangle',.13));}
    if(type==='fever'){[0,4,7,12,16,19].forEach((n,i)=>this.note(330*2**(n/12),t+i*.065,.25,'triangle',.1));this.note(82,t,.35,'sine',.17);}
    if(type==='finale'){[392,524,660,784].forEach((f,i)=>this.note(f,t+i*.09,.28,'triangle',.1));}
    if(type==='feverFinish'){[262,330,392,524,660,784].forEach((f,i)=>this.note(f,t+i*.1,.4,'triangle',.1));}
    if(type==='comboMilestone'){[0,7,12,16].forEach((n,i)=>this.note(524*2**(n/12),t+i*.055,.19,'sine',.065));}
    if(type==='feverTick'){this.note(660+(3-(data.count||3))*110,t,.09,'triangle',.075);}
    if(type==='feverOut'){[784,660,524].forEach((f,i)=>this.note(f,t+i*.07,.18,'sine',.065));}
    if(type==='bump'){this.note(180,t,.09,'triangle',.08,-40);}
    if(type==='click')this.note(540,t,.055,'sine',.10);
  }
  update(active,stage=0,arcade=null){if(!this.ctx||!this.enabled||!active||!this.music){if(this.ctx)this.nextNote=this.ctx.currentTime;return;}const now=this.ctx.currentTime;if(this.nextNote<now-.2)this.nextNote=now;const scale=[0,3,7,10,12,7,3,5],base=[130.81,146.83,110,123.47,130.81,164.81][stage];while(this.nextNote<now+.12){const i=this.beat++%32,n=scale[Math.floor(i/2)%8];if(arcade?.arcade){const major=[0,4,7,12,7,4,9,7],note=major[i%8],b=arcade.fever?164.81:130.81;this.note(b*2**(note/12),this.nextNote,.15,'triangle',arcade.fever?.035:.025);if(i%4===0){this.note(b/2,this.nextNote,.18,'sine',.075);this.note(b*2,this.nextNote,.045,'triangle',.022);}if(arcade.fever&&i%2===1)this.note(b*4*2**(major[(i+3)%8]/12),this.nextNote,.08,'sine',.025);this.nextNote+=arcade.fever?.1:.125;continue;}if(i%2===0)this.note(base*2**(n/12),this.nextNote,.45,'sine',.035);if(i%8===0)this.note(base/2,this.nextNote,.8,'triangle',.055);if(i%4===2)this.note(base*4*2**(scale[(i*3)%8]/12),this.nextNote,.12,'sine',.022);this.nextNote+=.19;}}
  toggle(){this.enabled=!this.enabled;if(this.master)this.master.gain.value=this.enabled?.3:0;if(this.enabled)this.unlock();return this.enabled;}
}
