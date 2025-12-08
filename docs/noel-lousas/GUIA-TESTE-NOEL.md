# 🧪 Guia de Teste — NOEL Wellness

**Data:** 2025-01-27  
**Objetivo:** Validar se o NOEL está usando corretamente as lousas e respondendo como mentor esperado

---

## 📍 Onde Testar

### **Opção 1: Página Dedicada (Recomendado)**
**URL:** `http://localhost:3000/pt/wellness/noel`

**Vantagens:**
- Interface completa e focada
- Mostra metadata das respostas (módulo, fonte, tokens)
- Ideal para testes detalhados

### **Opção 2: Widget Flutuante**
**URL:** `http://localhost:3000/pt/wellness/home`

**Como usar:**
- Clique no card "Peça Ajuda ao NOEL" ou no widget flutuante no canto inferior direito
- O chatbot "Mentor" será aberto automaticamente

---

## 🎯 Perguntas de Teste Estratégicas

### **CATEGORIA 1: Scripts de Vendas (Bloco 1)**
**Objetivo:** Verificar se o NOEL usa scripts de vendas das lousas

1. **"Como posso abordar alguém que não conhece os produtos?"**
   - ✅ **Esperado:** Deve sugerir scripts de abertura do Bloco 1 (abordagem inicial, stories)
   - 📝 **O que observar:** Se menciona scripts específicos, linguagem leve, sem pressão

2. **"Preciso de um script para fazer uma oferta de kit"**
   - ✅ **Esperado:** Deve fornecer scripts de ofertas do Bloco 1
   - 📝 **O que observar:** Se oferece versões curta/média/longa, contexto de uso

3. **"Como fazer follow-up depois de enviar um link?"**
   - ✅ **Esperado:** Deve usar scripts de follow-up do Bloco 1 ou Bloco 4
   - 📝 **O que observar:** Se diferencia follow-up inicial vs. profissional

---

### **CATEGORIA 2: Indicação (Bloco 2)**
**Objetivo:** Verificar scripts de indicação

4. **"Como pedir indicação de forma natural?"**
   - ✅ **Esperado:** Deve sugerir scripts de indicação natural do Bloco 2
   - 📝 **O que observar:** Se menciona diferentes contextos (família, trabalho, após resultado)

5. **"Quero pedir indicação para alguém que já teve resultado"**
   - ✅ **Esperado:** Deve usar script de "indicação após resultado" do Bloco 2
   - 📝 **O que observar:** Se personaliza baseado no contexto

---

### **CATEGORIA 3: Recrutamento (Bloco 3)**
**Objetivo:** Verificar scripts de recrutamento leve

6. **"Como convidar alguém para conhecer o negócio sem pressionar?"**
   - ✅ **Esperado:** Deve usar scripts de recrutamento leve do Bloco 3
   - 📝 **O que observar:** Se foca em propósito, visão, renda extra (sem pressão)

7. **"Preciso de um script para falar sobre o potencial do negócio"**
   - ✅ **Esperado:** Deve sugerir scripts de visão/potencial do Bloco 3
   - 📝 **O que observar:** Se mantém tom leve e inspirador

---

### **CATEGORIA 4: Objeções (Lousa Completa)**
**Objetivo:** Verificar se o NOEL lida com objeções usando as respostas das lousas

8. **"Um cliente disse que está caro, o que faço?"**
   - ✅ **Esperado:** Deve usar objeção A.1 (caro) com versões curta/média/longa
   - 📝 **O que observar:** Se oferece múltiplas versões, gatilhos de retomada

9. **"Alguém disse que não quer se comprometer"**
   - ✅ **Esperado:** Deve usar objeção A.10 com resposta Premium Light Copy
   - 📝 **O que observar:** Se enfatiza "sem compromisso", "teste leve"

10. **"Um possível recrutado disse que não tem tempo"**
    - ✅ **Esperado:** Deve usar objeção de recrutamento (Grupo C) com respostas alternativas
    - 📝 **O que observar:** Se adapta para contexto de recrutamento vs. vendas

---

### **CATEGORIA 5: Motivação e Liderança (Bloco 5)**
**Objetivo:** Verificar frases motivacionais

11. **"Preciso de uma frase motivacional para minha equipe"**
    - ✅ **Esperado:** Deve usar frases do Bloco 5 (Jim Rohn, Mark Hughes, Eric Worre)
    - 📝 **O que observar:** Se contextualiza a frase, menciona autor se relevante

12. **"Estou desanimado, preciso de motivação"**
    - ✅ **Esperado:** Deve oferecer frases motivacionais personalizadas
    - 📝 **O que observar:** Se combina motivação com orientação prática

---

### **CATEGORIA 6: Prova Social e Histórias (Bloco 6)**
**Objetivo:** Verificar uso de histórias universais

13. **"Preciso de uma história para usar em uma conversa de vendas"**
    - ✅ **Esperado:** Deve sugerir histórias universais do Bloco 6
    - 📝 **O que observar:** Se as histórias são universais (não específicas), se são duplicáveis

14. **"Como usar prova social sem mencionar nomes?"**
    - ✅ **Esperado:** Deve usar scripts de prova social do Bloco 6
    - 📝 **O que observar:** Se mantém anonimato, foca em movimento/resultados gerais

---

### **CATEGORIA 7: Personalização e Contexto**
**Objetivo:** Verificar se o NOEL personaliza baseado no perfil do usuário

15. **"Qual é o melhor script para mim?"**
    - ✅ **Esperado:** Deve considerar perfil do usuário (objetivo, tempo disponível, experiência)
    - 📝 **O que observar:** Se menciona dados do onboarding, se adapta ao contexto

16. **"Tenho apenas 15 minutos por dia, como usar?"**
    - ✅ **Esperado:** Deve sugerir scripts rápidos, ações objetivas
    - 📝 **O que observar:** Se respeita limitação de tempo, oferece soluções práticas

---

### **CATEGORIA 8: Fluxos Avançados (Bloco 7)**
**Objetivo:** Verificar uso de fluxos completos

17. **"Me dê um fluxo completo de vendas"**
    - ✅ **Esperado:** Deve sugerir fluxo de vendas do Bloco 7
    - 📝 **O que observar:** Se apresenta etapas sequenciais, scripts para cada etapa

18. **"Como fazer onboarding de um novo consultor?"**
    - ✅ **Esperado:** Deve usar fluxo de onboarding do Bloco 7
    - 📝 **O que observar:** Se estrutura em etapas, se é duplicável

---

### **CATEGORIA 9: Tom e Estilo (Premium Light Copy)**
**Objetivo:** Verificar se mantém tom leve, sem pressão

19. **"Preciso de um script que não seja invasivo"**
    - ✅ **Esperado:** Deve usar linguagem Premium Light Copy (leve, sem pressão)
    - 📝 **O que observar:** Se evita palavras como "oportunidade", "não perca", se usa emojis moderadamente

20. **"Como falar sobre o negócio sem parecer vendedor?"**
    - ✅ **Esperado:** Deve focar em propósito, ajuda, resultados (não em ganhos)
    - 📝 **O que observar:** Se mantém tom consultivo, não comercial

---

## 📊 Checklist de Análise

Para cada resposta do NOEL, verificar:

### **✅ Conteúdo**
- [ ] Usa scripts das lousas (não inventa)
- [ ] Oferece versões curta/média/longa quando aplicável
- [ ] Contextualiza o script (quando usar, para quem)
- [ ] Menciona tags/categorias relevantes

### **✅ Personalização**
- [ ] Considera perfil do usuário (se disponível)
- [ ] Adapta ao contexto da pergunta
- [ ] Oferece múltiplas opções quando relevante

### **✅ Tom e Estilo**
- [ ] Mantém linguagem Premium Light Copy
- [ ] Evita pressão, foca em ajuda
- [ ] Usa emojis moderadamente (não exagera)
- [ ] Tom consultivo, não comercial

### **✅ Estrutura**
- [ ] Resposta clara e organizada
- [ ] Oferece próximos passos quando aplicável
- [ ] Pergunta se precisa de mais ajuda

### **✅ Busca Semântica**
- [ ] Encontra conteúdo relevante mesmo com perguntas diferentes
- [ ] Similaridade adequada (não muito genérico, não muito específico)
- [ ] Combina múltiplas fontes quando necessário

---

## 🎯 Resultado Esperado

**NOEL deve:**
1. ✅ Usar scripts das lousas (não inventar)
2. ✅ Personalizar baseado no perfil do usuário
3. ✅ Manter tom Premium Light Copy (leve, sem pressão)
4. ✅ Oferecer múltiplas versões quando aplicável
5. ✅ Contextualizar scripts (quando usar, para quem)
6. ✅ Combinar diferentes blocos quando necessário
7. ✅ Ser consultivo, não comercial

---

## 📝 Template de Resposta

Ao testar, use este formato:

```
**Pergunta:** [sua pergunta]

**Resposta do NOEL:**
[cole a resposta completa aqui]

**Análise:**
- ✅ Usou scripts das lousas? [SIM/NÃO - qual bloco?]
- ✅ Personalizou? [SIM/NÃO - como?]
- ✅ Tom correto? [SIM/NÃO - observações]
- ✅ Próximos passos? [SIM/NÃO]
- ⚠️ Problemas encontrados: [se houver]
```

---

**Boa sorte com os testes!** 🚀
