# Matriz central YLADA — Cronograma e passo a passo

Documento de planejamento da matriz central (motor de conversas): tripé Noel + Trilha Empresarial + Links que agregam valor. Atende qualquer profissional liberal ou vendedor; personalização por contexto (segment, category, sub_category, dor), não por produtos separados.

**Restrição importante:** Não mexer nas áreas **Nutri** e **Wellness** — estão em comercialização. A migração delas para a matriz central será feita em um segundo momento, após tudo pronto, funcionando e validado.

---

## 1. Visão da matriz

- **Um painel único** para todos (rota padrão: `/pt/ylada`).
- **Perfil estratégico** = cérebro (segment, category, sub_category, dor_principal, fase, canal_principal, objetivo_30d, idioma).
- **Trilha empresarial** = mesma para todos (Fundamentos + Necessidades); reflexões geram snapshot.
- **Links** = templates universais instanciados; copy adaptada por contexto.
- **Noel** = treinador de conversas; sempre recebe perfil completo; resposta estruturada (diagnóstico, estratégia, link, script, próximo passo).

---

## 2. Filtragem e conexão Noel ↔ Perfil

- **Segment** (macro): seller, professional, clinic, coach, service_local — define tipo de conversa e modelo de oferta.
- **Category** (mercado): estetica, automoveis, nutricao, odontologia, etc. — define vocabulário e exemplos.
- **Sub_category** (opcional): cabelo, seminovos, high_ticket — ajuste fino de linguagem.
- **dor_principal** (filtro real): agenda_vazia, nao_converte, sem_indicacao, conteudo_nao_funciona, precificacao_ruim, falta_de_clareza. Define template sugerido e estratégia do Noel.
- Noel **nunca** responde solto: sempre recebe contexto do perfil (segment, category, sub_category, dor_principal, fase, canal_principal, objetivo_30d, idioma).

---

## 3. Cronograma de construção

### Fase 0 — Base (feito nesta etapa)

| # | Task | Status |
|---|------|--------|
| 0.1 | Área Med removida; área YLADA criada como padrão (`/pt/ylada`) | ✓ |
| 0.2 | Config: ylada-areas com ylada; auth e institutional apontando para ylada | ✓ |
| 0.3 | Nutri e Wellness intocadas | ✓ |

### Fase 1 — MVP do motor

| # | Task | Critério de pronto |
|---|------|--------------------|
| 1.1 | Perfil: adicionar `category`, `sub_category` em ylada_noel_profile (ou area_specific) | Migration; tipos TS |
| 1.2 | Tabelas: ylada_link_templates, ylada_links, ylada_link_events | Migrations aplicadas |
| 1.3 | 2 templates (ex.: diagnóstico_agenda, calculadora_perda); seed | 2 registros ativos |
| 1.4 | API POST /api/ylada/links/generate (template_id + contexto → instância) | Link criado com slug |
| 1.5 | Rota pública do link (ex.: /l/[slug]) + eventos (view, cta_click) | Página renderiza e persiste eventos |
| 1.6 | POST /api/ylada/interpret (texto → perfil sugerido + template recomendado + confidence) | JSON estruturado |
| 1.7 | Noel: prompt com estrutura fixa (diagnóstico, estratégia, link, script, próximo passo); injetar perfil completo | Resposta consistente |

### Fase 2 — Expansão

| # | Task |
|---|------|
| 2.1 | +4 templates (diagnóstico conversão, triagem, posicionamento, erro oculto) |
| 2.2 | Memória Noel (ylada_noel_memory); dashboard métricas por link |
| 2.3 | Fluxo “Descreva sua dor” na UI → interpret → preencher perfil + gerar link |

### Fase 3 — Escala

| # | Task |
|---|------|
| 3.1 | Internacionalização (pt/es/en); copy packs por segment/category |
| 3.2 | Otimização custo IA (cache, quotas, threshold confidence) |

---

## 4. Ordem de execução recomendada (Fase 1)

1. Modelo de dados (perfil + templates + links + events).
2. Seed dos 2 templates.
3. APIs: templates, generate link, eventos.
4. Rota pública /l/[slug] e componente de quiz/calculadora.
5. Interpret (texto → perfil + template).
6. Noel: atualizar system prompt com perfil completo e estrutura de resposta.
7. UI: “Meus links”, “Criar link”, integração com interpret.

---

## 5. O que não fazer (agora)

- Não alterar Nutri nem Wellness.
- Não criar CRM, agenda, prontuário.
- Não criar um app ou trilha separada por nicho; tudo via contexto no perfil.

---

## 6. Referências

- Perfil: `docs/PERFIL-EMPRESARIAL-YLADA-MODELO.md`, `migrations/204-ylada-noel-profile.sql`
- Trilha: `docs/TRILHA-EMPRESARIAL-ESTRUTURA-NECESSIDADES-PLAYBOOKS.md`, `migrations/202-*`, `203-*`
- Diretriz filtragem: documento “DIRETRIZ ESTRUTURAL — FILTRAGEM DE PÚBLICO E CONEXÃO NOEL ↔ PERFIL”
- Motor de conversas: documento “YLADA MOTOR DE CONVERSAS”
