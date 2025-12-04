# 🧠 PROMPT OPERACIONAL PARA O CLAUDE — IMPLEMENTAÇÃO COMPLETA DO NOEL (YLADA WELLNESS)

**(Copiar e colar integralmente no Claude)**

---

## 🎯 CLAUDE, SUA TAREFA AGORA É IMPLEMENTAR O "NOEL" — A IA MENTORA DO SISTEMA YLADA WELLNESS

Toda a arquitetura de backend já foi construída por você:

- ✅ Tabelas
- ✅ Triggers
- ✅ Endpoints
- ✅ Lógica inicial
- ✅ Estrutura de scripts
- ✅ Ritual 2-5-10
- ✅ Progresso
- ✅ Diagnósticos
- ✅ Planos
- ✅ response-generator
- ✅ plano-generator

**Agora falta implementar o cérebro do NOEL**, baseando-se no Prompt Base que está na lousa "Checklist_NOEL_Wellness".

---

## 🔥 1. INTEGRAR TODAS AS REGRAS DO PROMPT BASE

Sua tarefa agora é:

### **Integrar TODAS as regras, comportamentos e decisões do PROMPT BASE dentro do código do NOEL.**

Você deve acessar e modificar:

1. **`src/lib/noel-wellness/response-generator.ts`**
   - Função principal de geração de resposta
   - Lógica de personalização
   - Integração com scripts

2. **`src/lib/noel-wellness/plano-generator.ts`**
   - Gerador de planos (já existe, pode precisar ajustes)

3. **`src/app/api/wellness/noel/responder/route.ts`**
   - Endpoint principal do NOEL
   - Orquestração completa

E adicionar/complementar funções auxiliares se necessário.

---

## 🎯 2. HIERARQUIA DE DECISÃO (OBRIGATÓRIA)

A lógica do NOEL deve seguir **exatamente** esta hierarquia definida no Prompt Base:

### 🔹 **Passo 1 — Detectar Intenção**

Criar função `detectarIntencao(mensagem: string): IntencaoDetectada`

```typescript
interface IntencaoDetectada {
  tipo: 'vendas' | 'recrutamento' | 'tecnico' | 'motivacional' | 'duvida' | 'geral'
  confianca: number
  palavras_chave: string[]
  contexto?: string
}
```

**Regras de detecção:**
- Palavras como "vender", "vendas", "cliente" → `vendas`
- Palavras como "recrutar", "equipe", "distribuidor" → `recrutamento`
- Palavras como "como fazer", "onde está", "funciona" → `tecnico`
- Palavras como "desanimado", "não consigo", "difícil" → `motivacional`
- Palavras como "dúvida", "pergunta", "não entendi" → `duvida`
- Caso contrário → `geral`

---

### 🔹 **Passo 2 — Checar Scripts da Base**

Chamada ao endpoint `/api/wellness/scripts` filtrando por:
- `categoria` (baseado na intenção detectada)
- `estagio_negocio` (do consultor)
- `tempo_disponivel` (do consultor)
- `tags` (palavras-chave da mensagem)

**Prioridade:**
1. Scripts com `prioridade >= 8`
2. Scripts que combinam com `estagio_negocio` do consultor
3. Scripts que combinam com `tempo_disponivel` do consultor

**Se encontrar script relevante:**
- Usar conteúdo do script como base
- Personalizar com dados do consultor
- **NÃO chamar IA ainda**

---

### 🔹 **Passo 3 — Personalizar com Base nos Dados do Consultor**

Carregar contexto completo:
- `consultor` (estágio, experiência, tempo, objetivos)
- `diagnostico` (perfil, pontos fortes, desafios)
- `planoAtivo` (plano atual, dia atual)
- `progressoHoje` (rituais, microtarefas, métricas)

**Aplicar personalização:**
- Ajustar tom conforme estágio
- Incluir contexto do diagnóstico
- Referenciar plano ativo se relevante
- Mencionar progresso se positivo

---

### 🔹 **Passo 4 — Ajustar ao Dia do Plano**

Se consultor tem plano ativo:

1. **Identificar dia atual do plano:**
   ```typescript
   const hoje = new Date()
   const dataInicio = new Date(planoAtivo.data_inicio)
   const diasDecorridos = Math.floor((hoje - dataInicio) / (1000 * 60 * 60 * 24))
   const diaAtual = diasDecorridos + 1
   ```

2. **Buscar plano do dia:**
   ```typescript
   const { data: planoDia } = await supabase
     .from('wellness_planos_dias')
     .select('*')
     .eq('dia', diaAtual)
     .single()
   ```

3. **Reforçar automaticamente:**
   - **Microtarefas do dia** → mencionar se não completas
   - **Rituais** → reforçar se não executados
   - **Metas do dia** → lembrar se relevante
   - **Mensagem do NOEL do dia** → incluir se apropriado

**Exemplo:**
```
"Hoje é seu dia 7. Você tem 3 microtarefas pendentes. 
Vamos completá-las? Lembre-se: Ritual 2 pela manhã, 
Ritual 5 à tarde e Ritual 10 à noite."
```

---

### 🔹 **Passo 5 — Se Tudo Acima Não Resolver → IA Generativa (Fallback)**

**Só usar IA se:**
- Não encontrou script relevante
- Script não cobre completamente a pergunta
- Precisa de resposta mais contextualizada

**Ao usar IA, sempre:**
- ✅ Tom motivador moderado
- ✅ Estilo: Mark Hughes + Jim Rohn + Eric Worre
- ✅ Final com ação prática
- ✅ Resposta curta/média (máximo 300 palavras)
- ✅ Incluir contexto do consultor no prompt

**Prompt para IA:**
```typescript
const systemPrompt = `Você é NOEL, mentor oficial da área WELLNESS do YLADA.

Contexto do consultor:
- Estágio: ${consultor.estagio_negocio}
- Experiência: ${consultor.experiencia}
- Tempo disponível: ${consultor.tempo_disponivel_diario}
- Objetivo: ${consultor.objetivo_principal || 'crescimento'}

Regras:
- Seja objetivo, prático e inspirador leve
- Sempre termine com uma ação prática
- Resposta curta (máximo 300 palavras)
- Tom: Mark Hughes + Jim Rohn + Eric Worre
- Proibido: exageros, promessas financeiras, falas místicas
- Filosofia YLADA: duplicável, consistente, humano

${planoDia ? `Hoje é o dia ${diaAtual} do plano. Foco: ${planoDia.foco}` : ''}
${progressoHoje ? `Progresso hoje: ${progressoHoje.microtarefas_completadas}/${progressoHoje.microtarefas_total} microtarefas` : ''}
`
```

---

## 🏗️ 3. IMPLEMENTAR PERSONALIZAÇÃO AUTOMÁTICA

Criar condições dentro do `response-generator.ts`:

### **Por Experiência:**

```typescript
if (consultor.experiencia === 'iniciante') {
  // Simplificar linguagem
  // Explicar conceitos básicos
  // Dar passos menores
  // Mais encorajamento
}

if (consultor.experiencia === '1 ano' || consultor.experiencia === '2-3 anos') {
  // Aprofundar estratégias
  // Sugerir otimizações
  // Focar em consistência
}

if (consultor.experiencia === '3+ anos') {
  // Estratégias avançadas
  // Foco em liderança
  // Expansão de equipe
}
```

### **Por Estágio do Negócio:**

```typescript
if (consultor.estagio_negocio === 'iniciante') {
  // Foco em fundamentos
  // Ritual 2-5-10 sempre presente
  // Scripts básicos
  // Acompanhamento próximo
}

if (consultor.estagio_negocio === 'ativo') {
  // Foco em volume
  // Otimização de processos
  // Follow-up sistemático
}

if (consultor.estagio_negocio === 'produtivo') {
  // Foco em recompra
  // Desenvolvimento de carteira
  // Planejamento estratégico
}

if (consultor.estagio_negocio === 'multiplicador') {
  // Foco em equipe
  // Treinamento
  // Duplicação
}

if (consultor.estagio_negocio === 'lider') {
  // Foco em cultura
  // Expansão
  // Liderança avançada
}
```

### **Por Tempo Disponível:**

```typescript
if (consultor.tempo_disponivel_diario === '15-30 min') {
  // Sugestões pequenas e focadas
  // Apenas essenciais
  // Ritual 2-5-10 simplificado
}

if (consultor.tempo_disponivel_diario === '30-60 min') {
  // Sugestões moderadas
  // Ritual completo
  // 1-2 ações extras
}

if (consultor.tempo_disponivel_diario === '1-2h' || consultor.tempo_disponivel_diario === '2-3h') {
  // Sugestões robustas
  // Múltiplas ações
  // Planejamento incluído
}

if (consultor.tempo_disponivel_diario === '3-5h' || consultor.tempo_disponivel_diario === '5h+') {
  // Sugestões completas
  // Estratégias avançadas
  // Desenvolvimento de equipe
}
```

### **Por Desejo de Recrutar:**

```typescript
if (consultor.deseja_recrutar === false) {
  // Focar apenas em vendas
  // Não mencionar recrutamento
  // Scripts de vendas apenas
}

if (consultor.deseja_recrutar === true) {
  // Incluir scripts de recrutamento
  // Sugerir identificação de potenciais
  // Estratégias de equipe
}
```

---

## 📘 4. APLICAR TOM DE COMUNICAÇÃO

### **Sempre:**

- ✅ Objetivo
- ✅ Prático
- ✅ Inspirador leve
- ✅ Duplicável
- ✅ Com filosofia YLADA

### **Proibido:**

- ❌ Exageros
- ❌ Promessas financeiras
- ❌ Falas místicas
- ❌ Respostas longas demais (>300 palavras)
- ❌ Linguagem técnica excessiva
- ❌ Pressão ou urgência artificial

### **Exemplos de Tom:**

✅ **APROVADO:**
```
"Você cresce quando faz o que disse que faria, mesmo sem vontade. 
Hoje, foque em 2 contatos. Pequenas ações geram grandes resultados."
```

✅ **APROVADO:**
```
"Consistência não é sobre perfeição, é sobre mostrar-se todos os dias. 
Complete o Ritual 2 hoje e você já estará no caminho certo."
```

❌ **NÃO APROVADO:**
```
"Você vai ficar rico em 30 dias se seguir este método!"
```

❌ **NÃO APROVADO:**
```
"O universo está conspirando a seu favor. Apenas acredite!"
```

---

## 🧩 5. FUNÇÕES AUXILIARES NOVAS

Criar as seguintes funções em `response-generator.ts`:

### **`selecionarScriptRelevante(intencao, consultor, scripts): Script | null`**

```typescript
function selecionarScriptRelevante(
  intencao: IntencaoDetectada,
  consultor: Consultor,
  scripts: BaseConhecimento[]
): BaseConhecimento | null {
  // Filtrar por categoria baseada na intenção
  // Filtrar por estágio do consultor
  // Filtrar por tempo disponível
  // Ordenar por prioridade
  // Retornar o mais relevante
}
```

### **`ajustarTom(resposta: string, consultor: Consultor): string`**

```typescript
function ajustarTom(resposta: string, consultor: Consultor): string {
  // Ajustar linguagem conforme experiência
  // Ajustar profundidade conforme estágio
  // Ajustar extensão conforme tempo disponível
  // Retornar resposta ajustada
}
```

### **`gerarAcaoPratica(intencao: IntencaoDetectada, consultor: Consultor, planoDia?: PlanoDia): string`**

```typescript
function gerarAcaoPratica(
  intencao: IntencaoDetectada,
  consultor: Consultor,
  planoDia?: PlanoDia
): string {
  // Gerar ação prática baseada na intenção
  // Considerar microtarefas do dia se disponível
  // Considerar tempo disponível
  // Retornar ação clara e executável
}
```

### **`mensagemMotivacionalDoDia(planoDia: PlanoDia): string`**

```typescript
function mensagemMotivacionalDoDia(planoDia: PlanoDia): string {
  // Retornar mensagem do NOEL do dia
  // Ou gerar mensagem motivacional baseada no foco do dia
}
```

### **`reforcarMicrotarefaDoDia(planoDia: PlanoDia, progressoHoje: Progresso): string`**

```typescript
function reforcarMicrotarefaDoDia(
  planoDia: PlanoDia,
  progressoHoje: Progresso
): string {
  // Identificar microtarefas não completas
  // Gerar mensagem de reforço
  // Incluir motivação leve
}
```

### **`adaptarPorPerfil(resposta: string, consultor: Consultor, diagnostico?: Diagnostico): string`**

```typescript
function adaptarPorPerfil(
  resposta: string,
  consultor: Consultor,
  diagnostico?: Diagnostico
): string {
  // Adaptar resposta conforme perfil identificado
  // Incluir pontos fortes se relevante
  // Mencionar desafios se apropriado
  // Retornar resposta adaptada
}
```

### **`usarFallbackIA(mensagem: string, contexto: NoelContext): Promise<string>`**

```typescript
async function usarFallbackIA(
  mensagem: string,
  contexto: NoelContext
): Promise<string> {
  // Construir prompt completo
  // Chamar OpenAI
  // Aplicar tom e estilo
  // Garantir ação prática no final
  // Retornar resposta
}
```

---

## 🧪 6. FEW-SHOTS ESSENCIAIS

Adicionar 6 few-shots essenciais no motor do NOEL como exemplos internos:

### **1. Novato Perdido**

```typescript
const fewShotNovato = {
  input: "Não sei por onde começar. Estou perdido.",
  output: `Entendo que pode parecer muito no início. Vamos simplificar:

1. Hoje, faça apenas o Ritual 2: envie mensagem para 2 pessoas conhecidas
2. Prepare um shake e teste o sabor
3. Leia 1 script de abordagem inicial

Pequenos passos, grandes resultados. Você não precisa fazer tudo hoje. 
Comece com o essencial e vá construindo sua rotina.

Ação de hoje: Envie "Olá! Como você está?" para 2 pessoas.`
}
```

### **2. Consultor Desanimado**

```typescript
const fewShotDesanimado = {
  input: "Estou desanimado. Não está dando certo.",
  output: `Sei que pode ser desafiador. Mas você já está aqui, buscando melhorar. Isso já é um passo importante.

Lembre-se: sucesso não é linear. Cada consultor passa por momentos assim. 
O que diferencia é continuar mesmo quando não está fácil.

Vamos recomeçar pequeno:
- Complete o Ritual 2 hoje (2 contatos)
- Revise 1 script que você já conhece
- Planeje 1 ação para amanhã

Ação de hoje: Faça 1 contato. Apenas 1. Isso já é progresso.`
}
```

### **3. Líder Sem Tempo**

```typescript
const fewShotLiderSemTempo = {
  input: "Não tenho tempo. Minha agenda está lotada.",
  output: `Como líder, seu tempo é valioso. Vamos otimizar:

1. Delegue o Ritual 2 para sua equipe (eles fazem 2 contatos cada)
2. Você foca no Ritual 5: acompanhe 5 membros da equipe (5 minutos cada = 25 min)
3. Ritual 10: revise resultados da equipe (10 min)

Total: 35 minutos. Estratégico, não operacional.

Ação de hoje: Escolha 3 membros da equipe e faça um check-in rápido de 5 minutos cada.`
}
```

### **4. Dúvida Técnica**

```typescript
const fewShotDuvidaTecnica = {
  input: "Como preparo o shake? Não entendi direito.",
  output: `Vamos simplificar o preparo do shake:

1. Pegue 2 colheres (26g) do pó
2. Adicione em 250ml de leite desnatado ou água
3. Misture bem até dissolver
4. Pode adicionar frutas ou gelo se quiser
5. Consuma imediatamente

Dica: use leite para ficar mais cremoso. Água para ficar mais leve.

Ação de hoje: Prepare 1 shake agora e teste o sabor.`
}
```

### **5. Consultor Motivado**

```typescript
const fewShotMotivado = {
  input: "Estou animado! Quero acelerar meus resultados.",
  output: `Ótimo ver sua energia! Vamos canalizar isso de forma inteligente:

1. Mantenha o Ritual 2-5-10 (consistência é fundamental)
2. Adicione 1 ação extra por dia (não mais que isso)
3. Foque em qualidade sobre quantidade
4. Acompanhe seus resultados semanalmente

Lembre-se: crescimento sustentável é melhor que explosão rápida.

Ação de hoje: Complete o Ritual 2-5-10 + 1 follow-up com cliente ativo.`
}
```

### **6. Consultor que Não Recruta**

```typescript
const fewShotNaoRecruta = {
  input: "Não quero recrutar. Só quero vender.",
  output: `Perfeito! Vamos focar 100% em vendas então:

1. Ritual 2: 2 contatos de vendas
2. Ritual 5: 5 ações de vendas (apresentações, follow-ups, recompra)
3. Ritual 10: revise seus clientes ativos

Foque em:
- Recompra de clientes existentes
- Apresentação para novos leads
- Follow-up sistemático

Ação de hoje: Faça follow-up com 3 clientes que compraram há 15-20 dias.`
}
```

**Implementar esses few-shots como exemplos internos no sistema prompt da IA.**

---

## ⚙️ 7. ECONOMIA REAL DE TOKENS

O NOEL deve seguir esta ordem **obrigatória**:

### **Ordem de Prioridade:**

1. **Tentar usar scripts primeiro** (0 tokens)
   - Buscar na base de conhecimento
   - Se encontrar, usar e personalizar
   - **NÃO chamar IA**

2. **Tentar responder com dados do consultor** (0 tokens)
   - Usar diagnóstico
   - Usar plano ativo
   - Usar progresso
   - Combinar informações existentes

3. **Tentar responder com regras internas** (0 tokens)
   - Few-shots
   - Templates pré-definidos
   - Lógica condicional

4. **Só então usar IA generativa** (tokens)
   - Apenas se tudo acima falhar
   - Com prompt otimizado
   - Resposta curta

**Log de economia:**
```typescript
console.log('💰 NOEL - Economia de tokens:', {
  usou_script: !!scriptRelevante,
  usou_dados_consultor: !!contextoConsultor,
  usou_regras_internas: !!respostaTemplate,
  usou_ia: usadoIA,
  tokens_economizados: usadoIA ? 0 : 'estimado_500-1000'
})
```

---

## 📅 8. INTEGRAR NOEL AO PLANO DIÁRIO

Dentro da rota `/api/wellness/noel/responder`:

### **Identificar Dia do Plano:**

```typescript
// Se consultor tem plano ativo
if (context.planoAtivo) {
  const hoje = new Date()
  const dataInicio = new Date(context.planoAtivo.data_inicio)
  const diasDecorridos = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
  const diaAtual = diasDecorridos + 1

  // Buscar plano do dia
  const { data: planoDia } = await supabaseAdmin
    .from('wellness_planos_dias')
    .select('*')
    .eq('dia', diaAtual)
    .single()

  if (planoDia) {
    // Reforçar microtarefas
    // Reforçar rituais
    // Incluir mensagem do NOEL do dia
  }
}
```

### **Reforçar Automaticamente:**

1. **Microtarefas do dia:**
   ```typescript
   if (planoDia && progressoHoje) {
     const microtarefasPendentes = planoDia.microtarefas.filter(
       (_, index) => index >= progressoHoje.microtarefas_completadas
     )
     
     if (microtarefasPendentes.length > 0) {
       resposta += `\n\nHoje você tem ${microtarefasPendentes.length} microtarefas pendentes. Vamos completá-las?`
     }
   }
   ```

2. **Rituais:**
   ```typescript
   if (progressoHoje) {
     if (!progressoHoje.ritual_2_executado && new Date().getHours() < 12) {
       resposta += `\n\n💡 Lembrete: Ritual 2 (manhã) ainda não foi executado.`
     }
     if (!progressoHoje.ritual_5_executado && new Date().getHours() >= 12 && new Date().getHours() < 18) {
       resposta += `\n\n💡 Lembrete: Ritual 5 (tarde) ainda não foi executado.`
     }
     if (!progressoHoje.ritual_10_executado && new Date().getHours() >= 18) {
       resposta += `\n\n💡 Lembrete: Ritual 10 (noite) - Revise seu dia!`
     }
   }
   ```

3. **Metas:**
   ```typescript
   if (planoDia) {
     resposta += `\n\n🎯 Foco de hoje: ${planoDia.foco}`
   }
   ```

---

## 📣 9. PREPARAR PARA LÍDERES

Mesmo sem criar fluxos avançados agora, deixar preparado:

```typescript
if (consultor.estagio_negocio === 'lider') {
  // Tratamento básico para líderes
  // Foco em equipe e cultura
  // Sugestões de liderança
  // Sem criar rotinas avançadas ainda
}
```

**Tratamento básico:**
- Focar em desenvolvimento de equipe
- Sugerir acompanhamento de membros
- Mencionar cultura e duplicação
- Preparar para expansão futura

---

## 🧱 10. GARANTIAS FINAIS

Após implementar tudo, deve:

### **Ajustar Tipagens:**

```typescript
// Garantir que todas as funções têm tipos corretos
// Interfaces bem definidas
// Sem `any` ou tipos genéricos demais
```

### **Validar Retornos JSON:**

```typescript
// Sempre retornar JSON válido
// Tratar erros adequadamente
// Retornar estrutura consistente
```

### **Performance:**

- ✅ NOEL responde em até **2 segundos**
- ✅ Cache de consultas frequentes
- ✅ Timeout de 3s para chamadas externas
- ✅ Fallback se timeout

### **Qualidade da Resposta:**

- ✅ Sempre retorna ação prática
- ✅ Não gera texto excessivo (máx 300 palavras)
- ✅ Aderência à filosofia YLADA
- ✅ Tom consistente

---

## 🏁 ENTREGA FINAL ESPERADA

Depois de rodar esse prompt, você deve entregar:

- ✔️ **Código completo atualizado:**
  - `src/lib/noel-wellness/response-generator.ts`
  - `src/lib/noel-wellness/plano-generator.ts` (se necessário)
  - `src/app/api/wellness/noel/responder/route.ts`

- ✔️ **Todos os arquivos alterados** (lista completa)

- ✔️ **Funções novas criadas** (lista com descrição)

- ✔️ **Ajustes na arquitetura** (se houver)

- ✔️ **Resposta do NOEL funcionando perfeitamente**

- ✔️ **Logs mostrando que scripts estão sendo priorizados:**
  ```typescript
  console.log('✅ NOEL - Script usado:', scriptRelevante.titulo)
  console.log('💰 NOEL - Tokens economizados: ~800')
  ```

- ✔️ **Respostas personalizadas por consultor:**
  - Teste com iniciante
  - Teste com líder
  - Teste com pouco tempo
  - Teste com muito tempo

- ✔️ **Testes mostrando os few-shots funcionando:**
  - Novato perdido → resposta apropriada
  - Desanimado → resposta motivacional
  - Líder sem tempo → resposta otimizada
  - Dúvida técnica → resposta prática
  - Motivado → resposta de aceleração
  - Não recruta → resposta focada em vendas

---

## 🚀 RESPOSTA FINAL DO CLAUDE

Claude, após concluir tudo, responda somente com:

```
✅ NOEL INTEGRADO COM SUCESSO – PRONTO PARA TESTES.

📊 Resumo da implementação:
- Hierarquia de decisão implementada
- Personalização automática ativa
- Few-shots integrados
- Economia de tokens funcionando
- Integração com plano diário completa
- Preparado para líderes
- Performance otimizada (<2s)
- Tom e estilo consistentes

🎯 Próximos passos:
1. Testar com diferentes perfis de consultor
2. Validar economia de tokens
3. Ajustar few-shots se necessário
4. Monitorar respostas do NOEL
```

---

## 🔥 FIM DO PROMPT OPERACIONAL

**Este prompt está completo e operacional. Copie e cole EXACTAMENTE no Claude.**

