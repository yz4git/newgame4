const terrainSources=new Set(['rock','barrel','lava']);
export function prepareBoss(b){
  if(!b||b.version===2)return b;
  Object.assign(b,{version:2,phase:Math.min(2,Math.floor((1-b.hp/b.maxHp)*3)),state:'guard',timer:1.3,attacks:0,engaged:false,stagger:0,sealCharges:0,hitCooldown:0,attack:null});
  return b;
}
export function bossDamage(g,power,source){
  const b=prepareBoss(g.boss);if(!b||b.hitCooldown>0)return 0;
  b.hitCooldown=.18;
  const terrain=terrainSources.has(source),floor=b.maxHp*(2-b.phase)/3;
  if(b.state!=='open'){
    if(terrain){b.stagger=Math.min(b.maxHp*.14,b.stagger+power*.35);if(b.engaged&&b.state==='guard')b.timer=Math.min(b.timer,.18);}
    if(!b.engaged)return 0;
    // The shell can be chipped, but each new core must answer with a warned attack.
    return Math.min(Math.max(0,b.hp-floor-1),power*.12,b.maxHp*.012);
  }
  const multiplier=terrain?1+(g.player.upgrades.collapse||0)*.5:1;
  const damage=Math.min(power*multiplier,b.maxHp*(source==='core'?.27:terrain?.22:.1),b.hp-floor);
  if(damage>0&&b.hp-damage<=floor+.001&&b.phase<2){
    b.phase++;b.state='guard';b.timer=1.3;b.attack=null;
    g.toast('外殻を破壊！ 次の予告をかわして核を狙おう');g.emit('bossAttack');
  }
  return damage;
}
export function breakBossSeal(g){
  const b=prepareBoss(g.boss);if(!b)return;
  b.sealCharges=Math.min(2,b.sealCharges+1);
  if(b.state==='guard'&&b.engaged)b.timer=Math.min(b.timer,.18);
  g.toast('支柱の力を蓄積！ 次の核露出で大ダメージ');
}
export function updateBoss(g,dt){
  const b=prepareBoss(g.boss);if(!b)return;
  const p=g.player;if(!g.turnBased)b.flash=Math.max(0,b.flash-dt);b.hitCooldown=Math.max(0,b.hitCooldown-dt);
  if(!b.engaged&&p.y>=b.y-6){b.engaged=true;g.toast('守護者が起動。光る列を避け、露出した核を狙おう');}
  if(!b.engaged)return;
  b.timer-=dt;
  if(b.timer<=0){
    if(b.state==='guard'){
      const columns=b.attacks%2===0?[p.x-1,p.x,p.x+1]:[2,4,6,8,10];
      b.attack={columns:columns.filter(x=>x>0&&x<12),fromY:Math.max(b.y-6,p.y-1)};
      b.state='warn';b.timer=1.05;g.emit('bossAttack');
    }else if(b.state==='warn'){
      const a=b.attack;
      if(a.columns.includes(p.x)&&p.y>=a.fromY)g.damage(24+g.stage*2,'守護者の光柱に倒された');
      for(const x of a.columns)g.fx.push({kind:'beam',x:x+.5,y:a.fromY,x2:x+.5,y2:75,radius:1,color:'#ffbe7b',life:.35,max:.35});
      b.attacks++;b.attack=null;b.state='open';b.timer=2.2;
      const stored=b.stagger+(b.sealCharges>0?b.maxHp*.12:0);b.stagger=0;if(b.sealCharges>0)b.sealCharges--;
      if(stored>0){b.hitCooldown=0;g.hitBoss(stored,'core');}
      if(!g.boss)return;
      if(b.attacks%3===0)for(const x of [b.x-3,b.x+3]){
        const y=b.y+2;if(g.enemies.filter(e=>Math.abs(e.x-b.x)+Math.abs(e.y-b.y)<8).length>=6)break;
        if(g.at(x,y)||g.occupied(x,y)||g.enemies.some(e=>e.x===x&&e.y===y)||Math.abs(x-p.x)+Math.abs(y-p.y)<2)continue;
        const e=g.makeEnemy(x,y,'swarm');e.stun=.65;g.enemies.push(e);
      }
    }else{b.state='guard';b.timer=1.6;}
  }
  if(Math.abs(p.x-b.x)<=1&&Math.abs(p.y-b.y)<=1)g.damage(24,'守護者に倒された');
}
