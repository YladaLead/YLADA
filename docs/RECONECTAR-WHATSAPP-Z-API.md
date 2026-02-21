# Reconectar WhatsApp (conexão Web caiu) e voltar a acionar a API

Quando a **conexão do WhatsApp com a Web** cai (ou desconecta), a Z-API para de receber/enviar e o sistema deixa de “acionar” (Carol, remates, disparos). Segue o que fazer.

---

## 1. Reconectar o WhatsApp na Z-API

A Z-API usa WhatsApp Web por baixo. Se o celular saiu da internet, você deslogou no WhatsApp Web ou a sessão expirou, é preciso **conectar de novo**.

1. Acesse o painel da Z-API: **https://developer.z-api.com.br/** (ou a URL que você usa).
2. Vá em **Instâncias Web** → escolha a instância (ex.: Nutri).
3. Veja o **status** da instância:
   - Se estiver **desconectada** ou **aguardando QR Code**:
     - Clique em **Conectar** / **Conectar WhatsApp**.
     - Abra o **WhatsApp no celular** → **Configurações** (ou Menu) → **Aparelhos conectados** → **Conectar um aparelho**.
     - Escaneie o **QR Code** que aparecer no painel da Z-API.
   - Mantenha o celular com internet e o WhatsApp aberto (ou em segundo plano) para a sessão não cair de novo.
4. Confirme que o status da instância está **Conectado** / **Online**.

---

## 2. Conferir “Ler mensagens automático”

Para a Z-API enviar as mensagens recebidas para o nosso sistema (e a Carol/API funcionar):

- No painel da Z-API, na mesma instância, procure por **“Ler mensagens automático”** (ou “Webhook ao receber”).
- Deixe **habilitado** e com a URL do webhook:
  - `https://www.ylada.com/api/webhooks/z-api` (produção)
  - ou a URL do seu ambiente (ex.: Vercel) se for outro.

Assim, ao receber uma mensagem, a Z-API chama nossa API e tudo volta a funcionar.

---

## 3. Atualizar o status no banco (opcional)

O app usa a tabela `z_api_instances` e prefere instâncias com `status = 'connected'`. Se na Z-API a instância já está conectada mas no nosso sistema ainda aparece como desconectada:

1. No **Supabase** → SQL Editor.
2. Liste as instâncias:
   ```sql
   SELECT id, name, instance_id, area, status, updated_at
   FROM z_api_instances;
   ```
3. Se a instância que você reconectou estiver com `status` diferente de `'connected'`, atualize:
   ```sql
   UPDATE z_api_instances
   SET status = 'connected', updated_at = NOW()
   WHERE instance_id = 'SEU_INSTANCE_ID_AQUI';
   ```
   (Substitua `SEU_INSTANCE_ID_AQUI` pelo `instance_id` da sua instância, ex.: o que está em `Z_API_INSTANCE_ID` no .env.)

Isso garante que o sistema “veja” a instância como conectada e use a API normalmente.

---

## 4. Testar se a API está acionando

1. Envie uma **mensagem de teste** do seu WhatsApp pessoal para o número conectado (ex.: 5519997230912).
2. Verifique:
   - No **admin** do app (lista de conversas WhatsApp): a conversa aparece e a Carol responde?
   - Se tiver acesso aos **logs** (Vercel ou servidor): procure por `[Z-API Webhook] 📥 Payload completo recebido` e, em seguida, processamento da Carol.

Se a mensagem chega no WhatsApp mas não aparece no sistema, siga o **docs/DIAGNOSTICO-MENSAGEM-NAO-APARECE.md**.

---

## Resumo rápido

| Problema | O que fazer |
|----------|-------------|
| WhatsApp Web desconectou | Reconectar no painel Z-API (QR Code de novo). |
| Instância “desconectada” na Z-API | Conectar/escaneando o QR Code. |
| API não aciona (Carol/disparos não rodam) | Conferir webhook “Ler mensagens” e URL; conferir `status = 'connected'` em `z_api_instances`. |
| Mensagem não aparece no admin | Ver **docs/DIAGNOSTICO-MENSAGEM-NAO-APARECE.md** e logs do webhook. |

Depois de reconectar o WhatsApp na Z-API e manter o webhook correto, a API volta a ser acionada normalmente (Carol, Processar TUDO, remates, etc.).
