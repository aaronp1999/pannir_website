document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. PAGE PRELOADER TRIGGER
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    
    // Hide preloader when everything is fully loaded
    window.addEventListener('load', () => {
        hidePreloader();
    });

    // Fallback: hide preloader after 3 seconds in case window load event is delayed
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 3000);

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // ==========================================================================
    // 2. MOBILE MENU DRAWER & NAVBAR TRANSITIONS
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // Toggle menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('bx-menu');
            menuIcon.classList.add('bx-x');
        } else {
            menuIcon.classList.remove('bx-x');
            menuIcon.classList.add('bx-menu');
        }
    });

    // Close mobile menu on clicking any navigation link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('bx-x');
            menuIcon.classList.add('bx-menu');
        });
    });

    // Handle Scroll Transitions: Sticky Navbar & Scroll-to-Top Button Visibility
    window.addEventListener('scroll', () => {
        // Sticky navbar shadow and height reduction
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button fade-in
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    // Smooth scroll up on clicking Scroll-to-Top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // 3. SERVICE CARDS INTERACTIVE HOVER MOUSE GLOW
    // ==========================================================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // ==========================================================================
    // 4. TESTIMONIALS SLIDER / CAROUSEL (PURE JAVASCRIPT)
    // ==========================================================================
    const slider = document.getElementById('testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const dotsContainer = document.getElementById('slider-dots');
    
    let currentSlide = 0;
    const slidesCount = slides.length;
    let sliderAutoplayInterval;

    if (slider && slidesCount > 0) {
        // Create Navigation Dots Dynamically
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.slider-dots .dot');

        // Go to active slide index
        function goToSlide(index) {
            if (index < 0) {
                currentSlide = slidesCount - 1;
            } else if (index >= slidesCount) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }

            // Translate slide track
            slider.style.transform = `translateX(-${currentSlide * 33.3333}%)`;
            
            // Toggle active classes on slides
            slides.forEach((slide, i) => {
                if (i === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Toggle active classes on dots
            dots.forEach((dot, i) => {
                if (i === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Next and Prev handlers
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Navigation click events
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Dot click events
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                goToSlide(targetIndex);
                resetAutoplay();
            });
        });

        // Initialize Slider Autoplay loop
        function startAutoplay() {
            sliderAutoplayInterval = setInterval(nextSlide, 6000);
        }

        function resetAutoplay() {
            clearInterval(sliderAutoplayInterval);
            startAutoplay();
        }

        startAutoplay();
    }

    // ==========================================================================
    // 5. MEDIA GALLERY LIGHTBOX SYSTEM
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let activeGalleryIndex = 0;
    const galleryImagesData = [];

    // Harvest image details from HTML grid structure
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const overlayText = item.querySelector('.gallery-info span').textContent;
        
        galleryImagesData.push({
            src: img.src,
            alt: img.alt,
            title: overlayText
        });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        activeGalleryIndex = index;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        updateLightboxContent();
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Unlock background scrolling
    }

    function updateLightboxContent() {
        const activeData = galleryImagesData[activeGalleryIndex];
        if (activeData) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = activeData.src;
                lightboxImg.alt = activeData.alt;
                lightboxCaption.textContent = activeData.title;
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    }

    function nextLightboxImage() {
        activeGalleryIndex = (activeGalleryIndex + 1) % galleryImagesData.length;
        updateLightboxContent();
    }

    function prevLightboxImage() {
        activeGalleryIndex = (activeGalleryIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
        updateLightboxContent();
    }

    // Lightbox triggers
    if (lightboxModal) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextLightboxImage);
        lightboxPrev.addEventListener('click', prevLightboxImage);

        // Click outside image closes lightbox modal
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Desktop Keyboard accessibility controls
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightboxImage();
            if (e.key === 'ArrowLeft') prevLightboxImage();
        });
    }

    // ==========================================================================
    // 6. FAQ ACCORDION TRANSITIONS (EXCLUSIVE ACTION)
    // ==========================================================================
    const faqBtns = document.querySelectorAll('.faq-question-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const accordionItem = btn.parentElement;
            const answerPane = accordionItem.querySelector('.faq-answer-pane');
            const isActive = accordionItem.classList.contains('active');

            // Close all other accordions first (exclusive mode for cleanliness)
            document.querySelectorAll('.faq-accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
                item.querySelector('.faq-answer-pane').style.maxHeight = '0px';
            });

            // Toggle selected item
            if (!isActive) {
                accordionItem.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                // Calculate scrollHeight dynamically for smooth flex
                accordionItem.style.borderColor = 'rgba(0, 180, 216, 0.2)';
                answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
            } else {
                accordionItem.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                accordionItem.style.borderColor = 'rgba(0, 0, 0, 0.03)';
                answerPane.style.maxHeight = '0px';
            }
        });
    });

    // ==========================================================================
    // 7. ACTIVE SCROLLSPY MENU NAVIGATION HIGHLIGHT
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const scrollOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the active middle portion
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinksItems.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollOptions);

    sections.forEach(section => spyObserver.observe(section));

    // Special case for scrolling to top: activate Home link
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navLinksItems.forEach((link, idx) => {
                if (idx === 0) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });

    // ==========================================================================
    // 8. CONTACT FORM VALIDATION & SUCCESS FEEDBACK POPUP
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const successUserName = document.getElementById('success-user-name');
    const successUserPhone = document.getElementById('success-user-phone');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Halt default post back

            // Input Fields Selectors
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');

            let isFormValid = true;

            // --- Name Validation ---
            if (nameInput.value.trim() === '') {
                showValidationError(nameInput);
                isFormValid = false;
            } else {
                clearValidationError(nameInput);
            }

            // --- Email Validation ---
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showValidationError(emailInput);
                isFormValid = false;
            } else {
                clearValidationError(emailInput);
            }

            // --- Phone Validation (Fits Indian standard 10 digit or international sequences) ---
            const phoneRegex = /^\d{10}$/; // exactly 10 digits
            const cleanedPhone = phoneInput.value.replace(/[^0-9]/g, ''); // strip letters/dashes for validation
            if (!phoneRegex.test(cleanedPhone)) {
                showValidationError(phoneInput);
                isFormValid = false;
            } else {
                clearValidationError(phoneInput);
            }

            // --- Message Validation ---
            if (messageInput.value.trim() === '') {
                showValidationError(messageInput);
                isFormValid = false;
            } else {
                clearValidationError(messageInput);
            }

            // If completely valid, show success card
            if (isFormValid) {
                // Populate custom overlay text
                successUserName.textContent = nameInput.value.trim();
                successUserPhone.textContent = phoneInput.value.trim();

                // Trigger Overlay Pop-up
                successOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll

                // Reset inputs cleanly
                contactForm.reset();
                
                // Clear any leftover inline visual cues
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('invalid');
                });
            }
        });

        // Real-time keyboard correction checks
        const monitoredInputs = contactForm.querySelectorAll('input, textarea');
        monitoredInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    // Check email/phone specifically if they are typed
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(input.value.trim())) {
                            clearValidationError(input);
                        }
                    } else if (input.type === 'tel') {
                        const phoneRegex = /^\d{10}$/;
                        const cleanedPhone = input.value.replace(/[^0-9]/g, '');
                        if (phoneRegex.test(cleanedPhone)) {
                            clearValidationError(input);
                        }
                    } else {
                        clearValidationError(input);
                    }
                }
            });
        });

        // Close Success Popup
        successCloseBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scroll
        });
    }

    function showValidationError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('invalid');
        }
    }

    function clearValidationError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('invalid');
        }
    }

    // ==========================================================================
    // 9. DYNAMIC SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12 // Trigger when 12% is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Unobserve once animated to keep DOM processes clean
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const scrollAnimatedElements = document.querySelectorAll('.animate-on-scroll');
    scrollAnimatedElements.forEach(el => revealObserver.observe(el));
});
