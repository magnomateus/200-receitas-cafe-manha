/* ============================================================
   AREA DE MEMBROS - The Mass Explained (EN)

   Tudo o que costuma mudar esta aqui no topo: a lista do material
   e o e-mail de suporte. O resto e so o portao e a montagem dos
   cartoes, e nao precisa ser tocado para trocar um PDF.
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. O MATERIAL

     Titulos e descricoes vieram da propria pagina de vendas
     (themassexplained/index.html), palavra por palavra: o que a
     area de membros entrega tem de ser o que o anuncio promete.

     As capas tambem sao as mesmas da pagina de vendas, e a ordem
     bate - bono-1 e "The Value of Silence" la, capa-bonus-1 aqui.

     PARA ADICIONAR UM MATERIAL: acrescente um objeto nesta lista.
     PARA TROCAR UM PDF: ponha o arquivo em files/ com o nome que
     esta em "arquivo". Nada mais.
     ---------------------------------------------------------- */
  var BIBLIOTECA = [
    {
      principal: true,
      titulo: 'The Mass Explained',
      desc: 'The complete ebook: every moment of the Holy Mass, explained in plain language.',
      capa: 'assets/capa-principal.webp',
      arquivo: 'files/the-mass-explained.pdf'
    },
    {
      titulo: 'The Value of Silence',
      desc: 'Discover the importance of silence in prayer and in the spiritual life.',
      capa: 'assets/capa-bonus-1.webp',
      arquivo: 'files/bonus-the-value-of-silence.pdf'
    },
    {
      titulo: 'Guide to Confession',
      desc: 'A step-by-step guide to a complete and sincere confession.',
      capa: 'assets/capa-bonus-2.webp',
      arquivo: 'files/bonus-guide-to-confession.pdf'
    },
    {
      titulo: 'Eucharistic Prayers',
      desc: 'The essential prayers for before and after receiving Holy Communion.',
      capa: 'assets/capa-bonus-3.webp',
      arquivo: 'files/bonus-eucharistic-prayers.pdf'
    },
    {
      titulo: 'Postures at Mass',
      desc: 'When to sit, stand and kneel during the Mass.',
      capa: 'assets/capa-bonus-4.webp',
      arquivo: 'files/bonus-postures-at-mass.pdf'
    },
    {
      titulo: 'The Old and New Testament',
      desc: 'Understand how the two testaments come together in the liturgy.',
      capa: 'assets/capa-bonus-5.webp',
      arquivo: 'files/bonus-old-and-new-testament.pdf'
    },
    {
      titulo: 'Psalms Explained',
      desc: 'A profound and inspiring guide to understanding and praying the Psalms.',
      capa: 'assets/capa-bonus-6.webp',
      arquivo: 'files/bonus-psalms-explained.pdf'
    }
  ];

  /* ----------------------------------------------------------
     2. SUPORTE

     Enquanto for o marcador, o bloco de ajuda fica escondido:
     e melhor nao ter bloco do que ter um que manda o cliente de
     ingles para o suporte do espanhol. Troque pelo endereco certo
     e ele aparece sozinho.
     ---------------------------------------------------------- */
  var EMAIL_SUPORTE = 'PREENCHER_EMAIL_SUPORTE_EN';

  /* ----------------------------------------------------------
     3. MEMORIA DO E-MAIL

     localStorage pode explodir (aba privada, cookies bloqueados)
     ou voltar vazio. Entao toda leitura e escrita vai dentro de
     try/catch, e existe uma copia na memoria: se o navegador nao
     deixar guardar, o cliente ainda usa a pagina normalmente -
     so vai ter de digitar o e-mail de novo na proxima visita.
     ---------------------------------------------------------- */
  var CHAVE = 'tme_email';
  var naMemoria = null;

  function leEmail() {
    if (naMemoria) return naMemoria;
    try {
      return window.localStorage.getItem(CHAVE) || null;
    } catch (e) {
      return null;
    }
  }

  function guardaEmail(valor) {
    naMemoria = valor;
    try {
      if (valor) window.localStorage.setItem(CHAVE, valor);
      else window.localStorage.removeItem(CHAVE);
    } catch (e) {
      /* sem persistencia; a copia na memoria segura esta visita */
    }
  }

  // Formato, nao existencia. Nao ha conferencia contra lista de
  // compradores: foi o pedido, e esta avisado no cabecalho do HTML.
  function emailValido(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  /* ----------------------------------------------------------
     4. CARTOES
     ---------------------------------------------------------- */
  function montaCartao(item) {
    var cartao = document.createElement('article');
    cartao.className = 'item';

    var capa = document.createElement('div');
    capa.className = 'item-capa';
    var img = document.createElement('img');
    img.src = item.capa;
    img.alt = item.titulo;
    img.loading = 'lazy';
    // capa que nao carrega nao deve deixar um icone quebrado na tela
    img.onerror = function () { capa.hidden = true; };
    capa.appendChild(img);

    var corpo = document.createElement('div');
    corpo.className = 'item-corpo';

    var selo = document.createElement('span');
    selo.className = 'selo';
    selo.textContent = item.principal ? 'Your ebook' : 'Bonus';
    corpo.appendChild(selo);

    var h = document.createElement('h3');
    h.textContent = item.titulo;
    corpo.appendChild(h);

    var p = document.createElement('p');
    p.className = 'item-desc';
    p.textContent = item.desc;
    corpo.appendChild(p);

    var acoes = document.createElement('div');
    acoes.className = 'item-acoes';

    var ler = document.createElement('a');
    ler.className = 'botao botao-ouro';
    ler.href = item.arquivo;
    ler.target = '_blank';
    ler.rel = 'noopener';
    ler.textContent = 'Read';

    var baixar = document.createElement('a');
    baixar.className = 'botao botao-claro';
    baixar.href = item.arquivo;
    baixar.setAttribute('download', '');
    baixar.textContent = 'Download';

    acoes.appendChild(ler);
    acoes.appendChild(baixar);
    corpo.appendChild(acoes);

    cartao.appendChild(capa);
    cartao.appendChild(corpo);

    // guardo as pecas que o teste de existencia do arquivo precisa mexer
    cartao.__pecas = { selo: selo, acoes: acoes, ler: ler, baixar: baixar };
    return cartao;
  }

  /* Desliga o cartao de um arquivo que ainda nao foi enviado, em vez
     de deixar o cliente clicar e cair num 404. */
  function marcaEmBreve(cartao) {
    var p = cartao.__pecas;
    cartao.classList.add('item-em-breve');
    p.selo.textContent = 'Available soon';
    [p.ler, p.baixar].forEach(function (a) {
      a.removeAttribute('href');
      a.removeAttribute('download');
      a.setAttribute('aria-disabled', 'true');
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }

  /* O arquivo esta no servidor?

     Um HEAD resolve sem baixar o PDF. A regra em caso de duvida: se o
     servidor responder 404/403, o cartao vira "Available soon"; se a
     checagem em si falhar (rede caiu, HEAD bloqueado, pagina aberta
     por file://), o cartao fica LIGADO. Entre esconder um arquivo que
     existe e deixar um clique dar 404, o 404 e o erro que o cliente
     entende e que voce fica sabendo. */
  function confereArquivo(cartao, url) {
    if (!window.fetch) return;
    window.fetch(url, { method: 'HEAD' })
      .then(function (r) { if (!r.ok) marcaEmBreve(cartao); })
      .catch(function () { /* duvida: deixa ligado */ });
  }

  function montaBiblioteca() {
    var principal = document.getElementById('grade-principal');
    var bonus = document.getElementById('grade-bonus');
    if (!principal || !bonus) return;
    principal.textContent = '';
    bonus.textContent = '';

    BIBLIOTECA.forEach(function (item) {
      var cartao = montaCartao(item);
      (item.principal ? principal : bonus).appendChild(cartao);
      confereArquivo(cartao, item.arquivo);
    });
  }

  function montaSuporte() {
    var bloco = document.getElementById('suporte');
    var link = document.getElementById('suporte-link');
    if (!bloco || !link) return;
    if (EMAIL_SUPORTE.indexOf('PREENCHER') !== -1) return;   // segue escondido
    link.href = 'mailto:' + EMAIL_SUPORTE + '?subject=' +
      encodeURIComponent('The Mass Explained - help with my material');
    bloco.hidden = false;
  }

  /* ----------------------------------------------------------
     5. AS DUAS TELAS
     ---------------------------------------------------------- */
  var portao = document.getElementById('portao');
  var biblioteca = document.getElementById('biblioteca');
  var montada = false;

  function mostraBiblioteca(email) {
    var alvo = document.getElementById('conta-email');
    if (alvo) alvo.textContent = email;
    if (!montada) { montaBiblioteca(); montaSuporte(); montada = true; }
    portao.hidden = true;
    biblioteca.hidden = false;
  }

  function mostraPortao() {
    biblioteca.hidden = true;
    portao.hidden = false;
    var campo = document.getElementById('email');
    if (campo) campo.focus();
  }

  /* ----------------------------------------------------------
     6. LIGA TUDO
     ---------------------------------------------------------- */
  var forma = document.getElementById('forma');
  var erro = document.getElementById('erro');

  if (forma) {
    forma.addEventListener('submit', function (e) {
      e.preventDefault();
      var campo = document.getElementById('email');
      var valor = (campo.value || '').trim().toLowerCase();

      if (!emailValido(valor)) {
        erro.textContent = 'Please type a valid email address.';
        erro.hidden = false;
        campo.focus();
        return;
      }

      erro.hidden = true;
      guardaEmail(valor);
      mostraBiblioteca(valor);
    });
  }

  var sair = document.getElementById('sair');
  if (sair) {
    sair.addEventListener('click', function () {
      guardaEmail(null);
      var campo = document.getElementById('email');
      if (campo) campo.value = '';
      mostraPortao();
    });
  }

  // Na carga: quem ja entrou antes nao ve o formulario de novo.
  var guardado = leEmail();
  if (guardado && emailValido(guardado)) mostraBiblioteca(guardado);
  else mostraPortao();
})();
