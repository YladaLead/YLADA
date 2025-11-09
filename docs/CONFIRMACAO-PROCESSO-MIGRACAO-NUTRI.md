# ✅ CONFIRMAÇÃO: Processo de Migração Nutri

## 🎯 PROCESSO CONFIRMADO

### **ETAPA 1: Migrar Templates Hardcoded → Banco**
- ✅ Pegar os **38 templates hardcoded** da área Nutri
- ✅ Inserir no banco com `profession='nutri'`
- ✅ Preservar nome, descrição, categoria da Nutri

### **ETAPA 2: Reutilizar Content de Wellness**
- ✅ Para cada template Nutri, **buscar template correspondente em Wellness**
- ✅ Se existir em Wellness → **copiar o `content` (JSONB)** de Wellness
- ✅ Se NÃO existir em Wellness → criar `content` básico baseado no tipo

### **ETAPA 3: Diagnósticos**
- ✅ **Usar diagnósticos da Nutri** (já estão revisados em `diagnosticos-nutri.ts`)
- ✅ **Só usar referências de Wellness** quando não tiver na Nutri
- ✅ Diagnósticos **NÃO estão no banco**, estão no código TypeScript

---

## 📋 RESUMO DO PROCESSO

```
1. Templates Hardcoded Nutri (38 templates)
   ↓
2. Para cada template:
   a. Buscar se existe em Wellness
   b. Se existe → copiar content de Wellness
   c. Se não existe → criar content básico
   ↓
3. Inserir no banco com:
   - profession='nutri'
   - name/description da Nutri (hardcoded)
   - content de Wellness (ou básico)
   ↓
4. Diagnósticos:
   - Continuam no código TypeScript
   - Usam diagnósticos da Nutri (já revisados)
   - Só usam Wellness se não tiver na Nutri
```

---

## ✅ GARANTIAS

1. **Templates hardcoded preservados** → Vão para o banco
2. **Content reutilizado** → De Wellness quando disponível
3. **Diagnósticos preservados** → Continuam no código, usando versão Nutri
4. **Zero perda** → Tudo que funciona continua funcionando

---

## 🎯 PRÓXIMO PASSO

Criar script SQL que:
1. Mapeia templates hardcoded Nutri → Templates Wellness
2. Copia content de Wellness quando existe
3. Insere no banco com profession='nutri'

