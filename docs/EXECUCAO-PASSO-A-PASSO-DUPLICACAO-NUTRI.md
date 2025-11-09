# 🚀 EXECUÇÃO PASSO A PASSO: Duplicar Templates Wellness → Nutri

## ✅ ETAPA 1: Estado Atual Confirmado

**Status verificado:**
- ✅ Wellness: **38 templates** (37 ativos, 1 inativo)
- ✅ Nutri: **8 templates** (8 ativos)
- ⚠️ Faltam: **31 templates** na Nutri

**Templates que serão duplicados:**
- 4 Calculadoras (Água, Calorias, IMC, Proteína)
- 4 Planilhas (Cardápio Detox, Checklist Detox, Desafio 21 Dias, Guia Hidratação)
- 23 Quizzes (Avaliação Inicial, Fome Emocional, Intolerâncias, etc.)

---

## 📋 ETAPA 2: Executar Script SQL no Supabase

### **Passo 1: Acessar Supabase**
1. Abrir [Supabase Dashboard](https://app.supabase.com)
2. Selecionar seu projeto
3. Ir em **SQL Editor** (menu lateral)

### **Passo 2: Copiar Script**
1. Abrir arquivo: `scripts/duplicar-templates-wellness-para-nutri-SEGURO.sql`
2. Copiar **TODO o conteúdo** do arquivo

### **Passo 3: Executar**
1. Colar o script no SQL Editor do Supabase
2. Clicar em **RUN** (ou pressionar `Ctrl+Enter` / `Cmd+Enter`)
3. Aguardar execução

### **Passo 4: Verificar Resultado**
O script retorna várias queries de verificação:

**Resultado esperado:**
- ✅ **ANTES**: Wellness=38, Nutri=8
- ✅ **DEPOIS**: Wellness=38, Nutri=39 (8 + 31 novos)
- ✅ **Templates criados**: 31
- ✅ **Faltando**: 0 (ou próximo de 0)

---

## 🔍 ETAPA 3: Validar no Código

Após executar o SQL, vamos verificar se funcionou:

### **Opção 1: Via API (Recomendado)**
```bash
curl http://localhost:3000/api/debug/comparar-templates-wellness-nutri | jq '.resumo'
```

**Resultado esperado:**
```json
{
  "wellness": { "total": 38, "ativos": 37 },
  "nutri": { "total": 39, "ativos": 38 },  ← Deve aumentar!
  "diferenca": { "faltando_na_nutri": 0 }   ← Deve ser 0!
}
```

### **Opção 2: Via Interface**
1. Acessar área Nutri: `http://localhost:3000/pt/nutri/ferramentas/templates`
2. Verificar se aparecem mais templates
3. Contar quantos templates aparecem (deve ser ~38)

---

## ✅ ETAPA 4: Verificar Diagnósticos

### **Templates que JÁ TÊM diagnóstico Nutri (funcionarão automaticamente):**

✅ **Quizzes:**
- Quiz Interativo
- Quiz Bem-Estar
- Quiz Perfil Nutricional
- Quiz Detox
- Quiz Energético

✅ **Calculadoras:**
- Calculadora IMC
- Calculadora Proteína
- Calculadora Água
- Calculadora Calorias

✅ **Checklists:**
- Checklist Detox
- Checklist Alimentar

✅ **Outros:**
- Avaliação Inicial
- Desafio 7 Dias
- Desafio 21 Dias
- Guia Hidratação
- E mais ~20 outros...

**Total: ~32 diagnósticos já revisados e funcionando!**

### **Templates que PRECISAM de diagnóstico Nutri:**

⚠️ **Quizzes novos (~15-18):**
- Avaliação Emocional
- Intolerância
- Perfil Metabólico
- Eletrólitos
- Sintomas Intestinais
- E mais...

**Ação:** Adicionar versão `nutri: { ... }` em `diagnosticos-nutri.ts` (próxima etapa)

---

## 🎯 PRÓXIMOS PASSOS (Após Executar SQL)

1. ✅ **Validar que templates foram criados** (Etapa 3)
2. ⚠️ **Identificar templates sem diagnóstico** (verificar quais não funcionam)
3. ⚠️ **Adicionar diagnósticos faltantes** (um por um, preservando os existentes)
4. ✅ **Testar cada template** na área Nutri

---

## 🛡️ SEGURANÇA

**O que está protegido:**
- ✅ Diagnósticos revisados **NÃO serão alterados**
- ✅ Templates existentes **NÃO serão alterados**
- ✅ Script usa `NOT EXISTS` para evitar duplicatas
- ✅ Pode executar múltiplas vezes sem problemas

**Se algo der errado:**
- Script pode ser executado novamente (é idempotente)
- Não apaga nada, apenas adiciona
- Diagnósticos no código não são afetados

---

## 📝 CHECKLIST DE EXECUÇÃO

- [ ] **ETAPA 1**: Estado atual verificado ✅
- [ ] **ETAPA 2**: Script SQL executado no Supabase
- [ ] **ETAPA 3**: Resultado validado (39 templates na Nutri)
- [ ] **ETAPA 4**: Diagnósticos verificados
- [ ] **PRÓXIMO**: Adicionar diagnósticos faltantes (se necessário)

---

## 🚨 IMPORTANTE

**Este script:**
- ✅ É **SEGURO** - não apaga nada
- ✅ É **IDEMPOTENTE** - pode executar várias vezes
- ✅ **PRESERVA** diagnósticos revisados
- ✅ Apenas **ADICIONA** templates faltantes

**Pode executar com confiança!** 🎯

