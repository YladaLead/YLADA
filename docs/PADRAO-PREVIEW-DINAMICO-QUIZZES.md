# 📋 PADRÃO: Preview Dinâmico de Quizzes

## 🎯 OBJETIVO

Este documento define o padrão oficial para todos os quizzes que usam o preview dinâmico (`DynamicTemplatePreview`), garantindo uma experiência consistente em todas as áreas (Wellness, Nutri, etc.).

---

## ✅ PADRÃO ESTABELECIDO

### **Estrutura de Etapas:**

```
Etapa 1+: Perguntas do Quiz (1, 2, 3, ...)
Etapa Final: Resultados/Diagnósticos
```

**⚠️ IMPORTANTE:** Para **previews**, não há tela de landing/introdução. O preview deve ser objetivo e começar direto na primeira pergunta.

### **Fluxo do Usuário:**

1. **Etapa 1+ (Perguntas):**
   - Mostra barra de progresso
   - Mostra pergunta atual
   - Mostra opções de resposta
   - Botão "← Anterior" (desabilitado na primeira pergunta)
   - Botão "Próxima →" ou "Ver Resultado" (na última pergunta)

2. **Etapa Final (Resultados):**
   - Mostra diagnósticos baseados nas respostas
   - Botão "Reiniciar Preview" → volta para Etapa 1 (primeira pergunta)
   - Botão "Fechar" (se disponível)

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### **Componente: `DynamicTemplatePreview`**

**Estado inicial:**
```typescript
const [etapaAtual, setEtapaAtual] = useState(1) // Sempre começa na primeira pergunta
```

**Lógica de renderização:**
```typescript
// Etapa 1+: Perguntas (preview começa direto aqui)
if (etapaAtual >= 1 && etapaAtual <= totalPerguntas) {
  return <QuestionScreen />
}

// Etapa Final: Resultados
if (etapaAtual > totalPerguntas) {
  return <ResultsScreen />
}
```

---

## 📝 ESTRUTURA DO CONTENT JSONB

### **Formato esperado no banco:**

```json
{
  "template_type": "quiz",
  "profession": "wellness" | "nutri",
  "questions": [
    {
      "id": 1,
      "question": "Texto da pergunta",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Opção A"},
        {"id": "b", "label": "Opção B"}
      ]
    }
  ]
}
```

### **Campos do Template (banco):**

- `name`: Título do quiz (usado na landing)
- `description`: Descrição do quiz (usado na landing)
- `content`: JSONB com estrutura acima

---

## 🎨 DESIGN (Previews são objetivos)

**⚠️ IMPORTANTE:** Previews não têm tela de landing. Começam direto na primeira pergunta para ser mais objetivo e rápido.

---

## 🔄 NAVEGAÇÃO

### **Botões:**

1. **"← Anterior" (Perguntas):**
   - Ação: `setEtapaAtual(Math.max(1, etapaAtual - 1))`
   - Desabilitado: Quando `etapaAtual === 1`
   - Texto: "← Anterior"

2. **"Próxima →" / "Ver Resultado" (Perguntas):**
   - Ação: `setEtapaAtual(etapaAtual + 1)`
   - Texto: "Ver Resultado" na última pergunta, "Próxima →" nas demais

3. **"Reiniciar Preview" (Resultados):**
   - Ação: `setEtapaAtual(1)` + `setRespostas({})`
   - Volta para a primeira pergunta (etapa 1)

---

## 📊 BARRA DE PROGRESSO

### **Exibição:**
- Mostrada apenas nas perguntas (etapa 1+)
- Formato: `Pergunta X de Y` + `Z%`
- Barra visual: `bg-gray-200` com `bg-blue-600` preenchendo

### **Cálculo:**
```typescript
const progresso = (etapaAtual / totalPerguntas) * 100
```

---

## 🎯 DIAGNÓSTICOS

### **Busca de diagnósticos:**

Os diagnósticos são buscados de arquivos TypeScript em `src/lib/diagnostics/` baseado em:
- `slug` do template
- `profession` (wellness/nutri)

### **Estrutura esperada:**

```typescript
export const quizNomeDiagnosticos = {
  wellness: {
    resultado1: { diagnostico, causaRaiz, acaoImediata, ... },
    resultado2: { ... },
    resultado3: { ... }
  },
  nutri: { ... }
}
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

Ao migrar um quiz para preview dinâmico:

- [ ] Verificar se `content` JSONB está completo no banco
- [ ] Se não estiver, criar script SQL para popular
- [ ] Remover preview customizado (import, estado, renderização)
- [ ] Remover da lista de templates modulares
- [ ] Testar landing (etapa 0)
- [ ] Testar perguntas (etapa 1+)
- [ ] Testar resultados (diagnósticos)
- [ ] Testar navegação (voltar, próxima, reiniciar)

---

## 🌐 APLICAÇÃO EM TODAS AS ÁREAS

Este padrão deve ser aplicado em:
- ✅ **Wellness** (em migração)
- ✅ **Nutri** (já usando preview dinâmico)
- ⏳ **Outras áreas futuras**

---

## 📚 EXEMPLOS

### **Quiz Interativo:**
- Landing: "Quiz Interativo - Descubra seu Tipo de Metabolismo"
- 6 perguntas
- 3 diagnósticos: Metabolismo Lento, Equilibrado, Acelerado

### **Quiz Bem-Estar:**
- Landing: "Quiz de Bem-Estar"
- 5 perguntas
- 3 diagnósticos: Bem-Estar Baixo, Moderado, Alto

---

## 🔗 ARQUIVOS RELACIONADOS

- `src/components/shared/DynamicTemplatePreview.tsx` - Componente principal
- `src/lib/diagnostics/` - Diagnósticos por área
- `scripts/criar-content-*.sql` - Scripts para popular content JSONB

---

## 📝 NOTAS IMPORTANTES

1. **Previews começam direto na primeira pergunta** (etapa 1) - mais objetivo
2. **Não há tela de landing em previews** - o objetivo é mostrar o fluxo rapidamente
3. **Diagnósticos são hardcoded** em TypeScript, não no JSONB
4. **Content JSONB** contém apenas estrutura (perguntas, opções)
5. **Padrão unificado** garante experiência consistente
6. **Diferença:** Preview (objetivo, direto) vs. Experiência real do usuário (pode ter landing)

---

**Última atualização:** 2024
**Status:** ✅ Padrão estabelecido e em uso

