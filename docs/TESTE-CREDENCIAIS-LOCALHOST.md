# Credenciais de teste — Parte interna (localhost)

Use estes e-mails e senhas para testar a **parte interna** em **localhost**, sem afetar produção.

**Padrão de e-mail:** `teste-{segmento}@teste.ylada.com` (matriz em duplicata: `teste-ylada@` e `teste-ylada-2@`). Quem ainda tiver contas antigas `teste-interno-NN@` pode rodar o script uma vez: ele renomeia no Auth antes de criar/atualizar.

**Senha padrão (todas as contas):** `TesteYlada2025!`

**Telefone para preenchimento interno (todas as áreas):** use o mesmo número ao preencher perfil/onboarding em qualquer conta de teste — evita cadastrar números reais e serve para fluxos que pedem telefone/WhatsApp.

- **Telefone:** `+55 19 99723-0912` ou `5519997230912` (mensagens chegam no seu WhatsApp para você ver o que o profissional recebe)  
- Pode ser usado em **todas** as 13 contas (ylada, nutri, coach, seller, estética, perfumaria, psicanalise, etc.) quando o formulário de perfil ou onboarding pedir Telefone/WhatsApp.

---

## Contas sugeridas (13)

| # | E-mail | Uso sugerido |
|---|--------|----------------|
| 1 | teste-ylada@teste.ylada.com | Perfil ylada (matriz) — primeiro teste. *O que é “ylada”?* Ver **docs/O-QUE-E-A-AREA-YLADA.md** |
| 2 | teste-ylada-2@teste.ylada.com | Perfil ylada (reserva ou segundo cenário) |
| 3 | teste-nutri@teste.ylada.com | Perfil nutri |
| 4 | teste-coach@teste.ylada.com | Perfil coach |
| 5 | teste-seller@teste.ylada.com | Perfil seller |
| 6 | teste-nutra@teste.ylada.com | Perfil nutra |
| 7 | teste-med@teste.ylada.com | Perfil med |
| 8 | teste-psi@teste.ylada.com | Perfil psi |
| 9 | teste-odonto@teste.ylada.com | Perfil odonto |
| 10 | teste-fitness@teste.ylada.com | Perfil fitness |
| 11 | teste-estetica@teste.ylada.com | Perfil estética |
| 12 | teste-perfumaria@teste.ylada.com | Perfil perfumaria |
| 13 | teste-psicanalise@teste.ylada.com | Perfil psicanalise (perfil empresarial / Noel preenchido) |

---

## Como usar em localhost

1. **Subir o app:** `npm run dev` (app em http://localhost:3000).
2. **Criar as contas:**  
   - Se o cadastro estiver aberto em localhost: abra **http://localhost:3000/pt/cadastro** (ou /pt/login com “Criar conta”) e cadastre cada e-mail com a senha `TesteYlada2025!`, escolhendo o **perfil** na hora do cadastro/onboarding.  
   - **Recomendado:** rode `node scripts/criar-contas-teste-interno.js` (usa o Supabase do `.env.local`); ele cria ou atualiza as 13 contas com a senha, o perfil e o telefone +55 19 99723-0912 já preenchido no perfil.
3. **Testar:** acesse **http://localhost:3000/pt/login**, entre com uma das contas e siga o **PASSO-A-PASSO-PARTE-INTERNA.md** (board, perfil, Noel, configurações, etc.).
4. **Trocar de perfil:** faça logout e login com outro e-mail da lista para ver se a experiência muda conforme o perfil.

---

## Erro "syntax error at or near \"#!/\""

Esse erro aparece quando o **conteúdo do arquivo** `criar-contas-teste-interno.js` é executado **como SQL** (por exemplo colado no SQL Editor do Supabase ou passado para um script de migration). A primeira linha do `.js` é `#!/usr/bin/env node`, que não é SQL — daí o "syntax error at or near \"#!/\"".

**O que fazer:** não use o SQL Editor do Supabase com o `.js`. Para criar as contas de teste, use **só no terminal** (na pasta do projeto):

```bash
node scripts/criar-contas-teste-interno.js
```

No SQL Editor do Supabase use apenas arquivos `.sql` (por exemplo os que estão em `migrations/` ou `scripts/*.sql`).

---

## Se o login falhar (agente ou manual)

Se aparecer **"Falha no login (verifique e-mail e senha)"** ou **"Email ou senha incorretos"**, a conta ainda não existe no Supabase que o app está usando (ou a senha está diferente).

**Fazer:**

1. No terminal, na pasta do projeto:  
   `node scripts/criar-contas-teste-interno.js`  
   (isso cria/atualiza as 13 contas no Supabase do seu `.env.local`.)

2. Confirme que o app está usando o **mesmo** projeto Supabase (variáveis no `.env.local`).

3. Tente o login de novo (manual em `/pt/login` ou agente):  
   `URL=http://localhost:3003 HEADLESS=false npm run agente:interno`  
   (troque `3003` pela porta em que o app está rodando.)

---

## Segurança

- **Não use essa senha em produção.**  
- Estes e-mails são só para teste local; o domínio `@teste.ylada.com` não precisa existir se o app em localhost não envia e-mail de confirmação ou você desativa isso em dev.  
- Se este arquivo for versionado, evite trocar a senha por algo que você use em outros lugares.

---

## Resumo rápido

- **URL de teste:** http://localhost:3000/pt/login  
- **Senha (todas):** `TesteYlada2025!`  
- **Telefone (preenchimento interno):** +55 19 99723-0912 — use em todas as contas; ao clicar no WhatsApp você vê a mensagem que chega no profissional.  
- **E-mails:** teste-ylada@teste.ylada.com … teste-psicanalise@teste.ylada.com  
