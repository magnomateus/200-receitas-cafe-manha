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

    // Função para abrir popup
    function openPopup() {
        const popupOffer = document.getElementById('popup-offer');
        if (popupOffer) {
            console.log('Abrindo popup...');
            popupOffer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Popup aberto com sucesso!');
        } else {
            console.error('popup-offer não encontrado!');
        }
    }

    // Função para fechar popup
    function closePopup() {
        const popupOffer = document.getElementById('popup-offer');
        if (popupOffer) {
            console.log('Fechando popup...');
            popupOffer.style.display = 'none';
            document.body.style.overflow = '';
            console.log('Popup fechado com sucesso!');
        }
    }

    // Configurar botão do Plano Básico
    const btnBasicPlan = document.getElementById('btn-basic-plan');
    if (btnBasicPlan) {
        console.log('Botão Plano Básico encontrado!');
        btnBasicPlan.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clique no botão detectado!');
            openPopup();
        });
    } else {
        console.error('btn-basic-plan não encontrado!');
    }

    // Configurar botão de fechar (X)
    const popupClose = document.getElementById('popup-close');
    if (popupClose) {
        console.log('Botão fechar encontrado!');
        popupClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão X clicado!');
            closePopup();
        });
    } else {
        console.error('popup-close não encontrado!');
    }

    // Fechar ao clicar fora do popup
    const popupOverlay = document.getElementById('popup-offer');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                console.log('Clicou fora do conteúdo!');
                closePopup();
            }
        });
    }

    /* ======================================================================
       6. REMOVER # DA URL
       ====================================================================== */

    // Remove o # da URL automaticamente
    if (window.location.hash === '#') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    // Previne que o # apareça ao clicar em links vazios
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#') {
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    });

    /* ======================================================================
       7. FORÇAR REDIRECIONAMENTO DO CTA FINAL PARA #PLANO-PREMIUM
       ====================================================================== */

    // Prevenir que scripts externos (como Utmify) modifiquem o botão CTA final
    const btnCtaFinal = document.querySelector('.btn-cta-final');
    if (btnCtaFinal) {
        // Forçar href correto
        btnCtaFinal.setAttribute('href', '#plano-premium');

        // Observar mudanças no atributo href
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

        console.log('✅ CTA Final protegido - sempre redirecionará para #plano-premium');
    }

    /* ======================================================================
       8. CONSOLE LOG DE BOAS-VINDAS
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
    console.log('✅ URL limpa (sem # no final)');
    console.log('✅ CTA Final protegido para #plano-premium');
    console.log('✅ Back redirect ativo');
    console.log('🎅 Feliz Natal!');

    /* ======================================================================
       9. BACK REDIRECT - Redireciona para página de downsell ao clicar em voltar
       ====================================================================== */

    function initBackRedirect() {
        // URL da página de downsell (back redirect)
        const backRedirectUrl = 'back-redirect/';

        // Verificar se já veio do back redirect (evitar loop)
        const cameFromBackRedirect = sessionStorage.getItem('came_from_back_redirect');
        if (cameFromBackRedirect) {
            console.log('Usuário veio do back redirect, não redirecionar novamente');
            return;
        }

        // Adicionar estados ao histórico para interceptar o botão voltar
        for (let i = 0; i < 3; i++) {
            history.pushState({ page: 'main' }, '', window.location.href);
        }

        // Interceptar o evento popstate (quando o usuário clica em voltar)
        window.addEventListener('popstate', function(event) {
            // Marcar que o redirect foi acionado
            sessionStorage.setItem('back_redirect_triggered', 'true');

            // Redirecionar para a página de downsell
            window.location.href = backRedirectUrl;
        });

        console.log('🎄 Back redirect configurado para:', backRedirectUrl);
    }

    initBackRedirect();

});
