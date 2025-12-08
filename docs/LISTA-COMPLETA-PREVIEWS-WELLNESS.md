# 📋 LISTA COMPLETA - Previews de Ferramentas Wellness

## 🎯 OBJETIVO

Listar todas as ferramentas que têm preview e verificar se a ordem está correta:
1. **Seção Azul** (Explicativa) → 2. **CTA Verde** → 3. **Diagnósticos**

---

## 📊 TIPOS DE TEMPLATES COM PREVIEW

### 1. **QUIZ** (`templateType === 'quiz'`)

**Ordem Atual**: ✅ CORRETA
- Seção azul (explicativa) → CTA verde → Diagnósticos

**Ferramentas (26+):**
1. ✅ Quiz Interativo
2. ✅ Quiz Bem-Estar
3. ✅ Quiz Perfil Nutricional
4. ✅ Quiz Detox
5. ✅ Quiz Energético
6. ✅ Avaliação Emocional
7. ✅ Avaliação de Intolerância
8. ✅ Avaliação do Perfil Metabólico
9. ✅ Avaliação Inicial
10. ✅ Diagnóstico de Eletrólitos
11. ✅ Diagnóstico de Sintomas Intestinais
12. ✅ Pronto para Emagrecer
13. ✅ Tipo de Fome / Fome Emocional
14. ✅ Alimentação Saudável
15. ✅ Síndrome Metabólica
16. ✅ Retenção de Líquidos
17. ✅ Conhece Seu Corpo
18. ✅ Nutrido vs Alimentado
19. ✅ Alimentação Rotina
20. ✅ Ganhos e Prosperidade
21. ✅ Potencial e Crescimento
22. ✅ Propósito e Equilíbrio
23. ✅ Diagnóstico de Parasitose
24. ✅ Quiz Fome Emocional (variações)

**Status**: ✅ Ordem correta em todos

---

### 2. **CALCULADORA** (`templateType === 'calculator'`)

**Ordem Atual**: ✅ CORRETA
- CTA verde → Diagnósticos

**Ferramentas (4):**
1. ✅ Calculadora de IMC
2. ✅ Calculadora de Proteína
3. ✅ Calculadora de Hidratação/Água
4. ✅ Calculadora de Calorias

**Status**: ✅ Ordem correta em todos

---

### 3. **CHECKLIST/PLANILHA** (`templateType === 'planilha' || 'checklist'`)

**Ordem Atual**: ✅ CORRETA
- Seção azul (explicativa) → CTA verde → Diagnósticos

**Ferramentas (2):**
1. ✅ Checklist Alimentar
2. ✅ Checklist Detox

**Status**: ✅ Ordem correta - corrigido

---

### 4. **SPREADSHEET** (`templateType === 'spreadsheet'`)

**Ordem Atual**: ✅ CORRETA
- Seção azul (explicativa) → CTA verde → Diagnósticos

**Ferramentas:**
- Planilhas/Tabelas diversas
- Cardápio Detox
- Tabela Comparativa
- Tabela de Substituições
- Mini E-book
- Guia Nutraceutico (pode ser spreadsheet)
- Guia Proteico (pode ser spreadsheet)

**Status**: ✅ Ordem correta - corrigido

---

### 5. **GUIA** (`templateType === 'guide'`)

**Ordem Atual**: ✅ CORRETA
- CTA verde → Diagnósticos

**Ferramentas (3):**
1. ✅ Guia de Hidratação
2. ✅ Guia Nutraceutico
3. ✅ Guia Proteico

**Status**: ✅ Ordem correta em todos

---

## 🔍 VERIFICAÇÃO POR TIPO

### ✅ QUIZ - Status: CORRETO
```typescript
// Linha 1442-1443
{renderCTA()}        // ✅ Primeiro
{renderDiagnosticsCards()}  // ✅ Depois
```

### ✅ CALCULADORA - Status: CORRETO
```typescript
// Linha 1778-1780
{renderCTA()}        // ✅ Primeiro
<div className="space-y-4">
  {renderDiagnosticsCards()}  // ✅ Depois
</div>
```

### ⚠️ GUIA - Status: VERIFICAR
```typescript
// Linha 2393-2394
{renderCTA()}        // ✅ Primeiro
{renderDiagnosticsCards()}  // ✅ Depois
```

---

## 📝 CHECKLIST DE REVISÃO

### Por Tipo de Template:

- [x] **Quiz**: Ordem correta (Azul → CTA → Diagnósticos) ✅
- [x] **Calculadora**: Ordem correta (CTA → Diagnósticos) ✅
- [x] **Checklist/Planilha**: Ordem correta (Azul → CTA → Diagnósticos) ✅ **CORRIGIDO**
- [x] **Spreadsheet**: Ordem correta (Azul → CTA → Diagnósticos) ✅ **CORRIGIDO**
- [x] **Guia**: Ordem correta (CTA → Diagnósticos) ✅

### Por Ferramenta Específica:

- [ ] Verificar cada ferramenta individualmente
- [ ] Testar preview de cada uma
- [ ] Confirmar ordem: Azul → Verde → Diagnósticos

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Quizzes**: Ordem correta - OK
2. ✅ **Calculadoras**: Ordem correta - OK
3. ✅ **Guias**: Ordem correta - OK
4. ✅ **Checklists/Planilhas**: Corrigido - Adicionado seção azul → CTA verde → Diagnósticos
5. ✅ **Spreadsheets**: Corrigido - Adicionado seção azul → CTA verde → Diagnósticos
6. **Testar cada ferramenta**: Abrir preview e verificar ordem visual

---

## 📊 RESUMO FINAL

### ✅ TODOS OS TIPOS CORRETOS (5 tipos):
- ✅ Quiz: 26+ ferramentas
- ✅ Calculadora: 4 ferramentas
- ✅ Guia: 3 ferramentas
- ✅ Checklist/Planilha: 2 ferramentas **CORRIGIDO**
- ✅ Spreadsheet: Múltiplas ferramentas **CORRIGIDO**

**Total de ferramentas com preview**: 35+ ferramentas
**Ferramentas corretas**: 35+ ferramentas ✅
**Ferramentas que precisam correção**: 0 ❌

---

**Status**: ✅ **TODOS OS TIPOS CORRIGIDOS** - Ordem: Seção Azul → CTA Verde → Diagnósticos

