# 📋 PLANEJAMENTO DE IMPLEMENTAÇÃO - NOEL VENDEDOR
## Baseado na Lousa Oficial v1.0

**Data:** 2025-01-27  
**Status:** 🟡 Planejamento (Aguardando Aprovação)  
**Versão da Lousa:** 1.0

---

## 🎯 OBJETIVO

Transformar o NOEL Sales Support atual em **NOEL Vendedor** completo, seguindo rigorosamente a Lousa Oficial, com:
- 3 modos de atuação automáticos
- Estrutura de resposta obrigatória (4 etapas)
- Personalidade YLADA definida
- Scripts de conversão prontos
- Few-shots para treinamento

---

## 📊 ANÁLISE COMPARATIVA: ATUAL vs. LOUSA OFICIAL

### ❌ O QUE ESTÁ FALTANDO NO SISTEMA ATUAL

| Aspecto | Sistema Atual | Lousa Oficial | Gap |
|---------|---------------|---------------|-----|
| **Modos de Atuação** | Apenas "sales-support" genérico | 3 modos: Vendedor, Suporte Leve, Comercial Curto | ⚠️ Falta detecção automática de modo |
| **Estrutura de Resposta** | Livre | Obrigatória: Acolhimento → Clareza → Benefício → CTA | ⚠️ Não há estrutura forçada |
| **Personalidade** | "Amigável, mas profissional" | Acolhedor, calmo, simples, humano, empático | ⚠️ Muito genérico |
| **Few-Shots** | Não há | 15 exemplos oficiais | ⚠️ Sem exemplos de treinamento |
| **Scripts de Conversão** | Não há | 12 scripts prontos | ⚠️ Sem scripts estruturados |
| **CTAs Oficiais** | Genérico | 7 categorias de CTAs definidos | ⚠️ Sem CTAs padronizados |
| **Proibições** | Básicas | 10 proibições detalhadas | ⚠️ Cobertura incompleta |
| **FAQ Modelado** | Não há | 13 respostas oficiais | ⚠️ Sem base de conhecimento estruturada |

### ✅ O QUE JÁ EXISTE E PODE SER REUTILIZADO

1. ✅ API `/api/wellness/noel/sales-support` (estrutura base)
2. ✅ Sistema de detecção de "não soube responder"
3. ✅ Salvamento de interações no banco
4. ✅ Notificação ao admin
5. ✅ Componente `SalesSupportChat.tsx`
6. ✅ Tabela `noel_sales_support_interactions`

---

## 🏗️ ESTRUTURA DE IMPLEMENTAÇÃO

### FASE 1: REFATORAÇÃO DO SYSTEM PROMPT

**Arquivo:** `/src/app/api/wellness/noel/sales-support/route.ts`

**Ações:**
1. Substituir `SALES_SUPPORT_SYSTEM_PROMPT` atual pelo prompt completo da Lousa
2. Implementar detecção automática de modo (Vendedor / Suporte Leve / Comercial Curto)
3. Adicionar estrutura de resposta obrigatória (4 etapas)
4. Incluir personalidade YLADA definida
5. Adicionar proibições detalhadas

**Complexidade:** 🟡 Média  
**Tempo estimado:** 2-3 horas

---

### FASE 2: DETECÇÃO AUTOMÁTICA DE MODO

**Arquivo:** `/src/lib/noel-vendedor/mode-detector.ts` (novo)

**Função:**
Detectar automaticamente qual modo o NOEL deve usar baseado na mensagem do usuário.

**Lógica:**

```typescript
function detectMode(message: string, context: string): 'vendedor' | 'suporte-leve' | 'comercial-curto' {
  // Modo Suporte Leve
  if (message.includes('não recebi') || message.includes('não consigo entrar') || ...) {
    return 'suporte-leve'
  }
  
  // Modo Comercial Curto (WhatsApp)
  if (context === 'whatsapp' || message.length < 50 || message.includes('rapidinho')) {
    return 'comercial-curto'
  }
  
  // Modo Vendedor (padrão)
  return 'vendedor'
}
```

**Complexidade:** 🟢 Baixa  
**Tempo estimado:** 1-2 horas

---

### FASE 3: ESTRUTURA DE RESPOSTA OBRIGATÓRIA

**Arquivo:** `/src/lib/noel-vendedor/response-builder.ts` (novo)

**Função:**
Garantir que TODA resposta siga: Acolhimento → Clareza → Benefício → CTA

**Abordagem:**
1. **Opção A (Recomendada):** Prompt engineering com instruções explícitas
2. **Opção B:** Pós-processamento para validar estrutura (mais complexo)

**Implementação sugerida:**
```typescript
const STRUCTURED_PROMPT = `
Sua resposta DEVE seguir EXATAMENTE esta estrutura:

1. ACOLHIMENTO (1 frase curta):
   "Entendi sua dúvida, isso é super comum."

2. CLAREZA SIMPLES (2-3 frases):
   "O Wellness System funciona assim..."

3. BENEFÍCIO PRÁTICO (1-2 frases):
   "Isso te dá mais foco e direção..."

4. PRÓXIMO PASSO (CTA suave):
   "Quer que eu te mostre como começar?"

NUNCA pule etapas. Sempre siga esta ordem.
`
```

**Complexidade:** 🟡 Média  
**Tempo estimado:** 2-3 horas

---

### FASE 4: BASE DE CONHECIMENTO (FAQ + SCRIPTS)

**Arquivo:** `/src/lib/noel-vendedor/knowledge-base.ts` (novo)

**Conteúdo:**
1. **13 FAQs Modelados** (Seção 6 da Lousa)
2. **12 Scripts de Conversão** (Seção 7 da Lousa)
3. **7 Categorias de CTAs** (Seção 9 da Lousa)

**Estrutura:**
```typescript
export const NOEL_KNOWLEDGE_BASE = {
  faqs: {
    'o-que-e-wellness': {
      acolhimento: "...",
      clareza: "...",
      beneficio: "...",
      proximoPasso: "..."
    },
    // ... 12 mais
  },
  scripts: {
    'primeiro-contato': "...",
    'explicacao-rapida': "...",
    // ... 10 mais
  },
  ctas: {
    gerais: [...],
    decisao: [...],
    whatsapp: [...],
    // ...
  }
}
```

**Complexidade:** 🟢 Baixa (apenas dados)  
**Tempo estimado:** 1-2 horas

---

### FASE 5: FEW-SHOTS PARA TREINAMENTO

**Arquivo:** `/src/lib/noel-vendedor/few-shots.ts` (novo)

**Conteúdo:**
15 exemplos oficiais da Seção 11 da Lousa

**Uso:**
- Incluir no histórico de mensagens como exemplos
- Usar para fine-tuning (futuro)
- Referência para validação

**Complexidade:** 🟢 Baixa  
**Tempo estimado:** 30 minutos

---

### FASE 6: VALIDAÇÃO E PÓS-PROCESSAMENTO

**Arquivo:** `/src/lib/noel-vendedor/response-validator.ts` (novo)

**Função:**
Validar se a resposta do NOEL segue:
1. Estrutura obrigatória (4 etapas)
2. Tom acolhedor
3. Sem proibições
4. CTA presente

**Ações:**
- Se não seguir estrutura → re-gerar com instruções mais explícitas
- Se violar proibições → filtrar e substituir
- Se não tiver CTA → adicionar CTA padrão

**Complexidade:** 🔴 Alta  
**Tempo estimado:** 4-5 horas

---

### FASE 7: INTEGRAÇÃO COM WHATSAPP (Futuro)

**Arquivo:** `/src/app/api/whatsapp/noel-vendedor/route.ts` (novo)

**Funcionalidade:**
- Detectar automaticamente modo "Comercial Curto"
- Respostas mais curtas e diretas
- Scripts específicos para WhatsApp

**Complexidade:** 🔴 Alta  
**Tempo estimado:** 6-8 horas  
**Status:** ⏸️ Futuro (não prioritário agora)

---

## 📁 ESTRUTURA DE ARQUIVOS PROPOSTA

```
src/
├── app/
│   └── api/
│       └── wellness/
│           └── noel/
│               └── sales-support/
│                   └── route.ts (REFATORAR)
│
├── lib/
│   └── noel-vendedor/ (NOVO)
│       ├── system-prompt.ts (Prompt completo da Lousa)
│       ├── mode-detector.ts (Detecção automática de modo)
│       ├── response-builder.ts (Estrutura obrigatória)
│       ├── knowledge-base.ts (FAQs + Scripts + CTAs)
│       ├── few-shots.ts (Exemplos de treinamento)
│       ├── response-validator.ts (Validação pós-resposta)
│       └── constants.ts (Constantes: proibições, personalidade, etc.)
│
└── components/
    └── wellness/
        └── SalesSupportChat.tsx (Pode manter ou ajustar)
```

---

## 🔄 FLUXO DE FUNCIONAMENTO PROPOSTO

```
1. Usuário envia mensagem
   ↓
2. Mode Detector identifica modo (Vendedor / Suporte Leve / Comercial Curto)
   ↓
3. System Prompt é montado com:
   - Identidade NOEL Vendedor
   - Modo detectado
   - Estrutura obrigatória
   - Proibições
   - Few-shots relevantes
   ↓
4. OpenAI gera resposta
   ↓
5. Response Validator verifica:
   - Estrutura (4 etapas)
   - Tom acolhedor
   - Sem proibições
   - CTA presente
   ↓
6. Se válida → retorna resposta
   Se inválida → re-gera com instruções mais explícitas
   ↓
7. Salva interação no banco
   ↓
8. Se não soube responder → notifica admin
```

---

## 📝 PROMPT COMPLETO PROPOSTO

### Estrutura do System Prompt:

```
1. IDENTIDADE DO NOEL VENDEDOR
   - Personalidade (acolhedor, calmo, simples, humano)
   - Filosofia YLADA
   - Tom de voz

2. MODOS DE ATUAÇÃO
   - Modo Vendedor (padrão)
   - Modo Suporte Leve (pós-compra)
   - Modo Comercial Curto (WhatsApp)

3. ESTRUTURA DE RESPOSTA OBRIGATÓRIA
   - Acolhimento
   - Clareza Simples
   - Benefício Prático
   - Próximo Passo (CTA)

4. REGRAS DE COMUNICAÇÃO
   - 10 regras principais

5. PROIBIÇÕES E LIMITES
   - 10 proibições não negociáveis

6. BASE DE CONHECIMENTO
   - 13 FAQs modelados
   - 12 Scripts de conversão
   - 7 Categorias de CTAs

7. FEW-SHOTS
   - 15 exemplos oficiais

8. SUPORTE LEVE
   - Regras específicas
   - Encaminhamento
```

**Tamanho estimado:** ~8.000-10.000 tokens

---

## ⚙️ CONFIGURAÇÕES OPENAI PROPOSTAS

```typescript
{
  model: 'gpt-4o-mini', // Manter (custo-benefício)
  temperature: 0.7, // Manter (criatividade controlada)
  max_tokens: 300, // Reduzir (respostas mais curtas)
  top_p: 0.9,
  frequency_penalty: 0.3, // Evitar repetição
  presence_penalty: 0.3 // Incentivar criatividade controlada
}
```

---

## 🧪 TESTES NECESSÁRIOS

### Testes Unitários:
1. ✅ Mode Detector (detecta corretamente os 3 modos)
2. ✅ Response Validator (valida estrutura de 4 etapas)
3. ✅ Proibições (bloqueia termos técnicos)

### Testes de Integração:
1. ✅ Fluxo completo: mensagem → modo → resposta → validação
2. ✅ Few-shots aplicados corretamente
3. ✅ CTAs presentes em todas as respostas

### Testes Manuais:
1. ✅ 13 FAQs testados individualmente
2. ✅ 12 Scripts testados em contexto
3. ✅ Modo Suporte Leve ativado corretamente
4. ✅ Proibições respeitadas

---

## 📊 MÉTRICAS DE SUCESSO

### Antes da Implementação:
- [ ] Medir taxa de conversão atual
- [ ] Medir taxa de "não soube responder"
- [ ] Analisar interações salvas

### Após Implementação:
- [ ] Taxa de conversão aumentou?
- [ ] Respostas seguem estrutura obrigatória? (meta: 95%+)
- [ ] Proibições respeitadas? (meta: 100%)
- [ ] CTAs presentes? (meta: 100%)
- [ ] Tom acolhedor mantido? (análise qualitativa)

---

## ⏱️ CRONOGRAMA ESTIMADO

| Fase | Complexidade | Tempo | Prioridade |
|------|--------------|-------|------------|
| Fase 1: Refatoração System Prompt | 🟡 Média | 2-3h | 🔴 Alta |
| Fase 2: Detecção de Modo | 🟢 Baixa | 1-2h | 🔴 Alta |
| Fase 3: Estrutura de Resposta | 🟡 Média | 2-3h | 🔴 Alta |
| Fase 4: Base de Conhecimento | 🟢 Baixa | 1-2h | 🟡 Média |
| Fase 5: Few-Shots | 🟢 Baixa | 30min | 🟡 Média |
| Fase 6: Validação | 🔴 Alta | 4-5h | 🟡 Média |
| Fase 7: WhatsApp | 🔴 Alta | 6-8h | 🟢 Baixa |

**Total estimado:** 12-20 horas (sem WhatsApp)

---

## 🚨 RISCOS E MITIGAÇÕES

### Risco 1: Prompt muito longo
**Mitigação:** Usar few-shots apenas quando relevante, não sempre

### Risco 2: OpenAI não segue estrutura obrigatória
**Mitigação:** Response Validator + re-geração com instruções mais explícitas

### Risco 3: Performance (latência)
**Mitigação:** Cache de respostas frequentes, otimização do prompt

### Risco 4: Custo OpenAI
**Mitigação:** Manter `gpt-4o-mini`, limitar `max_tokens`, usar cache

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Preparação:
- [ ] Ler e entender completamente a Lousa Oficial
- [ ] Mapear todas as seções para código
- [ ] Definir estrutura de arquivos

### Implementação:
- [ ] Fase 1: Refatorar System Prompt
- [ ] Fase 2: Implementar Mode Detector
- [ ] Fase 3: Implementar Response Builder
- [ ] Fase 4: Criar Base de Conhecimento
- [ ] Fase 5: Adicionar Few-Shots
- [ ] Fase 6: Implementar Response Validator

### Testes:
- [ ] Testar todos os modos
- [ ] Testar todas as FAQs
- [ ] Testar todos os scripts
- [ ] Validar proibições
- [ ] Validar estrutura de resposta

### Deploy:
- [ ] Testar em ambiente de desenvolvimento
- [ ] Validar com usuários reais (beta)
- [ ] Ajustar baseado em feedback
- [ ] Deploy em produção

---

## 📌 PRÓXIMOS PASSOS (Após Aprovação)

1. **Aprovar este planejamento**
2. **Definir prioridades** (quais fases fazer primeiro)
3. **Iniciar Fase 1** (Refatoração do System Prompt)
4. **Testar incrementalmente** (cada fase isoladamente)
5. **Iterar baseado em resultados**

---

## 💬 OBSERVAÇÕES FINAIS

### Pontos de Atenção:
1. **Tamanho do Prompt:** A Lousa é muito completa. Pode ser necessário otimizar para não exceder limites do OpenAI.
2. **Estrutura Obrigatória:** Pode ser difícil forçar o OpenAI a seguir sempre a estrutura. Validação pós-resposta é essencial.
3. **Modo WhatsApp:** Pode ser implementado depois, não é crítico para MVP.
4. **Few-Shots:** Podem ser incluídos no prompt ou usados apenas para fine-tuning futuro.

### Recomendações:
1. **Começar pela Fase 1, 2 e 3** (core do sistema)
2. **Testar com usuários reais** antes de completar todas as fases
3. **Iterar baseado em feedback** (a Lousa pode precisar de ajustes)
4. **Manter compatibilidade** com sistema atual durante transição

---

**Status:** 🟡 Aguardando aprovação para iniciar implementação






