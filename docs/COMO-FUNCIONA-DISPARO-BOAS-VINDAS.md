# 👋 Como Funciona o Disparo de Boas-vindas

## 🎯 RESUMO

O sistema **não usa mais Cron**. A automação é feita por **Worker on-demand**:

1. **Cadastro no workshop** — 60s depois, se a pessoa **não** tiver clicado no WhatsApp, enviamos a mensagem de boas-vindas (ela nos chama primeiro; nós não iniciamos a conversa em massa).
2. **Worker (process-all)** — rodar **POST** `/api/admin/whatsapp/automation/process-all` (pelo admin ou por agendamento externo 1x/dia ou 1x a cada 1–2h). Agenda boas-vindas, processa fila, pré-aula, follow-up, participou/não participou.

Documento único: **`docs/CAROL-OPERACAO-WORKER-ESTADOS-E-CENARIOS.md`**.

---

## ✅ FORMA 1: APÓS CADASTRO (automático no fluxo)

### **Como Funciona:**
- A pessoa preenche o formulário do workshop.
- O sistema espera **60 segundos**. Se ela **já** clicou no botão do WhatsApp nesse tempo, **não** enviamos (ela nos chamou).
- Se após 60s ela **não** mandou mensagem, enviamos a mensagem de boas-vindas com opções.

### **Onde está:**
- `src/lib/whatsapp-form-automation.ts` → `sendWorkshopInviteToFormLead`

---

## ✅ FORMA 2: VIA WORKER (Process-all)

### **Como Funciona:**
- Rodar o Worker **process-all** (pela interface de automação ou chamando a API).
- O process-all agenda boas-vindas para leads que ainda não têm mensagem e processa o resto da fila.

### **Onde fazer:**
1. Acesse a interface de automação (ex.: `/admin/whatsapp/automation`) e use **"Processar tudo"**, ou
2. Chame **POST** `/api/admin/whatsapp/automation/process-all` (com auth de admin).

### **Quando usar:**
- 1x por dia ou a cada 1–2h (via agendador externo, se quiser), ou manualmente quando quiser.

---

## 📋 O QUE O SISTEMA FAZ

### **Busca:**
- Leads dos últimos 7 dias que preencheram formulário
- Que têm telefone válido
- Que **NÃO** têm conversa ativa no WhatsApp
- Ou que têm conversa mas **NUNCA** enviaram mensagem

### **Envia:**
- Mensagem de boas-vindas personalizada
- Opções de aula disponíveis (sem links)
- Instruções para escolher uma opção

### **Adiciona Tags:**
- `veio_aula_pratica`
- `recebeu_link_workshop`
- `primeiro_contato`

---

## 🔍 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### **1. Verificar Logs do Worker**
- Após rodar process-all, verifique a resposta da API ou a interface de automação.
- Ex.: "welcome: { scheduled: X, skipped: Y, errors: Z }"

### **2. Verificar Interface Admin**
- Após "Processar tudo" (ou equivalente), conferir totais enviados/erros.

### **3. Verificar Conversas**
- Acesse: `/admin/whatsapp`
- Procure por conversas novas com tag `veio_aula_pratica`
- Verifique se receberam a mensagem de boas-vindas

---

## ⚙️ CONFIGURAÇÃO

- **Worker:** usar **POST** `/api/admin/whatsapp/automation/process-all` (requer auth admin).
- Se quiser execução periódica, usar um **agendador externo** (ex.: cron-job.org, Vercel Cron, etc.) para chamar esse endpoint 1x/dia ou a cada 1–2h.
- O sistema **não usa mais** cron no `vercel.json` para essa automação.

---

## ❓ PERGUNTAS FREQUENTES

### **P: Onde está a configuração de “cron”?**
R: Não usamos cron. A automação é Worker on-demand (process-all). Ver `docs/CAROL-OPERACAO-WORKER-ESTADOS-E-CENARIOS.md`.

### **P: E o disparo logo após o cadastro?**
R: 60s depois do cadastro, se a pessoa não tiver clicado no WhatsApp, enviamos a mensagem. Se ela já mandou mensagem, não enviamos (ela nos chamou).

### **P: Quantas vezes rodar o process-all?**
R: 1x por dia ou a cada 1–2h, conforme necessidade. Pode ser manual ou via agendador externo.

---

**Última atualização:** 2026-01-27
**Versão:** 1.1
