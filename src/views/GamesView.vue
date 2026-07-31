<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Gamepad2, Play, Sparkles, Trophy, Flame } from '@lucide/vue'
import TetrisPreview from '../components/TetrisPreview.vue'

const tetrisHighScore = ref(0)

onMounted(() => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      tetrisHighScore.value = localStorage.getItem('tetris_high_score') || 0
    }
  } catch (e) {
    tetrisHighScore.value = 0
  }
})

const featuredGame = {
  id: 'tetris',
  title: 'JS Tetris Retro',
  category: 'Classic Arcade',
  description: 'Classic Tetris game featuring an 8-bit DMG-01 GameBoy audio engine, progressive levels, CRT scanlines, and responsive touch/keyboard controls.',
  link: '/games/tetris',
  badge: 'Popular',
  tags: ['JavaScript', 'HTML5 Canvas', 'Web Audio Synth']
}

const upcomingGames = [
  {
    id: 'snake',
    title: 'Retro Snake 2D',
    category: 'Arcade',
    description: 'Classic snake game with neon cyberpunk visuals and power-up mechanics.',
    badge: 'Coming Soon',
    icon: '🐍'
  },
  {
    id: 'pong',
    title: 'Neon Pong Battle',
    category: 'Multiplayer / AI',
    description: '2D paddle & ball action with glow particle effects and responsive AI.',
    badge: 'Coming Soon',
    icon: '🏓'
  },
  {
    id: 'space',
    title: 'Galactic Defender',
    category: 'Shooter',
    description: 'Shoot aliens and dodge space hazards in a retro space shooter.',
    badge: 'Coming Soon',
    icon: '🚀'
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Header Banner -->
    <header class="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-indigo-500/20 shadow-xl backdrop-blur-md transition-colors duration-300">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
          <Gamepad2 class="w-3.5 h-3.5" />
          <span>Arcade & Game Zone</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Arcade Games Hub
        </h1>
        <p class="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
          A collection of self-built web retro games. Play instantly in your browser with zero installation!
        </p>
      </div>

      <div class="flex items-center gap-3 bg-slate-100/90 dark:bg-slate-950/60 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs shadow-sm">
        <Trophy class="w-5 h-5 text-amber-500 dark:text-amber-400" />
        <div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wider">Tetris High Score</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{ tetrisHighScore }} Pts</div>
        </div>
      </div>
    </header>

    <!-- Featured Game Spotlight Section -->
    <section class="mb-12">
      <div class="flex items-center gap-2 mb-4">
        <Flame class="w-5 h-5 text-rose-500" />
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-200">Featured Game</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
        <!-- Live Tetris Preview Canvas -->
        <div class="lg:col-span-5 w-full">
          <TetrisPreview />
        </div>

        <!-- Details & Play Action -->
        <div class="lg:col-span-7 flex flex-col justify-center gap-4">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30 uppercase tracking-wider">
              {{ featuredGame.category }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 uppercase tracking-wider">
              {{ featuredGame.badge }}
            </span>
          </div>

          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ featuredGame.title }}
          </h3>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            {{ featuredGame.description }}
          </p>

          <div class="flex flex-wrap gap-2 py-1">
            <span v-for="tag in featuredGame.tags" :key="tag" 
                  class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
              #{{ tag }}
            </span>
          </div>

          <div class="pt-2">
            <RouterLink :to="featuredGame.link" 
                        class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider">
              <Play class="w-4 h-4 fill-white" />
              <span>Play Now</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Games Grid -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <Sparkles class="w-5 h-5 text-sky-500 dark:text-sky-400" />
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-200">Upcoming Games Catalog</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="game in upcomingGames" :key="game.id" 
             class="bg-white/60 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">{{ game.icon }}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                {{ game.badge }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ game.title }}</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ game.description }}</p>
          </div>

          <div class="pt-4 border-t border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
            <span>Category: {{ game.category }}</span>
            <span class="font-mono text-[10px] uppercase">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
