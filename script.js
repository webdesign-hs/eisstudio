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
        const darkSections = ['home', 'sortiment', 'zutaten', 'kontakt'];
        const lightSections = ['about'];

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
            } else if (target === '#about') {
                offset = isMobile ? -20 : 25; // Higher on mobile (negative offset)
            } else if (target === '#sortiment') {
                offset = isMobile ? -10 : 45; // Higher on mobile
            } else if (target === '#zutaten') {
                offset = isMobile ? 10 : 55; // New Zutaten section
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

    // Zutaten Section - Rotating Ice Ball with Scroll Hijacking
    const iceBall = document.getElementById('iceBall');
    const zutatItems = document.querySelectorAll('.zutat-item');
    let currentZutat = 0;
    let zutatProgress = 0; // Progress through all ingredients (0-1)
    let isInZutatenSection = false;
    let zutatScrollLocked = false;
    let lastScrollY = 0;
    let snapTimeout = null;

    function snapToZutatenSection() {
        const zutatSection = document.getElementById('zutaten');
        if (!zutatSection) return;

        const rect = zutatSection.getBoundingClientRect();

        // If we're close to the section but not perfectly aligned, snap to it
        if (Math.abs(rect.top) < 200 && Math.abs(rect.top) > 10) {
            zutatSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function updateZutatenSection() {
        if (!iceBall || zutatItems.length === 0) return;

        const zutatSection = document.getElementById('zutaten');
        if (!zutatSection) return;

        const rect = zutatSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if we're approaching or in the zutaten section
        const isApproaching = rect.top <= 200 && rect.top >= -200;
        isInZutatenSection = rect.top <= 100 && rect.bottom >= windowHeight - 100;

        if (isApproaching && !zutatScrollLocked) {
            // Snap to section if we're close
            if (Math.abs(rect.top) > 10) {
                clearTimeout(snapTimeout);
                snapTimeout = setTimeout(() => {
                    snapToZutatenSection();
                }, 50);
            }
        }

        if (isInZutatenSection) {
            // Lock scroll and handle manually
            if (!zutatScrollLocked) {
                document.body.style.overflow = 'hidden';
                zutatScrollLocked = true;
            }
        }
    }

    function handleZutatenScroll(deltaY) {
        const scrollSpeed = 0.003; // Adjust this to control scroll sensitivity
        const direction = deltaY > 0 ? 1 : -1;

        // Update progress based on scroll direction
        zutatProgress += direction * scrollSpeed;
        zutatProgress = Math.max(0, Math.min(1, zutatProgress));

        // Calculate rotation (4 full rotations = 1440 degrees)
        const rotation = zutatProgress * 1440;
        iceBall.style.transform = `rotate(${rotation}deg)`;

        // Calculate which ingredient should be active
        const totalIngredients = zutatItems.length;
        const ingredientProgress = zutatProgress * totalIngredients;
        const targetZutat = Math.floor(ingredientProgress);
        const actualTargetZutat = Math.min(targetZutat, totalIngredients - 1);

        // Change ingredient if needed
        if (actualTargetZutat !== currentZutat) {
            zutatItems[currentZutat].classList.remove('active');
            currentZutat = actualTargetZutat;
            zutatItems[currentZutat].classList.add('active');
        }

        // Check if we should unlock scrolling
        if (zutatProgress >= 1 && deltaY > 0) {
            // Finished all ingredients, allow scroll to continue down
            document.body.style.overflow = 'auto';
            zutatScrollLocked = false;

            // Scroll to next section
            const kontaktSection = document.getElementById('kontakt');
            if (kontaktSection) {
                kontaktSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (zutatProgress <= 0 && deltaY < 0) {
            // At beginning, allow scroll up to previous section
            document.body.style.overflow = 'auto';
            zutatScrollLocked = false;

            // Scroll to previous section
            const sortimentSection = document.getElementById('sortiment');
            if (sortimentSection) {
                sortimentSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Custom wheel event handler for zutaten section
    function handleWheelEvent(e) {
        updateZutatenSection();

        if (zutatScrollLocked) {
            e.preventDefault();
            handleZutatenScroll(e.deltaY);
        }
    }

    // Add wheel event listener
    window.addEventListener('wheel', handleWheelEvent, { passive: false });

    // Add scroll event listener for snapping
    let scrollEndTimer = null;
    window.addEventListener('scroll', function() {
        if (!zutatScrollLocked) {
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                snapToZutatenSection();
            }, 100);
        }
    });

    // Handle mobile touch events
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (zutatScrollLocked) {
            e.preventDefault();
            touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            handleZutatenScroll(deltaY * 2); // Amplify touch sensitivity
        }
    }, { passive: false });

    // Initialize first ingredient
    if (zutatItems.length > 0) {
        zutatItems[0].classList.add('active');
    }

    console.log('Eisstudio Website geladen - Wo Eis zur Filmkunst wird.');
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

// Ice Cream Slideshow
let currentSlide = 0;
let slides;
let textContents;
let indicators;
let slideInterval;

function showSlide(index) {
    if (!slides || !textContents || !indicators) return;

    // Remove active classes
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    textContents.forEach(text => {
        text.classList.remove('active');
    });
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // Handle wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Add prev class to previous slide
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    if (slides[prevIndex]) {
        slides[prevIndex].classList.add('prev');
    }

    // Add active class to current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }

    // Update text content with fade
    if (textContents[currentSlide]) {
        textContents[currentSlide].classList.add('active');
    }

    // Update indicators
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetInterval();
}

function goToSlide(index) {
    showSlide(index);
    resetInterval();
}

function startAutoplay() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function resetInterval() {
    clearInterval(slideInterval);
    startAutoplay();
}

// Initialize slideshow
function initializeSlideshow() {
    slides = document.querySelectorAll('.ice-cream-slide');
    textContents = document.querySelectorAll('.text-content');
    indicators = document.querySelectorAll('.indicator');

    if (!slides.length || !textContents.length || !indicators.length) return;

    // Set initial slide
    currentSlide = 0;
    showSlide(0);

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    const slideshow = document.querySelector('.ice-cream-slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slideshow.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }
}

// Call initialization after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSlideshow);
} else {
    initializeSlideshow();
}

// Make functions global for onclick handlers
window.changeSlide = changeSlide;