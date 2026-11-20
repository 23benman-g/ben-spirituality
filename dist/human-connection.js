(()=>{
'use strict';
const canvas=document.getElementById('connection-canvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let w=0,h=0,dpr=1,yaw=-.08,pitch=0,drag=false,lastX=0,lastY=0,velX=0,velY=0,clock=0,raf=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const dots=[],rand=(a,b)=>a+Math.random()*(b-a);
function dot(x,y,z,side,kind=0){dots.push({x,y,z,side,kind,phase:rand(0,Math.PI*2),size:rand(.65,1.35)})}
function ellipsoid(c,rx,ry,rz,n,side){for(let i=0;i<n;i++){const u=rand(-1,1),t=rand(0,Math.PI*2),r=Math.sqrt(1-u*u),shell=rand(.75,1);dot(c[0]+rx*r*Math.cos(t)*shell,c[1]+ry*u*shell,c[2]+rz*r*Math.sin(t)*shell,side)}}
function limb(a,b,r,n,side){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz)||1;let nx=-dy/L,ny=dx/L,nz=0;let mx=ny*dz/L-nz*dy/L,my=nz*dx/L-nx*dz/L,mz=nx*dy/L-ny*dx/L;for(let i=0;i<n;i++){const t=Math.random(),th=rand(0,Math.PI*2),rr=r*Math.sqrt(Math.random())*(.75+.18*Math.sin(t*Math.PI));dot(a[0]+dx*t+rr*(nx*Math.cos(th)+mx*Math.sin(th)),a[1]+dy*t+rr*(ny*Math.cos(th)+my*Math.sin(th)),a[2]+dz*t+rr*(nz*Math.cos(th)+mz*Math.sin(th)),side)}}
function figure(side){const s=side===0?-1:1,X=x=>s*x;
// Weightless, leaning silhouettes with extended arms, echoing Creation of Adam.
ellipsoid([X(1.11),-.88,-.05],.19,.24,.18,620,side);limb([X(1.1),-.68,0],[X(1.12),-.56,0],.095,130,side);
ellipsoid([X(1.14),-.27,0],.29,.43,.22,920,side);ellipsoid([X(1.14),.15,0],.23,.22,.20,340,side);
limb([X(1.02),.25,0],[X(.91),.69,.12],.14,310,side);limb([X(.91),.69,.12],[X(.68),1.08,.25],.105,310,side);
limb([X(1.28),.25,-.05],[X(1.51),.65,-.2],.14,310,side);limb([X(1.51),.65,-.2],[X(1.79),.96,-.3],.10,310,side);
ellipsoid([X(.91),-.56,.02],.15,.15,.15,210,side);
limb([X(.91),-.56,.02],[X(.64),-.38,.15],.115,370,side);limb([X(.64),-.38,.15],[X(.30),-.30,.23],.082,390,side);limb([X(.30),-.30,.23],[X(.075),-.31,.24],.034,260,side);
limb([X(1.39),-.54,-.05],[X(1.59),-.13,-.16],.11,250,side);limb([X(1.59),-.13,-.16],[X(1.82),.13,-.28],.075,230,side);
}
figure(0);figure(1);
// Wisps of particles flow behind the floating bodies, without replacing their silhouette.
const wisps=[];for(let j=0;j<8;j++){const side=j%2,s=side===0?-1:1;for(let k=0;k<90;k++){const t=k/89;wisps.push({x:s*(1.7+Math.cos(t*5.3+j)*(.26+.38*t)+t*.35),y:.55+Math.sin(t*5+j*.75)*(.35+.4*t),z:-.36+Math.sin(t*6+j)*.30,side,phase:t*8+j,size:.55+Math.random()*.7})}}
function resize(){const r=canvas.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
function project(p,t){const ca=Math.cos(yaw),sa=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);let x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca;let y=p.y*cp-z*sp;z=p.y*sp+z*cp;const scale=Math.min(w/4.15,h/3.15)*2.8/(2.8+z*.20);return{x:w/2+x*scale,y:h*.50+(y+Math.sin(t*.75+(p.side||0)*.8)*.045)*scale,z,scale}}
function glow(x,y,r){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,230,161,.72)');g.addColorStop(.11,'rgba(255,186,85,.28)');g.addColorStop(.45,'rgba(255,166,68,.09)');g.addColorStop(1,'rgba(255,176,70,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
function render(){clock+=reduced?0:.014;const t=clock;ctx.clearRect(0,0,w,h);
if(!drag&&!reduced){yaw+=velX;pitch+=velY;velX*=.94;velY*=.94}
const c=project({x:0,y:-.31,z:.24,side:0},t);glow(c.x,c.y,Math.min(w,h)*.32);
// Concentric light rings around the nearly touching fingers, anchored in 3D.
for(let i=0;i<4;i++){const radius=23+i*18+Math.sin(t*1.6-i)*4;ctx.beginPath();ctx.ellipse(c.x,c.y,radius,radius*.78,yaw*.15,0,Math.PI*2);ctx.strokeStyle=`rgba(255,191,95,${.19-i*.035})`;ctx.lineWidth=.7;ctx.stroke()}
const all=dots.concat(wisps).map(p=>({p,q:project(p,t)})).sort((a,b)=>b.q.z-a.q.z);
for(const {p,q} of all){const near=Math.abs(p.x)<.37&&p.y<-.12&&p.y>-.58,trail=!('kind' in p),flicker=.48+.52*Math.sin(t*1.35+p.phase),alpha=trail?.10+.26*flicker:.38+.43*flicker;const rad=Math.max(.45,Math.min(2.15,q.scale*.011*p.size));ctx.beginPath();ctx.arc(q.x,q.y,rad,0,Math.PI*2);ctx.fillStyle=near?`rgba(255,204,120,${alpha})`:p.side?`rgba(151,197,255,${alpha})`:`rgba(211,229,255,${alpha})`;ctx.fill()}
for(let i=0;i<85;i++){const a=i*2.399+t*.36,r=(i%17)/17*65+2;ctx.beginPath();ctx.arc(c.x+Math.cos(a)*r,c.y+Math.sin(a)*r*.78,i%9===0?1.55:.72,0,Math.PI*2);ctx.fillStyle=`rgba(255,${177+i%50},${87+i%60},${.12+.45*(.5+.5*Math.sin(t*2+i))})`;ctx.fill()}
if(!reduced)raf=requestAnimationFrame(render)}
canvas.addEventListener('pointerdown',e=>{drag=true;velX=velY=0;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;yaw+=dx*.009;pitch+=dy*.009;velX=dx*.0009;velY=dy*.0009;lastX=e.clientX;lastY=e.clientY;if(reduced)render()});
function release(){drag=false}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
window.addEventListener('resize',()=>{resize();if(reduced)render()});resize();render();
})();
