# Implantação — Pro Estética Corporal

Guia curto para **operadores** e **dev**: colocar o produto no ar e validar com cliente.

**Prioridade:** fechar **este fluxo (corporal)** com cliente antes de investir na checklist capilar ([IMPLANTACAO-TERAPIA-CAPILAR.md](./IMPLANTACAO-TERAPIA-CAPILAR.md)).

## Definição de “pronto” (corporal)

Marcar como **go-live corporal** quando **todos** forem verdade:

1. Migrations necessárias aplicadas no ambiente do cliente (incl. **345** se usarem calculadora de IMC atualizada).
2. Smoke da secção **§3** passou em staging/produção no mesmo URL que o cliente usará.
3. WhatsApp ou contacto no perfil testado no fluxo público `/l/…`, se CTA for requisito.
4. Documento ou mensagem única ao cliente com URL do painel + onde criar links + Noel.

Até lá, terapia capilar fica **planeamento secundário**.

## Continuação (este repo)

- Títulos do separador no painel corporal: `painel/layout.tsx` com template `%s | Pro Estética Corporal` e default **Início**; secções com `layout.tsx` próprio: **Links**, **Noel**, **Perfil**, **Mensagens prontas**, **Retenção**, **Captar**, **Fechar**, **Acompanhar**, **Resultados**, **Catálogo**, **Equipe**.
- Após validar smoke: commit/deploy e aplicar SQL pendente (ex. migration **345** no ambiente do cliente, se aplicável ao rollout).

## 1. Pré-requisitos no ambiente

- **Variáveis**: Supabase (`NEXT_PUBLIC_*`, service role onde aplicável), `OPENAI_API_KEY` (Noel no painel corporal).
- **Deploy**: mesmo branch/commit que foi testado em staging/local para o primeiro cliente.

## 2. Base de dados (ordem sugerida)

Aplicar migrations pendentes no projeto (via fluxo habitual do repo: Supabase CLI ou SQL manual).

Incluir, conforme necessidade de negócio:

- Templates e conteúdos da biblioteca corporal (ex.: quizzes/calculadoras já versionados nas migrations da pasta `migrations/`).
- **`345-ylada-calc-imc-idade-sexo-template-e-links.sql`**: atualiza calculadora de IMC (idade/sexo no formulário; fórmula mantém só peso/altura) e sincroniza links antigos com 2 campos.

Após SQL: confirmar que `ylada_link_templates` e links ativos refletem o esperado.

## 3. Smoke test (obrigatório antes do cliente)

| # | Fluxo | Critério de sucesso |
|---|--------|----------------------|
| 1 | Login → `/pro-estetica-corporal/painel` | Entra sem redirect inesperado (acesso ao tenant corporal). |
| 2 | **Início** → cartão “Atrair” → Noel com `?focus=atrair` | Chat abre com mensagem inicial coerente. |
| 3 | Menu **Links** → `/painel/biblioteca-links` | Abas “Biblioteca” e “Os teus links”; biblioteca só modelos **corporais** (sem mistura facial/capilar). |
| 4 | Biblioteca → criar link → abrir `/l/{slug}` | Funil público carrega; calculadora/quiz conforme modelo; CTA WhatsApp se número no perfil. |
| 5 | Noel | Pedir “link de diagnóstico” e confirmar orientação para YLADA/Biblioteca (não formulários externos como caminho principal). |

Mobile: repetir pelo menos **3** e **4**.

## 4. Entrega ao cliente (1 página)

- URL do painel: `…/pro-estetica-corporal/painel`
- Onde criar links: **Links** no menu lateral
- Onde usar o Noel: **Noel** no menu lateral
- Suporte: canal acordado comercialmente

## 5. Noel — tom por operação (corporal e capilar)

Os dois mentores (`/api/pro-estetica-corporal/noel` e `/api/pro-estetica-capilar/noel`) usam os campos do tenant **`leader_tenants`**: `message_tone`, `message_tone_notes`, `focus_notes`, para individualizar respostas sem misturar verticais. Garantir que a UI de configuração (onde existir) persiste estes valores para produção.

## 6. Terapia capilar (fase seguinte)

Repetir smoke com rotas `/pro-estetica-capilar/…` — biblioteca só modelos **capilares**; Noel com pedidos típicos (roteiros WhatsApp, link de diagnóstico). **Após** corporal estável.

