# ✅ Solução Correta: NutriWorkshopLead

## 🎯 Problema
Se usar apenas `URL contém /pt/nutri/workshop`, vai capturar:
- ❌ Visualização da página (NutriWorkshopView)
- ❌ Inscrição no formulário (NutriWorkshopLead)

## ✅ Solução: Usar Event Parameters

### Configuração Correta:

1. **Tipo:** `Event Parameters`
2. **Primeiro campo:** Procure por `event_name` ou `eventName`
3. **Operador:** `é igual a` (equals)
4. **Valor:** `NutriWorkshopLead`

### Se não encontrar `event_name`:

Use esta alternativa:

1. **Tipo:** `Event Parameters`
2. **Primeiro campo:** Deixe em branco ou selecione qualquer campo
3. **Operador:** `contém`
4. **Valor:** `NutriWorkshopLead`

---

## 🔍 Alternativa: Usar Evento Padrão Lead

O código também dispara o evento padrão `Lead` quando há inscrição.

### Configuração:

1. **Tipo:** `Evento padrão` (Standard Event)
2. **Evento:** `Lead`
3. **Regra adicional:** 
   - Tipo: `Event Parameters`
   - Campo: `content_name` ou `content_category`
   - Operador: `contém`
   - Valor: `Workshop` ou `NUTRI`

---

## 🎯 RECOMENDAÇÃO FINAL

**Use Event Parameters com o nome do evento:**

1. **Tipo:** `Event Parameters`
2. **Campo:** Procure por `event_name` (se não encontrar, deixe em branco)
3. **Operador:** `é igual a` ou `contém`
4. **Valor:** `NutriWorkshopLead`

Isso vai capturar **APENAS** quando o evento customizado `NutriWorkshopLead` for disparado (ou seja, quando o formulário for enviado), não quando a página for apenas visualizada.

---

## 📝 Resumo

**Nome:** `NutriWorkshopLead`  
**Descrição:** `Inscrição no workshop NUTRI`  
**Regra:** `Event Parameters: event_name é igual a NutriWorkshopLead`  
**Valor:** 0

**Isso diferencia visualização de inscrição!**

