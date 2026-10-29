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
        if (document.querySelector('.hero-nav')) {
            heroTl.from('.hero-nav', { opacity: 0, y: -20, duration: 0.7, clearProps: 'transform' });
        }
        if (document.querySelector('.hero-left-col')) {
            heroTl
                .from('.hero-left-col', { opacity: 0, x: isMobileScreen ? 0 : -30, duration: 0.7 }, '-=0.4')
                .from('.hero-center-area', { opacity: 0, y: 0, duration: 0.7, clearProps: 'all' }, '-=0.4');
        }
        if (document.querySelector('.hero-bottom-nested-card')) {
            heroTl.from('.hero-bottom-nested-card', { opacity: 0, y: 20, duration: 0.65, ease: 'power2.out', clearProps: 'all' }, '-=0.3');
        }
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
                ...(window.innerWidth >= 992 ? ['.gym-floating-pin'] : []),
                // 3. Section Headers (pills, titles, subtitles across all sections)
                '.section-header > *',
                // 4. Services & Explore cards
                '#services .stagger-item',
                '#explore .stagger-item',
                '.community-model-card',
                '.community-take-care-panel',
                '.story-spotlight-card',
                '.subpage-detail-card',
                '.founder-story-panel',
                '.plan-comparison-wrap',
                '.story-case-card',
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
                        const carouselParent = target.closest('.stories-track, .coach-cards-row, #plansCardsRow, .team-mobile-track');
                        if (carouselParent) {
                            carouselParent.querySelectorAll('.reveal-item, .story-card, .coach-portrait-card').forEach((card) => {
                                card.classList.add('is-revealed', 'sa-in');
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

    // 8. Sticky Header Navigation on Scroll with Glassy Blur Effect & Multi-Page Active Route Highlighting
    const mainHeaderNav = document.getElementById('mainHeaderNav');
    const heroNavLinks = document.querySelectorAll('.hero-nav-links a');
    const allMobileNavLinks = document.querySelectorAll('.mobile-nav-item');

    // Detect active page route from body data-page or URL pathname
    function getActivePageSlug() {
        const bodyPage = document.body.getAttribute('data-page');
        if (bodyPage) return bodyPage;
        const cleanPath = window.location.pathname
            .replace(/\/index\.html$/i, '')
            .replace(/\.html$/i, '')
            .replace(/\/+$/, '');
        const segments = cleanPath.split('/').filter(Boolean);
        const lastSeg = segments[segments.length - 1] || 'home';
        const knownPages = ['community', 'services', 'how-it-works', 'plans', 'team', 'stories'];
        return knownPages.includes(lastSeg) ? lastSeg : 'home';
    }

    const activePageSlug = getActivePageSlug();

    function highlightActiveNavLinks() {
        heroNavLinks.forEach((link) => {
            const linkPage = link.getAttribute('data-page') || '';
            const isMatch = linkPage === activePageSlug;
            link.classList.toggle('active', isMatch);
            if (isMatch) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        allMobileNavLinks.forEach((link) => {
            const linkPage = link.getAttribute('data-page') || '';
            const isMatch = linkPage === activePageSlug;
            link.classList.toggle('active', isMatch);
            if (isMatch) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    highlightActiveNavLinks();

    function updateStickyNav() {
        if (!mainHeaderNav) return;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

        // Sticky & Glassy effect applied ONLY when scrolling away from top (scrollY > 30px)
        if (scrollY > 30) {
            mainHeaderNav.classList.add('is-scrolled');
        } else {
            mainHeaderNav.classList.remove('is-scrolled');
        }
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

    // =========================================================================
    // Mobile Services Cards: Automatic Slide Movement with Reading Time
    // Strictly active on mobile/tablet screens (< 992px); zero impact on laptop
    // =========================================================================
    const initServicesMobileSlider = () => {
        const servicesSection = document.getElementById('services');
        if (!servicesSection) return;

        const container = servicesSection.querySelector('.stagger-cards');
        if (!container) return;

        const items = container.querySelectorAll('.stagger-item');
        if (items.length <= 1) return;

        const serviceCards = container.querySelectorAll('.service-card');
        let currentIndex = 0;
        let lastActiveIndex = -1;
        let activeAnimTimeout = null;
        let timer = null;
        let isUserInteracting = false;
        let resumeTimeout = null;
        let isVisible = false;

        // Faster and smoother mobile auto-scroll interval: 2.2s per card
        const READ_TIME_MS = 2200;

        const isMobileView = () => window.innerWidth < 992 && container.scrollWidth > container.clientWidth;

        // Trigger diagonal watermark movement on the selected/scrolled card
        const activateCard = (index, delayMs = 0) => {
            if (activeAnimTimeout) {
                clearTimeout(activeAnimTimeout);
                activeAnimTimeout = null;
            }
            serviceCards.forEach((c, idx) => {
                if (idx !== index) c.classList.remove('is-active');
            });
            const targetCard = serviceCards[index];
            if (!targetCard) return;

            if (delayMs > 0) {
                targetCard.classList.remove('is-active');
                activeAnimTimeout = setTimeout(() => {
                    // Force reflow so the CSS transition always plays visibly
                    void targetCard.offsetWidth;
                    targetCard.classList.add('is-active');
                }, delayMs);
            } else {
                targetCard.classList.remove('is-active');
                void targetCard.offsetWidth;
                targetCard.classList.add('is-active');
            }
            lastActiveIndex = index;
        };

        // Interactive hover / tap / select state on service cards
        serviceCards.forEach((card, idx) => {
            card.addEventListener('pointerenter', (e) => {
                if (e.pointerType === 'mouse' && window.innerWidth < 992) {
                    activateCard(idx, 0);
                }
            });
            card.addEventListener('pointerleave', (e) => {
                if (e.pointerType === 'mouse' && window.innerWidth >= 992) {
                    card.classList.remove('is-active');
                }
            });
            card.addEventListener('touchstart', () => {
                if (lastActiveIndex !== idx) {
                    activateCard(idx, 60);
                } else {
                    activateCard(idx, 0);
                }
            }, { passive: true });
            card.addEventListener('click', () => {
                activateCard(idx, 0);
            });
        });

        const getNearestIndex = () => {
            const scrollLeft = container.scrollLeft;
            let minDiff = Infinity;
            let closest = 0;
            const containerPaddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
            items.forEach((item, idx) => {
                const itemLeft = item.offsetLeft - container.offsetLeft - containerPaddingLeft;
                const diff = Math.abs(itemLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = idx;
                }
            });
            return closest;
        };

        const scrollToSlide = (index) => {
            if (!isMobileView()) return;
            const targetIndex = index % items.length;
            const containerPaddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
            const targetLeft = items[targetIndex].offsetLeft - container.offsetLeft - containerPaddingLeft;
            container.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: 'smooth'
            });
            currentIndex = targetIndex;
            activateCard(targetIndex, 220);
        };

        const nextSlide = () => {
            if (!isMobileView() || isUserInteracting || !isVisible) return;
            currentIndex = (currentIndex + 1) % items.length;
            scrollToSlide(currentIndex);
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            if (!isMobileView() || !isVisible) return;
            timer = setInterval(nextSlide, READ_TIME_MS);
        };

        const stopAutoPlay = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        const pauseAndResume = (delay = 3000) => {
            isUserInteracting = true;
            stopAutoPlay();
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isUserInteracting = false;
                currentIndex = getNearestIndex();
                startAutoPlay();
            }, delay);
        };

        // User touch and gesture listeners: pause when user interacts
        container.addEventListener('touchstart', () => pauseAndResume(), { passive: true });
        container.addEventListener('touchmove', () => pauseAndResume(), { passive: true });
        container.addEventListener('touchend', () => pauseAndResume(2500), { passive: true });
        container.addEventListener('pointerdown', () => pauseAndResume(), { passive: true });

        // Keep currentIndex and active card diagonal animation in sync when scrolling cards
        let scrollDebounce = null;
        container.addEventListener('scroll', () => {
            if (!isMobileView()) return;
            const nearest = getNearestIndex();
            if (nearest !== lastActiveIndex) {
                currentIndex = nearest;
                activateCard(nearest, 120);
            }
            if (isUserInteracting) {
                if (scrollDebounce) clearTimeout(scrollDebounce);
                scrollDebounce = setTimeout(() => {
                    const settled = getNearestIndex();
                    currentIndex = settled;
                    if (settled !== lastActiveIndex || !serviceCards[settled]?.classList.contains('is-active')) {
                        activateCard(settled, 0);
                    }
                }, 120);
            }
        }, { passive: true });

        // Only auto-play and animate when services section is on screen
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isVisible = entry.isIntersecting;
                    if (isVisible) {
                        currentIndex = getNearestIndex();
                        if (isMobileView()) {
                            activateCard(currentIndex, 200);
                        }
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                        if (isMobileView()) {
                            serviceCards.forEach((c) => c.classList.remove('is-active'));
                            lastActiveIndex = -1;
                        }
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(servicesSection);
        } else {
            isVisible = true;
            if (isMobileView()) {
                activateCard(0, 200);
            }
            startAutoPlay();
        }

        // Viewport resize handling: only active on mobile/tablet (< 992px)
        window.addEventListener('resize', () => {
            if (isMobileView()) {
                if (!timer && isVisible) startAutoPlay();
            } else {
                stopAutoPlay();
                serviceCards.forEach((c) => c.classList.remove('is-active'));
                lastActiveIndex = -1;
            }
        }, { passive: true });
    };

    initServicesMobileSlider();

    // =========================================================================
    // Mobile-only auto-scrolling carousels (Plans, Team, Stories)
    // Active only on screens < 992px; laptop view is untouched.
    // =========================================================================
    const initMobileAutoCarousel = (container, getItems, options = {}) => {
        if (!container) return null;
        const interval = options.interval || 3200;
        const align = options.align || 'start';
        let index = options.startIndex || 0;
        let timer = null;
        let resumeTimeout = null;
        let interacting = false;
        let visible = false;

        const isMobile = () => window.innerWidth < 992 && container.scrollWidth > container.clientWidth + 4;
        const items = () => Array.from(getItems()).filter((el) => el.offsetParent !== null);

        const targetLeftFor = (el) => {
            const cRect = container.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();
            let left = container.scrollLeft + (eRect.left - cRect.left);
            if (align === 'center') {
                left -= (container.clientWidth - eRect.width) / 2;
            } else if (align === 'end') {
                left -= 106;
            } else {
                left -= parseFloat(getComputedStyle(container).paddingLeft) || 0;
            }
            return Math.max(0, Math.min(left, container.scrollWidth - container.clientWidth));
        };

        const nearestIndex = () => {
            const list = items();
            let best = 0;
            let min = Infinity;
            list.forEach((el, i) => {
                const d = Math.abs(targetLeftFor(el) - container.scrollLeft);
                if (d < min) { min = d; best = i; }
            });
            return best;
        };

        const goTo = (i, smooth = true) => {
            const list = items();
            if (!list.length || !isMobile()) return;
            index = ((i % list.length) + list.length) % list.length;
            container.scrollTo({ left: targetLeftFor(list[index]), behavior: smooth ? 'smooth' : 'auto' });
            if (options.onChange) options.onChange(index);
        };

        const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
        const start = () => {
            stop();
            if (!isMobile() || !visible || interacting) return;
            timer = setInterval(() => goTo(index + 1), interval);
        };
        const pause = (delay = 3500) => {
            interacting = true;
            stop();
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                interacting = false;
                index = nearestIndex();
                start();
            }, delay);
        };

        container.addEventListener('touchstart', () => pause(), { passive: true });
        container.addEventListener('touchmove', () => pause(), { passive: true });
        container.addEventListener('pointerdown', () => pause(), { passive: true });

        let scrollT = null;
        container.addEventListener('scroll', () => {
            if (!isMobile()) return;
            if (scrollT) clearTimeout(scrollT);
            scrollT = setTimeout(() => {
                const n = nearestIndex();
                if (n !== index && interacting) {
                    index = n;
                    if (options.onChange) options.onChange(index);
                }
            }, 120);
        }, { passive: true });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    visible = entry.isIntersecting;
                    if (visible) start(); else stop();
                });
            }, { threshold: 0.25 }).observe(container);
        } else {
            visible = true;
        }

        window.addEventListener('resize', () => {
            if (isMobile()) { if (!timer) start(); } else { stop(); }
        }, { passive: true });

        // Initial position (instant, no animation)
        if (options.startIndex) {
            requestAnimationFrame(() => goTo(options.startIndex, false));
        }

        return { goTo, pause };
    };

    // Plans: tabs + auto-scroll (starts on the featured "Coaching" card)
    const plansRow = document.getElementById('plansCardsRow');
    const planTabs = document.querySelectorAll('.plans-tab-btn');
    if (plansRow) {
        const setActiveTab = (i) => {
            planTabs.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.planIndex) === i));
        };
        const plansCarousel = initMobileAutoCarousel(
            plansRow,
            () => plansRow.querySelectorAll(':scope > .col-lg-4'),
            { align: 'end', startIndex: 1, interval: 3400, onChange: setActiveTab }
        );
        planTabs.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (!plansCarousel) return;
                plansCarousel.pause(5000);
                plansCarousel.goTo(Number(btn.dataset.planIndex));
            });
        });
    }

    // Team: auto-scroll staggered columns
    const teamTrack = document.querySelector('.team-mobile-track');
    if (teamTrack) {
        initMobileAutoCarousel(teamTrack, () => teamTrack.querySelectorAll(':scope > .team-stagger-col'), {
            align: 'start',
            interval: 3000
        });
    }
    // Genetic Consultants (mobile): auto-scroll side-by-side cards
    const geneticTrack = document.getElementById('geneticMobileTrack');
    if (geneticTrack) {
        initMobileAutoCarousel(geneticTrack, () => geneticTrack.querySelectorAll(':scope > .genetic-mobile-slide'), {
            align: 'start',
            interval: 2600
        });
    }


    // Stories: auto-scroll story cards (dashes sync via existing scroll handler)
    const storiesScroller = document.querySelector('.stories-slider-container');
    if (storiesScroller) {
        initMobileAutoCarousel(storiesScroller, () => storiesScroller.querySelectorAll('.story-card'), {
            align: 'center',
            interval: 3000
        });
    }
});

