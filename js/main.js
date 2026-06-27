/**
 * ============================================================
 * MAIN SCRIPT – Lawctopus Landing Page (v2)
 * Features: Countdown, counters, scroll progress, sticky header,
 * FAQ accordion, testimonial carousel, smooth scroll, form validation,
 * back-to-top, intersection observer animations, mobile menu toggle.
 * ============================================================
 */

(function() {
    'use strict';

    // ---------- DOM REFS ----------
    const header = document.getElementById('site-header');
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const testimonialTrack = document.getElementById('testimonial-track');
    const dotsContainer = document.getElementById('testimonial-dots');

    // ---------- COUNTDOWN TIMER ----------
    function initCountdown() {
        const targetDate = new Date('2026-07-01T00:00:00+05:30').getTime();
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-minutes');
        const secsEl = document.getElementById('cd-seconds');

        function update() {
            const now = Date.now();
            let diff = targetDate - now;
            if (diff < 0) diff = 0;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minsEl.textContent = String(minutes).padStart(2, '0');
            secsEl.textContent = String(seconds).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    if (document.getElementById('cd-days')) {
        initCountdown();
    }

    // ---------- ANIMATED COUNTERS ----------
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if (!counters.length) return;

        let animated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count, 10);
                        const duration = 1200;
                        const start = performance.now();
                        const updateCounter = (now) => {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.floor(eased * target);
                            counter.textContent = current.toLocaleString();
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        };
                        requestAnimationFrame(updateCounter);
                    });
                }
            });
        }, { threshold: 0.3 });
        counters.forEach(c => observer.observe(c.closest('.stat-item')));
    }

    // ---------- SCROLL PROGRESS BAR ----------
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.setProperty('--progress', progress + '%');
        scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    // ---------- STICKY HEADER ----------
    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ---------- BACK TO TOP ----------
    function handleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // ---------- MOBILE MENU ----------
    function toggleMobileMenu() {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isOpen);
        navMobile.classList.toggle('open');
        if (!isOpen) {
            navMobile.hidden = false;
        } else {
            navMobile.hidden = true;
        }
    }

    function closeMobileMenu() {
        hamburger.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('open');
        navMobile.hidden = true;
    }

    // ---------- FAQ ACCORDION ----------
    function initFaq() {
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(btn => {
            btn.addEventListener('click', function() {
                const isOpen = this.getAttribute('aria-expanded') === 'true';
                const item = this.closest('.faq-item');

                // Close all others
                document.querySelectorAll('.faq-item.open').forEach(el => {
                    if (el !== item) {
                        el.classList.remove('open');
                        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    item.classList.remove('open');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ---------- TESTIMONIAL CAROUSEL ----------
    function initTestimonials() {
        if (!testimonialTrack) return;

        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        const total = cards.length;
        if (total === 0) return;

        // Create dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        let current = 0;
        let isAnimating = false;

        function goToSlide(index) {
            if (isAnimating) return;
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            isAnimating = true;
            current = index;
            testimonialTrack.scrollTo({
                left: cards[index].offsetLeft,
                behavior: 'smooth'
            });
            updateDots();
            setTimeout(() => { isAnimating = false; }, 400);
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('span');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }

        // Buttons
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));

        // Auto-play on desktop, pause on hover
        let autoPlay = setInterval(() => goToSlide(current + 1), 5000);
        testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        testimonialTrack.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => goToSlide(current + 1), 5000);
        });

        // Update on scroll (manual)
        testimonialTrack.addEventListener('scroll', () => {
            const scrollLeft = testimonialTrack.scrollLeft;
            let closest = 0;
            cards.forEach((card, i) => {
                const left = card.offsetLeft;
                if (Math.abs(scrollLeft - left) < Math.abs(scrollLeft - cards[closest].offsetLeft)) {
                    closest = i;
                }
            });
            if (closest !== current) {
                current = closest;
                updateDots();
            }
        });
    }

    // ---------- SMOOTH SCROLL FOR NAV LINKS ----------
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = header.offsetHeight + 12;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                    closeMobileMenu();
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ---------- FORM VALIDATION ----------
    function initFormValidation() {
        const form = document.getElementById('enroll-form');
        if (!form) return;

        const name = document.getElementById('enroll-name');
        const email = document.getElementById('enroll-email');
        const phone = document.getElementById('enroll-phone');
        const profession = document.getElementById('enroll-profession');
        const successMsg = document.getElementById('form-success');

        const fields = [name, email, phone, profession];

        function validateField(field) {
            const group = field.closest('.form-group');
            const error = group.querySelector('.form-error');
            let isValid = true;

            if (field === name) {
                if (field.value.trim().length < 2) {
                    isValid = false;
                }
            } else if (field === email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(field.value.trim())) {
                    isValid = false;
                }
            } else if (field === phone) {
                const clean = field.value.replace(/[\s\-()]/g, '');
                if (clean.length < 10 || !/^\d+$/.test(clean)) {
                    isValid = false;
                }
            } else if (field === profession) {
                if (field.value === '') {
                    isValid = false;
                }
            }

            if (isValid) {
                group.classList.remove('error');
            } else {
                group.classList.add('error');
            }
            return isValid;
        }

        fields.forEach(f => {
            f.addEventListener('blur', () => validateField(f));
            f.addEventListener('input', () => {
                if (f.closest('.form-group').classList.contains('error')) {
                    validateField(f);
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let allValid = true;
            fields.forEach(f => {
                if (!validateField(f)) allValid = false;
            });
            if (allValid) {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Submitting...';
                btn.disabled = true;
                setTimeout(() => {
                    successMsg.hidden = false;
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    fields.forEach(f => f.closest('.form-group').classList.remove('error'));
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 1200);
            } else {
                const firstError = form.querySelector('.form-group.error input, .form-group.error select');
                if (firstError) firstError.focus();
            }
        });
    }

    // ---------- INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ----------
    function initRevealAnimations() {
        const elements = document.querySelectorAll('.overview-card, .highlight-card, .timeline-card, .faculty-card, .pricing-card, .guarantee-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ---------- INIT ALL ----------
    document.addEventListener('DOMContentLoaded', function() {
        // Header
        window.addEventListener('scroll', handleHeaderScroll);
        window.addEventListener('scroll', updateScrollProgress);
        window.addEventListener('scroll', handleBackToTop);
        handleHeaderScroll();
        updateScrollProgress();
        handleBackToTop();

        // Mobile menu
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }

        // FAQ
        initFaq();

        // Testimonials
        initTestimonials();

        // Smooth scroll
        initSmoothScroll();

        // Form
        initFormValidation();

        // Counters
        initCounters();

        // Reveal animations
        initRevealAnimations();

        // Back to top click
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

})();