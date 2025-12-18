# 🧪 PERGUNTAS PARA TESTE FINAL

**Data:** 2025-01-27  
**Status:** ✅ Pronto para testar

---

## 🎯 TESTES PRIORITÁRIOS (Faça primeiro)

### **TESTE 1: Reativação de Cliente** ⚠️
```
Preciso reativar um cliente que sumiu
```
**Esperado:**
- ✅ Assistants API chama `getFluxoInfo({ fluxo_codigo: "fluxo-retencao-cliente" })`
- ✅ Retorna fluxo completo de reativação
- ✅ Inclui link e script oficial
- ✅ NÃO retorna "Não tenho um script específico"

---

### **TESTE 2: Calculadora de Água** ⚠️
```
Quero enviar a calculadora de água para um cliente
```
**Esperado:**
- ✅ Assistants API chama `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
- ✅ Retorna link da calculadora
- ✅ Sugere script para enviar
- ✅ NÃO retorna "Erro no servidor"

---

## ✅ TESTES DE CONFIRMAÇÃO (Já funcionavam)

### **TESTE 3: Verificação Básica**
```
Olá, quem é você?
```
**Esperado:**
- ✅ Resposta direta sobre quem é o NOEL
- ✅ Sem chamar functions

---

### **TESTE 4: Perfil do Usuário**
```
Qual é o meu perfil?
```
**Esperado:**
- ✅ Chama `getUserProfile`
- ✅ Retorna dados do perfil
- ✅ Sem erro

---

## 🔍 TESTES ADICIONAIS (Variações)

### **TESTE 5: Reativação (Variação 1)**
```
Como reativar um cliente?
```
**Esperado:**
- ✅ Chama `getFluxoInfo` com código de reativação
- ✅ Retorna fluxo completo

---

### **TESTE 6: Reativação (Variação 2)**
```
Preciso reativar um cliente que não compra há tempo
```
**Esperado:**
- ✅ Chama `getFluxoInfo` com código de reativação
- ✅ Retorna fluxo completo

---

### **TESTE 7: Calculadora (Variação 1)**
```
Me mostra a calculadora de água
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
- ✅ Retorna link e script

---

### **TESTE 8: Calculadora (Variação 2)**
```
Preciso do link da calculadora de hidratação
```
**Esperado:**
- ✅ Chama `getFerramentaInfo` com slug relacionado a água/hidratação
- ✅ Retorna link

---

### **TESTE 9: Pós-Venda**
```
Como fazer acompanhamento pós-venda?
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "fluxo-onboarding-cliente" })`
- ✅ Retorna fluxo de pós-venda/onboarding

---

### **TESTE 10: Convite**
```
Preciso de um script para convidar alguém
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "fluxo-convite-leve" })`
- ✅ Retorna fluxo de convite

---

### **TESTE 11: Rotina 2-5-10**
```
Me explica o método 2-5-10
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "fluxo-2-5-10" })`
- ✅ Retorna fluxo 2-5-10

---

### **TESTE 12: Calculadora de Proteína**
```
Quero enviar a calculadora de proteína
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-proteina" })`
- ✅ Retorna link e script

---

## 📊 SEQUÊNCIA RECOMENDADA

### **FASE 1: Testes Críticos (Faça primeiro)**
1. ✅ **TESTE 1:** "Preciso reativar um cliente que sumiu"
2. ✅ **TESTE 2:** "Quero enviar a calculadora de água para um cliente"

**Se esses dois passarem, as correções funcionaram!** 🎉

---

### **FASE 2: Confirmação**
3. ✅ **TESTE 3:** "Olá, quem é você?"
4. ✅ **TESTE 4:** "Qual é o meu perfil?"

---

### **FASE 3: Variações (Opcional)**
5. ✅ **TESTE 5-12:** Variações das perguntas

---

## ✅ CHECKLIST DE RESULTADOS

Marque cada teste:

### **FASE 1 - Críticos:**
- [ ] TESTE 1: Reativação - Passou / Falhou
- [ ] TESTE 2: Calculadora de Água - Passou / Falhou

### **FASE 2 - Confirmação:**
- [ ] TESTE 3: Verificação Básica - Passou / Falhou
- [ ] TESTE 4: Perfil - Passou / Falhou

### **FASE 3 - Variações:**
- [ ] TESTE 5: Reativação Variação 1 - Passou / Falhou
- [ ] TESTE 6: Reativação Variação 2 - Passou / Falhou
- [ ] TESTE 7: Calculadora Variação 1 - Passou / Falhou
- [ ] TESTE 8: Calculadora Variação 2 - Passou / Falhou
- [ ] TESTE 9: Pós-Venda - Passou / Falhou
- [ ] TESTE 10: Convite - Passou / Falhou
- [ ] TESTE 11: Rotina 2-5-10 - Passou / Falhou
- [ ] TESTE 12: Calculadora de Proteína - Passou / Falhou

---

## 🐛 SE ALGO FALHAR

**Anote:**
- Qual teste falhou
- Qual foi a mensagem de erro
- O que o NOEL respondeu

**Verificações:**
- ✅ As functions foram salvas no OpenAI Dashboard?
- ✅ `fluxo_codigo` está marcado como Required em `getFluxoInfo`?
- ✅ `ferramenta_slug` está marcado como Required em `getFerramentaInfo`?
- ✅ As descrições foram atualizadas?

---

## 🎯 FOCO PRINCIPAL

**Teste primeiro estas 2 perguntas:**
1. "Preciso reativar um cliente que sumiu"
2. "Quero enviar a calculadora de água para um cliente"

**Se essas duas funcionarem, as correções foram um sucesso!** 🎉

---

**🚀 Comece pelos TESTES 1 e 2!**

















