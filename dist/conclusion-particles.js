(() => {
  'use strict';
  const canvas = document.getElementById('conclusionParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, frame = 0;
  let visible = true, active = false, scatterPulse = 0;
  let pointerX = -1e4, pointerY = -1e4;
  let lastX = -1e4, lastY = -1e4;
  let particles = [];
  let seed = 92738;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const lerp = (a,b,t) => a+(b-a)*t;
  const hexColors = ['#aacbdb','#a9c9e5','#aebfce','#c8d3cf','#e8cb96','#e5bc85'];

  function initialize(){
    let rect = canvas.getBoundingClientRect();
    let nextW = Math.max(200, Math.round(rect.width));
    let nextH = Math.max(170, Math.round(rect.height));
    if (width === nextW && height === nextH) return;
    width = nextW; height = nextH;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles = [];
    const count = Math.round(Math.min(560,Math.max(260,width*.59)));
    const cy = height*.49;
    seed=92738;
    for(let i=0;i<count;i++){
      // Strong central grouping, sparse stars at either edge, delicate horizontal composition.
      let u = rnd();
      if (rnd() < .52){
        u = (rnd()+rnd()+rnd()+rnd())/4;
      }
      let x = lerp(width*.065,width*.935,u);
      const centerDensity = Math.max(0, 1 - Math.abs(u-.50)*2);
      let y = cy + (rnd()-.5)*(18+24*(1-centerDensity));
      let r = .45 + rnd()*1.05;
      if(i%23===0) r = 1.65+rnd()*.72;
      const tone = u < .50 ? (rnd()<.75?1:2) : (rnd()<.70?4:5);
      let color = i%13===0? '#eff4ed' : hexColors[tone];
      let alpha = .28 + rnd()*.53;
      particles.push({homeX:x,homeY:y,x,y,vx:0,vy:0,r,color,alpha,phase:rnd()*6.28,osc:.3+rnd()*.65});
    }
    // Single focal star in the center of the original reference design.
    particles.push({homeX:width*.5,homeY:cy,x:width*.5,y:cy,vx:0,vy:0,r:2.7,color:'#e6be8f',alpha:1,phase:0,osc:0,focus:true});
  }
  function onMove(ev){
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const speed = Math.min(35, Math.hypot(x-lastX,y-lastY));
    pointerX=x;pointerY=y;active=true;
    for(const p of particles){
      let dx = p.x-x, dy = p.y-y, dist = Math.hypot(dx,dy);
      const range = 97;
      if(dist < range){
        let f = (1-dist/range)*(2.6+speed*.28);
        if(dist<.5){dx=rnd()-.5;dy=rnd()-.5;dist=Math.hypot(dx,dy);}
        p.vx += dx/dist*f;
        p.vy += dy/dist*f;
      }
    }
    lastX=x;lastY=y;
    start();
  }
  canvas.addEventListener('pointerenter', (e)=>{lastX=e.clientX-canvas.getBoundingClientRect().left;lastY=e.clientY-canvas.getBoundingClientRect().top;});
  canvas.addEventListener('pointermove',onMove,{passive:true});
  canvas.addEventListener('pointerleave',()=>{active=false;pointerX=-1e4;pointerY=-1e4;lastX=-1e4;lastY=-1e4;});
  canvas.addEventListener('pointerdown',e=>{
    const rect=canvas.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    for(const p of particles){let dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy)||1;if(d<130){p.vx+=(dx/d)*12*(1-d/130);p.vy+=(dy/d)*12*(1-d/130);}}
    start();
  });
  function scatter(){
    for(const p of particles){
      let dx=p.x-width*.5,dy=p.y-height*.49,d=Math.hypot(dx,dy)||1;
      p.vx+=(dx/d)*(3+rnd()*7);
      p.vy+=((dy/d)+(.5-rnd())*.8)*(3+rnd()*7);
    }
    scatterPulse=1;
    start();
  }
  canvas.addEventListener('keydown',e=>{
    if(e.code==='Space'||e.key==='Enter'){e.preventDefault();scatter();}
    if(e.key==='Escape'){e.preventDefault();for(const p of particles){p.vx=0;p.vy=0;p.x=p.homeX;p.y=p.homeY;}start();}
    if(e.key.startsWith('Arrow')){e.preventDefault();scatter();}
  });
  function draw(){
    frame=0;
    if(!visible) return;
    initialize();
    ctx.clearRect(0,0,width,height);
    const t=performance.now()*.001;
    let g=ctx.createRadialGradient(width*.5,height*.49,0,width*.5,height*.49,Math.min(140,width*.23));
    g.addColorStop(0,'rgba(197,148,96,.10)');g.addColorStop(.14,'rgba(198,163,120,.038)');g.addColorStop(1,'rgba(198,163,120,0)');
    ctx.fillStyle=g;ctx.fillRect(width*.25,0,width*.5,height);
    for(const p of particles){
      // Inertia + soft spring recovery recreate the user’s name-particle behaviour.
      p.vx+=(p.homeX-p.x)*.016;
      p.vy+=(p.homeY-p.y)*.016;
      p.vx*=.89;p.vy*=.89;
      p.x+=p.vx;p.y+=p.vy;
      const wobble=reduceMotion?0:Math.sin(t*.65+p.phase)*p.osc;
      ctx.globalAlpha=p.alpha;
      if(p.focus){
        const halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,26);
        halo.addColorStop(0,'rgba(241,196,139,.52)');halo.addColorStop(.22,'rgba(240,180,116,.18)');halo.addColorStop(1,'rgba(230,167,91,0)');
        ctx.fillStyle=halo;ctx.beginPath();ctx.arc(p.x,p.y,26,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=p.color;
      ctx.beginPath();ctx.arc(p.x,p.y+wobble,p.r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    if(!reduceMotion || active || scatterPulse>0){
      scatterPulse*=.94;
      frame=requestAnimationFrame(draw);
    }
  }
  function start(){if(!frame&&visible)frame=requestAnimationFrame(draw);}
  const resize = new ResizeObserver(()=>{initialize();start();});
  resize.observe(canvas);
  if('IntersectionObserver' in window){
    new IntersectionObserver((entries)=>{
      visible = entries[0].isIntersecting;
      if(!visible){if(frame)cancelAnimationFrame(frame);frame=0;}
      else start();
    },{threshold:0}).observe(canvas);
  }
  window.addEventListener('resize',()=>{initialize();start();},{passive:true});
  initialize();start();
})();