import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('game shell boots, accepts independent movement/cast pointers, switches element and saves on pause',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8'),nodes=new Map(),windowEvents=new Map(),documentEvents=new Map(),storage=new Map(),frames=[];
  class Node{
    constructor(id='',dataset={}){this.id=id;this.dataset=dataset;this.listeners=new Map();this.classes=new Set();this.children=new Map();this.disabled=false;this.style={setProperty(k,v){this[k]=v;}};this.classList={add:(x)=>this.classes.add(x),remove:(x)=>this.classes.delete(x),toggle:(x,on)=>{if(on??!this.classes.has(x))this.classes.add(x);else this.classes.delete(x);},contains:x=>this.classes.has(x)};}
    addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(fn);}
    fire(type,data={}){for(const fn of this.listeners.get(type)||[])fn({preventDefault(){},target:this,...data});}
    setAttribute(k,v){this[k]=v;}
    getBoundingClientRect(){return {left:0,top:0,width:this.id==='dpad'?120:430,height:this.id==='dpad'?120:490};}
    setPointerCapture(id){this.capture=id;}
    closest(selector){return selector==='button'||selector==='[data-element]'&&this.dataset.element!==undefined||selector==='[data-dir]'&&this.dataset.dir?this:null;}
    querySelector(name){if(!this.children.has(name))this.children.set(name,new Node());return this.children.get(name);}
  }
  for(const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*\bid="([^"]+)"[^>]*>/g))nodes.set(match[2],new Node(match[2]));
  const dirs=['up','down','left','right'].map(dir=>new Node('',{dir}));
  const gradient={addColorStop(){}};const context=new Proxy({measureText:s=>({width:s.length*6}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{}});
  nodes.get('game').getContext=()=>context;
  globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:s=>s==='.dir'?dirs:s==='.held'?[...nodes.values(),...dirs].filter(n=>n.classes.has('held')):[],addEventListener:(k,f)=>documentEvents.set(k,f),hidden:false};
  globalThis.window=globalThis;globalThis.addEventListener=(k,f)=>windowEvents.set(k,f);globalThis.devicePixelRatio=1;globalThis.location={protocol:'http:'};Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  globalThis.ResizeObserver=class{constructor(fn){this.fn=fn;}observe(){this.fn();}};globalThis.requestAnimationFrame=fn=>frames.push(fn);
  await import('../src/app.mjs');assert.match(nodes.get('overlay').innerHTML,/RELIC/);
  const button=new Node('',{action:'new'});nodes.get('overlay').fire('click',{target:button});assert.equal(nodes.get('overlay').hidden,true);
  nodes.get('dpad').fire('pointerdown',{pointerId:1,clientX:110,clientY:60,target:dirs.find(n=>n.dataset.dir==='right')});nodes.get('rush').fire('pointerdown',{pointerId:2});assert.equal(nodes.get('dpad').capture,1);assert.equal(nodes.get('rush').capture,2);assert.ok(nodes.get('rush').classList.contains('held'));
  for(let i=0;i<80;i++)frames.shift()(100+i*1000/60);
  nodes.get('elements').fire('click',{target:new Node('',{element:'2'})});assert.equal(nodes.get('element-2')['aria-pressed'],'true');
  nodes.get('rush').fire('pointercancel',{pointerId:2});nodes.get('dpad').fire('pointerup',{pointerId:1});assert.ok(!nodes.get('rush').classList.contains('held'));assert.ok(dirs.every(n=>!n.classList.contains('held')));
  windowEvents.get('blur')();const save=JSON.parse(storage.get('drill-delve-run-v2'));assert.equal(save.version,2);assert.equal(save.state.player.element,2);assert.ok(save.state.stats.casts>0);assert.equal(save.state.player.charges.length,4);assert.equal(save.state.mode,'play');assert.match(nodes.get('overlay').innerHTML,/ひとやすみ/);
  nodes.get('overlay').fire('click',{target:new Node('',{action:'guide'})});assert.match(nodes.get('overlay').innerHTML,/地形そのものを武器に/);nodes.get('overlay').fire('click',{target:new Node('',{action:'guide-back'})});assert.match(nodes.get('overlay').innerHTML,/ひとやすみ/);
});
