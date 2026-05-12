# CLAUDE.md — Contexto do Projeto Ylada
## Leia este arquivo no início de TODA sessão de código

**Última atualização:** 11/05/2026

> Para contexto completo de estratégia e marketing, leia:
> `/Users/air/Desktop/Ylada-Workspace/CLAUDE.md`

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

## O QUE IMPLEMENTAR AGORA (prioridade)

### 1. Quiz pré-diagnóstico socrático
**Spec completa:** `/Users/air/Desktop/Ylada-Workspace/Carol_Quiz_Pre_Diagnostico.md`

Fluxo técnico:
- 7 perguntas → captura nome + WhatsApp + email
- Resultado dinâmico (3 perfis) baseado nas respostas
- Dados salvos no Supabase com tags de perfil e hipótese
- Disparo automático: mensagem Carol no WhatsApp + lead no HubSpot + email MailerLite

### 2. Integração Carol — WhatsApp Business API (Meta oficial)
**Spec completa:** a ser criada (próxima sessão)

Fluxo:
- Webhook recebe mensagem → OpenAI processa com prompt da Carol → responde
- Contexto da conversa salvo no Supabase
- Lead qualificado → criado/atualizado no HubSpot
- Appointment confirmado → evento no calendário + lembrete automático

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
| WhatsApp Business API | 🔲 Implementar | WHATSAPP_TOKEN, WHATSAPP_PHONE_ID |

---

*Atualizar ao implementar novas features.*
