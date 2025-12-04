# 🔍 NOEL - Otimização da Base de Conhecimento

## 📊 ANÁLISE DO CASO ATUAL

### **Situação Observada:**
- **Similaridade:** 0% (nenhuma correspondência encontrada)
- **Tokens usados:** 1.723 (acima da média de ~1.000)
- **Fonte:** IA Gerada (100% OpenAI)
- **Custo:** ~R$ 0,10 por esta resposta (vs R$ 0,00 se estivesse na base)

### **Impacto:**
- ❌ **Custo 100% maior** do que o esperado
- ❌ **Resposta não padronizada** (pode variar)
- ❌ **Sem aprendizado** para próximas perguntas similares

---

## 🎯 CAUSAS POSSÍVEIS

### **1. Base de Conhecimento Vazia ou Incompleta**
- A tabela `knowledge_wellness_items` pode estar vazia
- Falta conteúdo sobre "follow-up de clientes"
- Embeddings não foram gerados

### **2. Threshold Muito Alto**
- Threshold atual: 0.5 (50% de similaridade)
- Perguntas podem precisar de threshold menor (0.3-0.4)

### **3. Embeddings Não Configurados**
- Função `match_wellness_knowledge` pode não existir
- Embeddings não foram gerados para os itens existentes

### **4. Categoria/Module Mismatch**
- Pergunta classificada como módulo diferente do conteúdo na base

---

## ✅ SOLUÇÕES IMEDIATAS

### **1. Verificar Base de Conhecimento**

```sql
-- Verificar se há itens na base
SELECT COUNT(*) as total_itens,
       COUNT(DISTINCT category) as categorias,
       COUNT(DISTINCT subcategory) as subcategorias
FROM knowledge_wellness_items
WHERE is_active = true;

-- Verificar se há embeddings
SELECT COUNT(*) as total_embeddings
FROM knowledge_wellness_embeddings;

-- Verificar itens por categoria
SELECT category, COUNT(*) as quantidade
FROM knowledge_wellness_items
WHERE is_active = true
GROUP BY category;
```

### **2. Adicionar Conteúdo sobre Follow-up**

Criar item na base de conhecimento:

```sql
INSERT INTO knowledge_wellness_items (
  title,
  slug,
  category,
  subcategory,
  tags,
  priority,
  content,
  is_active
) VALUES (
  'Follow-up de Clientes Após Venda',
  'follow-up-clientes-pos-venda',
  'mentor',
  'vendas',
  ARRAY['follow-up', 'clientes', 'vendas', 'relacionamento'],
  8,
  'Estratégias de follow-up eficaz:

1. **Timing Ideal:**
   - 24-48h após a primeira compra: agradecer e verificar satisfação
   - 7 dias: oferecer dicas de uso e suporte
   - 30 dias: verificar resultados e oferecer complementos

2. **Mensagens de Follow-up:**
   - "Oi! Como está sendo sua experiência com [produto]?"
   - "Precisa de alguma dica para potencializar os resultados?"
   - "Que tal conhecer [produto complementar]?"

3. **Oferta de Informações:**
   - Produtos complementares
   - Novidades que possam interessar
   - Programa de indicações

4. **Manter Relacionamento:**
   - Cliente feliz = defensor da marca
   - Serviço e suporte contínuo
   - Comunicação personalizada

Cada cliente feliz pode se tornar um defensor da sua marca!',
  true
);
```

### **3. Gerar Embeddings para Itens Existentes**

```sql
-- Script para gerar embeddings (executar via API ou script Node.js)
-- Ver: scripts/gerar-embeddings-base-conhecimento.js
```

### **4. Ajustar Threshold de Similaridade**

No arquivo `src/lib/noel-wellness/knowledge-search.ts`:

```typescript
// Linha 73: Reduzir threshold de 0.5 para 0.3
match_threshold: 0.3, // mínimo 30% de similaridade (era 0.5)
```

---

## 📈 PLANO DE AÇÃO

### **Fase 1: População Inicial (Urgente)**

1. **Criar 50-100 itens essenciais:**
   - Scripts de vendas
   - Follow-up de clientes
   - Respostas a objeções comuns
   - Dicas de recrutamento
   - Motivação e mindset

2. **Gerar embeddings:**
   - Executar script para gerar embeddings de todos os itens
   - Verificar se função `match_wellness_knowledge` existe

3. **Testar busca:**
   - Fazer perguntas de teste
   - Verificar se similaridade > 0%

### **Fase 2: Expansão Contínua**

1. **Sistema de aprendizado:**
   - Quando similaridade = 0%, salvar pergunta/resposta
   - Revisar periodicamente e adicionar à base

2. **Monitoramento:**
   - Dashboard de taxa de acerto
   - Alertas quando taxa < 60%

3. **Otimização:**
   - Ajustar tags e categorias
   - Melhorar descrições
   - Adicionar sinônimos

---

## 💰 IMPACTO FINANCEIRO

### **Cenário Atual (Similaridade 0%):**
- 100% das perguntas → IA
- Custo: R$ 7,70/usuário/mês (sem economia)

### **Cenário Otimizado (Similaridade 65%):**
- 65% das perguntas → Base (gratuito)
- 35% das perguntas → IA
- Custo: R$ 2,70/usuário/mês
- **Economia: R$ 5,00/usuário/mês (65% de redução)**

### **ROI da Otimização:**
- Investimento: 2-4 horas para criar 50-100 itens
- Retorno: R$ 5,00/usuário/mês
- Com 100 usuários: **R$ 500/mês de economia**

---

## 🔧 CHECKLIST DE IMPLEMENTAÇÃO

### **Verificações Técnicas:**
- [ ] Verificar se tabela `knowledge_wellness_items` existe
- [ ] Verificar se tabela `knowledge_wellness_embeddings` existe
- [ ] Verificar se função `match_wellness_knowledge` existe
- [ ] Verificar se extensão `pgvector` está habilitada no Supabase
- [ ] Testar geração de embeddings

### **População de Conteúdo:**
- [ ] Criar 50-100 itens essenciais
- [ ] Gerar embeddings para todos os itens
- [ ] Testar busca com perguntas reais
- [ ] Ajustar threshold se necessário

### **Monitoramento:**
- [ ] Implementar dashboard de taxa de acerto
- [ ] Configurar alertas para taxa < 60%
- [ ] Criar processo de revisão semanal

---

## 📝 PRÓXIMOS PASSOS

1. **Imediato:** Verificar estado atual da base de conhecimento
2. **Curto prazo (1 semana):** Popular com 50-100 itens essenciais
3. **Médio prazo (1 mês):** Expandir para 200-300 itens
4. **Longo prazo (contínuo):** Sistema de aprendizado automático

---

**Status:** ⚠️ Base de conhecimento precisa ser populada urgentemente para reduzir custos

