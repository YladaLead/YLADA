# 📋 DIRETRIZES DE MENSAGENS DE ERRO - YLADA

## 🎯 Princípio Geral

**TODAS as mensagens de erro devem ser:**
- ✅ Em **português brasileiro**
- ✅ **Claras e amigáveis** (linguagem popular, não técnica)
- ✅ **Específicas** (explicar o que aconteceu e como resolver)
- ✅ **Visíveis** (usar componentes de toast/notificação, não apenas `alert()`)

---

## 🚫 NUNCA FAZER

```typescript
// ❌ ERRADO - Mensagem técnica em inglês
throw new Error('Could not find the "bio" column in the schema cache')

// ❌ ERRADO - Mensagem genérica
alert('Erro ao salvar')

// ❌ ERRADO - Usar apenas console.error
console.error('Erro:', error)
```

---

## ✅ SEMPRE FAZER

```typescript
// ✅ CORRETO - Mensagem clara em português
throw new Error('Não foi possível salvar sua bio. Por favor, atualize a página e tente novamente.')

// ✅ CORRETO - Mensagem específica com solução
alert('Não foi possível salvar. Verifique se todos os campos estão preenchidos corretamente.')

// ✅ CORRETO - Usar componente de notificação
<ToastMessage type="error" message="Ops! Algo deu errado. Tente novamente em alguns instantes." />
```

---

## 📝 CATEGORIAS DE ERROS E MENSAGENS

### 1. **Erros de Banco de Dados**

| Tipo de Erro | Mensagem ao Usuário |
|--------------|---------------------|
| Coluna não existe | "Estamos atualizando o sistema. Por favor, atualize a página e tente novamente." |
| Foreign key constraint | "Não foi possível salvar. Verifique se os dados estão corretos." |
| Duplicado | "Este nome já está em uso. Escolha outro." |
| Timeout | "A operação está demorando mais que o normal. Tente novamente em alguns instantes." |

### 2. **Erros de Autenticação**

| Tipo de Erro | Mensagem ao Usuário |
|--------------|---------------------|
| Não autenticado | "Você precisa fazer login para continuar." |
| Sessão expirada | "Sua sessão expirou. Faça login novamente." |
| Sem permissão | "Você não tem permissão para acessar esta área." |
| Perfil incorreto | "Você está tentando acessar uma área que não corresponde ao seu perfil." |

### 3. **Erros de Validação**

| Tipo de Erro | Mensagem ao Usuário |
|--------------|---------------------|
| Campo obrigatório | "Por favor, preencha todos os campos obrigatórios." |
| Email inválido | "Digite um email válido (exemplo: seu@email.com)" |
| Senha muito curta | "A senha deve ter pelo menos 6 caracteres." |
| URL inválida | "Digite uma URL válida (exemplo: https://seu-site.com)" |
| Slug inválido | "O nome da URL só pode conter letras, números e hífens." |
| Slug já existe | "Este nome de URL já está em uso. Escolha outro." |

### 4. **Erros de Rede/API**

| Tipo de Erro | Mensagem ao Usuário |
|--------------|---------------------|
| Sem conexão | "Sem conexão com a internet. Verifique sua rede e tente novamente." |
| Timeout | "A operação está demorando muito. Tente novamente." |
| Servidor indisponível | "O serviço está temporariamente indisponível. Tente novamente em alguns minutos." |
| Erro desconhecido | "Ops! Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir." |

### 5. **Erros de Upload/Arquivo**

| Tipo de Erro | Mensagem ao Usuário |
|--------------|---------------------|
| Arquivo muito grande | "O arquivo é muito grande. Escolha um arquivo menor que 5MB." |
| Formato inválido | "Formato de arquivo não suportado. Use apenas imagens (JPG, PNG)." |
| Falha no upload | "Não foi possível fazer upload do arquivo. Tente novamente." |

---

## 🎨 COMPONENTE DE NOTIFICAÇÃO

### Criar componente `ToastMessage` ou `Notification`

```typescript
// src/components/ui/ToastMessage.tsx
interface ToastMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  onClose?: () => void
}
```

### Exemplo de uso:

```typescript
// ❌ ANTES
alert('Erro ao salvar perfil')

// ✅ DEPOIS
setError({
  type: 'error',
  message: 'Não foi possível salvar seu perfil. Verifique se todos os campos estão preenchidos corretamente.'
})
```

---

## 🔧 FUNÇÃO HELPER PARA TRADUZIR ERROS

```typescript
// src/lib/error-messages.ts

export function translateError(error: any): string {
  const errorMessage = error?.message || error?.error || String(error)
  
  // Erros de banco de dados
  if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
    return 'Estamos atualizando o sistema. Por favor, atualize a página e tente novamente.'
  }
  
  if (errorMessage.includes('foreign key')) {
    return 'Não foi possível salvar. Verifique se os dados estão corretos.'
  }
  
  if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
    return 'Este nome já está em uso. Escolha outro.'
  }
  
  // Erros de autenticação
  if (errorMessage.includes('not authenticated') || errorMessage.includes('401')) {
    return 'Você precisa fazer login para continuar.'
  }
  
  if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
    return 'Você não tem permissão para realizar esta ação.'
  }
  
  // Erros de rede
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
  }
  
  // Erro genérico
  return 'Ops! Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.'
}
```

---

## 📋 CHECKLIST PARA IMPLEMENTAÇÃO

- [ ] Substituir todos os `alert()` por componente de toast
- [ ] Criar função `translateError()` para traduzir erros técnicos
- [ ] Adicionar tratamento de erro específico em todas as APIs
- [ ] Testar mensagens em diferentes cenários de erro
- [ ] Garantir que mensagens são exibidas em português em toda a aplicação

---

## 🎯 EXEMPLOS DE IMPLEMENTAÇÃO

### Em APIs (route.ts):

```typescript
catch (error: any) {
  console.error('Erro técnico:', error) // Log técnico para devs
  
  const userMessage = translateError(error)
  return NextResponse.json(
    { error: userMessage },
    { status: 500 }
  )
}
```

### Em Componentes:

```typescript
catch (error: any) {
  const userMessage = translateError(error)
  setError({
    type: 'error',
    message: userMessage
  })
}
```

---

## ✅ VALIDAÇÃO ANTES DE COMMIT

Antes de fazer commit, verifique:
- [ ] Todas as mensagens estão em português?
- [ ] Mensagens são claras e amigáveis?
- [ ] Mensagens explicam o que fazer?
- [ ] Não há `alert()` com mensagens técnicas?
- [ ] Erros são exibidos em componente visual, não apenas no console?

