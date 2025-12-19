# 🧪 Passo a Passo: Testar Notificação de Novos Leads

## 📋 Pré-requisitos

1. **Verificar se RESEND_API_KEY está configurada:**
   ```bash
   # No terminal, verificar variável de ambiente
   echo $RESEND_API_KEY
   ```
   
   Ou verificar no arquivo `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=noreply@ylada.com
   RESEND_FROM_NAME=YLADA
   ```

2. **Servidor rodando:**
   ```bash
   npm run dev
   ```

---

## 🧪 Passo 1: Preparar o Ambiente

1. **Abrir o navegador** em modo anônimo/privado (para não estar logado)
2. **Acessar uma calculadora/quiz** da nutricionista:
   - Exemplo: `http://localhost:3000/pt/nutri/ana/calculadora-agua`
   - Ou qualquer outra ferramenta disponível

---

## 🧪 Passo 2: Preencher a Ferramenta

1. **Preencher os campos** da calculadora/quiz
2. **Clicar em "Calcular"** ou finalizar o quiz
3. **Ver o resultado** na tela

---

## 🧪 Passo 3: Deixar os Dados (Capturar Lead)

1. **Preencher o formulário de captura:**
   - Nome: `Teste Lead`
   - WhatsApp: Selecionar país (Brasil) e digitar número
   - Exemplo: `11999999999`

2. **Clicar em "Quero Receber Contato"**

3. **Verificar mensagem de sucesso** na tela

---

## 🧪 Passo 4: Verificar o Email

1. **Abrir a caixa de email** da nutricionista
   - Email cadastrado no Supabase Auth
   - Verificar também spam/lixo eletrônico

2. **Procurar por email com assunto:**
   ```
   🎉 Novo Lead: Teste Lead - Calculadora de Hidratação
   ```

3. **Verificar conteúdo do email:**
   - ✅ Nome do lead
   - ✅ Telefone
   - ✅ Ferramenta usada
   - ✅ Resultado
   - ✅ Botão "Ver Lead na Plataforma"

---

## 🧪 Passo 5: Verificar Logs do Servidor

1. **Abrir o terminal** onde o servidor está rodando
2. **Procurar por logs:**
   ```
   [Lead Notifications] ✅ Email enviado para: email@exemplo.com
   ```
   
   Ou se houver erro:
   ```
   [Lead Notifications] ❌ Erro ao enviar email: ...
   ```

---

## 🔍 Verificações Adicionais

### Verificar se o Lead foi Salvo:
1. **Fazer login** como nutricionista
2. **Acessar:** `/pt/nutri/leads`
3. **Verificar** se o lead aparece na lista

### Verificar no Console do Navegador:
1. **Abrir DevTools** (F12)
2. **Aba Console**
3. **Procurar por:**
   ```
   🔍 Lead salvo com sucesso! ID: ...
   ```

---

## ❌ Troubleshooting

### Email não chegou?

1. **Verificar RESEND_API_KEY:**
   ```bash
   # No terminal do servidor, verificar logs
   # Deve aparecer: [Lead Notifications] ✅ Email enviado
   ```

2. **Verificar spam/lixo eletrônico**

3. **Verificar email correto no Supabase:**
   - Supabase Dashboard → Authentication → Users
   - Verificar email do usuário

4. **Verificar logs do servidor:**
   - Procurar por erros relacionados a Resend
   - Verificar se `RESEND_API_KEY` está configurada

### Lead não foi salvo?

1. **Verificar console do navegador** (F12)
2. **Verificar logs do servidor**
3. **Verificar se a foreign key foi corrigida:**
   - Executar: `migrations/corrigir-foreign-key-leads-user-id.sql`

---

## ✅ Checklist de Teste

- [ ] Servidor rodando (`npm run dev`)
- [ ] RESEND_API_KEY configurada
- [ ] Acessei uma ferramenta/quiz
- [ ] Preenchi e finalizei a ferramenta
- [ ] Deixei meus dados no formulário de captura
- [ ] Recebi email de notificação
- [ ] Email contém todas as informações corretas
- [ ] Botão "Ver Lead na Plataforma" funciona
- [ ] Lead aparece na página de leads

---

## 📝 Notas

- **A notificação é assíncrona:** O email é enviado em background, não bloqueia a resposta
- **Se o email falhar:** O lead ainda é salvo (não é crítico)
- **Em desenvolvimento:** Verifique os logs do servidor para debug
