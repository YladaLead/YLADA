# 🔐 Como Funciona o Acesso ao Suporte

## 👤 USUÁRIO COMUM (Cliente Nutri)

### **O que o usuário tem acesso:**

1. **✅ Widget de Chat (Botãozinho)**
   - Aparece no canto da tela em todas as páginas
   - Permite conversar com o bot
   - Pode solicitar atendente humano
   - **Localização:** Componente flutuante

2. **✅ Ver Seus Próprios Tickets**
   - URL: `https://ylada.app/pt/nutri/suporte/tickets`
   - Vê **APENAS** seus próprios tickets
   - Pode abrir e ver conversa
   - **NÃO pode responder** (responde pelo widget)

3. **✅ Login Normal**
   - Usa o mesmo login do dashboard
   - Não precisa de login especial

### **O que o usuário NÃO tem acesso:**

- ❌ Ver tickets de outros usuários
- ❌ Responder como atendente
- ❌ Ver lista de todos os tickets
- ❌ Aceitar tickets
- ❌ Marcar como resolvido

---

## 👨‍💼 ATENDENTE (Suporte/Admin)

### **O que o atendente tem acesso:**

1. **✅ Ver TODOS os Tickets**
   - URL: `https://ylada.app/pt/nutri/suporte/tickets`
   - Vê tickets de **TODOS os usuários**
   - Pode filtrar por status
   - Pode ver informações completas

2. **✅ Responder Tickets**
   - Pode abrir qualquer ticket
   - Pode enviar mensagens como atendente
   - Mensagens aparecem em **verde** (diferente do usuário)

3. **✅ Gerenciar Tickets**
   - Aceitar tickets
   - Marcar como resolvido
   - Fechar tickets
   - Ver estatísticas

4. **✅ Receber Notificações**
   - Email quando novo ticket é criado
   - Link direto para o ticket

### **Como se tornar atendente:**

1. **Precisa estar registrado na tabela `support_agents`**
2. **Apenas ADMIN pode registrar atendentes**
3. **Usa o mesmo login normal** (não precisa login especial)

---

## 🔑 COMO REGISTRAR UM ATENDENTE

### **Opção 1: Via API (Admin)**

```bash
POST /api/nutri/support/agents
Headers: Authorization: Bearer [admin_token]
Body: {
  "user_id": "uuid-do-usuario",
  "area": "nutri",
  "max_concurrent_tickets": 3
}
```

### **Opção 2: Via SQL (Direto no banco)**

```sql
INSERT INTO support_agents (user_id, area, status, max_concurrent_tickets)
VALUES (
  'uuid-do-usuario',  -- ID do usuário no auth.users
  'nutri',
  'offline',
  3
);
```

### **Opção 3: Criar Interface Admin (Futuro)**

- Página admin para gerenciar atendentes
- Listar, adicionar, remover atendentes
- Ver estatísticas

---

## 🔍 COMO O SISTEMA IDENTIFICA

### **Verificação Automática:**

1. **Quando usuário acessa `/pt/nutri/suporte/tickets`:**
   ```typescript
   // Sistema verifica na tabela support_agents
   const { data: agent } = await supabaseAdmin
     .from('support_agents')
     .select('*')
     .eq('user_id', user.id)
     .single()

   // Se NÃO é atendente:
   if (!agent) {
     // Mostra APENAS tickets do próprio usuário
     query = query.eq('user_id', user.id)
   }
   
   // Se É atendente:
   else {
     // Mostra TODOS os tickets
     // Pode filtrar, aceitar, responder
   }
   ```

2. **Quando tenta responder:**
   ```typescript
   // Verifica se é atendente
   const isAgent = !!agent
   
   // Se não é atendente:
   // Só pode ver seus próprios tickets
   
   // Se é atendente:
   // Pode ver e responder qualquer ticket
   ```

---

## 📋 RESUMO DAS PERMISSÕES

| Ação | Usuário Comum | Atendente |
|------|---------------|-----------|
| Ver widget de chat | ✅ | ✅ |
| Ver próprios tickets | ✅ | ✅ |
| Ver todos os tickets | ❌ | ✅ |
| Responder no widget | ✅ (bot) | ✅ |
| Responder como atendente | ❌ | ✅ |
| Aceitar tickets | ❌ | ✅ |
| Marcar como resolvido | ❌ | ✅ |
| Fechar tickets | ❌ | ✅ |
| Receber notificações | ❌ | ✅ |

---

## 🎯 FLUXO COMPLETO

### **Para Usuário Comum:**

```
1. Usuário acessa dashboard
   ↓
2. Vê widget de chat (botãozinho)
   ↓
3. Clica e conversa com bot
   ↓
4. Se bot não resolve, solicita atendente
   ↓
5. Sistema cria ticket
   ↓
6. Atendente recebe email
   ↓
7. Atendente responde pelo sistema
   ↓
8. Usuário vê resposta no widget
```

### **Para Atendente:**

```
1. Atendente recebe email de notificação
   ↓
2. Clica no link do email
   ↓
3. Vai para página de tickets
   ↓
4. Vê TODOS os tickets
   ↓
5. Abre ticket específico
   ↓
6. Aceita ticket (se necessário)
   ↓
7. Responde ao usuário
   ↓
8. Marca como resolvido quando terminar
```

---

## 🚨 IMPORTANTE

1. **Usuário comum NÃO precisa de login especial**
   - Usa login normal do dashboard
   - Sistema automaticamente mostra só seus tickets

2. **Atendente usa o MESMO login**
   - Não precisa de login separado
   - Sistema identifica automaticamente se é atendente
   - Verifica na tabela `support_agents`

3. **Apenas ADMIN pode registrar atendentes**
   - Via API ou SQL
   - Precisa do `user_id` do usuário

4. **Usuário comum pode ver seus tickets**
   - Mas não pode responder como atendente
   - Responde pelo widget (que cria mensagem como usuário)

---

## 💡 PRÓXIMOS PASSOS

1. **Criar interface admin** para gerenciar atendentes
2. **Adicionar link no dashboard** para usuários verem seus tickets
3. **Melhorar widget** para mostrar histórico de tickets
4. **Adicionar notificações** no widget quando atendente responde

