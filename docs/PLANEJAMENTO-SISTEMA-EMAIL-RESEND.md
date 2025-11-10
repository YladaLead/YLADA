# 📧 Planejamento Completo: Sistema de E-mail com Resend

## 🎯 Objetivo

Implementar um sistema robusto de e-mail para:
1. **E-mail de boas-vindas** após pagamento confirmado
2. **Link de acesso temporário** caso o cliente perca a conexão
3. **Recuperação de acesso** por e-mail
4. **Lembretes de renovação** para pagamentos manuais (PIX/Boleto)

---

## 📋 FASE 1: Configuração do Resend

### 1.1 Criar Conta no Resend

**Passo a passo:**

1. Acesse: https://resend.com
2. Clique em **"Sign Up"** ou **"Get Started"**
3. Escolha uma das opções:
   - **GitHub** (recomendado - mais rápido)
   - **Google**
   - **E-mail e senha**

4. Complete o cadastro:
   - Nome da empresa: **YLADA**
   - E-mail: use o e-mail principal da empresa
   - Confirme o e-mail enviado

### 1.2 Verificar Domínio (IMPORTANTE)

**Por que verificar?**
- E-mails enviados de domínio verificado têm melhor entrega
- Evita spam
- Aumenta confiança do cliente

**Como verificar:**

1. No painel do Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite: `ylada.com` (ou `www.ylada.com`)
4. Resend fornecerá registros DNS para adicionar:
   - **TXT** para verificação
   - **SPF** (autenticação)
   - **DKIM** (assinatura)
   - **DMARC** (política)

5. Adicione os registros DNS no seu provedor (ex: Cloudflare, GoDaddy)
6. Aguarde verificação (pode levar até 48h, geralmente 1-2h)

**Alternativa temporária:**
- Usar domínio do Resend (`onboarding@resend.dev`) para testes
- **NÃO usar em produção** - apenas para desenvolvimento

### 1.3 Obter API Key

1. No painel do Resend, vá em **"API Keys"**
2. Clique em **"Create API Key"**
3. Dê um nome: `YLADA Production` (ou `YLADA Development`)
4. Escolha permissões: **"Sending access"** (acesso de envio)
5. **Copie a API Key** (ela só aparece uma vez!)
6. Guarde em local seguro

**⚠️ IMPORTANTE:**
- **NUNCA** commite a API Key no Git
- Use variáveis de ambiente
- Tenha chaves separadas para desenvolvimento e produção

---

## 📋 FASE 2: Configuração no Projeto

### 2.1 Instalar Pacote Resend

```bash
npm install resend
```

### 2.2 Adicionar Variáveis de Ambiente

**`.env.local` (desenvolvimento):**
```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com
```

**Vercel (produção):**
- Adicionar as mesmas variáveis no painel da Vercel
- Usar API Key de **produção** do Resend

### 2.3 Estrutura de Arquivos

```
src/
├── lib/
│   └── resend.ts                    # Cliente Resend configurado
├── lib/
│   └── email-templates.ts           # Templates de e-mail
├── lib/
│   └── email-tokens.ts              # Geração/validação de tokens
├── app/
│   ├── api/
│   │   ├── email/
│   │   │   ├── send-welcome/route.ts      # Enviar e-mail de boas-vindas
│   │   │   └── send-access-link/route.ts # Enviar link de acesso
│   │   └── auth/
│   │       └── access-token/route.ts      # Validar token de acesso
│   └── pt/
│       └── wellness/
│           └── recuperar-acesso/
│               └── page.tsx               # Página de recuperação
```

---

## 📋 FASE 3: Implementação Técnica

### 3.1 Cliente Resend (`src/lib/resend.ts`)

```typescript
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY não configurada')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@ylada.com'
export const FROM_NAME = process.env.RESEND_FROM_NAME || 'YLADA'
```

### 3.2 Sistema de Tokens (`src/lib/email-tokens.ts`)

**Funcionalidades:**
- Gerar token único para cada usuário
- Token válido por 30 dias
- Armazenar no banco (tabela `access_tokens`)
- Validar token antes de permitir acesso

**Estrutura da tabela `access_tokens`:**
```sql
CREATE TABLE access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_access_tokens_token ON access_tokens(token);
CREATE INDEX idx_access_tokens_user_id ON access_tokens(user_id);
```

### 3.3 Templates de E-mail (`src/lib/email-templates.ts`)

**E-mails a criar:**

1. **E-mail de Boas-vindas** (após pagamento)
   - Assunto: "🎉 Bem-vindo ao YLADA! Seu acesso está pronto"
   - Conteúdo:
     - Parabéns pela assinatura
     - Link de acesso direto ao Dashboard
     - Instruções de primeiro uso
     - Suporte

2. **E-mail de Recuperação de Acesso**
   - Assunto: "🔐 Acesso ao seu YLADA Wellness"
   - Conteúdo:
     - Link de acesso temporário (válido 30 dias)
     - Instruções de segurança
     - Se não solicitou, ignorar

3. **E-mail de Lembrete de Renovação** (PIX/Boleto)
   - Assunto: "⏰ Sua assinatura YLADA vence em X dias"
   - Conteúdo:
     - Data de vencimento
     - Link para renovar
     - Instruções de pagamento

### 3.4 Integração no Webhook

**Modificar:** `src/app/api/webhooks/mercado-pago/route.ts`

**Adicionar após salvar subscription:**
```typescript
// Enviar e-mail de boas-vindas
try {
  await sendWelcomeEmail({
    email: payerEmail || userEmail,
    userId: userId,
    area: area,
    planType: planType
  })
} catch (error) {
  console.error('❌ Erro ao enviar e-mail de boas-vindas:', error)
  // Não bloquear o fluxo se o e-mail falhar
}
```

---

## 📋 FASE 4: Páginas e Fluxos

### 4.1 Página de Recuperação de Acesso

**Rota:** `/pt/wellness/recuperar-acesso`

**Funcionalidades:**
- Campo para inserir e-mail
- Botão "Enviar link de acesso"
- Mensagem de confirmação após envio
- Link para voltar ao login

### 4.2 Página de Acesso por Token

**Rota:** `/pt/wellness/acesso?token=xxxxx`

**Funcionalidades:**
- Validar token
- Se válido: fazer login automático e redirecionar para Dashboard
- Se inválido/expirado: mostrar erro e opção de solicitar novo link
- Se já usado: mostrar mensagem apropriada

### 4.3 Atualizar Página de Sucesso

**Modificar:** `src/app/pt/wellness/pagamento-sucesso/page.tsx`

**Adicionar:**
- Mensagem: "📧 Enviamos um e-mail com seu link de acesso"
- Botão: "Não recebeu o e-mail? Reenviar"
- Link: "Esqueceu seu e-mail? Recuperar acesso"

---

## 📋 FASE 5: Banco de Dados

### 5.1 Script SQL

**Arquivo:** `scripts/criar-tabela-access-tokens.sql`

```sql
-- Criar tabela de tokens de acesso
CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires_at ON access_tokens(expires_at);

-- Limpar tokens expirados (job/cron)
-- DELETE FROM access_tokens WHERE expires_at < NOW() AND used_at IS NULL;
```

### 5.2 Adicionar campo `email_sent` em `subscriptions`

```sql
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP WITH TIME ZONE;
```

---

## 📋 FASE 6: Testes e Validação

### 6.1 Testes Locais

1. **Testar envio de e-mail:**
   - Criar endpoint de teste
   - Enviar e-mail para seu e-mail pessoal
   - Verificar se chegou na caixa de entrada (não spam)

2. **Testar tokens:**
   - Gerar token
   - Validar token
   - Testar expiração
   - Testar uso único (se aplicável)

3. **Testar fluxo completo:**
   - Simular pagamento
   - Verificar se e-mail foi enviado
   - Clicar no link
   - Verificar acesso ao Dashboard

### 6.2 Testes em Produção

1. **Verificar domínio:**
   - E-mails devem vir de `noreply@ylada.com` (ou domínio verificado)
   - Verificar SPF, DKIM, DMARC

2. **Testar entrega:**
   - Gmail
   - Outlook
   - Yahoo
   - E-mails corporativos

3. **Monitorar métricas:**
   - Taxa de entrega
   - Taxa de abertura (se usar tracking)
   - Taxa de cliques

---

## 📋 FASE 7: Documentação e Manutenção

### 7.1 Documentação para Usuário

Criar guia: `docs/GUIA-RECUPERACAO-ACESSO.md`

### 7.2 Monitoramento

- Logs de envio de e-mail
- Erros de entrega
- Tokens expirados/não usados

### 7.3 Limpeza Automática

- Job/cron para limpar tokens expirados
- Limpar tokens antigos (> 90 dias)

---

## ✅ Checklist de Implementação

### Configuração Resend
- [ ] Criar conta no Resend
- [ ] Verificar domínio `ylada.com`
- [ ] Obter API Key de produção
- [ ] Obter API Key de desenvolvimento

### Configuração Projeto
- [ ] Instalar pacote `resend`
- [ ] Adicionar variáveis de ambiente
- [ ] Configurar cliente Resend
- [ ] Criar estrutura de arquivos

### Banco de Dados
- [ ] Criar tabela `access_tokens`
- [ ] Adicionar campo `welcome_email_sent` em `subscriptions`
- [ ] Criar índices necessários

### Implementação
- [ ] Criar sistema de tokens
- [ ] Criar templates de e-mail
- [ ] Integrar no webhook do Mercado Pago
- [ ] Criar página de recuperação
- [ ] Criar página de acesso por token
- [ ] Atualizar página de sucesso

### Testes
- [ ] Testar envio de e-mail local
- [ ] Testar tokens
- [ ] Testar fluxo completo
- [ ] Testar em produção

### Documentação
- [ ] Documentar para usuários
- [ ] Documentar para desenvolvedores
- [ ] Criar guias de troubleshooting

---

## 🚀 Ordem de Execução Recomendada

1. **Semana 1:**
   - Criar conta Resend
   - Verificar domínio
   - Configurar variáveis de ambiente
   - Instalar pacote

2. **Semana 2:**
   - Criar tabelas no banco
   - Implementar sistema de tokens
   - Criar templates de e-mail
   - Testar envio local

3. **Semana 3:**
   - Integrar no webhook
   - Criar páginas de recuperação
   - Testar fluxo completo
   - Ajustes finais

4. **Semana 4:**
   - Testes em produção
   - Monitoramento
   - Documentação final

---

## 📞 Suporte e Recursos

- **Documentação Resend:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Status Page:** https://status.resend.com
- **Suporte:** support@resend.com

---

## ⚠️ Considerações Importantes

1. **Rate Limits:**
   - Resend tem limites de envio
   - Plano gratuito: 3.000 e-mails/mês
   - Verificar limites antes de produção

2. **Privacidade:**
   - Não armazenar conteúdo sensível em tokens
   - Tokens devem ser únicos e não previsíveis
   - Implementar rate limiting na geração de tokens

3. **Segurança:**
   - Validar tokens no servidor (nunca no cliente)
   - Invalidar tokens após uso (se necessário)
   - Limpar tokens expirados regularmente

4. **Backup:**
   - Manter logs de e-mails enviados
   - Ter plano B caso Resend fique indisponível

---

**Próximo passo:** Após você configurar o Resend e verificar o domínio, podemos começar a implementação técnica! 🚀

