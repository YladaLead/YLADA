# ⚙️ Como Ativar Cron Job de Boas-vindas (Depois)

## 📋 SITUAÇÃO ATUAL

**Por enquanto:** Você vai disparar manualmente as boas-vindas  
**Depois:** Você pode ativar o cron job automático

---

## ✅ DISPARO MANUAL (Funcionando Agora)

### **Como Fazer:**

1. Acesse: `/admin/whatsapp/carol`
2. Clique em: **"Disparar Boas-vindas"**
3. Aguarde processamento
4. Veja quantas foram enviadas

**Funciona perfeitamente assim!** ✅

---

## 🔄 ATIVAR CRON AUTOMÁTICO (Depois)

### **Quando quiser ativar:**

1. **Editar `vercel.json`:**
   - Adicionar o cron de boas-vindas de volta

2. **Adicionar no `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/whatsapp-carol?tipo=welcome",
      "schedule": "0 9 * * *"
    },
    // ... outros crons já estão ativos
  ]
}
```

3. **Fazer commit e deploy:**
```bash
git add vercel.json
git commit -m "feat: Ativar cron automático de boas-vindas"
git push origin main
```

4. **Configurar variável de ambiente no Vercel:**
   - `CRON_SECRET` (se ainda não tiver)

5. **Pronto!** O cron vai executar automaticamente todos os dias às 09:00

---

## 📋 CRONS ATIVOS AGORA

Estes crons **JÁ ESTÃO ATIVOS** e funcionando:

- ✅ **follow-up** - A cada hora (notificações para quem não respondeu)
- ✅ **pre-class** - A cada hora (notificações pré-aula)
- ✅ **post-class** - A cada hora (notificações pós-aula)
- ✅ **remarketing** - Diário às 10:00 (para quem não participou)
- ✅ **sales-follow-up** - A cada hora (processo de fechamento)

---

## 📋 CRON DESATIVADO (Por enquanto)

- ⏸️ **welcome** - Boas-vindas (você dispara manualmente)

---

## 🎯 RESUMO

**Agora:**
- ✅ Disparo manual funcionando
- ✅ Outros crons ativos
- ✅ Tudo funcionando perfeitamente

**Depois (quando quiser):**
- Adicionar cron de boas-vindas no `vercel.json`
- Fazer commit e deploy
- Pronto!

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
