# 📋 PADRÃO COMPLETO - PREVIEW DINÂMICO DE TEMPLATES

## 🎯 OBJETIVO

Este documento estabelece o padrão definitivo para previews dinâmicos de templates, baseado no `content` JSONB do banco de dados. Este padrão será usado para **todos os templates da Wellness** e depois replicado para **todas as outras áreas** (Nutri, etc.).

---

## ✅ PADRÃO ESTABELECIDO

### **1. Estrutura do Preview**

#### **Etapa 0: Landing Page (Introdução)**
- **Uma única introdução assertiva e explicativa**
- **Sem repetições** de títulos ou descrições
- **Sem botões duplicados** ("Começar Agora - É Grátis")
- **Título do preview** no cabeçalho do modal
- **Conteúdo da introdução** dentro do card branco

#### **Etapa 1+: Perguntas do Quiz**
- Perguntas renderizadas sequencialmente
- Opções de múltipla escolha
- Barra de progresso mostrando etapa atual
- Navegação: Anterior / Próxima

#### **Etapa Final: Resultado + Diagnóstico**
- Exibição do resultado baseado nas respostas
- Diagnóstico completo (buscado dos arquivos TypeScript)
- Botão "Fechar" para retornar à lista

---

## 📐 ESTRUTURA DO CONTENT JSONB

### **Para QUIZ:**
```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "questions": [
    {
      "id": 1,
      "question": "Como é seu nível de energia ao longo do dia?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "(A) Vivo cansado, mesmo dormindo bem"},
        {"id": "b", "label": "(B) Tenho altos e baixos"},
        {"id": "c", "label": "(C) Energia constante o dia inteiro"}
      ]
    }
  ]
}
```

### **Para CALCULADORA:**
```json
{
  "template_type": "calculator",
  "profession": "wellness",
  "fields": [
    {"id": "peso", "label": "Peso (kg)", "type": "number"},
    {"id": "altura", "label": "Altura (cm)", "type": "number"}
  ]
}
```

### **Para PLANILHA:**
```json
{
  "template_type": "spreadsheet",
  "profession": "wellness",
  "sections": [
    {"id": "cafe", "title": "Café da Manhã"},
    {"id": "almoco", "title": "Almoço"}
  ]
}
```

---

## 🎨 PADRÃO DE INTRODUÇÃO (Etapa 0)

### **Estrutura da Landing Page:**

```tsx
{etapaAtual === 0 && (
  <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-lg">
    <h4 className="text-xl font-bold text-gray-900 mb-2">
      {intro.titulo}
    </h4>
    {intro.descricao && (
      <p className="text-gray-700 mb-3">{intro.descricao}</p>
    )}
    <p className="text-purple-600 font-semibold">
      {intro.mensagem}
    </p>
  </div>
)}
```

### **Exemplos de Introduções:**

#### **Quiz Interativo:**
- **Título do Preview:** `🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"`
- **Título da Introdução:** `🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos`
- **Descrição:** `Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.`
- **Mensagem:** `🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.`

#### **Quiz Bem-Estar:**
- **Título do Preview:** `🧘‍♀️ Preview do Quiz Bem-Estar - "Descubra seu Perfil de Bem-Estar"`
- **Título da Introdução:** `🧘‍♀️ Qual é seu perfil predominante?`
- **Descrição:** `Estético, Equilibrado ou Saúde/Performance — descubra em 1 minuto.`
- **Mensagem:** `🚀 Uma avaliação que pode transformar sua relação com o bem-estar.`

---

## 🔧 IMPLEMENTAÇÃO NO CÓDIGO

### **1. Componente: `DynamicTemplatePreview.tsx`**

#### **Função `getPreviewTitle()`:**
```tsx
const getPreviewTitle = () => {
  const slug = (template.slug || template.id || '').toLowerCase()
  if (slug.includes('quiz-interativo') || slug.includes('interativo')) {
    return '🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"'
  }
  if (slug.includes('quiz-bem-estar') || slug.includes('bem-estar')) {
    return '🧘‍♀️ Preview do Quiz Bem-Estar - "Descubra seu Perfil de Bem-Estar"'
  }
  return `🎯 Preview do Quiz - "${nome}"`
}
```

#### **Função `getIntroContent()`:**
```tsx
const getIntroContent = () => {
  const slug = (template.slug || template.id || '').toLowerCase()
  if (slug.includes('quiz-interativo') || slug.includes('interativo')) {
    return {
      titulo: '🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos',
      descricao: 'Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.',
      mensagem: '🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.'
    }
  }
  // ... outros templates
  // Fallback genérico
  return {
    titulo: descricao ? descricao.split('.')[0] : nome,
    descricao: descricao || '',
    mensagem: '🚀 Uma avaliação que pode transformar sua relação com o bem-estar.'
  }
}
```

### **2. Página de Templates: `src/app/pt/wellness/templates/page.tsx`**

#### **Verificação para não mostrar fallback genérico:**
```tsx
// Verificar se o template tem content e vai usar DynamicTemplatePreview
// Se sim, não mostrar o fallback genérico
const templatesComPreviewCustomizado = [
  'quiz-bem-estar',
  'quiz-perfil-nutricional',
  // ... outros templates com preview customizado
]

const temPreviewCustomizado = templatesComPreviewCustomizado.some(id => 
  templateIdLower.includes(id) || templateIdLower === id
)

// Se tem content e não tem preview customizado, vai usar DynamicTemplatePreview
// Não mostrar o fallback genérico
if (template.content && !temPreviewCustomizado) {
  return null
}
```

---

## 📝 PROCESSO PASSO A PASSO - MIGRAÇÃO DE TEMPLATES

### **FASE 1: Preparação (1 template por vez)**

1. **Identificar o template a migrar**
   - Verificar se já tem `content` JSONB no banco
   - Verificar se tem preview customizado
   - Verificar se tem diagnóstico em TypeScript

2. **Criar/Atualizar `content` JSONB**
   - Criar script SQL para adicionar/atualizar `content`
   - Incluir todas as perguntas com opções completas
   - Definir `"profession": "wellness"` no content

3. **Adicionar introdução no código**
   - Adicionar caso específico em `getPreviewTitle()`
   - Adicionar caso específico em `getIntroContent()`
   - Testar visualmente

4. **Executar SQL no Supabase**
   - Copiar script SQL
   - Executar no Supabase SQL Editor
   - Verificar resultado com query de validação

5. **Testar no localhost**
   - Abrir preview do template
   - Verificar introdução (etapa 0)
   - Verificar perguntas (etapa 1+)
   - Verificar diagnóstico (etapa final)

---

### **FASE 2: Execução (2 templates por vez)**

#### **Passo 1: Preparar Scripts SQL**
- Criar script SQL para **Template 1**
- Criar script SQL para **Template 2**
- Incluir queries de validação em cada script

#### **Passo 2: Adicionar Introduções no Código**
- Adicionar casos em `getPreviewTitle()` para ambos
- Adicionar casos em `getIntroContent()` para ambos
- Testar sintaxe (sem executar SQL ainda)

#### **Passo 3: Executar SQL no Supabase**
- Executar script do **Template 1**
- Verificar resultado
- Executar script do **Template 2**
- Verificar resultado

#### **Passo 4: Testar no Localhost**
- Testar **Template 1** completo
- Testar **Template 2** completo
- Verificar se não quebrou outros templates

#### **Passo 5: Documentar Progresso**
- Atualizar `docs/PROGRESSO-MIGRACAO-PREVIEW-WELLNESS.md`
- Marcar templates como concluídos
- Anotar qualquer ajuste necessário

---

## 📊 TEMPLATES PRIORITÁRIOS - WELLNESS

### **Quizzes (Prioridade Alta):**
1. ✅ **Quiz Interativo** - CONCLUÍDO
2. ✅ **Quiz Bem-Estar** - CONCLUÍDO
3. ⏳ **Quiz Perfil Nutricional** - Próximo
4. ⏳ **Quiz Detox** - Próximo
5. ⏳ **Quiz Energético** - Em seguida
6. ⏳ **Quiz Emocional** - Em seguida
7. ⏳ **Quiz Intolerância** - Em seguida
8. ⏳ **Quiz Perfil Metabólico** - Em seguida
9. ⏳ **Quiz Avaliação Inicial** - Em seguida
10. ⏳ **Quiz Eletrólitos** - Em seguida
11. ⏳ **Quiz Sintomas Intestinais** - Em seguida
12. ⏳ **Quiz Pronto para Emagrecer** - Em seguida
13. ⏳ **Quiz Tipo de Fome** - Em seguida
14. ⏳ **Quiz Alimentação Saudável** - Em seguida
15. ⏳ **Quiz Síndrome Metabólica** - Em seguida
16. ⏳ **Quiz Retenção de Líquidos** - Em seguida
17. ⏳ **Quiz Conhece Seu Corpo** - Em seguida
18. ⏳ **Quiz Nutrido vs Alimentado** - Em seguida
19. ⏳ **Quiz Alimentação Rotina** - Em seguida
20. ⏳ **Quiz Ganhos e Prosperidade** - Em seguida
21. ⏳ **Quiz Potencial e Crescimento** - Em seguida
22. ⏳ **Quiz Propósito e Equilíbrio** - Em seguida

### **Calculadoras (Prioridade Média):**
- Calculadora de IMC
- Calculadora de Proteína
- Calculadora de Água
- Calculadora de Calorias

### **Planilhas (Prioridade Baixa):**
- Checklist Detox
- Checklist Alimentar
- Outras planilhas

---

## 🎯 REGRAS DE OURO

### **1. Sempre seguir o padrão:**
- ✅ Uma única introdução (etapa 0)
- ✅ Sem repetições de títulos
- ✅ Sem botões duplicados
- ✅ Introdução assertiva e explicativa

### **2. Sempre testar:**
- ✅ SQL no Supabase antes de testar no código
- ✅ Preview completo no localhost
- ✅ Verificar se não quebrou outros templates

### **3. Sempre documentar:**
- ✅ Atualizar progresso após cada migração
- ✅ Anotar ajustes necessários
- ✅ Manter scripts SQL organizados

---

## 📁 ESTRUTURA DE ARQUIVOS

```
scripts/
  ├── criar-content-quiz-interativo-wellness.sql ✅
  ├── criar-content-quiz-bem-estar-wellness.sql ✅
  ├── criar-content-quiz-perfil-nutricional-wellness.sql ⏳
  ├── criar-content-quiz-detox-wellness.sql ⏳
  └── ...

docs/
  ├── PADRAO-COMPLETO-PREVIEW-DINAMICO.md (este arquivo)
  ├── PROGRESSO-MIGRACAO-PREVIEW-WELLNESS.md
  └── ...

src/
  ├── components/
  │   └── shared/
  │       └── DynamicTemplatePreview.tsx
  └── app/
      └── pt/
          └── wellness/
              └── templates/
                  └── page.tsx
```

---

## 🔄 PRÓXIMOS PASSOS

1. **Revisar este documento** com a equipe
2. **Escolher os próximos 2 templates** para migração
3. **Seguir o processo passo a passo** documentado acima
4. **Atualizar progresso** após cada migração
5. **Replicar padrão** para outras áreas (Nutri, etc.) quando concluir Wellness

---

## ✅ CHECKLIST PARA CADA MIGRAÇÃO

- [ ] Script SQL criado com `content` completo
- [ ] Introdução adicionada em `getPreviewTitle()`
- [ ] Introdução adicionada em `getIntroContent()`
- [ ] SQL executado no Supabase
- [ ] Query de validação executada
- [ ] Preview testado no localhost (etapa 0)
- [ ] Preview testado no localhost (perguntas)
- [ ] Preview testado no localhost (diagnóstico)
- [ ] Verificado que não quebrou outros templates
- [ ] Progresso documentado

---

**Última atualização:** 2024-12-19  
**Status:** Padrão estabelecido e pronto para uso  
**Templates concluídos:** 2/37 (Quiz Interativo, Quiz Bem-Estar)

