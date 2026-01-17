# 🔧 Alternativa: Configurar NutriWorkshopLead

## ⚠️ Se "Nome do evento" não aparecer no dropdown

Use uma destas alternativas:

---

## ✅ **OPÇÃO 1: Usar URL (Mais Simples)**

### Configuração:
1. **Tipo:** `URL`
2. **Operador:** `contém` (contains)
3. **Valor:** `/pt/nutri/workshop`

### Por quê funciona:
- O evento é disparado quando o formulário é enviado na página do workshop
- A URL contém `/pt/nutri/workshop`

### Regra:
```
URL contém /pt/nutri/workshop
```

---

## ✅ **OPÇÃO 2: Usar Event Parameters (Se disponível)**

### Configuração:
1. **Tipo:** `Event Parameters`
2. **Operador:** `contém` ou `é igual a`
3. **Campo:** `event_name` ou `eventName`
4. **Valor:** `NutriWorkshopLead`

### Regra:
```
Event Parameters: event_name contém NutriWorkshopLead
```

---

## ✅ **OPÇÃO 3: Usar Lead Event (Padrão do Facebook)**

### Configuração:
1. **Tipo:** `Evento padrão` (Standard Event)
2. **Evento:** `Lead`
3. **Regra adicional:** `URL contém /pt/nutri/workshop`

### Por quê funciona:
- O código também dispara o evento padrão `Lead` quando há inscrição
- Você pode filtrar pela URL do workshop

---

## 🎯 **RECOMENDAÇÃO: Use a OPÇÃO 1 (URL)**

É a mais simples e confiável:

1. **Remova a regra atual** (clique no X)
2. **Adicione nova regra:**
   - Tipo: `URL`
   - Operador: `contém`
   - Valor: `/pt/nutri/workshop`
3. **Clique em "Criar"**

---

## 📝 Resumo Final

**Nome:** `NutriWorkshopLead`  
**Descrição:** `Inscrição no workshop NUTRI`  
**Fonte de dados:** `YLADA NUTRI`  
**Regra:** `URL contém /pt/nutri/workshop`  
**Valor:** 0 (sem valor)

**Pronto!** Isso vai capturar todas as inscrições no workshop.

