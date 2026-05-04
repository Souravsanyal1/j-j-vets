document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    cursor.className = 'cursor';
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        }, 50);
    });

    document.querySelectorAll('a, button, input, .accordion-header').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.backgroundColor = 'rgba(158, 0, 31, 0.2)';
            follower.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
            follower.style.opacity = '1';
        });
    });

    // 2. Magnetic Buttons
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

    // 3. GSAP Animations (using window.gsap if loaded)
    const initGSAP = () => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-reveal', {
                duration: 1.5,
                y: 100,
                opacity: 0,
                stagger: 0.2,
                ease: 'power4.out'
            });

            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('.reveal').forEach(section => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            });
        }
    };

    // 4. Counter Logic
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

    // Trigger counters on reveal
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

    // 5. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
            initGSAP();
        }, 800);
    });

    // Dark Mode & other logic preserved
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const theme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // Language Switcher simulation
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('lang-active'));
            btn.classList.add('lang-active');
            // Logic to change text content could be added here
        });
    });
});
