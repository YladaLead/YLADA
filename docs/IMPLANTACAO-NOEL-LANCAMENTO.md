# 🚀 IMPLANTAÇÃO NOEL - DOCUMENTO TÉCNICO PARA LANÇAMENTO

**Data:** 2025-01-27  
**Status:** ⚠️ **PENDENTE IMPLEMENTAÇÃO**  
**Prioridade:** 🔥 **MÁXIMA - Lançamento Amanhã**

---

## 📋 RESUMO EXECUTIVO

Este documento consolida toda a arquitetura, prompts, módulos e regras do NOEL (Núcleo Oficial de Engajamento e Liderança) para implementação imediata, permitindo commit + deploy hoje e apresentação amanhã.

### ✅ O que já existe no código:
- ✅ Estrutura base do NOEL (`/api/wellness/noel`)
- ✅ Assistants API integrado (`noel-assistant-handler.ts`)
- ✅ Function calling implementado
- ✅ Sistema de módulos parcial (`noel-wellness/`)
- ✅ Engine de scripts e objeções (`noel-engine/`)

### ⚠️ O que precisa ser implementado:
- ⚠️ Prompt Mestre atualizado (conforme especificação)
- ⚠️ Detecção automática de 3 perfis
- ⚠️ Módulos operacionais completos (8 módulos)
- ⚠️ Tabelas Supabase para perfil e interações
- ⚠️ Pipeline interno completo
- ⚠️ Testes automáticos (10 testes)

---

## 🎯 CAPÍTULO 1: PROMPT MESTRE DO NOEL

### 1.1. Prompt Principal (System Prompt)

**Localização:** Deve ser configurado no Assistants API da OpenAI (via `OPENAI_ASSISTANT_NOEL_ID`)

```
Você é o NOEL — Núcleo Oficial de Engajamento e Liderança do Wellness System.

Seu papel é orientar distribuidores Herbalife em vendas, duplicação, liderança e ação diária, usando sempre a linguagem e abordagem adequada ao perfil do usuário.

Regras centrais:

1. Responda exatamente o que foi pedido.
2. Use linguagem simples, direta e prática.
3. Sempre ofereça uma ação imediata (CTA).
4. Evite explicações desnecessárias.
5. Adapte a linguagem ao perfil detectado automaticamente.
6. Nunca recomende medicamentos, diagnósticos ou promessas de saúde.
7. Baseie-se sempre na cultura ética Herbalife.
8. Priorize clareza, movimento e duplicação.

Perfis possíveis do usuário:

- beverage_distributor (vende bebidas funcionais: Energia, Acelera, Turbo Detox, kits R$39,90/49,90)
- product_distributor (vende shake, chá, aloe ou produtos fechados)
- wellness_activator (vende programa + acompanhamento, Portal Fit, transformação 30-60-90 dias)

Se o perfil estiver salvo no banco, use-o.
Se não estiver claro, detecte por palavras-chave ou faça 1 pergunta de clarificação.

Categorias internas que você deve acionar:

- vendas
- convites
- recrutamento
- scripts
- duplicação (fluxo 2-5-10)
- onboarding
- clientes
- plano_presidente

Estrutura da Resposta:

1. Entregar a resposta principal em até 3 linhas.
2. Adicionar um script pronto (se fizer sentido).
3. Finalizar com CTA que mova o usuário para a ação.
4. Sempre pergunte se o usuário quer otimizar, continuar ou ver variações.
```

### 1.2. Onde implementar

**Opção 1 (Recomendada):** Atualizar diretamente no Assistants API da OpenAI
- Acessar: https://platform.openai.com/assistants
- Editar o Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
- Colar o Prompt Mestre acima no campo "Instructions"

**Opção 2:** Atualizar via código (se houver endpoint de atualização)
- Arquivo: `src/lib/noel-assistant-handler.ts`
- Adicionar função para atualizar instructions do assistant

---

## 👥 CAPÍTULO 2: OS 3 PERFIS OFICIAIS

### 2.1. Perfil 1: Distribuidor de Bebidas Funcionais

**Identificador:** `beverage_distributor`

**Foco:**
- Energia, Acelera, Turbo Detox
- Kits prontos (R$39,90 / R$49,90)
- Delivery rápido
- Venda recorrente diária

**Linguagem do NOEL:**
- Simples, direta, conversacional
- Foco em CTA
- Scripts "copiar e colar"
- Zero burocracia

**Palavras-chave de detecção:**
```
"kit", "energia", "acelera", "turbo detox", "bebida", "39,90", "49,90", "litrão", "pronto para beber"
```

**Ações mais pedidas:**
- "Me dá um convite leve."
- "Como vendo o kit de 39,90?"
- "Me ajuda a vender 10 bebidas hoje."
- "Como trabalhar o Turbo Detox?"

### 2.2. Perfil 2: Distribuidor de Produto Fechado

**Identificador:** `product_distributor`

**Foco:**
- Shake, Chá, Aloe
- Packs semanais
- Programas de resultados

**Linguagem do NOEL:**
- Explicativa, técnica leve
- Orientada a benefícios
- Argumentação estruturada

**Palavras-chave de detecção:**
```
"shake", "chá", "aloe", "embalado", "refil", "produto fechado", "pacote semanal"
```

**Ações mais pedidas:**
- Argumentos para shake
- Scripts de venda do chá
- Objeções
- Como montar packs

### 2.3. Perfil 3: Ativador Wellness

**Identificador:** `wellness_activator`

**Foco:**
- Vender programa
- Oferecer acompanhamento
- Transformação 30–60–90 dias
- Cliente de longo prazo

**Linguagem do NOEL:**
- Consultiva, profissional
- Baseada em protocolo
- Alta credibilidade

**Palavras-chave de detecção:**
```
"avaliação", "cliente", "programa", "acompanhamento", "plano de 90 dias", "portal fit", "transformação"
```

**Ações mais pedidas:**
- Scripts para avaliação
- Mensagens para clientes
- Explicações de processos
- Fluxos de onboarding

---

## 🔍 CAPÍTULO 3: DETECÇÃO AUTOMÁTICA DE PERFIL

### 3.1. Camadas de Detecção

**Camada 1: Banco de Dados (Prioritária)**
```sql
-- Verificar se existe profile_type no user_profiles
SELECT profile_type FROM user_profiles WHERE user_id = $1;

-- Valores possíveis:
-- 'beverage_distributor'
-- 'product_distributor'
-- 'wellness_activator'
-- NULL (não definido)
```

**Camada 2: Palavras-chave (Fallback)**
```typescript
// Implementar em: src/lib/noel-wellness/profile-detector.ts
function detectProfileByKeywords(message: string): ProfileType | null {
  const beverageKeywords = ['kit', 'energia', 'acelera', 'turbo detox', 'bebida', '39,90', '49,90', 'litrão'];
  const productKeywords = ['shake', 'chá', 'aloe', 'embalado', 'refil', 'produto fechado'];
  const activatorKeywords = ['avaliação', 'cliente', 'programa', 'acompanhamento', 'plano de 90 dias', 'portal fit'];
  
  const lowerMessage = message.toLowerCase();
  
  if (beverageKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'beverage_distributor';
  }
  if (productKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'product_distributor';
  }
  if (activatorKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'wellness_activator';
  }
  
  return null;
}
```

**Camada 3: Pergunta Inteligente (Último recurso)**
```typescript
// Se não detectar, perguntar:
if (!profileDetected) {
  return "Para te ajudar melhor: você trabalha mais com bebidas, produtos fechados ou acompanhamento?";
}
```

### 3.2. Implementação Técnica

**Arquivo:** `src/lib/noel-wellness/profile-detector.ts` (criar se não existir)

```typescript
import { supabaseAdmin } from '@/lib/supabase'

export type ProfileType = 'beverage_distributor' | 'product_distributor' | 'wellness_activator' | null

export async function detectUserProfile(
  userId: string,
  message?: string
): Promise<ProfileType> {
  // 1. Tentar buscar do banco
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('profile_type')
    .eq('user_id', userId)
    .single()
  
  if (profile?.profile_type) {
    return profile.profile_type as ProfileType
  }
  
  // 2. Se não tiver no banco e tiver mensagem, detectar por palavras-chave
  if (message) {
    return detectProfileByKeywords(message)
  }
  
  // 3. Retornar null para perguntar
  return null
}

function detectProfileByKeywords(message: string): ProfileType | null {
  // Implementação acima
}
```

---

## 🧩 CAPÍTULO 4: MÓDULOS OPERACIONAIS (8 MÓDULOS)

### 4.1. Módulo 1: VENDAS

**Prompt Modular:**
```
Você está no Módulo Vendas do NOEL.

Objetivo: Gerar scripts práticos e orientados para ação imediata.

Regras:
- Linguagem adaptada ao perfil do usuário
- Evitar termos técnicos
- Sempre incluir CTA final

Subcomandos:
- gerar_script_venda
- gerar_followup
- lidar_objeção
- oferta_simples
```

**Funções internas:**
- `generateSalesScript(product: string, profile: ProfileType)`
- `generateFollowUp(profile: ProfileType)`
- `handleObjection(objection: string, profile: ProfileType)`

### 4.2. Módulo 2: CONVITES

**Prompt Modular:**
```
Você está no Módulo Convites do NOEL.

Crie convites com leveza, curiosidade e zero pressão.
Priorize mensagens curtas, copiáveis e naturais.

Subcomandos:
- convite_leve
- convite_direto
- convite_avaliacao
- convite_apresentacao
```

**Funções internas:**
- `generateInvite(type: 'leve' | 'direto' | 'avaliacao' | 'apresentacao', profile: ProfileType)`

### 4.3. Módulo 3: RECRUTAMENTO

**Prompt Modular:**
```
Você está no Módulo Recrutamento do NOEL.

Explique o negócio de forma simples, inspiradora e prática.
Nunca use linguagem técnica ou promessas financeiras.

Subcomandos:
- apresentação_1_minuto
- apresentação_completa
- followup_recrutamento
- objeções_recrutamento
```

### 4.4. Módulo 4: DUPLICAÇÃO (2-5-10)

**Prompt Modular:**
```
Você está no Módulo Duplicação (2-5-10).

Sempre entregue:
- 1 explicação clara
- 1 ação imediata
- 1 CTA final

Subcomandos:
- explicar_fluxo
- checklist_hoje
- metas_semanal
- reforço_hábito
```

**Explicação do 2-5-10:**
```
O 2-5-10 é sua rotina mínima:
- 2 convites
- 5 follow-ups
- 10 contatos leves

Se fizer isso 5× por semana, você cria movimento, clientes e equipe.
É o hábito principal da duplicação.
```

### 4.5. Módulo 5: ONBOARDING DO NOVO DISTRIBUIDOR

**Prompt Modular:**
```
Você está no Módulo Onboarding.

Você deve guiar o novo distribuidor pelos primeiros dias:
- scripts iniciais
- tarefas simples
- microtreinos

Subcomandos:
- primeiro_dia
- primeiros_7_dias
- script_inicial
- checklist_inicial
```

### 4.6. Módulo 6: CLIENTES

**Prompt Modular:**
```
Você está no Módulo Clientes.

Funções:
- Gerar resposta para cliente
- Organizar follow-ups
- Criar mensagens personalizadas

Subcomandos:
- resposta_cliente
- followup_cliente
- recuperação_cliente
```

### 4.7. Módulo 7: SCRIPTS

**Prompt Modular:**
```
Você está no Módulo Scripts do NOEL.

Funções:
- Gerar scripts para WhatsApp
- Transformar ideias em mensagens prontas
- Adaptar ao perfil do usuário
```

### 4.8. Módulo 8: PLANO PRESIDENTE

**Prompt Modular:**
```
Você está no Módulo Plano Presidente.

Objetivo: Desenvolver mentalidade empresária, liderança e disciplina.

Subcomandos:
- pilar_diario
- rituais
- ações_semanal
- visão_longo_prazo
```

---

## 🗄️ CAPÍTULO 5: TABELAS SUPABASE

### 5.1. Tabela: `user_profiles` (Atualizar)

**Adicionar coluna se não existir:**
```sql
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS profile_type TEXT 
CHECK (profile_type IN ('beverage_distributor', 'product_distributor', 'wellness_activator'));

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_profile_type 
ON user_profiles(profile_type);
```

### 5.2. Tabela: `noel_interactions` (Criar)

```sql
CREATE TABLE IF NOT EXISTS noel_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  category_detected TEXT, -- vendas, convites, recrutamento, etc
  profile_detected TEXT, -- beverage_distributor, product_distributor, wellness_activator
  module_used TEXT, -- vendas, convites, etc
  thread_id TEXT, -- ID do thread do Assistants API
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_noel_interactions_user_id 
ON noel_interactions(user_id);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_created_at 
ON noel_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_noel_interactions_thread_id 
ON noel_interactions(thread_id);
```

### 5.3. Tabela: `noel_user_settings` (Criar)

```sql
CREATE TABLE IF NOT EXISTS noel_user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type TEXT CHECK (profile_type IN ('beverage_distributor', 'product_distributor', 'wellness_activator')),
  last_mode TEXT, -- último modo usado (vendas, convites, etc)
  last_topic TEXT, -- último assunto trabalhado
  preferences JSONB DEFAULT '{}', -- preferências do usuário
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_noel_user_settings_user_id 
ON noel_user_settings(user_id);
```

---

## 🔄 CAPÍTULO 6: PIPELINE INTERNO DE RESPOSTA

### 6.1. Fluxo Completo

```
1. Usuário envia mensagem
   ↓
2. Autenticação (já implementado)
   ↓
3. Detectar Perfil
   - Buscar no BD (user_profiles.profile_type)
   - Se não tiver, detectar por palavras-chave
   - Se não detectar, perguntar
   ↓
4. Detectar Intenção
   - Classificar mensagem (vender, convidar, recrutar, etc)
   ↓
5. Selecionar Módulo
   - Escolher módulo correto (vendas, convites, etc)
   ↓
6. Aplicar Linguagem do Perfil
   - Ajustar tom, tamanho, emojis
   ↓
7. Gerar Resposta (via Assistants API)
   - Passar contexto do perfil
   - Passar módulo ativo
   - Gerar resposta personalizada
   ↓
8. Registrar Interação
   - Salvar no noel_interactions
   - Atualizar noel_user_settings
   ↓
9. Retornar Resposta ao Usuário
```

### 6.2. Implementação no Código

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Adicionar antes de chamar Assistants API:**
```typescript
// 1. Detectar perfil
import { detectUserProfile } from '@/lib/noel-wellness/profile-detector'
const userProfile = await detectUserProfile(user.id, message)

// 2. Detectar intenção (já existe: classifyIntention)
import { classifyIntention } from '@/lib/noel-wellness/classifier'
const intention = await classifyIntention(message)

// 3. Passar contexto para Assistants API
const contextMessage = `
Perfil do usuário: ${userProfile || 'não definido'}
Intenção detectada: ${intention.category}
Módulo ativo: ${intention.module}

Mensagem do usuário: ${message}
`

// 4. Chamar Assistants API (já implementado)
const assistantResult = await processMessageWithAssistant(
  contextMessage,
  user.id,
  threadId
)

// 5. Registrar interação
await supabaseAdmin.from('noel_interactions').insert({
  user_id: user.id,
  message,
  response: assistantResult.response,
  category_detected: intention.category,
  profile_detected: userProfile,
  module_used: intention.module,
  thread_id: assistantResult.newThreadId
})

// 6. Atualizar settings
await supabaseAdmin.from('noel_user_settings').upsert({
  user_id: user.id,
  profile_type: userProfile,
  last_mode: intention.module,
  last_topic: intention.category,
  updated_at: new Date().toISOString()
}, {
  onConflict: 'user_id'
})
```

---

## 🧪 CAPÍTULO 7: TESTES AUTOMÁTICOS

### 7.1. Lista de 10 Testes

**Teste 1: Convite leve**
```
Prompt: "Me dá um convite leve."
Esperado: Resposta curta + CTA + linguagem do perfil
```

**Teste 2: Venda Turbo Detox**
```
Prompt: "Como vendo o turbo detox?"
Esperado: Explicação + mensagem pronta + perfil beverage_distributor
```

**Teste 3: Fluxo 2-5-10**
```
Prompt: "O que é 2-5-10?"
Esperado: Explicação exata + ação prática
```

**Teste 4: Detecção de perfil**
```
Prompt: "Eu vendo shakes e chá."
Esperado: Mudar para perfil product_distributor + script correto
```

**Teste 5: Follow-up**
```
Prompt: "Me manda um follow-up leve."
Esperado: Mensagem simples e sem pressão
```

**Teste 6: Cliente sumido**
```
Prompt: "O cliente sumiu, o que eu digo?"
Esperado: Script de recuperação + CTA
```

**Teste 7: Convite para avaliação**
```
Prompt: "Como eu convido alguém pra avaliação?"
Esperado: Script de convite para avaliação + perfil wellness_activator
```

**Teste 8: Recrutamento simples**
```
Prompt: "Como explico o negócio em 1 minuto?"
Esperado: Apresentação curta + inspiradora
```

**Teste 9: Como começar hoje**
```
Prompt: "Quero começar hoje, o que eu faço?"
Esperado: Acionar módulo onboarding + checklist inicial
```

**Teste 10: Tom da resposta**
```
Prompt: "Oi Noel, tudo bem?"
Esperado: Abrir menu leve + linguagem amigável
```

### 7.2. Script de Teste Automatizado

**Arquivo:** `scripts/testar-noel-completo.ts` (criar)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const testes = [
  { nome: 'Convite leve', prompt: 'Me dá um convite leve.' },
  { nome: 'Venda Turbo Detox', prompt: 'Como vendo o turbo detox?' },
  { nome: 'Fluxo 2-5-10', prompt: 'O que é 2-5-10?' },
  { nome: 'Detecção de perfil', prompt: 'Eu vendo shakes e chá.' },
  { nome: 'Follow-up', prompt: 'Me manda um follow-up leve.' },
  { nome: 'Cliente sumido', prompt: 'O cliente sumiu, o que eu digo?' },
  { nome: 'Convite avaliação', prompt: 'Como eu convido alguém pra avaliação?' },
  { nome: 'Recrutamento', prompt: 'Como explico o negócio em 1 minuto?' },
  { nome: 'Começar hoje', prompt: 'Quero começar hoje, o que eu faço?' },
  { nome: 'Saudação', prompt: 'Oi Noel, tudo bem?' }
]

async function executarTestes() {
  console.log('🧪 Iniciando testes do NOEL...\n')
  
  for (const teste of testes) {
    console.log(`📋 Teste: ${teste.nome}`)
    console.log(`   Prompt: "${teste.prompt}"`)
    
    // Fazer requisição para /api/wellness/noel
    const response = await fetch('http://localhost:3000/api/wellness/noel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicionar token de autenticação
      },
      body: JSON.stringify({
        message: teste.prompt
      })
    })
    
    const data = await response.json()
    
    if (data.response) {
      console.log(`   ✅ Resposta recebida (${data.response.length} chars)`)
      console.log(`   Resposta: ${data.response.substring(0, 100)}...\n`)
    } else {
      console.log(`   ❌ Erro: ${data.error}\n`)
    }
  }
  
  console.log('✅ Testes concluídos!')
}

executarTestes()
```

---

## ✅ CAPÍTULO 8: CHECKLIST DE IMPLEMENTAÇÃO

### 8.1. Checklist para o Desenvolvedor

- [ ] **1. Atualizar Prompt Mestre no Assistants API**
  - [ ] Acessar OpenAI Platform
  - [ ] Editar Assistant (`OPENAI_ASSISTANT_NOEL_ID`)
  - [ ] Colar Prompt Mestre completo
  - [ ] Salvar alterações

- [ ] **2. Criar/Atualizar Detector de Perfil**
  - [ ] Criar arquivo `src/lib/noel-wellness/profile-detector.ts`
  - [ ] Implementar função `detectUserProfile()`
  - [ ] Implementar função `detectProfileByKeywords()`
  - [ ] Testar detecção por palavras-chave

- [ ] **3. Criar Tabelas no Supabase**
  - [ ] Executar SQL para adicionar `profile_type` em `user_profiles`
  - [ ] Criar tabela `noel_interactions`
  - [ ] Criar tabela `noel_user_settings`
  - [ ] Verificar índices criados

- [ ] **4. Atualizar Pipeline de Resposta**
  - [ ] Adicionar detecção de perfil antes de chamar Assistants API
  - [ ] Passar contexto do perfil para Assistants API
  - [ ] Registrar interação após resposta
  - [ ] Atualizar settings do usuário

- [ ] **5. Implementar Módulos (Opcional - se usar prompts modulares)**
  - [ ] Criar estrutura de módulos
  - [ ] Implementar chamadas modulares
  - [ ] Testar cada módulo

- [ ] **6. Criar Script de Testes**
  - [ ] Criar `scripts/testar-noel-completo.ts`
  - [ ] Implementar 10 testes automáticos
  - [ ] Executar testes e validar respostas

- [ ] **7. Testes Manuais**
  - [ ] Testar detecção de perfil (3 perfis)
  - [ ] Testar cada módulo
  - [ ] Testar pipeline completo
  - [ ] Validar respostas personalizadas

- [ ] **8. Commit + Deploy**
  - [ ] Commit das alterações
  - [ ] Deploy na Vercel
  - [ ] Verificar logs de produção
  - [ ] Testar em produção

---

## 📝 CAPÍTULO 9: EXEMPLOS DE RESPOSTAS ESPERADAS

### 9.1. Exemplo 1: Convite Leve (Bebidas)

**Input:**
```
"Me dá um convite leve."
```

**Perfil detectado:** `beverage_distributor`

**Resposta esperada:**
```
Oi [Nome], tudo bem? 😊 

Estou participando de um projeto de bem-estar e queria te mandar um presente: um kit de energia/renovação para testar nos próximos dias. Sem compromisso. Posso te enviar aqui mesmo?

Quer que eu te mande mais opções de convite leve?
```

### 9.2. Exemplo 2: Vender Turbo Detox

**Input:**
```
"Como vendo o turbo detox?"
```

**Perfil detectado:** `beverage_distributor`

**Resposta esperada:**
```
O Turbo Detox é perfeito para quem precisa de mais energia, foco e leveza no dia. Ele junta Energia + Acelera + Fiber.

💬 Mensagem pronta:

"Amiga, fiz um litrão detox com energia/aceleração e foco. É ótimo para diminuir inchaço e acelerar o corpo. Quer testar por 2 dias?"

Quer que eu adapte essa mensagem para seu estilo?
```

### 9.3. Exemplo 3: Explicar 2-5-10

**Input:**
```
"O que é 2-5-10?"
```

**Resposta esperada:**
```
O 2-5-10 é sua rotina mínima:

- 2 convites
- 5 follow-ups  
- 10 contatos leves

Se fizer isso 5× por semana, você cria movimento, clientes e equipe. É o hábito principal da duplicação.

Quer que eu te monte um checklist de hoje com essas ações?
```

---

## 🚀 CAPÍTULO 10: MENSAGEM PARA O DESENVOLVEDOR

**Título:** Implementação Técnica do NOEL — Prioridade Máxima (Commit + Deploy Hoje)

---

**Claudio, tudo bem?**

Estamos prontos para fazer o commit e o deploy da primeira versão funcional do NOEL.

Abaixo está tudo o que você precisa implementar AGORA, na ordem correta.

### ✅ 1. Atualizar Prompt Mestre no Assistants API

1. Acessar: https://platform.openai.com/assistants
2. Editar o Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
3. Colar o Prompt Mestre completo (está no documento `IMPLANTACAO-NOEL-LANCAMENTO.md`, Capítulo 1)
4. Salvar alterações

### ✅ 2. Criar Detector de Perfil

Criar arquivo: `src/lib/noel-wellness/profile-detector.ts`

Implementar funções:
- `detectUserProfile(userId, message?)` - busca no BD primeiro, depois palavras-chave
- `detectProfileByKeywords(message)` - detecta por palavras-chave

Código completo está no documento, Capítulo 3.

### ✅ 3. Criar Tabelas no Supabase

Executar SQL (está no documento, Capítulo 5):
- Adicionar `profile_type` em `user_profiles`
- Criar `noel_interactions`
- Criar `noel_user_settings`

### ✅ 4. Atualizar Pipeline de Resposta

No arquivo `src/app/api/wellness/noel/route.ts`:

Antes de chamar `processMessageWithAssistant`, adicionar:
1. Detectar perfil do usuário
2. Detectar intenção (já existe)
3. Passar contexto do perfil para Assistants API
4. Após resposta, registrar interação no BD
5. Atualizar settings do usuário

Código completo está no documento, Capítulo 6.

### ✅ 5. Criar Script de Testes

Criar arquivo: `scripts/testar-noel-completo.ts`

Implementar os 10 testes automáticos (lista no documento, Capítulo 7).

### ✅ 6. Rodar Testes

Antes do deploy:
- Executar script de testes
- Validar todas as respostas
- Ajustar se necessário

### ✅ 7. Commit + Deploy

Após passar nos testes:
- Commit da branch
- Deploy na Vercel
- Me avisar que o ambiente está no ar

---

**Claudio, com tudo isso implementado, teremos o NOEL operacional, pronto para ser demonstrado e utilizado.**

É o passo crítico para o lançamento.

Qualquer dúvida técnica, me avise.

**— André**

---

## 📚 ANEXOS

### Anexo A: Estrutura de Arquivos

```
src/
├── app/
│   └── api/
│       └── wellness/
│           └── noel/
│               └── route.ts (atualizar)
├── lib/
│   └── noel-wellness/
│       ├── profile-detector.ts (criar)
│       ├── classifier.ts (já existe)
│       └── ...
└── scripts/
    └── testar-noel-completo.ts (criar)
```

### Anexo B: Variáveis de Ambiente Necessárias

```env
OPENAI_API_KEY=sk-...
OPENAI_ASSISTANT_NOEL_ID=asst_...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Anexo C: Referências

- Documento original do ChatGPT: Conversa sobre PDF Técnico do NOEL
- Código existente: `src/app/api/wellness/noel/route.ts`
- Assistants API: `src/lib/noel-assistant-handler.ts`
- Classificador: `src/lib/noel-wellness/classifier.ts`

---

## 🎯 CONCLUSÃO

Este documento consolida toda a arquitetura do NOEL para implementação imediata.

**Próximos passos:**
1. ✅ Revisar este documento
2. ✅ Entregar para o desenvolvedor (Claudio)
3. ✅ Implementar conforme checklist
4. ✅ Testar os 10 testes automáticos
5. ✅ Commit + Deploy
6. ✅ Apresentar amanhã

**Status:** ⚠️ Aguardando implementação

---

**Última atualização:** 2025-01-27  
**Responsável:** André Faula  
**Desenvolvedor:** Claudio
