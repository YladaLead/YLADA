# Teste da área Nutra — passo a passo (pré-lançamento segunda-feira)

Use este roteiro para validar que a área Nutra está funcionando antes do lançamento.

**Contexto:** A entrada é **única pelo hd.com** — não existe mais “área” no sentido de portal separado (Nutra, Nutri, etc.). Nutra é um **perfil/assinatura**: o usuário entra pelo mesmo lugar e vê o que é dele (Nutra, Nutri, etc.). Este teste verifica apenas que o **fluxo Nutra** (landing, oferta, checkout, home, links, etc.) funciona para quem é ou vira Nutra.

---

## Pré-requisitos

- [ ] App rodando (ex.: `npm run dev`)
- [ ] Banco de dados acessível
- [ ] Mercado Pago (ou gateway) configurado para testes, se for testar pagamento
- [ ] Um e-mail de teste que **não** tenha perfil Nutra ainda (para fluxo novo)

---

## 1. Rotas públicas (sem login)

### 1.1 Landing Nutra

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir `https://<seu-dominio>/pt/nutra` | Página de landing da área Nutra (YLADA · Nutra), sem redirecionar para login |
| 2 | Clicar em “Já tenho conta” | Ir para `/pt/nutra/login` |
| 3 | Clicar no logo/voltar | Voltar para `/pt/nutra` |

### 1.2 Página de oferta

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir `/pt/nutra/oferta` | Página de oferta com planos (mensal/anual) e botão para checkout |
| 2 | Clicar em plano mensal | Redirecionar para `/pt/nutra/checkout?plan=monthly` |
| 3 | Clicar em plano anual | Redirecionar para `/pt/nutra/checkout?plan=annual` |

### 1.3 Página de checkout (tela)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir `/pt/nutra/checkout` (ou `/pt/nutra/checkout?plan=annual`) | Página de checkout com campo de e-mail, seleção de plano e botão de pagamento |
| 2 | Deixar e-mail vazio e clicar em pagar | Mensagem de erro pedindo e-mail |
| 3 | Preencher e-mail válido e clicar em pagar | Chamada à API e redirecionamento para a URL do gateway (Mercado Pago/Stripe), ou mensagem de erro clara se algo falhar |

### 1.4 Login

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir `/pt/nutra/login` | Formulário de login (e-mail/senha) com redirect para Nutra |
| 2 | Inserir credenciais inválidas | Mensagem de erro |
| 3 | Inserir credenciais válidas de um usuário **com perfil Nutra** | Login OK e redirecionamento para `/pt/nutra/home` |

---

## 2. Área protegida (com login)

Faça login com um usuário que já tenha **perfil Nutra** e assinatura ativa (ou use admin/suporte para bypass).

### 2.1 Acesso à home

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Estar logado como Nutra e acessar `/pt/nutra` ou `/pt/nutra/home` | Redirecionar para `/pt/nutra/home` e exibir a home (Noel/conteúdo Nutra) |
| 2 | Abrir `/pt/nutra/home` diretamente | Home carrega sem pedir login |

### 2.2 Verificação de assinatura (API)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Com usuário logado Nutra, abrir DevTools → Network | — |
| 2 | Navegar para `/pt/nutra/home` (ou qualquer página protegida) | Requisição `GET /api/nutra/subscription/check` (ou `GET /api/[area]/subscription/check` com `area=nutra`) retorna `200` e `{ hasActiveSubscription: true }` (ou `bypassed: true` se admin/suporte) |

### 2.3 Páginas internas (smoke test)

Abrir cada URL **logado como Nutra** e verificar que a página carrega (sem 404 e sem redirecionar para login):

| Página | URL | O que verificar |
|--------|-----|-----------------|
| Home | `/pt/nutra/home` | Conteúdo da home (Noel/Nutra) |
| Biblioteca | `/pt/nutra/biblioteca` | Lista de materiais |
| Links | `/pt/nutra/links` | Lista de links inteligentes |
| Novo link | `/pt/nutra/links/novo` | Formulário de criação de link |
| Leads | `/pt/nutra/leads` | Lista de leads |
| Crescimento | `/pt/nutra/crescimento` | Página de crescimento |
| Diagnóstico profissional | `/pt/nutra/crescimento/diagnostico-profissional` | Fluxo de diagnóstico |
| Método | `/pt/nutra/metodo` | Conteúdo do método |
| Configuração | `/pt/nutra/configuracao` | Configurações da área |
| Perfil empresarial | `/pt/nutra/perfil-empresarial` | Perfil empresarial |
| Onboarding | `/pt/nutra/onboarding` | Onboarding (se existir para Nutra) |

### 2.4 Edição de link (fluxo rápido)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Ir em `/pt/nutra/links` | Lista de links (pode estar vazia) |
| 2 | Clicar em “Novo link” ou acessar `/pt/nutra/links/novo` | Formulário de novo link |
| 3 | Preencher e salvar (ou cancelar) | Sem erro de permissão; se salvar, volta à lista ou mostra sucesso |

---

## 3. (Opcional) Comportamento se acessar URL Nutra sem ser Nutra

No dia a dia todos entram pelo hd.com e o sistema leva cada um ao seu perfil. Este passo só importa se alguém **digitar na mão** a URL `/pt/nutra/home` sem ter perfil Nutra:

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Logado com usuário que **não** tem perfil Nutra | — |
| 2 | Acessar diretamente `/pt/nutra/home` | Redirecionamento para login ou “sem acesso” (não exibir conteúdo Nutra). Não é regra de negócio do lançamento — apenas comportamento técnico. |

---

## 4. Checkout e assinatura (fluxo completo opcional)

Se tiver ambiente de teste do Mercado Pago (ou outro gateway):

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Abrir `/pt/nutra/oferta` em aba anônima | Página de oferta |
| 2 | Escolher plano e ir para checkout | Checkout com campo de e-mail |
| 3 | Inserir e-mail **novo** (não cadastrado) e concluir pagamento de teste | Redirect para gateway → pagamento teste → sucesso |
| 4 | Verificar no banco (ou admin) | Usuário criado (ou encontrado), perfil Nutra atribuído, assinatura ativa para área `nutra` |
| 5 | Fazer login com esse e-mail em `/pt/nutra/login` | Acesso a `/pt/nutra/home` e às páginas protegidas |

Se **não** for testar pagamento agora, pule esta seção e deixe apenas os testes de tela de checkout (seção 1.3).

---

## 5. Admin / suporte (opcional)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1 | Login como admin (ou suporte) | — |
| 2 | Acessar `/pt/nutra/home` (e outras rotas Nutra) | Acesso liberado (bypass de assinatura) |
| 3 | Se existir painel admin de assinaturas/áreas | Ver área “Nutra” e assinaturas/usuários Nutra corretamente |

---

## 6. Resumo rápido (checklist mínimo)

- [ ] Landing `/pt/nutra` abre sem login  
- [ ] Oferta `/pt/nutra/oferta` e checkout `/pt/nutra/checkout` abrem e permitem preencher e-mail  
- [ ] Login `/pt/nutra/login` com usuário Nutra redireciona para `/pt/nutra/home`  
- [ ] Logado Nutra: home, biblioteca, links, leads, crescimento, metodo, configuracao, perfil-empresarial abrem sem 404  
- [ ] API `GET /api/nutra/subscription/check` (com cookie de sessão Nutra) retorna `hasActiveSubscription: true` ou `bypassed: true`  
- [ ] (Opcional) Fluxo de pagamento teste: oferta → checkout → pagamento → usuário com perfil Nutra e assinatura ativa  

---

## Se algo falhar

- **404 em alguma rota:** conferir se a página existe em `src/app/pt/nutra/...` e se o layout em `src/app/pt/nutra/layout.tsx` está aplicado.
- **Redirect para login em rota que deveria ser pública:** conferir `NUTRA_PUBLIC` e `isNutraPublicPath` em `src/app/pt/nutra/layout.tsx`.
- **API checkout 400/500:** verificar logs do servidor e body enviado (planType, email); conferir `POST /api/nutra/checkout`.
- **Assinatura não encontrada após pagamento:** conferir webhook Mercado Pago (descrição contém “NUTRA”) e criação de `subscriptions` com `area = 'nutra'`; verificar `user_profiles.perfil = 'nutra'` para o usuário.

Documento criado para o lançamento da área Nutra. Bom lançamento na segunda-feira.
