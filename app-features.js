/**
 * APP-FEATURES.JS — Consultoria Patrimonial com Erlane Mota (Aposentadoria & Renda Passiva)
 * Sincronização Automática de Leads (/api/leads), Painel Admin Blindado,
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

  // =========================================================================
  // 1. SISTEMA DE TOASTS DE LUXO (MARSALA & DOURADO)
  // =========================================================================
  window.showToast = function(msg, type) {
    var toast = document.getElementById('erlane-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'erlane-toast';
      toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 99999; padding: 14px 22px; border-radius: 12px; font-size: 14px; font-weight: 600; font-family: "Manrope", sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.25); transition: all 0.3s ease; transform: translateY(100px); opacity: 0; pointer-events: none; max-width: 90vw;';
      document.body.appendChild(toast);
    }

    if (type === 'success') {
      toast.style.background = '#1E3A2F';
      toast.style.color = '#A3E635';
      toast.style.border = '1px solid #4D7C0F';
    } else if (type === 'error') {
      toast.style.background = '#450A0A';
      toast.style.color = '#FCA5A5';
      toast.style.border = '1px solid #DC2626';
    } else {
      toast.style.background = '#320710';
      toast.style.color = '#F3E7C4';
      toast.style.border = '1px solid #D4AF37';
    }

    toast.textContent = msg;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(function() {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 4000);
  };

  // =========================================================================
  // 2. CAPTURA AUTOMÁTICA DE LEADS DO FORMULÁRIO DE DIAGNÓSTICO
  // =========================================================================
  function initLeadCapture() {
    // Intercept form submission or clicks on WhatsApp buttons
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

          // Evita duplicatas consecutivas
          if (!leads.length || leads[0].phone !== phone || leads[0].name !== name) {
            leads.unshift(newLead);
            if (leads.length > 500) leads.pop();
            localStorage.setItem('erlane_leads', JSON.stringify(leads));
          }

          // Despacho assíncrono para a API REST do Cloudflare Worker
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
  // 3. PAINEL ADMINISTRATIVO INTERNO BLINDADO
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
      '    <button onclick="window.setAdminTab('leads')" id="tab-btn-leads" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; background: #D4AF37; color: #1D0A10;">Leads Recebidos</button>',
      '    <button onclick="window.setAdminTab('integration')" id="tab-btn-integration" style="padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #FFFFFF;">Integração com App</button>',
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
    ].join('
');

    document.body.appendChild(modal);

    // Carrega valores salvos de Webhook
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

    container.innerHTML = leads.map(function(l, i) {
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
      window.showToast('Nenhum lead para exportar.', 'error');
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
    window.showToast('Arquivo CSV baixado com sucesso!', 'success');
  };

  window.exportLeadsJSON = function() {
    var leads = localStorage.getItem('erlane_leads') || '[]';
    var blob = new Blob([leads], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'leads-aposentadoria-erlane-mota-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    window.showToast('Arquivo JSON baixado com sucesso!', 'success');
  };

  window.clearAllLeads = function() {
    if (confirm('Tem certeza que deseja limpar todos os leads locais?')) {
      localStorage.removeItem('erlane_leads');
      window.renderAdminLeads();
      window.showToast('Lista de leads limpa.', 'info');
    }
  };

  window.copyApiPullUrl = function() {
    var url = window.location.origin + '/api/leads?token=erlane2026';
    navigator.clipboard.writeText(url).then(function() {
      window.showToast('URL da API copiada! Cole no seu App para puxar os leads.', 'success');
    }).catch(function(){
      window.showToast('URL: ' + url, 'info');
    });
  };

  window.saveAppWebhookConfig = function() {
    var url = (document.getElementById('app-webhook-url') || {}).value || '';
    var token = (document.getElementById('app-webhook-token') || {}).value || '';
    localStorage.setItem('erlane_app_webhook_url', url);
    localStorage.setItem('erlane_app_webhook_token', token);
    window.showToast('Configurações de integração salvas com sucesso!', 'success');
  };

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

  // =========================================================================
  // 4. ATALHOS PARA ABERTURA DO PAINEL ADMIN
  // =========================================================================
  function initAdminTriggers() {
    // A. Atalho de teclado Ctrl + Shift + A
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.openAdminModal();
      }
    });

    // B. Query param ?admin=1
    if (window.location.search.indexOf('admin=1') !== -1) {
      setTimeout(function() {
        window.openAdminModal();
      }, 500);
    }

    // C. Clique 5 vezes no selo EM do rodapé
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

  // =========================================================================
  // 5. INICIALIZAÇÃO
  // =========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initLeadCapture();
      initAdminTriggers();
    });
  } else {
    initLeadCapture();
    initAdminTriggers();
  }

})();
