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
// --- 3D tilt on hover ---
// =============================================
if (isFinePointer) {
    // Hero image tilt
    document.querySelectorAll('.tilt-3d').forEach((el) => {
        const img = el.querySelector('img');
        if (!img) return;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale(1.03)`;
            img.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseleave', () => {
            img.style.transform = 'rotateY(0) rotateX(0) scale(1)';
            img.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // Feature card tilt
    document.querySelectorAll('.feature-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
            card.style.transition = 'transform 0.1s ease-out, background 0.4s, border-color 0.4s';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, border-color 0.4s';
        });
    });
}

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
// --- Hero text scramble on load ---
// =============================================
(function scrambleInit() {
    const h1 = document.querySelector('[data-scramble]');
    if (!h1) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&*';

    // Parse the h1 into text nodes and elements, preserving <br> and <span>
    const original = h1.innerHTML;
    const textParts = []; // { node, text, index }

    function collectTextNodes(parent) {
        parent.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                textParts.push({ node, text: node.textContent });
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
                collectTextNodes(node);
            }
        });
    }

    collectTextNodes(h1);

    // Scramble each text node
    const totalChars = textParts.reduce((sum, p) => sum + p.text.length, 0);
    let resolved = 0;

    textParts.forEach((part) => {
        const finalText = part.text;
        let current = finalText.split('').map(() => chars[Math.floor(Math.random() * chars.length)]);
        part.node.textContent = current.join('');

        const perCharDelay = 40;
        const startDelay = 600; // after fadeUp starts

        finalText.split('').forEach((char, i) => {
            const delay = startDelay + i * perCharDelay + Math.random() * 80;

            // Intermediate scrambles
            const scrambleCount = 3 + Math.floor(Math.random() * 3);
            for (let s = 0; s < scrambleCount; s++) {
                setTimeout(() => {
                    current[i] = chars[Math.floor(Math.random() * chars.length)];
                    part.node.textContent = current.join('');
                }, delay - (scrambleCount - s) * 50);
            }

            // Final resolve
            setTimeout(() => {
                current[i] = char;
                part.node.textContent = current.join('');
                resolved++;
            }, delay);
        });
    });
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
