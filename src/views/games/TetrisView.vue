<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Gamepad2 } from '@lucide/vue'

const canvasRef = ref(null)
const score = ref(0)

const getStoredHighScore = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('tetris_high_score') || 0
    }
  } catch (e) {}
  return 0
}

const highScore = ref(getStoredHighScore())
const level = ref(1)
const linesCleared = ref(0)

const isGameOver = ref(false)
const gameStarted = ref(false)
const isAudioMuted = ref(false)

// Canvas constants
const COLS = 12
const ROWS = 24
const SIDE_PANEL_COLS = 5
const BLOCK_SIZE = 20

// Audio System (8-bit DMG-01 Gameboy Synth Engine)
let audioCtx = null
let audioNextNoteTime = 0.0
let musicScheduleTimer = null
let currentStepIndex = 0

const BPM = 150
const STEP_DURATION = (60 / BPM) * 0.5

const _ = 0
const E5 = 659, B4 = 494, C5 = 523, D5 = 587, A4 = 440, F5 = 698, A5 = 880, G5 = 784
const E4 = 330, F4 = 349, Gs4 = 415
const A2 = 110, A3 = 220, E3 = 165, E2 = 82, B2 = 123, D3 = 147, D4 = 294

const melodyGrid = [
  E5, _, B4, C5, D5, _, C5, B4, A4, _, A4, C5, E5, _, D5, C5,
  B4, _, _, C5, D5, _, E5, _, C5, _, A4, _, A4, _, _, _,
  D5, _, _, F5, A5, _, G5, F5, E5, _, _, C5, E5, _, D5, C5,
  B4, _, B4, C5, D5, _, E5, _, C5, _, A4, _, A4, _, _, _
]

const harmonyGrid = [
  _, E4, _, E4, _, E4, _, E4, _, E4, _, E4, _, E4, _, E4,
  _, Gs4, _, Gs4, _, Gs4, _, Gs4, _, E4, _, E4, _, _, _, _,
  _, F4, _, F4, _, F4, _, F4, _, E4, _, E4, _, E4, _, E4,
  _, Gs4, _, Gs4, _, Gs4, _, Gs4, _, E4, _, E4, _, _, _, _
]

const bassGrid = [
  A2, A3, E3, A3, A2, A3, E3, A3, A2, A3, E3, A3, A2, A3, E3, A3,
  E2, E3, B2, E3, E2, E3, B2, E3, A2, A3, E3, A3, A2, A3, A2, _,
  D3, D4, A3, D4, D3, D4, A3, D4, A2, A3, E3, A3, A2, A3, E3, A3,
  E2, E3, B2, E3, E2, E3, B2, E3, A2, A3, E3, A3, A2, A3, A2, _
]

function initAudio() {
  if (isAudioMuted.value) return
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

function playRetroDrumPattern(time, step) {
  if (isAudioMuted.value || !audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const localStep = step % 8
  
  if (localStep === 0 || localStep === 4) {
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(200, time)
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.08)
    gain.gain.setValueAtTime(0.06, time)
    gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.08)
  } else if (localStep === 2 || localStep === 6) {
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(6000, time)
    osc.frequency.linearRampToValueAtTime(800, time + 0.04)
    gain.gain.setValueAtTime(0.015, time)
    gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.04)
  } else {
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(10000, time)
    gain.gain.setValueAtTime(0.003, time)
    gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.02)
  }
  
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(time)
  osc.stop(time + 0.09)
}

function scheduleStep(step, time) {
  if (isAudioMuted.value || !audioCtx) return
  const mFreq = melodyGrid[step]
  const hFreq = harmonyGrid[step]
  const bFreq = bassGrid[step]
  const isTied = (step + 1 < melodyGrid.length && melodyGrid[step + 1] === mFreq)

  if (mFreq > 0) {
    const oscMelody = audioCtx.createOscillator()
    const gainMelody = audioCtx.createGain()
    oscMelody.type = 'square'
    oscMelody.frequency.setValueAtTime(mFreq, time)
    
    gainMelody.gain.setValueAtTime(0.012, time)
    const decayTime = isTied ? STEP_DURATION : (STEP_DURATION - 0.025)
    gainMelody.gain.setValueAtTime(0.012, time + decayTime)
    gainMelody.gain.exponentialRampToValueAtTime(0.00001, time + STEP_DURATION)
    
    oscMelody.connect(gainMelody)
    gainMelody.connect(audioCtx.destination)
    oscMelody.start(time)
    oscMelody.stop(time + STEP_DURATION)
  }

  if (hFreq > 0) {
    const oscHarm = audioCtx.createOscillator()
    const gainHarm = audioCtx.createGain()
    oscHarm.type = 'square'
    oscHarm.frequency.setValueAtTime(hFreq, time)
    
    gainHarm.gain.setValueAtTime(0.004, time)
    gainHarm.gain.exponentialRampToValueAtTime(0.00001, time + 0.05)
    
    oscHarm.connect(gainHarm)
    gainHarm.connect(audioCtx.destination)
    oscHarm.start(time)
    oscHarm.stop(time + 0.06)
  }

  if (bFreq > 0) {
    const oscBassTri = audioCtx.createOscillator()
    const gainBassTri = audioCtx.createGain()
    oscBassTri.type = 'triangle'
    oscBassTri.frequency.setValueAtTime(bFreq, time)
    
    gainBassTri.gain.setValueAtTime(0.06, time)
    gainBassTri.gain.exponentialRampToValueAtTime(0.00001, time + STEP_DURATION - 0.01)
    
    const oscBassSq = audioCtx.createOscillator()
    const gainBassSq = audioCtx.createGain()
    oscBassSq.type = 'square'
    oscBassSq.frequency.setValueAtTime(bFreq, time)
    
    gainBassSq.gain.setValueAtTime(0.01, time)
    gainBassSq.gain.exponentialRampToValueAtTime(0.00001, time + STEP_DURATION - 0.01)
    
    oscBassTri.connect(gainBassTri)
    gainBassTri.connect(audioCtx.destination)
    oscBassSq.connect(gainBassSq)
    gainBassSq.connect(audioCtx.destination)
    
    oscBassTri.start(time)
    oscBassSq.start(time)
    oscBassTri.stop(time + STEP_DURATION)
    oscBassSq.stop(time + STEP_DURATION)
  }

  playRetroDrumPattern(time, step)
}

function scheduler() {
  if (!gameRunning) return
  if (isAudioMuted.value || !audioCtx) return
  const dynamicBPM = BPM + (level.value - 1) * 6
  const currentStepDuration = (60 / dynamicBPM) * 0.5

  while (audioNextNoteTime < audioCtx.currentTime + 0.12) {
    scheduleStep(currentStepIndex, audioNextNoteTime)
    audioNextNoteTime += currentStepDuration
    currentStepIndex = (currentStepIndex + 1) % melodyGrid.length
  }
  musicScheduleTimer = setTimeout(scheduler, 25)
}

function playMusicLoop() {
  if (musicScheduleTimer) clearTimeout(musicScheduleTimer)
  initAudio()
  if (!audioCtx) return
  currentStepIndex = 0
  audioNextNoteTime = audioCtx.currentTime + 0.05
  scheduler()
}

function stopMusicLoop() {
  if (musicScheduleTimer) clearTimeout(musicScheduleTimer)
  musicScheduleTimer = null
}

function playScoreSfx() {
  if (isAudioMuted.value || !audioCtx || audioCtx.state === 'suspended') return
  const now = audioCtx.currentTime
  ;[880, 1318.51].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, now + (idx * 0.05))
    gain.gain.setValueAtTime(0.015, now + (idx * 0.05))
    gain.gain.exponentialRampToValueAtTime(0.00001, now + (idx * 0.05) + 0.12)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now + (idx * 0.05))
    osc.stop(now + (idx * 0.05) + 0.12)
  })
}

const toggleAudio = () => {
  isAudioMuted.value = !isAudioMuted.value
  if (isAudioMuted.value) {
    stopMusicLoop()
  } else if (gameRunning) {
    playMusicLoop()
  }
}

// Game Core Logic
let arena = null
let player = null
let gameRunning = false
let animFrameId = null
let dropCounter = 0
let baseDropInterval = 1000
let dropInterval = 1000
let lastTime = 0
let nextPieceMatrix = null

const pieces = 'ILJOTSZ'
const colors = [
  null, '#a855f7', '#eab308', '#f97316', '#3b82f6', '#06b6d4', '#22c55e', '#ef4444'
]

function createMatrix(w, h) {
  const matrix = []
  while (h--) matrix.push(new Array(w).fill(0))
  return matrix
}

function createPiece(type) {
  if (type === 'T') return [[0,1,0],[1,1,1],[0,0,0]]
  if (type === 'O') return [[2,2],[2,2]]
  if (type === 'L') return [[0,0,3],[3,3,3],[0,0,0]]
  if (type === 'J') return [[4,0,0],[4,4,4],[0,0,0]]
  if (type === 'I') return [[0,0,0,0],[5,5,5,5],[0,0,0,0],[0,0,0,0]]
  if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]]
  if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]]
}

function calculateSpeed(lvl) {
  return Math.max(80, baseDropInterval - (lvl - 1) * 90)
}

function checkHighScore() {
  if (score.value > highScore.value) {
    highScore.value = score.value
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tetris_high_score', highScore.value)
      }
    } catch (e) {}
  }
}

function arenaSweep() {
  let rowCount = 0
  let swept = false
  
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer
    }
    const row = arena.splice(y, 1)[0].fill(0)
    arena.unshift(row)
    ++y
    rowCount++
    swept = true
  }
  
  if (swept) {
    linesCleared.value += rowCount
    const scoreTable = [0, 40, 100, 300, 1200]
    score.value += scoreTable[rowCount] * level.value
    
    const newLevel = Math.floor(linesCleared.value / 10) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      dropInterval = calculateSpeed(level.value)
    }
    
    playScoreSfx()
    checkHighScore()
  }
}

function collide(arena, player) {
  const m = player.matrix
  const o = player.pos
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0) {
        let arenaY = y + o.y
        let arenaX = x + o.x
        if (arenaY < 0) {
          if (arenaX < 0 || arenaX >= COLS) return true
          continue
        }
        if (arenaY >= ROWS || arenaX < 0 || arenaX >= COLS) return true
        if (arena[arenaY][arenaX] !== 0) return true
      }
    }
  }
  return false
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0 && y + player.pos.y >= 0) { 
        arena[y + player.pos.y][x + player.pos.x] = value 
      }
    })
  })
}

function drawMatrix(context, matrix, offset) {
  if (!matrix) return
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value]
        context.fillRect(x + offset.x, y + offset.y, 1, 1)
        context.strokeStyle = 'rgba(0,0,0,0.5)'
        context.lineWidth = 0.1
        context.strokeRect(x + offset.x, y + offset.y, 1, 1)
      }
    })
  })
}

function drawSidePanel(context) {
  context.fillStyle = '#1e293b'
  context.fillRect(COLS, 0, 0.1, ROWS)

  context.fillStyle = '#818cf8'
  context.font = '1.2px monospace'
  context.fillText('NEXT', COLS + 0.8, 2)

  context.strokeStyle = '#334155'
  context.lineWidth = 0.05
  context.strokeRect(COLS + 0.5, 3, 4, 4)

  if (nextPieceMatrix) {
    const offsetX = COLS + 0.5 + (4 - nextPieceMatrix[0].length) / 2
    const offsetY = 3 + (4 - nextPieceMatrix.length) / 2
    drawMatrix(context, nextPieceMatrix, {x: offsetX, y: offsetY})
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const context = canvas.getContext('2d')
  context.fillStyle = '#050505'
  context.fillRect(0, 0, canvas.width, canvas.height)

  drawMatrix(context, arena, {x: 0, y: 0})
  if (player && player.matrix) {
    drawMatrix(context, player.matrix, player.pos)
  }
  drawSidePanel(context)
}

function update(time = 0) {
  if (!gameRunning) return
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > dropInterval) { playerDrop() }
  draw()
  animFrameId = requestAnimationFrame(update)
}

function playerDrop() {
  player.pos.y++
  if (collide(arena, player)) {
    player.pos.y--
    merge(arena, player)
    playerReset()
    arenaSweep()
  }
  dropCounter = 0
}

function playerMove(dir) {
  if (!gameRunning) return
  player.pos.x += dir
  if (collide(arena, player)) { player.pos.x -= dir }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]
    }
  }
  if (dir > 0) { matrix.forEach(row => row.reverse()) } 
  else { matrix.reverse() }
}

function playerRotate(dir) {
  if (!gameRunning || !player.matrix) return
  const pos = player.pos.x
  let offset = 1
  rotate(player.matrix, dir)
  while (collide(arena, player)) {
    player.pos.x += offset
    offset = -(offset + (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir)
      player.pos.x = pos
      return
    }
  }
}

function playerReset() {
  if (!nextPieceMatrix) {
    nextPieceMatrix = createPiece(pieces[pieces.length * Math.random() | 0])
  }
  player.matrix = nextPieceMatrix
  nextPieceMatrix = createPiece(pieces[pieces.length * Math.random() | 0])
  player.pos.y = 0
  player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0)

  if (collide(arena, player)) {
    gameOver()
  }
}

function startGame() {
  initAudio()
  arena = createMatrix(COLS, ROWS)
  player = { pos: {x: 0, y: 0}, matrix: null }
  score.value = 0
  linesCleared.value = 0
  level.value = 1
  dropInterval = baseDropInterval
  nextPieceMatrix = null
  
  playerReset()
  gameRunning = true
  gameStarted.value = true
  isGameOver.value = false
  
  lastTime = performance.now()
  currentStepIndex = 0
  playMusicLoop()
  update()
}

function gameOver() {
  gameRunning = false
  stopMusicLoop()
  checkHighScore()
  isGameOver.value = true
}

// Touch control loop
let buttonInterval = null
function startButtonLoop(action, delay = 100) {
  if (!gameRunning) return
  initAudio()
  action()
  clearInterval(buttonInterval)
  buttonInterval = setInterval(() => {
    if (gameRunning) action()
  }, delay)
}
function stopButtonLoop() {
  clearInterval(buttonInterval)
}

function handleKeyDown(e) {
  if (!gameRunning) return
  if ([37, 38, 39, 40].includes(e.keyCode)) {
    e.preventDefault()
  }
  initAudio()
  if (e.keyCode === 37) playerMove(-1)
  if (e.keyCode === 39) playerMove(1)
  if (e.keyCode === 40) playerDrop()
  if (e.keyCode === 38) playerRotate(1)
}

let touchStartTime = 0
let holdTimeout = null

function handleCanvasTouchStart(e) {
  e.preventDefault()
  if (!gameRunning) return
  initAudio()
  touchStartTime = performance.now()
  holdTimeout = setTimeout(() => {
    dropInterval = 40
  }, 180)
}

function handleCanvasTouchEnd(e) {
  e.preventDefault()
  if (!gameRunning) return
  clearTimeout(holdTimeout)
  dropInterval = calculateSpeed(level.value)
  const touchDuration = performance.now() - touchStartTime
  if (touchDuration < 180) {
    playerRotate(1)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    const context = canvas.getContext('2d')
    canvas.width = (COLS + SIDE_PANEL_COLS) * BLOCK_SIZE
    canvas.height = ROWS * BLOCK_SIZE
    context.scale(BLOCK_SIZE, BLOCK_SIZE)
    arena = createMatrix(COLS, ROWS)
    player = { pos: {x: 0, y: 0}, matrix: null }
    draw()
  }
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  gameRunning = false
  if (animFrameId) cancelAnimationFrame(animFrameId)
  stopMusicLoop()
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-10">
    <!-- Back to Games Navigation Header -->
    <div class="flex items-center justify-between mb-6">
      <RouterLink to="/games" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all shadow-sm">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Games</span>
      </RouterLink>

      <button @click="toggleAudio" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
        <Volume2 v-if="!isAudioMuted" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <VolumeX v-else class="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <span>{{ isAudioMuted ? 'Mute' : '8-Bit Audio' }}</span>
      </button>
    </div>

    <!-- Main Game Card Container -->
    <div class="bg-white/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center backdrop-blur-md">
      
      <!-- Title & Live Stats Header -->
      <header class="text-center w-full mb-4">
        <div class="flex items-center justify-center gap-2 mb-1">
          <Gamepad2 class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 class="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400 uppercase">JS TETRIS</h1>
        </div>
        
        <div class="grid grid-cols-2 sm:flex sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs font-mono bg-slate-100/90 dark:bg-slate-950/80 py-2.5 px-4 sm:px-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-max mx-auto shadow-inner text-center">
          <div class="text-emerald-600 dark:text-emerald-400">SCORE: <span class="font-bold text-slate-900 dark:text-white">{{ score }}</span></div>
          <div class="text-pink-600 dark:text-pink-400">HIGH SCORE: <span class="font-bold text-slate-900 dark:text-white">{{ highScore }}</span></div>
          <div class="text-indigo-600 dark:text-indigo-400">LEVEL: <span class="font-bold text-slate-900 dark:text-white">{{ level }}</span></div>
          <div class="text-amber-600 dark:text-amber-400">LINES: <span class="font-bold text-slate-900 dark:text-white">{{ linesCleared }}</span></div>
        </div>
      </header>

      <!-- Game Stage Canvas & Overlays -->
      <main class="w-full flex justify-center relative my-2" style="height: 52vh; max-height: 480px;">
        <div class="relative h-full aspect-[17/24] bg-slate-950 rounded-xl overflow-hidden border-4 border-slate-300 dark:border-slate-800 shadow-2xl">
          <!-- Retro CRT scanlines -->
          <div class="absolute inset-0 pointer-events-none z-20 opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>
          
          <!-- Game Canvas -->
          <canvas ref="canvasRef" 
                  @touchstart="handleCanvasTouchStart" 
                  @touchend="handleCanvasTouchEnd"
                  class="h-full w-full block cursor-pointer select-none touch-none"></canvas>
          
          <!-- Start / Game Over Overlay -->
          <div v-if="!gameStarted || isGameOver" 
               class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30 transition-all">
            
            <h2 v-if="isGameOver" class="text-2xl font-black text-rose-500 tracking-widest animate-bounce drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">GAME OVER</h2>
            <h2 v-else class="text-xl font-bold text-indigo-300 tracking-wider">RETRO ARCADE</h2>
            
            <button @click="startGame" 
                    class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 uppercase tracking-wider cursor-pointer">
              <Play v-if="!gameStarted" class="w-4 h-4 fill-white" />
              <RotateCcw v-else class="w-4 h-4" />
              <span>{{ gameStarted ? 'Play Again' : 'Start Game' }}</span>
            </button>
          </div>
        </div>
      </main>

      <!-- Controls & Instructions Section -->
      <section class="w-full max-w-sm mx-auto flex flex-col gap-3 mt-3">
        <!-- Touch Buttons for Mobile -->
        <div class="grid grid-cols-3 gap-2.5 w-[180px] mx-auto md:hidden">
          <div></div>
          <button @touchstart.prevent="playerRotate(1)" 
                  class="bg-slate-200 dark:bg-slate-800 active:bg-indigo-600 border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200">↻</button>
          <div></div>
          
          <button @touchstart.prevent="startButtonLoop(() => playerMove(-1), 100)" 
                  @touchend.prevent="stopButtonLoop"
                  class="bg-slate-200 dark:bg-slate-800 active:bg-indigo-600 border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200">←</button>
          
          <button @touchstart.prevent="startButtonLoop(() => playerDrop(), 50)" 
                  @touchend.prevent="stopButtonLoop"
                  class="bg-slate-200 dark:bg-slate-800 active:bg-indigo-600 border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200">↓</button>
          
          <button @touchstart.prevent="startButtonLoop(() => playerMove(1), 100)" 
                  @touchend.prevent="stopButtonLoop"
                  class="bg-slate-200 dark:bg-slate-800 active:bg-indigo-600 border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-1 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200">→</button>
        </div>

        <!-- Desktop Controls Guide -->
        <div class="hidden md:flex justify-center gap-6 bg-slate-100/90 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-mono shadow-sm">
          <div><kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">←</kbd> <kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">→</kbd> Move</div>
          <div><kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">↑</kbd> Rotate</div>
          <div><kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-950">↓</kbd> Soft Drop</div>
        </div>

        <p class="text-[11px] text-center text-amber-600 dark:text-amber-400/90 font-medium md:hidden animate-pulse">
          💡 Tap screen to rotate | Hold to soft drop
        </p>
      </section>

    </div>
  </div>
</template>
