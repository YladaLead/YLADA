# 🧪 PERGUNTAS PARA TESTAR O NOEL

## 📋 Perguntas de Teste

### 1. **Teste de Cálculo Básico (deve usar perfil automaticamente)**
```
Quantos produtos preciso vender para bater minha meta financeira?
```

**O que verificar:**
- ✅ NOEL NÃO pergunta qual é a meta (deve usar do perfil)
- ✅ NOEL chama `calcularObjetivosCompletos()` automaticamente
- ✅ Retorna objetivos específicos de vendas
- ✅ Personaliza baseado no `tipo_trabalho` do perfil

---

### 2. **Teste de Plano Completo (deve montar plano personalizado)**
```
Me dê um plano para bater minha meta
```

**O que verificar:**
- ✅ NOEL usa informações do perfil sem perguntar
- ✅ Retorna plano com objetivos de vendas e equipe
- ✅ Inclui scripts baseados no `tipo_trabalho`
- ✅ Adiciona ações práticas e próximo passo

---

### 3. **Teste de Meta no Perfil (não deve pedir novamente)**
```
Minha meta está no meu perfil, me mostre quantos kits preciso vender
```

**O que verificar:**
- ✅ NOEL NÃO pergunta qual é a meta
- ✅ Usa `calcularObjetivosCompletos()` diretamente
- ✅ Retorna quantidade específica de kits/produtos
- ✅ Se `tipo_trabalho = bebidas_funcionais`, prioriza Kits Energia/Acelera

---

### 4. **Teste de Objetivos de Equipe (deve calcular recrutamento)**
```
Quantos consultores preciso recrutar para bater minha meta de PV?
```

**O que verificar:**
- ✅ NOEL calcula objetivos de equipe automaticamente
- ✅ Retorna quantidade de convites necessários
- ✅ Retorna quantidade de apresentações necessárias
- ✅ Retorna quantidade de novos consultores necessários
- ✅ Inclui PV da equipe necessário

---

### 5. **Teste de Personalização por Tipo de Trabalho**
```
Quero que você me dê o plano completo
```

**O que verificar:**
- ✅ Se `tipo_trabalho = bebidas_funcionais`:
  - Prioriza Kits Energia e Acelera
  - Menciona estratégia de kits R$39,90
  - Sugere pincelar outras bebidas depois
  
- ✅ Se `tipo_trabalho = produtos_fechados`:
  - Prioriza Shake, Fiber, NRG, Herbal, CR7
  - Foca em follow-up e ciclo de recompra
  
- ✅ Se `tipo_trabalho = cliente_que_indica`:
  - Foca em convites e apresentações
  - Metas de quantidade de convites

---

## 🔍 O QUE OBSERVAR NOS LOGS

Ao testar, verifique nos logs do servidor:

1. **Busca de perfil:**
   ```
   👤 [NOEL] Perfil estratégico: encontrado
   ```

2. **Chamada da função:**
   ```
   🔧 Executando function: calcularObjetivosCompletos
   ```

3. **Resposta da função:**
   ```
   ✅ [NOEL Handler] Function calcularObjetivosCompletos executada com sucesso
   ```

4. **Uso do texto_formatado:**
   - Verificar se a resposta usa o formato retornado pela função
   - Verificar se adiciona scripts baseados no tipo_trabalho

---

## ❌ COMPORTAMENTOS QUE NÃO DEVEM ACONTECER

1. ❌ NOEL perguntar "qual é sua meta financeira?" quando já está no perfil
2. ❌ NOEL perguntar "qual é sua meta de PV?" quando já está no perfil
3. ❌ NOEL não chamar `calcularObjetivosCompletos()` quando pedir cálculo
4. ❌ NOEL retornar valores genéricos sem usar a função
5. ❌ NOEL não personalizar baseado no tipo_trabalho

---

## ✅ COMPORTAMENTOS ESPERADOS

1. ✅ NOEL sempre busca perfil antes de responder
2. ✅ NOEL chama `calcularObjetivosCompletos()` automaticamente
3. ✅ NOEL usa valores reais dos produtos do banco
4. ✅ NOEL personaliza baseado no tipo_trabalho
5. ✅ NOEL inclui scripts e ações práticas
6. ✅ NOEL não pede informações que já estão no perfil

---

## 🎯 ORDEM RECOMENDADA DE TESTE

1. Primeiro: Teste com usuário que TEM perfil completo
2. Segundo: Teste perguntas que pedem cálculo/plano
3. Terceiro: Verifique personalização por tipo_trabalho
4. Quarto: Teste com usuário SEM perfil (deve orientar onboarding)

---

**Boa sorte nos testes! 🚀**
