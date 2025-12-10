# 🔐 Sistema de Acesso Restrito - Upload Biblioteca

## ✅ Implementação Completa

Foi criado um sistema de acesso restrito para upload de materiais na biblioteca Wellness, **exclusivo para equipe de suporte**, sem acesso à área administrativa completa.

---

## 📋 O que foi criado

### 1. **Nova API Route** (`/api/wellness/biblioteca/upload`)
- ✅ Verifica apenas `is_support` ou `is_admin`
- ✅ Rejeita qualquer outro usuário
- ✅ Mesma funcionalidade de upload, mas com verificação de suporte

### 2. **Nova Página de Upload** (`/pt/wellness/biblioteca/upload`)
- ✅ **Fora da área `/admin/`** - não tem acesso a outras áreas administrativas
- ✅ Interface idêntica à anterior
- ✅ Verifica permissões no frontend também
- ✅ Mostra mensagem de "Acesso Restrito" se não for suporte

### 3. **Políticas de Storage Atualizadas**
- ✅ Upload: Admins **E** Suporte podem fazer upload
- ✅ Leitura: Wellness users, Admins e Suporte podem ler
- ✅ Delete: Admins **E** Suporte podem deletar (Migração 029)

---

## 🔗 Como Acessar

### Para Equipe de Suporte:

1. **Login normal** na plataforma Wellness
2. Acesse diretamente: `/pt/wellness/biblioteca/upload`
3. Ou adicione um link no menu (opcional)

### URL Direta:
```
https://ylada.app/pt/wellness/biblioteca/upload
```

---

## 🔒 Segurança

### Verificações Implementadas:

1. **Frontend (`page.tsx`)**:
   - Verifica `userProfile?.is_support || userProfile?.is_admin`
   - Mostra tela de "Acesso Restrito" se não autorizado

2. **Backend (`route.ts`)**:
   - Verifica `profile.is_support || profile.is_admin`
   - Retorna erro 403 se não autorizado

3. **Storage Policies**:
   - Upload: `is_admin = true OR is_support = true`
   - Delete: `is_admin = true OR is_support = true` (Migração 029)

---

## 👤 Como Dar Acesso a Alguém

### Opção 1: Via Supabase Dashboard

1. Acesse: **Supabase Dashboard → Table Editor → user_profiles**
2. Encontre o usuário pelo email
3. Edite o registro e marque: `is_support = true`
4. Salve

### Opção 2: Via SQL

```sql
-- Dar acesso de suporte para um usuário específico
UPDATE user_profiles
SET is_support = true
WHERE email = 'email@exemplo.com';

-- Verificar se foi aplicado
SELECT 
  email,
  nome_completo,
  is_support,
  is_admin
FROM user_profiles
WHERE email = 'email@exemplo.com';
```

---

## ✅ Vantagens

1. **Isolamento**: Suporte não acessa `/admin/` e outras áreas administrativas
2. **Segurança**: Verificação dupla (frontend + backend)
3. **Simplicidade**: Mesma interface, apenas mudou a verificação
4. **Controle**: Você pode dar/remover acesso facilmente via `is_support`

---

## 📝 Notas Importantes

- ✅ Suporte pode **fazer upload** de materiais
- ✅ Suporte pode **ler** materiais
- ✅ Suporte **pode deletar** materiais (Migração 029)
- ❌ Suporte **NÃO tem acesso** à área `/admin/`
- ✅ Admin continua tendo acesso total (incluindo upload e delete)

---

## 🔄 Próximos Passos (Opcional)

Se quiser adicionar um link no menu para facilitar acesso:

1. Adicione um item no sidebar Wellness
2. Ou crie uma página de "Área do Suporte" com links úteis
3. Ou envie o link direto para a pessoa: `/pt/wellness/biblioteca/upload`

---

**Status:** ✅ Implementação completa e funcional!
