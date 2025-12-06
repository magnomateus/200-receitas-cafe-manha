/* ==========================================================================
   UPSELL PAGE - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       PREVENIR SAÍDA DA PÁGINA
       ====================================================================== */

    let userHasInteracted = false;
    let allowExit = false; // Flag para permitir saída quando clicar no CTA

    // Detectar interação do usuário
    document.addEventListener('click', function() {
        userHasInteracted = true;
    });

    // Alerta ao tentar sair
    window.addEventListener('beforeunload', function(e) {
        if (userHasInteracted && !allowExit) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    // Permitir saída ao clicar no CTA ou no link "Não obrigado"
    const ctaButton = document.getElementById('cta-button');
    const declineLink = document.querySelector('.btn-decline');

    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            allowExit = true;
            console.log('✅ Saída permitida - redirecionando para checkout');
        });
    }

    if (declineLink) {
        declineLink.addEventListener('click', function() {
            allowExit = true;
            console.log('✅ Saída permitida - redirecionando para página de obrigado');
        });
    }

    /* ======================================================================
       MOSTRAR CTA APÓS TEMPO DE VÍDEO
       ====================================================================== */

    // Configuração: tempo em segundos para mostrar o botão
    const TEMPO_PARA_MOSTRAR_CTA = 30; // 30 segundos

    const iframe = document.querySelector('.vimeo-wrapper iframe');
    const ctaButton = document.getElementById('cta-button');

    if (iframe && ctaButton) {
        // Inicializar player do Vimeo
        const player = new Vimeo.Player(iframe);

        // Monitorar o tempo do vídeo
        player.on('timeupdate', function(data) {
            // data.seconds contém o tempo atual do vídeo em segundos
            if (data.seconds >= TEMPO_PARA_MOSTRAR_CTA) {
                // Mostrar o botão com animação
                ctaButton.style.display = 'block';
                ctaButton.style.animation = 'fadeIn 0.5s ease-in';

                console.log('✅ CTA Button revelado após ' + TEMPO_PARA_MOSTRAR_CTA + ' segundos de vídeo!');

                // Remover o listener após mostrar o botão (otimização)
                player.off('timeupdate');
            }
        });

        console.log('✅ Controle de CTA por tempo de vídeo ativo (' + TEMPO_PARA_MOSTRAR_CTA + 's)');
    }

    /* ======================================================================
       CONSOLE LOG
       ====================================================================== */

    console.log('%cUPSELL PAGE 🎁', 'font-size: 20px; font-weight: bold; color: #165016;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #C41E3A;');
    console.log('✅ Exit intent ativo');

});
