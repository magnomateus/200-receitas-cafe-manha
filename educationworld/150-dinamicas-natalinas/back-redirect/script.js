/**
 * BACK REDIRECT - Script de Downsell - 150 Dinâmicas Natalinas
 *
 * Funcionalidades:
 * 1. Countdown timer de 10 minutos
 * 2. Bloqueio do botão voltar (back redirect)
 * 3. Tracking de eventos
 */

(function() {
    'use strict';

    // =========================================================================
    // CONFIGURAÇÕES
    // =========================================================================

    const CONFIG = {
        timerMinutes: 10,           // Tempo do countdown em minutos
        timerStorageKey: 'dinamicas_backredirect_timer_end',
        declineUrl: 'https://www.google.com',  // URL ao recusar a oferta
        checkoutUrl: 'https://pay.lowify.com.br/checkout?product_id=pgKFZo'  // URL do checkout downsell
    };

    // =========================================================================
    // COUNTDOWN TIMER
    // =========================================================================

    function initCountdown() {
        const timerDisplay = document.getElementById('countdown');
        if (!timerDisplay) return;

        // Verificar se já existe um timer salvo
        let endTime = localStorage.getItem(CONFIG.timerStorageKey);

        if (!endTime || parseInt(endTime) < Date.now()) {
            // Criar novo timer
            endTime = Date.now() + (CONFIG.timerMinutes * 60 * 1000);
            localStorage.setItem(CONFIG.timerStorageKey, endTime);
        }

        function updateTimer() {
            const now = Date.now();
            const remaining = parseInt(endTime) - now;

            if (remaining <= 0) {
                timerDisplay.textContent = '00:00';
                // Timer expirou - mostrar urgência máxima
                timerDisplay.style.color = '#c41e3a';
                timerDisplay.style.animation = 'none';
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            timerDisplay.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Atualizar a cada segundo
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // =========================================================================
    // BACK BUTTON PREVENTION (Back Redirect Logic)
    // =========================================================================

    function initBackRedirect() {
        // Adicionar estados ao histórico para interceptar o botão voltar

        // Push múltiplos estados para garantir que funcione
        for (let i = 0; i < 3; i++) {
            history.pushState({ page: 'back-redirect' }, '', window.location.href);
        }

        // Interceptar o evento popstate (quando o usuário clica em voltar)
        window.addEventListener('popstate', function(event) {
            // Re-adicionar estados para manter o usuário na página
            history.pushState({ page: 'back-redirect' }, '', window.location.href);

            // Rolar para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Destacar a oferta
            highlightOffer();
        });
    }

    // =========================================================================
    // DESTAQUE DA OFERTA
    // =========================================================================

    function highlightOffer() {
        const offerCard = document.querySelector('.offer-card');
        if (!offerCard) return;

        // Adicionar efeito de destaque temporário
        offerCard.style.transition = 'all 0.3s ease';
        offerCard.style.transform = 'scale(1.02)';
        offerCard.style.boxShadow = '0 15px 50px rgba(196, 30, 58, 0.4)';

        setTimeout(() => {
            offerCard.style.transform = 'scale(1)';
            offerCard.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
        }, 500);
    }

    // =========================================================================
    // LINK DE RECUSA
    // =========================================================================

    function initDeclineLink() {
        const declineLink = document.getElementById('decline-link');
        if (!declineLink) return;

        declineLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Limpar o timer do localStorage
            localStorage.removeItem(CONFIG.timerStorageKey);

            // Redirecionar para fora
            window.location.href = CONFIG.declineUrl;
        });
    }

    // =========================================================================
    // TRACKING DE CLIQUES NO CTA
    // =========================================================================

    function initCTATracking() {
        const ctaButton = document.getElementById('cta-button');
        if (!ctaButton) return;

        ctaButton.addEventListener('click', function() {
            // Limpar o timer quando clicar no CTA
            localStorage.removeItem(CONFIG.timerStorageKey);

            // Track Utmify (se disponível)
            if (typeof utmify !== 'undefined') {
                utmify.track('back_redirect_cta_click');
            }
        });
    }

    // =========================================================================
    // PREVENIR SAÍDA DA PÁGINA (Exit Intent)
    // =========================================================================

    function initExitIntent() {
        let exitIntentShown = false;

        document.addEventListener('mouseleave', function(e) {
            // Só dispara quando o mouse sai pela parte superior
            if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;

                // Destacar a oferta
                highlightOffer();

                // Rolar suavemente para o topo
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    function onReady() {
        initCountdown();
        initBackRedirect();
        initDeclineLink();
        initCTATracking();
        initExitIntent();

        console.log('🎄 Back Redirect - 150 Dinâmicas Natalinas initialized');
    }

    // Iniciar
    init();

})();
