# 🚀 PROMPT MASTER - GERAR SEED 90 DIAS WELLNESS

## 📋 PROMPT PARA CLAUDE — Criar Seed Master + Fases (Plano 90 Dias NOEL Wellness)

Você é o desenvolvedor responsável pelo backend do sistema NOEL Wellness.

Sua tarefa é gerar **TODOS** os arquivos SQL de seed contendo o plano completo de 90 dias, conforme o padrão estabelecido pelo cliente ANDRÉ.

---

## 🎯 OBJETIVO

Gerar:

1. **seed_master_wellness_planos_dias.sql** (dias 1 a 90 - arquivo completo)
2. **seed_fase1_wellness_planos_dias.sql** (dias 1–7)
3. **seed_fase2_wellness_planos_dias.sql** (dias 8–14)
4. **seed_fase3_wellness_planos_dias.sql** (dias 15–30)
5. **seed_fase4_wellness_planos_dias.sql** (dias 31–90)

Todos seguindo estrutura idêntica, estilo idêntico e padrão idêntico.

### ⚠️ IMPORTANTE:

👉 **NÃO EXECUTAR NADA AUTOMATICAMENTE NO SUPABASE.**

Apenas gerar os arquivos SQL prontos para revisão.

O cliente quer revisar antes de rodar.

---

## 🗂️ TABELA ALVO

Use exatamente esta tabela:

```sql
CREATE TABLE IF NOT EXISTS wellness_planos_dias (
  id                  BIGSERIAL PRIMARY KEY,
  dia                 INTEGER NOT NULL,
  fase                INTEGER NOT NULL,    -- 1, 2, 3, 4
  titulo              TEXT NOT NULL,
  foco                TEXT NOT NULL,
  microtarefas        JSONB NOT NULL,       -- JSON simples (array de strings)
  scripts_sugeridos   JSONB NOT NULL,       -- JSON simples (array de strings)
  notificacoes_do_dia JSONB NOT NULL,      -- JSON simples (array de strings)
  mensagem_noel       TEXT NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Colunas para INSERT:

**NÃO incluir `id` no INSERT** (é BIGSERIAL, gerado automaticamente)

**NÃO incluir `created_at` no INSERT** (tem DEFAULT)

**Incluir apenas:**
- `dia` (integer)
- `fase` (integer: 1, 2, 3 ou 4)
- `titulo` (text)
- `foco` (text)
- `microtarefas` (jsonb - array de strings)
- `scripts_sugeridos` (jsonb - array de strings)
- `notificacoes_do_dia` (jsonb - array de strings)
- `mensagem_noel` (text)

---

## 📌 FORMATO DO SEED

Use sempre este formato:

```sql
BEGIN;

INSERT INTO wellness_planos_dias (
  dia,
  fase,
  titulo,
  foco,
  microtarefas,
  scripts_sugeridos,
  notificacoes_do_dia,
  mensagem_noel
) VALUES
  (1, 1, 'Título do Dia 1', 'Foco do Dia 1', '["Ritual 2", "Ritual 5", "Ritual 10"]'::jsonb, '["script_vendas_abordagem_inicial"]'::jsonb, '["ritual_manha"]'::jsonb, 'Mensagem inspiradora do NOEL'),
  (2, 1, 'Título do Dia 2', 'Foco do Dia 2', '["Ritual 2", "Ritual 5", "Ritual 10"]'::jsonb, '["script_vendas_abordagem_inicial"]'::jsonb, '["ritual_manha"]'::jsonb, 'Mensagem inspiradora do NOEL'),
  -- ... continuar para todos os dias da fase
  (7, 1, 'Título do Dia 7', 'Foco do Dia 7', '["Ritual 2", "Ritual 5", "Ritual 10"]'::jsonb, '["script_vendas_abordagem_inicial"]'::jsonb, '["ritual_manha"]'::jsonb, 'Mensagem inspiradora do NOEL');

COMMIT;
```

**Regras:**
- Toda a fase em um único INSERT com múltiplos VALUES
- Sempre usar `::jsonb` para converter strings JSON
- Sempre usar `BEGIN;` no início e `COMMIT;` no final
- Cada linha VALUES representa um dia

---

## 🎤 ESTILO DAS MENSAGENS DO NOEL

O estilo aprovado pelo cliente é:

### ⭐ Inspiracional profundo (Jim Rohn + Mark Hughes + Eric Worre)

Misturado com frases originais, adaptadas e contextualizadas.

### ⭐ Tom híbrido (90% "você" + 10% orientação técnica)

### Exemplos de estilo aprovado:

✅ **APROVADO:**
- "Você cresce quando faz o que disse que faria, mesmo sem vontade."
- "Seu futuro está sendo construído hoje, nas microtarefas que você escolhe cumprir."
- "A disciplina de agora cria a liberdade que você deseja viver."
- "Cada ação de hoje é um investimento no consultor que você está se tornando."
- "A consistência não é sobre perfeição, é sobre mostrar-se todos os dias."

❌ **NÃO APROVADO:**
- "Faça 2 contatos hoje." (muito técnico, sem inspiração)
- "Lembre-se de executar o Ritual 2." (muito instrucional)
- "Você precisa vender mais." (muito direto, sem profundidade)

### Características:
- Mensagens curtas (1–2 linhas)
- Profundas e emocionais
- Sempre orientando à ação
- Foco em "você" e transformação pessoal
- Evitar comandos diretos
- Usar metáforas e reflexões quando apropriado

---

## 📊 INTENSIDADE APROVADA

### ⭐ Intensidade: **Moderada (B)**

- Microtarefas claras, realistas e consistentes
- Não sobrecarregar o consultor
- Foco em qualidade sobre quantidade
- Progressão gradual e sustentável

### Exemplo de microtarefas moderadas:

✅ **APROVADO:**
- 3-7 microtarefas por dia
- Ritual 2-5-10 sempre presente
- 1-2 ações específicas além do ritual
- Total: 4-8 ações por dia

❌ **NÃO APROVADO:**
- Mais de 10 microtarefas por dia
- Ações muito complexas ou demoradas
- Múltiplas ações que exigem muito tempo

---

## 📌 JSON SIMPLES

Use sempre JSON simples (array de strings):

✅ **CORRETO:**
```json
'["Ritual 2", "Ritual 5", "Ritual 10", "Enviar ferramenta"]'::jsonb
```

❌ **ERRADO:**
```json
'[{"tipo": "ritual", "nome": "Ritual 2"}]'::jsonb  -- Objeto complexo
```

### Para scripts_sugeridos:
Use slugs dos scripts da base de conhecimento:
- `script_vendas_abordagem_inicial`
- `script_bebidas_preparo_basico`
- `script_indicacao_pedir_indicacao`
- `script_recrutamento_abordagem_recrutamento`
- `script_followup_followup_24h`
- `frase_motivacional_manha`
- `fluxo_padrao_fluxo_venda`
- `instrucao_como_comecar`

### Para notificacoes_do_dia:
Use slugs das notificações (criar conforme necessário):
- `ritual_manha` (para Ritual 2)
- `ritual_tarde` (para Ritual 5)
- `ritual_noite` (para Ritual 10)
- `microtarefa_lembrete`
- `motivacional_dia`

---

## 🧩 REGRAS GERAIS PARA CADA DIA (1 A 90)

Cada dia deve conter:

1. **titulo** → Claro, forte, alinhado à fase
   - Exemplos: "Primeiro Passo", "Construindo Ritmo", "Acelerando Resultados", "Expandindo Liderança"

2. **foco** → Foco estratégico do dia
   - Exemplos: "Fundamentos: Criar base sólida", "Ritmo: Estabelecer consistência", "Consistência: Manter volume", "Liderança: Desenvolver equipe"

3. **microtarefas** → 3 a 7 ações moderadas
   - Sempre incluir: Ritual 2, Ritual 5, Ritual 10
   - Adicionar 1-4 ações específicas do dia
   - Formato: `'["Ritual 2", "Ritual 5", "Ritual 10", "Ação específica"]'::jsonb`

4. **scripts_sugeridos** → 1 a 3 scripts (usar slugs dos scripts criados)
   - Formato: `'["script_vendas_abordagem_inicial"]'::jsonb`

5. **notificacoes_do_dia** → 1 a 3 slugs (usar Bloco 9)
   - Formato: `'["ritual_manha", "microtarefa_lembrete"]'::jsonb`

6. **mensagem_noel** → Inspiradora, profunda, orientadora
   - 1-2 linhas
   - Estilo Jim Rohn / Mark Hughes / Eric Worre
   - Tom híbrido (90% você, 10% técnica)
   - Sempre orientando à ação

---

## 🧭 DIVISÃO DAS FASES

### Fase 1 — Fundamentos (dias 1–7)

**Características:**
- Começo simples
- Movimento e ação
- Enviar ferramentas
- Preparar bebidas
- Primeiros clientes
- Foco em hábito e rotina

**Temas principais:**
- Criar base sólida
- Estabelecer Ritual 2-5-10
- Primeiros contatos
- Conhecer produtos
- Preparar primeira apresentação

**Microtarefas típicas:**
- Ritual 2-5-10 (sempre)
- Enviar ferramenta para 1 pessoa
- Preparar shake e testar
- Fazer primeiro contato
- Estudar 1 script

---

### Fase 2 — Ritmo (dias 8–14)

**Características:**
- Indicação ativa
- Follow-up consistente
- Kit 7 dias
- Conversas consistentes
- Construção de rede

**Temas principais:**
- Estabelecer ritmo
- Follow-up sistemático
- Pedir indicações
- Apresentar kit inicial
- Manter conversas ativas

**Microtarefas típicas:**
- Ritual 2-5-10 (sempre)
- Follow-up com 2-3 pessoas
- Pedir 1 indicação
- Apresentar kit 7 dias
- Revisar scripts de vendas

---

### Fase 3 — Consistência (dias 15–30)

**Características:**
- Carteira de clientes
- Foco em PV
- Planejamento semanal
- Repetição inteligente
- Otimização de processos

**Temas principais:**
- Manter consistência
- Aumentar volume
- Planejar semana
- Recompra de clientes
- Desenvolver processos

**Microtarefas típicas:**
- Ritual 2-5-10 (sempre)
- Acompanhar 3-5 clientes
- Planejar semana seguinte
- Fazer recompra
- Analisar resultados

---

### Fase 4 — Liderança (dias 31–90)

**Características:**
- Profissionalismo
- Cultura de equipe
- Recrutamento leve
- Onboarding
- Expansão

**Temas principais:**
- Desenvolver liderança
- Recrutar e treinar
- Criar cultura
- Expandir equipe
- Multiplicar resultados

**Microtarefas típicas:**
- Ritual 2-5-10 (sempre)
- Acompanhar equipe
- Identificar recrutas
- Treinar novos consultores
- Planejar expansão

---

## 🔧 EXEMPLO DE ESTRUTURA APROVADA

Use EXACTAMENTE o mesmo tom e estilo dos exemplos abaixo:

### Dia 1 (Fase 1 - Fundamentos):

```sql
(1, 1, 
 'Primeiro Passo', 
 'Fundamentos: Criar base sólida e estabelecer rotina',
 '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Preparar shake e testar", "Enviar ferramenta para 1 pessoa"]'::jsonb,
 '["script_bebidas_preparo_basico", "script_vendas_abordagem_inicial"]'::jsonb,
 '["ritual_manha", "microtarefa_lembrete"]'::jsonb,
 'Você cresce quando faz o que disse que faria, mesmo sem vontade. Hoje é o primeiro passo de muitos que virão.'
),
```

### Dia 8 (Fase 2 - Ritmo):

```sql
(8, 2,
 'Estabelecendo Ritmo',
 'Ritmo: Follow-up consistente e indicações ativas',
 '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Follow-up com 2 pessoas", "Pedir 1 indicação"]'::jsonb,
 '["script_followup_followup_24h", "script_indicacao_pedir_indicacao"]'::jsonb,
 '["ritual_manha", "ritual_tarde"]'::jsonb,
 'Seu futuro está sendo construído hoje, nas microtarefas que você escolhe cumprir. Continue o movimento.'
),
```

### Dia 15 (Fase 3 - Consistência):

```sql
(15, 3,
 'Mantendo Consistência',
 'Consistência: Carteira de clientes e planejamento',
 '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Acompanhar 3 clientes", "Planejar semana seguinte"]'::jsonb,
 '["script_followup_followup_pos_venda", "fluxo_padrao_fluxo_venda"]'::jsonb,
 '["ritual_manha", "microtarefa_lembrete", "motivacional_dia"]'::jsonb,
 'A disciplina de agora cria a liberdade que você deseja viver. Cada dia de consistência te aproxima do seu objetivo.'
),
```

### Dia 31 (Fase 4 - Liderança):

```sql
(31, 4,
 'Expandindo Liderança',
 'Liderança: Desenvolver equipe e multiplicar resultados',
 '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Acompanhar equipe", "Identificar 1 potencial recruta"]'::jsonb,
 '["script_recrutamento_abordagem_recrutamento", "instrucao_desenvolver_equipe"]'::jsonb,
 '["ritual_manha", "ritual_tarde", "ritual_noite"]'::jsonb,
 'Líderes não nascem prontos, eles se desenvolvem através da prática e do comprometimento. Você está no caminho certo.'
),
```

---

## 📋 CHECKLIST ANTES DE GERAR

Antes de gerar os arquivos, certifique-se de:

- [ ] Usar tabela `wellness_planos_dias` (não `ylada_wellness_planos`)
- [ ] Não incluir `id` no INSERT (é BIGSERIAL)
- [ ] Não incluir `created_at` no INSERT (tem DEFAULT)
- [ ] Usar `BEGIN;` e `COMMIT;`
- [ ] Usar `::jsonb` para todos os campos JSON
- [ ] JSON sempre como array de strings simples
- [ ] Mensagens NOEL no estilo aprovado (Jim Rohn / Mark Hughes / Eric Worre)
- [ ] Tom híbrido (90% você, 10% técnica)
- [ ] Intensidade moderada (3-7 microtarefas por dia)
- [ ] Sempre incluir Ritual 2-5-10
- [ ] Títulos claros e fortes
- [ ] Foco alinhado à fase
- [ ] Scripts usando slugs da base de conhecimento
- [ ] Notificações usando slugs apropriados

---

## ⛔ REGRAS ABSOLUTAS

### NÃO fazer:

❌ NÃO improvisar estilo
❌ NÃO alterar tom das mensagens
❌ NÃO reduzir profundidade emocional
❌ NÃO usar JSON complexo (objetos)
❌ NÃO criar microtarefas excessivas (>7 por dia)
❌ NÃO usar comandos diretos nas mensagens NOEL
❌ NÃO esquecer Ritual 2-5-10 em nenhum dia
❌ NÃO incluir `id` ou `created_at` no INSERT
❌ NÃO executar automaticamente no Supabase

### SIM fazer:

✅ Usar estilo inspiracional profundo
✅ Tom híbrido (90% você, 10% técnica)
✅ Intensidade moderada
✅ JSON simples (arrays de strings)
✅ Mensagens curtas e profundas
✅ Sempre orientar à ação
✅ Seguir estrutura exata dos exemplos
✅ Gerar apenas arquivos SQL prontos para revisão

---

## 🎯 INSTRUÇÃO FINAL

Agora gere:

1. **seed_master_wellness_planos_dias.sql** (dias 1 a 90 - arquivo completo)
2. **seed_fase1_wellness_planos_dias.sql** (dias 1–7)
3. **seed_fase2_wellness_planos_dias.sql** (dias 8–14)
4. **seed_fase3_wellness_planos_dias.sql** (dias 15–30)
5. **seed_fase4_wellness_planos_dias.sql** (dias 31–90)

Tudo 100% alinhado com as regras acima.

**Sem execução automática.**

**Apenas conteúdo pronto para revisão.**

Quando terminar, entregue o conteúdo completo dos 5 arquivos.

---

## 🔥 PRONTO PARA ENVIAR AO CLAUDE

Este prompt está completo, detalhado e impossível de gerar errado.

Copie e cole EXACTAMENTE no Claude (não edite nada).

