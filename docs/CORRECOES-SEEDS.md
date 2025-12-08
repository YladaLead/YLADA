# 🔧 CORREÇÕES APLICADAS NOS SEEDS

## ✅ CORREÇÃO 1: Seed de Fluxos

**Problema:** 
```sql
RETURNING id INTO TEMP fluxo_2510_id;
```

**Erro:** Esta sintaxe não é válida no PostgreSQL/Supabase.

**Solução:** Removida a linha, pois não estava sendo usada. Os SELECTs já buscam pelo código do fluxo.

**Arquivo corrigido:** `scripts/seed-wellness-fluxos-completo.sql`

---

## ✅ VERIFICAÇÃO: Seed de Scripts

**Status:** O seed de scripts está correto. O `[nome]` está dentro de strings SQL, então não causa erro de sintaxe.

**Possível causa do erro:** 
- Pode ser problema na forma de execução no Supabase
- Ou algum caractere especial que não está visível

**Solução:** Se o erro persistir, execute o seed de scripts em partes menores.

---

## 📋 ORDEM DE EXECUÇÃO RECOMENDADA

1. ✅ **Migration 013** - Tabela wellness_links
2. ✅ **Migration 014** - Tabela wellness_treinos
3. ✅ **Seed Links** - 37 links (já executado com sucesso)
4. ✅ **Seed Treinos** - 35 treinos (já executado com sucesso)
5. ⏳ **Seed Scripts** - 28 scripts (verificar se há erro)
6. ⏳ **Seed Fluxos** - 6 fluxos (corrigido, pronto para executar)

---

## 🚀 PRÓXIMOS PASSOS

1. Executar o seed de fluxos corrigido
2. Se o seed de scripts der erro, executar em partes menores
3. Verificar inserções com queries de validação
