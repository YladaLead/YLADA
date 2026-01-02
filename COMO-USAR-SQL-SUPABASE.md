# 📋 Como Usar os SQLs no Supabase

**Data:** 2025-01-27  
**Status:** ✅ Pronto para usar

---

## 🚀 PASSO A PASSO

### **1. Acessar SQL Editor no Supabase**

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto
4. No menu lateral, clique em **"SQL Editor"**

---

### **2. Executar os SQLs**

1. Abra o arquivo `verificar-dados-supabase-noel.sql`
2. **Execute um SQL por vez** (ou todos de uma vez)
3. Veja os resultados na tabela abaixo

---

### **3. SQLs Mais Importantes (Execute Primeiro)**

#### **SQL 1: Verificar Fluxo de Reativação**
```sql
SELECT 
  codigo,
  titulo,
  ativo
FROM wellness_fluxos
WHERE 
  ativo = true
  AND (
    codigo ILIKE '%reativ%' 
    OR codigo ILIKE '%retenc%'
  )
ORDER BY codigo;
```

**O que procurar:**
- ✅ Se retornar resultados, anote o `codigo` exato
- ❌ Se não retornar nada, o fluxo não existe

---

#### **SQL 2: Verificar Calculadora de Água**
```sql
SELECT 
  slug,
  name,
  is_active
FROM templates_nutrition
WHERE 
  is_active = true
  AND (
    slug ILIKE '%agua%' 
    OR slug ILIKE '%hidrat%'
  )
ORDER BY slug;
```

**O que procurar:**
- ✅ Se retornar resultados, anote o `slug` exato
- ❌ Se não retornar nada, o template não existe

---

#### **SQL 3: Verificar Código Exato "reativacao"**
```sql
SELECT 
  codigo,
  titulo,
  ativo
FROM wellness_fluxos
WHERE codigo = 'reativacao';
```

**O que procurar:**
- ✅ Se retornar 1 resultado → Código existe!
- ❌ Se não retornar nada → Código não existe (precisa criar ou ajustar)

---

#### **SQL 4: Verificar Slug Exato "calculadora-agua"**
```sql
SELECT 
  slug,
  name,
  is_active
FROM templates_nutrition
WHERE slug = 'calculadora-agua';
```

**O que procurar:**
- ✅ Se retornar 1 resultado → Slug existe!
- ❌ Se não retornar nada → Slug não existe (precisa criar ou ajustar)

---

## 📊 O QUE FAZER COM OS RESULTADOS

### **Cenário 1: Dados Existem, Mas Códigos/Slugs Estão Diferentes**

**Exemplo:**
- SQL retorna: `codigo = 'fluxo-retencao-cliente'` (não `'reativacao'`)
- SQL retorna: `slug = 'calc-agua'` (não `'calculadora-agua'`)

**Solução:**
- Ajustar as functions para usar os códigos/slugs corretos
- OU criar aliases no banco
- OU atualizar os dados para usar os códigos esperados

---

### **Cenário 2: Dados Não Existem**

**Exemplo:**
- SQL não retorna nada para `codigo = 'reativacao'`
- SQL não retorna nada para `slug = 'calculadora-agua'`

**Solução:**
- Criar os dados faltantes no banco
- OU ajustar as functions para usar códigos/slugs que existem

---

### **Cenário 3: Dados Existem e Códigos Estão Corretos**

**Exemplo:**
- SQL retorna: `codigo = 'reativacao'` ✅
- SQL retorna: `slug = 'calculadora-agua'` ✅

**Solução:**
- O problema não é o banco de dados
- Pode ser problema na function ou no Assistants API
- Verificar logs para ver o erro exato

---

## ✅ CHECKLIST

Após executar os SQLs:

- [ ] Executei SQL 1 (Fluxo de Reativação)
- [ ] Anotei o código exato do fluxo (se existir)
- [ ] Executei SQL 2 (Calculadora de Água)
- [ ] Anotei o slug exato do template (se existir)
- [ ] Executei SQL 3 (Código exato "reativacao")
- [ ] Executei SQL 4 (Slug exato "calculadora-agua")
- [ ] Identifiquei qual cenário se aplica (1, 2 ou 3)

---

## 🎯 PRÓXIMOS PASSOS

**Me envie os resultados:**
1. O que retornou o SQL 1? (qual código do fluxo?)
2. O que retornou o SQL 2? (qual slug do template?)
3. O que retornou o SQL 3? (existe "reativacao"?)
4. O que retornou o SQL 4? (existe "calculadora-agua"?)

**Com essas informações, vou ajustar o código ou criar os dados faltantes!**

---

**🚀 Execute os SQLs e me envie os resultados!**





























