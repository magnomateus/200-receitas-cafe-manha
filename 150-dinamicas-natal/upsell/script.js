/* ==========================================================================
   UPSELL PAGE - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

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

    console.log('%cUPSELL PAGE 🎁', 'font-size: 20px; font-weight: bold; color: #165016;');
    console.log('%cPágina carregada!', 'font-size: 14px; color: #C41E3A;');
    console.log('✅ Exit intent ativo');

});
