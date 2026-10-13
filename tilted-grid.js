(()=>{
 const hero=document.querySelector('.tilted-hero'),band=hero?.querySelector('.tilted-band');
 if(!hero||!band)return;
 const images=Array.from({length:6},(_,i)=>'selected-'+(i+1)+'.webp');
 const SLICES=16,CAMERA=1.6,MAX_WIDTH=55;
 const speed=6,tileHeight=35,aspect=16/9,gap=8,axis=64,bend=65*Math.PI/180;
 const arc=b=>(CAMERA-1+Math.cos(b))/(2*CAMERA*Math.sin(b));
 const r=100*arc(bend),radius=r.toFixed(3)+'cqw';
 const u=n=>'calc('+n.toFixed(4)+' * min('+tileHeight+'cqh, '+(MAX_WIDTH/aspect).toFixed(4)+'cqw))';
 const turn=deg=>'translateZ('+radius+') rotateY('+deg.toFixed(4)+'deg) translateZ(-'+radius+')';
 band.style.perspective=(r*CAMERA).toFixed(3)+'cqw';
 band.style.perspectiveOrigin='50% '+axis+'%';
 const style=document.createElement('style');hero.append(style);
 images.forEach(src=>{const preload=new Image();preload.src=src;});
 let previous='';
 function layout(width,height){
  const h=Math.min(tileHeight/100*height,MAX_WIDTH/100*width/aspect),rad=width*arc(bend);
  if(!(h>0&&rad>0))return;
  const unit=h/rad*180/Math.PI,pitch=(aspect+gap/100)*unit,limit=bend*180/Math.PI+aspect*unit/2;
  const columns=Math.min(60,Math.max(2,Math.ceil(2*limit/pitch))),sweep=columns*pitch/2;
  const key=[columns,sweep.toFixed(3),unit.toFixed(3)].join(':');if(key===previous)return;previous=key;
  const hide=Math.max(0,(sweep-Math.min(sweep,limit))/(2*sweep)*100),duration=columns*speed;
  style.textContent='@keyframes selected-orbit{from{transform:'+turn(-sweep)+'}to{transform:'+turn(sweep)+'}0%,'+hide+'%,'+(100-hide)+'%,100%{visibility:hidden}'+(hide+.001)+'%,'+(100-hide-.001)+'%{visibility:visible}}';
  const fragment=document.createDocumentFragment();
  for(let t=0;t<columns;t++){
   const tile=document.createElement('div');tile.className='tilted-tile';
   Object.assign(tile.style,{left:'calc(50% - '+u(aspect/2)+')',top:'calc('+axis+'% - '+u(.5)+')',width:u(aspect),height:u(1),animationName:'selected-orbit',animationDuration:duration+'s',animationDelay:-t*speed+'s'});
   const first=columns-1-t,share=aspect/SLICES;
   for(let k=0;k<SLICES;k++){
    const slice=document.createElement('div');slice.className='tilted-slice';
    Object.assign(slice.style,{left:u((aspect-share)/2),width:k===SLICES-1?u(share):'calc('+u(share)+' + 1px)',height:u(1),transform:turn((aspect/2-(k+.5)*share)*unit)});
    if(k===0)slice.style.borderRadius='10px 0 0 10px';if(k===SLICES-1)slice.style.borderRadius='0 10px 10px 0';
    const image=document.createElement('img');image.src=images[first%images.length];image.alt='';image.draggable=false;
    Object.assign(image.style,{left:u(-k*share),width:u(aspect),height:u(1)});
    slice.append(image);tile.append(slice);
   }
   tile.addEventListener('animationiteration',event=>{if(event.target!==tile)return;const index=(Math.round(event.elapsedTime/duration)*columns+first)%images.length;tile.querySelectorAll('img').forEach(image=>{if(!image.src.endsWith(images[index]))image.src=images[index]});});
   fragment.append(tile);
  }
  band.replaceChildren(fragment);band.classList.add('ready');
 }
 const resize=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;layout(width,height)});resize.observe(hero);
})();
