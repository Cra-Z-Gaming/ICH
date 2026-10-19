/* Discord-inspired left app rail.  It is local navigation only: no Discord
 * account, server, invite, paid perk, or external service is involved. */
'use strict';

const DiscordRail=(function(){
  const rail=()=>document.getElementById('vchRail');
  function isOn(){return typeof DiscordLook!=='undefined'&&DiscordLook.on()}
  function setActive(key){
    const root=rail();if(!root)return;
    root.querySelectorAll('[data-rail]').forEach(b=>b.classList.toggle('active',b.dataset.rail===key));
  }
  function sync(){
    const root=rail();if(!root||!ME)return;
    let active='dms';
    if(view.page==='homePage')active='home';
    else if(view.mode==='global')active=view.section==='rooms'?'rooms':(view.section==='announcements'?'announcements':'global');
    setActive(active);
    const dm=document.getElementById('railDmBadge'),ann=document.getElementById('railAnnBadge');
    const d=DB.unreadDMs(ME.id),a=DB.unreadAnnouncements(ME.id);
    if(dm){dm.textContent=d>99?'99+':d;dm.classList.toggle('hidden',!d)}
    if(ann){ann.textContent=a>99?'99+':a;ann.classList.toggle('hidden',!a)}
  }
  function open(key){
    if(!isOn())return;
    if(key==='dms')openChat('dms');
    else if(key==='global')openChat('global','global');
    else if(key==='rooms')openChat('global','rooms');
    else if(key==='announcements')openChat('global','announcements');
    else if(key==='hubs')modalGameHubs();
    else if(key==='home'){view.roomKey=null;view.section=null;DB.watchMessages(null);goHome(true)}
    else if(key==='settings')openSettings(true);
    sync();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('#vchRail [data-rail]');if(b)open(b.dataset.rail);
  });
  return{sync,setActive};
})();
