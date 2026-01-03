# 🎬 FLUXO SIMPLIFICADO: Criar Vídeo do Zero

## 🎯 Objetivo

Criar um fluxo super intuitivo onde o usuário:
1. **Cola o roteiro completo**
2. **Sistema busca imagens automaticamente**
3. **Usuário escolhe as imagens**
4. **Sistema monta o vídeo automaticamente**

---

## 📋 FLUXO PROPOSTO

### **PASSO 1: Colar Roteiro**
```
Usuário cola roteiro no chat:
"0-5s: Hook - Você está cansada de olhar para uma agenda vazia?
5-15s: Problema - Consultas não marcadas significam menos clientes
15-25s: Solução - Com YLADA NUTRI você lota sua agenda
25-30s: CTA - Acesse /pt/nutri agora"
```

### **PASSO 2: Sistema Analisa e Busca**
```
IA analisa o roteiro e identifica:
- 4 segmentos de texto
- 4 momentos que precisam de imagens
- Busca imagens automaticamente para cada momento
```

### **PASSO 3: Usuário Escolhe Imagens**
```
Sistema mostra:
- 4 grupos de imagens (um para cada momento)
- Usuário clica nas que quer usar
- Ou clica "Usar todas sugeridas"
```

### **PASSO 4: Sistema Monta Automaticamente**
```
Sistema:
- Adiciona imagens na timeline na ordem do roteiro
- Adiciona legendas sincronizadas
- Cria o vídeo pronto para exportar
```

---

## 🛠️ IMPLEMENTAÇÃO

### **1. Novo Componente: ScriptPaste**

```typescript
// Componente para colar roteiro completo
interface ScriptPasteProps {
  onScriptPasted: (script: string) => void
}

// Usuário cola roteiro, sistema analisa e busca imagens
```

### **2. Análise Automática do Roteiro**

```typescript
// Extrair:
- Segmentos de tempo (0-5s, 5-15s, etc)
- Textos de cada segmento
- Sugestões de imagens para cada segmento
- Buscar imagens automaticamente
```

### **3. Seleção de Imagens Simplificada**

```typescript
// Mostrar:
- Grid de imagens por segmento
- Checkbox para escolher
- Botão "Usar todas" ou "Escolher manualmente"
```

### **4. Montagem Automática**

```typescript
// Quando usuário confirma:
- Adicionar imagens na timeline na ordem
- Adicionar legendas sincronizadas
- Ajustar timing automaticamente
```

---

## 🎨 INTERFACE PROPOSTA

### **Tela Inicial:**
```
┌─────────────────────────────────────┐
│ 🎬 CRIAR VÍDEO DO ZERO              │
├─────────────────────────────────────┤
│                                     │
│ Cole seu roteiro completo aqui:    │
│ ┌─────────────────────────────────┐ │
│ │ [Área de texto grande]          │ │
│ │                                  │ │
│ │ Exemplo:                        │ │
│ │ 0-5s: Hook - Texto...           │ │
│ │ 5-15s: Problema - Texto...      │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [✨ Criar Vídeo Automaticamente]   │
└─────────────────────────────────────┘
```

### **Tela de Seleção:**
```
┌─────────────────────────────────────┐
│ 📸 ESCOLHA AS IMAGENS               │
├─────────────────────────────────────┤
│                                     │
│ Segmento 1 (0-5s): Hook            │
│ ┌─────┐ ┌─────┐ ┌─────┐          │
│ │ [✓] │ │ [ ] │ │ [ ] │          │
│ └─────┘ └─────┘ └─────┘          │
│                                     │
│ Segmento 2 (5-15s): Problema       │
│ ┌─────┐ ┌─────┐ ┌─────┐          │
│ │ [✓] │ │ [ ] │ │ [ ] │          │
│ └─────┘ └─────┘ └─────┘          │
│                                     │
│ [✅ Usar Selecionadas]             │
│ [🎬 Usar Todas Sugeridas]          │
└─────────────────────────────────────┘
```

### **Tela de Montagem:**
```
┌─────────────────────────────────────┐
│ 🎬 MONTANDO SEU VÍDEO...            │
├─────────────────────────────────────┤
│                                     │
│ ✅ Imagens adicionadas (4/4)       │
│ ✅ Legendas criadas (4/4)          │
│ ✅ Timing ajustado                 │
│                                     │
│ [Ver Preview] [Exportar Vídeo]     │
└─────────────────────────────────────┘
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Criar componente ScriptPaste**
2. **Implementar análise automática**
3. **Criar interface de seleção simplificada**
4. **Implementar montagem automática**

---

**Vou implementar isso agora!** 🎬

