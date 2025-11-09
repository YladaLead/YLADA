# 🔄 FLUXO: Como Funcionam os Diagnósticos

## ✅ SEU ENTENDIMENTO ESTÁ CORRETO!

Vou explicar visualmente:

---

## 📊 ANTES DA DUPLICAÇÃO

### **BANCO DE DADOS:**
```
templates_nutrition
├── id: xxx
├── name: "Quiz Interativo"
├── profession: "wellness"  ← Só existe em Wellness
├── content: { perguntas, opções... }  ← Estrutura do quiz
└── ...
```

### **CÓDIGO TYPESCRIPT:**
```
src/lib/diagnosticos-nutri.ts
├── quizInterativoDiagnosticos = {
│   nutri: { ... }  ← ✅ JÁ TEM diagnóstico revisado para Nutri!
│   wellness: { ... }
│ }
└── ...
```

**Situação:**
- ❌ Template não existe no banco para Nutri
- ✅ Diagnóstico já existe no código para Nutri

---

## 🔄 DURANTE A DUPLICAÇÃO (Script SQL)

### **O QUE O SCRIPT FAZ:**

```sql
INSERT INTO templates_nutrition (
  name, profession, content, ...
)
SELECT 
  name,
  'nutri' as profession,  ← Muda de 'wellness' para 'nutri'
  content,                 ← Copia estrutura (perguntas, opções)
  ...
FROM templates_nutrition
WHERE profession = 'wellness'
```

**Resultado no BANCO:**
```
templates_nutrition
├── [Wellness] id: xxx, profession: "wellness", name: "Quiz Interativo"
└── [Nutri]    id: yyy, profession: "nutri", name: "Quiz Interativo"  ← NOVO!
```

**O que NÃO muda:**
- ❌ Código TypeScript (diagnosticos-nutri.ts) → **NÃO é alterado**
- ✅ Diagnósticos revisados → **Permanecem intactos**

---

## 🎯 DEPOIS DA DUPLICAÇÃO (Quando Usuário Usa)

### **FLUXO COMPLETO:**

```
1. Usuário acessa área Nutri
   ↓
2. Sistema busca templates do BANCO
   WHERE profession = 'nutri'  ← Agora encontra o template!
   ↓
3. Usuário completa o quiz
   ↓
4. Sistema precisa mostrar diagnóstico
   ↓
5. Chama: getDiagnostico('quiz-interativo', 'nutri', 'metabolismoLento')
   ↓
6. Função busca no CÓDIGO TypeScript:
   diagnosticos-nutri.ts → quizInterativoDiagnosticos.nutri.metabolismoLento
   ↓
7. ✅ RETORNA diagnóstico revisado que já estava no código!
```

---

## ✅ RESUMO VISUAL

```
┌─────────────────────────────────────────────────────────┐
│ BANCO DE DADOS (templates_nutrition)                    │
├─────────────────────────────────────────────────────────┤
│ ANTES:                                                  │
│   - Quiz Interativo (wellness) ✅                       │
│   - Quiz Interativo (nutri)    ❌                      │
│                                                          │
│ DEPOIS (após script SQL):                               │
│   - Quiz Interativo (wellness) ✅                       │
│   - Quiz Interativo (nutri)    ✅ NOVO!                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ CÓDIGO TYPESCRIPT (diagnosticos-nutri.ts)               │
├─────────────────────────────────────────────────────────┤
│ ANTES:                                                  │
│   quizInterativoDiagnosticos = {                        │
│     nutri: { ... } ✅ JÁ REVISADO!                     │
│   }                                                     │
│                                                          │
│ DEPOIS:                                                 │
│   quizInterativoDiagnosticos = {                        │
│     nutri: { ... } ✅ MESMO, NÃO MUDA!                 │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ QUANDO USUÁRIO USA:                                     │
├─────────────────────────────────────────────────────────┤
│ 1. Busca template no BANCO (agora encontra!)           │
│ 2. Busca diagnóstico no CÓDIGO (já existe!)            │
│ 3. ✅ FUNCIONA PERFEITAMENTE!                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RESPOSTA DIRETA

### **Sua pergunta:**
> "vc vai duplicar os templates da area wellness para a nutri, mas na hora de dar o diagnostico vai usar o diagnostico que ja esta na area nutri hoje, mas ainda nao consta no banco"

### **Resposta:**
✅ **SIM, EXATAMENTE ISSO!**

1. ✅ **Duplicamos templates no banco** (Wellness → Nutri)
2. ✅ **Diagnósticos já revisados no código** serão usados automaticamente
3. ✅ **Diagnósticos NÃO estão no banco**, estão no código TypeScript
4. ✅ **Nada será perdido** - diagnósticos revisados continuam funcionando

---

## ⚠️ CASOS ESPECIAIS

### **Template que JÁ TEM diagnóstico Nutri no código:**
- ✅ Funciona automaticamente após duplicar no banco
- ✅ Usa diagnóstico revisado que já existe

### **Template que NÃO TEM diagnóstico Nutri no código:**
- ⚠️ Aparece na área Nutri (template existe no banco)
- ⚠️ Mas não mostra diagnóstico (precisa adicionar no código)
- ✅ Solução: Adicionar versão `nutri: { ... }` em `diagnosticos-nutri.ts`

---

## 🛡️ GARANTIA

**Os diagnósticos revisados que já estão em `diagnosticos-nutri.ts`:**
- ✅ **NÃO serão alterados** pelo script SQL
- ✅ **NÃO serão alterados** ao adicionar novos diagnósticos
- ✅ **Continuarão funcionando** normalmente
- ✅ **Serão usados automaticamente** quando o template for duplicado

**Exemplo:**
- `quizInterativoDiagnosticos.nutri` já existe e está revisado
- Após duplicar template no banco → **será usado automaticamente**
- **Zero trabalho adicional necessário!**

