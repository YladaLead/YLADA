# Plano: YLADA — Produto principal (ambiente novo)

**Objetivo:** Construir o YLADA como produto principal — ambiente novo, separado de Nutri e Wellness, para profissionais liberais e vendedores de suplementos. Posicionamento: a melhor plataforma do tipo no mundo; novidade e única, vendável para todos esses públicos.

---

## 1. O que ficou definido

### Produto e nome
- O produto **é o próprio YLADA**. Ambiente novo, criado à parte; não altera Nutri nem Wellness.
- Futuramente pode haver migração de usuários Wellness/Nutri para esse ambiente.
- Nome de entrada/URL a definir (ex.: `/pt/ylada`, `/pt/pro`, ou manter uma única landing YLADA que leva a esse ambiente).

### Quem entra (v1) — áreas/segmentos
- **Profissionais liberais:** médicos, dentistas, nutricionistas, psicólogos (no início). Depois: educação física e outras.
- **Vendedores:** vendedores de suplementos gerais (Trace, Iko, etc.). Um vendedor pode atuar em várias linhas; os desafios práticos são os mesmos.
- Usuário é sempre **usuário YLADA**, **pré-qualificado por área** (medicina, psicologia, nutrição, educação física, vendedor). A área permite à Noel e aos fluxos terem particularidades por segmento, com muita base comum.

### Filosofia e valor
- **Agregar valor primeiro**, depois criar links.
- **Desafios práticos** que o Noel ajuda a resolver: orientação diária, organização de agenda, o que postar, como se comunicar — tudo embasado na filosofia YLADA.
- **Link** = sempre agregar valor → fluxo → **diagnóstico** → **CTA** (WhatsApp). Objetivo: despertar interesse e curiosidade, levar a pessoa a querer procurar o profissional e clicar no botão.

### Noel (IA)
- Nome: **Noel** (mesma inteligência para esse ambiente).
- Atua **até o momento** em que o usuário entrega um **lead mais qualificado**: orientação sobre forma de atender, sugestões básicas — **não mais do que isso** (não faz o atendimento em si).
- Noel faz **separação por área** (medicina, psicologia, nutrição, educação física, vendedor) para otimizar respostas, com muita coisa em comum e particularidades por segmento.

### Fluxos
- **Templates prontos por área:** estudo prévio do que dentistas, nutricionistas, médicos, psicólogos (e vendedores) precisam; fluxos já formatados disponibilizados.
- **Criação de fluxo:** usuário pode criar fluxo **com orientação do Noel** — **manualmente** (não automático). Inclui o diagnóstico: se for fácil fazer de forma automática (Noel gera a partir de perguntas), ok; senão, Noel direciona por perguntas e o usuário faz manualmente. Automático quando possível.
- **Modelo de fluxos:** pode ser **pago à parte** (a definir). Plataforma disponibiliza tipos de fluxos; usuário também pode criar com apoio do Noel.

### Diagnóstico
- **Embasado em algo oficial:** OMS (Organização Mundial da Saúde) ou órgão correspondente da área.
- Deve: despertar interesse e curiosidade, ser sincero e honesto, agregar valor, fazer a pessoa pensar “preciso procurar mais ajuda” e provocar o clique no WhatsApp.

### Conta e usuário
- Usuário desse ambiente = **usuário YLADA**, pré-qualificado por área. Mesmo ecossistema (ex.: mesmo Supabase Auth), com identificação de “ambiente” ou “produto” (ylada vs nutri vs wellness) para não misturar com Nutri/Wellness.

---

## 2. Diferenciais para ser “a melhor plataforma que pode existir”

| Diferencial | Como entregar |
|-------------|----------------|
| **Diagnóstico com base oficial** | Todo diagnóstico referenciado a OMS/órgão da área; transparência e credibilidade. |
| **Agregar valor antes do CTA** | Fluxo e copy desenhados para valor + insight, depois CTA; nunca só “clique aqui”. |
| **Noel por área** | Uma IA, vários contextos (medicina, psicologia, nutrição, educação física, vendedor); respostas otimizadas por segmento. |
| **Templates + criação guiada** | Templates prontos por área + criação manual com orientação do Noel (e automação onde der). |
| **Uma filosofia, todos os públicos** | Mesma base (organização, comunicação, links que agregam valor) aplicada a cada área. |
| **Escalável por área** | Novas áreas = novos templates + config da Noel + perguntas; sem refazer produto. |

---

## 3. Arquitetura sugerida (resumo)

- **Uma entrada:** landing YLADA → cadastro/onboarding → escolha de **área** (medicina, odonto, nutrição, psicologia, educação física, vendedor suplementos).
- **Perfil:** área + dados do profissional (objetivo, tipo de atendimento, dor que resolve, etc.). Noel e os fluxos usam isso.
- **Noel:** assistente único, contexto por área; foco em desafios práticos até a entrega do lead qualificado + sugestões básicas de atendimento.
- **Fluxos:** (1) Templates prontos por área, (2) Criação com orientação do Noel (manual com sugestão/automático quando possível). Todo fluxo → valor → diagnóstico (base oficial) → CTA WhatsApp.
- **Diagnóstico:** regra de negócio: referência a OMS/órgão; texto claro, honesto, que gera “quero saber mais” e leva ao clique.
- **Dados:** áreas em config ou banco; perguntas e templates por área; sessões de criação de link; links gerados (slug, content, diagnóstico aprovado). Tudo separado do código de Nutri/Wellness.

---

## 4. Fases do planejamento (como montar para ficar world-class)

### Fase A — Fundação e posicionamento (antes de codar)
1. **Nome/URL do ambiente:** Definir nome do produto (YLADA / YLADA Pro / outro) e rota de entrada (`/pt/ylada` ou outra).
2. **Lista oficial de áreas v1:** medicina, odonto, nutrição, psicologia, vendedor_suplementos (e depois educação física).
3. **Regra de diagnóstico:** Documento curto: “Todo diagnóstico deve citar ou basear-se em OMS/órgão X”; lista de fontes por área (OMS, CFM, CFP, CRN, etc.).
4. **Estudo por área:** Por que cada segmento (dentista, médico, nutricionista, psicólogo, vendedor) usa o link; que tipo de fluxo/diagnóstico agrega valor; 2–3 templates “âncora” por área.

### Fase B — Ambiente novo (código)
1. **Estrutura de rotas e auth:** Criar rotas do novo ambiente (ex.: `pt/ylada`, `pt/ylada/login`, `pt/ylada/(protected)/...`) sem alterar Nutri/Wellness. Auth: mesmo Supabase, com flag ou tabela que identifica “ylada” vs “nutri” vs “wellness”.
2. **Onboarding por área:** Tela de escolha de área (medicina, odonto, nutrição, psicologia, vendedor); salvar em perfil; telas e Noel recebem área.
3. **Config por área:** Arquivo ou tabela de áreas com labels, slug, ativo; conteúdo (microcopy, perguntas) por área. Noel usa área em todo contexto.

### Fase C — Noel
1. **Noel no ambiente YLADA:** Integrar assistente (ou adaptar Noel existente) para esse ambiente; system prompt com filosofia YLADA (agregar valor, organização, comunicação, links).
2. **Noel por área:** Mapas de prompt ou contexto por área (medicina, psicologia, nutrição, etc.) para particularidades; base comum compartilhada.
3. **Limite de atuação:** Noel até “lead qualificado” + sugestões básicas de atendimento; não faz atendimento completo (deixar claro no produto e no prompt).

### Fase D — Fluxos e diagnósticos
1. **Templates prontos:** Por área, 2–3 fluxos âncora (quiz/calculadora) com diagnóstico já alinhado a OMS/órgão; disponíveis para o usuário ativar e personalizar (WhatsApp, texto).
2. **Criação de fluxo com Noel:** Wizard: Noel faz perguntas → sugere estrutura de fluxo e texto de diagnóstico (quando automático) ou orienta o usuário a montar manualmente. Persistir fluxo e diagnóstico aprovado; gerar link.
3. **Diagnóstico:** Sempre com campo ou regra “referência oficial”; na geração (manual ou IA) exigir/citar fonte. Revisão humana antes de publicar, se necessário.

### Fase E — Página pública e CTA
1. **Página do link:** `/link/[slug]` (ou rota dedicada) que exibe fluxo → resultado → diagnóstico (base oficial) → CTA WhatsApp. Mensuração de cliques.
2. **Mensuração:** Cliques no link, visualizações, cliques no WhatsApp; por área e por usuário.

### Fase F — Produto e expansão
1. **Modelo de fluxos:** Definir se templates são gratuitos e criação é paga, ou outro modelo; comunicar no produto.
2. **Novas áreas:** Educação física e outras; processo: estudo → templates + config Noel + perguntas → ativar área.
3. **Migração (futuro):** Plano opcional para migrar usuários Wellness/Nutri para o ambiente YLADA quando desejado.

---

## 5. Próximos passos imediatos (ordem sugerida)

1. **Decisão:** Nome/URL do ambiente (ex.: YLADA, `/pt/ylada`) e confirmação da lista de áreas v1.
2. **Regra de diagnóstico:** Documento “Diagnóstico YLADA” (base OMS/órgão, por área).
3. **Estudo por área:** 1–2 páginas por segmento (o que entregar, 2–3 ideias de template âncora).
4. **Criação da estrutura no código:** Rotas do novo ambiente + onboarding por área + perfil com área (sem mexer em Nutri/Wellness).
5. **Noel:** Integração no ambiente YLADA + contexto por área.
6. **Templates + criação de fluxo:** Primeiro conjunto de templates por área; depois wizard de criação com orientação do Noel.
7. **Diagnóstico e CTA:** Garantir referência oficial em todo diagnóstico e CTA claro na página do link.

Com isso o planejamento fica alinhado ao que você descreveu e preparado para evoluir até uma plataforma referência mundial para profissionais liberais e vendedores de suplementos.
