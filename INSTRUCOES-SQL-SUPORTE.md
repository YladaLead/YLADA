# 📋 Instruções SQL - Sistema de Suporte

## ✅ O QUE PRECISA SER EXECUTADO

### **1. Verificar se as tabelas já existem**

Execute primeiro este SQL no Supabase SQL Editor:

```sql
-- Verificar tabelas
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'faq_responses',
    'support_tickets',
    'support_messages',
    'support_agents',
    'support_conversations'
  );
```

**Se aparecerem todas as 5 tabelas:** ✅ Já está tudo criado, não precisa fazer nada!

**Se faltar alguma tabela:** Continue com o passo 2.

---

### **2. Criar as tabelas (se não existirem)**

Execute este arquivo no Supabase SQL Editor:

📄 **`migrations/criar-tabelas-chat-suporte-nutri.sql`**

Este arquivo cria:
- ✅ `faq_responses` - Perguntas e respostas do bot
- ✅ `support_tickets` - Tickets de suporte
- ✅ `support_messages` - Mensagens dos tickets
- ✅ `support_agents` - Atendentes
- ✅ `support_conversations` - Histórico do bot

**Importante:** O arquivo usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar mesmo se já existir.

---

### **3. Popular FAQs (opcional, mas recomendado)**

Se quiser ter FAQs no bot, execute os arquivos:

📄 **`migrations/popular-faqs-nutri-fase1-lote1.sql`** (já executado antes)
📄 **`migrations/popular-faqs-nutri-fase1-lote2.sql`** (já executado antes)
📄 **`migrations/popular-faqs-nutri-fase1-lote3.sql`** (já executado antes)
📄 **`migrations/popular-faqs-nutri-fase1-lote4.sql`** (NOVO)
📄 **`migrations/popular-faqs-nutri-fase1-lote5.sql`** (NOVO)
📄 **`migrations/popular-faqs-nutri-fase1-lote6.sql`** (NOVO)
📄 **`migrations/popular-faqs-nutri-fase1-lote7.sql`** (NOVO)
📄 **`migrations/popular-faqs-nutri-fase1-lote8.sql`** (NOVO)
📄 **`migrations/popular-faqs-nutri-fase1-lote9.sql`** (NOVO)

**Total:** 141 FAQs para a área Nutri

---

## 🎯 RESUMO RÁPIDO

1. **Verificar tabelas** → Execute o SQL de verificação
2. **Se faltar** → Execute `criar-tabelas-chat-suporte-nutri.sql`
3. **FAQs (opcional)** → Execute os lotes 4-9 se quiser mais FAQs

---

## ⚠️ IMPORTANTE

- As tabelas usam `IF NOT EXISTS`, então é seguro executar várias vezes
- Os FAQs usam `INSERT`, então podem dar erro se já existirem (mas não quebra nada)
- Se der erro de "tabela já existe", está tudo certo! ✅

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

Execute este SQL:

```sql
-- Verificar tudo
SELECT 
    'faq_responses' as tabela,
    COUNT(*) as registros
FROM faq_responses
WHERE area = 'nutri'

UNION ALL

SELECT 
    'support_tickets' as tabela,
    COUNT(*) as registros
FROM support_tickets

UNION ALL

SELECT 
    'support_agents' as tabela,
    COUNT(*) as registros
FROM support_agents;
```

Se aparecerem os números, está tudo funcionando! ✅

