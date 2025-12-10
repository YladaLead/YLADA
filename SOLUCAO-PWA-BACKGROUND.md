# 🔧 Solução: Problema de Loop quando PWA volta do Background

## 📋 Problema Identificado

Usuários relatam que quando:
1. **Não fecham o app completamente** - apenas saem de uma conversa/página
2. **Tentam entrar novamente** - o app fica em loop ou não carrega

Isso acontece porque quando o app volta do background (sem ser fechado completamente), múltiplas inicializações podem ser disparadas simultaneamente.

---

## ✅ Soluções Implementadas

### 1. **Prevenção de Registro Duplicado do Service Worker**

**Arquivo**: `src/lib/push-notifications.ts`

- ✅ Cache global para evitar múltiplos registros simultâneos
- ✅ Verificação se service worker já está ativo antes de registrar
- ✅ Timeout mais curto para PWA (3s vs 10s)
- ✅ Tratamento de erros mais tolerante em modo PWA

```typescript
// Cache global para evitar múltiplos registros simultâneos
let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null
let isRegistering = false

// Se já está registrando, retornar a promise existente
if (registrationPromise && isRegistering) {
  return registrationPromise
}
```

---

### 2. **Melhorias no Service Worker**

**Arquivo**: `public/sw.js`

- ✅ Verificação se já está instalado antes de reinstalar
- ✅ Tratamento de erros mais robusto
- ✅ Não falhar completamente se algum passo der erro

```javascript
// Se já está instalado, não fazer nada (evita loops)
if (self.registration.active) {
  console.log('[Service Worker] Já está instalado e ativo, pulando instalação')
  return
}
```

---

### 3. **PWA Initializer com Debounce**

**Arquivo**: `src/components/pwa/PWAInitializer.tsx`

- ✅ Debounce de 500ms para mudanças de visibilidade
- ✅ Prevenção de múltiplas execuções simultâneas
- ✅ Listener para `pageshow` (quando volta de cache)
- ✅ Não força reinicialização quando app volta do background

```typescript
// Debounce: só processar se passou pelo menos 500ms desde a última mudança
if (timeSinceLastChange < 500) {
  console.log('[PWA Initializer] Ignorando mudança de visibilidade muito rápida')
  return
}
```

---

### 4. **Melhorias no useAuth para Background/Foreground**

**Arquivo**: `src/hooks/useAuth.ts`

- ✅ Debounce de 1 segundo entre eventos de autenticação
- ✅ Verificação inteligente quando app volta do background
- ✅ Não reinicializa se já tem sessão carregada
- ✅ Aguarda 500ms antes de verificar sessão (evita race conditions)
- ✅ Prevenção de múltiplas verificações simultâneas com ref

```typescript
// Debounce: evitar processar eventos muito próximos
const AUTH_EVENT_DEBOUNCE = 1000 // 1 segundo entre eventos
if (timeSinceLastEvent < AUTH_EVENT_DEBOUNCE) {
  console.log('⚠️ useAuth: Ignorando evento muito próximo do anterior')
  return
}

// Verificar sessão apenas se necessário quando volta do background
if (document.visibilityState === 'visible') {
  // Aguardar 500ms antes de verificar (evita race conditions)
  setTimeout(async () => {
    // Verificar sessão apenas se não temos uma
  }, 500)
}
```

---

### 5. **Utilitários PWA**

**Arquivo**: `src/lib/pwa-utils.ts` (NOVO)

- ✅ Função `isPWAInstalled()` para detectar modo standalone
- ✅ Função `isServiceWorkerActive()` para verificar estado do SW
- ✅ Função `waitForAppReady()` para aguardar app estar pronto
- ✅ Função `debounce()` para evitar múltiplas execuções

---

## 🎯 Como Funciona Agora

### Cenário 1: Usuário sai da conversa e volta
1. App vai para background (`visibilityState = 'hidden'`)
2. Usuário volta (`visibilityState = 'visible'`)
3. **PWA Initializer**: Debounce de 500ms previne múltiplas execuções
4. **useAuth**: Verifica sessão apenas se necessário (não tem user)
5. **Service Worker**: Já está ativo, não tenta registrar novamente
6. ✅ App carrega normalmente, sem loops

### Cenário 2: PWA já instalado, usuário reabre
1. App detecta modo PWA (`standalone`)
2. Verifica se service worker já está ativo
3. Se ativo, **não tenta registrar novamente**
4. ✅ App carrega rapidamente, sem loops

### Cenário 3: Múltiplas mudanças rápidas de visibilidade
1. Primeira mudança: processa normalmente
2. Mudanças subsequentes (< 500ms): **ignoradas**
3. ✅ Previne loops de inicialização

---

## 🔍 Logs para Debug

Os logs agora incluem informações sobre:
- `[PWA Initializer]` - Inicialização do PWA
- `[Push Notifications]` - Registro do service worker
- `[useAuth]` - Estado de autenticação
- `[Service Worker]` - Estado do service worker

Exemplo:
```
[PWA Initializer] App está rodando em modo PWA
[PWA Initializer] ✅ Service Worker já está ativo, não precisa registrar novamente
[useAuth] App voltou ao foreground, mas já temos sessão ou está carregando
```

---

## 📝 Próximos Passos (Opcional)

Se ainda houver problemas, considerar:

1. **Aumentar debounce** se ainda houver loops:
   - PWA Initializer: 500ms → 1000ms
   - useAuth: 1000ms → 2000ms

2. **Adicionar mais logs** para identificar onde está o problema

3. **Verificar cookies** se sessão não está sendo preservada

---

## ✅ Resultado Esperado

- ✅ App não entra em loop quando volta do background
- ✅ Service worker não tenta registrar múltiplas vezes
- ✅ Autenticação não reinicializa desnecessariamente
- ✅ App carrega rapidamente quando PWA já está instalado
- ✅ Múltiplas mudanças rápidas de visibilidade são ignoradas
