# 🏷️ Tags WhatsApp - Padrão Final (Português)

## 📋 LISTA COMPLETA DE TAGS

### **FASE 1: CAPTAÇÃO** (Azul)
1. **`veio_aula_pratica`** 📝
   - Pessoa veio da aula prática (formulário, quiz, etc.)
   - **Automática** quando preenche formulário
   - Cor: Azul claro

2. **`primeiro_contato`** 👋
   - Primeira vez que entrou em contato
   - **Automática** quando cria conversa
   - Cor: Azul muito claro

### **FASE 2: CONVITE** (Roxo)
3. **`recebeu_link_workshop`** 📅
   - Recebeu o link do workshop/apresentação
   - **Automática** quando automação envia convite
   - Cor: Roxo

4. **`recebeu_segundo_link`** 📅📅
   - Recebeu segundo convite (após reagendar ou não participar)
   - **Manual** - adicionar quando enviar segundo link
   - Cor: Roxo escuro

### **FASE 3: PARTICIPAÇÃO** (Verde/Vermelho/Amarelo)
4. **`participou_aula`** ✅
   - Confirmou presença e participou da aula
   - **Manual** - adicionar após confirmar presença
   - Cor: Verde

5. **`nao_participou_aula`** ❌
   - Não compareceu à aula
   - **Manual** - adicionar após data sem confirmação
   - Cor: Vermelho

6. **`adiou_aula`** ⏸️
   - Pediu para reagendar/adiar
   - **Manual** - quando responder "REAGENDAR"
   - Cor: Amarelo

### **FASE 4: REMARKETING** (Roxo/Indigo/Amarelo/Laranja)
7. **`interessado`** 💡
   - Demonstrou interesse após a aula
   - **Manual** - quando manifestar interesse
   - Cor: Roxo claro

8. **`duvidas`** ❓
   - Tem dúvidas sobre planos/preços
   - **Manual** - quando perguntar sobre valores
   - Cor: Indigo

9. **`analisando`** 🤔
   - Está analisando a proposta
   - **Manual** - quando disser "vou pensar"
   - Cor: Amarelo claro

10. **`objeções`** 🚫
    - Apresentou objeções (preço, tempo, etc.)
    - **Manual** - quando mencionar dificuldades
    - Cor: Laranja

11. **`negociando`** 💰
    - Está negociando condições
    - **Manual** - quando começar a negociar
    - Cor: Laranja claro

### **FASE 5: CONVERSÃO** (Verde/Cinza)
12. **`cliente_nutri`** 🎉
    - Convertido em cliente nutri
    - **Manual** - quando fechar plano/assinatura
    - Cor: Verde escuro

13. **`perdeu`** 😔
    - Perdeu o interesse ou não responde mais
    - **Manual** - quando não responde há muito tempo
    - Cor: Cinza

### **EXTRAS** (Ciano/Vermelho)
14. **`retorno`** 🔄
    - Voltou a conversar após silêncio
    - **Manual** - quando reativar conversa
    - Cor: Ciano

15. **`urgencia`** ⚡
    - Lead com urgência (precisa começar rápido)
    - **Manual** - quando demonstrar urgência
    - Cor: Vermelho escuro (priorizar)

---

## 🎯 FLUXO COMPLETO

```
👋 primeiro_contato
    ↓
📝 veio_aula_pratica
    ↓
📅 recebeu_link_workshop
    ↓
    ├─→ ✅ participou_aula
    ├─→ ❌ nao_participou_aula
    │       ↓
    │       📅📅 recebeu_segundo_link (novo convite)
    └─→ ⏸️ adiou_aula
            ↓
            📅📅 recebeu_segundo_link (novo convite)
    │       ↓
    │       ├─→ 💡 interessado
    │       │       ↓
    │       │       ├─→ ❓ duvidas
    │       │       │       ↓
    │       │       │       ├─→ 🤔 analisando
    │       │       │       │       ↓
    │       │       │       │       ├─→ 💰 negociando
    │       │       │       │       │       ↓
    │       │       │       │       │       🎉 cliente_nutri
    │       │       │       │       │
    │       │       │       │       └─→ 🚫 objeções
    │       │       │       │               ↓
    │       │       │       │               (trabalhar objeções)
    │       │       │       │
    │       │       │       └─→ 😔 perdeu
    │       │       │
    │       │       └─→ 😔 perdeu
    │       │
    │       └─→ 😔 perdeu
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

## 🎨 CORES POR FASE

- **Azul:** Captação (`veio_aula_pratica`, `primeiro_contato`)
- **Roxo:** Convite e Interesse (`recebeu_link_workshop`, `interessado`)
- **Verde:** Participação e Conversão (`participou_aula`, `cliente_nutri`)
- **Vermelho:** Negativo (`nao_participou_aula`, `perdeu`, `urgencia`)
- **Amarelo:** Ação Pendente (`adiou_aula`, `analisando`)
- **Laranja:** Negociação (`objeções`, `negociando`)
- **Indigo:** Dúvidas (`duvidas`)
- **Ciano:** Reativação (`retorno`)
- **Cinza:** Perda (`perdeu`)

---

## ✅ TAGS AUTOMÁTICAS vs MANUAIS

### **Automáticas (Sistema adiciona):**
- `veio_aula_pratica` - Quando preenche formulário
- `primeiro_contato` - Quando cria conversa
- `recebeu_link_workshop` - Quando automação envia convite

### **Manuais (Admin adiciona):**
- Todas as outras tags devem ser adicionadas manualmente via menu "🏷️ Etiquetas (tags)"

---

## 📝 REGRAS DE NOMENCLATURA

- ✅ Todas em **minúsculas**
- ✅ Usar **underscore (_)** ao invés de espaços
- ✅ Nomes **curtos e descritivos**
- ✅ Em **português**

**Exemplos:**
- ✅ `veio_aula_pratica`
- ✅ `participou_aula`
- ✅ `cliente_nutri`
- ❌ `Veio Aula Prática` (não usar maiúsculas)
- ❌ `veio aula pratica` (não usar espaços)
- ❌ `veio-aula-pratica` (não usar hífen)

---

## 🔄 COMPATIBILIDADE

O sistema ainda reconhece as tags antigas em inglês:
- `form_lead` → mapeia para `veio_aula_pratica`
- `workshop_invited` → mapeia para `recebeu_link_workshop`

Mas as novas tags devem ser sempre em português! 🇧🇷
