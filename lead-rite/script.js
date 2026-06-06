document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Nav Burger Menu
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load to show elements in viewport

    // 4. Statistics Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;

    const countUp = () => {
        if (counted) return;
        
        // Check if stats are in view
        const statsSection = document.querySelector('.stats');
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 50) {
            counted = true;
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // ~60fps
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.firstChild.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.firstChild.textContent = target;
                    }
                };
                updateCount();
            });
        }
    };
    window.addEventListener('scroll', countUp);
    countUp(); // Trigger once on load if visible

    // 5. About Us Tab Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Set active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set active pane
            tabPanes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // 6. Testimonials Carousel
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create Navigation Dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlidePosition();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    };

    // Button controls
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Dot controls
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlidePosition();
        });
    });

    // Autoplay testimonials
    let autoSlideInterval = setInterval(nextSlide, 7000);

    // Reset interval on manual control click
    const resetAutoplay = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 7000);
    };

    [nextBtn, prevBtn, ...dots].forEach(elem => {
        elem.addEventListener('click', resetAutoplay);
    });

    // 7. Interactive Form Validaions
    const meetingForm = document.getElementById('meetingForm');
    meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        
        alert(`Thank you, ${name}! Your consultation request for "${service}" has been received. Our team will reach out within 24 hours to finalize the date/time.`);
        meetingForm.reset();
    });

    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to Lead-Rite newsletter!');
        newsletterForm.reset();
    });
});
