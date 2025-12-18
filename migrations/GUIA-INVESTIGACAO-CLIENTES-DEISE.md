# 🔍 Guia de Investigação: Clientes Desaparecidos - Deise

**Email:** paula@gmail.com

## 📋 Scripts Disponíveis

### 1. **Migração 163** - Query Rápida (EXECUTE PRIMEIRO)
**Arquivo:** `163-query-rapida-clientes-deise.sql`

**O que faz:**
- Diagnóstico rápido com todas as métricas principais
- Lista clientes deletados (se houver)
- Lista clientes únicos do histórico

**Execute primeiro e me envie os resultados!**

---

### 2. **Migração 160** - Investigação Completa
**Arquivo:** `160-investigar-clientes-desaparecidos-deise.sql`

**O que faz:**
- Investigação detalhada em todas as tabelas
- Verifica histórico, avaliações, leads, etc.

**Use se a query rápida não for suficiente.**

---

### 3. **Migração 162** - Investigação Expandida
**Arquivo:** `162-investigacao-completa-clientes-deise.sql`

**O que faz:**
- Verificação ainda mais detalhada
- Inclui programas, registros emocionais, etc.

---

### 4. **Migração 165** - Verificar Sincronização
**Arquivo:** `165-verificar-problemas-sincronizacao.sql`

**O que faz:**
- Verifica problemas de sincronização
- Verifica se clientes foram atribuídos a outro usuário
- Verifica RLS e filtros

---

### 5. **Migração 164** - Restaurar Clientes
**Arquivo:** `164-restaurar-clientes-deise-completo.sql`

**⚠️ ATENÇÃO: Execute apenas após investigação!**

**O que faz:**
- Restaura clientes deletados (soft delete)
- Recria clientes a partir do histórico
- Recria clientes a partir de avaliações
- Recria clientes a partir de registros emocionais
- Recria clientes a partir de programas
- Corrige status incorretos

**Todas as seções estão comentadas - descomente apenas o que for necessário!**

---

## 🚀 Passo a Passo

### Passo 1: Diagnóstico Rápido
```sql
-- Execute: migrations/163-query-rapida-clientes-deise.sql
```
**Me envie os resultados!**

### Passo 2: Análise dos Resultados

Com base nos resultados, identifique:

1. **Se houver clientes deletados:**
   - Execute a PARTE 1 da migração 164 (restaurar soft delete)

2. **Se houver clientes órfãos no histórico:**
   - Execute a PARTE 2 da migração 164 (recriar do histórico)

3. **Se houver avaliações sem cliente:**
   - Execute a PARTE 3 da migração 164 (recriar de avaliações)

4. **Se houver clientes com user_id errado:**
   - Execute a migração 165 para identificar
   - Depois corrija manualmente ou crie script específico

### Passo 3: Recuperação
```sql
-- Execute apenas as partes necessárias de: migrations/164-restaurar-clientes-deise-completo.sql
-- ⚠️ Descomente apenas o que for necessário!
```

### Passo 4: Verificação Final
```sql
-- Execute a PARTE 7 da migração 164 para verificar
```

---

## 🔍 Possíveis Causas

1. **Soft Delete:** Clientes foram deletados mas ainda existem no banco
   - **Solução:** PARTE 1 da migração 164

2. **Exclusão Definitiva:** Clientes foram realmente deletados
   - **Solução:** PARTE 2, 3, 4 ou 5 da migração 164 (recriar do histórico)

3. **User ID Errado:** Clientes foram atribuídos a outro usuário
   - **Solução:** Migração 165 + correção manual

4. **Status Incorreto:** Clientes existem mas com status que impede visualização
   - **Solução:** PARTE 6 da migração 164

5. **Problema de RLS:** Políticas de segurança bloqueando visualização
   - **Solução:** Verificar e corrigir políticas RLS

---

## ⚠️ IMPORTANTE

- **Sempre faça backup antes de executar UPDATE ou INSERT**
- **Execute uma parte por vez**
- **Verifique os resultados antes de continuar**
- **Me envie os resultados da query rápida primeiro!**







