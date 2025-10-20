document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const parallaxElement = document.getElementById('parallaxElement');
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const chapters = document.querySelectorAll('.chapter');
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Function to update active navigation based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Update header color based on section background
                updateHeaderColor(sectionId);
            }
        });
    }

    // Function to update header colors based on current section
    function updateHeaderColor(sectionId) {
        navbar.classList.remove('on-dark', 'on-light');

        // Define which sections have dark backgrounds
        const darkSections = ['home', 'faelle', 'kontakt'];
        const lightSections = ['studio', 'reports'];

        if (darkSections.includes(sectionId)) {
            navbar.classList.add('on-dark');
        } else if (lightSections.includes(sectionId)) {
            navbar.classList.add('on-light');
        } else {
            // Default to dark for unknown sections
            navbar.classList.add('on-dark');
        }
    }

    function handleScroll() {
        scrollY = window.pageYOffset;

        // Add subtle background when scrolled
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation state
        updateActiveNavigation();

        // Hero parallax push-up effect
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent && scrollY < window.innerHeight) {
            const scrollPercent = scrollY / window.innerHeight;
            const translateY = scrollPercent * -300; // Push up by 300px max
            const opacity = 1 - (scrollPercent * 0.4); // Fade out more
            const blur = scrollPercent * 2; // Subtle blur

            heroContent.style.transform = `translateY(${translateY}px)`;
            heroContent.style.opacity = opacity;
            heroContent.style.filter = `blur(${blur}px)`;
        }

        const translateY = scrollY * -0.3;
        const scale = 1 + scrollY * 0.0002;
        const opacity = Math.max(0.3, 0.5 - scrollY * 0.0005);

        if (parallaxElement) {
            parallaxElement.style.transform = `translateY(calc(-50% + ${translateY}px)) scale(${scale})`;
            parallaxElement.querySelector('.floating-ice').style.opacity = opacity;
        }

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });

        chapters.forEach((chapter, index) => {
            const chapterTop = chapter.getBoundingClientRect().top;
            const chapterVisible = 100;

            if (chapterTop < window.innerHeight - chapterVisible) {
                setTimeout(() => {
                    chapter.classList.add('visible');
                }, index * 100);
            }
        });

        document.querySelectorAll('.product-card').forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = 50;

            if (cardTop < window.innerHeight - cardVisible && !card.classList.contains('visible')) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 50);
            }
        });
    }

    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        targetX = (mouseX - window.innerWidth / 2) * 0.02;
        targetY = (mouseY - window.innerHeight / 2) * 0.02;
    }

    function animateParallax() {
        const currentX = parseFloat(parallaxElement.style.left) || 0;
        const currentY = parseFloat(parallaxElement.style.top) || 0;

        const newX = currentX + (targetX - currentX) * 0.1;
        const newY = currentY + (targetY - currentY) * 0.1;

        if (parallaxElement && window.innerWidth > 768) {
            parallaxElement.style.transform = `translate(${newX}px, calc(-50% + ${newY}px + ${scrollY * -0.3}px))`;
        }

        requestAnimationFrame(animateParallax);
    }

    function smoothScroll(target) {
        const targetSection = document.querySelector(target);
        if (targetSection) {
            // Different offsets for different sections
            let offset = 0;
            const isMobile = window.innerWidth <= 768;

            if (target === '#home') {
                offset = 0; // Hero section - scroll to top
            } else if (target === '#studio') {
                offset = isMobile ? -20 : 25; // Higher on mobile (negative offset)
            } else if (target === '#faelle') {
                offset = isMobile ? -10 : 45; // Higher on mobile
            } else if (target === '#reports') {
                offset = isMobile ? 10 : 55; // Reports section
            } else if (target === '#kontakt') {
                offset = isMobile ? 0 : 65; // Higher on mobile
            }

            const targetPosition = targetSection.offsetTop + offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Global function for scroll down arrow
    window.scrollToSection = function(target) {
        smoothScroll(target);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);

                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                navbar.classList.remove('menu-open');
            }
        });
    });

    // Hamburger menu
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        navbar.classList.toggle('menu-open');
        console.log('Hamburger clicked!'); // Debug log
    });

    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navbar.classList.remove('menu-open');
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });

    // Hero animations are now handled after preloader
    // Elements will fade in with the content wrapper

    const spotlights = document.querySelectorAll('.spotlight');
    spotlights.forEach((spotlight, index) => {
        spotlight.style.animationDelay = `${index * 2}s`;
    });

    let filmGrainAnimation;
    const filmGrain = document.querySelector('.film-grain');

    if (filmGrain) {
        filmGrainAnimation = setInterval(() => {
            const x = Math.random() * 10 - 5;
            const y = Math.random() * 10 - 5;
            filmGrain.style.transform = `translate(${x}px, ${y}px)`;
        }, 100);
    }

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    handleScroll();
    updateActiveNavigation();
    animateParallax();

    const lazyImages = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 300px 0px'
    };

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Check if image is already loaded
                if (img.complete && img.naturalHeight !== 0) {
                    // Image already loaded, just fade it in
                    img.style.transition = 'opacity 0.6s ease';
                    img.style.opacity = '1';
                } else {
                    // Image not loaded yet, wait for load event
                    img.style.opacity = '0';
                    img.addEventListener('load', function() {
                        setTimeout(() => {
                            img.style.transition = 'opacity 0.6s ease';
                            img.style.opacity = '1';
                        }, 100);
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);

    lazyImages.forEach(img => {
        // Initially set images to visible in case JS fails
        img.style.opacity = '1';
        imageObserver.observe(img);
    });

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
            link.style.transition = 'all 0.6s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 1500 + (index * 100));
    });

    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        const title = header.querySelector('.section-title');
        const subtitle = header.querySelector('.section-subtitle');

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
        }

        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
    });

    const headerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.section-title');
                const subtitle = entry.target.querySelector('.section-subtitle');

                if (title) {
                    setTimeout(() => {
                        title.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                        title.style.opacity = '1';
                        title.style.transform = 'translateY(0)';
                    }, 200);
                }

                if (subtitle) {
                    setTimeout(() => {
                        subtitle.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                        subtitle.style.opacity = '1';
                        subtitle.style.transform = 'translateY(0)';
                    }, 400);
                }

                headerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });


    console.log('sitNeis geladen - Wo Eis zur Story wird.');
});

// Preloader handling
window.addEventListener('load', function() {
    // Wait for animation to complete
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.6s ease';
            preloader.style.opacity = '0';

            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
            }, 600);
        }
    }, 2000);
});

