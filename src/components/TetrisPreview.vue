<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

const COLS = 10
const ROWS = 16
const BLOCK_SIZE = 20

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

const pieces = 'ILJOTSZ'

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  
  canvas.width = COLS * BLOCK_SIZE
  canvas.height = ROWS * BLOCK_SIZE
  ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

  const arena = createMatrix(COLS, ROWS)
  
  for (let r = ROWS - 5; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.random() > 0.35) {
        arena[r][c] = Math.floor(Math.random() * 7) + 1
      }
    }
  }

  let player = {
    pos: { x: 3, y: 0 },
    matrix: createPiece(pieces[Math.floor(Math.random() * pieces.length)])
  }

  let dropCounter = 0
  let lastTime = 0
  let targetX = Math.floor(Math.random() * (COLS - 3))

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
        if (value !== 0 && y + player.pos.y >= 0 && y + player.pos.y < ROWS) {
          arena[y + player.pos.y][x + player.pos.x] = value
        }
      })
    })
  }

  function arenaSweep() {
    outer: for (let y = arena.length - 1; y >= 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) continue outer
      }
      const row = arena.splice(y, 1)[0].fill(0)
      arena.unshift(row)
      ++y
    }
  }

  function resetPlayer() {
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)])
    player.pos.y = 0
    targetX = Math.floor(Math.random() * (COLS - player.matrix[0].length + 1))
    player.pos.x = Math.floor((COLS - player.matrix[0].length) / 2)
    
    if (Math.random() > 0.5) {
      const m = player.matrix
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [m[x][y], m[y][x]] = [m[y][x], m[x][y]]
        }
      }
      m.forEach(row => row.reverse())
    }

    if (collide(arena, player)) {
      for (let y = 0; y < ROWS; y++) {
        arena[y].fill(0)
      }
    }
  }

  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          ctx.fillStyle = colors[val]
          ctx.fillRect(x + offset.x, y + offset.y, 1, 1)
          ctx.strokeStyle = 'rgba(0,0,0,0.4)'
          ctx.lineWidth = 0.08
          ctx.strokeRect(x + offset.x, y + offset.y, 1, 1)
        }
      })
    })
  }

  function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime

    if (player.pos.x < targetX && !collide(arena, { matrix: player.matrix, pos: { x: player.pos.x + 1, y: player.pos.y } })) {
      if (Math.random() > 0.6) player.pos.x++
    } else if (player.pos.x > targetX && !collide(arena, { matrix: player.matrix, pos: { x: player.pos.x - 1, y: player.pos.y } })) {
      if (Math.random() > 0.6) player.pos.x--
    }

    if (dropCounter > 220) {
      player.pos.y++
      if (collide(arena, player)) {
        player.pos.y--
        merge(arena, player)
        arenaSweep()
        resetPlayer()
      }
      dropCounter = 0
    }

    ctx.fillStyle = '#090d16'
    ctx.fillRect(0, 0, COLS, ROWS)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 0.02
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath()
      ctx.moveTo(c, 0)
      ctx.lineTo(c, ROWS)
      ctx.stroke()
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath()
      ctx.moveTo(0, r)
      ctx.lineTo(COLS, r)
      ctx.stroke()
    }

    drawMatrix(arena, { x: 0, y: 0 })
    if (player.matrix) {
      drawMatrix(player.matrix, player.pos)
    }

    animationId = requestAnimationFrame(update)
  }

  update()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden border border-indigo-500/30 bg-slate-950 p-2 shadow-2xl shadow-indigo-500/10 group">
    <!-- Retro CRT scanline effect -->
    <div class="absolute inset-0 pointer-events-none z-10 opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>
    
    <!-- Canvas container -->
    <div class="flex justify-center items-center overflow-hidden rounded-xl bg-slate-950 aspect-[10/16] max-h-[320px] mx-auto">
      <canvas ref="canvasRef" class="h-full w-auto object-contain"></canvas>
    </div>

    <!-- Live indicator badge -->
    <div class="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-emerald-400 font-bold tracking-wider">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      <span class="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
      TETRIS PREVIEW
    </div>
  </div>
</template>
