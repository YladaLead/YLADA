# ✅ PROCESSO CONFIRMADO: Migração Templates Nutri

## 🎯 PROCESSO FINAL

### **ETAPA 1: Migrar Templates Hardcoded → Banco**
- ✅ Pegar os **38 templates hardcoded** da área Nutri
- ✅ Inserir no banco com `profession='nutri'`
- ✅ Preservar **nome, descrição, categoria** da Nutri (hardcoded)

### **ETAPA 2: Reutilizar Content de Wellness**
- ✅ Para cada template Nutri, **buscar template correspondente em Wellness**
- ✅ Se existir em Wellness → **copiar o `content` (JSONB)** de Wellness
- ✅ Se NÃO existir em Wellness → criar `content` básico baseado no tipo

### **ETAPA 3: Diagnósticos**
- ✅ **Usar diagnósticos da Nutri** (já estão revisados em `diagnosticos-nutri.ts`)
- ✅ **Só usar referências de Wellness** quando não tiver na Nutri
- ✅ Diagnósticos **NÃO estão no banco**, estão no código TypeScript

---

## 📋 RESUMO VISUAL

```
┌─────────────────────────────────────────┐
│ TEMPLATES HARDCODED NUTRI (38)          │
│ - Nome, descrição, categoria            │
│ - Já funcionando com previews           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ BUSCAR EM WELLNESS                      │
│ - Por nome similar                      │
│ - Copiar content (JSONB)                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ INSERIR NO BANCO                        │
│ - profession='nutri'                   │
│ - name/description da Nutri             │
│ - content de Wellness (ou básico)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ DIAGNÓSTICOS                            │
│ - Continuam no código TypeScript        │
│ - Usam versão Nutri (já revisados)     │
│ - Só usam Wellness se não tiver Nutri  │
└─────────────────────────────────────────┘
```

---

## ✅ GARANTIAS

1. **Templates hardcoded preservados** → Vão para o banco
2. **Content reutilizado** → De Wellness quando disponível
3. **Diagnósticos preservados** → Continuam no código, usando versão Nutri
4. **Zero perda** → Tudo que funciona continua funcionando

---

## 📝 PRÓXIMOS PASSOS

1. ✅ **Criar script SQL completo** (com todos os 38 templates)
2. ⚠️ **Executar script no Supabase**
3. ⚠️ **Atualizar página Nutri** para carregar do banco
4. ✅ **Validar** que tudo funciona

