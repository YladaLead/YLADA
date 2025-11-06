# 📋 Instruções: Configurar Usuários de Suporte

Este documento contém as instruções para configurar os dois usuários de suporte com acesso a todas as áreas.

---

## 👥 Usuários de Suporte

1. **Renata Borges**
   - Email: `renataborges.mpm@gmail.com`
   - Status: ✅ Já cadastrada
   - Ação: Atualizar perfil para `is_support = true`

2. **Renan Lieiria**
   - Email: `renan.mdlr@gmail.com`
   - Senha: `123456`
   - Status: ⏳ Precisa ser criado
   - Ação: Criar usuário no Supabase Auth + Criar perfil com `is_support = true`

---

## 🚀 Passo a Passo

### Passo 1: Criar Usuário Renan no Supabase Auth

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** > **Users**
3. Clique em **Add User** ou **Invite User**
4. Preencha os dados:
   - **Email**: `renan.mdlr@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ (marcar esta opção para já estar autenticado)
5. Clique em **Create User**

### Passo 2: Executar Script SQL

Após criar o usuário Renan no Dashboard, execute o script SQL `configurar-usuarios-suporte.sql` no **Supabase SQL Editor**.

Este script irá:
- ✅ Atualizar o perfil da Renata para `is_support = true`
- ✅ Criar o perfil do Renan com `is_support = true`
- ✅ Verificar se tudo está configurado corretamente

### Passo 3: Verificar Configuração

Após executar o script, verifique se ambos os usuários aparecem na lista de suporte:

```sql
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_admin,
  up.is_support,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
ORDER BY up.nome_completo;
```

---

## 🔐 Permissões

### O que `is_support = true` permite:

- ✅ Acessar **todas as áreas** (Wellness, Nutri, Coach, Nutra)
- ✅ Ver e gerenciar ferramentas de todos os usuários
- ✅ Navegar pelos dashboards de todas as áreas
- ✅ Ajudar usuários com problemas técnicos

### O que `is_support = true` NÃO permite:

- ❌ Acesso administrativo completo (`is_admin = false`)
- ❌ Modificar configurações do sistema
- ❌ Deletar dados críticos

---

## 📝 Notas Importantes

1. **Renata já está cadastrada**: O script apenas atualizará o perfil dela para `is_support = true`

2. **Renan precisa ser criado primeiro**: Você precisa criar o usuário no Supabase Dashboard antes de executar o script SQL

3. **Senha do Renan**: A senha sugerida é `123456`, mas você pode alterar depois se necessário

4. **Acesso a todas as áreas**: Com `is_support = true`, ambos os usuários poderão acessar Wellness, Nutri, Coach e Nutra

---

## 🐛 Troubleshooting

### Problema: Usuário Renan não aparece após executar script

**Solução**: 
1. Verifique se o usuário foi criado no Supabase Auth primeiro
2. Verifique se o email está correto: `renan.mdlr@gmail.com`
3. Execute novamente a parte do script que cria o perfil do Renan

### Problema: Renata não tem acesso a todas as áreas

**Solução**:
1. Verifique se `is_support = true` no perfil dela
2. Verifique se ela está fazendo login corretamente
3. Verifique as políticas RLS no Supabase

---

## ✅ Checklist Final

- [ ] Usuário Renan criado no Supabase Auth
- [ ] Script SQL executado com sucesso
- [ ] Renata tem `is_support = true` no perfil
- [ ] Renan tem `is_support = true` no perfil
- [ ] Ambos conseguem fazer login
- [ ] Ambos conseguem acessar todas as áreas

---

**Última atualização**: 2024-01-XX  
**Criado por**: Sistema de Configuração YLADA

