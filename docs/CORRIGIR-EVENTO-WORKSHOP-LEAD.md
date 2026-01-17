# 🔧 Correção: Evento NutriWorkshopLead

## ⚠️ Ajuste Necessário na Regra

A regra está quase correta, mas precisa de um pequeno ajuste:

### **O que está errado:**
- **Tipo:** "Event Parameters" 
- **Operador:** "contém"
- **Valor:** "NutriWorkshopLead"

### **O que deve ser:**

**Opção 1 (Recomendada):**
- **Tipo:** "Nome do evento" (Event Name)
- **Operador:** "é igual a" (equals) ou "contém"
- **Valor:** `NutriWorkshopLead`

**Opção 2:**
- **Tipo:** "Evento personalizado" (Custom Event)
- **Nome do evento:** `NutriWorkshopLead`

---

## 📝 Como Corrigir

1. **Na seção "Regras":**
   - Clique no "X" ao lado de "NutriWorkshopLead" para remover a regra atual
   - Clique no botão "+" para adicionar nova regra

2. **Selecione:**
   - **Primeiro dropdown:** "Nome do evento" (Event Name)
   - **Segundo dropdown:** "é igual a" (equals)
   - **Campo de texto:** Digite `NutriWorkshopLead`

3. **Sobre o aviso "Nenhum evento detectado":**
   - Isso é normal! O evento só será detectado após você:
     1. Criar a conversão personalizada
     2. Testar a página do workshop
     3. Preencher e enviar o formulário de inscrição
   - O aviso desaparecerá depois que o evento for disparado pela primeira vez

---

## ✅ Configuração Final Correta

**Nome:** `NutriWorkshopLead`  
**Descrição:** `Inscrição no workshop NUTRI`  
**Fonte de dados:** `YLADA NUTRI`  
**Fonte da ação:** `Site`  
**Regra:**
- **Tipo:** Nome do evento
- **Operador:** é igual a
- **Valor:** `NutriWorkshopLead`

**Valor de conversão:** Não inserir (0)

---

Depois de criar, teste preenchendo o formulário do workshop para o evento ser detectado!

