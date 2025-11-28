# 👨‍💼 Interface do Agente - RESUMO

## 🎯 DIFERENÇA: ADMIN vs AGENTE

### **ADMIN (Você):**
- ✅ Acessa `/admin` → Gerencia tudo
- ✅ Adiciona/remove atendentes
- ✅ Vê estatísticas gerais

### **AGENTE (Atendente):**
- ✅ Acessa `/pt/nutri/suporte/atendente` → Só atende
- ❌ **NÃO** acessa `/admin`
- ✅ Vê e responde tickets
- ❌ **NÃO** gerencia outros atendentes

---

## 📍 ONDE O AGENTE ACESSA

**URL:** `https://ylada.app/pt/nutri/suporte/atendente`

**O que vê:**
- Dashboard com estatísticas
- Lista de todos os tickets
- Botão para ficar online/offline
- Filtros por status

---

## 🔐 COMO FUNCIONA

### **1. Admin registra:**
```
/admin/support/agents
→ Busca por email
→ Adiciona como atendente
```

### **2. Agente acessa:**
```
/pt/nutri/suporte/atendente
→ Login normal (mesmo do sistema)
→ Sistema identifica automaticamente
```

### **3. Agente atende:**
```
→ Vê tickets
→ Clica no ticket
→ Responde
→ Marca como resolvido
```

---

## ✅ O QUE O AGENTE PODE FAZER

- ✅ Ver todos os tickets
- ✅ Responder tickets
- ✅ Aceitar tickets
- ✅ Marcar como resolvido
- ✅ Fechar tickets
- ✅ Alternar online/offline

---

## ❌ O QUE O AGENTE NÃO PODE FAZER

- ❌ Acessar `/admin`
- ❌ Gerenciar outros atendentes
- ❌ Ver estatísticas gerais
- ❌ Configurações administrativas

---

## 📧 NOTIFICAÇÕES

Agente recebe email quando:
- Novo ticket é criado
- Usuário envia nova mensagem

Email tem link direto para o ticket.

---

## ⚡ RESUMO

- **Admin:** `/admin` → Gerencia tudo
- **Agente:** `/pt/nutri/suporte/atendente` → Só atende
- **Mesmo login** para ambos
- **Sistema identifica automaticamente**

