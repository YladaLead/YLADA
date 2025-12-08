# 🧹 ETAPA 3: REMOVER DUPLICATAS DE SCRIPTS

**Status:** ⏭️ Próximo Passo  
**Problema:** Scripts duplicados no banco de dados

---

## 📊 SITUAÇÃO IDENTIFICADA

**Total de duplicatas encontradas:** ~200+ scripts

**Causa provável:**
- Seed executado múltiplas vezes
- Scripts inseridos tanto no seed antigo quanto no novo
- Falta de constraint UNIQUE na tabela `wellness_scripts`

---

## 🎯 SOLUÇÃO

### Script criado: `scripts/remover-duplicatas-wellness-scripts.sql`

**Estratégia:**
1. Identificar duplicatas por `(categoria, subcategoria, nome, versao)`
2. Manter apenas a versão mais recente de cada duplicata
3. Deletar as versões antigas

**Critério de seleção:**
- Manter o registro com `created_at` mais recente
- Se `created_at` for igual, manter o primeiro encontrado

---

## 📋 EXECUÇÃO

### Passo 1: Verificar duplicatas
```sql
-- Executar no Supabase:
\i scripts/verificar-seeds-wellness.sql
```

**Verificar:**
- Quantas duplicatas existem
- Quais categorias são mais afetadas

### Passo 2: Remover duplicatas
```sql
-- Executar no Supabase:
\i scripts/remover-duplicatas-wellness-scripts.sql
```

**O que o script faz:**
1. Cria tabela temporária com IDs a manter
2. Deleta registros duplicados (exceto os mais recentes)
3. Verifica resultado final
4. Mostra estatísticas

### Passo 3: Verificar resultado
```sql
-- Executar novamente:
\i scripts/verificar-seeds-wellness.sql
```

**Esperado:**
- ✅ 0 duplicatas restantes
- ✅ Total de scripts único = total de scripts
- ✅ ~226 scripts únicos (ou menos, se alguns eram realmente duplicados)

---

## ⚠️ IMPORTANTE

### Antes de executar:
- [ ] Fazer backup do banco (se possível)
- [ ] Verificar quantas duplicatas existem
- [ ] Confirmar que não há dados importantes nas versões antigas

### Após executar:
- [ ] Verificar contagens finais
- [ ] Confirmar que scripts importantes não foram removidos
- [ ] Testar busca de scripts no sistema

---

## 🔍 ANÁLISE DAS DUPLICATAS

### Categorias mais afetadas:
- `script_recrutamento` - várias duplicatas
- `script_followup` - várias duplicatas
- `tipo_pessoa` - várias duplicatas
- `etapa` - várias duplicatas
- `acompanhamento` - várias duplicatas
- `frase_motivacional` - várias duplicatas

### Observações:
- A maioria tem `duplicatas: 2` (inserido 2 vezes)
- Alguns têm `duplicatas: 3` (inserido 3 vezes)
- Alguns scripts têm `versao: null` (podem ser de seed antigo)

---

## 🎯 PRÓXIMOS PASSOS APÓS REMOÇÃO

1. ✅ Verificar seeds executados
2. ✅ Remover duplicatas
3. ⏭️ Testar fluxo completo do NOEL
4. ⏭️ Validar regra fundamental

---

## 📝 NOTAS

- O script é **seguro** - mantém sempre a versão mais recente
- O script é **idempotente** - pode ser executado múltiplas vezes
- Scripts inativos (`ativo = false`) não são afetados
- Objeções não têm duplicatas (têm constraint UNIQUE)





