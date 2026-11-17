/* Scroll-linked liquid typography; native wheel and touch scrolling stay intact. */
(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const question=document.querySelector('.essential-question'),hero=document.querySelector('.hero'),line=question.querySelector('.kinetic-line'),targetEls=[...hero.querySelectorAll('h1,.intro,.eyebrow')];
const canvas=document.createElement('canvas');canvas.className='question-melt-layer';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d');
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>x*x*(3-2*x);let sourcePoints=[],targetPoints=[],ready=false,queued=false,vw=0,vh=0;
function raster(elements,relativeTop){const mask=document.createElement('canvas');mask.width=vw;mask.height=Math.max(vh,900);const c=mask.getContext('2d');c.fillStyle='#fff';c.textBaseline='top';
for(const parent of elements){const spans=parent.querySelectorAll('.transfer-word');const words=spans.length?[...spans]:[parent];for(const el of words){const r=el.getBoundingClientRect(),s=getComputedStyle(el);c.font=s.font;c.letterSpacing=s.letterSpacing;c.fillText(el.textContent,r.left,r.top-relativeTop)}}
const pixels=c.getImageData(0,0,mask.width,mask.height).data,points=[],step=innerWidth<600?4:5;for(let y=0;y<mask.height;y+=step)for(let x=0;x<vw;x+=step)if(pixels[(y*vw+x)*4+3]>100)points.push({x,y});return points}
function prepare(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=vw*d;canvas.height=vh*d;ctx.setTransform(d,0,0,d,0,0);sourcePoints=raster([...line.children],0);targetPoints=raster(targetEls,hero.getBoundingClientRect().top);ready=sourcePoints.length>0&&targetPoints.length>0}
function draw(){queued=false;const start=hero.offsetTop-innerHeight*1.18,end=hero.offsetTop,p=clamp((scrollY-start)/Math.max(1,end-start));
if(p===0){canvas.style.display='none';line.style.opacity='';targetEls.forEach(el=>el.style.opacity='');ready=false;return}
if(p===1){canvas.style.display='none';line.style.opacity='0';targetEls.forEach(el=>el.style.opacity='');return}
if(!ready)prepare();if(!ready)return;canvas.style.display='block';ctx.clearRect(0,0,vw,vh);
const dissolve=ease(clamp(p/.1)),settle=ease(clamp((p-.84)/.16));line.style.opacity=1-dissolve;targetEls.forEach(el=>el.style.opacity=settle);ctx.globalAlpha=dissolve*(1-settle);ctx.fillStyle='#c5cfde';
const count=Math.min(4200,Math.max(sourcePoints.length,targetPoints.length)),offset=hero.offsetTop-Math.min(scrollY,hero.offsetTop);
for(let i=0;i<count;i++){const a=sourcePoints[Math.floor(i*sourcePoints.length/count)],b=targetPoints[Math.floor(i*targetPoints.length/count)],delay=(Math.sin(i*13.7)+1)*.045,q=ease(clamp((p-delay)/(1-delay))),flow=Math.sin(Math.PI*q),x=a.x+(b.x-a.x)*ease(q)+Math.sin(i*4.1)*flow*7,y=a.y+(b.y+offset-a.y)*q+flow*(65+(i%19)*6),length=1.7+flow*(5+(i%11)*1.2);ctx.beginPath();ctx.ellipse(x,y,1.25,length/2,0,0,Math.PI*2);ctx.fill()}
ctx.globalAlpha=1;
}
function queue(){if(!queued){queued=true;requestAnimationFrame(draw)}}addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{ready=false;queue()});document.fonts.ready.then(()=>{ready=false;queue()});queue();
})();
