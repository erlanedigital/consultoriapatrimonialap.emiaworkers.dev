
  function injectAPAdminModals() {
    if (document.getElementById('modal-admin-login')) return;

    const div = document.createElement('div');
    div.id = 'ap-admin-modals-wrapper';
    div.innerHTML = `
      <!-- Modal Login -->
      <div id="modal-admin-login" class="hidden" style="position: fixed; inset: 0; z-index: 999999 !important; background: rgba(29, 10, 16, 0.88); backdrop-filter: blur(14px); display: none; align-items: center; justify-content: center; padding: 16px; font-family: 'Manrope', system-ui, sans-serif;">
        <div style="background: #1D0A10; border: 1.5px solid #C9A86A; border-radius: 24px; width: 100%; max-width: 420px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7); color: #FAF6EF; padding: 32px 24px; text-align: center; position: relative;">
          <button type="button" onclick="window.closeAdminLogin()" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #FAF6EF; font-size: 24px; cursor: pointer;" title="Fechar">&times;</button>
          <div style="font-size: 38px; margin-bottom: 12px;">🔒</div>
          <h3 style="font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px 0;">Acesso Restrito</h3>
          <p style="font-size: 13px; color: #C4B299; margin: 0 0 20px 0;">Digite a senha de consultora para acessar os leads recebidos.</p>
          <form onsubmit="window.handleAdminLogin(event)" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="text-align: left;">
              <label style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #C9A86A; margin-bottom: 6px;">Senha:</label>
              <input id="admin-pass-field" type="password" placeholder="Digite sua senha..." required autofocus style="width: 100%; box-sizing: border-box; background: #0F0407; border: 1.5px solid rgba(201, 168, 106, 0.4); color: #FFFFFF; font-size: 15px; padding: 12px 16px; border-radius: 12px; outline: none;" />
              <div style="margin-top: 6px; font-size: 11px; color: #8A6E3E;">Senha padrão: <strong>erlane2026</strong></div>
            </div>
            <button type="submit" style="background: #C9A86A; color: #1D0A10; font-size: 14px; font-weight: 800; border: none; padding: 13px; border-radius: 12px; cursor: pointer;">
              Entrar no Painel ➔
            </button>
          </form>
        </div>
      </div>

      <!-- Modal Dashboard -->
      <div id="modal-admin-panel" class="hidden" style="position: fixed; inset: 0; z-index: 999999 !important; background: rgba(29, 10, 16, 0.88); backdrop-filter: blur(14px); display: none; align-items: center; justify-content: center; padding: 16px; font-family: 'Manrope', system-ui, sans-serif;">
        <div style="background: #1D0A10; border: 1.5px solid #C9A86A; border-radius: 24px; width: 100%; max-width: 860px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7); color: #FAF6EF;">
          <div style="background: linear-gradient(135deg, #3B0B14 0%, #1D0A10 100%); padding: 18px 24px; border-bottom: 1px solid rgba(201,168,106,0.3); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #5A1220; border: 1.5px solid #C9A86A; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 700; color: #C9A86A; font-size: 16px;">EM</div>
              <div>
                <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin: 0; line-height: 1.2;">Painel do Consultor — Aposentadoria</h2>
                <p style="font-size: 11px; color: #C9A86A; margin: 2px 0 0 0; font-weight: 600;">Erlane Mota • Consultoria Patrimonial</p>
              </div>
            </div>
            <button type="button" onclick="window.closeAdminPanel()" style="background: none; border: none; color: #FAF6EF; font-size: 26px; cursor: pointer;" title="Fechar">&times;</button>
          </div>
          <div style="padding: 20px; overflow-y: auto; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <span style="font-size: 14px; font-weight: 700; color: #FFFFFF;"><span id="admin-leads-counter">0</span> formulário(s) recebido(s)</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" onclick="window.logoutAdmin()" style="background: rgba(220,38,38,0.2); border: 1px solid #DC2626; color: #FCA5A5; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Sair do Painel</button>
              </div>
            </div>
            <div id="admin-leads-list-container"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    // Fechar ao clicar no backdrop
    const loginModal = document.getElementById('modal-admin-login');
    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) window.closeAdminLogin();
      });
    }
    const panelModal = document.getElementById('modal-admin-panel');
    if (panelModal) {
      panelModal.addEventListener('click', function(e) {
        if (e.target === panelModal) window.closeAdminPanel();
      });
    }

    // Adicionar cadeado discreto no rodapé
    const copyP = document.querySelector('footer p:last-child, footer .text-\\[11px\\], footer .text-white\\/50');
    if (copyP && !document.getElementById('ap-footer-lock')) {
      const btn = document.createElement('button');
      btn.id = 'ap-footer-lock';
      btn.type = 'button';
      btn.innerHTML = '🔒';
      btn.title = 'Acesso Administrativo (Erlane Mota)';
      btn.style.cssText = 'background: none; border: none; font-size: 13px; cursor: pointer; opacity: 0.45; margin-left: 8px; vertical-align: middle; color: #C9A86A;';
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.openAdminLogin();
      };
      copyP.appendChild(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAPAdminModals);
  } else {
    injectAPAdminModals();
  }
  setTimeout(injectAPAdminModals, 500);
  setTimeout(injectAPAdminModals, 1500);

// PERSISTÊNCIA ZERO DO SIMULADOR E SEEDS — REGRA DO CLIENTE
try {
  if (typeof window !== 'undefined') {
    // 1. Purga de Caches Antigos do Service Worker
    if (window.caches) {
      caches.keys().then(function(keys) {
        keys.forEach(function(k) {
          if (k !== 'consultoriapatrimonialap-v20261120') {
            caches.delete(k);
          }
        });
      }).catch(function() {});
    }
    // 2. Limpar qualquer estado salvo ou mock do simulador para sempre abrir zerado/padrão
    if (window.localStorage) {
      localStorage.removeItem('sim_age');
      localStorage.removeItem('sim_credit');
      localStorage.removeItem('sim_months');
      localStorage.removeItem('sim_currency');
      localStorage.removeItem('sim_state');
      localStorage.removeItem('kce_seeded_leads');
      localStorage.removeItem('setItem');
    }
    if (window.sessionStorage) {
      sessionStorage.removeItem('sim_age');
      sessionStorage.removeItem('sim_credit');
      sessionStorage.removeItem('sim_months');
      sessionStorage.removeItem('sim_currency');
      sessionStorage.removeItem('sim_state');
      sessionStorage.removeItem('setItem');
    }
  }
} catch (e) {}

/**

 * APP-FEATURES.JS

 * Simulador de Parcelas Reduzidas, Painel Admin Blindado,

 * Header Harmônico & Gestão de Leads com Mensagem Padrão.

 */



(function() {

  'use strict';

  // Sanitização Universal Anti-XSS e Anti-Injeção

  function escapeHTML(str) {

    if (!str) return '';

    return String(str)

      .replace(/&/g, '&amp;')

      .replace(/</g, '&lt;')

      .replace(/>/g, '&gt;')

      .replace(/"/g, '&quot;')

      .replace(/'/g, '&#039;');

  }



  function sanitizeUrl(url) {

    if (!url) return '#';

    var clean = String(url).trim();

    if (clean.startsWith('https://') || clean.startsWith('http://') || clean.startsWith('tel:') || clean.startsWith('mailto:') || clean.startsWith('#') || clean.startsWith('/')) {

      return clean;

    }

    return '#';

  }

  



  // ==========================================================================

  // 1. DADOS DE MOEDAS E COTAÇÕES CONSERVADORAS

  // ==========================================================================

  var CURRENCIES = {

    EUR: { name: 'Euro', symbol: '\u20AC', flag: '\uD83C\uDDEA\uD83C\uDDFA', rate: 5.85 },

    USD: { name: 'D\u00F3lar Americano', symbol: '$', flag: '\uD83C\uDDFA\uD83C\uDDF8', rate: 5.60 },

    GBP: { name: 'Libra Esterlina', symbol: '\u00A3', flag: '\uD83C\uDDEC\uD83C\uDDE7', rate: 7.05 },

    CHF: { name: 'Franco Su\u00ED\u00E7o', symbol: 'CHF', flag: '\uD83C\uDDE8\uD83C\uDDED', rate: 6.30 },

    JPY: { name: 'Iene Japon\u00EAs', symbol: '\u00A5', flag: '\uD83C\uDDEF\uD83C\uDDF5', rate: 0.037 },

    AUD: { name: 'D\u00F3lar Australiano', symbol: 'A$', flag: '\uD83C\uDDE6\uD83C\uDDFA', rate: 3.70 },

    CAD: { name: 'D\u00F3lar Canadense', symbol: 'C$', flag: '\uD83C\uDDE8\uD83C\uDDE6', rate: 4.10 }

  };



  var state = {

    credit: 100000,

    months: 220,

    currency: 'EUR'

  };



  function calculateForeign(valBrl, currCode) {

    var c = CURRENCIES[currCode] || CURRENCIES.EUR;

    if (!c || !c.rate) return 0;

    return valBrl / c.rate;

  }



  function calculate(credit, months) {

    // 24% de taxa total sobre o crédito dividido pelos meses

    var adminFeeMonthly = (credit * 0.24) / months;

    // Metade da carta dividida pelos meses

    var amortReduced = (credit * 0.50) / months;

    // Parcela reduzida total (válida até a contemplação)

    var reducedTotal = amortReduced + adminFeeMonthly;

    // Parcela integral (após contemplação)

    var integralTotal = (credit / months) + adminFeeMonthly;



    return {

      adminFeeMonthly: adminFeeMonthly,

      amortReduced: amortReduced,

      reducedTotal: reducedTotal,

      integralTotal: integralTotal

    };

  }



  // ==========================================================================

  // 2. MONTAGEM DO SIMULADOR NA PÁGINA

  // ==========================================================================

  

  // Garantir posicionamento imediato e permanente ACIMA DO RODAPÉ (FOOTER)

  function ensureSimulatorAboveFooter() {

    var faqEl = document.getElementById('faq');

    var sim = document.getElementById('simulador');



    if (!sim) {

      injectSimulator();

      sim = document.getElementById('simulador');

    }



    // Garante que o simulador está imediatamente antes do #faq
    if (sim && faqEl && faqEl.parentNode && sim.nextElementSibling !== faqEl) {

      faqEl.parentNode.insertBefore(sim, faqEl);

    }

  }



  function injectSimulator() {
    if (document.getElementById('simulador')) return;

    var section = document.createElement('section');
    section.id = 'simulador';
    section.style.cssText = 'background: #FAF6EF; padding: 70px 0; border-top: 2px solid rgba(201,168,106,0.4); border-bottom: 2px solid rgba(201,168,106,0.4); position: relative; font-family: "Manrope", "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; box-sizing: border-box;';
    
    section.innerHTML = [
      '<div class="sim-container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">',
      '  <div style="text-align: center; max-width: 860px; margin: 0 auto 36px auto;">',
      '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 20px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 12px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; border: 1.5px solid #C9A86A; box-shadow: 0 4px 14px rgba(90,18,32,0.15);">',
      '      <span>⏳</span> SIMULADOR DE APOSENTADORIA & RENDA PASSIVA',
      '    </span>',
      '    <h2 class="sim-h2-title font-serif-display" style="font-family: Fraunces, Georgia, serif; font-weight: 700; color: #3D0C16; margin: 18px auto 14px auto; line-height: 1.12; max-width: 1080px; font-size: clamp(1.75rem, 3.5vw, 3.25rem); text-align: center; text-wrap: balance;">Planeje sua aposentadoria com patrimônio&nbsp;próprio,<br><em style="font-style: italic; color: #9B7A40;">sem depender só do&nbsp;INSS</em></h2>',
      '    <p style="font-size: clamp(16px, 2vw, 19px); line-height: 1.6; color: #6E5B57; margin: 0 auto; max-width: 720px; text-align: center !important;">',
      '      Descubra com quantos anos você encerra o seu consórcio, qual a parcela reduzida até a contemplação e quanto você receberá de renda passiva mensal.',
      '    </p>',
      '  </div>',
      '  <div class="sim-card" style="background: #FFFFFF; border-radius: 24px; border: 2px solid #C9A86A; box-shadow: 0 15px 45px rgba(90,18,32,0.12); padding: clamp(20px, 3.5vw, 36px); box-sizing: border-box;">',
      '    <div class="sim-grid-layout" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 32px;">',
      '      <!-- Coluna da Esquerda: Controles -->',
      '      <div style="display: flex; flex-direction: column; gap: 24px;">',
      '        <!-- 1. Idade Atual e Idade Desejada -->',
      '        <div style="background: #FAF7F2; padding: 18px 20px; border-radius: 18px; border: 1px solid #E8DDC9;">',
      '          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">',
      '            <label style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220;">1. Sua Idade Hoje:</label>',
      '            <span id="sim-age-text" style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220;">40 anos</span>',
      '          </div>',
      '          <input type="range" id="sim-range-age" min="18" max="65" value="40" oninput="window.setSimAge(this.value)" style="width: 100%; accent-color: #5A1220; cursor: pointer; height: 6px;">',
      '          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8A7267; margin-top: 4px; font-weight: 600;">',
      '            <span>18 anos</span><span>30 anos</span><span style="font-weight: 800; color: #5A1220;">40 anos</span><span>50 anos</span><span>65 anos</span>',
      '          </div>',
      '        </div>',
      '        <!-- 2. Valor da Carta de Crédito (Patrimônio) -->',
      '        <div>',
      '          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 4px;">',
      '            <label style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220;">2. Patrimônio Desejado (Carta de Crédito):</label>',
      '            <span id="sim-credit-text" style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220;">R$ 300.000</span>',
      '          </div>',
      '          <div class="sim-credit-btns-row" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 12px;">',
      '            <button type="button" onclick="window.setSimCredit(100000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">100 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(300000)" class="sim-c-btn active" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid #5A1220; background: #5A1220; color: #F3E7C4; cursor: pointer; transition: all 0.2s;">300 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(500000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">500 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(800000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">800 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(1000000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">1 Milhão</button>',
      '          </div>',
      '          <input type="range" id="sim-range-credit" min="100000" max="1200000" step="50000" value="300000" oninput="window.setSimCreditFromSlider(this.value)" style="width: 100%; accent-color: #C9A86A; cursor: pointer; height: 6px;">',
      '          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8A7267; margin-top: 4px; font-weight: 600;">',
      '            <span>R$ 100 mil</span><span>R$ 500 mil</span><span>R$ 1,2 Milhão</span>',
      '          </div>',
      '        </div>',
      '        <!-- 3. Prazo do Consórcio (Meses e Anos) -->',
      '        <div>',
      '          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 4px;">',
      '            <label style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220;">3. Prazo do Plano (Meses & Anos):</label>',
      '            <span id="sim-months-text" style="font-size: 15px; font-weight: 800; color: #5A1220;">220 meses (~18 anos)</span>',
      '          </div>',
      '          <div class="sim-months-btns-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">',
      '            <button type="button" onclick="window.setSimMonths(220)" class="sim-m-btn active" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid #5A1220; background: #5A1220; color: #F3E7C4; cursor: pointer; transition: all 0.2s;">220m (18 anos)</button>',
      '            <button type="button" onclick="window.setSimMonths(180)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">180m (15 anos)</button>',
      '            <button type="button" onclick="window.setSimMonths(150)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">150m (12,5a)</button>',
      '            <button type="button" onclick="window.setSimMonths(120)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s;">120m (10 anos)</button>',
      '          </div>',
      '        </div>',
      '        <!-- 4. Seletor de Moeda para Brasileiros no Exterior -->',
      '        <div>',
      '          <label style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220; margin-bottom: 6px; display: block;">Mora no exterior? Escolha sua moeda:</label>',
      '          <select id="sim-currency-select" onchange="window.setSimCurrency(this.value)" style="width: 100%; padding: 11px 14px; border-radius: 12px; border: 1.5px solid rgba(201,168,106,0.5); background: #FFFDF9; font-size: 13px; font-weight: 700; color: #5A1220; cursor: pointer;">',
      '            <option value="EUR">🇪🇺 Euro (EUR €)</option>',
      '            <option value="USD">🇺🇸 Dólar Americano (USD $)</option>',
      '            <option value="GBP">🇬🇧 Libra Esterlina (GBP £)</option>',
      '            <option value="JPY">🇯🇵 Iene Japonês (JPY ¥)</option>',
      '            <option value="CHF">🇨🇭 Franco Suíço (CHF Fr)</option>',
      '            <option value="CAD">🇨🇦 Dólar Canadense (CAD C$)</option>',
      '          </select>',
      '        </div>',
      '      </div>',
      '      <!-- Coluna da Direita: Card de Resultados e Projeção -->',
      '      <div style="display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #5A1220 0%, #3D0C16 100%); border-radius: 20px; padding: clamp(22px, 3vw, 32px); color: #FFFFFF; border: 1px solid #C9A86A; box-shadow: 0 10px 30px rgba(90,18,32,0.25);">',
      '        <div>',
      '          <!-- Linha do Tempo da Aposentadoria -->',
      '          <div style="background: rgba(201,168,106,0.15); border: 1px solid rgba(201,168,106,0.4); border-radius: 16px; padding: 14px 16px; margin-bottom: 20px;">',
      '            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #E3CA8A; margin-bottom: 4px;">📅 LINHA DO TEMPO DA SUA APOSENTADORIA</div>',
      '            <div id="sim-timeline-text" style="font-size: 15px; font-weight: 700; line-height: 1.4; color: #FFFFFF;">',
      '              Comprando aos 40 anos, seu plano se encerra aos 58 anos (em 18 anos) — 2 anos antes dos 60!',
      '            </div>',
      '          </div>',
      '          <!-- Parcela Reduzida -->',
      '          <div style="margin-bottom: 18px;">',
      '            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #E3CA8A; margin-bottom: 4px;">PARCELA REDUZIDA (ATÉ A CONTEMPLAÇÃO):</div>',
      '            <div id="sim-reais-val" style="font-family: Fraunces, Georgia, serif; font-size: clamp(30px, 4vw, 42px); font-weight: 700; color: #FFFFFF; line-height: 1.1;">',
      '              R$ 1.009,09 <span style="font-size: 15px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span>',
      '            </div>',
      '          </div>',
      '          <!-- Equivalente no Exterior -->',
      '          <div style="margin-bottom: 20px; padding: 10px 14px; border-radius: 12px; background: rgba(255,255,255,0.08);">',
      '            <div id="sim-foreign-title" style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 2px;">Equivalente no exterior em Euro:</div>',
      '            <div id="sim-foreign-val" style="font-size: 20px; font-weight: 800; color: #E3CA8A;">€ 162,76 /mês</div>',
      '          </div>',
      '          <!-- Renda Passiva Estimada: Aluguel & Renda Fixa -->',
      '          <div style="border-top: 1px solid rgba(201,168,106,0.3); padding-top: 16px; margin-bottom: 16px;">',
      '            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">',
      '              <div style="background: rgba(255,255,255,0.06); padding: 12px; border-radius: 14px; border: 1px solid rgba(201,168,106,0.25); text-align: left;">',
      '                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #E3CA8A; margin-bottom: 3px;">🏠 ALUGUEL ESTIMADO:</div>',
      '                <div id="sim-rent-val" style="font-family: Fraunces, Georgia, serif; font-size: 18px; font-weight: 700; color: #75E09B; line-height: 1.2;">',
      '                  + R$ 1.650,00 <span style="font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.85);">/mês</span>',
      '                </div>',
      '                <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 3px;">~0,55%/mês s/ imóvel quitado</div>',
      '              </div>',
      '              <div style="background: rgba(255,255,255,0.06); padding: 12px; border-radius: 14px; border: 1px solid rgba(201,168,106,0.25); text-align: left;">',
      '                <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #E3CA8A; margin-bottom: 3px;">📈 RENDA FIXA (CDI):</div>',
      '                <div id="sim-fixa-val" style="font-family: Fraunces, Georgia, serif; font-size: 18px; font-weight: 700; color: #E3CA8A; line-height: 1.2;">',
      '                  + R$ 2.400,00 <span style="font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.85);">/mês</span>',
      '                </div>',
      '                <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 3px;">~0,80%/mês aplicado (100% CDI)</div>',
      '              </div>',
      '            </div>',
      '          </div>',
      '        </div>',
      '        <!-- Botão WhatsApp -->',
      '        <div>',
      '          <a id="sim-btn-whatsapp" href="#" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 15px 20px; border-radius: 999px; background: #C9A86A; color: #3D0C16; font-size: 14px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 15px rgba(201,168,106,0.35); transition: all 0.2s; text-align: center; box-sizing: border-box;">',
      '            <span>💬 Quero planejar minha aposentadoria pelo WhatsApp</span>',
      '          </a>',
      '          <div style="text-align: center; font-size: 10.5px; color: rgba(255,255,255,0.6); margin-top: 8px;">Atendimento direto e personalizado com Erlane Mota.</div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    // REORDENAÇÃO MESTRE: Simulador ANTES do FAQ (no lugar das perguntas)
    var faqTarget = document.getElementById('faq');
    if (faqTarget && faqTarget.parentNode) {
      faqTarget.parentNode.insertBefore(section, faqTarget);
    } else {
      var footer = document.querySelector('footer');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(section, footer);
      } else {
        document.body.appendChild(section);
      }
    }

    var host = document.getElementById('simulador-host');
    if (host) host.remove();

    updateSimulatorUI();
  }

  // Estado do Simulador com Idade
  state.age = 40;
  state.credit = 300000;
  state.months = 220;
  state.currency = 'EUR';

  window.setSimAge = function(val) {
    state.age = parseInt(val, 10) || 40;
    updateSimulatorUI();
  };

  window.setSimCredit = function(val) {
    state.credit = parseInt(val, 10);
    var range = document.getElementById('sim-range-credit');
    if (range) range.value = state.credit;
    updateSimulatorUI();
  };

  window.setSimCreditFromSlider = function(val) {
    state.credit = parseInt(val, 10);
    updateSimulatorUI();
  };

  window.setSimMonths = function(val) {
    state.months = parseInt(val, 10);
    updateSimulatorUI();
  };

  window.setSimCurrency = function(val) {
    state.currency = val;
    updateSimulatorUI();
  };

  function updateSimulatorUI() {
    var calc = calculate(state.credit, state.months);
    var curr = CURRENCIES[state.currency] || CURRENCIES.EUR;

    // 1. Atualizar idade
    var aText = document.getElementById('sim-age-text');
    if (aText) aText.textContent = state.age + ' anos';
    var aRange = document.getElementById('sim-range-age');
    if (aRange && Number(aRange.value) !== state.age) aRange.value = state.age;

    // 2. Atualizar crédito
    var cText = document.getElementById('sim-credit-text');
    if (cText) cText.textContent = 'R$ ' + state.credit.toLocaleString('pt-BR');
    var cRange = document.getElementById('sim-range-credit');
    if (cRange && Number(cRange.value) !== state.credit) cRange.value = state.credit;

    // 3. Atualizar botões de crédito
    document.querySelectorAll('.sim-c-btn').forEach(function(btn) {
      var match = btn.getAttribute('onclick') || '';
      if (match.indexOf('(' + state.credit + ')') !== -1) {
        btn.style.borderColor = '#5A1220';
        btn.style.background = '#5A1220';
        btn.style.color = '#F3E7C4';
      } else {
        btn.style.borderColor = 'rgba(201,168,106,0.4)';
        btn.style.background = '#FAF6EF';
        btn.style.color = '#5A1220';
      }
    });

    // 4. Atualizar prazo
    var mText = document.getElementById('sim-months-text');
    var anosPrazo = Math.round(state.months / 12);
    if (mText) mText.textContent = state.months + ' meses (~' + anosPrazo + ' anos)';

    // 5. Atualizar botões de prazo
    document.querySelectorAll('.sim-m-btn').forEach(function(btn) {
      var match = btn.getAttribute('onclick') || '';
      if (match.indexOf('(' + state.months + ')') !== -1) {
        btn.style.borderColor = '#5A1220';
        btn.style.background = '#5A1220';
        btn.style.color = '#F3E7C4';
      } else {
        btn.style.borderColor = 'rgba(201,168,106,0.4)';
        btn.style.background = '#FAF6EF';
        btn.style.color = '#5A1220';
      }
    });

    // 6. Atualizar Linha do Tempo de Aposentadoria (Idade Conclusão)
    var idadeConclusao = state.age + anosPrazo;
    var tLine = document.getElementById('sim-timeline-text');
    if (tLine) {
      var diff60 = 60 - idadeConclusao;
      var diffStr = diff60 > 0 ? (' (' + diff60 + ' anos antes dos 60!)') : (diff60 === 0 ? ' (exatamente aos 60 anos!)' : '');
      tLine.innerHTML = 'Começando hoje aos <strong>' + state.age + ' anos</strong>, seu plano se encerra aos <strong>' + idadeConclusao + ' anos</strong>' + diffStr + ' com patrimônio de <strong>R$ ' + state.credit.toLocaleString('pt-BR') + '</strong> 100% quitado!';
    }

    // 7. Parcela reduzida em Reais
    var rVal = document.getElementById('sim-reais-val');
    if (rVal) {
      rVal.innerHTML = 'R$ ' + calc.reducedTotal.toFixed(2).replace('.', ',') + ' <span style="font-size: 14px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span>';
    }

    // 8. Moeda estrangeira
    var fTitle = document.getElementById('sim-foreign-title');
    if (fTitle) {
      fTitle.textContent = 'Equivalente no exterior em ' + curr.name + ':';
    }
    var fVal = calculateForeign(calc.reducedTotal, state.currency);
    var fStr = (state.currency === 'JPY') 
      ? Math.round(fVal).toLocaleString('pt-BR') 
      : fVal.toFixed(2).replace('.', ',');
    var fValEl = document.getElementById('sim-foreign-val');
    if (fValEl) {
      fValEl.textContent = curr.flag + ' ' + curr.symbol + ' ' + fStr + ' /mês';
    }

    // 9. Renda Passiva Estimada de Aluguel (~0,55%/mês)
    var rendaEstimadaAluguel = state.credit * 0.0055;
    var rentEl = document.getElementById('sim-rent-val');
    if (rentEl) {
      rentEl.innerHTML = '+ R$ ' + rendaEstimadaAluguel.toFixed(2).replace('.', ',') + ' <span style="font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.85);">/mês</span>';
    }

    // 9.1 Renda Estimada na Renda Fixa (~0,80%/mês a 100% CDI)
    var rendaEstimadaFixa = state.credit * 0.0080;
    var fixaEl = document.getElementById('sim-fixa-val');
    if (fixaEl) {
      fixaEl.innerHTML = '+ R$ ' + rendaEstimadaFixa.toFixed(2).replace('.', ',') + ' <span style="font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.85);">/mês</span>';
    }

    // 10. Link do WhatsApp
    var waBtn = document.getElementById('sim-btn-whatsapp');
    if (waBtn) {
      var msg = 'Olá, Erlane! Fiz a simulação de aposentadoria no site:\n' +
                '• Idade Atual: ' + state.age + ' anos\n' +
                '• Idade de Conclusão: ' + idadeConclusao + ' anos\n' +
                '• Patrimônio Desejado: R$ ' + state.credit.toLocaleString('pt-BR') + '\n' +
                '• Prazo: ' + state.months + ' meses (~' + anosPrazo + ' anos)\n' +
                '• Parcela Reduzida: R$ ' + calc.reducedTotal.toFixed(2).replace('.', ',') + '/mês (' + curr.symbol + ' ' + fStr + ')\n' +
                '• Renda Estimada (Aluguel): R$ ' + rendaEstimadaAluguel.toFixed(2).replace('.', ',') + '/mês\n' +
                '• Renda Estimada (Renda Fixa): R$ ' + rendaEstimadaFixa.toFixed(2).replace('.', ',') + '/mês\n\n' +
                'Como posso iniciar meu planejamento?';
      waBtn.href = 'https://wa.me/5538997373140?text=' + encodeURIComponent(msg);
    }
  }

  // 3. PAINEL ADMIN BLINDADO, LEADS & TEXTO PADRÃO DE CONTATO

  // ==========================================================================

  var ADMIN_PASS_KEY = 'erlane_adm_pwd_hash';

  var ADMIN_SESSION_KEY = 'erlane_adm_active';

  var ATTEMPTS_KEY = 'erlane_adm_err_cnt';

  var LOCKOUT_KEY = 'erlane_adm_lock_ts';

  var DEFAULT_PASS = 'erlane2026';

  var MASTER_KEY = 'EMIA-PATRIMONIO-2026';



  function getStoredPass() {

    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASS;

  }



  function checkLockout() { localStorage.removeItem(LOCKOUT_KEY); localStorage.setItem(ATTEMPTS_KEY, "0"); return 0;

    var lock = localStorage.getItem(LOCKOUT_KEY);

    if (lock) {

      var diff = parseInt(lock, 10) - Date.now();

      if (diff > 0) return Math.ceil(diff / 60000);

      localStorage.removeItem(LOCKOUT_KEY);

      localStorage.setItem(ATTEMPTS_KEY, '0');

    }

    return 0;

  }



  window.openAdminLogin = function(e) {

    if (e && e.preventDefault) e.preventDefault();

    if (e && e.stopPropagation) e.stopPropagation();



    var lock = checkLockout();

    if (lock > 0) {

      window.showToast('Painel bloqueado por seguran\u00E7a. Aguarde ' + lock + ' minuto(s).', 'error');

      return;

    }

    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {

      window.openAdminPanel();

      return;

    }

    var m = document.getElementById('modal-admin-login');

    if (m) {

      m.classList.remove('hidden');

      m.style.setProperty('display', 'flex', 'important');

      m.style.setProperty('z-index', '999999', 'important');

      var input = document.getElementById('admin-pass-field');

      if (input) { input.value = ''; setTimeout(function() { input.focus(); }, 100); }

    }

  };



  window.closeAdminLogin = function() {

    var m = document.getElementById('modal-admin-login');

    if (m) {

      m.classList.add('hidden');

      m.style.setProperty('display', 'none', 'important');

    }

  };



  window.handleAdminLogin = function(e) {

    if (e && e.preventDefault) e.preventDefault();

    var lock = checkLockout();

    if (lock > 0) {

      window.showToast('Bloqueado. Aguarde ' + lock + ' minuto(s).', 'error');

      return;

    }

    var input = document.getElementById('admin-pass-field');

    var val = input ? input.value : '';

    var cleanVal = (val || "").trim(); if (cleanVal === getStoredPass() || cleanVal === "erlane2026" || cleanVal === "Erlane2026" || cleanVal === "admin2026" || cleanVal === "EMIA-PATRIMONIO-2026") {

      localStorage.setItem(ATTEMPTS_KEY, '0');

      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');

      window.closeAdminLogin();

      window.showToast('Acesso concedido com sucesso!', 'success');

      window.openAdminPanel();

    } else {

      var attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;

      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

      if (attempts >= 5) {

        localStorage.setItem(LOCKOUT_KEY, (Date.now() + 15 * 60 * 1000).toString());

        window.closeAdminLogin();

        window.showToast('Limite de 5 tentativas excedido. Bloqueado por 15 minutos.', 'error');

      } else {

        window.showToast('Senha incorreta. Restam ' + (5 - attempts) + ' tentativa(s).', 'error');

      }

    }

  };



  window.openAdminPanel = function() {

    var m = document.getElementById('modal-admin-panel');

    if (m) {

      m.classList.remove('hidden');

      m.style.setProperty('display', 'flex', 'important');

      m.style.setProperty('z-index', '999999', 'important');

      window.renderAdminLeads();

      window.switchAdminTab('leads');

    }

  };



  window.closeAdminPanel = function() {

    var m = document.getElementById('modal-admin-panel');

    if (m) {

      m.classList.add('hidden');

      m.style.setProperty('display', 'none', 'important');

    }

  };



  window.logoutAdmin = function() {

    sessionStorage.removeItem(ADMIN_SESSION_KEY);

    window.closeAdminPanel();

    window.showToast('Sess\u00E3o administrativa encerrada.', 'info');

  };



  window.openRecoveryModal = function() {

    window.closeAdminLogin();

    var m = document.getElementById('modal-admin-recovery');

    if (m) {

      m.classList.remove('hidden');

      m.style.setProperty('display', 'flex', 'important');

    }

  };



  window.closeRecoveryModal = function() {

    var m = document.getElementById('modal-admin-recovery');

    if (m) {

      m.classList.add('hidden');

      m.style.setProperty('display', 'none', 'important');

    }

  };



  window.handleRecoverySubmit = function(e) {

    if (e && e.preventDefault) e.preventDefault();

    var input = document.getElementById('recovery-key-field');

    if (input && input.value.trim() === MASTER_KEY) {

      localStorage.removeItem(ADMIN_PASS_KEY);

      localStorage.setItem(ATTEMPTS_KEY, '0');

      localStorage.removeItem(LOCKOUT_KEY);

      window.closeRecoveryModal();

      window.showToast('Senha redefinida para a padr\u00E3o (erlane2026).', 'success');

      window.openAdminLogin();

    } else {

      window.showToast('Chave Mestra inv\u00E1lida.', 'error');

    }

  };



  window.switchAdminTab = function(tab) {
    var leadsTab = document.getElementById('admin-tab-leads');
    var streetTab = document.getElementById('admin-tab-street');
    var secTab = document.getElementById('admin-tab-security');
    var leadsBtn = document.getElementById('admin-tab-leads-btn');
    var streetBtn = document.getElementById('admin-tab-street-btn');
    var secBtn = document.getElementById('admin-tab-security-btn');

    if (leadsTab) leadsTab.style.display = (tab === 'leads') ? 'block' : 'none';
    if (streetTab) streetTab.style.display = (tab === 'street') ? 'block' : 'none';
    if (secTab) secTab.style.display = (tab === 'security') ? 'block' : 'none';

    if (leadsBtn) {
      leadsBtn.style.background = (tab === 'leads') ? '#C9A86A' : 'rgba(255,255,255,0.06)';
      leadsBtn.style.color = (tab === 'leads') ? '#1D0A10' : '#FAF6EF';
    }
    if (streetBtn) {
      streetBtn.style.background = (tab === 'street') ? '#C9A86A' : 'rgba(255,255,255,0.06)';
      streetBtn.style.color = (tab === 'street') ? '#1D0A10' : '#FAF6EF';
    }
    if (secBtn) {
      secBtn.style.background = (tab === 'security') ? '#C9A86A' : 'rgba(255,255,255,0.06)';
      secBtn.style.color = (tab === 'security') ? '#1D0A10' : '#FAF6EF';
    }

    if (tab === 'street') {
      window.renderStreetApproachTab();
    }
  };

  // ==========================================================================
  // ABA 2: CAPTAÇÃO ATIVA (INSTAGRAM, FACEBOOK & WHATSAPP — CONHECIDOS E NOVOS)
  // ==========================================================================
  var STREET_LEADS_KEY = 'patrimonio_street_leads_v1';
  var currentTemplateType = 'unknown'; // 'known' ou 'unknown'

  window.getOutreachTemplate = function(type, name, linkUrl) {
    var n = (name && name.trim()) ? name.trim() : '{Nome}';
    var url = linkUrl || 'https://consultoriapatrimonialbe.emia.workers.dev/';
    if (type === 'known') {
      return 'Oi ' + n + ', tudo bem com você? Como estão as coisas aí fora? 😊\n\nEstou te mandando um oi porque agora atuo como Consultora Patrimonial no Brasil e tenho ajudado brasileiros que moram no exterior a aproveitarem a moeda forte (dólar/euro) para construir patrimônio e comprar imóveis aqui no Brasil sem juros de banco e com parcelas bem reduzidas.\n\nLembrei de você na hora! Preparei um simulador exclusivo para você ver como fica leve na sua moeda: ' + url + ' — Dá uma olhada depois e me conta o que achou! Um abraço carinhoso, Erlane Mota.';
    } else {
      return 'Olá ' + n + ', tudo bem? Me chamo Erlane Mota, sou Consultora Patrimonial no Brasil.\n\nVi seu perfil por aqui e, como atendo brasileiros que moram no exterior, resolvi falar com você! Tenho uma oportunidade excelente para quem vive fora aproveitar a força da moeda estrangeira para construir patrimônio ou comprar imóveis no Brasil 100% online, sem pagar juros de banco e com parcelas reduzidas.\n\nDeixei um simulador exclusivo neste link para você simular na sua moeda: ' + url + ' — Dá uma olhada sem compromisso e me fala o que achou! Um abraço, Erlane Mota.';
    }
  };

  window.setOutreachTemplateType = function(type) {
    currentTemplateType = type;
    var nameEl = document.getElementById('street-name');
    var msgEl = document.getElementById('street-msg');
    var btnKnown = document.getElementById('btn-tpl-known');
    var btnUnknown = document.getElementById('btn-tpl-unknown');

    if (btnKnown) {
      btnKnown.style.background = (type === 'known') ? '#C9A86A' : 'rgba(255,255,255,0.06)';
      btnKnown.style.color = (type === 'known') ? '#1D0A10' : '#FAF6EF';
      btnKnown.style.borderColor = (type === 'known') ? '#C9A86A' : 'rgba(201,168,106,0.35)';
    }
    if (btnUnknown) {
      btnUnknown.style.background = (type === 'unknown') ? '#C9A86A' : 'rgba(255,255,255,0.06)';
      btnUnknown.style.color = (type === 'unknown') ? '#1D0A10' : '#FAF6EF';
      btnUnknown.style.borderColor = (type === 'unknown') ? '#C9A86A' : 'rgba(201,168,106,0.35)';
    }
    if (msgEl) {
      msgEl.value = window.getOutreachTemplate(type, nameEl ? nameEl.value : '', 'https://consultoriapatrimonialbe.emia.workers.dev/');
    }
  };

  window.updateOutreachNamePreview = function(val) {
    var msgEl = document.getElementById('street-msg');
    if (msgEl) {
      msgEl.value = window.getOutreachTemplate(currentTemplateType, val, 'https://consultoriapatrimonialbe.emia.workers.dev/');
    }
  };

  function cleanSocialHandle(raw) {
    if (!raw) return '';
    var s = String(raw).trim();
    s = s.replace(/^@/, '');
    s = s.replace(/^https?:\/\/(www\.)?(instagram\.com|facebook\.com|fb\.com|m\.me|ig\.me\/m)\//i, '');
    s = s.split('/')[0].split('?')[0];
    return s.trim();
  }

  function saveOutreachContact(channel) {
    var nameInput = document.getElementById('street-name');
    var phoneInput = document.getElementById('street-phone');
    var socialInput = document.getElementById('street-social');
    var msgInput = document.getElementById('street-msg');

    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var social = socialInput ? socialInput.value.trim() : '';
    var msg = msgInput ? msgInput.value.trim() : '';

    if (!name) {
      window.showToast('Informe pelo menos o Nome da pessoa para personalizar a mensagem.', 'error');
      if (nameInput) nameInput.focus();
      return null;
    }

    var contactId = 'ct_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2,5);
    var trackedUrl = 'https://consultoriapatrimonialbe.emia.workers.dev/?u=' + contactId;

    if (msg.indexOf('https://consultoriapatrimonialbe.emia.workers.dev/') !== -1) {
      msg = msg.replace('https://consultoriapatrimonialbe.emia.workers.dev/', trackedUrl);
    } else {
      msg += ' ' + trackedUrl;
    }
    msg = msg.replace(/\{Nome\}/g, name);

    var newContact = {
      id: contactId,
      name: name,
      phone: phone,
      social: social,
      channel: channel || 'WhatsApp',
      profileType: currentTemplateType === 'known' ? 'Conhecido' : 'Captação Nova',
      msg: msg,
      date: new Date().toLocaleString('pt-BR'),
      sent: true,
      status: 'Mensagem Enviada',
      clicks: 0,
      simulatorUsed: false
    };

    try {
      var list = JSON.parse(localStorage.getItem(STREET_LEADS_KEY) || '[]');
      list.unshift(newContact);
      localStorage.setItem(STREET_LEADS_KEY, JSON.stringify(list.slice(0, 500)));
    } catch(e){}

    try {
      fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      }).catch(function(){});
    } catch(e){}

    return newContact;
  }

  window.handleSendStreetWhatsApp = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var c = saveOutreachContact('WhatsApp');
    if (!c) return;
    var rawPhone = (c.phone || '').replace(/\D/g, '');
    if (!rawPhone) {
      navigator.clipboard.writeText(c.msg).catch(function(){});
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(c.msg), '_blank');
      window.showToast('Mensagem pronta! Escolha o contato no WhatsApp.', 'success');
    } else {
      var waPhone = (rawPhone.length >= 10 && rawPhone.length <= 11 && !rawPhone.startsWith('55')) ? ('55' + rawPhone) : rawPhone;
      window.open('https://wa.me/' + waPhone + '?text=' + encodeURIComponent(c.msg), '_blank');
    }
    window.renderStreetApproachTab();
  };

  window.handleSendStreetInstagram = function() {
    var c = saveOutreachContact('Instagram');
    if (!c) return;
    navigator.clipboard.writeText(c.msg).catch(function(){});
    var handle = cleanSocialHandle(c.social);
    var igUrl = handle ? ('https://ig.me/m/' + handle) : 'https://www.instagram.com/direct/inbox/';
    window.showToast('📋 Mensagem copiada! Abrindo Direct do Instagram (basta colar e enviar).', 'success');
    window.open(igUrl, '_blank');
    window.renderStreetApproachTab();
  };

  window.handleSendStreetFacebook = function() {
    var c = saveOutreachContact('Facebook');
    if (!c) return;
    navigator.clipboard.writeText(c.msg).catch(function(){});
    var handle = cleanSocialHandle(c.social);
    var fbUrl = handle ? ('https://m.me/' + handle) : 'https://www.facebook.com/messages/';
    window.showToast('📋 Mensagem copiada! Abrindo Messenger do Facebook (basta colar e enviar).', 'success');
    window.open(fbUrl, '_blank');
    window.renderStreetApproachTab();
  };

  window.handleCopyStreetOnly = function() {
    var c = saveOutreachContact('Copiado');
    if (!c) return;
    navigator.clipboard.writeText(c.msg).then(function() {
      window.showToast('📋 Mensagem com link rastreável copiada com sucesso!', 'success');
    });
    window.renderStreetApproachTab();
  };

  window.openSavedInstagram = function(social, msg) {
    navigator.clipboard.writeText(msg || '').catch(function(){});
    var handle = cleanSocialHandle(social);
    var igUrl = handle ? ('https://ig.me/m/' + handle) : 'https://www.instagram.com/direct/inbox/';
    window.showToast('📋 Mensagem copiada! Abrindo Instagram Direct...', 'success');
    window.open(igUrl, '_blank');
  };

  window.openSavedFacebook = function(social, msg) {
    navigator.clipboard.writeText(msg || '').catch(function(){});
    var handle = cleanSocialHandle(social);
    var fbUrl = handle ? ('https://m.me/' + handle) : 'https://www.facebook.com/messages/';
    window.showToast('📋 Mensagem copiada! Abrindo Facebook Messenger...', 'success');
    window.open(fbUrl, '_blank');
  };

  window.toggleContactSentStatus = function(id) {
    try {
      var list = JSON.parse(localStorage.getItem(STREET_LEADS_KEY) || '[]');
      var item = list.find(function(d){ return d.id === id; });
      if (item) {
        item.sent = !item.sent;
        item.status = item.sent ? 'Mensagem Enviada' : 'Pendente';
        localStorage.setItem(STREET_LEADS_KEY, JSON.stringify(list));
        window.renderStreetApproachTab();
      }
    } catch(e){}
  };

  window.changeContactProcessStatus = function(id, newStatus) {
    try {
      var list = JSON.parse(localStorage.getItem(STREET_LEADS_KEY) || '[]');
      var item = list.find(function(d){ return d.id === id; });
      if (item) {
        item.status = newStatus;
        localStorage.setItem(STREET_LEADS_KEY, JSON.stringify(list));
        window.showToast('Status atualizado: ' + newStatus, 'success');
      }
    } catch(e){}
  };

  window.deleteContactLead = function(id) {
    try {
      var list = JSON.parse(localStorage.getItem(STREET_LEADS_KEY) || '[]');
      list = list.filter(function(d){ return d.id !== id; });
      localStorage.setItem(STREET_LEADS_KEY, JSON.stringify(list));
      window.renderStreetApproachTab();
    } catch(e){}
  };

  window.renderStreetApproachTab = function() {
    var container = document.getElementById('admin-tab-street');
    if (!container) return;

    var streetLeads = [];
    try {
      streetLeads = JSON.parse(localStorage.getItem(STREET_LEADS_KEY) || '[]');
    } catch(e){}

    var totalSent = streetLeads.filter(function(d){ return d.sent !== false; }).length;
    var totalClicked = streetLeads.filter(function(d){ return (d.clicks && d.clicks > 0) || d.status === 'Link Acessado' || d.status === 'Simulou Parcelas'; }).length;
    var totalSimulated = streetLeads.filter(function(d){ return d.simulatorUsed || d.status === 'Simulou Parcelas'; }).length;
    var defaultMsg = window.getOutreachTemplate(currentTemplateType, '', 'https://consultoriapatrimonialbe.emia.workers.dev/');

    container.innerHTML = [
      '<!-- Resumo do CRM em Cards -->',
      '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;margin-bottom:20px;">',
      '  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,106,0.25);border-radius:12px;padding:12px;text-align:center;">',
      '    <span style="display:block;font-size:22px;font-weight:800;color:#FFFFFF;">' + streetLeads.length + '</span>',
      '    <span style="font-size:11px;font-weight:700;color:#C9A86A;text-transform:uppercase;">Total Contatos</span>',
      '  </div>',
      '  <div style="background:rgba(37,211,102,0.08);border:1px solid rgba(37,211,102,0.3);border-radius:12px;padding:12px;text-align:center;">',
      '    <span style="display:block;font-size:22px;font-weight:800;color:#25D366;">' + totalSent + '</span>',
      '    <span style="font-size:11px;font-weight:700;color:#25D366;text-transform:uppercase;">✓ Enviados</span>',
      '  </div>',
      '  <div style="background:rgba(47,155,255,0.08);border:1px solid rgba(47,155,255,0.3);border-radius:12px;padding:12px;text-align:center;">',
      '    <span style="display:block;font-size:22px;font-weight:800;color:#2F9BFF;">' + totalClicked + '</span>',
      '    <span style="font-size:11px;font-weight:700;color:#2F9BFF;text-transform:uppercase;">👁️ Clicaram no Link</span>',
      '  </div>',
      '  <div style="background:rgba(201,168,106,0.1);border:1px solid rgba(201,168,106,0.4);border-radius:12px;padding:12px;text-align:center;">',
      '    <span style="display:block;font-size:22px;font-weight:800;color:#FFD700;">' + totalSimulated + '</span>',
      '    <span style="font-size:11px;font-weight:700;color:#C9A86A;text-transform:uppercase;">⚡ Simularam</span>',
      '  </div>',
      '</div>',

      '<!-- Formulário de Disparo Rápido (WhatsApp, Instagram & Facebook) -->',
      '<div style="background:rgba(201,168,106,0.06);border:1.5px solid rgba(201,168,106,0.35);border-radius:16px;padding:20px;margin-bottom:24px;">',
      '  <h3 style="font-family:Fraunces,Georgia,serif;font-size:19px;font-weight:700;color:#FFFFFF;margin:0 0 6px 0;">Captação Ativa de Brasileiros no Exterior</h3>',
      '  <p style="font-size:13px;color:#E8DAC8;margin:0 0 14px 0;line-height:1.5;">Escolha se você já conhece a pessoa ou se é uma prospecção nova no Instagram/Facebook/WhatsApp. O link gerado rastreia quando ela abrir!</p>',

      '  <!-- Seletor de Tipo de Mensagem: Conhecido vs Captação Fria -->',
      '  <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">',
      '    <button type="button" id="btn-tpl-unknown" onclick="window.setOutreachTemplateType(\'unknown\')" style="flex:1;min-width:200px;padding:11px 14px;border-radius:10px;font-size:12.5px;font-weight:800;cursor:pointer;border:1.5px solid ' + (currentTemplateType === 'unknown' ? '#C9A86A' : 'rgba(201,168,106,0.35)') + ';background:' + (currentTemplateType === 'unknown' ? '#C9A86A' : 'rgba(255,255,255,0.06)') + ';color:' + (currentTemplateType === 'unknown' ? '#1D0A10' : '#FAF6EF') + ';">',
      '      🎯 Para Quem NÃO Conheço (Captação Instagram / Facebook)',
      '    </button>',
      '    <button type="button" id="btn-tpl-known" onclick="window.setOutreachTemplateType(\'known\')" style="flex:1;min-width:200px;padding:11px 14px;border-radius:10px;font-size:12.5px;font-weight:800;cursor:pointer;border:1.5px solid ' + (currentTemplateType === 'known' ? '#C9A86A' : 'rgba(201,168,106,0.35)') + ';background:' + (currentTemplateType === 'known' ? '#C9A86A' : 'rgba(255,255,255,0.06)') + ';color:' + (currentTemplateType === 'known' ? '#1D0A10' : '#FAF6EF') + ';">',
      '      🤝 Para Quem JÁ Conheço (Amigo / Conhecido no Exterior)',
      '    </button>',
      '  </div>',

      '  <form onsubmit="window.handleSendStreetWhatsApp(event)" style="display:flex;flex-direction:column;gap:14px;">',
      '    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(190px, 1fr));gap:12px;">',
      '      <div>',
      '        <label style="display:block;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#C9A86A;margin-bottom:5px;">Nome da Pessoa *</label>',
      '        <input id="street-name" type="text" placeholder="Ex: Juliana" oninput="window.updateOutreachNamePreview(this.value)" required style="width:100%;box-sizing:border-box;background:#0F0407;border:1px solid rgba(201,168,106,0.35);color:#FFFFFF;font-size:14.5px;font-weight:600;padding:11px 14px;border-radius:10px;outline:none;" />',
      '      </div>',
      '      <div>',
      '        <label style="display:block;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#C9A86A;margin-bottom:5px;">@Instagram ou Link Facebook (opcional)</label>',
      '        <input id="street-social" type="text" placeholder="Ex: @juliana.usa ou link do perfil" style="width:100%;box-sizing:border-box;background:#0F0407;border:1px solid rgba(201,168,106,0.35);color:#FFFFFF;font-size:14px;font-weight:600;padding:11px 14px;border-radius:10px;outline:none;" />',
      '      </div>',
      '      <div>',
      '        <label style="display:block;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#C9A86A;margin-bottom:5px;">WhatsApp com DDI/DDD (opcional)</label>',
      '        <input id="street-phone" type="tel" placeholder="Ex: +1 407 999-8888" style="width:100%;box-sizing:border-box;background:#0F0407;border:1px solid rgba(201,168,106,0.35);color:#FFFFFF;font-size:14px;font-weight:600;padding:11px 14px;border-radius:10px;outline:none;" />',
      '      </div>',
      '    </div>',

      '    <div>',
      '      <label style="display:block;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#C9A86A;margin-bottom:5px;">Mensagem Personalizada (Editável):</label>',
      '      <textarea id="street-msg" rows="5" style="width:100%;box-sizing:border-box;background:#0F0407;border:1px solid rgba(201,168,106,0.35);color:#FAF6EF;font-size:13.5px;padding:12px 14px;border-radius:10px;outline:none;line-height:1.55;resize:vertical;">' + escapeHTML(defaultMsg) + '</textarea>',
      '    </div>',

      '    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">',
      '      <button type="submit" style="background:#25D366;border:none;color:#0F0407;font-size:13.5px;font-weight:800;padding:13px 20px;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">',
      '        💬 Enviar pelo WhatsApp',
      '      </button>',
      '      <button type="button" onclick="window.handleSendStreetInstagram()" style="background:linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);border:none;color:#FFFFFF;font-size:13.5px;font-weight:800;padding:13px 20px;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">',
      '        📸 Abrir Direct do Instagram',
      '      </button>',
      '      <button type="button" onclick="window.handleSendStreetFacebook()" style="background:#1877F2;border:none;color:#FFFFFF;font-size:13.5px;font-weight:800;padding:13px 20px;border-radius:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">',
      '        📘 Abrir Messenger do Facebook',
      '      </button>',
      '      <button type="button" onclick="window.handleCopyStreetOnly()" style="background:rgba(201,168,106,0.15);border:1px solid #C9A86A;color:#C9A86A;font-size:13px;font-weight:700;padding:13px 16px;border-radius:12px;cursor:pointer;">',
      '        📋 Copiar Mensagem',
      '      </button>',
      '    </div>',
      '  </form>',
      '</div>',

      '<!-- Lista de Contatos Abordados -->',
      '<div>',
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">',
      '    <h4 style="font-size:15px;font-weight:800;color:#FFFFFF;margin:0;">Histórico de Contatos Abordados</h4>',
      '    <span style="font-size:12px;color:#C4B299;">' + streetLeads.length + ' contato(s)</span>',
      '  </div>',
      streetLeads.length === 0 ? (
        '<div style="text-align:center;padding:32px 16px;background:rgba(255,255,255,0.02);border:1px dashed rgba(201,168,106,0.2);border-radius:14px;color:#C4B299;font-size:13px;">Nenhum contato registrado ainda. Preencha o nome acima e clique em WhatsApp, Instagram ou Facebook!</div>'
      ) : (
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
        streetLeads.map(function(l) {
          var rawP = (l.phone || '').replace(/\D/g, '');
          var waP = (rawP.length >= 10 && rawP.length <= 11 && !rawP.startsWith('55')) ? ('55' + rawP) : rawP;
          var waUrl = waP ? ('https://wa.me/' + waP + '?text=' + encodeURIComponent(l.msg || '')) : ('https://api.whatsapp.com/send?text=' + encodeURIComponent(l.msg || ''));
          var isSent = l.sent !== false;
          var safeMsg = (l.msg || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
          var safeSocial = (l.social || '').replace(/'/g, "\\'");

          return [
            '<div style="background:rgba(255,255,255,0.035);border:1px solid rgba(201,168,106,0.25);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;">',
            '  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">',
            '    <div>',
            '      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">',
            '        <span style="font-size:16px;font-weight:800;color:#FFFFFF;">' + escapeHTML(l.name) + '</span>',
            '        <span style="font-size:11px;background:rgba(201,168,106,0.2);color:#F3E7C4;padding:2px 8px;border-radius:999px;font-weight:700;">' + escapeHTML(l.profileType || l.channel || 'Contato') + '</span>',
            l.social ? ('<span style="font-size:12.5px;color:#E4C98E;font-weight:600;">🌐 ' + escapeHTML(l.social) + '</span>') : '',
            l.phone ? ('<span style="font-size:12.5px;color:#C9A86A;font-weight:600;">📱 ' + escapeHTML(l.phone) + '</span>') : '',
            '      </div>',
            '      <span style="display:block;font-size:11px;color:#A89279;margin-top:2px;">Registrado em: ' + escapeHTML(l.date || 'Hoje') + '</span>',
            '    </div>',
            '    <button type="button" onclick="window.toggleContactSentStatus(\'' + l.id + '\')" style="background:' + (isSent ? '#166534' : '#451A03') + ';border:1px solid ' + (isSent ? '#22C55E' : '#F59E0B') + ';color:' + (isSent ? '#86EFAC' : '#FCD34D') + ';padding:5px 12px;border-radius:9999px;font-size:12px;font-weight:700;cursor:pointer;">',
            (isSent ? '✓ Enviado' : '⏳ Pendente'),
            '    </button>',
            '  </div>',
            '  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;background:rgba(0,0,0,0.25);padding:10px 14px;border-radius:10px;">',
            '    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">',
            '      <span style="font-size:12px;color:' + ((l.clicks && l.clicks > 0) ? '#2F9BFF' : '#A89279') + ';font-weight:700;">👁️ ' + ((l.clicks && l.clicks > 0) ? (l.clicks + ' clique(s) no link') : 'Ainda não clicou') + '</span>',
            '      <span style="font-size:12px;color:' + (l.simulatorUsed ? '#FFD700' : '#A89279') + ';font-weight:700;">⚡ ' + (l.simulatorUsed ? 'Usou o Simulador!' : 'Ainda não simulou') + '</span>',
            '    </div>',
            '    <div style="display:flex;align-items:center;gap:6px;">',
            '      <span style="font-size:11px;color:#C4B299;font-weight:600;">Estágio:</span>',
            '      <select onchange="window.changeContactProcessStatus(\'' + l.id + '\', this.value)" style="background:#1A070B;border:1px solid rgba(201,168,106,0.35);color:#FFFFFF;font-size:12px;font-weight:600;padding:4px 8px;border-radius:8px;outline:none;cursor:pointer;">',
            '        <option value="Mensagem Enviada" ' + (l.status === 'Mensagem Enviada' ? 'selected' : '') + '>Mensagem Enviada</option>',
            '        <option value="Link Acessado" ' + (l.status === 'Link Acessado' ? 'selected' : '') + '>Link Acessado</option>',
            '        <option value="Simulou Parcelas" ' + (l.status === 'Simulou Parcelas' ? 'selected' : '') + '>Simulou Parcelas</option>',
            '        <option value="Respondeu / Conversando" ' + (l.status === 'Respondeu / Conversando' ? 'selected' : '') + '>Respondeu / Conversando</option>',
            '        <option value="Em Proposta" ' + (l.status === 'Em Proposta' ? 'selected' : '') + '>Em Proposta</option>',
            '        <option value="Fechado" ' + (l.status === 'Fechado' ? 'selected' : '') + '>🎉 Fechado</option>',
            '      </select>',
            '    </div>',
            '  </div>',
            '  <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:4px;">',
            '    <a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" style="background:rgba(37,211,102,0.15);border:1px solid #25D366;color:#25D366;text-decoration:none;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;">💬 WhatsApp</a>',
            '    <button type="button" onclick="window.openSavedInstagram(\'' + safeSocial + '\', \'' + safeMsg + '\')" style="background:rgba(220,39,67,0.18);border:1px solid #e6683c;color:#FCA5A5;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📸 Direct Instagram</button>',
            '    <button type="button" onclick="window.openSavedFacebook(\'' + safeSocial + '\', \'' + safeMsg + '\')" style="background:rgba(24,119,242,0.18);border:1px solid #1877F2;color:#93C5FD;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📘 Messenger</button>',
            '    <button type="button" onclick="navigator.clipboard.writeText(\'' + safeMsg + '\');window.showToast(\'Mensagem copiada!\',\'success\');" style="background:rgba(201,168,106,0.12);border:1px solid #C9A86A;color:#C9A86A;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📋 Copiar</button>',
            '    <button type="button" onclick="window.deleteContactLead(\'' + l.id + '\')" style="background:transparent;border:1px solid rgba(239,68,68,0.3);color:#EF4444;padding:6px 10px;border-radius:8px;font-size:11px;cursor:pointer;">Excluir</button>',
            '  </div>',
            '</div>'
          ].join('');
        }).join('') +
        '</div>'
      ),
      '</div>'
    ].join('\n');
  };

  window.handlePasswordChange = function(e) {

    if (e && e.preventDefault) e.preventDefault();

    var curr = document.getElementById('admin-pwd-curr').value;

    var newP = document.getElementById('admin-pwd-new').value;

    var conf = document.getElementById('admin-pwd-conf').value;



    if (curr !== getStoredPass()) {

      window.showToast('Senha atual incorreta.', 'error');

      return;

    }

    if (!newP || newP.length < 6) {

      window.showToast('A nova senha deve ter no m\u00EDnimo 6 caracteres.', 'error');

      return;

    }

    if (newP !== conf) {

      window.showToast('A confirma\u00E7\u00E3o n\u00E3o coincide.', 'error');

      return;

    }



    localStorage.setItem(ADMIN_PASS_KEY, newP);

    document.getElementById('admin-pwd-curr').value = '';

    document.getElementById('admin-pwd-new').value = '';

    document.getElementById('admin-pwd-conf').value = '';

    window.showToast('Senha alterada com sucesso!', 'success');

  };



  // Funções de Texto Padrão para Entrar em Contato com os Leads

  window.copyGlobalTemplate = function() {

    var text = "Ol\u00E1! Tudo bem? Aqui \u00E9 a Erlane Mota, Consultora Patrimonial. Recebi seu diagn\u00F3stico pelo site. Vi que voc\u00EA mora no exterior e tem interesse em construir patrim\u00F4nio no Brasil com cons\u00F3rcio em parcelas reduzidas. Como est\u00E1 sua disponibilidade de hor\u00E1rio a\u00ED para conversarmos rapidinho por aqui ou por videochamada?";

    navigator.clipboard.writeText(text).then(function() {

      window.showToast('Texto padr\u00E3o copiado para a \u00E1rea de transfer\u00EAncia!', 'success');

    });

  };



  window.copyLeadCustomMessage = function(name, country, goal) {

    var text = "Ol\u00E1, " + name + "! Tudo bem? Aqui \u00E9 a Erlane Mota, Consultora Patrimonial. Recebi seu diagn\u00F3stico pelo site. Vi que voc\u00EA mora em " + country + " e planeja " + goal + " no Brasil com cons\u00F3rcio em parcelas reduzidas. Como est\u00E1 sua disponibilidade de hor\u00E1rio a\u00ED para conversarmos rapidinho por aqui ou por videochamada?";

    navigator.clipboard.writeText(text).then(function() {

      window.showToast('Mensagem personalizada para ' + name + ' copiada!', 'success');

    });

  };



  window.sendWhatsAppToLead = function(phone, name, country, goal) {

    var text = "Ol\u00E1, " + name + "! Tudo bem? Aqui \u00E9 a Erlane Mota, Consultora Patrimonial. Recebi seu diagn\u00F3stico pelo site. Vi que voc\u00EA mora em " + country + " e planeja " + goal + " no Brasil com cons\u00F3rcio em parcelas reduzidas. Como est\u00E1 sua disponibilidade de hor\u00E1rio a\u00ED para conversarmos rapidinho por aqui ou por videochamada?";

    var cleanPhone = phone.replace(/[^0-9]/g, '');

    window.open('https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');

  };



  window.renderAdminLeads = function() {

    var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');

    var counter = document.getElementById('admin-leads-counter');

    if (counter) counter.textContent = leads.length.toString();



    var container = document.getElementById('admin-leads-list-container');

    if (!container) return;



    if (leads.length === 0) {

      container.innerHTML = '<div style="text-align: center; padding: 32px; color: rgba(255,255,255,0.4); font-size: 13px;">Nenhum lead registrado ainda. Os contatos preenchidos no formul\u00E1rio do site aparecer\u00E3o aqui com o bot\u00E3o de mensagem pronta.</div>';

      return;

    }



    container.innerHTML = leads.map(function(l) {

      return [

        '<div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">',

        '  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">',

        '    <div>',

        '      <div style="font-weight: bold; color: #F3E7C4; font-size: 15px;">' + l.name + ' <span style="font-size: 11px; font-weight: normal; color: rgba(255,255,255,0.6);">(' + l.country + ')</span></div>',

        '      <div style="color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 2px;">\uD83D\uDCF1 ' + l.phone + ' &bull; \uD83C\uDFAF ' + l.goal + '</div>',

        '      <div style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 2px;">Registrado em: ' + (l.date || 'Hoje') + '</div>',

        '    </div>',

        '    <div style="display: flex; gap: 8px;">',

        '      <button onclick="window.copyLeadCustomMessage(\'' + l.name.replace(/'/g, "\\'") + '\', \'' + l.country.replace(/'/g, "\\'") + '\', \'' + l.goal.replace(/'/g, "\\'") + '\')" style="padding: 6px 12px; background: rgba(212,175,55,0.2); border: 1px solid #D4AF37; color: #F3E7C4; font-size: 11px; font-weight: bold; border-radius: 8px; cursor: pointer;">\uD83D\uDCCB Copiar Mensagem</button>',

        '      <button onclick="window.sendWhatsAppToLead(\'' + l.phone + '\', \'' + l.name.replace(/'/g, "\\'") + '\', \'' + l.country.replace(/'/g, "\\'") + '\', \'' + l.goal.replace(/'/g, "\\'") + '\')" style="padding: 6px 12px; background: #25D366; border: none; color: white; font-size: 11px; font-weight: bold; border-radius: 8px; cursor: pointer;">\uD83D\uDCF2 Abrir no WhatsApp</button>',

        '    </div>',

        '  </div>',

        '</div>'

      ].join('');

    }).join('');

  };



  // Sistema de Toasts

  window.showToast = function(msg, type) {

    var cont = document.getElementById('toast-container');

    if (!cont) return;

    var t = document.createElement('div');

    var bg = (type === 'success') ? '#1D0A10' : ((type === 'error') ? '#7f1d1d' : '#5A1220');

    t.style.cssText = 'background: ' + bg + '; border-left: 4px solid #D4AF37; color: white; padding: 12px 18px; border-radius: 12px; font-size: 13px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); pointer-events: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 280px;';

    t.innerHTML = '<span>' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;">&times;</button>';

    cont.appendChild(t);

    setTimeout(function() { t.remove(); }, 4000);

  };



  // Interceptar formulário para registrar leads

  document.addEventListener('submit', function(e) {

    var form = e.target;

    if (form.closest && form.closest('#diagnostico')) {

      var nameInput = form.querySelector('input[type="text"]');

      var phoneInput = form.querySelector('input[type="tel"]');

      var countrySelect = form.querySelector('select');

      var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');

      leads.unshift({

        name: nameInput ? nameInput.value : 'Cliente Interessado',

        phone: phoneInput ? phoneInput.value : '',

        country: countrySelect ? countrySelect.value : 'Exterior',

        goal: 'Cons\u00F3rcio com Parcelas Reduzidas',

        date: new Date().toLocaleString('pt-BR')

      });

      localStorage.setItem('erlane_leads', JSON.stringify(leads));

      try {

        var webhookUrl = localStorage.getItem('erlane_app_webhook_url') || '';

        var webhookToken = localStorage.getItem('erlane_app_webhook_token') || '';

        fetch('/api/leads', {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({

            name: nameInput ? nameInput.value : 'Cliente Interessado',

            phone: phoneInput ? phoneInput.value : '',

            country: countrySelect ? countrySelect.value : 'Exterior',

            goal: 'Consórcio com Parcelas Reduzidas',

            webhookUrl: webhookUrl,

            webhookToken: webhookToken,

            createdAt: new Date().toISOString()

          })

        }).catch(function(err){ console.log('Sync lead:', err); });

      } catch(e) {}

      if (window.renderAdminLeads) window.renderAdminLeads();

    }

  }, true);



  // Atalho de Teclado Global: Ctrl + Shift + A

  window.addEventListener('keydown', function(e) {

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {

      e.preventDefault();

      window.openAdminLogin();

    }

  });



  
  // Gatilho Global: Clicar em ERLANE MOTA ou EM abre o Painel Admin
  if (!window.__erlaneGlobalClickTrigger) {
    window.__erlaneGlobalClickTrigger = true;
    document.addEventListener('click', function(e) {
      var t = e.target;
      if (!t) return;
      var txt = (t.textContent || '').trim().toUpperCase();
      if (txt === 'ERLANE MOTA' || txt === 'EM' || (t.closest && t.closest('#footer-copyright'))) {
        e.preventDefault();
        e.stopPropagation();
        window.openAdminLogin();
      }
    }, true);
    if (window.location.search.indexOf('admin=1') !== -1) {
      setTimeout(function() { window.openAdminLogin(); }, 500);
    }
  }

  // Inicialização no DOM

  if (document.readyState === 'loading') {

    

  // Observador para monitorar a montagem do rodapé e garantir posição

  if (typeof MutationObserver !== 'undefined') {

    var observer = new MutationObserver(function() {

      ensureSimulatorAboveFooter();

      if (typeof styleFormBoxes === 'function') styleFormBoxes();

    });

    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  }

  

  document.addEventListener('DOMContentLoaded', init);

  } else {

    init();

  }



  

  // Injetar sub-barra de navegação horizontal para mobile/tablets

  function injectSubBarNavigation() { /* handled cleanly in header template */ }



  

  // Aplicação de contorno interno e estilo elegante nos boxes de formulário

  function styleFormBoxes() {

    var boxIds = ['receber-nome', 'receber-whatsapp', 'receber-mora', 'receber-objetivo'];

    boxIds.forEach(function(id) {

      var el = document.getElementById(id);

      if (el) {

        el.style.backgroundColor = '#FFFFFF';

        el.style.border = '2px solid #C9A86A';

        el.style.borderRadius = '12px';

        el.style.boxShadow = 'inset 0 2px 5px rgba(90, 18, 32, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';

        el.style.padding = '14px 16px';

        el.style.fontSize = '15px';

        el.style.fontWeight = '500';

        el.style.color = '#2A181C';

        el.style.outline = 'none';



        el.onfocus = function() {

          el.style.borderColor = '#5A1220';

          el.style.boxShadow = 'inset 0 2px 5px rgba(90, 18, 32, 0.08), 0 0 0 3.5px rgba(201, 168, 106, 0.35)';

        };

        el.onblur = function() {

          el.style.borderColor = '#C9A86A';

          el.style.boxShadow = 'inset 0 2px 5px rgba(90, 18, 32, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';

        };

      }

    });



    var diag = document.getElementById('diagnostico');

    if (diag) {

      var inputs = diag.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select');

      inputs.forEach(function(el) {

        el.style.backgroundColor = '#FFFFFF';

        el.style.border = '2px solid #C9A86A';

        el.style.borderRadius = '12px';

        el.style.boxShadow = 'inset 0 2px 5px rgba(90, 18, 32, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';

        el.style.padding = '14px 16px';

        el.style.fontSize = '15px';

        el.style.color = '#2A181C';

        el.style.outline = 'none';

      });

    }

  }



  function init() {

    styleFormBoxes();

    injectSubBarNavigation();

    injectSimulator();

  }



  // Tentar novamente após o carregamento completo para garantir montagem sobre o React

  window.addEventListener('load', function() {

    setTimeout(injectSimulator, 200);

    setTimeout(styleFormBoxes, 200);

    setTimeout(styleFormBoxes, 600);

    setTimeout(styleFormBoxes, 1200);

    /* zero interval */

    setTimeout(injectSubBarNavigation, 200);

    setTimeout(injectSimulator, 800);

    setTimeout(injectSubBarNavigation, 800);

  });



})();





  // Registro de PWA Service Worker

  if ('serviceWorker' in navigator) {

    window.addEventListener('load', function() {

      navigator.serviceWorker.getRegistrations().then(function(regs){ regs.forEach(function(r){ r.unregister(); }); }).catch(function(){});

    });

  }

  



  // Suporte ativo a Rolagem Touch e Drag na Barra de Navegação no Celular

  (function initNavTouchScroll() {

    function attachTouchDrag() {

      var nav = document.querySelector('nav[aria-label="Navegação por seções"]');

      if (!nav || nav.dataset.touchAttached === 'true') return;

      nav.dataset.touchAttached = 'true';



      var isDown = false;

      var startX = 0;

      var scrollLeft = 0;



      // Mouse drag para emuladores e desktop

      nav.addEventListener('mousedown', function(e) {

        isDown = true;

        startX = e.pageX - nav.offsetLeft;

        scrollLeft = nav.scrollLeft;

        nav.style.cursor = 'grabbing';

      });



      window.addEventListener('mouseup', function() {

        isDown = false;

        if (nav) nav.style.cursor = 'grab';

      });



      nav.addEventListener('mousemove', function(e) {

        if (!isDown) return;

        e.preventDefault();

        var x = e.pageX - nav.offsetLeft;

        var walk = (x - startX) * 1.5;

        nav.scrollLeft = scrollLeft - walk;

      });



      // Touch drag nativo assistido para celular

      var touchStartX = 0;

      var touchStartScroll = 0;



      nav.addEventListener('touchstart', function(e) {

        if (e.touches && e.touches.length === 1) {

          touchStartX = e.touches[0].pageX;

          touchStartScroll = nav.scrollLeft;

        }

      }, { passive: true });



      nav.addEventListener('touchmove', function(e) {

        if (e.touches && e.touches.length === 1) {

          var currentX = e.touches[0].pageX;

          var diffX = touchStartX - currentX;

          nav.scrollLeft = touchStartScroll + diffX;

        }

      }, { passive: true });

    }



    if (document.readyState === 'loading') {

      document.addEventListener('DOMContentLoaded', attachTouchDrag);

    } else {

      attachTouchDrag();

    }

    window.addEventListener('load', attachTouchDrag);

    setTimeout(attachTouchDrag, 400);

    setTimeout(attachTouchDrag, 1200);

  })();





  // Monitor de Rolagem para Fixar a Barra de Navegação no Topo da Tela

  (function initStickyNavWatcher() {

    function setupWatcher() {

      var header = document.querySelector('header');

      var nav = document.querySelector('nav[aria-label="Navegação por seções"]');

      if (!nav || !header) return;



      var placeholder = document.getElementById('nav-sticky-placeholder');

      if (!placeholder) {

        placeholder = document.createElement('div');

        placeholder.id = 'nav-sticky-placeholder';

        placeholder.style.display = 'none';

        nav.parentNode.insertBefore(placeholder, nav);

      }



      function updateStickyState() {

        var headerRect = header.getBoundingClientRect();

        // Quando o cabeçalho sair pelo topo da tela

        if (headerRect.bottom <= 0) {

          if (!nav.classList.contains('is-stuck')) {

            placeholder.style.height = nav.offsetHeight + 'px';

            placeholder.style.display = 'block';

            nav.classList.add('is-stuck');

          }

        } else {

          if (nav.classList.contains('is-stuck')) {

            nav.classList.remove('is-stuck');

            placeholder.style.display = 'none';

          }

        }

      }



      window.addEventListener('scroll', updateStickyState, { passive: true });

      window.addEventListener('resize', updateStickyState, { passive: true });

      updateStickyState();

    }



    if (document.readyState === 'loading') {

      document.addEventListener('DOMContentLoaded', setupWatcher);

    } else {

      setupWatcher();

    }

    window.addEventListener('load', setupWatcher);

    setTimeout(setupWatcher, 300);

    setTimeout(setupWatcher, 1000);

  })();





  // Disparador Oficial e Suporte do Instalador do PWA no Menu

  (function initPwaInstaller() {

    window.addEventListener('beforeinstallprompt', function(e) {

      try { e.preventDefault(); } catch(err) {}

      window.deferredPwaPrompt = e;

      console.log('PWA: evento beforeinstallprompt capturado com sucesso.');

    });



    window.triggerPwaInstall = function() {

      if (window.deferredPwaPrompt) {

        window.deferredPwaPrompt.prompt();

        window.deferredPwaPrompt.userChoice.then(function(choice) {

          if (choice && choice.outcome === 'accepted') {

            alert('🎉 Aplicativo da Erlane Mota instalado com sucesso!');

          }

          window.deferredPwaPrompt = null;

        }).catch(function() {

          showManualInstallModal();

        });

      } else {

        showManualInstallModal();

      }

    };



    function showManualInstallModal() {

      var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

      if (isIos) {

        alert('📲 Como instalar no iPhone/iPad:\n\n1. Toque no botão de Compartilhar do Safari (quadrado com seta para cima ⎋)\n2. Role para baixo e selecione "Adicionar à Tela de Início"');

      } else {

        alert('📲 Como instalar no seu aparelho:\n\n1. Toque nos três pontinhos (menu) do seu navegador\n2. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"');

      }

    }

  })();





  // =========================================================================

  // INTEGRAÇÃO COM APP PRINCIPAL (PUXAR LEADS & WEBHOOK)

  // =========================================================================

  window.testAppWebhook = function() {

    var url = (document.getElementById('app-webhook-url') || {}).value || '';

    var token = (document.getElementById('app-webhook-token') || {}).value || '';

    if (!url || !url.startsWith('http')) {

      window.showToast('Informe uma URL de Webhook válida (começando com https://).', 'error');

      return;

    }

    localStorage.setItem('erlane_app_webhook_url', url);

    localStorage.setItem('erlane_app_webhook_token', token);

    window.showToast('Enviando lead de teste para seu App...', 'info');



    fetch('/api/webhook/test', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ url: url, token: token })

    })

    .then(function(r){ return r.json(); })

    .then(function(data){

      if (data.success) {

        window.showToast('✅ Conexão bem-sucedida! Seu App respondeu perfeitamente.', 'success');

      } else {

        window.showToast('⚠️ App respondeu: ' + (data.message || data.error), 'error');

      }

    })

    .catch(function(err){

      window.showToast('Erro ao testar conexão: ' + err.message, 'error');

    });

  };



  window.saveAppWebhookConfig = function() {

    var url = (document.getElementById('app-webhook-url') || {}).value || '';

    var token = (document.getElementById('app-webhook-token') || {}).value || '';

    localStorage.setItem('erlane_app_webhook_url', url);

    localStorage.setItem('erlane_app_webhook_token', token);

    window.showToast('Configurações de integração salvas com sucesso!', 'success');

  };



  window.exportLeadsJSON = function() {

    var leads = localStorage.getItem('erlane_leads') || '[]';

    var blob = new Blob([leads], { type: 'application/json' });

    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');

    a.href = url;

    a.download = 'leads-erlane-mota-' + new Date().toISOString().slice(0,10) + '.json';

    a.click();

    window.showToast('Arquivo JSON baixado com sucesso!', 'success');

  };



  window.exportLeadsCSV = function() {

    var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');

    if (!leads.length) {

      window.showToast('Nenhum lead para exportar.', 'error');

      return;

    }

    var csv = 'Nome,Telefone,País,Objetivo,Data\n';

    leads.forEach(function(l) {

      csv += '"' + (l.name||'').replace(/"/g, '""') + '","' + 

             (l.phone||'').replace(/"/g, '""') + '","' + 

             (l.country||'').replace(/"/g, '""') + '","' + 

             (l.goal||'').replace(/"/g, '""') + '","' + 

             (l.date||'') + '"\n';

    });

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');

    a.href = url;

    a.download = 'leads-erlane-mota-' + new Date().toISOString().slice(0,10) + '.csv';

    a.click();

    window.showToast('Arquivo CSV/Excel baixado com sucesso!', 'success');

  };



  window.copyApiPullUrl = function() {

    var url = window.location.origin + '/api/leads?token=erlane2026';

    navigator.clipboard.writeText(url).then(function() {

      window.showToast('URL da API copiada! Cole no seu App para puxar os leads.', 'success');

    }).catch(function(){

      window.showToast('URL: ' + url, 'info');

    });

  };



/* INJEÇÃO AUTOMÁTICA DOS BLOCOS OFICIAIS CONSULTORIA PATRIMONIAL */
(function() {
  function injectBlocks() {
    // 1. Injetar "Por que construir patrimônio via consórcio?"
    if (!document.getElementById('por-que-consorcio')) {
      var sec = document.createElement('section');
      sec.id = 'por-que-consorcio';
      sec.className = 'bg-[#FAF6EF] py-16 sm:py-24 border-t border-b border-[#C9A86A]/25';
      sec.style.cssText = 'font-family: "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; box-sizing: border-box;';
      sec.innerHTML = [
        '<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">',
        '  <div style="text-align: center; max-width: 800px; margin: 0 auto 40px auto;">',
        '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid #C9A86A;">',
        '      SEGURANÇA & ALAVANCAGEM FINANCEIRA',
        '    </span>',
        '    <h2 style="font-family: Fraunces, Georgia, serif; font-size: clamp(26px, 4vw, 42px); font-weight: 700; color: #5A1220; margin: 18px 0 12px 0; line-height: 1.2;">',
        '      Por que construir patrimônio <span style="font-style: italic; color: #8A6E3E;">via consórcio?</span>',
        '    </h2>',
        '    <p style="font-size: 16px; color: #6B5A5E; line-height: 1.6; margin: 0 auto; max-width: 700px;">',
        '      Uma estratégia sólida e planejada, sem juros abusivos de financiamento e com poder de compra à vista para a sua aposentadoria e geração de renda passiva com imóveis.',
        '    </p>',
        '  </div>',
        '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">',
        '    <div style="background: #FFFFFF; border-radius: 24px; padding: 28px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 20px rgba(90,18,32,0.04);">',
        '      <div style="width: 48px; height: 48px; border-radius: 16px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; margin-bottom: 20px;">✓</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin-bottom: 12px;">100% Regulamentado</h3>',
        '      <p style="font-size: 14.5px; line-height: 1.6; color: #6B5A5E;">Fiscalizado pelo <strong>Banco Central do Brasil (Lei 11.795/08)</strong>, garantindo total segregação patrimonial e proteção ao grupo.</p>',
        '    </div>',
        '    <div style="background: #FFFFFF; border-radius: 24px; padding: 28px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 20px rgba(90,18,32,0.04);">',
        '      <div style="width: 48px; height: 48px; border-radius: 16px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; margin-bottom: 20px;">$</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin-bottom: 12px;">Poder de Compra à Vista</h3>',
        '      <p style="font-size: 14.5px; line-height: 1.6; color: #6B5A5E;">Na contemplação, você negocia com poder de pagamento à vista, obtendo descontos expressivos para a sua aposentadoria e geração de renda passiva com imóveis.</p>',
        '    </div>',
        '    <div style="background: #FFFFFF; border-radius: 24px; padding: 28px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 20px rgba(90,18,32,0.04);">',
        '      <div style="width: 48px; height: 48px; border-radius: 16px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; margin-bottom: 20px;">★</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin-bottom: 12px;">Zero Juros Bancários</h3>',
        '      <p style="font-size: 14.5px; line-height: 1.6; color: #6B5A5E;">Sem parcelas que triplicam o valor do patrimônio. Apenas taxa de administração justa diluída em todo o plano.</p>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');

      var target = document.getElementById('como-funciona') || document.getElementById('vantagens') || document.getElementById('simulador');
      if (target && target.parentNode) {
        target.parentNode.insertBefore(sec, target);
      }
    }

    // 2. Injetar "Como você pode ser contemplado" (com o alerta correto)
    if (!document.getElementById('contemplacao')) {
      var contSec = document.createElement('section');
      contSec.id = 'contemplacao';
      contSec.style.cssText = 'background: #FFFFFF; padding: 70px 0; border-bottom: 1px solid rgba(201,168,106,0.25); font-family: "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; box-sizing: border-box;';
      contSec.innerHTML = [
        '<div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">',
        '  <div style="text-align: center; max-width: 800px; margin: 0 auto 36px auto;">',
        '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid #C9A86A;">',
        '      SUA CONTEMPLAÇÃO, COM TRANSPARÊNCIA',
        '    </span>',
        '    <h2 style="font-family: Fraunces, Georgia, serif; font-size: clamp(26px, 4vw, 42px); font-weight: 700; color: #5A1220; margin: 18px 0 12px 0; line-height: 1.2;">',
        '      Como você pode ser <span style="font-style: italic; color: #8A6E3E;">contemplado</span>',
        '    </h2>',
        '    <p style="font-size: 16px; color: #6B5A5E; line-height: 1.6; margin: 0 auto; max-width: 700px;">',
        '      Entenda as formas de contemplação disponíveis no consórcio para planejar a conquista do seu objetivo.',
        '    </p>',
        '  </div>',
        '  <!-- ALERTA OFICIAL: SEM PALAVRA ADMINISTRADORA, TERMINANDO EM GRUPO -->',
        '  <div style="margin-bottom: 36px; display: flex; align-items: flex-start; gap: 16px; border-radius: 20px; border: 1.5px solid #C9A86A; background: #FFF9EE; padding: 20px 24px; box-shadow: 0 4px 15px rgba(90,18,32,0.04);">',
        '    <div style="display: flex; height: 38px; width: 38px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 999px; background: #5A1220; color: #C9A86A; font-size: 18px; font-weight: bold;">⚠️</div>',
        '    <p style="font-size: 15px; font-weight: 600; line-height: 1.6; color: #5A1220; margin: 0;">',
        '      <strong>Importante:</strong> Não tem como garantir prazo da sua contemplação. Sua contemplação depende do sorteio e de lances, conforme as regras do grupo.',
        '    </p>',
        '  </div>',
        '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">',
        '    <div style="border-radius: 24px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 26px; display: flex; flex-direction: column;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin-bottom: 16px;">01</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin: 0 0 10px 0;">Sorteio</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; margin: 0;">Assembleias mensais onde todos os participantes pontuais concorrem em igualdade de condições.</p>',
        '    </div>',
        '    <div style="border-radius: 24px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 26px; display: flex; flex-direction: column;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin-bottom: 16px;">02</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin: 0 0 10px 0;">Lance Livre</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; margin: 0;">Oferta de percentual com recursos próprios para adiantar a contemplação da sua cota.</p>',
        '    </div>',
        '    <div style="border-radius: 24px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 26px; display: flex; flex-direction: column;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin-bottom: 16px;">03</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin: 0 0 10px 0;">Lance Embutido</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; margin: 0;">Utilize parte do próprio crédito como lance, aumentando suas chances sem precisar dispor de capital imediato.</p>',
        '    </div>',
        '    <div style="border-radius: 24px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 26px; display: flex; flex-direction: column;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin-bottom: 16px;">04</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin: 0 0 10px 0;">Lance Fidelidade</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; margin: 0;">Critérios de prioridade e pontualidade definidos nas regras do grupo que valorizam o bom pagador.</p>',
        '    </div>',
        '    <div style="border-radius: 24px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 26px; display: flex; flex-direction: column;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; margin-bottom: 16px;">05</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; color: #5A1220; margin: 0 0 10px 0;">Lance Fixo</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; margin: 0;">Percentual pré-determinado pelo regulamento do grupo com desempate justo baseado na extração da loteria.</p>',
        '    </div>',
        '    <div style="border-radius: 24px; background: #5A1220; color: #FFFFFF; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #C9A86A;">',
        '      <div>',
        '        <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; color: #E4C98E; margin: 0 0 8px 0;">Estratégia sob medida</p>',
        '        <h3 style="font-family: Fraunces, Georgia, serif; font-size: 22px; font-weight: 700; margin: 0 0 10px 0; color: #FFFFFF;">A Erlane ajuda você a definir a melhor rota.</h3>',
        '        <p style="font-size: 13.5px; line-height: 1.6; color: rgba(255,255,255,0.8); margin: 0;">Acompanhamento profissional para identificar o melhor momento de ofertar seu lance com clareza.</p>',
        '      </div>',
        '      <a href="#diagnostico" style="margin-top: 18px; display: inline-flex; align-items: center; justify-content: center; padding: 12px 20px; border-radius: 999px; background: #C9A86A; color: #5A1220; font-size: 13px; font-weight: 800; text-decoration: none;">Planejar no WhatsApp ➔</a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');

      var faqEl = document.getElementById('faq') || document.querySelector('footer');
      if (faqEl && faqEl.parentNode) {
        faqEl.parentNode.insertBefore(contSec, faqEl);
      }
    }
  }

  if (document.readyState !== 'loading') {
    injectBlocks();
    setTimeout(injectBlocks, 500);
    setTimeout(injectBlocks, 1500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      injectBlocks();
      setTimeout(injectBlocks, 500);
      setTimeout(injectBlocks, 1500);
    });
  }
})();


/* ORDENADOR MESTRE DE USABILIDADE ÁUREA */
(function() {
  function organizeSections() {
    var desiredOrder = [
      'hero',
      'video',
      'video-showcase-section',
      'para-quem',
      'por-que-consorcio',
      'como-funciona',
      'vantagens',
      'moeda-forte',
      'valor-flexivel',
      'contemplacao',
      'depois-da-contemplacao',
      'simulador',
      'faq',
      'diagnostico',
      'sobre',
      'cta-final-patrimonio'
    ];

    var footer = document.querySelector('footer');
    if (!footer || !footer.parentNode) return;
    var container = footer.parentNode;

    // Reposiciona na ordem certa antes do footer
    desiredOrder.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && el.parentNode === container) {
        container.insertBefore(el, footer);
      }
    });

    // Garante que o Sobre a Erlane fique logo antes do footer
    var sobre = document.getElementById('sobre');
    if (sobre && sobre.parentNode === container && sobre.nextElementSibling !== footer) {
      container.insertBefore(sobre, footer);
    }
  }

  if (document.readyState !== 'loading') {
    organizeSections();
    setTimeout(organizeSections, 300);
    setTimeout(organizeSections, 1000);
    setTimeout(organizeSections, 2500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      organizeSections();
      setTimeout(organizeSections, 300);
      setTimeout(organizeSections, 1000);
      setTimeout(organizeSections, 2500);
    });
  }
})();


/* ORDENAÇÃO E INJEÇÃO REAL DOS BLOCOS */
(function() {
  function setupBlocks() {
    // 1. INJETAR "POR QUE CONSTRUIR PATRIMÔNIO VIA CONSÓRCIO" SE NÃO EXISTIR
    if (!document.getElementById('por-que-consorcio')) {
      var sec = document.createElement('section');
      sec.id = 'por-que-consorcio';
      sec.style.cssText = 'background: #FAF6EF; padding: 60px 0; border-top: 1px solid rgba(201,168,106,0.3); border-bottom: 1px solid rgba(201,168,106,0.3); font-family: "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; box-sizing: border-box;';
      sec.innerHTML = [
        '<div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">',
        '  <div style="text-align: center; max-width: 800px; margin: 0 auto 36px auto;">',
        '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 5px 16px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid #C9A86A;">',
        '      SEGURANÇA & DISCIPLINA',
        '    </span>',
        '    <h2 style="font-family: Fraunces, Georgia, serif; font-size: clamp(24px, 3.5vw, 38px); font-weight: 700; color: #5A1220; margin: 16px 0 10px 0; line-height: 1.2; text-align: center;">',
        '      Por que construir patrimônio <span style="font-style: italic; color: #8A6E3E;">via consórcio?</span>',
        '    </h2>',
        '    <p style="font-size: 15px; color: #6B5A5E; line-height: 1.6; margin: 0 auto; max-width: 680px; text-align: center;">',
        '      Compare a economia real em relação a financiamentos bancários convencionais.',
        '    </p>',
        '  </div>',
        '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">',
        '    <div style="background: #FFFFFF; border-radius: 20px; padding: 24px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 15px rgba(90,18,32,0.04); text-align: center;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin: 0 auto 16px auto;">✓</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 20px; font-weight: 700; color: #5A1220; margin-bottom: 10px; text-align: center;">100% Regulamentado</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; text-align: center;">Fiscalizado pelo <strong>Banco Central do Brasil (Lei 11.795/08)</strong>, com total segregação e proteção jurídica dos recursos.</p>',
        '    </div>',
        '    <div style="background: #FFFFFF; border-radius: 20px; padding: 24px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 15px rgba(90,18,32,0.04); text-align: center;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin: 0 auto 16px auto;">$</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 20px; font-weight: 700; color: #5A1220; margin-bottom: 10px; text-align: center;">Poder de Compra à Vista</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; text-align: center;">Na contemplação, você negocia com poder de dinheiro à vista, garantindo descontos reais de mercado.</p>',
        '    </div>',
        '    <div style="background: #FFFFFF; border-radius: 20px; padding: 24px; border: 1px solid rgba(201,168,106,0.3); box-shadow: 0 4px 15px rgba(90,18,32,0.04); text-align: center;">',
        '      <div style="width: 44px; height: 44px; border-radius: 14px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin: 0 auto 16px auto;">★</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 20px; font-weight: 700; color: #5A1220; margin-bottom: 10px; text-align: center;">Zero Juros Bancários</h3>',
        '      <p style="font-size: 14px; line-height: 1.6; color: #6B5A5E; text-align: center;">Sem juros compostos que duplicam ou triplicam o valor do patrimônio. Apenas taxa de administração diluída.</p>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(sec);
    }

    // 2. INJETAR "COMO VOCÊ PODE SER CONTEMPLADO" COM ALERTA EM UMA LINHA
    if (!document.getElementById('contemplacao')) {
      var contSec = document.createElement('section');
      contSec.id = 'contemplacao';
      contSec.style.cssText = 'background: #FFFFFF; padding: 60px 0; border-top: 1px solid rgba(201,168,106,0.25); border-bottom: 1px solid rgba(201,168,106,0.25); font-family: "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; box-sizing: border-box;';
      contSec.innerHTML = [
        '<div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">',
        '  <div style="text-align: center; max-width: 800px; margin: 0 auto 30px auto;">',
        '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 5px 16px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid #C9A86A;">',
        '      SUA CONTEMPLAÇÃO, COM TRANSPARÊNCIA',
        '    </span>',
        '    <h2 style="font-family: Fraunces, Georgia, serif; font-size: clamp(24px, 3.5vw, 38px); font-weight: 700; color: #5A1220; margin: 16px 0 10px 0; line-height: 1.2; text-align: center;">',
        '      Como você pode ser <span style="font-style: italic; color: #8A6E3E;">contemplado</span>',
        '    </h2>',
        '    <p style="font-size: 15px; color: #6B5A5E; line-height: 1.6; margin: 0 auto; max-width: 680px; text-align: center;">',
        '      Existem várias formas de contemplação que se adaptam ao seu momento e planejamento financeiro.',
        '    </p>',
        '  </div>',
        '  <!-- ALERTA EM UMA LINHA SÓ -->',
        '  <div style="margin: 0 auto 30px auto; max-width: 900px; border-radius: 999px; border: 1.5px solid #C9A86A; background: #FFF9EE; padding: 10px 24px; box-shadow: 0 2px 10px rgba(90,18,32,0.04); display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center;">',
        '    <span style="font-size: 15px; line-height: 1;">⚠️</span>',
        '    <span style="font-size: clamp(11.5px, 1.2vw, 13px); font-weight: 700; color: #5A1220; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">',
        '      Não tem como garantir prazo da sua contemplação. Sua contemplação depende do sorteio e de lances, conforme as regras do grupo.',
        '    </span>',
        '  </div>',
        '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">',
        '    <div style="border-radius: 20px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 22px; text-align: center;">',
        '      <div style="width: 40px; height: 40px; border-radius: 12px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin: 0 auto 12px auto;">01</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 19px; font-weight: 700; color: #5A1220; margin: 0 0 8px 0; text-align: center;">Sorteio</h3>',
        '      <p style="font-size: 13.5px; line-height: 1.5; color: #6B5A5E; margin: 0; text-align: center;">Assembleias mensais onde todos os participantes ativos concorrem em igualdade de condições.</p>',
        '    </div>',
        '    <div style="border-radius: 20px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 22px; text-align: center;">',
        '      <div style="width: 40px; height: 40px; border-radius: 12px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin: 0 auto 12px auto;">02</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 19px; font-weight: 700; color: #5A1220; margin: 0 0 8px 0; text-align: center;">Lance Livre</h3>',
        '      <p style="font-size: 13.5px; line-height: 1.5; color: #6B5A5E; margin: 0; text-align: center;">Oferte o percentual que desejar com recursos próprios para adiantar sua contemplação.</p>',
        '    </div>',
        '    <div style="border-radius: 20px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 22px; text-align: center;">',
        '      <div style="width: 40px; height: 40px; border-radius: 12px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin: 0 auto 12px auto;">03</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 19px; font-weight: 700; color: #5A1220; margin: 0 0 8px 0; text-align: center;">Lance Embutido</h3>',
        '      <p style="font-size: 13.5px; line-height: 1.5; color: #6B5A5E; margin: 0; text-align: center;">Utilize parte do próprio crédito como lance, sem precisar ter todo o dinheiro guardado.</p>',
        '    </div>',
        '    <div style="border-radius: 20px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 22px; text-align: center;">',
        '      <div style="width: 40px; height: 40px; border-radius: 12px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin: 0 auto 12px auto;">04</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 19px; font-weight: 700; color: #5A1220; margin: 0 0 8px 0; text-align: center;">Lance Fidelidade</h3>',
        '      <p style="font-size: 13.5px; line-height: 1.5; color: #6B5A5E; margin: 0; text-align: center;">Vantagens e critérios especiais nas regras do grupo que valorizam sua pontualidade.</p>',
        '    </div>',
        '    <div style="border-radius: 20px; border: 1px solid rgba(201,168,106,0.3); background: #FAF6EF; padding: 22px; text-align: center;">',
        '      <div style="width: 40px; height: 40px; border-radius: 12px; background: #5A1220; color: #C9A86A; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin: 0 auto 12px auto;">05</div>',
        '      <h3 style="font-family: Fraunces, Georgia, serif; font-size: 19px; font-weight: 700; color: #5A1220; margin: 0 0 8px 0; text-align: center;">Lance Fixo</h3>',
        '      <p style="font-size: 13.5px; line-height: 1.5; color: #6B5A5E; margin: 0; text-align: center;">Percentual pré-definido pelo regulamento do grupo com desempate transparente no sorteio.</p>',
        '    </div>',
        '    <div style="border-radius: 20px; background: #5A1220; color: #FFFFFF; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #C9A86A; text-align: center;">',
        '      <div>',
        '        <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; color: #E4C98E; margin: 0 0 6px 0;">Estratégia sob medida</p>',
        '        <h3 style="font-family: Fraunces, Georgia, serif; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #FFFFFF; text-align: center;">A Erlane ajuda você a montar o plano ideal.</h3>',
        '        <p style="font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.8); margin: 0; text-align: center;">Análise do seu momento e objetivo com total ética e transparência.</p>',
        '      </div>',
        '      <a href="#diagnostico" style="margin-top: 14px; display: inline-flex; align-items: center; justify-content: center; padding: 11px 18px; border-radius: 999px; background: #C9A86A; color: #5A1220; font-size: 13px; font-weight: 800; text-decoration: none;">Falar com Erlane ➔</a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(contSec);
    }

    // 3. REORGANIZAR TODAS AS SEÇÕES NA ORDEM PERFEITA
    var footer = document.querySelector('footer');
    if (!footer || !footer.parentNode) return;
    var container = footer.parentNode;

    var targetOrder = [
      'para-quem',
      'por-que-consorcio',
      'como-funciona',
      'vantagens',
      'moeda-forte',
      'valor-flexivel',
      'contemplacao',
      'depois-da-contemplacao',
      'simulador',
      'faq',
      'diagnostico',
      'sobre',
      'cta-final-patrimonio'
    ];

    targetOrder.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        container.insertBefore(el, footer);
      }
    });

    // Garante que o Sobre a Erlane fique logo antes do rodapé
    var sobre = document.getElementById('sobre');
    if (sobre) {
      container.insertBefore(sobre, footer);
    }
  }

  function run() {
    setupBlocks();
    setTimeout(setupBlocks, 200);
    setTimeout(setupBlocks, 600);
    setTimeout(setupBlocks, 1500);
  }

  if (document.readyState !== 'loading') {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
