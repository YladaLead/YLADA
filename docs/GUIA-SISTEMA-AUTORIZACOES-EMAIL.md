# 📧 Sistema de Autorizações por Email

## 🎯 Objetivo

Permitir que administradores autorizem emails **antes** do cadastro. Quando o usuário se cadastrar com o email autorizado, a assinatura será **ativada automaticamente**.

---

## ✅ O que foi criado

### 1. **Tabela no Banco de Dados**
- `migrations/criar-tabela-email-authorizations.sql`
- Tabela `email_authorizations` para armazenar autorizações pendentes

### 2. **APIs**
- `POST /api/admin/email-authorizations` - Criar nova autorização
- `GET /api/admin/email-authorizations` - Listar autorizações (com filtros)
- `DELETE /api/admin/email-authorizations/[id]` - Cancelar autorização
- `POST /api/auth/activate-pending-authorization` - Ativar autorização após cadastro (automático)

### 3. **Página Admin**
- `src/app/admin/email-authorizations/page.tsx`
- Interface completa para gerenciar autorizações

### 4. **Integração no Cadastro**
- `src/components/auth/LoginForm.tsx` - Verifica e ativa autorizações automaticamente após cadastro

---

## 🚀 Como Usar

### Passo 1: Executar a Migration

No Supabase SQL Editor, execute:
```sql
-- Arquivo: migrations/criar-tabela-email-authorizations.sql
```

### Passo 2: Acessar a Página Admin

1. Acesse `/admin/email-authorizations` (precisa estar logado como admin)
2. Você verá:
   - Formulário para criar nova autorização
   - Lista de autorizações existentes
   - Filtros por área e status

### Passo 3: Criar Autorização

1. Preencha o formulário:
   - **Email**: email do usuário (ex: `joao@exemplo.com`)
   - **Área**: Coach, Nutri, Wellness ou Nutra
   - **Validade**: número de dias (ex: 365 = 1 ano)
   - **Notas**: opcional (ex: "Convite especial", "Beta tester")

2. Clique em **"✅ Criar Autorização"**

### Passo 4: Usuário se Cadastra

Quando o usuário se cadastrar em `/pt/coach/login` (ou outra área) com o email autorizado:

1. ✅ O sistema verifica automaticamente se há autorização pendente
2. ✅ Cria a assinatura automaticamente
3. ✅ Marca a autorização como "ativada"
4. ✅ Usuário já tem acesso completo!

---

## 📋 Status das Autorizações

- **Pendente** (pending): Aguardando cadastro do usuário
- **Ativada** (activated): Já foi usada, assinatura criada
- **Expirada** (expired): Não foi usada a tempo (futuro)
- **Cancelada** (cancelled): Cancelada pelo admin

---

## 🔍 Exemplo de Uso

### Cenário: Autorizar 3 emails para Coach por 1 ano

1. Acesse `/admin/email-authorizations`
2. Crie 3 autorizações:
   - Email 1: `joao@exemplo.com` | Área: Coach | Validade: 365 dias
   - Email 2: `maria@exemplo.com` | Área: Coach | Validade: 365 dias
   - Email 3: `pedro@exemplo.com` | Área: Coach | Validade: 365 dias

3. Quando cada pessoa se cadastrar:
   - Ela cria conta em `/pt/coach/login`
   - Sistema detecta autorização pendente
   - Assinatura de 1 ano é criada automaticamente
   - Status muda para "Ativada"

---

## ⚙️ Detalhes Técnicos

### Fluxo Automático

```
1. Admin cria autorização → email_authorizations (status: 'pending')
2. Usuário se cadastra → LoginForm detecta cadastro
3. LoginForm chama → /api/auth/activate-pending-authorization
4. API verifica → email_authorizations (status: 'pending')
5. API cria → subscriptions (status: 'active')
6. API atualiza → email_authorizations (status: 'activated')
```

### Validações

- ✅ Email não pode ter autorização pendente duplicada para mesma área
- ✅ Se usuário já existe e tem assinatura ativa, não cria nova
- ✅ Se usuário já existe mas não tem assinatura, cria automaticamente
- ✅ Se usuário não existe, aguarda cadastro

---

## 🎨 Interface Admin

A página `/admin/email-authorizations` inclui:

- ✅ Formulário para criar autorização
- ✅ Lista de todas as autorizações
- ✅ Filtros por área e status
- ✅ Botão para cancelar autorizações pendentes
- ✅ Visualização de quando foi ativada

---

## 📝 Notas Importantes

1. **Email é case-insensitive**: `Joao@Exemplo.com` = `joao@exemplo.com`
2. **Múltiplas áreas**: Um email pode ter autorizações para diferentes áreas
3. **Validade**: A assinatura criada terá exatamente o número de dias especificado
4. **Gratuito**: Todas as assinaturas criadas via autorização são gratuitas (amount: 0)

---

## 🔗 Links Relacionados

- Página Admin: `/admin/email-authorizations`
- API Docs: Ver arquivos em `src/app/api/admin/email-authorizations/`
- Migration: `migrations/criar-tabela-email-authorizations.sql`

