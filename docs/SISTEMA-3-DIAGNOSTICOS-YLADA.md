# Sistema de 3 Diagnósticos — YLADA

O YLADA analisa três coisas para ajudar o negócio do profissional a crescer:

1. **Seu negócio** — Diagnóstico do profissional  
2. **Seus clientes** — Diagnósticos que o profissional envia  
3. **Suas conversas** — Como o profissional conduz as conversas  

---

## 1. Diagnóstico do profissional

**O que é:** Quiz de 4 perguntas sobre como o profissional gera clientes, volume de conversas e uso de diagnósticos.

**Perguntas:**
- Como você gera a maioria dos seus clientes hoje?
- Quantas conversas com interessados você tem por semana?
- O que mais acontece nas conversas?
- Você usa algum diagnóstico ou triagem antes da conversa?

**Resultado:** Perfil estratégico, bloqueio principal, potencial de crescimento, estratégia recomendada, próximo passo e `growth_stage` (etapa no mapa).

**Persistência:** `ylada_noel_memory` + `ylada_professional_strategy_map`

**APIs:**
- `GET /api/ylada/diagnostico-profissional/questions` — lista perguntas
- `POST /api/ylada/diagnostico-profissional/submit` — envia respostas (auth)

**Páginas:** `/pt/crescimento/diagnostico-profissional` (e por área)

---

## 2. Diagnóstico do cliente

**O que é:** Os links/quiz que o profissional cria e envia para clientes e leads. Cada link gera diagnósticos quando o visitante responde.

**Métricas:** Visualizações, iniciaram, completaram, cliques no CTA, resultados gerados.

**Persistência:** `ylada_links` + `ylada_diagnosis_metrics` + stats (get_ylada_link_stats)

**APIs:**
- `GET /api/ylada/links` — lista links com stats

**Páginas:** `/pt/crescimento/diagnostico-cliente` (métricas por link)

---

## 3. Diagnóstico da conversa

**O que é:** Quando o Noel responde ao profissional sobre como conduzir conversas, o sistema persiste bloqueio + estratégia + exemplo.

**Persistência:** `ylada_noel_conversation_diagnosis`

**APIs:**
- `GET /api/ylada/noel/diagnostico-conversa` — histórico (auth)

**Páginas:** `/pt/crescimento/diagnostico-conversa` (histórico completo)

**Integração:** Na rota `POST /api/ylada/noel`, após cada resposta, chama `saveConversationDiagnosis` quando há estratégias ou códigos detectados.

---

## Ciclo completo

```
Diagnóstico do profissional → Noel define estratégia
        ↓
Diagnóstico do cliente → gera interessados
        ↓
Diagnóstico da conversa → melhora conversão
```

---

## Arquivos principais

| Componente | Arquivo |
|------------|---------|
| Config perguntas | `src/config/diagnostico-profissional.ts` |
| Config copy | `src/config/sistema-crescimento.ts` |
| Persistência conversa | `src/lib/noel-wellness/noel-conversation-diagnosis.ts` |
| Superfície | `src/components/ylada/SistemaCrescimentoContent.tsx` |
| Quiz profissional | `src/components/ylada/DiagnosticoProfissionalQuiz.tsx` |
| Métricas cliente | `src/components/ylada/DiagnosticoClienteMetricas.tsx` |
| Histórico conversa | `src/components/ylada/DiagnosticoConversaHistorico.tsx` |

---

## Migrations

- **272** — `ylada_noel_conversation_diagnosis` (com `DROP POLICY IF EXISTS` para idempotência)
- **271** — `ylada_professional_strategy_map`
- **268** — `ylada_noel_memory`

---

## Integração Wellness (pendente)

O Noel do Wellness (`/api/wellness/noel`) ainda não persiste diagnóstico da conversa. Para integrar, seria necessário:
- Trocar `getNoelLibraryContext` por `getNoelLibraryContextWithStrategies`
- Chamar `saveConversationDiagnosis` após cada resposta (segment `wellness`)
- O wellness tem múltiplos pontos de retorno; a integração exigiria refatoração para centralizar o save
