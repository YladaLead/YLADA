# 🚀 PLANO DE IMPLEMENTAÇÃO DO NOEL PARA O CLAUDE

**Versão:** 1.0.0  
**Data:** 2025-01-06  
**Status:** ✅ Pronto para Execução

---

## 📋 MENSAGEM INICIAL PARA O CLAUDE

Claude, finalizei com o ChatGPT o **Pacote Técnico Completo do Noel**, contendo:

- ✅ System Prompt final
- ✅ Lousas técnicas modulares
- ✅ Estruturas YAML e JSON
- ✅ Fluxos de decisão
- ✅ Protocolos completos
- ✅ Plano de implementação
- ✅ Checklist final

Esse é o material definitivo para você consolidar e integrar o Noel no SaaS.

**Por favor:**
1. Leia tudo com atenção
2. Unifique no System Prompt Consolidado do Noel
3. Integre no backend e na Assistants API
4. Conecte as intenções ao modelo de roteamento
5. Atualize as tabelas do Supabase
6. Teste os fluxos
7. Me avise quando a primeira versão integrada estiver pronta

---

## 📦 DOCUMENTOS DISPONÍVEIS

1. **`NOEL-PACOTE-TECNICO-COMPLETO.md`**
   - Todas as 6 lousas técnicas
   - Scripts oficiais
   - YAML/JSON estruturados
   - Exemplos práticos

2. **`SYSTEM-PROMPT-FINAL-NOEL.md`**
   - System Prompt pronto para Assistants API
   - Versão compacta e poderosa
   - Pronto para colar direto

3. **`PLANO-IMPLEMENTACAO-CLAUDE.md`** (este documento)
   - Instruções passo a passo
   - Checklist de implementação
   - Ordem de execução

---

## 🔧 FASES DE IMPLEMENTAÇÃO

### FASE 1 — Consolidação do System Prompt

**Objetivo:** Criar um único System Prompt unificado

**Ações:**
1. Ler `SYSTEM-PROMPT-FINAL-NOEL.md`
2. Ler todas as lousas em `NOEL-PACOTE-TECNICO-COMPLETO.md`
3. Consolidar tudo em um único System Prompt
4. Manter modularidade (Duplicação, SAC, Comercial, Emocional)
5. Garantir que todos os scripts estejam incluídos

**Resultado esperado:**
- System Prompt único e completo
- Todas as regras internas consolidadas
- Scripts oficiais incluídos

---

### FASE 2 — Detecção de Intenção no Backend

**Objetivo:** Implementar detecção automática de intenção

**Ações:**
1. Criar função `detectIntention(message: string)`
2. Implementar 4 categorias:
   - `duplicacao`
   - `sac`
   - `comercial`
   - `emocional`
3. Usar palavras-chave das lousas
4. Implementar fallback quando não detectar
5. Retornar categoria + confiança

**Código base sugerido:**
```typescript
interface Intention {
  type: 'duplicacao' | 'sac' | 'comercial' | 'emocional' | 'unknown'
  confidence: number
  keywords: string[]
}

function detectIntention(message: string): Intention {
  // Implementar lógica de detecção
}
```

**Resultado esperado:**
- Função de detecção funcionando
- 4 categorias detectadas corretamente
- Fallback implementado

---

### FASE 3 — Integração com Assistants API

**Objetivo:** Conectar o System Prompt ao modelo de IA

**Ações:**
1. Atualizar `/api/wellness/noel/route.ts`
2. Inserir System Prompt consolidado
3. Usar detecção de intenção antes de chamar IA
4. Passar contexto do módulo correto para a IA
5. Garantir que CTA sempre seja incluído

**Estrutura sugerida:**
```typescript
const systemPrompt = `[System Prompt Consolidado]`

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ],
  // ... outras configurações
})
```

**Resultado esperado:**
- API atualizada com novo System Prompt
- Respostas seguindo estrutura obrigatória
- CTAs sempre presentes

---

### FASE 4 — Tabelas do Supabase

**Objetivo:** Criar tabelas para ações, engajamento e gamificação

**Ações:**
1. Criar tabela `wellness_noel_acoes`
2. Criar tabela `wellness_noel_engajamento`
3. Criar tabela `wellness_noel_medalhas`
4. Criar índices apropriados

**SQL sugerido:**
```sql
-- Tabela de ações
CREATE TABLE wellness_noel_acoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tipo VARCHAR(50) NOT NULL, -- 'convite', 'apresentacao', 'kit', 'script'
  data TIMESTAMP DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de engajamento
CREATE TABLE wellness_noel_engajamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  ultima_acao TIMESTAMP,
  dias_sem_acao INTEGER DEFAULT 0,
  fluxo_reengajamento VARCHAR(50), -- 'leve', 'reorganizar', 'recomeco'
  ultima_mensagem_noel TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de medalhas
CREATE TABLE wellness_noel_medalhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tipo VARCHAR(50) NOT NULL, -- 'ritmo', 'constancia', 'transformacao'
  conquistada_em TIMESTAMP DEFAULT NOW(),
  dias_consecutivos INTEGER NOT NULL
);

-- Índices
CREATE INDEX idx_acoes_user_data ON wellness_noel_acoes(user_id, data DESC);
CREATE INDEX idx_engajamento_user ON wellness_noel_engajamento(user_id);
CREATE INDEX idx_medalhas_user ON wellness_noel_medalhas(user_id);
```

**Resultado esperado:**
- 3 tabelas criadas
- Índices otimizados
- Pronto para uso

---

### FASE 5 — Implementar YAML/JSON de Fluxos

**Objetivo:** Integrar fluxos estruturados no backend

**Ações:**
1. Criar arquivo `noel-flows.yaml` ou `noel-flows.json`
2. Implementar parser de fluxos
3. Conectar fluxos à detecção de intenção
4. Usar fluxos para gerar respostas estruturadas

**Estrutura sugerida:**
```typescript
import flows from './noel-flows.json'

function getFlowResponse(intention: string, context: any) {
  const flow = flows[intention]
  // Processar fluxo e retornar resposta estruturada
}
```

**Resultado esperado:**
- Fluxos integrados
- Respostas mais consistentes
- Fácil manutenção

---

### FASE 6 — Onboarding Automático

**Objetivo:** Implementar onboarding de 7 minutos e 7 dias

**Ações:**
1. Detectar primeiro acesso do usuário
2. Iniciar fluxo de onboarding
3. Registrar progresso nos 7 dias
4. Enviar mensagens diárias automáticas
5. Marcar onboarding como completo após 7 dias

**Lógica sugerida:**
```typescript
async function checkOnboarding(userId: string) {
  const profile = await getNoelProfile(userId)
  
  if (!profile.onboarding_completo) {
    const dias = calculateDaysSince(profile.created_at)
    
    if (dias === 0) {
      return getOnboardingMessage('primeiros7min')
    } else if (dias <= 7) {
      return getOnboardingMessage(`dia${dias}`)
    }
  }
  
  return null
}
```

**Resultado esperado:**
- Onboarding funcionando
- Mensagens automáticas nos 7 dias
- Progresso registrado

---

### FASE 7 — Reengajamento Automático

**Objetivo:** Detectar inatividade e reengajar

**Ações:**
1. Criar job/cron para verificar inatividade
2. Calcular dias sem ação
3. Enviar mensagem de reengajamento apropriada
4. Atualizar tabela de engajamento

**Lógica sugerida:**
```typescript
async function checkReengagement(userId: string) {
  const engajamento = await getEngajamento(userId)
  const diasSemAcao = calculateDaysSince(engajamento.ultima_acao)
  
  if (diasSemAcao === 3) {
    return getReengagementMessage('dias3')
  } else if (diasSemAcao === 7) {
    return getReengagementMessage('dias7')
  } else if (diasSemAcao === 14) {
    return getReengagementMessage('dias14')
  } else if (diasSemAcao === 30) {
    return getReengagementMessage('dias30')
  }
  
  return null
}
```

**Resultado esperado:**
- Reengajamento automático funcionando
- Mensagens enviadas nos momentos certos
- Usuários retornando ao sistema

---

### FASE 8 — Gamificação LADA

**Objetivo:** Implementar sistema de medalhas e níveis

**Ações:**
1. Calcular dias consecutivos de atividade
2. Verificar se conquistou medalha
3. Enviar mensagem de reconhecimento
4. Registrar medalha no banco

**Lógica sugerida:**
```typescript
async function checkGamification(userId: string) {
  const diasConsecutivos = await getDiasConsecutivos(userId)
  
  if (diasConsecutivos === 3 && !hasMedalha(userId, 'ritmo')) {
    await grantMedalha(userId, 'ritmo')
    return getGamificationMessage('ritmo3')
  } else if (diasConsecutivos === 7 && !hasMedalha(userId, 'constancia')) {
    await grantMedalha(userId, 'constancia')
    return getGamificationMessage('constancia7')
  } else if (diasConsecutivos === 30 && !hasMedalha(userId, 'transformacao')) {
    await grantMedalha(userId, 'transformacao')
    return getGamificationMessage('transformacao30')
  }
  
  return null
}
```

**Resultado esperado:**
- Gamificação funcionando
- Medalhas sendo concedidas
- Usuários motivados

---

### FASE 9 — Melhorias no Frontend

**Objetivo:** Atualizar interface do chat e adicionar visualizações

**Ações:**
1. Melhorar `WellnessChatWidget`
2. Adicionar indicador visual de módulo ativo
3. Criar dashboard de progresso
4. Mostrar medalhas conquistadas
5. Exibir ações do dia

**Componentes sugeridos:**
- `NoelChatWidget` (melhorado)
- `NoelProgressDashboard`
- `NoelMedalhas`
- `NoelAcoesHoje`

**Resultado esperado:**
- Interface melhorada
- Visualizações de progresso
- Experiência mais rica

---

### FASE 10 — Testes e Validação

**Objetivo:** Garantir que tudo funciona perfeitamente

**Testes necessários:**

1. **Teste de Duplicação**
   - Pergunta: "Como faço para convidar alguém?"
   - Esperado: Resposta com script de convite + CTA

2. **Teste de SAC**
   - Pergunta: "Meu link não abre"
   - Esperado: Diagnóstico + solução + CTA

3. **Teste Comercial**
   - Pergunta: "Quanto custa o kit?"
   - Esperado: Benefício + oferta + fechamento

4. **Teste Emocional**
   - Pergunta: "Estou desanimado"
   - Esperado: Acolhimento + normalização + microação

5. **Teste de Onboarding**
   - Primeiro acesso
   - Esperado: Fluxo de 7 minutos iniciado

6. **Teste de Reengajamento**
   - Usuário inativo 7 dias
   - Esperado: Mensagem de reengajamento enviada

7. **Teste de Gamificação**
   - 3 dias consecutivos
   - Esperado: Medalha de Ritmo concedida

**Resultado esperado:**
- Todos os testes passando
- Sistema funcionando perfeitamente
- Pronto para produção

---

## ✅ CHECKLIST FINAL DE IMPLEMENTAÇÃO

Use este checklist para garantir que tudo foi implementado:

### Backend
- [ ] System Prompt consolidado criado
- [ ] Detecção de intenção implementada
- [ ] API `/api/wellness/noel` atualizada
- [ ] Fluxos YAML/JSON integrados
- [ ] Tabelas do Supabase criadas
- [ ] Onboarding implementado
- [ ] Reengajamento implementado
- [ ] Gamificação implementada

### Frontend
- [ ] Chat widget melhorado
- [ ] Dashboard de progresso criado
- [ ] Visualização de medalhas
- [ ] Indicador de módulo ativo

### Testes
- [ ] Teste de Duplicação passando
- [ ] Teste de SAC passando
- [ ] Teste Comercial passando
- [ ] Teste Emocional passando
- [ ] Teste de Onboarding passando
- [ ] Teste de Reengajamento passando
- [ ] Teste de Gamificação passando

### Documentação
- [ ] Código comentado
- [ ] README atualizado
- [ ] Changelog criado

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

Para máxima eficiência, siga esta ordem:

1. **FASE 1** — Consolidação do System Prompt (2-3h)
2. **FASE 2** — Detecção de Intenção (1-2h)
3. **FASE 3** — Integração com Assistants API (2-3h)
4. **FASE 4** — Tabelas do Supabase (1h)
5. **FASE 5** — YAML/JSON de Fluxos (2h)
6. **FASE 6** — Onboarding (2-3h)
7. **FASE 7** — Reengajamento (2h)
8. **FASE 8** — Gamificação (2h)
9. **FASE 9** — Melhorias no Frontend (3-4h)
10. **FASE 10** — Testes (2-3h)

**Total estimado:** 19-26 horas

---

## 📞 SUPORTE

Se tiver dúvidas durante a implementação:

1. Consulte `NOEL-PACOTE-TECNICO-COMPLETO.md` para detalhes
2. Consulte `SYSTEM-PROMPT-FINAL-NOEL.md` para o prompt oficial
3. Verifique os exemplos nas lousas
4. Teste cada módulo isoladamente antes de integrar

---

## 🎉 CONCLUSÃO

Com este plano, você tem:
- ✅ Tudo que precisa para implementar
- ✅ Ordem clara de execução
- ✅ Checklist de validação
- ✅ Exemplos práticos
- ✅ Estrutura técnica completa

**Boa implementação!** 🚀

