/* ==========================================================================
   JOGOS RETRO - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   ========================================================================== */

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       0. BACK REDIRECT - Redireciona ao clicar em voltar
       ====================================================================== */

    (function initBackRedirect() {
        const backRedirectUrl = 'back-redirect/';
        const storageKey = 'jogos_back_redirect_shown';

        // Verificar se já foi redirecionado nesta sessão
        if (sessionStorage.getItem(storageKey)) {
            return;
        }

        // Adicionar estado ao histórico
        history.pushState({ page: 'jogos-main' }, '', window.location.href);

        // Interceptar o botão voltar
        window.addEventListener('popstate', function(event) {
            // Marcar que o redirect foi mostrado
            sessionStorage.setItem(storageKey, 'true');

            // Redirecionar para a página de back redirect
            window.location.href = backRedirectUrl;
        });

        console.log('✅ Back Redirect configurado');
    })();

    /* ======================================================================
       1. DATA ATUAL (auto-atualizacao diaria)
       ====================================================================== */

    function setCurrentDate() {
        const dateElement = document.getElementById('current-date');

        if (dateElement) {
            const today = new Date();
            const day = today.getDate();
            const monthNames = [
                'JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL', 'MAIO', 'JUNHO',
                'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
            ];
            const month = monthNames[today.getMonth()];

            const formattedDate = `${day} DE ${month}`;
            dateElement.textContent = formattedDate;

            console.log('Data da oferta definida:', formattedDate);
        }
    }

    setCurrentDate();

    /* ======================================================================
       2. CONTADOR REGRESSIVO (Ate o final do dia)
       ====================================================================== */

    function startCountdown() {
        const timers = ['timer-main', 'timer-final'];

        function updateTimer() {
            const now = new Date();

            // Calcular o final do dia (23:59:59)
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const distance = endOfDay.getTime() - now.getTime();

            if (distance < 0) {
                // Se passou da meia-noite, resetar para o proximo dia
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(23, 59, 59, 999);
                return;
            }

            // Calcular horas, minutos e segundos
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Formatar com zero a esquerda
            const formattedTime =
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');

            // Atualizar todos os timers
            timers.forEach(timerId => {
                const timerElement = document.getElementById(timerId);
                if (timerElement) {
                    timerElement.textContent = formattedTime;
                }
            });
        }

        // Atualizar a cada segundo
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
       4. SMOOTH SCROLL PARA ANCORAS
       ====================================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorar links vazios ou apenas "#"
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
       5. TRACKING DE EVENTOS (preparado para analytics)
       ====================================================================== */

    function trackCTAClick(ctaName) {
        console.log('CTA Clicked:', ctaName);
    }

    // Adicionar tracking em todos os CTAs
    const ctaButtons = document.querySelectorAll('.btn-cta, .btn-cta-main, .btn-cta-final');
    ctaButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const ctaName = this.textContent.trim();
            trackCTAClick(ctaName);
        });
    });

    /* ======================================================================
       6. POPUP OFERTA EXCLUSIVA
       ====================================================================== */

    // Funcao para abrir popup
    function openPopup() {
        const popupOffer = document.getElementById('popup-offer');
        if (popupOffer) {
            console.log('Abrindo popup...');
            popupOffer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Popup aberto com sucesso!');
        } else {
            console.error('popup-offer nao encontrado!');
        }
    }

    // Funcao para fechar popup
    function closePopup() {
        const popupOffer = document.getElementById('popup-offer');
        if (popupOffer) {
            console.log('Fechando popup...');
            popupOffer.style.display = 'none';
            document.body.style.overflow = '';
            console.log('Popup fechado com sucesso!');
        }
    }

    // Configurar botao do Plano Basico
    const btnBasicPlan = document.getElementById('btn-basic-plan');
    if (btnBasicPlan) {
        console.log('Botao Plano Basico encontrado!');
        btnBasicPlan.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clique no botao detectado!');
            openPopup();
        });
    } else {
        console.error('btn-basic-plan nao encontrado!');
    }

    // Configurar botao de fechar (X)
    const popupClose = document.getElementById('popup-close');
    if (popupClose) {
        console.log('Botao fechar encontrado!');
        popupClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botao X clicado!');
            closePopup();
        });
    } else {
        console.error('popup-close nao encontrado!');
    }

    // Fechar ao clicar fora do popup
    const popupOverlay = document.getElementById('popup-offer');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                console.log('Clicou fora do conteudo!');
                closePopup();
            }
        });
    }

    /* ======================================================================
       7. REMOVER # DA URL
       ====================================================================== */

    // Remove o # da URL automaticamente
    if (window.location.hash === '#') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    // Previne que o # apareca ao clicar em links vazios
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#') {
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    });

    /* ======================================================================
       8. CONSOLE LOG DE BOAS-VINDAS
       ====================================================================== */

    console.log(
        '%cPack de Jogos para Celular',
        'font-size: 20px; font-weight: bold; color: #DC2626;'
    );
    console.log(
        '%cLanding Page carregada com sucesso!',
        'font-size: 14px; color: #22C55E;'
    );
    console.log('Funcionalidades ativas:');
    console.log('✅ Back Redirect (ao clicar voltar)');
    console.log('✅ Data atual auto-atualizacao');
    console.log('✅ Contador regressivo (ate o final do dia)');
    console.log('✅ FAQ Accordion');
    console.log('✅ Smooth scroll');
    console.log('✅ Popup Oferta Exclusiva');
    console.log('✅ URL limpa (sem # no final)');
    console.log('✅ Carrossel de Provas Sociais');
    console.log('📱 +100 Jogos no seu celular!');

});

/* ==========================================================================
   10. CARROSSEL DE PROVAS SOCIAIS
   ========================================================================== */

let currentSlide = 0;

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0) return;

    const previousSlide = currentSlide;

    // Adiciona classe de saída no slide atual
    slides[previousSlide].classList.add('exit');
    slides[previousSlide].classList.remove('active');
    dots[previousSlide].classList.remove('active');

    currentSlide += direction;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    // Ativa o próximo slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Remove classe de saída após a transição
    setTimeout(function() {
        slides[previousSlide].classList.remove('exit');
    }, 500);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0 || index === currentSlide) return;

    const previousSlide = currentSlide;

    slides[previousSlide].classList.add('exit');
    slides[previousSlide].classList.remove('active');
    dots[previousSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    setTimeout(function() {
        slides[previousSlide].classList.remove('exit');
    }, 500);
}

// Auto-play do carrossel (troca a cada 3 segundos)
setInterval(function() {
    moveCarousel(1);
}, 3000);
