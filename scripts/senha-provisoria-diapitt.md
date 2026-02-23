# Senha provisória – diapitt@gmail.com (Nutri)

## 1. Como definir a senha no sistema

A senha provisória que ela deve usar é: **Nutri123**

### Opção A – Via API (recomendado)

No seu ambiente (ou em produção), chame a API de reset de senha:

```bash
curl -X POST https://www.ylada.com/api/admin/emergency-reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"diapitt@gmail.com","newPassword":"Nutri123","key":"ylada-emergency-2025"}'
```

*(Se você tiver `EMERGENCY_RESET_KEY` configurada no `.env`, use esse valor em `key`.)*

### Opção B – Via Dashboard Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) do projeto.
2. Vá em **Authentication** → **Users**.
3. Procure o usuário **diapitt@gmail.com**.
4. Clique nos três pontinhos (⋯) no usuário → **Reset password** (ou **Update user**).
5. Defina a senha: **Nutri123** e salve.

### Se deu “e-mail ou senha incorreto” (Diana)

Pode ser que o **e-mail cadastrado** seja diferente do que ela está usando (typo, outro e-mail, etc.). Faça o seguinte:

1. **Conferir o e-mail certo no Supabase**  
   - Authentication → Users → use a busca e procure por “diapitt” ou “diana”.  
   - Ou em **Table Editor** → `user_profiles` ou `subscriptions`: filtre por nome/email e veja com qual e-mail a Diana está cadastrada.

2. **Se encontrar outro e-mail (ex.: dianapitt@gmail.com):**  
   - Anote o e-mail correto.  
   - Use a **Opção A** (API) ou **Opção B** (Dashboard) com esse e-mail e senha **Nutri123**.  
   - Envie para a Diana a mensagem da seção 2 **trocando para o e-mail correto** e mantendo a senha Nutri123.

3. **Se o e-mail for mesmo diapitt@gmail.com** e mesmo assim não entrar:  
   - No Dashboard: Authentication → Users → localize **diapitt@gmail.com** → **Reset password** e defina de novo **Nutri123** (às vezes o reset anterior não aplicou).  
   - Ou chame de novo a API (Opção A) com `email: "diapitt@gmail.com"` e `newPassword: "Nutri123"`.

4. **Alternativa: “Esqueci minha senha”**  
   - Peça para ela acessar **https://www.ylada.com/pt/nutri/recuperar-senha**, colocar o **e-mail que ela usa** (o que está cadastrado) e seguir o fluxo. Assim ela define uma senha nova por link no e-mail.

### Se ela entrou mas vê “Acesso Restrito” (plano com ferramentas/completo)

Isso significa que o **login está ok**, mas a **assinatura** dela não tem as *features* corretas (ferramentas/completo). O sistema exige que a linha em `subscriptions` tenha `features` com `ferramentas` e/ou `cursos` ou `completo`.

**O que fazer:**

1. **Rodar o script de correção no Supabase (SQL Editor):**  
   Abra e execute o arquivo **`scripts/corrigir-assinatura-nutri-diana-diapitt.sql`**. Ele atualiza a assinatura ativa da Diana (diapitt@gmail.com) para `features = ['ferramentas', 'cursos']`.

2. **Ou corrigir manualmente no Supabase:**  
   - Table Editor → `subscriptions`  
   - Filtre por `user_id` = (id do usuário diapitt@gmail.com em auth.users) e `area` = `nutri`  
   - Na assinatura ativa (`status` = active, `current_period_end` no futuro), edite a coluna **`features`** e coloque: `["ferramentas", "cursos"]` (tipo jsonb).

3. Depois peça para ela **recarregar a página** ou **sair e entrar de novo** na plataforma.

---

## 2. Mensagem para enviar à cliente

**Sugestão de imagem:** Inclua no topo do e-mail uma imagem de qualidade/suporte (ex.: logo Ylada, banner de boas-vindas ou ilustração de “estamos aqui para ajudar”). Se usar ferramenta de e-mail marketing, pode anexar ou usar URL de imagem hospedada (ex.: `https://www.ylada.com/...` de alguma asset do site).

Você pode copiar e colar (e ajustar o tom se quiser):

---

**Assunto:** Acesso à plataforma Ylada Nutri – senha de acesso

[INSERIR IMAGEM AQUI – ex.: banner de boas-vindas ou ícone de suporte/qualidade]

Olá,

Peço desculpas pelo transtorno com o acesso à plataforma. Não identificamos a causa do problema no nosso lado, mas para você não ficar sem acessar, definimos uma **senha provisória** para você entrar agora.

**Seus dados de acesso:**

- **E-mail:** diapitt@gmail.com  
- **Senha provisória:** Nutri123  

**Como acessar (passo a passo):**

1. Abra no navegador: **https://www.ylada.com/pt/nutri/login**
2. Digite seu **e-mail:** diapitt@gmail.com
3. Digite a **senha provisória:** Nutri123
4. Clique em **Entrar**.

Depois de entrar, recomendamos que você **troque a senha** por uma de sua preferência em **Configurações** (ou no menu da sua conta), por segurança.

**Suporte à sua disposição:** Você pode contar com nosso **canal de suporte** sempre que precisar. Nosso time está disponível **sete dias por semana** para tirar dúvidas e resolver qualquer situação — seja pelo **chat dentro da plataforma** (menu Suporte, após fazer login) ou pelo **WhatsApp** ([clique aqui para falar conosco](https://wa.me/5519996049800?text=Olá!%20Preciso%20de%20suporte%20na%20YLADA%20Nutri.)). **Qualidade no atendimento** é uma prioridade para nós, e estamos aqui para garantir que sua experiência na Ylada seja a melhor possível.

Se aparecer qualquer mensagem de erro ou não conseguir entrar, responda este e-mail ou fale conosco pelo suporte; te ajudamos na hora.

Obrigado pela compreensão e por fazer parte da Ylada.

---

## 3. Passo a passo resumido para a cliente

| Passo | O que fazer |
|-------|-------------|
| 1 | Acessar **https://www.ylada.com/pt/nutri/login** |
| 2 | E-mail: **diapitt@gmail.com** |
| 3 | Senha: **Nutri123** |
| 4 | Clicar em **Entrar** |
| 5 | (Opcional) Trocar a senha em **Configurações** depois do primeiro acesso |

---

*Script gerado para usuária diapitt (diapitt@gmail.com) – área Nutri.*
