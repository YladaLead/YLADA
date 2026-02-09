# Diagnóstico: mensagem chegou no WhatsApp mas não aparece no sistema

Quando uma mensagem aparece no WhatsApp Web (ex.: "Acabei de me inscrever na aula prática da YLADA NUTRI e gostaria de agendar") mas **não aparece no sistema** e o contato **não fica como cadastro feito**, o fluxo quebrou em algum ponto entre a Z-API e o nosso backend.

## Fluxo esperado

1. **WhatsApp** → mensagem recebida no número conectado à Z-API  
2. **Z-API** → envia POST para o webhook configurado (`/api/webhooks/z-api`)  
3. **Nosso backend** → extrai phone, message, instanceId → cria/busca conversa → salva mensagem → chama Carol  
4. **Admin** → lista conversas com `area=nutri`; a nova conversa entra na lista

Se a mensagem não aparece, algo falhou em 2 ou 3.

---

## Causas mais prováveis

### 1. Webhook da Z-API não dispara ou URL errada

- O evento deve ser **“Ao receber mensagem”** (on receive / message received).  
- A URL deve ser: `https://seu-dominio.com/api/webhooks/z-api` (HTTPS, método POST).  
- **Como conferir:** no painel da Z-API, verifique a URL do webhook e os eventos ativos. Envie uma mensagem de teste e veja se no servidor (Vercel/logs) aparece `[Z-API Webhook] 📥 Payload completo recebido`.

### 2. Payload com texto em outro formato (mensagem “vazia”)

Se o texto da mensagem vier em um campo que não estamos lendo, o backend trata como “evento sem mensagem” e **não cria conversa nem salva nada**.

- **O que fizemos:** foram adicionados mais fallbacks de extração de texto e, quando o evento é ignorado por falta de mensagem, o log passa a mostrar um trecho do payload (`payloadPreview`).  
- **O que fazer:** após o próximo envio que “não aparecer”, abra os logs do servidor (Vercel ou onde a app roda) e procure por:  
  `[Z-API Webhook] ⏭️ Evento sem mensagem (ignorando)`  
  No log virá `payloadPreview` com a estrutura real que a Z-API enviou. Com isso dá para ajustar o código para ler o campo correto (ex.: `body.xyz.text`).

### 3. Mensagem tratada como “enviada por nós” (fromMe)

Se a Z-API enviar `fromMe: true` (ou equivalente) para uma mensagem que na verdade é do contato, o webhook não processa como mensagem recebida e não salva.

- **Como conferir:** nos logs, procure por `[Z-API Webhook] 📤 ✅ MENSAGEM ENVIADA POR NÓS`. Se aparecer para essa mensagem, o problema é o payload (campo fromMe/from_api/etc.). Ajuste a lógica em `z-api/route.ts` ou peça suporte à Z-API.

### 4. instanceId ausente e nenhuma instância no banco

Se o payload não trouxer `instanceId`/`instance`/`instance_id` e não houver nenhuma instância com `status = 'connected'` em `z_api_instances`, o webhook responde 400 e não cria conversa.

- **Como conferir:**  
  - Log: `[Z-API Webhook] ❌ InstanceId não encontrado`.  
  - No Supabase: `SELECT id, instance_id, area, status FROM z_api_instances;` — deve existir pelo menos uma linha com `status = 'connected'` e `area = 'nutri'` (ou a área que você usa).  
- **O que fazer:** garantir que a instância que recebe esse WhatsApp está cadastrada e conectada; se a Z-API não envia instanceId, o código usa a primeira instância conectada (por isso é essencial ter uma conectada).

### 5. Número rejeitado (validação)

Se o número vier muito longo (> 15 dígitos) ou em formato inválido, o webhook pode rejeitar e responder 400.

- Para **+55 99 8523-3553** o esperado é normalizar para 12 dígitos (55 + 99 + 85233553), que é válido.  
- **Como conferir:** log com `[Z-API Webhook] ❌ Número rejeitado` ou `Não foi possível extrair telefone válido`.

### 6. Lista do admin filtra por área

A lista do admin mostra apenas conversas com **area = 'nutri'**. Novas conversas criadas pelo webhook já recebem área por `identifyArea()` (instância nutri ou palavras-chave da mensagem); por padrão cai em `nutri`.  
Se em algum caso a conversa for criada com outra área ou `area` null, ela não aparecerá no filtro Nutri.  
Só faz sentido checar isso se você tiver certeza de que a conversa está sendo criada (ex.: vendo no Supabase em `whatsapp_conversations`).

---

## Checklist rápido

1. **Z-API:** Webhook configurado para “Ao receber mensagem”, URL correta (POST), teste enviando uma mensagem e veja se o servidor recebe (log de payload).  
2. **Logs do servidor:**  
   - Aparece `[Z-API Webhook] 📥 Payload completo` para essa mensagem?  
   - Aparece `Evento sem mensagem (ignorando)`? Se sim, use o `payloadPreview` para mapear o campo do texto.  
   - Aparece `MENSAGEM ENVIADA POR NÓS` para essa mensagem? Se sim, o problema é o fromMe.  
   - Aparece `InstanceId não encontrado`? Se sim, conferir `z_api_instances` e conexão.  
3. **Supabase:**  
   - Existe instância conectada: `SELECT * FROM z_api_instances WHERE status = 'connected';`  
   - Depois de enviar a mensagem, existe conversa ou mensagem?  
     `SELECT id, phone, area, created_at FROM whatsapp_conversations ORDER BY created_at DESC LIMIT 5;`  
     `SELECT id, conversation_id, sender_type, message, created_at FROM whatsapp_messages ORDER BY created_at DESC LIMIT 10;`

---

## Alterações feitas no código

- **Webhook (`z-api/route.ts`):**  
  - Mais fallbacks para extrair o texto da mensagem (incluindo `body.data.caption`, `body.caption`, `body.content.text`).  
  - Quando o evento é ignorado por “sem mensagem”, o log inclui `payloadPreview` (até ~1200 caracteres do payload) para diagnóstico.  
- Assim que você tiver um exemplo de payload que “não apareceu”, dá para mapear o campo exato e incluir na extração, e a próxima mensagem igual passará a criar conversa e aparecer no sistema.
