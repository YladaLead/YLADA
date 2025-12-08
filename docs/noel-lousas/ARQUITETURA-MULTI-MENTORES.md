# 🏗️ ARQUITETURA MULTI-MENTORES — SEPARAÇÃO E NOMENCLATURA

**Data:** 2025-01-06  
**Objetivo:** Estrutura escalável para múltiplos mentores (Wellness, Nutri, Coach, Ultra)

---

## 🎯 PRINCÍPIO CENTRAL

**Cada mentor = namespace isolado + prefixo único + estrutura própria**

---

## 📁 ESTRUTURA DE PASTAS (Código)

```
src/lib/
├── noel-wellness/              ✅ JÁ EXISTE (NOEL Wellness)
│   ├── persona.ts
│   ├── rules.ts
│   ├── script-engine.ts
│   └── ...
│
├── noel-nutri/                  🔜 CRIAR (NOEL Nutri)
│   ├── persona.ts
│   ├── rules.ts
│   ├── script-engine.ts
│   └── ...
│
├── noel-coach/                  🔜 CRIAR (NOEL Coach)
│   ├── persona.ts
│   ├── rules.ts
│   ├── script-engine.ts
│   └── ...
│
└── noel-ultra/                  🔜 CRIAR (NOEL Ultra)
    ├── persona.ts
    ├── rules.ts
    ├── script-engine.ts
    └── ...
```

---

## 🗄️ ESTRUTURA DE BANCO DE DADOS (Tabelas)

### **Opção 1: Tabelas Separadas (RECOMENDADO)**

```sql
-- WELLNESS
ylada_wellness_base_conhecimento
ylada_wellness_consultores
ylada_wellness_diagnosticos
ylada_wellness_planos
ylada_wellness_objecoes
ylada_wellness_respostas_alternativas
ylada_wellness_interacoes
ylada_wellness_notificacoes

-- NUTRI
ylada_nutri_base_conhecimento
ylada_nutri_consultores
ylada_nutri_diagnosticos
ylada_nutri_planos
ylada_nutri_objecoes
ylada_nutri_respostas_alternativas
ylada_nutri_interacoes
ylada_nutri_notificacoes

-- COACH
ylada_coach_base_conhecimento
ylada_coach_consultores
ylada_coach_diagnosticos
ylada_coach_planos
ylada_coach_objecoes
ylada_coach_respostas_alternativas
ylada_coach_interacoes
ylada_coach_notificacoes

-- ULTRA
ylada_ultra_base_conhecimento
ylada_ultra_consultores
ylada_ultra_diagnosticos
ylada_ultra_planos
ylada_ultra_objecoes
ylada_ultra_respostas_alternativas
ylada_ultra_interacoes
ylada_ultra_notificacoes
```

**Vantagens:**
- ✅ Separação total (zero risco de mistura)
- ✅ Fácil manutenção
- ✅ Escalável
- ✅ Performance (índices por área)

**Desvantagens:**
- ⚠️ Mais tabelas (mas Supabase aguenta tranquilamente)

---

### **Opção 2: Tabela Única com Coluna `area`**

```sql
ylada_mentores_base_conhecimento (
  id, area, categoria, titulo, conteudo, ...
)
-- area: 'wellness' | 'nutri' | 'coach' | 'ultra'

ylada_mentores_objecoes (
  id, area, categoria, objeção, resposta, ...
)
```

**Vantagens:**
- ✅ Menos tabelas
- ✅ Queries unificadas (se necessário)

**Desvantagens:**
- ⚠️ Risco de mistura (precisa sempre filtrar por `area`)
- ⚠️ Índices mais complexos

---

## 🎯 RECOMENDAÇÃO: **OPÇÃO 1 (Tabelas Separadas)**

**Por quê?**
1. Separação total = zero risco
2. Performance melhor (índices específicos)
3. Manutenção mais fácil
4. Escalabilidade garantida
5. Supabase aguenta tranquilamente

---

## 📝 NOMENCLATURA OFICIAL

### **Prefixos de Tabelas:**
- `ylada_wellness_*` → NOEL Wellness
- `ylada_nutri_*` → NOEL Nutri
- `ylada_coach_*` → NOEL Coach
- `ylada_ultra_*` → NOEL Ultra

### **Prefixos de Pastas:**
- `noel-wellness/` → NOEL Wellness
- `noel-nutri/` → NOEL Nutri
- `noel-coach/` → NOEL Coach
- `noel-ultra/` → NOEL Ultra

### **Prefixos de APIs:**
- `/api/wellness/noel/*` → NOEL Wellness
- `/api/nutri/noel/*` → NOEL Nutri
- `/api/coach/noel/*` → NOEL Coach
- `/api/ultra/noel/*` → NOEL Ultra

### **Variáveis de Ambiente:**
```env
# NOEL Wellness
OPENAI_ASSISTANT_NOEL_WELLNESS_MENTOR_ID=asst_xxx
OPENAI_ASSISTANT_NOEL_WELLNESS_SUPORTE_ID=asst_xxx

# NOEL Nutri
OPENAI_ASSISTANT_NOEL_NUTRI_MENTOR_ID=asst_xxx
OPENAI_ASSISTANT_NOEL_NUTRI_SUPORTE_ID=asst_xxx

# NOEL Coach
OPENAI_ASSISTANT_NOEL_COACH_MENTOR_ID=asst_xxx
OPENAI_ASSISTANT_NOEL_COACH_SUPORTE_ID=asst_xxx

# NOEL Ultra
OPENAI_ASSISTANT_NOEL_ULTRA_MENTOR_ID=asst_xxx
OPENAI_ASSISTANT_NOEL_ULTRA_SUPORTE_ID=asst_xxx
```

---

## 🔧 ESTRUTURA DE CÓDIGO (TypeScript)

### **Exemplo: Script Engine por Área**

```typescript
// src/lib/noel-wellness/script-engine.ts
export class WellnessScriptEngine {
  private table = 'ylada_wellness_base_conhecimento'
  // ...
}

// src/lib/noel-nutri/script-engine.ts
export class NutriScriptEngine {
  private table = 'ylada_nutri_base_conhecimento'
  // ...
}

// src/lib/noel-coach/script-engine.ts
export class CoachScriptEngine {
  private table = 'ylada_coach_base_conhecimento'
  // ...
}
```

### **Exemplo: Factory Pattern**

```typescript
// src/lib/mentors/index.ts
export function getMentorEngine(area: 'wellness' | 'nutri' | 'coach' | 'ultra') {
  switch (area) {
    case 'wellness':
      return new WellnessScriptEngine()
    case 'nutri':
      return new NutriScriptEngine()
    case 'coach':
      return new CoachScriptEngine()
    case 'ultra':
      return new UltraScriptEngine()
  }
}
```

---

## 📊 MIGRAÇÃO DO WELLNESS (Ajustar Nomenclatura)

### **Tabelas Existentes → Renomear (se necessário):**

```sql
-- Se já existir sem prefixo, criar novas com prefixo
-- Exemplo:
CREATE TABLE ylada_wellness_base_conhecimento AS 
SELECT * FROM wellness_base_conhecimento WHERE area = 'wellness';

-- Depois migrar dados e remover tabela antiga
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Para Wellness (Já existe, ajustar):**
- [ ] Garantir que todas as tabelas têm prefixo `ylada_wellness_`
- [ ] Garantir que código está em `src/lib/noel-wellness/`
- [ ] Garantir que APIs estão em `/api/wellness/noel/*`

### **Para Nutri (Criar):**
- [ ] Criar tabelas `ylada_nutri_*`
- [ ] Criar pasta `src/lib/noel-nutri/`
- [ ] Criar APIs `/api/nutri/noel/*`
- [ ] Criar seeds `scripts/seed-nutri-*.sql`

### **Para Coach (Criar):**
- [ ] Criar tabelas `ylada_coach_*`
- [ ] Criar pasta `src/lib/noel-coach/`
- [ ] Criar APIs `/api/coach/noel/*`
- [ ] Criar seeds `scripts/seed-coach-*.sql`

### **Para Ultra (Criar):**
- [ ] Criar tabelas `ylada_ultra_*`
- [ ] Criar pasta `src/lib/noel-ultra/`
- [ ] Criar APIs `/api/ultra/noel/*`
- [ ] Criar seeds `scripts/seed-ultra-*.sql`

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **Ajustar Wellness** → Garantir prefixo `ylada_wellness_` em tudo
2. ✅ **Criar estrutura Nutri** → Tabelas + Código + APIs
3. ✅ **Criar estrutura Coach** → Tabelas + Código + APIs
4. ✅ **Criar estrutura Ultra** → Tabelas + Código + APIs

---

## 📝 RESUMO

**Estrutura Escalável:**
- ✅ Cada mentor = namespace isolado
- ✅ Prefixos claros (`ylada_wellness_`, `ylada_nutri_`, etc.)
- ✅ Pastas separadas (`noel-wellness/`, `noel-nutri/`, etc.)
- ✅ APIs separadas (`/api/wellness/noel/*`, `/api/nutri/noel/*`, etc.)
- ✅ Zero risco de mistura
- ✅ Fácil manutenção
- ✅ Escalável para N mentores

**Tamanho do SaaS:**
- ✅ Código organizado = fácil navegação
- ✅ Separação clara = fácil manutenção
- ✅ Não importa quantidade de mentores = estrutura suporta

---

**Posso começar ajustando a nomenclatura do Wellness e criando a estrutura base para os outros mentores?** 🚀

