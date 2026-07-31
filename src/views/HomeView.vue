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
  BookOpen
} from '@lucide/vue'
import projectsData from '../data/projects.json'

// Only show the Laboratory Management System project on the home page
const featuredProject = computed(() => {
  return projectsData.find(p => p.id === 'lab-management') || projectsData[0]
})

const imageError = ref(false)

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'Web Application':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    case 'Utility Tools':
      return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
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
        <p class="text-base sm:text-lg font-serif italic text-emerald-600 dark:text-emerald-400 font-light tracking-wide flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-emerald-500 inline" />
          <span>Building functional, elegant & automated web applications</span>
        </p>
        
        <div class="space-y-2">
          <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Filza Buana Putra
          </h1>
          <p class="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <span>Web Developer</span>
            <span>&bull;</span>
            <span>Laboratory Technician (PLP)</span>
          </p>
        </div>

        <p class="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl pt-2">
          I specialize in building full-stack web applications with <strong class="font-medium text-slate-900 dark:text-white">Laravel</strong> and <strong class="font-medium text-slate-900 dark:text-white">Vue.js</strong>, while actively expanding into <strong class="font-medium text-slate-900 dark:text-white">Next.js</strong> and <strong class="font-medium text-slate-900 dark:text-white">React</strong> ecosystem. My primary focus is turning complex workflows into intuitive web tools — from digitalizing laboratory operations to crafting custom utilities that solve real-world everyday problems.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <RouterLink to="/projects"
                    class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-medium text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg cursor-pointer">
          <Code class="w-4 h-4" />
          <span>Explore Projects</span>
        </RouterLink>

        <a href="https://github.com/filzabuana" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10 text-xs font-mono transition-all">
          <Terminal class="w-4 h-4 text-emerald-500" />
          <span>GitHub Profile</span>
          <ArrowUpRight class="w-3.5 h-3.5 opacity-60" />
        </a>

        <!-- Currently Learning Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Currently Exploring: <strong>Next.js</strong></span>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 2: WEB DEVELOPMENT & TECH STACK (50% WEB DEV FOCUS)        -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-1">
      <div class="border-b border-slate-200 dark:border-white/10 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Code class="w-5 h-5 text-emerald-500" />
          <span>Web Development Architecture & Skills</span>
        </h2>
      </div>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl">
        I engineer robust backends and reactive user interfaces using modern web technologies, maintaining high standards for code readability, performance, and user experience.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] space-y-3 hover:border-emerald-500/30 transition-colors">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono">
            <Layers class="w-4 h-4" />
            <span>Full-Stack Web Stack</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Laravel, Vue 3, Inertia.js, Vite, Livewire, MySQL, and actively learning <strong class="text-emerald-600 dark:text-emerald-400 font-semibold">Next.js</strong>.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] space-y-3 hover:border-emerald-500/30 transition-colors">
          <div class="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs font-mono">
            <Wrench class="w-4 h-4" />
            <span>Web Tools & Utilities</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Building client-side PDF processors, canvas-based UI tools, and custom real-time chat modules.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] space-y-3 hover:border-emerald-500/30 transition-colors">
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
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal class="w-5 h-5 text-emerald-500" />
            <span>Featured Project</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">Laboratory management platform created to streamline operations.</p>
        </div>
        <RouterLink to="/projects" class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          <span>View All 6 Projects</span>
          <ArrowUpRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <!-- Single Featured Lab Card -->
      <div 
        v-if="featuredProject"
        class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-emerald-500/30 transition-all duration-300 group"
      >
        <!-- Project Screenshot -->
        <div class="lg:col-span-6 relative bg-slate-900 h-64 lg:h-auto overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5">
          <img v-if="featuredProject.image && !imageError" 
               :src="featuredProject.image" 
               @error="imageError = true" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               :alt="featuredProject.title" />
          <div v-else class="text-emerald-400/50 flex flex-col items-center">
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
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Featured Flagship
              </span>
            </div>

            <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ featuredProject.title }}
            </h3>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {{ featuredProject.description }}
            </p>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="tag in featuredProject.tags" 
                :key="tag"
                class="px-2.5 py-1 rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/10"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4 border-t border-slate-200 dark:border-white/5 pt-4">
            <a :href="featuredProject.demo" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-500 transition-colors">
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
      <div class="border-b border-slate-200 dark:border-white/10 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-emerald-500" />
          <span>Laboratory Technician Role (PLP)</span>
        </h2>
      </div>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-3xl">
        As a Laboratory Technician (PLP) at FMIPA Universitas Tanjungpura, I manage daily lab operations, maintain hardware resources, enforce laboratory safety standards, and provide technical guidance for computer laboratory activities.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] space-y-2">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono">
            <ShieldCheck class="w-4 h-4" />
            <span>OHS / K3 Laboratory Protocols</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Enforcing occupational health and safety standards, equipment safety audits, and risk assessment in computing lab environments.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] space-y-2">
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
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-emerald-500" />
          <span>Mathematics & Writing</span>
        </h2>
        <a href="https://matematika.filzabuana.id" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
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
          <div class="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">// Euler's Identity & Complex Analysis</div>
            <div>e^{i\pi} + 1 = 0</div>
            <div class="border-t border-slate-200 dark:border-white/5 pt-2">f(a) = \frac{1}{2\pi i} \oint_C \frac{f(z)}{z-a} dz</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- SECTION 6: ASTROPHOTOGRAPHY (10% WEIGHT)                          -->
    <!-- ================================================================= -->
    <section class="space-y-6 animate-reveal reveal-delay-3 pb-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
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
          <div class="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            <Camera class="w-4 h-4 mr-2" /> Fujifilm X-T30 Astrophotography
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
