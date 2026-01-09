# ⚡ TESTE RÁPIDO: Sistema de Retenção

## 🚀 PASSO 1: Executar SQL (OBRIGATÓRIO)

1. Acesse: https://app.supabase.com
2. Vá em **SQL Editor**
3. Abra: `scripts/migrations/create-cancel-retention-tables.sql`
4. Copie e cole tudo
5. Clique em **Run**

**✅ Verificar se funcionou:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('cancel_attempts', 'trial_extensions');
```
Deve retornar 2 linhas.

---

## 🧪 PASSO 2: Testar no App

### **Teste Básico (5 minutos):**

1. **Login** como usuário com assinatura ativa
2. Vá em **Configurações** → **Minha Assinatura**
3. Clique em **"Cancelar Assinatura"** (link discreto no final)
4. **Selecione um motivo:** "Não tive tempo de usar"
5. **Deve aparecer:** Oferta para estender trial 7 dias
6. **Clique em:** "Estender trial por 7 dias"
7. **✅ Resultado:** Modal fecha, mensagem de sucesso, assinatura continua ativa

### **Teste de Cancelamento Real:**

1. Repita passos 1-4 acima
2. **Clique em:** "Cancelar agora" (rejeitar oferta)
3. **Clique em:** "Confirmar Cancelamento"
4. **✅ Resultado:** Assinatura cancelada, redirecionamento para home

---

## 🔍 VERIFICAR NO BANCO

```sql
-- Ver última tentativa de cancelamento
SELECT * FROM cancel_attempts ORDER BY created_at DESC LIMIT 1;

-- Ver se trial foi estendido
SELECT * FROM trial_extensions ORDER BY created_at DESC LIMIT 1;

-- Ver status da subscription
SELECT id, status, current_period_end FROM subscriptions 
WHERE user_id = 'SEU_USER_ID' ORDER BY created_at DESC LIMIT 1;
```

---

## ⚠️ PROBLEMAS COMUNS

**"Tabela não existe"** → Execute o SQL primeiro!

**"Permission denied"** → Verifique se está logado

**Modal não aparece** → Abra console (F12) e veja erros

**Oferta não aparece** → Verifique logs do servidor

---

## 📊 TESTAR TODOS OS MOTIVOS

| Motivo | Oferta Esperada |
|--------|----------------|
| Não tive tempo | Estender trial |
| Não entendi | Tour guiado |
| Não vi valor | Mostrar feature |
| Esqueci trial | Adiar + estender |
| Muito caro | Pausar 30 dias |
| Encontrei alternativa | Sem oferta |
| Outro | Sem oferta |

Teste cada um para ver se oferta aparece correta!

---

**Pronto!** Se tudo funcionar, está implementado com sucesso! 🎉

