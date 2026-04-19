// ── SKIN EDITOR ────────────────────────────────────────────────────────────
function buildSwatches(id, part, colors){
  const el=document.getElementById(id);
  el.innerHTML='';
  colors.forEach(c=>{
    const d=document.createElement('div');
    d.className='sw'+(skinData[part]===c?' on':'');
    d.style.background=c;
    d.title=c;
    d.addEventListener('click',()=>{
      skinData[part]=c;
      el.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));
      d.classList.add('on');
      renderSkinPreview();
    });
    el.appendChild(d);
  });
  // custom color input
  const inp=document.createElement('input');
  inp.type='color';inp.value=skinData[part];
  inp.style.cssText='width:24px;height:24px;border:2px solid #555;padding:0;cursor:pointer;background:none;border-radius:2px;';
  inp.title='Tùy chỉnh màu';
  inp.addEventListener('input',()=>{
    skinData[part]=inp.value;
    el.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));
    renderSkinPreview();
  });
  el.appendChild(inp);
}
function renderSkinPreview(){
  const pc=document.getElementById('skin-preview-c');
  if(!pc)return;
  const pc2=pc.getContext('2d');
  pc2.clearRect(0,0,pc.width,pc.height);
  pc2.imageSmoothingEnabled=false;
  const W2=pc.width,H2=pc.height;
  const sk=skinData||{};
  const faceColor=sk.face||'#F5C8A0';
  const shirtColor=sk.shirt||faceColor;
  const pantsColor=sk.pants||faceColor;
  const shoeColor=sk.shoe||'#2A1808';
  pc2.fillStyle='rgba(20,20,40,0.0)';pc2.fillRect(0,0,W2,H2);
  const cx=W2/2|0, baseY=20;
  const headW=18,headH=16,bodyW=14,bodyH=18,armW=6,armLen=17,legW=6,legLen=19,shoeH=4;
  pc2.fillStyle='rgba(0,0,0,0.2)';pc2.fillRect(cx-10,baseY+headH+bodyH+legLen+shoeH,20,4);
  pc2.save();pc2.translate(cx-bodyW/2,baseY+headH+4);pc2.rotate(-0.25);
  pc2.fillStyle=shirtColor;pc2.fillRect(-armW/2,0,armW,armLen);pc2.fillStyle=faceColor;pc2.fillRect(-armW/2,armLen-4,armW,4);
  pc2.restore();
  pc2.save();pc2.translate(cx-4,baseY+headH+bodyH);pc2.rotate(0.1);
  pc2.fillStyle=pantsColor;pc2.fillRect(-legW/2,0,legW,legLen);pc2.fillStyle=shoeColor;pc2.fillRect(-legW/2,legLen-4,legW,4);
  pc2.restore();
  pc2.save();pc2.translate(cx+4,baseY+headH+bodyH);pc2.rotate(-0.1);
  pc2.fillStyle=pantsColor;pc2.fillRect(-legW/2,0,legW,legLen);pc2.fillStyle=shoeColor;pc2.fillRect(-legW/2,legLen-4,legW,4);
  pc2.restore();
  pc2.fillStyle=shirtColor;pc2.fillRect(cx-bodyW/2,baseY+headH,bodyW,bodyH);
  pc2.save();pc2.translate(cx+bodyW/2,baseY+headH+4);pc2.rotate(0.2);
  pc2.fillStyle=shirtColor;pc2.fillRect(-armW/2,0,armW,armLen);pc2.fillStyle=faceColor;pc2.fillRect(-armW/2,armLen-4,armW,4);
  pc2.restore();
  pc2.save();pc2.translate(cx,baseY+headH/2);
  pc2.fillStyle=faceColor;pc2.fillRect(-headW/2,-headH/2,headW,headH);
  pc2.restore();
}
function renderSkinPreviewTo(pc2,W2,H2){
  pc2.clearRect(0,0,W2,H2);
  const sk=skinData||{};
  const faceColor=sk.face||'#F5C8A0';
  const shirtColor=sk.shirt||faceColor;
  const pantsColor=sk.pants||faceColor;
  const shoeColor=sk.shoe||'#2A1808';
  const cx=W2/2|0,baseY=4;
  const headW=10,headH=9,bodyW=8,bodyH=10,armW=3,armLen=10,legW=3,legLen=11,shoeH=2;
  pc2.fillStyle=pantsColor;pc2.fillRect(cx-4,baseY+headH+bodyH,legW,legLen);pc2.fillRect(cx+1,baseY+headH+bodyH,legW,legLen);
  pc2.fillStyle=shoeColor;pc2.fillRect(cx-4,baseY+headH+bodyH+legLen-shoeH,legW,shoeH);pc2.fillRect(cx+1,baseY+headH+bodyH+legLen-shoeH,legW,shoeH);
  pc2.fillStyle=shirtColor;pc2.fillRect(cx-bodyW/2,baseY+headH,bodyW,bodyH);
  pc2.fillStyle=shirtColor;pc2.fillRect(cx-bodyW/2-armW,baseY+headH+2,armW,armLen);pc2.fillRect(cx+bodyW/2,baseY+headH+2,armW,armLen);
  pc2.fillStyle=faceColor;pc2.fillRect(cx-headW/2,baseY,headW,headH);
}
function buildPresets(){
  const el=document.getElementById('skin-presets');
  el.innerHTML='';
  SKIN_PRESETS.forEach(p=>{
    const btn=document.createElement('button');
    btn.className='preset-btn';
    // tiny preview canvas inside button
    const pc=document.createElement('canvas');
    pc.width=28;pc.height=50;pc.style.cssText='image-rendering:pixelated;width:28px;height:50px;';
    btn.appendChild(pc);
    const lbl=document.createElement('div');lbl.textContent=p.name;btn.appendChild(lbl);
    btn.addEventListener('click',()=>{
      Object.assign(skinData,p);
      buildSwatches('sw-face','face',SKIN_PALETTES.face);
      buildSwatches('sw-shirt','shirt',SKIN_PALETTES.shirt);
      buildSwatches('sw-pants','pants',SKIN_PALETTES.pants);
      buildSwatches('sw-shoe','shoe',SKIN_PALETTES.shoe);
      renderSkinPreview();
    });
    el.appendChild(btn);
    // draw tiny preset preview
    const pc2=pc.getContext('2d');pc2.imageSmoothingEnabled=false;
    const old=Object.assign({},skinData);
    Object.assign(skinData,p);
    renderSkinPreviewTo(pc2,28,50);
    Object.assign(skinData,old);
  });
}
function showSkinScreen(){
  document.getElementById('menu-overlay').style.display='none';
  document.getElementById('skin-screen').style.display='flex';
  skinData={face:'#FFFFFF',hair:'#FFFFFF',eye:'#FFFFFF',shirt:'#FFFFFF',pants:'#FFFFFF',shoe:'#FFFFFF'};
  buildSwatches('sw-face','face',SKIN_PALETTES.face);
  buildSwatches('sw-shirt','shirt',SKIN_PALETTES.shirt);
  buildSwatches('sw-pants','pants',SKIN_PALETTES.pants);
  buildSwatches('sw-shoe','shoe',SKIN_PALETTES.shoe);
  buildPresets();
  renderSkinPreview();
}
function hideSkinScreen(){
  document.getElementById('skin-screen').style.display='none';
  document.getElementById('menu-overlay').style.display='flex';
}
function refreshControlModeButtons(){
  const pcBtn=document.getElementById('btn-control-pc');
  const mobileBtn=document.getElementById('btn-control-mobile');
  if(pcBtn) pcBtn.classList.toggle('active', controlMode==='pc');
  if(mobileBtn) mobileBtn.classList.toggle('active', controlMode==='mobile');
  const note=document.getElementById('control-mode-note');
  if(note){
    note.textContent = t('deviceNote') + ' ' + (lang==='en' ? 'Current mode: ' : 'Chế độ hiện tại: ') + (controlMode==='mobile' ? 'Mobile' : 'PC');
  }
}

// ── ONLINE MULTIPLAYER ───────────────────────────────────────────────────
let peer = null;
let onlineMode = null; // 'host' | 'guest' | null
let guestConns = [];   // host side: all guest connections
let hostConn  = null;  // guest side: connection to host
let remotePlayersState = {}; // peerID -> state object
let lastSyncTime = 0;
const SYNC_INTERVAL = 50; // ms

function setOnlineStatus(msg, cls){
  const el = document.getElementById('online-status');
  if(el){ el.textContent = msg; el.className = cls || 'online-info'; }
}

function broadcastToAll(data){
  const str = JSON.stringify(data);
  if(onlineMode === 'host'){
    guestConns.forEach(c => { try{ c.send(str); }catch(e){} });
  } else if(onlineMode === 'guest' && hostConn){
    try{ hostConn.send(str); }catch(e){}
  }
}

function handleRemoteMsg(raw, fromId){
  let data;
  try{ data = typeof raw === 'string' ? JSON.parse(raw) : raw; }catch(e){ return; }
  if(data.type === 'init'){
    // Guest receives world from host
    for(let i=0;i<data.world.length;i++) world[i]=data.world[i];
    for(let x=0;x<WW;x++) for(let y=0;y<WH;y++) if(solid(x,y)){heightMap[x]=y;break;}
    player.x=data.px; player.y=data.py; player.vy=0;
    cam.x=player.x-W/2; cam.y=player.y-H/2;
    setOnlineStatus('Da ket noi! Chuc vui!','online-ok');
  } else if(data.type === 'state'){
    remotePlayersState[fromId] = data;
  } else if(data.type === 'block'){
    setB(data.x, data.y, data.t);
    // Re-broadcast from host to other guests
    if(onlineMode === 'host'){
      guestConns.forEach(c => { if(c.peer!==fromId) try{c.send(JSON.stringify(data));}catch(e){} });
    }
  } else if(data.type === 'leave'){
    delete remotePlayersState[fromId];
  }
}

function sendState(){
  if(!onlineMode) return;
  const now = performance.now();
  if(now - lastSyncTime < SYNC_INTERVAL) return;
  lastSyncTime = now;
  const state = {
    type:'state', x:player.x, y:player.y, facing:player.facing,
    walkCycle:walkCycle, walkAmp:walkAmp, health:player.health,
    held:inv[hotIdx]?inv[hotIdx].key:null,
    name:playerName, skin:skinData
  };
  broadcastToAll(state);
}

function updateGuestList(){
  const el = document.getElementById('guest-list');
  if(!el) return;
  const n = guestConns.length;
  el.textContent = n > 0 ? n + ' nguoi choi da tham gia' : 'Dang cho...';
}

function initPeer(onReady){
  if(peer && !peer.destroyed){ onReady && onReady(peer.id); return; }
  peer = new Peer();
  peer.on('open', id => { onReady && onReady(id); });
  peer.on('error', err => {
    setOnlineStatus('Loi: ' + err.type, 'online-err');
  });
}

function createRoom(){
  setOnlineStatus('Dang khoi tao...','online-info');
  initPeer(id => {
    onlineMode = 'host';
    document.getElementById('room-id-val').textContent = id;
    document.getElementById('room-id-box').style.display = 'block';
    setOnlineStatus('Phong da tao. Chia se ID cho ban be!','online-ok');
    // Listen for guests
    peer.on('connection', conn => {
      conn.on('open', () => {
        guestConns.push(conn);
        updateGuestList();
        // Send world to new guest
        const initMsg = JSON.stringify({
          type:'init',
          world: Array.from(world),
          px: spawnBX*BS-13,
          py: spawnBY*BS,
        });
        conn.send(initMsg);
      });
      conn.on('data', raw => handleRemoteMsg(raw, conn.peer));
      conn.on('close', () => {
        guestConns = guestConns.filter(c => c !== conn);
        delete remotePlayersState[conn.peer];
        updateGuestList();
      });
    });
    // Start game as host
    startOnlineGame();
  });
}

function joinRoom(hostId){
  if(!hostId){ setOnlineStatus('Hay nhap ID phong!','online-err'); return; }
  setOnlineStatus('Dang ket noi...','online-info');
  initPeer(() => {
    onlineMode = 'guest';
    hostConn = peer.connect(hostId.trim());
    hostConn.on('open', () => {
      setOnlineStatus('Da ket noi! Dang tai the gioi...','online-ok');
    });
    hostConn.on('data', raw => handleRemoteMsg(raw, hostConn.peer));
    hostConn.on('close', () => {
      setOnlineStatus('Mat ket noi!','online-err');
      onlineMode = null;
    });
    // Start game (world comes via 'init' message)
    startOnlineGame();
  });
}

function startOnlineGame(){
  document.getElementById('online-screen').style.display = 'none';
  inv.fill(null); drops.length=0; particles.length=0;
  entities.length=0; remotePlayersState={};
  if(onlineMode === 'host'){
    generateWorld(); initPlayerSpawn();
    player.health=player.maxHealth; player.hunger=player.maxHunger;
    player.isDead=false; dayT=0.35;
    addItem('WOOD_PICK',1); addItem('TORCH',8); addItem('BREAD',3);
  } else {
    // Guest: world will arrive via 'init', just spawn temporarily
    player.health=player.maxHealth; player.hunger=player.maxHunger;
    player.isDead=false;
  }
  document.getElementById('hints').style.display='block';
  gameState='playing';
}

function drawRemotePlayers(){
  for(const [pid, st] of Object.entries(remotePlayersState)){
    if(!st || st.x===undefined) continue;
    const rx=st.x-cam.x, ry=st.y-cam.y;
    if(rx<-80||rx>W+80||ry<-80||ry>H+80) continue;
    const fw=st.facing||1;
    const phase=st.walkCycle||0;
    const amp=st.walkAmp||0;
    const bob=Math.abs(Math.sin(phase*2))*amp*2.2;
    const cx=rx+13, baseY=ry+bob;
    const sk=st.skin||{face:'#F5C8A0',shirt:'#4080C0',pants:'#2A3A60',shoe:'#2A1808'};
    const wk=Math.sin(phase)*0.78*amp;
    const armLen=17, legLen=19;
    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(cx-9,baseY+53,18,4);
    // Legs
    ctx.save();ctx.translate(cx-4,baseY+36);ctx.rotate(wk);
    ctx.fillStyle=sk.pants;ctx.fillRect(-3,0,6,legLen-4);
    ctx.fillStyle=sk.shoe;ctx.fillRect(-3,legLen-4,6,4); ctx.restore();
    ctx.save();ctx.translate(cx+4,baseY+36);ctx.rotate(-wk);
    ctx.fillStyle=sk.pants;ctx.fillRect(-3,0,6,legLen-4);
    ctx.fillStyle=sk.shoe;ctx.fillRect(-3,legLen-4,6,4); ctx.restore();
    // Back arm
    ctx.save();ctx.translate(cx+(fw>0?-7:7),baseY+19);ctx.rotate(-wk);
    ctx.fillStyle=sk.shirt;ctx.fillRect(-3,0,6,armLen-4);
    ctx.fillStyle=sk.face;ctx.fillRect(-3,armLen-4,6,4); ctx.restore();
    // Body
    ctx.save();ctx.translate(cx,baseY+26);ctx.rotate(Math.sin(phase*2)*0.03*amp);ctx.translate(-cx,-(baseY+26));
    ctx.fillStyle=sk.shirt; ctx.fillRect(cx-7,baseY+17,14,18);
    // Head
    ctx.fillStyle=sk.face;  ctx.fillRect(cx-9,baseY,18,16);
    // Front arm
    ctx.save();ctx.translate(cx+(fw>0?7:-7),baseY+19);ctx.rotate(wk);
    ctx.fillStyle=sk.shirt;ctx.fillRect(-3,0,6,armLen-4);
    ctx.fillStyle=sk.face;ctx.fillRect(-3,armLen-4,6,4); ctx.restore();
    // Name tag
    const name=st.name||'Player';
    ctx.font='bold 10px "Courier New"';
    const tw=ctx.measureText(name).width;
    ctx.fillStyle='rgba(0,0,0,0.78)';
    ctx.fillRect(cx-tw/2-4,baseY-18,tw+8,14);
    ctx.fillStyle='#88DDFF';
    ctx.fillText(name,cx-tw/2,baseY-7);
    ctx.restore();
  }
}

function showOnlineScreen(){
  document.getElementById('menu-overlay').style.display='none';
  document.getElementById('online-screen').style.display='flex';
  const ni=document.getElementById('online-name-input');
  if(ni) ni.value=playerName;
  setOnlineStatus('','');
}
function hideOnlineScreen(){
  document.getElementById('online-screen').style.display='none';
  document.getElementById('menu-overlay').style.display='flex';
}
function showMainMenu(){platformChooserOpen=false;document.getElementById('menu-overlay').style.display='flex';document.getElementById('world-screen').style.display='none';document.getElementById('settings-screen').style.display='none';document.getElementById('credits-screen').style.display='none';document.getElementById('skin-screen').style.display='none';document.getElementById('online-screen').style.display='none';document.getElementById('pause-overlay').style.display='none';syncControlUI();}
function showWorldScreen(){document.getElementById('menu-overlay').style.display='none';const list=document.getElementById('world-list');list.innerHTML='';for(let i=0;i<MAX_SLOTS;i++){const has=hasSave(i);const info=getSaveInfo(i);const slot=document.createElement('div');slot.className='world-slot';const name=has?('Thế Giới '+(i+1)):('Ô Trống '+(i+1));const dateStr=info?new Date(info.time).toLocaleString('vi-VN'):'Chưa tạo';let delBtn='';if(has){delBtn='<div class="wdel" data-slot="'+i+'">Xóa</div>';}slot.innerHTML='<div><div class="wname">'+name+'</div><div class="winfo">'+dateStr+'</div></div>'+delBtn;slot.dataset.slot=i;slot.addEventListener('click',function(ev){if(ev.target.classList.contains('wdel')){ev.stopPropagation();const s=parseInt(ev.target.dataset.slot);if(confirm('Xóa thế giới này?')){deleteWorldSlot(s);showWorldScreen();}return;}const s=parseInt(this.dataset.slot);if(hasSave(s)){startGame(s);}else{createAndStart(s);}});list.appendChild(slot);}document.getElementById('world-screen').style.display='flex';}
function hideWorldScreen(){document.getElementById('world-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';syncControlUI();}
function showSettings(){document.getElementById('menu-overlay').style.display='none';document.getElementById('vol-slider').value=Math.round(masterVol*100);document.getElementById('vol-val').textContent=Math.round(masterVol*100);document.getElementById('day-slider').value=daySpeed;document.getElementById('day-val').textContent=daySpeed;const _si=document.getElementById('player-name-input');if(_si)_si.value=playerName;document.getElementById('settings-screen').style.display='flex';refreshControlModeButtons();}
function hideSettings(){masterVol=parseInt(document.getElementById('vol-slider').value)/100;daySpeed=parseInt(document.getElementById('day-slider').value);document.getElementById('vol-val').textContent=Math.round(masterVol*100);document.getElementById('day-val').textContent=daySpeed;saveSettings();document.getElementById('settings-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem('ps_settings'));if(s){masterVol=s.vol||0.6;daySpeed=s.daySpeed||3;if(s.lang)lang=s.lang;}}catch(e){} }
function showCredits(){document.getElementById('menu-overlay').style.display='none';document.getElementById('credits-screen').style.display='flex';}
function hideCredits(){document.getElementById('credits-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';}

function startGame(slot){currentSlot=slot;inv.fill(null);entities.length=0;drops.length=0;particles.length=0;craftGrid.fill(null);cursorItem=null;craftOpen=false;craftOutput=null;furnaceOpen=false;furnData.input=null;furnData.fuel=null;furnData.output=null;lmbDown=false;mineT=0;mineTarget=null;hungerTickTimer=3000+Math.random()*2000;document.getElementById('furnace-overlay').style.display='none';if(hasSave(slot)){loadWorld(slot);}else{generateWorld();initPlayerSpawn();player.health=player.maxHealth;player.hunger=player.maxHunger;player.isDead=false;dayT=0.35;addItem('WOOD_PICK',1);addItem('TORCH',8);addItem('BREAD',3);}document.getElementById('menu-overlay').style.display='none';document.getElementById('world-screen').style.display='none';document.getElementById('settings-screen').style.display='none';document.getElementById('credits-screen').style.display='none';document.getElementById('skin-screen').style.display='none';document.getElementById('online-screen').style.display='none';document.getElementById('pause-overlay').style.display='none';gameState='playing';syncControlUI();}
function createAndStart(slot){currentSlot=slot;generateWorld();initPlayerSpawn();inv.fill(null);entities.length=0;drops.length=0;particles.length=0;player.health=player.maxHealth;player.hunger=player.maxHunger;player.isDead=false;dayT=0.35;addItem('WOOD_PICK',1);addItem('TORCH',8);addItem('BREAD',3);document.getElementById('menu-overlay').style.display='none';document.getElementById('world-screen').style.display='none';gameState='playing';syncControlUI();try{saveWorld(slot);}catch(e){}}
function resumeGame(){gameState='playing';document.getElementById('pause-overlay').style.display='none';syncControlUI();}
function saveAndQuit(){if(currentSlot>=0){try{saveWorld(currentSlot);}catch(e){}}syncControlUI();}

document.getElementById('btn-play').addEventListener('click',function(){try{initAudio();}catch(e){}showWorldScreen();});
document.getElementById('btn-settings').addEventListener('click',function(){try{initAudio();}catch(e){}showSettings();});
const btnControlPc=document.getElementById('btn-control-pc');if(btnControlPc){btnControlPc.addEventListener('click',function(){saveControlMode('pc');refreshControlModeButtons();syncControlUI();});}
const btnControlMobile=document.getElementById('btn-control-mobile');if(btnControlMobile){btnControlMobile.addEventListener('click',function(){saveControlMode('mobile');refreshControlModeButtons();syncControlUI();});}
document.getElementById('btn-platform-pc').addEventListener('click',function(){choosePlatform('pc');});
document.getElementById('btn-platform-mobile').addEventListener('click',function(){choosePlatform('mobile');});
document.getElementById('btn-online').addEventListener('click',function(){try{initAudio();}catch(e){}showOnlineScreen();});
document.getElementById('btn-skin').addEventListener('click',function(){showSkinScreen();});
document.getElementById('btn-credits').addEventListener('click',function(){showCredits();});
document.getElementById('btn-back-world').addEventListener('click',function(){hideWorldScreen();});
document.getElementById('btn-create-world').addEventListener('click',function(){for(let i=0;i<MAX_SLOTS;i++){if(!hasSave(i)){createAndStart(i);return;}}alert(t('allSlotsFull'));});
document.getElementById('btn-back-settings').addEventListener('click',function(){hideSettings();});
const _btnLang=document.getElementById('btn-lang');if(_btnLang){_btnLang.addEventListener('click',function(){toggleLanguage();});}
document.getElementById('btn-back-credits').addEventListener('click',function(){hideCredits();});
// Player name input (settings)
const _pni=document.getElementById('player-name-input');
if(_pni){_pni.value=playerName;_pni.addEventListener('input',function(){playerName=this.value.trim()||'Steve';localStorage.setItem('ps_name',playerName);});}
document.getElementById('btn-back-online').addEventListener('click',function(){hideOnlineScreen();});
document.getElementById('btn-create-room').addEventListener('click',function(){
  playerName=document.getElementById('online-name-input').value.trim()||'Steve';
  localStorage.setItem('ps_name',playerName);
  createRoom();
});
document.getElementById('btn-join-room').addEventListener('click',function(){
  playerName=document.getElementById('online-name-input').value.trim()||'Steve';
  localStorage.setItem('ps_name',playerName);
  joinRoom(document.getElementById('join-id-input').value.trim());
});
document.getElementById('btn-copy-id').addEventListener('click',function(){
  const id=document.getElementById('room-id-val').textContent;
  navigator.clipboard.writeText(id).then(()=>{this.textContent='Da Sao Chep!';setTimeout(()=>this.textContent='Sao Chep ID',1500);});
});
document.getElementById('online-name-input').addEventListener('input',function(){
  playerName=this.value.trim()||'Steve';
  localStorage.setItem('ps_name',playerName);
});
document.getElementById('btn-save-skin').addEventListener('click',function(){saveSkin();const btn=this;btn.textContent=t('saved');setTimeout(()=>btn.textContent=t('saveSkin'),1200);});
document.getElementById('btn-back-skin').addEventListener('click',function(){hideSkinScreen();});
document.getElementById('btn-resume').addEventListener('click',function(){resumeGame();});
document.getElementById('btn-save-quit').addEventListener('click',function(){saveAndQuit();gameState='menu';document.getElementById('pause-overlay').style.display='none';showMainMenu();});
document.getElementById('furnace-close-btn').addEventListener('click',function(){closeFurnace();});
const mobileJoystick=document.getElementById('mobile-joystick');
if(mobileJoystick){
  mobileJoystick.addEventListener('pointerdown',onJoystickDown,{passive:false});
  mobileJoystick.addEventListener('pointermove',onJoystickMove,{passive:false});
  mobileJoystick.addEventListener('pointerup',onJoystickUp,{passive:false});
  mobileJoystick.addEventListener('pointercancel',onJoystickUp,{passive:false});
  mobileJoystick.addEventListener('lostpointercapture',resetJoystick,{passive:false});
}
const mobileJumpBtn=document.getElementById('btn-mobile-jump-left');
if(mobileJumpBtn){
  const doJump=(e)=>{e.preventDefault();e.stopPropagation();mobileJump();};
  mobileJumpBtn.addEventListener('pointerdown',doJump,{passive:false});
}
document.getElementById('furn-input').addEventListener('click',function(){furnaceClick('input');});
document.getElementById('furn-fuel').addEventListener('click',function(){furnaceClick('fuel');});
document.getElementById('furn-output').addEventListener('click',function(){furnaceClick('output');});
document.getElementById('vol-slider').addEventListener('input',function(){document.getElementById('vol-val').textContent=this.value;masterVol=this.value/100;});
document.getElementById('day-slider').addEventListener('input',function(){document.getElementById('day-val').textContent=this.value;daySpeed=parseInt(this.value);});

loadSettings();
applyLanguage();

let lastTime=0;
function gameLoop(timestamp){
  const dt=Math.min(timestamp-lastTime,50);lastTime=timestamp;
  if(gameState==='menu'){drawMenuBg();}
  else if(gameState==='playing'){
    dayT+=dt/1000/660;if(dayT>=1)dayT-=1;
    if(!player.isDead){
      hungerTickTimer-=dt;
      if(hungerTickTimer<=0){hungerTickTimer=3000+Math.random()*2000;if(Math.random()<1/3)player.hunger=Math.max(0,player.hunger-1);}
      if(player.hunger<=0)player.health=Math.max(0,player.health-dt*0.01);
      if(player.hunger>70&&player.health<player.maxHealth)player.health=Math.min(player.maxHealth,player.health+dt*0.005);
      if(player.health<=0){player.health=0;player.isDead=true;}}
    physicsStep(dt);
    if(Math.abs(player.vx)>0.1){walkCycle+=dt*0.016;walkAmp=Math.min(1,walkAmp+dt*0.008);}else{walkAmp=Math.max(0,walkAmp-dt*0.009);}
    if(!lmbDown)mineAmp=Math.max(0,mineAmp-dt*0.005);
    minePhase+=dt*0.011;
    clickArmKick=Math.max(0,clickArmKick-dt*0.006);
    // --- lean/bounce/bob updates ---
    const targetTilt=player.onGround?(player.vx*0.02+Math.sin(walkCycle*2)*walkAmp*0.015):0;
    bodyTilt+=(targetTilt-bodyTilt)*(1-Math.pow(0.001,dt/1000));
    // bounce on start/stop
    if(walkAmp>prevWalkAmp+0.05)moveBounce=0.28;
    if(walkAmp<prevWalkAmp-0.05&&prevWalkAmp>0.2)moveBounce=0.18;
    if(moveBounce>0)moveBounce=Math.max(0,moveBounce-dt*0.006);
    prevWalkAmp=walkAmp;
    // walking vertical bob
    walkBob=player.onGround?(Math.sin(walkCycle*2)*walkAmp*2.1+Math.sin(walkCycle*4+0.35)*walkAmp*0.25):0;
    // head pitch toward mouse (smooth)
    const headWorldX=player.x+player.w/2, headWorldY=player.y+8;
    const rawPitch=Math.atan2(mouseWY*BS-headWorldY, (mouseWX*BS-headWorldX)*player.facing);
    const clampedPitch=Math.max(-0.5,Math.min(0.55,rawPitch));
    headPitch+=(clampedPitch-headPitch)*(1-Math.pow(0.0001,dt/1000));
    if(isEating){eatTimer+=dt;if(eatTimer>=EAT_DUR){isEating=false;eatColor=null;}}
    if(isPlacing){placeTimer+=dt;if(placeTimer>=PLACE_DUR)isPlacing=false;}
    dmgFlash=Math.max(0,dmgFlash-dt*0.003);
    handleMining(dt);updateEntities(dt);updateFurnace(dt);updateDrops(dt);updateParticles(dt);sendState();
    for(let i=placeEffects.length-1;i>=0;i--){placeEffects[i].life-=dt/700;if(placeEffects[i].life<=0)placeEffects.splice(i,1);}
    const nowOnGround=player.onGround;
    if(!nowOnGround) airTime+=dt; 
    if(!wasOnGround&&nowOnGround&&airTime>120){jumpSquash=1;}
    if(nowOnGround) airTime=0;
    if(jumpSquash>0)jumpSquash=Math.max(0,jumpSquash-dt*0.005);
    wasOnGround=nowOnGround;
    updateCam();
    autoSaveTimer+=dt;if(autoSaveTimer>=AUTO_SAVE_INTERVAL){autoSaveTimer=0;if(currentSlot>=0){try{saveWorld(currentSlot);}catch(e){}}}
    drawSky();drawWorld();drawUndergroundDark();drawEntities();drawDrops();drawRemotePlayers();drawParticles();drawPlaceEffects();drawPlayer();drawLocalName();drawMineProgress();drawBlockCursor();drawHUD();drawMinimap();
    if(bookOpen&&bookAnim<1)bookAnim=Math.min(1,bookAnim+dt*0.006);else if(!bookOpen&&bookAnim>0)bookAnim=Math.max(0,bookAnim-dt*0.008);if(bookAnim>0)drawBook();
  }else if(gameState==='paused'){drawSky();drawWorld();drawUndergroundDark();drawEntities();drawDrops();drawRemotePlayers();drawParticles();drawPlayer();drawLocalName();drawHUD();drawMinimap();}
  if(craftOpen&&gameState==='playing')drawCraftUI();if(chestOpen&&gameState==='playing')drawChestUI();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(function(ts){lastTime=ts;requestAnimationFrame(gameLoop);});

try{syncControlUI();}catch(e){}
