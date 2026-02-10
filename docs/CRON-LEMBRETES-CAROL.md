# Cron: lembretes e remarketing da Carol

## O que o cron faz

A cada **10 minutos** o Vercel chama `GET /api/cron/whatsapp-carol`. Esse endpoint:

1. Valida `CRON_SECRET` (header `Authorization: Bearer <CRON_SECRET>`)
2. Chama `POST /api/admin/whatsapp/automation/process-all` (com o mesmo secret)
3. O process-all executa:
   - **Lembretes pré-aula** (2h, 12h, 10min antes) para todas as conversas com sessão agendada
   - **Remarketing** (participou / não participou) para quem tem a tag e ainda não recebeu

Assim, os 10 (ou mais) agendados recebem o lembrete de 2h de forma sistemática, e o remarketing pós-aula também roda automaticamente.

## Configuração na Vercel

1. **Variável de ambiente**
   - Em **Project → Settings → Environment Variables** crie:
   - Nome: `CRON_SECRET`
   - Valor: uma string secreta (ex.: gerar com `openssl rand -hex 24`)
   - Marque os ambientes onde o cron deve rodar (Production, etc.)

2. **Verificar o cron**
   - Em **Project → Settings → Crons** deve aparecer:
   - Path: `/api/cron/whatsapp-carol`
   - Schedule: `*/10 * * * *` (a cada 10 minutos)

Se `CRON_SECRET` não estiver definido, o endpoint retorna 401 e o cron não executa a automação.

## Ajustes feitos para envio sistemático

- **Janela do lembrete 2h**: ampliada para 1h30–2h30 antes (em vez de só 2h–2h30), para que mais de uma execução do cron pegue todos.
- **Delay entre envios**: 1,5 s entre cada envio de lembrete na mesma execução, para evitar rate limit do Z-API e dar tempo de processar todos.
- **Logs**: em cada execução são logados o total de conversas com sessão e o resultado (sent, errors).

## Testar manualmente

- **Cron (com secret):**  
  `curl -H "Authorization: Bearer SEU_CRON_SECRET" https://www.ylada.com/api/cron/whatsapp-carol`

- **Process-all (admin ou com secret):**  
  `POST /api/admin/whatsapp/automation/process-all`  
  (com cookie de admin ou header `Authorization: Bearer CRON_SECRET`)
