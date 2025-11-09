# 🔍 ANÁLISE: Templates Extras no Banco Wellness

## 📊 SITUAÇÃO ATUAL

**Contagem no Banco:**
- **Calculadoras:** 4 ativos ✅ (esperado: 4)
- **Planilhas:** 5 ativos + 1 inativo = 6 total ⚠️ (esperado: 2)
- **Quizzes:** 30 ativos ⚠️ (esperado: 24 = 22 quizzes + 2 desafios)
- **Total:** 39 ativos (esperado: 35)

**Diferença:** +4 templates extras

---

## 🔎 TEMPLATES EXTRAS IDENTIFICADOS

### **Planilhas (6 no banco, esperado 2):**
- ✅ Cardápio Detox (esperado)
- ✅ Tabela Comparativa (esperado)
- ❓ **4 templates extras** (precisam ser identificados)
- ❓ **1 inativo** (precisar ser identificado)

### **Quizzes (30 no banco, esperado 24):**
- ✅ 22 quizzes esperados
- ✅ 2 desafios (7 Dias, 21 Dias)
- ❓ **6 templates extras** (precisam ser identificados)

---

## 🔧 AÇÕES NECESSÁRIAS

### **1. Identificar Templates Extras:**
Execute o script SQL:
```sql
-- Executar: scripts/listar-todos-templates-wellness-detalhado.sql
```

Este script lista:
- Todos os 39 templates ativos
- Nomes e slugs de cada um
- Agrupamento por tipo

### **2. Verificar Duplicatas:**
Execute o script SQL:
```sql
-- Executar: scripts/verificar-duplicatas-wellness.sql
```

Este script identifica:
- Templates com mesmo nome
- Templates com mesmo slug

### **3. Decisão:**
Após identificar os templates extras, decidir:
- **Se são duplicatas:** Remover as duplicatas (manter apenas 1)
- **Se são templates antigos:** Desativar se não forem mais usados
- **Se são templates válidos:** Manter e atualizar a contagem esperada

---

## 📋 PRÓXIMOS PASSOS

1. ⏳ Executar `scripts/listar-todos-templates-wellness-detalhado.sql`
2. ⏳ Executar `scripts/verificar-duplicatas-wellness.sql`
3. ⏳ Analisar quais são os templates extras
4. ⏳ Decidir o que fazer com eles
5. ⏳ Ajustar contagem ou remover duplicatas

---

**Última atualização:** 2025-01-XX


