/**
 * Interacciones y animaciones de amor para Angie ❤️
 * - Canvas de corazones y estrellas flotantes
 * - Efecto de máquina de escribir y desvanecimiento elegante
 * - Efecto 3D tilt y brillo de tarjeta al mover el mouse
 * - Generador de corazones interactivos en clics y toques
 * - Cajita de música romántica ambiental con Web Audio API
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Efecto de Escritura Dinámica para el Título
  initTypewriter();

  // 2. Sistema de Partículas (Corazones y Estrellas en Canvas)
  initBackgroundCanvas();

  // 3. Efecto 3D Tilt y Reflejo al pasar el mouse por la tarjeta
  initCardTilt();

  // 4. Corazones flotantes interactivos en clics y toques
  initClickHeartBurst();

  // 5. Botón de Abrazo & Explosión de Corazones
  initLoveBurstButton();

  // 6. Cajita de música romántica (Web Audio API)
  initRomanticMusic();
});

/* ==========================================================================
   1. Efecto de Máquina de Escribir y Desvanecimiento
   ========================================================================== */
function initTypewriter() {
  const titleEl = document.getElementById('typewriterTitle');
  if (!titleEl) return;

  const fullText = titleEl.getAttribute('data-text') || 'Te amo mucho mi amorcita Angie';
  titleEl.textContent = '';

  // Añadir cursor parpadeante
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  titleEl.parentNode.insertBefore(cursor, titleEl.nextSibling);

  let charIndex = 0;
  const speed = 75; // Milisegundos por letra

  // Pequeño retardo inicial antes de comenzar a escribir
  setTimeout(() => {
    function typeChar() {
      if (charIndex < fullText.length) {
        titleEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        // Al terminar, desvanecer sutilmente el cursor después de unos segundos
        setTimeout(() => {
          cursor.style.transition = 'opacity 1s ease';
          cursor.style.opacity = '0';
          setTimeout(() => cursor.remove(), 1000);
        }, 3500);
      }
    }
    typeChar();
  }, 400);
}

/* ==========================================================================
   2. Canvas de Corazones y Estrellas Flotantes de Fondo
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('starsAndHeartsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = window.innerWidth < 600 ? 35 : 65;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 0.7 + 0.35;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.type = Math.random() > 0.4 ? 'heart' : 'star'; // 60% corazones, 40% estrellas
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.rotation = Math.random() * 0.4 - 0.2;
    }

    update() {
      this.y -= this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * 0.5 + this.speedX;

      if (this.y < -40 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);

      if (this.type === 'heart') {
        ctx.rotate(Math.sin(this.swayAngle) * 0.2);
        this.drawHeart(ctx, this.size);
      } else {
        this.drawStar(ctx, this.size * 0.5);
      }

      ctx.restore();
    }

    drawHeart(c, size) {
      c.fillStyle = '#ff60a8';
      c.shadowColor = '#ff2a85';
      c.shadowBlur = 8;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
    }

    drawStar(c, r) {
      c.fillStyle = '#ffffff';
      c.shadowColor = '#ffa3d2';
      c.shadowBlur = 6;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * r, -Math.sin(((18 + i * 90) * Math.PI) / 180) * r);
        c.lineTo(Math.cos(((54 + i * 90) * Math.PI) / 180) * (r * 0.3), -Math.sin(((54 + i * 90) * Math.PI) / 180) * (r * 0.3));
      }
      c.closePath();
      c.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Efecto 3D Tilt y Brillo Interactivo en la Tarjeta
   ========================================================================== */
function initCardTilt() {
  const card = document.getElementById('romanticCard');
  if (!card) return;

  // Solo aplicar tilt dinámico en dispositivos con puntero fino (mouse)
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // Ángulo suave en X
    const rotateY = ((x - centerX) / centerX) * 7;  // Ángulo suave en Y

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   4. Generador de Corazones en Clics y Toques
   ========================================================================== */
function initClickHeartBurst() {
  const container = document.getElementById('heartBurstContainer');
  if (!container) return;

  const heartIcons = ['💖', '💕', '💗', '✨', '💓', '💝', '🌸'];

  function spawnHeartsAt(clientX, clientY, count = 5) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'click-heart';
      heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

      const dx = (Math.random() - 0.5) * 120 + 'px';
      const rot = (Math.random() - 0.5) * 60 + 'deg';
      const size = Math.random() * 0.7 + 0.9;

      heart.style.left = `${clientX}px`;
      heart.style.top = `${clientY}px`;
      heart.style.setProperty('--dx', dx);
      heart.style.setProperty('--rot', rot);
      heart.style.fontSize = `${size}rem`;

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1600);
    }
  }

  // Escuchar toques o clics en cualquier parte de la pantalla
  document.addEventListener('click', (e) => {
    // Si fue en un botón, dejemos que el botón maneje su propio burst
    if (e.target.closest('#loveBurstBtn')) return;
    spawnHeartsAt(e.clientX, e.clientY, 4);
  });
}

/* ==========================================================================
   5. Botón de Abrazo & Cascada de Corazones
   ========================================================================== */
function initLoveBurstButton() {
  const btn = document.getElementById('loveBurstBtn');
  const container = document.getElementById('heartBurstContainer');
  if (!btn || !container) return;

  const sweetMessages = [
    '¡Un abrazo apretadito para ti!',
    '¡Te mando mil besitos!',
    '¡Eres lo más bonito de mi vida!',
    '¡Siempre juntos, mi amor!',
    '¡Gracias por existir, Angie!'
  ];
  let messageIndex = 0;

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Cambiar texto temporalmente con mensaje tierno
    const btnText = btn.querySelector('.btn-text');
    const originalText = 'Enviarte un abrazo';
    btnText.textContent = sweetMessages[messageIndex % sweetMessages.length];
    messageIndex++;

    setTimeout(() => {
      btnText.textContent = originalText;
    }, 2200);

    // Efecto de explosión de corazones en abanico
    const heartSymbols = ['💖', '💕', '🥰', '✨', '💗', '❤️', '🌸'];
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'click-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

        const dx = (Math.random() - 0.5) * 260 + 'px';
        const rot = (Math.random() - 0.5) * 80 + 'deg';
        const size = Math.random() * 0.9 + 1;

        heart.style.left = `${centerX}px`;
        heart.style.top = `${centerY}px`;
        heart.style.setProperty('--dx', dx);
        heart.style.setProperty('--rot', rot);
        heart.style.fontSize = `${size}rem`;

        container.appendChild(heart);

        setTimeout(() => heart.remove(), 1600);
      }, i * 35);
    }
  });
}

/* ==========================================================================
   6. Cajita de Música Romántica (Web Audio API)
   Genera una dulce melodía de campanitas y acordes románticos sin archivos externos
   ========================================================================== */
function initRomanticMusic() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let noteIndex = 0;
  let melodyTimer = null;

  // Notas en frecuencias Hz (Melodía dulce y etérea estilo cajita de cristal: Do Mayor / Sol / La menor / Fa)
  // C4, E4, G4, B4, C5, D5, E5, G5
  const melodyNotes = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    987.77, // B5
    1046.50, // C6
    783.99, // G5
    659.25, // E5
    523.25, // C5

    440.00, // A4
    523.25, // C5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    659.25, // E5
    523.25, // C5
    440.00, // A4

    349.23, // F4
    440.00, // A4
    523.25, // C5
    659.25, // E5
    698.46, // F5
    523.25, // C5
    440.00, // A4
    392.00, // G4

    392.00, // G4
    493.88, // B4
    587.33, // D5
    783.99, // G5
    880.00, // A5
    783.99, // G5
    587.33, // D5
    493.88  // B4
  ];

  function playMusicBoxNote(freq, time) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Timbre cristalino con onda senoidal
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Envolvente de sonido de cajita de música: ataque percusivo y caída suave
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.4);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 1.5);
  }

  function startMusicLoop() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    audioBtn.classList.add('playing');
    audioBtn.querySelector('.music-text').textContent = 'Música sonando ❤️';

    function tick() {
      if (!isPlaying) return;
      const freq = melodyNotes[noteIndex % melodyNotes.length];
      playMusicBoxNote(freq, audioCtx.currentTime);

      // Cada 4 notas, tocar una nota armónica grave suave de acompañamiento
      if (noteIndex % 4 === 0) {
        playMusicBoxNote(freq / 2, audioCtx.currentTime);
      }

      noteIndex++;
      melodyTimer = setTimeout(tick, 380); // Tempo suave
    }

    tick();
  }

  function stopMusicLoop() {
    isPlaying = false;
    audioBtn.classList.remove('playing');
    audioBtn.querySelector('.music-text').textContent = 'Música de amor';
    if (melodyTimer) clearTimeout(melodyTimer);
  }

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusicLoop();
    } else {
      startMusicLoop();
    }
  });
}
