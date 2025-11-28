# 👨‍💼 Interface Admin - Gerenciar Atendentes

## 📍 LOCALIZAÇÃO

**URL:** `/admin/support/agents`

**Acesso:** Apenas usuários com permissão `admin`

---

## 🎯 FUNCIONALIDADES

### **1. Listar Atendentes**
- Ver todos os atendentes registrados
- Filtrar por área (Nutri, Coach, Wellness)
- Ver estatísticas de cada atendente:
  - Status (Online, Offline, Ocupado, Pausado)
  - Tickets atendidos
  - Tickets resolvidos
  - Capacidade (tickets atuais / máximo)
  - Satisfação média (se disponível)
  - Última atividade

### **2. Adicionar Novo Atendente**
- Buscar usuário por email
- Selecionar área (Nutri, Coach, Wellness)
- Definir capacidade máxima de tickets simultâneos
- Adicionar com um clique

### **3. Remover Atendente**
- Remover atendente do sistema
- Confirmação antes de remover

---

## 🔧 COMO USAR

### **Adicionar Atendente:**

1. Clique em **"➕ Adicionar"**
2. Selecione a **Área** (Nutri, Coach, Wellness)
3. Defina **Máximo de Tickets Simultâneos** (padrão: 3)
4. Digite o **email** do usuário
5. Clique em **"🔍 Buscar"**
6. Selecione o usuário nos resultados
7. Clique em **"➕ Adicionar"** ao lado do usuário

### **Remover Atendente:**

1. Encontre o atendente na lista
2. Clique em **"🗑️ Remover"**
3. Confirme a remoção

---

## 📊 INFORMAÇÕES EXIBIDAS

Para cada atendente, você vê:

- **Nome e Email**
- **Status** (badge colorido)
- **Área** (badge)
- **Tickets Atendidos** (total)
- **Tickets Resolvidos**
- **Capacidade** (atual / máximo)
- **Satisfação Média** (se disponível)
- **Data de Registro**
- **Última Atividade**

---

## 🔐 PERMISSÕES

- **Apenas ADMIN** pode acessar esta página
- **Apenas ADMIN** pode adicionar/remover atendentes
- Atendentes podem atualizar seu próprio status (online/offline)

---

## 🔗 INTEGRAÇÃO

### **APIs Utilizadas:**

1. **GET `/api/nutri/support/agents`**
   - Lista todos os atendentes
   - Retorna estatísticas

2. **POST `/api/nutri/support/agents`**
   - Adiciona novo atendente
   - Requer: `user_id`, `area`, `max_concurrent_tickets`

3. **DELETE `/api/nutri/support/agents?id={agentId}`**
   - Remove atendente
   - Apenas admin

4. **GET `/api/admin/search-user?email={email}`**
   - Busca usuário por email
   - Retorna lista de usuários correspondentes

---

## 📝 NOTAS

- **Usuário precisa existir** no sistema antes de ser adicionado como atendente
- **Um usuário pode ser atendente de múltiplas áreas** (registros separados)
- **Remoção não deleta o usuário**, apenas remove da lista de atendentes
- **Status inicial** é sempre `offline`

---

## 🚀 PRÓXIMOS PASSOS (Futuro)

- [ ] Editar atendente (alterar capacidade, área)
- [ ] Ver histórico de tickets do atendente
- [ ] Estatísticas detalhadas
- [ ] Exportar relatório
- [ ] Notificações quando atendente fica offline muito tempo

