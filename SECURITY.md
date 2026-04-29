# Política de Segurança — GeraPix

## Reportando Vulnerabilidades

**NÃO abra issues públicas para vulnerabilidades de segurança.**

Envie um e-mail para: security@seudominio.com com:
- Descrição detalhada da vulnerabilidade
- Passos para reprodução
- Impacto potencial

Você receberá resposta em até 48 horas.

## Versões Suportadas

| Versão | Suporte |
|--------|---------|
| 1.x    | ✅ Ativo |

## Práticas de Segurança do Projeto

- Credenciais Firebase nunca são commitadas
- Headers HTTP de segurança configurados via Netlify
- Firestore Rules com validação server-side
- Dependências auditadas regularmente via `npm audit`
