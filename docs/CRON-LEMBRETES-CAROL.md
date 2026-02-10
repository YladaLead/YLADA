# Lembretes e remarketing da Carol (uso manual)

No plano gratuito da Vercel o **cron não é usado**. Os lembretes e o remarketing rodam quando você dispara o **Processar tudo** no admin.

## Como usar (manual)

1. Antes da aula (ex.: 2h antes), abra **Admin → WhatsApp → Automação** (`/admin/whatsapp/automation`).
2. Clique em **Processar tudo** (ou no botão que chama `POST /api/admin/whatsapp/automation/process-all`).
3. Repita a cada **~10 minutos** se quiser (ex.: 2h10 antes, 2h antes, 1h50 antes) até a aula — assim todos os agendados entram na janela do lembrete de 2h e recebem.

O process-all envia:
- **Lembretes pré-aula** (2h, 12h, 10min antes) para todas as conversas com sessão agendada
- **Remarketing** (participou / não participou) para quem tem a tag e ainda não recebeu

## Ajustes feitos para envio sistemático (quando você roda manual)

- **Janela do lembrete 2h**: ampliada para 1h30–2h30 antes (em vez de só 2h–2h30), para que quando você rodar "Processar tudo" todos os agendados nessa janela recebam.
- **Delay entre envios**: 1,5 s entre cada envio de lembrete na mesma execução, para evitar rate limit do Z-API e dar tempo de processar todos.
- **Logs**: em cada execução são logados o total de conversas com sessão e o resultado (sent, errors).

## Testar

- Pelo admin: **Admin → WhatsApp → Automação** → botão **Processar tudo**.
- Ou: `POST /api/admin/whatsapp/automation/process-all` (com cookie de admin).
