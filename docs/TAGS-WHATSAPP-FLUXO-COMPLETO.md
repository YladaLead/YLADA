# 🏷️ Tags WhatsApp - Fluxo Completo (Português)

## 📋 FLUXO DE TAGS - JORNADA DO LEAD

### **FASE 1: CAPTAÇÃO**
1. **`veio_aula_pratica`**
   - Pessoa veio da aula prática (formulário, quiz, etc.)
   - Adicionada automaticamente quando preenche formulário

### **FASE 2: CONVITE**
2. **`recebeu_link_workshop`**
   - Recebeu o link do workshop/apresentação
   - Adicionada automaticamente quando automação envia convite

### **FASE 3: PARTICIPAÇÃO**
3. **`participou_aula`**
   - Confirmou presença e participou da aula
   - Adicionar manualmente após confirmar presença

4. **`nao_participou_aula`**
   - Não compareceu à aula
   - Adicionar manualmente após data do workshop sem confirmação

5. **`adiou_aula`**
   - Pediu para reagendar/adiar
   - Adicionar quando responder "REAGENDAR" ou pedir para adiar

### **FASE 4: REMARKETING (Se participou)**
6. **`interessado`**
   - Demonstrou interesse após a aula
   - Adicionar quando manifestar interesse

7. **`duvidas`**
   - Tem dúvidas sobre planos/preços
   - Adicionar quando perguntar sobre valores, planos, etc.

8. **`analisando`**
   - Está analisando a proposta
   - Adicionar quando disser "vou pensar", "preciso conversar", etc.

9. **`objeções`**
   - Apresentou objeções (preço, tempo, etc.)
   - Adicionar quando mencionar dificuldades/objeções

10. **`negociando`**
    - Está negociando condições
    - Adicionar quando começar a negociar valores/prazos

### **FASE 5: CONVERSÃO**
11. **`cliente_nutri`**
    - Convertido em cliente nutri
    - Adicionar quando fechar plano/assinatura

12. **`perdeu`**
    - Perdeu o interesse ou não responde mais
    - Adicionar quando não responde há muito tempo ou desiste

---

## 🎯 FLUXO VISUAL

```
📝 veio_aula_pratica
    ↓
📅 recebeu_link_workshop
    ↓
    ├─→ ✅ participou_aula
    │       ↓
    │       ├─→ 💡 interessado
    │       │       ↓
    │       │       ├─→ ❓ duvidas
    │       │       │       ↓
    │       │       │       ├─→ 🤔 analisando
    │       │       │       │       ↓
    │       │       │       │       ├─→ 💰 negociando
    │       │       │       │       │       ↓
    │       │       │       │       │       ✅ cliente_nutri
    │       │       │       │       │
    │       │       │       │       └─→ 🚫 objeções
    │       │       │       │               ↓
    │       │       │       │               (trabalhar objeções)
    │       │       │       │
    │       │       │       └─→ ❌ perdeu
    │       │       │
    │       │       └─→ ❌ perdeu
    │       │
    │       └─→ ❌ perdeu
    │
    ├─→ ❌ nao_participou_aula
    │       ↓
    │       (remarketing para nova tentativa)
    │
    └─→ ⏸️ adiou_aula
            ↓
            (agendar nova data)
```

---

## 💡 SUGESTÕES DE MELHORIAS

### **Adicionar:**

1. **`primeiro_contato`**
   - Primeira vez que entrou em contato
   - Útil para identificar novos leads

2. **`retorno`**
   - Voltou a conversar após silêncio
   - Útil para identificar reativações

3. **`urgencia`**
   - Lead com urgência (precisa começar rápido)
   - Priorizar atendimento

4. **`indicacao`**
   - Veio por indicação
   - Tratamento diferenciado

5. **`orçamento_baixo`**
   - Orçamento limitado
   - Oferecer planos mais acessíveis

6. **`orçamento_alto`**
   - Orçamento bom
   - Oferecer planos premium

### **Considerar:**

- **Tags de origem:** `instagram`, `facebook`, `google`, `indicacao`
- **Tags de perfil:** `iniciante`, `experiente`, `atleta`
- **Tags de objetivo:** `emagrecimento`, `ganho_massa`, `saude`

---

## 🎨 CORES SUGERIDAS

- **Azul:** Captação (`veio_aula_pratica`, `recebeu_link_workshop`)
- **Verde:** Participação positiva (`participou_aula`, `cliente_nutri`)
- **Vermelho:** Negativo (`nao_participou_aula`, `perdeu`)
- **Amarelo:** Ação pendente (`adiou_aula`, `analisando`)
- **Roxo:** Interesse (`interessado`, `duvidas`)
- **Laranja:** Negociação (`negociando`, `objeções`)

---

## ✅ RECOMENDAÇÃO FINAL

**Fluxo proposto está excelente!** 

Sugiro apenas adicionar:
- `primeiro_contato` (identificar novos)
- `retorno` (reativações)
- Tags de origem (opcional, para analytics)

O resto do fluxo está perfeito para acompanhar a jornada completa do lead até a conversão! 🎯
