/* ==========================================================================
   UPSELL PAGE - MISSA EXPLICADA - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* ======================================================================
       CONFIGURAÇÕES
       ====================================================================== */

    // Tempo (em segundos) para mostrar o botão de CTA do upsell
    const TEMPO_PARA_MOSTRAR_CTA = 150; // 150 segundos = 2 minutos e 30 segundos

    // Tempo (em segundos) APÓS o CTA aparecer para mostrar o botão de recusa
    const SEGUNDOS_PARA_BOTAO_RECUSA = 15;

    // >>> SUBSTITUIR pela URL da área de membros / acesso ao Missa Explicada <<<
    const URL_ACESSO_MISSA = 'PLACEHOLDER_URL_ACESSO_MISSA';

    const iframe = document.querySelector('.vimeo-wrapper iframe');
    const progressFill = document.getElementById('progress-fill');
    const ctaButton = document.getElementById('cta-button');
    const playOverlay = document.getElementById('play-overlay');
    const declineButton = document.getElementById('decline-button');
    const downsellModal = document.getElementById('downsell-modal');
    const downsellDeclineFinal = document.getElementById('downsell-decline-final');

    /* ======================================================================
       REVELAÇÃO DO CTA E DO BOTÃO DE RECUSA
       ====================================================================== */

    let ctaRevealed = false;
    let declineRevealed = false;

    function revealDeclineButton() {
        if (declineRevealed || !declineButton) return;
        declineRevealed = true;
        declineButton.style.display = 'block';
        declineButton.style.animation = 'fadeIn 0.5s ease-in';
        console.log('✅ Botão de recusa revelado (' + SEGUNDOS_PARA_BOTAO_RECUSA + 's após o CTA)');
    }

    function revealCTA() {
        if (ctaRevealed || !ctaButton) return;
        ctaRevealed = true;
        ctaButton.style.display = 'block';
        ctaButton.style.animation = 'fadeIn 0.5s ease-in, pulse-btn 2s ease-in-out 0.5s infinite';
        // Scroll suave para revelar o botão
        setTimeout(function() {
            ctaButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        console.log('✅ CTA Button revelado');

        // Agendar botão de recusa para 15s depois
        setTimeout(revealDeclineButton, SEGUNDOS_PARA_BOTAO_RECUSA * 1000);
    }

    /* ======================================================================
       MOSTRAR CTA APÓS TEMPO DE VÍDEO
       ====================================================================== */

    if (iframe && ctaButton) {
        // Fallback: Mostrar botão após tempo definido mesmo se o vídeo não carregar
        setTimeout(function() {
            revealCTA();
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
                    revealCTA();
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
       DOWNSELL - MODAL DE OFERTA FINAL (R$27)
       ====================================================================== */

    // Abrir o modal de downsell ao clicar no botão de recusa do upsell
    if (declineButton && downsellModal) {
        declineButton.addEventListener('click', function() {
            downsellModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('✅ Modal de downsell exibido');
        });
    }

    // Recusa final: seguir para a área de acesso do Missa Explicada
    if (downsellDeclineFinal) {
        downsellDeclineFinal.addEventListener('click', function() {
            if (URL_ACESSO_MISSA && URL_ACESSO_MISSA !== 'PLACEHOLDER_URL_ACESSO_MISSA') {
                window.location.href = URL_ACESSO_MISSA;
            } else {
                console.warn('⚠️ URL_ACESSO_MISSA ainda não configurada no script.js');
                alert('Link de acesso ainda não configurado.');
            }
        });
    }

    /* ======================================================================
       CONSOLE LOG
       ====================================================================== */

    console.log('%cUPSELL - ANO LITÚRGICO COMPLETO ✝️', 'font-size: 20px; font-weight: bold; color: #663399;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #D4AF37;');

});
