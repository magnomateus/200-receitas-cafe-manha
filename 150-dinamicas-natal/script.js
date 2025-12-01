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
       2. CONTADOR REGRESSIVO (15 minutos) - Usado em outras seções
       ====================================================================== */

    function startCountdown() {
        const timers = ['timer-main', 'timer-final'];

        // FORÇAR 15 minutos - limpar localStorage antigo
        const FIFTEEN_MINUTES = 15 * 60 * 1000;

        // Verificar se já existe um tempo salvo no localStorage
        let endTime = localStorage.getItem('countdownEndTime_Natal');

        // Se não existe OU se é maior que 15 minutos (limpeza de valores antigos)
        if (!endTime || (parseInt(endTime) - new Date().getTime()) > FIFTEEN_MINUTES) {
            // Criar novo countdown de 15 minutos
            endTime = new Date().getTime() + FIFTEEN_MINUTES;
            localStorage.setItem('countdownEndTime_Natal', endTime);
            console.log('Countdown resetado para 15 minutos');
        }

        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                // Se o tempo acabou, reiniciar
                endTime = new Date().getTime() + FIFTEEN_MINUTES;
                localStorage.setItem('countdownEndTime_Natal', endTime);
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
    console.log('✅ Contador regressivo (15 minutos)');
    console.log('✅ FAQ Accordion');
    console.log('✅ Smooth scroll');
    console.log('🎅 Feliz Natal!');

});
