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

    // CONTADOR REGRESSIVO
    function startCountdown() {
        // Define 2 horas a partir de agora
        const now = new Date().getTime();
        const countdownTime = now + (2 * 60 * 60 * 1000); // 2 horas
        
        const countdownElement = document.getElementById('countdown');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (!countdownElement) return;
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownTime - now;
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        };
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
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
