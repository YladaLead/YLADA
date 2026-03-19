# E-mails teste interno — perfil por e-mail

Use esta lista no outro chat. **Contas 03 a 12 têm perfil empresarial já preenchido** pelo script `scripts/criar-contas-teste-interno.js` (nome, WhatsApp, tipo, profissão e textos realistas por área). O agente **não precisa passar pelo fluxo de perfil** nessas contas — pode ir direto para Noel, diagnósticos, leads, etc.

- **01 e 02:** área ylada (matriz); não é necessário preencher perfil para os testes.
- **03 a 12:** cada uma com nome e perfil realistas; perfil já completo no banco.

---

## Tabela: e-mail, nome, área e foco do perfil

| # | E-mail | Nome | Área | Foco do perfil (argumento forte) |
|---|--------|------|------|-----------------------------------|
| 1 | teste-interno-01@teste.ylada.com | Teste Interno 01 | ylada | — |
| 2 | teste-interno-02@teste.ylada.com | Teste Interno 02 | ylada | — |
| 3 | teste-interno-03@teste.ylada.com | Marina Silva | nutri | Emagrecimento e intestino; preencher agenda com link que qualifica no Instagram/WhatsApp |
| 4 | teste-interno-04@teste.ylada.com | Ricardo Costa | coach | Carreira e produtividade; escalar com programa online e quiz que qualifica no LinkedIn/Instagram |
| 5 | teste-interno-05@teste.ylada.com | Fernanda Lima | seller | Reconectar leads frios e fechar mais pelo WhatsApp com calculadora/quiz que qualifica |
| 6 | teste-interno-06@teste.ylada.com | Bruno Oliveira | nutra | Suplementos (B12, energia, emagrecimento); link que mostra necessidade antes de falar de produto |
| 7 | teste-interno-07@teste.ylada.com | Dra. Camila Rocha | med | Clínica geral; preencher horários com presença digital e link que gera agendamento |
| 8 | teste-interno-08@teste.ylada.com | Patrícia Alves | psi | Ansiedade e sono; ser encontrada por quem já se identifica e reduzir tabu da terapia |
| 9 | teste-interno-09@teste.ylada.com | Dr. André Souza | odonto | Consultório particular; divulgar tratamentos e qualificar quem entra em contato |
| 10 | teste-interno-10@teste.ylada.com | Lucas Ferreira | fitness | Personal e turmas; preencher vagas com link que engaja e traz lead para avaliação/primeira aula |
| 11 | teste-interno-11@teste.ylada.com | Juliana Martins | estetica | Facial e limpeza de pele; destacar no Instagram com link que qualifica e gera agendamento |
| 12 | teste-interno-12@teste.ylada.com | Amanda Ribeiro | perfumaria | Quiz de perfil olfativo para reduzir dúvida e aumentar conversão no Instagram/WhatsApp |

**Senha (todas):** `TesteYlada2025!`

---

## Lista só de e-mails (copiar/colar)

```
teste-interno-01@teste.ylada.com
teste-interno-02@teste.ylada.com
teste-interno-03@teste.ylada.com
teste-interno-04@teste.ylada.com
teste-interno-05@teste.ylada.com
teste-interno-06@teste.ylada.com
teste-interno-07@teste.ylada.com
teste-interno-08@teste.ylada.com
teste-interno-09@teste.ylada.com
teste-interno-10@teste.ylada.com
teste-interno-11@teste.ylada.com
teste-interno-12@teste.ylada.com
```

---

## Para o agente de verificação

- **Contas 01 e 02:** não é necessário preencher perfil; pode testar fluxo ylada como está.
- **Contas 03 a 12:** perfil já está preenchido (nome, WhatsApp, profile_type, profession e textos por área). **Não é preciso passar pelo processo de perfil empresarial** — o login já leva para a área correta com perfil completo. Use essas contas para testar Noel, diagnósticos, leads, sidebar, etc., sem etapa de perfil.

Para recriar ou atualizar todas as contas e perfis no banco, execute:

```bash
node scripts/criar-contas-teste-interno.js
```

Requer `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
