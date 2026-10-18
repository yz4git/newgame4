export const TACTICAL_UPGRADES=[
  {id:'shock',name:'震地の楔',kind:'TERRAIN',icon:'↔',max:3,desc:'2マス以上落ちた塊の着地で、左右へ衝撃波。重複で威力と幅が増す。'},
  {id:'ice',name:'氷棺の印',kind:'TERRAIN',icon:'❄',max:3,desc:'凍結中の敵を横へ押せる。凍結撃破で8手/秒残る氷塊を作り、盾や足場に。重複で持続延長。'},
  {id:'wide',name:'鉱脈の余韻',kind:'SYNERGY',icon:'✧',max:3,desc:'鉱石8個以上の連鎖で次の共鳴を広域化。重複で範囲がさらに拡大。'},
];
export const SETPIECES={drop:{name:'落石の仕掛け',icon:'↘'},blast:{name:'誘爆の間',icon:'✦'},flank:{name:'回り込みの間',icon:'↷'}};
const inside=(g,x,y)=>x>0&&x<g.grid[0].length-1&&y>0&&y<g.grid.length-1;
const editable=(g,x,y)=>inside(g,x,y)&&!g.isFixture(x,y)&&!g.actorAt(x,y)&&!g.occupied(x,y)&&(!g.at(x,y)||[0,1,2,3,10,11].includes(g.at(x,y).c));

// A separate, deterministic pass keeps nest populations and specialist variety.
// Existing expeditions only receive layouts in untouched territory far ahead.
export function populateSetpieces(g,fromY=0){
  g.setpieces??=[];
  for(const [i,y]of [14,28,42,56].entries()){
    if(y-4<fromY)continue;
    const pack=g.enemies.filter(e=>e.y>=y&&e.y<=y+1);
    if(pack.length<4||pack.some(e=>e.hp!==e.maxHp))continue;
    const center=Math.round(pack.reduce((n,e)=>n+e.x,0)/pack.length);
    const type=['drop','blast','flank'][(g.seed+g.roomNumber+i)%3];
    let built=false;
    for(const side of [center<=6?1:-1,center<=6?-1:1]){
      const edge=center+side*3,entry=center+side*4;
      if(!inside(g,entry,y))continue;
      if(type==='drop'){
        const target=edge-side;
        if(![[edge,y-2],[edge,y-1],[target,y-1]].every(([x,yy])=>editable(g,x,yy)))continue;
        for(let x=Math.min(entry,center);x<=Math.max(entry,center);x++)if(editable(g,x,y-2))g.carve(x,y-2);
        g.grid[y-2][edge]={c:4,hp:4};g.grid[y-1][edge]={c:11,hp:2};g.carve(target,y-1);
        g.setpieces.push({type,x:edge,y:y-2,packY:y,side:-side});built=true;
      }else if(type==='blast'){
        if(!editable(g,edge,y+1))continue;
        g.grid[y+1][edge]={c:12,hp:1};
        const guards=pack.filter(e=>e.type==='swarm').sort((a,b)=>Math.abs(a.x-edge)-Math.abs(b.x-edge));
        for(const [j,e]of guards.slice(0,2).entries())Object.assign(e,g.makeEnemy(e.x,e.y,j?'shield':'bomber',()=>.5));
        g.setpieces.push({type,x:edge,y:y+1,packY:y,side});built=true;
      }else{
        if(!editable(g,entry,y+2))continue;
        for(let yy=y-2;yy<=y+1;yy++)if(editable(g,entry,yy))g.carve(entry,yy);
        for(let x=Math.min(entry,center);x<=Math.max(entry,center);x++)if(editable(g,x,y+1))g.carve(x,y+1);
        g.grid[y+2][entry]={c:7,hp:1};
        const guard=pack.find(e=>e.type==='swarm'&&e.y===y);
        if(guard)Object.assign(guard,g.makeEnemy(guard.x,guard.y,'shield',()=>.5));
        g.setpieces.push({type,x:entry,y:y-2,packY:y,side});built=true;
      }
      if(built)break;
    }
  }
  g.tacticsVersion=1;
}

export function canPush(g,x,y,dx){
  return Math.abs(dx)===1&&inside(g,x+dx,y)&&!g.at(x+dx,y)&&!g.occupied(x+dx,y)&&!g.actorAt(x+dx,y)&&!g.isFixture(x+dx,y)&&!(g.player.x===x+dx&&g.player.y===y);
}
export function pushObject(g,x,y,dx,e=null){
  if(!canPush(g,x,y,dx))return false;
  if(e){if(!(g.player.upgrades.ice&&e.frozen>0))return false;e.x+=dx;e.rx=e.x;e.intent=null;e.stun=Math.max(e.stun,1.1);e.hitTurn=g.turnCount;}
  else{const tile=g.at(x,y);if(tile?.c!==4)return false;g.grid[y][x]=null;g.grid[y][x+dx]=tile;}
  g.player.x=x;g.player.y=y;g.player.fallTimer=0;g.visit();g.settleTimer=0;
  g.stats.pushes=(g.stats.pushes||0)+1;g.emit('stone');g.float(e?'氷押し':'PUSH',x+dx,y,e?'#c3efff':'#ecd39b');return true;
}

// Snapshot projection: other falling groups may move later. Never mutates RNG,
// the terrain or actors. The bottom contour makes the cost independent of mass.
export function forecastFall(g,cells,limit=g.grid.length){
  const bottom=new Map();for(const c of cells)bottom.set(c.x,Math.max(bottom.get(c.x)??-1,c.y));
  const members=new Set(cells.map(c=>`${c.x},${c.y}`)),edge=cells.filter(c=>!members.has(`${c.x},${c.y+1}`));
  const others=new Set(g.falling.filter(f=>f.cells!==cells).flatMap(f=>f.cells.map(c=>`${c.x},${c.y}`)));
  let distance=0;
  for(let d=1;d<=limit;d++){
    if(edge.some(({x,y})=>!inside(g,x,y+d)||g.at(x,y+d)||others.has(`${x},${y+d}`)))break;
    distance=d;
  }
  return {distance,landing:[...bottom].map(([x,y])=>({x,y:y+distance})),bottom:[...bottom].map(([x,y])=>({x,y}))};
}
export function leaveIce(g,e){
  if(!g.player.upgrades.ice||g.at(e.x,e.y)||g.occupied(e.x,e.y)||g.isFixture(e.x,e.y)||g.player.x===e.x&&g.player.y===e.y)return;
  g.grid[e.y][e.x]={c:4,hp:2,ice:true,expires:g.roomTime+8+3*(g.player.upgrades.ice-1)};
  g.settleTimer=0;g.float('氷塊',e.x,e.y,'#b8efff');
}
export function updateIce(g){
  for(let y=1;y<g.grid.length-1;y++)for(let x=1;x<g.grid[y].length-1;x++){
    const t=g.grid[y][x];if(t?.ice&&t.expires<=g.roomTime){g.grid[y][x]=null;g.settleTimer=0;}
  }
  for(const f of g.falling)f.cells=f.cells.filter(c=>!c.t.ice||c.t.expires>g.roomTime);
  g.falling=g.falling.filter(f=>f.cells.length);
}
export function landingShock(g,f,landed){
  const rank=g.player.upgrades.shock||0;if(!rank||f.moved<2||!landed.length)return;
  const low=new Map();for(const c of landed)low.set(c.x,Math.max(low.get(c.x)??0,c.y));
  const range=1+Math.min(3,rank),impact=[...low].map(([x,y])=>({x,y}));
  const reaches=e=>impact.some(c=>Math.abs(e.x-c.x)<=range&&Math.abs(e.y-c.y)<=1&&clearWave(g,c,e));
  for(const e of [...g.enemies])if(reaches(e))g.attackEnemy(e,28+g.stage*4+rank*8,'shock');
  if(g.boss&&reaches(g.boss))g.hitBoss(38+rank*12,'shock');
  for(const c of [impact[0],impact.at(-1)])g.fx.push({kind:'shock',x:c.x+.5,y:c.y+.5,radius:range+.5,color:'#f1d29a',life:.4,max:.4});
  g.emit('land');
}
function clearWave(g,a,b){
  const dir=Math.sign(b.x-a.x);if(!dir)return true;
  for(let x=a.x+dir;x!==b.x;x+=dir)if([9,11].includes(g.at(x,b.y)?.c))return false;
  return true;
}
