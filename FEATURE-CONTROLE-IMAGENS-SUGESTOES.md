# 🎨 FEATURE: Controle de Imagens nas Sugestões da IA

## 🎯 Objetivo

Adicionar um campo de escolha quando a IA (Ian) faz sugestões, permitindo que o usuário escolha:
1. **Buscar automaticamente** - IA busca imagens automaticamente
2. **Adicionar manualmente** - Usuário adiciona imagens depois
3. **Só criar** - Apenas cria o roteiro/texto, sem imagens

---

## 📋 Problema Atual

Atualmente, quando a IA faz uma sugestão que menciona imagens, ela **automaticamente**:
- Detecta padrões na mensagem
- Decide se deve buscar ou criar
- Executa a ação sem perguntar ao usuário

**Problema:** O usuário não tem controle sobre isso. Às vezes ele quer só o roteiro, outras vezes quer escolher as imagens manualmente.

---

## ✅ Solução Proposta

### **1. Componente de Seleção de Modo**

Quando a IA detectar que precisa de imagens, mostrar um **card de escolha** antes de executar:

```
┌─────────────────────────────────────────────────┐
│ 💡 Sugestão: Adicionar imagens de agenda vazia  │
├─────────────────────────────────────────────────┤
│                                                  │
│ Como você quer proceder?                        │
│                                                  │
│ ○ Buscar automaticamente                        │
│   (IA busca e mostra opções)                    │
│                                                  │
│ ○ Adicionar manualmente                        │
│   (Você escolhe depois)                         │
│                                                  │
│ ○ Só criar roteiro                              │
│   (Sem imagens por enquanto)                    │
│                                                  │
│ [Confirmar]  [Cancelar]                         │
└─────────────────────────────────────────────────┘
```

### **2. Onde Aparece**

- **No chat:** Quando a IA sugere imagens
- **Nas sugestões:** No painel de sugestões dinâmicas
- **Configuração global:** Opção para definir padrão

---

## 🛠️ Implementação Técnica

### **1. Novo Tipo no Store**

```typescript
// src/stores/creative-studio-store.ts

interface ImageActionPreference {
  mode: 'auto-search' | 'manual' | 'skip'
  isGlobal?: boolean // Se é preferência global ou apenas desta sugestão
}

interface CreativeStudioState {
  // ... existente
  imageActionPreference: ImageActionPreference
  setImageActionPreference: (preference: ImageActionPreference) => void
}
```

### **2. Novo Componente: ImageActionSelector**

```typescript
// src/components/creative-studio/ImageActionSelector.tsx

interface ImageActionSelectorProps {
  suggestion: {
    id: string
    title: string
    description: string
    requiresImages: boolean
  }
  onConfirm: (mode: 'auto-search' | 'manual' | 'skip') => void
  onCancel: () => void
  defaultMode?: 'auto-search' | 'manual' | 'skip'
}
```

### **3. Modificar EditorChat**

**Antes (atual):**
```typescript
// Detecta e executa automaticamente
if (shouldSearchImages) {
  // Busca imagens automaticamente
}
```

**Depois (proposto):**
```typescript
// Detecta mas pergunta antes
if (shouldSearchImages) {
  // Mostrar ImageActionSelector
  // Aguardar escolha do usuário
  // Executar conforme escolha
}
```

### **4. Fluxo Completo**

```
1. IA sugere: "Vou buscar imagens de agenda vazia"
   ↓
2. Sistema detecta sugestão de imagens
   ↓
3. Mostra ImageActionSelector
   ↓
4. Usuário escolhe:
   - "Buscar automaticamente" → Executa busca
   - "Adicionar manualmente" → Salva sugestão, usuário adiciona depois
   - "Só criar" → Ignora imagens, só cria roteiro
   ↓
5. Executa ação conforme escolha
```

---

## 🎨 Design do Componente

### **Visual:**

```tsx
<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
  <div className="flex items-start gap-3 mb-3">
    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 mb-1">
        {suggestion.title}
      </h4>
      <p className="text-sm text-gray-600 mb-3">
        {suggestion.description}
      </p>
      
      <p className="text-xs font-medium text-gray-700 mb-2">
        Como você quer proceder?
      </p>
      
      <div className="space-y-2">
        <label className="flex items-start gap-2 p-2 rounded hover:bg-blue-100 cursor-pointer">
          <input 
            type="radio" 
            name="image-action" 
            value="auto-search"
            checked={selectedMode === 'auto-search'}
            onChange={() => setSelectedMode('auto-search')}
            className="mt-1"
          />
          <div>
            <span className="font-medium text-sm">Buscar automaticamente</span>
            <p className="text-xs text-gray-600">IA busca e mostra opções</p>
          </div>
        </label>
        
        <label className="flex items-start gap-2 p-2 rounded hover:bg-blue-100 cursor-pointer">
          <input 
            type="radio" 
            name="image-action" 
            value="manual"
            checked={selectedMode === 'manual'}
            onChange={() => setSelectedMode('manual')}
            className="mt-1"
          />
          <div>
            <span className="font-medium text-sm">Adicionar manualmente</span>
            <p className="text-xs text-gray-600">Você escolhe depois</p>
          </div>
        </label>
        
        <label className="flex items-start gap-2 p-2 rounded hover:bg-blue-100 cursor-pointer">
          <input 
            type="radio" 
            name="image-action" 
            value="skip"
            checked={selectedMode === 'skip'}
            onChange={() => setSelectedMode('skip')}
            className="mt-1"
          />
          <div>
            <span className="font-medium text-sm">Só criar roteiro</span>
            <p className="text-xs text-gray-600">Sem imagens por enquanto</p>
          </div>
        </label>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onConfirm(selectedMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## ⚙️ Configuração Global (Opcional)

Adicionar nas configurações do Creative Studio:

```
┌─────────────────────────────────────┐
│ ⚙️ Configurações de Imagens        │
├─────────────────────────────────────┤
│                                     │
│ Quando a IA sugerir imagens:       │
│                                     │
│ ○ Sempre buscar automaticamente    │
│ ○ Sempre perguntar                 │
│ ○ Sempre pular (só roteiro)       │
│                                     │
│ [Salvar]                           │
└─────────────────────────────────────┘
```

---

## 📝 Exemplos de Uso

### **Cenário 1: Usuário quer controle total**
```
IA: "Vou buscar imagens de agenda vazia"
→ Mostra seletor
→ Usuário escolhe "Adicionar manualmente"
→ IA só cria o roteiro, sem buscar imagens
→ Usuário adiciona imagens depois quando quiser
```

### **Cenário 2: Usuário quer rapidez**
```
IA: "Vou buscar imagens de agenda vazia"
→ Mostra seletor
→ Usuário escolhe "Buscar automaticamente"
→ IA busca e mostra opções imediatamente
```

### **Cenário 3: Usuário só quer texto**
```
IA: "Vou buscar imagens de agenda vazia"
→ Mostra seletor
→ Usuário escolhe "Só criar roteiro"
→ IA ignora imagens, só cria o texto/roteiro
```

---

## 🚀 Benefícios

1. **Controle do usuário** - Decide quando e como adicionar imagens
2. **Flexibilidade** - Pode trabalhar só com texto se quiser
3. **Rapidez** - Pode escolher busca automática quando quiser agilidade
4. **Menos interrupções** - Não busca imagens se não quiser
5. **Melhor UX** - Usuário entende o que está acontecendo

---

## 📋 Checklist de Implementação

### **Fase 1: Componente Básico**
- [ ] Criar `ImageActionSelector.tsx`
- [ ] Adicionar tipos no store
- [ ] Integrar no `EditorChat.tsx`
- [ ] Testar visualmente

### **Fase 2: Lógica de Decisão**
- [ ] Modificar detecção de imagens no `EditorChat`
- [ ] Implementar lógica de cada modo
- [ ] Testar fluxo completo

### **Fase 3: Configuração Global (Opcional)**
- [ ] Criar página de configurações
- [ ] Salvar preferência do usuário
- [ ] Aplicar preferência automaticamente

### **Fase 4: Testes**
- [ ] Testar modo "buscar automaticamente"
- [ ] Testar modo "adicionar manualmente"
- [ ] Testar modo "só criar roteiro"
- [ ] Testar cancelamento
- [ ] Testar com diferentes tipos de sugestões

---

## 💡 Melhorias Futuras

1. **Lembrar escolha** - Salvar preferência por tipo de sugestão
2. **Atalhos** - Teclas de atalho para escolha rápida
3. **Batch** - Escolher para múltiplas sugestões de uma vez
4. **Smart defaults** - IA aprende preferências do usuário

---

## 🎯 Próximos Passos

1. **Aprovar feature** - Validar se faz sentido
2. **Criar componente** - Implementar `ImageActionSelector`
3. **Integrar** - Modificar `EditorChat` para usar o componente
4. **Testar** - Validar funcionamento
5. **Deploy** - Liberar para usuários

---

**Status:** 📝 Proposta  
**Prioridade:** 🟡 Média  
**Complexidade:** 🟢 Baixa-Média  
**Tempo estimado:** 4-6 horas

