/* Non-destructive 3D parallax for the original, unmodified Human Connection image. */
(()=>{
  const stage=document.querySelector('#human-connection.human-static-art');
  if(!stage) return;
  const art=stage.querySelector('img');
  if(!art) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return;
  let x=0,y=0,tx=0,ty=0,drag=false,px=0,py=0,frame=0;
  const max=7;
  function tick(){
    x+=(tx-x)*.13; y+=(ty-y)*.13;
    art.style.transform=`perspective(1500px) rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg) scale(1.018)`;
    if(Math.abs(x-tx)>.015||Math.abs(y-ty)>.015||drag){frame=requestAnimationFrame(tick)}else{frame=0}
  }
  function update(){if(!frame)frame=requestAnimationFrame(tick)}
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==0 && e.pointerType==='mouse')return;
    drag=true;px=e.clientX;py=e.clientY;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove',e=>{
    if(drag){
      ty=Math.max(-max,Math.min(max,ty+(e.clientX-px)*.045));
      tx=Math.max(-max,Math.min(max,tx-(e.clientY-py)*.045));
      px=e.clientX;py=e.clientY;
    }else if(e.pointerType==='mouse'){
      const r=stage.getBoundingClientRect();
      ty=((e.clientX-r.left)/r.width-.5)*max*.7;
      tx=-((e.clientY-r.top)/r.height-.5)*max*.7;
    }
    update();
  });
  function release(){drag=false;stage.classList.remove('is-dragging')}
  stage.addEventListener('pointerup',release);
  stage.addEventListener('pointercancel',release);
  stage.addEventListener('lostpointercapture',release);
  stage.addEventListener('pointerleave',()=>{if(!drag){tx=0;ty=0;update()}});
  stage.addEventListener('dblclick',()=>{tx=0;ty=0;update()});
  stage.setAttribute('title','Drag to tilt the original artwork. Double-click to center.');
})();
