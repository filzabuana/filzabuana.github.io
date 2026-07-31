import './assets/css/main.css';
import { createIcons, ServerOff, PowerOff, Globe } from 'lucide';

// Initialize theme on load for fallback page
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

if (isDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Initialize Lucide Icons locally
createIcons({
  icons: {
    ServerOff,
    PowerOff,
    Globe,
    serverOff: ServerOff,
    powerOff: PowerOff,
    globe: Globe,
    'server-off': ServerOff,
    'power-off': PowerOff,
    'globe': Globe
  }
});

// Set Dynamic Year
const currentYear = new Date().getFullYear();
document.querySelectorAll('.year-field').forEach(el => el.textContent = currentYear);

// Interactive Canvas Network + Wandering Slow Fireflies
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let fireflies = [];
  let time = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
    initFireflies();
  });
  resizeCanvas();

  // Node Utama Network
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.baseRadius = Math.random() * 0.9 + 0.7;
      this.pulseOffset = Math.random() * Math.PI * 2;
      
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const colors = isCurrentlyDark
        ? [
            { r: 16, g: 185, b: 129 },  // Emerald 500
            { r: 20, g: 184, b: 166 },  // Teal 500
            { r: 52, g: 211, b: 153 }   // Emerald 400
          ]
        : [
            { r: 5, g: 150, b: 105 },   // Emerald 600
            { r: 13, g: 148, b: 136 },  // Teal 600
            { r: 16, g: 185, b: 129 }   // Emerald 500
          ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;
    }

    draw(extraLightAlpha = 0) {
      const radius = this.baseRadius + Math.sin(time * 0.04 + this.pulseOffset) * 0.25;
      const alpha = Math.min(1, 0.6 + Math.sin(time * 0.03 + this.pulseOffset) * 0.25 + extraLightAlpha * 0.5);

      // Core Node
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius + extraLightAlpha * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
      ctx.fill();
    }
  }

  // Slow & Micro-Core Firefly
  class Firefly {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.2 + 0.15;
      this.angularSpeed = (Math.random() - 0.5) * 0.015;
      this.lightRadius = Math.random() * 30 + 90;
      this.pulseOffset = Math.random() * Math.PI * 2;
      
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const lightColors = isCurrentlyDark
        ? [
            { r: 52, g: 211, b: 153 }, // Bright Emerald
            { r: 45, g: 212, b: 191 }, // Teal
            { r: 110, g: 231, b: 183 } // Light Green
          ]
        : [
            { r: 5, g: 150, b: 105 },  // Emerald 600
            { r: 13, g: 148, b: 136 }, // Teal 600
            { r: 16, g: 185, b: 129 }  // Emerald 500
          ];
      this.color = lightColors[Math.floor(Math.random() * lightColors.length)];
    }

    update() {
      this.angle += this.angularSpeed + Math.sin(time * 0.008 + this.pulseOffset) * 0.008;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }

    draw() {
      const pulse = Math.sin(time * 0.02 + this.pulseOffset);
      const currentLightRadius = this.lightRadius + pulse * 10;
      const glowOpacity = 0.22 + pulse * 0.06;

      const radGrad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, currentLightRadius
      );
      radGrad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${glowOpacity})`);
      radGrad.addColorStop(0.45, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${glowOpacity * 0.3})`);
      radGrad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, currentLightRadius, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.fill();

      // Firefly Micro Core (~1.1px)
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.9)`;
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset Shadow Context
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 5500), 180);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function initFireflies() {
    fireflies = [];
    const count = Math.min(Math.max(Math.floor((width * height) / 250000), 4), 6);
    for (let i = 0; i < count; i++) {
      fireflies.push(new Firefly());
    }
  }

  initParticles();
  initFireflies();

  function animateParticles() {
    time++;
    ctx.clearRect(0, 0, width, height);

    fireflies.forEach(f => f.update());

    const maxDist = 135;

    // Draw Edges
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          
          let extraEdgeGlow = 0;
          fireflies.forEach(f => {
            const fDist = Math.hypot(f.x - midX, f.y - midY);
            if (fDist < f.lightRadius) {
              extraEdgeGlow += (1 - fDist / f.lightRadius) * 0.4;
            }
          });

          const edgeAlpha = Math.min(0.85, (1 - dist / maxDist) * 0.3 + extraEdgeGlow);
          
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y, 
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${edgeAlpha})`);
          gradient.addColorStop(1, `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${edgeAlpha})`);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = (1 - dist / maxDist) * 0.85 + extraEdgeGlow * 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw Nodes
    particles.forEach(p => {
      let extraNodeGlow = 0;
      fireflies.forEach(f => {
        const fDist = Math.hypot(f.x - p.x, f.y - p.y);
        if (fDist < f.lightRadius) {
          extraNodeGlow += (1 - fDist / f.lightRadius);
        }
      });

      p.update();
      p.draw(extraNodeGlow);
    });

    fireflies.forEach(f => f.draw());

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}
