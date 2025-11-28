# 👨‍💼 Interface do Agente vs Admin - EXPLICADO

## 🎯 DIFERENÇA PRINCIPAL

### **ADMIN (Você)**
- ✅ Acessa `/admin` (área administrativa completa)
- ✅ Gerencia atendentes (adicionar, remover)
- ✅ Vê estatísticas gerais
- ✅ Controla todo o sistema

### **AGENTE (Atendente)**
- ✅ Acessa `/pt/nutri/suporte/atendente` (área de atendimento)
- ❌ **NÃO** acessa `/admin`
- ✅ Vê e responde tickets
- ✅ Gerencia apenas seus tickets
- ❌ **NÃO** gerencia outros atendentes

---

## 📍 ONDE O AGENTE ACESSA

### **URL Principal:**
`https://ylada.app/pt/nutri/suporte/atendente`

### **O que o agente vê:**

1. **Dashboard de Atendente:**
   - Estatísticas rápidas:
     - Total de tickets
     - Aguardando
     - Em atendimento
     - Resolvidos
     - Meus tickets
   - Status online/offline (botão para alternar)
   - Lista de todos os tickets

2. **Página de Ticket:**
   - URL: `/pt/nutri/suporte/tickets/[id]`
   - Ver conversa completa
   - Responder ao usuário
   - Aceitar ticket
   - Marcar como resolvido
   - Fechar ticket

---

## 🔐 COMO FUNCIONA O ACESSO

### **1. Admin registra o agente:**
```
Admin acessa: /admin/support/agents
→ Busca usuário por email
→ Adiciona como atendente
→ Define área (Nutri, Coach, Wellness)
```

### **2. Agente faz login normal:**
```
Agente acessa: /pt/nutri/dashboard
→ Faz login normalmente (mesmo login do sistema)
→ Sistema identifica automaticamente que é atendente
```

### **3. Agente acessa área de atendimento:**
```
Opção A: Link direto
→ /pt/nutri/suporte/atendente

Opção B: Pelo email de notificação
→ Clica no link do email
→ Vai direto para o ticket

Opção C: Pelo dashboard (futuro)
→ Link "Área do Atendente" no dashboard
```

---

## 🎨 INTERFACE DO AGENTE

### **Header:**
- Logo Nutri
- Título: "Área do Atendente"
- Status: Botão Online/Offline
- Link: Voltar ao Dashboard

### **Estatísticas:**
- Cards coloridos com números
- Atualização em tempo real

### **Lista de Tickets:**
- Todos os tickets (não só os dele)
- Filtros por status
- Informações completas
- Clique para abrir

### **Página do Ticket:**
- Conversa completa
- Input para responder
- Botões de ação:
  - Aceitar ticket
  - Marcar como resolvido
  - Fechar ticket

---

## 🚫 O QUE O AGENTE NÃO TEM ACESSO

- ❌ `/admin` (área administrativa)
- ❌ Gerenciar outros atendentes
- ❌ Ver estatísticas gerais do sistema
- ❌ Configurações administrativas
- ❌ Gerenciar usuários
- ❌ Ver receitas/assinaturas

---

## ✅ O QUE O AGENTE TEM ACESSO

- ✅ Ver todos os tickets
- ✅ Responder tickets
- ✅ Aceitar tickets
- ✅ Marcar como resolvido
- ✅ Fechar tickets
- ✅ Alternar status online/offline
- ✅ Ver estatísticas dos tickets
- ✅ Dashboard normal (como usuário comum)

---

## 🔄 FLUXO COMPLETO

### **Para o Admin:**

```
1. Admin acessa /admin/support/agents
2. Busca usuário por email
3. Adiciona como atendente
4. Pronto! Agente pode começar a atender
```

### **Para o Agente:**

```
1. Agente recebe email de notificação
   OU
   Acessa /pt/nutri/suporte/atendente

2. Vê lista de tickets

3. Clica em um ticket

4. Aceita o ticket (se necessário)

5. Responde ao usuário

6. Marca como resolvido quando terminar
```

---

## 📧 NOTIFICAÇÕES

### **Agente recebe email quando:**
- ✅ Novo ticket é criado
- ✅ Usuário envia nova mensagem em ticket atribuído a ele

### **Email contém:**
- Informações do ticket
- Link direto para o ticket
- Mensagem do usuário

---

## 🎯 RESUMO

| Recurso | Admin | Agente |
|---------|-------|--------|
| Acessa `/admin` | ✅ | ❌ |
| Gerencia atendentes | ✅ | ❌ |
| Vê todos os tickets | ✅ | ✅ |
| Responde tickets | ✅ | ✅ |
| Estatísticas gerais | ✅ | ❌ |
| Estatísticas de tickets | ✅ | ✅ |
| Alternar status online/offline | ✅ | ✅ |

---

## 💡 IMPORTANTE

1. **Agente usa o MESMO login** do sistema
2. **Sistema identifica automaticamente** se é atendente
3. **Agente NÃO precisa de login especial**
4. **Agente NÃO tem acesso à área admin**
5. **Apenas admin pode adicionar/remover atendentes**

---

## 🚀 PRÓXIMOS PASSOS (Futuro)

- [ ] Adicionar link "Área do Atendente" no dashboard Nutri
- [ ] Notificações em tempo real no navegador
- [ ] Histórico de tickets do agente
- [ ] Estatísticas pessoais do agente
- [ ] Chat em tempo real (WebSocket)

