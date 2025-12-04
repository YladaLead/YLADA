# 📊 NOEL - Sistema de Análise de Histórico

## ✅ Implementação Completa

### O que foi criado:

1. **Tabela de Perfil do Consultor** (`wellness_consultant_profile`)
   - Estágio da carreira (iniciante, desenvolvimento, liderança, master)
   - Desafios principais identificados
   - Tópicos frequentes
   - Nível de engajamento
   - Score de consistência
   - Estatísticas de uso

2. **Colunas Adicionais em `wellness_user_queries`**
   - `detected_topic` - Tópico detectado na pergunta
   - `detected_challenge` - Desafio identificado
   - `career_stage` - Estágio da carreira inferido
   - `priority_area` - Área prioritária
   - `sentiment` - Sentimento da pergunta

3. **Analisador de Histórico** (`history-analyzer.ts`)
   - `analyzeQuery()` - Analisa cada pergunta individual
   - `getConsultantProfile()` - Busca perfil do consultor
   - `saveQueryAnalysis()` - Salva análise no banco
   - `generatePersonalizedContext()` - Gera contexto personalizado
   - `generateProactiveSuggestions()` - Sugestões proativas

4. **Funções SQL**
   - `update_consultant_profile()` - Atualiza perfil automaticamente
   - `get_consultant_insights()` - Retorna insights e recomendações
   - Trigger automático após cada query

5. **Integração na API NOEL**
   - Busca perfil antes de responder
   - Inclui contexto personalizado nas respostas
   - Salva análise de cada query
   - Atualiza perfil automaticamente

## 🎯 Como Funciona

### Fluxo de Análise:

```
Usuário faz pergunta
    ↓
1. Buscar perfil do consultor (se existir)
    ↓
2. Analisar query (tópico, desafio, estágio, sentimento)
    ↓
3. Classificar intenção (MENTOR/SUPORTE/TÉCNICO)
    ↓
4. Buscar na base de conhecimento
    ↓
5. Gerar resposta (com contexto personalizado do perfil)
    ↓
6. Salvar query com análise completa
    ↓
7. Atualizar perfil do consultor (trigger automático)
```

### Detecção Automática:

- **Tópicos**: PV, vendas, recrutamento, liderança, metas, shake, produtos, scripts, sistema, organização
- **Desafios**: falta_clientes, dificuldade_vendas, recrutamento_lento, organização, motivação, metas, conhecimento_produtos, scripts
- **Estágio da Carreira**: 
  - Iniciante (padrão)
  - Desenvolvimento (quando menciona recrutar/convidar)
  - Liderança (quando menciona equipe/liderança/duplicação)
  - Master (quando menciona master/elite/top)
- **Sentimento**: positivo, neutro, frustrado, dúvida, motivado

### Personalização:

O NOEL agora adapta respostas baseado em:
- Estágio da carreira do consultor
- Desafios principais identificados
- Tópicos de maior interesse
- Nível de engajamento
- Histórico de perguntas anteriores

## 📋 Próximos Passos

1. **Executar Script SQL**
   ```sql
   -- Executar no Supabase:
   scripts/adicionar-colunas-analise-historico.sql
   ```

2. **Testar Análise**
   - Fazer várias perguntas no chat
   - Verificar se perfil está sendo criado
   - Confirmar que contexto está sendo usado

3. **Expandir Detecção**
   - Adicionar mais padrões de tópicos
   - Melhorar detecção de desafios
   - Refinar estágio da carreira

4. **Dashboard de Insights** (futuro)
   - Página para consultor ver seu perfil
   - Gráficos de evolução
   - Recomendações personalizadas

## 🔧 Estrutura de Dados

### Perfil do Consultor:
- `career_stage`: Estágio atual
- `main_challenges[]`: Array de desafios principais
- `frequent_topics[]`: Array de tópicos mais perguntados
- `engagement_level`: baixo, medio, alto, muito_alto
- `consistency_score`: 0-1 (frequência de uso)
- `total_queries`: Total de perguntas feitas
- `queries_last_30_days`: Perguntas nos últimos 30 dias

### Análise de Query:
- `detected_topic`: Tópico identificado
- `detected_challenge`: Desafio identificado
- `career_stage`: Estágio inferido
- `sentiment`: Sentimento da pergunta

## 💡 Benefícios

1. **Orientação Mais Precisa**
   - Respostas adaptadas ao estágio da carreira
   - Foco nos desafios reais do consultor
   - Linguagem adequada ao nível

2. **Acompanhamento de Evolução**
   - Identifica progresso ao longo do tempo
   - Detecta mudanças de foco
   - Acompanha desenvolvimento

3. **Sugestões Proativas**
   - Oferece ajuda antes de ser solicitada
   - Antecipa necessidades
   - Guia próximo passo

4. **Marketing Multinível**
   - Entende onde o consultor está na jornada
   - Adapta orientação para cada fase
   - Suporta crescimento estruturado

