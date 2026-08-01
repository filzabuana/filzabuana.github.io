<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import Lenis from 'lenis'
import { 
  Home as HomeIcon, 
  Briefcase, 
  BookOpen, 
  Camera, 
  Menu, 
  X, 
  ExternalLink,
  Terminal,
  Sun,
  Moon,
  Gamepad2
} from '@lucide/vue'

const isMobileMenuOpen = ref(false)
const isDarkMode = ref(true)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Particle background logic for the main app
onMounted(() => {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Theme check on load
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'light') {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  } else if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    // Default to system
    isDarkMode.value = systemPrefersDark
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // React to OS theme changes if user hasn't pinned theme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  })

  const canvas = document.getElementById('app-bg-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width, height
  let particles = []
  let time = 0

  function resizeCanvas() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }

  window.addEventListener('resize', () => {
    resizeCanvas()
    initParticles()
  })
  resizeCanvas()

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 0.15
      this.vy = (Math.random() - 0.5) * 0.15
      this.baseRadius = Math.random() * 0.8 + 0.5
      this.pulseOffset = Math.random() * Math.PI * 2
    }

    update() {
      this.x += this.vx
      this.y += this.vy

      if (this.x < -10) this.x = width + 10
      if (this.x > width + 10) this.x = -10
      if (this.y < -10) this.y = height + 10
      if (this.y > height + 10) this.y = -10
    }

    draw() {
      const radius = this.baseRadius + Math.sin(time * 0.03 + this.pulseOffset) * 0.15
      const alpha = 0.25 + Math.sin(time * 0.02 + this.pulseOffset) * 0.15

      // Adapt colors based on primary Sky/Blue theme
      const color = isDarkMode.value 
        ? { r: 14, g: 165, b: 233 }  // Sky 500
        : { r: 37, g: 99, b: 235 }   // Blue 600

      ctx.beginPath()
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
      ctx.fill()
    }
  }

  function initParticles() {
    particles = []
    const count = Math.min(Math.floor((width * height) / 8000), 100)
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }
  }

  initParticles()

  function animate() {
    time++
    ctx.clearRect(0, 0, width, height)

    // Draw network connections (using Sky/Blue theme)
    const maxDist = 110
    const lineColor = isDarkMode.value
      ? 'rgba(14, 165, 233, '
      : 'rgba(37, 99, 235, '

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `${lineColor}${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    particles.forEach(p => {
      p.update()
      p.draw()
    })

    requestAnimationFrame(animate)
  }

  animate()
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-300">
    
    <!-- Background elements -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Color Blobs -->
      <div class="absolute -top-[10%] left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl transition-colors duration-500"
           :class="isDarkMode ? 'bg-sky-600/10' : 'bg-sky-500/5'"></div>
      <div class="absolute top-1/2 right-[5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full blur-3xl transition-colors duration-500"
           :class="isDarkMode ? 'bg-emerald-700/5' : 'bg-emerald-600/5'"></div>
      
      <!-- Interactive canvas -->
      <canvas id="app-bg-canvas" class="absolute inset-0 w-full h-full opacity-60"></canvas>
    </div>

    <!-- Glassmorphism Header -->
    <header class="sticky top-0 z-40 w-full glass-card border-b backdrop-blur-md">
      <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal class="w-4 h-4 text-white" />
          </div>
          <span class="font-mono text-sm tracking-wider font-bold group-hover:opacity-80 transition-opacity duration-300"
                :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">
            filzabuana.id
          </span>
        </RouterLink>

        <!-- Desktop Navigation & Mode Toggle -->
        <div class="hidden md:flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <RouterLink to="/" class="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300"
                        :class="$route.path === '/' 
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 border border-transparent'">
              <HomeIcon class="w-3.5 h-3.5" />
              <span>Home</span>
            </RouterLink>

            <RouterLink to="/projects" class="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300"
                        :class="$route.path === '/projects' 
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 border border-transparent'">
              <Briefcase class="w-3.5 h-3.5" />
              <span>Projects</span>
            </RouterLink>

            <RouterLink to="/games" class="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300"
                        :class="$route.path.startsWith('/games') 
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 border border-transparent'">
              <Gamepad2 class="w-3.5 h-3.5 text-indigo-500" />
              <span>Games</span>
            </RouterLink>

            <a href="https://matematika.filzabuana.id" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-1.5 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 rounded-xl border border-transparent text-xs font-medium transition-all duration-300">
              <BookOpen class="w-3.5 h-3.5 text-sky-500" />
              <span>Math Blog</span>
              <ExternalLink class="w-3 h-3 opacity-60" />
            </a>

            <a href="https://photography.filzabuana.id" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-1.5 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 rounded-xl border border-transparent text-xs font-medium transition-all duration-300">
              <Camera class="w-3.5 h-3.5 text-emerald-500" />
              <span>Photography</span>
              <ExternalLink class="w-3 h-3 opacity-60" />
            </a>
          </div>

          <!-- Vertical Divider -->
          <div class="h-4 w-px bg-slate-300 dark:bg-slate-800"></div>

          <!-- Theme Toggle Button -->
          <button @click="toggleTheme" 
                  class="p-2 rounded-xl border border-transparent hover:bg-slate-500/5 transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                  title="Toggle Theme">
            <Sun v-if="isDarkMode" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-blue-600" />
          </button>
        </div>

        <!-- Mobile Navbar Actions -->
        <div class="flex items-center space-x-1 md:hidden">
          <button @click="toggleTheme" 
                  class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-500/5 focus:outline-none"
                  title="Toggle Theme">
            <Sun v-if="isDarkMode" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-blue-600" />
          </button>
          
          <button @click="toggleMobileMenu" class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-500/5 transition-colors focus:outline-none">
            <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>

      </nav>

      <!-- Mobile Menu Dropdown -->
      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden border-t border-white/5 bg-slate-100/95 dark:bg-slate-950/90 backdrop-blur-lg px-4 py-3 space-y-1">
          <RouterLink to="/" @click="isMobileMenuOpen = false" 
                      class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      :class="$route.path === '/' 
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5'">
            <HomeIcon class="w-4 h-4" />
            <span>Home</span>
          </RouterLink>

          <RouterLink to="/projects" @click="isMobileMenuOpen = false"
                      class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      :class="$route.path === '/projects' 
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5'">
            <Briefcase class="w-4 h-4" />
            <span>Projects</span>
          </RouterLink>

          <RouterLink to="/games" @click="isMobileMenuOpen = false"
                      class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      :class="$route.path.startsWith('/games')
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5'">
            <Gamepad2 class="w-4 h-4 text-indigo-500" />
            <span>Games</span>
          </RouterLink>

          <a href="https://matematika.filzabuana.id" target="_blank" rel="noopener noreferrer"
             class="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 text-sm font-medium transition-colors">
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-sky-500" />
              <span>Math Blog</span>
            </div>
            <ExternalLink class="w-3.5 h-3.5 opacity-60" />
          </a>

          <a href="https://photography.filzabuana.id" target="_blank" rel="noopener noreferrer"
             class="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5 text-sm font-medium transition-colors">
            <div class="flex items-center gap-2">
              <Camera class="w-4 h-4 text-emerald-500" />
              <span>Photography</span>
            </div>
            <ExternalLink class="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </transition>
    </header>

    <!-- Main Content Area -->
    <main class="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 w-full border-t border-slate-300/40 dark:border-white/5 bg-slate-200/20 dark:bg-slate-950/30 py-6 font-mono text-[11px] text-slate-500 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span>&copy; {{ new Date().getFullYear() }} Filza Buana Putra.</span>
          <span class="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] font-semibold">v0.1.1</span>
        </div>
        <div class="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <span>FMIPA Universitas Tanjungpura</span>
          <span>•</span>
          <span>Programming & Computation Laboratory</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<style>
/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
