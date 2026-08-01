<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { 
  Camera, 
  ArrowUpRight, 
  Code, 
  ShieldCheck, 
  Network, 
  Cpu, 
  Terminal, 
  ExternalLink, 
  Layers,
  Wrench,
  Sparkles,
  BookOpen,
  Gamepad2,
  Play
} from '@lucide/vue'
import projectsData from '../data/projects.json'
import TetrisPreview from '../components/TetrisPreview.vue'

// Only show the Laboratory Management System project on the home page
const featuredProject = computed(() => {
  return projectsData.find(p => p.id === 'lab-management') || projectsData[0]
})

const imageError = ref(false)

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'Web Application':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
    case 'Utility Tools':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20'
  }
}
</script>

<template>
  <div class="space-y-20 sm:space-y-28 py-4">
    
    <!-- ================================================================= -->
    <!-- SECTION 1: HERO HEADER (50% WEIGHT: WEB DEVELOPER FOCUS)          -->
    <!-- ================================================================= -->
    <section class="min-h-[50vh] flex flex-col justify-center space-y-6 relative overflow-hidden animate-reveal">
      <div class="space-y-4 max-w-4xl">
        <p class="text-base sm:text-lg font-serif italic text-sky-600 dark:text-sky-400 font-light tracking-wide flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-sky-500 inline" />
          <span>Helping build a better future</span>
        </p>
        
        <div class="space-y-2">
          <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.05]">
            Filza Buana Putra
          </h1>
          <p class="text-xs sm:text-sm font-mono text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <span>Web Developer</span>
            <span>&bull;</span>
            <span class="text-emerald-600 dark:text-emerald-400">Laboratory Technician (PLP)</span>
          </p>
        </div>

        <p class="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl pt-2">
          I specialize in building full-stack web applications with <strong class="font-medium text-slate-900 dark:text-slate-100">Laravel</strong> and <strong class="font-medium text-slate-900 dark:text-slate-100">Vue.js</strong>, while actively expanding into <strong class="font-medium text-slate-900 dark:text-slate-100">Next.js</strong> and <strong class="font-medium text-slate-900 dark:text-slate-100">React</strong> ecosystem. My primary focus is turning complex workflows into intuitive web tools — from digitalizing laboratory operations to crafting custom utilities that solve real-world everyday problems.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <RouterLink to="/projects"
                    class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-medium text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg cursor-pointer">
          <Code class="w-4 h-4 text-sky-400 dark:text-sky-600" />
          <span>Explore Projects</span>
        </RouterLink>

        <a href="https://github.com/filzabuana" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-mono transition-all">
          <Terminal class="w-4 h-4 text-sky-500" />
          <span>GitHub Profile</span>
          <ArrowUpRight class="w-3.5 h-3.5 opacity-60" />
        </a>

        <!-- Currently Learning Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
          <span>Currently Exploring: <strong>Next.js</strong></span>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 2: WEB DEVELOPMENT & TECH STACK (50% WEB DEV FOCUS)        -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-1">
      <div class="border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Code class="w-5 h-5 text-sky-500" />
          <span>Web Development Architecture & Skills</span>
        </h2>
      </div>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl">
        I engineer robust backends and reactive user interfaces using modern web technologies, maintaining high standards for code readability, performance, and user experience.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 space-y-3 hover:border-sky-500/40 transition-all duration-300">
          <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold text-xs font-mono">
            <Layers class="w-4 h-4" />
            <span>Full-Stack Web Stack</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Laravel, Vue 3, Inertia.js, Vite, Livewire, MySQL, and actively learning <strong class="text-sky-600 dark:text-sky-400 font-semibold">Next.js</strong>.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 space-y-3 hover:border-sky-500/40 transition-all duration-300">
          <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs font-mono">
            <Wrench class="w-4 h-4" />
            <span>Web Tools & Utilities</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Building client-side PDF processors, canvas-based UI tools, and custom real-time chat modules.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 space-y-3 hover:border-sky-500/40 transition-all duration-300">
          <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs font-mono">
            <Cpu class="w-4 h-4" />
            <span>Modern UI & UX Design</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Tailwind CSS styling, responsive design, dark mode preference handling, and micro-interactions.
          </p>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 3: FEATURED PROJECT (LAB MANAGEMENT SYSTEM ONLY)          -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-2">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Terminal class="w-5 h-5 text-sky-500" />
            <span>Featured Project</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">Laboratory management platform created to streamline operations.</p>
        </div>
        <RouterLink to="/projects" class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
          <span>View All 7 Projects</span>
          <ArrowUpRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <!-- Single Featured Lab Card -->
      <div 
        v-if="featuredProject"
        class="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-md dark:shadow-slate-950/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-sky-500/40 transition-all duration-300 group"
      >
        <!-- Project Screenshot -->
        <div class="lg:col-span-6 relative bg-slate-950 h-64 lg:h-auto overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/80">
          <img v-if="featuredProject.image && !imageError" 
               :src="featuredProject.image" 
               @error="imageError = true" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               :alt="featuredProject.title" />
          <div v-else class="text-sky-400/50 flex flex-col items-center">
            <Terminal class="w-10 h-10 mb-2" />
            <span class="font-mono text-xs">Laboratory Management System</span>
          </div>
        </div>

        <!-- Project Info -->
        <div class="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase" :class="getCategoryColor(featuredProject.category)">
                {{ featuredProject.category }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Featured Flagship
              </span>
            </div>

            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {{ featuredProject.title }}
            </h3>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {{ featuredProject.description }}
            </p>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="tag in featuredProject.tags" 
                :key="tag"
                class="px-2.5 py-1 rounded-lg bg-sky-500/10 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-mono text-[10px] border border-sky-500/20"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
            <a :href="featuredProject.demo" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20">
              <ExternalLink class="w-4 h-4" />
              <span>Visit Live Website (resiskom.filzabuana.id/lab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 4: LABORATORY TECHNICIAN (PLP) (20% WEIGHT)               -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-2">
      <div class="border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-emerald-500" />
          <span>Laboratory Technician Role (PLP)</span>
        </h2>
      </div>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl">
        As a Laboratory Technician (PLP) at FMIPA Universitas Tanjungpura, I manage daily lab operations, maintain hardware resources, enforce laboratory safety standards, and provide technical guidance for computer laboratory activities.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 space-y-2">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono">
            <ShieldCheck class="w-4 h-4" />
            <span>OHS / K3 Laboratory Protocols</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Enforcing occupational health and safety standards, equipment safety audits, and risk assessment in computing lab environments.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 space-y-2">
          <div class="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs font-mono">
            <Network class="w-4 h-4" />
            <span>Lab Infrastructure & Networking</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Managing LAN networks, device maintenance, local server deployment, and bi-weekly hardware inspections.
          </p>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 5: MATHEMATICS & WRITING (20% WEIGHT)                    -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-3">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-sky-500" />
          <span>Mathematics & Writing</span>
        </h2>
        <a href="https://matematika.filzabuana.id" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
          <span>Visit Mathematics Blog (matematika.filzabuana.id)</span>
          <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-7 space-y-3">
          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Beyond web engineering, I have a deep passion for mathematics. I regularly write notes and articles exploring mathematical theories, numerical methods, and differential equations.
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-light">
            Topics covered on my blog include ordinary differential equations (ODE), numerical simulation algorithms (Runge-Kutta), linear algebra, and complex analysis.
          </p>
        </div>

        <div class="lg:col-span-5">
          <div class="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2 shadow-sm dark:shadow-slate-950/40">
            <div class="text-[10px] text-sky-600 dark:text-sky-400 font-bold">// Euler's Identity & Complex Analysis</div>
            <div>e^{i\pi} + 1 = 0</div>
            <div class="border-t border-slate-200/80 dark:border-slate-800/60 pt-2">f(a) = \frac{1}{2\pi i} \oint_C \frac{f(z)}{z-a} dz</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION: ARCADE & WEB GAMES (RETRO TETRIS SHOWCASE)                -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-3">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Gamepad2 class="w-5 h-5 text-indigo-500" />
            <span>Web Games & Retro Arcade</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">Interactive game collection built with HTML5 Canvas & Web Audio.</p>
        </div>
        <RouterLink to="/games"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <span>View All Games</span>
          <ArrowUpRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-indigo-500/20 bg-white/80 dark:bg-slate-900/90 shadow-xl backdrop-blur-md transition-colors duration-300">
        <!-- Live Automated Tetris Preview Canvas -->
        <div class="lg:col-span-5 w-full">
          <TetrisPreview />
        </div>

        <!-- Section Info & Direct Play Button -->
        <div class="lg:col-span-7 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <span>Featured &bull; JS Tetris Retro</span>
          </div>

          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Play Retro Tetris Directly in Browser
          </h3>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Engineered with pure HTML5 Canvas, Tailwind CSS, and an 8-bit DMG-01 GameBoy audio synth engine. Complete with responsive keyboard and touch controls.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-4">
            <RouterLink to="/games/tetris"
                        class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
              <Play class="w-4 h-4 fill-white" />
              <span>Play Tetris</span>
            </RouterLink>

            <RouterLink to="/games"
                        class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all shadow-sm">
              <span>Open Arcade Catalog</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 6: ASTROPHOTOGRAPHY (10% WEIGHT)                          -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-3">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Camera class="w-5 h-5 text-emerald-500" />
          <span>Night Sky & Photography</span>
        </h2>
        <a href="https://photography.filzabuana.id" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          <span>Visit Photo Gallery (photography.filzabuana.id)</span>
          <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-7 space-y-2">
          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            When away from code, I enjoy capturing night skies, celestial objects, and landscape astrophotography. 🌌🔭
          </p>
        </div>

        <div class="lg:col-span-5">
          <div class="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 shadow-sm dark:shadow-slate-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            <Camera class="w-4 h-4 mr-2" /> Fujifilm X-T30 Astrophotography
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 7: THIS SITE'S TECH STACK (LOGOS & NAMES)                 -->
    <!-- ================================================================= -->
    <section class="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 animate-reveal reveal-delay-3">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
        <span class="text-[11px] font-semibold tracking-wider uppercase">Built with</span>
        <div class="flex flex-wrap items-center gap-5 sm:gap-6">
          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <svg class="w-4 h-4" viewBox="0 0 128 128"><path fill="#42b883" d="M78.8 10.4L64 36 49.2 10.4H0l64 110.8L128 10.4z"/><path fill="#35495e" d="M78.8 10.4L64 36 49.2 10.4H25.6L64 76.8l38.4-66.4z"/></svg>
            <span>Vue.js</span>
          </div>

          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <svg class="w-4 h-4" viewBox="0 0 256 257"><path fill="url(#vite-a)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.744-4.802 1.34-10.63 6.745-9.634l120.5 22.203a7.48 7.48 0 002.723 0l117.565-22.203c5.405-.996 9.489 4.832 6.745 9.614z"/><defs><linearGradient id="vite-a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient></defs></svg>
            <span>Vite</span>
          </div>

          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path fill="#06B6D4" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>
            <span>Tailwind CSS</span>
          </div>

          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <svg class="w-4 h-4 rounded-sm" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M12.982 17.294c.553.86 1.246 1.488 2.316 1.488 1.006 0 1.657-.502 1.657-1.229 0-.848-.671-1.16-1.796-1.644l-.626-.268c-1.808-.77-3.003-1.73-3.003-3.729 0-1.954 1.508-3.447 3.896-3.447 1.696 0 2.923.592 3.738 2.01l-1.697 1.083c-.435-.77-.915-1.083-1.93-1.083-.815 0-1.396.39-1.396.993 0 .737.525 1.005 1.697 1.508l.625.268c2.144.915 3.149 1.842 3.149 3.863 0 2.255-1.73 3.652-4.242 3.652-2.39 0-3.807-1.127-4.522-2.484l1.93-1.185zm-7.662.838c.368.647.781 1.116 1.54 1.116.793 0 1.307-.312 1.307-1.542v-8.81h2.512v8.866c0 2.58-1.496 3.707-3.708 3.707-1.954 0-3.093-.972-3.629-2.256l1.978-1.081z" fill="#000"/></svg>
            <span>JavaScript</span>
          </div>

          <div class="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
            <Sparkles class="w-4 h-4 text-sky-500 animate-pulse" />
            <span>Antigravity</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
