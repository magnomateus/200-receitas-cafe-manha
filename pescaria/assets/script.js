/* ==========================================================================
   MANUAL DO PESCADOR - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   (mesmo padrao da pagina da Missa, adaptado para pesca)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       1. DATA ATUAL (auto-atualizacao diaria na barra de urgencia)
       ====================================================================== */

    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');

        if (dateElement) {
            const today = new Date();
            const day = today.getDate();
            const monthNames = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            const month = monthNames[today.getMonth()];

            dateElement.textContent = `${day} de ${month}`;
        }
    }

    setCurrentDate();

    /* ======================================================================
       2. CONTADOR REGRESSIVO (ate o final do dia)
       ====================================================================== */

    function startCountdown() {
        const timerMain = document.getElementById('timer-main');
        const timerOffer = document.getElementById('timer-offer');

        function updateTimer() {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const distance = endOfDay.getTime() - now.getTime();

            if (distance < 0) {
                if (timerMain) timerMain.textContent = '00:00:00';
                if (timerOffer) timerOffer.textContent = '00:00:00';
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formattedTime =
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');

            if (timerMain) timerMain.textContent = formattedTime;
            if (timerOffer) timerOffer.textContent = formattedTime;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    startCountdown();

    /* ======================================================================
       3. FAQ ACCORDION
       ====================================================================== */

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });

            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    /* ======================================================================
       4. CARROSSEL DE PREVIEW (drag / swipe)
       ====================================================================== */

    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dots = document.querySelectorAll('.carousel-dot');
        const wrapper = document.querySelector('.carousel-wrapper');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            currentIndex = index;
            currentTranslate = -currentIndex * 100;
            prevTranslate = currentTranslate;
            track.style.transform = `translateX(${currentTranslate}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
            });
        });

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function dragStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            track.style.transition = 'none';
            wrapper.style.cursor = 'grabbing';
        }

        function drag(event) {
            if (!isDragging) return;
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            const slideWidth = wrapper.offsetWidth;
            const percentMoved = (diff / slideWidth) * 100;
            currentTranslate = prevTranslate + percentMoved;
            track.style.transform = `translateX(${currentTranslate}%)`;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.4s ease';
            wrapper.style.cursor = 'grab';

            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -20) {
                goToSlide(currentIndex + 1);
            } else if (movedBy > 20) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex);
            }
        }

        wrapper.addEventListener('mousedown', dragStart);
        wrapper.addEventListener('mousemove', drag);
        wrapper.addEventListener('mouseup', dragEnd);
        wrapper.addEventListener('mouseleave', dragEnd);

        wrapper.addEventListener('touchstart', dragStart, { passive: true });
        wrapper.addEventListener('touchmove', drag, { passive: true });
        wrapper.addEventListener('touchend', dragEnd);

        wrapper.addEventListener('dragstart', e => e.preventDefault());

        wrapper.setAttribute('tabindex', '0');
        wrapper.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });
    }

    initCarousel();

    /* ======================================================================
       5. SMOOTH SCROLL PARA ANCORAS
       ====================================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ======================================================================
       6. TRACKING DE CLIQUE EM CTA (Utmify, se disponivel)
       ====================================================================== */

    function trackCTAClick(ctaName) {
        if (typeof utmify !== 'undefined') {
            utmify.track('cta_click', { button: ctaName });
        }
    }

    const ctaButtons = document.querySelectorAll('.btn-cta, .btn-cta-main, .btn-cta-final, .btn-cta-author');
    ctaButtons.forEach((button) => {
        button.addEventListener('click', function() {
            trackCTAClick(this.textContent.trim());
        });
    });

    console.log('%c🎣 Manual do Pescador', 'font-size: 18px; font-weight: bold; color: #0b5e7a;');
    console.log('%cLanding page carregada.', 'font-size: 13px; color: #f28c1c;');

});
