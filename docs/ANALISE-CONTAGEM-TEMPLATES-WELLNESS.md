# 🔍 ANÁLISE: Contagem de Templates Wellness

## 📊 PROBLEMA IDENTIFICADO

**Situação:**
- A página mostra **"Todas (39)"** no dropdown de categorias
- Esperamos **35 templates** (baseado nos scripts SQL criados)
- Diferença: **+4 templates** a mais

## 🔎 POSSÍVEIS CAUSAS

### 1. **Templates Duplicados no Banco**
- Pode haver templates com o mesmo nome ou slug
- Duplicatas podem ter sido criadas durante migrações anteriores

### 2. **Templates Inativos Sendo Contados**
- A API filtra por `is_active = true`, mas pode haver inconsistência
- Templates podem ter sido desativados e reativados

### 3. **Templates de Outras Áreas**
- A API filtra por `profession = 'wellness'`, mas pode haver templates sem profession definida sendo incluídos

### 4. **Templates do Fallback Hardcoded**
- O código tem um `templatesFallback` hardcoded
- Pode estar sendo somado aos templates do banco

## 🔧 VERIFICAÇÃO NECESSÁRIA

### **Script SQL Criado:**
`scripts/verificar-duplicatas-wellness.sql`

Este script verifica:
1. Contagem total de templates (ativos e inativos)
2. Duplicatas por nome
3. Duplicatas por slug
4. Lista completa de templates com status
5. Contagem por tipo

### **Como Verificar:**

1. **Executar o script SQL no Supabase:**
   ```sql
   -- Executar: scripts/verificar-duplicatas-wellness.sql
   ```

2. **Verificar o console do navegador:**
   - Abrir DevTools (F12)
   - Ir para Console
   - Procurar por logs: `📦 Templates carregados do banco:`
   - Verificar quantos templates estão sendo retornados

3. **Verificar a API diretamente:**
   - Acessar: `http://localhost:3000/api/wellness/templates`
   - Verificar o campo `templates.length` na resposta

## 📋 PRÓXIMOS PASSOS

1. ✅ Script SQL criado para verificar duplicatas
2. ⏳ Executar script no Supabase
3. ⏳ Analisar resultados
4. ⏳ Identificar e remover duplicatas (se houver)
5. ⏳ Ajustar contagem se necessário

---

**Última atualização:** 2025-01-XX


