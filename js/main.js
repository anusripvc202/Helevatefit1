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
            .from('.hero-center-area', { opacity: 0, y: isMobileScreen ? 0 : 30, duration: 0.7, clearProps: 'all' }, '-=0.4')
            .from('.hero-bottom-nested-card', { opacity: 0, y: 20, duration: 0.65, ease: 'power2.out', clearProps: 'all' }, '-=0.3');
    }

    // 2. Progressive Smooth Scroll Reveal System (Hardware-Accelerated with IntersectionObserver)
    const initSmoothScrollReveal = () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!('IntersectionObserver' in window) || prefersReducedMotion) {
                return;
            }

            // Target elements to reveal progressively without hiding section container backgrounds
            const revealSelectors = [
                // 1. Hero stat cards
                '.hero-stats-row .hero-stat-card',
                // 2. Community Section inner content & interactive elements
                '.community-left-content > *',
                '.gym-image-container',
                '.gym-floating-pin',
                // 3. Section Headers (pills, titles, subtitles across all sections)
                '.section-header > *',
                // 4. Services cards
                '#services .stagger-item',
                // 5. How It Works step cards & ribbons
                '#how-it-works .stagger-item',
                '.guided-sessions-card',
                '.dark-ribbon-cta',
                // 6. Precision Health Report
                '.precision-header-block > *',
                '.precision-list-cards .precision-list-card',
                '.health-report-card',
                // 7. Plans cards & footnotes
                '#plans .col-lg-4',
                '.plans-bottom-footnote',
                // 8. Team
                '.founder-tall-card',
                '.coach-portrait-card',
                // 9. Client Stories
                '.stories-header > *',
                '.stories-track .story-card',
                // 10. FAQ
                '.faq-header-sticky > *',
                '.custom-faq-item',
                // 11. Final CTA banner content & site footer
                '.final-cta-content > *',
                '.footer-tagline-row',
                '.giant-footer-title',
                '.footer-cols-row > div',
                '.footer-copyright-row'
            ];

            const allElements = [];
            revealSelectors.forEach((sel) => {
                document.querySelectorAll(sel).forEach((el) => {
                    if (!allElements.includes(el)) {
                        allElements.push(el);
                    }
                });
            });

            // Assign micro-stagger classes based on sibling index in parent row/grid
            allElements.forEach((el) => {
                el.classList.add('reveal-item');
                const siblings = Array.from(el.parentElement?.children || []).filter((c) => allElements.includes(c));
                const index = siblings.indexOf(el);
                if (index > 0 && index <= 5) {
                    el.classList.add(`delay-${index}`);
                }
            });

            // Check elements already visible in or above viewport on initial load
            const windowHeight = window.innerHeight;
            const toObserve = [];

            allElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < windowHeight * 0.92) {
                    el.classList.add('is-revealed');
                } else {
                    toObserve.push(el);
                }
            });

            // IntersectionObserver for elements entering viewport on scroll down (triggers 80px before entering for zero empty gaps)
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        target.classList.add('is-revealed');
                        obs.unobserve(target);

                        // If element is part of a horizontal carousel (team coaches or client stories), reveal all carousel cards
                        const carouselParent = target.closest('.stories-track, .coach-cards-row');
                        if (carouselParent) {
                            carouselParent.querySelectorAll('.story-card, .coach-portrait-card').forEach((card) => {
                                card.classList.add('is-revealed');
                                obs.unobserve(card);
                            });
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px 80px 0px',
                threshold: 0.02
            });

            toObserve.forEach((el) => observer.observe(el));
        };

        initSmoothScrollReveal();

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
            caption: '4 coached sessions in your clubhouse',
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
            caption: '3 coached sessions in your clubhouse (Mon, Wed, Fri)',
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

    // 9. WhatsApp Consultation Form Integration (Verified Phone: +91 9963960259)
    const consultationForm = document.getElementById('consultationForm');
    const formFeedback = document.getElementById('formFeedback');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('consultName');
            const phoneInput = document.getElementById('consultPhone');
            const communityInput = document.getElementById('consultCommunity');
            const goalSelect = document.getElementById('consultGoal');
            const scheduleInput = document.querySelector('input[name="schedulePref"]:checked');
            const messageInput = document.getElementById('consultMessage');

            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const community = communityInput ? communityInput.value.trim() : '';
            const goal = goalSelect ? goalSelect.value : 'General Strength & Health';
            const schedule = scheduleInput ? scheduleInput.value : '4 days a week';
            const message = messageInput ? messageInput.value.trim() : '';

            // Validation
            let isValid = true;
            if (!name) {
                if (nameInput) nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                if (nameInput) nameInput.classList.remove('is-invalid');
            }

            const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
            if (!cleanPhone || cleanPhone.length < 10) {
                if (phoneInput) phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                if (phoneInput) phoneInput.classList.remove('is-invalid');
            }

            if (!community) {
                if (communityInput) communityInput.classList.add('is-invalid');
                isValid = false;
            } else {
                if (communityInput) communityInput.classList.remove('is-invalid');
            }

            if (!isValid) {
                if (formFeedback) {
                    formFeedback.className = 'alert alert-danger py-2 px-3 small';
                    formFeedback.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Please fill in all required fields (Name, valid 10-digit Phone, Community).';
                    formFeedback.classList.remove('d-none');
                }
                return;
            }

            // Client Confirmed WhatsApp Number: 9963960259 (India country code +91)
            const waNumber = '919963960259';

            // Construct structured pre-filled enquiry message
            let waText = `*Helevate.fit — Consultation Enquiry*\n\n`;
            waText += `👤 *Name:* ${name}\n`;
            waText += `📞 *Phone:* ${phone}\n`;
            waText += `🏡 *Community:* ${community}\n`;
            waText += `🎯 *Primary Goal:* ${goal}\n`;
            waText += `🗓️ *Preferred Schedule:* ${schedule}\n`;
            if (message) {
                waText += `💬 *Notes:* ${message}\n`;
            }
            waText += `\n_Submitted via Helevate.fit consultation booking portal_`;

            const encodedText = encodeURIComponent(waText);
            const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`;

            // Provide immediate user feedback in modal
            if (formFeedback) {
                formFeedback.className = 'alert alert-success py-3 px-3 small text-white';
                formFeedback.style.backgroundColor = '#0b2a42';
                formFeedback.style.borderColor = '#2A3F8F';
                formFeedback.innerHTML = `
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-whatsapp fs-5 text-success me-2"></i>
                        <strong class="text-white">Connecting to WhatsApp...</strong>
                    </div>
                    <p class="mb-2 text-white-50">Please tap <strong>Send</strong> in WhatsApp to dispatch your consultation request directly to Coach Harish.</p>
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-light w-100 mt-1">
                        <i class="bi bi-box-arrow-up-right me-1"></i> Open WhatsApp
                    </a>
                    <small class="d-block mt-2 text-white-50" style="font-size: 0.72rem;">
                        Note: Enquiries are delivered once sent via WhatsApp. Automated direct cloud delivery requires official WhatsApp Business API configuration.
                    </small>
                `;
                formFeedback.classList.remove('d-none');
            }

            // Open WhatsApp securely
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });

        // Clear invalid classes on input
        ['consultName', 'consultPhone', 'consultCommunity'].forEach((id) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    input.classList.remove('is-invalid');
                });
            }
        });
    }
});

