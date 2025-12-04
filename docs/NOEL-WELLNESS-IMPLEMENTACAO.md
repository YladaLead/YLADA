# 🎯 NOEL WELLNESS - Sistema de IA Implementado

## ✅ Status da Implementação

### Estrutura Criada

1. **✅ Banco de Dados (Supabase)**
   - `knowledge_wellness_items` - Base de conhecimento
   - `knowledge_wellness_embeddings` - Vetores de busca semântica
   - `wellness_user_queries` - Logs de queries
   - `wellness_learning_suggestions` - Sugestões de aprendizado

2. **✅ Classificador de Intenção**
   - `src/lib/noel-wellness/classifier.ts`
   - Detecta: MENTOR / SUPORTE / TÉCNICO
   - Baseado em palavras-chave e padrões

3. **✅ Busca por Embeddings**
   - `src/lib/noel-wellness/knowledge-search.ts`
   - Integração com OpenAI embeddings
   - Fallback para busca textual

4. **✅ API Principal**
   - `src/app/api/wellness/noel/route.ts`
   - Sistema híbrido: Base → IA
   - Três níveis de similaridade

5. **✅ Scripts SQL**
   - `scripts/criar-tabelas-noel-wellness.sql`
   - `scripts/criar-funcao-match-wellness-knowledge.sql`
   - `scripts/criar-funcao-increment-learning-frequency.sql`

## 🔄 Próximos Passos

### 1. Executar Scripts SQL
```bash
# No Supabase SQL Editor, executar:
- scripts/criar-tabelas-noel-wellness.sql
- scripts/criar-funcao-match-wellness-knowledge.sql
- scripts/criar-funcao-increment-learning-frequency.sql
```

### 2. Instalar Extensão pgvector
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Atualizar WellnessChatWidget
- Integrar com `/api/wellness/noel` quando chatbot = 'noel'
- Manter `/api/wellness/orientation` para suporte técnico básico
- Adicionar indicador de módulo ativo (MENTOR/SUPORTE/TÉCNICO)

### 4. Popular Base de Conhecimento Inicial
- Adicionar itens de exemplo (já incluídos no SQL)
- Gerar embeddings para itens existentes
- Criar conteúdo para cada módulo

### 5. Configurar Variáveis de Ambiente
```env
OPENAI_API_KEY=sk-...
```

## 📊 Fluxo de Funcionamento

```
Usuário envia mensagem
    ↓
Classificador detecta intenção (MENTOR/SUPORTE/TÉCNICO)
    ↓
Busca na Base de Conhecimento (embeddings)
    ↓
Similaridade ≥ 0.80? → Resposta exata
Similaridade 0.60-0.79? → Base + IA (personalizar)
Similaridade < 0.60? → IA completa
    ↓
Salvar log + Sugerir aprendizado (se necessário)
```

## 🎯 Módulos NOEL

### NOEL MENTOR
- Estratégias personalizadas
- Metas de PV, financeiras, clientes
- Duplicação, convite, follow-up
- Motivação e comportamento
- Modelo: GPT-4o-mini (padrão) / GPT-4.1 (análises profundas)

### NOEL SUPORTE
- Instruções do sistema ILADA
- Navegação na plataforma
- Problemas técnicos
- Modelo: GPT-4o-mini

### NOEL TÉCNICO
- Fluxos operacionais
- Bebidas funcionais (preparo, combinações)
- Campanhas e scripts
- Conteúdo oficial
- Prioriza Base de Conhecimento

## 💡 Sistema de Aprendizado

- Queries repetidas → Sugestão automática
- Respostas aprovadas → Adicionar à base
- IA gera padrão útil → Salvar como conhecimento
- Frequência alta → Priorizar aprovação

## 🔧 Integração com Frontend

O `WellnessChatWidget` precisa:
1. Detectar quando chatbot = 'noel'
2. Chamar `/api/wellness/noel` em vez de `/api/wellness/orientation`
3. Mostrar módulo ativo (MENTOR/SUPORTE/TÉCNICO)
4. Manter histórico de conversa
5. Exibir fonte da resposta (Base/IA/Híbrido)

## 📝 Notas Importantes

- **Custos**: Sistema prioriza Base de Conhecimento para reduzir tokens
- **Qualidade**: Respostas da base são sempre preferidas quando similaridade ≥ 0.80
- **Personalização**: IA personaliza quando similaridade 0.60-0.79
- **Aprendizado**: Sistema aprende automaticamente com uso

