/**
 * APP-FEATURES.JS — Consultoria Patrimonial com Erlane Mota
 * Simulador de Parcelas Reduzidas Oficial (Padrão consultoriapatrimonialbe),
 * Sincronização de Leads (/api/leads), Painel Admin Blindado,
 * Exportação CSV/JSON, Webhook para App Principal & UX de Luxo.
 */

(function() {
  'use strict';

  // Sanitização Universal Anti-XSS
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 1. DADOS DE MOEDAS E COTAÇÕES CONSERVADORAS
  // ==========================================================================
  var CURRENCIES = {
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 5.85 },
    USD: { name: 'Dólar Americano', symbol: '$', flag: '🇺🇸', rate: 5.60 },
    GBP: { name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧', rate: 7.05 },
    CHF: { name: 'Franco Suíço', symbol: 'CHF', flag: '🇨🇭', rate: 6.30 },
    JPY: { name: 'Iene Japonês', symbol: '¥', flag: '🇯🇵', rate: 0.037 },
    AUD: { name: 'Dólar Australiano', symbol: 'A$', flag: '🇦🇺', rate: 3.70 },
    CAD: { name: 'Dólar Canadense', symbol: 'C$', flag: '🇨🇦', rate: 4.10 }
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
    // Metade da carta dividida pelos meses (parcela reduzida)
    var amortReduced = (credit * 0.50) / months;
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
  // 2. MONTAGEM E INJEÇÃO DO SIMULADOR NO LUGAR OFICIAL
  // ==========================================================================
  function injectSimulator() {
    if (document.getElementById('simulador')) return;

    var section = document.createElement('section');
    section.id = 'simulador';
    section.style.cssText = 'background: #FAF6EF; padding: 48px 0; border-top: 1px solid rgba(201,168,106,0.35); border-bottom: 1px solid rgba(201,168,106,0.35); position: relative; font-family: "Manrope", "Plus Jakarta Sans", system-ui, sans-serif; width: 100%; max-width: 100vw; overflow-x: hidden; box-sizing: border-box;';

    section.innerHTML = [
      '<div class="sim-container">',
      '  <div style="text-align: center; max-width: 800px; margin: 0 auto 32px auto; padding: 0 10px;">',
      '    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 999px; background: #5A1220; color: #F3E7C4; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid #C9A86A; box-shadow: 0 4px 14px rgba(90,18,32,0.15); margin: 0 auto;">',
      '      <span>📊</span> SIMULADOR DE PARCELAS REDUZIDAS',
      '    </span>',
      '    <h2 style="font-family: Fraunces, Georgia, serif; font-size: clamp(24px, 4vw, 40px); font-weight: 600; color: #5A1220; margin: 16px auto 10px auto; line-height: 1.25; text-align: center;">',
      '      Simule sua carta de crédito e veja o valor na sua moeda',
      '    </h2>',
      '    <div style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 14px; border-radius: 999px; background: rgba(90, 18, 32, 0.08); color: #5A1220; font-size: 11px; font-weight: 700; border: 1px solid rgba(201,168,106,0.4); margin: 6px auto 0 auto; text-align: center;">ℹ️ Valores estimados e aproximados conforme taxa de câmbio comercial e tabela vigente</div>',
      '  </div>',
      '  <div class="sim-card">',
      '    <div class="sim-grid-layout">',
      '      <div style="display: flex; flex-direction: column; gap: 22px; justify-content: center; width: 100%; box-sizing: border-box;">',
      '        <div>',
      '          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 4px;">',
      '            <label style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220;">1. Valor da Carta de Crédito:</label>',
      '            <span id="sim-credit-text" style="font-family: Fraunces, Georgia, serif; font-size: 21px; font-weight: 700; color: #5A1220;">R$ 100.000</span>',
      '          </div>',
      '          <div class="sim-credit-btns-row">',
      '            <button type="button" onclick="window.setSimCredit(100000)" class="sim-c-btn active" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid #5A1220; background: #5A1220; color: #F3E7C4; cursor: pointer; transition: all 0.2s; width: 100%;">100 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(150000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">150 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(200000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">200 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(300000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">300 mil</button>',
      '            <button type="button" onclick="window.setSimCredit(500000)" class="sim-c-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">500 mil</button>',
      '          </div>',
      '          <input type="range" id="sim-range-credit" min="80000" max="1000000" step="10000" value="100000" oninput="window.setSimCreditFromSlider(this.value)" style="width: 100%; accent-color: #C9A86A; cursor: pointer; height: 6px;">',
      '          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8A6E3E; margin-top: 4px; font-weight: 600;">',
      '            <span>R$ 80 mil</span>',
      '            <span>R$ 500 mil</span>',
      '            <span>R$ 1 Milhão</span>',
      '          </div>',
      '        </div>',
      '        <div>',
      '          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 4px;">',
      '            <label style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220;">2. Prazo do Consórcio (até 220 meses):</label>',
      '            <span id="sim-months-text" style="font-size: 15px; font-weight: 800; color: #5A1220;">220 meses</span>',
      '          </div>',
      '          <div class="sim-months-btns-row">',
      '            <button type="button" onclick="window.setSimMonths(150)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">150 m</button>',
      '            <button type="button" onclick="window.setSimMonths(180)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">180 m</button>',
      '            <button type="button" onclick="window.setSimMonths(200)" class="sim-m-btn" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid rgba(201,168,106,0.4); background: #FAF6EF; color: #5A1220; cursor: pointer; transition: all 0.2s; width: 100%;">200 m</button>',
      '            <button type="button" onclick="window.setSimMonths(220)" class="sim-m-btn active" style="padding: 10px 4px; border-radius: 12px; font-size: 12px; font-weight: 800; border: 1.5px solid #5A1220; background: #5A1220; color: #F3E7C4; cursor: pointer; transition: all 0.2s; width: 100%;">220 meses</button>',
      '          </div>',
      '        </div>',
      '        <div>',
      '          <label style="display: block; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220; margin-bottom: 8px;">3. Sua moeda de preferência:</label>',
      '          <select id="sim-currency-sel" onchange="window.setSimCurrency(this.value)" style="width: 100%; background: #FAF6EF; border: 1.5px solid #C9A86A; border-radius: 12px; padding: 12px 14px; font-size: 14px; font-weight: 700; color: #5A1220; outline: none; box-sizing: border-box; cursor: pointer;">',
      '            <option value="EUR">🇪🇺 Euro (EUR €)</option>',
      '            <option value="USD">🇺🇸 Dólar Americano (USD $)</option>',
      '            <option value="GBP">🇬🇧 Libra Esterlina (GBP £)</option>',
      '            <option value="CHF">🇨🇭 Franco Suíço (CHF)</option>',
      '            <option value="JPY">🇯🇵 Iene Japonês (JPY ¥)</option>',
      '            <option value="AUD">🇦🇺 Dólar Australiano (AUD A$)</option>',
      '            <option value="CAD">🇨🇦 Dólar Canadense (CAD C$)</option>',
      '          </select>',
      '        </div>',
      '      </div>',
      '      <div style="background: linear-gradient(145deg, #5A1220 0%, #3D0C16 100%); border-radius: 20px; border: 2px solid #C9A86A; padding: clamp(20px, 3.5vw, 32px); color: #FFFFFF; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; box-shadow: 0 12px 35px rgba(90,18,32,0.25); box-sizing: border-box; width: 100%;">',
      '        <div>',
      '          <div style="text-align: center; margin-bottom: 14px;"><div id="sim-badge-reduced" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 18px; border-radius: 999px; background: #C9A86A; color: #5A1220; font-size: 12.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.15); margin: 0 auto;">★ PARCELA REDUZIDA ATÉ A CONTEMPLAÇÃO</div></div>',
      '          <div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 4px; text-align: center;">Seu investimento mensal em Reais:</div>',
      '          <div id="sim-reais-val" style="font-family: Fraunces, Georgia, serif; font-size: clamp(26px, 4vw, 38px); font-weight: 700; color: #F3E7C4; text-align: center;">R$ 336,36 <span style="font-size: 14px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span></div>',
      '        </div>',
      '        <div style="padding-top: 14px; border-top: 1px solid rgba(201,168,106,0.3);">',
      '          <div id="sim-foreign-title" style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #C9A86A; margin-bottom: 2px; text-align: center;">Equivalente no exterior em Euro:</div>',
      '          <div id="sim-foreign-val" style="font-family: Fraunces, Georgia, serif; font-size: clamp(32px, 6vw, 46px); font-weight: 800; color: #F3E7C4; line-height: 1.1; text-align: center;">€ 57,50 <span style="font-size: 15px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span></div>',
      '          <div style="font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 6px; line-height: 1.5; text-align: center;">Um esforço financeiro acessível para você construir patrimônio sólido, multiplicar seu capital com estratégia de ágio ou gerar renda passiva vitalícia.</div>',
      '        </div>',
      '        <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 10px 14px; font-size: 11px; color: rgba(255,255,255,0.75); line-height: 1.4; text-align: center;">* Valores aproximados com base em taxas médias e tabela vigente. Na contemplação, a parcela passa a ser no valor integral.</div>',
      '        <div>',
      '          <button type="button" onclick="window.sendSimToWhatsApp()" style="width: 100%; box-sizing: border-box; padding: 15px 18px; border-radius: 999px; background: #C9A86A; color: #5A1220; font-size: 14px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); margin: 0 auto;">',
      '            <span>Simular Esta Carta no WhatsApp</span>',
      '            <span style="font-size: 18px;">➔</span>',
      '          </button>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(201,168,106,0.3); width: 100%; box-sizing: border-box;">',
      '      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #5A1220; margin-bottom: 12px; text-align: center;">🌐 Comparativo do Esforço Mensal Reduzido em Todas as Moedas:</div>',
      '      <div id="sim-multi-currency-grid" class="sim-multicurrency-grid-row"></div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    // Montagem no host específico
    var host = document.getElementById('simulador-host');
    if (host && host.parentNode) {
      host.parentNode.insertBefore(section, host);
      host.remove();
    } else {
      var secTarget = document.getElementById('estrategia-agio');
      if (secTarget) {
        secTarget.appendChild(section);
      } else {
        var footer = document.querySelector('footer');
        if (footer && footer.parentNode) {
          footer.parentNode.insertBefore(section, footer);
        } else {
          document.body.appendChild(section);
        }
      }
    }

    updateSimulatorUI();
  }

  function updateSimulatorUI() {
    var calc = calculate(state.credit, state.months);
    var curr = CURRENCIES[state.currency] || CURRENCIES.EUR;

    // 1. Atualizar texto do crédito
    var cText = document.getElementById('sim-credit-text');
    if (cText) cText.textContent = 'R$ ' + state.credit.toLocaleString('pt-BR');

    // 2. Atualizar texto do prazo
    var mText = document.getElementById('sim-months-text');
    if (mText) mText.textContent = state.months + ' meses';

    // 3. Atualizar valor em Reais (Parcela Reduzida)
    var rVal = document.getElementById('sim-reais-val');
    if (rVal) {
      rVal.innerHTML = 'R$ ' + calc.reducedTotal.toFixed(2).replace('.', ',') + ' <span style="font-size: 14px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span>';
    }

    // 4. Atualizar TÍTULO da moeda estrangeira
    var fTitle = document.getElementById('sim-foreign-title');
    if (fTitle) {
      fTitle.textContent = 'Equivalente no exterior em ' + curr.name + ':';
    }

    // 5. Atualizar VALOR da moeda estrangeira
    var fVal = calculateForeign(calc.reducedTotal, state.currency);
    var fStr = (state.currency === 'JPY') 
      ? Math.round(fVal).toLocaleString('pt-BR') 
      : fVal.toFixed(2).replace('.', ',');

    var fValEl = document.getElementById('sim-foreign-val');
    if (fValEl) {
      fValEl.innerHTML = curr.symbol + ' ' + fStr + ' <span style="font-size: 16px; font-weight: normal; color: rgba(255,255,255,0.7);">/mês</span>';
    }

    // 6. Atualizar slider e select de moeda
    var range = document.getElementById('sim-range-credit');
    if (range && Number(range.value) !== state.credit) range.value = state.credit;

    var sel = document.getElementById('sim-currency-sel');
    if (sel && sel.value !== state.currency) sel.value = state.currency;

    // 7. Atualizar grade comparativa multimoedas com clique interativo
    var grid = document.getElementById('sim-multi-currency-grid');
    if (grid) {
      grid.innerHTML = Object.keys(CURRENCIES).map(function(k) {
        var c = CURRENCIES[k];
        var v = calculateForeign(calc.reducedTotal, k);
        var s = (k === 'JPY') ? Math.round(v).toLocaleString('pt-BR') : v.toFixed(0);
        var isSel = (k === state.currency);
        return '<div onclick="window.setSimCurrency(\'' + k + '\')" style="cursor: pointer; transition: all 0.2s; background: ' + (isSel ? '#5A1220' : '#FFFFFF') + '; border: 1.5px solid ' + (isSel ? '#C9A86A' : 'rgba(201,168,106,0.35)') + '; border-radius: 14px; padding: 10px 8px; text-align: center; color: ' + (isSel ? '#F3E7C4' : '#5A1220') + '; box-shadow: ' + (isSel ? '0 6px 18px rgba(90,18,32,0.25)' : '0 2px 6px rgba(0,0,0,0.03)') + '; user-select: none;">' +
          '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase;">' + c.flag + ' ' + k + '</div>' +
          '<div style="font-family: Fraunces, Georgia, serif; font-size: 17px; font-weight: 700; margin-top: 4px;">' + c.symbol + ' ' + s + '<span style="font-size: 11px; font-weight: normal; opacity: 0.8;">/mês</span></div>' +
        '</div>';
      }).join('');
    }
  }

  window.setSimCredit = function(val) {
    state.credit = Number(val);
    document.querySelectorAll('.sim-c-btn').forEach(function(b) {
      var isTarget = b.textContent.includes(String(val / 1000));
      b.style.background = isTarget ? '#5A1220' : '#FAF6EF';
      b.style.color = isTarget ? '#F3E7C4' : '#5A1220';
      b.style.borderColor = isTarget ? '#5A1220' : 'rgba(201,168,106,0.4)';
    });
    updateSimulatorUI();
  };

  window.setSimCreditFromSlider = function(val) {
    state.credit = Number(val);
    document.querySelectorAll('.sim-c-btn').forEach(function(b) {
      var isTarget = b.textContent.includes(String(val / 1000));
      b.style.background = isTarget ? '#5A1220' : '#FAF6EF';
      b.style.color = isTarget ? '#F3E7C4' : '#5A1220';
      b.style.borderColor = isTarget ? '#5A1220' : 'rgba(201,168,106,0.4)';
    });
    updateSimulatorUI();
  };

  window.setSimMonths = function(val) {
    state.months = Number(val);
    document.querySelectorAll('.sim-m-btn').forEach(function(b) {
      var isTarget = b.textContent.includes(String(val));
      b.style.background = isTarget ? '#5A1220' : '#FAF6EF';
      b.style.color = isTarget ? '#F3E7C4' : '#5A1220';
      b.style.borderColor = isTarget ? '#5A1220' : 'rgba(201,168,106,0.4)';
    });
    updateSimulatorUI();
  };

  window.setSimCurrency = function(val) {
    if (!CURRENCIES[val]) return;
    state.currency = val;
    updateSimulatorUI();
  };

  window.sendSimToWhatsApp = function() {
    var res = calculate(state.credit, state.months);
    var curr = CURRENCIES[state.currency] || CURRENCIES.EUR;
    var fVal = res.reducedTotal / curr.rate;
    var fStr = (state.currency === 'JPY') ? Math.round(fVal).toLocaleString('pt-BR') : fVal.toFixed(2).replace('.', ',');

    var msg = [
      'Olá, Erlane! Fiz uma simulação no seu site oficial com parcela reduzida:',
      '',
      '• *Carta de Crédito:* R$ ' + state.credit.toLocaleString('pt-BR'),
      '• *Prazo do Plano:* ' + state.months + ' meses',
      '• *Parcela Reduzida (até a contemplação):* R$ ' + res.reducedTotal.toFixed(2).replace('.', ',') + ' / mês',
      '• *Equivalente em ' + curr.name + ':* ' + curr.symbol + ' ' + fStr + ' / mês',
      '',
      'Gostaria de receber meu diagnóstico gratuito e saber mais sobre as melhores cartas disponíveis!'
    ].join('\n');

    // Despacha lead para a API e abre WhatsApp
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Interessado na Simulação',
          phone: '',
          goal: 'Carta R$ ' + state.credit.toLocaleString('pt-BR') + ' em ' + state.months + 'm',
          credit: state.credit,
          months: state.months,
          reducedMonthly: res.reducedTotal,
          currency: state.currency,
          foreignMonthly: fVal,
          source: 'Simulador de Parcelas Reduzidas'
        })
      }).catch(function(){});
    } catch(e) {}

    window.open('https://wa.me/5538997373140?text=' + encodeURIComponent(msg), '_blank');
  };

  // =========================================================================
  // 3. CAPTURA AUTOMÁTICA DE LEADS DO FORMULÁRIO DE DIAGNÓSTICO
  // =========================================================================
  function initLeadCapture() {
    document.addEventListener('click', function(e) {
      var target = e.target.closest('button, a');
      if (!target) return;

      var text = (target.textContent || '').toLowerCase();
      var href = target.getAttribute('href') || '';
      var isDiagSubmit = text.includes('diagnóstico') || text.includes('diagnostico') || href.includes('wa.me');

      if (isDiagSubmit) {
        var nameInput = document.getElementById('nome') || document.querySelector('input[placeholder*="nome" i]');
        var phoneInput = document.getElementById('whatsapp') || document.querySelector('input[placeholder*="whats" i], input[type="tel"]');
        var cityInput = document.getElementById('cidade') || document.querySelector('input[placeholder*="onde" i], input[placeholder*="mora" i], input[placeholder*="cidade" i]');

        var name = (nameInput && nameInput.value.trim()) || 'Interessado(a)';
        var phone = (phoneInput && phoneInput.value.trim()) || '';
        var city = (cityInput && cityInput.value.trim()) || 'Brasil';

        if (phone || name !== 'Interessado(a)') {
          var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');
          var newLead = {
            id: 'lead_' + Date.now(),
            name: name,
            phone: phone,
            city: city,
            goal: 'Aposentadoria e Renda Passiva',
            date: new Date().toLocaleString('pt-BR'),
            source: 'Website Oficial - Aposentadoria Patrimonial'
          };

          if (!leads.length || leads[0].phone !== phone || leads[0].name !== name) {
            leads.unshift(newLead);
            if (leads.length > 500) leads.pop();
            localStorage.setItem('erlane_leads', JSON.stringify(leads));
          }

          try {
            var webhookUrl = localStorage.getItem('erlane_app_webhook_url') || '';
            var webhookToken = localStorage.getItem('erlane_app_webhook_token') || '';
            fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: newLead.name,
                phone: newLead.phone,
                city: newLead.city,
                goal: newLead.goal,
                webhookUrl: webhookUrl,
                webhookToken: webhookToken,
                createdAt: new Date().toISOString()
              })
            }).catch(function(err) {
              console.log('Lead sync notice:', err);
            });
          } catch(err) {}
        }
      }
    }, true);
  }

  // =========================================================================
  // 4. PAINEL ADMINISTRATIVO INTERNO BLINDADO
  // =========================================================================
  function injectAdminModal() {
    if (document.getElementById('admin-modal')) return;

    var modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.className = 'hidden';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: rgba(10,3,5,0.85); backdrop-filter: blur(16px); display: none; align-items: center; justify-content: center; padding: 16px; font-family: "Manrope", system-ui, sans-serif;';

    modal.innerHTML = [
      '<div style="background: #1D0A10; border: 1px solid rgba(212,175,55,0.35); border-radius: 20px; width: 100%; max-width: 780px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">',
      '  <div style="background: #320710; padding: 18px 24px; border-bottom: 1px solid rgba(212,175,55,0.25); display: flex; align-items: center; justify-content: space-between;">',
      '    <div style="display: flex; align-items: center; gap: 12px;">',
      '      <span style="font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: #D4AF37;">EM</span>',
      '      <div>',
      '        <h2 style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin: 0; line-height: 1.2;">Painel de Gestão de Leads — Aposentadoria</h2>',
      '        <p style="font-size: 11px; color: #C4B299; margin: 0;">Erlane Mota • Consultoria Patrimonial</p>',
      '      </div>',
      '    </div>',
      '    <button onclick="window.closeAdminModal()" style="background: none; border: none; color: #FFFFFF; font-size: 24px; cursor: pointer; padding: 4px 8px; line-height: 1;">&times;</button>',
      '  </div>',
      '  <div style="padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; flex-wrap: wrap; gap: 8px; background: rgba(29,10,16,0.6);">',
      '    <button onclick="window.setAdminTab(\'leads\')" id="tab-btn-leads" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; background: #D4AF37; color: #1D0A10;">Leads Recebidos</button>',
      '    <button onclick="window.setAdminTab(\'integration\')" id="tab-btn-integration" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #FFFFFF;">Integração com App</button>',
      '  </div>',
      '  <div id="admin-tab-leads" style="padding: 20px 24px; overflow-y: auto; flex: 1;">',
      '    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">',
      '      <span id="admin-leads-count" style="font-size: 13px; color: #C4B299;">0 leads registrados</span>',
      '      <div style="display: flex; gap: 8px;">',
      '        <button onclick="window.exportLeadsCSV()" style="background: #320710; border: 1px solid #D4AF37; color: #D4AF37; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">Exportar CSV / Excel</button>',
      '        <button onclick="window.exportLeadsJSON()" style="background: #320710; border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Exportar JSON</button>',
      '        <button onclick="window.clearAllLeads()" style="background: rgba(220,38,38,0.2); border: 1px solid #DC2626; color: #FCA5A5; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Limpar</button>',
      '      </div>',
      '    </div>',
      '    <div id="admin-leads-list" style="display: flex; flex-direction: column; gap: 10px;"></div>',
      '  </div>',
      '  <div id="admin-tab-integration" style="padding: 20px 24px; overflow-y: auto; flex: 1; display: none;">',
      '    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 18px; margin-bottom: 16px;">',
      '      <h3 style="font-size: 14px; color: #D4AF37; font-weight: 700; margin: 0 0 8px 0;">1. PULL: Puxar Leads no seu App Principal</h3>',
      '      <p style="font-size: 12px; color: #C4B299; line-height: 1.5; margin: 0 0 12px 0;">Seu app pode consumir a rota REST autenticada para obter os leads capturados em formato JSON:</p>',
      '      <div style="display: flex; gap: 8px; align-items: center;">',
      '        <input id="api-pull-input" type="text" readonly value="https://consultoriapatrimonialap.emia.workers.dev/api/leads?token=erlane2026" style="flex: 1; background: #0F0407; border: 1px solid rgba(255,255,255,0.15); color: #F3E7C4; font-family: monospace; font-size: 11px; padding: 8px 12px; border-radius: 6px;" />',
      '        <button onclick="window.copyApiPullUrl()" style="background: #D4AF37; color: #1D0A10; border: none; padding: 8px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Copiar</button>',
      '      </div>',
      '    </div>',
      '    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 18px;">',
      '      <h3 style="font-size: 14px; color: #D4AF37; font-weight: 700; margin: 0 0 8px 0;">2. PUSH: Webhook Automático para seu App</h3>',
      '      <p style="font-size: 12px; color: #C4B299; line-height: 1.5; margin: 0 0 12px 0;">Receba cada lead em tempo real na URL da sua API ou CRM quando o cliente preenche:</p>',
      '      <div style="display: flex; flex-direction: column; gap: 10px;">',
      '        <div>',
      '          <label style="font-size: 11px; color: #FFFFFF; font-weight: 600; display: block; margin-bottom: 4px;">URL do Webhook (Endpoint do seu App):</label>',
      '          <input id="app-webhook-url" type="url" placeholder="https://seuapp.com/api/webhook/leads" style="width: 100%; box-sizing: border-box; background: #0F0407; border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-size: 12px; padding: 8px 12px; border-radius: 6px;" />',
      '        </div>',
      '        <div>',
      '          <label style="font-size: 11px; color: #FFFFFF; font-weight: 600; display: block; margin-bottom: 4px;">Token de Autenticação Bearer (Opcional):</label>',
      '          <input id="app-webhook-token" type="text" placeholder="meu-token-secreto" style="width: 100%; box-sizing: border-box; background: #0F0407; border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-size: 12px; padding: 8px 12px; border-radius: 6px;" />',
      '        </div>',
      '        <div style="display: flex; gap: 8px; margin-top: 6px;">',
      '          <button onclick="window.saveAppWebhookConfig()" style="background: #D4AF37; color: #1D0A10; border: none; padding: 8px 16px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Salvar Configuração</button>',
      '          <button onclick="window.testAppWebhook()" style="background: #320710; border: 1px solid #D4AF37; color: #D4AF37; padding: 8px 16px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">Testar Conexão</button>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(modal);

    var savedUrl = localStorage.getItem('erlane_app_webhook_url') || '';
    var savedToken = localStorage.getItem('erlane_app_webhook_token') || '';
    var urlInput = document.getElementById('app-webhook-url');
    var tokenInput = document.getElementById('app-webhook-token');
    if (urlInput && savedUrl) urlInput.value = savedUrl;
    if (tokenInput && savedToken) tokenInput.value = savedToken;
  }

  window.openAdminModal = function() {
    injectAdminModal();
    var modal = document.getElementById('admin-modal');
    if (modal) {
      modal.className = '';
      modal.style.display = 'flex';
      window.renderAdminLeads();
    }
  };

  window.closeAdminModal = function() {
    var modal = document.getElementById('admin-modal');
    if (modal) {
      modal.className = 'hidden';
      modal.style.display = 'none';
    }
  };

  window.setAdminTab = function(tab) {
    var leadsTab = document.getElementById('admin-tab-leads');
    var intTab = document.getElementById('admin-tab-integration');
    var btnLeads = document.getElementById('tab-btn-leads');
    var btnInt = document.getElementById('tab-btn-integration');

    if (tab === 'leads') {
      if (leadsTab) leadsTab.style.display = 'block';
      if (intTab) intTab.style.display = 'none';
      if (btnLeads) { btnLeads.style.background = '#D4AF37'; btnLeads.style.color = '#1D0A10'; btnLeads.style.border = 'none'; }
      if (btnInt) { btnInt.style.background = 'transparent'; btnInt.style.color = '#FFFFFF'; btnInt.style.border = '1px solid rgba(255,255,255,0.2)'; }
    } else {
      if (leadsTab) leadsTab.style.display = 'none';
      if (intTab) intTab.style.display = 'block';
      if (btnInt) { btnInt.style.background = '#D4AF37'; btnInt.style.color = '#1D0A10'; btnInt.style.border = 'none'; }
      if (btnLeads) { btnLeads.style.background = 'transparent'; btnLeads.style.color = '#FFFFFF'; btnLeads.style.border = '1px solid rgba(255,255,255,0.2)'; }
    }
  };

  window.renderAdminLeads = function() {
    var container = document.getElementById('admin-leads-list');
    var countEl = document.getElementById('admin-leads-count');
    if (!container) return;

    var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');
    if (countEl) countEl.textContent = leads.length + (leads.length === 1 ? ' lead registrado' : ' leads registrados');

    if (!leads.length) {
      container.innerHTML = '<div style="text-align: center; padding: 40px 10px; color: #8F7B80; font-size: 13px;">Nenhum lead capturado ainda. Quando os clientes preencherem o formulário, eles aparecerão aqui.</div>';
      return;
    }

    container.innerHTML = leads.map(function(l) {
      return [
        '<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">',
        '  <div>',
        '    <div style="font-weight: 700; color: #FFFFFF; font-size: 14px;">' + escapeHTML(l.name) + ' <span style="font-weight: 400; color: #D4AF37; font-size: 11px;">(' + escapeHTML(l.city || l.country || 'Brasil') + ')</span></div>',
        '    <div style="color: #C4B299; font-size: 12px; margin-top: 2px;">📱 ' + escapeHTML(l.phone || 'Sem telefone') + ' • ' + escapeHTML(l.goal || 'Aposentadoria') + '</div>',
        '    <div style="color: #6B5A5E; font-size: 10px; margin-top: 2px;">' + escapeHTML(l.date || '') + '</div>',
        '  </div>',
        '  <div style="display: flex; gap: 6px;">',
        l.phone ? '    <a href="https://wa.me/' + l.phone.replace(/\D/g, '') + '" target="_blank" rel="noopener noreferrer" style="background: #25D366; color: #000; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700;">Chamar WhatsApp</a>' : '',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  };

  window.exportLeadsCSV = function() {
    var leads = JSON.parse(localStorage.getItem('erlane_leads') || '[]');
    if (!leads.length) {
      alert('Nenhum lead para exportar.');
      return;
    }
    var csv = 'Nome,Telefone,Cidade,Objetivo,Data\n';
    leads.forEach(function(l) {
      csv += '"' + (l.name||'').replace(/"/g, '""') + '","' + 
             (l.phone||'').replace(/"/g, '""') + '","' + 
             (l.city||l.country||'').replace(/"/g, '""') + '","' + 
             (l.goal||'').replace(/"/g, '""') + '","' + 
             (l.date||'') + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'leads-aposentadoria-erlane-mota-' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
  };

  window.exportLeadsJSON = function() {
    var leads = localStorage.getItem('erlane_leads') || '[]';
    var blob = new Blob([leads], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'leads-aposentadoria-erlane-mota-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
  };

  window.clearAllLeads = function() {
    if (confirm('Tem certeza que deseja limpar todos os leads locais?')) {
      localStorage.removeItem('erlane_leads');
      window.renderAdminLeads();
    }
  };

  window.copyApiPullUrl = function() {
    var url = window.location.origin + '/api/leads?token=erlane2026';
    navigator.clipboard.writeText(url).then(function() {
      alert('URL da API copiada! Cole no seu App para puxar os leads.');
    }).catch(function(){
      alert('URL: ' + url);
    });
  };

  window.saveAppWebhookConfig = function() {
    var url = (document.getElementById('app-webhook-url') || {}).value || '';
    var token = (document.getElementById('app-webhook-token') || {}).value || '';
    localStorage.setItem('erlane_app_webhook_url', url);
    localStorage.setItem('erlane_app_webhook_token', token);
    alert('Configurações salvas!');
  };

  window.testAppWebhook = function() {
    var url = (document.getElementById('app-webhook-url') || {}).value || '';
    var token = (document.getElementById('app-webhook-token') || {}).value || '';
    if (!url || !url.startsWith('http')) {
      alert('Informe uma URL de Webhook válida.');
      return;
    }
    fetch('/api/webhook/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url, token: token })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      alert(data.success ? 'Conexão confirmada com sucesso!' : 'Erro: ' + (data.message || data.error));
    })
    .catch(function(err){
      alert('Erro: ' + err.message);
    });
  };

  // =========================================================================
  // 5. ATALHOS PARA O ADMIN & INICIALIZAÇÃO
  // =========================================================================
  function initAdminTriggers() {
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.openAdminModal();
      }
    });

    if (window.location.search.indexOf('admin=1') !== -1) {
      setTimeout(function() { window.openAdminModal(); }, 600);
    }

    var emClicks = 0;
    var emResetTimer = null;
    document.addEventListener('click', function(e) {
      var target = e.target;
      if (target && target.textContent && target.textContent.trim() === 'EM') {
        emClicks++;
        clearTimeout(emResetTimer);
        emResetTimer = setTimeout(function() { emClicks = 0; }, 2000);
        if (emClicks >= 5) {
          emClicks = 0;
          window.openAdminModal();
        }
      }
    });
  }

  function start() {
    injectSimulator();
    initLeadCapture();
    initAdminTriggers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
