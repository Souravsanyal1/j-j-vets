document.addEventListener('DOMContentLoaded', () => {
    // 1. Robust Preloader Logic
    const preloader = document.getElementById('preloader');
    const removePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initGSAP(); // Start animations after preloader is gone
            }, 500);
        }
    };

    // Fallback: Remove preloader after 3 seconds anyway
    setTimeout(removePreloader, 3000);
    window.addEventListener('load', removePreloader);

    // 2. Custom Cursor Logic (Optimized)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        });

        document.querySelectorAll('a, button, input, .accordion-header').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2.5)';
                cursor.style.backgroundColor = 'rgba(158, 0, 31, 0.2)';
                follower.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.backgroundColor = 'transparent';
                follower.style.opacity = '1';
            });
        });
    }

    // 3. Magnetic Buttons (Robust)
    document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            wrap.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        wrap.addEventListener('mouseleave', () => {
            wrap.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. GSAP Animations
    const initGSAP = () => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-reveal', {
                duration: 1.5,
                y: 100,
                opacity: 0,
                stagger: 0.2,
                ease: 'power4.out'
            });

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                gsap.utils.toArray('.reveal').forEach(section => {
                    gsap.from(section, {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
                });
            }
        } else {
            // Fallback if GSAP fails: show all reveals
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            document.querySelectorAll('.hero-reveal').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    };

    // 5. Counter Logic
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const updateCount = () => {
                const increment = target / 50;
                if (count < target) {
                    count += increment;
                    stat.innerText = Math.ceil(count);
                    setTimeout(updateCount, 20);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('#home');
    if (statsSection) observer.observe(statsSection);

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // Scroll reveal fallback (if GSAP not used)
    const revealOnScroll = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 50) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);
});
