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
          if(r<0.10&&depth>6)world[ny*WW+nx]=B.COAL;
          else if(r<0.22&&depth>12)world[ny*WW+nx]=B.IRON;
          else if(r<0.28&&depth>24)world[ny*WW+nx]=B.COPPER_ORE;
          else if(r<0.32&&depth>30)world[ny*WW+nx]=B.GOLD;
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
      if(r<0.032&&y>sh+7)world[y*WW+x]=B.COAL;
      else if(r<0.062&&y>sh+10)world[y*WW+x]=B.IRON;
      else if(r<0.084&&y>sh+10)world[y*WW+x]=B.COPPER_ORE;
      else if(r<0.098&&y>sh+28)world[y*WW+x]=B.GOLD;
      else if(r<0.108&&y>sh+22)world[y*WW+x]=B.EMERALD_ORE;
      else if(r<0.116&&y>sh+38)world[y*WW+x]=B.DIAMOND_ORE;
      else if(r<0.122&&y>sh+8)world[y*WW+x]=B.GRAVEL;
      else if(r<0.127&&y>sh+12)world[y*WW+x]=B.CLAY;
      else if(r<0.130&&y>sh+50)world[y*WW+x]=B.OBSIDIAN;
      else if(r<0.132&&y>sh+6)world[y*WW+x]=B.MOSS_STONE;
      else if(r<0.136&&y>sh+55)world[y*WW+x]=B.MAGMA;
      else if(r<0.139&&y>sh+30)world[y*WW+x]=B.BONE;
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
let clickArmSide=1,clickArmKick=0; // random left/right arm pop toward cursor
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
  {title:'Xây Dựng Cơ Bản',recipes:['PLANK','STICK','TORCH']},
  {title:'Đồ Dùng',recipes:['BENCH','FURNACE','CHEST']},
  {title:'Giường & Kính',recipes:['BED','GLASS','BOOKSHELF']},
  {title:'Giáp Bảo Vệ',recipes:['IRON_CHESTPLATE','DIAMOND_CHESTPLATE','SHIELD']},
  {title:'Đặc Biệt',recipes:['GOLDEN_APPLE','BUCKET','FLINT']},
  {title:'Đèn & Bình',recipes:['LANTERN','ROPE','POTION']},
  {title:'Khối Trang Trí',recipes:['COBBLESTONE','IRON_BLOCK','GOLD_BLOCK']},
  {title:'Khối Quý & Cửa',recipes:['DIAMOND_BLOCK','DOOR']},
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
canvas.addEventListener('touchstart',e=>{if(controlMode!=='mobile')return;e.preventDefault();const t=e.changedTouches[0];if(!t)return;updateMouseFromClient(t.clientX,t.clientY);if(gameState==='playing'&&!player.isDead)doRightClick();},{passive:false});
canvas.addEventListener('touchmove',e=>{if(controlMode!=='mobile')return;e.preventDefault();const t=e.changedTouches[0];if(!t)return;updateMouseFromClient(t.clientX,t.clientY);},{passive:false});
canvas.addEventListener('touchend',e=>{if(controlMode!=='mobile')return;e.preventDefault();},{passive:false});
canvas.addEventListener('mousedown',e=>{e.preventDefault();if(gameState!=='playing')return;if(player.isDead){respawnPlayer();return;}if(furnaceOpen)return;if(craftOpen){handleCraftClick(mouseX,mouseY,e.button===2);return;}if(bookOpen){bookHandleClick(mouseX,mouseY);return;}if(chestOpen){handleChestClick(mouseX,mouseY,e.button===2);return;}if(e.button===0){lmbDown=true;const _mt=Math.floor(mouseWX),_my=Math.floor(mouseWY);const _b=getB(_mt,_my);const _inr=inReach(_mt,_my);if(!(_b!==B.AIR&&BD[_b]&&BD[_b].h<9999&&_inr))triggerClickSwing();}if(e.button===2)doRightClick();});
canvas.addEventListener('mouseup',e=>{if(e.button===0){lmbDown=false;mineT=0;mineTarget=null;}if(e.button===2)rmbDown=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('wheel',e=>{if(craftOpen||furnaceOpen)return;hotIdx=(hotIdx+(e.deltaY>0?1:-1)+HS)%HS;},{passive:true});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(gameState==='menu')return;if(player.isDead&&gameState==='playing'){respawnPlayer();return;}if(e.code==='KeyE'){if(chestOpen){closeChest();return;}if(furnaceOpen){closeFurnace();return;}if(craftOpen)closeCraftUI();else{craftOpen=true;checkCraftRecipe();}}if(e.code==='KeyF'&&!craftOpen&&!furnaceOpen){const{tx,ty}=getTile();if(getB(tx,ty)===B.FURNACE&&inReach(tx,ty)){openFurnace();return;}}if(e.code==='Escape'){if(bookOpen){bookOpen=false;return;}if(chestOpen){closeChest();return;}if(craftOpen){closeCraftUI();return;}if(furnaceOpen){closeFurnace();return;}if(gameState==='playing'){gameState='paused';document.getElementById('pause-overlay').style.display='flex';return;}if(gameState==='paused'){resumeGame();return;}}if(e.code==='KeyR'&&!craftOpen&&!furnaceOpen){bookOpen=!bookOpen;sndClick();return;}
if(!craftOpen&&!furnaceOpen&&!bookOpen&&e.code>='Digit1'&&e.code<='Digit9')hotIdx=+e.code[5]-1;});
document.addEventListener('keyup',e=>{keys[e.code]=false;});

function getTile(){return{tx:Math.floor(mouseWX),ty:Math.floor(mouseWY)};}
function inReach(tx,ty){const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS;return Math.sqrt((tx+0.5-px)**2+(ty+0.5-py)**2)<=REACH;}

function isDoorBlock(t){return t===B.DOOR||t===B.DOOR_OPEN||t===B.DOOR_TOP||t===B.DOOR_TOP_OPEN;}
function isDoorOpenBlock(t){return t===B.DOOR_OPEN||t===B.DOOR_TOP_OPEN;}
function isDoorTopBlock(t){return t===B.DOOR_TOP||t===B.DOOR_TOP_OPEN;}
function doorBaseY(tx,ty){const t=getB(tx,ty);if(isDoorTopBlock(t)) return ty+1; if(t===B.DOOR||t===B.DOOR_OPEN) return ty; const below=getB(tx,ty+1); if(isDoorTopBlock(below)) return ty+1; return null;}
function setDoorPair(tx,baseY,open){if(baseY===null||baseY<=0) return false; setB(tx,baseY,open?B.DOOR_OPEN:B.DOOR); setB(tx,baseY-1,open?B.DOOR_TOP_OPEN:B.DOOR_TOP); return true;}
function clearDoorPair(tx,ty){const baseY=doorBaseY(tx,ty); if(baseY===null) return false; setB(tx,baseY,B.AIR); if(baseY>0) setB(tx,baseY-1,B.AIR); return true;}
function toggleDoorPair(tx,ty){const baseY=doorBaseY(tx,ty); if(baseY===null) return false; const open=isDoorOpenBlock(getB(tx,baseY))||isDoorOpenBlock(getB(tx,baseY-1)); if(!setDoorPair(tx,baseY,!open)) return false; if(onlineMode){broadcastToAll({type:'block',x:tx,y:baseY,t:!open?B.DOOR:B.DOOR_OPEN}); if(baseY>0) broadcastToAll({type:'block',x:tx,y:baseY-1,t:!open?B.DOOR_TOP:B.DOOR_TOP_OPEN});} sndPlace(); return true;}
function placeDoorPair(tx,ty){if(ty<=0) return false; if(getB(tx,ty)!==B.AIR||getB(tx,ty-1)!==B.AIR) return false; const px=player.x,py=player.y,pw=player.w,ph=player.h; const hit=(x,y)=>x*BS<px+pw&&(x+1)*BS>px&&y*BS<py+ph&&(y+1)*BS>py; if(hit(tx,ty)||hit(tx,ty-1)) return false; if(!setDoorPair(tx,ty,false)) return false; if(onlineMode){broadcastToAll({type:'block',x:tx,y:ty,t:B.DOOR}); broadcastToAll({type:'block',x:tx,y:ty-1,t:B.DOOR_TOP});} sndPlace(); return true;}
function handleMining(dt){hitCD=Math.max(0,hitCD-dt);mineSoundCD=Math.max(0,mineSoundCD-dt);if(!lmbDown||craftOpen||furnaceOpen||chestOpen||player.isDead){mineT=0;mineTarget=null;mineAmp=Math.max(0,mineAmp-dt*0.008);return;}if(isEating){isEating=false;eatTimer=0;eatColor=null;}const eTarget=getEntityAtMouse();if(eTarget){const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS,ex=eTarget.x/BS+eTarget.w/2/BS,ey=eTarget.y/BS+eTarget.h/2/BS;if(Math.sqrt((px-ex)**2+(py-ey)**2)<=REACH+1&&hitCD<=0){let dmg=1;const held=getHeld();if(held?.dmg)dmg=held.dmg;else if(held?.tool==='axe')dmg=held.pow*2;else if(held?.tool==='pick')dmg=held.pow;eTarget.health-=dmg;eTarget.hitFlash=1;hitCD=300;sndHitEnt();spawnParticles(Math.floor(eTarget.x/BS),Math.floor(eTarget.y/BS),'#FF0000',4);mineAmp=1;minePhase=Math.PI/2;triggerClickSwing();}return;}const{tx,ty}=getTile();const b=getB(tx,ty);if(b===B.AIR||!inReach(tx,ty)){mineT=0;mineTarget=null;return;}if(b===B.BEDROCK){mineT=0;return;}if(mineTarget&&(mineTarget.x!==tx||mineTarget.y!==ty))mineT=0;mineTarget={x:tx,y:ty};const bd=BD[b];if(!bd)return;let spd=1;const held=getHeld();if(held?.tool==='pick'&&(b===B.STONE||b===B.COAL||b===B.IRON||b===B.GOLD||b===B.DIAMOND_ORE||b===B.EMERALD_ORE||b===B.COPPER_ORE||b===B.MOSS_STONE||b===B.OBSIDIAN||b===B.BRICK||b===B.FURNACE||b===B.GRAVEL||b===B.CLAY||b===B.COBBLESTONE||b===B.IRON_BLOCK||b===B.GOLD_BLOCK||b===B.DIAMOND_BLOCK))spd=held.pow;
  if(held?.tool==='axe'&&(b===B.LOG||b===B.LEAVES||b===B.PLANK||b===B.BENCH||b===B.CACTUS||b===B.BOOKSHELF||b===B.CHEST||b===B.BED||isDoorBlock(b)))spd=held.pow;mineT+=dt/1000*spd;
  mineAmp=1.0;
  if(mineSoundCD<=0){sndMine();mineSoundCD=280;}if(Math.random()<0.08)spawnParticles(tx,ty,'#FFF',1);if(mineT>=bd.h){sndBreak();spawnParticles(tx,ty,bd.c||'#888',8);
    // SPAWN DROP instead of directly adding item
    if(bd.d && !isDoorBlock(b))spawnDrop(tx,ty,bd.d);
    if(isDoorBlock(b)){const baseY=doorBaseY(tx,ty);clearDoorPair(tx,ty);if(onlineMode&&baseY!==null){broadcastToAll({type:'block',x:tx,y:baseY,t:B.AIR});if(baseY>0)broadcastToAll({type:'block',x:tx,y:baseY-1,t:B.AIR});}spawnDrop(tx,ty,'DOOR');mineT=0;mineTarget=null;return;}
    if(onlineMode)broadcastToAll({type:'block',x:tx,y:ty,t:B.AIR});
    if(b===B.TNT){sndExplosion();for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++){if(Math.abs(dx)+Math.abs(dy)<=4&&getB(tx+dx,ty+dy)!==B.BEDROCK){spawnParticles(tx+dx,ty+dy,'#FF4400',3);setB(tx+dx,ty+dy,B.AIR);}}for(const ent of entities){const ddx=ent.x/BS-tx,ddy=ent.y/BS-ty;if(Math.abs(ddx)<5&&Math.abs(ddy)<5)ent.health-=30;}if(Math.abs(player.x/BS-tx)<5&&Math.abs(player.y/BS-ty)<5){player.health=Math.max(0,player.health-20);dmgFlash=1;sndHurt();}}setB(tx,ty,B.AIR);mineT=0;mineTarget=null;}}

function doRightClick(){if(craftOpen||furnaceOpen||chestOpen||player.isDead)return;const sl=inv[hotIdx];if(!sl)return;const it=IT[sl.key];if(it?.food){if(player.hunger<player.maxHunger||player.health<player.maxHealth){player.hunger=Math.min(player.maxHunger,player.hunger+(it.hunger||20));player.health=Math.min(player.maxHealth,player.health+(it.heal||5));sl.count--;if(sl.count<=0)inv[hotIdx]=null;isEating=true;eatTimer=0;eatColor=it.c;sndEat();return;}}const{tx,ty}=getTile();if(!inReach(tx,ty))return;
  if(isDoorBlock(getB(tx,ty))||isDoorTopBlock(getB(tx,ty))){if(toggleDoorPair(tx,ty))return;}
  if(getB(tx,ty)===B.BENCH){craftOpen=true;checkCraftRecipe();return;}if(getB(tx,ty)===B.FURNACE){openFurnace();return;}if(getB(tx,ty)===B.CHEST){openChest(tx,ty);return;}if(getB(tx,ty)===B.BED){if(dayT>0.86||dayT<0.14){dayT=0.18;sndLevelUp();spawnWorldParticles(player.x+player.w/2,player.y,'#FFFF88',8);return;}}if(it?.block===B.DOOR){if(placeDoorPair(tx,ty)) {sl.count--;if(sl.count<=0)inv[hotIdx]=null;isPlacing=true;placeTimer=0;placeEffects.push({x:tx,y:ty,life:1});}return;}if(it?.block===undefined)return;if(getB(tx,ty)!==B.AIR)return;if(tx*BS<player.x+player.w&&(tx+1)*BS>player.x&&ty*BS<player.y+player.h&&(ty+1)*BS>player.y)return;sndPlace();setB(tx,ty,it.block);if(onlineMode)broadcastToAll({type:'block',x:tx,y:ty,t:it.block});sl.count--;if(sl.count<=0)inv[hotIdx]=null;isPlacing=true;placeTimer=0;placeEffects.push({x:tx,y:ty,life:1});}

function physicsStep(dt){if(player.isDead)return;const s=dt/16.667;player.vx=0;if(!craftOpen&&!furnaceOpen&&!chestOpen){if(bookOpen){if(keys['KeyA']&&bookPage>0){bookPage--;keys['KeyA']=false;}if(keys['KeyD']&&bookPage<BOOK_PAGES.length-1){bookPage++;keys['KeyD']=false;}return;}
    if(keys['KeyA']||keys['ArrowLeft']){player.vx=-MSPD;player.facing=-1;}if(keys['KeyD']||keys['ArrowRight']){player.vx=MSPD;player.facing=1;}}if(!craftOpen&&!furnaceOpen&&!chestOpen&&(keys['KeyW']||keys['Space']||keys['ArrowUp'])&&player.onGround){player.vy=JSPD;player.onGround=false;}player.vy+=GRAV*s;if(player.vy>22)player.vy=22;const pCX=Math.floor((player.x+player.w/2)/BS),pCY=Math.floor((player.y+player.h/2)/BS);for(let dx=-1;dx<=1;dx++)for(let dy=-2;dy<=0;dy++){const nb=getB(pCX+dx,pCY+dy);if(nb===B.CACTUS&&hitCD<=0){player.health=Math.max(0,player.health-3);hitCD=500;sndHurt();dmgFlash=0.5;}if(nb===B.MAGMA&&hitCD<=0){player.health=Math.max(0,player.health-2);hitCD=600;sndHurt();dmgFlash=0.4;}if(nb===B.ICE_SPIKE&&hitCD<=0){player.health=Math.max(0,player.health-1);hitCD=400;sndHurt();dmgFlash=0.3;}}player.x+=player.vx*s;resolveX();player.y+=player.vy*s;resolveY();}
function resolveX(){const lx=Math.floor(player.x/BS),rx=Math.floor((player.x+player.w-1)/BS),ty=Math.floor(player.y/BS),by=Math.floor((player.y+player.h-1)/BS);for(let y=ty;y<=by;y++){if(solid(lx,y))player.x=(lx+1)*BS;if(solid(rx,y))player.x=rx*BS-player.w;}player.x=Math.max(0,Math.min(WW*BS-player.w,player.x));}
function resolveY(){const lx=Math.floor(player.x/BS),rx=Math.floor((player.x+player.w-1)/BS),ty=Math.floor(player.y/BS),by=Math.floor((player.y+player.h-1)/BS);player.onGround=false;for(let x=lx;x<=rx;x++){if(solid(x,ty)&&player.vy<0){player.y=(ty+1)*BS;player.vy=0;}if(solid(x,by)&&player.vy>=0){player.y=by*BS-player.h;player.vy=0;player.onGround=true;}}if(player.y<0){player.y=0;player.vy=0;}if(player.y+player.h>WH*BS){player.y=WH*BS-player.h;player.vy=0;player.onGround=true;}}

let dayT=0.35;
