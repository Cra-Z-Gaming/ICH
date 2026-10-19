/* ==========================================================================
 * Early anti-lag preference, applied before first paint.
 * ========================================================================== */
try{
  if(localStorage.getItem('vch.antiLag')==='1'){
    document.documentElement.classList.add('anti-lag');
  }
}catch(_){}
