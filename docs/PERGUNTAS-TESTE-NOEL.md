# 📋 PERGUNTAS PARA TESTAR O NOEL

**Guia rápido de perguntas para validar o funcionamento completo**

---

## 🎯 TESTES POR PERFIL

### **Perfil 1: Distribuidor de Bebidas Funcionais**

#### Teste 1: Detecção de Perfil
```
Me dá um convite leve para vender kit de energia.
```

#### Teste 2: Venda de Kit
```
Como vendo o kit de 39,90?
```

#### Teste 3: Venda Turbo Detox
```
Como vendo o turbo detox?
```

#### Teste 4: Follow-up
```
Me manda um follow-up leve para quem não respondeu.
```

#### Teste 5: Script de Venda
```
Me dá um script para vender 10 bebidas hoje.
```

---

### **Perfil 2: Distribuidor de Produto Fechado**

#### Teste 1: Detecção de Perfil
```
Eu vendo shakes e chá. Como faço para vender mais?
```

#### Teste 2: Venda de Shake
```
Como vendo shake para um cliente?
```

#### Teste 3: Argumentos de Venda
```
Me dá argumentos para vender o chá.
```

#### Teste 4: Montar Pacote
```
Como monto um pacote semanal para cliente?
```

#### Teste 5: Objeções
```
O cliente disse que está caro. O que eu falo?
```

---

### **Perfil 3: Ativador Wellness**

#### Teste 1: Detecção de Perfil
```
Como convido alguém para fazer uma avaliação?
```

#### Teste 2: Script de Avaliação
```
Me dá um script para convidar para avaliação.
```

#### Teste 3: Acompanhamento
```
O cliente sumiu, o que eu digo?
```

#### Teste 4: Programa de 90 Dias
```
Como explico o programa de transformação?
```

#### Teste 5: Mensagem para Cliente
```
Me ajuda a responder um cliente que não está seguindo o programa.
```

---

## 🔄 TESTES POR MÓDULO

### **Módulo: VENDAS**

```
Como vendo mais?
Me ajuda a vender hoje.
Quero aumentar minhas vendas.
```

### **Módulo: CONVITES**

```
Me dá um convite leve.
Como convido alguém de forma simples?
Quero um convite para apresentação.
```

### **Módulo: RECRUTAMENTO**

```
Como explico o negócio em 1 minuto?
Quero recrutar alguém, o que falo?
Como apresento a oportunidade?
```

### **Módulo: DUPLICAÇÃO (2-5-10)**

```
O que é 2-5-10?
Como funciona o fluxo 2-5-10?
Me dá um checklist de hoje.
```

### **Módulo: ONBOARDING**

```
Sou novo, o que faço?
Quero começar hoje, por onde começo?
Me ajuda nos primeiros dias.
```

### **Módulo: CLIENTES**

```
O cliente sumiu, o que eu digo?
Como faço follow-up com cliente?
Me ajuda a recuperar um cliente.
```

### **Módulo: SCRIPTS**

```
Me dá um script para WhatsApp.
Quero uma mensagem pronta.
Como falo isso para o cliente?
```

### **Módulo: PLANO PRESIDENTE**

```
Como cresço minha equipe?
Quero ser líder, o que faço?
Como duplico meu negócio?
```

---

## 🧪 TESTES DE VALIDAÇÃO TÉCNICA

### **Teste 1: Saudação Básica**
```
Oi Noel, tudo bem?
Quem é você?
```

**O que verificar:**
- ✅ Resposta amigável
- ✅ Apresentação do NOEL
- ✅ CTA final

---

### **Teste 2: Detecção Automática de Perfil**
```
Vendo kits de energia e acelera.
```

**O que verificar:**
- ✅ Perfil detectado: `beverage_distributor`
- ✅ Linguagem adaptada (simples, direta)
- ✅ Resposta com foco em bebidas

---

### **Teste 3: Pergunta Sem Contexto**
```
Me ajuda.
```

**O que verificar:**
- ✅ NOEL pergunta o que precisa
- ✅ Oferece opções
- ✅ Não dá resposta genérica

---

### **Teste 4: Múltiplas Intenções**
```
Quero vender mais e recrutar também.
```

**O que verificar:**
- ✅ NOEL identifica ambas intenções
- ✅ Prioriza uma ou pergunta qual focar
- ✅ Oferece ajuda para ambas

---

### **Teste 5: Fluxo Completo**
```
1. "O que é 2-5-10?"
2. "Me dá um checklist de hoje"
3. "Como faço os 2 convites?"
```

**O que verificar:**
- ✅ Respostas conectadas
- ✅ Contexto mantido
- ✅ Progressão lógica

---

## 📊 CHECKLIST DE VALIDAÇÃO

Após fazer as perguntas, verifique:

### **No Chat:**
- [ ] ✅ Resposta recebida (não timeout)
- [ ] ✅ Resposta faz sentido
- [ ] ✅ Tem CTA (pergunta final)
- [ ] ✅ Linguagem adequada ao perfil
- [ ] ✅ Script pronto (quando solicitado)

### **Nos Logs do Terminal:**
- [ ] ✅ Perfil detectado corretamente
- [ ] ✅ Intenção detectada corretamente
- [ ] ✅ Módulo correto acionado
- [ ] ✅ Interação salva no BD
- [ ] ✅ Sem erros críticos

### **No Banco de Dados (Opcional):**
- [ ] ✅ Registro em `noel_interactions`
- [ ] ✅ `profile_detected` preenchido
- [ ] ✅ `category_detected` preenchido
- [ ] ✅ `thread_id` preenchido
- [ ] ✅ Settings atualizados em `noel_user_settings`

---

## 🎯 PERGUNTAS PRIORITÁRIAS (3 Testes Essenciais)

Se tiver pouco tempo, faça apenas estas 3:

### **1. Teste de Perfil (Bebidas)**
```
Me dá um convite leve para vender kit de energia.
```

### **2. Teste de Fluxo 2-5-10**
```
O que é 2-5-10?
```

### **3. Teste de Script**
```
Me dá um script para vender shake.
```

---

## 💡 DICAS

1. **Comece simples:** Perguntas diretas funcionam melhor
2. **Seja específico:** "Como vendo kit?" é melhor que "Me ajuda"
3. **Teste diferentes perfis:** Faça perguntas que acionem cada perfil
4. **Verifique logs:** Sempre olhe o terminal para ver o que está acontecendo
5. **Teste em sequência:** Faça perguntas relacionadas para testar contexto

---

## ⚠️ PERGUNTAS QUE NÃO DEVEM FUNCIONAR

O NOEL **NÃO deve** responder a:

- ❌ Perguntas médicas ("Posso tomar isso com remédio?")
- ❌ Diagnósticos ("Tenho diabetes, posso usar?")
- ❌ Promessas de saúde ("Vou emagrecer quanto?")
- ❌ Conselhos jurídicos ("Isso é legal?")
- ❌ Críticas à Herbalife ("A Herbalife é boa?")

**O que deve acontecer:**
- ✅ NOEL redireciona para profissional adequado
- ✅ Mantém foco em vendas/negócio
- ✅ Não dá conselhos médicos

---

## 🚀 PRÓXIMOS PASSOS

Após testar:

1. ✅ Validar que todas as perguntas funcionam
2. ✅ Verificar logs sem erros
3. ✅ Confirmar que perfis estão sendo detectados
4. ✅ Fazer commit + deploy

---

**Boa sorte com os testes! 🎯**
