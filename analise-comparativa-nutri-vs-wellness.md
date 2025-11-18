# 📊 ANÁLISE COMPARATIVA: NUTRI vs WELLNESS

## 📋 DADOS COLETADOS

### **TEMPLATES NO SUPABASE:**
- **NUTRI:** 37 templates (calculadora, planilha, quiz)
- **WELLNESS:** 31 templates (calculadora, guia, planilha, quiz)

### **DIAGNÓSTICOS NO CÓDIGO:**
- **NUTRI:** 32 diagnósticos (arquivo único `diagnosticos-nutri.ts`)
- **WELLNESS:** 34 diagnósticos (34 arquivos modulares)

---

## 🔍 ANÁLISE

### **1. TEMPLATES vs DIAGNÓSTICOS:**

#### **ÁREA NUTRI:**
- ✅ **37 templates** no Supabase
- ✅ **32 diagnósticos** no código
- ⚠️ **Diferença:** +5 templates sem diagnósticos (ou diagnósticos sem templates)

#### **ÁREA WELLNESS:**
- ✅ **31 templates** no Supabase
- ✅ **34 diagnósticos** no código
- ⚠️ **Diferença:** +3 diagnósticos sem templates (ou templates sem diagnósticos)

---

### **2. TIPOS DE TEMPLATES:**

#### **NUTRI (3 tipos):**
- ✅ calculadora
- ✅ planilha
- ✅ quiz

#### **WELLNESS (4 tipos):**
- ✅ calculadora
- ✅ guia ⚠️ **FALTA EM NUTRI**
- ✅ planilha
- ✅ quiz

**Observação:** Wellness tem tipo "guia" que Nutri não tem no Supabase, mas Nutri tem diagnósticos de "guia" no código.

---

## 🎯 ESTRATÉGIA RECOMENDADA

### **OPÇÃO 1: APROVEITAR TEMPLATES WELLNESS → NUTRI** ⭐ **RECOMENDADO**

**Vantagens:**
- ✅ Nutri já tem **37 templates** no Supabase (mais que Wellness!)
- ✅ Nutri já tem **32 diagnósticos revisados** no código
- ✅ Apenas precisa **verificar correspondência** entre templates e diagnósticos
- ✅ Não precisa duplicar nada, apenas organizar

**Ações:**
1. ✅ Verificar quais dos 37 templates Nutri têm diagnósticos correspondentes
2. ✅ Verificar quais dos 32 diagnósticos Nutri têm templates correspondentes
3. ✅ Criar diagnósticos faltantes para templates sem diagnóstico (se necessário)
4. ✅ Criar templates faltantes para diagnósticos sem template (se necessário)

---

### **OPÇÃO 2: DUPLICAR TEMPLATES WELLNESS → NUTRI**

**Desvantagens:**
- ❌ Nutri já tem **MAIS templates** que Wellness (37 vs 31)
- ❌ Pode criar duplicatas
- ❌ Não é necessário

---

## 📝 PRÓXIMOS PASSOS DETALHADOS

### **ETAPA 1: Mapear Correspondência** 🔍

**Criar script SQL para:**
1. Listar todos os 37 templates Nutri do Supabase (com `name`, `slug`, `type`)
2. Comparar com os 32 diagnósticos Nutri do código
3. Identificar:
   - ✅ Templates que TÊM diagnósticos
   - ❌ Templates que NÃO TÊM diagnósticos
   - ❌ Diagnósticos que NÃO TÊM templates

### **ETAPA 2: Decidir Ações** 🎯

**Baseado no mapeamento:**
- Se template tem diagnóstico → ✅ OK, nada a fazer
- Se template NÃO tem diagnóstico → Criar diagnóstico ou usar fallback
- Se diagnóstico NÃO tem template → Criar template ou marcar como "legado"

### **ETAPA 3: Modularizar Diagnósticos Nutri** (Opcional) 📦

**Se quiser seguir padrão Wellness:**
- Separar `diagnosticos-nutri.ts` em 32 arquivos modulares
- Criar `src/lib/diagnostics/nutri/` com um arquivo por diagnóstico
- Manter compatibilidade com código existente

---

## ✅ CONCLUSÃO

**Melhor estratégia:** 
1. ✅ **NÃO duplicar** templates (Nutri já tem mais!)
2. ✅ **Mapear correspondência** entre templates e diagnósticos
3. ✅ **Completar gaps** (templates sem diagnóstico ou vice-versa)
4. ⚠️ **Modularizar diagnósticos** (opcional, mas recomendado para manutenção)

**Próximo passo:** Criar script SQL para mapear correspondência entre templates e diagnósticos.



