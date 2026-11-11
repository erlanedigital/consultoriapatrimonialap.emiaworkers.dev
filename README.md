# Erlane Mota — Consultoria Patrimonial (Aposentadoria & Renda Passiva)

> **Produção Oficial:** [consultoriapatrimonialap.emia.workers.dev](https://consultoriapatrimonialap.emia.workers.dev)  
> **Repositório Oficial:** [github.com/erlanedigital/consultoriapatrimonialap.emiaworkers.dev](https://github.com/erlanedigital/consultoriapatrimonialap.emiaworkers.dev)

Aplicação Web Single-Page Application (SPA) e Progressive Web App (PWA) de altíssimo padrão visual e segurança bancária para consultoria patrimonial, estratégias de ágio/lucro e aposentadoria sem depender apenas do INSS com Erlane Mota.

---

## 🌟 Características e Arquitetura

- **Design System Áureo:** Marsala Imperial (`#5A1220`), Dourado Champanhe (`#D4AF37`), Linho Nobre (`#FAF6EF`) e Espresso (`#1D0A10`).
- **Tipografia:** `Fraunces` (serifada de alta costura) + `Manrope` e `Plus Jakarta Sans`.
- **Regra 32:** Justificação de todo o corpo editorial de textos preservando centralização de títulos, botões e cabeçalhos.
- **PWA Completo:** Manifest, service workers, ícones vetorizados SVG e PNGs em alta definição com monograma EM dourado.
- **Segurança Bancária:** Cabeçalhos HSTS (`max-age=63072000; includeSubDomains; preload`), CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- **Backend Cloudflare Worker (`src/worker.js`):**
  - `GET /api/leads?token=erlane2026`: Consumo de leads pelo App Principal (PULL).
  - `POST /api/leads`: Captura de leads com webhook dispatch em tempo real (PUSH).
  - `GET /api/health`: Monitoramento de status em tempo real.
- **Painel Administrativo Interno:** Exportação CSV/Excel e JSON de leads, configuração de Webhook e gerenciamento de contatos.

---

## 🚀 Como Executar Localmente e Fazer Deploy

```bash
# Compilar para a pasta dist/
npm run build

# Deploy contínuo no Cloudflare Workers
npm run deploy
```
