<script setup>
import { RouterLink } from 'vue-router'
import { Gamepad2, Play, Sparkles, Trophy, Flame } from '@lucide/vue'
import TetrisPreview from '../components/TetrisPreview.vue'

const featuredGame = {
  id: 'tetris',
  title: 'JS Tetris Retro',
  category: 'Classic Arcade',
  description: 'Game Tetris klasik dengan 8-bit DMG-01 GameBoy audio engine, level progresif, CRT scanlines, dan kontrol sentuh/keyboard.',
  link: '/games/tetris',
  badge: 'Populer',
  tags: ['Javascript', 'HTML5 Canvas', 'Web Audio Synth']
}

const upcomingGames = [
  {
    id: 'snake',
    title: 'Retro Snake 2D',
    category: 'Arcade',
    description: 'Game ular klasik dengan visual neon cyber-punk dan efek power-up.',
    badge: 'Segera Hadir',
    icon: '🐍'
  },
  {
    id: 'pong',
    title: 'Neon Pong Battle',
    category: 'Multiplayer / AI',
    description: 'Aksi bola & raket 2D dengan efek partikel glow dan AI bot tangguh.',
    badge: 'Segera Hadir',
    icon: '🏓'
  },
  {
    id: 'space',
    title: 'Galactic Defender',
    category: 'Shooter',
    description: 'Tembak alien dan hindari asteroid dalam game space shooter retro.',
    badge: 'Segera Hadir',
    icon: '🚀'
  }
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Header Banner -->
    <header class="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-slate-900/30 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-md">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Gamepad2 class="w-3.5 h-3.5" />
          <span>Arcade & Game Zone</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Game Arcade Hub
        </h1>
        <p class="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
          Koleksi game retro berbasis web buatan sendiri. Mainkan langsung di browser tanpa install!
        </p>
      </div>

      <div class="flex items-center gap-3 bg-slate-950/60 px-5 py-3 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs">
        <Trophy class="w-5 h-5 text-amber-400" />
        <div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wider">High Score Tetris</div>
          <div class="text-sm font-bold text-white">{{ featuredGame ? (localStorage.getItem('tetris_high_score') || 0) : 0 }} Pts</div>
        </div>
      </div>
    </header>

    <!-- Featured Game Spotlight Section -->
    <section class="mb-12">
      <div class="flex items-center gap-2 mb-4">
        <Flame class="w-5 h-5 text-rose-500" />
        <h2 class="text-lg font-bold text-slate-200">Game Unggulan</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
        <!-- Live Tetris Preview Canvas -->
        <div class="lg:col-span-5 w-full">
          <TetrisPreview />
        </div>

        <!-- Details & Play Action -->
        <div class="lg:col-span-7 flex flex-col justify-center gap-4">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              {{ featuredGame.category }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              {{ featuredGame.badge }}
            </span>
          </div>

          <h3 class="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-indigo-400 transition-colors">
            {{ featuredGame.title }}
          </h3>

          <p class="text-sm text-slate-300 leading-relaxed">
            {{ featuredGame.description }}
          </p>

          <div class="flex flex-wrap gap-2 py-1">
            <span v-for="tag in featuredGame.tags" :key="tag" 
                  class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-400 border border-slate-700/50">
              #{{ tag }}
            </span>
          </div>

          <div class="pt-2">
            <RouterLink :to="featuredGame.link" 
                        class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider">
              <Play class="w-4 h-4 fill-white" />
              <span>Mainkan Sekarang</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Games Grid -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <Sparkles class="w-5 h-5 text-sky-400" />
        <h2 class="text-lg font-bold text-slate-200">Katalog Game Mendatang</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="game in upcomingGames" :key="game.id" 
             class="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between opacity-80 hover:opacity-100 hover:border-slate-700 transition-all duration-300">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">{{ game.icon }}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/50">
                {{ game.badge }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-white mb-2">{{ game.title }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">{{ game.description }}</p>
          </div>

          <div class="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Kategori: {{ game.category }}</span>
            <span class="font-mono text-[10px] uppercase">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
