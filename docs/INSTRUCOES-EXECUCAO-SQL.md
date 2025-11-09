# ⚠️ IMPORTANTE: Executar Arquivo SQL, NÃO Markdown!

## ❌ ERRO COMUM

**Erro:** `syntax error at or near "#"`

**Causa:** Tentou executar arquivo `.md` (Markdown) em vez de `.sql` (SQL)

---

## ✅ SOLUÇÃO

### **Arquivos SQL (Execute estes):**
- ✅ `scripts/corrigir-template-sem-content.sql` ← **EXECUTE ESTE**
- ✅ `scripts/criar-content-especifico-nutri.sql`
- ✅ `scripts/migrar-templates-nutri-EFICIENTE.sql`

### **Arquivos Markdown (NÃO execute):**
- ❌ `docs/CORRECAO-CONTENT-FALTANTE.md` ← **NÃO EXECUTE**
- ❌ `docs/ANALISE-DUPLICATAS-E-FALTANTES.md` ← **NÃO EXECUTE**
- ❌ Qualquer arquivo `.md` ← **NÃO EXECUTE**

---

## 🚀 PASSO A PASSO CORRETO

### **1. Abrir Supabase SQL Editor**
- Acesse: https://supabase.com/dashboard
- Vá em **SQL Editor**
- Clique em **"New query"**

### **2. Abrir Arquivo SQL Correto**
- Abra: `scripts/corrigir-template-sem-content.sql` ← **ARQUIVO SQL**
- **NÃO** abra arquivos `.md` (são apenas documentação)

### **3. Copiar e Executar**
- Copie TODO o conteúdo do arquivo `.sql`
- Cole no SQL Editor
- Execute (Run ou `Ctrl+Enter`)

---

## 📝 DIFERENÇA ENTRE ARQUIVOS

### **Arquivos `.sql`:**
- ✅ Contêm código SQL executável
- ✅ Podem ser executados no Supabase
- ✅ Exemplo: `scripts/corrigir-template-sem-content.sql`

### **Arquivos `.md`:**
- ❌ Contêm apenas documentação/explicações
- ❌ NÃO podem ser executados
- ❌ Exemplo: `docs/CORRECAO-CONTENT-FALTANTE.md`

---

## ✅ ARQUIVO CORRETO PARA EXECUTAR AGORA

**Execute este arquivo:**
```
scripts/corrigir-template-sem-content.sql
```

**NÃO execute:**
```
docs/CORRECAO-CONTENT-FALTANTE.md  ← Este é apenas documentação!
```

