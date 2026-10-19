/* ==========================================================================
 * js/settings/anti-lag.js
 * Anti-lag mode (saved to the account)
 * ========================================================================== */
'use strict';

const AntiLag=(function(){
  const KEY='vch.antiLag',de=document.documentElement;
  let migrated=false;
  function on(){return de.classList.contains('anti-lag')}
  function apply(v){
    v=!!v;if(on()===v)return;
    de.classList.add('al-switch');
    requestAnimationFrame(()=>{
      de.classList.toggle('anti-lag',v);
      requestAnimationFrame(()=>requestAnimationFrame(()=>de.classList.remove('al-switch')));
    });
  }
  function cache(v){try{localStorage.setItem(KEY,v?'1':'0')}catch(_){}}
  function set(v){
    v=!!v;cache(v);apply(v);
    if(typeof ME!=='undefined'&&ME&&ME.id!=null)DB.setSettingKey(ME.id,'antiLag',v).catch(()=>{});
  }
  function sync(){
    if(typeof ME==='undefined'||!ME||!ME.settings)return;
    const v=ME.settings.antiLag;
    if(typeof v==='boolean'){
      if(v!==on()){cache(v);apply(v)}
    }else if(on()&&!migrated){
      migrated=true;DB.setSettingKey(ME.id,'antiLag',true).catch(()=>{});
    }
  }
  window.addEventListener('storage',e=>{if(e.key===KEY)apply(e.newValue==='1')});
  return{on,set,sync};
})();

/* Optional Discord-inspired visual layout. This changes only this app's UI;
   it has no Discord account, server, invite, or external integration. */
const DiscordLook=(function(){
  const KEY='vch.discordLook',de=document.documentElement;
  function on(){return de.classList.contains('discord-look')}
  function apply(v){
    de.classList.toggle('discord-look',!!v);
    if(typeof DiscordRail!=='undefined')DiscordRail.sync();
  }
  function set(v){
    v=!!v;apply(v);
    try{localStorage.setItem(KEY,v?'1':'0')}catch(_){}
    if(typeof ME!=='undefined'&&ME&&ME.id!=null)DB.setSettingKey(ME.id,'discordLook',v).catch(()=>{});
  }
  function sync(){
    if(typeof ME==='undefined'||!ME||!ME.settings)return;
    const v=ME.settings.discordLook;
    if(typeof v==='boolean')apply(v);
  }
  window.addEventListener('storage',e=>{if(e.key===KEY)apply(e.newValue==='1')});
  return{on,set,sync};
})();
