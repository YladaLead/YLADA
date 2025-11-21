# 🚀 GUIA: Criar Contas Coach com Senhas Provisórias

Este guia explica como criar contas para os três emails na área Coach com senhas provisórias e assinaturas de 1 ano.

## 📋 Emails a Processar

- `amandabonfogo01@gmail.com` - Amanda Bonfogo
- `naytenutri@gmail.com` - Nayte Nutri  
- `deisefaula@gmail.com` - Deise Faula

## 🎯 Duas Opções de Solução

### **Opção 1: Script Node.js (RECOMENDADO)**
**Use quando:** Os usuários ainda não existem OU você quer criar tudo de uma vez

**Vantagens:**
- ✅ Cria usuários automaticamente
- ✅ Define senhas provisórias
- ✅ Cria assinaturas automaticamente
- ✅ Confirma email automaticamente
- ✅ Cria perfis em `user_profiles`

**Como usar:**
```bash
# 1. Certifique-se de ter as variáveis de ambiente configuradas
# No arquivo .env.local:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...

# 2. Execute o script
node scripts/criar-contas-coach-com-senha-provisoria.js
```

**O que o script faz:**
1. Verifica se cada usuário já existe
2. Se não existir, cria com senha provisória
3. Se existir, atualiza a senha para a provisória
4. Cria/atualiza o perfil em `user_profiles`
5. Cria/atualiza a assinatura de 1 ano na área Coach
6. Mostra um resumo completo

**Senhas Provisórias:**
- Amanda: `Coach2024!Amanda`
- Nayte: `Coach2024!Nayte`
- Deise: `Coach2024!Deise`

---

### **Opção 2: Script SQL**
**Use quando:** Os usuários já existem e você só quer ativar/atualizar as assinaturas

**Vantagens:**
- ✅ Mais rápido se os usuários já existem
- ✅ Pode ser executado diretamente no Supabase SQL Editor

**Como usar:**
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Cole o conteúdo de `scripts/ativar-assinaturas-coach-usuarios-existentes.sql`
4. Execute o script

**O que o script faz:**
1. Lista o status atual dos usuários
2. Cria/atualiza assinaturas de 1 ano
3. Atualiza perfis para área Coach
4. Mostra resultado final

**⚠️ IMPORTANTE:** Este script NÃO cria usuários novos. Se o usuário não existir, use a Opção 1.

---

## 📧 Mensagem para Enviar aos Usuários

Após executar o script, envie esta mensagem para cada pessoa:

```
Olá [NOME]!

Sua conta na área Coach da YLADA foi criada/atualizada com sucesso!

📧 Email: [EMAIL]
🔑 Senha provisória: [SENHA]

⚠️ IMPORTANTE: Por favor, altere sua senha após o primeiro login.

🔗 Acesse: https://www.ylada.com/pt/coach/login

Sua assinatura está ativa por 1 ano a partir de hoje.

Qualquer dúvida, entre em contato!

Equipe YLADA
```

**Substitua:**
- `[NOME]` pelo nome da pessoa
- `[EMAIL]` pelo email dela
- `[SENHA]` pela senha provisória correspondente

---

## 🔍 Verificar se Funcionou

### Via SQL:
```sql
SELECT 
  u.email,
  up.nome_completo,
  s.status,
  s.current_period_end,
  s.current_period_end - NOW() as dias_restantes
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.area = 'coach'
WHERE u.email IN (
  'amandabonfogo01@gmail.com',
  'naytenutri@gmail.com',
  'deisefaula@gmail.com'
)
ORDER BY u.email;
```

### Via Admin Dashboard:
1. Acesse `/admin/usuarios`
2. Busque pelos emails
3. Verifique se têm assinatura ativa na área Coach

---

## ❓ Problemas Comuns

### "Erro: Usuário já existe mas não consegue fazer login"
**Solução:** Execute o script Node.js que vai atualizar a senha para a provisória.

### "Erro: Email já está em uso"
**Solução:** Isso significa que o usuário já existe. Use o script SQL para apenas ativar a assinatura, ou o script Node.js que vai atualizar tudo.

### "Erro: NEXT_PUBLIC_SUPABASE_URL não encontrado"
**Solução:** Certifique-se de ter o arquivo `.env.local` na raiz do projeto com as variáveis corretas.

---

## ✅ Checklist

- [ ] Executar script Node.js OU SQL
- [ ] Verificar se as contas foram criadas
- [ ] Verificar se as assinaturas estão ativas
- [ ] Enviar mensagem com senhas provisórias
- [ ] Testar login com uma das contas
- [ ] Confirmar que o acesso à área Coach está funcionando

---

## 📝 Notas

- As senhas provisórias são fortes mas devem ser alteradas no primeiro login
- As assinaturas são válidas por 365 dias (1 ano)
- O email é confirmado automaticamente ao criar via script Node.js
- Se o usuário já tiver assinatura ativa, ela será estendida para 1 ano a partir de hoje

