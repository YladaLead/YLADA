# Diagnóstico: pessoa inscreveu e não recebeu a automação (Carol não respondeu)

Quando alguém envia "Acabei de me inscrever na aula prática..." e **não recebe** a resposta automática da Carol, verifique nesta ordem:

---

## 1. Carol ligada globalmente

- **Variável:** `CAROL_AUTOMATION_DISABLED` no ambiente (Vercel / .env).
- **Para a Carol responder:** o valor deve ser exatamente `false` (string).
- Se estiver ausente ou `true`, o webhook **não chama** a Carol e registra no log:  
  `[Z-API Webhook] ⏭️ Carol desligada globalmente (CAROL_AUTOMATION_DISABLED)`.
- **Ação:** em produção, definir `CAROL_AUTOMATION_DISABLED=false`. Ver `PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md`.

---

## 2. Modo manual na conversa

- Se a conversa está com **modo manual** (tag `manual_mode` / `atendimento_manual` ou `context.manual_mode === true`), o webhook **não** processa com Carol.
- **Log:** `[Z-API Webhook] 🛑 Modo manual ativo para conversa`.
- **Ação:** no painel da conversa, desativar modo manual / remover a tag.

---

## 3. Webhook recebendo a mensagem

- A Z-API precisa estar configurada para enviar **POST** para a URL do webhook (ex.: `https://seu-dominio.com/api/webhooks/z-api`).
- Se o evento for "Ao enviar" ou vier com `fromMe: true`, o sistema trata como mensagem **nossa** e não dispara Carol.
- **Log:** `[Z-API Webhook] 📤 ✅ MENSAGEM ENVIADA POR NÓS` → não há processamento para o cliente.
- **Ação:** conferir na Z-API se o webhook "Ao receber" está apontando para essa URL e se o payload não está marcado como enviado por nós.

---

## 4. Texto da mensagem (botão)

- Se a pessoa **clicou no botão** do WhatsApp ("Acabei de me inscrever..."), a Z-API pode enviar `buttonId` e/ou `buttonText`.
- O webhook prioriza **buttonText** quando tem mais de 20 caracteres, para a Carol reconhecer a mensagem de inscrição e enviar boas-vindas + opções.
- Se a mensagem vier vazia ou só com um ID curto e a Carol não identificar como "mensagem do botão", a resposta pode ser genérica ou o fluxo diferente.
- **Log:** `[Z-API Webhook] 🔘 Clique em botão detectado` e `message: ...` (conferir se o texto completo está em `message`).

---

## 5. Duplicação / “já processou”

- Para não responder duas vezes à mesma mensagem, o webhook verifica se já existe **resposta da Carol** à **mesma mensagem do cliente** nos últimos 2 minutos.
- **Log:** `[Z-API Webhook] ⏭️ Pulando Carol (já processou mensagem recentemente)`.
- **Ação:** normalmente não é necessário fazer nada; se o webhook foi chamado em duplicidade, a segunda chamada é ignorada de propósito.

---

## 6. Erro ao processar (Carol ou envio)

- Se a Carol for chamada e **falhar** (OpenAI, instância Z-API, etc.), o log mostra:  
  `[Z-API Webhook] ❌ Carol não conseguiu responder` com `error: ...`.
- **Causas comuns:** `OPENAI_API_KEY` ausente ou inválida; instância Z-API desconectada ou `instance_id` incorreto; erro de rede/timeout.
- **Ação:** conferir variáveis de ambiente e status da instância na Z-API; ver logs completos do servidor (ex.: Vercel) no horário da mensagem.

---

## 7. Reprocessar manualmente

- No painel admin, abrir a conversa da pessoa e usar **"Reprocessar última mensagem"** (ou equivalente) para reenviar a última mensagem do cliente para a Carol.
- Útil quando o problema foi temporário (ex.: Carol desligada, erro de rede) e já foi corrigido.

---

## Resumo rápido

| Sintoma                         | O que verificar                          |
|---------------------------------|------------------------------------------|
| Nenhuma resposta                | `CAROL_AUTOMATION_DISABLED=false`? Modo manual na conversa? Webhook "Ao receber" na Z-API? |
| Mensagem salva, Carol não responde | Logs do webhook (Carol desligada? Erro? Já processou?) |
| Resposta genérica / sem opções  | Payload com `buttonText`/texto completo? Detecção de "Acabei de me inscrever" no código da Carol. |
