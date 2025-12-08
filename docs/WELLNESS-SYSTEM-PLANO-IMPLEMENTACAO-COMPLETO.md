# 🎯 WELLNESS SYSTEM - PLANO DE IMPLEMENTAÇÃO COMPLETO

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Arquitetura Técnica](#arquitetura-técnica)
4. [Sistema NOEL - Componentes](#sistema-noel---componentes)
5. [Scripts e Objeções](#scripts-e-objeções)
6. [Regras Fundamentais](#regras-fundamentais)
7. [Fases de Implementação](#fases-de-implementação)
8. [Checklist de Validação](#checklist-de-validação)

---

## 🎯 VISÃO GERAL

### Objetivo
Implementar o **WELLNESS SYSTEM** completo, incluindo:
- Sistema de banco de dados estruturado
- Motor de resposta do NOEL (IA Mentor)
- Biblioteca completa de scripts e objeções
- Regras de negócio fundamentais
- Integração com ferramentas existentes

### Princípios Fundamentais
1. **Premium Light Copy**: Tom leve, humano, sem pressão
2. **Duplicação Total**: Qualquer distribuidor consegue replicar
3. **Microações**: Passos pequenos e possíveis
4. **Constância Leve**: Mais importante que intensidade
5. **Regra de Ouro**: Nunca mencionar PV para novos prospects

---

## 🗄️ ESTRUTURA DE DADOS

### Tabelas Principais

#### 1. `wellness_scripts`
Armazena todos os scripts do NOEL organizados por categoria.

```sql
CREATE TABLE wellness_scripts (
  id UUID PRIMARY KEY,
  categoria VARCHAR(50), -- 'tipo_pessoa', 'objetivo', 'etapa', 'acompanhamento', 'reativacao', 'recrutamento', 'interno'
  subcategoria VARCHAR(100), -- 'pessoas_proximas', 'energia', 'abertura', '7_dias', etc.
  nome VARCHAR(255), -- 'Abertura leve', 'Curiosidade energia', etc.
  versao VARCHAR(20), -- 'curta', 'media', 'longa', 'gatilho', 'se_some', 'se_negativa', 'upgrade'
  conteudo TEXT NOT NULL,
  tags TEXT[], -- ['energia', 'kit', 'turbo', 'hype']
  ordem INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 2. `wellness_objecoes`
Armazena todas as objeções e suas respostas.

```sql
CREATE TABLE wellness_objecoes (
  id UUID PRIMARY KEY,
  categoria VARCHAR(50), -- 'clientes', 'clientes_recorrentes', 'recrutamento', 'distribuidores', 'avancadas'
  codigo VARCHAR(20), -- 'A.1', 'B.2', 'C.3', etc.
  objeção TEXT NOT NULL, -- "Está caro"
  versao_curta TEXT,
  versao_media TEXT,
  versao_longa TEXT,
  gatilho_retomada TEXT,
  resposta_se_some TEXT,
  resposta_se_negativa TEXT,
  upgrade TEXT,
  tags TEXT[],
  ordem INTEGER,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 3. `wellness_noel_config`
Configurações do comportamento do NOEL.

```sql
CREATE TABLE wellness_noel_config (
  id UUID PRIMARY KEY,
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMP
);
```

#### 4. `wellness_consultant_interactions`
Registra todas as interações do distribuidor com o NOEL.

```sql
CREATE TABLE wellness_consultant_interactions (
  id UUID PRIMARY KEY,
  consultant_id UUID REFERENCES auth.users(id),
  tipo_interacao VARCHAR(50), -- 'pergunta', 'solicitacao_script', 'objeção', 'feedback'
  contexto JSONB, -- { pessoa_tipo, objetivo, etapa, etc. }
  mensagem_usuario TEXT,
  resposta_noel TEXT,
  script_usado_id UUID REFERENCES wellness_scripts(id),
  objeção_tratada_id UUID REFERENCES wellness_objecoes(id),
  satisfacao INTEGER, -- 1-5
  created_at TIMESTAMP
);
```

#### 5. `wellness_client_profiles`
Perfis de clientes para personalização.

```sql
CREATE TABLE wellness_client_profiles (
  id UUID PRIMARY KEY,
  consultant_id UUID REFERENCES auth.users(id),
  cliente_nome VARCHAR(255),
  cliente_contato VARCHAR(255),
  tipo_pessoa VARCHAR(50), -- 'proximo', 'indicacao', 'instagram', 'mercado_frio'
  objetivo_principal VARCHAR(50), -- 'energia', 'metabolismo', 'retencao', 'foco', 'emagrecimento'
  status VARCHAR(50), -- 'lead', 'cliente_kit', 'cliente_recorrente', 'inativo', 'reativado'
  ultima_interacao TIMESTAMP,
  proxima_acao TEXT,
  historico JSONB, -- Array de interações
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 6. `wellness_recruitment_prospects`
Prospects de recrutamento.

```sql
CREATE TABLE wellness_recruitment_prospects (
  id UUID PRIMARY KEY,
  consultant_id UUID REFERENCES auth.users(id),
  prospect_nome VARCHAR(255),
  prospect_contato VARCHAR(255),
  origem VARCHAR(50), -- 'cliente', 'indicacao', 'instagram', 'hom'
  interesse VARCHAR(50), -- 'renda_extra', 'tempo_livre', 'bem_estar', 'proposito'
  etapa VARCHAR(50), -- 'semente', 'abertura', 'pre_diagnostico', 'hom', 'pos_hom', 'fechamento'
  status VARCHAR(50), -- 'ativo', 'pausado', 'convertido', 'desistiu'
  observacoes TEXT,
  historico JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🏗️ ARQUITETURA TÉCNICA

### Módulos Principais

#### 1. `/src/lib/wellness-system/noel-engine/`
Motor principal do NOEL.

```
noel-engine/
├── index.ts              # Export principal
├── core/
│   ├── persona.ts        # Identidade e persona do NOEL
│   ├── mission.ts        # Missão central
│   ├── rules.ts          # Princípios e regras
│   └── reasoning.ts      # Processo de raciocínio
├── modes/
│   ├── operation-modes.ts # 10 modos de operação
│   └── mode-selector.ts  # Seleção inteligente de modo
├── scripts/
│   ├── script-engine.ts  # Motor de scripts
│   ├── script-selector.ts # Seleção contextual
│   └── script-adaptor.ts # Adaptação personalizada
├── objections/
│   ├── objection-handler.ts # Tratamento de objeções
│   └── objection-matcher.ts # Matching inteligente
└── response/
    ├── response-builder.ts # Construção de resposta
    └── response-formatter.ts # Formatação final
```

#### 2. `/src/app/api/wellness/noel/`
API endpoints do NOEL.

```
api/wellness/noel/
├── route.ts              # Endpoint principal
├── scripts/
│   ├── route.ts          # GET /api/wellness/noel/scripts
│   └── [id]/route.ts     # GET /api/wellness/noel/scripts/[id]
├── objections/
│   ├── route.ts          # GET /api/wellness/noel/objections
│   └── [id]/route.ts     # GET /api/wellness/noel/objections/[id]
└── interactions/
    └── route.ts          # POST /api/wellness/noel/interactions
```

#### 3. `/src/components/wellness-system/`
Componentes React.

```
components/wellness-system/
├── NoelChatInterface.tsx # Interface de chat
├── ScriptSelector.tsx     # Seletor de scripts
├── ObjectionHandler.tsx   # Handler de objeções
└── ClientProfileCard.tsx  # Card de perfil de cliente
```

---

## 🤖 SISTEMA NOEL - COMPONENTES

### 1. Persona e Identidade
- **Arquivo**: `src/lib/wellness-system/noel-engine/core/persona.ts`
- **Conteúdo**: Baseado na Lousa 1 (já implementado parcialmente)
- **Status**: ✅ Parcialmente implementado

### 2. Modos de Operação
- **Arquivo**: `src/lib/wellness-system/noel-engine/modes/operation-modes.ts`
- **10 Modos**:
  1. Venda
  2. Upsell
  3. Reativação
  4. Recrutamento
  5. Acompanhamento
  6. Treinamento
  7. Suporte
  8. Diagnóstico
  9. Personalização
  10. Emergência

### 3. Motor de Scripts
- **Arquivo**: `src/lib/wellness-system/noel-engine/scripts/script-engine.ts`
- **Funcionalidades**:
  - Seleção contextual de scripts
  - Adaptação por tipo de pessoa
  - Adaptação por objetivo
  - Adaptação por etapa da conversa
  - Versões (curta, média, longa)

### 4. Tratamento de Objeções
- **Arquivo**: `src/lib/wellness-system/noel-engine/objections/objection-handler.ts`
- **Funcionalidades**:
  - Detecção de objeções
  - Matching inteligente
  - Seleção de versão apropriada
  - Gatilhos de retomada
  - Respostas condicionais

### 5. Construção de Resposta
- **Arquivo**: `src/lib/wellness-system/noel-engine/response/response-builder.ts`
- **Estrutura Padrão**:
  1. Acolhimento
  2. Contexto
  3. Ação prática
  4. Script sugerido
  5. Reforço emocional
  6. Próximo passo

---

## 📝 SCRIPTS E OBJEÇÕES

### Categorias de Scripts

#### GRUPO 1: Por Tipo de Pessoa
- Pessoas Próximas
- Indicações
- Instagram
- Mercado Frio
- Clientes Ativos
- Clientes Sumidos
- Leads das Ferramentas
- Interessados no Negócio

#### GRUPO 2: Por Objetivo do Cliente
- Energia
- Metabolismo/Aceleração
- Retenção/Inchaço
- Foco
- Emagrecimento
- Rotina

#### GRUPO 3: Por Etapa da Conversa
- Abertura
- Criação de Curiosidade
- Diagnóstico
- Proposta
- Fechamento
- Acompanhamento
- Conclusão

#### GRUPO 4: Acompanhamento Avançado
- 7 dias
- 14 dias
- 30 dias

#### GRUPO 5: Reativação Profunda
- Clientes que compraram 1 vez
- Clientes que fizeram 7-14-30 dias
- Pessoas que mostraram interesse
- Leads de meses anteriores
- Pessoas que participaram da HOM
- Ex-distribuidores
- Quase fecharam
- "Vou pensar"
- Desapareceu sem explicar

#### GRUPO 6: Recrutamento
- Sementes de curiosidade
- Aberturas leves
- Pré-diagnóstico
- Convite para HOM
- Pós-HOM
- Fechamento leve

#### GRUPO 7: Scripts Internos
- Respostas-base
- Apoio emocional
- Orientações técnicas
- Correção suave
- Direcionamentos estratégicos
- Ativação e produtividade

### Categorias de Objeções

#### CATEGORIA 1: Objeções de Clientes (Kit/Turbo/Hype)
- A.1 a A.10 (10 objeções)

#### CATEGORIA 2: Objeções de Clientes Recorrentes (PV 50/75/100)
- B.1 a B.6 (6 objeções)

#### CATEGORIA 3: Objeções de Recrutamento
- C.1 a C.10 (10 objeções)

#### CATEGORIA 4: Objeções de Distribuidores
- D.1 a D.10 (10 objeções)

#### CATEGORIA 5: Objeções Avançadas
- E.1 a E.28 (28 objeções)

**Total**: 64 objeções com múltiplas versões cada

---

## ⚠️ REGRAS FUNDAMENTAIS

### Regra de Ouro: Recrutamento
**NUNCA mencionar PV para novos prospects.**

**Foco em**:
- Resultado financeiro (renda extra)
- Tempo livre
- Interesse principal da pessoa

**Quando mencionar PV**:
- Apenas quando o distribuidor já está confortável
- Como consequência natural: "Esse tipo de resultado normalmente gera X pontos"
- Preferencialmente após conversas sobre resultados

### Princípios de Resposta
1. **Premium Light Copy**: Tom leve, humano, sem pressão
2. **Microcompromissos**: Passos pequenos e possíveis
3. **Curiosidade**: Despertar interesse, não vender
4. **Zero Atrito**: Reduzir fricção ao máximo
5. **Tom Natural**: Conversa humana, não robótica

### Estrutura de Resposta Padrão
1. **Acolhimento**: Reconhecer a pessoa
2. **Contexto**: Entender a situação
3. **Ação Prática**: Microação específica
4. **Script Sugerido**: Mensagem pronta
5. **Reforço Emocional**: Motivação leve
6. **Próximo Passo**: Direcionamento claro

---

## 🚀 FASES DE IMPLEMENTAÇÃO

### FASE 1: Fundação (Semana 1)
- [ ] Criar estrutura de banco de dados
- [ ] Criar tabelas principais
- [ ] Implementar migrações SQL
- [ ] Criar estrutura de pastas
- [ ] Configurar tipos TypeScript

### FASE 2: Motor NOEL Core (Semana 2)
- [ ] Implementar persona e identidade
- [ ] Implementar missão e regras
- [ ] Implementar raciocínio interno
- [ ] Implementar modos de operação
- [ ] Implementar seletor de modos

### FASE 3: Sistema de Scripts (Semana 3)
- [ ] Criar tabela `wellness_scripts`
- [ ] Popular scripts iniciais (Grupos 1-3)
- [ ] Implementar motor de scripts
- [ ] Implementar seletor contextual
- [ ] Implementar adaptador de scripts

### FASE 4: Sistema de Objeções (Semana 4)
- [ ] Criar tabela `wellness_objecoes`
- [ ] Popular objeções iniciais (Categorias 1-2)
- [ ] Implementar handler de objeções
- [ ] Implementar matcher inteligente
- [ ] Implementar seleção de versão

### FASE 5: APIs e Integração (Semana 5)
- [ ] Criar endpoint principal `/api/wellness/noel`
- [ ] Criar endpoints de scripts
- [ ] Criar endpoints de objeções
- [ ] Criar endpoint de interações
- [ ] Integrar com OpenAI/Agent Builder

### FASE 6: Componentes Frontend (Semana 6)
- [ ] Criar interface de chat NOEL
- [ ] Criar seletor de scripts
- [ ] Criar handler de objeções
- [ ] Criar cards de perfil de cliente
- [ ] Integrar com dashboard existente

### FASE 7: Scripts Avançados (Semana 7)
- [ ] Popular scripts de acompanhamento (Grupo 4)
- [ ] Popular scripts de reativação (Grupo 5)
- [ ] Popular scripts de recrutamento (Grupo 6)
- [ ] Popular scripts internos (Grupo 7)

### FASE 8: Objeções Completas (Semana 8)
- [ ] Popular objeções de recrutamento (Categoria 3)
- [ ] Popular objeções de distribuidores (Categoria 4)
- [ ] Popular objeções avançadas (Categoria 5)

### FASE 9: Testes e Refinamento (Semana 9)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de fluxo completo
- [ ] Ajustes baseados em feedback
- [ ] Otimizações de performance

### FASE 10: Documentação e Deploy (Semana 10)
- [ ] Documentação técnica
- [ ] Documentação de uso
- [ ] Guias de treinamento
- [ ] Deploy em produção
- [ ] Monitoramento inicial

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Funcionalidades Core
- [ ] NOEL responde com estrutura padrão
- [ ] NOEL seleciona modo correto automaticamente
- [ ] NOEL sugere scripts contextuais
- [ ] NOEL trata objeções adequadamente
- [ ] NOEL nunca menciona PV para novos prospects

### Scripts
- [ ] Scripts organizados por categoria
- [ ] Scripts adaptáveis por contexto
- [ ] Versões (curta, média, longa) funcionando
- [ ] Scripts de acompanhamento (7, 14, 30 dias)
- [ ] Scripts de reativação funcionando

### Objeções
- [ ] Detecção automática de objeções
- [ ] Matching inteligente funcionando
- [ ] Versões apropriadas sendo selecionadas
- [ ] Gatilhos de retomada funcionando
- [ ] Respostas condicionais corretas

### Integração
- [ ] API respondendo corretamente
- [ ] Frontend integrado
- [ ] Banco de dados populado
- [ ] Logs de interação funcionando
- [ ] Perfis de cliente sendo criados

### Performance
- [ ] Respostas em < 3 segundos
- [ ] Banco de dados otimizado
- [ ] Cache funcionando
- [ ] Queries eficientes

---

## 📊 MÉTRICAS DE SUCESSO

### Técnicas
- Tempo de resposta < 3s
- Taxa de erro < 1%
- Uptime > 99.9%

### Negócio
- Taxa de conversão de scripts
- Taxa de resolução de objeções
- Satisfação do distribuidor
- Uso de scripts por categoria
- Evolução de clientes

---

## 🔄 PRÓXIMOS PASSOS IMEDIATOS

1. **Criar estrutura de banco de dados**
   - Executar migrações SQL
   - Criar índices
   - Configurar RLS

2. **Implementar motor NOEL core**
   - Persona e identidade
   - Modos de operação
   - Raciocínio interno

3. **Popular scripts iniciais**
   - Grupos 1-3 (Tipo de pessoa, Objetivo, Etapa)
   - Criar scripts SQL de seed

4. **Implementar API básica**
   - Endpoint principal
   - Integração com banco
   - Resposta estruturada

---

## 📚 REFERÊNCIAS

- **Lousa de Arquitetura Técnica**: (a ser referenciada)
- **Prompt-Mestre NOEL Lousa 1**: (já implementado parcialmente)
- **Prompt-Mestre NOEL Lousa 2**: (a ser implementado)
- **Lousa de Scripts**: (documentada acima)
- **Lousa de Objeções**: (documentada acima)
- **Lousa de Respostas Alternativas**: (documentada acima)

---

**Status**: 📝 Documento de Planejamento Criado  
**Próxima Ação**: Aguardando confirmação para iniciar FASE 1





