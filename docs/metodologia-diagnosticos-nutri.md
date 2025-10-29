# Metodologia de Diagnósticos Nutricionais - YLADA

## 📋 Visão Geral

Este documento estabelece o padrão para criação e formatação de diagnósticos e resultados entregues aos clientes através das ferramentas criadas pelas nutricionistas. O objetivo é garantir consistência, qualidade e direcionamento eficaz para consultas profissionais.

---

## 🎯 Objetivo Principal

**Direcionar o cliente para uma consulta nutricional de forma sutil e educativa**, demonstrando o valor da personalização profissional sem ser excessivo ou prescritivo.

---

## 📊 Estrutura Padrão dos Resultados

Todos os diagnósticos devem seguir esta estrutura de **6 seções obrigatórias**:

### 1. **📋 DIAGNÓSTICO**
- **Objetivo**: Comunicar o estado atual de forma clara e objetiva
- **Tom**: Profissional, mas acessível
- **Direcionamento**: Sutil - mencionar necessidade de personalização quando relevante

**Exemplo:**
- ✅ "Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada"
- ❌ "Você precisa de uma nutricionista URGENTEMENTE"

### 2. **🔍 CAUSA RAIZ**
- **Objetivo**: Educar sobre as possíveis causas, mostrando complexidade
- **Tom**: Educativo e informativo
- **Direcionamento**: Mencionar que "uma avaliação completa identifica..."

**Exemplo:**
- ✅ "Problemas digestivos ou inflamação podem estar reduzindo a absorção. Uma avaliação completa identifica a origem e como reverter"
- ❌ "Você tem inflamação intestinal. Tome probiótico X"

### 3. **⚡ AÇÃO IMEDIATA**
- **Objetivo**: Orientar próximo passo sem prescrever
- **Tom**: Consultivo e não-prescritivo
- **Direcionamento**: SEMPRE mencionar avaliação/busca profissional, evitar auto-suplementação

**Exemplo:**
- ✅ "Busque avaliação nutricional para receber um protocolo seguro e adequado. Evite auto-suplementação — cada organismo responde de forma única"
- ❌ "Tome multivitamínico X na dose Y"

### 4. **📅 PLANO 7 DIAS**
- **Objetivo**: Mostrar estrutura de um plano personalizado
- **Tom**: Orientativo, demonstrando personalização
- **Direcionamento**: Enfatizar que é "ajustado ao seu perfil" / "conforme sua resposta"

**Exemplo:**
- ✅ "Um protocolo personalizado de 7 dias, ajustado ao seu perfil metabólico e estilo de vida, com acompanhamento para ajustes conforme sua resposta individual"
- ❌ "Plano de 7 dias: coma X no café, Y no almoço..."

### 5. **💊 SUPLEMENTAÇÃO**
- **Objetivo**: Informar sobre suplementação de forma educativa, SEM prescrever
- **Tom**: Informativo, não-prescritivo
- **Direcionamento**: SEMPRE mencionar "definida após avaliação" ou "identificada após análise"

**Regra de Ouro**: 
- ❌ NUNCA prescrever suplementos específicos ou dosagens
- ✅ Sempre mencionar que é "definida após avaliação"
- ✅ Pode mencionar exemplos genéricos ("costumam ser indicados... mas apenas após análise")

**Exemplo:**
- ✅ "Uma avaliação completa identifica quais suplementos seu corpo realmente precisa e em doses adequadas. Complexo B, magnésio e ômega-3 são frequentemente indicados, mas apenas após análise detalhada do seu caso"
- ❌ "Tome 200mg de magnésio e 1000mg de ômega-3"

### 6. **🍎 ALIMENTAÇÃO**
- **Objetivo**: Orientar hábitos alimentares de forma educativa
- **Tom**: Sugestivo e educativo
- **Direcionamento**: Mencionar que um plano personalizado considera preferências e objetivos

**Exemplo:**
- ✅ "Um plano alimentar personalizado considera suas preferências e objetivos para reequilibrar nutrientes de forma estratégica. Aumente frutas, verduras e grãos integrais enquanto aguarda sua avaliação profissional"
- ❌ "Coma apenas salada e peixe grelhado"

---

## 🎨 Princípios de Escrita

### 1. **Tom Consultivo, Não Prescritivo**
- **Evitar**: Ordens diretas ("Faça X", "Tome Y")
- **Preferir**: Sugestões educativas ("Considere X", "Um plano pode incluir Y")

### 2. **Direcionamento Sutil**
- **Evitar**: Repetir "nutricionista" em toda frase
- **Preferir**: Variações ("avaliação nutricional", "consulta", "análise profissional", "protocolo personalizado")
- **Frequência**: 1-2 menções por resultado (não em todas as 6 seções)

### 3. **Personalização Sempre Presente**
- Sempre mencionar que estratégias são "personalizadas", "ajustadas ao seu perfil", "conforme sua resposta"
- Evitar planos genéricos

### 4. **Valor da Avaliação Profissional**
- Conectar sintomas/carências à necessidade de avaliação
- Mostrar que cada caso é único e precisa de análise individual

---

## 📍 Localização dos Dados

### **Fonte Única da Verdade (PERMANENTE)**
Todos os textos de diagnóstico ficam em:
```
src/lib/diagnosticos-nutri.ts
```

**Este arquivo é PERMANENTE e independente de páginas temporárias.**

**Estrutura:**
```typescript
export const quizInterativoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    metabolismoLento: {
      diagnostico: '📋 DIAGNÓSTICO: ...',
      causaRaiz: '🔍 CAUSA RAIZ: ...',
      acaoImediata: '⚡ AÇÃO IMEDIATA: ...',
      plano7Dias: '📅 PLANO 7 DIAS: ...',
      suplementacao: '💊 SUPLEMENTAÇÃO: ...',
      alimentacao: '🍎 ALIMENTAÇÃO: ...'
    }
  }
}
```

### **Como Usar**
```typescript
import { getDiagnostico, diagnosticosNutri } from '@/lib/diagnosticos-nutri'

// Obter diagnóstico específico
const diagnostico = getDiagnostico('quiz-interativo', 'nutri', 'metabolismoLento')

// Acessar diretamente
const diagnostico = diagnosticosNutri['quiz-interativo'].nutri.metabolismoLento
```

### **Legado Temporário**
⚠️ **NOTA**: A página `admin-diagnosticos` pode ser removida no futuro. 
Todos os novos diagnósticos devem ser adicionados **APENAS** em `diagnosticos-nutri.ts`.
Se necessário manter compatibilidade temporária, pode sincronizar de `diagnosticos-nutri.ts` para `admin-diagnosticos`, mas nunca o contrário.

---

## 🔄 Fluxo de Trabalho

### Ao adicionar nova ferramenta:

1. **Definir resultados possíveis** (ex: Baixo, Moderado, Alto)
2. **Escrever textos no padrão** (6 seções) em `src/lib/diagnosticos-nutri.ts` ⚠️ **SEMPRE AQUI PRIMEIRO**
3. **Criar export const** seguindo o padrão:
   ```typescript
   export const novaFerramentaDiagnosticos: DiagnosticosPorFerramenta = {
     nutri: {
       resultadoId: {
         diagnostico: '...',
         causaRaiz: '...',
         acaoImediata: '...',
         plano7Dias: '...',
         suplementacao: '...',
         alimentacao: '...'
       }
     }
   }
   ```
4. **Adicionar ao objeto diagnosticosNutri**:
   ```typescript
   export const diagnosticosNutri = {
     'nova-ferramenta': novaFerramentaDiagnosticos,
     // ... outras ferramentas
   }
   ```
5. **Adicionar ao getDiagnostico()** para acesso via função helper
6. **Implementar preview** na área nutri com navegação por setinhas (importar de `diagnosticos-nutri.ts`)
7. **Validar** que todos os textos seguem os princípios deste documento

---

## ✅ Checklist para Novos Diagnósticos

Antes de finalizar um diagnóstico, verifique:

- [ ] Todas as 6 seções estão preenchidas?
- [ ] Não há prescrições diretas de suplementos/dosagens?
- [ ] Menciona avaliação profissional de forma sutil (1-2x no máximo)?
- [ ] Enfatiza personalização do plano?
- [ ] Tom é consultivo e educativo, não prescritivo?
- [ ] Texto está sincronizado entre preview e admin-diagnosticos?
- [ ] Evita termos muito técnicos sem explicação?

---

## 📝 Exemplos por Nível de Gravidade

### **Resultado Grave/Urgente** (ex: Bem-estar Baixo, Absorção Baixa)
- Tom: Mais direto, mas ainda consultivo
- Direcionamento: Mais evidente para avaliação profissional
- Exemplo: "Busque uma avaliação nutricional para receber um protocolo seguro e adequado"

### **Resultado Moderado** (ex: Bem-estar Moderado, Absorção Moderada)
- Tom: Equilibrado, focando em otimização
- Direcionamento: Sutil, mencionando "oportunidades de otimização"
- Exemplo: "Considere uma consulta para identificar oportunidades de otimização"

### **Resultado Positivo** (ex: Bem-estar Alto, Absorção Otimizada)
- Tom: Preventivo e evolutivo
- Direcionamento: Muito sutil, focando em manutenção e evolução
- Exemplo: "Considere uma avaliação preventiva para introduzir estratégias avançadas"

---

## 🚫 O Que NÃO Fazer

1. ❌ Prescrever suplementos específicos com dosagens
2. ❌ Dar receitas alimentares detalhadas
3. ❌ Repetir "nutricionista" em todas as seções
4. ❌ Ser alarmista ou criar urgência falsa
5. ❌ Prometer resultados específicos ("você vai perder X kg")
6. ❌ Usar linguagem muito técnica sem explicar
7. ❌ Criar planos genéricos sem mencionar personalização

---

## 📚 Ferramentas Implementadas

### Com Diagnósticos em `diagnosticos-nutri.ts` (Padrão Permanente):
- ✅ Quiz Interativo (Metabolismo)
- ✅ Quiz de Bem-Estar
- ✅ Quiz de Perfil Nutricional
- 🔄 Calculadora de IMC (diagnósticos ainda em admin-diagnosticos - migrar quando possível)

### Status de Migração:
**Admin-diagnosticos** → **diagnosticos-nutri.ts**

1. ⚠️ **Objetivo**: Migrar todos os diagnósticos de `admin-diagnosticos/page.tsx` para `diagnosticos-nutri.ts`
2. ✅ **Concluído**: Quiz Interativo, Quiz de Bem-Estar, Quiz de Perfil Nutricional
3. 🔄 **Pendente**: Calculadora de IMC e outras ferramentas
4. 📝 **Nova Regra**: Todas as novas ferramentas devem começar direto em `diagnosticos-nutri.ts`

**Próximas ferramentas**: Seguir este padrão permanente desde o início.

---

## 🔄 Atualizações deste Documento

Sempre que houver:
- Mudanças na estrutura padrão
- Novos princípios de escrita
- Novos templates como referência
- Ajustes no fluxo de trabalho

**Atualizar este documento** e comunicar a equipe.

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0

