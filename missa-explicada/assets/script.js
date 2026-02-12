/* ==========================================================================
   MISSA EXPLICADA - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       1. DATA ATUAL (auto-atualização diária)
       ====================================================================== */

    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');

        if (dateElement) {
            const today = new Date();
            const day = today.getDate();
            const monthNames = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            const month = monthNames[today.getMonth()];

            const formattedDate = `${day} de ${month}`;
            dateElement.textContent = formattedDate;

            console.log('Data da oferta definida:', formattedDate);
        }
    }

    setCurrentDate();

    /* ======================================================================
       2. CONTADOR REGRESSIVO (Até o final do dia)
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

            if (timerMain) {
                timerMain.textContent = formattedTime;
            }
            if (timerOffer) {
                timerOffer.textContent = formattedTime;
            }
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

            // Fechar todos os itens
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });

            // Abrir o item clicado (se estava fechado)
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    /* ======================================================================
       4. CARROSSEL DE PREVIEW
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

        // Atualizar posição do slide
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            currentIndex = index;
            currentTranslate = -currentIndex * 100;
            prevTranslate = currentTranslate;
            track.style.transform = `translateX(${currentTranslate}%)`;

            // Atualizar dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Navegação por botões
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }

        // Navegação por dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
            });
        });

        // Drag/Touch handlers
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

            // Se arrastou mais de 20%, muda de slide
            if (movedBy < -20) {
                goToSlide(currentIndex + 1);
            } else if (movedBy > 20) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex);
            }
        }

        // Mouse events
        wrapper.addEventListener('mousedown', dragStart);
        wrapper.addEventListener('mousemove', drag);
        wrapper.addEventListener('mouseup', dragEnd);
        wrapper.addEventListener('mouseleave', dragEnd);

        // Touch events
        wrapper.addEventListener('touchstart', dragStart, { passive: true });
        wrapper.addEventListener('touchmove', drag, { passive: true });
        wrapper.addEventListener('touchend', dragEnd);

        // Prevenir seleção de texto durante drag
        wrapper.addEventListener('dragstart', e => e.preventDefault());

        // Navegação por teclado
        wrapper.setAttribute('tabindex', '0');
        wrapper.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });

        console.log('✅ Carrossel de preview inicializado');
    }

    initCarousel();

    /* ======================================================================
       5. SMOOTH SCROLL PARA ÂNCORAS
       ====================================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ======================================================================
       6. TRACKING DE EVENTOS (preparado para analytics)
       ====================================================================== */

    function trackCTAClick(ctaName) {
        console.log('CTA Clicked:', ctaName);

        // Track Utmify (se disponível)
        if (typeof utmify !== 'undefined') {
            utmify.track('cta_click', { button: ctaName });
        }
    }

    const ctaButtons = document.querySelectorAll('.btn-cta, .btn-cta-main, .btn-cta-final');
    ctaButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const ctaName = this.textContent.trim();
            trackCTAClick(ctaName);
        });
    });

    /* ======================================================================
       7. CONSOLE LOG DE BOAS-VINDAS
       ====================================================================== */

    console.log(
        '%c✝️ Missa Explicada',
        'font-size: 20px; font-weight: bold; color: #722f37;'
    );
    console.log(
        '%cLanding Page carregada com sucesso!',
        'font-size: 14px; color: #c9a227;'
    );
    console.log('Funcionalidades ativas:');
    console.log('✅ Data atual auto-atualização');
    console.log('✅ Contador regressivo (até o final do dia)');
    console.log('✅ FAQ Accordion');
    console.log('✅ Carrossel de preview (drag/swipe)');
    console.log('✅ Smooth scroll');
    console.log('✅ Tracking de CTAs');
    console.log('✝️ Que Deus abençoe!');

});
