function skyColor(t){const stops=[[0,[8,8,28]],[0.09,[8,8,28]],[0.14,[255,100,40]],[0.18,[120,180,240]],[0.5,[100,170,235]],[0.82,[120,180,240]],[0.86,[255,100,40]],[0.91,[8,8,28]],[1,[8,8,28]]];let a=stops[0][1],b2=stops[0][1],f=0;for(let i=1;i<stops.length;i++)if(t<=stops[i][0]){f=(t-stops[i-1][0])/(stops[i][0]-stops[i-1][0]);a=stops[i-1][1];b2=stops[i][1];break;}return a.map((v,i)=>Math.round(v+(b2[i]-v)*f));}
function drawSky(){const[r,g,bl]=skyColor(dayT);ctx.fillStyle=`rgb(${r},${g},${bl})`;ctx.fillRect(0,0,W,H);const sunAngle=(dayT-0.5)*Math.PI*2,sunX=W/2+Math.cos(sunAngle)*360,sunY=H/2+Math.sin(sunAngle)*280;const isDaytime=dayT>0.14&&dayT<0.86;if(isDaytime){ctx.fillStyle='#FFE060';ctx.beginPath();ctx.arc(sunX,sunY,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFD030';ctx.beginPath();ctx.arc(sunX,sunY,14,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#E0E8FF';ctx.beginPath();ctx.arc(sunX,sunY,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,0.7)';for(let i=0;i<40;i++)ctx.fillRect((i*137+50)%W,(i*89+20)%(H*0.45),2,2);}const cloudOff=(dayT*3000)%W;ctx.fillStyle='rgba(255,255,255,'+(isDaytime?0.7:0.15)+')';[[120,60,110,18],[310,40,150,14],[540,70,90,16],[730,50,130,20]].forEach(([cx,cy,cw,ch])=>{const ox=(cx+cloudOff)%W-cw;ctx.fillRect(ox,cy,cw,ch);ctx.fillRect(ox+12,cy-10,cw-24,ch+6);});}

const TRANSPARENT_BLOCKS=new Set([B.FLOWER_R,B.FLOWER_Y,B.MUSHROOM,B.TORCH,B.LANTERN,B.ICE_SPIKE,B.DOOR_OPEN,B.DOOR_TOP_OPEN]);

function drawDoorPart(sx,sy,open,isTop){
  if(!open){
    ctx.fillStyle='#6A4010';ctx.fillRect(sx+2,sy,BS-4,BS);
    ctx.fillStyle='#8A5820';ctx.fillRect(sx+4,sy+2,BS-8,BS-4);
    ctx.fillStyle='rgba(255,200,100,0.15)';ctx.fillRect(sx+5,sy+4,BS-10,BS/2-6);
    ctx.fillStyle='rgba(255,200,100,0.1)';ctx.fillRect(sx+5,sy+BS/2+2,BS-10,BS/2-6);
    if(!isTop){
      ctx.fillStyle='#5A3008';ctx.fillRect(sx+4,sy+BS/2-1,BS-8,2);
      ctx.fillStyle='#D4A030';ctx.fillRect(sx+BS-8,sy+BS/2-3,4,6);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(sx+BS-9,sy+BS/2-4,6,8);ctx.fillRect(sx+BS-8,sy+BS/2-3,4,6);
    }else{
      ctx.fillStyle='rgba(0,0,0,0.16)';ctx.fillRect(sx+4,sy+2,BS-8,3);
    }
  }else{
    ctx.fillStyle='#6A4010';ctx.fillRect(sx,sy,4,BS);
    ctx.fillStyle='#8A5820';ctx.fillRect(sx+1,sy+1,2,BS-2);
    if(!isTop){
      ctx.fillStyle='#D4A030';ctx.fillRect(sx+1,sy+BS/2-2,2,4);
    }
  }
}

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
  else if(type===B.COBBLESTONE){
    ctx.fillStyle='#6A6A6A';
    // rough stone chunks pattern
    [[0,0,14,14],[16,2,12,12],[2,16,12,12],[16,16,14,14]].forEach(([ox,oy,ow,oh])=>{
      ctx.fillRect(sx+ox+1,sy+oy+1,ow,oh);
    });
    ctx.fillStyle='rgba(255,255,255,0.07)';ctx.fillRect(sx,sy,BS,2);ctx.fillRect(sx,sy,2,BS);
    ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(sx,sy+BS-2,BS,2);ctx.fillRect(sx+BS-2,sy,2,BS);
    ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx+15,sy);ctx.lineTo(sx+15,sy+BS);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx,sy+15);ctx.lineTo(sx+BS,sy+15);ctx.stroke();}
  else if(type===B.IRON_BLOCK){
    ctx.fillStyle='#C0C0C8';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#D8D8E0';ctx.fillRect(sx+2,sy+2,BS-4,6);
    ctx.fillStyle='#A8A8B8';ctx.fillRect(sx+2,sy+BS-4,BS-4,3);
    ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(sx+4,sy+4,8,8);ctx.fillRect(sx+18,sy+18,8,8);
    ctx.strokeStyle='#909098';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx,sy+BS/2);ctx.lineTo(sx+BS,sy+BS/2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+BS/2,sy);ctx.lineTo(sx+BS/2,sy+BS);ctx.stroke();}
  else if(type===B.GOLD_BLOCK){
    ctx.fillStyle='#FFD700';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#FFE840';ctx.fillRect(sx+2,sy+2,BS-4,6);
    ctx.fillStyle='#CC9900';ctx.fillRect(sx+2,sy+BS-4,BS-4,3);
    ctx.fillStyle='rgba(255,255,200,0.35)';ctx.fillRect(sx+4,sy+4,8,8);ctx.fillRect(sx+18,sy+18,8,8);
    ctx.strokeStyle='#B88800';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx,sy+BS/2);ctx.lineTo(sx+BS,sy+BS/2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+BS/2,sy);ctx.lineTo(sx+BS/2,sy+BS);ctx.stroke();}
  else if(type===B.DIAMOND_BLOCK){
    ctx.fillStyle='#40E8E8';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#70FFFF';ctx.fillRect(sx+2,sy+2,BS-4,6);
    ctx.fillStyle='#20A8A8';ctx.fillRect(sx+2,sy+BS-4,BS-4,3);
    ctx.fillStyle='rgba(200,255,255,0.35)';ctx.fillRect(sx+4,sy+4,8,8);ctx.fillRect(sx+18,sy+18,8,8);
    ctx.strokeStyle='#189898';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx,sy+BS/2);ctx.lineTo(sx+BS,sy+BS/2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+BS/2,sy);ctx.lineTo(sx+BS/2,sy+BS);ctx.stroke();}
  else if(type===B.DOOR){drawDoorPart(sx,sy,false,false);}
  else if(type===B.DOOR_OPEN){drawDoorPart(sx,sy,true,false);}
  else if(type===B.DOOR_TOP){drawDoorPart(sx,sy,false,true);}
  else if(type===B.DOOR_TOP_OPEN){drawDoorPart(sx,sy,true,true);}
  else if(type===B.CRYSTAL){
    ctx.fillStyle='#4A1880';ctx.fillRect(sx,sy,BS,BS);
    // Large crystal spires
    ctx.fillStyle='#9040D8';
    ctx.beginPath();ctx.moveTo(sx+10,sy);ctx.lineTo(sx+6,sy+BS);ctx.lineTo(sx+14,sy+BS);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(sx+22,sy+4);ctx.lineTo(sx+18,sy+BS);ctx.lineTo(sx+26,sy+BS);ctx.closePath();ctx.fill();
    ctx.fillStyle='#C080FF';
    ctx.beginPath();ctx.moveTo(sx+10,sy+2);ctx.lineTo(sx+8,sy+12);ctx.lineTo(sx+12,sy+12);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(sx+22,sy+6);ctx.lineTo(sx+20,sy+14);ctx.lineTo(sx+24,sy+14);ctx.closePath();ctx.fill();
    // Glint
    ctx.fillStyle='rgba(220,160,255,0.6)';ctx.fillRect(sx+9,sy+4,2,4);ctx.fillRect(sx+21,sy+8,2,3);
    ctx.fillStyle='rgba(200,120,255,0.15)';ctx.fillRect(sx,sy,BS,BS);
  }
  else if(type===B.TERRACOTTA){
    ctx.fillStyle='#A03C18';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#C05028';ctx.fillRect(sx+2,sy+2,BS-4,8);
    ctx.fillStyle='#883010';ctx.fillRect(sx+2,sy+BS-4,BS-4,3);
    ctx.fillStyle='rgba(255,120,60,0.12)';ctx.fillRect(sx+4,sy+6,10,6);ctx.fillRect(sx+18,sy+16,8,5);
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(sx,sy+12,BS,2);ctx.fillRect(sx,sy+22,BS,2);
  }
  else if(type===B.BASALT){
    ctx.fillStyle='#1E1E2C';ctx.fillRect(sx,sy,BS,BS);
    // columnar basalt pattern
    ctx.fillStyle='#2A2A3C';
    [[0,0,10,BS],[11,0,10,BS],[22,0,10,BS]].forEach(([ox,oy,ow,oh])=>ctx.fillRect(sx+ox,sy+oy,ow,oh));
    ctx.fillStyle='rgba(60,60,90,0.4)';ctx.fillRect(sx+0,sy,1,BS);ctx.fillRect(sx+11,sy,1,BS);ctx.fillRect(sx+22,sy,1,BS);
    ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(sx,sy,BS,2);
  }
  else if(type===B.MUD){
    ctx.fillStyle='#2E1E0E';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#3A2818';ctx.fillRect(sx+3,sy+4,10,8);ctx.fillRect(sx+18,sy+16,9,7);
    // wet sheen
    ctx.fillStyle='rgba(80,50,20,0.35)';ctx.fillRect(sx+5,sy+10,18,3);ctx.fillRect(sx+2,sy+22,12,3);
    ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(sx,sy+BS-3,BS,3);
  }
  else if(type===B.HAY_BALE){
    ctx.fillStyle='#B89010';ctx.fillRect(sx,sy,BS,BS);
    ctx.fillStyle='#C8A820';ctx.fillRect(sx+2,sy+2,BS-4,BS-4);
    // horizontal straw lines
    ctx.fillStyle='#D4B828';for(let i=0;i<5;i++)ctx.fillRect(sx+2,sy+4+i*6,BS-4,2);
    // vertical binding straps
    ctx.fillStyle='#8A6808';ctx.fillRect(sx+9,sy,4,BS);ctx.fillRect(sx+19,sy,4,BS);
    ctx.fillStyle='rgba(255,230,80,0.2)';ctx.fillRect(sx+2,sy+2,8,BS-4);
  }
  else if(type===B.MOSSY_COBBLE){
    ctx.fillStyle='#555';ctx.fillRect(sx,sy,BS,BS);
    [[0,0,14,14],[16,2,12,12],[2,16,12,12],[16,16,14,14]].forEach(([ox,oy,ow,oh])=>{
      ctx.fillStyle='#585858';ctx.fillRect(sx+ox+1,sy+oy+1,ow,oh);
    });
    // moss patches
    ctx.fillStyle='rgba(50,130,30,0.72)';
    ctx.fillRect(sx+2,sy+2,7,5);ctx.fillRect(sx+18,sy+18,8,6);ctx.fillRect(sx+14,sy+4,6,4);
    ctx.fillStyle='rgba(80,170,40,0.45)';
    ctx.fillRect(sx+3,sy+3,4,3);ctx.fillRect(sx+19,sy+19,5,3);
    ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(sx,sy+BS-2,BS,2);ctx.fillRect(sx+BS-2,sy,2,BS);
  }
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

function drawBlockCursor(){if(craftOpen||furnaceOpen)return;const tx=Math.floor(mouseWX),ty=Math.floor(mouseWY);const px=player.x/BS+player.w/2/BS,py=player.y/BS+player.h/2/BS;if(Math.sqrt((tx+0.5-px)**2+(ty+0.5-py)**2)>REACH)return;const b=getB(tx,ty),sx=tx*BS-cam.x,sy=ty*BS-cam.y;ctx.strokeStyle=b!==B.AIR?'rgba(255,255,255,0.65)':'rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.strokeRect(sx+1,sy+1,BS-2,BS-2);ctx.lineWidth=1;const tip=document.getElementById('tip');if(b!==B.AIR&&BD[b]){tip.style.display='block';tip.style.left=(mouseX+16)+'px';tip.style.top=(mouseY-22)+'px';tip.textContent=blockNameOrDefault(b);}else tip.style.display='none';if(b===B.AIR){tip.style.display='none';const sl=inv[hotIdx];if(sl&&IT[sl.key]?.block!==undefined){ctx.fillStyle=(IT[sl.key].c||'#888')+'55';ctx.fillRect(sx,sy,BS,BS);}}}

function drawPlayer(){if(player.isDead)return;
  // --- squash/stretch from jump ---
  let scX=1,scY=1,scOffY=0;
  if(jumpSquash>0){scX=1+jumpSquash*0.35;scY=1-jumpSquash*0.20;scOffY=player.h*(1-scY);} 
  else if(!player.onGround&&airTime>50){
    if(player.vy<-2){const t=Math.min(1,Math.abs(player.vy)/Math.abs(JSPD));scX=1-t*0.13;scY=1+t*0.16;scOffY=-player.h*(scY-1)*0.5;}
    else if(player.vy>3){const t=Math.min(1,player.vy/15);scX=1+t*0.07;scY=1-t*0.07;scOffY=player.h*(1-scY);}
  }
  const bounceScY=1-moveBounce*0.10;
  const bounceScX=1+moveBounce*0.05;
  scX*=bounceScX; scY*=bounceScY;

  const sx=player.x-cam.x;
  const rawSy=player.y-cam.y+scOffY+walkBob;
  const sy=rawSy + (player.onGround ? Math.sin(walkCycle*2)*walkAmp*0.55 : 0);
  const fw=player.facing;
  const cx=sx+(player.w/2), baseY=sy;
  const bodyW=14,bodyH=18,headW=18,headH=16,armLen=17,legLen=19;

  const mouseWXX=mouseWX*BS, mouseWYY=mouseWY*BS;
  const leftShoulderX=cx-bodyW/2, rightShoulderX=cx+bodyW/2;
  const shoulderY=baseY+19;
  const aimAngle=Math.atan2(mouseWYY-shoulderY, mouseWXX-(clickArmSide>0?rightShoulderX:leftShoulderX));

  let frontAngle, backAngle;
  const held=getHeld();
  const hasArmor=getArmorDef()>0;
  const sk=skinData||{};
  const faceColor=sk.face||'#F5C8A0';
  const shirtColor=sk.shirt||faceColor;
  const pantsColor=sk.pants||faceColor;
  const shoeColor=sk.shoe||'#2A1808';
  const bodyColor=hasArmor?'#FFFFFF':shirtColor;
  const legColor=hasArmor?'#FFFFFF':pantsColor;
  const shoePaint=hasArmor?'#FFFFFF':shoeColor;

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

  if(clickArmKick>0.001){
    const swingEase=1-Math.pow(1-clickArmKick,3);
    const clickShoulderX=clickArmSide>0?rightShoulderX:leftShoulderX;
    const clickSwingAngle=Math.atan2(mouseWYY-shoulderY, mouseWXX-clickShoulderX);
    const swingTarget=clickSwingAngle;
    const swingTargetSmoothed=frontAngle+(swingTarget-frontAngle)*swingEase;
    if((clickArmSide>0&&fw>0)||(clickArmSide<0&&fw<0)) frontAngle=swingTargetSmoothed;
    else backAngle=swingTargetSmoothed;
  }

  if(held&&(held.tool==='pick'||held.tool==='axe'||held.tool==='sword')){
    // Sword gets a special wide arc sweep when slashing
    if(held.tool==='sword'&&swordSlash.active){
      const prog=1-(swordSlash.timer/swordSlash.maxTimer);
      const arcStart=fw>0?(-Math.PI*0.85):(Math.PI*0.15);
      const arcEnd  =fw>0?( Math.PI*0.1) :(-Math.PI*0.85);
      frontAngle=arcStart+(arcEnd-arcStart)*Math.min(1,prog*1.3);
      backAngle=frontAngle-(fw>0?0.6:-0.6);
    } else {
      const gripFrac=0.60;
      const gripX=rightShoulderX+Math.cos(frontAngle)*armLen*gripFrac;
      const gripY=shoulderY+Math.sin(frontAngle)*armLen*gripFrac;
      backAngle=Math.atan2(gripY-shoulderY, gripX-leftShoulderX);
      if(mineAmp>0.05)backAngle+=Math.sin(minePhase*2)*0.28*mineAmp;
    }
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

  ctx.save();
  ctx.translate(cx, baseY+player.h);
  ctx.scale(scX,scY);
  ctx.rotate(bodyTilt + (player.onGround ? Math.sin(walkCycle*2)*walkAmp*0.012 : 0));
  ctx.translate(-cx, -(baseY+player.h));

  ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(cx-9,baseY+player.h-1,18,4);

  const swA=Math.sin(walkCycle)*0.78*walkAmp;
  const airLegAngle=airTime>50?(player.vy<0?0.40:-0.25):0;
  const hipY=baseY+36;
  ctx.save();ctx.translate(cx-4,hipY);ctx.rotate(swA+airLegAngle);
  ctx.fillStyle=legColor;ctx.fillRect(-3,0,6,legLen-4);
  ctx.fillStyle=shoePaint;ctx.fillRect(-3,legLen-4,6,4);
  ctx.restore();
  ctx.save();ctx.translate(cx+4,hipY);ctx.rotate(-swA-airLegAngle);
  ctx.fillStyle=legColor;ctx.fillRect(-3,0,6,legLen-4);
  ctx.fillStyle=shoePaint;ctx.fillRect(-3,legLen-4,6,4);
  ctx.restore();

  ctx.save();ctx.translate(leftShoulderX,shoulderY);ctx.rotate(backAngle);
  ctx.fillStyle=bodyColor;ctx.fillRect(-3,0,6,armLen-4);
  ctx.fillStyle=faceColor;ctx.fillRect(-3,armLen-4,6,4);
  ctx.restore();

  const bxx=cx-bodyW/2|0, byy=baseY+17;
  ctx.fillStyle=bodyColor;ctx.fillRect(bxx,byy,bodyW,bodyH);
  if(hasArmor){ctx.fillStyle='rgba(100,120,150,0.4)';ctx.fillRect(bxx,byy,bodyW,bodyH);}
  ctx.fillStyle='rgba(0,0,0,0.13)';ctx.fillRect(bxx,byy+bodyH-2,bodyW,2);

  const hcx=cx, hcy=baseY+headH/2;
  ctx.save();
  ctx.translate(hcx,hcy);
  ctx.rotate(headPitch*0.35);
  ctx.fillStyle=faceColor;ctx.fillRect(-headW/2,-headH/2,headW,headH);
  ctx.restore();

  ctx.save();ctx.translate(rightShoulderX,shoulderY);ctx.rotate(frontAngle);
  ctx.fillStyle=bodyColor;ctx.fillRect(-3,0,6,armLen-4);
  ctx.fillStyle=faceColor;ctx.fillRect(-3,armLen-4,6,4);
  if(held){
    ctx.translate(0,armLen);
    if(held.tool){
      ctx.fillStyle=held.c||'#888';
      if(held.tool==='pick'){
        ctx.fillRect(-2,-14,4,22);ctx.fillRect(-9,-14,18,5);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(-9,-14,18,2);
      } else if(held.tool==='axe'){
        ctx.fillRect(-2,-12,4,20);ctx.fillRect(0,-12,10,8);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(0,-12,10,2);
      } else if(held.tool==='sword'){
        ctx.fillRect(-2,-20,4,24);ctx.fillRect(-6,-4,12,4);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillRect(-1,-20,2,16);
      } else if(held.tool==='bow'){
        ctx.strokeStyle=held.c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-4,8,-1,1);ctx.stroke();ctx.lineWidth=1;ctx.fillStyle='#ddd';ctx.fillRect(-1,-12,2,16);
      }
    } else if(isEating&&eatColor){
      ctx.fillStyle=eatColor;ctx.fillRect(-5,-5,10,10);
    } else {
      ctx.fillStyle=held.c||'#888';ctx.fillRect(-5,-5,10,10);ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(-5,-5,10,3);
    }
  } else if(isEating&&eatColor){
    ctx.translate(0,armLen);ctx.fillStyle=eatColor;ctx.fillRect(-5,-5,10,10);
  }
  ctx.restore();

  ctx.restore();

  if(isEating&&Math.random()<0.06){
    const ehx=(clickArmSide>0?rightShoulderX:leftShoulderX)+Math.cos(frontAngle)*armLen,ehy=shoulderY+Math.sin(frontAngle)*armLen;
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
  ctx.fillText('📖 Recipe Book',lpx+2,lpy+18);
  ctx.fillStyle='#8A5A20';ctx.fillRect(lpx,lpy+22,lpw,2);
  const pg=bookPage;
  const pageData=BOOK_PAGES[pg]||BOOK_PAGES[0];
  ctx.fillStyle='#6A4A18';ctx.font='bold 13px "Courier New"';
  ctx.fillText(pageData.title,lpx+4,lpy+42);
  const r0=RECIPES.find(r=>r.o===pageData.recipes[0]);
  if(r0)drawBookRecipe(lpx+4,lpy+50,r0,lpw);
  ctx.fillStyle='#8A6A40';ctx.font='10px "Courier New"';
  ctx.fillText('← A/D or click to turn pages',lpx,by+BH-30);
  ctx.fillText(`Trang ${pg+1} / ${BOOK_PAGES.length}`,lpx,by+BH-16);
  const rpx=bx+BW/2+8,rpy=by+24,rpw=BW/2-32;
  if(pageData.recipes[1]){
    const r1=RECIPES.find(r=>r.o===pageData.recipes[1]);
    if(r1){
      ctx.fillStyle='#4A2A08';ctx.font='bold 13px "Courier New"';
      ctx.fillText(itemNameOrDefault(pageData.recipes[1])||pageData.recipes[1],rpx+4,rpy+18);
      drawBookRecipe(rpx+4,rpy+26,r1,rpw);
    }
  }
  if(pageData.recipes[2]){
    const r2=RECIPES.find(r=>r.o===pageData.recipes[2]);
    if(r2){
      const r2y=rpy+(pageData.recipes[1]?170:30);
      ctx.fillStyle='#4A2A08';ctx.font='bold 13px "Courier New"';
      ctx.fillText(itemNameOrDefault(pageData.recipes[2])||pageData.recipes[2],rpx+4,r2y-4);
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
  ctx.fillText('R / ESC  close book',bx+BW-24,by+BH-16);ctx.textAlign='left';

  // ── PAGE FLIP ANIMATION ───────────────────────────────────────────────────
  if(bookFlipAnim>0){
    const fp=1-bookFlipAnim; // 0→1 progress
    const dir=bookFlipDir;
    // The flipping page sweeps from one side to the other
    // dir=1: left page lifts and sweeps right → forward turn
    // dir=-1: right page lifts and sweeps left → backward turn
    const halfW=BW/2-28;
    const pageH=BH-36;
    const pageX=dir>0?(bx+20):(bx+BW/2+4);
    const pageY=by+18;

    // Compute fold: skew from flat to folded as fp goes 0→0.5 then unfold 0.5→1
    const fold=fp<0.5?(fp*2):(1-(fp-0.5)*2);
    const flipX=dir>0?(pageX+halfW*fp):(pageX+halfW*(1-fp));
    const skew=fold*0.6*dir;
    const shadow=fold*0.7;
    const narrowW=halfW*(1-fold*0.9);

    ctx.save();
    ctx.beginPath();ctx.rect(bx,by,BW,BH);ctx.clip();

    // Shadow on the page being swept over
    if(shadow>0.05){
      const grad2=ctx.createLinearGradient(
        dir>0?bx+BW/2:bx+BW/2+halfW, by,
        dir>0?bx+BW/2+halfW*0.4:bx+BW/2+halfW*0.6, by
      );
      grad2.addColorStop(0,`rgba(0,0,0,${shadow*0.35})`);
      grad2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grad2;
      ctx.fillRect(dir>0?bx+BW/2:bx+20,by+18,halfW,pageH);
    }

    // The turning page itself (skewed trapezoid)
    if(narrowW>2){
      ctx.save();
      ctx.transform(1,skew*0.15,0,1,0,0);
      // Page surface with slight color shift showing back
      const pageColor=fp<0.5?'#F5EDD5':'#EDE5CD';
      ctx.fillStyle=pageColor;
      // Draw as a parallelogram for the fold effect
      ctx.beginPath();
      const tx0=flipX, tx1=flipX+narrowW*dir;
      const topSkewOff=fold*15*dir;
      ctx.moveTo(tx0+topSkewOff,pageY);
      ctx.lineTo(tx1+topSkewOff*0.5,pageY);
      ctx.lineTo(tx1,pageY+pageH);
      ctx.lineTo(tx0,pageY+pageH);
      ctx.closePath();
      ctx.fill();
      // Page lines on turning page
      ctx.strokeStyle='rgba(0,0,0,0.07)';ctx.lineWidth=1;
      const lineStep=22;
      for(let ly=pageY+12;ly<pageY+pageH-10;ly+=lineStep){
        ctx.beginPath();ctx.moveTo(tx0+topSkewOff,ly);ctx.lineTo(tx1+topSkewOff*0.5,ly);ctx.stroke();
      }
      // Spine shadow edge on the turning page
      const edgeX=dir>0?tx0:tx1;
      const edgeGrad=ctx.createLinearGradient(edgeX,by,edgeX+dir*12,by);
      edgeGrad.addColorStop(0,`rgba(0,0,0,${fold*0.3})`);
      edgeGrad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=edgeGrad;
      ctx.fillRect(edgeX,pageY,dir*14,pageH);
      ctx.restore();
    }
    ctx.restore();
  }

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
  const iname=itemNameOrDefault(recipe.o)||recipe.o;
  ctx.fillStyle='#4A2A08';ctx.font='bold 10px "Courier New"';
  ctx.fillText(iname,outX+CS2+12,outY+12);
  if(recipe.cnt>1){ctx.fillStyle='#884400';ctx.font='bold 11px "Courier New"';ctx.fillText('x'+recipe.cnt,outX+CS2+12,outY+26);}
}
function bookHandleClick(mx,my){
  const BW=680,BH=420,bx=(W-BW)/2,by=(H-BH)/2;
  if(bookPage>0&&mx>=bx+8&&mx<=bx+36&&my>=by+BH/2-20&&my<=by+BH/2+20){bookFlipDir=-1;bookFlipAnim=1.0;bookPage--;sndClick();return;}
  if(bookPage<BOOK_PAGES.length-1&&mx>=bx+BW-36&&mx<=bx+BW-8&&my>=by+BH/2-20&&my<=by+BH/2+20){bookFlipDir=1;bookFlipAnim=1.0;bookPage++;sndClick();return;}
  if(mx<bx||mx>bx+BW||my<by||my>by+BH){bookOpen=false;}
}

function drawSwordSlash(){
  if(!swordSlash.active)return;
  const prog=1-(swordSlash.timer/swordSlash.maxTimer); // 0→1 as anim plays
  const fade=1-prog;
  const sx=swordSlash.x-cam.x, sy=swordSlash.y-cam.y;
  const dir=swordSlash.dir;
  const rad=48+prog*22;
  const startAng=dir>0?(-Math.PI*0.75):(-Math.PI*0.25);
  const endAng  =dir>0?( Math.PI*0.15):(-Math.PI-0.15);

  ctx.save();
  ctx.translate(sx,sy);

  // Outer arc glow
  ctx.beginPath();
  ctx.arc(0,0,rad+10,startAng,endAng,dir<0);
  ctx.strokeStyle=`rgba(255,255,120,${fade*0.22})`;
  ctx.lineWidth=18;ctx.stroke();

  // Inner bright slash arc
  const held=getHeld();
  const slashColor=held?.c||'#ffffff';
  ctx.beginPath();
  ctx.arc(0,0,rad,startAng,endAng,dir<0);
  ctx.strokeStyle=`rgba(255,255,255,${fade*0.85})`;
  ctx.lineWidth=5;ctx.stroke();

  // Colored arc on top
  ctx.beginPath();
  ctx.arc(0,0,rad-4,startAng,endAng,dir<0);
  ctx.strokeStyle=slashColor.replace(')',`,${fade*0.7})`).replace('#','rgba(').replace(/^rgba\(([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,(_,r,g,b)=>`rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)}`)||`rgba(180,220,255,${fade*0.7})`;
  ctx.lineWidth=3;ctx.stroke();

  // Slash sparks along the arc
  const sparkCount=7;
  for(let i=0;i<sparkCount;i++){
    const t2=i/sparkCount;
    const ang=startAng+(endAng-startAng)*t2*(dir>0?1:-1);
    const sparkRad=rad+(Math.sin(prog*Math.PI+i)*8);
    const px=Math.cos(ang)*sparkRad, py=Math.sin(ang)*sparkRad;
    const sparkFade=fade*(0.5+0.5*Math.sin(prog*Math.PI*2+i));
    const sSize=3+Math.random()*3;
    ctx.fillStyle=`rgba(255,240,100,${sparkFade})`;
    ctx.fillRect(px-sSize/2,py-sSize/2,sSize,sSize);
  }

  // Motion lines behind the blade
  const lineCount=5;
  for(let i=0;i<lineCount;i++){
    const t2=(i+1)/lineCount;
    const ang=startAng+(endAng-startAng)*t2*(dir>0?1:-1)*0.5;
    const lr1=rad*0.6, lr2=rad*1.1;
    ctx.strokeStyle=`rgba(255,255,200,${fade*(1-t2)*0.5})`;
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang)*lr1,Math.sin(ang)*lr1);
    ctx.lineTo(Math.cos(ang)*lr2,Math.sin(ang)*lr2);
    ctx.stroke();
  }

  // Impact flash at the end of swing
  if(prog>0.7){
    const impFade=(prog-0.7)/0.3;
    const impAng=endAng;
    const ix=Math.cos(impAng)*rad, iy=Math.sin(impAng)*rad;
    const grad=ctx.createRadialGradient(ix,iy,0,ix,iy,22);
    grad.addColorStop(0,`rgba(255,255,180,${impFade*0.9})`);
    grad.addColorStop(0.5,`rgba(255,200,60,${impFade*0.5})`);
    grad.addColorStop(1,`rgba(255,100,0,0)`);
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.arc(ix,iy,22,0,Math.PI*2);ctx.fill();
    // Cross spark
    ctx.strokeStyle=`rgba(255,255,255,${impFade*0.8})`;
    ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(ix-10,iy);ctx.lineTo(ix+10,iy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ix,iy-10);ctx.lineTo(ix,iy+10);ctx.stroke();
  }

  ctx.restore();
}

function drawHUD(){const hbW=140,hbH=12,hbX=10,hbY=10;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,hbY-2,hbW+4,hbH+4);ctx.fillStyle='#5A0000';ctx.fillRect(hbX,hbY,hbW,hbH);ctx.fillStyle=player.health>50?'#3CB03C':player.health>25?'#CC8800':'#DD2222';ctx.fillRect(hbX,hbY,hbW*(player.health/player.maxHealth),hbH);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(hbX,hbY,hbW,hbH/2|0);ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.strokeRect(hbX,hbY,hbW,hbH);ctx.fillStyle='#fff';ctx.font='bold 9px "Courier New"';ctx.fillText('♥ '+Math.floor(player.health),hbX+4,hbY+hbH-2);const hgY=hbY+hbH+4;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,hgY-2,hbW+4,hbH+4);ctx.fillStyle='#4A2800';ctx.fillRect(hbX,hgY,hbW,hbH);ctx.fillStyle='#D4943A';ctx.fillRect(hbX,hgY,hbW*(player.hunger/player.maxHunger),hbH);ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(hbX,hgY,hbW,hbH/2|0);ctx.strokeStyle='#444';ctx.strokeRect(hbX,hgY,hbW,hbH);ctx.fillStyle='#fff';ctx.fillText('🍖 '+Math.floor(player.hunger),hbX+4,hgY+hbH-2);const armorDef=getArmorDef();if(armorDef>0){const arY=hgY+hbH+4;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(hbX-2,arY-2,hbW+4,hbH+4);ctx.fillStyle='#2A2A5A';ctx.fillRect(hbX,arY,hbW,hbH);ctx.fillStyle='#7090D0';ctx.fillRect(hbX,arY,hbW*(armorDef/10),hbH);ctx.strokeStyle='#444';ctx.strokeRect(hbX,arY,hbW,hbH);ctx.fillStyle='#fff';ctx.fillText('🛡 '+armorDef,hbX+4,arY+hbH-2);}const slotSz=44,slotGap=3,totalW=HS*(slotSz+slotGap)-slotGap,hbSX=(W-totalW)/2|0,hbSY=H-slotSz-8;ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(hbSX-4,hbSY-4,totalW+8,slotSz+8);ctx.strokeStyle='#3a3a5a';ctx.lineWidth=1;ctx.strokeRect(hbSX-4,hbSY-4,totalW+8,slotSz+8);for(let i=0;i<HS;i++){const sx2=hbSX+i*(slotSz+slotGap),sy2=hbSY,sel=i===hotIdx;ctx.fillStyle=sel?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.4)';ctx.fillRect(sx2,sy2,slotSz,slotSz);ctx.strokeStyle=sel?'#ffffff':'#444466';ctx.lineWidth=sel?2:1;ctx.strokeRect(sx2,sy2,slotSz,slotSz);const sl=inv[i];if(sl){drawItemSprite(sx2+2,sy2+2,sl.key,slotSz-4);if(sl.count>1){ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(sx2+slotSz-18,sy2+slotSz-14,18,12);ctx.fillStyle='#fff';ctx.font='bold 11px "Courier New"';ctx.fillText(sl.count,sx2+slotSz-16,sy2+slotSz-4);}}ctx.fillStyle='#666';ctx.font='9px "Courier New"';ctx.fillText(i+1,sx2+3,sy2+11);}const selSl=inv[hotIdx];if(selSl&&IT[selSl.key]){const name=itemNameOrDefault(selSl.key);ctx.font='bold 12px "Courier New"';const tw=ctx.measureText(name).width;const nx=(W-tw)/2|0,ny=hbSY-14;ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(nx-6,ny-11,tw+12,16);ctx.fillStyle=IT[selSl.key].c||'#fff';ctx.fillText(name,nx,ny);}const isDaytime=dayT>0.14&&dayT<0.86;ctx.font='18px serif';ctx.fillText(isDaytime?'☀':'🌙',W-34,28);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='9px "Courier New"';ctx.fillText('X:'+Math.floor(player.x/BS)+' Y:'+Math.floor(player.y/BS),W-90,H-8);
  // Drop count HUD
  if(drops.length>0){ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(hbSX-4,hbSY-28,80,16);ctx.fillStyle='#AAFF88';ctx.font='9px "Courier New"';ctx.fillText('📦 '+drops.length+' vật phẩm',hbSX,hbSY-16);}
  if(player.health<30&&!player.isDead){ctx.fillStyle=`rgba(200,0,0,${(1-player.health/30)*0.25*Math.abs(Math.sin(Date.now()*0.003))})`;ctx.fillRect(0,0,W,H);}if(dmgFlash>0.05){ctx.fillStyle=`rgba(255,0,0,${dmgFlash*0.35})`;ctx.fillRect(0,0,W,H);}if(player.isDead){ctx.fillStyle='rgba(80,0,0,0.7)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#FF3333';ctx.font='bold 52px "Courier New"';ctx.fillText("YOU DIED",W/2,H/2-30);ctx.fillStyle='#FFAAAA';ctx.font='18px "Courier New"';ctx.fillText("Click or press any key to respawn",W/2,H/2+20);ctx.textAlign='left';}}

function drawWorld(){const x0=Math.max(0,Math.floor(cam.x/BS)-1),x1=Math.min(WW,Math.ceil((cam.x+W)/BS)+1),y0=Math.max(0,Math.floor(cam.y/BS)-1),y1=Math.min(WH,Math.ceil((cam.y+H)/BS)+1);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const b=getB(x,y);if(b)drawBlock(x,y,b);}}
function drawUndergroundDark(){let surf=0;for(let y=0;y<WH;y++)if(solid(Math.floor(player.x/BS+0.5),y)){surf=y;break;}const depth=Math.max(0,(player.y/BS-surf)/12);if(depth>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(0.65,depth*0.5)})`;ctx.fillRect(0,0,W,H);}}

function drawMinimap(){const mmW=120,mmH=60,mmX=W-mmW-10,mmY=40;ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(mmX-2,mmY-2,mmW+4,mmH+4);ctx.strokeStyle='#3a3a5a';ctx.strokeRect(mmX-2,mmY-2,mmW+4,mmH+4);const pBX=Math.floor(player.x/BS),pBY=Math.floor(player.y/BS),scale=2;for(let dx=-mmW/2;dx<mmW/2;dx++){for(let dy=-mmH/2;dy<mmH/2;dy++){const bx=pBX+Math.floor(dx/scale),by=pBY+Math.floor(dy/scale);const b=getB(bx,by);if(b&&BD[b]){ctx.fillStyle=BD[b].c;ctx.fillRect(mmX+dx+mmW/2,mmY+dy+mmH/2,1,1);}}}ctx.fillStyle='#FF4444';ctx.fillRect(mmX+mmW/2-1,mmY+mmH/2-1,3,3);for(const e of entities){const ex=(e.x/BS-pBX)*scale+mmW/2,ey=(e.y/BS-pBY)*scale+mmH/2;if(ex>0&&ex<mmW&&ey>0&&ey<mmH){ctx.fillStyle=e.type==='pig'?'#F0A0A0':e.type==='cow'?'#C07840':e.type==='horse'?'#C8A060':e.type==='cat'?'#E8A040':e.type==='dog'?'#D09050':e.type==='creeper'?'#40FF40':e.type==='skeleton'?'#EEEECC':'#40FF40';ctx.fillRect(mmX+ex,mmY+ey,2,2);}}}

const menubgCanvas=document.getElementById('menubg');
const menubgCtx=menubgCanvas.getContext('2d');
menubgCanvas.width=W;menubgCanvas.height=H;
let menuPanX=0;
function drawMenuBg(){menuPanX+=0.3;menubgCtx.fillStyle='#0a0a16';menubgCtx.fillRect(0,0,W,H);const mbs=8;for(let x=0;x<W/mbs+2;x++){const wx=Math.floor((x*mbs+menuPanX)/mbs)%WW;let sh=56+Math.sin(wx*0.035)*8+Math.sin(wx*0.012)*14;sh=Math.round(sh);const screenY=H*0.5;menubgCtx.fillStyle='#1a1a3a';menubgCtx.fillRect(x*mbs-menuPanX%mbs,0,mbs+1,screenY);for(let y=0;y<8;y++){let col='#5A7A30';if(y===0)col='#587030';else if(y<3)col='#7A5230';else col='#5A5A5A';if(Math.random()<0.02)col='#258018';menubgCtx.fillStyle=col;menubgCtx.fillRect(x*mbs-menuPanX%mbs,screenY+y*mbs,mbs+1,mbs+1);}menubgCtx.fillStyle='#3A2A10';menubgCtx.fillRect(x*mbs-menuPanX%mbs,screenY+8*mbs,mbs+1,H-screenY-8*mbs);}menubgCtx.fillStyle='rgba(0,0,0,0.5)';menubgCtx.fillRect(0,0,W,H);}


