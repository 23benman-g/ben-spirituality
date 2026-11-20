(()=>{
const canvas=document.getElementById('connection-canvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let w=0,h=0,dpr=1,angle=-0.08,pitch=0,drag=false,lastX=0,lastY=0,frame=0;
const dots=[];const rand=(a,b)=>a+Math.random()*(b-a);
function capsule(a,b,r,n,side){for(let i=0;i<n;i++){let t=Math.random(),theta=Math.random()*Math.PI*2;let rr=r*Math.sqrt(Math.random());let taper=Math.sin(Math.PI*(.07+.86*t))*.24+.8;dots.push({x:a[0]+(b[0]-a[0])*t+Math.cos(theta)*rr*taper,y:a[1]+(b[1]-a[1])*t+Math.sin(theta)*rr*taper,z:a[2]+(b[2]-a[2])*t+rand(-.025,.025),side,seed:Math.random()*6.28});}}
function orb(c,rx,ry,rz,n,side){for(let i=0;i<n;i++){let u=rand(-1,1),th=rand(0,Math.PI*2),f=Math.sqrt(1-u*u),surface=rand(.75,1);dots.push({x:c[0]+rx*f*Math.cos(th)*surface,y:c[1]+ry*u*surface,z:c[2]+rz*f*Math.sin(th)*surface,side,seed:rand(0,6.28)});}}
function figure(side){let s=side===0?-1:1;const X=x=>s*x; // facing center
orb([X(1.16),-.99,0],.20,.26,.18,540,side); // head
capsule([X(1.17),-.73,0],[X(1.16),-.59,0],.105,180,side);
orb([X(1.16),-.29,0],.29,.43,.17,820,side); // torso
orb([X(1.16),.12,0],.23,.22,.16,300,side);
capsule([X(1.03),.25,0],[X(.98),.74,.04],.145,360,side);
capsule([X(.98),.74,.04],[X(.91),1.24,.13],.108,330,side);
capsule([X(1.30),.25,0],[X(1.41),.75,-.02],.145,360,side);
capsule([X(1.41),.75,-.02],[X(1.43),1.24,.10],.108,330,side);
// shoulder reaching toward central fingertips
orb([X(.94),-.59,0],.15,.14,.15,210,side);
capsule([X(.94),-.57,0],[X(.68),-.35,.12],.11,310,side);
capsule([X(.68),-.35,.12],[X(.31),-.29,.16],.085,330,side);
capsule([X(.31),-.29,.16],[X(.075),-.32,.16],.032,250,side);
// relaxed far arm
capsule([X(1.41),-.57,-.06],[X(1.55),-.14,-.12],.11,280,side);
capsule([X(1.55),-.14,-.12],[X(1.48),.23,-.12],.075,250,side);
}
figure(0);figure(1);
function resize(){let r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
function project(p){let a=angle,ca=Math.cos(a),sa=Math.sin(a),cp=Math.cos(pitch),sp=Math.sin(pitch);let x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca;let y=p.y*cp-z*sp;z=p.y*sp+z*cp;let scale=Math.min(w/3.7,h/2.9)*2.0/(2.0+z*.16);return {x:w/2+x*scale,y:h*.52+y*scale,z,scale}}
function draw(){frame++;ctx.clearRect(0,0,w,h);let t=frame*.012;const center=project({x:0,y:-.32,z:.16});let glow=ctx.createRadialGradient(center.x,center.y,0,center.x,center.y,Math.min(w,h)*.31);glow.addColorStop(0,'rgba(255,211,123,.45)');glow.addColorStop(.16,'rgba(255,176,64,.17)');glow.addColorStop(1,'rgba(255,176,64,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
let projected=dots.map(p=>({p,q:project({...p,y:p.y+Math.sin(t+p.seed)*.004})})).sort((a,b)=>b.q.z-a.q.z);
for(let {p,q} of projected){let gold=Math.abs(p.x)<.38&&p.y<-.18&&p.y>-.55;let rad=Math.max(.55,Math.min(2.1,q.scale*.009));let alpha=.38+.35*(.5+.5*Math.sin(t*1.4+p.seed));ctx.beginPath();ctx.arc(q.x,q.y,rad,0,Math.PI*2);ctx.fillStyle=gold?`rgba(255,204,116,${alpha})`:`rgba(${p.side?'168,204,255':'211,229,255'},${alpha})`;ctx.fill()}
// small, energetic golden sparks around fingertip contact
for(let i=0;i<65;i++){let a=i*2.399+t*.4,rr=(i%13)/13*52+4;let x=center.x+Math.cos(a)*rr,y=center.y+Math.sin(a)*rr*.75;ctx.beginPath();ctx.arc(x,y,i%7===0?1.9:.75,0,Math.PI*2);ctx.fillStyle=`rgba(255,${175+i%65},${75+i%90},${.18+.52*(.5+.5*Math.sin(t*2+i))})`;ctx.fill()}
requestAnimationFrame(draw)}
canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;angle=Math.max(-.85,Math.min(.85,angle+(e.clientX-lastX)*.005));pitch=Math.max(-.35,Math.min(.35,pitch+(e.clientY-lastY)*.003));lastX=e.clientX;lastY=e.clientY});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
window.addEventListener('resize',resize);resize();if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){frame=0;draw=(()=>{let once=false;return ()=>{if(once)return;once=true;ctx.clearRect(0,0,w,h);for(const p of dots){const q=project(p);ctx.fillStyle='rgba(190,218,255,.72)';ctx.fillRect(q.x,q.y,1.4,1.4)}}})()}draw();
})();
