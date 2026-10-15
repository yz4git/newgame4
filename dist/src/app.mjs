import {Game,BIOMES,EQUIPMENT,UPGRADES,normalizeMeta,talentCost,VERSION} from './engine.mjs';
import {Renderer} from './render.mjs';
import {Sound} from './audio.mjs';
const $=id=>document.getElementById(id),keys={meta:'drill-delve-meta-v1',run:'drill-delve-run-v1',sound:'drill-delve-sound-v1'};
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
function write(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{return false;}}
function erase(key){try{localStorage.removeItem(key);}catch{}}
let meta=normalizeMeta(read(keys.meta)),game=new Game(2177,meta),home=true,modalMode='',guideBack='home',saved=read(keys.run),storageWarned=false;
const canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false}),renderer=new Renderer(ctx),sound=new Sound();sound.enabled=read(keys.sound)!==false;
const pointers=new Map(),keyboard=new Map();let order=0,healQueued=false,pulseQueued=false,lastHud=0,last=0,accumulator=0;
function clearInput(){pointers.clear();keyboard.clear();healQueued=false;pulseQueued=false;document.querySelectorAll('.held').forEach(n=>n.classList.remove('held'));}
function save(){if(home||['dead','win'].includes(game.mode))return;const ok=write(keys.run,game.serialize());saved=ok?game.serialize():saved;if(!ok&&!storageWarned){storageWarned=true;game.toast('保存できません。このままプレイは続けられます。');}write(keys.meta,meta);}
function svg(id){return `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;}
function show(content,kind=''){clearInput();$('overlay').hidden=false;$('overlay').className='overlay scrollable '+kind;$('overlay').innerHTML=`<div class="modal-card">${content}</div>`;$('overlay').scrollTop=0;}
function hide(){clearInput();$('overlay').hidden=true;$('overlay').innerHTML='';}
function setStatus(s){$('status').textContent=s;}
const fmt=n=>Math.floor(n).toLocaleString('ja-JP');
function homeView(){
  home=true;modalMode='home';game.mode='play';clearInput();
  const talents=[['hull','♥','強化外殻','HP +8'],['air','◉','エアタンク','酸素 +10'],['drill','✦','ドリル研磨','攻撃 +2']];
  show(`<div class="home-intro"><p class="eyebrow">A ROGUELITE MINING ADVENTURE</p><h1>DRILL<br><em>DELVE</em><span style="color:#f2c17c">.</span></h1><p class="home-jp">深層の探掘者</p><p class="home-copy">掘る、つなぐ、強くなる。<br>まだ見ぬ鉱脈の、その先へ。<br><b>地下1,200mに眠る「星の核」を探せ。</b></p><div class="tiny-tags"><span>色連鎖 × 落盤</span><span>毎回変わる成長</span><span>6つの地下世界</span></div></div><div class="home-actions button-stack">${saved?`<button class="primary" data-action="continue">探掘をつづける <span>↘</span></button><button class="secondary" data-action="new-confirm">新しい探掘へ</button>`:`<button class="primary" data-action="new">探掘をはじめる <span>↘</span></button>`}<button class="text-button" data-action="guide">${svg('book')}遊び方・フィールドガイド</button></div><div class="meta-box"><div class="meta-top"><span>BASE CAMP / 永続強化</span><b>◇ ${fmt(meta.cores)}</b></div><div class="talents">${talents.map(([id,icon,name,desc])=>`<button class="talent" data-talent="${id}" ${meta.talents[id]>=5||meta.cores<talentCost(meta.talents[id])?'disabled':''}><span class="talent-icon">${icon}</span><strong>${name} ${meta.talents[id]}/5</strong><small>${desc}</small><span class="cost">${meta.talents[id]>=5?'MAX':`◇ ${talentCost(meta.talents[id])}`}</span></button>`).join('')}</div></div><div class="home-bottom"><span>BEST <b>${fmt(meta.best)}</b> m</span><span>ホーム画面への追加でアプリのように</span></div>`,'home');
  $('pause').disabled=true;hud(true);
}
function start(seed=Date.now()){
  game=new Game(seed,meta);home=false;modalMode='';hide();sound.unlock();$('pause').disabled=false;accumulator=0;renderer.lastStage=-1;save();hud(true);setStatus('翠晶の洞窟の探索を始めました。十字キーを長押しして掘り進みます。');
}
function continueRun(){try{game=Game.restore(saved,meta);home=false;modalMode='';hide();$('pause').disabled=false;sound.unlock();renderer.lastStage=-1;accumulator=0;game.toast('探掘を再開。頭上の落盤に注意！');syncModal();hud(true);}catch{erase(keys.run);saved=null;start();game.toast('記録を読み込めなかったため、新しい探掘を開始しました。');}}
function pause(){if(home||game.mode!=='play')return;game.mode='pause';save();modalMode='pause';show(`<p class="eyebrow">TAKE A BREATH</p><h2>ひとやすみ。</h2><p class="pause-stats">${game.biome.name} · 地下 ${fmt(game.depth)}m · LV ${game.player.level}<br>酸素と落盤は停止しています。途中記録は自動保存されます。</p><div class="equip"><small>CURRENT EQUIPMENT</small><h3>${game.drill.name} / ${game.suit.name}</h3><p>攻撃力 ${Math.round(game.power)} · 最大HP ${game.maxHp} · シールド ${game.player.shield}</p></div><div class="pack-list">${Object.entries(game.player.upgrades).map(([id,n])=>`<span>${UPGRADES.find(x=>x.id===id)?.name||id} ×${n}</span>`).join('')||'<span>強化はレベルアップで獲得</span>'}</div><div class="button-stack"><button class="primary" data-action="resume">探掘にもどる</button><button class="secondary" data-action="guide">フィールドガイド</button><button class="text-button" data-action="home">保存して拠点へ</button></div>`);}
function resume(){if(game.mode==='pause'){game.mode='play';game.player.invuln=Math.max(.7,game.player.invuln);}modalMode='';hide();sound.unlock();accumulator=0;}
function guide(){guideBack=home?'home':game.mode==='pause'?'pause':game.mode;if(!home&&game.mode==='play'){pause();guideBack='pause';}
  modalMode='guide';show(`<p class="eyebrow">EXPLORER'S FIELD GUIDE</p><h2>地下世界の歩き方</h2><div class="guide-content"><div class="guide-item"><div class="tile-demo"><i></i><i></i><i></i><i></i></div><div><b>同じ色を、まとめて掘る</b><p>十字キーを長押しするだけで移動・掘削。同じ色のつながりは一気に消える。5個以上で経験値とゴールドにボーナス。</p></div></div><div class="guide-item"><span class="guide-icon">▼</span><div><b>落盤の予告を見逃さない</b><p>下の支えが消えた塊は、揺れてから落ちる。横へ避けよう。落下して5個以上つながった色も連鎖して消える。</p></div></div><div class="guide-item"><span class="guide-icon">O₂</span><div><b>酸素をつないで下へ進む</b><p>O₂カプセルで酸素+25。硬岩は複数回の掘削が必要で酸素を消費。酸素ゼロではHPが減り始める。</p></div></div><div class="guide-item"><span class="guide-icon">◎</span><div><b>ピンチではパルス！</b><p>パルスは周囲5×5の鉱石を砕き、敵にもダメージ。酸素8を使い、8秒ごとに発動。✚でHP45回復。右の「掘る」を長押しすると高速掘削。</p></div></div><div class="guide-item"><span class="guide-icon">✦</span><div><b>強化と装備でビルドを作る</b><p>経験値がたまると3つから強化を選択。宝箱から装備を入手。最下部のゲートで次の層へ。2・4・6層はボス戦。攻撃の直前に弱点が開く。</p></div></div><div class="guide-item"><span class="guide-icon">◇</span><div><b>倒れても、次へつながる</b><p>探索の深さと獲得ゴールドからコアを持ち帰る。拠点で使うと次の探索からHP・酸素・攻撃力が永続的に強化される。</p></div></div></div><div class="guide-foot">PC：方向キー / WASDで移動・掘削、Spaceで高速、Xでパルス、Cで回復、Escで一時停止。<br>途中記録はこのブラウザーに自動保存。アプリを閉じるときも保存されます。</div><button class="primary" data-action="guide-back">もどる</button>`);
}
function syncModal(){if(home||game.mode===modalMode||modalMode==='guide')return;const p=game.player;modalMode=game.mode;
  if(game.mode==='play'){hide();return;}
  save();
  if(game.mode==='level')show(`<p class="eyebrow">LEVEL ${p.level} / CHOOSE YOUR PATH</p><h2>深く潜るほど、強くなる。</h2><p class="modal-sub">今回の探掘で使う強化を1つ選んでください。</p><div class="choice-list">${game.choice.map((u,i)=>`<button class="choice" data-upgrade="${u.id}"><span class="choice-icon">${u.icon}</span><span class="choice-text"><small>0${i+1} / ${u.kind}</small><b>${u.name}</b><p>${u.desc}</p></span><span class="choice-arrow">↗</span></button>`).join('')}</div><p class="hint-line">同じ強化を選ぶと効果が重なります。<br>選んでいる間、時間は止まっています。</p>`);
  if(game.mode==='loot'){const loot=game.loot,old=loot.slot==='drills'?game.drill:game.suit;show(`<p class="eyebrow">RELIC DISCOVERED</p><h2>鉱脈に眠っていた装備</h2><p class="modal-sub">装備はすぐに効果を発揮します。交換するか、売却するか。</p><div class="equipment-compare"><div class="equip"><small>現在の装備</small><h3>${old.name}</h3><p>${old.desc}</p></div><div class="equip new"><small>NEW EQUIPMENT</small><h3>${loot.item.name}</h3><p>${loot.item.desc}</p></div></div><div class="button-stack"><button class="primary" data-action="equip">新しい装備に交換する</button><button class="secondary" data-action="sell">交換せず20Gで売却</button></div>`);}
  if(game.mode==='camp')campView();
  if(game.mode==='dead'||game.mode==='win'){
    meta=normalizeMeta(game.meta);write(keys.meta,meta);erase(keys.run);saved=null;const win=game.mode==='win';
    show(`<p class="eyebrow">${win?'EXPEDITION COMPLETE':'THE NEXT DELVE AWAITS'}</p><h2>${win?'星の核は、解放された。':'この一歩が、次の道になる。'}</h2><p class="modal-sub">${win?'地下1,200mの探掘に成功。深層に、静かな光が戻った。':game.reason+'。持ち帰ったコアで、拠点を強化しよう。'}</p><div class="stat-grid"><div class="stat-cell"><small>到達深度</small><strong>${fmt(game.stats.depth)}</strong><span>m</span></div><div class="stat-cell"><small>最終レベル</small><strong>${p.level}</strong><span>LV</span></div><div class="stat-cell"><small>最大色連鎖</small><strong>${game.stats.maxChain}</strong><span>BLOCKS</span></div><div class="stat-cell"><small>掘削ブロック</small><strong>${fmt(game.stats.blocks)}</strong></div></div><div class="reward"><span>持ち帰った深層コア</span><b>◇ +${game.reward}</b></div><div class="button-stack"><button class="primary" data-action="home">拠点で次の探掘を準備</button><button class="secondary" data-action="new">もう一度潜る</button></div>`);setStatus(win?'地下1200mの探掘に成功しました。':'探索終了。'+game.reason);
  }
}
function campView(){const next=BIOMES[game.stage+1];show(`<p class="eyebrow">DEPTH ${(game.stage+1)*200}m / SAFE HAVEN</p><h2>地底の焚き火</h2><p class="modal-sub">HP15・酸素25を回復しました。次は「${next.name}」。<br>${next.hazard} <b style="color:var(--gold)">所持 ${fmt(game.player.gold)} G</b></p><div class="shop-list">${game.shopStock.map(it=>`<button class="shop-item" data-buy="${it.id}" ${it.bought||game.player.gold<it.cost?'disabled':''}><span class="shop-info"><b>${it.name}</b><small>${it.desc}</small></span><strong>${it.bought?'購入済':it.cost+' G'}</strong></button>`).join('')}</div><button class="primary" data-action="next">第${game.stage+2}層へ降りる <span>↘</span></button><p class="hint-line">買わずに進めます。拠点の永続強化は探索終了後に。</p>`);}
function hud(force=false){if(!force&&performance.now()-lastHud<80)return;lastHud=performance.now();const p=game.player;
  $('biome-name').textContent=game.biome.name;$('depth').textContent=fmt(game.depth);$('floor-badge').textContent=`${game.stage+1} / 6`;$('hp-fill').style.width=`${Math.max(0,p.hp/game.maxHp*100)}%`;$('hp-text').textContent=`${Math.ceil(p.hp)} / ${game.maxHp}`;$('air-fill').style.width=`${Math.max(0,p.air/p.maxAir*100)}%`;$('air-text').textContent=`${Math.ceil(p.air)} / ${p.maxAir}`;document.querySelector('.air.meter').classList.toggle('low',p.air<25);$('level').textContent=p.level;$('xp-fill').style.width=`${p.xp/p.nextXp*100}%`;$('gold').textContent=fmt(p.gold);$('shield').textContent=p.shield;$('potions').textContent=p.potions;$('heal').disabled=!p.potions||p.hp>=game.maxHp;$('drill-name').textContent=game.drill.name;$('pulse-text').textContent=p.pulseTimer>0?`${p.pulseTimer.toFixed(1)}s`:'パルス';$('pulse').classList.toggle('cooling',p.pulseTimer>0);$('pulse-cooldown').style.height=`${p.pulseTimer/8*100}%`;$('sound').classList.toggle('muted',!sound.enabled);$('sound').setAttribute('aria-pressed',String(sound.enabled));
  const boss=game.boss,showBoss=boss&&Math.abs(boss.y-p.y)<12&&!home;$('boss-hud').hidden=!showBoss;if(showBoss){$('boss-name').textContent=boss.id+(boss.timer<.9?' · 弱点露出':' · 装甲');$('boss-percent').textContent=Math.max(0,Math.ceil(boss.hp/boss.maxHp*100))+'%';$('boss-fill').style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';}
}
function input(){let dir=null,rush=false,max=-1;for(const v of [...keyboard.values(),...pointers.values()]){if(v.dir&&v.order>max){dir=v.dir;max=v.order;}if(v.rush)rush=true;}const out={dir,rush,pulse:pulseQueued,heal:healQueued};pulseQueued=false;healQueued=false;return out;}
const dpad=$('dpad');
function padDirection(e){const rect=dpad.getBoundingClientRect(),dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2);if(Math.hypot(dx,dy)<10)return null;return Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';}
function highlight(){document.querySelectorAll('.dir').forEach(n=>n.classList.toggle('held',[...pointers.values(),...keyboard.values()].some(v=>v.dir===n.dataset.dir)));$('rush').classList.toggle('held',[...pointers.values(),...keyboard.values()].some(v=>v.rush));}
dpad.addEventListener('pointerdown',e=>{if(home||game.mode!=='play')return;e.preventDefault();const dir=e.target.closest('[data-dir]')?.dataset.dir||padDirection(e);if(!dir)return;sound.unlock();dpad.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{dir,order:++order});highlight();});
dpad.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();const dir=padDirection(e);pointers.set(e.pointerId,{dir,order:++order});highlight();});
for(const type of ['pointerup','pointercancel','lostpointercapture'])dpad.addEventListener(type,e=>{pointers.delete(e.pointerId);highlight();});
$('rush').addEventListener('pointerdown',e=>{if(home||game.mode!=='play')return;e.preventDefault();sound.unlock();$('rush').setPointerCapture(e.pointerId);pointers.set(e.pointerId,{rush:true,order:++order});highlight();});
for(const type of ['pointerup','pointercancel','lostpointercapture'])$('rush').addEventListener(type,e=>{pointers.delete(e.pointerId);highlight();});
$('pulse').addEventListener('click',()=>{if(!home&&game.mode==='play'){sound.unlock();pulseQueued=true;}});
$('heal').addEventListener('click',()=>{if(!home&&game.mode==='play'){sound.unlock();healQueued=true;}});
$('pause').addEventListener('click',()=>{sound.unlock();if(game.mode==='pause')resume();else pause();});
$('sound').addEventListener('click',()=>{sound.toggle();write(keys.sound,sound.enabled);hud(true);});
$('guide-side').addEventListener('click',guide);
const dirKeys={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='Escape'){e.preventDefault();if(modalMode==='guide')handleAction('guide-back');else if(game.mode==='pause')resume();else pause();return;}if(e.code==='Enter'&&home&&modalMode==='home'){e.preventDefault();if(saved)continueRun();else start();return;}
  if(home||game.mode!=='play')return;const dir=dirKeys[e.code];if(dir||['Space','KeyX','KeyC'].includes(e.code))e.preventDefault();if(e.repeat)return;sound.unlock();if(dir)keyboard.set(e.code,{dir,order:++order});if(e.code==='Space')keyboard.set(e.code,{rush:true,order:++order});if(e.code==='KeyX')pulseQueued=true;if(e.code==='KeyC')healQueued=true;highlight();});
window.addEventListener('keyup',e=>{keyboard.delete(e.code);highlight();});
window.addEventListener('blur',()=>{clearInput();if(!home&&game.mode==='play')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(!home&&game.mode==='play')pause();save();}});
window.addEventListener('pagehide',()=>{clearInput();save();});
document.addEventListener('contextmenu',e=>{if(e.target.closest('.play-shell'))e.preventDefault();});
function handleAction(action){sound.unlock();sound.play('click');
  if(action==='new'){start();return;}if(action==='continue'){continueRun();return;}if(action==='new-confirm'){show(`<p class="eyebrow">NEW EXPEDITION</p><h2>新しい探掘をはじめる</h2><p class="modal-sub">途中の探索記録を上書きします。拠点の永続強化と持ち帰ったコアは引き継がれます。</p><div class="button-stack"><button class="primary" data-action="new">新しく潜る</button><button class="secondary" data-action="home">もどる</button></div>`);return;}
  if(action==='home'){if(!home)save();homeView();return;}if(action==='resume'){resume();return;}if(action==='guide'){guide();return;}
  if(action==='guide-back'){modalMode='';if(guideBack==='home')homeView();else if(guideBack==='pause'){game.mode='play';pause();}else syncModal();return;}
  if(action==='equip'||action==='sell'){game.takeEquipment(action==='equip');modalMode='';syncModal();save();return;}
  if(action==='next'){game.nextFloor();modalMode='';renderer.lastStage=-1;syncModal();save();return;}
}
$('overlay').addEventListener('click',e=>{const button=e.target.closest('button');if(!button||button.disabled)return;
  if(button.dataset.action)handleAction(button.dataset.action);
  if(button.dataset.upgrade){game.chooseUpgrade(button.dataset.upgrade);modalMode='';syncModal();save();}
  if(button.dataset.buy){game.buy(button.dataset.buy);campView();hud(true);save();}
  if(button.dataset.talent){const id=button.dataset.talent,cost=talentCost(meta.talents[id]);if(meta.cores>=cost&&meta.talents[id]<5){meta.cores-=cost;meta.talents[id]++;write(keys.meta,meta);sound.play('upgrade');homeView();}}
});
function resize(){const r=$('viewport').getBoundingClientRect();if(r.width<=0||r.height<=0)return;const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);renderer.resize(r.width,r.height);}
new ResizeObserver(resize).observe($('viewport'));window.addEventListener('resize',()=>{clearInput();resize();});
function frame(now){const dt=last?Math.min(.1,(now-last)/1000):1/60;last=now;if(!home){accumulator+=dt;while(accumulator>=1/60){game.step(1/60,input());accumulator-=1/60;}for(const event of game.events.splice(0)){if(event.type==='save')save();else sound.play(event.type,event);}syncModal();}else accumulator=0;renderer.draw(game,dt,home);sound.update(!home&&game.mode==='play',game.stage);hud();requestAnimationFrame(frame);}
if(saved){try{Game.restore(saved,meta);}catch{saved=null;erase(keys.run);}}
game.player.y=4;game.player.ry=4;game.player.x=5;game.player.rx=5;resize();homeView();requestAnimationFrame(frame);
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
window.addEventListener('error',e=>{setStatus('エラーが発生しました。再読み込みで途中の記録から再開できます。');console.error(e.error);});
