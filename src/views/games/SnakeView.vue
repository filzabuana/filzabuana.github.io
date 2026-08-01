<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Gamepad2 } from '@lucide/vue'

// ─── Reactive State ─────────────────────────────────────────────────────────
const canvasRef = ref(null)
const score     = ref(0)
const level     = ref(1)

const MAX_LEVEL = 10

const getStoredHighScore = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return parseInt(localStorage.getItem('snake_high_score') || '0', 10)
    }
  } catch (e) {}
  return 0
}

const highScore    = ref(getStoredHighScore())
const isGameOver   = ref(false)
const gameStarted  = ref(false)
const isAudioMuted = ref(false)

// ─── Grid Constants ──────────────────────────────────────────────────────────
const COLS       = 20
const ROWS       = 20
const CELL       = 20   // px per cell (canvas units before scaling)

// Speed table: ms per tick at each level (level 1–10, capped at 10)
const SPEED_TABLE = [200, 175, 150, 130, 110, 95, 82, 70, 60, 52]

// ─── Colours ─────────────────────────────────────────────────────────────────
const COLOR_BG        = '#050d18'
const COLOR_GRID      = 'rgba(0,255,200,0.04)'
const COLOR_FOOD      = '#ff4d6d'
const COLOR_FOOD_GLOW = 'rgba(255,77,109,0.55)'
const COLOR_HEAD      = '#00ffe0'
const COLOR_BODY      = '#00c9b0'
const COLOR_BODY_TAIL = '#007a6e'

// ─── Audio ───────────────────────────────────────────────────────────────────
let audioCtx = null

function initAudio() {
  if (isAudioMuted.value) return
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
}

function beep(freq, type = 'square', duration = 0.07, vol = 0.04) {
  if (isAudioMuted.value || !audioCtx) return
  const osc  = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
  gain.gain.setValueAtTime(vol, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + duration)
}

function playEatSfx() {
  beep(880, 'square', 0.06, 0.03)
  setTimeout(() => beep(1320, 'square', 0.06, 0.025), 55)
}

function playLevelUpSfx() {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 'square', 0.09, 0.035), i * 70))
}

function playDeathSfx() {
  beep(220, 'sawtooth', 0.18, 0.05)
  setTimeout(() => beep(110, 'sawtooth', 0.22, 0.06), 140)
}

const toggleAudio = () => {
  isAudioMuted.value = !isAudioMuted.value
}

// ─── Game State ───────────────────────────────────────────────────────────────
let snake      = []
let food       = {}
let direction  = { x: 1, y: 0 }
let nextDir    = { x: 1, y: 0 }
let gameRunning = false
let tickTimer   = null
let foodEaten   = 0        // total eaten this session
let foodPulse   = 0        // animation phase 0..1

// Touch swipe tracking
let touchStartX = 0
let touchStartY = 0

function getTickInterval() {
  const idx = Math.min(level.value - 1, MAX_LEVEL - 1)
  return SPEED_TABLE[idx]
}

function randomCell(excludes = []) {
  let cell
  do {
    cell = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    }
  } while (excludes.some(s => s.x === cell.x && s.y === cell.y))
  return cell
}

function saveHighScore() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('snake_high_score', String(highScore.value))
    }
  } catch (e) {}
}

// ─── Canvas Drawing ──────────────────────────────────────────────────────────
let animFrameId = null
let lastFrameTime = 0

function drawFrame(ts = 0) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W   = COLS * CELL
  const H   = ROWS * CELL

  // pulsing food anim
  foodPulse = (ts * 0.003) % (Math.PI * 2)

  // Background
  ctx.fillStyle = COLOR_BG
  ctx.fillRect(0, 0, W, H)

  // Grid lines
  ctx.strokeStyle = COLOR_GRID
  ctx.lineWidth = 0.5
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke()
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke()
  }

  // Food glow
  const glowR = CELL * 0.45 + Math.sin(foodPulse) * 2
  const grad = ctx.createRadialGradient(
    food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, 0,
    food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, glowR * 2
  )
  grad.addColorStop(0, COLOR_FOOD_GLOW)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, glowR * 2, 0, Math.PI * 2)
  ctx.fill()

  // Food dot
  ctx.fillStyle = COLOR_FOOD
  ctx.shadowColor = COLOR_FOOD
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.35 + Math.sin(foodPulse) * 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Snake segments
  snake.forEach((seg, i) => {
    const isHead = i === 0
    const t      = i / (snake.length - 1 || 1)
    // lerp color from head to tail
    ctx.fillStyle = isHead ? COLOR_HEAD : lerpColor(COLOR_BODY, COLOR_BODY_TAIL, t)
    if (isHead) {
      ctx.shadowColor = COLOR_HEAD
      ctx.shadowBlur  = 12
    }
    const pad = isHead ? 1 : 2
    ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
    ctx.shadowBlur = 0
  })

  animFrameId = requestAnimationFrame(drawFrame)
}

function lerpColor(a, b, t) {
  // Hex to rgb naive parse (only for our fixed colors)
  const pr = (hex) => [
    parseInt(hex.slice(1,3),16),
    parseInt(hex.slice(3,5),16),
    parseInt(hex.slice(5,7),16)
  ]
  const [r1,g1,b1] = pr(a)
  const [r2,g2,b2] = pr(b)
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`
}

// ─── Game Logic ───────────────────────────────────────────────────────────────
function tick() {
  if (!gameRunning) return

  direction = { ...nextDir }
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver(); return
  }
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver(); return
  }

  snake.unshift(head)

  // Ate food?
  if (head.x === food.x && head.y === food.y) {
    foodEaten++
    score.value += level.value * 10
    if (score.value > highScore.value) {
      highScore.value = score.value
      saveHighScore()
    }

    // Level up every 5 foods, cap at MAX_LEVEL
    const newLevel = Math.min(Math.floor(foodEaten / 5) + 1, MAX_LEVEL)
    const didLevelUp = newLevel > level.value
    level.value = newLevel

    playEatSfx()
    if (didLevelUp) {
      playLevelUpSfx()
      // restart tick at new speed
      scheduleTick()
    }

    food = randomCell(snake)
  } else {
    snake.pop()
  }
}

function scheduleTick() {
  clearInterval(tickTimer)
  if (!gameRunning) return
  tickTimer = setInterval(tick, getTickInterval())
}

function startGame() {
  initAudio()

  // Init snake in centre, 3 segments long
  const midX = Math.floor(COLS / 2)
  const midY = Math.floor(ROWS / 2)
  snake     = [{ x: midX, y: midY }, { x: midX - 1, y: midY }, { x: midX - 2, y: midY }]
  direction = { x: 1, y: 0 }
  nextDir   = { x: 1, y: 0 }
  food      = randomCell(snake)
  foodEaten = 0

  score.value  = 0
  level.value  = 1

  isGameOver.value  = false
  gameStarted.value = true
  gameRunning       = true

  scheduleTick()

  if (!animFrameId) drawFrame()
}

function gameOver() {
  gameRunning = false
  clearInterval(tickTimer)
  playDeathSfx()
  isGameOver.value = true
}

// ─── Input ────────────────────────────────────────────────────────────────────
function handleKeyDown(e) {
  if ([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault()

  if (!gameRunning) {
    if ([13, 32].includes(e.keyCode)) startGame()  // Enter/Space to start
    return
  }

  initAudio()
  if (e.keyCode === 37 && direction.x !== 1)  nextDir = { x: -1, y: 0 }
  if (e.keyCode === 39 && direction.x !== -1) nextDir = { x: 1,  y: 0 }
  if (e.keyCode === 38 && direction.y !== 1)  nextDir = { x: 0,  y: -1 }
  if (e.keyCode === 40 && direction.y !== -1) nextDir = { x: 0,  y: 1  }
}

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].clientX
  touchStartY = e.changedTouches[0].clientY
}

function handleTouchEnd(e) {
  if (!gameRunning) return
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < 10) return // ignore tiny taps

  if (absDx > absDy) {
    if (dx > 0 && direction.x !== -1) nextDir = { x: 1,  y: 0 }
    if (dx < 0 && direction.x !== 1)  nextDir = { x: -1, y: 0 }
  } else {
    if (dy > 0 && direction.y !== -1) nextDir = { x: 0,  y: 1  }
    if (dy < 0 && direction.y !== 1)  nextDir = { x: 0,  y: -1 }
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.width  = COLS * CELL
    canvas.height = ROWS * CELL
    // Draw empty board while waiting for start
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    food  = { x: 14, y: 10 }
    animFrameId = requestAnimationFrame(drawFrame)
  }
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  gameRunning = false
  clearInterval(tickTimer)
  if (animFrameId) cancelAnimationFrame(animFrameId)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-10">

    <!-- Back / Audio Header -->
    <div class="flex items-center justify-between mb-6">
      <RouterLink to="/games"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all shadow-sm">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Games</span>
      </RouterLink>

      <button @click="toggleAudio"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
        <Volume2 v-if="!isAudioMuted" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <VolumeX v-else class="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <span>{{ isAudioMuted ? 'Muted' : '8-Bit Audio' }}</span>
      </button>
    </div>

    <!-- Main Game Card -->
    <div class="bg-white/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center backdrop-blur-md">

      <!-- Title & Stats -->
      <header class="text-center w-full mb-4">
        <div class="flex items-center justify-center gap-2 mb-3">
          <Gamepad2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h1 class="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 uppercase">
            Retro Snake
          </h1>
        </div>

        <div class="grid grid-cols-2 sm:flex sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs font-mono bg-slate-100/90 dark:bg-slate-950/80 py-2.5 px-4 sm:px-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-max mx-auto shadow-inner text-center">
          <div class="text-emerald-600 dark:text-emerald-400">SCORE: <span class="font-bold text-slate-900 dark:text-white">{{ score }}</span></div>
          <div class="text-pink-600 dark:text-pink-400">HIGH: <span class="font-bold text-slate-900 dark:text-white">{{ highScore }}</span></div>
          <div class="text-indigo-600 dark:text-indigo-400">LEVEL: <span class="font-bold text-slate-900 dark:text-white">{{ level }}<span class="text-slate-400 dark:text-slate-600">/{{ 10 }}</span></span></div>
          <div class="text-amber-600 dark:text-amber-400">SPEED: <span class="font-bold text-slate-900 dark:text-white">{{ level === 10 ? 'MAX' : `${level * 10}%` }}</span></div>
        </div>
      </header>

      <!-- Canvas Stage -->
      <main class="w-full flex justify-center relative my-2">
        <div class="relative bg-slate-950 rounded-xl overflow-hidden border-4 border-slate-300 dark:border-slate-800 shadow-2xl"
             style="box-shadow: 0 0 30px rgba(0,255,200,0.08);">

          <!-- CRT Scanlines -->
          <div class="absolute inset-0 pointer-events-none z-20 opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>

          <!-- Game Canvas -->
          <canvas ref="canvasRef"
                  @touchstart.passive="handleTouchStart"
                  @touchend.passive="handleTouchEnd"
                  class="block touch-none select-none"
                  style="max-width: min(90vw, 400px); height: auto; display: block;">
          </canvas>

          <!-- Start / Game Over Overlay -->
          <div v-if="!gameStarted || isGameOver"
               class="absolute inset-0 bg-slate-950/88 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30 transition-all">

            <h2 v-if="isGameOver"
                class="text-2xl font-black text-rose-500 tracking-widest animate-bounce drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]">
              GAME OVER
            </h2>
            <div v-if="isGameOver" class="text-center text-xs font-mono text-slate-400">
              <div>Score: <span class="text-white font-bold">{{ score }}</span></div>
              <div v-if="score >= highScore && score > 0" class="text-amber-400 font-bold mt-1">🏆 New High Score!</div>
            </div>
            <h2 v-else class="text-xl font-bold text-emerald-400 tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
              RETRO SNAKE
            </h2>
            <p v-if="!gameStarted" class="text-xs text-slate-400 font-mono text-center px-4">
              Use Arrow Keys or Swipe to move.<br>Don't hit the walls or yourself!
            </p>

            <button @click="startGame"
                    class="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 uppercase tracking-wider cursor-pointer">
              <Play v-if="!gameStarted" class="w-4 h-4 fill-white" />
              <RotateCcw v-else class="w-4 h-4" />
              <span>{{ gameStarted ? 'Play Again' : 'Start Game' }}</span>
            </button>
          </div>
        </div>
      </main>

      <!-- Controls Guide -->
      <section class="w-full max-w-sm mx-auto flex flex-col gap-3 mt-3">
        <!-- Desktop Controls -->
        <div class="hidden md:flex justify-center gap-6 bg-slate-100/90 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-mono shadow-sm">
          <div><kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">←</kbd> <kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">→</kbd> <kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">↑</kbd> <kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">↓</kbd> Move</div>
          <div><kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">Enter</kbd> / <kbd class="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-950">Space</kbd> Start</div>
        </div>

        <!-- Mobile Hint -->
        <p class="text-[11px] text-center text-emerald-600 dark:text-amber-400/90 font-medium md:hidden animate-pulse">
          💡 Swipe to change direction
        </p>
      </section>

    </div>
  </div>
</template>
