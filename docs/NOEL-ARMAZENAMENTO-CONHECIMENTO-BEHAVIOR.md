# Armazenamento de Conhecimento e Comportamento do Noel

**Objetivo:** Documentar o que o sistema armazena sobre as conversas, comportamento e conhecimento do Noel para análise, evolução e outras utilidades (ex.: medir padrões, melhorar respostas, analytics).

**Status:** ✅ **JÁ ESTÁ IMPLEMENTADO** — o Noel YLADA (`/api/ylada/noel`) salva automaticamente em 4 tabelas principais.

---

## 1. O que está sendo armazenado (tabelas)

| Tabela | O que armazena | Quando salva | Para que serve |
|--------|----------------|--------------|----------------|
| **`ylada_noel_memory`** | Memória estratégica: perfil profissional, objetivo principal, problema principal, estratégia atual, estágio do funil, últimas ações (JSONB). | Após cada resposta do Noel (linha 932-940 do `route.ts`). | Continuidade entre conversas; responder "O que faço agora?" com base no histórico; personalização. |
| **`noel_conversation_memory`** | Últimas 8 mensagens (janela deslizante): role (user/assistant) + conteúdo. | Após cada troca completa (linha 946-948: `addExchange`). | Contexto curto prazo; montar histórico para próximas respostas; evitar repetir perguntas. |
| **`ylada_noel_conversation_diagnosis`** | Diagnóstico da conversa: mensagem do usuário, resposta do assistente, bloqueio detectado, estratégia sugerida, exemplo, códigos (situation, profile, objective, funnel_stage). | Quando há estratégias detectadas ou códigos (linha 952-962: `saveConversationDiagnosis`). | Histórico de diagnósticos; analytics de padrões; melhorar detecção de bloqueios/estratégias. |
| **`ylada_professional_strategy_map`** | Mapa estratégico: progresso nas etapas (posicionamento → atração → diagnóstico → conversa → clientes → fidelização → indicações), estágio atual, última estratégia. | Sincronizado após atualizar memória (linha 940: `syncStrategyMapFromMemory`). | Visualizar jornada do profissional; orientar próximo passo; medir progresso. |
| **`ylada_noel_monthly_usage`** | Uso mensal (freemium): contagem de análises avançadas por usuário/mês. | Incrementado após cada resposta (linha 925: `incrementNoelUsage`). | Controle de limites freemium; analytics de uso. |

---

## 2. Estrutura das tabelas (campos principais)

### `ylada_noel_memory`
```sql
- user_id, segment
- professional_profile (ex.: "iniciante", "agenda_vazia")
- main_goal (ex.: "gerar_contatos", "melhorar_conversao")
- main_problem (ex.: "agenda_vazia")
- current_strategy (ex.: "diagnostico_link")
- funnel_stage (ex.: "atracao", "conversa")
- last_actions (JSONB array: ["criou_link_emagrecimento", "compartilhou_diagnostico"])
- last_interaction_at
```

### `noel_conversation_memory`
```sql
- user_id
- message_role ('user' | 'assistant')
- message_content (até 8000 chars)
- created_at
```

### `ylada_noel_conversation_diagnosis`
```sql
- user_id, segment
- user_message (truncada)
- assistant_response (truncada)
- bloqueio (texto)
- estrategia (texto)
- exemplo (texto)
- situation_codes (TEXT[])
- professional_profile_codes (TEXT[])
- objective_codes (TEXT[])
- funnel_stage_codes (TEXT[])
- created_at
```

### `ylada_professional_strategy_map`
```sql
- user_id, segment
- profile, goal
- posicionamento_ok, atracao_ok, diagnostico_ok, conversa_ok, clientes_ok, fidelizacao_ok, indicacoes_ok (boolean)
- current_stage (próxima etapa a focar)
- last_strategy
- diagnostics_created, conversations_started, clients_converted (contadores)
```

---

## 3. Onde está sendo salvo (código)

**Arquivo:** `src/app/api/ylada/noel/route.ts`

**Linhas relevantes:**
- **932-940:** `upsertNoelMemory` + `syncStrategyMapFromMemory` — salva memória estratégica e sincroniza mapa após cada resposta.
- **946-948:** `addExchange(user.id, message, responseText)` — salva troca completa (user + assistant) na memória de conversa.
- **952-962:** `saveConversationDiagnosis` — salva diagnóstico quando há estratégias/códigos detectados.

**Imports:**
```typescript
import { getNoelMemory, upsertNoelMemory } from '@/lib/noel-wellness/noel-memory'
import { syncStrategyMapFromMemory } from '@/lib/noel-wellness/noel-strategy-map'
import { addExchange } from '@/lib/noel-wellness/noel-conversation-memory'
import { saveConversationDiagnosis } from '@/lib/noel-wellness/noel-conversation-diagnosis'
```

---

## 4. Para que serve (utilidades)

### 4.1 Medição e análise
- **Padrões de uso:** Quais perguntas mais comuns? Quais estratégias funcionam melhor? Quais bloqueios aparecem mais?
- **Evolução do profissional:** Progresso no mapa estratégico (posicionamento → indicações); quantos links criou; quantas conversas iniciou.
- **Eficácia das respostas:** Comparar `user_message` vs `assistant_response` e códigos detectados; ver se a estratégia sugerida foi seguida.

### 4.2 Melhoria contínua (Vachon)
- **Ajustar prompts:** Se muitos profissionais têm o mesmo bloqueio, ajustar o system prompt do Noel para abordar melhor.
- **Detectar gaps:** Se `ylada_noel_conversation_diagnosis` mostra muitos bloqueios sem estratégia, melhorar a detecção.
- **Personalização:** Usar `ylada_noel_memory` para respostas mais contextuais ("baseado no que você já fez...").

### 4.3 Analytics e relatórios
- **Dashboard:** Quantos profissionais estão em cada estágio do mapa? Quais áreas têm mais uso? Quais estratégias são mais sugeridas?
- **Segmentação:** Filtrar por `segment`, `professional_profile`, `funnel_stage` para análises por perfil.
- **Tendências:** `created_at` permite ver evolução ao longo do tempo.

### 4.4 Outras utilidades
- **Testes:** Comparar respostas do Noel em diferentes rodadas de teste (mesma pergunta, respostas diferentes?).
- **Debugging:** Se um profissional relata problema, consultar `noel_conversation_memory` para ver o histórico.
- **Onboarding:** Usar `ylada_professional_strategy_map` para mostrar progresso visual ("você está na etapa de atração").

---

## 5. Queries úteis para análise

### Ver memória de um usuário
```sql
SELECT * FROM ylada_noel_memory 
WHERE user_id = '...' AND segment = 'estetica';
```

### Ver últimas conversas
```sql
SELECT * FROM noel_conversation_memory 
WHERE user_id = '...' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Ver diagnósticos salvos
```sql
SELECT user_message, bloqueio, estrategia, situation_codes, created_at 
FROM ylada_noel_conversation_diagnosis 
WHERE user_id = '...' 
ORDER BY created_at DESC;
```

### Ver progresso no mapa estratégico
```sql
SELECT current_stage, posicionamento_ok, atracao_ok, diagnostico_ok, conversa_ok 
FROM ylada_professional_strategy_map 
WHERE user_id = '...' AND segment = 'estetica';
```

### Analytics: bloqueios mais comuns
```sql
SELECT bloqueio, COUNT(*) as count 
FROM ylada_noel_conversation_diagnosis 
WHERE segment = 'estetica' 
GROUP BY bloqueio 
ORDER BY count DESC;
```

### Analytics: estratégias mais sugeridas
```sql
SELECT estrategia, COUNT(*) as count 
FROM ylada_noel_conversation_diagnosis 
WHERE estrategia IS NOT NULL 
GROUP BY estrategia 
ORDER BY count DESC;
```

---

## 6. Migrations relacionadas

- `migrations/268-ylada-noel-memory.sql` — cria `ylada_noel_memory`
- `migrations/262-noel-conversation-memory.sql` — cria `noel_conversation_memory`
- `migrations/272-ylada-noel-conversation-diagnosis.sql` — cria `ylada_noel_conversation_diagnosis`
- `migrations/271-ylada-professional-strategy-map.sql` — cria `ylada_professional_strategy_map`
- `migrations/272-ylada-noel-monthly-usage.sql` — cria `ylada_noel_monthly_usage`

---

## 7. Área administrativa: dados comportamentais e intenção (Valuation)

Além do armazenamento do Noel, existe uma **área administrativa dedicada** que armazena **intenção e comportamento** para **Valuation do YLADA**.

### 7.1 Página administrativa

**Valuation (intenção agregada):** `/admin/ylada/valuation` — API `/api/admin/ylada/valuation`

**Operacional (eventos):** `/admin/ylada/behavioral-data` — API `/api/admin/ylada/behavioral-data`
**Descrição:** "Dados Comportamentais & Intenção — Eventos, respostas por pergunta e padrões de intenção da plataforma. **Base para valuation e inteligência de mercado.**"

### 7.2 Tabelas para Valuation

| Tabela | O que armazena | Para Valuation |
|--------|----------------|----------------|
| **`ylada_behavioral_events`** | Eventos comportamentais: `user_created`, `diagnosis_created`, `diagnosis_answered`, `noel_analysis_used`, `diagnosis_shared`, `lead_contact_clicked`, `upgrade_to_pro`. | Funil de conversão, retenção, taxa de upgrade, engajamento. |
| **`ylada_diagnosis_answers`** | Respostas por pergunta com `intent_category` (dificuldade, objetivo, sintoma, barreira, tentativa, causa, contexto, preferencia). | Padrões de intenção do mercado, dores mais comuns, tendências. |
| **Views:** `v_intent_top_by_segment`, `v_intent_trends_monthly` | Top respostas por segmento, evolução mensal de intenções. | Inteligência de mercado, tendências, segmentação. |

### 7.3 Onde são salvos os eventos

- **`diagnosis_answered`:** Quando lead responde diagnóstico → `diagnosis-answers-store.ts` (linha 127-134)
- **`lead_contact_clicked`:** Quando clica no WhatsApp → `ylada/links/events/route.ts` (linha 109-120)
- **`noel_analysis_used`:** ✅ Quando o Noel YLADA responde → `ylada/noel/route.ts` (linha ~927-936) — **adicionado para completar funil de Valuation**

### 7.4 Relação com Valuation

Os dados comportamentais permitem construir:
- **Funil de conversão:** user_created → diagnosis_created → diagnosis_answered → lead_contact_clicked → upgrade_to_pro
- **Engajamento:** frequência de uso do Noel, compartilhamento de diagnósticos
- **Inteligência de mercado:** padrões de intenção por segmento, tendências mensais
- **Retenção:** evolução do uso ao longo do tempo
- **Segmentação:** comportamento por área (estética, nutri, med, etc.)

**Base para Valuation:** volume de eventos, padrões de intenção, taxa de conversão, engajamento, dados de mercado agregados.

---

## 8. Integração: dados do Noel + dados comportamentais

**Status atual:**
- ✅ Dados do Noel são salvos em `ylada_noel_memory`, `noel_conversation_memory`, `ylada_noel_conversation_diagnosis`, `ylada_professional_strategy_map`
- ✅ Dados comportamentais são salvos em `ylada_behavioral_events`, `ylada_diagnosis_answers`
- ✅ **Evento `noel_analysis_used`** está sendo salvo quando o Noel YLADA responde (linha ~927-936 do `route.ts`) — **completa o funil para Valuation**

---

## 9. Resumo

✅ **O sistema JÁ está armazenando** conhecimento e comportamento do Noel em 5 tabelas principais.  
✅ **Salva automaticamente** após cada resposta (memória, conversa, diagnóstico, mapa).  
✅ **Área administrativa** armazena intenção e comportamento para **Valuation** (`ylada_behavioral_events`, `ylada_diagnosis_answers`).  
✅ **Pode ser usado para:** medir padrões, evoluir o Noel (Vachon), analytics, debugging, testes comparativos, onboarding visual, **Valuation do YLADA**.  
✅ **Dados disponíveis:** perfil do profissional, objetivo, problema, estratégias sugeridas, bloqueios detectados, progresso no mapa, histórico de conversas, uso mensal, **eventos comportamentais, padrões de intenção, tendências de mercado**.

**Próximos passos sugeridos:**
- Criar queries/relatórios para analisar os dados armazenados.
- Usar os dados para ajustar prompts e melhorar detecção de bloqueios/estratégias.
- Dashboard para visualizar progresso dos profissionais e padrões de uso.
- **Integrar dados do Noel com dados comportamentais** para análises completas de Valuation (ex.: correlacionar uso do Noel com conversão).
