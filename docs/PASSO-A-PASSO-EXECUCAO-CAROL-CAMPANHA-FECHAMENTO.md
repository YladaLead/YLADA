# Passo a passo de execução: preparar a Carol + campanha em massa (fechamento)

Este documento consolida o planejamento de remarketing/fechamento e a campanha pré-Carnaval, incluindo **preparação da Carol**, **envio em blocos** e **espaçamento entre mensagens** para a API não empilhar e não deixar ninguém de fora.

---

## Parte 1 — Preparar a Carol

### 1.1 Treino de comportamento (vendedora)

- **1ª mensagem:** padrão para todo mundo; tom de convicção (a solução é boa, vale fechar).
- **Lembrete:** reforçar **dor** e custo de não fechar — não só “está 97”.
- **Quando a pessoa responder:** ler a objeção e responder no chat (personalizado); não seguir script rígido.
- **Fechar no texto:** oferecer link, valor e data quando fizer sentido; não ficar só em “qualquer dúvida estou aqui”.

### 1.2 Scripts/templates por etapa

- **Template 1 — Primeira mensagem:** valor + próximo passo (link/condição). Usar para todo mundo que participou.
- **Template 2 — Lembrete (10h ou dia seguinte):** reforço + dor/custo de não fechar + CTA.
- **Template 3 — Terceira mensagem (+2 dias):** outro argumento (custo de adiar, depoimento, última chance).

Guardar esses textos em um único lugar (doc ou admin) para a Carol não se perder.

### 1.3 Etiquetas (estágios)

Usar no `context.tags` da conversa:

| Etiqueta | Significado |
|----------|-------------|
| `participou_aula` | Já existente. |
| `recebeu_1a_msg_fechamento` | Recebeu a 1ª mensagem de fechamento (ou campanha em massa). |
| `recebeu_lembrete_fechamento` | Recebeu o lembrete com dor. |
| `recebeu_3a_msg_fechamento` | Recebeu a 3ª mensagem. |
| `respondeu_fechamento` | Respondeu → tratar no chat; não disparar mais lembretes automáticos. |
| `nao_quer_mais` | Não quer mais → parar sequência. |
| `quer_falar_humano` | Pediu humano → notificar responsável; parar lembretes. |

Regras de envio:

- Não enviar lembrete/3ª para quem tem `nao_quer_mais` ou `quer_falar_humano`.
- Não enviar 2ª/3ª para quem tem `respondeu_fechamento` (já está sendo atendida no chat).

### 1.4 Notificação “quer falar com humano”

- Já existe: `Z_API_NOTIFICATION_PHONE` recebe WhatsApp quando a Carol detecta pedido de humano.
- Recomendação: ao disparar essa notificação, adicionar a tag `quer_falar_humano` no `context` da conversa.

---

## Parte 2 — Campanha em massa (ex.: pré-Carnaval)

### 2.1 Preparar conteúdo

1. **Arte (imagem):** destaque de preço (ex.: “Condição R$ 97” / “De R$ 297 por R$ 97”) + gancho Carnaval (“Feche antes e volte já aluna”).
2. **Upload:** gerar URL pública da imagem.
3. **Texto (legenda):** valorizar que muitos ouviram 297 ou “só anual”; informar condição atual (97); Carnaval como motivo para fechar agora; link de oferta; CTA (“qualquer dúvida, responda aqui”).
4. **Configurar no admin:** em Workshop Settings, preencher **Imagem da oferta** (`oferta_image_url`) com a URL da arte (se a campanha usar o mesmo fluxo de “imagem + legenda” do link pós-participou).

### 2.2 Base de destinatários

- **Regra:** conversas com tag `participou_aula` e que **não** são alunas (sem assinatura ativa na área).
- Excluir quem já recebeu esta campanha (ex.: `context.campanha_pre_carnaval_sent === true` ou tag `recebeu_1a_msg_fechamento` já aplicada para essa campanha).

### 2.3 Marcar quem recebeu

Após cada envio bem-sucedido:

- `context.campanha_pre_carnaval_sent = true`
- `context.campanha_pre_carnaval_sent_at = ISO timestamp`
- Incluir tag `recebeu_1a_msg_fechamento` (para alinhar à sequência de fechamento).

Assim ninguém recebe duas vezes e a Carol não perde o controle.

---

## Parte 3 — Enviar em blocos e com espaçamento (evitar perder gente e API empilhar)

### 3.1 Problema

- Carol estava mandando **muitas mensagens seguidas** e **não chegava em todos**.
- Possíveis causas: API (Z-API/WhatsApp) empilhando requisições, timeout, ou processamento síncrono que “pula” ou falha silenciosamente em parte da lista.

### 3.2 Regras recomendadas para qualquer disparo em massa

1. **Delay entre uma pessoa e outra**
   - Mínimo **2,5 s** entre cada envio (já usado no remarketing e nos lembretes de workshop).
   - Recomendado **3 a 5 s** em campanhas grandes, para dar folga à API e evitar bloqueio/limite do WhatsApp.

2. **Enviar em blocos (batches)**
   - Processar em blocos de **10 a 20** pessoas por vez.
   - Após cada bloco: **pausa de 1 a 2 minutos** antes do próximo bloco.
   - Benefícios: não sobrecarregar a API; se der erro ou timeout, já salvou progresso até o fim do bloco; fica claro “quantos foram” por rodada.

3. **Persistir progresso**
   - Após **cada envio** (ou no mínimo após cada bloco), atualizar o `context` da conversa (ex.: `campanha_pre_carnaval_sent`) e, se houver, uma tabela de “disparos em massa” com lista de IDs já processados.
   - Assim, se o job parar no meio, na próxima execução **não** reenviar para quem já recebeu.

4. **Não depender de “uma única corrida”**
   - Preferir: várias execuções (ex.: “enviar próximo bloco de 15”) em vez de um único loop que tenta enviar para 200 de uma vez.
   - Opção: fila (agendar mensagens na tabela `whatsapp_scheduled_messages`) e worker processando em lotes com delay; ou endpoint “disparar próximo bloco” que o admin chama mais de uma vez.

### 3.3 Valores no código (já implementados)

No arquivo `src/lib/whatsapp-carol-ai.ts` estão definidos e **em uso em todos os disparos em massa**:

| Parâmetro | Constante | Valor | Uso |
|-----------|-----------|--------|-----|
| Delay entre cada envio | `BULK_SEND_DELAY_MS` | 3 000 ms (3 s) | Entre uma pessoa e outra no mesmo bloco. |
| Tamanho do bloco | `BULK_SEND_BLOCK_SIZE` | 15 | A cada 15 envios bem-sucedidos, pausa. |
| Pausa entre blocos | `BULK_SEND_PAUSE_BETWEEN_BLOCKS_MS` | 60 000 ms (1 min) | Pausa antes de iniciar o próximo bloco. |

A função `bulkSendDelay(sentSoFar)` é chamada após cada envio bem-sucedido nos fluxos: remarketing, remarque hoje 20h, notificações pré-aula, pós-aula, follow-up (quem não respondeu), follow-up de vendas e lembretes de workshop.

### 3.4 Checklist operacional antes de disparar

- [ ] Lista filtrada: só `participou_aula` + não aluno + não recebeu esta campanha.
- [ ] Arte e texto fechados; URL da imagem configurada (ex.: `oferta_image_url`).
- [ ] Horário dentro do permitido (ex.: 8h–19h seg–sex) se aplicável.
- [ ] Envio configurado em **blocos** (ex.: 15 por vez) com **delay 3–5 s** entre cada pessoa e **pausa 1–2 min** entre blocos.
- [ ] Progresso sendo salvo após cada envio (ou cada bloco) para não reenviar.

---

## Parte 4 — Sequência após a campanha

- Quem recebeu a mensagem em massa entra na sequência normal:
  - **Lembrete** (10h ou dia seguinte) com dor + fechamento; tag `recebeu_lembrete_fechamento`.
  - Se **respondeu** → tag `respondeu_fechamento`; Carol trata no chat; não disparar mais lembretes.
  - Se **não respondeu** → em **+2 dias** enviar 3ª mensagem com outro argumento; tag `recebeu_3a_msg_fechamento`.
- Respeitar sempre: não enviar para `nao_quer_mais` ou `quer_falar_humano`.

---

## Resumo rápido

1. **Preparar Carol:** treino de vendedora, 3 templates (1ª, lembrete, 3ª), etiquetas por estágio, notificação humano.
2. **Campanha:** arte + copy (preço + Carnaval), URL no admin, base = participou + não aluno, marcar quem recebeu.
3. **Envio:** em **blocos** (ex.: 15), **delay 3–5 s** entre pessoas, **pausa 1–2 min** entre blocos, **salvar progresso** para não perder nem reenviar.
4. **Depois:** sequência lembrete → resposta personalizada ou 3ª mensagem; usar etiquetas para a Carol não se perder.

Data: fevereiro 2025.
