/* ==========================================================================
   UPSELL PAGE - MISSA EXPLICADA - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       MOSTRAR CTA APÓS TEMPO DE VÍDEO
       ====================================================================== */

    // Configuração: tempo em segundos para mostrar o botão
    const TEMPO_PARA_MOSTRAR_CTA = 90; // 90 segundos = 1 minuto e 30 segundos

    const iframe = document.querySelector('.vimeo-wrapper iframe');
    const progressFill = document.getElementById('progress-fill');
    const ctaButton = document.getElementById('cta-button');
    const playOverlay = document.getElementById('play-overlay');

    if (iframe && ctaButton) {
        // Fallback: Mostrar botão após tempo definido mesmo se o vídeo não carregar
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
                console.log('📹 Duração total do vídeo: ' + duration + ' segundos');
            }).catch(function(error) {
                console.error('❌ Erro ao obter duração:', error);
            });

            // Botão de play overlay - iniciar vídeo com som
            if (playOverlay) {
                playOverlay.addEventListener('click', function() {
                    player.play().then(function() {
                        playOverlay.classList.add('hidden');
                        console.log('✅ Vídeo iniciado');
                    });
                });

                player.on('play', function() {
                    if (playOverlay) {
                        playOverlay.classList.add('hidden');
                    }
                });
            }

            // Função para calcular progresso com easing
            function calculateEasedProgress(currentTime, duration) {
                let realProgress = currentTime / duration;
                let easedProgress;

                if (realProgress <= 0.3) {
                    easedProgress = realProgress * 3.0;
                } else {
                    easedProgress = 0.90 + ((realProgress - 0.3) * 0.143);
                }

                return easedProgress * 100;
            }

            // Monitorar o tempo do vídeo
            player.on('timeupdate', function(data) {
                if (videoDuration > 0 && progressFill) {
                    let progress = calculateEasedProgress(data.seconds, videoDuration);
                    if (progress > 100) progress = 100;
                    progressFill.style.width = progress + '%';
                }

                if (data.seconds >= TEMPO_PARA_MOSTRAR_CTA) {
                    if (ctaButton.style.display !== 'block') {
                        ctaButton.style.display = 'block';
                        ctaButton.style.animation = 'fadeIn 0.5s ease-in';
                        console.log('✅ CTA Button revelado após ' + TEMPO_PARA_MOSTRAR_CTA + ' segundos');
                    }
                }
            });

            // Quando o vídeo terminar
            player.on('ended', function() {
                console.log('✅ Vídeo finalizado');
                if (progressFill) {
                    progressFill.style.width = '100%';
                }
                player.pause();
                player.setCurrentTime(0);
            });

            console.log('✅ Controle de CTA ativo (' + TEMPO_PARA_MOSTRAR_CTA + 's)');
        } catch (error) {
            console.log('⚠️ Erro ao inicializar player Vimeo, usando fallback timer');
        }
    }

    /* ======================================================================
       CONSOLE LOG
       ====================================================================== */

    console.log('%cUPSELL - ANO LITÚRGICO COMPLETO ✝️', 'font-size: 20px; font-weight: bold; color: #663399;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #D4AF37;');

});
