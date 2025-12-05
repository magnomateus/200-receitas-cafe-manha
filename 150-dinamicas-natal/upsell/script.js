/* ==========================================================================
   UPSELL PAGE - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       COUNTDOWN - 5 MINUTOS
       ====================================================================== */

    function startCountdown() {
        const countdownElement = document.getElementById('countdown');

        if (!countdownElement) return;

        // 5 minutos em segundos
        let timeLeft = 5 * 60;

        function updateCountdown() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            // Formatar com zero à esquerda
            const formattedTime =
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');

            countdownElement.textContent = formattedTime;

            // Diminuir tempo
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                // Redirecionar quando acabar o tempo
                window.location.href = 'https://receitinhaspratodahora.shop/150-dinamicas-natal/obrigado.html';
            }
        }

        // Atualizar a cada segundo
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    startCountdown();

    /* ======================================================================
       PREVENIR SAÍDA DA PÁGINA
       ====================================================================== */

    let userHasInteracted = false;

    // Detectar interação do usuário
    document.addEventListener('click', function() {
        userHasInteracted = true;
    });

    // Alerta ao tentar sair
    window.addEventListener('beforeunload', function(e) {
        if (userHasInteracted) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    /* ======================================================================
       CONSOLE LOG
       ====================================================================== */

    console.log('%cUPSELL PAGE 🎁', 'font-size: 20px; font-weight: bold; color: #FFD700;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #00ff00;');
    console.log('✅ Countdown iniciado (5 minutos)');
    console.log('✅ Exit intent ativo');

});
