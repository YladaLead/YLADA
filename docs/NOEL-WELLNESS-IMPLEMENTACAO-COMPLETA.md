# NOEL WELLNESS - Implementação Completa

## ✅ PRIMEIRA ETAPA CONCLUÍDA

### 1. Banco de Dados (Prefix: `ylada_wellness_`)

**Arquivo:** `scripts/criar-banco-noel-completo.sql`

#### Tabelas Criadas:
- ✅ `ylada_wellness_consultores` - Nível 1: Dados do consultor
- ✅ `ylada_wellness_diagnosticos` - Nível 2: Diagnósticos completos
- ✅ `ylada_wellness_progresso` - Nível 2: Progresso diário
- ✅ `ylada_wellness_planos` - Nível 3: Planos personalizados (7/14/30/90 dias)
- ✅ `ylada_wellness_base_conhecimento` - Nível 4: Scripts, frases, fluxos
- ✅ `ylada_wellness_interacoes` - Memória do NOEL
- ✅ `ylada_wellness_notificacoes` - Sistema de notificações
- ✅ `ylada_wellness_ritual_dias` - Ritual 2-5-10

**Features:**
- ✅ RLS (Row Level Security) configurado
- ✅ Triggers para `updated_at` automático
- ✅ Índices otimizados
- ✅ Constraints e validações

### 2. Types TypeScript

**Arquivo:** `src/types/wellness-noel.ts`

**Types Criados:**
- ✅ `Consultor`, `Diagnostico`, `Progresso`
- ✅ `Plano`, `PlanoEstrutura`, `PlanoDia`
- ✅ `BaseConhecimento`
- ✅ `Interacao`, `Notificacao`
- ✅ `RitualDia`
- ✅ Request/Response types para todos os endpoints

### 3. Seed Inicial

**Arquivo:** `scripts/seed-base-conhecimento-noel.sql`

**Conteúdo:**
- ✅ 20 itens na base de conhecimento
- ✅ Scripts de vendas (4)
- ✅ Scripts de bebidas (3)
- ✅ Scripts de indicação (2)
- ✅ Scripts de recrutamento (3)
- ✅ Scripts de follow-up (3)
- ✅ Frases motivacionais (4)
- ✅ Fluxos padrão (3)
- ✅ Instruções (3)

### 4. Endpoints Obrigatórios

#### ✅ POST `/api/wellness/consultor/create`
- Cria consultor + diagnóstico inicial
- Validação de duplicidade
- **Arquivo:** `src/app/api/wellness/consultor/create/route.ts`

#### ✅ POST `/api/wellness/diagnostico/generate`
- Gera diagnóstico completo
- Análise automática de perfil
- Atualiza estágio do consultor
- **Arquivo:** `src/app/api/wellness/diagnostico/generate/route.ts`

#### ✅ POST `/api/wellness/plano/generate`
- Gera planos personalizados (7/14/30/90 dias)
- Baseado em: objetivo, tempo, estilo, desejo de recrutar
- Pausa planos anteriores automaticamente
- **Arquivo:** `src/app/api/wellness/plano/generate/route.ts`

#### ✅ POST `/api/wellness/progresso/registrar`
- Salva execuções diárias
- Atualiza ritual 2-5-10 automaticamente
- Upsert inteligente (cria ou atualiza)
- **Arquivo:** `src/app/api/wellness/progresso/registrar/route.ts`

#### ✅ POST `/api/wellness/noel/responder`
- **Fluxo principal do NOEL**
- Algoritmo completo: contexto → estratégia → resposta
- Reduz uso de IA (prioriza scripts)
- Salva interações automaticamente
- **Arquivo:** `src/app/api/wellness/noel/responder/route.ts`

#### ✅ GET `/api/wellness/scripts`
- Busca scripts da biblioteca
- Filtros: categoria, estágio, tempo, tags
- **Arquivo:** `src/app/api/wellness/scripts/route.ts`

#### ✅ POST `/api/wellness/notificacoes/create`
- Cria notificações inteligentes
- Validação de permissões
- **Arquivo:** `src/app/api/wellness/notificacoes/create/route.ts`

### 5. Lógica do NOEL

**Arquivo:** `src/lib/noel-wellness/response-generator.ts`

**Funcionalidades:**
- ✅ `loadNoelContext()` - Carrega contexto completo
- ✅ `decideResponseStrategy()` - Decide estratégia (pronta/ajuste/IA)
- ✅ `generatePersonalizedResponse()` - Ajusta resposta ao perfil
- ✅ `detectTopicAndIntent()` - Detecta tópico e intenção
- ✅ `buscarScriptsRelevantes()` - Busca scripts por perfil

**Arquivo:** `src/lib/noel-wellness/plano-generator.ts`

**Funcionalidades:**
- ✅ `generatePlano()` - Gera plano completo
- ✅ `gerarDiaPlano()` - Gera estrutura de cada dia
- ✅ `gerarMicrotarefas()` - Gera microtarefas baseadas em tempo/estágio
- ✅ `definirFocoDia()` - Define foco do dia
- ✅ `definirMetaDia()` - Define meta do dia
- ✅ `gerarFraseMotivacional()` - Gera frase do dia

## 🚧 PRÓXIMAS ETAPAS

### 6. Ritual 2-5-10
- ✅ Estrutura no banco criada
- ⏳ Endpoint para marcar execuções
- ⏳ Lógica de ajuste automático
- ⏳ Integração com notificações

### 7. Gerador de Planos
- ✅ Lógica base implementada
- ⏳ Ajustes automáticos baseados em progresso
- ⏳ Regras de adaptação dinâmica

### 8. Telas Frontend
- ⏳ Home do Consultor
- ⏳ Ritual 2-5-10
- ⏳ Semana Ativa
- ⏳ Chat com NOEL
- ⏳ Notificações

## 📋 COMO USAR

### 1. Executar Scripts SQL

```sql
-- 1. Criar banco de dados
\i scripts/criar-banco-noel-completo.sql

-- 2. Popular base de conhecimento
\i scripts/seed-base-conhecimento-noel.sql
```

### 2. Fluxo de Uso

1. **Criar Consultor:**
```typescript
POST /api/wellness/consultor/create
{
  nome: "João Silva",
  email: "joao@example.com",
  tempo_disponivel_diario: "30-60 min",
  // ... outros campos
}
```

2. **Gerar Diagnóstico:**
```typescript
POST /api/wellness/diagnostico/generate
{
  consultor_id: "...",
  respostas: { ... }
}
```

3. **Gerar Plano:**
```typescript
POST /api/wellness/plano/generate
{
  consultor_id: "...",
  tipo_plano: "30d"
}
```

4. **Registrar Progresso:**
```typescript
POST /api/wellness/progresso/registrar
{
  consultor_id: "...",
  ritual_2_executado: true,
  ritual_5_executado: true,
  // ...
}
```

5. **Conversar com NOEL:**
```typescript
POST /api/wellness/noel/responder
{
  consultor_id: "...",
  mensagem: "Como aumentar minhas vendas?"
}
```

## 🎯 ALGORITMO DO NOEL

```
1. Carregar contexto completo
   ├─ Consultor
   ├─ Diagnóstico
   ├─ Plano ativo
   ├─ Progresso hoje
   └─ Scripts relevantes

2. Decidir estratégia
   ├─ Resposta pronta? → Usar script + ajuste
   ├─ Contexto disponível? → Ajuste personalizado
   └─ Fallback → IA

3. Gerar resposta
   ├─ Personalizar para estágio
   ├─ Personalizar para tempo
   ├─ Adicionar contexto do progresso
   └─ Incluir lembretes do ritual

4. Salvar interação
   └─ Registrar tudo para aprendizado
```

## 📊 REDUÇÃO DE TOKENS

O sistema prioriza:
1. **Scripts prontos** (0 tokens)
2. **Ajuste personalizado** (poucos tokens)
3. **IA completa** (fallback)

**Resultado esperado:** Redução de 60-80% no uso de tokens OpenAI.

---

**Status:** ✅ Primeira etapa concluída
**Próximo passo:** Implementar Ritual 2-5-10 e telas frontend

