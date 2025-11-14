# 📧 RESUMO: Configuração de Email para Formulário de Contato

## 🎯 DOIS EMAILS DIFERENTES

### 1️⃣ Email que ENVIA (RESEND_FROM_EMAIL)
- **O que é:** Email que aparece como remetente
- **Exemplo:** `noreply@ylada.com`
- **Precisa DNS?** ✅ SIM - Verificar no Resend
- **Onde configurar:** `.env.local` e Vercel

### 2️⃣ Email que RECEBE (CONTACT_NOTIFICATION_EMAIL)
- **O que é:** Email onde você recebe as notificações
- **Exemplo:** `seu-email@gmail.com` ou `contato@ylada.com`
- **Precisa DNS?** ❌ NÃO - Qualquer email seu funciona
- **Onde configurar:** `.env.local` e Vercel

---

## ⚙️ CONFIGURAÇÃO RÁPIDA

### No `.env.local`:
```env
# Email que ENVIA (precisa verificar DNS no Resend)
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email que RECEBE (não precisa DNS - pode ser Gmail)
CONTACT_NOTIFICATION_EMAIL=seu-email@gmail.com
```

### No Vercel:
Adicione as mesmas variáveis em Settings → Environment Variables

---

## 🔧 VERIFICAR DOMÍNIO NO RESEND (para ENVIAR)

1. Acesse: https://resend.com/domains
2. Clique em "Add Domain"
3. Digite: `ylada.com`
4. Copie os registros DNS que aparecerem
5. Adicione no seu provedor DNS (Cloudflare, GoDaddy, etc)
6. Aguarde verificação (1-48h)

**⚠️ IMPORTANTE:** Você só precisa verificar DNS para ENVIAR emails, não para RECEBER!

---

## 📖 GUIA COMPLETO
Veja o guia detalhado em: `docs/GUIA-CONFIGURACAO-EMAIL-CONTATO.md`
