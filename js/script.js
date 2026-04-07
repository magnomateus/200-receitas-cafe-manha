// FAQ ACCORDION
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abre o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // CONTADOR REGRESSIVO — tempo restante até meia-noite (horário de Brasília)
    function startCountdown() {
        const hEl = document.getElementById('timer-hours');
        const mEl = document.getElementById('timer-minutes');
        const sEl = document.getElementById('timer-seconds');
        if (!hEl || !mEl || !sEl) return;

        function update() {
            // Calcula meia-noite BRT (UTC-3) a partir do horário atual
            const now = new Date();
            const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
            const brtDay = brt.toISOString().split('T')[0];
            // Meia-noite BRT do dia seguinte = dia seguinte 00:00 BRT = dia seguinte 03:00 UTC
            const nextMidnightBRT = new Date(brtDay + 'T03:00:00Z');
            nextMidnightBRT.setUTCDate(nextMidnightBRT.getUTCDate() + 1);
            const diff = nextMidnightBRT.getTime() - now.getTime();

            if (diff <= 0) {
                hEl.textContent = '00';
                mEl.textContent = '00';
                sEl.textContent = '00';
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            hEl.textContent = hours.toString().padStart(2, '0');
            mEl.textContent = minutes.toString().padStart(2, '0');
            sEl.textContent = seconds.toString().padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    startCountdown();

    // SMOOTH SCROLL
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

    // ANIMAÇÃO DE SCROLL
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animateElements = document.querySelectorAll(
        '.benefit-card, .receita-card, .bonus-card, .depoimento-card, .problema-item'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

});
