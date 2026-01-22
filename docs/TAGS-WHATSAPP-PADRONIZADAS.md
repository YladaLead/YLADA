# 🏷️ Tags Padronizadas - WhatsApp

## 📋 LISTA DE TAGS

### **Tags Automáticas (Sistema adiciona):**

1. **`form_lead`**
   - **Descrição:** Pessoa veio de formulário (quiz, calculadora, etc.)
   - **Quando é adicionada:** Automaticamente quando formulário é preenchido
   - **Cor:** Azul (`bg-blue-100 text-blue-700`)
   - **Ícone:** 📝 Form

2. **`workshop_invited`**
   - **Descrição:** Recebeu convite para workshop/apresentação
   - **Quando é adicionada:** Automaticamente quando automação envia convite
   - **Cor:** Roxo (`bg-purple-100 text-purple-700`)
   - **Ícone:** 📅 Workshop

---

### **Tags Manuais (Admin pode adicionar):**

As tags podem ser adicionadas manualmente via menu "🏷️ Etiquetas (tags)" na interface do WhatsApp.

**Sugestões de tags manuais (padronizar):**

3. **`workshop_attended`**
   - **Descrição:** Participou do workshop
   - **Quando adicionar:** Após confirmar presença

4. **`workshop_missed`**
   - **Descrição:** Não compareceu ao workshop
   - **Quando adicionar:** Após data do workshop sem confirmação

5. **`converted`**
   - **Descrição:** Convertido em cliente
   - **Quando adicionar:** Após fechar venda/plano

6. **`interested`**
   - **Descrição:** Demonstrou interesse
   - **Quando adicionar:** Após manifestar interesse

7. **`reagendou`**
   - **Descrição:** Pediu para reagendar workshop
   - **Quando adicionar:** Quando responder "REAGENDAR"

8. **`follow_up`**
   - **Descrição:** Precisa de follow-up
   - **Quando adicionar:** Quando precisa de acompanhamento

9. **`hot_lead`**
   - **Descrição:** Lead quente (alto interesse)
   - **Quando adicionar:** Quando demonstra muito interesse

10. **`cold_lead`**
    - **Descrição:** Lead frio (baixo interesse)
    - **Quando adicionar:** Quando não responde ou demonstra pouco interesse

---

## 📝 FORMATO

- **Todas as tags em minúsculas**
- **Usar underscore (_) ao invés de espaços**
- **Nomes curtos e descritivos**
- **Exemplos:**
  - ✅ `form_lead`
  - ✅ `workshop_invited`
  - ✅ `converted`
  - ❌ `Form Lead` (não usar maiúsculas)
  - ❌ `workshop invited` (não usar espaços)
  - ❌ `lead-do-formulario` (não usar hífen)

---

## 🎨 CORES PADRÃO

As tags automáticas já têm cores definidas. Para novas tags, seguir padrão:

- **Azul:** Tags de origem/captação (`form_lead`)
- **Roxo:** Tags de eventos (`workshop_invited`, `workshop_attended`)
- **Verde:** Tags de conversão (`converted`, `interested`)
- **Amarelo:** Tags de status (`follow_up`, `hot_lead`)
- **Cinza:** Tags gerais (outras)

---

## 🔄 ATUALIZAÇÕES FUTURAS

Tags que podem ser adicionadas automaticamente no futuro:

- `workshop_attended` → Quando sistema detectar presença
- `reagendou` → Quando responder "REAGENDAR"
- `converted` → Quando lead virar cliente
