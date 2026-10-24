/**
 * Helevate.fit - Scroll Reveal Animation Layer
 * Additive enhancement on top of the reveal system in main.js.
 * Works on every screen size (mobile, tablet, desktop).
 *
 * - Each element reveals only once it is actually on screen.
 * - When an element drops back below the viewport (scrolling up),
 *   it resets, so the reveal plays again on the next scroll down.
 */
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    // ------------------------------------------------------------------
    // 1. Pick a reveal style for each kind of element
    // ------------------------------------------------------------------
    const variants = {
        'sa-pop': [
            '.section-header > .d-flex',
            '.section-header > .section-pill',
            '.plans-pill-badge',
            '.team-pill-badge',
            '.gym-floating-pin'
        ],
        'sa-blur-up': [
            '.section-header > h2',
            '.precision-header-block > *',
            '.stories-header-left',
            '.faq-header-sticky > *',
            '.final-cta-content > *'
        ],
        'sa-rise': [
            '#services .stagger-item',
            '#plans .col-lg-4',
            '.coach-portrait-card',
            '.stories-track .story-card',
            '.custom-faq-item',
            '.hero-stats-row .hero-stat-card',
            '.footer-cols-row > div',
            '.plans-bottom-footnote'
        ],
        'sa-left': [
            '#how-it-works .stagger-item',
            '.precision-list-cards .precision-list-card',
            '.community-left-content > *'
        ],
        'sa-right': [
            '.health-report-card',
            '.stories-nav-arrows'
        ],
        'sa-zoom': [
            '.founder-tall-card',
            '.dark-ribbon-cta',
            '.guided-sessions-card',
            '.gym-image-container'
        ],
        'sa-clip': [
            '.giant-footer-title'
        ]
    };

    Object.entries(variants).forEach(([variant, selectors]) => {
        selectors.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el) => {
                if (el.classList.contains('reveal-item') && !el.dataset.saVariant) {
                    el.classList.add(variant);
                    el.dataset.saVariant = variant;
                }
            });
        });
    });

    // Anything else in the reveal system gets a simple fade-up
    const items = Array.from(document.querySelectorAll('.reveal-item'));
    items.forEach((el) => {
        if (!el.dataset.saVariant) {
            el.classList.add('sa-fade');
            el.dataset.saVariant = 'sa-fade';
        }
        el.classList.add('sa-armed');
    });

    // ------------------------------------------------------------------
    // 2. Reveal when on screen, reset when it drops below the viewport
    // ------------------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('sa-in');
            } else if (entry.boundingClientRect.top > 0) {
                // Element is below the viewport again (user scrolled up) → replay later
                el.classList.remove('sa-in');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
    });

    // Wait two frames so items already on screen animate in on page load
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            items.forEach((el) => revealObserver.observe(el));
            checkPositions();
        });
    });

    // Backup position check on scroll: reveals items at the very bottom of the
    // page (which can never reach the observer's trigger line) and reliably
    // resets items that have dropped below the screen so they replay.
    let checkQueued = false;
    function checkPositions() {
        checkQueued = false;
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const atPageBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
        items.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return; // hidden (display: none)
            const onScreenX = r.left < vw && r.right > 0;
            if (r.top > vh) {
                el.classList.remove('sa-in');
            } else if (onScreenX && r.bottom > 0 && (r.top < vh * 0.9 || atPageBottom)) {
                el.classList.add('sa-in');
            }
        });
    }
    const queueCheck = () => {
        if (!checkQueued) {
            checkQueued = true;
            requestAnimationFrame(checkPositions);
        }
    };
    window.addEventListener('scroll', queueCheck, { passive: true });
    window.addEventListener('resize', queueCheck);

    // ------------------------------------------------------------------
    // 3. Scroll progress bar
    // ------------------------------------------------------------------
    const progressBar = document.createElement('div');
    progressBar.className = 'sa-scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    let ticking = false;
    const updateProgress = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        progressBar.style.setProperty('--sa-progress', progress.toFixed(4));
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    // ------------------------------------------------------------------
    // 4. Scroll-scrubbed effect (GSAP ScrollTrigger)
    // ------------------------------------------------------------------
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Clubhouse photo "unveils" from an inset frame as it scrolls into view (desktop only)
    const gymImg = document.querySelector('.gym-main-img');
    if (gymImg && window.innerWidth >= 992) {
        gsap.fromTo(gymImg,
            { clipPath: 'inset(10% 8% 10% 8% round 26px)' },
            {
                clipPath: 'inset(0% 0% 0% 0% round 26px)',
                ease: 'none',
                scrollTrigger: {
                    trigger: gymImg,
                    start: 'top 95%',
                    end: 'top 45%',
                    scrub: 0.6
                }
            }
        );
    }

    // Recalculate trigger positions once fonts/images have loaded
    window.addEventListener('load', () => ScrollTrigger.refresh());
});
