/* ==========================================================================
   150 DINÂMICAS NATALINAS - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   ========================================================================== */

// Executar quando o DOM estiver pronto
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
                'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
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
       2. CONTADOR REGRESSIVO (Até o final do dia)
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
                // Se passou da meia-noite, resetar para o próximo dia
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(23, 59, 59, 999);
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
       4. SMOOTH SCROLL PARA ÂNCORAS
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
       5. POPUP OFERTA EXCLUSIVA
       ====================================================================== */

    const btnBasicPlan = document.getElementById('btn-basic-plan');
    const popupOffer = document.getElementById('popup-offer');
    const popupClose = document.getElementById('popup-close');

    console.log('Popup Elements:', {
        btnBasicPlan: btnBasicPlan,
        popupOffer: popupOffer,
        popupClose: popupClose
    });

    // Abrir popup ao clicar no botão do Plano Básico
    if (btnBasicPlan && popupOffer) {
        btnBasicPlan.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão Plano Básico clicado!');
            popupOffer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Previne scroll
            console.log('Popup aberto');
        });
    } else {
        console.error('Elementos do popup não encontrados!');
    }

    // Fechar popup ao clicar no X
    if (popupClose && popupOffer) {
        popupClose.addEventListener('click', function() {
            console.log('Botão fechar clicado');
            popupOffer.classList.remove('active');
            document.body.style.overflow = ''; // Restaura scroll
        });
    }

    // Fechar popup ao clicar fora do conteúdo
    if (popupOffer) {
        popupOffer.addEventListener('click', function(e) {
            if (e.target === popupOffer) {
                console.log('Clicou fora do popup');
                popupOffer.classList.remove('active');
                document.body.style.overflow = ''; // Restaura scroll
            }
        });
    }

    /* ======================================================================
       6. CONSOLE LOG DE BOAS-VINDAS
       ====================================================================== */

    console.log(
        '%c150 Dinâmicas Natalinas 🎄',
        'font-size: 20px; font-weight: bold; color: #165016;'
    );
    console.log(
        '%cLanding Page carregada com sucesso!',
        'font-size: 14px; color: #C41E3A;'
    );
    console.log('Funcionalidades ativas:');
    console.log('✅ Data atual auto-atualização');
    console.log('✅ Contador regressivo (até o final do dia)');
    console.log('✅ FAQ Accordion');
    console.log('✅ Smooth scroll');
    console.log('✅ Popup Oferta Exclusiva');
    console.log('🎅 Feliz Natal!');

});
