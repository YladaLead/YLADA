# 🔧 Correção: Race Condition - Monica Login Wellness

## 📋 Problema Identificado pelos Logs

Pelos screenshots do console da Monica, identificamos um **race condition**:

### **Sequência de Eventos (PROBLEMÁTICA):**

1. `useAuth: Nenhuma sessão encontrada` - Inicialmente não encontra sessão
2. `useAuth: Timeout de carregamento sem sessão após 3000ms` - Marca como não autenticado após timeout
3. `useAuth: Auth state changed: SIGNED_IN` - **Mas o evento SIGNED_IN chega DEPOIS do timeout!**

**Resultado:** O componente marca como não autenticado antes do evento SIGNED_IN chegar, causando erro de autenticação.

---

## ✅ Correções Implementadas

### **1. useAuth - Timeout Aumentado e Lógica Melhorada** ✅

**Arquivo:** `src/hooks/useAuth.ts`

**Mudanças:**

1. **Timeout aumentado:**
   - Antes: PWA 2000ms, Web 3000ms
   - Agora: PWA 3000ms, Web 5000ms
   - Dá mais tempo para eventos SIGNED_IN chegarem

2. **Lógica de timeout melhorada:**
   - Quando timeout dispara sem sessão, aguarda mais 1 segundo antes de confirmar ausência
   - Verifica novamente antes de marcar como não autenticado
   - Evita marcar prematuramente quando evento ainda pode chegar

3. **Garantir loading=false quando SIGNED_IN chega:**
   ```typescript
   if (event === 'SIGNED_IN' && session?.user) {
     console.log('✅ useAuth: SIGNED_IN detectado, garantindo que loading seja false')
     setLoading(false) // Forçar loading=false quando SIGNED_IN chega
     setIsStable(true) // Marcar como estável
   }
   ```

**Por que ajuda:**
- Dá mais tempo para eventos chegarem
- Não marca como não autenticado prematuramente
- Força atualização quando SIGNED_IN chega

---

### **2. Componente NOEL - Timeout de Espera Aumentado** ✅

**Arquivo:** `src/app/pt/wellness/(protected)/noel/noel/page.tsx`

**Mudanças:**

1. **Timeout aumentado:**
   - Antes: 3 segundos
   - Agora: 6 segundos
   - Dá mais tempo para autenticação completar

2. **Verificação durante espera:**
   ```typescript
   // Verificar novamente se user foi definido (pode ter chegado durante a espera)
   // Isso resolve race condition onde SIGNED_IN chega durante a espera
   if (user) {
     console.log('✅ Usuário encontrado durante espera, continuando...')
     break
   }
   ```

3. **Verificação final antes de mostrar erro:**
   - Aguarda mais 1 segundo antes de mostrar erro
   - Verifica novamente se user foi definido
   - Só mostra erro se realmente não há usuário

**Por que ajuda:**
- Aguarda mais tempo para autenticação completar
- Verifica durante a espera se usuário foi definido
- Não mostra erro prematuramente

---

## 🔍 Como Funciona Agora

### **Fluxo Corrigido:**

1. **Componente monta** → `useAuth` inicia carregamento
2. **getSession()** → Pode não encontrar sessão inicialmente (normal)
3. **Timeout de 5 segundos** → Aguarda eventos chegarem
4. **Evento SIGNED_IN chega** → Força `loading=false` e atualiza estado
5. **Componente NOEL aguarda até 6 segundos** → Verifica se user foi definido
6. **Se user encontrado** → Continua normalmente
7. **Se ainda não encontrado** → Aguarda mais 1 segundo e verifica novamente

**Resultado:** Race condition resolvida - componente aguarda tempo suficiente para eventos chegarem.

---

## 📊 Comparação Antes vs Depois

### **Antes (PROBLEMÁTICO):**

```
T=0ms:   Componente monta
T=0ms:   getSession() → não encontra sessão
T=3000ms: Timeout → marca como não autenticado ❌
T=3500ms: Evento SIGNED_IN chega (tarde demais!)
T=3500ms: Componente tenta usar NOEL → user ainda null → ERRO ❌
```

### **Depois (CORRIGIDO):**

```
T=0ms:   Componente monta
T=0ms:   getSession() → não encontra sessão
T=3500ms: Evento SIGNED_IN chega → força loading=false ✅
T=3500ms: user é definido ✅
T=5000ms: Timeout verifica → encontra sessão → não marca como não autenticado ✅
T=6000ms: Componente NOEL verifica → user encontrado → continua normalmente ✅
```

---

## 🧪 Como Testar

### **Para Monica:**

1. **Limpar cookies e fazer login novamente**
   - Logout → Fechar navegador → Limpar cookies → Login → Testar NOEL

2. **Verificar no Console (F12):**
   - Deve ver: `✅ useAuth: SIGNED_IN detectado, garantindo que loading seja false`
   - Deve ver: `✅ Usuário encontrado durante espera, continuando...`
   - Não deve ver: `⚠️ useAuth: Timeout de carregamento sem sessão` (ou deve aparecer muito depois)

3. **Testar NOEL:**
   - Enviar mensagem imediatamente após login
   - Deve funcionar sem erro de autenticação

---

## 📝 Logs Esperados (Corretos)

### **Console deve mostrar:**

```
🔄 useAuth: Iniciando carregamento...
⚠️ useAuth: Nenhuma sessão encontrada (inicial - normal)
🔄 useAuth: Auth state changed: SIGNED_IN
✅ useAuth: SIGNED_IN detectado, garantindo que loading seja false
🔍 useAuth: Buscando perfil após auth change
✅ useAuth: Perfil carregado após auth change
✅ Usuário encontrado durante espera, continuando... (se necessário)
```

### **Não deve mostrar:**

```
⚠️ useAuth: Timeout de carregamento sem sessão (antes de SIGNED_IN)
❌ Você precisa fazer login para continuar
```

---

## 🔗 Arquivos Modificados

1. `src/hooks/useAuth.ts` - Timeout aumentado e lógica melhorada
2. `src/app/pt/wellness/(protected)/noel/noel/page.tsx` - Timeout de espera aumentado e verificação melhorada

---

## 💡 Próximos Passos

1. **Testar com Monica** - Verificar se problema foi resolvido
2. **Monitorar logs** - Verificar se não há mais race conditions
3. **Se necessário** - Ajustar timeouts baseado em feedback

---

**Data:** 2025-12-17  
**Status:** ✅ **Correções implementadas - Aguardando teste**
