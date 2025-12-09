# 🔍 Relatório de Investigação: Ferramentas Wellness

## 📋 Objetivo

Investigar todas as ferramentas do Wellness para identificar:
1. **Preview** - Se tem explicação para o dono, diagnóstico e CTA
2. **Link Copiado** - Se NÃO tem explicações para o dono, se tem diagnóstico e CTA
3. **Problemas encontrados** - O que está faltando ou incorreto

---

## 🎯 Critérios de Avaliação

### ✅ Preview (Para o Dono da Ferramenta)
- [ ] **Explicação inicial** para o dono da ferramenta
- [ ] **Mostra o fluxo completo** da ferramenta
- [ ] **Mostra diagnóstico** no final
- [ ] **Mostra botão de chamada para ação** (CTA/WhatsApp)

### ✅ Link Copiado (Para Quem Vai Preencher)
- [ ] **NÃO tem** explicações para o dono da ferramenta
- [ ] **Apenas experiência** de quem está preenchendo
- [ ] **Tem diagnóstico** no final
- [ ] **Tem botão de chamada para ação** (CTA/WhatsApp) sincronizado

---

## 📊 Análise do Código Atual

### 1. Componente Preview (`DynamicTemplatePreview.tsx`)

**Localização:** `src/components/shared/DynamicTemplatePreview.tsx`

#### ✅ O que ESTÁ funcionando:

1. **Explicação para o dono** (linhas 751-758):
   ```tsx
   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
     <p className="text-gray-700 text-sm leading-relaxed">
       <strong>📋 O que acontece na ferramenta real:</strong>
       <br />
       A pessoa que preencher verá o diagnóstico abaixo correspondente às respostas dela.
       <br />
       Em seguida, virá a seguinte mensagem:
     </p>
   </div>
   ```
   ✅ **Status:** Explicação presente

2. **Diagnóstico** (linhas 1522-1532):
   ```tsx
   <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis do Quiz</h4>
   <p className="text-sm text-gray-600">
     Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final...
   </p>
   {renderDiagnosticsCards()}
   ```
   ✅ **Status:** Diagnóstico sendo renderizado

3. **CTA/WhatsApp** (linhas 744-782):
   ```tsx
   const renderCTA = () => {
     // Mensagem explicativa + Botão CTA
   }
   ```
   ✅ **Status:** CTA presente

#### ⚠️ Possíveis Problemas:

- A explicação pode não estar aparecendo em todos os tipos de ferramentas
- O diagnóstico pode não estar sendo encontrado para alguns templates
- O CTA pode não estar sincronizado com WhatsApp em alguns casos

---

### 2. Página Real da Ferramenta (`[tool-slug]/page.tsx`)

**Localização:** `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`

#### 🔍 O que precisa verificar:

1. **Explicações para o dono:**
   - ❓ Verificar se há textos explicativos que não deveriam estar
   - ❓ Verificar se há mensagens como "Esta é uma prévia" ou "Para o dono"

2. **Diagnóstico:**
   - ❓ Verificar se o diagnóstico está sendo exibido após o preenchimento
   - ❓ Verificar se está usando `getDiagnostico()` corretamente

3. **CTA/WhatsApp:**
   - ❓ Verificar se o botão WhatsApp está funcionando
   - ❓ Verificar se está usando `whatsapp_number` e `country_code` corretamente

---

## 📝 Lista de Ferramentas a Investigar

### Calculadoras
1. ✅ Calculadora de Água (`calc-hidratacao`)
2. ✅ Calculadora de IMC (`calc-imc`)
3. ✅ Calculadora de Calorias (`calc-calorias`)
4. ✅ Calculadora de Proteína (`calc-proteina`)

### Quizzes de Recrutamento
5. ✅ Quiz Ganhos e Prosperidade (`quiz-ganhos`)
6. ✅ Quiz Potencial e Crescimento (`quiz-potencial`)
7. ✅ Quiz Propósito e Equilíbrio (`quiz-proposito`)

### Quizzes de Vendas
8. ✅ Quiz Bem-Estar (`quiz-bem-estar`)
9. ✅ Quiz Energético (`quiz-energetico`)
10. ✅ Quiz Detox (`quiz-detox`)
11. ✅ Avaliação de Fome Emocional (`tipo-fome`)
12. ✅ Avaliação de Intolerâncias (`avaliacao-intolerancia`)
13. ✅ Avaliação do Perfil Metabólico (`perfil-metabolico`)
14. ✅ Avaliação Inicial (`avaliacao-inicial`)
15. ✅ Quiz Alimentação Saudável (`alimentacao-saudavel`)
16. ✅ Síndrome Metabólica (`sindrome-metabolica`)
17. ✅ Retenção de Líquidos (`retencao-liquidos`)

### Desafios
18. ✅ Desafio 7 Dias (`desafio-7-dias`)
19. ✅ Desafio 21 Dias (`desafio-21-dias`)

### Outros
20. ✅ Guia de Hidratação (`guia-hidratacao`)
21. ✅ Diagnóstico de Eletrólitos (`diagnostico-eletrolitos`)
22. ✅ Diagnóstico de Sintomas Intestinais (`diagnostico-sintomas-intestinais`)

---

## 🔍 Checklist de Verificação por Ferramenta

Para cada ferramenta, verificar:

### Preview
- [ ] Explicação inicial aparece?
- [ ] Fluxo completo é mostrado?
- [ ] Diagnóstico aparece no final?
- [ ] CTA/WhatsApp aparece?

### Link Copiado (Página Real)
- [ ] NÃO tem explicações para o dono?
- [ ] Apenas experiência de preenchimento?
- [ ] Diagnóstico aparece após preencher?
- [ ] CTA/WhatsApp funciona e está sincronizado?

---

## 🐛 Problemas Identificados (A Serem Verificados)

### Problema 1: Explicações no Link Copiado
**Descrição:** Algumas ferramentas podem estar mostrando explicações para o dono quando o link é acessado.

**Onde verificar:**
- `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`
- Templates individuais em `src/app/pt/wellness/templates/`

**Exemplo de código problemático:**
```tsx
// ❌ ERRADO - Não deve aparecer no link copiado
<div className="bg-blue-50">
  <p>Esta é uma prévia para o dono da ferramenta...</p>
</div>
```

### Problema 2: Diagnóstico Faltando
**Descrição:** Algumas ferramentas podem não estar mostrando diagnóstico no final.

**Onde verificar:**
- Se `getDiagnostico()` está sendo chamado
- Se o diagnóstico existe em `diagnosticos-wellness.ts` ou `diagnosticos-coach.ts`
- Se o `resultadoId` está sendo passado corretamente

### Problema 3: CTA/WhatsApp Não Funcionando
**Descrição:** Botão de WhatsApp pode não estar sincronizado ou funcionando.

**Onde verificar:**
- Se `whatsapp_number` está sendo passado
- Se `country_code` está correto
- Se o componente `WellnessCTAButton` está sendo usado

---

## 📋 Próximos Passos

### Fase 1: Investigação Manual (Este Relatório)
1. ✅ Criar estrutura do relatório
2. ⏳ Verificar cada ferramenta individualmente
3. ⏳ Documentar problemas encontrados
4. ⏳ Criar lista de correções necessárias

### Fase 2: Correções (Após Aprovação)
1. ⏳ Corrigir Preview (garantir explicação + diagnóstico + CTA)
2. ⏳ Corrigir Link Copiado (remover explicações do dono)
3. ⏳ Garantir diagnóstico em todas as ferramentas
4. ⏳ Garantir CTA/WhatsApp funcionando

---

## 🔧 Ferramentas de Investigação

### Script de Verificação (A Ser Criado)
```typescript
// Verificar se template tem diagnóstico
const temDiagnostico = (templateSlug: string) => {
  const diagnostico = getDiagnostico(templateSlug, 'wellness', 'resultado-1')
  return !!diagnostico
}

// Verificar se preview tem explicação
const previewTemExplicacao = (componente: string) => {
  // Verificar se DynamicTemplatePreview está sendo usado
  // Verificar se explicação está presente
}

// Verificar se link copiado NÃO tem explicação
const linkCopiadoSemExplicacao = (componente: string) => {
  // Verificar se não há textos explicativos para o dono
}
```

---

## 📊 Status Atual

**Total de Ferramentas:** ~22 ferramentas identificadas

**Status da Investigação:**
- ⏳ **Aguardando verificação manual de cada ferramenta**
- ⏳ **Aguardando testes de Preview**
- ⏳ **Aguardando testes de Link Copiado**

---

## ✅ Conclusão

Este relatório serve como base para a investigação completa. Cada ferramenta precisa ser verificada individualmente para identificar:

1. ✅ O que está funcionando corretamente
2. ❌ O que está faltando
3. 🔧 O que precisa ser corrigido

**Próximo passo:** Verificar cada ferramenta manualmente e preencher o checklist acima.

---

**Status:** 📋 Relatório criado - Aguardando investigação detalhada de cada ferramenta
