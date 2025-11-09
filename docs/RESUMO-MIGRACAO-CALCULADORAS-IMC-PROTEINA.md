# ✅ RESUMO: Migração Calculadoras IMC e Proteína - Preview Dinâmico

## 📋 O QUE FOI FEITO

### 1. **Scripts SQL criados**
- ✅ `scripts/criar-content-calculadora-imc-wellness.sql`
  - Adiciona campos completos ao `content` JSONB da Calculadora IMC
  - Campos: altura, peso, sexo, atividade física (opcional)
  - Fórmula: `peso / (altura/100)²`
  - Categorias: Baixo Peso, Peso Normal, Sobrepeso, Obesidade

- ✅ `scripts/criar-content-calculadora-proteina-wellness.sql`
  - Adiciona campos completos ao `content` JSONB da Calculadora de Proteína
  - Campos: peso, atividade física, objetivo, idade (opcional)
  - Fórmula: `peso * proteinPerKg` (variável baseado em atividade e objetivo)
  - Categorias: Baixa, Moderada, Adequada, Alta

### 2. **DynamicTemplatePreview atualizado**
- ✅ Adicionadas funções `getCalculadoraTitle()` e `getCalculadoraIntro()` para IMC e Proteína
- ✅ Implementada tela de abertura (etapa 0) com landing page para calculadoras
- ✅ Seção "O que você vai descobrir" implementada para ambas as calculadoras
- ✅ Cores específicas:
  - IMC: azul/indigo (`from-blue-50 to-indigo-50`)
  - Proteína: laranja/âmbar (`from-orange-50 to-amber-50`)
- ✅ Botão "Iniciar Cálculo" na landing page
- ✅ Botões "Reiniciar Preview" e "Fechar" no resultado

### 3. **Introduções personalizadas**

#### **Calculadora IMC:**
- Título: "📊 Calcule seu Índice de Massa Corporal"
- Descrição: "Descubra seu IMC e receba interpretação personalizada com orientações para alcançar seu objetivo de forma saudável."
- Benefícios:
  - Seu IMC atual e interpretação personalizada
  - Categoria de peso (Baixo, Normal, Sobrepeso ou Obesidade)
  - Orientações específicas para seu perfil
  - Plano personalizado para alcançar seu objetivo

#### **Calculadora de Proteína:**
- Título: "🥩 Calcule sua Necessidade Proteica Diária"
- Descrição: "Descubra quantas gramas de proteína você precisa por dia baseado no seu peso, atividade física e objetivo."
- Benefícios:
  - Sua necessidade proteica diária personalizada
  - Distribuição ideal ao longo do dia
  - Fontes de proteína adequadas ao seu perfil
  - Estratégias para alcançar sua meta proteica

---

## 🚀 PRÓXIMOS PASSOS

### **1. Executar SQL no Supabase:**
```sql
-- Executar: scripts/criar-content-calculadora-imc-wellness.sql
-- Executar: scripts/criar-content-calculadora-proteina-wellness.sql
```

### **2. Verificar se funcionou:**
- Abrir área Wellness → Templates
- Clicar em "Calculadora de IMC"
- Verificar se:
  - ✅ Preview inicia com landing page (etapa 0)
  - ✅ Seção "O que você vai descobrir" aparece
  - ✅ Botão "Iniciar Cálculo" funciona
  - ✅ Formulário aparece após clicar em "Iniciar Cálculo"
  - ✅ Resultado aparece após preencher todos os campos

- Repetir para "Calculadora de Proteína"

---

## 📝 NOTAS

- As calculadoras agora seguem o mesmo padrão dos quizzes: **Landing Page (etapa 0) → Formulário (etapa 1) → Resultado**
- Os diagnósticos são buscados de `src/lib/diagnostics/wellness/calculadora-imc.ts` e `calculadora-proteina.ts`
- O `content` JSONB no banco contém os campos completos para renderização dinâmica

---

## ✅ STATUS

- [x] Scripts SQL criados
- [x] DynamicTemplatePreview atualizado
- [x] Introduções e seção "O que você vai descobrir" implementadas
- [ ] SQL executado no Supabase
- [ ] Testado e validado

---

**Última atualização:** 2025-01-XX


