/* ===================================
   Crispy Chili — Scripts
   =================================== */

const isFinePointer = window.matchMedia('(pointer: fine)').matches;

// --- Scroll reveal (IntersectionObserver) ---
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .divider').forEach((el) => revealObserver.observe(el));

// --- Parallax on scroll (transform-only, GPU-accelerated) ---
const parallaxElements = document.querySelectorAll('.parallax');

function updateParallax() {
    parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.08;
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const translate = centerOffset * speed * -1;
        el.style.transform = `translateY(${translate}px)`;
    });
}

if (parallaxElements.length > 0) {
    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true }
    );
    updateParallax();
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- CTA buttons → Google Form ---
const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScuabYX6fTFysMUfQug5SLCpqkYBySEVWlxb8MC_k4jzc3A8A/viewform?usp=dialog';

document.querySelectorAll('[data-signup]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(FORM_URL, '_blank');
    });
});

// --- Cursor glow (follows mouse) ---
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow && isFinePointer) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
}

// --- Click flame particles ---
const flameEmojis = ['\uD83D\uDD25', '\u2728', '\uD83C\uDF36\uFE0F'];

document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, [data-signup]')) return;

    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'flame-particle';
        particle.textContent = flameEmojis[Math.floor(Math.random() * flameEmojis.length)];
        particle.style.left = (e.clientX + (Math.random() - 0.5) * 30) + 'px';
        particle.style.top = (e.clientY + (Math.random() - 0.5) * 20) + 'px';
        particle.style.fontSize = (14 + Math.random() * 10) + 'px';
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }
});

// =============================================
// --- Scroll progress bar ---
// =============================================
const scrollProgress = document.querySelector('.scroll-progress');

if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }, { passive: true });
}

// =============================================
// --- Floating embers ---
// =============================================
function spawnEmber() {
    const ember = document.createElement('div');
    ember.className = 'ember';

    const x = Math.random() * window.innerWidth;
    const size = 2 + Math.random() * 4;
    const duration = 6 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 120;

    ember.style.left = x + 'px';
    ember.style.bottom = '-10px';
    ember.style.width = size + 'px';
    ember.style.height = size + 'px';
    ember.style.setProperty('--drift', drift + 'px');
    ember.style.animationDuration = duration + 's';

    // Random warm color
    const hue = 10 + Math.random() * 25; // orange-red range
    ember.style.background = `hsl(${hue}, 90%, ${50 + Math.random() * 20}%)`;
    ember.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 90%, 50%)`;

    document.body.appendChild(ember);
    ember.addEventListener('animationend', () => ember.remove());
}

// Spawn embers at intervals
setInterval(spawnEmber, 800);
// Initial burst
for (let i = 0; i < 5; i++) setTimeout(spawnEmber, i * 150);

// =============================================
// --- Magnetic buttons ---
// =============================================
if (isFinePointer) {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
        const magnetRange = 80; // px radius of magnetic pull

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// =============================================
// --- Hero burn-in reveal ---
// =============================================
(function burnInInit() {
    const h1 = document.querySelector('[data-burn-in]');
    if (!h1) return;

    h1.style.position = 'relative';

    // Collect character segments preserving <br> and <span>
    const segments = [];
    h1.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const ch of node.textContent) segments.push({ type: 'text', value: ch, accent: false });
        } else if (node.tagName === 'BR') {
            segments.push({ type: 'br' });
        } else if (node.tagName === 'SPAN') {
            for (const ch of node.textContent) segments.push({ type: 'text', value: ch, accent: true });
        }
    });

    // Rebuild h1 with each char wrapped in a span, track lines for sweep
    h1.innerHTML = '';
    const charSpans = [];
    let lineIndex = 0;

    segments.forEach((seg) => {
        if (seg.type === 'br') {
            h1.appendChild(document.createElement('br'));
            lineIndex++;
        } else {
            const span = document.createElement('span');
            span.className = 'burn-char' + (seg.accent ? ' burn-accent' : '');
            span.textContent = seg.value;
            span.dataset.line = lineIndex;
            h1.appendChild(span);
            charSpans.push(span);
        }
    });

    const warmColors = ['#ff4500', '#ff6a2a', '#ff8040', '#ffaa30', '#ffcc00', '#fff0b0'];

    function randomColor() {
        return warmColors[Math.floor(Math.random() * warmColors.length)];
    }

    function spawnSparks(rect, isAccent) {
        const count = isAccent ? (6 + Math.floor(Math.random() * 4)) : (3 + Math.floor(Math.random() * 4));

        for (let s = 0; s < count; s++) {
            const spark = document.createElement('span');
            const isFlame = Math.random() > 0.35;
            spark.className = 'burn-spark ' + (isFlame ? 'burn-spark--flame' : 'burn-spark--ember');

            const color = randomColor();
            const size = isFlame ? (6 + Math.random() * 8) : (3 + Math.random() * 6);
            const dur = 1.0 + Math.random() * 1.2;

            spark.style.left = (rect.left + rect.width * Math.random()) + 'px';
            spark.style.top = (rect.top + rect.height * (0.1 + Math.random() * 0.4)) + 'px';
            spark.style.setProperty('--dx', ((Math.random() - 0.5) * 80) + 'px');
            spark.style.setProperty('--dy', (-35 - Math.random() * 80) + 'px');
            spark.style.setProperty('--rot', (Math.random() * 180 - 90) + 'deg');
            spark.style.setProperty('--size', size + 'px');
            spark.style.setProperty('--glow', (size * 2.5) + 'px');
            spark.style.setProperty('--spark-color', color);
            spark.style.setProperty('--spark-dur', dur + 's');

            document.body.appendChild(spark);
            spark.addEventListener('animationend', () => spark.remove());
        }
    }

    function spawnWisps(rect) {
        const count = 2 + Math.floor(Math.random() * 2);
        for (let w = 0; w < count; w++) {
            const wisp = document.createElement('div');
            wisp.className = 'heat-wisp';
            wisp.style.left = (rect.left + rect.width * Math.random()) + 'px';
            wisp.style.top = (rect.top - 5) + 'px';
            wisp.style.setProperty('--wisp-drift', ((Math.random() - 0.5) * 30) + 'px');
            wisp.style.setProperty('--wisp-dur', (1.5 + Math.random() * 1.5) + 's');
            document.body.appendChild(wisp);
            wisp.addEventListener('animationend', () => wisp.remove());
        }
    }

    // Track which lines have had their sweep fired
    const lineSweptAt = {};

    function fireLineSweep(span) {
        const line = span.dataset.line;
        if (lineSweptAt[line]) return;
        lineSweptAt[line] = true;

        // Gather all chars on this line to compute sweep width
        const lineChars = charSpans.filter(s => s.dataset.line === line);
        const firstRect = lineChars[0].getBoundingClientRect();
        const lastRect = lineChars[lineChars.length - 1].getBoundingClientRect();
        const h1Rect = h1.getBoundingClientRect();

        const sweep = document.createElement('div');
        sweep.className = 'flame-sweep';
        const lineWidth = lastRect.right - firstRect.left;
        sweep.style.setProperty('--sweep-start', '-60px');
        sweep.style.setProperty('--sweep-end', lineWidth + 'px');
        sweep.style.setProperty('--sweep-dur', (0.6 + lineWidth / 600) + 's');
        sweep.style.top = (firstRect.top - h1Rect.top) + 'px';
        sweep.style.height = firstRect.height + 'px';
        h1.appendChild(sweep);
        sweep.addEventListener('animationend', () => sweep.remove());
    }

    // Stagger the burn-in
    const startDelay = 600;
    const charDelay = 60;

    charSpans.forEach((span, i) => {
        const delay = startDelay + i * charDelay;
        const isAccent = span.classList.contains('burn-accent');

        setTimeout(() => {
            span.classList.add('burn-visible');
            fireLineSweep(span);

            const rect = span.getBoundingClientRect();

            // Don't spark on whitespace
            if (span.textContent.trim()) {
                spawnSparks(rect, isAccent);

                // Delayed secondary + tertiary spark bursts for accent chars
                if (isAccent) {
                    setTimeout(() => spawnSparks(rect, false), 100);
                    setTimeout(() => spawnSparks(rect, false), 250);
                }

                // Heat wisps from ~60% of characters
                if (Math.random() > 0.4) {
                    setTimeout(() => spawnWisps(rect), 150 + Math.random() * 200);
                }
                // Accent chars always get wisps
                if (isAccent) {
                    setTimeout(() => spawnWisps(rect), 50);
                    setTimeout(() => spawnWisps(rect), 300);
                }
            }
        }, delay);
    });
})();

// =============================================
// --- Pinned process slideshow (smooth eased scrolling) ---
// =============================================
(function processPinned() {
    const runway = document.querySelector('.process-runway');
    const sticky = document.querySelector('.process-sticky');
    const track = document.querySelector('.process-track');
    const progressFill = document.querySelector('.process-progress-fill');
    if (!runway || !sticky || !track) return;

    const slideCount = track.children.length;
    let currentX = 0;
    let targetX = 0;

    // Magnetic snap: strong dwell on each slide, fast snap between them
    function easeProgress(t) {
        const slide = t * (slideCount - 1);
        const current = Math.floor(Math.min(slide, slideCount - 2));
        const frac = slide - current;
        // Quintic ease — nearly flat for ~70% of each segment, then snaps quickly
        const eased = frac < 0.5
            ? 32 * Math.pow(frac, 6)
            : 1 - 32 * Math.pow(1 - frac, 6);
        return (current + eased) / (slideCount - 1);
    }

    function update() {
        const runwayRect = runway.getBoundingClientRect();
        const runwayHeight = runway.offsetHeight - window.innerHeight;
        const scrolled = -runwayRect.top;
        const rawProgress = Math.max(0, Math.min(1, scrolled / runwayHeight));

        if (rawProgress > 0.01) {
            sticky.classList.add('active');
        } else {
            sticky.classList.remove('active');
        }

        const easedProgress = easeProgress(rawProgress);
        targetX = easedProgress * (slideCount - 1) * -25;

        if (progressFill) {
            progressFill.style.width = (rawProgress * 100) + '%';
        }
    }

    // Lerp loop for buttery smooth interpolation
    function animate() {
        currentX += (targetX - currentX) * 0.08;
        // Stop jittering when close enough
        if (Math.abs(targetX - currentX) < 0.01) currentX = targetX;
        track.style.transform = `translateX(${currentX}%)`;
        requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', () => {
        update();
    }, { passive: true });

    update();
    animate();
})();

// =============================================
// --- Feature cards deal-in ---
// =============================================
const dealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('dealt');
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll('.deal-card').forEach((el) => dealObserver.observe(el));

// =============================================
// --- Pinned ingredients scroll ---
// =============================================
(function ingredientsPinned() {
    const runway = document.querySelector('.ingredients-runway');
    const sticky = document.querySelector('.ingredients-sticky');
    if (!runway || !sticky) return;

    const items = document.querySelectorAll('.ingredient-item');
    const totalItems = items.length;

    function update() {
        const runwayRect = runway.getBoundingClientRect();
        const runwayHeight = runway.offsetHeight - window.innerHeight;

        // progress: 0 at top, 1 at bottom of runway
        const scrolled = -runwayRect.top;
        const progress = Math.max(0, Math.min(1, scrolled / runwayHeight));

        // Activate sticky at progress > 0
        if (progress > 0.02) {
            sticky.classList.add('active');
        } else {
            sticky.classList.remove('active');
        }

        // Reveal ingredients one by one (spread across 15%-80% of scroll)
        items.forEach((item, i) => {
            const threshold = 0.15 + (i / totalItems) * 0.55;
            if (progress >= threshold) {
                item.classList.add('visible');
            } else {
                item.classList.remove('visible');
            }
        });

        // Outro text at ~85%
        if (progress >= 0.82) {
            sticky.classList.add('outro-visible');
        } else {
            sticky.classList.remove('outro-visible');
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    update();
})();

// =============================================
// --- Easter egg: Konami-style chili code ---
// --- Sequence: up up down down left right left right
// =============================================
(function easterEgg() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    let index = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                triggerChiliRain();
                index = 0;
            }
        } else {
            index = 0;
        }
    });

    function triggerChiliRain() {
        const emojis = ['\uD83C\uDF36\uFE0F', '\uD83D\uDD25', '\uD83C\uDF36\uFE0F', '\u2728', '\uD83C\uDF36\uFE0F'];
        const count = 40;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const chili = document.createElement('span');
                chili.className = 'chili-rain';
                chili.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                chili.style.left = Math.random() * window.innerWidth + 'px';
                chili.style.top = '-40px';
                chili.style.fontSize = (20 + Math.random() * 20) + 'px';
                chili.style.animationDuration = (2 + Math.random() * 2) + 's';
                document.body.appendChild(chili);
                chili.addEventListener('animationend', () => chili.remove());
            }, i * 60);
        }
    }
})();
