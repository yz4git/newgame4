import {Game,DIRS,COLS,ROWS} from '../../src/engine.mjs';
const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function directionTo(g,goals){
  const p=g.player,queue=[{x:p.x,y:p.y,cost:0,first:null}],costs=new Map([[`${p.x},${p.y}`,0]]);
  while(queue.length){queue.sort((a,b)=>a.cost-b.cost);const q=queue.shift();if(goals.some(v=>q.x===v.x&&q.y===v.y))return q.first;
    for(const [dir,[dx,dy]]of Object.entries(DIRS)){const x=q.x+dx,y=q.y+dy;if(x<=0||y<=0||x>=COLS-1||y>=ROWS-1||g.at(x,y)?.c===9||g.boss&&Math.abs(x-g.boss.x)<=1&&Math.abs(y-g.boss.y)<=1)continue;
      const tile=g.at(x,y),foe=g.enemies.find(e=>e.x===x&&e.y===y);let cost=q.cost+1+(tile?tile.c===4?6:tile.c===11?3:1:0)+(foe?4:0)+(g.fluids.some(f=>f.x===x&&f.y===y&&f.kind==='lava')?50:0);const k=`${x},${y}`;if(cost<(costs.get(k)??Infinity)){costs.set(k,cost);queue.push({x,y,cost,first:q.first||dir});}
    }
  }return null;
}
export function playRun(seed=1,meta=null,maxFrames=90000){
  const g=new Game(seed,meta),priority=['leech','guard','heart','heal','edge','shield','magic','quick','pulse','chainAir','tank','collapse','bombAir','pocket'];let dir=null,frames=0,lastMode='';const log=[];
  for(;frames<maxFrames&&!['dead','win'].includes(g.mode);frames++){
    if(g.mode!==lastMode){if(['route','camp'].includes(g.mode))log.push({room:g.roomNumber,hp:Math.round(g.player.hp),level:g.player.level,mode:g.mode});lastMode=g.mode;}
    if(g.mode==='level'){g.chooseUpgrade(g.choice.slice().sort((a,b)=>priority.indexOf(a.id)-priority.indexOf(b.id))[0].id);continue;}
    if(g.mode==='loot'){const it=g.loot.item,old=g.loot.slot==='drills'?g.drill:g.suit;g.takeEquipment(g.loot.slot==='drills'?it.power>=old.power:it.armor>=old.armor);continue;}
    if(g.mode==='route'){g.chooseRoute(['runes','relic','purge','escape','boss'].find(id=>g.routeOptions.includes(id)));dir=null;continue;}
    if(g.mode==='camp'){if(g.player.hp<g.maxHp-20)g.buy('heal');g.buy('potion');g.buy('shield');g.buy('drill');g.buy('charge');g.nextFloor();dir=null;continue;}
    const p=g.player;if(p.drillTimer<=1/60||!dir){let goals=g.fixtures.filter(f=>!f.done);
      if(!goals.length&&g.roomType==='purge')goals=g.enemies.filter(e=>e.objective);
      if(!goals.length&&g.boss){const b=g.boss,spots=[];for(let yy=b.y-2;yy<=b.y+2;yy++)for(let xx=b.x-2;xx<=b.x+2;xx++)if((Math.abs(xx-b.x)===2&&Math.abs(yy-b.y)<=1)||(Math.abs(yy-b.y)===2&&Math.abs(xx-b.x)<=1))spots.push({x:xx,y:yy});if(spots.some(v=>v.x===p.x&&v.y===p.y)){const dx=b.x-p.x,dy=b.y-p.y;dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}else dir=directionTo(g,spots);}
      else dir=directionTo(g,goals.length?goals:[g.exit]);
      if(g.hazards.some(h=>h.delay>0&&h.delay<.7&&distance(h,p)<=h.radius)){
        const safe=Object.entries(DIRS).find(([name,[dx,dy]])=>{const q={x:p.x+dx,y:p.y+dy};return !g.at(q.x,q.y)&&!g.enemies.some(e=>distance(e,q)<=1)&&!(g.boss&&Math.abs(q.x-g.boss.x)<=1&&Math.abs(q.y-g.boss.y)<=1)&&!g.hazards.some(h=>h.delay>-.1&&distance(h,q)<=h.radius);});if(safe)dir=safe[0];
      }
    }
    const near=g.enemies.some(e=>distance(e,p)<5)||g.boss&&distance(g.boss,p)<6;let cast=false;
    if(p.hp<g.maxHp-18&&p.charges[0]>=g.castCost){p.element=0;cast=true;}
    else if(near){const el=[3,2,1].find(i=>p.charges[i]>=g.castCost);if(el!==undefined){p.element=el;cast=true;}}
    g.step(1/60,{dir,cast,pulse:near&&p.pulseTimer<=0,heal:p.hp<g.maxHp*.4});
    if(g.at(p.x,p.y))throw Error(`Embedded player at ${seed}/${g.roomNumber}/${p.x},${p.y}`);
  }
  return {game:g,frames,log};
}
