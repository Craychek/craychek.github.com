document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    const duration = 1000;
    let animationStarted = false;

    function animateCounters() {
        if (animationStarted) return;
        animationStarted = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;

            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const value = Math.floor(progress * target);

                counter.textContent = new Intl.NumberFormat().format(value);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {

                    setTimeout(() => {
                        animationStarted = false;
                    }, 500);
                }
            };

            requestAnimationFrame(updateCounter);
        });
    }

    function checkVisibility() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = (
            rect.top <= window.innerHeight * 0.75 &&
            rect.bottom >= 0
        );

        if (isVisible) {
            animateCounters();
        }
    }


    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
            }
        }, { threshold: 0.75 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) observer.observe(statsSection);
    } else {

        window.addEventListener('scroll', checkVisibility);
    }


    checkVisibility();
});