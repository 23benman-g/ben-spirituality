(()=>{
'use strict';
const canvas=document.getElementById('connection-canvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=1,H=1,D=1,yaw=-.08,pitch=-.05,roll=0,down=false,lx=0,ly=0,vx=0,vy=0,t=0,frame=0,visible=true;
const particles=[],streamers=[];let seed=13907;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}function rr(a,b){return a+(b-a)*rnd()}
const P=(x,y,z,side,type=0,s=1)=>particles.push({x,y,z,side,type,s,phase:rr(0,6.283)});
function blob(cx,cy,cz,rx,ry,rz,n,side){for(let i=0;i<n;i++){let a=rr(0,6.283),u=rr(-1,1),r=Math.sqrt(1-u*u),shell=rr(.66,1);P(cx+rx*r*Math.cos(a)*shell,cy+ry*u*shell,cz+rz*r*Math.sin(a)*shell,side,0,rr(.6,1.4))}}
function tube(a,b,r,n,side){let dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz)||1;let ux=-dy/len,uy=dx/len,uz=0;let vx=uy*dz/len,vyy=uz*dx/len-ux*dz/len,vz=ux*dy/len-uy*dx/len;for(let i=0;i<n;i++){let q=rnd(),theta=rr(0,6.283),rad=r*Math.sqrt(rnd())*(.82+.12*Math.sin(q*Math.PI));P(a[0]+dx*q+rad*(ux*Math.cos(theta)+vx*Math.sin(theta)),a[1]+dy*q+rad*(uy*Math.cos(theta)+vyy*Math.sin(theta)),a[2]+dz*q+rad*(uz*Math.cos(theta)+vz*Math.sin(theta)),side,0,rr(.7,1.5))}}
function curve(a,b,c,r,n,side){const steps=14;for(let j=0;j<steps;j++){const q=j/steps,k=(j+1)/steps;const at=u=>[(1-u)*(1-u)*a[0]+2*(1-u)*u*b[0]+u*u*c[0],(1-u)*(1-u)*a[1]+2*(1-u)*u*b[1]+u*u*c[1],(1-u)*(1-u)*a[2]+2*(1-u)*u*b[2]+u*u*c[2]];tube(at(q),at(k),r*(.85+.15*Math.sin(q*Math.PI)),Math.ceil(n/steps),side)}}
function human(side){
// Anatomical landmarks are modeled in a local upright coordinate system,
// then tilted into a weightless diagonal pose. Both bodies retain their shape in 360°.
const mirror=side===0?-1:1;
const tr=([u,v,z])=>[mirror*(1.38+u*.89+v*.24),-.20+v*.84-u*.13,z];
const B=(u,v,z,rx,ry,rz,n)=>{let c=tr([u,v,z]);blob(...c,rx,ry,rz,n,side)};
const T=(a,b,r,n)=>tube(tr(a),tr(b),r,n,side);
const C=(a,b,c,r,n)=>curve(tr(a),tr(b),tr(c),r,n,side);
// Head, jaw, neck, shoulders, rib cage, waist, and pelvis.
B(0,-.71,0,.165,.205,.165,700);
B(0,-.39,0,.09,.105,.095,180);
B(0,-.05,0,.295,.36,.18,1100);
B(0,.28,0,.20,.19,.155,400);
B(0,.45,0,.26,.16,.18,520);
// A luminous spine and visible shoulders make the anatomy readable from behind.
C([0,-.34,-.13],[0,-.02,-.15],[0,.38,-.10],.045,210);
T([-.26,-.30,0],[.26,-.30,0],.075,260);
// Reaching arm, elbow, wrist, palm, individual slender fingers.
C([-.26,-.29,0],[-.56,-.31,.05],[-.80,-.29,.12],.105,500);
C([-.80,-.29,.12],[-.98,-.28,.18],[-1.14,-.24,.20],.069,360);
B(-1.18,-.24,.20,.085,.047,.05,150);
for(let j=0;j<5;j++){let v=-.285+j*.022;C([-1.22,v,.20],[-1.29,v-.01,.21],[-1.36,v+(j-2)*.006,.22],.012,75)}
// The opposite arm floats backward with a distinct elbow and hand.
C([.25,-.28,-.03],[.45,-.04,-.18],[.66,.04,-.18],.098,380);
C([.66,.04,-.18],[.79,.19,-.12],[.88,.25,-.04],.063,290);
B(.89,.26,-.04,.065,.045,.045,85);
// Two separate articulated legs, with bent knees and pointed feet.
C([-.13,.50,.02],[-.22,.77,.08],[-.33,1.03,.15],.14,540);
C([-.33,1.03,.15],[-.40,1.22,.19],[-.49,1.36,.21],.085,370);
C([.14,.50,-.03],[.26,.72,-.18],[.42,.88,-.25],.14,540);
C([.42,.88,-.25],[.51,1.08,-.24],[.60,1.23,-.19],.085,370);
B(-.51,1.38,.21,.115,.048,.065,110);B(.63,1.25,-.19,.115,.048,.065,110);
// Hair and long fine energy strands stream away from the floating head.
for(let j=0;j<18;j++){let offset=(j-8.5)*.017,depth=rr(-.13,.13);for(let k=0;k<65;k++){let q=k/64,pt=tr([.07+q*(.22+j*.007),-.78-q*.26+Math.sin(q*5+j*.4)*.035+offset,depth+q*.08]);P(...pt,side,2,rr(.4,.8))}}
// Atmospheric ribbons follow the body rather than obscuring its silhouette.
for(let j=0;j<13;j++){let ph=j*.63;for(let k=0;k<90;k++){let q=k/89,pt=tr([.18+q*(.5+.3*Math.sin(ph)), -.6+q*1.9+.13*Math.sin(q*9+ph),.24+.20*Math.cos(q*7+ph)]);streamers.push({x:pt[0],y:pt[1],z:pt[2],side,phase:ph+q*7,s:rr(.25,.75)})}}
}
human(0);human(1);
const sparks=Array.from({length:110},(_,i)=>({a:i*2.39996,r:Math.sqrt(rnd()),z:rr(-.2,.2),s:rr(.6,1.5)}));
function resize(){const b=canvas.getBoundingClientRect();W=Math.max(1,b.width);H=Math.max(1,b.height);D=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);ctx.setTransform(D,0,0,D,0,0)}
function project(p){let ca=Math.cos(yaw),sa=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);let xx=p.x*ca-p.z*sa,zz=p.x*sa+p.z*ca,yy=p.y*cp-zz*sp;zz=p.y*sp+zz*cp;let scale=Math.min(W/4.9,H/2.65)*2.9/(2.9+zz*.18);return {x:W*.50+xx*scale,y:H*.49+(yy+Math.sin(t*.5+(p.side||0))*.038)*scale,z:zz,s:scale}}
function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
function glow(x,y,r){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,250,221,.9)');g.addColorStop(.05,'rgba(255,208,128,.72)');g.addColorStop(.2,'rgba(243,171,78,.24)');g.addColorStop(.5,'rgba(255,165,65,.065)');g.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function render(){if(!visible)return;t+=reduced?0:.012;ctx.clearRect(0,0,W,H);if(!down&&!reduced){yaw+=vx;pitch+=vy;vx*=.95;vy*=.95}
const center=project({x:0,y:-.23,z:.25});glow(center.x,center.y,Math.min(W,H)*.30);
for(let i=0;i<6;i++){let radius=(24+i*16)*(1+.045*Math.sin(t*1.3+i));ctx.beginPath();ctx.ellipse(center.x,center.y,radius,radius*.62,yaw*.14,0,6.283);ctx.strokeStyle=`rgba(255,195,104,${.23-i*.032})`;ctx.lineWidth=.8;ctx.stroke()}
const pts=particles.concat(streamers).map(p=>({p,q:project(p)})).sort((a,b)=>b.q.z-a.q.z);
for(let {p,q} of pts){let ribbon=!('type' in p),f=.65+.35*Math.sin(t*1.7+p.phase),gold=Math.abs(p.x)<.33&&p.y>-.37&&p.y<-.08;let alpha=(ribbon?.20:p.type===2?.40:.48)*f+(ribbon?.05:.16);let radius=Math.max(.38,Math.min(2.25,q.s*.012*p.s));if(gold){circle(q.x,q.y,radius*1.18,`rgba(255,203,125,${alpha})`)}else if(p.side){circle(q.x,q.y,radius,`rgba(153,201,255,${alpha})`)}else{circle(q.x,q.y,radius,`rgba(216,232,255,${alpha})`)}if(!ribbon&&p.type===0&&p.s>1.3&&Math.abs(p.x)<1.5){circle(q.x,q.y,radius*2.2,`rgba(106,171,255,${alpha*.07})`)}}
for(let i=0;i<sparks.length;i++){const p=sparks[i],a=p.a+t*(.13+.08*p.r),r=(.08+p.r*.52)*Math.min(W,H)*.14;circle(center.x+Math.cos(a)*r,center.y+Math.sin(a)*r*.65,.4+p.s*.55,`rgba(255,${190+i%40},${112+i%40},${.15+.55*(.5+.5*Math.sin(t*2+i))})`)}
if(!reduced)frame=requestAnimationFrame(render)}
canvas.addEventListener('pointerdown',e=>{down=true;vx=vy=0;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!down)return;let dx=e.clientX-lx,dy=e.clientY-ly;yaw+=dx*.009;pitch+=dy*.009;vx=dx*.00065;vy=dy*.00065;lx=e.clientX;ly=e.clientY;if(reduced)render()});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,()=>down=false);
canvas.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();roll+=e.deltaY*.0015;yaw+=e.deltaY*.0007;if(reduced)render()},{passive:false});
const observer=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!reduced){cancelAnimationFrame(frame);render()}else if(!visible)cancelAnimationFrame(frame)},{threshold:.02});observer.observe(canvas);
window.addEventListener('resize',()=>{resize();if(reduced)render()});resize();render();
})();
