// Preserve quick taps between frames. Only directions repeat; waiting is one
// deliberate tap. Combat can suspend a hold until a fresh directional press.
export class TurnInput{
  constructor(){this.clear();}
  clear(){this.queue=[];this.held=new Map();this.order=0;}
  get suspended(){return [...this.held.values()].some(h=>h.action.dir&&h.paused);}
  enqueue(action,source=null){if(this.queue.length<8)this.queue.push({action:{...action},source});}
  press(source,action,now){
    const old=this.held.get(source);
    if(old&&JSON.stringify(old.action)===JSON.stringify(action))return;
    this.held.set(source,{action:{...action},order:++this.order,next:now+450,paused:false});
    if(action.dir)this.queue=this.queue.filter(q=>!(q.action.wait&&this.held.has(q.source)));
    if(action.wait&&[...this.held.values()].some(h=>h.action.dir))return;
    this.enqueue(action,source);
  }
  release(source,cancel=false){this.held.delete(source);if(cancel)this.queue=this.queue.filter(q=>q.source!==source);}
  suspend(){
    for(const h of this.held.values())h.paused=true;
    this.queue=this.queue.filter(q=>!this.held.has(q.source)||!q.action.dir&&!q.action.wait);
  }
  next(now){
    if(this.queue.length)return this.queue.shift().action;
    const held=[...this.held.values()].filter(h=>h.action.dir).sort((a,b)=>b.order-a.order)[0];
    if(!held||held.paused||now<held.next)return null;held.next=now+240;return {...held.action};
  }
}
