/* Controle remoto de checkout — Manual da Horta em Casa
   Servido em: https://receitinhaspratodahora.shop/control/horta.js
   - "enabled": false  => guarda INERTE (comportamento normal em todo lugar).
   - "enabled": true   => num CLONE (outro domínio), os botões de checkout passam
     a apontar para "checkout" (recuperação de tráfego). No domínio oficial não
     tem efeito (o guarda sai antes).
   Publicar: editar aqui -> commit -> push -> git pull no servidor. */
window.__HORTA = {
  "enabled": false,
  "checkout": "https://visplatform.pro/checkout-fast/manual-da-horta-premium",
  "checkoutBasico": "https://visplatform.pro/checkout-fast/manual-da-horta-basico"
};
