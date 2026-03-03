# Plano de Execução YLADA

**Objetivo principal:** Fazer funcionar o fluxo mínimo:

> Profissional digita "quero captar para emagrecimento" → Noel conversa e sugere → gera Quiz Pronto para Emagrecer → visitante preenche → diagnóstico → CTA WhatsApp

**Documento detalhado do fluxo mínimo:** `docs/FLUXO-MINIMO-YLADA.md`

---

## Prioridade 1 — Fluxo mínimo (6 blocos)

| Bloco | O que faz | Status |
|-------|-----------|--------|
| 1 | Noel usa flow_id + interpretacao (não template_id) | ⬜ |
| 2 | Mapeamento form (q1,q2...) → motor (symptoms, barriers...) | ⬜ |
| 3 | Ferramenta Quiz Pronto para Emagrecer alinhada | ⬜ |
| 4 | Noel sugere antes de entregar link | ⬜ |
| 5 | Teste E2E documentado e passando | ⬜ |
| 6 | WhatsApp no CTA (do perfil ou config) | ⬜ |

---

## Prioridade 2 — Infraestrutura (já feito / pendente)

| Fase | O que faz | Status |
|------|-----------|--------|
| 1 | Sidebar organizada + Planejamento | ✅ |
| 2 | Área de testes (perfis prontos, fluxo automatizado) | ⬜ |
| 3 | YLADA Lab (experimentos rápidos) | ⬜ |
| 4 | Entrada do profissional (CTA na landing) | ⬜ |
| 5 | Leads e Configuração funcionais | ⬜ |

---

## Fase 1 — Sidebar + Planejamento

### 1.1 Organizar a sidebar
- **Problema:** Muitos itens empilhados, difícil saber o que é usado.
- **Solução:** Agrupar em blocos visuais:
  - **Principal:** Noel, Links, Perfil empresarial
  - **Resultados:** Leads
  - **Desenvolvimento:** Trilha empresarial
  - **Lab:** Perfis para testes, YLADA Lab
  - **Sistema:** Configuração, Sair (+ Admin/Wellness se admin)

### 1.2 Criar área de Planejamento
- Nova rota: `/pt/planejamento`
- Conteúdo: histórico do que foi planejado, decisões, próximos passos
- Link para este doc ou versão resumida

---

## Fase 2 — Área de testes

### 2.1 Consolidar perfis simulados
- Já existe `perfis-simulados.ts` e página `/pt/perfis-simulados`
- Garantir que: ao clicar em um perfil, o sistema use esse perfil no Noel/Links
- Ou: área "Testar como" com dropdown de perfil

### 2.2 Fluxo automatizado de teste
- Botão "Rodar teste completo": cria link → simula visitante → verifica diagnóstico
- Ou: links de exemplo já criados para cada tema/ferramenta

---

## Fase 3 — YLADA Lab

### 3.1 Lab funcional
- Página `/pt/ylada-lab` já existe
- Objetivo: criar links rapidamente, testar diagnóstico, ver resultado
- Fluxo enxuto: perfil → tema → ferramenta → criar → abrir link → preencher → ver resultado

### 3.2 Integração com perfis simulados
- No Lab, poder escolher "usar perfil simulado X" para testar sem perfil real

---

## Fase 4 — Mapeamento form → motor

### 4.1 Definir mapeamento por arquitetura
- RISK_DIAGNOSIS: q1→symptoms, q2→history_flags, q3→impact_level, q4→attempts_count
- BLOCKER_DIAGNOSIS: q1→barriers, q2→routine_consistency, etc.
- PROJECTION_CALCULATOR: q1→current_value, q2→target_value, q3→days, q4→consistency_level
- PROFILE_TYPE: q1→consistency, q2→planning_style, etc.
- READINESS_CHECKLIST: checklist estruturado

### 4.2 Aplicar na API diagnosis
- Antes de chamar o motor, normalizar `visitor_answers` (q1, q2...) para as chaves esperadas

---

## Fase 5 — Entrada do profissional

### 5.1 CTA na landing
- Botão "Entrar" ou "Acessar" em `/pt`

### 5.2 Fluxo de primeiro acesso
- Após login, direcionar para Perfil ou Noel
- Perfil incompleto → Noel orienta a completar

---

## Fase 6 — Noel ↔ Links

### 6.1 Unificar geração
- Noel usar `flow_id` + `interpretacao` (igual à página Links)
- Garantir que links gerados pelo Noel tenham mesma qualidade

---

## Fase 7 — Leads e Configuração

### 7.1 Leads
- Listar eventos (view, start, complete, cta_click) por link
- Filtros e exportação básica

### 7.2 Configuração
- WhatsApp padrão, preferências

---

## Ordem de execução (par a par)

| Par | Tarefas | Aguardar OK |
|-----|---------|-------------|
| 1 | 1.1 Sidebar organizada + 1.2 Área Planejamento | ✅ |
| 2 | 2.1 Perfis simulados integrados + 2.2 Teste automatizado básico | |
| 3 | 3.1 Lab funcional + 3.2 Lab com perfis simulados | |
| 4 | 4.1 + 4.2 Mapeamento form → motor | |
| 5 | 5.1 + 5.2 Entrada e primeiro acesso | |
| 6 | 6.1 Noel ↔ Links | |
| 7 | 7.1 + 7.2 Leads e Configuração | |

---

*Documento criado em 28/02/2025. Atualizar status conforme execução.*
