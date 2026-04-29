<div align="center">
  <img src="public/logo512.png" alt="GeraPix Logo" width="120" />
  <h1>GeraPix</h1>
  <p><strong>Gerador de QR Code PIX com painel administrativo</strong></p>

  [![Netlify Status](https://api.netlify.com/api/v1/badges/SEU_BADGE_ID/deploy-status)](https://app.netlify.com/sites/gerapix/deploys)
  [![CI](https://github.com/severinarocha/gerapix/actions/workflows/ci.yml/badge.svg)](https://github.com/severinarocha/gerapix/actions)
  ![License](https://img.shields.io/badge/license-MIT-blue)
  ![Node](https://img.shields.io/badge/node-%3E%3D20-green)
</div>

---

## 🌐 URLs

| Ambiente | URL | Branch |
|----------|-----|--------|
| **Produção** | https://gerapix.netlify.app | `main` |
| **Desenvolvimento** | https://gerapix-dev.netlify.app | `develop` |
| **Preview (PRs)** | Gerado automaticamente pelo Netlify | `feature/*` |

## ✨ Funcionalidades

- 🔲 Geração de QR Code PIX (padrão EMV/BR Code — BACEN compliant)
- 📋 Código Copia e Cola com um clique
- 🔐 Painel administrativo com autenticação por e-mail e senha
- 👥 Gerenciamento de até 3 usuários administradores
- 📱 PWA instalável — funciona offline após primeiro acesso
- 🖨️ Impressão otimizada do QR Code
- 📊 Histórico de transações geradas

## 🛠️ Stack Técnica

| Tecnologia | Versão | Função |
|------------|--------|--------|
| React | 19 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 6 | Build Tool |
| Firebase Auth | 12 | Autenticação |
| Firestore | 12 | Banco de dados |
| Tailwind CSS | 4 | Estilização |
| Netlify | — | Hosting & CI/CD |

## 🚀 Instalação e Uso Local

### Pré-requisitos
- Node.js >= 20
- npm >= 10
- Conta no Firebase (criar dois projetos: DEV e PROD)

### 1. Clone e instale
```bash
git clone https://github.com/severinarocha/gerapix.git
cd gerapix
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env.development
# Edite .env.development com as credenciais do seu projeto Firebase DEV
```

### 3. Execute em desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

### 4. Build de produção local
```bash
npm run build:prod
npm run preview
```

## 🔧 Variáveis de Ambiente

Consulte `.env.example` para a lista completa de variáveis necessárias.

**Nunca commite arquivos `.env` com valores reais.**

## 📦 Deploy

O deploy é automático via Netlify:
- Push para `develop` → deploya em https://gerapix-dev.netlify.app
- Push para `main` → deploya em https://gerapix.netlify.app
- Pull Request → gera URL de preview único

Consulte [DEPLOY.md](DEPLOY.md) para configuração detalhada.

## 🤝 Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

## 🔒 Segurança

Consulte [SECURITY.md](SECURITY.md) para reportar vulnerabilidades.

## 📄 Licença

MIT © [Severina Rocha](https://github.com/severinarocha)
