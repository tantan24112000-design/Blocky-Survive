
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
const W=960,H=560;canvas.width=W;canvas.height=H;
document.getElementById('wrap').style.width=W+'px';
const BS=32,WW=240,WH=100,GRAV=0.45,JSPD=-11.5,MSPD=3.8,REACH=5.5,HS=9;

let gameState='menu';
let masterVol=0.6,daySpeed=3;
let currentSlot=-1;
function detectControlMode(){
  try{
    const ua = navigator.userAgent || '';
    if(/Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobi/i.test(ua)) return 'mobile';
    if(navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') return navigator.userAgentData.mobile ? 'mobile' : 'pc';
    if(window.matchMedia && window.matchMedia('(pointer: coarse)').matches && 'ontouchstart' in window) return 'mobile';
    if((navigator.maxTouchPoints || 0) > 1 && window.innerWidth <= 1024) return 'mobile';
  }catch(e){}
  return 'pc';
}
function getStoredControlMode(){
  try{
    const saved = (localStorage.getItem('ps_controlMode') || '').toLowerCase();
    if(saved === 'mobile' || saved === 'pc') return saved;
  }catch(e){}
  return null;
}
let controlMode = getStoredControlMode() || detectControlMode();
let platformChooserOpen = false;
let platformNextTarget = 'world';

let lang = localStorage.getItem('ps_lang') || 'vi';
const UI_TEXT = {"vi": {"menuSub": "Phi\u00ean b\u1ea3n 2.0 - Enhanced", "splash": ["C\u00e0y cu\u1ed1c l\u00e0m gi\u00e0u!", "X\u00e2y \u0111\u1eafp \u01b0\u1edbc m\u01a1!", "Sinh t\u1ed3n l\u00e0 s\u1ed1 1!", "Kh\u00e1m ph\u00e1 th\u1ebf gi\u1edbi!", "\u0110\u00e0o s\u00e2u t\u00ecm kho b\u00e1u!", "\u0110\u00eam t\u1ed1i r\u00f9ng r\u1ee3n!", "Ch\u1ebf t\u1ea1o v\u0169 kh\u00ed!", "Kim c\u01b0\u01a1ng \u1edf ph\u00eda d\u01b0\u1edbi!", "Zombie \u0111ang \u0111\u1ebfn!", "Heo con \u0111\u00e1ng y\u00eau!", "TNT n\u1ed5 tung!", "Gi\u00e1p kim c\u01b0\u01a1ng OP!", "L\u00f2 nung th\u1eddi \u0111\u1ea1i!", "N\u1ea5m \u0111\u1ed9c? Th\u1eed xem!", "X\u01b0\u01a1ng r\u1ed3ng ng\u1ee9a l\u1eafm!"], "play": "Choi Don", "online": "Choi Mang", "skin": "Tuy Chinh Nhan Vat", "settings": "Cai Dat", "device": "Thiet bi", "deviceNote": "Tu nhan dien khi vua vao web. Co the doi tai day.", "credits": "Tin Dung", "worldTitle": "Ch\u1ecdn Th\u1ebf Gi\u1edbi", "createWorld": "T\u1ea1o Th\u1ebf Gi\u1edbi M\u1edbi", "back": "Quay L\u1ea1i", "settingsTitle": "C\u00e0i \u0110\u1eb7t", "playerName": "Ten nguoi choi", "volume": "Am luong", "daySpeed": "T\u1ed1c \u0111\u1ed9 ng\u00e0y", "lang": "Ng\u00f4n ng\u1eef", "langBtn": "Ti\u1ebfng Vi\u1ec7t", "done": "Xong", "creditsTitle": "T\u00edn D\u1ee5ng", "creditsText": "PixelSurvive v2.0 Enhanced<br>Tr\u00f2 ch\u01a1i sinh t\u1ed3n pixel 2D<br>Ph\u00e1t tri\u1ec3n b\u1edfi: PixelStudio<br>Engine: Canvas 2D thu\u1ea7n<br>C\u1ea3m h\u1ee9ng: Minecraft & Terraria<br>2025", "skinTitle": "T\u00f9y Ch\u1ec9nh Nh\u00e2n V\u1eadt", "platformTitle": "Ch\u1ecdn n\u1ec1n t\u1ea3ng", "platformSub": "Ch\u1ecdn PC ho\u1eb7c Mobile tr\u01b0\u1edbc khi v\u00e0o th\u1ebf gi\u1edbi", "platformPc": "PC", "platformMobile": "Mobile", "onlineTitle": "Choi Mang", "onlineName": "Ten cua ban:", "createRoomTitle": "TAO PHONG", "createRoom": "Tao Phong Moi", "roomShare": "ID PHONG CUA BAN \u2014 chia se cho ban be:", "copyId": "Sao Chep ID", "joinRoomTitle": "THAM GIA PHONG", "joinId": "Nhap ID phong...", "connect": "Ket Noi", "pause": "T\u1ea1m D\u1eebng", "resume": "Ti\u1ebfp T\u1ee5c", "saveQuit": "L\u01b0u & Tho\u00e1t", "furnIn": "Nguy\u00ean li\u1ec7u", "furnFuel": "Nhi\u00ean li\u1ec7u", "furnOut": "K\u1ebft qu\u1ea3", "saved": "Da Luu!", "saveSkin": "Luu Skin", "allSlotsFull": "T\u1ea5t c\u1ea3 \u00f4 \u0111\u00e3 \u0111\u1ea7y! H\u00e3y x\u00f3a m\u1ed9t th\u1ebf gi\u1edbi.", "hints": "A/D \u00b7 Di chuy\u1ec3n<br>W \u00b7 Space \u00b7 Nh\u1ea3y<br>Click tr\u00e1i \u25b6 \u0110\u00e0o / \u0110\u00e1nh<br>Click ph\u1ea3i \u25c0 \u0110\u1eb7t / \u0102n<br>E \u00b7 Ch\u1ebf t\u1ea1o<br>F \u00b7 L\u00f2 nung<br>1\u20139 \u00b7 Ch\u1ecdn \u00f4<br>ESC \u00b7 T\u1ea1m d\u1eebng", "namePh": "Nhap ten...", "roomIdPh": "Nhap ID phong...", "playerNamePlaceholder": "Nhap ten..."}, "en": {"menuSub": "Version 2.0 - Enhanced", "splash": ["Grind to get rich!", "Build your dream!", "Survival is king!", "Explore the world!", "Dig deep for treasure!", "The night is scary!", "Craft your weapons!", "Diamonds are below!", "Zombies are coming!", "Cute little pig!", "TNT goes BOOM!", "Diamond gear OP!", "Furnace age!", "Poison mushroom? Try it!", "Cactus hurts!"], "play": "Play Offline", "online": "Play Online", "skin": "Customize Character", "settings": "Settings", "device": "Device", "deviceNote": "Auto-detected when you open the web. You can change it here.", "credits": "Credits", "worldTitle": "Choose World", "createWorld": "Create New World", "back": "Back", "settingsTitle": "Settings", "playerName": "Player name", "volume": "Volume", "daySpeed": "Day speed", "lang": "Language", "langBtn": "English", "done": "Done", "creditsTitle": "Credits", "creditsText": "PixelSurvive v2.0 Enhanced<br>2D pixel survival game<br>Developed by: PixelStudio<br>Engine: Pure Canvas 2D<br>Inspired by: Minecraft & Terraria<br>2025", "skinTitle": "Customize Character", "platformTitle": "Choose platform", "platformSub": "Choose PC or Mobile before entering the world", "platformPc": "PC", "platformMobile": "Mobile", "onlineTitle": "Play Online", "onlineName": "Your name:", "createRoomTitle": "CREATE ROOM", "createRoom": "Create New Room", "roomShare": "YOUR ROOM ID \u2014 share it with friends:", "copyId": "Copy ID", "joinRoomTitle": "JOIN ROOM", "joinId": "Enter room ID...", "connect": "Connect", "pause": "Paused", "resume": "Resume", "saveQuit": "Save & Quit", "furnIn": "Input", "furnFuel": "Fuel", "furnOut": "Result", "saved": "Saved!", "saveSkin": "Save Skin", "allSlotsFull": "All slots are full! Please delete a world.", "hints": "A/D \u00b7 Move<br>W \u00b7 Space \u00b7 Jump<br>Left click \u25b6 Mine / Attack<br>Right click \u25c0 Place / Eat<br>E \u00b7 Craft<br>F \u00b7 Furnace<br>1\u20139 \u00b7 Select slot<br>ESC \u00b7 Pause", "namePh": "Enter name...", "roomIdPh": "Enter room ID...", "playerNamePlaceholder": "Enter name..."}};
const BLOCK_NAME_EN = {"1": "Grass", "2": "Dirt", "3": "Stone", "4": "Wood", "5": "Leaves", "6": "Coal Ore", "7": "Iron Ore", "8": "Gold Ore", "9": "Sand", "10": "Wood Planks", "11": "Crafting Table", "12": "Torch", "13": "Water", "14": "Diamond Ore", "15": "Emerald Ore", "16": "Copper Ore", "17": "Snow", "18": "Ice", "19": "Gravel", "20": "Clay", "21": "Bricks", "22": "Glass", "23": "Furnace", "24": "Chest", "25": "Bed", "26": "Obsidian", "27": "Bedrock", "28": "Cactus", "29": "Pumpkin", "30": "Red Flower", "31": "Yellow Flower", "32": "Mushroom", "33": "Mossy Stone", "34": "Bookshelf", "35": "Wool", "36": "TNT", "37": "Lantern", "38": "Sandstone", "39": "Magma", "40": "Bone", "41": "Pine Log", "42": "Ice Spike", "43": "Cobblestone", "44": "Iron Block", "45": "Gold Block", "46": "Diamond Block", "47": "Door (Closed)", "48": "Door (Open)", "49": "Door (Top)", "50": "Door (Top Open)"};
const ITEM_NAME_EN = {"DIRT": "Dirt", "STONE": "Stone", "LOG": "Wood", "SAND": "Sand", "PLANK": "Wood Planks", "BENCH": "Crafting Table", "TORCH": "Torch", "COAL": "Coal", "IRON_ORE": "Iron Ore", "GOLD_ORE": "Gold Ore", "STICK": "Stick", "MEAT": "Raw Meat", "WOOD_PICK": "Wood Pickaxe", "STONE_PICK": "Stone Pickaxe", "IRON_PICK": "Iron Pickaxe", "WOOD_AXE": "Wood Axe", "IRON_AXE": "Iron Axe", "WOOD_SWORD": "Wood Sword", "IRON_SWORD": "Iron Sword", "DIAMOND": "Diamond", "EMERALD": "Emerald", "COPPER_ORE": "Copper Ore", "COPPER_INGOT": "Copper Ingot", "IRON_INGOT": "Iron Ingot", "GOLD_INGOT": "Gold Ingot", "DIAMOND_PICK": "Diamond Pickaxe", "DIAMOND_SWORD": "Diamond Sword", "DIAMOND_AXE": "Diamond Axe", "COOKED_MEAT": "Cooked Meat", "BREAD": "Bread", "APPLE": "Apple", "GOLDEN_APPLE": "Golden Apple", "FURNACE": "Furnace", "CHEST": "Chest", "BED": "Bed", "BRICK": "Brick", "GLASS": "Glass", "SNOW_BALL": "Snowball", "ICE": "Ice", "GRAVEL": "Gravel", "CLAY": "Clay", "OBSIDIAN": "Obsidian", "CACTUS": "Cactus", "PUMPKIN": "Pumpkin", "MUSHROOM": "Mushroom", "MOSS_STONE": "Mossy Stone", "BOOKSHELF": "Bookshelf", "WOOL": "Wool", "TNT": "TNT", "LEATHER": "Leather", "STRING": "String", "ARROW": "Arrow", "BOW": "Bow", "IRON_CHESTPLATE": "Iron Chestplate", "DIAMOND_CHESTPLATE": "Diamond Chestplate", "SHIELD": "Shield", "BOOK": "Book", "FLINT": "Flint", "BUCKET": "Bucket", "COMPASS": "Compass", "ROPE": "Rope", "LANTERN": "Lantern", "SANDSTONE": "Sandstone", "MAGMA": "Magma", "BONE": "Bone", "PINE_LOG": "Pine Log", "POTION": "Health Potion", "COBBLESTONE": "Cobblestone", "IRON_BLOCK": "Iron Block", "GOLD_BLOCK": "Gold Block", "DIAMOND_BLOCK": "Diamond Block", "DOOR": "Door"};
const SPLASHES = { vi: UI_TEXT.vi.splash, en: UI_TEXT.en.splash };
function t(key){ return (UI_TEXT[lang] && UI_TEXT[lang][key]) || (UI_TEXT.vi && UI_TEXT.vi[key]) || key; }
function blockName(id){ const d = BD[id]; return lang === 'en' ? (BLOCK_NAME_EN[id] || d?.n || '') : (d?.n || ''); }
function itemName(key){ const d = IT[key]; return lang === 'en' ? (ITEM_NAME_EN[key] || d?.n || key) : (d?.n || key); }
function setRandomSplash(){ const arr = SPLASHES[lang] || SPLASHES.vi; const el = document.getElementById('splash-text'); if(el && arr.length) el.textContent = arr[Math.floor(Math.random()*arr.length)]; }
function refreshControlModeUI(){
  const pcBtn=document.getElementById('btn-control-pc');
  const mobileBtn=document.getElementById('btn-control-mobile');
  const note=document.getElementById('control-mode-note');
  if(pcBtn) pcBtn.classList.toggle('active', controlMode === 'pc');
  if(mobileBtn) mobileBtn.classList.toggle('active', controlMode === 'mobile');
  if(note) note.textContent = t('deviceNote') + ' ' + (lang === 'en' ? 'Current mode: ' : 'Chế độ hiện tại: ') + (controlMode === 'mobile' ? 'Mobile' : 'PC');
}
function saveSettings(){ try{ localStorage.setItem('ps_settings', JSON.stringify({vol:masterVol, daySpeed:daySpeed, lang:lang})); }catch(e){} }
function setLanguage(next){ lang = next === 'en' ? 'en' : 'vi'; try{ localStorage.setItem('ps_lang', lang); }catch(e){} applyLanguage(); saveSettings(); }
function toggleLanguage(){ setLanguage(lang === 'vi' ? 'en' : 'vi'); }
function applyLanguage(){
  document.documentElement.lang = (lang === 'en' ? 'en' : 'vi');
  const setText = (id, value) => { const el = document.getElementById(id); if(el) el.textContent = value; };
  const setHTML = (id, value) => { const el = document.getElementById(id); if(el) el.innerHTML = value; };
  setText('menu-sub', t('menuSub'));
  setText('btn-play', t('play'));
  setText('btn-online', t('online'));
  setText('btn-skin', t('skin'));
  setText('btn-settings', t('settings'));
  setText('btn-credits', t('credits'));
  setText('world-title', t('worldTitle'));
  setText('btn-create-world', t('createWorld'));
  setText('btn-back-world', t('back'));
  setText('settings-title', t('settingsTitle'));
  setText('player-name-label', t('playerName'));
  setText('volume-label', t('volume'));
  setText('day-speed-label', t('daySpeed'));
  setText('lang-label', t('lang'));
  setText('control-mode-label', t('device'));
  setText('control-mode-note', t('deviceNote'));
  setText('btn-lang', t('langBtn'));
  setText('btn-back-settings', t('done'));
  setText('btn-back-credits', t('back'));
  setText('btn-back-skin', t('back'));
  setText('btn-save-skin', t('saveSkin'));
  setText('credits-title', t('creditsTitle'));
  setHTML('credits-text', t('creditsText'));
  setText('skin-title', t('skinTitle'));
  setText('platform-title', t('platformTitle'));
  setText('platform-sub', t('platformSub'));
  setText('skin-face-label', lang==='en' ? 'Skin tone' : 'Màu da');
  setText('skin-hair-label', lang==='en' ? 'Hair' : 'Tóc');
  setText('skin-eye-label', lang==='en' ? 'Eyes' : 'Mắt');
  setText('skin-shirt-label', lang==='en' ? 'Shirt' : 'Áo');
  setText('skin-pants-label', lang==='en' ? 'Pants' : 'Quần');
  setText('skin-shoe-label', lang==='en' ? 'Shoes' : 'Giày');
  setText('skin-sample-label', lang==='en' ? 'Sample skin' : 'Skin mẫu');
  setText('online-title', t('onlineTitle'));
  setText('online-name-label', t('onlineName'));
  setText('create-room-title', t('createRoomTitle'));
  setText('btn-create-room', t('createRoom'));
  setText('room-share-text', t('roomShare'));
  setText('btn-copy-id', t('copyId'));
  setText('join-room-title', t('joinRoomTitle'));
  setText('btn-join-room', t('connect'));
  setText('btn-back-online', t('back'));
  setText('btn-platform-pc', t('platformPc'));
  setText('btn-platform-mobile', t('platformMobile'));
  setText('pause-title', t('pause'));
  setText('btn-resume', t('resume'));
  setText('btn-save-quit', t('saveQuit'));
  setText('furn-input-label', t('furnIn'));
  setText('furn-fuel-label', t('furnFuel'));
  setText('furn-output-label', t('furnOut'));
  const p1 = document.getElementById('player-name-input'); if(p1) p1.placeholder = t('playerNamePlaceholder');
  const p2 = document.getElementById('online-name-input'); if(p2) p2.placeholder = t('playerNamePlaceholder');
  const j1 = document.getElementById('join-id-input'); if(j1) j1.placeholder = t('roomIdPh');
  const h = document.getElementById('hints'); if(h) h.innerHTML = t('hints');
  setRandomSplash();
}
function saveControlMode(mode){controlMode = mode === 'mobile' ? 'mobile' : 'pc';try{localStorage.setItem('ps_controlMode',controlMode);}catch(e){}refreshControlModeUI();syncControlUI();}
function showPlatformChooser(){platformChooserOpen=true;const el=document.getElementById('platform-overlay');if(el)el.style.display='flex';syncControlUI();}
function hidePlatformChooser(){platformChooserOpen=false;const el=document.getElementById('platform-overlay');if(el)el.style.display='none';syncControlUI();}
function syncControlUI(){const mobile=controlMode==='mobile';const mc=document.getElementById('mobile-controls');if(mc)mc.style.display=(gameState==='playing'&&mobile)?'flex':'none';const hints=document.getElementById('hints');if(hints)hints.style.display=(gameState==='playing'&&!mobile)?'block':'none';const plat=document.getElementById('platform-overlay');if(plat)plat.style.display=platformChooserOpen?'flex':'none';if(!(gameState==='playing'&&mobile))resetJoystick();refreshControlModeUI();}
function setKeyState(code,down){keys[code]=down;}
function mobileMove(dir){setKeyState('KeyA',dir<0);setKeyState('ArrowLeft',dir<0);setKeyState('KeyD',dir>0);setKeyState('ArrowRight',dir>0);}

const JOY_MAX=42;
const JOY_DEAD=12;
let joyState={active:false,pointerId:null,centerX:0,centerY:0,dx:0,dy:0,jumped:false};
function mobileJump(){
  if(gameState!=='playing'||player.isDead)return;
  if(craftOpen||furnaceOpen||chestOpen)return;
  if(player.onGround){
    player.vy=JSPD;
    player.onGround=false;
    sndClick();
  }
}
function setJoystickVisual(dx,dy){
  const thumb=document.getElementById('mc-joy-thumb');
  if(!thumb) return;
  thumb.style.transform=`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}
function resetJoystick(){
  joyState.active=false;
  joyState.pointerId=null;
  joyState.dx=0;
  joyState.dy=0;
  joyState.jumped=false;
  const stick=document.getElementById('mobile-joystick');
  if(stick) stick.classList.remove('active');
  setJoystickVisual(0,0);
  mobileMove(0);
}
function updateJoystickFromPointer(clientX,clientY){
  const dx=clientX-joyState.centerX;
  const dy=clientY-joyState.centerY;
  const len=Math.hypot(dx,dy)||1;
  const clamped=len>JOY_MAX ? JOY_MAX/len : 1;
  joyState.dx=dx*clamped;
  joyState.dy=dy*clamped;
  setJoystickVisual(joyState.dx, joyState.dy);
  if(joyState.dx<-JOY_DEAD) mobileMove(-1);
  else if(joyState.dx>JOY_DEAD) mobileMove(1);
  else mobileMove(0);
  if(joyState.dy < -28 && !joyState.jumped){
    joyState.jumped=true;
    mobileJump();
  }
  if(joyState.dy > -14) joyState.jumped=false;
}
function onJoystickDown(e){
  if(controlMode!=='mobile' || gameState!=='playing' || player.isDead) return;
  const stick=document.getElementById('mobile-joystick');
  if(!stick) return;
  e.preventDefault();
  e.stopPropagation();
  joyState.active=true;
  joyState.pointerId=e.pointerId;
  const r=stick.getBoundingClientRect();
  joyState.centerX=r.left+r.width/2;
  joyState.centerY=r.top+r.height/2;
  stick.classList.add('active');
  try{ stick.setPointerCapture(e.pointerId); }catch(err){}
  updateJoystickFromPointer(e.clientX,e.clientY);
}
function onJoystickMove(e){
  if(!joyState.active || e.pointerId!==joyState.pointerId) return;
  e.preventDefault();
  updateJoystickFromPointer(e.clientX,e.clientY);
}
function onJoystickUp(e){
  if(e.pointerId!==joyState.pointerId) return;
  e.preventDefault();
  const stick=document.getElementById('mobile-joystick');
  if(stick && stick.releasePointerCapture){
    try{ stick.releasePointerCapture(e.pointerId); }catch(err){}
  }
  resetJoystick();
}
function aimMobileFront(){const dir=player.facing>=0?1:-1;const px=player.x+player.w/2;const py=player.y+player.h/2;mouseWX=(px+dir*BS*1.65)/BS;mouseWY=py/BS;mouseX=W/2;mouseY=H/2;}
function mobileMineStart(){if(gameState!=='playing'||player.isDead)return;aimMobileFront();lmbDown=true;triggerClickSwing();}
function mobileMineEnd(){lmbDown=false;mineT=0;mineTarget=null;}
function mobileUseTap(){if(gameState!=='playing'||player.isDead)return;doRightClick();}
function mobileCraftToggle(){if(gameState!=='playing'||player.isDead)return;if(chestOpen){closeChest();return;}if(furnaceOpen){closeFurnace();return;}if(craftOpen)closeCraftUI();else{craftOpen=true;checkCraftRecipe();}}
function mobileFurnace(){if(gameState!=='playing'||player.isDead)return;const {tx,ty}=getTile();if(getB(tx,ty)===B.FURNACE&&inReach(tx,ty))openFurnace();}
function mobilePauseToggle(){if(gameState!=='playing'&&gameState!=='paused')return;if(gameState==='playing'){gameState='paused';const p=document.getElementById('pause-overlay');if(p)p.style.display='flex';}else if(gameState==='paused'){resumeGame();}syncControlUI();}
function mobileBookToggle(){if(gameState!=='playing'||player.isDead)return;bookOpen=!bookOpen;sndClick();}
function updateMouseFromClient(clientX,clientY){const r=canvas.getBoundingClientRect();mouseX=(clientX-r.left)*(W/r.width);mouseY=(clientY-r.top)*(H/r.height);mouseWX=(mouseX+cam.x)/BS;mouseWY=(mouseY+cam.y)/BS;}
function openMobileChooser(target='world'){platformNextTarget=target==='online'?'online':'world';showPlatformChooser();}
function choosePlatform(mode){saveControlMode(mode);const next=platformNextTarget==='online'?'online':'world';platformNextTarget='world';hidePlatformChooser();if(next==='online')showOnlineScreen();else showWorldScreen();}
function blockNameOrDefault(id){ return blockName(id); }
function itemNameOrDefault(key){ return itemName(key); }

const B={AIR:0,GRASS:1,DIRT:2,STONE:3,LOG:4,LEAVES:5,COAL:6,IRON:7,GOLD:8,SAND:9,PLANK:10,
  BENCH:11,TORCH:12,WATER:13,DIAMOND_ORE:14,EMERALD_ORE:15,COPPER_ORE:16,SNOW:17,ICE:18,
  GRAVEL:19,CLAY:20,BRICK:21,GLASS:22,FURNACE:23,CHEST:24,BED:25,OBSIDIAN:26,BEDROCK:27,
  CACTUS:28,PUMPKIN:29,FLOWER_R:30,FLOWER_Y:31,MUSHROOM:32,MOSS_STONE:33,BOOKSHELF:34,WOOL:35,TNT:36,LANTERN:37,
  SANDSTONE:38,MAGMA:39,BONE:40,PINE_LOG:41,ICE_SPIKE:42,
  COBBLESTONE:43,IRON_BLOCK:44,GOLD_BLOCK:45,DIAMOND_BLOCK:46,DOOR:47,DOOR_OPEN:48};

const BD={
  1:{n:'Cỏ',c:'#587030',t:'#7ED44D',h:0.8,d:'DIRT',s:true},
  2:{n:'Đất',c:'#7A5230',h:0.8,d:'DIRT',s:true},
  3:{n:'Đá',c:'#6A6A6A',h:3.5,d:'STONE',s:true},
  4:{n:'Gỗ',c:'#7A5A18',h:2.0,d:'LOG',s:true},
  5:{n:'Lá cây',c:'#258018',h:0.3,d:null,s:false},
  6:{n:'Than đá',c:'#646464',h:3.5,d:'COAL',o:'#111',s:true},
  7:{n:'Quặng Sắt',c:'#727272',h:4.5,d:'IRON_ORE',o:'#C87A40',s:true},
  8:{n:'Quặng Vàng',c:'#6A6A6A',h:6.0,d:'GOLD_ORE',o:'#FFD700',s:true},
  9:{n:'Cát',c:'#C8A870',h:0.6,d:'SAND',s:true},
  10:{n:'Ván gỗ',c:'#BC9E50',h:1.5,d:'PLANK',s:true},
  11:{n:'Bàn chế tạo',c:'#7A3C10',h:2.0,d:'BENCH',s:true},
  12:{n:'Đuốc',c:'#FF8800',h:0.1,d:'TORCH',s:false},
  13:{n:'Nước',c:'#2060AA',h:100,d:null,s:false,liquid:true},
  14:{n:'Quặng Kim Cương',c:'#6A6A7A',h:8.0,d:'DIAMOND',o:'#40E8E8',s:true},
  15:{n:'Quặng Ngọc Lục',c:'#5A7A5A',h:7.0,d:'EMERALD',o:'#30D060',s:true},
  16:{n:'Quặng Đồng',c:'#6A6A60',h:4.0,d:'COPPER_ORE',o:'#D08030',s:true},
  17:{n:'Tuyết',c:'#E8E8F0',h:0.5,d:'SNOW_BALL',s:true},
  18:{n:'Băng',c:'#90C8E8',h:0.8,d:'ICE',s:true},
  19:{n:'Sỏi',c:'#8A7A6A',h:1.0,d:'GRAVEL',s:true},
  20:{n:'Đất sét',c:'#9A90A0',h:1.2,d:'CLAY',s:true},
  21:{n:'Gạch',c:'#AA4430',h:3.0,d:'BRICK',s:true},
  22:{n:'Kính',c:'#C8E8F8',h:0.4,d:'GLASS',s:true},
  23:{n:'Lò nung',c:'#5A5A5A',h:3.5,d:'FURNACE',s:true},
  24:{n:'Rương',c:'#8A5A20',h:2.0,d:'CHEST',s:true},
  25:{n:'Giường',c:'#C03030',h:1.0,d:'BED',s:true},
  26:{n:'Hắc Diện Thạch',c:'#1A0A2A',h:50,d:'OBSIDIAN',s:true},
  27:{n:'Đá nền',c:'#333',h:9999,d:null,s:true,bedrock:true},
  28:{n:'Xương rồng',c:'#208020',h:0.6,d:'CACTUS',s:false,dmg:2},
  29:{n:'Bí ngô',c:'#E88020',h:1.0,d:'PUMPKIN',s:true},
  30:{n:'Hoa đỏ',c:'#E02020',h:0,d:null,s:false,flower:true},
  31:{n:'Hoa vàng',c:'#E0D020',h:0,d:null,s:false,flower:true},
  32:{n:'Nấm',c:'#C02020',h:0,d:'MUSHROOM',s:false},
  33:{n:'Đá rêu',c:'#5A7A5A',h:3.5,d:'MOSS_STONE',s:true},
  34:{n:'Tủ sách',c:'#7A5A28',h:1.5,d:'BOOKSHELF',s:true},
  35:{n:'Len',c:'#E0E0E0',h:0.8,d:'WOOL',s:true},
  36:{n:'TNT',c:'#DD2020',h:0.5,d:'TNT',s:true},
  37:{n:'Đèn Lồng',c:'#7A5810',h:0.5,d:'LANTERN',s:false},
  38:{n:'Đá Cát',c:'#C8B870',h:2.5,d:'SANDSTONE',s:true},
  39:{n:'Nham Thạch',c:'#3A1A0A',h:5.0,d:'MAGMA',s:true,dmg:3},
  40:{n:'Xương',c:'#E8E0C8',h:2.0,d:'BONE',s:true},
  41:{n:'Gỗ Thông',c:'#5A4A20',h:2.0,d:'PINE_LOG',s:true},
  42:{n:'Gai Băng',c:'#B0E0F8',h:0.8,d:'ICE',s:false,dmg:1},
  43:{n:'Đá Cuội',c:'#888888',h:3.0,d:'COBBLESTONE',s:true},
  44:{n:'Khối Sắt',c:'#D0D0D8',h:6.0,d:'IRON_BLOCK',s:true},
  45:{n:'Khối Vàng',c:'#FFD700',h:6.0,d:'GOLD_BLOCK',s:true},
  46:{n:'Khối Kim Cương',c:'#40E8E8',h:8.0,d:'DIAMOND_BLOCK',s:true},
  47:{n:'Cửa (Đóng)',c:'#8A6030',h:2.0,d:'DOOR',s:true},
  48:{n:'Cửa (Mở)',c:'#8A6030',h:2.0,d:'DOOR',s:false},
  49:{n:'Cửa (Trên)',c:'#8A6030',h:2.0,d:null,s:true},
  50:{n:'Cửa (Trên Mở)',c:'#8A6030',h:2.0,d:null,s:false},
};

const IT={
  DIRT:{n:'Đất',block:2,c:'#7A5230'},STONE:{n:'Đá',block:3,c:'#6A6A6A'},LOG:{n:'Gỗ',block:4,c:'#7A5A18'},
  SAND:{n:'Cát',block:9,c:'#C8A870'},PLANK:{n:'Ván gỗ',block:10,c:'#BC9E50'},BENCH:{n:'Bàn chế tạo',block:11,c:'#7A3C10'},
  TORCH:{n:'Đuốc',block:12,c:'#FF8800'},COAL:{n:'Than',c:'#232323'},IRON_ORE:{n:'Quặng Sắt',c:'#C87A40'},
  GOLD_ORE:{n:'Quặng Vàng',c:'#FFD700'},STICK:{n:'Que gỗ',c:'#9A7030'},
  MEAT:{n:'Thịt sống',c:'#E05050',food:true,hunger:20,heal:5},
  WOOD_PICK:{n:'Cuốc Gỗ',c:'#BC9E50',tool:'pick',pow:1.8},STONE_PICK:{n:'Cuốc Đá',c:'#888',tool:'pick',pow:3.5},
  IRON_PICK:{n:'Cuốc Sắt',c:'#C87A40',tool:'pick',pow:7.0},WOOD_AXE:{n:'Rìu Gỗ',c:'#BC9E50',tool:'axe',pow:1.8},
  IRON_AXE:{n:'Rìu Sắt',c:'#C87A40',tool:'axe',pow:6.0},WOOD_SWORD:{n:'Kiếm Gỗ',c:'#BC9E50',tool:'sword',dmg:5},
  IRON_SWORD:{n:'Kiếm Sắt',c:'#C87A40',tool:'sword',dmg:12},
  DIAMOND:{n:'Kim Cương',c:'#40E8E8'},EMERALD:{n:'Ngọc Lục Bảo',c:'#30D060'},
  COPPER_ORE:{n:'Quặng Đồng',c:'#D08030'},COPPER_INGOT:{n:'Thỏi Đồng',c:'#D08838'},
  IRON_INGOT:{n:'Thỏi Sắt',c:'#D0D0D8'},GOLD_INGOT:{n:'Thỏi Vàng',c:'#FFD700'},
  DIAMOND_PICK:{n:'Cuốc Kim Cương',c:'#40E8E8',tool:'pick',pow:14},DIAMOND_SWORD:{n:'Kiếm Kim Cương',c:'#40E8E8',tool:'sword',dmg:22},
  DIAMOND_AXE:{n:'Rìu Kim Cương',c:'#40E8E8',tool:'axe',pow:12},
  COOKED_MEAT:{n:'Thịt Nướng',c:'#C07030',food:true,hunger:40,heal:15},
  BREAD:{n:'Bánh Mì',c:'#D8B060',food:true,hunger:30,heal:5},
  APPLE:{n:'Táo',c:'#E03030',food:true,hunger:15,heal:8},
  GOLDEN_APPLE:{n:'Táo Vàng',c:'#FFD700',food:true,hunger:50,heal:30},
  FURNACE:{n:'Lò Nung',block:23,c:'#5A5A5A'},CHEST:{n:'Rương',block:24,c:'#8A5A20'},
  BED:{n:'Giường',block:25,c:'#C03030'},BRICK:{n:'Gạch',block:21,c:'#AA4430'},
  GLASS:{n:'Kính',block:22,c:'#C8E8F8'},SNOW_BALL:{n:'Cầu Tuyết',c:'#E8E8F0'},
  ICE:{n:'Băng',block:18,c:'#90C8E8'},GRAVEL:{n:'Sỏi',c:'#8A7A6A'},
  CLAY:{n:'Đất Sét',c:'#9A90A0'},OBSIDIAN:{n:'Hắc Diện Thạch',block:26,c:'#1A0A2A'},
  CACTUS:{n:'Xương Rồng',block:28,c:'#208020'},PUMPKIN:{n:'Bí Ngô',block:29,c:'#E88020'},
  MUSHROOM:{n:'Nấm',c:'#C02020',food:true,hunger:5,heal:2},
  MOSS_STONE:{n:'Đá Rêu',block:33,c:'#5A7A5A'},BOOKSHELF:{n:'Tủ Sách',block:34,c:'#7A5A28'},
  WOOL:{n:'Len',block:35,c:'#E0E0E0'},TNT:{n:'TNT',block:36,c:'#DD2020'},
  LEATHER:{n:'Da',c:'#9A6830'},STRING:{n:'Sợi',c:'#E0E0D0'},
  ARROW:{n:'Mũi Tên',c:'#8A7A50'},BOW:{n:'Cung',c:'#7A5A18',tool:'bow',dmg:8},
  IRON_CHESTPLATE:{n:'Giáp Sắt',c:'#C0C0C8',armor:true,def:4},
  DIAMOND_CHESTPLATE:{n:'Giáp Kim Cương',c:'#40E8E8',armor:true,def:7},
  SHIELD:{n:'Khiên',c:'#8A7A50',armor:true,def:2},
  BOOK:{n:'Sách',c:'#7A5A28'},FLINT:{n:'Đá Lửa',c:'#4A4A4A'},
  BUCKET:{n:'Xô',c:'#A0A0A8'},COMPASS:{n:'La Bàn',c:'#C0C0C0'},
  ROPE:{n:'Dây Thừng',c:'#C8A860'},
  LANTERN:{n:'Đèn Lồng',block:37,c:'#FFB030'},
  SANDSTONE:{n:'Đá Cát',block:38,c:'#C8B870'},
  MAGMA:{n:'Nham Thạch',block:39,c:'#3A1A0A'},
  BONE:{n:'Xương',block:40,c:'#E8E0C8'},
  PINE_LOG:{n:'Gỗ Thông',block:41,c:'#5A4A20'},
  POTION:{n:'Bình Hồi Máu',c:'#FF4488',food:true,hunger:0,heal:40},
  COBBLESTONE:{n:'Đá Cuội',block:43,c:'#888888'},
  IRON_BLOCK:{n:'Khối Sắt',block:44,c:'#D0D0D8'},
  GOLD_BLOCK:{n:'Khối Vàng',block:45,c:'#FFD700'},
  DIAMOND_BLOCK:{n:'Khối Kim Cương',block:46,c:'#40E8E8'},
  DOOR:{n:'Cửa',block:47,c:'#8A6030'},
};

const SMELT={
  IRON_ORE:{out:'IRON_INGOT',time:8000},GOLD_ORE:{out:'GOLD_INGOT',time:10000},
  COPPER_ORE:{out:'COPPER_INGOT',time:6000},SAND:{out:'GLASS',time:4000},
  STONE:{out:'MOSS_STONE',time:6000},MEAT:{out:'COOKED_MEAT',time:5000},
  LOG:{out:'COAL',time:4000},CLAY:{out:'BRICK',time:5000},
};

const RECIPES=[
  {p:[[null,null,null],[null,'LOG',null],[null,null,null]],o:'PLANK',cnt:4},
  {p:[[null,null,null],[null,'PLANK',null],[null,'PLANK',null]],o:'STICK',cnt:4},
  {p:[[null,null,null],['PLANK','PLANK',null],['PLANK','PLANK',null]],o:'BENCH',cnt:1},
  {p:[[null,null,null],[null,'COAL',null],[null,'STICK',null]],o:'TORCH',cnt:4},
  {p:[['PLANK','PLANK','PLANK'],[null,'STICK',null],[null,'STICK',null]],o:'WOOD_PICK',cnt:1},
  {p:[['STONE','STONE','STONE'],[null,'STICK',null],[null,'STICK',null]],o:'STONE_PICK',cnt:1},
  {p:[['IRON_ORE','IRON_ORE','IRON_ORE'],[null,'STICK',null],[null,'STICK',null]],o:'IRON_PICK',cnt:1},
  {p:[['DIAMOND','DIAMOND','DIAMOND'],[null,'STICK',null],[null,'STICK',null]],o:'DIAMOND_PICK',cnt:1},
  {p:[['PLANK','PLANK',null],['PLANK','STICK',null],[null,'STICK',null]],o:'WOOD_AXE',cnt:1},
  {p:[['IRON_ORE','IRON_ORE',null],['IRON_ORE','STICK',null],[null,'STICK',null]],o:'IRON_AXE',cnt:1},
  {p:[['DIAMOND','DIAMOND',null],['DIAMOND','STICK',null],[null,'STICK',null]],o:'DIAMOND_AXE',cnt:1},
  {p:[[null,'PLANK',null],[null,'PLANK',null],[null,'STICK',null]],o:'WOOD_SWORD',cnt:1},
  {p:[[null,'IRON_INGOT',null],[null,'IRON_INGOT',null],[null,'STICK',null]],o:'IRON_SWORD',cnt:1},
  {p:[[null,'DIAMOND',null],[null,'DIAMOND',null],[null,'STICK',null]],o:'DIAMOND_SWORD',cnt:1},
  {p:[[null,null,null],['PLANK','PLANK','PLANK'],['PLANK','PLANK','PLANK']],o:'FURNACE',cnt:1},
  {p:[[null,null,null],['PLANK','PLANK','PLANK'],['PLANK',null,'PLANK']],o:'CHEST',cnt:1},
  {p:[['WOOL','WOOL','WOOL'],[null,'PLANK',null],[null,'PLANK',null]],o:'BED',cnt:1},
  {p:[['SAND','SAND','SAND'],[null,'SAND',null],[null,'SAND',null]],o:'GLASS',cnt:3},
  {p:[['BRICK','BRICK','BRICK'],[null,'BRICK',null],[null,'BRICK',null]],o:'BOOKSHELF',cnt:1},
  {p:[['STRING','STRING',null],[null,'STICK',null],[null,'STICK',null]],o:'BOW',cnt:1},
  {p:[[null,'IRON_INGOT',null],['IRON_INGOT','IRON_INGOT','IRON_INGOT'],[null,null,null]],o:'IRON_CHESTPLATE',cnt:1},
  {p:[['DIAMOND','DIAMOND','DIAMOND'],['DIAMOND',null,'DIAMOND'],[null,null,null]],o:'DIAMOND_CHESTPLATE',cnt:1},
  {p:[[null,'IRON_INGOT',null],['IRON_INGOT','IRON_INGOT','IRON_INGOT'],[null,null,null]],o:'SHIELD',cnt:1},
  {p:[[null,null,null],['GRAVEL','GRAVEL',null],['GRAVEL','GRAVEL',null]],o:'FLINT',cnt:1},
  {p:[[null,'IRON_INGOT',null],[null,'IRON_INGOT',null],[null,'IRON_INGOT',null]],o:'BUCKET',cnt:1},
  {p:[['GOLD_INGOT','GOLD_INGOT','GOLD_INGOT'],[null,'APPLE',null],[null,null,null]],o:'GOLDEN_APPLE',cnt:1},
  {p:[[null,null,null],['GRAVEL','GRAVEL',null],['STRING','STRING',null]],o:'ROPE',cnt:2},
  {p:[[null,'COAL',null],['IRON_INGOT','IRON_INGOT','IRON_INGOT'],[null,'IRON_INGOT',null]],o:'LANTERN',cnt:1},
  {p:[['GOLD_INGOT',null,'GOLD_INGOT'],['GOLD_INGOT','EMERALD','GOLD_INGOT'],['GOLD_INGOT',null,'GOLD_INGOT']],o:'POTION',cnt:1},
  {p:[['STONE','STONE','STONE'],['STONE','STONE','STONE'],['STONE','STONE','STONE']],o:'COBBLESTONE',cnt:9},
  {p:[['IRON_INGOT','IRON_INGOT','IRON_INGOT'],['IRON_INGOT','IRON_INGOT','IRON_INGOT'],['IRON_INGOT','IRON_INGOT','IRON_INGOT']],o:'IRON_BLOCK',cnt:1},
  {p:[['GOLD_INGOT','GOLD_INGOT','GOLD_INGOT'],['GOLD_INGOT','GOLD_INGOT','GOLD_INGOT'],['GOLD_INGOT','GOLD_INGOT','GOLD_INGOT']],o:'GOLD_BLOCK',cnt:1},
  {p:[['DIAMOND','DIAMOND','DIAMOND'],['DIAMOND','DIAMOND','DIAMOND'],['DIAMOND','DIAMOND','DIAMOND']],o:'DIAMOND_BLOCK',cnt:1},
  {p:[[null,'PLANK','PLANK'],[null,'PLANK','PLANK'],[null,'PLANK','PLANK']],o:'DOOR',cnt:1},
];



let audioCtx=null,noiseBuf=null;
function initAudio(){try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
function tone(f,d,t,v,fe){try{initAudio();const n=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t||'square';o.frequency.setValueAtTime(Math.max(10,f),n);if(fe)o.frequency.exponentialRampToValueAtTime(Math.max(10,fe),n+d);g.gain.setValueAtTime(v*masterVol||0.08,n);g.gain.exponentialRampToValueAtTime(0.001,n+d);o.connect(g);g.connect(audioCtx.destination);o.start(n);o.stop(n+d);}catch(e){}}
function noiseSnd(d,v){try{initAudio();if(!noiseBuf){noiseBuf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.2,audioCtx.sampleRate);const d2=noiseBuf.getChannelData(0);for(let i=0;i<d2.length;i++)d2[i]=Math.random()*2-1;}const n=audioCtx.currentTime,s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=noiseBuf;g.gain.setValueAtTime(v*masterVol||0.04,n);g.gain.exponentialRampToValueAtTime(0.001,n+d);s.connect(g);g.connect(audioCtx.destination);s.start(n);s.stop(n+d);}catch(e){}}
function sndBreak(){tone(300,0.12,'sawtooth',0.1,60);noiseSnd(0.08,0.06);triggerScreenShake(2.5,250);}
function sndPlace(){tone(150,0.1,'square',0.07,80);tone(200,0.05,'square',0.04);triggerScreenShake(1.8,180);}
function sndEat(){tone(400,0.06,'sine',0.08,200);setTimeout(()=>tone(500,0.06,'sine',0.06,250),80);setTimeout(()=>tone(450,0.05,'sine',0.05,220),160);}
function sndMine(){tone(800,0.04,'square',0.03,400);}
function sndHurt(){tone(200,0.18,'sawtooth',0.12,80);noiseSnd(0.1,0.05);}
function sndZombieAtk(){tone(80,0.25,'sawtooth',0.07,35);noiseSnd(0.15,0.04);}
function sndZombieDie(){tone(150,0.35,'sawtooth',0.08,25);noiseSnd(0.25,0.05);}
function sndPigDie(){tone(350,0.18,'sine',0.06,120);tone(280,0.12,'sine',0.04,100);}
function sndHitEnt(){tone(250,0.06,'square',0.06,120);noiseSnd(0.04,0.03);}
function sndCraft(){tone(600,0.08,'sine',0.06,400);setTimeout(()=>tone(800,0.1,'sine',0.05,600),60);}
function sndClick(){tone(500,0.03,'square',0.03,300);}
function sndExplosion(){tone(60,0.5,'sawtooth',0.15,20);noiseSnd(0.4,0.12);}
function sndLevelUp(){tone(500,0.1,'sine',0.08,800);setTimeout(()=>tone(700,0.1,'sine',0.06,1000),100);setTimeout(()=>tone(900,0.15,'sine',0.05,1200),200);}
function sndPickup(){tone(900,0.05,'sine',0.04,1100);setTimeout(()=>tone(1100,0.06,'sine',0.03,1300),50);}
function triggerClickSwing(){clickArmSide=Math.random()<0.5?-1:1;clickArmKick=1;}


// ── SKIN DATA ─────────────────────────────────────────────────────────────
const SKIN_PALETTES={
  face:['#F5C8A0','#E8A878','#C07840','#8A5030','#FFE8CC','#D4A070','#A06040','#6A3820'],
  hair:['#1A0A00','#3A2008','#6A4010','#C07A0A','#D0C080','#F0F0E0','#CC2020','#204080'],
  eye: ['#222222','#2A4A80','#205030','#7A3A10','#A03020','#404080','#207070','#606060'],
  shirt:['#4080C0','#C03030','#208040','#8030A0','#CC8020','#404040','#E8E8E8','#30A0C0'],
  pants:['#2A3A60','#1A1A2A','#3A2010','#204020','#503020','#606060','#2A2A4A','#103040'],
  shoe: ['#2A1808','#1A1A1A','#4A3010','#203040','#8A4020','#505050','#102820','#3A1010'],
};
const SKIN_PRESETS=[
  {name:'Mặc Định',face:'#F5C8A0',hair:'#3A2008',eye:'#222222',shirt:'#4080C0',pants:'#2A3A60',shoe:'#2A1808'},
  {name:'Chiến Binh',face:'#E8A878',hair:'#1A0A00',eye:'#A03020',shirt:'#C03030',pants:'#1A1A2A',shoe:'#1A1A1A'},
  {name:'Pháp Sư',face:'#FFE8CC',hair:'#204080',eye:'#207070',shirt:'#8030A0',pants:'#2A2A4A',shoe:'#102820'},
  {name:'Thám Hiểm',face:'#C07840',hair:'#6A4010',eye:'#205030',shirt:'#208040',pants:'#3A2010',shoe:'#4A3010'},
  {name:'Bóng Tối',face:'#6A3820',hair:'#1A0A00',eye:'#A03020',shirt:'#404040',pants:'#1A1A2A',shoe:'#1A1A1A'},
  {name:'Băng Giá',face:'#F0E8E0',hair:'#F0F0E0',eye:'#2A4A80',shirt:'#30A0C0',pants:'#103040',shoe:'#203040'},
  {name:'Sa Mạc',face:'#D4A070',hair:'#C07A0A',eye:'#7A3A10',shirt:'#CC8020',pants:'#503020',shoe:'#8A4020'},
  {name:'Hoàng Gia',face:'#F5C8A0',hair:'#D0C080',eye:'#2A4A80',shirt:'#8030A0',pants:'#2A3A60',shoe:'#3A1010'},
];
let skinData={face:'#FFFFFF',hair:'#FFFFFF',eye:'#FFFFFF',shirt:'#FFFFFF',pants:'#FFFFFF',shoe:'#FFFFFF'};
function loadSkin(){try{const s=JSON.parse(localStorage.getItem('ps_skin'));if(s)skinData=Object.assign({},skinData,s);}catch(e){}}
function saveSkin(){try{localStorage.setItem('ps_skin',JSON.stringify(skinData));}catch(e){}}
loadSkin();

// ── PLAYER NAME ─────────────────────────────────────────────────────────
let playerName = localStorage.getItem('ps_name') || 'Steve';

// ── FULLSCREEN SCALE ─────────────────────────────────────────────────────
function updateGameScale(){
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  const el = document.getElementById('wrap');
  el.style.width  = W + 'px';
  el.style.height = H + 'px';
  el.style.transform = 'scale(' + s + ')';
  el.style.left = ((window.innerWidth  - W * s) / 2) + 'px';
  el.style.top  = ((window.innerHeight - H * s) / 2) + 'px';
}
window.addEventListener('resize', updateGameScale);
updateGameScale();
