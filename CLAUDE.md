# CLAUDE.md — Contexto do Projeto Ylada
## Leia este arquivo no início de TODA sessão de código

**Última atualização:** 22/06/2026

> Para contexto completo de estratégia e marketing, leia:
> `/Users/air/Desktop/Ylada-Workspace/CLAUDE.md`

---

## CALCULADORAS YLADAFLOW (biblioteca serviço — Chat5)

**Decisão (22/06):** IMC personaliza a **leitura** por sexo + idade — **não o número** (fórmula OMS igual). Régua refinada: só perguntar o que muda o **número** ou a **leitura** de forma real.

**Copy da devolutiva:** lookup determinístico em `devolutiva.porFaixa` do molde (Spec §7 — economia de token + controle). **Não** gerar por IA no resultado. Merge: `bloco` → `porSexo` → `porIdade` (mais específico por último).

**Onde vive:**
- Moldes: `src/lib/ylada-flow/bibliotecas/calculadoras/{imc,calorias,proteina,hidratacao}.ts`
- Contrato: `src/types/ylada-flow.ts`
- Runtime: `src/lib/ylada-flow/ylada-flow-calculator-runtime.ts`
- Fórmulas: `src/lib/ylada-flow/bibliotecas/formulas/`
- Blueprint: `blueprint-plataforma/Chat5_Calculadoras_Revisao_Formulas.md`, `Chat5_Calculadoras_Engine_Briefing_Cursor.md`

**Pendência aberta:** nó copy molde × gerada por IA em outros fluxos (quiz/diagnóstico) — calculadoras com molde já são lookup puro.

---

## SOBRE O PROJETO

**Ylada.com** — Plataforma SaaS de diagnóstico contínuo de negócios com IA + método socrático proprietário.

**Fundador:** Andre Faula (faulaandre@gmail.com)
**Stack:** Next.js 15 + TypeScript + TailwindCSS + Supabase (PostgreSQL + Auth + RLS) + Vercel + OpenAI GPT-4

---

## AGENTES DE IA DO YLADA

Todos da família **Noel**, com nomes e funções específicas:
- **Carol** — atendimento via WhatsApp + Instagram DM. Scripts em `/Users/air/Desktop/Ylada-Workspace/Carol_Persona_e_Scripts.md`
- Outros agentes a documentar conforme forem criados.

---

## DIREÇÃO ESTRATÉGICA

Ylada está se repositionando de "ferramenta de links/quizzes" para **plataforma de diagnóstico contínuo de negócios**.

Os quizzes e calculadoras são a entrada do funil de diagnóstico — não o produto em si.

**Público atual:** Donas de clínica de estética capilar e corporal (Brasil)
**Backend monetization:** Consultoria humana R$9.500 (12x R$980)

---

## YLADA BOARDS — MÓDULO INDEPENDENTE (implementado 27/05/2026)

Ferramenta de atalhos de mensagens para WhatsApp — similar ao app Boards. Pastas com cards de texto prontos para copiar com um toque. Variáveis `{{nome}}` substituíveis antes de copiar.

### Arquitetura de 3 camadas (decisão tomada)
1. **Boards pessoal** — cada usuário tem seus próprios boards. ✅ Implementado.
2. **Boards do líder para equipe** — líder cria conteúdo, equipe acessa somente leitura. ⏳ Aguardando app nas lojas.
3. **Teclado nativo** — aparece dentro do WhatsApp sem sair do app (igual Boards app). ⏳ Aguardando aprovação Apple + Google Play.

### Tabelas Supabase
```
ylada_boards      — pastas (tenant_id = user.id:area)
ylada_board_cards — cards dentro das pastas (FK → ylada_boards, CASCADE)
```
⚠️ SQL de renomear tabelas ainda precisa ser rodado no Supabase:
```sql
ALTER TABLE yscripts_boards RENAME TO ylada_boards;
ALTER TABLE yscripts_cards RENAME TO ylada_board_cards;
```

### Arquivos criados
- `src/app/api/ylada-boards/boards/route.ts` — GET (listar) + POST (criar)
- `src/app/api/ylada-boards/boards/[id]/route.ts` — PUT (editar) + DELETE (cascade)
- `src/app/api/ylada-boards/cards/route.ts` — GET (por board) + POST (cria, detecta variáveis)
- `src/app/api/ylada-boards/cards/[id]/route.ts` — PUT (editar, re-detecta vars) + DELETE
- `src/components/ylada-boards/YladaBoardsContent.tsx` — componente genérico (aceita prop `area`)
- `src/app/ylada-boards/page.tsx` — página standalone (`area="geral"`)

### Integração Pró Líderes
As páginas do Pró Líderes já usam o novo componente independente:
- `src/app/pro-lideres/painel/y-scripts/page.tsx` → `<YladaBoardsContent area="pro-lideres" />`
- `src/app/pro-lideres/membro/(area)/y-scripts/page.tsx` → `<YladaBoardsContent area="pro-lideres" />`

### Isolamento por área
`tenant_id = ${user.id}:${area}` — mesmo usuário pode ter boards diferentes em cada área do Ylada.

### Próximos passos do Ylada Boards (quando app nas lojas)
- Camada 2: painel do líder com upload de mídia + visão somente leitura do membro
- Camada 3: teclado nativo iOS (Custom Keyboard Extension) + Android (overlay permission)
- Storage de mídia: Supabase Storage agora, migrar para Cloudflare R2 em escala

### Commit pendente
```bash
git add -A && git commit -m "feat: Ylada Boards — módulo independente /ylada-boards + API + componente genérico + Pró Líderes migrado" && git push
```

---

## O QUE IMPLEMENTAR AGORA (prioridade)

### 1. Quiz pré-diagnóstico socrático
**Spec completa:** `/Users/air/Desktop/Ylada-Workspace/Carol_Quiz_Pre_Diagnostico.md`

Fluxo técnico:
- 7 perguntas → captura nome + WhatsApp + email
- Resultado dinâmico (3 perfis) baseado nas respostas
- Dados salvos no Supabase com tags de perfil e hipótese
- Disparo automático: mensagem Carol no WhatsApp + lead no HubSpot + email MailerLite

### 2. Integração Carol — WhatsApp Business API (Meta oficial)
Carol já está operacional. Ver detalhes no `/Users/air/Desktop/Ylada-Workspace/CLAUDE.md`.

### 3. Landing page do diagnóstico gratuito
Página simples dentro do Next.js:
- Headline, benefícios do diagnóstico, CTA para quiz ou agendamento direto
- Mobile-first (público acessa pelo celular)

---

## ARQUITETURA DE DADOS — LEADS

```sql
-- Tabela de leads do quiz
leads_quiz (
  id uuid primary key,
  nome text,
  whatsapp text,
  email text,
  data_quiz timestamp,
  resposta_p1..p7 text,
  perfil_resultado text, -- 'negocio_invisivel' | 'subvaloriza' | 'sem_mapa'
  hipotese_principal text, -- 'a' | 'b' | 'c' | 'd'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  hubspot_id text,
  status text -- 'novo' | 'contatado' | 'diagnostico_agendado' | 'diagnostico_feito' | 'proposta'
)
```

---

## PADRÕES DO PROJETO

- Componentes em `/components`
- Páginas em `/app` (App Router Next.js)
- Lógica de negócio em `/lib`
- Tipos TypeScript em `/types`
- Variáveis de ambiente em `.env.local` (nunca commitar)
- RLS habilitado em todas as tabelas Supabase

---

## INTEGRAÇÕES ATIVAS

| Serviço | Status | Variável de ambiente |
|---|---|---|
| Supabase | ✅ | SUPABASE_URL, SUPABASE_ANON_KEY |
| OpenAI | ✅ | OPENAI_API_KEY |
| HubSpot | ✅ Cowork | via MCP |
| MailerLite | ✅ Cowork | via MCP |
| WhatsApp Business API | ✅ Implementado | WHATSAPP_TOKEN, WHATSAPP_PHONE_ID |

---

*Atualizar ao implementar novas features.*
