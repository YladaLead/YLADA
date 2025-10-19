# 🗄️ YLADA DATABASE STRUCTURE

## 📋 Visão Geral

Estrutura completa do banco Supabase alinhada com a **Assistente YLADA** e estratégia de **economia de IA + escala + margem alta**.

## 🎯 Objetivos da Estrutura

### 💰 Economia de IA
- **Dados armazenados** = menos chamadas à IA
- **Cache inteligente** de respostas
- **Templates pré-definidos** = custo fixo baixo
- **Perfil completo** do usuário

### 🚀 Escala
- **Templates reutilizáveis**
- **Métricas automáticas**
- **RLS (Row Level Security)**
- **Índices otimizados**

### 💎 Margem Alta
- **Custo fixo baixo**
- **Escala sem custos proporcionais**
- **IA apenas para personalização final**

## 📊 Tabelas Principais

### 1. 👤 USUÁRIOS E PERFIS
- **`users`** - Dados básicos dos usuários
- **`user_profiles`** - Perfil detalhado para economia de IA

### 2. 🛠️ TEMPLATES E FERRAMENTAS
- **`templates_base`** - Templates pré-definidos
- **`generated_tools`** - Ferramentas criadas pelos usuários

### 3. 🎯 LEADS E CONVERSÕES
- **`leads`** - Leads capturados pelas ferramentas

### 4. 🤖 IA E APRENDIZADO
- **`ai_conversations`** - Histórico de conversas
- **`ai_generated_templates`** - Templates gerados pela IA

### 5. ⚡ CACHE E PERFORMANCE
- **`ai_response_cache`** - Cache de respostas da IA

### 6. 📈 ANALYTICS
- **`user_metrics`** - Métricas de uso por usuário

## 🔧 Como Usar

### 1. Criar Banco no Supabase
```sql
-- Execute no SQL Editor do Supabase
\i schema-complete.sql
```

### 2. Verificar Setup
```sql
-- Execute para verificar
\i setup-supabase.sql
```

### 3. Integrar com a Aplicação
```typescript
// Exemplo de uso
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

## 🎯 Benefícios da Estrutura

### ✅ Para a Assistente YLADA
- **Dados completos** do usuário sempre disponíveis
- **Cache inteligente** para respostas similares
- **Templates específicos** por profissão/objetivo
- **Histórico de conversas** para aprendizado

### ✅ Para Economia de IA
- **Menos perguntas** repetitivas
- **Respostas em cache** para casos similares
- **Templates pré-definidos** = custo fixo
- **IA apenas para personalização** final

### ✅ Para Escala
- **Métricas automáticas** de performance
- **Templates reutilizáveis** entre usuários
- **Sistema de cache** eficiente
- **RLS** para segurança

## 🚀 Próximos Passos

1. **Executar scripts** no Supabase
2. **Integrar com ChatInterface** 
3. **Implementar cache** de respostas
4. **Conectar com OpenAI** Assistant
5. **Testar fluxo completo**

## 📝 Notas Importantes

- **RLS habilitado** em todas as tabelas
- **Índices otimizados** para consultas frequentes
- **Triggers automáticos** para updated_at
- **Políticas de segurança** configuradas
- **Dados de exemplo** incluídos

---

**Estrutura criada para suportar a estratégia completa da YLADA!** 🎯✨
