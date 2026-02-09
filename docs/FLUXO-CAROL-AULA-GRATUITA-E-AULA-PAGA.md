# Fluxo da Carol: aula gratuita e aula paga

## O que foi reajustado (fev 2026)

- **Removida** a lógica que tratava "Tirar dúvida" / página de vendas / "assisti o vídeo" como um fluxo à parte, em que a Carol **não** oferecia aula prática e só vendia.
- **Restaurado** um fluxo único automático para quem chega por qualquer canal (incluindo anúncio, vídeo ou botão "Tirar dúvida"):
  - **Primeira mensagem:** Carol envia boas-vindas + opções de aula (1 e 2) como antes.
  - **Quando a pessoa responde 1 ou 2:** o sistema envia o link do Zoom.
  - **Quando a pessoa fala qualquer outra coisa:** Carol usa **autonomia** (IA) para conversar, tirar dúvidas, objeções e conduzir, sem ficar presa a script.

Quem vem da página de vendas ou do "Tirar dúvida" continua recebendo a **tag** `veio_tirar_duvida` e a **notificação** no WhatsApp do responsável (para relatório e origem), mas o **comportamento** é o mesmo: aula gratuita + opções + autonomia.

---

## Fluxo atual (aula gratuita)

1. Pessoa envia a primeira mensagem (ex.: "Acabei de me inscrever...", "Tirar dúvida", "Estou na página da Ylada Nutri", etc.).
2. Carol envia **uma única mensagem**: saudação + boas-vindas + explicação curta da aula + **Opção 1 e Opção 2** (dias/horários) + "Qual horário funciona melhor? Responde 1 ou 2".
3. Se a pessoa responde **1** ou **2**: o sistema envia o link do Zoom e a Carol pode responder algo curto ("Perfeito! Você já vai receber o link em instantes.").
4. Se a pessoa responde **qualquer outra coisa** (dúvida, objeção, "quanto custa?", "vou pensar", etc.): a Carol responde com **autonomia** (IA), seguindo o tom e as regras do system prompt, sem repetir o script de boas-vindas a menos que faça sentido.

---

## Quando quiser anunciar aula paga

Quando quiser que a pessoa chegue por um **anúncio de aula cobrada** e tenha um fluxo diferente:

1. **Identificar a origem**  
   Por exemplo: link específico (UTM), botão diferente no anúncio ou texto da primeira mensagem (ex.: "Quero participar da aula paga" / "Vim do anúncio da aula [nome]").

2. **Tag dedicada**  
   Criar uma tag tipo `veio_aula_paga` ou `veio_anuncio_pago` quando a primeira mensagem (ou o cadastro) indicar que veio desse anúncio.

3. **Fluxo próprio no código**  
   Em `whatsapp-carol-ai.ts`, tratar quando essa tag (ou o texto) estiver presente:
   - **Primeira mensagem:** não enviar "Opção 1 / Opção 2" da aula gratuita; enviar uma mensagem de boas-vindas específica da **aula paga** (valor, data, link de pagamento ou "em breve te mando o link", etc.).
   - **Mensagens seguintes:** Carol continua com autonomia para conversar, tirar dúvidas e conduzir (inclusive para pagamento/checkout).

Assim você mantém o fluxo da **aula gratuita** como está (único e com autonomia) e adiciona um **fluxo separado** só para quem vem do anúncio da aula paga.
