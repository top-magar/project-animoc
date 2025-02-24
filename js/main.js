document.addEventListener("DOMContentLoaded", () => {
    // AUTHENTICATION CHECK
    if (localStorage.getItem("isAuthenticated") !== "true") {
        window.location.href = "../Lunching Page/index.html";
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isAuthenticated");
            window.location.href = "../Lunching Page/index.html";
        });
    }

    // MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.menu-toggle');
    const navRight = document.querySelector('.nav-right');

    if (menuToggle && navRight) {
        menuToggle.addEventListener('click', () => {
            navRight.classList.toggle('active');
            menuToggle.querySelectorAll('span').forEach(span => span.classList.toggle('active'));
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navRight.contains(e.target)) {
                navRight.classList.remove('active');
                menuToggle.querySelectorAll('span').forEach(span => span.classList.remove('active'));
            }
        });
    }

    // SMOOTH SCROLL FOR NAV LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // GSAP SCROLL ANIMATIONS
    gsap.registerPlugin(ScrollTrigger);

    // Hero Image Animation
    gsap.from(".hero-image", {
        opacity: 0,
        scale: 1.2,
        duration: 1.5,
        ease: "power2.out"
    });

    // Hero Text Animation
    gsap.from(".hero-text", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.5
    });

    // Product Grid Animation
    gsap.utils.toArray(".product-item").forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // Footer Animation
    gsap.from(".footer", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });

    // Clone announcement text for smooth infinite scroll
        const slider = document.querySelector('.announcement-slider');
        const slide = slider.querySelector('.announcement-slider__slide');
    
        if (slider && slide) {
            const slideWidth = slide.offsetWidth;
            const slideCount = Math.ceil(window.innerWidth / slideWidth) + 2;
    
            // Clone slides for seamless scrolling
            for (let i = 0; i < slideCount; i++) {
                const clone = slide.cloneNode(true);
                clone.setAttribute("aria-hidden", "true"); // Improve accessibility
                slider.appendChild(clone);
            }
    
            // Start animation
            let offset = 0;
            function animateMarquee() {
                offset -= 1;
                if (offset <= -slideWidth) {
                    offset = 0;
                }
                slider.style.transform = `translateX(${offset}px)`;
                requestAnimationFrame(animateMarquee);
            }
            animateMarquee();
        }
    
});
