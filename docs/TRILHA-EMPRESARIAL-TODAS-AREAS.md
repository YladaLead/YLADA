# Trilha Empresarial para todas as áreas YLADA

## Resumo

- **A trilha do Nutri já encaixa** em estrutura (fluxo por etapas, filosofia, identidade, rotina, metas, posicionamento). Serve como base única para med, psi, odonto, nutra, coach.
- **Posicionamento**: a Trilha Empresarial é um fluxo por etapas, sem vínculo a dias ou datas. Na interface usamos **Etapas** e **Blocos** (não "Dia 1", "30 dias", "Semana X"). O backend mantém `day_number` e `week_number` apenas como ordem.
- O que precisava de ajuste era só a **redação**: parte do conteúdo falava em “Nutri-Empresária” e “prática nutricional”. Foi generalizado para “profissional” e “sua prática” na tabela `journey_days`, para **uma única trilha** atender todos os grupos.
- **Acesso**: a API de jornada (`/api/nutri/formacao/jornada`) já aceita qualquer usuário autenticado (sem restrição de perfil). Med, psi, etc. podem usar a mesma API e o mesmo progresso (`journey_progress` é por `user_id`).
- **Hoje**: no Med, o menu “Trilha empresarial” redireciona para `/pt/nutri/formacao?tab=jornada`. Todos veem a mesma trilha; o conteúdo no banco está em linguagem neutra.

---

## O que já encaixa (Nutri → todos)

| Aspecto | Situação |
|--------|----------|
| Estrutura | Fluxo por etapas (30 etapas em 4 blocos), objetivos, orientação, checklist, pilares. Sem vínculo a dias/datas. Serve para qualquer profissional. |
| Temas | Filosofia YLADA, identidade, rotina, metas, posicionamento, atendimento, GSAL. Transversais a todas as áreas. |
| Progresso | `journey_progress` por `user_id`. Um usuário tem um único progresso, seja ele de Nutri, Med ou outra área. |
| API | `GET /api/nutri/formacao/jornada` usa `requireApiAuth(request)` sem lista de perfis → qualquer usuário autenticado pode chamar. |

---

## O que foi ajustado

1. **Textos em `journey_days`**  
   Migração que generaliza a redação:
   - “Nutri-Empresária” → “profissional” / “profissional que atua como empresário(a)” onde fizer sentido.
   - “prática nutricional” → “sua prática”.
   - Outras menções específicas de “nutricionista” nos dias da jornada foram trocadas por termos neutros (“profissional”, “sua prática”, “seu negócio”).

2. **Uma trilha, todos os grupos**  
   Não foi criada trilha separada por área. A mesma tabela `journey_days` (e o mesmo conteúdo generalizado) é usada por Nutri, Med, Psi, Odonto, Nutra e Coach.

---

## Recomendações de uso

- **Manter uma única trilha** no banco, com linguagem neutra, para evitar duplicação e manter um único progresso por usuário.
- **Med (e outras áreas)** podem continuar redirecionando para `/pt/nutri/formacao?tab=jornada` ou, no futuro, exibir a mesma jornada em uma página própria (ex.: `/pt/med/formacao`) usando a mesma API e apenas trocando header/links “Voltar” para a área correspondente.
- **Noel** pode usar as respostas da trilha (reflexões, anotações) para personalizar orientações, quando essa integração estiver implementada.

---

## Arquivos relacionados

- API jornada: `src/app/api/nutri/formacao/jornada/route.ts`
- Conteúdo inicial da jornada: `migrations/populate-jornada-30-dias.sql`
- Generalização dos textos: `migrations/200-generalizar-jornada-todas-areas.sql`
- Med redireciona para: `/pt/nutri/formacao?tab=jornada` em `src/app/pt/med/(protected)/formacao/page.tsx`
