// ══════════════════════════════════════════════════════════════════
//   PIXELSURVIVE MOD STUDIO  —  main-05-modding.js  —  v1.0
//   Powered by the PixelMod API
// ══════════════════════════════════════════════════════════════════

// ── MOD REGISTRY ──────────────────────────────────────────────────
const modRegistry = { blocks:[], items:[], recipes:[], smelts:[] };

// ── PIXEL MOD PUBLIC API ──────────────────────────────────────────
const PixelMod = {
  version: '1.0',

  // ── registerBlock ───────────────────────────────────────────────
  // Adds a new block type to the game.
  // @param {object} opts
  //   id        {number}  100–220  (required, must be unique)
  //   name      {string}           (required)
  //   color     {string}  hex      (required, block fill color)
  //   solid     {boolean} true     (collides with player/entities)
  //   drops     {string|null} null (item key dropped on mine)
  //   hardness  {number}  2.0      (mining time; higher = slower)
  //   overlay   {string}  null     (optional ore-speckle color)
  //   damage    {number}  0        (dmg/tick when player touches)
  registerBlock(opts) {
    const { id, name, color='#888', solid=true, drops=null,
            hardness=2.0, overlay=null, damage=0 } = opts||{};
    if (typeof id!=='number'||id<100||id>220) {
      PixelMod._e('registerBlock: id must be 100–220. Got: '+id); return false;
    }
    if (!name) { PixelMod._e('registerBlock: name is required.'); return false; }
    if (BD[id]) PixelMod._w('Block ID '+id+' already exists — overriding.');
    BD[id] = { n:name, c:color, h:hardness, d:drops, s:solid };
    if (overlay) BD[id].o = overlay;
    if (damage)  BD[id].dmg = damage;
    modRegistry.blocks.push({ id });
    PixelMod._ok('Block "'+name+'" registered  →  ID '+id);
    return true;
  },

  // ── registerItem ────────────────────────────────────────────────
  // Adds a new item type (can be a block-item, weapon, food, tool, armor).
  // @param {object} opts
  //   key    {string} UPPERCASE  (required, unique item key)
  //   name   {string}            (required)
  //   color  {string} hex        (required, sprite tint)
  //   block  {number}            (block ID this item places, if any)
  //   tool   {string}            ('pick'|'axe'|'sword'|'bow')
  //   dmg    {number} 0          (attack damage for swords/bows)
  //   pow    {number} 1          (mining power for picks/axes)
  //   food   {boolean} false
  //   hunger {number} 0          (hunger restored when eaten)
  //   heal   {number} 0          (health restored when eaten)
  //   armor  {boolean} false
  //   def    {number} 0          (armor defense points)
  registerItem(opts) {
    const { key, name, color='#888', block:blk, tool=null,
            dmg=0, pow=1, food=false, hunger=0, heal=0,
            armor=false, def=0 } = opts||{};
    if (!key||typeof key!=='string') { PixelMod._e('registerItem: key is required.'); return false; }
    if (!name) { PixelMod._e('registerItem: name is required.'); return false; }
    if (IT[key]) PixelMod._w('Item "'+key+'" already exists — overriding.');
    const item = { n:name, c:color };
    if (blk!==undefined) item.block = blk;
    if (tool) { item.tool=tool; item.dmg=dmg; item.pow=pow; }
    if (food)  { item.food=true; item.hunger=hunger; item.heal=heal; }
    if (armor) { item.armor=true; item.def=def; }
    IT[key] = item;
    modRegistry.items.push({ key });
    PixelMod._ok('Item "'+name+'" registered  →  key "'+key+'"');
    return true;
  },

  // ── registerRecipe ──────────────────────────────────────────────
  // Adds a 3×3 crafting-table recipe.
  // @param {object} opts
  //   output  {string}     output item key (required)
  //   count   {number} 1   number of items produced
  //   pattern {string[][]} 3×3 array of item keys (null = empty slot)
  //
  // Example pattern for a diamond sword:
  //   [ [null,'DIAMOND',null], [null,'DIAMOND',null], [null,'STICK',null] ]
  registerRecipe(opts) {
    const { output, count=1, pattern } = opts||{};
    if (!output) { PixelMod._e('registerRecipe: output is required.'); return false; }
    if (!Array.isArray(pattern)) { PixelMod._e('registerRecipe: pattern must be a 2D array.'); return false; }
    if (!IT[output]) PixelMod._w('registerRecipe: item "'+output+'" not yet registered!');
    RECIPES.push({ p:pattern, o:output, cnt:count });
    modRegistry.recipes.push({ output });
    PixelMod._ok('Recipe → "'+output+'" x'+count+' registered');
    return true;
  },

  // ── registerSmelt ───────────────────────────────────────────────
  // Adds a furnace smelting recipe.
  // @param input   {string} input item key
  // @param output  {string} output item key
  // @param timeMs  {number} smelting time in milliseconds (default 5000)
  registerSmelt(input, output, timeMs=5000) {
    if (!input||!output) { PixelMod._e('registerSmelt: input and output are required.'); return false; }
    SMELT[input] = { out:output, time:timeMs };
    modRegistry.smelts.push({ input });
    PixelMod._ok('Smelt: '+input+' → '+output+' ('+timeMs/1000+'s)');
    return true;
  },

  // ── giveItem ────────────────────────────────────────────────────
  // Gives the player an item. Only works while in-game.
  giveItem(key, count=1) {
    if (gameState!=='playing') { PixelMod._w('giveItem: Start a world first!'); return false; }
    if (!IT[key]) { PixelMod._e('giveItem: Unknown key "'+key+'"'); return false; }
    addItem(key, count);
    PixelMod._ok('Gave '+count+'x '+IT[key].n);
    return true;
  },

  // ── setBlock ────────────────────────────────────────────────────
  // Places a block at world coordinates. Only works while in-game.
  setBlock(x, y, blockId) {
    if (gameState!=='playing') { PixelMod._w('setBlock: Start a world first!'); return false; }
    setB(x, y, blockId);
    PixelMod._ok('Placed block '+blockId+' at ('+x+','+y+')');
    return true;
  },

  // ── getPlayer ────────────────────────────────────────────────────
  // Returns the player object { x, y, health, hunger, facing, ... }
  getPlayer() { return typeof player!=='undefined' ? player : null; },

  // ── setPlayerHealth ──────────────────────────────────────────────
  setPlayerHealth(hp) {
    if (gameState!=='playing') { PixelMod._w('setPlayerHealth: Start a world first!'); return; }
    player.health = Math.max(0, Math.min(player.maxHealth, hp));
    PixelMod._ok('Player health set to '+Math.floor(player.health));
  },

  // ── getBlock ─────────────────────────────────────────────────────
  // Returns block ID at world tile (x, y).
  getBlock(x, y) { return typeof getB==='function' ? getB(x,y) : 0; },

  // ── spawnEffect ──────────────────────────────────────────────────
  // Spawns particle effect at world pixel position.
  spawnEffect(x, y, color='#FFFFFF', count=8) {
    if (typeof spawnWorldParticles==='function') spawnWorldParticles(x, y, color, count);
  },

  // ── playTone ─────────────────────────────────────────────────────
  // Plays a synthesized tone.  type: 'sine'|'square'|'sawtooth'|'triangle'
  playTone(freq=440, duration=0.15, type='sine', volume=0.08) {
    if (typeof tone==='function') tone(freq, duration, type, volume);
  },

  // ── clearAll ─────────────────────────────────────────────────────
  // Unregisters all mod-added blocks, items, recipes, smelt entries.
  clearAll() {
    modRegistry.blocks.forEach(b=>{ delete BD[b.id]; });
    modRegistry.items.forEach(i=>{ delete IT[i.key]; });
    modRegistry.smelts.forEach(s=>{ delete SMELT[s.input]; });
    const modOuts = new Set(modRegistry.recipes.map(r=>r.output));
    for (let i=RECIPES.length-1;i>=0;i--) if(modOuts.has(RECIPES[i].o)) RECIPES.splice(i,1);
    modRegistry.blocks=[]; modRegistry.items=[]; modRegistry.recipes=[]; modRegistry.smelts=[];
    PixelMod._log('[INFO] All mods cleared.','info');
  },

  // ── Internal logging helpers ──────────────────────────────────────
  _ok(m) { PixelMod._log('[OK] '+m,'ok'); },
  _w(m)  { PixelMod._log('[WARN] '+m,'warn'); },
  _e(m)  { PixelMod._log('[ERR] '+m,'err'); },
  _log(m, type='info') {
    console.log('[PixelMod]', m);
    const el = document.getElementById('mod-console');
    if (!el) return;
    const line = document.createElement('div');
    line.className = 'mod-console-line mod-cl-'+type;
    line.textContent = m;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }
};

// ══════════════════════════════════════════════════════════════════
//   MOD STUDIO  —  Default example code shown in the editor
// ══════════════════════════════════════════════════════════════════
const _MOD_DEFAULT_CODE = `// ══════════════════════════════════════════════════════
//   PIXELSURVIVE MOD  —  Powered by PixelMod API v1.0
// ══════════════════════════════════════════════════════

// ── BLOCK + ITEM ────────────────────────────────────────
PixelMod.registerBlock({
  id: 100,               // Block ID: must be 100–220
  name: 'Void Stone',
  color: '#3A0060',      // Block fill color (hex)
  solid: true,
  drops: 'CRYSTAL',      // Item key dropped when mined
  hardness: 4.0,         // Higher = harder to mine
  overlay: '#8040CC'     // Ore speckle color (optional)
});
PixelMod.registerItem({
  key: 'VOID_STONE',     // UPPERCASE unique key
  name: 'Void Stone',
  color: '#3A0060',
  block: 100             // Links item → block ID above
});

// ── CUSTOM SWORD ────────────────────────────────────────
PixelMod.registerItem({
  key: 'VOID_SWORD',
  name: 'Void Sword',
  color: '#CC44FF',
  tool: 'sword',
  dmg: 38                // Damage per hit
});

// ── CUSTOM PICKAXE ──────────────────────────────────────
PixelMod.registerItem({
  key: 'VOID_PICK',
  name: 'Void Pickaxe',
  color: '#CC44FF',
  tool: 'pick',
  pow: 22                // Mining speed multiplier
});

// ── CUSTOM FOOD ─────────────────────────────────────────
PixelMod.registerItem({
  key: 'STAR_CANDY',
  name: 'Star Candy',
  color: '#FFDD22',
  food: true,
  hunger: 65,            // Hunger restored
  heal: 35               // Health restored
});

// ── CUSTOM ARMOR ────────────────────────────────────────
PixelMod.registerItem({
  key: 'VOID_ARMOR',
  name: 'Void Chestplate',
  color: '#7A00CC',
  armor: true,
  def: 8                 // Defense points (max ~10)
});

// ── CRAFTING RECIPES ────────────────────────────────────
PixelMod.registerRecipe({
  output: 'VOID_SWORD',
  count: 1,
  pattern: [
    ['CRYSTAL',  'DIAMOND', 'CRYSTAL'],
    [null,       'DIAMOND', null     ],
    [null,       'STICK',   null     ]
  ]
});
PixelMod.registerRecipe({
  output: 'VOID_PICK',
  count: 1,
  pattern: [
    ['CRYSTAL', 'CRYSTAL', 'CRYSTAL'],
    [null,      'STICK',   null     ],
    [null,      'STICK',   null     ]
  ]
});
PixelMod.registerRecipe({
  output: 'STAR_CANDY',
  count: 3,
  pattern: [
    ['GOLD_INGOT', 'DIAMOND',  'GOLD_INGOT'],
    ['DIAMOND',    'EMERALD',  'DIAMOND'   ],
    ['GOLD_INGOT', 'DIAMOND',  'GOLD_INGOT']
  ]
});

// ── SMELTING RECIPE ─────────────────────────────────────
// PixelMod.registerSmelt('VOID_STONE', 'CRYSTAL', 3000);

// ── GIVE ITEMS TO PLAYER (only works while in-game!) ────
// Start a world first, THEN run the mod.
PixelMod.giveItem('VOID_SWORD',  1);
PixelMod.giveItem('VOID_PICK',   1);
PixelMod.giveItem('VOID_STONE',  32);
PixelMod.giveItem('STAR_CANDY',  10);

console.log('✅ Mod loaded!');`;

// ══════════════════════════════════════════════════════════════════
//   MOD STUDIO  —  Persistence helpers
// ══════════════════════════════════════════════════════════════════
const _MOD_SAVE_KEY = 'ps_saved_mods_v1';

function _modLoadSaves() {
  try { return JSON.parse(localStorage.getItem(_MOD_SAVE_KEY)||'[]'); } catch(e) { return []; }
}
function _modWriteSaves(list) {
  try { localStorage.setItem(_MOD_SAVE_KEY, JSON.stringify(list)); } catch(e) {}
}
function _modSave(name, code) {
  const list = _modLoadSaves();
  const idx = list.findIndex(m=>m.name===name);
  const entry = { name, code, date: new Date().toLocaleDateString('vi-VN') };
  if (idx>=0) list[idx]=entry; else list.push(entry);
  _modWriteSaves(list);
}
function _modDelete(name) { _modWriteSaves(_modLoadSaves().filter(m=>m.name!==name)); }

// ══════════════════════════════════════════════════════════════════
//   MOD STUDIO  —  UI functions
// ══════════════════════════════════════════════════════════════════

function _modEditor()  { return document.getElementById('mod-code-editor'); }
function _modConsole() { return document.getElementById('mod-console'); }
function _modStatus()  { return document.getElementById('mod-editor-status'); }

function _setStatus(msg, type='info') {
  const el = _modStatus(); if (!el) return;
  el.textContent = msg;
  el.className = 'mod-st-'+type;
}

function showModStudio() {
  document.getElementById('menu-overlay').style.display='none';
  document.getElementById('mod-studio-screen').style.display='flex';
  // Restore last editor content
  const ed = _modEditor();
  if (ed) {
    try { ed.value = localStorage.getItem('ps_mod_current')||_MOD_DEFAULT_CODE; } catch(e) { ed.value=_MOD_DEFAULT_CODE; }
    _updateLineNums();
    _setStatus('Ready','info');
  }
  _renderDocs();
  _renderSavesList();
  _switchTab('console');
}

function hideModStudio() {
  // Save current code before leaving
  const ed = _modEditor();
  if (ed) { try { localStorage.setItem('ps_mod_current', ed.value); } catch(e) {} }
  document.getElementById('mod-studio-screen').style.display='none';
  document.getElementById('menu-overlay').style.display='flex';
}

// ── Line numbers ──────────────────────────────────────────────────
function _updateLineNums() {
  const ed = _modEditor();
  const ln = document.getElementById('mod-line-numbers');
  if (!ed||!ln) return;
  const count = ed.value.split('\n').length;
  let s=''; for(let i=1;i<=count;i++) s+=i+'\n';
  ln.textContent=s;
  ln.scrollTop=ed.scrollTop;
}

// ── Run mod ───────────────────────────────────────────────────────
function _runMod() {
  const ed = _modEditor(); if (!ed) return;
  const code = ed.value.trim();
  if (!code) { _setStatus('Nothing to run!','warn'); return; }

  // Clear console
  const con = _modConsole(); if (con) con.innerHTML='';
  _setStatus('Running…','run');

  // Capture console.log/warn/error
  const origLog=console.log, origWarn=console.warn, origErr=console.error;
  const cap = (type) => (...a) => {
    origLog(...a);
    const el=_modConsole(); if(!el) return;
    const d=document.createElement('div');
    d.className='mod-console-line mod-cl-'+type;
    d.textContent=a.map(String).join(' ');
    el.appendChild(d); el.scrollTop=el.scrollHeight;
  };
  console.log=cap('info'); console.warn=cap('warn'); console.error=cap('err');

  try {
    (new Function('PixelMod', code))(PixelMod);
    _setStatus('✓ Mod running!','ok');
  } catch(e) {
    PixelMod._e('Runtime error: '+e.message);
    _setStatus('✗ '+e.message,'err');
  } finally {
    console.log=origLog; console.warn=origWarn; console.error=origErr;
  }
  _switchTab('console');
}

// ── Tab switching ─────────────────────────────────────────────────
function _switchTab(name) {
  document.querySelectorAll('.mod-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  document.querySelectorAll('.mod-tab-pane').forEach(p=>p.classList.toggle('active',p.id==='mtp-'+name));
}

// ── Documentation tab ─────────────────────────────────────────────
function _renderDocs() {
  const el = document.getElementById('mod-docs-content'); if (!el) return;
  el.innerHTML = `
<div class="mdoc">
  <div class="mdoc-h">📦 PixelMod.registerBlock(opts)</div>
  <div class="mdoc-d">Register a new block type (ID must be 100–220).</div>
  <pre class="mdoc-c">PixelMod.registerBlock({
  id: 100,           // number 100–220 (required)
  name: 'My Block',  // display name   (required)
  color: '#9040FF',  // hex fill color  (required)
  solid: true,       // blocks movement?
  drops: 'STONE',    // item key on mine (or null)
  hardness: 2.0,     // mining speed (higher=slower)
  overlay: '#CC80FF' // ore-speckle tint (optional)
});</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">🗡 PixelMod.registerItem(opts)</div>
  <div class="mdoc-d">Register a weapon, food, tool, armor, or block-item.</div>
  <pre class="mdoc-c">// Sword:
PixelMod.registerItem({ key:'MY_SWORD', name:'...', color:'...', tool:'sword', dmg:35 });
// Pickaxe:
PixelMod.registerItem({ key:'MY_PICK',  name:'...', color:'...', tool:'pick',  pow:20 });
// Axe:
PixelMod.registerItem({ key:'MY_AXE',   name:'...', color:'...', tool:'axe',   pow:15 });
// Food:
PixelMod.registerItem({ key:'MY_FOOD',  name:'...', color:'...', food:true, hunger:50, heal:25 });
// Armor:
PixelMod.registerItem({ key:'MY_ARM',   name:'...', color:'...', armor:true, def:6 });
// Block-item (places block 100):
PixelMod.registerItem({ key:'MY_BLOCK', name:'...', color:'...', block:100 });</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">⚒ PixelMod.registerRecipe(opts)</div>
  <div class="mdoc-d">Add a 3×3 crafting-table recipe. null = empty slot.</div>
  <pre class="mdoc-c">PixelMod.registerRecipe({
  output: 'MY_SWORD', // output item key (required)
  count: 1,           // output quantity
  pattern: [
    ['DIAMOND', 'CRYSTAL', 'DIAMOND'],
    [null,      'DIAMOND', null     ],
    [null,      'STICK',   null     ]
  ]
});</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">🔥 PixelMod.registerSmelt(input, output, ms)</div>
  <pre class="mdoc-c">PixelMod.registerSmelt('MY_ORE', 'MY_INGOT', 5000);</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">🎒 Other methods</div>
  <pre class="mdoc-c">PixelMod.giveItem('MY_ITEM', 10)    // Give to player (in-game only)
PixelMod.setBlock(x, y, 100)        // Place block (in-game only)
PixelMod.setPlayerHealth(100)        // Set HP
PixelMod.spawnEffect(x, y, '#FF0')  // Particles
PixelMod.getPlayer()                 // → player object
PixelMod.getBlock(x, y)             // → block ID
PixelMod.playTone(440, 0.2, 'sine') // Sound
PixelMod.clearAll()                  // Remove all mods</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">📋 Common item keys (use in recipes / drops)</div>
  <pre class="mdoc-c">DIRT  STONE  SAND  GRAVEL  CLAY  OBSIDIAN
LOG  PLANK  STICK  BENCH  BOOKSHELF
COAL  IRON_ORE  GOLD_ORE  COPPER_ORE
IRON_INGOT  GOLD_INGOT  COPPER_INGOT
DIAMOND  EMERALD  CRYSTAL  BONE
WOOD_PICK  STONE_PICK  IRON_PICK  DIAMOND_PICK
WOOD_SWORD  IRON_SWORD  DIAMOND_SWORD
WOOD_AXE  IRON_AXE  DIAMOND_AXE
BREAD  APPLE  GOLDEN_APPLE  MEAT  COOKED_MEAT
IRON_CHESTPLATE  DIAMOND_CHESTPLATE  SHIELD
TORCH  FURNACE  CHEST  BED  DOOR  GLASS  TNT</pre>
</div>
<div class="mdoc">
  <div class="mdoc-h">💡 Tips</div>
  <pre class="mdoc-c">• Block IDs 1–56 are vanilla — use 100–220 for mods
• Press ▶ Run to apply the mod immediately
• giveItem / setBlock only work while in-game
• Open a world, then press Mod Studio → Run to test
• Ctrl+Z / Ctrl+Y work in the editor
• Use console.log() to debug</pre>
</div>`;
}

// ── Saves tab ─────────────────────────────────────────────────────
function _renderSavesList() {
  const el = document.getElementById('mod-saved-list'); if (!el) return;
  const mods = _modLoadSaves();
  if (!mods.length) {
    el.innerHTML='<div class="msave-empty">No saved mods yet.<br>Click 💾 Save to store your mod!</div>';
    return;
  }
  el.innerHTML='';
  mods.forEach(mod=>{
    const row=document.createElement('div'); row.className='msave-row';
    row.innerHTML=`
      <div class="msave-info">
        <div class="msave-name">${mod.name}</div>
        <div class="msave-date">${mod.date}</div>
      </div>
      <div class="msave-btns">
        <button class="mbtn sm">Load</button>
        <button class="mbtn sm red">Del</button>
      </div>`;
    row.querySelector('.mbtn:not(.red)').onclick=()=>{
      const ed=_modEditor(); if(ed){ ed.value=mod.code; _updateLineNums(); }
      _setStatus('Loaded: '+mod.name,'ok');
      _switchTab('console');
    };
    row.querySelector('.mbtn.red').onclick=()=>{
      if(confirm('Delete "'+mod.name+'"?')){ _modDelete(mod.name); _renderSavesList(); }
    };
    el.appendChild(row);
  });
}

// ══════════════════════════════════════════════════════════════════
//   DOWNLOAD ZIP
// ══════════════════════════════════════════════════════════════════
async function _downloadModZip() {
  if (typeof JSZip==='undefined') {
    alert('JSZip not loaded. Check your internet connection.'); return;
  }
  _setStatus('Building ZIP…','run');

  const userCode = (_modEditor()||{}).value || _MOD_DEFAULT_CODE;
  const zip = new JSZip();
  const folder = zip.folder('PixelSurvive-Modded');

  // Try to fetch original game files (works over HTTP, not file://)
  const filesToFetch = [
    'main-01-init.js','main-02-world.js','main-03-render.js',
    'main-04-ui.js','main-05-modding.js','ui.css'
  ];
  for (const f of filesToFetch) {
    try {
      const r = await fetch(f);
      if (r.ok) folder.file(f, await r.text());
    } catch(e) { /* file:// protocol — skip */ }
  }

  // Always include user mod and index.html (generated)
  folder.file('user_mod.js', '// PixelSurvive User Mod\n// Created with Mod Studio\n\n'+userCode);
  folder.file('index.html', _genIndexHTML());
  folder.file('README.txt', _genReadme());

  try {
    const blob = await zip.generateAsync({ type:'blob', compression:'DEFLATE', compressionOptions:{level:6} });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'PixelSurvive-Modded.zip';
    a.click();
    URL.revokeObjectURL(a.href);
    _setStatus('✓ ZIP saved!','ok');
  } catch(e) { _setStatus('✗ ZIP error: '+e.message,'err'); }
}

function _genIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PixelSurvive - Modded</title>
<script src="https://unpkg.com/peerjs@1.5.1/dist/peerjs.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<link rel="stylesheet" href="ui.css">
</head>
<body>
<!--
  PixelSurvive - Modded Version
  Copy all <div> elements from your ORIGINAL index.html here,
  then keep these 7 script tags at the bottom.
  Your mod code lives in user_mod.js.
-->
<script src="main-01-init.js"><\/script>
<script src="main-02-world.js"><\/script>
<script src="main-03-render.js"><\/script>
<script src="main-04-ui.js"><\/script>
<script src="main-05-modding.js"><\/script>
<script src="user_mod.js"><\/script>
</body>
</html>`;
}

function _genReadme() {
  return `PixelSurvive — Modded Version
Generated by Mod Studio v1.0
================================

SETUP
-----
1. Copy all files from this ZIP into your game folder.
2. Open index.html and paste the full <body> content from
   your ORIGINAL index.html (keep the 6 script tags at the bottom).
3. Serve the folder with a local web server:
     npx serve .                  (Node.js)
     python -m http.server 8080   (Python)
   Then open:  http://localhost:8080

4. Your mod is in user_mod.js and auto-loads via main-05-modding.js.

FILES
-----
index.html          Main HTML (merge body from original)
ui.css              Styles (includes Mod Studio styles)
main-01-init.js     Game init, constants, BD/IT tables
main-02-world.js    World gen, physics, inventory
main-03-render.js   Rendering engine
main-04-ui.js       UI handlers & online mode
main-05-modding.js  Mod engine + Mod Studio UI  ← NEW
user_mod.js         Your mod code               ← YOUR MOD

PixelMod API
------------
PixelMod.registerBlock({ id, name, color, solid, drops, hardness, overlay })
PixelMod.registerItem({ key, name, color, tool, dmg, pow, food, hunger, heal, block, armor, def })
PixelMod.registerRecipe({ output, count, pattern })
PixelMod.registerSmelt(input, output, timeMs)
PixelMod.giveItem(key, count)   // in-game only
PixelMod.setBlock(x, y, id)    // in-game only
PixelMod.getPlayer()
PixelMod.clearAll()

Block IDs 100–220 are reserved for mods (vanilla uses 1–56).
`;
}

// ══════════════════════════════════════════════════════════════════
//   BOOT  —  Attach all event listeners once DOM is ready
// ══════════════════════════════════════════════════════════════════
(function _bootModStudio() {
  // ── Toolbar buttons ────────────────────────────────────────────
  const on = (id, fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click',fn); };

  on('btn-modsudio',       ()=>{ try{initAudio();}catch(e){} showModStudio(); });
  on('btn-back-modstudio', hideModStudio);
  on('btn-mod-run',        _runMod);
  on('btn-mod-download',   _downloadModZip);
  on('btn-mod-clear-mod',  ()=>{ PixelMod.clearAll(); _setStatus('Mods cleared','info'); _switchTab('console'); });

  on('btn-mod-save', ()=>{
    const name = prompt('Name this mod:', 'My Mod');
    if (!name) return;
    const code = (_modEditor()||{}).value||'';
    _modSave(name, code);
    try{ localStorage.setItem('ps_mod_current', code); }catch(e){}
    _setStatus('Saved: '+name,'ok');
    _renderSavesList();
  });

  on('btn-mod-load', ()=>{ _renderSavesList(); _switchTab('mods'); });

  on('btn-mod-reset', ()=>{
    if (confirm('Reset editor to default example code?')) {
      const ed=_modEditor(); if(ed){ ed.value=_MOD_DEFAULT_CODE; _updateLineNums(); }
      _setStatus('Reset to example','info');
    }
  });

  // ── Tabs ───────────────────────────────────────────────────────
  document.querySelectorAll('.mod-tab').forEach(btn=>{
    btn.addEventListener('click',()=>_switchTab(btn.dataset.tab));
  });

  // ── Code editor ───────────────────────────────────────────────
  const ed = document.getElementById('mod-code-editor');
  if (ed) {
    ed.addEventListener('input', ()=>{
      _updateLineNums();
      try{ localStorage.setItem('ps_mod_current', ed.value); }catch(e){}
    });
    ed.addEventListener('scroll', ()=>{
      const ln=document.getElementById('mod-line-numbers');
      if(ln) ln.scrollTop=ed.scrollTop;
    });
    // Tab key → 2 spaces
    ed.addEventListener('keydown', e=>{
      if (e.key!=='Tab') return;
      e.preventDefault();
      const s=ed.selectionStart, en=ed.selectionEnd;
      ed.value=ed.value.slice(0,s)+'  '+ed.value.slice(en);
      ed.selectionStart=ed.selectionEnd=s+2;
      _updateLineNums();
    });
    // Ctrl+Enter → Run
    ed.addEventListener('keydown', e=>{
      if ((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); _runMod(); }
    });
  }
})();
