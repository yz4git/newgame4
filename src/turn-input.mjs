// Preserve quick taps between frames. A held control repeats only while held;
// missed frames never accumulate a backlog of automatic turns.
export class TurnInput{
  constructor(){this.clear();}
  clear(){this.queue=[];this.held=new Map();this.order=0;}
  enqueue(action,source=null){if(this.queue.length<8)this.queue.push({action:{...action},source});}
  press(source,action,now){
    const old=this.held.get(source);
    if(old&&JSON.stringify(old.action)===JSON.stringify(action))return;
    this.held.set(source,{action:{...action},order:++this.order,next:now+450});this.enqueue(action,source);
  }
  release(source,cancel=false){this.held.delete(source);if(cancel)this.queue=this.queue.filter(q=>q.source!==source);}
  next(now){
    if(this.queue.length)return this.queue.shift().action;
    const held=[...this.held.values()].sort((a,b)=>b.order-a.order)[0];
    if(!held||now<held.next)return null;held.next=now+240;return {...held.action};
  }
}
