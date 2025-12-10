# 📋 Instruções: Criar Usuário de Suporte para Biblioteca Wellness

Este guia explica como criar um usuário de suporte com acesso à área de **Biblioteca Wellness** para fazer upload de materiais (vídeos, PDFs, imagens).

---

## 🎯 Objetivo

Criar um usuário que possa:
- ✅ Fazer **upload** de materiais na biblioteca wellness
- ✅ **Ler** materiais da biblioteca wellness
- ✅ **Deletar** materiais da biblioteca wellness (Migração 029)

---

## 📧 E-mail Configurado

**E-mail dedicado:** `suportewellness@ylada.com`  
**Senha:** `123456`

---

## 🚀 Passo a Passo

### **Passo 1: Criar Usuário no Supabase Auth**

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Vá em Authentication > Users**
   - Menu lateral esquerdo → Authentication → Users

3. **Clique em "Add User"** (botão no canto superior direito)

4. **Preencha os dados:**
   - **Email**: `suportewellness@ylada.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ **MARCAR ESTA OPÇÃO** (muito importante!)

5. **Clique em "Create User"**

✅ **Pronto!** O usuário foi criado no Supabase Auth.

---

### **Passo 2: Executar Script SQL**

Agora você precisa configurar o perfil do usuário com `is_support = true`.

1. **Acesse o Supabase SQL Editor**
   - Menu lateral → SQL Editor → New Query

2. **Abra o arquivo de migração:**
   - `migrations/023-criar-usuario-suporte-biblioteca-wellness.sql`

3. **Execute o script** (botão "Run" ou `Cmd/Ctrl + Enter`)

4. **Verifique o resultado:**
   - O script mostrará mensagens de sucesso
   - A query no final mostrará o usuário configurado

---

### **Passo 3: Verificar Configuração**

Execute esta query no SQL Editor para verificar:

```sql
SELECT 
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE up.is_support = true
  AND up.email = 'suportewellness@ylada.com'
ORDER BY up.created_at DESC;
```

**Resultado esperado:**
- `is_support`: `true` ✅
- `is_admin`: `false`
- `email_confirmado`: `true` ✅

---

## ✅ Testar Acesso

Após configurar, teste se o usuário tem acesso:

1. **Faça logout** (se estiver logado)

2. **Faça login** com:
   - **E-mail**: `suportewellness@ylada.com`
   - **Senha**: `123456`

3. **Acesse a página de upload:**
   - URL: `http://localhost:3000/pt/wellness/biblioteca/upload`
   - Ou em produção: `https://www.ylada.com/pt/wellness/biblioteca/upload`

4. **Teste fazer upload:**
   - Você deve conseguir fazer upload de arquivos
   - Formatos permitidos: MP4, PDF, JPG, PNG, GIF, WEBP
   - Categorias disponíveis (idênticas à Biblioteca Oficial):
     - 📄 Materiais de Apresentação
     - 📖 Cartilhas de Treinamento
     - 🥤 Produtos & Bebidas
     - 💬 Scripts Oficiais
     - 🎥 Vídeos de Treinamento

---

## 🔐 Permissões Concedidas

Com `is_support = true`, o usuário pode:

✅ **Fazer upload** de materiais na biblioteca wellness  
✅ **Ler/visualizar** materiais da biblioteca wellness  
✅ **Deletar** materiais da biblioteca wellness (Migração 029)  
✅ **Acessar** a área de wellness  
❌ **Não é admin** (não tem acesso a área administrativa)

---

## 📝 Resumo Rápido

1. ✅ Criar usuário no Supabase Dashboard:
   - Email: `suportewellness@ylada.com`
   - Password: `123456`
   - Auto Confirm: ✅

2. ✅ Executar script SQL `023-criar-usuario-suporte-biblioteca-wellness.sql`

3. ✅ Testar acesso em `/pt/wellness/biblioteca/upload`

---

## 🆘 Problemas Comuns

### **Erro: "Usuário não encontrado"**
- ✅ Verifique se criou o usuário no Supabase Dashboard
- ✅ Verifique se o e-mail está correto: `suportewellness@ylada.com` (sem ponto)
- ✅ Verifique se marcou "Auto Confirm User"

### **Erro: "Perfil já existe"**
- ✅ Isso é normal! O script atualiza o perfil existente
- ✅ Verifique se `is_support = true` foi aplicado

### **Não consegue fazer upload**
- ✅ Verifique se fez login com o e-mail correto
- ✅ Verifique se `is_support = true` no perfil
- ✅ Verifique se as políticas de storage estão configuradas (migração 022)

---

## 📞 Suporte

Se tiver problemas, verifique:
1. ✅ Usuário existe em `auth.users`
2. ✅ Perfil existe em `user_profiles` com `is_support = true`
3. ✅ Políticas de storage estão configuradas (migração 022)

---

**Última atualização:** Dezembro 2024
