# 📋 GUIA DE REPLICAÇÃO: TEMPLATES NUTRI → WELLNESS

## 🎯 OBJETIVO

Este documento serve como guia passo a passo para replicar os 38 templates validados da área Nutri para a área Wellness, aproveitando toda a estrutura, fluxos e diagnósticos já criados e testados.

---

## 📊 VISÃO GERAL DOS TEMPLATES

### **Total: 38 Templates**

| Categoria | Quantidade | Templates |
|-----------|-----------|-----------|
| **Quiz** | 5 | Quiz Interativo, Bem-Estar, Perfil Nutricional, Detox, Energético |
| **Calculadora** | 4 | IMC, Proteína, Água, Calorias |
| **Checklist** | 2 | Detox, Alimentar |
| **Conteúdo** | 6 | Mini E-book, Guia Nutracêutico, Guia Proteico, Tabela Comparativa, Tabela Substituições |
| **Diagnóstico** | 21 | 21 diagnósticos específicos (ver lista completa abaixo) |

---

## 🔄 ESTRUTURA DE PREVIEW (FLUXO PADRÃO)

### **1. CALCULADORAS** (4 etapas)
```
Etapa 0: Landing Page
  - Título e descrição
  - Botão "Começar Agora"
  
Etapa 1: Formulário Completo
  - Campos específicos por calculadora
  - Exemplos de valores
  
Etapa 2: Resultado Visual
  - Valor calculado
  - Gráficos/indicadores visuais
  - Distribuição/interpretação
  
Etapa 3: Diagnósticos Completos
  - Todos os resultados possíveis
  - Cada resultado com: Diagnóstico, Causa Raiz, Ação Imediata, Plano 7 Dias, Suplementação, Alimentação, Próximo Passo
```

### **2. QUIZZES** (7-8 etapas)
```
Etapa 0: Landing Page
  - Título e descrição
  - Botão "Começar Quiz"
  
Etapas 1-N: Perguntas
  - Pergunta por etapa
  - Opções de resposta
  - Exemplos de perguntas estratégicas
  
Etapa Final: Resultado
  - Score/classificação
  - Diagnóstico completo
  - Recomendações
```

### **3. CHECKLISTS** (5-6 etapas)
```
Etapa 0: Landing Page
  - Título e descrição
  - Provocação inicial
  
Etapas 1-3: Perguntas Exemplo
  - 3 perguntas representativas
  - Provocações integradas (menção a Herbalife)
  - Dicas/alertas estratégicos
  
Etapa Final: Resultado
  - Score/classificação
  - Oportunidades/Sinais identificados
  - Seção "Como um Distribuidor Herbalife Pode Ajudar"
  - CTA forte para contato
```

### **4. DIAGNÓSTICOS** (11-12 etapas)
```
Etapa 0: Landing Page
  - Título e descrição
  - Provocação inicial
  
Etapas 1-10: Perguntas
  - 10 perguntas específicas
  - Provocações estratégicas
  
Etapa Final: Resultado
  - Classificação do perfil
  - Diagnóstico completo
  - Recomendações personalizadas
```

---

## 📝 LISTA COMPLETA DE TEMPLATES

### **QUIZES (5)**

#### 1. Quiz Interativo
- **ID**: `quiz-interativo`
- **Estado Preview**: `etapaPreviewQuiz`
- **Estrutura**: 0 = landing, 1-6 = perguntas, 7 = resultados
- **Diagnósticos**: `quizInterativoDiagnosticos` (metabolismoLento, metabolismoEquilibrado, metabolismoAcelerado)
- **Status Wellness**: ⏳ Pendente

#### 2. Quiz de Bem-Estar
- **ID**: `quiz-bem-estar`
- **Estado Preview**: `etapaPreviewQuizBemEstar`
- **Estrutura**: 0 = landing, 1-5 = perguntas, 6 = resultados
- **Diagnósticos**: `quizBemEstarDiagnosticos` (bemEstarBaixo, bemEstarModerado, bemEstarAlto)
- **Status Wellness**: ⏳ Pendente

#### 3. Quiz de Perfil Nutricional
- **ID**: `quiz-perfil-nutricional`
- **Estado Preview**: `etapaPreviewQuizPerfil`
- **Estrutura**: 0 = landing, 1-5 = perguntas, 6 = resultados
- **Diagnósticos**: `quizPerfilNutricionalDiagnosticos` (absorcaoBaixa, absorcaoModerada, absorcaoOtimizada)
- **Status Wellness**: ⏳ Pendente

#### 4. Quiz Detox
- **ID**: `quiz-detox`
- **Estado Preview**: `etapaPreviewQuizDetox`
- **Estrutura**: 0 = landing, 1-5 = perguntas, 6 = resultados
- **Diagnósticos**: `quizDetoxDiagnosticos`
- **Status Wellness**: ⏳ Pendente

#### 5. Quiz Energético
- **ID**: `quiz-energetico`
- **Estado Preview**: `etapaPreviewQuizEnergetico`
- **Estrutura**: 0 = landing, 1-5 = perguntas, 6 = resultados
- **Diagnósticos**: `quizEnergeticoDiagnosticos`
- **Status Wellness**: ⏳ Pendente

---

### **CALCULADORAS (4)**

#### 1. Calculadora de IMC
- **ID**: `calculadora-imc`
- **Estado Preview**: `etapaPreviewCalc`
- **Estrutura**: 0 = landing, 1 = formulário, 2 = resultado, 3 = diagnósticos
- **Formulário**: Altura, Peso, Sexo, Nível de Atividade (opcional)
- **Diagnósticos**: `calculadoraImcDiagnosticos` (baixoPeso, pesoNormal, sobrepeso, obesidade)
- **Status Wellness**: ✅ Implementado (parcial - precisa ajustar diagnósticos)

#### 2. Calculadora de Proteína
- **ID**: `calculadora-proteina`
- **Estado Preview**: `etapaPreviewCalcProteina`
- **Estrutura**: 0 = landing, 1 = formulário, 2 = resultado, 3 = diagnósticos
- **Formulário**: Peso, Altura, Nível de Atividade, Objetivo
- **Diagnósticos**: `calculadoraProteinaDiagnosticos` (baixaProteina, proteinaNormal, altaProteina)
- **Status Wellness**: ✅ Implementado (parcial - precisa ajustar diagnósticos)

#### 3. Calculadora de Água
- **ID**: `calculadora-agua`
- **Estado Preview**: `etapaPreviewCalcAgua`
- **Estrutura**: 0 = landing, 1 = formulário, 2 = resultado, 3 = diagnósticos
- **Formulário**: Peso, Altura, Nível de Atividade, Condições Climáticas
- **Diagnósticos**: `calculadoraAguaDiagnosticos` (baixaHidratacao, hidratacaoModerada, altaHidratacao)
- **Status Wellness**: ✅ Implementado (parcial - precisa ajustar diagnósticos)

#### 4. Calculadora de Calorias
- **ID**: `calculadora-calorias`
- **Estado Preview**: `etapaPreviewCalcCalorias`
- **Estrutura**: 0 = landing, 1 = formulário, 2 = resultado, 3 = diagnósticos
- **Formulário**: Peso, Altura, Idade, Sexo, Nível de Atividade, Objetivo
- **Diagnósticos**: `calculadoraCaloriasDiagnosticos` (deficitCalorico, manutencaoCalorica, superavitCalorico)
- **Status Wellness**: ✅ Implementado (parcial - precisa ajustar diagnósticos)

---

### **CHECKLISTS (2)**

#### 1. Checklist Detox
- **ID**: `checklist-detox`
- **Estado Preview**: `etapaPreviewChecklistDetox`
- **Estrutura**: 0 = landing, 1-5 = perguntas exemplo, 6 = resultados
- **Total Perguntas**: 10
- **Diagnósticos**: `checklistDetoxDiagnosticos`
- **Provocações**: ⚠️ Integradas em cada pergunta
- **Status Wellness**: ✅ Implementado (com provocações Herbalife)

#### 2. Checklist Alimentar
- **ID**: `checklist-alimentar`
- **Estado Preview**: `etapaPreviewChecklistAlimentar`
- **Estrutura**: 0 = landing, 1-3 = perguntas exemplo, 4 = resultados
- **Total Perguntas**: 12
- **Diagnósticos**: `checklistAlimentarDiagnosticos`
- **Provocações**: ⚠️ Integradas em cada pergunta
- **Status Wellness**: ✅ Implementado (com provocações Herbalife)

---

### **CONTEÚDO EDUCATIVO (6)**

#### 1. Mini E-book Educativo
- **ID**: `mini-ebook`
- **Estado Preview**: `etapaPreviewMiniEbook`
- **Estrutura**: 0 = landing, 1-5 = preview conteúdo, 6 = CTA download
- **Status Wellness**: ⏳ Pendente

#### 2. Guia Nutracêutico
- **ID**: `guia-nutraceutico`
- **Estado Preview**: `etapaPreviewGuiaNutraceutico`
- **Estrutura**: 0 = landing, 1-5 = preview, 6 = CTA
- **Diagnósticos**: `guiaNutraceuticoDiagnosticos`
- **Status Wellness**: ⏳ Pendente

#### 3. Guia Proteico
- **ID**: `guia-proteico`
- **Estado Preview**: `etapaPreviewGuiaProteico`
- **Estrutura**: 0 = landing, 1-5 = preview, 6 = CTA
- **Diagnósticos**: `guiaProteicoDiagnosticos`
- **Status Wellness**: ⏳ Pendente

#### 4. Tabela Comparativa
- **ID**: `tabela-comparativa`
- **Estado Preview**: `etapaPreviewTabelaComparativa`
- **Estrutura**: 0 = landing, 1-5 = preview, 6 = CTA
- **Diagnósticos**: `tabelaComparativaDiagnosticos`
- **Status Wellness**: ⏳ Pendente

#### 5. Tabela de Substituições
- **ID**: `tabela-substituicoes`
- **Estado Preview**: `etapaPreviewTabelaSubstituicoes`
- **Estrutura**: 0 = landing, 1-5 = preview, 6 = CTA
- **Diagnósticos**: `tabelaSubstituicoesDiagnosticos`
- **Status Wellness**: ⏳ Pendente

---

### **DIAGNÓSTICOS ESPECÍFICOS (21)**

#### 1. Diagnóstico de Parasitose
- **ID**: `template-diagnostico-parasitose`
- **Estado Preview**: `etapaPreviewParasitose`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 2. Diagnóstico de Eletrólitos
- **ID**: `diagnostico-eletritos`
- **Estado Preview**: `etapaPreviewEletritos`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 3. Avaliação do Perfil Metabólico
- **ID**: `diagnostico-perfil-metabolico`
- **Estado Preview**: `etapaPreviewMetabolico`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 4. Diagnóstico de Sintomas Intestinais
- **ID**: `diagnostico-sintomas-intestinais`
- **Estado Preview**: `etapaPreviewSintomasIntestinais`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 5. Avaliação do Sono e Energia
- **ID**: `avaliacao-sono-energia`
- **Estado Preview**: `etapaPreviewSono`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 6. Teste de Retenção de Líquidos
- **ID**: `teste-retencao-liquidos`
- **Estado Preview**: `etapaPreviewRetencao`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 7. Avaliação de Fome Emocional
- **ID**: `avaliacao-fome-emocional`
- **Estado Preview**: `etapaPreviewFomeEmocional`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 8. Diagnóstico do Tipo de Metabolismo
- **ID**: `diagnostico-tipo-metabolismo`
- **Estado Preview**: `etapaPreviewTipoMetabolico`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 9. Você é mais disciplinado ou emocional com a comida?
- **ID**: `disciplinado-emocional`
- **Estado Preview**: `etapaPreviewDisciplinadoEmocional`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 10. Você está nutrido ou apenas alimentado?
- **ID**: `nutrido-alimentado`
- **Estado Preview**: `etapaPreviewNutridoAlimentado`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 11. Qual é seu perfil de intestino?
- **ID**: `perfil-intestino`
- **Estado Preview**: `etapaPreviewPerfilIntestino`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 12. Avaliação de Intolerâncias/Sensibilidades
- **ID**: `avaliacao-sensibilidades`
- **Estado Preview**: `etapaPreviewSensibilidades`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 13. Risco de Síndrome Metabólica
- **ID**: `avaliacao-sindrome-metabolica`
- **Estado Preview**: `etapaPreviewSindMetabolica`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 14. Descubra seu Perfil de Bem-Estar
- **ID**: `descoberta-perfil-bem-estar`
- **Estado Preview**: `etapaPreviewPerfilBemEstar`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 15. Qual é o seu Tipo de Fome?
- **ID**: `quiz-tipo-fome`
- **Estado Preview**: `etapaPreviewTipoFome`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 16. Seu corpo está pedindo Detox?
- **ID**: `quiz-pedindo-detox`
- **Estado Preview**: `etapaPreviewDetox`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 17. Você está se alimentando conforme sua rotina?
- **ID**: `avaliacao-rotina-alimentar`
- **Estado Preview**: `etapaPreviewRotinaAlimentar`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 18. Pronto para Emagrecer com Saúde?
- **ID**: `pronto-emagrecer`
- **Estado Preview**: `etapaPreviewProntidaoEmagrecer`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

#### 19. Você conhece o seu corpo?
- **ID**: `autoconhecimento-corporal`
- **Estado Preview**: `etapaPreviewAutoconhecimento`
- **Estrutura**: 0 = landing, 1-10 = perguntas, 11 = resultados
- **Status Wellness**: ⏳ Pendente

---

## 📦 ARQUIVO DE DIAGNÓSTICOS

**Localização**: `/src/lib/diagnosticos-nutri.ts`

### **Estrutura de Diagnóstico Completo**

```typescript
interface DiagnosticoCompleto {
  diagnostico: string        // Seção 1: Diagnóstico principal
  causaRaiz: string          // Seção 2: Causa raiz explicada
  acaoImediata: string       // Seção 3: Ação imediata recomendada
  plano7Dias: string         // Seção 4: Plano de 7 dias
  suplementacao: string      // Seção 5: Recomendações de suplementação
  alimentacao: string        // Seção 6: Recomendações alimentares
  proximoPasso?: string      // Seção 7 (opcional): CTA indireto
}
```

### **Exports Disponíveis**

- `calculadoraAguaDiagnosticos`
- `calculadoraImcDiagnosticos`
- `calculadoraProteinaDiagnosticos`
- `calculadoraCaloriasDiagnosticos`
- `checklistDetoxDiagnosticos`
- `checklistAlimentarDiagnosticos`
- `quizInterativoDiagnosticos`
- `quizBemEstarDiagnosticos`
- `quizPerfilNutricionalDiagnosticos`
- `quizDetoxDiagnosticos`
- `quizEnergeticoDiagnosticos`
- `miniEbookDiagnosticos`
- `guiaNutraceuticoDiagnosticos`
- `guiaProteicoDiagnosticos`
- `tabelaComparativaDiagnosticos`
- `tabelaSubstituicoesDiagnosticos`
- E mais...

---

## 🔧 PASSO A PASSO DE REPLICAÇÃO

### **ETAPA 1: Preparação**

1. ✅ Verificar se o template existe no banco de dados Wellness
2. ✅ Identificar o ID/slug do template
3. ✅ Verificar se o diagnóstico existe em `diagnosticos-nutri.ts`
4. ✅ Decidir se precisa adaptar o diagnóstico para Wellness

### **ETAPA 2: Estrutura de Preview**

1. **Identificar tipo de template**:
   - Calculadora → 4 etapas (Landing, Form, Result, Diagnósticos)
   - Quiz → 7-8 etapas (Landing, Perguntas, Resultado)
   - Checklist → 5-6 etapas (Landing, Perguntas exemplo, Resultado)
   - Diagnóstico → 11-12 etapas (Landing, 10 perguntas, Resultado)

2. **Adicionar estado de preview** (se necessário):
   ```typescript
   const [etapaPreviewTemplate, setEtapaPreviewTemplate] = useState(0)
   ```

3. **Adicionar lógica de detecção**:
   ```typescript
   {template.id === 'id-do-template' || template.name?.toLowerCase().includes('nome') ? (
     // Preview específico
   ) : null}
   ```

### **ETAPA 3: Landing Page (Etapa 0)**

```typescript
{etapaPreview === 0 && (
  {template.id === 'id-do-template' ? (
    <div className="bg-gradient-to-r from-[cor]-50 to-[cor]-50 p-6 rounded-lg border-2 border-[cor]-200">
      <h4 className="text-xl font-bold text-gray-900 mb-2">🎯 {template.name}</h4>
      <p className="text-gray-700 mb-4 font-medium">{template.description}</p>
      
      {/* Provocação inicial (se aplicável) */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800 font-semibold">
          ⚠️ <strong>Você sabia?</strong> Provocação estratégica aqui...
        </p>
      </div>
      
      <button className="mt-4 w-full bg-gradient-to-r from-[cor]-600 to-[cor]-600 text-white py-3 rounded-lg font-semibold">
        ▶️ Começar Agora - É Grátis
      </button>
    </div>
  ) : (
    // Landing genérica
  )}
)}
```

### **ETAPA 4: Formulário/Perguntas**

**Para Calculadoras**:
```typescript
{template.type === 'calculadora' && etapaPreview === 1 && (
  {template.id === 'id-do-template' ? (
    <div className="space-y-6">
      {/* Seção 1: Dados Principais */}
      <div className="bg-[cor]-50 p-4 rounded-lg">
        <h4 className="font-semibold text-[cor]-900 mb-3">⚖️ Informe seus dados</h4>
        {/* Campos do formulário */}
      </div>
      
      {/* Seção 2: Outros campos */}
      {/* ... */}
      
      {/* Provocações estratégicas */}
      <p className="text-xs text-[cor]-600 mt-2">🧠 Gatilho: [tipo de gatilho]</p>
    </div>
  ) : null}
)}
```

**Para Checklists/Quizzes**:
```typescript
{template.type === 'planilha' && etapaPreview === 1 && (
  {template.id === 'id-do-template' ? (
    <div className="bg-[cor]-50 p-5 rounded-lg border-2 border-[cor]-200">
      <div className="flex items-center justify-between mb-3">
        <span className="bg-[cor]-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Pergunta 1 de [total]
        </span>
      </div>
      <h4 className="font-semibold text-[cor]-900 mb-2 text-lg">[Pergunta]</h4>
      <p className="text-sm text-[cor]-700 mb-4">[Descrição]</p>
      
      {/* Opções de resposta */}
      <div className="space-y-2">
        {[opcoes].map((opcao, idx) => (
          <label key={idx} className="flex items-center p-3 bg-white rounded-lg border border-[cor]-200">
            <input type="radio" name="pergunta-1" className="mr-3" disabled />
            <span className="text-gray-700">{opcao}</span>
          </label>
        ))}
      </div>
      
      {/* Provocação integrada */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          💡 <strong>Dica:</strong> Provocação mencionando Herbalife/distribuidor...
        </p>
      </div>
    </div>
  ) : null}
)}
```

### **ETAPA 5: Resultado Visual (Calculadoras)**

```typescript
{template.type === 'calculadora' && etapaPreview === 2 && (
  {template.id === 'id-do-template' ? (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora</h4>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-[cor]-600 mb-2">[Valor]</div>
          <div className="text-lg font-semibold text-green-600">[Interpretação]</div>
        </div>
        
        {/* Gráficos/Indicadores visuais */}
        <div className="relative bg-gray-200 rounded-full h-6 mb-4">
          <div className="absolute left-0 top-0 h-6 bg-[cor]-500 rounded-full" style={{width: '[%]'}}></div>
        </div>
      </div>
    </div>
  ) : null}
)}
```

### **ETAPA 6: Diagnósticos Completos**

```typescript
{template.type === 'calculadora' && etapaPreview === 3 && (
  <div className="space-y-6">
    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis</h4>
    
    {template.id === 'id-do-template' ? (
      <>
        {/* Resultado 1 */}
        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-red-900">[Título Resultado]</h5>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              [Range]
            </span>
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <p className="font-semibold text-gray-900">
              {diagnosticos.nutri.resultado1.diagnostico}
            </p>
            <p className="text-gray-700">{diagnosticos.nutri.resultado1.causaRaiz}</p>
            <p className="text-gray-700">{diagnosticos.nutri.resultado1.acaoImediata}</p>
            <p className="text-gray-700">{diagnosticos.nutri.resultado1.plano7Dias}</p>
            <p className="text-gray-700">{diagnosticos.nutri.resultado1.suplementacao}</p>
            <p className="text-gray-700">{diagnosticos.nutri.resultado1.alimentacao}</p>
            {diagnosticos.nutri.resultado1.proximoPasso && (
              <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">
                {diagnosticos.nutri.resultado1.proximoPasso}
              </p>
            )}
          </div>
        </div>
        
        {/* Repetir para outros resultados */}
      </>
    ) : null}
  </div>
)}
```

### **ETAPA 7: Resultado Final (Checklists/Quizzes)**

```typescript
{template.type === 'planilha' && etapaPreview === 4 && (
  {template.id === 'id-do-template' ? (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[cor]-50 to-[cor]-50 p-6 rounded-lg border-2 border-[cor]-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
          📊 Seu Resultado: [Classificação]
        </h4>
        
        {/* Score */}
        <div className="bg-white rounded-lg p-5 mb-4 border border-[cor]-200">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-[cor]-600 mb-2">[Pontos] pontos</div>
            <div className="text-lg font-semibold text-gray-700">de [total] pontos possíveis</div>
          </div>
          {/* Barra de progresso */}
        </div>
        
        {/* Análise */}
        <div className="bg-white rounded-lg p-5 border border-[cor]-200 mb-4">
          <h5 className="font-semibold text-gray-900 mb-3">🎯 Oportunidades Identificadas:</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            {/* Lista de oportunidades */}
          </ul>
        </div>
        
        {/* Seção Herbalife */}
        <div className="bg-gradient-to-r from-[cor]-600 to-[cor]-600 rounded-lg p-5 text-white mb-4">
          <h5 className="font-bold text-lg mb-3 text-center">
            💡 Como um Distribuidor Herbalife Pode Ajudar Você:
          </h5>
          <ul className="space-y-2 text-sm">
            {/* Benefícios */}
          </ul>
        </div>
        
        {/* CTA Final */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
          <button className="w-full bg-gradient-to-r from-[cor]-600 to-[cor]-600 text-white py-4 rounded-lg font-bold text-lg">
            📱 Falar com Distribuidor Herbalife Agora
          </button>
        </div>
      </div>
    </div>
  ) : null}
)}
```

### **ETAPA 8: Navegação entre Etapas**

```typescript
{/* Navegação por Etapas */}
<div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
  <button
    onClick={() => setEtapaPreview(Math.max(0, etapaPreview - 1))}
    disabled={etapaPreview === 0}
  >
    ← Anterior
  </button>
  
  <div className="flex space-x-2">
    {Array.from({ length: totalEtapas }, (_, i) => (
      <button
        key={i}
        onClick={() => setEtapaPreview(i)}
        className={etapaPreview === i ? 'ativo' : 'inativo'}
      >
        {etapasLabels[i]}
      </button>
    ))}
  </div>
  
  <button
    onClick={() => setEtapaPreview(Math.min(totalEtapas - 1, etapaPreview + 1))}
    disabled={etapaPreview === totalEtapas - 1}
  >
    Próxima →
  </button>
</div>
```

---

## 🎨 PADRÕES DE DESIGN

### **Cores por Tipo de Template**

- **Calculadoras**: Azul, Verde, Laranja, Vermelho
- **Checklists**: Verde (Alimentar), Roxo (Detox)
- **Quizzes**: Varia conforme tema
- **Diagnósticos**: Varia conforme tema

### **Provocações Estratégicas**

1. **Integradas em perguntas**: Dicas/alertas que mencionam Herbalife
2. **No resultado final**: Seção dedicada "Como um Distribuidor Herbalife Pode Ajudar"
3. **CTA forte**: Botão destacado para contato

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Para cada template, verificar:

- [ ] Template existe no banco de dados Wellness
- [ ] ID/slug identificado
- [ ] Diagnóstico importado de `diagnosticos-nutri.ts`
- [ ] Landing page criada (Etapa 0)
- [ ] Formulário/perguntas implementadas
- [ ] Resultado visual (se aplicável)
- [ ] Diagnósticos completos renderizados
- [ ] Provocações estratégicas integradas
- [ ] Navegação entre etapas funcionando
- [ ] Testado no preview da área demo
- [ ] Ajustado para realidade Wellness (se necessário)

---

## 📌 NOTAS IMPORTANTES

1. **Diagnósticos**: Os diagnósticos da área Nutri podem ser usados diretamente, mas idealmente devem ser adaptados para a realidade dos distribuidores Wellness (linguagem mais acessível, foco em produtos Herbalife).

2. **Provocações**: Sempre integrar provocações estratégicas que direcionem para contato com distribuidor Herbalife, especialmente em Checklists e Quizzes.

3. **Estrutura**: Manter a mesma estrutura de preview da área Nutri para consistência e facilidade de manutenção.

4. **Prioridade**: Começar pelas Calculadoras (já parcialmente implementadas), depois Checklists (já implementados), depois Quizzes e por fim Diagnósticos.

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Checklists** - Já implementados com provocações
2. ⏳ **Calculadoras** - Parcialmente implementadas, precisa ajustar diagnósticos
3. ⏳ **Quizzes** - Pendente implementação completa
4. ⏳ **Conteúdo Educativo** - Pendente
5. ⏳ **Diagnósticos Específicos** - Pendente

---

**Última atualização**: 2024-12-19
**Status**: Em progresso (2/38 templates implementados completamente)

