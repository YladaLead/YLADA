# 🚀 Guia Completo de Execução — Integração das Lousas

## 📋 Ordem de Execução dos Scripts

### **PASSO 1: Preparar Banco de Dados**
```sql
-- Executar no Supabase SQL Editor
```

1. ✅ `migrations/009-adicionar-tipo-mentor-base-conhecimento.sql`
   - Adiciona coluna `tipo_mentor` nas tabelas

### **PASSO 2: Popular Base de Conhecimento**
```sql
-- Executar no Supabase SQL Editor
```

2. ✅ `scripts/seed-lousas-blocos-01-09-wellness.sql`
   - Insere 111 registros de scripts, frases e fluxos
   - **Tabela:** `ylada_wellness_base_conhecimento`

3. ✅ `scripts/seed-lousas-objecoes-wellness.sql`
   - Insere 40 objeções com respostas básicas
   - **Tabela:** `wellness_objecoes`

4. ✅ `scripts/seed-lousas-respostas-alternativas-wellness.sql`
   - Atualiza objeções do Grupo A e B (15 objeções)
   - **Tabela:** `wellness_objecoes`

5. ✅ `scripts/seed-lousas-respostas-alternativas-grupos-cde-wellness.sql`
   - Atualiza objeções dos Grupos C e D (20 objeções)
   - **Tabela:** `wellness_objecoes`

6. ✅ `scripts/seed-lousas-respostas-alternativas-grupo-e-wellness.sql`
   - Atualiza objeções do Grupo E (5 objeções)
   - **Tabela:** `wellness_objecoes`

### **PASSO 3: Migrar para Tabela de Busca Semântica**
```sql
-- Executar no Supabase SQL Editor
```

7. ✅ `scripts/migrar-lousas-para-knowledge-items.sql`
   - Migra dados de `ylada_wellness_base_conhecimento` → `knowledge_wellness_items`
   - Mapeia categorias corretamente
   - **Tabela destino:** `knowledge_wellness_items`

### **PASSO 4: Gerar Embeddings**
```bash
# Executar no terminal do projeto
```

8. ✅ `scripts/gerar-embeddings-lousas.ts`
   - Gera embeddings para todos os itens migrados
   - Usa OpenAI API (text-embedding-3-small)
   - **Comando:** `npx tsx scripts/gerar-embeddings-lousas.ts`
   - **Requisitos:**
     - Variável `OPENAI_API_KEY` configurada
     - Variáveis Supabase configuradas

---

## ✅ Checklist de Validação

Após executar todos os scripts, validar:

### 1. Verificar Base de Conhecimento
```sql
-- Total de registros em ylada_wellness_base_conhecimento
SELECT COUNT(*) FROM ylada_wellness_base_conhecimento WHERE tipo_mentor = 'noel' AND ativo = true;
-- Esperado: ~111 registros

-- Total de registros em knowledge_wellness_items
SELECT COUNT(*) FROM knowledge_wellness_items WHERE is_active = true;
-- Esperado: ~111 registros (após migração)
```

### 2. Verificar Objeções
```sql
-- Total de objeções
SELECT COUNT(*) FROM wellness_objecoes WHERE tipo_mentor = 'noel' AND ativo = true;
-- Esperado: 40 objeções

-- Verificar se têm respostas alternativas
SELECT 
  categoria,
  COUNT(*) as total,
  COUNT(versao_curta) as com_versao_curta,
  COUNT(gatilho_retomada) as com_gatilho
FROM wellness_objecoes
WHERE tipo_mentor = 'noel' AND ativo = true
GROUP BY categoria;
-- Esperado: todas as 40 objeções com respostas completas
```

### 3. Verificar Embeddings
```sql
-- Total de embeddings gerados
SELECT COUNT(*) FROM knowledge_wellness_embeddings;
-- Esperado: ~111 embeddings (um para cada item migrado)

-- Verificar itens sem embeddings
SELECT COUNT(*) 
FROM knowledge_wellness_items kwi
LEFT JOIN knowledge_wellness_embeddings kwe ON kwe.item_id = kwi.id
WHERE kwi.is_active = true AND kwe.id IS NULL;
-- Esperado: 0 (todos devem ter embeddings)
```

### 4. Testar Busca Semântica
```sql
-- Testar função de busca (requer embedding de teste)
-- Isso será feito via API do NOEL
```

---

## 🎯 Próximos Passos Após Execução

1. **Testar NOEL**: Fazer perguntas no chat e verificar se usa os scripts das lousas
2. **Monitorar Logs**: Verificar se similaridade está > 0% nas respostas
3. **Ajustar Threshold**: Se necessário, reduzir threshold de 0.5 para 0.3-0.4
4. **Integrar Prompts**: Atualizar system prompt do NOEL com conteúdo das lousas de prompts

---

## 📊 Resumo do Conteúdo Populado

- ✅ **111 scripts** na base de conhecimento
- ✅ **40 objeções** com respostas completas
- ✅ **111 embeddings** para busca semântica
- ✅ **Todas as categorias** mapeadas corretamente

---

## ⚠️ Notas Importantes

1. **Custo de Embeddings**: Gerar 111 embeddings custa aproximadamente $0.01-0.02 (muito barato)
2. **Tempo de Execução**: Script de embeddings leva ~2-3 minutos (com rate limiting)
3. **Rate Limiting**: Script aguarda 100ms entre requisições para não exceder limites da OpenAI
4. **Idempotência**: Todos os scripts podem ser executados múltiplas vezes sem erro

---

**Status**: ✅ Pronto para execução completa

