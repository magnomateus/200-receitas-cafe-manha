/* ==========================================================================
   200 RECEITAS DE CAFÉ DA MANHÃ - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   ========================================================================== */

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       1. CONTADOR REGRESSIVO (15 minutos)
       ====================================================================== */

    function startCountdown() {
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) return;

        // FORÇAR 15 minutos - limpar localStorage antigo
        const FIFTEEN_MINUTES = 15 * 60 * 1000;

        // Verificar se já existe um tempo salvo no localStorage
        let endTime = localStorage.getItem('countdownEndTime');

        // Se não existe OU se é maior que 15 minutos (limpeza de valores antigos de 48h)
        if (!endTime || (parseInt(endTime) - new Date().getTime()) > FIFTEEN_MINUTES) {
            // Criar novo countdown de 15 minutos
            endTime = new Date().getTime() + FIFTEEN_MINUTES;
            localStorage.setItem('countdownEndTime', endTime);
            console.log('Countdown resetado para 15 minutos');
        }

        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                // Se o tempo acabou, reiniciar
                endTime = new Date().getTime() + FIFTEEN_MINUTES;
                localStorage.setItem('countdownEndTime', endTime);
                return;
            }

            // Calcular horas, minutos e segundos
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Formatar com zero à esquerda
            const formattedTime =
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');

            timerDisplay.textContent = formattedTime;
        }

        // Atualizar a cada segundo
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    startCountdown();

    /* ======================================================================
       1.4. DATA DE EXPIRAÇÃO DA OFERTA (ATUALIZA DIARIAMENTE)
       ====================================================================== */

    function setOfferExpirationDate() {
        const offerDateElement = document.getElementById('offer-date');

        if (!offerDateElement) {
            console.error('Elemento offer-date não encontrado');
            return;
        }

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const months = [
            'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
            'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
        ];

        const day = tomorrow.getDate();
        const month = months[tomorrow.getMonth()];

        const dateText = `${day} DE ${month}`;
        offerDateElement.textContent = dateText;

        console.log('Data da oferta definida:', dateText);
    }

    setOfferExpirationDate();

    /* ======================================================================
       2. FAQ ACCORDION
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
       3. SMOOTH SCROLL PARA ÂNCORAS
       ====================================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorar links vazios ou apenas "#"
            if (href === '#' || href === '#checkout') return;

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
       4. LAZY LOADING DE IMAGENS
       ====================================================================== */

    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sem suporte a IntersectionObserver
            lazyImages.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    setupLazyLoading();

    /* ======================================================================
       5. TRACKING DE EVENTOS (preparado para analytics)
       ====================================================================== */

    function trackCTAClick(ctaName) {
        console.log('CTA Clicked:', ctaName);

        // Quando configurar Google Analytics ou Facebook Pixel, descomentar:

        // Google Analytics 4
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'click', {
        //         'event_category': 'CTA',
        //         'event_label': ctaName
        //     });
        // }

        // Facebook Pixel
        // if (typeof fbq !== 'undefined') {
        //     fbq('track', 'Lead', { cta_name: ctaName });
        // }
    }

    // Adicionar tracking em todos os CTAs
    const ctaButtons = document.querySelectorAll('.btn-cta, .btn-cta-main, .btn-cta-final');
    ctaButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const ctaName = this.textContent.trim();
            trackCTAClick(ctaName);
        });
    });

    /* ======================================================================
       6. SCROLL DEPTH TRACKING (preparado para analytics)
       ====================================================================== */

    const scrollMilestones = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    function trackScrollDepth() {
        const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        Object.keys(scrollMilestones).forEach(milestone => {
            if (scrollPercentage >= milestone && !scrollMilestones[milestone]) {
                scrollMilestones[milestone] = true;
                console.log(`Scroll Depth: ${milestone}%`);

                // Quando configurar analytics, descomentar:
                // if (typeof gtag !== 'undefined') {
                //     gtag('event', 'scroll', {
                //         'event_category': 'Engagement',
                //         'event_label': milestone + '%'
                //     });
                // }
            }
        });
    }

    // Throttle para performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(function() {
            trackScrollDepth();
        });
    });

    /* ======================================================================
       7. TEMPO NA PÁGINA (preparado para analytics)
       ====================================================================== */

    const timeMilestones = [30000, 60000, 120000]; // 30s, 60s, 120s
    const trackedTimes = new Set();

    timeMilestones.forEach(time => {
        setTimeout(() => {
            if (!trackedTimes.has(time)) {
                trackedTimes.add(time);
                console.log(`Time on page: ${time / 1000}s`);

                // Quando configurar analytics, descomentar:
                // if (typeof gtag !== 'undefined') {
                //     gtag('event', 'timing', {
                //         'event_category': 'Engagement',
                //         'event_label': (time / 1000) + 's',
                //         'value': time
                //     });
                // }
            }
        }, time);
    });

    /* ======================================================================
       8. TRACKING DE CONVERSÃO (Links de checkout)
       ====================================================================== */

    const checkoutLinks = document.querySelectorAll('a[href*="pay.lowify.com.br"]');
    checkoutLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Tracking de conversão
            console.log('Checkout link clicked - Redirecionando para Lowify');

            // Quando configurar analytics, descomentar:
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'begin_checkout', {
            //         'event_category': 'ecommerce',
            //         'event_label': 'Cakto Checkout'
            //     });
            // }

            // if (typeof fbq !== 'undefined') {
            //     fbq('track', 'InitiateCheckout');
            // }
        });
    });

    /* ======================================================================
       9. DETECÇÃO DE DISPOSITIVO (para ajustes de UX)
       ====================================================================== */

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        document.body.classList.add('mobile-device');

        // Em mobile, remover efeito hover de cards (melhor usar :active no CSS)
        console.log('Mobile device detected');
    } else {
        document.body.classList.add('desktop-device');
    }

    /* ======================================================================
       11. CONSOLE LOG DE BOAS-VINDAS
       ====================================================================== */

    console.log(
        '%c200 Receitas de Café da Manhã',
        'font-size: 20px; font-weight: bold; color: #2CAC43;'
    );
    console.log(
        '%cLanding Page carregada com sucesso!',
        'font-size: 14px; color: #FF6B35;'
    );
    console.log('Todas as funcionalidades ativas:');
    console.log('✓ Contador regressivo');
    console.log('✓ FAQ Accordion');
    console.log('✓ Smooth scroll');
    console.log('✓ Lazy loading');
    console.log('✓ Event tracking');
    console.log('✓ Performance optimizations');

});

/* ==========================================================================
   12. SERVICE WORKER (Para futuras otimizações de cache)
   ========================================================================== */

// Registrar service worker para cache offline (se disponível)
if ('serviceWorker' in navigator) {
    // Descomente quando criar o service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registrado', reg))
    //     .catch(err => console.log('Service Worker erro', err));
}
