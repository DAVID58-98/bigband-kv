/* =========================================================
   snih.js — vánoční sněžení pro bigbandkv.cz (verze 1)
   Načítá ho jen malý skript v <head>, a to pouze od 1. 12. do 15. 1.
   (nebo při testu s ?vanoce=1). Mimo sezónu se soubor nestahuje.
   Jemné sněžení (stejné jako na webech souborů) + vítr od prstu / kurzoru,
   bílé vločky s tenkým červeným okrajem v barvě webu (#9b2636),
   tlačítko „Sníh: zapnuto / vypnuto“ (pamatuje si volbu).
   Při „omezit pohyb“ v systému se nic nespustí.
   ========================================================= */
(function(){
'use strict';
var root=document.documentElement;
if(!root.classList.contains('xmas'))return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var TAU=Math.PI*2,EDGE='rgba(155,38,54,.6)';
var LANG=(root.lang||'cs').slice(0,2);
var LAB={cs:['Sníh: zapnuto','Sníh: vypnuto'],en:['Snow: on','Snow: off'],de:['Schnee: an','Schnee: aus']}[LANG]||['Sníh: zapnuto','Sníh: vypnuto'];

var css='#bbSnow{position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;pointer-events:none;z-index:55}'+
'.bb-snowbtn{position:fixed;right:14px;bottom:14px;z-index:70;display:inline-flex;align-items:center;gap:8px;font:600 13px var(--body,"Josefin Sans",sans-serif);letter-spacing:.04em;color:var(--wine,#4c1828);background:rgba(246,242,232,.95);border:1px solid var(--line,rgba(124,97,77,.21));border-radius:100px;padding:10px 15px;cursor:pointer;box-shadow:0 10px 26px -16px rgba(76,24,40,.45);min-height:44px}'+
'.bb-snowbtn[aria-pressed="false"]{opacity:.7}'+
'.bb-snowbtn:focus-visible{outline:2px solid var(--red,#9b2636);outline-offset:3px}'+
'@media (max-width:600px){.bb-snowbtn{width:46px;height:46px;padding:0;justify-content:center;font-size:18px;right:12px;bottom:12px}.bb-snowbtn .t{display:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var on=true;try{on=localStorage.getItem('bb-snow')!=='off';}catch(e){}
var cv,g,W=0,H=0,raf=0,last=0,F=[],btn;
var P={x:-999,y:-999,t:-99},WIND_R=90;
function ptr(x,y){P.x=x;P.y=y;P.t=performance.now();}
function size(){var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=Math.max(cv.getBoundingClientRect().height,innerHeight);cv.width=Math.round(W*d);cv.height=Math.round(H*d);g.setTransform(d,0,0,d,0,0);}
function nf(f,top){f.x=Math.random()*W;f.y=top?-6:Math.random()*H;f.r=.8+Math.random()*2.6;f.v=.35+Math.random()*1.1;f.a=Math.random()*TAU;f.w=.008+Math.random()*.02;f.o=.35+Math.random()*.6;f.vx=0;f.vy=0;return f;}
function seed(){F=[];var n=W<700?46:110;for(var i=0;i<n;i++)F.push(nf({},false));}
function label(){var t=on?LAB[0]:LAB[1];btn.setAttribute('aria-pressed',String(on));btn.setAttribute('aria-label',t);btn.querySelector('.t').textContent=t;}

function frame(ms){
  raf=0;if(document.hidden||!on){g.clearRect(0,0,W,H);last=0;return;}
  var t=ms/1000,dt=Math.min(.05,Math.max(.001,t-(last||t))),k=dt*60,wind=performance.now()-P.t<1400;last=t;
  g.clearRect(0,0,W,H);g.fillStyle='#fff';g.strokeStyle=EDGE;g.lineWidth=1;
  for(var i=0;i<F.length;i++){var f=F[i];
    if(wind){var dx=f.x-P.x,dy=f.y-P.y,d=Math.hypot(dx,dy);if(d<WIND_R&&d>.1){var p=(1-d/WIND_R)*14*k;f.vx+=dx/d*p;f.vy+=dy/d*p;}}
    f.a+=f.w*k;f.y+=(f.v+f.vy*.05)*k;f.x+=(Math.sin(f.a)*.6+f.vx*.05)*k;f.vx*=Math.pow(.93,k);f.vy*=Math.pow(.9,k);
    if(f.y>H+6||f.y<-30||f.x<-30||f.x>W+30){nf(f,true);continue;}
    g.globalAlpha=f.o;g.beginPath();g.arc(f.x,f.y,f.r,0,TAU);g.fill();g.stroke();
  }
  g.globalAlpha=1;raf=requestAnimationFrame(frame);
}
function wake(){if(!raf&&!document.hidden&&on){last=0;raf=requestAnimationFrame(frame);}}

function start(){
  cv=document.createElement('canvas');cv.id='bbSnow';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);g=cv.getContext('2d');
  size();seed();
  btn=document.createElement('button');btn.type='button';btn.className='bb-snowbtn';btn.innerHTML='<span aria-hidden="true">&#10052;</span><span class="t"></span>';
  btn.addEventListener('click',function(){on=!on;try{localStorage.setItem('bb-snow',on?'on':'off');}catch(e){}label();if(on){seed();wake();}});
  document.body.appendChild(btn);label();
  addEventListener('pointermove',function(e){if(e.pointerType==='mouse'||e.pressure>0)ptr(e.clientX,e.clientY);},{passive:true});
  addEventListener('pointerdown',function(e){ptr(e.clientX,e.clientY);},{passive:true});
  addEventListener('touchmove',function(e){var q=e.touches&&e.touches[0];if(q)ptr(q.clientX,q.clientY);},{passive:true});
  var lw=innerWidth;addEventListener('resize',function(){size();if(innerWidth!==lw){lw=innerWidth;seed();}});
  document.addEventListener('visibilitychange',wake);
  wake();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
