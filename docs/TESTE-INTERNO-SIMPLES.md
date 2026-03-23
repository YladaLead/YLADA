# Teste interno — versão simples

## Qual localhost usar?

Você tem **dois** abertos (3000 e 3004). Use **só um** para não confundir.

- **3004** — normalmente é o que acabou de subir com `npm run dev`.
- **3000** — pode ser um processo antigo ainda rodando.

**Sugestão:** use **só o 3004**. Feche a aba do 3000 ou ignore. Faça tudo (login manual ou agente) em **http://localhost:3004**.

---

## Login automático (agente)

**Sim.** O agente **faz o login sozinho** com a conta **Estética** (teste-estetica@teste.ylada.com). Você não precisa digitar nada.

Ele **abre uma janela nova** do Chrome, entra na página de login, preenche e-mail e senha e clica em Entrar. Tudo automático.

**O que você faz:**

1. Deixe o app rodando (ex.: `npm run dev` → anote a porta, ex.: 3004).
2. Abra o **terminal** na pasta do projeto.
3. Rode:

```bash
URL=http://localhost:3004 HEADLESS=false npm run agente:interno
```

(Para testar outra área: `TESTE_EMAIL=teste-nutri@teste.ylada.com npm run agente:interno`.)

4. Vai abrir **uma janela nova** do Chrome (com um aviso “controlado por software…” — é normal). Nessa janela o agente faz login e percorre tudo. Você só olha.
5. No **terminal** aparece o resultado no final (tabela com ✅ / ⚠️ / ❌).

**Aba anônima:** pode usar para **teste manual** (entrar você mesmo em localhost:3004 e conferir). Para o **agente**, não precisa de aba anônima; ele usa a janela que ele mesmo abre.

---

## Resumo em 3 linhas

| O quê | Onde / como |
|-------|------------------|
| **Um só localhost** | Use só **http://localhost:3004** (ou a porta que o seu `npm run dev` mostrar). |
| **Login automático** | Terminal: `URL=http://localhost:3004 HEADLESS=false npm run agente:interno` → o agente abre uma janela e faz login sozinho. |
| **Ver resultado** | No **terminal**, no final da execução (tabela ✅/⚠️/❌). |
