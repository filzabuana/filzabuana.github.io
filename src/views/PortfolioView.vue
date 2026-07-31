<script setup>
import { ref, computed } from 'vue'
import projectsData from '../data/projects.json'
import { 
  ExternalLink, 
  Terminal,
  Filter,
  ArrowUpRight
} from '@lucide/vue'

const projects = ref(projectsData)
const selectedCategory = ref('All')
const imageErrors = ref({})

// Extract unique categories in English
const categories = computed(() => {
  const cats = ['All']
  projects.value.forEach(p => {
    if (!cats.includes(p.category)) {
      cats.push(p.category)
    }
  })
  return cats
})

// Filter projects based on selection
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'All') {
    return projects.value
  }
  return projects.value.filter(p => p.category === selectedCategory.value)
})

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
  <div class="space-y-8 py-2">
    
    <!-- Title & Intro -->
    <div class="space-y-4 animate-reveal">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Projects & Applications
      </h1>
      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-light">
        A collection of web applications, academic management systems, design preview utilities, and daily productivity tools built with Laravel, Vue 3, and modern web technologies.
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-5 animate-reveal reveal-delay-1">
      <div class="flex items-center gap-2 mr-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
        <Filter class="w-3.5 h-3.5" />
        <span>Category:</span>
      </div>
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectedCategory = cat"
        class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 border focus:outline-none cursor-pointer"
        :class="selectedCategory === cat 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm font-semibold' 
          : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-500/5'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div 
        v-for="(project, index) in filteredProjects" 
        :key="project.id"
        class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-md dark:hover:shadow-emerald-950/20 transition-all duration-300 group animate-reveal"
        :style="{ 'animation-delay': `${index * 100 + 150}ms` }"
      >
        <!-- Project Screenshot Header -->
        <div class="relative w-full h-48 bg-slate-900 border-b border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center">
          <img v-if="project.image && !imageErrors[project.id]" 
               :src="project.image" 
               @error="imageErrors[project.id] = true"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               :alt="project.title" />
          <div v-else 
               class="w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex flex-col items-center justify-center text-emerald-400 p-4">
            <Terminal class="w-8 h-8 mb-2" />
            <span class="font-mono text-xs font-semibold text-center">{{ project.title }}</span>
          </div>
        </div>

        <!-- Project Details Body -->
        <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
          <div class="space-y-4">
            <!-- Category -->
            <div class="flex justify-between items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase" :class="getCategoryColor(project.category)">
                {{ project.category }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ project.title }}
            </h3>

            <!-- Description -->
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {{ project.description }}
            </p>

            <!-- Tech stack pills -->
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tag in project.tags" 
                :key="tag"
                class="px-2 py-0.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono text-[9px] border border-emerald-500/10 dark:border-emerald-500/10"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Links Footer -->
          <div class="flex items-center gap-4 border-t border-slate-200 dark:border-white/5 pt-4 mt-6">
            <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub Repository</span>
            </a>

            <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline transition-colors ml-auto">
              <span>Visit Demo Link</span>
              <ArrowUpRight class="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
