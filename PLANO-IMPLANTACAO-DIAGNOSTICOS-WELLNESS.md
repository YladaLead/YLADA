# 📋 PLANO DE IMPLANTAÇÃO: DIAGNÓSTICOS COMPLETOS - ÁREA WELLNESS

## 🎯 OBJETIVO
Implementar diagnóstico completo (7 seções) em todas as ferramentas Wellness que ainda não possuem, garantindo que após o preenchimento do formulário, o usuário receba um diagnóstico completo e personalizado.

---

## 📊 SITUAÇÃO ATUAL

### ✅ Ferramentas COM Diagnóstico Completo (25 ferramentas)
- ✅ Calculadora de Proteína (`/proteina`) - **IMPLEMENTADO AGORA**
- ✅ Checklist Alimentar (`/checklist-alimentar`)
- ✅ Quiz Perfil Bem-Estar (`/wellness-profile`)
- ✅ Quiz Ganhos (`/ganhos`)
- ✅ Quiz Potencial (`/potencial`)
- ✅ Quiz Propósito (`/proposito`)
- ✅ Avaliação Inicial (`/initial-assessment`)
- ✅ Diagnóstico de Sintomas Intestinais (`/intestinal-symptoms-diagnosis`)
- ✅ Diagnóstico de Parasitose (`/parasitosis-diagnosis`)
- ✅ Diagnóstico de Eletrólitos (`/electrolyte-diagnosis`)
- ✅ Avaliação Perfil Metabólico (`/metabolic-profile-assessment`)
- ✅ E outras 14 ferramentas...

### ❌ Ferramentas SEM Diagnóstico Completo (3 calculadoras principais)

1. **Calculadora de IMC** (`/imc`)
   - Diagnóstico definido: ✅ `calculadoraImcDiagnosticos`
   - Status: ❌ Não exibe diagnóstico completo
   - Problema: Mostra apenas recomendações genéricas

2. **Calculadora de Água/Hidratação** (`/hidratacao`)
   - Diagnóstico definido: ✅ `calculadoraAguaDiagnosticos`
   - Status: ❌ Não exibe diagnóstico completo
   - Problema: Mostra apenas recomendações genéricas

3. **Calculadora de Calorias** (`/calorias`)
   - Diagnóstico definido: ✅ `calculadoraCaloriasDiagnosticos`
   - Status: ❌ Não exibe diagnóstico completo
   - Problema: Mostra apenas recomendações genéricas

---

## 🚀 PLANO DE IMPLANTAÇÃO

### **FASE 1: Calculadora de IMC** ⏱️ ~30 minutos

#### Passo 1.1: Importar Diagnósticos
**Arquivo:** `src/app/pt/wellness/templates/imc/page.tsx`

```typescript
import { calculadoraImcDiagnosticos } from '@/lib/diagnostics/wellness/calculadora-imc'
```

#### Passo 1.2: Atualizar Interface ResultadoIMC
**Linha ~12:** Adicionar campo `diagnostico`:

```typescript
interface ResultadoIMC {
  imc: number
  categoria: string
  cor: string
  descricao: string
  recomendacoes: string[]
  diagnostico?: typeof calculadoraImcDiagnosticos.wellness.baixoPeso
}
```

#### Passo 1.3: Selecionar Diagnóstico no Cálculo
**Linha ~56-106:** Após determinar categoria, selecionar diagnóstico:

```typescript
// Após calcular IMC e determinar categoria
let diagnosticoSelecionado

if (imc < 18.5) {
  categoria = 'Abaixo do Peso'
  cor = 'blue'
  diagnosticoSelecionado = calculadoraImcDiagnosticos.wellness.baixoPeso
} else if (imc >= 18.5 && imc < 25) {
  categoria = 'Peso Normal'
  cor = 'green'
  diagnosticoSelecionado = calculadoraImcDiagnosticos.wellness.pesoNormal
} else if (imc >= 25 && imc < 30) {
  categoria = 'Sobrepeso'
  cor = 'orange'
  diagnosticoSelecionado = calculadoraImcDiagnosticos.wellness.sobrepeso
} else {
  categoria = 'Obesidade'
  cor = 'red'
  diagnosticoSelecionado = calculadoraImcDiagnosticos.wellness.obesidade
}

setResultado({
  imc: parseFloat(imc.toFixed(2)),
  categoria,
  cor,
  descricao,
  recomendacoes,
  diagnostico: diagnosticoSelecionado
})
```

#### Passo 1.4: Exibir Diagnóstico Completo na Tela
**Linha ~298:** Adicionar seção após recomendações:

```typescript
{/* Diagnóstico Completo */}
{resultado.diagnostico && (
  <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200 mt-6">
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
      <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
        <span className="text-2xl mr-2">📋</span>
        Diagnóstico Completo
      </h3>
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.diagnostico}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.causaRaiz}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.acaoImediata}</p>
        </div>
        {resultado.diagnostico.plano7Dias && (
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.plano7Dias}</p>
          </div>
        )}
        {resultado.diagnostico.suplementacao && (
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.suplementacao}</p>
          </div>
        )}
        {resultado.diagnostico.alimentacao && (
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.alimentacao}</p>
          </div>
        )}
        {resultado.diagnostico.proximoPasso && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-gray-800 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

---

### **FASE 2: Calculadora de Água/Hidratação** ⏱️ ~30 minutos

#### Passo 2.1: Importar Diagnósticos
**Arquivo:** `src/app/pt/wellness/templates/hidratacao/page.tsx`

```typescript
import { calculadoraAguaDiagnosticos } from '@/lib/diagnostics/wellness/calculadora-agua'
```

#### Passo 2.2: Atualizar Interface ResultadoHidratacao
**Linha ~12:** Adicionar campo `diagnostico`:

```typescript
interface ResultadoHidratacao {
  aguaDiaria: number
  copos: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
  diagnostico?: typeof calculadoraAguaDiagnosticos.wellness.baixaHidratacao
}
```

#### Passo 2.3: Selecionar Diagnóstico no Cálculo
**Linha ~68-95:** Após determinar nível de hidratação:

```typescript
// Determinar qual diagnóstico usar baseado na quantidade de água
let diagnosticoSelecionado

if (aguaL < 2) {
  interpretacao = 'Importante manter uma boa hidratação diária.'
  cor = 'orange'
  diagnosticoSelecionado = calculadoraAguaDiagnosticos.wellness.baixaHidratacao
} else if (aguaL >= 2 && aguaL < 3) {
  interpretacao = 'Sua necessidade diária de hidratação está adequada.'
  cor = 'green'
  diagnosticoSelecionado = calculadoraAguaDiagnosticos.wellness.hidratacaoModerada
} else {
  interpretacao = 'Sua necessidade diária de hidratação é alta!'
  cor = 'blue'
  diagnosticoSelecionado = calculadoraAguaDiagnosticos.wellness.altaHidratacao
}

setResultado({
  aguaDiaria: aguaL,
  copos,
  interpretacao,
  cor,
  recomendacoes,
  diagnostico: diagnosticoSelecionado
})
```

#### Passo 2.4: Exibir Diagnóstico Completo na Tela
**Linha ~257:** Adicionar seção após recomendações (mesmo padrão da Fase 1.4, ajustando cores para cyan/blue)

---

### **FASE 3: Calculadora de Calorias** ⏱️ ~30 minutos

#### Passo 3.1: Importar Diagnósticos
**Arquivo:** `src/app/pt/wellness/templates/calorias/page.tsx`

```typescript
import { calculadoraCaloriasDiagnosticos } from '@/lib/diagnostics/wellness/calculadora-calorias'
```

#### Passo 3.2: Atualizar Interface ResultadoCalorias
**Linha ~11:** Adicionar campo `diagnostico`:

```typescript
interface ResultadoCalorias {
  tmb: number
  tdee: number
  calorias: number
  objetivo: string
  cor: string
  descricao: string
  recomendacoes: string[]
  diagnostico?: typeof calculadoraCaloriasDiagnosticos.wellness.deficitCalorico
}
```

#### Passo 3.3: Selecionar Diagnóstico no Cálculo
**Localizar função `calcularCalorias`:** Após determinar objetivo e calcular calorias:

```typescript
// Determinar qual diagnóstico usar baseado no objetivo
let diagnosticoSelecionado

if (objetivo === 'perder') {
  diagnosticoSelecionado = calculadoraCaloriasDiagnosticos.wellness.deficitCalorico
} else if (objetivo === 'manter') {
  diagnosticoSelecionado = calculadoraCaloriasDiagnosticos.wellness.manutencaoCalorica
} else {
  diagnosticoSelecionado = calculadoraCaloriasDiagnosticos.wellness.superavitCalorico
}

setResultado({
  tmb,
  tdee,
  calorias,
  objetivo,
  cor,
  descricao,
  recomendacoes,
  diagnostico: diagnosticoSelecionado
})
```

#### Passo 3.4: Exibir Diagnóstico Completo na Tela
**Linha ~379:** Adicionar seção após recomendações (mesmo padrão da Fase 1.4, ajustando cores para orange/red)

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Para cada calculadora:

- [ ] **Fase 1: IMC**
  - [ ] Importar `calculadoraImcDiagnosticos`
  - [ ] Adicionar campo `diagnostico` na interface
  - [ ] Selecionar diagnóstico baseado no IMC calculado
  - [ ] Exibir seção "Diagnóstico Completo" na tela
  - [ ] Testar todos os cenários (baixo peso, normal, sobrepeso, obesidade)

- [ ] **Fase 2: Água/Hidratação**
  - [ ] Importar `calculadoraAguaDiagnosticos`
  - [ ] Adicionar campo `diagnostico` na interface
  - [ ] Selecionar diagnóstico baseado na quantidade de água
  - [ ] Exibir seção "Diagnóstico Completo" na tela
  - [ ] Testar todos os cenários (baixa, moderada, alta hidratação)

- [ ] **Fase 3: Calorias**
  - [ ] Importar `calculadoraCaloriasDiagnosticos`
  - [ ] Adicionar campo `diagnostico` na interface
  - [ ] Selecionar diagnóstico baseado no objetivo
  - [ ] Exibir seção "Diagnóstico Completo" na tela
  - [ ] Testar todos os cenários (perder, manter, ganhar peso)

---

## 🎨 PADRÃO VISUAL

### Estrutura da Seção "Diagnóstico Completo"

```typescript
{/* Diagnóstico Completo */}
{resultado.diagnostico && (
  <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[COR]-200 mt-6">
    <div className="bg-gradient-to-r from-[COR]-50 to-[COR]-50 rounded-xl p-6 border-2 border-[COR]-200 mb-6">
      <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
        <span className="text-2xl mr-2">📋</span>
        Diagnóstico Completo
      </h3>
      <div className="space-y-4">
        {/* 7 seções do diagnóstico */}
      </div>
    </div>
  </div>
)}
```

### Cores por Calculadora:
- **IMC:** `blue` / `cyan`
- **Água:** `cyan` / `blue`
- **Calorias:** `orange` / `red`
- **Proteína:** `orange` / `red` (já implementado)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

1. ✅ Todas as calculadoras importam os diagnósticos corretos
2. ✅ Diagnóstico é selecionado automaticamente baseado no resultado
3. ✅ Seção "Diagnóstico Completo" aparece após as recomendações
4. ✅ Todas as 7 seções são exibidas quando disponíveis:
   - 📋 Diagnóstico
   - 🔍 Causa Raiz
   - ⚡ Ação Imediata
   - 📅 Plano 7 Dias
   - 💊 Suplementação
   - 🍎 Alimentação
   - 🎯 Próximo Passo
5. ✅ Layout responsivo e consistente com outras ferramentas
6. ✅ Testes manuais em todos os cenários possíveis

---

## 📊 ESTIMATIVA TOTAL

- **Tempo:** ~1h30min (30min por calculadora)
- **Complexidade:** Baixa (padrão já estabelecido)
- **Risco:** Baixo (mudanças isoladas, não afetam outras funcionalidades)

---

## 🔄 PRÓXIMOS PASSOS (Opcional)

Após implementar as 3 calculadoras principais, verificar:

- [ ] Calculadoras Hype Drink (`/hype-drink/consumo-cafeina`, `/hype-drink/custo-energia`)
- [ ] Outras ferramentas que possam ter diagnósticos definidos mas não exibidos

---

## 📌 NOTAS IMPORTANTES

1. **Manter padrão:** Seguir exatamente o mesmo padrão usado na Calculadora de Proteína
2. **Não remover:** Manter as recomendações genéricas existentes (diagnóstico completo é adicional)
3. **Testar:** Validar em diferentes cenários antes de considerar completo
4. **Consistência:** Usar as mesmas cores e estilos já estabelecidos em cada calculadora

---

**Status:** 🟡 Aguardando Implementação
**Última Atualização:** 2025-01-XX
**Responsável:** [A definir]

