/* Account-only Terms of Service gate. This module intentionally makes no IP,
 * VPN, proxy, Tor, browser-fingerprint, or connection-information requests. */
'use strict';
const TOS_GATE={accepted:null};
let TOS_STATE=null;
const TOS_DECLINE_KEY='ich-vus.tosDeclined';

function tosDeclinedThisSession(){try{return sessionStorage.getItem(TOS_DECLINE_KEY)==='1'}catch(_){return false}}
function chatBlockReason(){
  return TOS_GATE.accepted===true?null:(TOS_GATE.accepted===null?'Checking your account…':'Accept the Terms of Service to chat. Everything else remains available.');
}
async function tosGateGuard(){const reason=chatBlockReason();if(reason)throw new Error(reason)}
function ipBanActive(){return false} // compatibility with the legacy ban UI; no network ban exists.
function tosUiSync(){if(typeof renderChat==='function')try{renderChat()}catch(_){}}
function tosBannerSync(reason){
  let b=$('#tosBanner');
  if(!reason){if(b)b.remove();return}
  if(!b){b=document.createElement('div');b.id='tosBanner';b.className='banned-banner';document.body.appendChild(b)}
  b.innerHTML='<span>'+esc(reason)+'</span><button class="btn small" id="tosBannerBtn" type="button">Read &amp; accept</button>';
  $('#tosBannerBtn').onclick=()=>modalTos({});
}
async function tosLoadState(id){
  try{const sn=await get(R('tosAccepted/'+id));TOS_STATE=sn.val();TOS_GATE.accepted=!!(TOS_STATE&&Number(TOS_STATE.v)>=CFG.TOS_VERSION)}
  catch(_){TOS_STATE=null;TOS_GATE.accepted=false}
}
async function tosAccept(){
  if(!ME)throw new Error('Sign in first.');
  const rec={v:CFG.TOS_VERSION,at:Date.now()+SKEW};
  await set(R('tosAccepted/'+ME.id),rec);
  TOS_STATE=rec;TOS_GATE.accepted=true;
}
function modalTos(){
  const root=$('#modalRoot');if(!root)return;
  const accepted=TOS_GATE.accepted===true;
  root.innerHTML='<div class="modal-bg" id="tosBg"><div class="modal rules-modal" role="dialog" aria-modal="true" aria-label="Terms of Service">'
    +'<button class="modal-x" id="tosX" type="button">✕</button><h2>Terms of Service</h2>'
    +'<div class="rules-list"><div class="rule"><b>Be respectful</b><p>No harassment, threats, spam, or impersonation.</p></div>'
    +'<div class="rule"><b>Keep it safe</b><p>Do not post illegal, sexual, or harmful content.</p></div>'
    +'<div class="rule"><b>Account moderation</b><p>Accounts may be muted or banned for breaking these rules.</p></div>'
    +'<div class="rule"><b>Your privacy</b><p>This app does not collect or check your IP address, VPN, proxy, or network identity.</p></div></div>'
    +(accepted?'<button class="rules-ok" id="tosClose" type="button">Close</button>':'<label class="rules-agree"><input type="checkbox" id="tosChk"> I have read and agree to these terms.</label><div class="tos-err" id="tosErr"></div><button class="rules-ok" id="tosOk" type="button" disabled>Accept &amp; allow chat</button>')
    +'</div></div>';
  const close=()=>{root.innerHTML='';tosUiSync()};
  $('#tosX').onclick=close;$('#tosBg').onclick=e=>{if(e.target.id==='tosBg')close()};
  if(accepted){$('#tosClose').onclick=close;return}
  const chk=$('#tosChk'),ok=$('#tosOk'),err=$('#tosErr');chk.onchange=()=>{ok.disabled=!chk.checked};
  ok.onclick=async()=>{ok.disabled=true;try{await tosAccept();close()}catch(e){err.textContent=e&&e.message||'Could not save your acceptance.';ok.disabled=false}};
}
function tosStart(){
  let previous=null;
  setInterval(async()=>{
    const id=(typeof ME!=='undefined'&&ME)?ME.id:null;
    if(id===previous)return;previous=id;
    if(id==null){TOS_GATE.accepted=null;TOS_STATE=null;tosUiSync();return}
    await tosLoadState(id);tosUiSync();
    if(TOS_GATE.accepted===false&&!tosDeclinedThisSession())modalTos();
  },500);
}
tosStart();
