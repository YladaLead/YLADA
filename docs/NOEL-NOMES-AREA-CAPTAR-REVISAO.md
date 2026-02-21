# Revisão: alinhamento dos nomes Noel ↔ área Captar

## Objetivo

O Noel deve mostrar **exatamente** os mesmos nomes que a nutricionista vê na **área Captar** (tela de ferramentas com Preview, Link, QR, Scripts), para evitar confusão (ex.: "Quiz DSVS" vs "Avaliação do Perfil Metabólico").

---

## Fontes de dados

| Onde | Fonte | Campo do nome |
|------|--------|----------------|
| **Tela Captar (grid)** | `GET /api/nutri/templates` → tabela `templates_nutrition` | `name` (exposto como `nome` no front) |
| **Listagem "minhas ferramentas"** | `GET /api/nutri/ferramentas` → `user_templates` + `quizzes` | `user_templates.title` / `quizzes.titulo` (exposto como `title` na API) |
| **Noel (links_ativos)** | `buildNoelNutriContext` → `user_templates` + `quizzes` | Ver regra abaixo |

A tela Captar que a usuária vê (com os cards) usa **catálogo** (`templates_nutrition`). As **instâncias** que ela criou estão em `user_templates` e `quizzes`. O Noel só pode sugerir links que existem → usa **instâncias** (user_templates + quizzes), mas o **nome** exibido deve ser o mesmo que ela vê no Captar.

---

## Regra única (fonte do nome)

1. **Ferramentas (user_templates)**  
   - Se `title` estiver preenchido → usar `title`.  
   - Senão → usar nome do **catálogo** (`templates_nutrition.name`) quando houver correspondência por `slug` ou `template_slug`.  
   - Senão → usar `NOME_AMIGAVEL_POR_TEMPLATE[template_slug]` (fallback estático).  
   - Senão → `"Ferramenta"`.

2. **Quizzes (quizzes)**  
   - Sempre usar `titulo` (nome que a nutricionista definiu no quiz).  
   - Se vazio → `"Quiz"`.

3. **Só links da área de captar**  
   - Não incluir "Painel do dia", "Jornada" etc. em `links_ativos`.  
   - Só entram ferramentas (`user_templates`) e quizzes (`quizzes`).

---

## Onde está implementado

- **Build do contexto Noel:** `src/lib/noel-nutri/build-context.ts`  
  - Busca o catálogo `templates_nutrition` (slug, name) para alinhar nomes ao Captar.  
  - Monta `links_ativos` a partir de `user_templates` e `quizzes`.  
  - Nome das ferramentas: `title` → nome no catálogo por `slug` ou `slug` sem sufixo numérico → `NOME_AMIGAVEL_POR_TEMPLATE` → `"Ferramenta"`.  
  - Nome dos quizzes: `titulo` ou `"Quiz"`.  
- **API de ferramentas:** `src/app/api/nutri/ferramentas/route.ts`  
  - Listagem usa `title` (user_templates) e `title: quiz.titulo` (quizzes).  
- **Tela Captar:** `src/app/pt/nutri/ferramentas/templates/page.tsx`  
  - Usa `GET /api/nutri/templates` (catálogo) e exibe `template.nome` (= `templates_nutrition.name`).

---

## Checklist de manutenção

- [ ] Ao adicionar novo template no catálogo (`templates_nutrition`), conferir se `NOME_AMIGAVEL_POR_TEMPLATE` ou o uso do catálogo em build-context cobre o nome exibido no Captar.
- [ ] Não adicionar links fixos (Painel, Jornada) em `links_ativos`; só ferramentas e quizzes.
- [ ] Conversão (fechar consulta): em ONDE APLICAR usar "WhatsApp / conversa com o lead", não link de ferramenta.
