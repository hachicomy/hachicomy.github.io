document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Mobile Menu Toggle
       ========================================= */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Toggle the 'active' class to show/hide menu
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    /* =========================================
       2. Theme Switcher (Light/Dark Mode)
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('hachico-theme');

    function updateButtonText(isLight) {
        if (!themeToggleBtn) return;
        if (isLight) {
            themeToggleBtn.innerText = '☾ Dark Mode';
        } else {
            themeToggleBtn.innerText = '☀ Light Mode';
        }
    }

    // Initialize state
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateButtonText(true);
    } else {
        updateButtonText(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');

            updateButtonText(isLight);
            localStorage.setItem('hachico-theme', isLight ? 'light' : 'dark');

            // Force redraw/re-check of particles color via CSS variable or simple refresh? 
            // The canvas code below draws continuously so it might catch up if we used variables in canvas. 
            // But the current canvas implementation uses hardcoded rgba. 
            // We'll leave it as is per user instruction (Blue looks good on both).
        });
    }


    /* =========================================
       3. Back To Top Button
       ========================================= */
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.onscroll = function () {
            // Show button after scrolling down 300px
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* =========================================
       4. FAQ Accordion
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });


    /* =========================================
       5. Particle Background Animation
       ========================================= */
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const particleCount = 50;
        const connectionDistance = 180;
        const moveSpeed = 0.2;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * moveSpeed;
                this.vy = (Math.random() - 0.5) * moveSpeed;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / connectionDistance) * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); init(); });
        resize();
        init();

        /* --- Reduced Motion Check --- */
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
            animate();
        } else {
            // Draw once static
            particles.forEach(p => p.draw());
        }
    }
});
