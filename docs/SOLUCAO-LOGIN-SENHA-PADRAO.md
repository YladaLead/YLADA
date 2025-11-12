# 🔑 Solução: Login com Senha Padrão para Usuários Migrados

## ✅ Solução Implementada

Agora os usuários migrados podem entrar **diretamente pelo login normal**, sem precisar da página `/migrado`.

## 📋 Como Funciona

### 1. **Senha Padrão**
- **Senha padrão para todos os usuários migrados:** `Ylada2025!`
- Esta senha é definida automaticamente quando os usuários são importados

### 2. **Fluxo do Usuário Migrado**

1. **Usuário acessa:** `https://www.ylada.com/pt/wellness/login`
2. **Vê mensagem informativa:** "🔑 Usuário migrado? Use sua senha padrão: **Ylada2025!**"
3. **Faz login:** Email + Senha padrão (`Ylada2025!`)
4. **Sistema verifica perfil:**
   - Se perfil **incompleto** (sem nome ou whatsapp) → Redireciona para `/pt/wellness/bem-vindo?migrado=true`
   - Se perfil **completo** → Redireciona para `/pt/wellness/dashboard`
5. **Completa cadastro:** Preenche nome, telefone e define nova senha
6. **Redireciona:** Vai para o dashboard

## 🔧 Como Definir Senha Padrão

### **Opção 1: Via Interface Admin**

1. Acesse `/admin/usuarios`
2. Vá até a seção "Definir Senha Padrão"
3. Clique em "Definir Senha Padrão para Usuários Migrados"
4. Aguarde a confirmação

### **Opção 2: Via API**

```bash
POST /api/admin/usuarios/set-default-password
Authorization: Bearer [seu-token-admin]

Body:
{
  "defaultPassword": "Ylada2025!",
  "area": "wellness" // opcional
}
```

## 📝 Instruções para Usuários Migrados

**Envie esta mensagem para os usuários migrados:**

```
Olá! Sua conta foi migrada para o novo sistema YLADA.

Para acessar:
1. Acesse: https://www.ylada.com/pt/wellness/login
2. Use seu email: [seu-email]
3. Use a senha padrão: Ylada2025!
4. Complete seu cadastro (nome, telefone e nova senha)
5. Pronto! Você já pode usar a plataforma.

⚠️ IMPORTANTE: Após o primeiro login, você poderá alterar sua senha.
```

## ✅ Vantagens desta Solução

1. ✅ **Mais simples:** Não precisa de página especial `/migrado`
2. ✅ **Mais rápido:** Login direto, sem tokens ou magic links
3. ✅ **Mais confiável:** Não depende de sincronização de sessão
4. ✅ **Mais seguro:** Usuário define sua própria senha no primeiro acesso
5. ✅ **Melhor UX:** Fluxo natural de login → cadastro → dashboard

## 🔍 Verificação

Para verificar se um usuário migrado tem senha padrão definida:

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Users**
3. Busque pelo email do usuário
4. Verifique se a senha foi definida (não será possível ver a senha, mas você pode testar fazendo login)

## 🚨 Importante

- A senha padrão deve ser definida **antes** de enviar as instruções aos usuários
- Use a API `/api/admin/usuarios/set-default-password` para definir em massa
- A senha padrão é: `Ylada2025!` (pode ser alterada na API se necessário)

