const progress=document.querySelector('.reading-progress');
let scheduled=false;function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';scheduled=false;}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
const viewer=document.querySelector('#image-viewer'),picture=document.querySelector('#viewer-image'),title=document.querySelector('#viewer-title'),scrollArea=document.querySelector('.viewer-scroll'),fitButton=document.querySelector('#fit-toggle');
let openedBy;function closeViewer(){viewer.close();}
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{openedBy=button;picture.src=button.dataset.zoom;picture.alt=button.dataset.title;title.textContent=button.dataset.title;scrollArea.classList.remove('actual');fitButton.setAttribute('aria-pressed','false');fitButton.textContent='ขนาดจริง';viewer.showModal();document.body.classList.add('viewer-open');scrollArea.scrollTo(0,0);}));
document.querySelector('#close-viewer').addEventListener('click',closeViewer);
viewer.addEventListener('close',()=>{document.body.classList.remove('viewer-open');openedBy?.focus({preventScroll:true})});
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeViewer()}});
fitButton.addEventListener('click',()=>{const actual=scrollArea.classList.toggle('actual');fitButton.setAttribute('aria-pressed',String(actual));fitButton.textContent=actual?'พอดีจอ':'ขนาดจริง';});
