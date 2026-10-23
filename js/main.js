/**
 * Helevate.fit - Main Interactive Script
 * Powered by GSAP, ScrollTrigger & Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const isMobileScreen = window.innerWidth < 768;

        // Hero Main Card Reveal (on initial page load)
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
            .from('.hero-nav', { opacity: 0, y: -20, duration: 0.7, clearProps: 'transform' })
            .from('.hero-left-col', { opacity: 0, x: isMobileScreen ? 0 : -30, duration: 0.7 }, '-=0.4')
            .from('.hero-center-area', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
            .from('.hero-bottom-nested-card', { opacity: 0, y: 20, duration: 0.65, ease: 'power2.out', clearProps: 'all' }, '-=0.3');

        // Reusable helper for scroll-reveal: smoothly reveals content once as it enters the viewport and keeps it visible
        const createScrollReveal = (selector, fromVars = {}, toVars = {}, triggerOptions = {}) => {
            const elements = gsap.utils.toArray(selector);
            elements.forEach((el) => {
                gsap.fromTo(el, 
                    { opacity: 0, y: 35, ...fromVars },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        ease: 'power2.out',
                        clearProps: 'transform',
                        ...toVars,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                            once: true,
                            ...triggerOptions
                        }
                    }
                );
            });
        };

        // 1. Hero Stat Cards (4 Cards - reveal every time on any device view)
        createScrollReveal('.hero-stats-row .hero-stat-card', 
            { opacity: 0, y: 38 }, 
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            { start: 'top 90%' }
        );

        // 2. Community Section (#community)
        const communitySection = document.getElementById('community');
        if (communitySection) {
            // Card container
            createScrollReveal('.community-section-card', 
                { opacity: 0, y: 35 }, 
                { opacity: 1, y: 0, duration: 0.8 },
                { start: 'top 85%' }
            );

            // Left content items
            createScrollReveal('.community-left-content > *',
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.65 },
                { start: 'top 85%' }
            );

            // Gym image container
            createScrollReveal('.gym-image-container',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8 },
                { start: 'top 85%' }
            );

            // 3 Floating Glass Pins popping in
            createScrollReveal('.gym-floating-pin',
                { opacity: 0, scale: 0.6, y: 18 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' },
                { start: 'top 85%' }
            );
        }

        // 3. Section Headers (Pills, Headings, Subtitles)
        createScrollReveal('.section-header',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        // 4. Services Section (#services) - Cards animate individually on any device view
        createScrollReveal('#services .stagger-item',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        // 5. How It Works Section (#how-it-works)
        createScrollReveal('#how-it-works .stagger-item',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        createScrollReveal('.guided-sessions-card',
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.8 },
            { start: 'top 88%' }
        );

        createScrollReveal('.dark-ribbon-cta',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 90%' }
        );

        // 6. Precision Health Section (#testing)
        createScrollReveal('.precision-header-block',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        createScrollReveal('.precision-hero-desc',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7 },
            { start: 'top 88%' }
        );

        createScrollReveal('.precision-list-cards .precision-list-card',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65 },
            { start: 'top 90%' }
        );

        createScrollReveal('.health-report-card',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
            { start: 'top 85%' }
        );

        // 7. Programmes / Plans Section (#plans)
        createScrollReveal('#plans .col-lg-4',
            { opacity: 0, y: 45 },
            { opacity: 1, y: 0, duration: 0.8 },
            { start: 'top 88%' }
        );

        createScrollReveal('.plans-bottom-footnote',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            { start: 'top 92%' }
        );

        // 8. Team Section (#team)
        createScrollReveal('.founder-tall-card',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85 },
            { start: 'top 85%' }
        );

        createScrollReveal('.coach-portrait-card',
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        // 9. Client Stories Section (#stories)
        createScrollReveal('.stories-header',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        createScrollReveal('.stories-track .story-card',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        // 10. FAQ Section (#faq)
        createScrollReveal('.faq-header-sticky',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75 },
            { start: 'top 88%' }
        );

        createScrollReveal('.custom-faq-item',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6 },
            { start: 'top 92%' }
        );

        // 11. Final CTA Banner & Footer (#contact)
        createScrollReveal('.final-cta-banner',
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            { start: 'top 85%' }
        );

        createScrollReveal('.final-cta-content > *',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.65 },
            { start: 'top 85%' }
        );

        createScrollReveal('.giant-footer-title',
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.8 },
            { start: 'top 90%' }
        );

        createScrollReveal('.footer-cols-row > div',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6 },
            { start: 'top 92%' }
        );

        // Responsive resize and orientation triggers
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => ScrollTrigger.refresh(), 200);
        });

        // Refresh triggers once all images and fonts load
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    // 2. Schedule Widget Toggle (4 Days vs 3 Days)
    const scheduleBtn4 = document.getElementById('sched-btn-4');
    const scheduleBtn3 = document.getElementById('sched-btn-3');
    const scheduleCaption = document.getElementById('sched-caption');

    const capsules = {
        mon: document.getElementById('capsule-mon'),
        tue: document.getElementById('capsule-tue'),
        wed: document.getElementById('capsule-wed'),
        thu: document.getElementById('capsule-thu'),
        fri: document.getElementById('capsule-fri'),
        sat: document.getElementById('capsule-sat'),
        sun: document.getElementById('capsule-sun')
    };

    const scheduleData = {
        '4': {
            caption: '4 coached sessions a week, in your clubhouse',
            classes: {
                mon: 'day-capsule coached',
                tue: 'day-capsule coached',
                wed: 'day-capsule guided',
                thu: 'day-capsule coached',
                fri: 'day-capsule coached',
                sat: 'day-capsule guided guided-dot',
                sun: 'day-capsule rest'
            }
        },
        '3': {
            caption: '3 coached sessions a week, in your clubhouse (Mon, Wed, Fri)',
            classes: {
                mon: 'day-capsule coached',
                tue: 'day-capsule rest',
                wed: 'day-capsule coached',
                thu: 'day-capsule rest',
                fri: 'day-capsule coached',
                sat: 'day-capsule guided guided-dot',
                sun: 'day-capsule rest'
            }
        }
    };

    function updateSchedule(days) {
        if (!scheduleCaption) return;
        const config = scheduleData[days];
        scheduleCaption.textContent = config.caption;

        for (const [day, el] of Object.entries(capsules)) {
            if (el && config.classes[day]) {
                el.className = config.classes[day];
            }
        }
    }

    if (scheduleBtn4 && scheduleBtn3) {
        scheduleBtn4.addEventListener('click', () => {
            scheduleBtn4.classList.add('active');
            scheduleBtn3.classList.remove('active');
            updateSchedule('4');
        });

        scheduleBtn3.addEventListener('click', () => {
            scheduleBtn3.classList.add('active');
            scheduleBtn4.classList.remove('active');
            updateSchedule('3');
        });
    }

    // 3. Client Stories Slider Carousel
    const storiesTrack = document.getElementById('stories-track');
    const storiesContainer = document.querySelector('.stories-slider-container');
    const prevBtn = document.getElementById('story-prev');
    const nextBtn = document.getElementById('story-next');
    const dashes = document.querySelectorAll('.story-dash');

    if (storiesTrack && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = storiesTrack.querySelectorAll('.story-card');

        function updateSlider() {
            const isScrollable = window.innerWidth < 992;
            if (isScrollable && cards[0] && storiesContainer) {
                const cardWidth = cards[0].offsetWidth + 16;
                storiesContainer.scrollTo({
                    left: currentIndex * cardWidth,
                    behavior: 'smooth'
                });
            }

            dashes.forEach((dash, idx) => {
                dash.classList.toggle('active', idx === currentIndex);
            });

            prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
            nextBtn.style.opacity = currentIndex >= (dashes.length - 1) ? '0.4' : '1';
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < dashes.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        dashes.forEach((dash, idx) => {
            dash.addEventListener('click', () => {
                currentIndex = idx;
                updateSlider();
            });
        });

        if (storiesContainer) {
            storiesContainer.addEventListener('scroll', () => {
                if (window.innerWidth < 992 && cards[0]) {
                    const cardWidth = cards[0].offsetWidth + 16;
                    const newIdx = Math.round(storiesContainer.scrollLeft / cardWidth);
                    if (newIdx !== currentIndex && newIdx < dashes.length) {
                        currentIndex = newIdx;
                        dashes.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
                        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
                        nextBtn.style.opacity = currentIndex >= (dashes.length - 1) ? '0.4' : '1';
                    }
                }
            });
        }

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    // 4. Interactive Accordion (FAQ Page 9)
    const faqItems = document.querySelectorAll('.custom-faq-item');
    faqItems.forEach((item) => {
        const header = item.querySelector('.custom-faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach((other) => {
                other.classList.remove('active');
                const content = other.querySelector('.custom-faq-body');
                if (content) content.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.custom-faq-body');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const firstContent = faqItems[0].querySelector('.custom-faq-body');
        if (firstContent) {
            firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
        }
    }

    // 5. Video Modal Mock Trigger
    const playButtons = document.querySelectorAll('.play-video-trigger');
    const videoModalEl = document.getElementById('videoModal');
    if (videoModalEl && typeof bootstrap !== 'undefined') {
        const videoModal = new bootstrap.Modal(videoModalEl);
        const videoModalTitle = document.getElementById('videoModalLabel');
        const videoModalDesc = document.getElementById('videoModalDesc');

        playButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const clientName = btn.getAttribute('data-name') || 'Client Story';
                const clientStory = btn.getAttribute('data-story') || '';
                if (videoModalTitle) videoModalTitle.textContent = `${clientName}'s Transformation Story`;
                if (videoModalDesc) videoModalDesc.textContent = clientStory;
                videoModal.show();
            });
        });
    }

    // 6. Consultation Booking Form Handling
    const consultationForm = document.getElementById('consultationForm');
    const formFeedback = document.getElementById('formFeedback');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = consultationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Confirming...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (formFeedback) {
                    formFeedback.classList.remove('d-none');
                    formFeedback.innerHTML = `
                        <div class="alert alert-success d-flex align-items-center mb-0" role="alert">
                            <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                            <div>
                                <strong>Request Received!</strong> Coach Harish and our team will get in touch with you shortly to schedule your clubhouse assessment.
                            </div>
                        </div>
                    `;
                }
                consultationForm.reset();
            }, 1200);
        });
    }

    // 7. Mobile Navigation Drawer Controller
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const mobileDrawerConsultBtn = document.getElementById('mobileDrawerConsultBtn');

    function openMobileDrawer() {
        if (!mobileNavDrawer || !mobileNavBackdrop) return;
        mobileNavDrawer.classList.add('active');
        mobileNavBackdrop.classList.add('active');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (!mobileNavDrawer || !mobileNavBackdrop) return;
        mobileNavDrawer.classList.remove('active');
        mobileNavBackdrop.classList.remove('active');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileDrawer();
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileDrawer);
    }

    if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener('click', closeMobileDrawer);
    }

    mobileNavItems.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileDrawer();
        });
    });

    if (mobileDrawerConsultBtn) {
        mobileDrawerConsultBtn.addEventListener('click', () => {
            closeMobileDrawer();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('active')) {
            closeMobileDrawer();
        }
    });

    // 8. Sticky Header Navigation on Scroll with Glassy Blur Effect
    const mainHeaderNav = document.getElementById('mainHeaderNav');
    const heroNavLinks = document.querySelectorAll('.hero-nav-links a');
    const navSections = [
        document.getElementById('home') || document.querySelector('.hero-section'),
        document.getElementById('community'),
        document.getElementById('services'),
        document.getElementById('how-it-works'),
        document.getElementById('plans'),
        document.getElementById('team'),
        document.getElementById('stories'),
        document.getElementById('faq'),
        document.getElementById('contact')
    ].filter(Boolean);

    function updateStickyNav() {
        if (!mainHeaderNav) return;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

        // Sticky & Glassy effect applied ONLY when scrolling away from top (scrollY > 30px)
        // When at the very top (scrollY <= 30px), stays transparent and seamlessly embedded in hero
        if (scrollY > 30) {
            mainHeaderNav.classList.add('is-scrolled');
        } else {
            mainHeaderNav.classList.remove('is-scrolled');
        }

        // Active section indicator in navigation
        const scrollThreshold = scrollY + 140;
        let activeSectionId = '';
        for (let i = navSections.length - 1; i >= 0; i--) {
            const sec = navSections[i];
            if (sec && sec.offsetTop <= scrollThreshold) {
                activeSectionId = sec.getAttribute('id');
                break;
            }
        }

        heroNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (activeSectionId && href === `#${activeSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateStickyNav, { passive: true });
    updateStickyNav();
});

