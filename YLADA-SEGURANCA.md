# YLADA - Guia de Segurança

## 🔒 Princípios de Segurança do YLADA

Este documento define as práticas de segurança que devem ser seguidas em todo o desenvolvimento do YLADA.

---

## 1. PROTEÇÃO DE DADOS SENSÍVEIS

### ❌ **NUNCA EXPOR** no código/HTML:
- API Keys secretas
- Service Role Keys
- Senhas ou tokens de autenticação
- Dados pessoais sensíveis
- Informações de pagamento completas

### ✅ **PROTEÇÃO CORRETA:**
```typescript
// ✅ CORRETO: Variáveis no servidor (API routes)
const apiKey = process.env.OPENAI_API_KEY  // Server-only

// ❌ INCORRETO: Expo no frontend
const apiKey = "sk-abc123"  // NUNCA fazer isso
```

---

## 2. VARIÁVEIS DE AMBIENTE

### Variáveis SEGURAS (pode ser publica):
```
NEXT_PUBLIC_SUPABASE_URL         ✅ Frontend seguro
NEXT_PUBLIC_SUPABASE_ANON_KEY   ✅ Frontend seguro (tem limites RLS)
NEXT_PUBLIC_APP_URL             ✅ URL pública
```

### Variáveis SECRETAS (apenas servidor):
```
SUPABASE_SERVICE_ROLE_KEY       🔒 SERVER ONLY (dangeroso se exposto)
OPENAI_API_KEY                  🔒 SERVER ONLY
STRIPE_SECRET_KEY               🔒 SERVER ONLY
STRIPE_WEBHOOK_SECRET           🔒 SERVER ONLY
```

### ✅ **Regra de Ouro:**
- Se começa com `NEXT_PUBLIC_` → pode ir no frontend
- Se NÃO começa com `NEXT_PUBLIC_` → SERVER ONLY

---

## 3. PROTEÇÃO DE API ROUTES

### ✅ **SEMPRE validar em rotas de API:**

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // 1. Validar autenticação
  const session = await getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validar payload
  const body = await request.json()
  if (!body.email || !body.name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // 3. Validar rate limiting (futuro)
  // 4. Processar com Service Role Key (se necessário)
  
  const result = await supabaseAdmin
    .from('users')
    .insert({ name: body.name, email: body.email })

  return NextResponse.json({ success: true, data: result })
}
```

---

## 4. ROW LEVEL SECURITY (RLS)

### ✅ **SEMPRE usar RLS no Supabase:**

```sql
-- Usuário só vê seus próprios dados
CREATE POLICY "Users can view own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Usuário só cria seus próprios leads
CREATE POLICY "Users can insert own leads" 
ON leads FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### 📋 **Tabelas que DEVEM ter RLS:**
- ✅ `users` - Dados do usuário
- ✅ `user_profiles` - Perfis
- ✅ `user_templates` - Templates personalizados
- ✅ `leads` - Leads capturados
- ✅ `quizzes` - Quizzes criados
- ✅ `quiz_respostas` - Respostas de quizzes

---

## 5. PROTEÇÃO NO FRONTEND

### ❌ **NUNCA fazer:**
```typescript
// Mostrar API keys no console
console.log(process.env.OPENAI_API_KEY)

// Enviar dados sensíveis via fetch sem validação
fetch('/api/dangerous', { 
  body: JSON.stringify({ password: '123' })
})
```

### ✅ **SEMPRE fazer:**
```typescript
// Validar dados do usuário
const isValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Sanitizar inputs
const sanitize = (input: string) => {
  return input.trim().replace(/[<>]/g, '')
}

// Usar HTTPS
const API_URL = 'https://ylada.app/api'

// Rate limiting no cliente (complementar ao servidor)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
```

---

## 6. PROTEÇÃO DE PAGAMENTOS

### ✅ **Strike API:**
```typescript
// Server-only
const strike = new Strike({
  apiKey: process.env.STRIKE_API_KEY  // 🔒 SERVER ONLY
})

// Validar webhook signature
const isValidSignature = (body: string, signature: string) => {
  return verifySignature(body, signature, process.env.STRIKE_WEBHOOK_SECRET)
}

// Proteger contra replay attacks
const checkNonce = async (nonce: string) => {
  const exists = await redis.get(`nonce:${nonce}`)
  if (exists) throw new Error('Nonce já usado')
  await redis.setex(`nonce:${nonce}`, 3600, 'used')
}
```

### ✅ **Mercado Pago:**
```typescript
// Usar apenas Public Key no frontend
const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

// Validar webhook
const signature = request.headers['x-signature']
const isValid = mercadopago.validateWebhook(body, signature)

// Não armazenar dados de cartão
// Usar tokenização
```

---

## 7. CORS E CORS ORIGIN

### ✅ **Configurar CORS corretamente:**

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://ylada.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

---

## 8. VALIDAÇÃO DE INPUTS

### ✅ **SEMPRE validar:**

```typescript
import { z } from 'zod'

const CreateQuizSchema = z.object({
  titulo: z.string().min(3).max(100),
  descricao: z.string().max(500).optional(),
  perguntas: z.array(z.object({
    tipo: z.enum(['multipla', 'dissertativa', 'escala', 'simnao']),
    titulo: z.string().min(5),
    opcoes: z.array(z.string()).optional(),
    obrigatoria: z.boolean().default(true),
  })).min(1).max(20),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  try {
    const validated = CreateQuizSchema.parse(body)
    // ... processar
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
```

---

## 9. PROTEÇÃO CONTRA SQL INJECTION

### ✅ **Nunca concatenar SQL:**
```typescript
// ❌ INCORRETO
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ CORRETO (Supabase já protege)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

### ✅ **Usar parâmetros:**
```sql
-- Em funções do PostgreSQL
CREATE FUNCTION get_user(email_param TEXT)
RETURNS users AS $$
  SELECT * FROM users WHERE email = email_param
$$ LANGUAGE sql;
```

---

## 10. RATE LIMITING

### ✅ **Implementar rate limiting:**

```typescript
// src/lib/rate-limit.ts
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function rateLimit(
  key: string,
  limit: number = 10,
  window: number = 60
): Promise<boolean> {
  const count = await redis.incr(`rate:${key}:${window}`)
  
  if (count === 1) {
    await redis.expire(`rate:${key}:${window}`, window)
  }
  
  return count <= limit
}

// Uso em API route
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  const allowed = await rateLimit(`api:${ip}`, 10, 60)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // ... processar
}
```

---

## 11. LOGS E MONITORAMENTO

### ✅ **Logar apenas informações necessárias:**

```typescript
// ✅ BOM
logger.info('User created quiz', { 
  userId: user.id,
  quizId: quiz.id,
  slug: quiz.slug 
})

// ❌ RUIM (expor senha)
logger.info('User logged in', { 
  email: user.email,
  password: user.password  // NUNCA fazer isso!
})

// ✅ BOM (hash)
logger.info('User logged in', { 
  userId: user.id,
  timestamp: new Date().toISOString()
})
```

### ✅ **Monitorar erros:**
```typescript
// Usar Sentry ou similar
import * as Sentry from '@sentry/nextjs'

try {
  await processPayment()
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'payment' },
    user: { id: user.id }
  })
  throw error
}
```

---

## 12. CHECKLIST DE SEGURANÇA

### Antes de fazer deploy:

- [ ] Nenhuma API key secreta no código
- [ ] Nenhuma informação sensível no console.log
- [ ] Todas as API routes validam autenticação
- [ ] RLS habilitado em todas as tabelas
- [ ] Inputs validados com Zod ou similar
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Webhooks validam signature
- [ ] HTTPS em produção
- [ ] Environment variables no Vercel configuradas
- [ ] `.env` no `.gitignore`
- [ ] Secrets rotacionados periodicamente

---

## 13. O QUE É PÚBLICO vs PRIVADO

### ✅ **Pode ser público (frontend):**
- Nome, email público
- Descrições de templates
- Conteúdo de quizzes (ativos)
- URLs públicas de ferramentas

### 🔒 **DEVE ser privado (server-only):**
- Senhas e hashes
- API keys secretas
- Tokens de autenticação
- Service role keys
- Webhook secrets
- Dados financeiros completos
- IP addresses de leads
- User agents de navegadores

---

## 14. WEBHOOKS

### ✅ **SEMPRE validar webhook signature:**

```typescript
// src/app/api/webhook/strike/route.ts
import { verifySignature } from '@strike/api'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('strike-signature')
  
  // Validar signature
  const isValid = verifySignature(
    body,
    signature,
    process.env.STRIKE_WEBHOOK_SECRET
  )
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }
  
  // Processar webhook
  const event = JSON.parse(body)
  // ...
}
```

---

## 15. AUTENTICAÇÃO

### ✅ **Supabase Auth:**

```typescript
// src/lib/auth.ts
import { supabase } from './supabase'

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const session = await getSession()
  return session?.user
}

// Proteger rota
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

// Em API route
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    // ... processar
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
```

---

## 16. ARMAZENAMENTO SEGURO

### ✅ **NUNCA armazenar:**
- Senhas em texto plano
- Cartões de crédito completos
- Tokens de acesso sem expiração

### ✅ **SEMPRE fazer:**
- Hash de senhas (bcrypt)
- Tokenização de pagamentos (Stripe/MercadoPago)
- Armazenar apenas últimos 4 dígitos do cartão
- Rotacionar tokens periodicamente

---

## 17. GDPR E LGPD

### ✅ **Conformidade:**

```typescript
// src/app/api/users/[id]/data-delete/route.ts
export async function DELETE(request: NextRequest) {
  const user = await requireAuth()
  
  // Apagar todos os dados do usuário
  await supabaseAdmin.from('users').delete().eq('id', user.id)
  await supabaseAdmin.from('user_profiles').delete().eq('user_id', user.id)
  await supabaseAdmin.from('user_templates').delete().eq('user_id', user.id)
  await supabaseAdmin.from('leads').delete().eq('user_id', user.id)
  
  return NextResponse.json({ success: true })
}

// src/app/api/users/[id]/data-export/route.ts
export async function GET(request: NextRequest) {
  const user = await requireAuth()
  
  // Exportar todos os dados do usuário
  const data = {
    profile: await getProfile(user.id),
    templates: await getTemplates(user.id),
    leads: await getLeads(user.id),
  }
  
  return NextResponse.json(data)
}
```

---

## 18. BACKUP E RECOVERY

### ✅ **Estratégia de backup:**

```sql
-- Backup automático do Supabase (configurar no dashboard)
-- Manual backup
pg_dump -h db.xxxxx.supabase.co -U postgres ylada_db > backup.sql

-- Restore
psql -h db.xxxxx.supabase.co -U postgres ylada_db < backup.sql
```

---

## 🚨 EM CASO DE BREACH

1. **Imediatamente:** Rotacionar todas as chaves secretas
2. **Notificar:** Usuários afetados (se aplicável)
3. **Auditar:** Logs para identificar origem
4. **Corrigir:** Vulnerabilidade encontrada
5. **Documentar:** Incidente e ações tomadas

---

## 📚 REFERÊNCIAS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Stripe Security](https://stripe.com/docs/security)
- [GDPR](https://gdpr.eu/)

---

**Última atualização:** 2024-01-16

