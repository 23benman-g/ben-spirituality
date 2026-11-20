/* Original procedural letter-drip effect: scroll transforms heading into the essential question. */
(()=>{
const section=document.querySelector('.essential-question');if(!section)return;
const pin=section.querySelector('.word-pin'), heading=section.querySelector('.kinetic-line'), final=section.querySelector('.essential-final');
if(!pin||!heading||!final)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){section.style.setProperty('--eq-reveal','1');section.style.setProperty('--eq-heading-fade','1');return;}
const canvas=document.createElement('canvas');canvas.className='eq-drip-canvas';canvas.setAttribute('aria-hidden','true');pin.append(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
let drops=[],w=0,h=0,raf=0,lastProgress=-1;
function resize(){const rect=pin.getBoundingClientRect();w=Math.max(1,Math.round(rect.width));h=Math.max(1,Math.round(rect.height));const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);build();lastProgress=-1;queue();}
function build(){drops=[];const mask=document.createElement('canvas');mask.width=w;mask.height=h;const c=mask.getContext('2d',{willReadFrequently:true});c.fillStyle='#fff';
for(const el of heading.children){const r=el.getBoundingClientRect(),pr=pin.getBoundingClientRect(),style=getComputedStyle(el);c.font=style.font;c.textBaseline='top';c.fillText(el.textContent,r.left-pr.left,r.top-pr.top);}
const data=c.getImageData(0,0,w,h).data,step=w<600?5:6;
for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){if(data[(y*w+x)*4+3]<100)continue;const seed=Math.sin(x*12.9898+y*78.233)*43758.5453;const rand=seed-Math.floor(seed);if(rand>.64)continue;drops.push({x,y,delay:rand*.22,fall:45+rand*175,drift:(rand-.5)*42,size:.7+rand*1.1});}
}
function draw(p){const melt=smooth((p-.12)/.35),reveal=smooth((p-.48)/.32);section.style.setProperty('--eq-progress',p.toFixed(4));section.style.setProperty('--eq-heading-fade',smooth((p-.12)/.18).toFixed(4));section.style.setProperty('--eq-reveal',reveal.toFixed(4));
ctx.clearRect(0,0,w,h);if(melt<=0||p>.83)return;
const alpha=(1-reveal)*Math.min(1,melt*3);ctx.fillStyle='#a8c7ec';
for(const dot of drops){const t=smooth((melt-dot.delay)/(1-dot.delay));if(t<=0)continue;const y=dot.y+t*dot.fall+Math.pow(t,2)*h*.34;const x=dot.x+Math.sin(t*5+dot.x*.02)*dot.drift;const opacity=alpha*(1-t*.65);if(opacity<.025||y>h)continue;ctx.globalAlpha=opacity;ctx.beginPath();ctx.ellipse(x,y,dot.size*.75,dot.size*(1+7*t),0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
}
function update(){raf=0;const rect=section.getBoundingClientRect();const span=Math.max(1,rect.height-innerHeight);const p=clamp(-rect.top/span);if(Math.abs(p-lastProgress)<.002)return;lastProgress=p;draw(p);}
function queue(){if(!raf)raf=requestAnimationFrame(update)}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',resize,{passive:true});document.fonts.ready.then(resize);resize();
})();