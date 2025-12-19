# 🧪 Testes NOEL - Pós Correção do Prompt

## 📋 Sequência de Perguntas para Validar Correções

Use estas perguntas **na ordem** para testar se as correções funcionaram.

---

## 🎯 TESTE 1: Links e Functions (CRÍTICO)

### **Pergunta 1.1 - Fluxo 2-5-10**
```
Como funciona o Fluxo 2-5-10?
```

**✅ O que deve acontecer:**
- NOEL deve chamar `getFluxoInfo("fluxo-2-5-10")` ou código equivalente
- Deve retornar link REAL do banco de dados (não inventado)
- Link deve ser personalizado (ex: `/pt/wellness/{userSlug}/fluxos/...`)

**❌ O que NÃO deve acontecer:**
- ❌ Link genérico como "https://www.ylada.com/pt/wellness/system/vender/fluxos"
- ❌ Mencionar fluxo sem chamar a function
- ❌ Inventar informações sobre o fluxo

---

### **Pergunta 1.2 - Calculadora de Água**
```
Preciso da calculadora de água para mostrar para um cliente.
```

**✅ O que deve acontecer:**
- NOEL deve chamar `getFerramentaInfo("calculadora-agua")`
- Deve retornar link personalizado do banco
- Deve fornecer script de apresentação

**❌ O que NÃO deve acontecer:**
- ❌ Link inventado
- ❌ Mencionar sem chamar function

---

### **Pergunta 1.3 - Quiz de Energia**
```
Tem algum quiz de energia que eu possa usar?
```

**✅ O que deve acontecer:**
- NOEL deve chamar `getQuizInfo("quiz-energetico")` ou similar
- Deve retornar link personalizado
- Deve fornecer script de apresentação

---

## 🎯 TESTE 2: Planos e Estratégias (CRÍTICO)

### **Pergunta 2.1 - Aumentar Receita (TESTE PRINCIPAL)**
```
Quero aumentar minha receita em 50% nos próximos 3 meses. Me dê um plano completo passo a passo.
```

**✅ O que deve acontecer:**
- ✅ NOEL DEVE AJUDAR (não bloquear)
- ✅ Deve usar o perfil estratégico do usuário (getUserProfile)
- ✅ Deve dar orientações práticas e acionáveis
- ✅ Deve transformar metas em ações diárias
- ✅ Se tiver perfil completo, usar as metas do perfil
- ✅ Se não tiver perfil, orientar a completar onboarding

**❌ O que NÃO deve acontecer:**
- ❌ "Por motivos de ética e proteção do sistema, não compartilho conteúdos internos"
- ❌ Bloquear ou recusar ajudar
- ❌ Resposta genérica sem ação prática

---

### **Pergunta 2.2 - Calcular Objetivos**
```
Quantos produtos preciso vender para bater minha meta financeira?
```

**✅ O que deve acontecer:**
- ✅ Deve usar getUserProfile para pegar a meta
- ✅ Deve dar cálculo prático baseado na meta do perfil
- ✅ Deve transformar em ações concretas

**❌ O que NÃO deve acontecer:**
- ❌ Bloquear a pergunta
- ❌ Pedir informações que já estão no perfil

---

### **Pergunta 2.3 - Plano de Vendas**
```
Me dê um plano para vender mais este mês.
```

**✅ O que deve acontecer:**
- ✅ Deve ajudar com plano prático
- ✅ Deve usar perfil para personalizar
- ✅ Deve dar ações diárias concretas

---

## 🎯 TESTE 3: Funcionalidades do Sistema

### **Pergunta 3.1 - Cadastrar Cliente (TESTE PRINCIPAL)**
```
Como faço para cadastrar um novo cliente no sistema?
```

**✅ O que deve acontecer:**
- ✅ Deve ORIENTAR: "Acesse: Menu → Clientes → Novo Cliente"
- ✅ Ou: "Vá em: `/pt/wellness/clientes/novo`"
- ✅ Deve explicar onde encontrar a funcionalidade

**❌ O que NÃO deve acontecer:**
- ❌ "Me passe os dados que eu faço o cadastro"
- ❌ "Informe nome e telefone que eu registro"
- ❌ Oferecer fazer algo que não pode fazer diretamente

---

### **Pergunta 3.2 - Acessar Fluxos**
```
Onde encontro os fluxos de vendas?
```

**✅ O que deve acontecer:**
- ✅ Deve orientar: "Menu → Vender → Fluxos"
- ✅ Ou usar getFluxoInfo() se for fluxo específico
- ✅ Deve dar caminho claro na interface

---

## 🎯 TESTE 4: Situações Emocionais (Validar Tom)

### **Pergunta 4.1 - Desânimo**
```
Estou desanimada, não consigo vender, meus clientes estão reclamando e não sei mais o que fazer. Preciso de ajuda urgente.
```

**✅ O que deve acontecer:**
- ✅ Tom firme e acolhedor
- ✅ Ações práticas imediatas
- ✅ Scripts de reativação (usando getFluxoInfo se necessário)
- ✅ Frase motivacional no final

**❌ O que NÃO deve acontecer:**
- ❌ Resposta genérica
- ❌ Sem ação prática clara
- ❌ Tom muito suave ou muito duro

---

## 🎯 TESTE 5: Múltiplos Problemas

### **Pergunta 5.1 - Situação Complexa**
```
Tenho muitos leads mas não consigo converter, meus clientes antigos estão insatisfeitos, e não tenho tempo para nada. Por onde começo?
```

**✅ O que deve acontecer:**
- ✅ Prioriza corretamente (foco no crítico primeiro)
- ✅ Dá passos claros e práticos
- ✅ Não tenta resolver tudo de uma vez
- ✅ Usa functions quando necessário (getFluxoInfo para reativação)

---

## 🎯 TESTE 6: Perguntas Rotineiras (Devem funcionar bem)

### **Pergunta 6.1 - Script de Venda**
```
Preciso de um script para vender o kit de 5 dias.
```

**✅ O que deve acontecer:**
- ✅ Fornece script da Base de Conhecimento
- ✅ Formata claramente
- ✅ Menciona quando usar

---

### **Pergunta 6.2 - Objeção de Preço**
```
Um cliente disse que o produto é muito caro. Como eu respondo?
```

**✅ O que deve acontecer:**
- ✅ Script de resposta claro
- ✅ Foco em valor, não preço
- ✅ Tom profissional

---

## 📊 CHECKLIST DE VALIDAÇÃO

Para cada resposta, marque:

### **✅ FUNCTIONS:**
- [ ] Chamou function quando necessário?
- [ ] Usou dados retornados pela function?
- [ ] Não inventou links ou informações?

### **✅ PLANOS/ESTRATÉGIAS:**
- [ ] Ajudou com a pergunta (não bloqueou)?
- [ ] Deu orientações práticas?
- [ ] Usou perfil quando disponível?

### **✅ FUNCIONALIDADES:**
- [ ] Orientou acessar página (não ofereceu fazer)?
- [ ] Caminho claro na interface?
- [ ] Não ofereceu fazer algo que não pode?

### **✅ QUALIDADE GERAL:**
- [ ] Tom do NOEL mantido?
- [ ] Ações práticas claras?
- [ ] Scripts quando necessário?
- [ ] Próximo passo sugerido?

---

## 🎯 ORDEM DE TESTE RECOMENDADA

**Teste rápido (5 perguntas essenciais):**
1. Fluxo 2-5-10 (validar functions)
2. Aumentar receita 50% (validar não bloquear)
3. Cadastrar cliente (validar orientar vs fazer)
4. Desânimo (validar tom)
5. Script de venda (validar rotineiro)

**Teste completo (todas as perguntas):**
- Faça todas na ordem apresentada
- Anote o que funcionou e o que não funcionou
- Compare com o comportamento anterior

---

## 📝 O QUE OBSERVAR

### **Sinais de que está funcionando:**
- ✅ Chama functions antes de responder sobre fluxos/ferramentas
- ✅ Links são personalizados (não genéricos)
- ✅ Ajuda com planos/estratégias sem bloquear
- ✅ Orienta funcionalidades (não oferece fazer)
- ✅ Mantém tom do NOEL

### **Sinais de que ainda precisa ajuste:**
- ❌ Ainda inventa links
- ❌ Ainda bloqueia perguntas sobre planos
- ❌ Ainda oferece fazer cadastros
- ❌ Não chama functions quando deveria

---

## 💡 DICAS PARA OS TESTES

1. **Teste em horários diferentes** (modelo pode variar)
2. **Compare com respostas anteriores** (se tiver)
3. **Foque nos testes críticos primeiro** (functions e planos)
4. **Anote exatamente o que aconteceu** (para ajustes futuros)
5. **Teste múltiplas vezes** (para garantir consistência)

---

**Boa sorte com os testes!** 🚀

Se algo não funcionar como esperado, anote e podemos ajustar o prompt novamente.
