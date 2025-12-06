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
                console.log('📹 Duração total do vídeo: ' + duration + ' segundos (' + (duration / 60).toFixed(2) + ' minutos)');
            }).catch(function(error) {
                console.error('❌ Erro ao obter duração:', error);
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

            // Função para calcular progresso com easing (EXTREMAMENTE rápido no início, lento no fim)
            function calculateEasedProgress(currentTime, duration) {
                // Progresso real (0 a 1)
                let realProgress = currentTime / duration;

                // Aplicar easing: EXTREMAMENTE rápido no início (90% da barra), lentíssimo no final (10% restante)
                let easedProgress;

                if (realProgress <= 0.3) {
                    // Primeiros 30% do vídeo = 90% da barra (EXTREMAMENTE RÁPIDO! 🚀)
                    easedProgress = realProgress * 3.0; // 0.3 * 3.0 = 0.90
                } else {
                    // Últimos 70% do vídeo = 10% restante da barra (SUPER LENTO 🐌)
                    easedProgress = 0.90 + ((realProgress - 0.3) * 0.143); // 0.90 + (0.7 * 0.143) ≈ 1.0
                }

                return easedProgress * 100; // Converter para porcentagem
            }

            // Monitorar o tempo do vídeo
            player.on('timeupdate', function(data) {
                // Atualizar barra de progresso customizada
                if (videoDuration > 0 && progressFill) {
                    // Usar progresso com easing
                    let progress = calculateEasedProgress(data.seconds, videoDuration);

                    // Garantir que não ultrapasse 100%
                    if (progress > 100) progress = 100;

                    progressFill.style.width = progress + '%';

                    // Log a cada 10 segundos para não poluir o console
                    if (Math.floor(data.seconds) % 10 === 0) {
                        let realProgress = (data.seconds / videoDuration) * 100;
                        console.log('📊 Progresso Real: ' + realProgress.toFixed(2) + '% | Barra Visual: ' + progress.toFixed(2) + '% | Tempo: ' + data.seconds.toFixed(0) + 's / ' + videoDuration.toFixed(0) + 's');
                    }
                }

                // data.seconds contém o tempo atual do vídeo em segundos
                if (data.seconds >= TEMPO_PARA_MOSTRAR_CTA) {
                    // Mostrar o botão com animação (mas não remover o timeupdate para continuar atualizando a barra)
                    if (ctaButton.style.display !== 'block') {
                        ctaButton.style.display = 'block';
                        ctaButton.style.animation = 'fadeIn 0.5s ease-in';
                        console.log('✅ CTA Button revelado após ' + TEMPO_PARA_MOSTRAR_CTA + ' segundos de vídeo!');
                    }
                }
            });

            // Quando o vídeo terminar, pausar para evitar outro
            player.on('ended', function() {
                console.log('✅ Vídeo finalizado - forçando barra para 100%');
                if (progressFill) {
                    progressFill.style.width = '100%';
                    console.log('📊 Barra de progresso: 100% (vídeo completo)');
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
