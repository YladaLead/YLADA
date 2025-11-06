# 📋 O QUE SÃO OS "DIAGNÓSTICOS" NO SISTEMA?

## 🎯 RESUMO RÁPIDO

**"Diagnósticos" são os textos que aparecem para o usuário final** quando ele completa uma ferramenta (calculadora, quiz, checklist) e recebe o resultado.

---

## 📱 COMO APARECE PARA O USUÁRIO

### **Exemplo: Calculadora IMC**

Quando um usuário preenche a Calculadora IMC e recebe o resultado **"Baixo Peso"**, ele vê uma tela com:

```
┌─────────────────────────────────────────┐
│ 📉 Baixo Peso                           │
│ < 18.5                                  │
├─────────────────────────────────────────┤
│                                         │
│ 📋 DIAGNÓSTICO: Seu IMC indica baixo    │
│ peso, o que pode sinalizar carência...  │
│                                         │
│ 🔍 CAUSA RAIZ: Pode estar relacionado  │
│ a ingestão calórica insuficiente...    │
│                                         │
│ ⚡ AÇÃO IMEDIATA: Evite aumentar        │
│ calorias de forma desordenada...        │
│                                         │
│ 📅 PLANO 7 DIAS: Protocolo inicial...  │
│                                         │
│ 💊 SUPLEMENTAÇÃO: A necessidade só é   │
│ definida após avaliação completa...     │
│                                         │
│ 🍎 ALIMENTAÇÃO: Priorize alimentos...   │
│                                         │
│ 🎯 PRÓXIMO PASSO: Descubra em minutos  │
│ como seu corpo pode responder...        │
└─────────────────────────────────────────┘
```

**Isso é o "diagnóstico"!** São os textos educativos que aparecem após o cálculo.

---

## 🗂️ ESTRUTURA DO DIAGNÓSTICO

Cada diagnóstico tem **7 seções**:

1. **📋 DIAGNÓSTICO** - O que significa o resultado (ex: "Baixo Peso")
2. **🔍 CAUSA RAIZ** - Por que isso está acontecendo
3. **⚡ AÇÃO IMEDIATA** - O que fazer agora
4. **📅 PLANO 7 DIAS** - Passos práticos para os próximos 7 dias
5. **💊 SUPLEMENTAÇÃO** - Orientações sobre suplementos (se necessário)
6. **🍎 ALIMENTAÇÃO** - Recomendações alimentares
7. **🎯 PRÓXIMO PASSO** - CTA (call-to-action) para buscar ajuda profissional

---

## 📁 ONDE FICAM OS DIAGNÓSTICOS

### **Estrutura de Arquivos:**

```
src/lib/diagnostics/
├── types.ts (interfaces TypeScript)
├── index.ts (exports centralizados)
│
└── wellness/
    ├── calculadora-imc.ts          ← Diagnósticos da Calculadora IMC
    ├── calculadora-proteina.ts     ← Diagnósticos da Calculadora Proteína
    ├── calculadora-agua.ts         ← Diagnósticos da Calculadora Água
    ├── calculadora-calorias.ts     ← Diagnósticos da Calculadora Calorias
    └── checklist-alimentar.ts      ← Diagnósticos do Checklist Alimentar
```

### **Exemplo: Arquivo `calculadora-imc.ts`**

```typescript
export const calculadoraImcDiagnosticos = {
  wellness: {
    baixoPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica baixo peso...',
      causaRaiz: '🔍 CAUSA RAIZ: Pode estar relacionado...',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Evite aumentar...',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial...',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade...',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize alimentos...',
      proximoPasso: '🎯 PRÓXIMO PASSO: Descubra em minutos...'
    },
    pesoNormal: { ... },
    sobrepeso: { ... },
    obesidade: { ... }
  }
}
```

---

## 🔄 DIFERENÇA ENTRE NUTRI E WELLNESS

### **Mesma estrutura, textos diferentes:**

**Nutri (`calculadora-imc.ts` do Nutri):**
- Textos mais técnicos
- Foco em avaliação nutricional profissional
- Linguagem médica

**Wellness (`calculadora-imc.ts` do Wellness):**
- Textos mais acessíveis
- Foco em bem-estar e estilo de vida
- Linguagem mais amigável

**Exemplo de diferença:**

**Nutri:**
```
"Uma avaliação nutricional completa identifica exatamente onde está o desequilíbrio"
```

**Wellness:**
```
"Uma avaliação nutricional identifica exatamente onde está o desequilíbrio"
(mais leve, menos técnico)
```

---

## 🎨 COMO É USADO NA PÁGINA

Na página `/pt/wellness/templates`, quando o usuário clica em **"Ver Demo"** da Calculadora IMC:

1. **Etapa 1:** Landing page (tela inicial)
2. **Etapa 2:** Formulário (altura, peso, etc.)
3. **Etapa 3:** Resultado visual (ex: "IMC = 22.5 - Peso Normal")
4. **Etapa 4:** **DIAGNÓSTICOS** ← Aparecem aqui!

Na etapa 4, o sistema mostra **todos os resultados possíveis**:
- Baixo Peso (< 18.5)
- Peso Normal (18.5 - 24.9)
- Sobrepeso (25.0 - 29.9)
- Obesidade (≥ 30.0)

Cada um com seu diagnóstico completo (7 seções).

---

## ✅ O QUE FOI CRIADO HOJE

1. ✅ `calculadora-imc.ts` (Wellness) - 4 resultados possíveis
2. ✅ `calculadora-proteina.ts` (Wellness) - 3 resultados possíveis
3. ✅ `calculadora-agua.ts` (Wellness) - 3 resultados possíveis
4. ✅ `calculadora-calorias.ts` (Wellness) - 3 resultados possíveis
5. ✅ `checklist-alimentar.ts` (Wellness) - 3 resultados possíveis (já existia)

**Total:** 16 diagnósticos diferentes para a área Wellness!

---

## 🎯 RESUMO FINAL

**"Diagnóstico" = Textos educativos que aparecem após o usuário completar uma ferramenta**

- São os resultados explicados de forma educativa
- Têm 7 seções padronizadas
- Cada área (Nutri/Wellness) tem seus próprios textos
- Ficam organizados em arquivos separados por ferramenta

**É como um "relatório médico simplificado" que o sistema gera automaticamente!** 📊

