# 🚀 EXECUÇÃO: Automática vs Manual

## ⚠️ LIMITAÇÃO

**Não posso executar scripts SQL diretamente no Supabase** porque:
- Supabase JS Client não suporta execução de SQL arbitrário
- Segurança: SQL direto requer acesso de superusuário
- Melhor prática: Executar via SQL Editor do Supabase

---

## 📋 OPÇÕES DE EXECUÇÃO

### **OPÇÃO 1: Manual (RECOMENDADO) ⭐**

**Vantagens:**
- ✅ Mais seguro
- ✅ Você vê os resultados em tempo real
- ✅ Pode verificar cada passo
- ✅ Queries de validação já incluídas no script

**Passo a Passo:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **"New query"**
5. Abra o arquivo: `scripts/migrar-templates-nutri-EFICIENTE.sql`
6. **Copie TODO o conteúdo**
7. Cole no SQL Editor
8. Clique em **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)
9. Verifique os resultados nas queries de validação

**Tempo estimado:** 2-3 minutos

---

### **OPÇÃO 2: Via API Route (Desenvolvimento)**

Criei uma API route em `src/app/api/admin/migrar-templates-nutri/route.ts`, mas ela **não executa automaticamente** porque:
- Supabase JS não suporta SQL arbitrário
- Retorna instruções para execução manual

**Para usar (se quiser testar):**
```bash
curl -X POST http://localhost:3000/api/admin/migrar-templates-nutri
```

Mas ela vai retornar instruções para execução manual.

---

## ✅ RECOMENDAÇÃO

**Use a OPÇÃO 1 (Manual)** porque:
1. É mais rápido (2-3 minutos)
2. Você vê os resultados imediatamente
3. Pode verificar se tudo funcionou
4. Queries de validação já estão no script

---

## 📊 O QUE ESPERAR APÓS EXECUÇÃO

### **Resultados no SQL Editor:**

1. **Estado ANTES:**
   ```
   Wellness: 38 templates
   Nutri: 8 templates
   ```

2. **Estado DEPOIS:**
   ```
   Wellness: 38 templates (sem mudança)
   Nutri: 43 templates (8 + 35 novos)
   ```

3. **Templates criados:**
   ```
   35 templates listados
   ```

4. **Status do content:**
   - ✅ Content de Wellness (para templates que encontraram match)
   - ⚠️ Content básico (para templates que não encontraram match)

---

## 🔍 VERIFICAÇÃO PÓS-EXECUÇÃO

Após executar, você pode verificar:

```sql
-- Contar templates Nutri
SELECT COUNT(*) as total_nutri
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';
-- Esperado: ~43

-- Ver templates criados agora
SELECT name, type, slug
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '5 minutes'
ORDER BY type, name;
-- Esperado: 35 templates listados
```

---

## 🆘 PRECISA DE AJUDA?

Se encontrar algum erro:
1. Copie a mensagem de erro completa
2. Verifique qual query falhou
3. Compartilhe o erro para eu ajudar a resolver

---

## ✅ PRÓXIMOS PASSOS (Após execução)

1. ✅ Validar que 35 templates foram criados
2. ⚠️ Atualizar página Nutri para carregar do banco
3. ⚠️ Testar que templates aparecem na área Nutri
4. ⚠️ Validar que diagnósticos funcionam

