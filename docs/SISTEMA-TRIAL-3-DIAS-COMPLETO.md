# 🎁 Sistema de Trial de 3 Dias - Documentação Completa

## 📋 Visão Geral

Sistema completo para compartilhar links de convite que permitem acesso automático ao trial de 3 dias, sem necessidade de login/cadastro manual.

---

## 🔄 Como Funciona

### **Fluxo Completo:**

1. **Você gera um link** → Endpoint `/api/wellness/trial/generate-invite`
2. **Compartilha o link** → Pessoa recebe link único
3. **Pessoa clica no link** → Vai para `/pt/wellness/trial/[token]`
4. **Sistema valida token** → Verifica se é válido e não foi usado
5. **Dados pré-preenchidos** → Email, nome, WhatsApp já aparecem
6. **Pessoa cria senha** → Apenas precisa escolher senha
7. **Conta criada automaticamente** → Trial de 3 dias ativado
8. **Login automático** → Redireciona para área Wellness
9. **Link expira** → Não pode mais ser usado

---

## 🚀 Como Usar

### **1. Gerar Link de Convite**

**Endpoint:** `POST /api/wellness/trial/generate-invite`

**Autenticação:** Requer login (usuário Wellness)

**Body:**
```json
{
  "email": "pessoa@exemplo.com",
  "nome_completo": "João Silva", // Opcional
  "whatsapp": "11999999999" // Opcional
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "abc123...",
  "invite_url": "https://www.ylada.com/pt/wellness/trial/abc123...",
  "message": "Link de convite gerado com sucesso! Compartilhe este link."
}
```

**Exemplo de uso:**
```javascript
const response = await fetch('/api/wellness/trial/generate-invite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'pessoa@exemplo.com',
    nome_completo: 'João Silva',
    whatsapp: '11999999999'
  })
})

const data = await response.json()
console.log('Link para compartilhar:', data.invite_url)
```

---

## 🔒 Segurança e Validações

### **Validações Implementadas:**

1. ✅ **Email único:** Verifica se email já tem conta antes de gerar link
2. ✅ **Token único:** Cada link tem token único e seguro
3. ✅ **Uso único:** Link só pode ser usado UMA vez
4. ✅ **Expiração:** Link expira em 7 dias (configurável)
5. ✅ **Verificação de status:** Verifica se link está pendente antes de usar
6. ✅ **Email confirmado automaticamente:** Não precisa verificar email
7. ✅ **Senha obrigatória:** Mínimo 6 caracteres

### **O que acontece quando link é usado:**

1. Status muda de `pending` → `used`
2. Campo `used_at` é preenchido
3. Campo `used_by_user_id` é preenchido
4. **Link não pode mais ser usado** (mesmo que alguém tente)

### **Verificação de Email:**

- ✅ Email é **confirmado automaticamente** ao criar conta
- ✅ Não precisa verificar email manualmente
- ✅ Sistema usa `email_confirm: true` no Supabase Auth
- ✅ **Após criar conta, email não pode mais usar o link** (já tem conta)

---

## 📊 Estrutura de Dados

### **Tabela `trial_invites`:**

```sql
- id: UUID (PK)
- token: TEXT (único, usado na URL)
- email: TEXT (obrigatório)
- nome_completo: TEXT (opcional)
- whatsapp: TEXT (opcional)
- created_by_user_id: UUID (quem criou o convite)
- created_by_email: TEXT (email de quem criou)
- status: TEXT ('pending', 'used', 'expired', 'cancelled')
- used_at: TIMESTAMPTZ (quando foi usado)
- used_by_user_id: UUID (quem usou o link)
- expires_at: TIMESTAMPTZ (quando expira)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### **Subscription criada:**

```sql
- plan_type: 'trial'
- status: 'active'
- current_period_end: NOW() + 3 dias
- amount: 0
- currency: 'BRL'
```

---

## 🎯 Endpoints Criados

### **1. Gerar Link**
`POST /api/wellness/trial/generate-invite`
- Gera link único
- Valida email
- Retorna URL para compartilhar

### **2. Validar Link**
`POST /api/wellness/trial/validate-invite`
- Valida token
- Retorna dados pré-preenchidos
- Não marca como usado ainda

### **3. Criar Conta**
`POST /api/wellness/trial/create-account`
- Cria usuário no Supabase Auth
- Cria perfil
- Cria trial de 3 dias
- Marca link como usado
- Gera magic link para login automático

---

## 📄 Páginas Criadas

### **Landing Page:**
`/pt/wellness/trial/[token]`

**Fluxo:**
1. Valida token automaticamente
2. Mostra dados pré-preenchidos
3. Solicita senha
4. Cria conta
5. Redireciona para área Wellness

---

## ✅ Checklist de Implementação

- [x] Migração da tabela `trial_invites`
- [x] Funções helper (`trial-helpers.ts`)
- [x] Endpoint para gerar link
- [x] Endpoint para validar link
- [x] Endpoint para criar conta
- [x] Página de landing
- [x] Suporte a `plan_type: 'trial'` em `subscription-helpers`
- [x] Validação de uso único
- [x] Validação de expiração
- [x] Email confirmado automaticamente
- [x] Login automático após criação

---

## 🔍 Verificações de Segurança

### **Email não pode usar link novamente:**

1. **Ao gerar link:** Verifica se email já tem conta → ❌ Erro
2. **Ao criar conta:** Verifica novamente → ❌ Erro se já existe
3. **Após criar conta:** Link marcado como `used` → ❌ Não pode usar novamente

### **Link expira:**

- Padrão: 7 dias após criação
- Configurável via `expires_in_days`
- Verificado em todas as etapas

---

## 🚨 Importante

1. **Email confirmado automaticamente:** Não precisa verificar email
2. **Link uso único:** Cada link só pode ser usado uma vez
3. **Trial de 3 dias:** Começa imediatamente após criar conta
4. **Após trial:** Usuário precisa assinar para continuar
5. **Email não pode reutilizar:** Se email já tem conta, não pode usar link

---

## 📝 Próximos Passos (Opcional)

1. Adicionar banner de expiração (quando faltar 1 dia)
2. Adicionar página de admin para ver convites criados
3. Adicionar estatísticas de conversão
4. Adicionar notificação quando trial expirar
