<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

const COLS = 20
const ROWS = 20
const CELL = 16   // px per cell on preview canvas

const COLOR_BG        = '#050d18'
const COLOR_GRID      = 'rgba(0,255,200,0.04)'
const COLOR_FOOD      = '#ff4d6d'
const COLOR_FOOD_GLOW = 'rgba(255,77,109,0.55)'
const COLOR_HEAD      = '#00ffe0'
const COLOR_BODY      = '#00c9b0'
const COLOR_BODY_TAIL = '#007a6e'

function lerpColor(a, b, t) {
  const pr = (hex) => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]
  const [r1,g1,b1] = pr(a)
  const [r2,g2,b2] = pr(b)
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width  = COLS * CELL
  canvas.height = ROWS * CELL
  const ctx = canvas.getContext('2d')

  // --- AI snake state ---
  let snake     = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }]
  let food      = { x: 15, y: 10 }
  let direction = { x: 1, y: 0 }
  let foodPulse = 0

  // Simple AI: tries to steer toward food, avoids walls & self
  function pickDirection() {
    const head  = snake[0]
    const dx    = food.x - head.x
    const dy    = food.y - head.y
    const preferred = []

    if (dx > 0)  preferred.push({ x: 1,  y: 0 })
    if (dx < 0)  preferred.push({ x: -1, y: 0 })
    if (dy > 0)  preferred.push({ x: 0,  y: 1  })
    if (dy < 0)  preferred.push({ x: 0,  y: -1 })

    // Fallback directions
    const all = [{ x:1,y:0 }, { x:-1,y:0 }, { x:0,y:1 }, { x:0,y:-1 }]
    const candidates = [...preferred, ...all]

    for (const d of candidates) {
      // No 180° reversal
      if (d.x === -direction.x && d.y === -direction.y) continue
      const nx = head.x + d.x
      const ny = head.y + d.y
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue
      if (snake.some(s => s.x === nx && s.y === ny)) continue
      return d
    }
    return direction // nowhere safe, keep going
  }

  function randomFood() {
    let cell
    do {
      cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    } while (snake.some(s => s.x === cell.x && s.y === cell.y))
    return cell
  }

  let lastTick = 0
  const TICK_MS = 120

  function frame(ts) {
    foodPulse = (ts * 0.003) % (Math.PI * 2)

    // Move snake on tick
    if (ts - lastTick > TICK_MS) {
      lastTick = ts
      direction = pickDirection()
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

      // Collision → reset
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        snake     = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }]
        direction = { x: 1, y: 0 }
        food      = randomFood()
      } else {
        snake.unshift(head)
        if (head.x === food.x && head.y === food.y) {
          food = randomFood()
        } else {
          snake.pop()
        }
      }
    }

    // Draw background
    ctx.fillStyle = COLOR_BG
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)

    // Grid
    ctx.strokeStyle = COLOR_GRID
    ctx.lineWidth   = 0.5
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c*CELL, 0); ctx.lineTo(c*CELL, ROWS*CELL); ctx.stroke()
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r*CELL); ctx.lineTo(COLS*CELL, r*CELL); ctx.stroke()
    }

    // Food glow
    const glowR = CELL * 0.4 + Math.sin(foodPulse) * 1.5
    const grad = ctx.createRadialGradient(
      food.x*CELL+CELL/2, food.y*CELL+CELL/2, 0,
      food.x*CELL+CELL/2, food.y*CELL+CELL/2, glowR * 2
    )
    grad.addColorStop(0, COLOR_FOOD_GLOW)
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, glowR*2, 0, Math.PI*2)
    ctx.fill()

    // Food dot
    ctx.fillStyle   = COLOR_FOOD
    ctx.shadowColor = COLOR_FOOD
    ctx.shadowBlur  = 8
    ctx.beginPath()
    ctx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL*0.32+Math.sin(foodPulse)*1.2, 0, Math.PI*2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Snake
    snake.forEach((seg, i) => {
      const t = i / (snake.length - 1 || 1)
      ctx.fillStyle = i === 0 ? COLOR_HEAD : lerpColor(COLOR_BODY, COLOR_BODY_TAIL, t)
      if (i === 0) { ctx.shadowColor = COLOR_HEAD; ctx.shadowBlur = 10 }
      const pad = i === 0 ? 1 : 2
      ctx.fillRect(seg.x*CELL+pad, seg.y*CELL+pad, CELL-pad*2, CELL-pad*2)
      ctx.shadowBlur = 0
    })

    animationId = requestAnimationFrame(frame)
  }

  animationId = requestAnimationFrame(frame)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 p-2 shadow-2xl shadow-emerald-500/10 group">
    <!-- CRT scanline overlay -->
    <div class="absolute inset-0 pointer-events-none z-10 opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>

    <!-- Canvas -->
    <div class="flex justify-center items-center overflow-hidden rounded-xl bg-slate-950 aspect-square max-h-[320px] mx-auto">
      <canvas ref="canvasRef" class="h-full w-auto object-contain"></canvas>
    </div>

    <!-- Live badge -->
    <div class="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-emerald-400 font-bold tracking-wider">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
      SNAKE PREVIEW
    </div>
  </div>
</template>
