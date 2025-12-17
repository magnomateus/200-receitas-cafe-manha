/* ==========================================================================
   JOGOS RETRO - LANDING PAGE
   JavaScript - Funcionalidades Interativas
   ========================================================================== */

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {

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
            e.stopPropagation();
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
       8. FORCAR REDIRECIONAMENTO DO CTA FINAL PARA #PLANO-PREMIUM
       ====================================================================== */

    // Prevenir que scripts externos (como Utmify) modifiquem o botao CTA final
    const btnCtaFinal = document.querySelector('.btn-cta-final');
    if (btnCtaFinal) {
        // Forcar href correto
        btnCtaFinal.setAttribute('href', '#plano-premium');

        // Observar mudancas no atributo href
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    const currentHref = btnCtaFinal.getAttribute('href');
                    if (currentHref !== '#plano-premium') {
                        btnCtaFinal.setAttribute('href', '#plano-premium');
                        console.log('CTA Final href restaurado para #plano-premium');
                    }
                }
            });
        });

        observer.observe(btnCtaFinal, {
            attributes: true,
            attributeFilter: ['href']
        });

        console.log('CTA Final protegido - sempre redirecionara para #plano-premium');
    }

    /* ======================================================================
       9. CONSOLE LOG DE BOAS-VINDAS
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
    console.log('✅ Data atual auto-atualizacao');
    console.log('✅ Contador regressivo (ate o final do dia)');
    console.log('✅ FAQ Accordion');
    console.log('✅ Smooth scroll');
    console.log('✅ Popup Oferta Exclusiva');
    console.log('✅ URL limpa (sem # no final)');
    console.log('✅ CTA Final protegido para #plano-premium');
    console.log('📱 +100 Jogos no seu celular!');

});
