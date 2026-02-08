# Início da construção — YLADA (med, psi, psicanalise, odonto, nutra, coach)

**Escopo:** Construir a base YLADA com **med** (medicina; pode desmembrar por especialidade, ex. psiquiatria), **psi** (psicologia), **psicanalise** (psicanálise), **odonto**, **nutra** e **coach** no mesmo padrão. **Página /pt** = institucional falando de todas as áreas com direcionamento para cada uma. **Preservar apenas Nutri e Wellness**; Coach: rota /pt/coach mantida, conteúdo atual apagado e reconstruído do zero. Mesmo login Supabase; Noel = mesma base; fluxos + métricas; formação empresarial. Nutri pode ser migrada depois.

**Plano passo a passo (com decisões e entregas):** ver **docs/PLANO-CONSTRUCAO-YLADA-PASSO-A-PASSO.md**.

---

## Escopo fixo para esta fase

| Item | Decisão |
|------|--------|
| **Áreas (códigos)** | **med** (medicina; desmembrar por especialidade, ex. psiquiatria), **psi** (psicologia), **psicanalise** (psicanálise), **odonto**, **nutra** (vendedores), **coach**. |
| **Área médica (med)** | Psiquiatria **dentro da medicina**; área med identificada por especialidade (médico, psiquiatra, etc.) no perfil/escolha. |
| **Página /pt** | Página **institucional** YLADA falando de todas as áreas, com direcionamento (links) para cada área. |
| **Modelo** | Rotas: `/pt/med`, `/pt/psi`, `/pt/psicanalise`, `/pt/odonto`, `/pt/nutra`, `/pt/coach`. Barra /pt/c permanece (não é a área Coach). |
| **Noel** | Sempre a **mesma base**; contexto por área (med, psi, psicanalise, odonto, nutra, coach). |
| **Fluxos** | Plataforma **fornece** fluxos por área; usuário usa e personaliza. Métricas: **quem preenche** (leads), **cliques no link** (visualizações), **cliques no WhatsApp** (conversões). |
| **Formação empresarial** | Em cada área: conteúdo de empreendedorismo, organização, comunicação. |
| **Nutra** | Será **moldada** para o mesmo padrão desta base. |
| **Coach** | Conteúdo atual de pt/coach **apagado** e **reconstruído do zero** no mesmo padrão; rota permanece /pt/coach. |
| **Preservar (não mexer)** | **Apenas Nutri e Wellness.** Futuramente a Nutri pode ser transferida para esse modelo. |

---

## Métricas obrigatórias (fluxos e links)

Para cada **link/fluxo** que o usuário usa ou cria:

1. **Visualizações (cliques no link):** quantas vezes o link foi aberto.
2. **Preenchimentos:** quantas pessoas preencheram o fluxo (lead capturado).
3. **Cliques no WhatsApp:** quantas pessoas clicaram no botão CTA (WhatsApp).

Persistir por **link** e por **área** (med, psi, psicanalise, odonto, nutra, coach) para o usuário ver no dashboard e para relatórios internos.

---

## Estrutura de rotas (não mexe em Nutri/Wellness; nutra será adaptada)

```
/pt                          → página matriz YLADA (já existe ou ajustar)
/pt/med                      → landing medicina
/pt/med/login                → login
/pt/med/cadastro             → cadastro
/pt/med/(protected)/        → área logada medicina
  ├── home
  ├── dashboard              → métricas (links, preenchimentos, WhatsApp)
  ├── formacao               → formação empresarial
  ├── fluxos                 → lista de fluxos disponíveis + meus links
  ├── leads                  → quem preencheu
  └── configuracao
/pt/psi                      → idem (landing, login, protected...)
/pt/psicanalise              → idem (psicanálise)
/pt/odonto                   → idem
/pt/nutra                    → idem (já existe; será moldada ao mesmo padrão)
/pt/coach                    → idem (conteúdo atual apagado; reconstruído do zero no mesmo padrão)
```

Página pública do link (compartilhado): pode ser única, ex. `/link/[slug]`, com o payload vindo do banco (área, título, fluxo, diagnóstico, CTA). Ao abrir ou preencher ou clicar WhatsApp, registrar evento com `area` e `link_id`.

---

## Noel: mesma base, contexto por área

- **Um único assistente** (Noel); em toda chamada enviar no contexto a **área** do usuário (`med` | `psi` | `odonto` | `nutra`).
- **System prompt base** igual para todos; **blocos de contexto por área** (ex.: “Você está falando com um médico”; “com um psicólogo”; “com um vendedor Nutra”; “com um coach”; “com um psicanalista”) para exemplos e sugestões.
- Nenhuma lógica duplicada por área no código; apenas config/prompt por área.

---

## Formação empresarial

- Dentro de cada área (`/pt/med/(protected)/formacao`, etc.): conteúdo de **empreendedorismo aplicado** (organização, agenda, o que postar, como se comunicar, agregar valor, usar os links).
- Pode reutilizar conceito da área Nutri (pilares, jornada, blocos) com **conteúdo por área** (med, psi, odonto, nutra) em config ou banco.
- Acesso pelo menu da área protegida; Noel pode referenciar essa seção nas respostas.

---

## Ordem sugerida para começar a construção

### 1. Config e rotas base (sem alterar Nutri/Wellness; nutra será adaptada)
- Criar `src/config/ylada-areas.ts`: lista de áreas (**med**, **psi**, **odonto**, **nutra**) com codigo, slug, label, ativo.
- Criar estrutura de pastas e páginas mínimas:
  - `src/app/pt/med/page.tsx` (landing)
  - `src/app/pt/med/login/page.tsx`
  - `src/app/pt/med/(protected)/layout.tsx` (protegido por auth)
  - `src/app/pt/med/(protected)/home/page.tsx`
  - `src/app/pt/med/(protected)/dashboard/page.tsx`
- Repetir para `psi` e `odonto`; **nutra** já existe em `pt/nutra` — adaptar para usar a mesma config e mesmo layout.
- Garantir que a **página matriz** (`/pt`) direcione para as áreas (links Medicina, Psicologia, Odontologia, Nutra).

### 2. Perfil e auth
- Definir como identificar usuário YLADA (ex.: `user_profiles.ambiente = 'ylada'` ou `product = 'ylada'`) e **área** (`area = 'med' | 'psi' | 'odonto' | 'nutra'`).
- Onboarding/cadastro: após login, tela que escolhe área (se ainda não tiver); salvar no perfil.
- APIs de perfil e auth que leem essa área; não misturar com `perfil` Nutri/Wellness. Nutra passa a usar esse perfil (area = nutra).

### 3. Fluxos e métricas (backend)
- Tabela (ex. `ylada_links` ou equivalente) para links/fluxos do YLADA com `area`, `user_id`, `slug`, `content`, `diagnostico_aprovado`, etc.
- Eventos de métrica: **view**, **lead**, **whatsapp_click**. Tabela de eventos + tabela de leads; APIs: listar fluxos por área, criar/editar link, registrar view/lead/whatsapp_click.

### 4. Dashboard do usuário (métricas)
- Por link: visualizações, preenchimentos (leads), cliques WhatsApp.
- Por área: mesmo usuário pode ter links em uma ou mais áreas conforme perfil.

### 5. Noel
- Endpoint ou serviço único que recebe `user_id` (e daí lê `area` do perfil) + mensagem. System prompt base + contexto por área. Sem duplicar código por área.

### 6. Formação empresarial
- Páginas sob `(protected)/formacao` em cada área; conteúdo carregado por área (config ou CMS). Menu e blocos com base no que já existe na Nutri, adaptado para YLADA.

### 7. Página pública do link
- Rota `/link/[slug]` (ou sob YLADA) que carrega fluxo, exibe diagnóstico e CTA WhatsApp; ao carregar → registrar view; ao enviar formulário → registrar lead; ao clicar WhatsApp → registrar evento e redirecionar.

---

## Checklist rápido (primeiro sprint)

- [ ] Config `ylada-areas.ts` com **med**, **psi**, **psicanalise**, **odonto**, **nutra**, **coach**.
- [ ] Rotas `pt/med`, `pt/psi`, `pt/odonto` (landing + login + protected); **nutra** adaptada; **coach** limpo e reconstruído do zero.
- [ ] Perfil com `area` e identificação de ambiente YLADA (sem alterar Nutri/Wellness).
- [ ] Migrations/banco: links YLADA + eventos (view, lead, whatsapp_click).
- [ ] APIs: listar fluxos, registrar eventos, criar/editar link.
- [ ] Dashboard: exibir por link as métricas (cliques no link, preenchimentos, cliques WhatsApp).
- [ ] Noel: um endpoint, contexto por área (med, psi, psicanalise, odonto, nutra, coach).
- [ ] Formação empresarial: seção formacao em cada área com conteúdo por área.
- [ ] Página pública do link com registro de view, lead e clique WhatsApp.

**Ordem detalhada e decisões:** ver **docs/PLANO-CONSTRUCAO-YLADA-PASSO-A-PASSO.md**. Próximo passo: Fase 0 (decisões) e Fase 1 (config + rotas base).
