# 🧪 PERGUNTAS PARA TESTAR O NOEL

**Data:** 2025-01-27  
**Status:** ✅ Pronto para testar

---

## 🎯 TESTES PRIORITÁRIOS (As que falharam antes)

### **TESTE 1: Reativação de Cliente** ⚠️
```
Preciso reativar um cliente que sumiu
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "reativacao" })`
- ✅ Retorna fluxo completo de reativação
- ✅ Inclui link e script
- ✅ NÃO retorna "Erro no servidor"

---

### **TESTE 2: Calculadora de Água** ⚠️
```
Quero enviar a calculadora de água para um cliente
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
- ✅ Retorna link da calculadora
- ✅ Sugere script para enviar
- ✅ NÃO retorna "Erro no servidor"

---

## ✅ TESTES QUE JÁ FUNCIONAVAM (Confirmar que ainda funcionam)

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

### **TESTE 5: Redirecionamento Suave**
```
Como está o tempo hoje?
```
**Esperado:**
- ✅ Redireciona suavemente
- ✅ Sem erro

---

## 🔍 TESTES ADICIONAIS (Variações)

### **TESTE 6: Reativação (Variação 1)**
```
Como reativar um cliente?
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "reativacao" })`
- ✅ Retorna fluxo de reativação

---

### **TESTE 7: Reativação (Variação 2)**
```
Preciso reativar um cliente que não compra há tempo
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "reativacao" })`
- ✅ Retorna fluxo de reativação

---

### **TESTE 8: Calculadora (Variação 1)**
```
Me mostra a calculadora de água
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
- ✅ Retorna link e script

---

### **TESTE 9: Calculadora (Variação 2)**
```
Preciso do link da calculadora de hidratação
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })` ou `"calc-hidratacao"`
- ✅ Retorna link

---

### **TESTE 10: Pós-Venda**
```
Como fazer acompanhamento pós-venda?
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "pos-venda" })`
- ✅ Retorna fluxo de pós-venda

---

### **TESTE 11: Convite**
```
Preciso de um script para convidar alguém
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "convite-leve" })`
- ✅ Retorna fluxo de convite

---

### **TESTE 12: Rotina 2-5-10**
```
Me explica o método 2-5-10
```
**Esperado:**
- ✅ Chama `getFluxoInfo({ fluxo_codigo: "2-5-10" })`
- ✅ Retorna fluxo 2-5-10

---

### **TESTE 13: Calculadora de Proteína**
```
Quero enviar a calculadora de proteína
```
**Esperado:**
- ✅ Chama `getFerramentaInfo({ ferramenta_slug: "calculadora-proteina" })`
- ✅ Retorna link e script

---

## 📊 SEQUÊNCIA RECOMENDADA DE TESTES

### **FASE 1: Testes Críticos (Faça primeiro)**
1. ✅ TESTE 1: "Preciso reativar um cliente que sumiu"
2. ✅ TESTE 2: "Quero enviar a calculadora de água para um cliente"

**Se esses dois passarem, as correções funcionaram!**

---

### **FASE 2: Confirmação (Testes que já funcionavam)**
3. ✅ TESTE 3: "Olá, quem é você?"
4. ✅ TESTE 4: "Qual é o meu perfil?"
5. ✅ TESTE 5: "Como está o tempo hoje?"

---

### **FASE 3: Variações (Opcional)**
6. ✅ TESTE 6-13: Variações das perguntas

---

## ✅ CHECKLIST DE RESULTADOS

Marque cada teste:

### **FASE 1 - Críticos:**
- [ ] TESTE 1: Reativação - Passou / Falhou
- [ ] TESTE 2: Calculadora de Água - Passou / Falhou

### **FASE 2 - Confirmação:**
- [ ] TESTE 3: Verificação Básica - Passou / Falhou
- [ ] TESTE 4: Perfil - Passou / Falhou
- [ ] TESTE 5: Redirecionamento - Passou / Falhou

### **FASE 3 - Variações:**
- [ ] TESTE 6: Reativação Variação 1 - Passou / Falhou
- [ ] TESTE 7: Reativação Variação 2 - Passou / Falhou
- [ ] TESTE 8: Calculadora Variação 1 - Passou / Falhou
- [ ] TESTE 9: Calculadora Variação 2 - Passou / Falhou
- [ ] TESTE 10: Pós-Venda - Passou / Falhou
- [ ] TESTE 11: Convite - Passou / Falhou
- [ ] TESTE 12: Rotina 2-5-10 - Passou / Falhou
- [ ] TESTE 13: Calculadora de Proteína - Passou / Falhou

---

## 🐛 SE ALGO FALHAR

**Anote:**
- Qual teste falhou
- Qual foi a mensagem de erro
- O que o NOEL respondeu

**Verificações:**
- ✅ As functions foram salvas no OpenAI Dashboard?
- ✅ `fluxo_codigo` está marcado como Required em `getFluxoInfo`?
- ✅ As descrições foram atualizadas?

---

## 🎯 FOCO PRINCIPAL

**Teste primeiro estas 2 perguntas:**
1. "Preciso reativar um cliente que sumiu"
2. "Quero enviar a calculadora de água para um cliente"

**Se essas duas funcionarem, as correções foram um sucesso!** 🎉

---

**🚀 Comece pelos TESTES 1 e 2!**


















