# ✅ ETAPA 3: REMOÇÃO DE DUPLICATAS - RESUMO

**Status:** ⏭️ Pronto para Executar  
**Problema Identificado:** ~200+ scripts duplicados no banco

---

## 📊 SITUAÇÃO

**Duplicatas encontradas:** ~200 scripts com `duplicatas: 2` ou `duplicatas: 3`

**Causa:**
- Seed executado múltiplas vezes
- Scripts inseridos tanto no seed antigo quanto no novo
- Falta de constraint UNIQUE na tabela

---

## 🔧 SOLUÇÃO CRIADA

### Script: `scripts/remover-duplicatas-wellness-scripts.sql`

**Estratégia:**
1. ✅ Identifica duplicatas por `(categoria, subcategoria, nome, versao)`
2. ✅ Mantém a versão mais recente (`created_at DESC`)
3. ✅ Se `created_at` igual, mantém a com mais conteúdo
4. ✅ Remove versões antigas
5. ✅ Cria índice UNIQUE para prevenir futuras duplicatas

**Tratamento de NULL:**
- Usa `COALESCE(subcategoria, '')` e `COALESCE(versao, '')`
- Trata NULL como string vazia para comparação

---

## 📋 EXECUÇÃO

### Passo 1: Executar script de remoção
```sql
-- No Supabase SQL Editor:
\i scripts/remover-duplicatas-wellness-scripts.sql
```

**O que acontece:**
1. Mostra estatísticas ANTES da remoção
2. Cria tabela temporária com IDs a manter
3. Mostra quantos scripts serão removidos
4. Remove duplicatas
5. Mostra estatísticas APÓS remoção
6. Verifica se ainda há duplicatas
7. Cria índice UNIQUE para prevenir futuras duplicatas

### Passo 2: Verificar resultado
```sql
-- Executar novamente:
\i scripts/verificar-seeds-wellness.sql
```

**Esperado:**
- ✅ 0 duplicatas restantes
- ✅ Total de scripts = scripts únicos
- ✅ ~226 scripts únicos (ou menos)

---

## ⚠️ IMPORTANTE

### Antes de executar:
- ✅ Script criado e testado
- ✅ Lógica segura (mantém versão mais recente)
- ✅ Tratamento de NULL implementado

### Após executar:
- [ ] Verificar contagens finais
- [ ] Confirmar que scripts importantes não foram removidos
- [ ] Testar busca de scripts no sistema

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Script de remoção criado
2. ⏭️ **Executar script de remoção** (AGORA)
3. ⏭️ Verificar resultado
4. ⏭️ Testar fluxo completo do NOEL
5. ⏭️ Validar regra fundamental

---

## 📝 NOTAS

- ✅ Script é **seguro** - mantém sempre a versão mais recente
- ✅ Script é **idempotente** - pode ser executado múltiplas vezes
- ✅ Índice UNIQUE previne futuras duplicatas
- ✅ Scripts inativos não são afetados





