# Plano de Testes — Diagnóstico Memorizado e Fluxos

**Data:** 10/03/2026  
**Objetivo:** Validar que o diagnóstico (padrão refinado) é gerado e memorizado em todos os fluxos de criação de link.

---

## 1. O que testar

| Fluxo | Onde | Gatilho | O que validar |
|-------|------|---------|---------------|
| **Biblioteca** | /pt/.../biblioteca | Clicar em quiz → criar link | Diagnóstico gerado em background, memorizado |
| **Ferramenta** | /pt/.../links | Escolher ferramenta + tema → criar | Mesmo |
| **Noel (novo)** | Chat Noel | "quero um quiz de emagrecimento" | Mesmo |
| **Noel (ajuste)** | Chat Noel | "troca a pergunta X" (após ter link) | Regenera com force=true |
| **Edição** | /pt/.../links/editar/[id] | Salvar alterações | Regenera com force=true |

---

## 2. Ordem sugerida

### Fase 1 — Criação e memorização (30 min)

| # | Teste | Passos | Validação |
|---|-------|--------|-----------|
| **1.1** | Biblioteca → link novo | 1. Ir em Biblioteca<br>2. Escolher quiz (ex: Peso e emagrecimento)<br>3. Criar link | 4. Aguardar ~15s<br>5. Supabase: `ylada_link_diagnosis_content` tem 3 linhas (leve, moderado, urgente) para o link_id |
| **1.2** | Ferramenta → link novo | 1. Ir em Links<br>2. Escolher ferramenta (ex: Diagnóstico de risco)<br>3. Tema: "limpeza e emagrecimento"<br>4. Criar | 5. Mesmo: 3 linhas em `ylada_link_diagnosis_content` |
| **1.3** | Noel → link novo | 1. Ativar perfil simulado (ex: Nutri)<br>2. Noel: "quero um quiz para captar emagrecimento"<br>3. Aguardar link gerado | 4. Abrir link<br>5. Verificar que existe conteúdo em `ylada_link_diagnosis_content` |

### Fase 2 — Qualidade do diagnóstico (20 min)

| # | Teste | Passos | Validação |
|---|-------|--------|-----------|
| **2.1** | Padrão refinado | 1. Abrir link criado na 1.1 ou 1.2<br>2. Responder quiz (ex: escolhas que levem a "leve") | 3. **NÃO** deve ter "Se você se identificou com esse resultado...}<br>4. Causa provável, Preocupações e Consequência devem ser **diferentes**<br>5. Dica rápida: ação concreta (ex: "Definir horário fixo...")<br>6. Próximos passos: específicos ao tema, último = "Converse com quem te enviou..." |
| **2.2** | Três níveis (leve/moderado/urgente) | 1. Mesmo link, 3 combinações de respostas | 2. Cada uma deve gerar diagnóstico diferente (leve, moderado, urgente)<br>3. Tom de cada nível coerente (leve=suave, urgente=firme) |

### Fase 3 — Edição e regeneração (15 min)

| # | Teste | Passos | Validação |
|---|-------|--------|-----------|
| **3.1** | Editar → regenera | 1. Ir em Links → Editar o link da 1.1<br>2. Alterar pergunta ou opção<br>3. Salvar | 4. Aguardar ~15s<br>5. Responder quiz de novo<br>6. Diagnóstico deve refletir as novas perguntas |
| **3.2** | Cache invalidado | 1. Após 3.1, responder com mesmas respostas de antes | 2. Deve receber o diagnóstico **novo** (não o antigo em cache) |

### Fase 4 — Perfumaria (15 min)

| # | Teste | Passos | Validação |
|---|-------|--------|-----------|
| **4.1** | Quiz perfumaria | 1. Biblioteca → segmento Perfumaria<br>2. Criar link de quiz<br>3. Responder (q3 = uso do perfume) | 4. Perfil + perfume_usage exibidos<br>5. CTA: "Quero receber sugestões"<br>6. Leads: filtro perfume_usage |

### Fase 5 — Smoke (5 min)

**O que é:** Teste rápido de fumaça — verifica se o fluxo básico funciona de ponta a ponta, sem erros.

| # | Teste | Passos | Validação |
|---|-------|--------|-----------|
| **5.1** | Fluxo completo | 1. Abrir link em aba anônima<br>2. Começar → responder → ver resultado<br>3. Clicar CTA | 4. Eventos: view, start, complete, result_view, cta_click<br>5. WhatsApp abre com prefill correto |

**Diferente das outras fases:** Fase 1–4 testam cenários específicos (criação, qualidade, edição, perfumaria). A Fase 5 é um smoke test — um único fluxo completo para garantir que nada quebrou no geral.

---

## 3. Checklist rápido

- [ ] Biblioteca cria link com diagnóstico memorizado
- [ ] Ferramenta cria link com diagnóstico memorizado
- [ ] Noel cria link com diagnóstico memorizado
- [ ] Edição regenera diagnóstico
- [ ] Sem "Se você se identificou com esse resultado..."
- [ ] Causa provável, Preocupações e Consequência diferentes
- [ ] Dica rápida prática
- [ ] Próximos passos específicos ao tema
- [ ] Perfumaria: perfil + perfume_usage
- [ ] Eventos e métricas gravados

---

## 4. Queries úteis (Supabase)

```sql
-- Links com conteúdo memorizado
SELECT l.id, l.slug, l.title, COUNT(c.id) as archetypes
FROM ylada_links l
LEFT JOIN ylada_link_diagnosis_content c ON c.link_id = l.id
WHERE l.status = 'active'
GROUP BY l.id, l.slug, l.title
HAVING COUNT(c.id) > 0;

-- Links RISK/BLOCKER sem conteúdo (precisam de bulk ou criação)
SELECT l.id, l.slug, l.title, (l.config_json->'meta'->>'architecture') as arch
FROM ylada_links l
LEFT JOIN ylada_link_diagnosis_content c ON c.link_id = l.id
WHERE l.status = 'active'
  AND (l.config_json->'meta'->>'architecture') IN ('RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS')
  AND c.id IS NULL;
```

---

## 5. Perfis simulados (pré-requisito)

Para testar Noel e áreas específicas:

- **Nutri/Emagrecimento:** Perfil com `profession` ou `profile_type` preenchido
- **Perfumaria:** Perfil "Vendedor de perfumes" em `/pt/perfis-simulados`
- **Psi:** Perfil psicologia
- **Odonto:** Perfil odontologia

---

*Documento criado em 10/03/2026. Complementa REVISAO-E-PLANO-TESTES-YLADA.md.*
