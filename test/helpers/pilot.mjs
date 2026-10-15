import {Game,ROWS,COLS} from '../../src/engine.mjs';
export function playRun(seed=1,meta=null,maxFrames=60000){
 const g=new Game(seed,meta),priority=['leech','edge','guard','heart','quick','heal','shield','magic','pulse','chainAir','tank','collapse','bombAir','pocket'];let frames=0;const log=[];
 for(;frames<maxFrames&&!['dead','win'].includes(g.mode);frames++){
  if(g.mode==='level'){g.chooseUpgrade(g.choice.slice().sort((a,b)=>priority.indexOf(a.id)-priority.indexOf(b.id))[0].id);continue;}
  if(g.mode==='loot'){const it=g.loot.item,old=g.loot.slot==='drills'?g.drill:g.suit;g.takeEquipment(g.loot.slot==='drills'?it.power>=old.power:it.armor>=old.armor);continue;}
  if(g.mode==='route'){log.push(g.stats.cascades);g.chooseRoute(['runes','relic','purge','escape','boss'].find(id=>g.routeOptions.includes(id)));continue;}
  if(g.mode==='camp'){g.buy('heal');g.buy('shield');g.buy('drill');g.buy('charge');g.nextFloor();continue;}
  const p=g.player;let dir='down';if(p.y>=ROWS-3&&Math.abs(p.x-g.exit.x)>0)dir=p.x>g.exit.x?'left':'right';else if(g.boss&&p.y>=g.boss.y+2)dir='up';
  if(g.falling.some(f=>f.delay>0&&f.cells.some(c=>c.x===p.x&&p.y-c.y>0&&p.y-c.y<4))){const x=p.x<COLS/2?p.x+1:p.x-1;if(!g.at(x,p.y))dir=x>p.x?'right':'left';}
  const needHeal=p.hp<g.maxHp-20,enemyNear=g.enemies.some(e=>Math.abs(e.x-p.x)+Math.abs(e.y-p.y)<4),bossNear=g.boss&&Math.abs(g.boss.y-p.y)<5;let pulse=false;
  if(needHeal&&p.charges[0]>=g.castCost){p.element=0;pulse=true;}else if((enemyNear||bossNear)&&p.pulseTimer<=0){p.element=p.charges[3]>=g.castCost?3:2;pulse=true;}
  g.step(1/60,{dir,rush:true,pulse,heal:p.hp<45});
  if(g.at(p.x,p.y))throw Error(`Embedded player at ${seed}/${g.roomNumber}/${p.x},${p.y}`);
 }
 return {game:g,frames,log};
}
