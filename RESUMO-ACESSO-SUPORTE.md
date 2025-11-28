# 🔐 Acesso ao Suporte - RESUMO RÁPIDO

## 👤 USUÁRIO COMUM

**O que tem:**
- ✅ Widget de chat (botãozinho)
- ✅ Ver seus próprios tickets em `/pt/nutri/suporte/tickets`
- ✅ Login normal (mesmo do dashboard)

**O que NÃO tem:**
- ❌ Ver tickets de outros
- ❌ Responder como atendente
- ❌ Gerenciar tickets

---

## 👨‍💼 ATENDENTE

**O que tem:**
- ✅ Ver TODOS os tickets
- ✅ Responder como atendente
- ✅ Aceitar, resolver, fechar tickets
- ✅ Receber notificações por email

**Como se tornar:**
- Precisa estar na tabela `support_agents`
- Apenas ADMIN pode registrar
- Usa o MESMO login (não precisa login especial)

---

## 🔑 REGISTRAR ATENDENTE

**Via SQL:**
```sql
INSERT INTO support_agents (user_id, area, status)
VALUES ('uuid-do-usuario', 'nutri', 'offline');
```

**Via API (Admin):**
```bash
POST /api/nutri/support/agents
Body: { "user_id": "uuid", "area": "nutri" }
```

---

## 🎯 RESUMO

| Ação | Usuário | Atendente |
|------|---------|-----------|
| Ver widget | ✅ | ✅ |
| Ver próprios tickets | ✅ | ✅ |
| Ver todos tickets | ❌ | ✅ |
| Responder | ❌ | ✅ |
| Gerenciar | ❌ | ✅ |

---

## ⚡ IMPORTANTE

- **Usuário comum:** Login normal, vê só seus tickets
- **Atendente:** Mesmo login, mas registrado em `support_agents`
- **Sistema identifica automaticamente** quem é atendente

