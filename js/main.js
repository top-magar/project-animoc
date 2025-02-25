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
       const slider = document.querySelector(".announcement-slider");
            const slides = document.querySelectorAll(".announcement-slider__slide");

            // Clone slides before appearing in viewport
            let totalWidth = 0;
            slides.forEach(slide => {
                totalWidth += slide.offsetWidth + 20; // Adjust for spacing
            });

            // Duplicate slides until we cover the full width (preloading effect)
            while (slider.offsetWidth < window.innerWidth * 2) {
                slides.forEach(slide => {
                    let clone = slide.cloneNode(true);
                    slider.appendChild(clone);
                });
            }

            let speed = 1; // Adjust scrolling speed
            let position = 0;

            function animateMarquee() {
                position -= speed;
                if (position <= -totalWidth) {
                    position = 0; // Reset position to prevent jumps
                }
                slider.style.transform = `translateX(${position}px)`;
                requestAnimationFrame(animateMarquee);
            }

            animateMarquee();
        
        
    
});
