# ✅ RESUMO: Migração Calculadoras Hidratação e Calorias - Preview Dinâmico

## 📋 O QUE FOI FEITO

### 1. **Scripts SQL criados**
- ✅ `scripts/criar-content-calculadora-hidratacao-wellness.sql`
  - Adiciona campos completos ao `content` JSONB da Calculadora de Hidratação
  - Campos: peso, altura, atividade física, condições climáticas (opcional)
  - Fórmula: `baseWater (35ml/kg) + activityAdjustment + climateAdjustment`
  - Categorias: Baixa Hidratação, Hidratação Moderada, Alta Hidratação

- ✅ `scripts/criar-content-calculadora-calorias-wellness.sql`
  - Adiciona campos completos ao `content` JSONB da Calculadora de Calorias
  - Campos: peso, altura, idade, sexo, atividade física, objetivo
  - Fórmula: `TMB (Harris-Benedict ou Mifflin-St Jeor) * Fator de Atividade + Ajuste por Objetivo`
  - Categorias: Déficit Calórico, Manutenção Calórica, Superávit Calórico

### 2. **DynamicTemplatePreview atualizado**
- ✅ Adicionadas funções `getCalculadoraTitle()` e `getCalculadoraIntro()` para Hidratação e Calorias
- ✅ Implementada tela de abertura (etapa 0) com landing page para ambas as calculadoras
- ✅ Seção "O que você vai descobrir" implementada para ambas as calculadoras
- ✅ Cores específicas:
  - Hidratação: cyan/blue (`from-cyan-50 to-blue-50`)
  - Calorias: orange/red (`from-orange-50 to-red-50`)
- ✅ Botão "Iniciar Cálculo" na landing page
- ✅ Botões "Reiniciar Preview" e "Fechar" no resultado

### 3. **Introduções personalizadas**

#### **Calculadora de Hidratação:**
- Título: "💧 Calcule sua Necessidade de Hidratação Diária"
- Descrição: "Descubra quantos litros de água você precisa por dia baseado no seu peso, atividade física e condições climáticas."
- Benefícios:
  - Sua necessidade hídrica diária personalizada
  - Distribuição ideal ao longo do dia
  - Estratégias para manter-se hidratado
  - Otimização para performance e bem-estar

#### **Calculadora de Calorias:**
- Título: "🔥 Calcule suas Necessidades Calóricas Diárias"
- Descrição: "Descubra quantas calorias você precisa por dia baseado no seu peso, altura, idade, atividade física e objetivo."
- Benefícios:
  - Suas necessidades calóricas diárias personalizadas
  - Distribuição ideal de macronutrientes
  - Estratégias para alcançar seu objetivo (perder, manter ou ganhar peso)
  - Plano personalizado baseado no seu perfil

---

## 🚀 PRÓXIMOS PASSOS

### **1. Executar SQL no Supabase:**
```sql
-- Executar: scripts/criar-content-calculadora-hidratacao-wellness.sql
-- Executar: scripts/criar-content-calculadora-calorias-wellness.sql
```

### **2. Verificar se funcionou:**
- Abrir área Wellness → Templates
- Clicar em "Calculadora de Hidratação"
- Verificar se:
  - ✅ Preview inicia com landing page (etapa 0)
  - ✅ Seção "O que você vai descobrir" aparece
  - ✅ Botão "Iniciar Cálculo" funciona
  - ✅ Formulário aparece após clicar em "Iniciar Cálculo"
  - ✅ Resultado aparece após preencher todos os campos

- Repetir para "Calculadora de Calorias"

---

## 📝 NOTAS

- As calculadoras agora seguem o mesmo padrão dos quizzes: **Landing Page (etapa 0) → Formulário (etapa 1) → Resultado**
- Os diagnósticos são buscados de `src/lib/diagnostics/wellness/calculadora-agua.ts` e `calculadora-calorias.ts`
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


