# 🔍 ANÁLISE: Duplicatas e Templates Faltantes

## 📊 RESULTADO DA EXECUÇÃO

### **✅ Templates com Content Nutri:**
- **36 templates** com "✅ Content Nutri específico"

### **❌ Templates sem Content:**
- **1 template**: "Planilha Dieta Emagrecimento" (slug: `lanilha-ieta-magrecimento`)

### **⚠️ Duplicatas Identificadas:**
1. **"Descubra seu Perfil de Bem-Estar"**
   - `descoberta-perfil-bem-estar` ✅
   - `quiz-wellness-profile` ✅ (duplicata?)

2. **"Quiz Energético"**
   - `quiz-energetico` ✅
   - `uiz-nergetico` ⚠️ (typo no slug?)

3. **"Teste de Retenção de Líquidos"**
   - `teste-retencao-liquidos` ✅
   - `retencao-liquidos` ✅ (duplicata?)

---

## ✅ CORREÇÕES NECESSÁRIAS

### **1. Template sem Content:**
- ✅ Script criado: `scripts/corrigir-template-sem-content.sql`
- ✅ Adiciona content para "Planilha Dieta Emagrecimento"

### **2. Duplicatas:**
- ⚠️ Verificar se são realmente duplicatas ou templates diferentes
- ⚠️ Se forem duplicatas, decidir qual manter
- ⚠️ Se forem diferentes, verificar se ambos devem existir

---

## 🚀 PRÓXIMO PASSO

**Execute o script de correção:**

1. Abra: `scripts/corrigir-template-sem-content.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

**Este script:**
- ✅ Adiciona content para o template faltante
- ✅ Identifica outros templates sem content (se houver)
- ✅ Lista duplicatas para análise
- ✅ Mostra resultado final

---

## 📊 RESULTADO ESPERADO

Após executar:
```
total_templates: 37
com_content_nutri: 37  ← Todos agora têm content
com_content_geral: 37
sem_content: 0
```

---

## ⚠️ SOBRE AS DUPLICATAS

**Decisão necessária:**
- Se são duplicatas → Manter apenas um
- Se são diferentes → Manter ambos, mas verificar se ambos devem estar na área Nutri

**Sugestão:** Verificar no código hardcoded original se esses templates realmente existem ou se são duplicatas acidentais.

