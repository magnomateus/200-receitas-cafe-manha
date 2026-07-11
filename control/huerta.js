/* Control remoto de checkout — Manual de la Huerta en Casa (ES)
   Servido en: https://receitinhaspratodahora.shop/control/huerta.js
   - "enabled": false  => guarda INERTE (comportamiento normal).
   - "enabled": true   => en un CLON (otro dominio), los botones de checkout
     pasan a apuntar a "checkout". En el dominio oficial no tiene efecto. */
window.__HUERTA = {
  "enabled": false,
  "checkout": "https://pay.hotmart.com/P106697123R?bid=1783741532868",
  "checkoutBasico": "https://pay.hotmart.com/G106697097V"
};
