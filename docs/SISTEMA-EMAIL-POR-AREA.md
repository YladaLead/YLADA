# 📧 Sistema de E-mails por Área

## 📋 Visão Geral

O sistema de e-mails do YLADA foi projetado para funcionar com **todas as áreas** (wellness, nutri, coach, nutra). Os e-mails são personalizados automaticamente com base na área da assinatura do usuário.

---

## ✅ O que já está funcionando

### 1. **E-mail de Boas-vindas** (`sendWelcomeEmail`)
- ✅ Funciona para **todas as áreas**
- ✅ Personaliza conteúdo com nome da área
- ✅ Gera link correto: `/pt/{area}/acesso`
- ✅ Enviado automaticamente após pagamento confirmado
- ✅ Localização: `src/lib/email-templates.ts`

**Exemplo de uso:**
```typescript
await sendWelcomeEmail({
  email: 'usuario@email.com',
  userName: 'João Silva',
  area: 'nutri', // ou 'wellness', 'coach', 'nutra'
  planType: 'monthly',
  accessToken: 'token...',
  baseUrl: 'https://www.ylada.com'
})
```

### 2. **E-mail de Recuperação de Acesso** (`sendRecoveryEmail`)
- ✅ Funciona para **todas as áreas**
- ✅ Personaliza assunto e conteúdo
- ✅ Gera link correto: `/pt/{area}/acesso`
- ✅ Localização: `src/lib/email-templates.ts`

**Exemplo de uso:**
```typescript
await sendRecoveryEmail({
  email: 'usuario@email.com',
  userName: 'João Silva',
  area: 'nutri', // Detectado automaticamente da assinatura
  accessToken: 'token...',
  baseUrl: 'https://www.ylada.com'
})
```

### 3. **API de Recuperação de Acesso**
- ✅ Funciona para **todas as áreas**
- ✅ Detecta área automaticamente da assinatura
- ✅ Localização: `src/app/api/email/send-access-link/route.ts`

---

## ⚠️ O que precisa ser criado para novas áreas

### Páginas Frontend

Atualmente, as páginas de recuperação de acesso existem **apenas para wellness**:

- ✅ `/pt/wellness/recuperar-acesso` - Página para solicitar link de acesso
- ✅ `/pt/wellness/acesso` - Página para validar token e fazer login

**Para outras áreas, você precisa criar páginas similares:**

#### 1. Página de Recuperação (`/pt/{area}/recuperar-acesso/page.tsx`)

**Estrutura necessária:**
- Formulário para inserir e-mail
- Chamada para API: `POST /api/email/send-access-link`
- Mensagem de sucesso/erro
- Design consistente com a área

**Exemplo baseado em wellness:**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RecuperarAcessoPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/email/send-access-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar link' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao processar solicitação' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com logo da área */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <Link href={`/pt/{area}`}>
            <Image
              src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              alt="YLADA Logo"
              width={280}
              height={84}
              className="h-12"
            />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recuperar Acesso
          </h1>
          <p className="text-gray-600 mb-6">
            Digite seu e-mail para receber um link de acesso
          </p>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Acesso'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href={`/pt/{area}/login`}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
```

#### 2. Página de Acesso por Token (`/pt/{area}/acesso/page.tsx`)

**Estrutura necessária:**
- Extrair token da URL (`?token=...`)
- Validar token via API: `GET /api/auth/access-token?token=...`
- Redirecionar para dashboard após login
- Tratamento de erros (token inválido/expirado)

**Exemplo baseado em wellness:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AcessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Token não fornecido')
      setLoading(false)
      return
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/access-token?token=${token}`)
        const data = await response.json()

        if (response.ok && data.userId) {
          // Token válido - redirecionar para dashboard
          router.push(`/pt/{area}/dashboard`)
        } else {
          setError(data.error || 'Token inválido ou expirado')
        }
      } catch (err) {
        setError('Erro ao validar token')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <Image
          src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
          alt="YLADA Logo"
          width={280}
          height={84}
          className="mx-auto mb-6"
        />

        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validando acesso...</p>
          </>
        ) : error ? (
          <>
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Erro ao Acessar</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href={`/pt/{area}/recuperar-acesso`}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Solicitar novo link de acesso
            </Link>
          </>
        ) : (
          <>
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <p className="text-gray-600">Redirecionando...</p>
          </>
        )}
      </div>
    </div>
  )
}
```

---

## 🔧 Passo a Passo para Criar Páginas em Nova Área

### 1. Criar estrutura de pastas
```bash
mkdir -p src/app/pt/{area}/recuperar-acesso
mkdir -p src/app/pt/{area}/acesso
```

### 2. Criar página de recuperação
- Copiar `src/app/pt/wellness/recuperar-acesso/page.tsx`
- Substituir `{area}` pelo nome da área (nutri, coach, nutra)
- Ajustar cores/estilo se necessário

### 3. Criar página de acesso
- Copiar `src/app/pt/wellness/acesso/page.tsx`
- Substituir `{area}` pelo nome da área
- Ajustar redirecionamento para `/pt/{area}/dashboard`

### 4. Adicionar link na página de login
Adicionar link "Esqueci minha senha" ou "Recuperar acesso" que aponta para:
```typescript
<Link href={`/pt/{area}/recuperar-acesso`}>
  Recuperar acesso
</Link>
```

### 5. Testar
- Testar fluxo completo: solicitar link → receber e-mail → clicar → validar → acessar dashboard
- Verificar se o e-mail está personalizado com a área correta
- Verificar se os links estão corretos

---

## 📝 Checklist para Nova Área

- [ ] Criar `/pt/{area}/recuperar-acesso/page.tsx`
- [ ] Criar `/pt/{area}/acesso/page.tsx`
- [ ] Adicionar link na página de login
- [ ] Testar fluxo completo
- [ ] Verificar personalização do e-mail
- [ ] Verificar redirecionamentos

---

## 🔍 Arquivos de Referência

### E-mails (já funcionam para todas as áreas)
- `src/lib/email-templates.ts` - Templates de e-mail
- `src/app/api/email/send-access-link/route.ts` - API de recuperação

### Páginas Wellness (usar como base)
- `src/app/pt/wellness/recuperar-acesso/page.tsx`
- `src/app/pt/wellness/acesso/page.tsx`

### APIs (já funcionam para todas as áreas)
- `src/app/api/auth/access-token/route.ts` - Validação de token
- `src/lib/email-tokens.ts` - Gerenciamento de tokens

---

## 💡 Dicas

1. **Consistência**: Use o mesmo design/estilo das páginas de wellness para manter consistência
2. **Personalização**: Ajuste cores/logo se cada área tiver identidade visual diferente
3. **Testes**: Sempre teste o fluxo completo antes de publicar
4. **Documentação**: Atualize este documento quando criar novas áreas

---

## ❓ Dúvidas Frequentes

**Q: Preciso criar as páginas para todas as áreas agora?**  
R: Não. Crie apenas quando for desenvolver/ativar a área. O sistema de e-mails já funciona para todas.

**Q: Os e-mails funcionam sem as páginas?**  
R: Sim, os e-mails são enviados. Mas o usuário precisa das páginas para solicitar e usar o link de acesso.

**Q: Posso reutilizar as páginas de wellness?**  
R: Sim, mas você precisa criar rotas específicas para cada área (`/pt/{area}/...`).

**Q: E se eu quiser criar agora?**  
R: Pode criar! Use as páginas de wellness como base e substitua `wellness` pelo nome da área.

---

**Última atualização:** 2024
**Status:** E-mails funcionam para todas as áreas | Páginas existem apenas para wellness

