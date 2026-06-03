 
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursorTrail');
    let mx = 0, my = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx - 6 + 'px';
      cursor.style.top  = my - 6 + 'px';
    });

    function animTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx - 16 + 'px';
      trail.style.top  = ty - 16 + 'px';
      requestAnimationFrame(animTrail);
    }
    animTrail();

    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });

    // PARTICLE CANVAS 
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.5 + 0.3;
        this.a  = Math.random() * 0.6 + 0.1;
        this.color = Math.random() > 0.7 ? '#ff006e' : '#00f5ff';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00f5ff';
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();

    // SCROLL REVEAL
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate skill bars
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
