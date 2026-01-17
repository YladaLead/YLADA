# 📋 Configurar Eventos do Workshop no Facebook Events Manager

## 🎯 Eventos a Criar

### 1. **NutriWorkshopView** (Visualização da Página)
- **Tipo:** Conversão Personalizada
- **Nome:** `NutriWorkshopView`
- **Descrição:** Visualização página workshop NUTRI

### 2. **NutriWorkshopLead** (Inscrição no Workshop)
- **Tipo:** Conversão Personalizada
- **Nome:** `NutriWorkshopLead`
- **Descrição:** Inscrição no workshop NUTRI

---

## 📝 Passo a Passo - NutriWorkshopView

### 1. Acesse o Events Manager
- Vá em: **Conversões personalizadas**
- Clique em: **Criar conversão personalizada**

### 2. Preencha os Dados

**Nome do evento:**
```
NutriWorkshopView
```

**Descrição:**
```
Visualização página workshop NUTRI
```

**Fonte de dados:**
- Selecione: **YLADA NUTRI** (Identificação: 881640870918286)

**Regra de correspondência:**
- **Tipo:** URL contém
- **URL:** `/pt/nutri/workshop`
- **Opção:** Corresponder exatamente

**Valor de conversão:**
- ❌ **NÃO** inserir valor (deixe em branco ou 0)

**Categoria:**
- Deixe padrão ou selecione "Outro"

### 3. Salvar
- Clique em **Criar**

---

## 📝 Passo a Passo - NutriWorkshopLead

### 1. Criar Nova Conversão
- Clique em: **Criar conversão personalizada**

### 2. Preencha os Dados

**Nome do evento:**
```
NutriWorkshopLead
```

**Descrição:**
```
Inscrição no workshop NUTRI
```

**Fonte de dados:**
- Selecione: **YLADA NUTRI** (Identificação: 881640870918286)

**Regra de correspondência:**
- **Tipo:** Evento personalizado
- **Nome do evento:** `NutriWorkshopLead`
- **Opção:** Corresponder exatamente

**Valor de conversão:**
- ❌ **NÃO** inserir valor (deixe em branco ou 0)

**Categoria:**
- Deixe padrão ou selecione "Outro"

### 3. Salvar
- Clique em **Criar**

---

## ✅ Resumo dos Dados

### **NutriWorkshopView**
- **Nome:** `NutriWorkshopView`
- **URL:** `/pt/nutri/workshop`
- **Tipo:** URL contém
- **Valor:** 0 (sem valor)

### **NutriWorkshopLead**
- **Nome:** `NutriWorkshopLead`
- **Tipo:** Evento personalizado
- **Valor:** 0 (sem valor)

---

## 🧪 Como Testar

1. **Visualização:**
   - Acesse: `http://localhost:3000/pt/nutri/workshop`
   - Verifique no console: `[Facebook Pixel] Evento customizado: NutriWorkshopView`

2. **Inscrição:**
   - Preencha o formulário
   - Envie a inscrição
   - Verifique no console: `[Facebook Pixel] Evento customizado: NutriWorkshopLead`

---

**Pronto!** Os eventos estão implementados e prontos para serem criados no Facebook Events Manager.

