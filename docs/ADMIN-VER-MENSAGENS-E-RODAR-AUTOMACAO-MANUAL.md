# Admin: ver mensagens da Carol e rodar automação manualmente

Respostas rápidas para:
1. **Onde ver** as mensagens que a Carol envia e o que aconteceu na conversa.
2. **Como rodar** a automação (Process All, remates, etc.) **manualmente**, sem usar o Vercel Cron.

---

## 1. Onde ver as mensagens que a Carol envia

- Acesse o **Admin** do projeto e vá em **WhatsApp** (lista de conversas).
- URL típica: **`/admin/whatsapp`** (ex.: `https://seu-dominio.com/admin/whatsapp`).
- Na lista, **clique em uma conversa** (um contato).
- Abre o **chat** com o histórico:
  - Mensagens **da pessoa** (cliente/lead).
  - Mensagens **da Carol** (respostas automáticas), com indicação de que são da Carol/secretária.

Assim você vê **tudo o que foi enviado e recebido** naquela conversa: o que a pessoa escreveu, o que a Carol respondeu automaticamente e se a resposta está educada e no tom de vendedora. Qualquer ajuste de copy ou de comportamento da Carol pode ser feito com base nesse histórico.

---

## 2. Rodar a automação manualmente (sem Vercel Cron)

Como você ainda **não está pagando o Cron do Vercel**, a automação não roda sozinha em horários fixos. Para fazer tudo que o cron faria (incluindo os remates), rode **manualmente** pelo admin:

1. Acesse o **Admin** → **WhatsApp** → **Automação** (ou **Automações**).
2. URL típica: **`/admin/whatsapp/automation`**.
3. Na página de automação você verá o botão:
   - **"Processar TUDO Automaticamente"** (ou **"Processar TUDO"**).
4. Clique nesse botão.

Isso dispara **uma única execução** do **Process All** (`/api/admin/whatsapp/automation/process-all`), que faz em sequência:

- Agendar boas-vindas (se estiver habilitado)
- Processar mensagens pendentes (fila de agendadas)
- Lembretes de aula (2h, 12h, 10min antes)
- Reprocessar quem tem tag “participou” mas não recebeu link
- Reprocessar quem tem tag “não participou” mas não recebeu remarketing
- **Remate quem participou** (2ª e 3ª mensagem de fechamento)
- **Remate quem não participou** (2ª e 3ª mensagem)

Ou seja: **rodar manualmente = clicar em “Processar TUDO”** na página de automação. Não precisa de cron enquanto não tiver Vercel Cron ativo.

**Sugestão de uso:** rodar esse botão **1 ou 2 vezes por dia** nos horários em que a Carol pode enviar (ex.: manhã e tarde), para que os remates e os outros passos aconteçam como se fosse um cron diário.

---

## Resumo

| O que você quer | Onde fazer |
|-----------------|------------|
| **Ver o que a Carol enviou e o que a pessoa disse** | Admin → WhatsApp → clicar na conversa e ler o chat. |
| **Rodar automação sem cron (manual)** | Admin → WhatsApp → **Automação** → botão **“Processar TUDO Automaticamente”**. |

Data: fevereiro 2025.
