# 🔄 Fluxo de Usuários Migrados

## ✅ Como Funciona

### 1. **Login Inicial**
- **URL:** `https://www.ylada.com/pt/wellness/login`
- **Email:** Email do usuário migrado
- **Senha:** `Ylada2025!` (senha padrão)

### 2. **Verificação Automática**
Após o login bem-sucedido, o sistema verifica automaticamente:
- ✅ Se o perfil está **completo** (tem `nome_completo` e `whatsapp`)
- ⚠️ Se o perfil está **incompleto** (falta nome ou whatsapp)

### 3. **Redirecionamento**

#### **Caso 1: Perfil Completo** ✅
- Vai **direto para o Dashboard**
- URL: `/pt/wellness/dashboard`
- Pode alterar a senha depois nas configurações

#### **Caso 2: Perfil Incompleto** ⚠️
- Vai para **página de completar cadastro**
- URL: `/pt/wellness/bem-vindo?migrado=true`
- **Obrigatório preencher:**
  - Nome completo
  - Telefone/WhatsApp
  - Nova senha (opcional, mas recomendado)
- Após completar, vai para o Dashboard

---

## 📧 Mensagem para Enviar aos Usuários Migrados

```
Olá! Sua conta foi migrada para o novo sistema YLADA.

Para acessar:
1. Acesse: https://www.ylada.com/pt/wellness/login
2. Use seu email: [seu-email]
3. Use a senha padrão: Ylada2025!
4. Complete seu cadastro (se necessário)
5. Pronto! Você já pode usar a plataforma.

⚠️ IMPORTANTE: 
- Se seu perfil estiver incompleto, você será redirecionado para completar o cadastro
- Após o primeiro login, você poderá alterar sua senha
- Use a senha padrão apenas no primeiro acesso
```

---

## 🔍 Verificação no Supabase

Para verificar se um usuário migrado tem perfil completo:

```sql
SELECT 
  email,
  nome_completo,
  whatsapp,
  CASE 
    WHEN nome_completo IS NULL OR nome_completo = '' THEN '❌ Sem nome'
    WHEN whatsapp IS NULL OR whatsapp = '' THEN '❌ Sem WhatsApp'
    ELSE '✅ Completo'
  END as status_perfil
FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'email@exemplo.com'
);
```

---

## ✅ Resumo

**SIM, você pode enviar a página de login para os migrados!**

1. ✅ Eles entram com email + senha `Ylada2025!`
2. ✅ Sistema verifica automaticamente se o perfil está completo
3. ✅ Se incompleto → vai para completar cadastro
4. ✅ Se completo → vai direto para o dashboard
5. ✅ Podem alterar a senha depois

**Tudo automático!** 🎉

