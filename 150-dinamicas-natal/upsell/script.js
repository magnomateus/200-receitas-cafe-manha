/* ==========================================================================
   UPSELL PAGE - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       EXIT INTENT DESABILITADO
       ====================================================================== */

    // Exit intent foi removido para melhor experiência do usuário
    console.log('✅ Exit intent desabilitado - navegação livre');

    /* ======================================================================
       MOSTRAR CTA APÓS TEMPO DE VÍDEO
       ====================================================================== */

    // Configuração: tempo em segundos para mostrar o botão
    const TEMPO_PARA_MOSTRAR_CTA = 100; // 100 segundos = 1 minuto e 40 segundos

    const iframe = document.querySelector('.vimeo-wrapper iframe');
    const progressFill = document.getElementById('progress-fill');
    const ctaButton = document.getElementById('cta-button');
    const playOverlay = document.getElementById('play-overlay');

    if (iframe && ctaButton) {
        // Fallback: Mostrar botão após 30 segundos mesmo se o vídeo não carregar
        setTimeout(function() {
            if (ctaButton.style.display === 'none') {
                ctaButton.style.display = 'block';
                ctaButton.style.animation = 'fadeIn 0.5s ease-in';
                console.log('✅ CTA Button revelado via fallback timer');
            }
        }, TEMPO_PARA_MOSTRAR_CTA * 1000);

        // Tentar usar API do Vimeo
        try {
            const player = new Vimeo.Player(iframe, {
                outro: 'nothing'
            });

            // Variável para armazenar a duração do vídeo
            let videoDuration = 0;

            // Obter duração do vídeo
            player.getDuration().then(function(duration) {
                videoDuration = duration;
                console.log('📹 Duração do vídeo: ' + duration + ' segundos');
            });

            // Botão de play overlay - iniciar vídeo com som
            if (playOverlay) {
                playOverlay.addEventListener('click', function() {
                    player.play().then(function() {
                        playOverlay.classList.add('hidden');
                        console.log('✅ Vídeo iniciado com som');
                    });
                });

                // Esconder overlay quando o vídeo começar a tocar
                player.on('play', function() {
                    if (playOverlay) {
                        playOverlay.classList.add('hidden');
                    }
                });
            }

            // Monitorar o tempo do vídeo
            player.on('timeupdate', function(data) {
                // Atualizar barra de progresso customizada
                if (videoDuration > 0 && progressFill) {
                    const progress = (data.seconds / videoDuration) * 100;
                    progressFill.style.width = progress + '%';
                }

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

            // Quando o vídeo terminar, pausar para evitar outro
            player.on('ended', function() {
                console.log('✅ Vídeo finalizado - pausando para evitar outro');
                if (progressFill) {
                    progressFill.style.width = '100%';
                }
                player.pause();
            });

            console.log('✅ Controle de CTA por tempo de vídeo ativo (' + TEMPO_PARA_MOSTRAR_CTA + 's)');
        } catch (error) {
            console.log('⚠️ Erro ao inicializar player Vimeo, usando fallback timer');
        }
    }

    /* ======================================================================
       CONSOLE LOG
       ====================================================================== */

    console.log('%cUPSELL PAGE 🎁', 'font-size: 20px; font-weight: bold; color: #165016;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #C41E3A;');

});
