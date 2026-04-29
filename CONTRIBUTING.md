# Guia de Contribuição — GeraPix

## Fluxo de Trabalho (Git Flow simplificado)

```
main           ← Produção (protegida, apenas via PR)
  └── develop  ← Desenvolvimento (branch base para PRs)
        └── feature/nome-da-feature  ← Seu trabalho
```

## Passo a Passo

1. Fork do repositório
2. `git checkout develop`
3. `git checkout -b feature/minha-feature`
4. Implemente e teste localmente
5. `npm run ci` (deve passar sem erros)
6. Abra PR apontando para `develop`

## Padrão de Commits (Conventional Commits)

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação
refactor: refatoração sem mudança de comportamento
test:     testes
chore:    tarefas de manutenção
```

Exemplo: `feat: adicionar download do QR Code como PNG`
