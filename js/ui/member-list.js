/* Right-hand member list for the optional Discord-inspired layout. */
'use strict';

const MemberList=(function(){
  let showOffline=false,offlineLimit=80;
  const groups=[
    {key:'owner',label:'Owner',icon:'👑',match:u=>isOwner(u.id)},
    {key:'admin',label:'Admin',icon:'🛡️',match:u=>isAdmin(u.id)},
    {key:'mod',label:'Moderator',icon:'🛠️',match:u=>isMod(u.id)},
    {key:'member',label:'Members',icon:'',match:u=>!isOwner(u.id)&&!isAdmin(u.id)&&!isMod(u.id)}
  ];
  const byName=(a,b)=>String(a.username||'').localeCompare(String(b.username||''),undefined,{sensitivity:'base'});
  function row(u,online){
    const mine=ME&&u.id===ME.id;
    return `<button type="button" class="vch-member${online?'':' off'}" data-member="${u.id}" title="View ${esc(displayUsername(u.username))}'s profile">
      <span class="vch-member-av">${avatarHtml(u,u.username,'width:32px;height:32px;font-size:13px')}<i class="vch-member-dot${online?'':' off'}"></i></span>
      <span class="vch-member-name">${esc(displayUsername(u.username))}${mine?'<small>you</small>':''}</span>
    </button>`;
  }
  function render(){
    const root=document.getElementById('vchMembersList'),count=document.getElementById('vchMemberCount');
    if(!root||!ME)return;
    const users=DB.allUsers().filter(u=>u&&u.username&&!u.deleted);
    const online=new Set(DB.onlineIds());
    const onlineCount=users.filter(u=>online.has(u.id)).length;
    if(count)count.textContent=onlineCount+' online';
    let html='';let remainingOffline=0;
    groups.forEach(g=>{
      const people=users.filter(g.match).sort((a,b)=>Number(online.has(b.id))-Number(online.has(a.id)||0)||byName(a,b));
      const on=people.filter(u=>online.has(u.id)),off=people.filter(u=>!online.has(u.id));
      const visible=showOffline?off.slice(0,offlineLimit):[];
      remainingOffline+=Math.max(0,off.length-visible.length);
      if(!on.length&&!visible.length)return;
      html+=`<div class="vch-member-group ${g.key}">${g.icon?g.icon+' ':''}${g.label} — ${on.length}${off.length?' · '+off.length+' offline':''}</div>`;
      html+=on.map(u=>row(u,true)).join('')+visible.map(u=>row(u,false)).join('');
    });
    if(!html)html='<div class="vch-members-empty">No members available yet.</div>';
    const offlineTotal=users.length-onlineCount;
    if(offlineTotal){
      if(!showOffline)html+=`<button type="button" class="vch-member-toggle" id="vchOfflineToggle">▸ Show offline (${offlineTotal})</button>`;
      else {
        if(remainingOffline)html+=`<button type="button" class="vch-member-toggle" id="vchMoreMembers">Show ${Math.min(80,remainingOffline)} more</button>`;
        html+=`<button type="button" class="vch-member-toggle subtle" id="vchOfflineToggle">▾ Hide offline</button>`;
      }
    }
    root.innerHTML=html;
    root.querySelectorAll('[data-member]').forEach(b=>b.onclick=()=>openUserProfile(Number(b.dataset.member)));
    const toggle=document.getElementById('vchOfflineToggle');
    if(toggle)toggle.onclick=()=>{showOffline=!showOffline;offlineLimit=80;render()};
    const more=document.getElementById('vchMoreMembers');
    if(more)more.onclick=()=>{offlineLimit+=80;render()};
  }
  return{render};
})();
