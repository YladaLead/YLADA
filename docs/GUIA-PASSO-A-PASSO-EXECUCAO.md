# 📋 GUIA PASSO A PASSO: Executar Script SQL

## 🎯 OBJETIVO

Migrar os 35 templates hardcoded da Nutri para o banco de dados Supabase.

---

## ⚠️ IMPORTANTE

**Não posso executar scripts SQL diretamente no Supabase.** Você precisa executar manualmente ou via interface do Supabase.

---

## 📋 PASSO A PASSO

### **PASSO 1: Acessar Supabase SQL Editor**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### **PASSO 2: Copiar Script SQL**

1. Abra o arquivo: `scripts/migrar-templates-nutri-EFICIENTE.sql`
2. **Copie TODO o conteúdo** do arquivo
3. Cole no SQL Editor do Supabase

### **PASSO 3: Executar Script**

1. Clique em **"Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
2. Aguarde a execução
3. Verifique os resultados nas queries de validação

### **PASSO 4: Verificar Resultados**

O script já inclui queries de validação que mostram:

1. **Estado antes:**
   - Quantos templates Wellness
   - Quantos templates Nutri

2. **Estado depois:**
   - Quantos templates Wellness (deve ser o mesmo)
   - Quantos templates Nutri (deve aumentar)

3. **Templates criados:**
   - Quantos foram criados
   - Lista de templates criados
   - Status do content (de Wellness ou básico)

---

## ✅ RESULTADO ESPERADO

### **Antes:**
- Wellness: ~38 templates
- Nutri: ~8 templates

### **Depois:**
- Wellness: ~38 templates (sem mudança)
- Nutri: ~43 templates (8 + 35 novos)

---

## 🔍 VERIFICAÇÕES

### **1. Verificar se todos foram criados:**
```sql
SELECT COUNT(*) as total_nutri
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';
```
**Esperado:** ~43 templates

### **2. Verificar templates criados agora:**
```sql
SELECT name, type, slug
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '5 minutes'
ORDER BY type, name;
```
**Esperado:** 35 templates listados

### **3. Verificar se content foi copiado de Wellness:**
```sql
SELECT 
  name,
  CASE 
    WHEN content::text LIKE '%template_type%' THEN '✅ Content OK'
    ELSE '⚠️ Content vazio'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '5 minutes';
```

---

## ⚠️ PROBLEMAS COMUNS

### **Erro: "relation does not exist"**
- **Causa:** Tabela `templates_nutrition` não existe
- **Solução:** Verificar se a tabela foi criada

### **Erro: "duplicate key value"**
- **Causa:** Template já existe
- **Solução:** O script usa `NOT EXISTS`, então não deve acontecer. Se acontecer, verificar se há templates duplicados.

### **Erro: "column does not exist"**
- **Causa:** Coluna `profession` ou `slug` não existe
- **Solução:** Verificar schema da tabela

---

## 📝 PRÓXIMOS PASSOS (Após execução)

1. ✅ **Validar** que 35 templates foram criados
2. ⚠️ **Atualizar página Nutri** para carregar do banco
3. ⚠️ **Testar** que templates aparecem na área Nutri
4. ⚠️ **Validar** que diagnósticos funcionam

---

## 🆘 PRECISA DE AJUDA?

Se encontrar algum erro:
1. Copie a mensagem de erro completa
2. Verifique qual query falhou
3. Compartilhe o erro para eu ajudar a resolver

