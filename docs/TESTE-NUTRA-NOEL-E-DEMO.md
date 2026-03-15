# Teste Nutra: Noel + todas as funcionalidades + e-mail demo

Roteiro para **avaliar a performance do Noel** e **todas as funcionalidades** da área Nutra desde a entrada, usando um **e-mail de demo**.

---

## Onde estão os documentos de teste

| Documento | Uso |
|-----------|-----|
| **`docs/TESTE-AREA-NUTRA-PASSO-A-PASSO.md`** | Teste geral da área Nutra (rotas públicas, protegidas, checkout, checklist). |
| **Este arquivo** | Foco em **Noel**, **todas as telas/funcionalidades** desde a entrada e **conta demo Nutra**. |

---

## E-mail de demo Nutra

**Não existia** conta demo para Nutra (só Nutri e Coach). Foi adicionado:

- **E-mail:** `demo.nutra@ylada.app`
- **Senha:** `Demo@2025!` (mesmo padrão de todas as contas demo para vídeos)

### Como criar a conta demo Nutra (uma vez)

1. **Criar usuário + perfil** (Supabase Auth + `user_profiles`):
   ```bash
   npx ts-node scripts/seed-demo-data.ts
   ```
   Para Nutra use o script de contas demo para vídeos: `node scripts/criar-contas-demo-videos.js` — cria `demo.nutra@ylada.app` com perfil `nutra`.

2. **Garantir assinatura ativa** (o script não cria assinatura; é preciso rodar a migration):
   - No Supabase: SQL Editor → abrir e executar o conteúdo de **`migrations/271-conta-demo-nutra-assinatura.sql`**.
   - Isso cria/atualiza a assinatura para `demo.nutra@ylada.app` (ou .com).

Se a conta já existir (ex.: criada por `criar-contas-demo-videos.js`), rode só a **migration 271** para ativar a assinatura Nutra.

---

## Roteiro: desde a entrada até Noel e todas as funcionalidades

Fluxo sugerido para testar **performance do Noel** e **todas as funcionalidades** da área Nutra na ordem em que o usuário vive.

### 1. Entrada (sem login)

| # | Ação | O que verificar |
|---|------|-----------------|
| 1 | Abrir `/pt/nutra` | Landing Nutra carrega; botão “Já tenho conta” leva ao login. |
| 2 | Abrir `/pt/nutra/oferta` | Oferta com planos; botões levam ao checkout. |
| 3 | Abrir `/pt/nutra/checkout` | Checkout com e-mail e plano; sem quebrar. |

### 2. Login e Home (Noel)

| # | Ação | O que verificar |
|---|------|-----------------|
| 4 | Ir em `/pt/nutra/login` e entrar com `demo.nutra@ylada.app` / `Demo@2025!` | Login OK; redirecionamento para `/pt/nutra/home`. |
| 5 | Na **Home** (`/pt/nutra/home`) | Título “Noel — Mentor estratégico para nutra”; chat do Noel visível e carregando. |
| 6 | **Performance do Noel:** enviar uma mensagem no chat (ex.: “Como organizo minha semana de vendas?” ou “Me dá um script leve para oferecer suplemento”) | Resposta em tempo razoável; tom de mentor Nutra (nutraceuticos/suplementos); sem erro na tela. |
| 7 | Enviar mais 1–2 perguntas (ex.: “Como crio um link para cliente?”) | Noel responde de forma coerente com o contexto Nutra. |

### 3. Navegação e funcionalidades (smoke test)

Com o mesmo usuário logado, abrir cada rota e checar se carrega (sem 404, sem redirect para login).

| # | Página | URL | O que verificar |
|---|--------|-----|-----------------|
| 8 | Biblioteca | `/pt/nutra/biblioteca` | Lista de materiais (pode estar vazia). |
| 9 | Links | `/pt/nutra/links` | Lista de links inteligentes. |
| 10 | Novo link | `/pt/nutra/links/novo` | Formulário de criação; salvar ou cancelar sem erro. |
| 11 | Leads | `/pt/nutra/leads` | Lista de leads. |
| 12 | Crescimento | `/pt/nutra/crescimento` | Página de crescimento. |
| 13 | Diagnóstico profissional | `/pt/nutra/crescimento/diagnostico-profissional` | Fluxo de diagnóstico. |
| 14 | Diagnóstico conversa | `/pt/nutra/crescimento/diagnostico-conversa` | Histórico/chat diagnóstico. |
| 15 | Diagnóstico cliente | `/pt/nutra/crescimento/diagnostico-cliente` | Métricas cliente. |
| 16 | Método | `/pt/nutra/metodo` | Conteúdo do método. |
| 17 | Configuração | `/pt/nutra/configuracao` | Configurações. |
| 18 | Perfil empresarial | `/pt/nutra/perfil-empresarial` | Perfil empresarial. |
| 19 | Onboarding | `/pt/nutra/onboarding` | Onboarding (se existir). |

### 4. Resumo do que você testou

- **Entrada:** landing, oferta, checkout.
- **Noel:** home, chat, performance e tom Nutra.
- **Funcionalidades:** biblioteca, links (lista + novo), leads, crescimento (3 subpáginas), método, configuração, perfil empresarial, onboarding.

---

## Checklist rápido (pós-teste)

- [ ] Documento de teste geral: `docs/TESTE-AREA-NUTRA-PASSO-A-PASSO.md`
- [ ] Conta demo: `demo.nutra@ylada.app` criada e com assinatura ativa
- [ ] Login Nutra → `/pt/nutra/home`
- [ ] Noel na home: responde no contexto Nutra e em tempo aceitável
- [ ] Todas as páginas da tabela acima abrem sem 404 e sem redirecionar para login
