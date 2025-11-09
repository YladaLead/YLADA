# 📋 PASSO A PASSO COMPLETO: Criar Content Específico Nutri

## 🎯 OBJETIVO

Criar content específico para todos os 35 templates Nutri, separado de Wellness, para facilitar manutenção futura.

---

## ✅ ETAPA 1: Executar Script de Criação de Content

### **Passo 1.1: Acessar Supabase**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **"New query"**

### **Passo 1.2: Copiar Script**
1. Abra o arquivo: `scripts/criar-content-especifico-nutri.sql`
2. **Copie TODO o conteúdo** (Ctrl+A / Cmd+A, depois Ctrl+C / Cmd+C)
3. Cole no SQL Editor do Supabase

### **Passo 1.3: Executar**
1. Clique em **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)
2. Aguarde a execução
3. Verifique os resultados nas queries de validação

### **Passo 1.4: Verificar Resultado**
O script retorna:
- ✅ Lista de templates com status do content
- ✅ Contagem de templates atualizados
- ✅ Quantos têm content Nutri específico

**Resultado esperado:**
- ✅ 35 templates com "✅ Content Nutri específico"
- ✅ 0 templates com "⚠️ Content vazio"

---

## ✅ ETAPA 2: Verificar no Banco

### **Query de Verificação:**
```sql
SELECT 
  name,
  type,
  slug,
  CASE 
    WHEN content::text LIKE '%"profession": "nutri"%' THEN '✅ Content Nutri'
    WHEN content::text LIKE '%template_type%' THEN '✅ Content criado'
    ELSE '⚠️ Content vazio'
  END as status
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY type, name;
```

**Esperado:** Todos os 35 templates com "✅ Content Nutri"

---

## ✅ ETAPA 3: Atualizar Página Nutri (Próximo Passo)

Após validar que o content está criado, vamos atualizar a página Nutri para carregar do banco.

---

## 📊 ESTRUTURA DO CONTENT CRIADO

### **Calculadoras (4):**
- ✅ Campos específicos (peso, altura, atividade, etc.)
- ✅ Fórmulas personalizadas
- ✅ Labels em português
- ✅ Validações (min/max)

### **Quizzes (24):**
- ✅ Perguntas específicas para Nutri
- ✅ Opções de resposta
- ✅ Estrutura JSONB completa
- ✅ Campo `"profession": "nutri"` para identificação

### **Planilhas (7):**
- ✅ Itens/Sections específicos
- ✅ Estrutura organizada
- ✅ Campo `"profession": "nutri"` para identificação

---

## 🔍 VANTAGENS DESTA ABORDAGEM

### **1. Separação Clara:**
- ✅ Content Nutri separado de Wellness
- ✅ Fácil identificar qual content pertence a qual área
- ✅ Campo `"profession": "nutri"` em cada content

### **2. Manutenção Facilitada:**
- ✅ Cada template tem seu próprio content
- ✅ Fácil atualizar individualmente
- ✅ Estrutura JSONB permite expansão futura

### **3. Sem Conflitos:**
- ✅ Nutri não depende de Wellness
- ✅ Mudanças em Wellness não afetam Nutri
- ✅ Cada área evolui independentemente

---

## ⚠️ IMPORTANTE

### **Content vs Diagnósticos:**
- ✅ **Content** (no banco): Estrutura do template (perguntas, campos)
- ✅ **Diagnósticos** (no código): Textos de resultado (já revisados)

**Eles são independentes!** O content define COMO funciona, os diagnósticos definem O QUE mostrar.

---

## ✅ PRÓXIMOS PASSOS (Após Etapa 1)

1. ✅ Validar que content foi criado
2. ⚠️ Atualizar página Nutri para carregar do banco
3. ⚠️ Testar que templates aparecem
4. ⚠️ Validar que diagnósticos funcionam

---

## 🆘 SE DER ERRO

**Me avise:**
1. Qual erro apareceu
2. Em qual template falhou
3. Copie a mensagem de erro completa

**Vou ajustar o script imediatamente!**

