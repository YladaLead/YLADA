# Programação sensata — O que está pronto e próximo passo

Documento para manter eficiência e eficácia: **não alterar o que já funciona** e construir em cima da estrutura existente.

---

## 1. O que já está pronto (estrutura)

### Banco (migrations aplicadas)

| Item | Arquivo | Uso |
|------|--------|-----|
| Perfil Noel (category, sub_category) | 204, 205, 206 | Formulário perfil; APIs e Noel |
| Trilha empresarial (needs, steps, snapshot) | 202, 203 | Trilha; snapshot para Noel |
| Templates + Links + Eventos | 207, 208 | Motor de links; 2 templates seed |

### Tabelas do motor de links (207, 208)

- **ylada_link_templates**: id, name, type (quiz, calculator, triagem, diagnostico), schema_json, allowed_vars_json. RLS: SELECT autenticado.
- **ylada_links**: id, user_id, template_id, slug (único), title, config_json, cta_whatsapp, status (active/paused/archived). RLS: dono só acessa os próprios.
- **ylada_link_events**: link_id, event_type (view, start, complete, cta_click), utm_json, device. RLS: SELECT pelo dono do link; **INSERT só via API com service role** (visitante anônimo).

### APIs existentes (não mudar)

- **GET /api/ylada/templates** — lista templates ativos (auth).
- **GET /api/ylada/links** — lista links do usuário (auth).
- **POST /api/ylada/links/generate** — gera link (auth); retorna slug e url `/l/{slug}`.

### Front já usando essa estrutura

- **/pt/fluxos** (Links inteligentes): lista templates, lista links, gera link, exibe URL `/l/{slug}` e botão copiar.
- Nenhuma rota **/l/[slug]** existe ainda — o link gerado ainda não abre em lugar nenhum.

### Conclusão

- A **estrutura** (tabelas, seed, APIs de listagem e geração) está pronta e em uso.
- O que falta para o fluxo fechar: **página pública do link** + **registro de eventos** (view, cta_click) sem quebrar nada do que já está feito.

---

## 2. Próximo passo (único, focado)

**Objetivo:** Quem recebe o link (`/l/{slug}`) consegue abrir a página, ver o quiz/calculadora, clicar no WhatsApp e o sistema registra view e cta_click.

**O que NÃO fazer agora**

- Não alterar migrations 207/208 nem as APIs de templates/links/generate.
- Não criar interpret, bases ou IA ainda; isso vem depois (1.6, 1.7 e expansão).

**O que fazer (ordem sugerida)**

1. **API de eventos (nova)**  
   - **POST /api/ylada/links/events** (pública, sem auth).  
   - Body: `{ slug, event_type }` com `event_type` em `view | start | complete | cta_click`. Opcional: `utm_json`, `device`.  
   - Validar slug existe e link está `active`; inserir em `ylada_link_events` com **supabaseAdmin** (service role).  
   - Resposta: `{ success }` ou erro (slug inválido / link inativo).

2. **Rota pública do link**  
   - **GET /l/[slug]** → `src/app/l/[slug]/page.tsx`.  
   - No **server**: com supabaseAdmin, buscar em `ylada_links` por slug, join com `ylada_link_templates` para pegar `type` e `schema_json`. Se não existir ou status ≠ active → `notFound()`.  
   - Enviar para o client: dados necessários para renderizar (tipo do template, config_json do link, cta_whatsapp).

3. **Componentes de renderização (mínimos)**  
   - Um componente por tipo usado no seed: **diagnostico** (quiz com perguntas/opções e resultado) e **calculator** (campos numéricos + fórmula + resultado).  
   - Eles recebem o `config_json` (já pode vir com title, copy e variáveis do template).  
   - **view**: disparar POST em events ao montar a página (client).  
   - **cta_click**: ao clicar no botão WhatsApp, POST em events e em seguida redirecionar para `cta_whatsapp` (número ou link wa.me).  
   - Opcional: `start` ao começar o quiz; `complete` ao ver o resultado (podemos adicionar depois sem mudar a estrutura).

4. **Integração**  
   - Página `/l/[slug]`: server busca link + template; client renderiza quiz ou calculadora e chama a API de eventos.  
   - Fluxo em “Links inteligentes” continua igual; a única novidade é que a URL copiada passa a abrir de fato.

---

## 3. Depois desse passo (sem comprometer agora)

- **Interpret (1.6)** e **Noel (1.7)** com perfil completo e estrutura fixa.
- **Bases + IA** para gerar/customizar fluxos por usuário (templates, copy, perguntas).
- Eventos extras: `start`, `complete` com payload (ex.: resultado do quiz) para métricas melhores.

---

## 4. Resumo

| Já pronto | Próximo passo |
|-----------|----------------|
| Migrations 202–208; GET templates/links; POST generate; página /pt/fluxos; URLs `/l/{slug}` geradas | ~~1) API POST events 2) Rota /l/[slug] 3) Componentes quiz + calculadora 4) Registrar view e cta_click~~ **Feito.** |

### Implementado (Etapa 1.5)

- **POST /api/ylada/links/events** — pública; body `{ slug, event_type, utm_json?, device? }`; grava em `ylada_link_events` com service role.
- **Rota /l/[slug]** — server busca link por slug (admin), 404 se inativo; envia payload para o client.
- **PublicLinkView** — renderiza **diagnostico** (quiz com perguntas → resultado → CTA) e **calculator** (campos → fórmula → resultado → CTA); dispara **view** no mount e **cta_click** no botão WhatsApp; redireciona para `cta_whatsapp` (número ou URL).
- **Middleware** — `/l/` incluído nas rotas que não recebem prefixo `/pt`.

---

## 5. Para onde continuar (sem perder contexto nem propósito macro)

**Propósito macro:** Matriz YLADA = motor de conversas (tripé **Noel** + **Trilha** + **Links**). Um painel único; personalização por perfil (segment, category, dor); não alterar Nutri/Wellness.

**Ordem recomendada (Fase 1 — cronograma):**

| Ordem | Etapa | O quê | Por quê |
|-------|--------|--------|---------|
| **→ Agora** | **1.6** | **POST /api/ylada/interpret** — texto livre → perfil sugerido + template recomendado + confidence | Base para “Para que você quer usar o link?” na UI e para o Noel sugerir link/template; prepara bases + IA depois. |
| Depois | 1.7 | Noel: prompt com estrutura fixa (diagnóstico, estratégia, link, script, próximo passo) + injetar perfil completo | Resposta consistente no chat; usa perfil + (futuro) interpret. |
| Depois | 1.8 | UI: “Para que você quer usar o link?” em Links → interpret → preencher perfil e/ou gerar link | Fecha o ciclo: usuário descreve o uso da ferramenta com o público, sistema sugere template, usuário gera link. |

**Próximo passo concreto:** implementar **1.6 Interpret** (API que recebe texto e devolve `profileSuggest`, `recommendedTemplateId`, `confidence`), sem alterar o que já está pronto. Em seguida 1.7 (Noel) e 1.8 (UI integrada).

Mantendo essa ordem, a programação continua **sensata**, **eficiente** e alinhada ao propósito macro.
