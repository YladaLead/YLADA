# Teste de limites com portalmagra@gmail.com

Conta **portalmagra@gmail.com** (transferida da área Coach) configurada para simular **cadastro novo** e testar os limites do plano Free YLADA.

---

## O que a migration faz

Ao executar **`migrations/279-reset-portalmagra-para-teste-limites.sql`** no Supabase (SQL Editor), a conta fica assim:

| Item | Estado após o reset |
|------|----------------------|
| **Assinatura YLADA** | Plano **free** (limites ativos) |
| **Uso do Noel** | **0** análises no mês (cota 10/mês) |
| **Links** | **0** links (pode criar 1; ao criar o 2º ativo, atinge o limite) |
| **WhatsApp (mês)** | **0** cliques no mês (limite 10/mês) |
| **Onboarding** | Perfil YLADA com nome/whatsapp vazios → **redireciona para onboarding** ao entrar |

Assim você consegue testar:

1. **Limite de 1 link ativo** — criar 1 link OK; ao tentar criar o segundo, mensagem de upgrade.
2. **Limite de 10 análises Noel/mês** — após 10 respostas avançadas do Noel, mensagem de upgrade.
3. **Limite de 10 contatos WhatsApp/mês** — após 10 cliques em “Falar no WhatsApp” nos diagnósticos dos seus links, limite do mês.

---

## Como executar

1. Abra o **Supabase** do projeto → **SQL Editor**.
2. Cole o conteúdo de **`migrations/279-reset-portalmagra-para-teste-limites.sql`**.
3. Execute (Run).
4. Confira os NOTICEs no resultado (user_id encontrado, assinatura free, uso zerado, etc.).

---

## Como testar

1. Faça login com **portalmagra@gmail.com** na entrada YLADA (ex.: hd.com ou a rota matrix/ylada que você usa).
2. Deve cair no **onboarding** (preencher nome e WhatsApp).
3. Depois do onboarding, acesse a home/links/Noel e valide:
   - Criar **1 link** → OK.
   - Criar **2º link** (ativo) → mensagem de limite de 1 diagnóstico ativo.
   - Usar o **Noel** até **10 análises** → na 11ª, mensagem de limite.
   - Compartilhar o link e simular **10 cliques no WhatsApp** (ou usar eventos de teste) → no 11º, limite de contatos no mês.

---

## Referência dos limites (Free)

- **Links ativos:** 1  
- **Análises Noel/mês:** 10  
- **Contatos WhatsApp/mês:** 10  

Configuração em **`src/config/freemium-limits.ts`** e spec em **`docs/SPEC-FREEMIUM-YLADA.md`**.
