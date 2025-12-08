# 📧 Mensagem para Érika Cremmer - Acesso à Plataforma

---

## 📱 MENSAGEM PRONTA PARA ENVIAR (WhatsApp/Email)

```
Olá Érika! 👋

Sua conta no YLADA Wellness foi criada e está ativa! 🎉

📋 SEUS DADOS DE ACESSO:
• Email: evsnutrivibe@gmail.com
• Plano: Anual (12 meses)
• Status: Ativo ✅

🔐 COMO ACESSAR (PASSO A PASSO):

1️⃣ Acesse o site:
   https://ylada.app/pt/wellness/login

2️⃣ Clique em "Esqueci minha senha"

3️⃣ Digite seu email: evsnutrivibe@gmail.com

4️⃣ Você receberá um email com o link para criar sua senha

5️⃣ Clique no link do email e defina uma senha nova

6️⃣ Pronto! Você já pode fazer login e acessar todas as ferramentas

---

💡 DICAS IMPORTANTES:

✅ Após criar sua senha, você terá acesso completo a:
   • NOEL - Seu mentor inteligente
   • Ferramentas de vendas e recrutamento
   • Fluxos e scripts prontos
   • Biblioteca de conteúdo
   • Treinos e plano de ação

✅ Recomendo adicionar o app à tela inicial do celular (PWA)
   para receber notificações importantes

✅ Ative as notificações push para não perder novidades

---

❓ PRECISA DE AJUDA?
Se tiver qualquer dificuldade, é só me chamar!

Bem-vinda ao YLADA Wellness! 🚀
```

---

## 📧 VERSÃO PARA EMAIL (Mais Formal)

```
Assunto: Sua conta YLADA Wellness está pronta! 🎉

Olá Érika,

Sua conta no YLADA Wellness foi criada com sucesso e está ativa!

INFORMAÇÕES DA SUA CONTA:
• Email: evsnutrivibe@gmail.com
• Plano: Anual (12 meses)
• Status: Ativo

COMO ACESSAR:

1. Acesse: https://ylada.app/pt/wellness/login

2. Clique em "Esqueci minha senha"

3. Digite seu email: evsnutrivibe@gmail.com

4. Você receberá um email com o link para criar sua senha

5. Clique no link e defina uma senha nova

6. Faça login e comece a usar!

O QUE VOCÊ TERÁ ACESSO:

✅ NOEL - Seu mentor inteligente personalizado
✅ Ferramentas de vendas e recrutamento
✅ Fluxos e scripts prontos para usar
✅ Biblioteca completa de conteúdo
✅ Treinos e plano de ação diário
✅ Links personalizados para seus clientes

DICAS:

• Adicione o app à tela inicial do celular para melhor experiência
• Ative as notificações push para receber avisos importantes
• Complete seu perfil no NOEL para orientações personalizadas

Se precisar de ajuda, estou à disposição!

Bem-vinda ao YLADA Wellness!

[Seu Nome]
```

---

## 🔍 VERIFICAÇÃO ANTES DE ENVIAR

Antes de enviar a mensagem, verifique:

1. ✅ Conta criada pelo Admin (`/admin/subscriptions`)
2. ✅ SQL executado para converter para assinatura paga
3. ✅ Assinatura ativa no banco de dados

**Query para verificar:**
```sql
SELECT 
  u.email,
  up.nome_completo,
  s.plan_type,
  s.status,
  s.amount,
  s.current_period_end
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
JOIN subscriptions s ON u.id = s.user_id
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com')
  AND s.area = 'wellness'
  AND s.status = 'active';
```

---

## 📝 NOTAS IMPORTANTES

1. **Senha Provisória:** O sistema gera uma senha temporária, mas ela não é enviada por email automaticamente. Por isso, a Érika precisa usar "Esqueci minha senha" para criar a senha dela.

2. **Recuperação de Senha:** O sistema de recuperação de senha está funcionando e envia email via Resend.

3. **Primeiro Acesso:** Após criar a senha, ela será redirecionada para `/pt/wellness/home` e pode começar a usar.

4. **Perfil NOEL:** Ela pode completar o perfil do NOEL na primeira vez que acessar para ter orientações personalizadas.

---

## 🚀 PRÓXIMOS PASSOS (Após ela acessar)

1. Ela deve completar o perfil do NOEL (onboarding)
2. Adicionar o app à tela inicial (PWA)
3. Ativar notificações push
4. Explorar as ferramentas disponíveis
