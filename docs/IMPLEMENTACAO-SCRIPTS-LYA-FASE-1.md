# ✅ IMPLEMENTAÇÃO: Scripts LYA por Fase - FASE 1

**Data:** Hoje  
**Status:** ✅ **CONCLUÍDO**  
**Prioridade:** 🔴 ALTA

---

## 🎯 O QUE FOI IMPLEMENTADO

### **1. Arquivo de Prompts por Fase** ✅
**Arquivo:** `src/lib/nutri/lya-prompts.ts`

**Conteúdo:**
- ✅ Configuração completa para Fase 1, 2 e 3
- ✅ Tom de voz específico por fase
- ✅ Mensagens base por fase (onboarding, transições, etc.)
- ✅ Regras específicas por fase
- ✅ Funções helper para acessar configurações

**Estrutura:**
```typescript
- LYA_PROMPTS_BY_PHASE: Configuração completa por fase
- getLyaPhase(): Determina fase baseado no dia
- getLyaConfig(): Retorna configuração da fase
- getLyaTone(): Retorna tom de voz da fase
- getLyaRules(): Retorna regras da fase
```

---

### **2. Integração na API da LYA** ✅
**Arquivo:** `src/app/api/nutri/lya/analise/route.ts`

**Modificações:**
- ✅ Importação dos prompts por fase
- ✅ Determinação automática da fase atual
- ✅ Integração do tom de voz da fase no systemPrompt
- ✅ Integração das regras da fase no systemPrompt
- ✅ Mantém formato fixo de resposta (4 blocos)

**Como funciona:**
1. API determina fase baseado em `current_day`
2. Busca configuração da fase (tom + regras)
3. Injeta no systemPrompt da LYA
4. LYA responde com tom e regras da fase atual

---

## 📋 ESTRUTURA DOS PROMPTS

### **FASE 1: Fundamentos (Dias 1-7)**
- **Tom:** Calmo, firme, estratégico, acolhedor
- **Foco:** Clareza, postura, estrutura mínima
- **Mensagens:** onboarding, postDiagnostico, homeDia1, bloqueioChat, etc.

### **FASE 2: Captação & Posicionamento (Dias 8-15)**
- **Tom:** Mais direta, mais prática, ainda protetora
- **Foco:** Posicionamento, captação, comunicação
- **Mensagens:** transicao, posicionamento, introducaoCaptacao, etc.

### **FASE 3: Gestão & Escala (Dias 16-30)**
- **Tom:** Mais estratégica, mais firme, extremamente prática
- **Foco:** Organização, gestão, escala sustentável
- **Mensagens:** transicao, introducaoGSAL, rotinaSemanal, etc.

---

## 🔄 COMO FUNCIONA NA PRÁTICA

### **Exemplo: Nutri no Dia 5 (Fase 1)**
1. Sistema detecta: `current_day = 5` → Fase 1
2. Busca configuração Fase 1:
   - Tom: "calmo, firme, estratégico, acolhedor"
   - Regras: "A LYA não entrega tudo de uma vez", etc.
3. Injeta no systemPrompt
4. LYA responde com tom da Fase 1

### **Exemplo: Nutri no Dia 10 (Fase 2)**
1. Sistema detecta: `current_day = 10` → Fase 2
2. Busca configuração Fase 2:
   - Tom: "mais direta, mais prática, ainda protetora"
   - Regras: "A LYA não acelera artificialmente", etc.
3. Injeta no systemPrompt
4. LYA responde com tom da Fase 2

---

## ✅ BENEFÍCIOS

1. **Tom Adaptativo:** LYA fala diferente conforme fase
2. **Regras Contextuais:** Regras específicas por fase
3. **Mensagens Base:** Textos prontos para usar quando necessário
4. **Manutenção Fácil:** Tudo centralizado em um arquivo
5. **Escalável:** Fácil adicionar novas fases ou mensagens

---

## 🧪 TESTES NECESSÁRIOS

- [ ] Testar análise LYA na Fase 1 (Dia 1-7)
- [ ] Testar análise LYA na Fase 2 (Dia 8-15)
- [ ] Testar análise LYA na Fase 3 (Dia 16-30)
- [ ] Validar tom de voz está correto por fase
- [ ] Validar regras estão sendo aplicadas
- [ ] Validar formato fixo de resposta (4 blocos) mantido

---

## 📝 PRÓXIMOS PASSOS

### **PRIORIDADE 2: Microcopy do Sidebar** (2-3 horas)
- Adicionar tooltips
- Mensagens de bloqueio elegantes
- Indicador de fase

### **PRIORIDADE 3: Dashboard Simplificado** (3-4 horas)
- Criar WelcomeCard
- Lógica condicional na home

---

**Status:** ✅ **IMPLEMENTAÇÃO COMPLETA**  
**Próxima ação:** Testar integração e validar funcionamento



