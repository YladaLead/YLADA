# 🔧 Exemplo de Integração: ImageActionSelector

## 📋 Como Integrar no EditorChat

### **1. Importar o Componente**

```typescript
// src/components/creative-studio/EditorChat.tsx

import { ImageActionSelector } from './ImageActionSelector'
```

### **2. Adicionar Estado para Controlar o Seletor**

```typescript
// Dentro do componente EditorChat

const [pendingImageAction, setPendingImageAction] = useState<{
  suggestion: {
    id: string
    title: string
    description: string
    requiresImages: boolean
  }
  searchQuery: string
  shouldCreate: boolean
} | null>(null)
```

### **3. Modificar a Lógica de Detecção**

**ANTES (atual):**
```typescript
// Detecta e executa automaticamente
if (shouldSearchImages) {
  // Busca imagens automaticamente
  setIsSearchingImages(true)
  // ... busca
}
```

**DEPOIS (com seletor):**
```typescript
// Detecta mas pergunta antes
if (shouldSearchImages || shouldCreateImages) {
  // Mostrar seletor ao invés de executar
  setPendingImageAction({
    suggestion: {
      id: `suggestion-${Date.now()}`,
      title: 'Adicionar imagens',
      description: assistantMessage.includes('criar') 
        ? 'A IA quer criar uma imagem personalizada'
        : `A IA quer buscar imagens relacionadas a "${searchQuery}"`,
      requiresImages: true,
    },
    searchQuery,
    shouldCreate: shouldCreateImages,
  })
  
  // NÃO executar busca ainda - aguardar escolha do usuário
  return
}
```

### **4. Adicionar Handler para Confirmar Ação**

```typescript
const handleImageActionConfirm = async (mode: 'auto-search' | 'manual' | 'skip') => {
  if (!pendingImageAction) return
  
  const { searchQuery, shouldCreate } = pendingImageAction
  
  if (mode === 'skip') {
    // Apenas ignorar imagens, continuar com o roteiro
    setPendingImageAction(null)
    // Continuar com a resposta da IA normalmente
    return
  }
  
  if (mode === 'manual') {
    // Salvar sugestão para o usuário adicionar depois
    addDynamicSuggestion({
      id: `manual-${Date.now()}`,
      title: 'Adicionar imagens manualmente',
      description: `Busque imagens relacionadas a "${searchQuery}" quando quiser`,
      type: 'image',
      createdAt: Date.now(),
    })
    setPendingImageAction(null)
    return
  }
  
  if (mode === 'auto-search') {
    // Executar busca/criação conforme detectado
    setPendingImageAction(null)
    
    if (shouldCreate) {
      // Criar imagem com DALL-E
      await createImageWithDALLE(searchQuery)
    } else {
      // Buscar imagens
      await searchImages(searchQuery)
    }
  }
}
```

### **5. Renderizar o Seletor no Chat**

```typescript
// No return do componente, dentro da lista de mensagens:

{messages.map((message, index) => (
  <div key={index}>
    {/* Mensagem normal */}
    <div>{message.content}</div>
    
    {/* Seletor de ação (aparece após mensagem do assistente que sugere imagens) */}
    {index === messages.length - 1 && 
     message.role === 'assistant' && 
     pendingImageAction && (
      <ImageActionSelector
        suggestion={pendingImageAction.suggestion}
        onConfirm={handleImageActionConfirm}
        onCancel={() => setPendingImageAction(null)}
        defaultMode="auto-search"
      />
    )}
  </div>
))}
```

---

## 🎯 Fluxo Completo

```
1. Usuário: "Criar anúncio sobre agenda vazia"
   ↓
2. IA responde: "Vou buscar imagens de agenda vazia..."
   ↓
3. Sistema detecta: shouldSearchImages = true
   ↓
4. Ao invés de buscar, mostra ImageActionSelector
   ↓
5. Usuário escolhe: "Buscar automaticamente"
   ↓
6. Sistema executa: busca imagens
   ↓
7. Resultados aparecem na aba "Busca"
```

---

## 🔄 Alternativa: Integrar nas Sugestões Dinâmicas

Se preferir, pode integrar no painel de sugestões ao invés do chat:

```typescript
// src/components/creative-studio/SuggestionsPanel.tsx

{suggestions.map((suggestion, index) => {
  if (suggestion.type === 'image' && !suggestion.applied) {
    return (
      <div key={index}>
        {/* Sugestão normal */}
        <div>{suggestion.title}</div>
        
        {/* Seletor de ação */}
        <ImageActionSelector
          suggestion={{
            id: suggestion.id,
            title: suggestion.title,
            description: suggestion.description,
            requiresImages: true,
          }}
          onConfirm={(mode) => {
            if (mode === 'auto-search') {
              // Buscar imagens baseado na sugestão
              handleSearchFromSuggestion(suggestion)
            }
            // Marcar como aplicada
            onApply([index])
          }}
          onCancel={() => {}}
        />
      </div>
    )
  }
  
  return <div key={index}>{/* Sugestão normal */}</div>
})}
```

---

## ✅ Vantagens de Cada Abordagem

### **No Chat (Recomendado)**
- ✅ Aparece no contexto da conversa
- ✅ Mais natural e fluido
- ✅ Usuário vê exatamente quando a IA quer fazer algo

### **No Painel de Sugestões**
- ✅ Não interrompe o fluxo do chat
- ✅ Pode revisar todas as sugestões de uma vez
- ✅ Mais organizado para múltiplas sugestões

---

## 🚀 Próximos Passos

1. Escolher abordagem (chat ou painel)
2. Integrar componente no EditorChat
3. Testar fluxo completo
4. Ajustar UX conforme feedback

