const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
const W=960,H=560;canvas.width=W;canvas.height=H;
document.getElementById('wrap').style.width=W+'px';
const BS=32,WW=240,WH=100,GRAV=0.45,JSPD=-11.5,MSPD=3.8,REACH=5.5,HS=9;

let gameState='menu';
let masterVol=0.6,daySpeed=3;
let currentSlot=-1;

const B={AIR:0,GRASS:1,DIRT:2,STONE:3,LOG:4,LEAVES:5,COAL:6,IRON:7,GOLD:8,SAND:9,PLANK:10,
  BENCH:11,TORCH:12,WATER:13,DIAMOND_ORE:14,EMERALD_ORE:15,COPPER_ORE:16,SNOW:17,ICE:18,
  GRAVEL:19,CLAY:20,BRICK:21,GLASS:22,FURNACE:23,CHEST:24,BED:25,OBSIDIAN:26,BEDROCK:27,
  CACTUS:28,PUMPKIN:29,FLOWER_R:30,FLOWER_Y:31,MUSHROOM:32,MOSS_STONE:33,BOOKSHELF:34,WOOL:35,TNT:36,LANTERN:37,
  SANDSTONE:38,MAGMA:39,BONE:40,PINE_LOG:41,ICE_SPIKE:42};

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
];

const SPLASHES=['Cày cuốc làm giàu!','Xây đắp ước mơ!','Sinh tồn là số 1!','Khám phá thế giới!','Đào sâu tìm kho báu!','Đêm tối rùng rợn!','Chế tạo vũ khí!','Kim cương ở phía dưới!','Zombie đang đến!','Heo con đáng yêu!','TNT goes BOOM!','Giáp kim cương OP!','Lò nung thời đại!','Nấm độc? Thử xem!','Xương rồng ngứa lắm!'];

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
let skinData={face:'#F5C8A0',hair:'#3A2008',eye:'#222222',shirt:'#4080C0',pants:'#2A3A60',shoe:'#2A1808'};
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
const world=new Uint8Array(WW*WH);
let heightMap=[];
function getB(x,y){return(x<0||x>=WW||y<0||y>=WH)?B.BEDROCK:world[y*WW+x];}
function setB(x,y,t){if(x>=0&&x<WW&&y>=0&&y<WH)world[y*WW+x]=t;}
function solid(x,y){const b=getB(x,y);return b?(BD[b]?BD[b].s:true):false;}

function generateCaves(){
  for(let y=46;y<WH-6;y++){
    for(let x=4;x<WW-4;x++){
      if(world[y*WW+x]!==B.STONE)continue;
      if(Math.random()<0.0018){
        const cw=3+Math.floor(Math.random()*3);
        const ch=2+Math.floor(Math.random()*2);
        for(let dy=0;dy<ch;dy++)for(let dx=0;dx<cw;dx++){
          const nx=x+dx,ny=y+dy;
          if(nx>=1&&nx<WW-1&&ny>=1&&ny<WH-2&&world[ny*WW+nx]!==B.BEDROCK)
            world[ny*WW+nx]=B.AIR;
        }
        for(let dy=-1;dy<=ch;dy++)for(let dx=-1;dx<=cw;dx++){
          const nx=x+dx,ny=y+dy;
          if(nx<1||nx>=WW-1||ny<1||ny>=WH-2)continue;
          if(world[ny*WW+nx]!==B.STONE)continue;
          const depth=ny-(heightMap[nx]||60);const r=Math.random();
          if(r<0.18&&depth>6)world[ny*WW+nx]=B.COAL;
          else if(r<0.26&&depth>12)world[ny*WW+nx]=B.IRON;
          else if(r<0.30&&depth>24)world[ny*WW+nx]=B.COPPER_ORE;
          else if(r<0.33&&depth>30)world[ny*WW+nx]=B.GOLD;
          else if(r<0.35&&depth>38)world[ny*WW+nx]=B.DIAMOND_ORE;
          else if(r<0.37&&depth>28)world[ny*WW+nx]=B.EMERALD_ORE;
        }
      }
    }
  }
}

function generateWaterLakes(){
  for(let y=15;y<WH-5;y++)for(let x=5;x<WW-5;x++){
    if(world[y*WW+x]===B.AIR&&world[(y-1)*WW+x]!==B.AIR){
      if(Math.random()<0.008){
        for(let dy=0;dy<4;dy++)for(let dx=-3;dx<=3;dx++){
          const fy=y+dy,fx=x+dx;
          if(fy>=0&&fy<WH&&fx>=0&&fx<WW&&world[fy*WW+fx]===B.AIR)world[fy*WW+fx]=B.WATER;
        }
      }
    }
  }
}

function generateWorld(){
  world.fill(0);heightMap=[];
  for(let x=0;x<WW;x++){
    let h=56;h+=Math.sin(x*0.035)*8+Math.sin(x*0.012)*14+Math.sin(x*0.09)*2.5+Math.cos(x*0.22)*1.5;
    heightMap.push(Math.round(h));
  }
  for(let x=0;x<WW;x++){
    const sh=heightMap[x];
    for(let y=0;y<WH;y++){
      if(y<sh){world[y*WW+x]=B.AIR;continue;}
      if(y===sh){world[y*WW+x]=B.GRASS;continue;}
      if(y<sh+4){world[y*WW+x]=B.DIRT;continue;}
      if(y<sh+6){world[y*WW+x]=Math.random()<0.55?B.DIRT:B.STONE;continue;}
      world[y*WW+x]=B.STONE;
      const r=Math.random();
      if(r<0.042&&y>sh+7)world[y*WW+x]=B.COAL;
      else if(r<0.020&&y>sh+14)world[y*WW+x]=B.IRON;
      else if(r<0.007&&y>sh+28)world[y*WW+x]=B.GOLD;
      else if(r<0.004&&y>sh+40)world[y*WW+x]=B.DIAMOND_ORE;
      else if(r<0.005&&y>sh+22)world[y*WW+x]=B.EMERALD_ORE;
      else if(r<0.015&&y>sh+10)world[y*WW+x]=B.COPPER_ORE;
      else if(r<0.010&&y>sh+8)world[y*WW+x]=B.GRAVEL;
      else if(r<0.006&&y>sh+12)world[y*WW+x]=B.CLAY;
      else if(r<0.003&&y>sh+50)world[y*WW+x]=B.OBSIDIAN;
      else if(r<0.002&&y>sh+6)world[y*WW+x]=B.MOSS_STONE;
      else if(r<0.008&&y>sh+55)world[y*WW+x]=B.MAGMA;
      else if(r<0.003&&y>sh+30)world[y*WW+x]=B.BONE;
    }
    world[(WH-1)*WW+x]=B.BEDROCK;
    if(Math.random()<0.5)world[(WH-2)*WW+x]=B.BEDROCK;
  }
  generateCaves();generateWaterLakes();
  for(let sx=15;sx<WW-15;sx+=Math.floor(28+Math.random()*35)){
    for(let dx=-5;dx<=5;dx++){
      const lx=sx+dx;if(lx<0||lx>=WW)continue;
      for(let dy=0;dy<=2;dy++){
        const bt=getB(lx,heightMap[lx]+dy);
        if(bt===B.GRASS||bt===B.DIRT)setB(lx,heightMap[lx]+dy,B.SAND);
      }
    }
  }
  for(let x=4;x<WW-4;x++){
    if(Math.random()<0.075&&getB(x,heightMap[x])===B.GRASS){
      const sh=heightMap[x],th=4+Math.floor(Math.random()*3);
      for(let ty=sh-th;ty<sh;ty++)setB(x,ty,B.LOG);
      const tip=sh-th;
      [{dy:-3,hw:0},{dy:-2,hw:1},{dy:-1,hw:2},{dy:0,hw:2}].forEach(({dy,hw})=>{
        for(let lx=-hw;lx<=hw;lx++){const fx=x+lx,fy=tip+dy;if(fx>=0&&fx<WW&&fy>=0&&fy<WH&&getB(fx,fy)===B.AIR)setB(fx,fy,B.LEAVES);}
      });
    }
  }
  for(let x=2;x<WW-2;x++){
    if(Math.random()<0.04&&getB(x,heightMap[x])===B.GRASS&&getB(x,heightMap[x]-1)===B.AIR)
      setB(x,heightMap[x]-1,Math.random()<0.5?B.FLOWER_R:B.FLOWER_Y);
  }
  for(let y=10;y<WH-5;y++)for(let x=2;x<WW-2;x++){
    if(world[y*WW+x]===B.AIR&&world[(y+1)*WW+x]!==B.AIR&&Math.random()<0.001)world[y*WW+x]=B.MUSHROOM;
  }
  for(let x=5;x<WW-5;x++){
    if(Math.random()<0.02&&getB(x,heightMap[x])===B.SAND){
      const sh=heightMap[x];const ch=2+Math.floor(Math.random()*2);
      for(let dy=1;dy<=ch;dy++)if(getB(x,sh-dy)===B.AIR)setB(x,sh-dy,B.CACTUS);
    }
  }
  for(let x=5;x<WW-5;x++){
    if(Math.random()<0.008&&getB(x,heightMap[x])===B.GRASS&&getB(x,heightMap[x]-1)===B.AIR)
      setB(x,heightMap[x]-1,B.PUMPKIN);
  }
  const snowCenter=Math.floor(WW*0.15+Math.random()*WW*0.1);
  for(let x=snowCenter;x<snowCenter+40+Math.floor(Math.random()*30)&&x<WW;x++){
    const sh=heightMap[x];
    if(getB(x,sh)===B.GRASS){setB(x,sh,B.SNOW);for(let dy=1;dy<3;dy++)if(getB(x,sh+dy)===B.DIRT)setB(x,sh+dy,B.SNOW);}
    for(let y=0;y<WH;y++){if(world[y*WW+x]===B.WATER&&y===sh-1)world[y*WW+x]=B.ICE;}
  }
  const snowCenter2=Math.floor(WW*0.75+Math.random()*WW*0.1);
  for(let x=snowCenter2;x<snowCenter2+30+Math.floor(Math.random()*25)&&x<WW;x++){
    const sh=heightMap[x];
    if(getB(x,sh)===B.GRASS){setB(x,sh,B.SNOW);for(let dy=1;dy<2;dy++)if(getB(x,sh+dy)===B.DIRT)setB(x,sh+dy,B.SNOW);}
  }
  // Sandstone under sand biomes
  for(let x=0;x<WW;x++){
    const sh=heightMap[x];
    if(getB(x,sh)===B.SAND||getB(x,sh+1)===B.SAND){
      for(let dy=3;dy<10;dy++){if(getB(x,sh+dy)===B.STONE||getB(x,sh+dy)===B.DIRT)setB(x,sh+dy,B.SANDSTONE);}
    }
  }
  // Pine trees in snow biomes (reuse snow zone x positions)
  for(let x=4;x<WW-4;x++){
    if(Math.random()<0.06&&(getB(x,heightMap[x])===B.SNOW)){
      const sh=heightMap[x],th=5+Math.floor(Math.random()*3);
      for(let ty=sh-th;ty<sh;ty++)setB(x,ty,B.PINE_LOG);
      const tip=sh-th;
      // Thinner pointed pine shape
      [{dy:-4,hw:0},{dy:-3,hw:1},{dy:-2,hw:2},{dy:-1,hw:2},{dy:0,hw:1}].forEach(({dy,hw})=>{
        for(let lx=-hw;lx<=hw;lx++){const fx=x+lx,fy=tip+dy;if(fx>=0&&fx<WW&&fy>=0&&fy<WH&&getB(fx,fy)===B.AIR)setB(fx,fy,B.LEAVES);}
      });
    }
  }
  for(let x=0;x<WW;x++)for(let y=0;y<WH;y++)if(solid(x,y)){heightMap[x]=y;break;}
}

const MAX_SLOTS=5;
function compressWorld(){const runs=[];let cur=world[0],cnt=1;for(let i=1;i<world.length;i++){if(world[i]===cur&&cnt<255)cnt++;else{runs.push(cnt,cur);cur=world[i];cnt=1;}}runs.push(cnt,cur);return runs;}
function decompressWorld(runs){let idx=0;for(let i=0;i<runs.length;i+=2){const cnt=runs[i],val=runs[i+1];for(let j=0;j<cnt;j++){if(idx<world.length)world[idx++]=val;}}}
function saveWorld(slot){try{const data={world:compressWorld(),px:player.x,py:player.y,health:player.health,hunger:player.hunger,inv:inv.map(s=>s?{k:s.key,c:s.count}:null),dayT:dayT,heightMap:heightMap,chests:Object.fromEntries(Object.entries(chestInvs).map(([k,v])=>[k,v.map(s=>s?{k:s.key,c:s.count}:null)])),timestamp:Date.now()};localStorage.setItem('ps_slot_'+slot,JSON.stringify(data));return true;}catch(e){return false;}}
function loadWorld(slot){try{const raw=localStorage.getItem('ps_slot_'+slot);if(!raw)return false;const data=JSON.parse(raw);decompressWorld(data.world);player.x=data.px;player.y=data.py;player.vx=0;player.vy=0;player.health=data.health;player.hunger=data.hunger;player.isDead=false;for(let i=0;i<inv.length;i++)inv[i]=data.inv[i]?{key:data.inv[i].k,count:data.inv[i].c}:null;dayT=data.dayT||0.35;if(data.heightMap)heightMap=data.heightMap;if(data.chests){for(const[k,v]of Object.entries(data.chests)){chestInvs[k]=v.map(s=>s?{key:s.k,count:s.c}:null);}}cam.x=player.x-W/2;cam.y=player.y-H/2;return true;}catch(e){return false;}}
function deleteWorldSlot(slot){try{localStorage.removeItem('ps_slot_'+slot);}catch(e){}}
function hasSave(slot){try{return!!localStorage.getItem('ps_slot_'+slot);}catch(e){return false;}}
function getSaveInfo(slot){try{const d=JSON.parse(localStorage.getItem('ps_slot_'+slot));return d?{time:d.timestamp||0}:null;}catch(e){return null;}}
let autoSaveTimer=0;
const AUTO_SAVE_INTERVAL=120000;

const particles=[];

// ===== DROP SYSTEM =====
const drops=[];
function spawnDrop(bx,by,key,count=1){
  if(!key)return;
  // Start at center of broken block
  let sx=bx*BS+BS/2, sy=by*BS+BS/2;
  let vx=(Math.random()-0.5)*2.4;
  let vy=-3.5-Math.random()*2.0;
  // If there's a solid block above, don't launch upward — eject sideways/downward
  const blockedAbove=solid(bx,by-1);
  const blockedLeft=solid(bx-1,by);
  const blockedRight=solid(bx+1,by);
  const blockedBelow=solid(bx,by+1);
  if(blockedAbove){
    vy=0.5+Math.random()*0.5; // fall down instead
    if(blockedLeft&&!blockedRight) vx=1.5+Math.random();
    else if(blockedRight&&!blockedLeft) vx=-1.5-Math.random();
    else vx=(Math.random()-0.5)*1.5;
  }
  if(blockedBelow&&blockedAbove){
    // Fully enclosed horizontally — just drop in place gently
    vy=0; vx=(Math.random()-0.5)*0.5;
    sy=by*BS; // top of block so it can fall out
  }
  drops.push({x:sx,y:sy,vx,vy,key,count,age:0,delay:500,bobOff:Math.random()*Math.PI*2,landed:false});
}
function updateDrops(dt){
  const s=dt/16.667;
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];
    d.age+=dt;
    d.delay=Math.max(0,d.delay-dt);
    // Physics
    d.vy+=GRAV*s*0.72;
    if(d.vy>12)d.vy=12;
    d.x+=d.vx*s;
    d.y+=d.vy*s;
    // Collision with ground
    const dbx=Math.floor(d.x/BS);
    const dby=Math.floor((d.y+8)/BS);
    if(solid(dbx,dby)){
      d.y=dby*BS-8;
      d.vy*=-0.3;
      d.vx*=0.75;
      if(Math.abs(d.vy)<0.9)d.vy=0;
      if(Math.abs(d.vx)<0.18)d.vx=0;
      d.landed=true;
    }
    // Wall collision
    const lbx=Math.floor((d.x-6)/BS),rbx=Math.floor((d.x+6)/BS);
    if(solid(lbx,Math.floor(d.y/BS)))d.vx=Math.abs(d.vx);
    if(solid(rbx,Math.floor(d.y/BS)))d.vx=-Math.abs(d.vx);
    // Collect when player walks over
    if(d.delay<=0&&!player.isDead){
      const px=player.x+player.w/2,py=player.y+player.h/2;
      const dist=Math.sqrt((d.x-px)**2+(d.y-py)**2);
      if(dist<36){
        if(addItem(d.key,d.count)){
          sndPickup();
          spawnWorldParticles(d.x,d.y,'#88FFAA',3);
          drops.splice(i,1);
          continue;
        }
      }
    }
    // Despawn after 5 minutes
    if(d.age>300000)drops.splice(i,1);
  }
}
function drawDrops(){
  for(const d of drops){
    const sx=d.x-cam.x;
    const bob=(d.landed&&d.vy===0)?Math.sin(d.age*0.0038+d.bobOff)*3:0;
    const sy=d.y-cam.y+bob;
    if(sx<-24||sx>W+24||sy<-24||sy>H+24)continue;
    const sz=16;
    // Ground shadow
    if(d.landed){
      ctx.fillStyle='rgba(0,0,0,0.22)';
      ctx.beginPath();
      ctx.ellipse(sx,d.y-cam.y+9,7,2.5,0,0,Math.PI*2);
      ctx.fill();
    }
    // Item sprite (small)
    ctx.save();
    ctx.translate(sx-sz/2,sy-sz/2);
    drawItemSprite(0,0,d.key,sz);
    ctx.restore();
    // Glow outline when ready to pick up
    if(d.delay<=0){
      const pulse=0.4+0.35*Math.abs(Math.sin(d.age*0.006));
      ctx.strokeStyle=`rgba(255,255,140,${pulse})`;
      ctx.lineWidth=1.5;
      ctx.strokeRect(sx-sz/2-1,sy-sz/2-1,sz+2,sz+2);
      ctx.lineWidth=1;
    }
    // Count label if stacked
    if(d.count>1){
      ctx.fillStyle='rgba(0,0,0,0.65)';
      ctx.fillRect(sx+sz/2-12,sy+sz/2-8,12,9);
      ctx.fillStyle='#fff';
      ctx.font='bold 8px "Courier New"';
      ctx.fillText(d.count,sx+sz/2-10,sy+sz/2-1);
    }
  }
}
// ===== END DROP SYSTEM =====

function spawnParticles(wx,wy,color,n=6){for(let i=0;i<n;i++)particles.push({x:wx*BS+Math.random()*BS,y:wy*BS+Math.random()*BS,vx:(Math.random()-0.5)*3,vy:-Math.random()*4-1,life:1,color});}
function spawnWorldParticles(wx,wy,color,n=4){for(let i=0;i<n;i++)particles.push({x:wx+Math.random()*8-4,y:wy+Math.random()*8-4,vx:(Math.random()-0.5)*2,vy:-Math.random()*2-1,life:0.7,color});}
function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.vy+=0.2;p.x+=p.vx;p.y+=p.vy;p.life-=dt/800;if(p.life<=0)particles.splice(i,1);}}
function drawParticles(){for(const p of particles){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x-cam.x,p.y-cam.y,4,4);}ctx.globalAlpha=1;}

const inv=new Array(HS+18).fill(null);let hotIdx=0;
function getHeld(){const s=inv[hotIdx];return s?IT[s.key]:null;}
function getArmorDef(){let d=0;for(let i=HS;i<inv.length;i++)if(inv[i]&&IT[inv[i].key]?.armor)d+=IT[inv[i].key].def;return d;}
function countItem(key){let t=0;for(const s of inv)if(s&&s.key===key)t+=s.count;return t;}
function addItem(key,count=1){for(let i=0;i<inv.length;i++){if(inv[i]&&inv[i].key===key&&inv[i].count<64){const space=64-inv[i].count,add=Math.min(space,count);inv[i].count+=add;count-=add;if(count<=0)return true;}}for(let i=0;i<inv.length;i++){if(!inv[i]){const add=Math.min(64,count);inv[i]={key,count:add};count-=add;if(count<=0)return true;}}return count<=0;}
function removeItem(key,count=1){let rem=count;for(let i=0;i<inv.length;i++){if(inv[i]&&inv[i].key===key){const take=Math.min(inv[i].count,rem);inv[i].count-=take;rem-=take;if(inv[i].count<=0)inv[i]=null;if(rem<=0)return true;}}return false;}

const cam={x:0,y:0};
let screenShakeX=0,screenShakeY=0,shakeDecay=0;
function triggerScreenShake(intensity,duration){const angle=Math.random()*Math.PI*2;screenShakeX=Math.cos(angle)*intensity;screenShakeY=Math.sin(angle)*intensity*0.6;shakeDecay=duration/16.667;}
function updateCam(){const f=1-Math.pow(0.00001,1/60);cam.x+=(player.x+player.w/2-W/2-cam.x)*f;cam.y+=(player.y+player.h/2-H/2-cam.y)*f;
  if(shakeDecay>0){cam.x+=screenShakeX;cam.y+=screenShakeY;screenShakeX*=(1-shakeDecay/100);screenShakeY*=(1-shakeDecay/100);shakeDecay-=3;if(shakeDecay<=0){screenShakeX=0;screenShakeY=0;shakeDecay=0;}}
  cam.x=Math.max(0,Math.min(WW*BS-W,cam.x));cam.y=Math.max(0,Math.min(WH*BS-H,cam.y));}

let spawnBX=Math.floor(WW/2),spawnBY=0;
const player={x:0,y:0,w:26,h:54,vx:0,vy:0,onGround:false,facing:1,health:100,maxHealth:100,hunger:100,maxHunger:100,isDead:false};
function initPlayerSpawn(){spawnBX=Math.floor(WW/2);for(let y=0;y<WH;y++)if(solid(spawnBX,y)){spawnBY=y-2;break;}player.x=spawnBX*BS-13;player.y=spawnBY*BS;cam.x=player.x-W/2;cam.y=player.y-H/2;}
function respawnPlayer(){player.health=player.maxHealth;player.hunger=player.maxHunger;player.isDead=false;player.x=spawnBX*BS-13;player.y=spawnBY*BS;player.vy=0;player.vx=0;}

let walkCycle=0,walkAmp=0,minePhase=0,mineAmp=0;
let isPlacing=false,placeTimer=0;const PLACE_DUR=800;
let isEating=false,eatTimer=0;const EAT_DUR=800;let eatColor=null;
let dmgFlash=0;const placeEffects=[];let mineSoundCD=0;
let jumpSquash=0,wasOnGround=true,airTime=0;
// --- new animation state ---
let bodyTilt=0;          // smooth lean angle when walking
let moveBounce=0;        // vertical bounce on start/stop
let prevWalkAmp=0;       // detect amp change
let walkBob=0;           // vertical body bob while walking
let headPitch=0;         // smooth head look-at angle (up/down)
let hungerTickTimer=3000+Math.random()*2000;
let bookOpen=false,bookAnim=0,bookPage=0,bookTarget=0;
const BOOK_PAGES=[
  {title:'Công Cụ Gỗ',recipes:['WOOD_PICK','WOOD_AXE','WOOD_SWORD']},
  {title:'Công Cụ Đá & Sắt',recipes:['STONE_PICK','IRON_PICK','IRON_AXE']},
  {title:'Công Cụ Kim Cương',recipes:['DIAMOND_PICK','DIAMOND_AXE','DIAMOND_SWORD']},
  {title:'Vũ Khí & Cung',recipes:['IRON_SWORD','DIAMOND_SWORD','BOW']},
  {title:'Xây Dựng',recipes:['PLANK','STICK','TORCH']},
  {title:'Đồ Dùng',recipes:['BENCH','FURNACE','CHEST']},
  {title:'Giường & Kính',recipes:['BED','GLASS','BOOKSHELF']},
  {title:'Giáp Bảo Vệ',recipes:['IRON_CHESTPLATE','DIAMOND_CHESTPLATE','SHIELD']},
  {title:'Đặc Biệt',recipes:['GOLDEN_APPLE','BUCKET','FLINT']},
  {title:'Mới & Đặc Biệt',recipes:['LANTERN','ROPE','POTION']},
];

const craftGrid=new Array(9).fill(null);
let cursorItem=null,craftOpen=false,craftOutput=null;
function normPattern(g){let mr=3,xr=-1,mc=3,xc=-1;for(let r=0;r<3;r++)for(let c=0;c<3;c++)if(g[r][c]){mr=Math.min(mr,r);xr=Math.max(xr,r);mc=Math.min(mc,c);xc=Math.max(xc,c);}if(xr<0)return null;const res=[];for(let r=mr;r<=xr;r++){const row=[];for(let c=mc;c<=xc;c++)row.push(g[r][c]);res.push(row);}return res;}
function patternsEqual(a,b){if(!a||!b||a.length!==b.length)return false;for(let r=0;r<a.length;r++){if(a[r].length!==b[r].length)return false;for(let c=0;c<a[r].length;c++)if(a[r][c]!==b[r][c])return false;}return true;}
function checkCraftRecipe(){const g=[];for(let r=0;r<3;r++){const row=[];for(let c=0;c<3;c++){const s=craftGrid[r*3+c];row.push(s?s.key:null);}g.push(row);}const n=normPattern(g);if(!n){craftOutput=null;return;}for(const recipe of RECIPES){const rn=normPattern(recipe.p);if(patternsEqual(n,rn)){craftOutput=recipe;return;}}craftOutput=null;}
function doCraft(){if(!craftOutput)return;const ok=craftOutput.o,oc=craftOutput.cnt;if(cursorItem){if(cursorItem.key!==ok||cursorItem.count+oc>64)return;}for(let i=0;i<9;i++){if(craftGrid[i]){craftGrid[i].count--;if(craftGrid[i].count<=0)craftGrid[i]=null;}}if(cursorItem)cursorItem.count+=oc;else cursorItem={key:ok,count:oc};sndCraft();checkCraftRecipe();}
function returnGridToInv(){for(let i=0;i<9;i++){if(craftGrid[i]){addItem(craftGrid[i].key,craftGrid[i].count);craftGrid[i]=null;}}checkCraftRecipe();}
function returnCursorToInv(){if(cursorItem){addItem(cursorItem.key,cursorItem.count);cursorItem=null;}}
function closeCraftUI(){returnGridToInv();returnCursorToInv();craftOpen=false;}

let furnaceOpen=false;
const furnData={input:null,fuel:null,output:null,progress:0,fuelLeft:0,smeltTime:0};
let chestOpen=false;
const chestInvs={};
let chestPos=null,chestCursorItem=null;
function getChestInv(cx,cy){const k=cx+','+cy;if(!chestInvs[k])chestInvs[k]=new Array(27).fill(null);return chestInvs[k];}
function openChest(cx,cy){chestOpen=true;chestPos={x:cx,y:cy};sndClick();}
function closeChest(){if(chestCursorItem){addItem(chestCursorItem.key,chestCursorItem.count);chestCursorItem=null;}chestOpen=false;chestPos=null;}
const CCI={px:0,py:0,pw:0,ph:0};
function calcChestLayout(){const cw=9*(CS+CG)-CG+40,ch=CS*5+CG*4+70;CCI.px=(W-cw)/2;CCI.py=(H-ch)/2;CCI.pw=cw;CCI.ph=ch;}
function getChestSlotAt(mx,my){
  calcChestLayout();const{px,py}=CCI;
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){
    const sx=px+20+c*(CS+CG),sy=py+40+r*(CS+CG);
    if(mx>=sx&&mx<sx+CS&&my>=sy&&my<sy+CS)return{type:'chest',idx:r*9+c};}
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){
    const sx=px+20+c*(CS+CG),sy=py+40+3*(CS+CG)+20+r*(CS+CG);
    if(mx>=sx&&mx<sx+CS&&my>=sy&&my<sy+CS)return{type:'inv',idx:r*9+c};}
  return null;}
function handleChestClick(mx,my,isRight){
  const slot=getChestSlotAt(mx,my);if(!slot)return;sndClick();
  const chestArr=getChestInv(chestPos.x,chestPos.y);
  const arr=slot.type==='chest'?chestArr:inv;
  const slotData=arr[slot.idx];
  if(isRight){
    if(chestCursorItem){if(slotData){if(slotData.key===chestCursorItem.key&&slotData.count<64){slotData.count++;chestCursorItem.count--;if(chestCursorItem.count<=0)chestCursorItem=null;}}else{arr[slot.idx]={key:chestCursorItem.key,count:1};chestCursorItem.count--;if(chestCursorItem.count<=0)chestCursorItem=null;}}
    else if(slotData&&slotData.count>0){const half=Math.ceil(slotData.count/2);chestCursorItem={key:slotData.key,count:half};slotData.count-=half;if(slotData.count<=0)arr[slot.idx]=null;}
  }else{
    if(chestCursorItem){if(slotData){if(slotData.key===chestCursorItem.key){const sp=64-slotData.count,tr=Math.min(sp,chestCursorItem.count);slotData.count+=tr;chestCursorItem.count-=tr;if(chestCursorItem.count<=0)chestCursorItem=null;}else{const tmp={key:slotData.key,count:slotData.count};arr[slot.idx]={key:chestCursorItem.key,count:chestCursorItem.count};chestCursorItem=tmp;}}else{arr[slot.idx]={key:chestCursorItem.key,count:chestCursorItem.count};chestCursorItem=null;}}
    else if(slotData){chestCursorItem={key:slotData.key,count:slotData.count};arr[slot.idx]=null;}
  }
}
function drawChestUI(){
  calcChestLayout();const{px,py,pw,ph}=CCI;
  const chestArr=getChestInv(chestPos.x,chestPos.y);
  ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1a1a2e';ctx.fillRect(px,py,pw,ph);
  ctx.strokeStyle='#8A5A20';ctx.lineWidth=2;ctx.strokeRect(px,py,pw,ph);ctx.lineWidth=1;
  ctx.fillStyle='#D4A030';ctx.font='bold 14px "Courier New"';ctx.fillText('📦 Rương',px+16,py+24);
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){
    const sx=px+20+c*(CS+CG),sy=py+40+r*(CS+CG);
    ctx.fillStyle='#0c0c1c';ctx.fillRect(sx,sy,CS,CS);ctx.strokeStyle='#5A3A10';ctx.strokeRect(sx,sy,CS,CS);
    const item=chestArr[r*9+c];if(item)drawCraftItem(sx,sy,item,CS);}
  ctx.fillStyle='#5A3A10';ctx.fillRect(px+14,py+40+3*(CS+CG)+8,pw-28,1);
  ctx.fillStyle='#6a6a8a';ctx.font='11px "Courier New"';ctx.fillText('Hành Trang',px+20,py+40+3*(CS+CG)+18);
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){
    const sx=px+20+c*(CS+CG),sy=py+40+3*(CS+CG)+20+r*(CS+CG),idx=r*9+c;
    ctx.fillStyle=idx===hotIdx?'#1a1a3e':'#0c0c1c';ctx.fillRect(sx,sy,CS,CS);
    ctx.strokeStyle=idx===hotIdx?'#6688cc':'#3a3a5a';ctx.strokeRect(sx,sy,CS,CS);
    const item=inv[idx];if(item)drawCraftItem(sx,sy,item,CS);}
  if(chestCursorItem)drawCraftItem(mouseX-20,mouseY-20,chestCursorItem,CS);
  ctx.fillStyle='#555';ctx.font='10px "Courier New"';ctx.fillText('E/ESC đóng | Click: lấy/đặt | Phải: đặt 1/lấy nửa',px+16,py+ph-12);
}
function openFurnace(){furnaceOpen=true;furnData.input=null;furnData.fuel=null;furnData.output=null;furnData.progress=0;furnData.fuelLeft=0;furnData.smeltTime=0;document.getElementById('furnace-overlay').style.display='flex';updateFurnaceUI();}
function closeFurnace(){if(furnData.input)addItem(furnData.input.key,furnData.input.count);if(furnData.fuel)addItem(furnData.fuel.key,furnData.fuel.count);if(furnData.output)addItem(furnData.output.key,furnData.output.count);furnData.input=null;furnData.fuel=null;furnData.output=null;furnaceOpen=false;document.getElementById('furnace-overlay').style.display='none';}
function furnaceClick(slot){sndClick();const fuelKeys=['COAL','LOG','PLANK','STICK','WOOD_PICK','WOOD_AXE','WOOD_SWORD'];
  if(slot==='input'){if(cursorItem){if(!furnData.input){furnData.input={key:cursorItem.key,count:1};cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}else if(furnData.input.key===cursorItem.key&&furnData.input.count<64){furnData.input.count++;cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}}else if(furnData.input){cursorItem={key:furnData.input.key,count:furnData.input.count};furnData.input=null;}}
  else if(slot==='fuel'){if(cursorItem){if(fuelKeys.includes(cursorItem.key)){if(!furnData.fuel){furnData.fuel={key:cursorItem.key,count:1};cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}else if(furnData.fuel.key===cursorItem.key&&furnData.fuel.count<64){furnData.fuel.count++;cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}}}else if(furnData.fuel){cursorItem={key:furnData.fuel.key,count:furnData.fuel.count};furnData.fuel=null;}}
  else if(slot==='output'){if(furnData.output){if(!cursorItem){cursorItem={key:furnData.output.key,count:furnData.output.count};furnData.output=null;}else if(cursorItem.key===furnData.output.key&&cursorItem.count+furnData.output.count<=64){cursorItem.count+=furnData.output.count;furnData.output=null;}}}
  updateFurnaceUI();}
function updateFurnace(dt){if(!furnaceOpen)return;if(furnData.fuelLeft>0)furnData.fuelLeft-=dt;if(furnData.fuelLeft<=0&&furnData.fuel&&furnData.fuel.count>0){furnData.fuelLeft=3000;furnData.fuel.count--;if(furnData.fuel.count<=0)furnData.fuel=null;}if(furnData.input&&furnData.fuelLeft>0&&SMELT[furnData.input.key]){const recipe=SMELT[furnData.input.key];furnData.smeltTime+=dt;if(furnData.smeltTime>=recipe.time){furnData.smeltTime=0;furnData.input.count--;if(furnData.input.count<=0)furnData.input=null;if(!furnData.output)furnData.output={key:recipe.out,count:1};else if(furnData.output.key===recipe.out&&furnData.output.count<64)furnData.output.count++;else addItem(recipe.out,1);}}else{furnData.smeltTime=0;}updateFurnaceUI();}
function updateFurnaceUI(){
  const fi=document.getElementById('furn-input');
  const ff=document.getElementById('furn-fuel');
  const fo=document.getElementById('furn-output');
  fi.innerHTML=furnData.input?`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${IT[furnData.input.key]?.c||'#888'};font-size:10px;color:#fff;">${furnData.input.count>1?furnData.input.count:''}</div>`:'';
  ff.innerHTML=furnData.fuel?`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${IT[furnData.fuel.key]?.c||'#888'};font-size:10px;color:#fff;">${furnData.fuel.count>1?furnData.fuel.count:''}</div>`:'';
  fo.innerHTML=furnData.output?`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${IT[furnData.output.key]?.c||'#888'};font-size:10px;color:#fff;">${furnData.output.count>1?furnData.output.count:''}</div>`:'';
  document.getElementById('furn-fuel-bar').style.width=furnData.fuelLeft>0?((furnData.fuelLeft/3000)*100)+'%':'0%';
  const progBar=document.getElementById('furn-progress-bar');
  if(furnData.input&&furnData.fuelLeft>0&&SMELT[furnData.input.key])progBar.style.width=Math.floor(furnData.smeltTime/SMELT[furnData.input.key].time*100)+'%';
  else progBar.style.width='0%';
}

const CS=42,CG=4;
const CUI={gridX:0,gridY:0,arrowX:0,arrowY:0,outX:0,outY:0,invX:0,invY:0,px:0,py:0,pw:0,ph:0};
function calcCraftLayout(){const gridW=3*CS+2*CG,arrowW=48,outW=CS,topRowW=gridW+arrowW+outW+CG*2,invW=9*CS+8*CG;const maxW=Math.max(topRowW,invW),totalW=maxW+40,totalH=CS*3+CG*2+30+CS*3+CG*2+50+40;CUI.px=(W-totalW)/2;CUI.py=(H-totalH)/2;CUI.pw=totalW;CUI.ph=totalH;CUI.gridX=CUI.px+20;CUI.gridY=CUI.py+40;CUI.arrowX=CUI.gridX+gridW+CG;CUI.arrowY=CUI.gridY+CS+CG;CUI.outX=CUI.arrowX+arrowW+CG;CUI.outY=CUI.gridY+CS;CUI.invX=CUI.px+(totalW-invW)/2;CUI.invY=CUI.gridY+CS*3+CG*2+30;}
function getCraftSlotAt(mx,my){for(let r=0;r<3;r++)for(let c=0;c<3;c++){const sx=CUI.gridX+c*(CS+CG),sy=CUI.gridY+r*(CS+CG);if(mx>=sx&&mx<sx+CS&&my>=sy&&my<sy+CS)return{type:'grid',idx:r*3+c};}if(mx>=CUI.outX&&mx<CUI.outX+CS&&my>=CUI.outY&&my<CUI.outY+CS)return{type:'output'};for(let r=0;r<3;r++)for(let c=0;c<9;c++){const sx=CUI.invX+c*(CS+CG),sy=CUI.invY+r*(CS+CG);if(mx>=sx&&mx<sx+CS&&my>=sy&&my<sy+CS)return{type:'inv',idx:r*9+c};}return null;}
function handleCraftClick(mx,my,isRight){const slot=getCraftSlotAt(mx,my);if(!slot)return;sndClick();if(slot.type==='output'){if(!isRight&&craftOutput)doCraft();return;}const slotData=slot.type==='grid'?craftGrid[slot.idx]:inv[slot.idx];if(isRight){if(cursorItem){if(slotData){if(slotData.key===cursorItem.key&&slotData.count<64){slotData.count++;cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}}else{const t=slot.type==='grid'?craftGrid:inv;t[slot.idx]={key:cursorItem.key,count:1};cursorItem.count--;if(cursorItem.count<=0)cursorItem=null;}}else if(slotData&&slotData.count>0){const half=Math.ceil(slotData.count/2);cursorItem={key:slotData.key,count:half};slotData.count-=half;if(slotData.count<=0){if(slot.type==='grid')craftGrid[slot.idx]=null;else inv[slot.idx]=null;}}}else{if(cursorItem){if(slotData){if(slotData.key===cursorItem.key){const sp=64-slotData.count,tr=Math.min(sp,cursorItem.count);slotData.count+=tr;cursorItem.count-=tr;if(cursorItem.count<=0)cursorItem=null;}else{const t=slot.type==='grid'?craftGrid:inv;const tmp={key:slotData.key,count:slotData.count};t[slot.idx]={key:cursorItem.key,count:cursorItem.count};cursorItem=tmp;}}else{const t=slot.type==='grid'?craftGrid:inv;t[slot.idx]={key:cursorItem.key,count:cursorItem.count};cursorItem=null;}}else if(slotData){cursorItem={key:slotData.key,count:slotData.count};if(slot.type==='grid')craftGrid[slot.idx]=null;else inv[slot.idx]=null;}}checkCraftRecipe();}

function drawBlockIconAt(px,py,type,sz){
  ctx.save();
  ctx.beginPath();ctx.rect(px,py,sz,sz);ctx.clip();
  ctx.translate(px,py);ctx.scale(sz/BS,sz/BS);
  drawBlockRaw(0,0,type);
  ctx.restore();
}

function drawItemSprite(x,y,key,sz){
  const s=sz/16;const it=IT[key];if(!it)return;
  if(it.block!==undefined){drawBlockIconAt(x,y,it.block,sz);return;}
  const p=(px,py,pw,ph,c)=>{ctx.fillStyle=c;ctx.fillRect(x+px*s,y+py*s,pw*s,ph*s);};
  const c=it.c||'#888';
  const shine='rgba(255,255,255,0.45)';const shadow='rgba(0,0,0,0.35)';
  const handle='#8B5E1A';const handleD='#5A3A0A';
  switch(key){
    case 'WOOD_PICK':case 'STONE_PICK':case 'IRON_PICK':case 'DIAMOND_PICK':
      p(2,2,12,12,c);p(3,3,8,3,shine);p(2,12,12,2,shadow);p(12,2,2,10,shadow);
      ctx.fillStyle='#fff';ctx.font=`${Math.round(8*s)}px "Courier New"`;ctx.textAlign='center';
      ctx.fillText('⛏',x+8*s,y+10*s);ctx.textAlign='left';break;
    case 'WOOD_AXE':case 'IRON_AXE':case 'DIAMOND_AXE':
      p(2,2,12,12,c);p(3,3,8,3,shine);p(2,12,12,2,shadow);p(12,2,2,10,shadow);
      ctx.fillStyle='#fff';ctx.font=`${Math.round(8*s)}px "Courier New"`;ctx.textAlign='center';
      ctx.fillText('🪓',x+8*s,y+10*s);ctx.textAlign='left';break;
    case 'WOOD_SWORD':case 'IRON_SWORD':case 'DIAMOND_SWORD':
      p(2,2,12,12,c);p(3,3,8,3,shine);p(2,12,12,2,shadow);p(12,2,2,10,shadow);
      ctx.fillStyle='#fff';ctx.font=`${Math.round(8*s)}px "Courier New"`;ctx.textAlign='center';
      ctx.fillText('⚔',x+8*s,y+10*s);ctx.textAlign='left';break;
    case 'BOW':
      p(3,1,2,2,handle);p(2,3,2,3,handle);p(2,6,2,3,handle);p(3,9,2,3,handle);p(4,12,2,2,handle);
      p(5,3,1,1,handle);p(5,11,1,1,handle);
      ctx.strokeStyle='#C8B060';ctx.lineWidth=1.2*s;
      ctx.beginPath();ctx.moveTo(x+8*s,y+2*s);ctx.lineTo(x+8*s,y+14*s);ctx.stroke();ctx.lineWidth=1;
      break;
    case 'IRON_INGOT':
      p(3,4,10,8,c);p(4,3,8,1,'#E8E8F0');p(4,12,8,1,shadow);
      p(4,5,6,2,shine);p(3,4,1,8,shadow);break;
    case 'GOLD_INGOT':
      p(3,4,10,8,'#FFD700');p(4,3,8,1,'#FFE840');p(4,12,8,1,'#CC9900');
      p(4,5,6,2,'rgba(255,255,180,0.5)');p(3,4,1,8,shadow);break;
    case 'COPPER_INGOT':
      p(3,4,10,8,'#D08838');p(4,3,8,1,'#E09040');p(4,12,8,1,'#A06020');
      p(4,5,6,2,shine);p(3,4,1,8,shadow);break;
    case 'DIAMOND':
      p(5,2,6,1,'#80FFFF');p(3,3,10,1,'#60EEEE');p(2,4,12,4,'#40E8E8');
      p(2,8,3,3,'#30C8C8');p(5,8,6,5,'#20A8A8');p(11,8,3,3,'#30C8C8');
      p(5,13,6,1,'#10A0A0');p(3,11,2,2,'#30C8C8');p(11,11,2,2,'#30C8C8');
      p(4,4,4,2,'rgba(255,255,255,0.5)');break;
    case 'EMERALD':
      p(5,1,6,2,'#50E870');p(3,3,10,2,'#30D060');p(2,5,12,5,'#20C050');
      p(3,10,10,2,'#18A040');p(5,12,6,2,'#108030');
      p(5,3,3,2,'rgba(255,255,255,0.4)');break;
    case 'COAL':
      p(3,3,10,10,'#2A2A2A');p(4,4,4,4,'#3A3A3A');p(9,8,3,3,'#353535');
      p(4,4,2,1,shine);break;
    case 'STICK':
      p(9,1,2,2,handle);p(8,3,2,2,handle);p(7,5,2,2,handle);p(6,7,2,2,handle);
      p(5,9,2,2,handle);p(4,11,2,2,handle);p(3,13,2,2,handle);
      p(9,1,1,1,shine);p(8,3,1,1,shine);break;
    case 'MEAT':
      p(3,5,10,7,'#E05050');p(4,4,8,1,'#F06060');p(4,12,8,1,'#C04040');
      p(3,5,2,5,'#F08080');p(4,6,4,2,'rgba(255,200,180,0.4)');
      p(11,6,2,5,'#C03030');break;
    case 'COOKED_MEAT':
      p(3,5,10,7,'#A05020');p(4,4,8,1,'#C06030');p(4,12,8,1,'#703810');
      p(3,5,2,4,'#C07040');p(4,6,3,2,'rgba(200,150,80,0.4)');break;
    case 'BREAD':
      p(2,6,12,6,'#C89040');p(3,5,10,2,'#D8A050');p(3,12,10,1,'#A87030');
      p(3,6,3,2,'rgba(255,220,150,0.4)');p(5,7,2,3,'#B07830');break;
    case 'APPLE':
      p(4,3,8,10,'#E03030');p(3,5,2,6,'#C02020');p(11,5,2,6,'#C02020');
      p(5,2,6,2,'#C02020');p(7,1,2,2,'#208020');
      p(5,4,3,3,'rgba(255,150,150,0.4)');break;
    case 'GOLDEN_APPLE':
      p(4,3,8,10,'#FFD700');p(3,5,2,6,'#E0B000');p(11,5,2,6,'#E0B000');
      p(5,2,6,2,'#E0B000');p(7,1,2,2,'#208020');
      p(5,4,3,3,'rgba(255,255,200,0.5)');break;
    case 'MUSHROOM':
      p(4,5,8,6,'#C02020');p(2,7,12,4,'#C02020');p(3,6,2,3,'#C02020');p(11,6,2,3,'#C02020');
      p(5,6,2,2,'#FFFFFF');p(10,7,2,2,'#FFFFFF');
      p(6,11,4,5,'#E0D8C0');break;
    case 'IRON_CHESTPLATE':case 'DIAMOND_CHESTPLATE':
      p(3,2,10,2,c);p(1,4,14,8,c);p(2,12,12,2,c);p(3,14,10,1,c);
      p(6,2,4,1,shadow);
      p(2,5,4,4,shadow);p(10,5,4,4,shadow);
      p(3,5,2,4,shine);p(11,5,2,4,shine);
      p(3,5,8,3,shine);break;
    case 'SHIELD':
      p(3,2,10,12,c);p(2,4,12,8,c);p(5,14,6,1,c);p(6,15,4,1,c);
      p(4,3,8,1,shine);p(3,4,2,6,shine);
      p(7,5,2,8,'#D4A030');break;
    case 'IRON_ORE':
      p(1,1,14,14,'#727272');for(let i=0;i<4;i++)p(2+i*3,3+((i+1)%2)*4,4,4,'#C87A40');break;
    case 'GOLD_ORE':
      p(1,1,14,14,'#6A6A6A');for(let i=0;i<4;i++)p(2+i*3,3+((i+1)%2)*4,4,4,'#FFD700');break;
    case 'COPPER_ORE':
      p(1,1,14,14,'#6A6A60');for(let i=0;i<4;i++)p(2+i*3,3+((i+1)%2)*4,4,4,'#D08030');break;
    case 'LEATHER':
      p(2,3,12,10,'#9A6830');p(3,2,10,2,'#AA7840');p(3,13,10,1,'#7A5020');
      p(3,4,5,3,'rgba(180,130,60,0.4)');break;
    case 'FLINT':
      p(3,2,4,6,'#4A4A4A');p(7,1,5,8,'#3A3A3A');p(5,8,6,5,'#555');p(3,12,5,3,'#404040');
      p(4,3,2,2,shine);break;
    case 'BUCKET':
      p(4,5,8,8,'#A0A0A8');p(3,12,10,2,'#909098');p(3,5,2,7,'#888890');p(11,5,2,7,'#888890');
      p(5,3,6,3,'#C0C0C8');p(4,2,8,1,'#D0D0D8');
      p(5,6,4,2,shine);break;
    case 'SNOW_BALL':
      p(4,4,8,8,'#F0F0FF');p(3,6,2,4,'#E0E0F0');p(11,6,2,4,'#E0E0F0');p(4,3,8,1,'#FFFFFF');
      p(5,5,3,2,shine);break;
    case 'GRAVEL':
      p(1,1,14,14,'#8A7A6A');for(let i=0;i<6;i++)p(1+(i%3)*5,2+Math.floor(i/3)*6,4,4,'#7A6A5A');break;
    case 'CLAY':
      p(1,1,14,14,'#9A90A0');p(3,3,5,5,'#A8A0A8');p(9,8,4,5,'#8A8090');break;
    case 'OBSIDIAN':
      p(1,1,14,14,'#1A0A2A');p(3,3,6,5,'#2A1040');p(10,8,3,4,'#250E38');
      p(3,3,3,1,'rgba(150,80,255,0.3)');break;
    case 'ROPE':
      for(let i=0;i<7;i++)p(5+i%2*4,1+i*2,6,2,'#C8A860');
      for(let i=0;i<7;i++)p(5+i%2*4,2+i*2,1,1,shine);break;
    case 'POTION':
      p(6,1,4,3,'#D0D0D8');
      p(5,4,6,2,'#D0D0D8');
      p(3,6,10,8,'#FF4488');
      p(2,8,1,4,'#FF4488');p(13,8,1,4,'#FF4488');
      p(4,14,8,2,'#CC2068');
      p(5,7,4,3,'rgba(255,200,220,0.5)');
      p(6,1,2,1,shine);break;
    case 'TNT':
      p(2,3,12,10,'#CC1818');p(3,2,10,2,'#888');p(3,13,10,1,'#AA1010');
      p(4,5,8,5,'#E8E8E0');ctx.fillStyle='#222';ctx.font=`bold ${3*s}px "Courier New"`;
      ctx.fillText('TNT',x+3*s,y+10*s);break;
    default:
      p(2,2,12,12,c);p(3,3,8,2,shine);p(2,2,1,10,shadow);
  }
}
function drawCraftItem(x,y,item,sz){const it=IT[item.key];if(!it)return;
  ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(x,y,sz,2);ctx.fillRect(x,y,2,sz);
  ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(x,y+sz-2,sz,2);ctx.fillRect(x+sz-2,y,2,sz);
  drawItemSprite(x,y,item.key,sz);
  if(item.count>1){ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(x+sz-18,y+sz-14,18,12);ctx.fillStyle='#fff';ctx.font='bold 11px "Courier New"';ctx.fillText(item.count,x+sz-16,y+sz-4);}
}
function drawCraftUI(){calcCraftLayout();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#1a1a2e';ctx.fillRect(CUI.px,CUI.py,CUI.pw,CUI.ph);ctx.strokeStyle='#3a3a5a';ctx.lineWidth=2;ctx.strokeRect(CUI.px,CUI.py,CUI.pw,CUI.ph);ctx.lineWidth=1;ctx.fillStyle='#88aaff';ctx.font='bold 14px "Courier New"';ctx.fillText('⚒ Bàn Chế Tạo',CUI.px+16,CUI.py+24);for(let r=0;r<3;r++)for(let c=0;c<3;c++){const sx=CUI.gridX+c*(CS+CG),sy=CUI.gridY+r*(CS+CG);ctx.fillStyle='#0c0c1c';ctx.fillRect(sx,sy,CS,CS);ctx.strokeStyle='#3a3a5a';ctx.strokeRect(sx,sy,CS,CS);const item=craftGrid[r*3+c];if(item)drawCraftItem(sx,sy,item,CS);}ctx.fillStyle='#6a6a8a';const ax=CUI.arrowX,ay=CUI.arrowY+CS/2;ctx.beginPath();ctx.moveTo(ax,ay-6);ctx.lineTo(ax+20,ay);ctx.lineTo(ax,ay+6);ctx.closePath();ctx.fill();ctx.fillRect(ax+22,ay-3,16,6);ctx.fillStyle='#1a1a2e';ctx.fillRect(CUI.outX-2,CUI.outY-2,CS+4,CS+4);ctx.fillStyle='#0c0c1c';ctx.fillRect(CUI.outX,CUI.outY,CS,CS);ctx.strokeStyle=craftOutput?'#88ffaa':'#3a3a5a';ctx.strokeRect(CUI.outX,CUI.outY,CS,CS);if(craftOutput)drawCraftItem(CUI.outX,CUI.outY,{key:craftOutput.o,count:craftOutput.cnt},CS);ctx.fillStyle='#3a3a5a';ctx.fillRect(CUI.invX-4,CUI.invY-12,9*CS+8*CG+8,1);ctx.fillStyle='#6a6a8a';ctx.font='11px "Courier New"';ctx.fillText('Hành trang',CUI.invX,CUI.invY-3);for(let r=0;r<3;r++)for(let c=0;c<9;c++){const sx=CUI.invX+c*(CS+CG),sy=CUI.invY+r*(CS+CG),idx=r*9+c;ctx.fillStyle=idx===hotIdx?'#1a1a3e':'#0c0c1c';ctx.fillRect(sx,sy,CS,CS);ctx.strokeStyle=idx===hotIdx?'#6688cc':'#3a3a5a';ctx.strokeRect(sx,sy,CS,CS);const item=inv[idx];if(item)drawCraftItem(sx,sy,item,CS);}if(cursorItem)drawCraftItem(mouseX-20,mouseY-20,cursorItem,CS);ctx.fillStyle='#555';ctx.font='10px "Courier New"';ctx.fillText('Click trái: lấy/đặt | Click phải: đặt 1/lấy nửa | E/ESC: đóng',CUI.px+16,CUI.py+CUI.ph-12);}

const entities=[];let nextEntitySpawn=2000;
function updateEntities(dt){const s=dt/16.667;nextEntitySpawn-=dt;if(nextEntitySpawn<=0){nextEntitySpawn=4000+Math.random()*6000;const isDaytime=dayT>0.14&&dayT<0.86;if(entities.length<8){let bx=Math.floor(player.x/BS+(Math.random()>0.5?1:-1)*(18+Math.random()*14));if(bx<1||bx>=WW-1){nextEntitySpawn=1000;return;}let by=0;for(let y=0;y<WH;y++)if(solid(bx,y)){by=y;break;}if(by>0){const ey=by*BS;if(isDaytime)entities.push({type:'pig',x:bx*BS,y:ey-20,w:28,h:20,vx:(Math.random()>0.5?1:-1)*1.2,vy:0,health:15,maxHealth:15,timer:3000,dirTimer:0,hitFlash:0,attackTimer:0,walkPhase:0});else entities.push({type:'zombie',x:bx*BS,y:ey-48,w:22,h:48,vx:0,vy:0,health:40,maxHealth:40,timer:0,dirTimer:0,dmgCD:0,hitFlash:0,attackTimer:0,walkPhase:0});}}}
  for(let i=entities.length-1;i>=0;i--){const e=entities[i];e.vy+=GRAV*s;if(e.vy>22)e.vy=22;e.hitFlash=Math.max(0,(e.hitFlash||0)-dt*0.005);e.attackTimer=Math.max(0,(e.attackTimer||0)-dt);e.walkPhase+=Math.abs(e.vx)*s*0.08;e.x+=e.vx*s;let lx=Math.floor(e.x/BS),rx=Math.floor((e.x+e.w-1)/BS),ty=Math.floor(e.y/BS),by=Math.floor((e.y+e.h-1)/BS);for(let y=ty;y<=by;y++){if(solid(lx,y)){e.x=(lx+1)*BS;if(e.vx<0)e.vx=e.type==='pig'?Math.abs(e.vx):0;}if(solid(rx,y)){e.x=rx*BS-e.w+1;if(e.vx>0)e.vx=e.type==='pig'?-Math.abs(e.vx):0;}}e.y+=e.vy*s;lx=Math.floor(e.x/BS);rx=Math.floor((e.x+e.w-1)/BS);ty=Math.floor(e.y/BS);by=Math.floor((e.y+e.h-1)/BS);e.onGround=false;for(let x=lx;x<=rx;x++){if(solid(x,ty)&&e.vy<0){e.y=(ty+1)*BS;e.vy=0;}if(solid(x,by)&&e.vy>=0){e.y=by*BS-e.h;e.vy=0;e.onGround=true;}}
  if(e.type==='pig'){e.dirTimer-=dt;if(e.dirTimer<=0){e.vx=(Math.random()>0.5?1:-1)*(0.5+Math.random());if(Math.random()<0.3)e.vx=0;e.dirTimer=2000+Math.random()*4000;}}
  else if(e.type==='zombie'){const dx=player.x-e.x,dist=Math.abs(dx);if(dist<400&&!player.isDead){e.vx=(dx>0?1:-1)*2.2;const checkX=Math.floor((e.x+(e.vx>0?e.w+2:-2))/BS),checkY=Math.floor((e.y+e.h/2)/BS);if(solid(checkX,checkY)&&e.onGround){e.vy=JSPD;e.onGround=false;}}else{e.dirTimer-=dt;if(e.dirTimer<=0){e.vx=(Math.random()>0.5?1:-1)*1;e.dirTimer=3000+Math.random()*3000;}}e.dmgCD=Math.max(0,(e.dmgCD||0)-dt);if(player.x<e.x+e.w&&player.x+player.w>e.x&&player.y<e.y+e.h&&player.y+player.h>e.y&&e.dmgCD<=0&&!player.isDead){let dmg=8-getArmorDef();dmg=Math.max(1,dmg);player.health=Math.max(0,player.health-dmg);e.dmgCD=800;e.attackTimer=400;sndZombieAtk();sndHurt();dmgFlash=1;}}
  const eCX=Math.floor((e.x+e.w/2)/BS),eCY=Math.floor((e.y+e.h/2)/BS);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){if(getB(eCX+dx,eCY+dy)===B.CACTUS)e.health-=dt*0.003;}
  if(Math.abs(e.x-player.x)>2000||e.y>WH*BS){entities.splice(i,1);continue;}
  if(e.health<=0){if(e.type==='pig'){addItem('MEAT',2);addItem('LEATHER',1);sndPigDie();}if(e.type==='zombie'){addItem('COAL',1+Math.floor(Math.random()*2));if(Math.random()<0.15)addItem('IRON_INGOT',1);sndZombieDie();}spawnParticles(Math.floor(e.x/BS),Math.floor(e.y/BS),e.type==='pig'?'#F0A0A0':'#408040',10);entities.splice(i,1);}}}
function getEntityAtMouse(){for(const e of entities)if(mouseWX*BS>=e.x&&mouseWX*BS<=e.x+e.w&&mouseWY*BS>=e.y&&mouseWY*BS<=e.y+e.h)return e;return null;}
function drawEntities(){for(const e of entities){const sx=e.x-cam.x|0,sy=e.y-cam.y|0;if(sx<-60||sx>W+60||sy<-60||sy>H+60)continue;const wk=Math.sin(e.walkPhase)*0.5;if(e.type==='pig'){const dir=e.vx>=0?1:-1;ctx.fillStyle='#F0A0A0';ctx.fillRect(sx,sy+4,28,16);ctx.fillStyle='#E89090';ctx.fillRect(sx,sy+14,28,6);ctx.fillStyle='#D08080';ctx.fillRect(sx+4,sy+20,4,6+wk*3);ctx.fillRect(sx+20,sy+20,4,6-wk*3);ctx.fillRect(sx+10,sy+20,4,6-wk*3);ctx.fillRect(sx+14,sy+20,4,6+wk*3);const headX=dir>0?sx+18:sx-2;ctx.fillStyle='#F5B0B0';ctx.fillRect(headX,sy+2,12,12);ctx.fillStyle='#FFBABA';ctx.fillRect(headX+(dir>0?8:0),sy+6,4,5);ctx.fillStyle='#333';ctx.fillRect(headX+(dir>0?3:5),sy+4,2,2);ctx.fillStyle='#E09090';ctx.fillRect(dir>0?sx-2:sx+26,sy+8,4,2);ctx.fillRect(dir>0?sx-3:sx+27,sy+6,2,2);}else if(e.type==='zombie'){const dir=e.vx>=0?1:-1,atkFrac=Math.max(0,e.attackTimer/400),lungeX=atkFrac*dir*6,drawX=sx+lungeX;ctx.fillStyle='#3A3A5E';ctx.fillRect(drawX+4,sy+16,14,20);ctx.fillStyle='#2A2A4E';ctx.fillRect(drawX+6,sy+22,4,10);ctx.fillStyle='#3A3A5E';ctx.save();ctx.translate(drawX+8,sy+36);ctx.rotate(wk);ctx.fillRect(-3,0,6,16);ctx.restore();ctx.save();ctx.translate(drawX+14,sy+36);ctx.rotate(-wk);ctx.fillRect(-3,0,6,16);ctx.restore();if(atkFrac>0.1){ctx.fillStyle='#4E8A4E';ctx.fillRect(drawX+(dir>0?-2:16),sy+18,8,10);ctx.fillRect(drawX+(dir>0?14:-8-atkFrac*6),sy+14,12+atkFrac*4,7);}else{ctx.fillStyle='#4E8A4E';ctx.fillRect(drawX+(dir>0?-2:16),sy+18,8,6);ctx.fillRect(drawX+(dir>0?14:-8),sy+16,12,6);}ctx.fillStyle='#4E8A4E';ctx.fillRect(drawX+3,sy,16,16);ctx.fillStyle='#3E7A3E';ctx.fillRect(drawX+3,sy+12,16,4);ctx.fillStyle=`rgba(255,0,0,${atkFrac>0.1?1:0.8})`;ctx.fillRect(drawX+5,sy+5,3,3);ctx.fillRect(drawX+12,sy+5,3,3);if(atkFrac>0.3){const slX=drawX+(dir>0?e.w+2:-20),slY=sy+15;ctx.strokeStyle=`rgba(255,30,30,${atkFrac*0.9})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(slX,slY);ctx.lineTo(slX+dir*14,slY-8);ctx.moveTo(slX,slY+6);ctx.lineTo(slX+dir*12,slY+12);ctx.stroke();ctx.lineWidth=1;}}if(e.hitFlash>0.05){ctx.fillStyle=`rgba(255,255,255,${e.hitFlash*0.6})`;ctx.fillRect(sx,sy,e.w,e.h);}if(e.health<e.maxHealth){const bw=e.w,frac=e.health/e.maxHealth;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(sx,sy-8,bw,5);ctx.fillStyle='#E02020';ctx.fillRect(sx+1,sy-7,(bw-2)*frac,3);}}}

const keys={};let mouseWX=0,mouseWY=0,mouseX=0,mouseY=0;let lmbDown=false,rmbDown=false;let mineT=0,mineTarget=null,hitCD=0;
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouseX=(e.clientX-r.left)*(W/r.width);mouseY=(e.clientY-r.top)*(H/r.height);mouseWX=(mouseX+cam.x)/BS;mouseWY=(mouseY+cam.y)/BS;});
canvas.addEventListener('mousedown',e=>{e.preventDefault();if(gameState!=='playing')return;if(player.isDead){respawnPlayer();return;}if(furnaceOpen)return;if(craftOpen){handleCraftClick(mouseX,mouseY,e.button===2);return;}if(bookOpen){bookHandleClick(mouseX,mouseY);return;}if(chestOpen){handleChestClick(mouseX,mouseY,e.button===2);return;}if(e.button===0)lmbDown=true;if(e.button===2)doRightClick();});
canvas.addEventListener('mouseup',e=>{if(e.button===0){lmbDown=false;mineT=0;mineTarget=null;}if(e.button===2)rmbDown=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('wheel',e=>{if(craftOpen||furnaceOpen)return;hotIdx=(hotIdx+(e.deltaY>0?1:-1)+HS)%HS;},{passive:true});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(gameState==='menu')return;if(player.isDead&&gameState==='playing'){respawnPlayer();return;}if(e.code==='KeyE'){if(chestOpen){closeChest();return;}if(furnaceOpen){closeFurnace();return;}if(craftOpen)closeCraftUI();else{craftOpen=true;checkCraftRecipe();}}if(e.code==='KeyF'&&!craftOpen&&!furnaceOpen){const{tx,ty}=getTile();if(getB(tx,ty)===B.FURNACE&&inReach(tx,ty)){openFurnace();return;}}if(e.code==='Escape'){if(bookOpen){bookOpen=false;return;}if(chestOpen){closeChest();return;}if(craftOpen){closeCraftUI();return;}if(furnaceOpen){closeFurnace();return;}if(gameState==='playing'){gameState='paused';document.getElementById('pause-overlay').style.display='flex';return;}if(gameState==='paused'){resumeGame();return;}}if(e.code==='KeyR'&&!craftOpen&&!furnaceOpen){bookOpen=!bookOpen;sndClick();return;}
if(!craftOpen&&!furnaceOpen&&!bookOpen&&e.code>='Digit1'&&e.code<='Digit9')hotIdx=+e.code[5]-1;});
document.addEventListener('keyup',e=>{keys[e.code]=false;});

function getTile(){return{tx:Math.floor(mouseWX),ty:Math.floor(mouseWY)};}
function inReach(tx,ty){const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS;return Math.sqrt((tx+0.5-px)**2+(ty+0.5-py)**2)<=REACH;}

function handleMining(dt){hitCD=Math.max(0,hitCD-dt);mineSoundCD=Math.max(0,mineSoundCD-dt);if(!lmbDown||craftOpen||furnaceOpen||chestOpen||player.isDead){mineT=0;mineTarget=null;mineAmp=Math.max(0,mineAmp-dt*0.008);return;}if(isEating){isEating=false;eatTimer=0;eatColor=null;}const eTarget=getEntityAtMouse();if(eTarget){const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS,ex=eTarget.x/BS+eTarget.w/2/BS,ey=eTarget.y/BS+eTarget.h/2/BS;if(Math.sqrt((px-ex)**2+(py-ey)**2)<=REACH+1&&hitCD<=0){let dmg=1;const held=getHeld();if(held?.dmg)dmg=held.dmg;else if(held?.tool==='axe')dmg=held.pow*2;else if(held?.tool==='pick')dmg=held.pow;eTarget.health-=dmg;eTarget.hitFlash=1;hitCD=300;sndHitEnt();spawnParticles(Math.floor(eTarget.x/BS),Math.floor(eTarget.y/BS),'#FF0000',4);mineAmp=1;minePhase=Math.PI/2;}return;}const{tx,ty}=getTile();const b=getB(tx,ty);if(b===B.AIR||!inReach(tx,ty)){mineT=0;mineTarget=null;return;}if(b===B.BEDROCK){mineT=0;return;}if(mineTarget&&(mineTarget.x!==tx||mineTarget.y!==ty))mineT=0;mineTarget={x:tx,y:ty};const bd=BD[b];if(!bd)return;let spd=1;const held=getHeld();if(held?.tool==='pick'&&(b===B.STONE||b===B.COAL||b===B.IRON||b===B.GOLD||b===B.DIAMOND_ORE||b===B.EMERALD_ORE||b===B.COPPER_ORE||b===B.MOSS_STONE||b===B.OBSIDIAN||b===B.BRICK||b===B.FURNACE||b===B.GRAVEL||b===B.CLAY))spd=held.pow;if(held?.tool==='axe'&&(b===B.LOG||b===B.LEAVES||b===B.PLANK||b===B.BENCH||b===B.CACTUS||b===B.BOOKSHELF||b===B.CHEST||b===B.BED))spd=held.pow;mineT+=dt/1000*spd;
  mineAmp=1.0;
  if(mineSoundCD<=0){sndMine();mineSoundCD=280;}if(Math.random()<0.08)spawnParticles(tx,ty,'#FFF',1);if(mineT>=bd.h){sndBreak();spawnParticles(tx,ty,bd.c||'#888',8);
    // SPAWN DROP instead of directly adding item
    if(bd.d)spawnDrop(tx,ty,bd.d);
    if(onlineMode)broadcastToAll({type:'block',x:tx,y:ty,t:B.AIR});
    if(b===B.TNT){sndExplosion();for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++){if(Math.abs(dx)+Math.abs(dy)<=4&&getB(tx+dx,ty+dy)!==B.BEDROCK){spawnParticles(tx+dx,ty+dy,'#FF4400',3);setB(tx+dx,ty+dy,B.AIR);}}for(const ent of entities){const ddx=ent.x/BS-tx,ddy=ent.y/BS-ty;if(Math.abs(ddx)<5&&Math.abs(ddy)<5)ent.health-=30;}if(Math.abs(player.x/BS-tx)<5&&Math.abs(player.y/BS-ty)<5){player.health=Math.max(0,player.health-20);dmgFlash=1;sndHurt();}}setB(tx,ty,B.AIR);mineT=0;mineTarget=null;}}

function doRightClick(){if(craftOpen||furnaceOpen||chestOpen||player.isDead)return;const sl=inv[hotIdx];if(!sl)return;const it=IT[sl.key];if(it?.food){if(player.hunger<player.maxHunger||player.health<player.maxHealth){player.hunger=Math.min(player.maxHunger,player.hunger+(it.hunger||20));player.health=Math.min(player.maxHealth,player.health+(it.heal||5));sl.count--;if(sl.count<=0)inv[hotIdx]=null;isEating=true;eatTimer=0;eatColor=it.c;sndEat();return;}}const{tx,ty}=getTile();if(!inReach(tx,ty))return;if(getB(tx,ty)===B.BENCH){craftOpen=true;checkCraftRecipe();return;}if(getB(tx,ty)===B.FURNACE){openFurnace();return;}if(getB(tx,ty)===B.CHEST){openChest(tx,ty);return;}if(getB(tx,ty)===B.BED){if(dayT>0.86||dayT<0.14){dayT=0.18;sndLevelUp();spawnWorldParticles(player.x+player.w/2,player.y,'#FFFF88',8);return;}}if(it?.block===undefined)return;if(getB(tx,ty)!==B.AIR)return;if(tx*BS<player.x+player.w&&(tx+1)*BS>player.x&&ty*BS<player.y+player.h&&(ty+1)*BS>player.y)return;sndPlace();setB(tx,ty,it.block);if(onlineMode)broadcastToAll({type:'block',x:tx,y:ty,t:it.block});sl.count--;if(sl.count<=0)inv[hotIdx]=null;isPlacing=true;placeTimer=0;placeEffects.push({x:tx,y:ty,life:1});}

function physicsStep(dt){if(player.isDead)return;const s=dt/16.667;player.vx=0;if(!craftOpen&&!furnaceOpen&&!chestOpen){if(bookOpen){if(keys['KeyA']&&bookPage>0){bookPage--;keys['KeyA']=false;}if(keys['KeyD']&&bookPage<BOOK_PAGES.length-1){bookPage++;keys['KeyD']=false;}return;}
    if(keys['KeyA']||keys['ArrowLeft']){player.vx=-MSPD;player.facing=-1;}if(keys['KeyD']||keys['ArrowRight']){player.vx=MSPD;player.facing=1;}}if(!craftOpen&&!furnaceOpen&&!chestOpen&&(keys['KeyW']||keys['Space']||keys['ArrowUp'])&&player.onGround){player.vy=JSPD;player.onGround=false;}player.vy+=GRAV*s;if(player.vy>22)player.vy=22;const pCX=Math.floor((player.x+player.w/2)/BS),pCY=Math.floor((player.y+player.h/2)/BS);for(let dx=-1;dx<=1;dx++)for(let dy=-2;dy<=0;dy++){const nb=getB(pCX+dx,pCY+dy);if(nb===B.CACTUS&&hitCD<=0){player.health=Math.max(0,player.health-3);hitCD=500;sndHurt();dmgFlash=0.5;}if(nb===B.MAGMA&&hitCD<=0){player.health=Math.max(0,player.health-2);hitCD=600;sndHurt();dmgFlash=0.4;}if(nb===B.ICE_SPIKE&&hitCD<=0){player.health=Math.max(0,player.health-1);hitCD=400;sndHurt();dmgFlash=0.3;}}player.x+=player.vx*s;resolveX();player.y+=player.vy*s;resolveY();}
function resolveX(){const lx=Math.floor(player.x/BS),rx=Math.floor((player.x+player.w-1)/BS),ty=Math.floor(player.y/BS),by=Math.floor((player.y+player.h-1)/BS);for(let y=ty;y<=by;y++){if(solid(lx,y))player.x=(lx+1)*BS;if(solid(rx,y))player.x=rx*BS-player.w;}player.x=Math.max(0,Math.min(WW*BS-player.w,player.x));}
function resolveY(){const lx=Math.floor(player.x/BS),rx=Math.floor((player.x+player.w-1)/BS),ty=Math.floor(player.y/BS),by=Math.floor((player.y+player.h-1)/BS);player.onGround=false;for(let x=lx;x<=rx;x++){if(solid(x,ty)&&player.vy<0){player.y=(ty+1)*BS;player.vy=0;}if(solid(x,by)&&player.vy>=0){player.y=by*BS-player.h;player.vy=0;player.onGround=true;}}if(player.y<0){player.y=0;player.vy=0;}if(player.y+player.h>WH*BS){player.y=WH*BS-player.h;player.vy=0;player.onGround=true;}}

let dayT=0.35;
function skyColor(t){const stops=[[0,[8,8,28]],[0.09,[8,8,28]],[0.14,[255,100,40]],[0.18,[120,180,240]],[0.5,[100,170,235]],[0.82,[120,180,240]],[0.86,[255,100,40]],[0.91,[8,8,28]],[1,[8,8,28]]];let a=stops[0][1],b2=stops[0][1],f=0;for(let i=1;i<stops.length;i++)if(t<=stops[i][0]){f=(t-stops[i-1][0])/(stops[i][0]-stops[i-1][0]);a=stops[i-1][1];b2=stops[i][1];break;}return a.map((v,i)=>Math.round(v+(b2[i]-v)*f));}
function drawSky(){const[r,g,bl]=skyColor(dayT);ctx.fillStyle=`rgb(${r},${g},${bl})`;ctx.fillRect(0,0,W,H);const sunAngle=(dayT-0.5)*Math.PI*2,sunX=W/2+Math.cos(sunAngle)*360,sunY=H/2+Math.sin(sunAngle)*280;const isDaytime=dayT>0.14&&dayT<0.86;if(isDaytime){ctx.fillStyle='#FFE060';ctx.beginPath();ctx.arc(sunX,sunY,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFD030';ctx.beginPath();ctx.arc(sunX,sunY,14,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#E0E8FF';ctx.beginPath();ctx.arc(sunX,sunY,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.7)';for(let i=0;i<40;i++)ctx.fillRect((i*137+50)%W,(i*89+20)%(H*0.45),2,2);}const cloudOff=(dayT*3000)%W;ctx.fillStyle='rgba(255,255,255,'+(isDaytime?0.7:0.15)+')';[[120,60,110,18],[310,40,150,14],[540,70,90,16],[730,50,130,20]].forEach(([cx,cy,cw,ch])=>{const ox=(cx+cloudOff)%W-cw;ctx.fillRect(ox,cy,cw,ch);ctx.fillRect(ox+12,cy-10,cw-24,ch+6);});}

const TRANSPARENT_BLOCKS=new Set([B.FLOWER_R,B.FLOWER_Y,B.MUSHROOM,B.TORCH,B.LANTERN,B.ICE_SPIKE]);

function drawBlockRaw(sx,sy,type){
  const bd=BD[type];if(!bd)return;
  if(!TRANSPARENT_BLOCKS.has(type)){
    ctx.fillStyle=bd.c;ctx.fillRect(sx,sy,BS,BS);
  }
  if(type===B.GRASS){ctx.fillStyle=bd.t;ctx.fillRect(sx,sy,BS,6);ctx.fillStyle='#90E850';for(let i=0;i<4;i++)ctx.fillRect(sx+4+i*7,sy-2,2,4);}
  else if(type===B.STONE){ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(sx,sy+16,BS,1);ctx.fillRect(sx+16,sy,1,BS);}
  else if(type===B.LEAVES){ctx.fillStyle='#1A6A10';for(let lx=0;lx<4;lx++)for(let ly=0;ly<4;ly++)if((lx+ly)%2===0)ctx.fillRect(sx+lx*8+1,sy+ly*8+1,6,6);ctx.fillStyle='#40A830';for(let lx=0;lx<4;lx++)for(let ly=0;ly<4;ly++)if((lx+ly)%2===1)ctx.fillRect(sx+lx*8+2,sy+ly*8+2,4,4);}
  else if(bd.o){ctx.fillStyle=bd.o;[[5,6,5,5],[17,15,6,6],[8,19,5,5],[19,6,5,6]].forEach(([ox,oy,ow,oh])=>ctx.fillRect(sx+ox,sy+oy,ow,oh));}
  else if(type===B.SAND){ctx.fillStyle='rgba(255,255,200,0.2)';ctx.fillRect(sx+2,sy+2,BS-4,6);}
  else if(type===B.PLANK){ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(sx,sy+10,BS,2);ctx.fillRect(sx,sy+22,BS,2);}
  else if(type===B.BENCH){ctx.fillStyle='#A05A20';ctx.fillRect(sx+1,sy+1,BS-2,8);ctx.fillStyle='#CC7A30';ctx.fillRect(sx+3,sy+2,BS-6,5);ctx.fillStyle='#5A2A08';ctx.fillRect(sx+2,sy+10,5,BS-11);ctx.fillRect(sx+BS-7,sy+10,5,BS-11);}
  else if(type===B.TORCH){
    ctx.fillStyle='#7A5810';ctx.fillRect(sx+13,sy+14,6,16);
    ctx.fillStyle='#FF5500';ctx.fillRect(sx+11,sy+6,10,10);
    ctx.fillStyle='#FFD000';ctx.fillRect(sx+13,sy+8,6,6);
    ctx.fillStyle='#FFFFFF';ctx.fillRect(sx+14,sy+9,4,3);
    ctx.fillStyle='rgba(255,200,50,0.12)';ctx.fillRect(sx-8,sy-8,BS+16,BS+16);
  }
  else if(type===B.WATER){ctx.fillStyle='rgba(32,96,170,0.7)';ctx.fillRect(sx,sy,BS,BS);ctx.fillStyle='rgba(100,180,255,0.3)';ctx.fillRect(sx,sy,BS,4);ctx.fillStyle='rgba(150,210,255,0.15)';ctx.fillRect(sx+4,sy+8,BS-8,3);}
  else if(type===B.SNOW){ctx.fillStyle='#F8F8FF';ctx.fillRect(sx,sy,BS,6);ctx.fillStyle='rgba(200,200,220,0.3)';ctx.fillRect(sx+5,sy+12,BS-10,3);}
  else if(type===B.ICE){ctx.fillStyle='rgba(180,220,255,0.4)';ctx.fillRect(sx+4,sy+4,BS-8,3);ctx.fillRect(sx+8,sy+14,BS-16,2);}
  else if(type===B.GRAVEL){ctx.fillStyle='#6A5A4A';for(let i=0;i<6;i++)ctx.fillRect(sx+2+i*5,sy+4+(i%3)*8,4,4);}
  else if(type===B.CLAY){ctx.fillStyle='#8A8090';ctx.fillRect(sx+4,sy+4,8,6);ctx.fillRect(sx+18,sy+16,8,6);}
  else if(type===B.BRICK){ctx.fillStyle='#883020';for(let r=0;r<4;r++)for(let c=0;c<2;c++){const bx=sx+c*16+(r%2)*8,by=sy+r*8;ctx.fillRect(bx+1,by+1,14,6);}}
  else if(type===B.GLASS){ctx.strokeStyle='rgba(200,230,255,0.6)';ctx.lineWidth=1;ctx.strokeRect(sx+1,sy+1,BS-2,BS-2);ctx.fillStyle='rgba(200,230,255,0.1)';ctx.fillRect(sx+2,sy+2,BS-4,BS-4);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(sx+3,sy+3,8,3);}
  else if(type===B.FURNACE){ctx.fillStyle='#444';ctx.fillRect(sx+4,sy+4,BS-8,BS-8);ctx.fillStyle='#222';ctx.fillRect(sx+10,sy+10,12,14);ctx.fillStyle='#FF4400';ctx.fillRect(sx+12,sy+18,8,4);}
  else if(type===B.CHEST){ctx.fillStyle='#6A4010';ctx.fillRect(sx+2,sy+4,BS-4,BS-6);ctx.fillStyle='#8A5A20';ctx.fillRect(sx+4,sy+6,BS-8,BS-10);ctx.fillStyle='#D4A030';ctx.fillRect(sx+12,sy+12,8,4);}
  else if(type===B.BED){ctx.fillStyle='#8A2020';ctx.fillRect(sx+2,sy+8,BS-4,BS-10);ctx.fillStyle='#F0F0F0';ctx.fillRect(sx+2,sy+4,10,8);ctx.fillStyle='#5A3A10';ctx.fillRect(sx+2,sy+BS-4,4,4);ctx.fillRect(sx+BS-6,sy+BS-4,4,4);}
  else if(type===B.OBSIDIAN){ctx.fillStyle='#0A0018';ctx.fillRect(sx+2,sy+2,BS-4,BS-4);ctx.fillStyle='#2A1040';ctx.fillRect(sx+6,sy+6,8,8);ctx.fillRect(sx+18,sy+14,6,6);}
  else if(type===B.BEDROCK){ctx.fillStyle='#222';ctx.fillRect(sx,sy,BS,BS);ctx.fillStyle='#1a1a1a';for(let i=0;i<4;i++)ctx.fillRect(sx+i*8+2,sy+4+(i%2)*12,6,6);}
  else if(type===B.CACTUS){ctx.fillStyle='#187018';ctx.fillRect(sx+8,sy+2,16,BS-2);ctx.fillStyle='#208020';ctx.fillRect(sx+6,sy+6,4,6);ctx.fillRect(sx+22,sy+14,4,6);ctx.fillStyle='#0A5010';ctx.fillRect(sx+10,sy+4,12,2);}
  else if(type===B.PUMPKIN){ctx.fillStyle='#D07018';ctx.fillRect(sx+4,sy+4,BS-8,BS-8);ctx.fillStyle='#E89030';ctx.fillRect(sx+6,sy+6,BS-12,BS-12);ctx.fillStyle='#206020';ctx.fillRect(sx+12,sy+2,8,4);ctx.fillStyle='#222';ctx.fillRect(sx+10,sy+12,4,5);ctx.fillRect(sx+18,sy+12,4,5);ctx.fillStyle='#E08020';ctx.fillRect(sx+12,sy+19,8,3);}
  else if(type===B.FLOWER_R||type===B.FLOWER_Y){
    const fc=type===B.FLOWER_R?'#E02020':'#E0D020';
    ctx.fillStyle='#2A8018';ctx.fillRect(sx+14,sy+16,4,14);
    ctx.fillStyle=fc;
    ctx.fillRect(sx+8,sy+8,8,8);ctx.fillRect(sx+16,sy+8,8,8);
    ctx.fillRect(sx+12,sy+4,8,8);ctx.fillRect(sx+12,sy+12,8,8);
    ctx.fillStyle='#FFE040';ctx.fillRect(sx+13,sy+10,6,6);
  }
  else if(type===B.MUSHROOM){
    ctx.fillStyle='#C02020';ctx.fillRect(sx+4,sy+8,24,12);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(sx+6,sy+10,4,4);ctx.fillRect(sx+18,sy+12,4,3);
    ctx.fillStyle='#E0D8C0';ctx.fillRect(sx+12,sy+18,8,10);
  }
  else if(type===B.MOSS_STONE){ctx.fillStyle='#4A6A4A';ctx.fillRect(sx+2,sy+2,12,10);ctx.fillRect(sx+18,sy+18,10,8);ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(sx,sy+16,BS,1);}
  else if(type===B.BOOKSHELF){ctx.fillStyle='#6A4A18';ctx.fillRect(sx,sy,BS,BS);ctx.fillStyle='#8A6A28';for(let r=0;r<3;r++)for(let c=0;c<2;c++)ctx.fillRect(sx+3+c*14,sy+3+r*10,12,7);}
  else if(type===B.WOOL){ctx.fillStyle='#D8D8D8';ctx.fillRect(sx+2,sy+2,BS-4,BS-4);ctx.fillStyle='#E8E8E8';ctx.fillRect(sx+6,sy+6,8,8);ctx.fillRect(sx+18,sy+16,6,6);}
  else if(type===B.LANTERN){
    ctx.fillStyle='#7A5810';ctx.fillRect(sx+12,sy+16,8,14);
    ctx.fillStyle='#5A5A5A';ctx.fillRect(sx+8,sy+6,16,14);
    ctx.fillStyle='#444';ctx.fillRect(sx+10,sy+8,12,10);
    ctx.fillStyle='#FFB030';ctx.fillRect(sx+11,sy+9,10,8);
    ctx.fillStyle='#FFE080';ctx.fillRect(sx+13,sy+10,6,5);
    ctx.fillStyle='rgba(255,180,40,0.12)';ctx.fillRect(sx-10,sy-10,BS+20,BS+20);
  }
  else if(type===B.TNT){ctx.fillStyle='#CC1818';ctx.fillRect(sx+2,sy+4,BS-4,BS-8);ctx.fillStyle='#E8E8E0';ctx.fillRect(sx+4,sy+10,BS-8,10);ctx.fillStyle='#222';ctx.font='bold 10px "Courier New"';ctx.fillText('TNT',sx+5,sy+19);ctx.fillStyle='#888';ctx.fillRect(sx+14,sy,4,6);}
  else if(type===B.SANDSTONE){
    ctx.fillStyle='#C8B870';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#B8A860';ctx.fillRect(sx,sy+10,BS,2);ctx.fillRect(sx,sy+21,BS,2);
    ctx.fillStyle='rgba(255,230,150,0.25)';ctx.fillRect(sx+2,sy+2,BS-4,6);
    ctx.fillStyle='#A89050';ctx.fillRect(sx+4,sy+13,8,5);ctx.fillRect(sx+18,sy+13,6,5);}
  else if(type===B.MAGMA){
    ctx.fillStyle='#2A0A00';ctx.fillRect(sx,sy,BS,BS);
    // lava cracks glowing orange/red
    ctx.fillStyle='#FF4400';ctx.fillRect(sx+2,sy+8,6,3);ctx.fillRect(sx+16,sy+4,8,3);ctx.fillRect(sx+8,sy+18,10,4);ctx.fillRect(sx+2,sy+22,5,3);
    ctx.fillStyle='#FF8800';ctx.fillRect(sx+3,sy+9,4,1);ctx.fillRect(sx+17,sy+5,6,1);ctx.fillRect(sx+9,sy+19,8,2);
    ctx.fillStyle='rgba(255,80,0,0.18)';ctx.fillRect(sx,sy,BS,BS);}
  else if(type===B.BONE){
    ctx.fillStyle='#E8E0C8';ctx.fillRect(sx,sy,BS,BS);
    // bone circle ends + bar pattern
    ctx.fillStyle='#D0C8B0';
    ctx.fillRect(sx+4,sy+4,8,8);ctx.fillRect(sx+20,sy+4,8,8);
    ctx.fillRect(sx+4,sy+20,8,8);ctx.fillRect(sx+20,sy+20,8,8);
    ctx.fillStyle='#C8C0A0';ctx.fillRect(sx+10,sy+2,12,BS-4);
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(sx+11,sy+3,4,BS-6);}
  else if(type===B.PINE_LOG){
    ctx.fillStyle='#5A4A20';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#4A3A18';ctx.fillRect(sx+12,sy,8,BS);
    ctx.fillStyle='#6A5A28';ctx.fillRect(sx+2,sy+4,10,4);ctx.fillRect(sx+2,sy+16,10,4);ctx.fillRect(sx+2,sy+24,10,3);
    ctx.fillStyle='rgba(255,255,200,0.07)';ctx.fillRect(sx,sy,2,BS);}
  else if(type===B.ICE_SPIKE){
    // Tall icy crystal spike
    const mid=sx+BS/2;
    ctx.fillStyle='rgba(160,220,248,0.85)';
    ctx.beginPath();ctx.moveTo(mid,sy);ctx.lineTo(sx+8,sy+BS);ctx.lineTo(sx+BS-8,sy+BS);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(220,245,255,0.6)';
    ctx.beginPath();ctx.moveTo(mid,sy+4);ctx.lineTo(mid+4,sy+BS-4);ctx.lineTo(mid-2,sy+BS-4);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(100,200,240,0.5)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(mid,sy);ctx.lineTo(sx+8,sy+BS);ctx.lineTo(sx+BS-8,sy+BS);ctx.closePath();ctx.stroke();ctx.lineWidth=1;}
  if(!TRANSPARENT_BLOCKS.has(type)&&type!==B.WATER&&type!==B.GLASS){
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(sx,sy+BS-3,BS,3);ctx.fillRect(sx+BS-3,sy,3,BS);ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(sx,sy,BS,2);ctx.fillRect(sx,sy,2,BS);
  }
}

function drawBlock(x,y,type){
  const bd=BD[type];if(!bd)return;
  const sx=x*BS-cam.x|0,sy=y*BS-cam.y|0;
  if(sx<-BS||sx>W||sy<-BS||sy>H)return;
  drawBlockRaw(sx,sy,type);
}

function drawMineProgress(){if(!mineTarget||mineT<=0)return;const bd=BD[getB(mineTarget.x,mineTarget.y)];if(!bd)return;const frac=mineT/bd.h,sx=mineTarget.x*BS-cam.x|0,sy=mineTarget.y*BS-cam.y|0;
  ctx.fillStyle=`rgba(0,0,0,${frac*0.55})`;ctx.fillRect(sx,sy,BS,BS);
  ctx.strokeStyle='rgba(0,0,0,0.85)';ctx.lineWidth=2;
  if(frac>0.15){ctx.beginPath();ctx.moveTo(sx+4,sy+8);ctx.lineTo(sx+16,sy+18);ctx.stroke();}
  if(frac>0.30){ctx.beginPath();ctx.moveTo(sx+20,sy+4);ctx.lineTo(sx+10,sy+22);ctx.stroke();}
  if(frac>0.50){ctx.beginPath();ctx.moveTo(sx+2,sy+24);ctx.lineTo(sx+30,sy+28);ctx.stroke();}
  if(frac>0.65){ctx.beginPath();ctx.moveTo(sx+8,sy+30);ctx.lineTo(sx+28,sy+8);ctx.stroke();}
  if(frac>0.80){ctx.beginPath();ctx.moveTo(sx+2,sy+14);ctx.lineTo(sx+18,sy+30);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+18,sy+2);ctx.lineTo(sx+30,sy+20);ctx.stroke();}
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(sx+1,sy+BS-7,BS-2,6);
  ctx.fillStyle='#00FF88';ctx.fillRect(sx+1,sy+BS-7,(BS-2)*frac,6);
  ctx.strokeStyle='rgba(0,200,100,0.6)';ctx.lineWidth=1;ctx.strokeRect(sx+1,sy+BS-7,BS-2,6);
  ctx.lineWidth=1;
}

function drawBlockCursor(){if(craftOpen||furnaceOpen)return;const tx=Math.floor(mouseWX),ty=Math.floor(mouseWY);const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS;if(Math.sqrt((tx+0.5-px)**2+(ty+0.5-py)**2)>REACH)return;const b=getB(tx,ty),sx=tx*BS-cam.x,sy=ty*BS-cam.y;ctx.strokeStyle=b!==B.AIR?'rgba(255,255,255,0.65)':'rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.strokeRect(sx+1,sy+1,BS-2,BS-2);ctx.lineWidth=1;const tip=document.getElementById('tip');if(b!==B.AIR&&BD[b]){tip.style.display='block';tip.style.left=(mouseX+16)+'px';tip.style.top=(mouseY-22)+'px';tip.textContent=BD[b].n;}else tip.style.display='none';if(b===B.AIR){tip.style.display='none';const sl=inv[hotIdx];if(sl&&IT[sl.key]?.block!==undefined){ctx.fillStyle=(IT[sl.key].c||'#888')+'55';ctx.fillRect(sx,sy,BS,BS);}}}

function drawPlayer(){if(player.isDead)return;
  // --- squash/stretch from jump ---
  let scX=1,scY=1,scOffY=0;
  if(jumpSquash>0){scX=1+jumpSquash*0.35;scY=1-jumpSquash*0.20;scOffY=player.h*(1-scY);}
  else if(!player.onGround&&airTime>50){
    if(player.vy<-2){const t=Math.min(1,Math.abs(player.vy)/Math.abs(JSPD));scX=1-t*0.13;scY=1+t*0.16;scOffY=-player.h*(scY-1)*0.5;}
    else if(player.vy>3){const t=Math.min(1,player.vy/15);scX=1+t*0.07;scY=1-t*0.07;scOffY=player.h*(1-scY);}
  }
  // start/stop bounce squash
  const bounceScY=1-moveBounce*0.18;
  const bounceScX=1+moveBounce*0.10;
  scX*=bounceScX; scY*=bounceScY;

  const sx=player.x-cam.x|0;
  const rawSy=player.y-cam.y+scOffY+walkBob;
  const sy=rawSy|0;
  const fw=player.facing;
  const cx=sx+(player.w/2|0), baseY=sy;
  const bodyW=14,bodyH=18,headW=18,headH=16,armLen=17,legLen=19;

  const mouseWXX=mouseWX*BS, mouseWYY=mouseWY*BS;
  const fsx=cx+(fw>0?bodyW/2:-bodyW/2), fsy=baseY+19;
  const bsx=cx+(fw>0?-bodyW/2:bodyW/2), bsy=baseY+19;
  const aimAngle=Math.atan2(mouseWYY-(baseY+19+armLen*0.5), mouseWXX-cx);

  let frontAngle, backAngle;
  const held=getHeld();
  const hasArmor=getArmorDef()>0;
  const bodyColor=hasArmor?'#8890A0':skinData.shirt;
  const legColor=hasArmor?'#707888':skinData.pants;
  const shoeColor=hasArmor?'#506070':skinData.shoe;
  const faceColor=skinData.face;
  const hairColor=skinData.hair;
  const eyeColor=skinData.eye;
  const isTwoHanded=held&&(held.tool==='pick'||held.tool==='axe'||held.tool==='sword');

  // --- Compute front arm angle ---
  if(isEating){
    const chomp=Math.sin(eatTimer*0.018)*(1-eatTimer/EAT_DUR*0.6);
    frontAngle=fw>0?-1.3+chomp*0.35:Math.PI+1.3-chomp*0.35;
  } else if(isPlacing){
    const pp=placeTimer/PLACE_DUR;
    const swing=Math.sin(pp*Math.PI)*1.5;
    frontAngle=fw>0?0.4+swing:Math.PI-0.4-swing;
  } else if(!player.onGround&&airTime>50){
    if(player.vy<-1){const t=Math.min(1,Math.abs(player.vy)/Math.abs(JSPD));frontAngle=fw>0?-0.9-t*0.4:Math.PI+0.9+t*0.4;}
    else{frontAngle=fw>0?-0.5:Math.PI+0.5;}
  } else if(held){
    frontAngle=aimAngle;
    if(mineAmp>0.05)frontAngle+=Math.sin(minePhase*2)*1.2*mineAmp;
  } else {
    const sa=Math.sin(walkCycle)*0.55*walkAmp;
    frontAngle=fw>0?sa:-sa;
    if(mineAmp>0.05){const ms=Math.sin(minePhase*2)*1.2*mineAmp;frontAngle=fw>0?ms:-ms;}
  }

  // --- Compute back arm angle ---
  // For tools: ALWAYS grip the item shaft (lower half of front arm extent)
  if(held&&(held.tool==='pick'||held.tool==='axe'||held.tool==='sword')){
    // grip point is 60% down the front arm's length in world space
    const gripFrac=0.60;
    const gripX=fsx+Math.cos(frontAngle)*armLen*gripFrac;
    const gripY=fsy+Math.sin(frontAngle)*armLen*gripFrac;
    backAngle=Math.atan2(gripY-bsy, gripX-bsx);
    if(mineAmp>0.05)backAngle+=Math.sin(minePhase*2)*0.28*mineAmp;
  } else if(isEating){
    backAngle=fw>0?-0.4:Math.PI+0.4;
  } else if(isPlacing){
    backAngle=fw>0?-0.15:Math.PI+0.15;
  } else if(!player.onGround&&airTime>50){
    if(player.vy<-1){const t=Math.min(1,Math.abs(player.vy)/Math.abs(JSPD));backAngle=fw>0?-1.1-t*0.3:Math.PI+1.1+t*0.3;}
    else{backAngle=fw>0?-0.7:Math.PI+0.7;}
  } else {
    const sa=Math.sin(walkCycle)*0.55*walkAmp;
    backAngle=fw>0?-sa:sa;
    if(mineAmp>0.05){const ms=Math.sin(minePhase*2)*1.2*mineAmp;backAngle=fw>0?-ms*0.6:ms*0.6;}
  }

  // === DRAW ===
  // Whole-body tilt pivot at feet
  ctx.save();
  ctx.translate(cx, baseY+player.h);
  ctx.scale(scX,scY);
  ctx.rotate(bodyTilt);
  ctx.translate(-cx, -(baseY+player.h));

  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(cx-9,baseY+player.h-1,18,4);

  // Legs
  const swA=Math.sin(walkCycle)*0.55*walkAmp;
  const airLegAngle=airTime>50?(player.vy<0?0.28:-0.18):0;
  const hipY=baseY+36;
  ctx.save();ctx.translate(cx-4,hipY);ctx.rotate(swA+airLegAngle);
  ctx.fillStyle=legColor;ctx.fillRect(-3,0,6,legLen-4);
  ctx.fillStyle=shoeColor;ctx.fillRect(-3,legLen-4,6,4);
  ctx.restore();
  ctx.save();ctx.translate(cx+4,hipY);ctx.rotate(-swA-airLegAngle);
  ctx.fillStyle=legColor;ctx.fillRect(-3,0,6,legLen-4);
  ctx.fillStyle=shoeColor;ctx.fillRect(-3,legLen-4,6,4);
  ctx.restore();

  // Back arm
  ctx.save();ctx.translate(bsx,bsy);ctx.rotate(backAngle);
  ctx.fillStyle=bodyColor;ctx.fillRect(-3,0,6,armLen-4);
  ctx.fillStyle=faceColor;ctx.fillRect(-3,armLen-4,6,4);
  ctx.restore();

  // Body
  const bxx=cx-bodyW/2|0, byy=baseY+17;
  ctx.fillStyle=bodyColor;ctx.fillRect(bxx,byy,bodyW,bodyH);
  if(hasArmor){ctx.fillStyle='rgba(100,120,150,0.4)';ctx.fillRect(bxx,byy,bodyW,bodyH);}
  ctx.fillStyle='rgba(0,0,0,0.13)';ctx.fillRect(bxx,byy+bodyH-2,bodyW,2);

  // HEAD — rotated around its center toward mouse (pitch)
  const hcx=cx, hcy=baseY+headH/2;
  ctx.save();
  ctx.translate(hcx,hcy);
  ctx.rotate(headPitch*0.35);
  // face
  ctx.fillStyle=faceColor;
  ctx.fillRect(-headW/2,-headH/2,headW,headH);
  // hair strip top + sideburns
  ctx.fillStyle=hairColor;
  ctx.fillRect(-headW/2,-headH/2,headW,5);
  ctx.fillRect(fw>0?-headW/2:headW/2-2,-headH/2,2,headH);
  // eyes shift with head pitch
  const eyeShiftX=headPitch*3;
  if(fw>0){
    ctx.fillStyle=eyeColor;ctx.fillRect(4+eyeShiftX,0,3,3);
    ctx.fillStyle='rgba(255,255,255,0.55)';ctx.fillRect(5+eyeShiftX,0,1,1);
  } else {
    ctx.fillStyle=eyeColor;ctx.fillRect(-7+eyeShiftX,0,3,3);
    ctx.fillStyle='rgba(255,255,255,0.55)';ctx.fillRect(-6+eyeShiftX,0,1,1);
  }
  // subtle mouth
  ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(fw>0?3:-7+eyeShiftX,6,5,1);
  ctx.restore();

  // Front arm + item
  ctx.save();ctx.translate(fsx,fsy);ctx.rotate(frontAngle);
  ctx.fillStyle=bodyColor;ctx.fillRect(-3,0,6,armLen-4);
  ctx.fillStyle=faceColor;ctx.fillRect(-3,armLen-4,6,4);
  if(held){
    ctx.translate(0,armLen);
    if(held.tool){
      ctx.fillStyle=held.c||'#888';
      if(held.tool==='pick'){
        ctx.fillRect(-2,-14,4,22);
        ctx.fillRect(-9,-14,18,5);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(-9,-14,18,2);
      } else if(held.tool==='axe'){
        ctx.fillRect(-2,-12,4,20);
        ctx.fillRect(0,-12,10,8);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(0,-12,10,2);
      } else if(held.tool==='sword'){
        ctx.fillRect(-2,-20,4,24);
        ctx.fillRect(-6,-4,12,4);
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillRect(-1,-20,2,16);
      } else if(held.tool==='bow'){
        ctx.strokeStyle=held.c;ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(0,-4,8,-1,1);ctx.stroke();ctx.lineWidth=1;
        ctx.fillStyle='#ddd';ctx.fillRect(-1,-12,2,16);
      }
    } else if(isEating&&eatColor){
      ctx.fillStyle=eatColor;ctx.fillRect(-5,-5,10,10);
    } else {
      ctx.fillStyle=held.c||'#888';ctx.fillRect(-5,-5,10,10);
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(-5,-5,10,3);
    }
  } else if(isEating&&eatColor){
    ctx.translate(0,armLen);ctx.fillStyle=eatColor;ctx.fillRect(-5,-5,10,10);
  }
  ctx.restore();

  ctx.restore(); // end body tilt

  if(isEating&&Math.random()<0.06){
    const ehx=fsx+Math.cos(frontAngle)*armLen,ehy=fsy+Math.sin(frontAngle)*armLen;
    spawnWorldParticles(ehx,ehy,'#88FF88',1);
  }
}

function drawLocalName(){
  if(player.isDead) return;
  const name = playerName;
  if(!name) return;
  ctx.font='bold 10px "Courier New"';
  const tw=ctx.measureText(name).width;
  const nx=player.x-cam.x+player.w/2, ny=player.y-cam.y-8;
  ctx.fillStyle='rgba(0,0,0,0.78)';
  ctx.fillRect(nx-tw/2-4,ny-13,tw+8,14);
  ctx.fillStyle='#FFFFFF';
  ctx.fillText(name,nx-tw/2,ny-2);
}
function drawPlaceEffects(){for(let i=placeEffects.length-1;i>=0;i--){const pe=placeEffects[i];const sx=pe.x*BS-cam.x|0,sy=pe.y*BS-cam.y|0;const expand=(1-pe.life)*BS*0.5;
  ctx.fillStyle=`rgba(255,255,255,${pe.life*0.5})`;ctx.fillRect(sx,sy,BS,BS);
  ctx.strokeStyle=`rgba(255,255,220,${pe.life*0.9})`;ctx.lineWidth=3;ctx.strokeRect(sx-expand,sy-expand,BS+expand*2,BS+expand*2);
  if(pe.life>0.5){ctx.strokeStyle=`rgba(200,255,180,${(pe.life-0.5)*0.8})`;ctx.lineWidth=1.5;ctx.strokeRect(sx+2,sy+2,BS-4,BS-4);}
  ctx.lineWidth=1;}}

function drawBook(){
  if(!bookOpen&&bookAnim<=0)return;
  const t=bookAnim;
  const BW=680,BH=420;
  const bx=(W-BW)/2,by=(H-BH)/2;
  ctx.fillStyle=`rgba(0,0,0,${t*0.55})`;ctx.fillRect(0,0,W,H);
  ctx.fillStyle=`rgba(0,0,0,${t*0.4})`;ctx.fillRect(bx+8,by+8,BW,BH);
  ctx.save();
  ctx.translate(bx+BW/2,by+BH/2);
  const sc=0.6+0.4*t;ctx.scale(sc,sc);
  ctx.translate(-(bx+BW/2),-(by+BH/2));
  const grad=ctx.createLinearGradient(bx,by,bx+BW,by);
  grad.addColorStop(0,'#5A3A18');grad.addColorStop(0.5,'#7A5A28');grad.addColorStop(1,'#5A3A18');
  ctx.fillStyle=grad;ctx.fillRect(bx,by,BW,BH);
  ctx.strokeStyle='#9A7A40';ctx.lineWidth=3;ctx.strokeRect(bx+4,by+4,BW-8,BH-8);ctx.lineWidth=1;
  ctx.fillStyle='#F5EDD5';ctx.fillRect(bx+20,by+18,BW/2-24,BH-36);
  ctx.fillStyle='#EDE5CD';ctx.fillRect(bx+BW/2+4,by+18,BW/2-24,BH-36);
  ctx.fillStyle='#4A2A10';ctx.fillRect(bx+BW/2-6,by+8,12,BH-16);
  ctx.fillStyle='#6A4A20';ctx.fillRect(bx+BW/2-2,by+8,4,BH-16);
  ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;
  for(let i=0;i<16;i++){
    const ly=by+30+i*22;
    ctx.beginPath();ctx.moveTo(bx+24,ly);ctx.lineTo(bx+BW/2-28,ly);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx+BW/2+8,ly);ctx.lineTo(bx+BW-24,ly);ctx.stroke();
  }
  ctx.lineWidth=1;
  const lpx=bx+24,lpy=by+24,lpw=BW/2-52;
  ctx.fillStyle='#4A2A08';ctx.font='bold 15px "Courier New"';
  ctx.fillText('📖 SÁCH CÔNG THỨC',lpx+2,lpy+18);
  ctx.fillStyle='#8A5A20';ctx.fillRect(lpx,lpy+22,lpw,2);
  const pg=bookPage;
  const pageData=BOOK_PAGES[pg]||BOOK_PAGES[0];
  ctx.fillStyle='#6A4A18';ctx.font='bold 13px "Courier New"';
  ctx.fillText(pageData.title,lpx+4,lpy+42);
  const r0=RECIPES.find(r=>r.o===pageData.recipes[0]);
  if(r0)drawBookRecipe(lpx+4,lpy+50,r0,lpw);
  ctx.fillStyle='#8A6A40';ctx.font='10px "Courier New"';
  ctx.fillText('← A/D hoặc click để lật trang',lpx,by+BH-30);
  ctx.fillText(`Trang ${pg+1} / ${BOOK_PAGES.length}`,lpx,by+BH-16);
  const rpx=bx+BW/2+8,rpy=by+24,rpw=BW/2-32;
  if(pageData.recipes[1]){
    const r1=RECIPES.find(r=>r.o===pageData.recipes[1]);
    if(r1){
      ctx.fillStyle='#4A2A08';ctx.font='bold 13px "Courier New"';
      ctx.fillText(IT[pageData.recipes[1]]?.n||pageData.recipes[1],rpx+4,rpy+18);
      drawBookRecipe(rpx+4,rpy+26,r1,rpw);
    }
  }
  if(pageData.recipes[2]){
    const r2=RECIPES.find(r=>r.o===pageData.recipes[2]);
    if(r2){
      const r2y=rpy+(pageData.recipes[1]?170:30);
      ctx.fillStyle='#4A2A08';ctx.font='bold 13px "Courier New"';
      ctx.fillText(IT[pageData.recipes[2]]?.n||pageData.recipes[2],rpx+4,r2y-4);
      drawBookRecipe(rpx+4,r2y+4,r2,rpw);
    }
  }
  if(pg>0){
    ctx.fillStyle='rgba(100,60,20,0.85)';ctx.fillRect(bx+8,by+BH/2-20,28,40);
    ctx.fillStyle='#F5EDD5';ctx.font='bold 22px sans-serif';ctx.fillText('◀',bx+12,by+BH/2+8);
  }
  if(pg<BOOK_PAGES.length-1){
    ctx.fillStyle='rgba(100,60,20,0.85)';ctx.fillRect(bx+BW-36,by+BH/2-20,28,40);
    ctx.fillStyle='#F5EDD5';ctx.font='bold 22px sans-serif';ctx.fillText('▶',bx+BW-30,by+BH/2+8);
  }
  ctx.fillStyle='#8A6A40';ctx.font='10px "Courier New"';ctx.textAlign='right';
  ctx.fillText('R / ESC  đóng sách',bx+BW-24,by+BH-16);ctx.textAlign='left';
  ctx.restore();
}
function drawBookRecipe(rx,ry,recipe,maxW){
  const CS2=36,CG2=3;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const sx=rx+c*(CS2+CG2),sy=ry+r*(CS2+CG2);
    const cellKey=recipe.p[r]&&recipe.p[r][c];
    ctx.fillStyle=cellKey?'#DDD5BD':'#C8BFA5';
    ctx.fillRect(sx,sy,CS2,CS2);
    ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.strokeRect(sx,sy,CS2,CS2);
    if(cellKey){drawItemSprite(sx+2,sy+2,cellKey,CS2-4);}
  }
  const arX=rx+3*(CS2+CG2)+6;
  ctx.fillStyle='#6A4A18';ctx.font='bold 20px sans-serif';ctx.fillText('→',arX,ry+3*(CS2+CG2)/2+8);
  const outX=arX+26,outY=ry+3*(CS2+CG2)/2-CS2/2;
  ctx.fillStyle='#D4C89A';ctx.fillRect(outX,outY,CS2+6,CS2+6);
  ctx.strokeStyle='#8A6A20';ctx.lineWidth=2;ctx.strokeRect(outX,outY,CS2+6,CS2+6);ctx.lineWidth=1;
  drawItemSprite(outX+3,outY+3,recipe.o,CS2);
  const iname=IT[recipe.o]?.n||recipe.o;
  ctx.fillStyle='#4A2A08';ctx.font='bold 10px "Courier New"';
  ctx.fillText(iname,outX+CS2+12,outY+12);
  if(recipe.cnt>1){ctx.fillStyle='#884400';ctx.font='bold 11px "Courier New"';ctx.fillText('x'+recipe.cnt,outX+CS2+12,outY+26);}
}
function bookHandleClick(mx,my){
  const BW=680,BH=420,bx=(W-BW)/2,by=(H-BH)/2;
  if(bookPage>0&&mx>=bx+8&&mx<=bx+36&&my>=by+BH/2-20&&my<=by+BH/2+20){bookPage--;sndClick();return;}
  if(bookPage<BOOK_PAGES.length-1&&mx>=bx+BW-36&&mx<=bx+BW-8&&my>=by+BH/2-20&&my<=by+BH/2+20){bookPage++;sndClick();return;}
  if(mx<bx||mx>bx+BW||my<by||my>by+BH){bookOpen=false;}
}

function drawHUD(){const hbW=140,hbH=12,hbX=10,hbY=10;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,hbY-2,hbW+4,hbH+4);ctx.fillStyle='#5A0000';ctx.fillRect(hbX,hbY,hbW,hbH);ctx.fillStyle=player.health>50?'#3CB03C':player.health>25?'#CC8800':'#DD2222';ctx.fillRect(hbX,hbY,hbW*(player.health/player.maxHealth),hbH);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(hbX,hbY,hbW,hbH/2|0);ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.strokeRect(hbX,hbY,hbW,hbH);ctx.fillStyle='#fff';ctx.font='bold 9px "Courier New"';ctx.fillText('♥ '+Math.floor(player.health),hbX+4,hbY+hbH-2);const hgY=hbY+hbH+4;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,hgY-2,hbW+4,hbH+4);ctx.fillStyle='#4A2800';ctx.fillRect(hbX,hgY,hbW,hbH);ctx.fillStyle='#D4943A';ctx.fillRect(hbX,hgY,hbW*(player.hunger/player.maxHunger),hbH);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(hbX,hgY,hbW,hbH/2|0);ctx.strokeStyle='#444';ctx.strokeRect(hbX,hgY,hbW,hbH);ctx.fillStyle='#fff';ctx.fillText('🍖 '+Math.floor(player.hunger),hbX+4,hgY+hbH-2);const armorDef=getArmorDef();if(armorDef>0){const arY=hgY+hbH+4;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,arY-2,hbW+4,hbH+4);ctx.fillStyle='#2A2A5A';ctx.fillRect(hbX,arY,hbW,hbH);ctx.fillStyle='#7090D0';ctx.fillRect(hbX,arY,hbW*(armorDef/10),hbH);ctx.strokeStyle='#444';ctx.strokeRect(hbX,arY,hbW,hbH);ctx.fillStyle='#fff';ctx.fillText('🛡 '+armorDef,hbX+4,arY+hbH-2);}const slotSz=44,slotGap=3,totalW=HS*(slotSz+slotGap)-slotGap,hbSX=(W-totalW)/2|0,hbSY=H-slotSz-8;ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(hbSX-4,hbSY-4,totalW+8,slotSz+8);ctx.strokeStyle='#3a3a5a';ctx.lineWidth=1;ctx.strokeRect(hbSX-4,hbSY-4,totalW+8,slotSz+8);for(let i=0;i<HS;i++){const sx2=hbSX+i*(slotSz+slotGap),sy2=hbSY,sel=i===hotIdx;ctx.fillStyle=sel?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.4)';ctx.fillRect(sx2,sy2,slotSz,slotSz);ctx.strokeStyle=sel?'#ffffff':'#444466';ctx.lineWidth=sel?2:1;ctx.strokeRect(sx2,sy2,slotSz,slotSz);const sl=inv[i];if(sl){drawItemSprite(sx2+2,sy2+2,sl.key,slotSz-4);if(sl.count>1){ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(sx2+slotSz-18,sy2+slotSz-14,18,12);ctx.fillStyle='#fff';ctx.font='bold 11px "Courier New"';ctx.fillText(sl.count,sx2+slotSz-16,sy2+slotSz-4);}}ctx.fillStyle='#666';ctx.font='9px "Courier New"';ctx.fillText(i+1,sx2+3,sy2+11);}const selSl=inv[hotIdx];if(selSl&&IT[selSl.key]){const name=IT[selSl.key].n;ctx.font='bold 12px "Courier New"';const tw=ctx.measureText(name).width;const nx=(W-tw)/2|0,ny=hbSY-14;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(nx-6,ny-11,tw+12,16);ctx.fillStyle=IT[selSl.key].c||'#fff';ctx.fillText(name,nx,ny);}const isDaytime=dayT>0.14&&dayT<0.86;ctx.font='18px serif';ctx.fillText(isDaytime?'☀':'🌙',W-34,28);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='9px "Courier New"';ctx.fillText('X:'+Math.floor(player.x/BS)+' Y:'+Math.floor(player.y/BS),W-90,H-8);
  // Drop count HUD
  if(drops.length>0){ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(hbSX-4,hbSY-28,80,16);ctx.fillStyle='#AAFF88';ctx.font='9px "Courier New"';ctx.fillText('📦 '+drops.length+' vật phẩm',hbSX,hbSY-16);}
  if(player.health<30&&!player.isDead){ctx.fillStyle=`rgba(200,0,0,${(1-player.health/30)*0.25*Math.abs(Math.sin(Date.now()*0.003))})`;ctx.fillRect(0,0,W,H);}if(dmgFlash>0.05){ctx.fillStyle=`rgba(255,0,0,${dmgFlash*0.35})`;ctx.fillRect(0,0,W,H);}if(player.isDead){ctx.fillStyle='rgba(80,0,0,0.7)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#FF3333';ctx.font='bold 52px "Courier New"';ctx.fillText("BẠN ĐÃ CHẾT",W/2,H/2-30);ctx.fillStyle='#FFAAAA';ctx.font='18px "Courier New"';ctx.fillText("Click hoặc nhấn phím để hồi sinh",W/2,H/2+20);ctx.textAlign='left';}}

function drawWorld(){const x0=Math.max(0,Math.floor(cam.x/BS)-1),x1=Math.min(WW,Math.ceil((cam.x+W)/BS)+1),y0=Math.max(0,Math.floor(cam.y/BS)-1),y1=Math.min(WH,Math.ceil((cam.y+H)/BS)+1);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const b=getB(x,y);if(b)drawBlock(x,y,b);}}
function drawUndergroundDark(){let surf=0;for(let y=0;y<WH;y++)if(solid(Math.floor(player.x/BS+0.5),y)){surf=y;break;}const depth=Math.max(0,(player.y/BS-surf)/12);if(depth>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(0.65,depth*0.5)})`;ctx.fillRect(0,0,W,H);}}

function drawMinimap(){const mmW=120,mmH=60,mmX=W-mmW-10,mmY=40;ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(mmX-2,mmY-2,mmW+4,mmH+4);ctx.strokeStyle='#3a3a5a';ctx.strokeRect(mmX-2,mmY-2,mmW+4,mmH+4);const pBX=Math.floor(player.x/BS),pBY=Math.floor(player.y/BS),scale=2;for(let dx=-mmW/2;dx<mmW/2;dx++){for(let dy=-mmH/2;dy<mmH/2;dy++){const bx=pBX+Math.floor(dx/scale),by=pBY+Math.floor(dy/scale);const b=getB(bx,by);if(b&&BD[b]){ctx.fillStyle=BD[b].c;ctx.fillRect(mmX+dx+mmW/2,mmY+dy+mmH/2,1,1);}}}ctx.fillStyle='#FF4444';ctx.fillRect(mmX+mmW/2-1,mmY+mmH/2-1,3,3);for(const e of entities){const ex=(e.x/BS-pBX)*scale+mmW/2,ey=(e.y/BS-pBY)*scale+mmH/2;if(ex>0&&ex<mmW&&ey>0&&ey<mmH){ctx.fillStyle=e.type==='pig'?'#F0A0A0':'#40FF40';ctx.fillRect(mmX+ex,mmY+ey,2,2);}}}

const menubgCanvas=document.getElementById('menubg');
const menubgCtx=menubgCanvas.getContext('2d');
menubgCanvas.width=W;menubgCanvas.height=H;
let menuPanX=0;
function drawMenuBg(){menuPanX+=0.3;menubgCtx.fillStyle='#0a0a16';menubgCtx.fillRect(0,0,W,H);const mbs=8;for(let x=0;x<W/mbs+2;x++){const wx=Math.floor((x*mbs+menuPanX)/mbs)%WW;let sh=56+Math.sin(wx*0.035)*8+Math.sin(wx*0.012)*14;sh=Math.round(sh);const screenY=H*0.5;menubgCtx.fillStyle='#1a1a3a';menubgCtx.fillRect(x*mbs-menuPanX%mbs,0,mbs+1,screenY);for(let y=0;y<8;y++){let col='#5A7A30';if(y===0)col='#587030';else if(y<3)col='#7A5230';else col='#5A5A5A';if(Math.random()<0.02)col='#258018';menubgCtx.fillStyle=col;menubgCtx.fillRect(x*mbs-menuPanX%mbs,screenY+y*mbs,mbs+1,mbs+1);}menubgCtx.fillStyle='#3A2A10';menubgCtx.fillRect(x*mbs-menuPanX%mbs,screenY+8*mbs,mbs+1,H-screenY-8*mbs);}menubgCtx.fillStyle='rgba(0,0,0,0.5)';menubgCtx.fillRect(0,0,W,H);}


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
  // background
  pc2.fillStyle='rgba(20,20,40,0.0)';pc2.fillRect(0,0,W2,H2);
  // draw mini player centered
  const cx=W2/2|0;
  const baseY=20;
  const headW=18,headH=16,bodyW=14,bodyH=18,armW=6,armLen=17,legW=6,legLen=19,shoeH=4;
  // shadow
  pc2.fillStyle='rgba(0,0,0,0.2)';pc2.fillRect(cx-10,baseY+headH+bodyH+legLen+shoeH,20,4);
  // back arm (idle pose, slight swing back)
  pc2.save();pc2.translate(cx-bodyW/2,baseY+headH+4);pc2.rotate(-0.25);
  pc2.fillStyle=skinData.shirt;pc2.fillRect(-armW/2,0,armW,armLen);
  pc2.fillStyle=skinData.face;pc2.fillRect(-armW/2,armLen-5,armW,5);
  pc2.restore();
  // left leg
  pc2.save();pc2.translate(cx-4,baseY+headH+bodyH);pc2.rotate(0.1);
  pc2.fillStyle=skinData.pants;pc2.fillRect(-legW/2,0,legW,legLen);
  pc2.fillStyle=skinData.shoe;pc2.fillRect(-legW/2,legLen-shoeH,legW,shoeH);
  pc2.restore();
  // right leg
  pc2.save();pc2.translate(cx+4,baseY+headH+bodyH);pc2.rotate(-0.1);
  pc2.fillStyle=skinData.pants;pc2.fillRect(-legW/2,0,legW,legLen);
  pc2.fillStyle=skinData.shoe;pc2.fillRect(-legW/2,legLen-shoeH,legW,shoeH);
  pc2.restore();
  // body
  pc2.fillStyle=skinData.shirt;pc2.fillRect(cx-bodyW/2,baseY+headH,bodyW,bodyH);
  // shirt collar detail
  pc2.fillStyle='rgba(0,0,0,0.1)';pc2.fillRect(cx-bodyW/2,baseY+headH+bodyH-2,bodyW,2);
  // front arm
  pc2.save();pc2.translate(cx+bodyW/2,baseY+headH+4);pc2.rotate(0.2);
  pc2.fillStyle=skinData.shirt;pc2.fillRect(-armW/2,0,armW,armLen);
  pc2.fillStyle=skinData.face;pc2.fillRect(-armW/2,armLen-5,armW,5);
  pc2.restore();
  // head
  pc2.save();pc2.translate(cx,baseY+headH/2);
  pc2.fillStyle=skinData.face;pc2.fillRect(-headW/2,-headH/2,headW,headH);
  // hair
  pc2.fillStyle=skinData.hair;pc2.fillRect(-headW/2,-headH/2,headW,5);
  pc2.fillRect(-headW/2,-headH/2,3,headH);// sideburn
  // eyes
  pc2.fillStyle=skinData.eye;pc2.fillRect(3,0,3,3);
  // whites
  pc2.fillStyle='rgba(255,255,255,0.5)';pc2.fillRect(4,0,1,1);
  // mouth
  pc2.fillStyle='rgba(0,0,0,0.3)';pc2.fillRect(3,6,5,1);
  pc2.restore();
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
      buildSwatches('sw-hair','hair',SKIN_PALETTES.hair);
      buildSwatches('sw-eye','eye',SKIN_PALETTES.eye);
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
function renderSkinPreviewTo(pc2,W2,H2){
  pc2.clearRect(0,0,W2,H2);
  const cx=W2/2|0,baseY=4;
  const headW=10,headH=9,bodyW=8,bodyH=10,armW=3,armLen=10,legW=3,legLen=11,shoeH=2;
  pc2.fillStyle=skinData.pants;pc2.fillRect(cx-4,baseY+headH+bodyH,legW,legLen);pc2.fillRect(cx+1,baseY+headH+bodyH,legW,legLen);
  pc2.fillStyle=skinData.shoe;pc2.fillRect(cx-4,baseY+headH+bodyH+legLen-shoeH,legW,shoeH);pc2.fillRect(cx+1,baseY+headH+bodyH+legLen-shoeH,legW,shoeH);
  pc2.fillStyle=skinData.shirt;pc2.fillRect(cx-bodyW/2,baseY+headH,bodyW,bodyH);
  pc2.fillStyle=skinData.shirt;pc2.fillRect(cx-bodyW/2-armW,baseY+headH+2,armW,armLen);pc2.fillRect(cx+bodyW/2,baseY+headH+2,armW,armLen);
  pc2.fillStyle=skinData.face;pc2.fillRect(cx-headW/2,baseY,headW,headH);
  pc2.fillStyle=skinData.hair;pc2.fillRect(cx-headW/2,baseY,headW,3);pc2.fillRect(cx-headW/2,baseY,2,headH);
  pc2.fillStyle=skinData.eye;pc2.fillRect(cx+1,baseY+3,2,2);
}
function showSkinScreen(){
  document.getElementById('menu-overlay').style.display='none';
  document.getElementById('skin-screen').style.display='flex';
  buildSwatches('sw-face','face',SKIN_PALETTES.face);
  buildSwatches('sw-hair','hair',SKIN_PALETTES.hair);
  buildSwatches('sw-eye','eye',SKIN_PALETTES.eye);
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
    const cx=rx+13, baseY=ry;
    const sk=st.skin||{face:'#F5C8A0',hair:'#3A2008',eye:'#222',shirt:'#4080C0',pants:'#2A3A60',shoe:'#2A1808'};
    const wk=Math.sin((st.walkCycle||0))*0.55*(st.walkAmp||0);
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
    ctx.fillStyle=sk.shirt; ctx.fillRect(cx-7,baseY+17,14,18);
    // Head
    ctx.fillStyle=sk.face;  ctx.fillRect(cx-9,baseY,18,16);
    ctx.fillStyle=sk.hair;  ctx.fillRect(cx-9,baseY,18,5);
    ctx.fillStyle=sk.hair;  ctx.fillRect(fw>0?cx-9:cx+7,baseY,2,16);
    ctx.fillStyle=sk.eye;   ctx.fillRect(fw>0?cx+4:cx-7,baseY+6,3,3);
    ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fillRect(fw>0?cx+5:cx-6,baseY+6,1,1);
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
function showMainMenu(){document.getElementById('menu-overlay').style.display='flex';document.getElementById('world-screen').style.display='none';document.getElementById('settings-screen').style.display='none';document.getElementById('credits-screen').style.display='none';document.getElementById('skin-screen').style.display='none';document.getElementById('online-screen').style.display='none';document.getElementById('pause-overlay').style.display='none';document.getElementById('hints').style.display='none';}
function showWorldScreen(){document.getElementById('menu-overlay').style.display='none';const list=document.getElementById('world-list');list.innerHTML='';for(let i=0;i<MAX_SLOTS;i++){const has=hasSave(i);const info=getSaveInfo(i);const slot=document.createElement('div');slot.className='world-slot';const name=has?('Thế Giới '+(i+1)):('Ô Trống '+(i+1));const dateStr=info?new Date(info.time).toLocaleString('vi-VN'):'Chưa tạo';let delBtn='';if(has){delBtn='<div class="wdel" data-slot="'+i+'">Xóa</div>';}slot.innerHTML='<div><div class="wname">'+name+'</div><div class="winfo">'+dateStr+'</div></div>'+delBtn;slot.dataset.slot=i;slot.addEventListener('click',function(ev){if(ev.target.classList.contains('wdel')){ev.stopPropagation();const s=parseInt(ev.target.dataset.slot);if(confirm('Xóa thế giới này?')){deleteWorldSlot(s);showWorldScreen();}return;}const s=parseInt(this.dataset.slot);if(hasSave(s)){startGame(s);}else{createAndStart(s);}});list.appendChild(slot);}document.getElementById('world-screen').style.display='flex';}
function hideWorldScreen(){document.getElementById('world-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';}
function showSettings(){document.getElementById('menu-overlay').style.display='none';document.getElementById('vol-slider').value=Math.round(masterVol*100);document.getElementById('vol-val').textContent=Math.round(masterVol*100);document.getElementById('day-slider').value=daySpeed;document.getElementById('day-val').textContent=daySpeed;const _si=document.getElementById('player-name-input');if(_si)_si.value=playerName;document.getElementById('settings-screen').style.display='flex';}
function hideSettings(){masterVol=parseInt(document.getElementById('vol-slider').value)/100;daySpeed=parseInt(document.getElementById('day-slider').value);document.getElementById('vol-val').textContent=Math.round(masterVol*100);document.getElementById('day-val').textContent=daySpeed;try{localStorage.setItem('ps_settings',JSON.stringify({vol:masterVol,daySpeed:daySpeed}));}catch(e){}document.getElementById('settings-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem('ps_settings'));if(s){masterVol=s.vol||0.6;daySpeed=s.daySpeed||3;}}catch(e){}}
function showCredits(){document.getElementById('menu-overlay').style.display='none';document.getElementById('credits-screen').style.display='flex';}
function hideCredits(){document.getElementById('credits-screen').style.display='none';document.getElementById('menu-overlay').style.display='flex';}

function startGame(slot){currentSlot=slot;inv.fill(null);entities.length=0;drops.length=0;particles.length=0;craftGrid.fill(null);cursorItem=null;craftOpen=false;craftOutput=null;furnaceOpen=false;furnData.input=null;furnData.fuel=null;furnData.output=null;lmbDown=false;mineT=0;mineTarget=null;hungerTickTimer=3000+Math.random()*2000;document.getElementById('furnace-overlay').style.display='none';if(hasSave(slot)){loadWorld(slot);}else{generateWorld();initPlayerSpawn();player.health=player.maxHealth;player.hunger=player.maxHunger;player.isDead=false;dayT=0.35;addItem('WOOD_PICK',1);addItem('TORCH',8);addItem('BREAD',3);}document.getElementById('menu-overlay').style.display='none';document.getElementById('world-screen').style.display='none';document.getElementById('settings-screen').style.display='none';document.getElementById('credits-screen').style.display='none';document.getElementById('skin-screen').style.display='none';document.getElementById('online-screen').style.display='none';document.getElementById('pause-overlay').style.display='none';document.getElementById('hints').style.display='block';gameState='playing';}
function createAndStart(slot){currentSlot=slot;generateWorld();initPlayerSpawn();inv.fill(null);entities.length=0;drops.length=0;particles.length=0;player.health=player.maxHealth;player.hunger=player.maxHunger;player.isDead=false;dayT=0.35;addItem('WOOD_PICK',1);addItem('TORCH',8);addItem('BREAD',3);document.getElementById('menu-overlay').style.display='none';document.getElementById('world-screen').style.display='none';document.getElementById('hints').style.display='block';gameState='playing';try{saveWorld(slot);}catch(e){}}
function resumeGame(){gameState='playing';document.getElementById('pause-overlay').style.display='none';}
function saveAndQuit(){if(currentSlot>=0){try{saveWorld(currentSlot);}catch(e){}}}

document.getElementById('btn-play').addEventListener('click',function(){try{initAudio();}catch(e){}showWorldScreen();});
document.getElementById('btn-settings').addEventListener('click',function(){try{initAudio();}catch(e){}showSettings();});
document.getElementById('btn-online').addEventListener('click',function(){try{initAudio();}catch(e){}showOnlineScreen();});
document.getElementById('btn-skin').addEventListener('click',function(){showSkinScreen();});
document.getElementById('btn-credits').addEventListener('click',function(){showCredits();});
document.getElementById('btn-back-world').addEventListener('click',function(){hideWorldScreen();});
document.getElementById('btn-create-world').addEventListener('click',function(){for(let i=0;i<MAX_SLOTS;i++){if(!hasSave(i)){createAndStart(i);return;}}alert('Tất cả ô đã đầy! Hãy xóa một thế giới.');});
document.getElementById('btn-back-settings').addEventListener('click',function(){hideSettings();});
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
document.getElementById('btn-save-skin').addEventListener('click',function(){saveSkin();const btn=this;btn.textContent='Da Luu!';setTimeout(()=>btn.textContent='Luu Skin',1200);});
document.getElementById('btn-back-skin').addEventListener('click',function(){hideSkinScreen();});
document.getElementById('btn-resume').addEventListener('click',function(){resumeGame();});
document.getElementById('btn-save-quit').addEventListener('click',function(){saveAndQuit();gameState='menu';document.getElementById('pause-overlay').style.display='none';showMainMenu();});
document.getElementById('furnace-close-btn').addEventListener('click',function(){closeFurnace();});
document.getElementById('furn-input').addEventListener('click',function(){furnaceClick('input');});
document.getElementById('furn-fuel').addEventListener('click',function(){furnaceClick('fuel');});
document.getElementById('furn-output').addEventListener('click',function(){furnaceClick('output');});
document.getElementById('vol-slider').addEventListener('input',function(){document.getElementById('vol-val').textContent=this.value;masterVol=this.value/100;});
document.getElementById('day-slider').addEventListener('input',function(){document.getElementById('day-val').textContent=this.value;daySpeed=parseInt(this.value);});

document.getElementById('splash-text').textContent=SPLASHES[Math.floor(Math.random()*SPLASHES.length)];
loadSettings();

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
    if(Math.abs(player.vx)>0.1){walkCycle+=dt*0.012;walkAmp=Math.min(1,walkAmp+dt*0.006);}else{walkAmp=Math.max(0,walkAmp-dt*0.006);}
    if(!lmbDown)mineAmp=Math.max(0,mineAmp-dt*0.005);
    minePhase+=dt*0.011;
    // --- lean/bounce/bob updates ---
    const targetTilt=player.onGround?player.vx*0.022:0;
    bodyTilt+=(targetTilt-bodyTilt)*(1-Math.pow(0.001,dt/1000));
    // bounce on start/stop
    if(walkAmp>prevWalkAmp+0.05)moveBounce=0.35;
    if(walkAmp<prevWalkAmp-0.05&&prevWalkAmp>0.2)moveBounce=0.25;
    if(moveBounce>0)moveBounce=Math.max(0,moveBounce-dt*0.004);
    prevWalkAmp=walkAmp;
    // walking vertical bob
    walkBob=player.onGround?Math.abs(Math.sin(walkCycle))*walkAmp*4:0;
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