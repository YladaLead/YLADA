# Novo chat / fluxo e automação WhatsApp

Documento de referência para o fluxo do chat WhatsApp e da automação Carol.

---

## 1. Kill-switch da Carol

- **Arquivo:** `src/config/whatsapp-automation.ts`
- **Função:** `isCarolAutomationDisabled()` — retorna `true` quando a variável de ambiente `CAROL_AUTOMATION_DISABLED` **não** é exatamente a string `'false'`.
- **Comportamento:** por padrão a automação fica **desligada**. Para religar, é obrigatório definir `CAROL_AUTOMATION_DISABLED=false` no ambiente (Vercel ou `.env.local`) e, em produção, fazer **redeploy**.

---

## 2. O que fica desligado quando a Carol está desligada

- Webhook Z-API: Carol não responde às mensagens recebidas.
- Rotas admin: reprocessar última mensagem, disparos (boas-vindas, remarketing, lembretes), chat com Carol, simular mensagem, etc. retornam **503** com `{ disabled: true }`.
- Workshop: participou / não participou não disparam WhatsApp (só atualizam tags no banco).
- Inscrição workshop/formulários: primeira mensagem automática não é enviada.

Ver **PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md** para a lista completa.

---

## 3. Status da Carol no admin

- Na página **Admin → WhatsApp** (`/admin/whatsapp`) aparece um banner no topo:
  - **Carol: desligada** (fundo âmbar) — com instrução para ligar.
  - **Carol: ligada** (fundo verde).
- A API **GET /api/admin/whatsapp/carol/status** (apenas admin) retorna `{ disabled, carolEnabled, message }` para o front usar esse banner.

---

## 4. Item 6 — Como ligar a Carol

Para **ligar** a Carol (automação e disparos funcionando de novo):

1. **Vercel (produção)**  
   - Acesse o projeto no [Vercel Dashboard](https://vercel.com).  
   - **Settings** → **Environment Variables**.  
   - Crie ou edite a variável:
     - **Name:** `CAROL_AUTOMATION_DISABLED`
     - **Value:** `false` (exatamente essa string, minúsculo).
   - Marque o ambiente (Production e/ou Preview) e salve.  
   - Faça um **Redeploy** (Deployments → Redeploy do último deploy, ou novo deploy a partir do Git).

2. **Local (.env)**  
   - No `.env.local` (ou `.env`) do projeto:
     - Se existir `CAROL_AUTOMATION_DISABLED=true`, mude para `CAROL_AUTOMATION_DISABLED=false`.
     - Se não existir, adicione: `CAROL_AUTOMATION_DISABLED=false`.
   - Reinicie o servidor de desenvolvimento (`npm run dev` ou equivalente).

Depois disso, o banner no admin deve mostrar **Carol: ligada** e as rotas de reprocessar/disparos passam a responder normalmente (sem 503).

---

## 5. Resumo

| Onde        | Ação para ligar a Carol |
|------------|---------------------------|
| **Vercel** | `CAROL_AUTOMATION_DISABLED=false` nas env vars + **Redeploy**. |
| **Local**  | `CAROL_AUTOMATION_DISABLED=false` no `.env.local` e reiniciar o servidor. |

Documentos relacionados: **PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md**, **docs/CAROL-OPERACAO-WORKER-ESTADOS-E-CENARIOS.md**.
