/* The words and the same live sculpture cross section boundaries together. */
(()=>{
const hero=document.querySelector('.hero'),art=document.querySelector('.artwrap'),destination=document.getElementById('nextArt'),source=document.getElementById('sculpture'),arrival=document.querySelector('.arrival-copy');
if(!hero||!destination||!source||!arrival)return;
document.getElementById('nextSculpture').remove();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*x*(x*(x*6-15)+10);
const groups=[...document.querySelectorAll('.hero-copy .eyebrow,.hero-copy h1,.hero-copy .intro,.hero-copy .explore,.hero-copy .scene-story,.hero-copy .sample,.art-label,.art-help,.hero-bottom')];
const layer=document.createElement('div');layer.className='word-transfer-layer';layer.setAttribute('aria-hidden','true');document.body.append(layer);
let mode='home',queued=false,metrics=null,flights=[],lastSize='',transitionTheme=false,renderedT=0,lastFrame=0;
function wrap(node){for(const child of [...node.childNodes]){if(child.nodeType===3){const f=document.createDocumentFragment();for(const token of child.textContent.split(/(\s+)/)){const el=/^\s*$/.test(token)?document.createTextNode(token):document.createElement('span');if(el.nodeType===1){el.className='transfer-word';el.textContent=token}f.append(el)}child.replaceWith(f)}else if(child.nodeType===1&&!child.classList.contains('transfer-word')&&!child.matches('button,.scene-dots'))wrap(child)}}
groups.forEach(wrap);wrap(arrival);
function data(el){const r=el.getBoundingClientRect(),c=getComputedStyle(el);return {el,x:r.left,y:r.top+scrollY,w:r.width,h:r.height,font:c.font,fontSize:parseFloat(c.fontSize),family:c.fontFamily,weight:c.fontWeight,style:c.fontStyle,color:c.color,spacing:c.letterSpacing}}
function measure(){if(mode!=='home')return;const r=source.getBoundingClientRect(),a=art.getBoundingClientRect();metrics={x:r.left,y:r.top+scrollY,width:r.width,height:r.height,dy:r.top-a.top};layer.replaceChildren();const from=groups.flatMap(g=>[...g.querySelectorAll('.transfer-word')]).map(data),to=[...arrival.querySelectorAll('.transfer-word')].map(data);flights=from.map((f,i)=>{const target=to[Math.min(to.length-1,Math.floor(i*to.length/from.length))],node=document.createElement('div'),old=document.createElement('span'),next=document.createElement('span');node.className='word-transfer-item';old.textContent=f.el.textContent;next.textContent=target.el.textContent;node.append(old,next);layer.append(node);return {from:f,to:target,node,old,next,index:i,count:from.filter((_,j)=>Math.floor(j*to.length/from.length)===Math.floor(i*to.length/from.length)).length}})}
function clearCanvas(){source.classList.remove('scene-traveler');source.removeAttribute('style')}
function size(){const r=source.getBoundingClientRect(),key=Math.round(r.width)+':'+Math.round(r.height);if(key!==lastSize){lastSize=key;resize()}}
function home(){if(mode!=='home'){art.prepend(source);clearCanvas();mode='home';size()} }
function draw(now){queued=false;if(!metrics)measure();if(!metrics)return;const target=destination.getBoundingClientRect(),end=target.top+scrollY,start=hero.offsetTop+10,hold=Math.min(110,Math.max(50,(end-start)*.09)),desiredT=clamp((scrollY-start-hold)/Math.max(250,end-start-hold*2)),dt=Math.min(64,Math.max(1,now-(lastFrame||now-16)));lastFrame=now;renderedT+=(desiredT-renderedT)*(1-Math.exp(-dt/48));if(Math.abs(desiredT-renderedT)<.0003)renderedT=desiredT;const t=renderedT,p=ease(t);if(t!==desiredT)queue();document.documentElement.classList.toggle('scene-in-progress',t>0);document.documentElement.style.setProperty('--next-opacity',1);
if(reducedMotion){home();arrival.style.visibility='visible';layer.style.display='none';return}
layer.style.display=t>0&&t<1?'block':'none';groups.forEach(g=>g.style.visibility=t>0?'hidden':'');arrival.style.visibility=t<1?'hidden':'visible';
if(t===0){home();if(transitionTheme){selectTheme(0);transitionTheme=false;groups.forEach(wrap);measure()}return}
if(t>.34&&!transitionTheme){targetForm=1;transitionTheme=true}if(t<.23&&transitionTheme){targetForm=0;transitionTheme=false}
if(t===1){if(mode!=='landed'){destination.append(source);clearCanvas();mode='landed';targetForm=1;transitionTheme=true;size()}return}
if(mode!=='flight'){document.body.append(source);clearCanvas();source.classList.add('scene-traveler');mode='flight'}
// Both sculpture anchors share a column. No sideways travel or shrinking.
const mobile=innerWidth<=900,ratio=innerWidth<=480?.44:mobile?.35:0,dy=ratio*innerHeight;
source.style.left=metrics.x+'px';source.style.top=((1-p)*Math.max(metrics.dy,metrics.y-scrollY)+p*(target.top+dy))+'px';source.style.width=metrics.width+'px';source.style.height=metrics.height+'px';size();
const targetRects=new Map();flights.forEach(f=>{if(!targetRects.has(f.to.el))targetRects.set(f.to.el,f.to.el.getBoundingClientRect())});
flights.forEach(f=>{const delay=(f.index%7)*.004,q=ease(clamp((t-delay)/(1-delay))),r=targetRects.get(f.to.el),sy=f.from.y-Math.min(scrollY,hero.offsetTop),x=f.from.x+(r.left-f.from.x)*q,y=sy+(r.top-sy)*q+Math.sin(Math.PI*q)*(35+(f.index%5)*12),m=ease(clamp((q-.22)/.68)),s=f.from;
f.node.style.transform=`translate3d(${x}px,${y}px,0) rotate(${Math.sin(Math.PI*q)*Math.sin(f.index*3)*5}deg)`;
f.node.style.fontFamily=s.family;f.node.style.fontWeight=s.weight;f.node.style.fontStyle=s.style;f.node.style.fontSize=(s.fontSize+(f.to.fontSize-s.fontSize)*q)+'px';f.node.style.color=s.color;f.node.style.letterSpacing=s.spacing;
f.old.style.opacity=1-m;f.next.style.opacity=1-Math.pow(1-m,1/f.count);f.next.style.fontFamily=f.to.family;f.next.style.fontWeight=f.to.weight;f.next.style.fontStyle=f.to.style;f.next.style.fontSize='inherit';f.next.style.color=f.to.color;f.next.style.letterSpacing=f.to.spacing;
});}
function queue(){if(!queued){queued=true;requestAnimationFrame(draw)}}
document.getElementById('nextReset').onclick=()=>document.getElementById('reset').click();
addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{home();metrics=null;measure();queue()});addEventListener('load',()=>{measure();queue()});document.fonts.ready.then(()=>{measure();queue()});measure();queue();
})();
