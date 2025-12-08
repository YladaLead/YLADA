# 🗺️ ROADMAP DE IMPLEMENTAÇÃO — SISTEMA NOEL WELLNESS

## 🎯 VISÃO GERAL DO ROADMAP (ESTILO TRELLO / KANBAN)

## 🟩 FAZER AGORA (Prioridade Máxima)

• Finalizar Seed Master (90 dias)
• Gerar seeds por fase (1, 2, 3, 4)
• Subir seeds no Supabase
• Criar Página do Plano Diário (frontend)
• Integrar página com banco e endpoints
• Criar Prompt Base completo do NOEL
• Implementar few-shots de comportamento
• Calibrar respostas iniciais

## 🟦 FASE EM PROGRESSO (Essenciais)

• Testes internos com 2–3 consultores
• Ajuste fino do estilo motivacional (Mark Hughes / Jim Rohn / Eric Worre)
• Integração de scripts no fluxo de resposta
• Integração de notificações inteligentes
• Ajuste da economia de tokens (usar script antes do modelo)

## 🟧 PRÓXIMAS AÇÕES (Após testes)

• Onboarding automático dos novos consultores
• Implantar Plano de 7, 14, 30 e 90 dias
• Implementar Ritual 2-5-10 completo
• Otimizar resposta do NOEL por perfil
• Criar mini-dashboard de progresso

## 🟥 FASE FUTURA — LIDERANÇA (Versão 2.0)

• Detectar automaticamente tipo de líder
• Criar Plano Avançado (30 dias para líderes)
• Criar rotinas para líder gestor, líder recrutador e líder influenciador
• Painel de liderança: acompanhamento da equipe
• Scripts avançados de liderança
• Treinamento automatizado para líderes
• Ferramentas de ativação da linha descendente

## 🟪 VERSÃO 3.0 — EXPANSÃO

• Apresentação automática do negócio
• Inteligência de previsibilidade de vendas e PV
• Ferramentas complementares (Nutri, Coach, Wellness integradas)
• Sistema de gamificação e ranking
• Treinamentos semanais automáticos
• Gatilhos personalizados por comportamento real do consultor

---

# 📘 ROADMAP TÉCNICO (CLARIDADE PARA O CLAUDE)

## 🔥 FASE 1 — Backend + Dados

### ✔️ 1. Seed Master dos 90 dias

• Criar JSON simples por dia
• Estruturar fases (1–4)
• Incluir scripts sugeridos
• Incluir notificações
• Incluir mensagem motivacional
• Criar sintaxe SQL direta

### ✔️ 2. Seeds individuais

• 7 dias, 14 dias, 30 dias, 90 dias

### ✔️ 3. Subir para Supabase

• Validar JSONB
• Verificar permissões RLS
• Testar SELECT das fases

---

## 🔥 FASE 2 — Frontend (Página do Plano Diário)

**Componentes a programar:**
- Header da fase
- Lista de microtarefas com checkbox
- Script do dia (modal)
- Conteúdo motivacional
- Progresso do dia
- Botão "Falar com NOEL" (abre chat)
- Integração com notificações

**Endpoints envolvidos:**
- GET plano/dia
- POST registrar progresso
- GET scripts
- POST notificações
- POST ritual

---

## 🔥 FASE 3 — Inteligência NOEL (IA)

### ✔️ Prompt Base completo

• Campo de identidade (quem é o NOEL)
• Filosofia YLADA Wellness
• Tom motivacional moderado
• Inspiração Mark Hughes / Jim Rohn / Eric Worre
• Inteligência adaptativa por perfil
• Economia de tokens (scripts → IA como fallback)

### ✔️ Few-shots

**Exemplos para:**
- Novato perdido
- Líder sem tempo
- Consultor motivado
- Consultor travado
- Consultor que não recruta
- Consultor que só vende

### ✔️ Testes de respostas

• Ajustar intensidade
• Ajustar clareza
• Ajustar CTA's

---

## 🔥 FASE 4 — Lançamento inicial

• Onboarding automático
• Plano de 7 dias liberado
• Scripts funcionando
• Mensagem motivacional ativa
• Ritual 2-5-10 ativo
• Testes com 2–3 consultores reais

---

## 🔥 FASE 5 — Liderança (V2)

**Ações técnicas**

• Criar lógica de detecção de líder
• Gerar rotinas específicas
• Atualizar banco com coluna "tipo_lider"
• Criar painel de liderança
• Criar scripts avançados

---

## 🎯 STATUS VISUAL (ATUAL)

• Backend: 95% pronto
• IA NOEL: 50% pronta (aguardando prompt base)
• Plano 90 dias: 40% pronto (falta seed master)
• Scripts: 70% inseridos
• Frontend plano: 0% (a fazer)
• Frontend chat Noel: pronto

---

## 👉 Próxima ação imediata

Inserir o PROMPT BASE COMPLETO do NOEL na próxima seção da lousa.

---

# 🧭 CHECKLIST DE IMPLEMENTAÇÃO — SISTEMA NOEL WELLNESS (YLADA)

## ✅ FASE 1 — FUNDAMENTAÇÃO (IMEDIATA)

### 1. Concluir Seed Master dos 90 Dias

• Ajustar estilo (Mark Hughes / Jim Rohn / Eric Worre)
• Intensidade moderada
• Estrutura JSON simples
• Fases 1–4 integradas
• Scripts sugeridos conectados
• Notificações básicas
• Mensagem NOEL diária

### 2. Preparar Seed das Fases Individuais

• Fase 1 (1–7)
• Fase 2 (8–14)
• Fase 3 (15–30)
• Fase 4 (31–90)

### 3. Subir Seeds no Supabase

• Wellness_planos_dias
• Ajustar permissões RLS
• Validar JSONB

### 4. Criar Página "Plano Diário" no Frontend

**Componentes necessários:**
- Header da fase
- Lista de microtarefas com checkbox
- Script do dia (modal)
- Mensagem motivacional
- Meta do dia
- Indicador de progresso
- Botão "Falar com NOEL" (abre chat)

**Integrações:**
- GET plano do dia
- POST progresso
- GET scripts
- POST notificações

---

## ✅ FASE 2 — CALIBRAÇÃO (IA NOEL)

### 5. Implementar PROMPT BASE COMPLETO do NOEL

O NOEL deve entender:
- Perfil do consultor
- Tempo disponível
- Estágio do negócio
- Deseja recrutar ou não
- Preferência de intensidade
- Histórico de ações / progresso
- Scripts disponíveis
- Quais respostas usar sem IA

**Funções do PROMPT:**
- Ajustar tom
- Usar fallback inteligente
- Personalizar sugestão
- Usar scripts quando possível
- Selecionar microtarefas
- Interpretar dúvidas técnicas

### 6. Criar Few-Shots (Exemplos de Respostas)

• Novato pedindo ajuda
• Líder sem tempo
• Consultor travado
• Consultor motivado
• Consultor que não recruta
• Consultor que só quer vender

### 7. Teste real com 2–3 consultores

**Avaliar:**
- Clareza das respostas
- Tom motivacional
- Intensidade
- Foco do NOEL
- Sugestões úteis
- Economia de tokens

Ajustar após feedback.

---

## ✅ FASE 3 — LANÇAMENTO PARA NOVOS CONSULTORES

### 8. Preparar Onboarding Automático

• Diagnóstico inicial
• Plano de 7 dias
• Ativação do Ritual 2-5-10
• Scripts recomendados

### 9. Ativar Notificações Estratégicas

• Começo do dia
• Ritual 2
• Ritual 5
• Ritual 10
• Meta do dia
• Motivacional

### 10. Liberar para primeiros usuários

• Testar consistência
• Validar duplicação
• Avaliar engajamento

---

## 📌 FASE 4 — APÓS LANÇAMENTO (LIDERANÇA AVANÇADA)

### 11. Criar Detecção Automática de Líder

**Critérios:**
- Tempo de empresa
- Tamanho da equipe
- PV mensal
- Volume de atividades
- Tipo de rotina

### 12. Criar Rotinas Específicas de Líder

**Tipos:**
- Líder executor
- Líder gestor
- Líder recrutador
- Líder influenciador
- Líder retorno

### 13. Criar Painel de Liderança

• Acompanhamento da equipe
• Quem está ativo
• Quem está travado
• Sugestões do NOEL para ativação
• Ranking interno

### 14. Scripts Avançados para Líderes

• Comunicação com equipe
• Ativação
• Recrutamento forte
• Construção de visão
• Treinamento

---

## 🔥 FASE 5 — EXPANSÃO (VERSÃO 2.0)

### 15. Automatizar Apresentação de Negócio

• Vídeo
• Estrutura
• Scripts de fechamento
• Roteiro para duplicação

### 16. Ferramentas Extras

• Criador de listas de contatos
• Gerador de metas
• Auditor de rotina
• Detector de gargalos
• Treinamentos semanais

### 17. Integração com outras áreas (Nutri, Coach, etc.)

• Linguagem unificada
• Scripts cruzados
• Bases de conhecimento conectadas

---

## 🟩 STATUS ATUAL (hoje)

• Backend pronto.
• NOEL funcional, porém ainda não calibrado.
• Scripts iniciais inseridos.
• Plano de 90 dias em construção.
• Página do plano — a ser criada.
• Prompt base — a ser inserido.

---

## 🟦 PRÓXIMA AÇÃO IMEDIATA

Produzir o PROMPT BASE COMPLETO do NOEL — é o cérebro do sistema e precisa ser implementado antes de avançar.

**Depois disso:**
- subir seeds
- Claude cria páginas
- ativar testes
- lançar sistema para novos

Tudo segue um fluxo lógico e seguro.

---

✔️ **Documento pronto para receber o Roadmap e o Prompt Base.**

