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
function human(side){const mirror=side===0?-1:1, x=a=>mirror*a;const lean=side===0?-.12:.10;
// Horizontal floating bodies, reaching in toward the shared light.
blob(x(1.23),-.19,0,.32,.27,.23,650,side); // torso
blob(x(1.48),-.22,.02,.23,.21,.21,380,side); // hips
blob(x(1.02),-.48,-.04,.145,.17,.15,340,side); // head
curve([x(1.11),-.39,-.03],[x(1.14),-.31,0],[x(1.23),-.26,0],.082,140,side); // neck
// Backward drifting legs: both legs bend and taper in zero gravity.
curve([x(1.55),-.31,.04],[x(1.78),-.58,.18],[x(2.03),-.78,.32],.135,460,side);
curve([x(2.03),-.78,.32],[x(2.15),-.89,.40],[x(2.28),-.77,.49],.085,270,side);
curve([x(1.53),-.11,-.06],[x(1.78),.15,-.24],[x(2.01),.34,-.30],.13,440,side);
curve([x(2.01),.34,-.30],[x(2.18),.38,-.25],[x(2.31),.23,-.18],.078,260,side);
// The main arm arcs toward the center; detailed hand and individual fingers.
curve([x(1.13),-.26,.06],[x(.77),-.36,.12],[x(.45),-.26,.19],.112,460,side);
curve([x(.45),-.26,.19],[x(.32),-.24,.23],[x(.19),-.22,.24],.068,310,side);
blob(x(.17),-.22,.24,.095,.048,.055,115,side);
for(let k=0;k<4;k++){const yy=-.265+k*.024;curve([x(.13),yy,.24],[x(.075),yy-.006,.25],[x(.025),yy+(k-1.5)*.007,.25],.012,72,side)}
// The second arm trails behind and balances the composition.
curve([x(1.28),-.11,-.08],[x(1.48),.10,-.23],[x(1.76),.02,-.29],.098,400,side);
curve([x(1.76),.02,-.29],[x(1.93),-.04,-.25],[x(2.05),.09,-.15],.058,240,side);
// Long luminous hair filaments, flowing backward from the head.
for(let j=0;j<9;j++){let a=j/8,ox=rr(-.08,.08),oy=rr(-.12,.12);for(let k=0;k<55;k++){let u=k/54;P(x(1.08+ox+u*(.48+.25*a)),-.53+oy+Math.sin(u*4+a*4)*.075+u*(a-.5)*.30,-.06+u*.09,side,2,rr(.4,.85))}}
// Curved ribbons that extend beyond the bodies and feel weightless.
for(let j=0;j<11;j++){let phase=j*.74;for(let k=0;k<105;k++){let u=k/104,xx=1.15+u*1.30+.13*Math.sin(u*8+phase),yy=-.16+Math.sin(u*6.5+phase)*(.24+.42*u),zz=.25+Math.cos(u*6+phase)*(.17+.25*u);streamers.push({x:x(xx),y:yy,z:zz,side,phase:phase+u*7,s:rr(.3,.85)})}}
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
