# ⚠️ PROBLEMA: Content Básico Criado

## 📊 SITUAÇÃO

Todos os 35 templates foram criados, mas **todos têm content básico** em vez de copiar de Wellness.

**Causa:** A busca de content de Wellness não encontrou correspondências.

---

## ✅ SOLUÇÃO

Criei um script separado: `scripts/atualizar-content-nutri-de-wellness.sql`

Este script faz **UPDATE direto** copiando content de Wellness para Nutri usando mapeamento explícito.

---

## 🚀 PRÓXIMO PASSO

**Execute o script de atualização:**

1. Abra: `scripts/atualizar-content-nutri-de-wellness.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

**Este script vai:**
- ✅ Buscar templates Wellness correspondentes
- ✅ Copiar o content para templates Nutri
- ✅ Mostrar quantos foram atualizados

---

## 📊 RESULTADO ESPERADO

Após executar, você deve ver:
- ✅ Alguns templates com "✅ Content de Wellness"
- ⚠️ Alguns ainda com "⚠️ Content básico" (se não houver correspondente em Wellness)

---

## 🔍 VERIFICAÇÃO

O script já inclui queries de verificação que mostram:
- Quantos templates foram atualizados
- Quantos têm content de Wellness
- Quantos ainda têm content básico

