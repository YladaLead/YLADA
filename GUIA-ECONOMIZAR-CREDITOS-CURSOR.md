# 💰 GUIA: Como Economizar Créditos no Cursor

## 🎯 Objetivo
Reduzir o consumo de créditos do Cursor Pro ($20/mês) para evitar cobranças on-demand.

---

## 📊 1. VERIFICAR QUAL MODELO ESTÁ USANDO

### **No Agent/Chat (Cmd+L ou Ctrl+I):**

1. **Abra o Agent/Chat:**
   - Pressione `Cmd+L` (Mac) ou `Ctrl+L` (Windows/Linux)
   - Ou `Ctrl+I` para abrir o Agent

2. **Verifique o modelo selecionado:**
   - No canto superior do painel, há um **seletor de modelos**
   - O modelo atual aparece no dropdown
   - Exemplos: "Auto", "Claude Sonnet 4", "GPT-4", "Gemini", etc.

3. **Alternar rapidamente entre modelos:**
   - Pressione `Ctrl+.` (ponto) para alternar modelos rapidamente

### **Verificar no Dashboard:**
- Acesse: https://cursor.com/dashboard?tab=usage
- Veja a tabela "All Events"
- Identifique qual modelo está sendo usado mais
- Veja o custo por requisição

---

## ⚙️ 2. CONFIGURAR MODELO MAIS ECONÔMICO

### **Modelos por Custo (do mais barato ao mais caro):**

1. **Gemini** ⭐ **MAIS BARATO**
   - Melhor custo-benefício
   - Boa qualidade para a maioria das tarefas
   - Recomendado para uso diário

2. **GPT-4.1 / GPT-4 Turbo**
   - Custo médio
   - Boa qualidade
   - Bom equilíbrio

3. **Claude Sonnet 4**
   - Mais caro
   - Melhor qualidade para tarefas complexas
   - Use apenas quando necessário

4. **Auto** ⚠️ **PROBLEMA ATUAL**
   - Seleciona automaticamente o melhor modelo
   - **ANTES:** Funcionava bem e não consumia tanto
   - **AGORA:** Escolhe sempre modelos caros (Claude Sonnet/Opus)
   - **RESULTADO:** Consome crédito muito rápido
   - **POR QUÊ:** Política do Cursor mudou - "Auto" agora prioriza qualidade máxima (modelos caros)

### **Como Mudar o Modelo:**

#### **No Chat:**
1. Abra o Chat (`Cmd+L`)
2. Clique no **seletor de modelos** no topo
3. Escolha **"Gemini"** ou **"GPT-4.1"**
4. Salve como padrão se possível

#### **No Agent:**
1. Abra o Agent (`Ctrl+I`)
2. No menu suspenso, escolha um modo que use modelo mais barato
3. Ou configure modo personalizado com Gemini

#### **Configurações Globais:**
1. Pressione `Cmd+,` (Mac) ou `Ctrl+,` (Windows) para abrir Settings
2. Procure por "AI Model" ou "Default Model"
3. Defina **Gemini** como padrão
4. Salve as configurações

---

## 📈 3. PLANO PARA REDUZIR USO

### **Estratégia 1: Usar Tab Completions (Ilimitadas)**

✅ **O QUE FAZER:**
- Use Tab completions sempre que possível
- Elas são **100% ilimitadas** no plano Pro
- Funcionam enquanto você digita
- Não consomem crédito

❌ **O QUE EVITAR:**
- Não use Agent/Chat para coisas simples
- Tab completions resolvem 80% das tarefas

### **Estratégia 2: Otimizar Uso do Agent/Chat**

✅ **QUANDO USAR:**
- Apenas para tarefas complexas
- Quando Tab completions não são suficientes
- Para refatorações grandes
- Para explicações detalhadas

❌ **QUANDO NÃO USAR:**
- Para coisas simples (use Tab completions)
- Para perguntas rápidas (use Tab completions)
- Para completar código simples (use Tab completions)

### **Estratégia 3: Dividir Requisições Grandes**

⚠️ **PROBLEMA:**
- Requisições grandes (1-3 milhões de tokens) custam $0.30-$0.90 cada
- Uma requisição grande = várias pequenas

✅ **SOLUÇÃO:**
- Divida tarefas grandes em partes menores
- Faça várias requisições pequenas em vez de uma grande
- Exemplo:
  - ❌ "Refatore todo o arquivo" (1.5M tokens = $0.50)
  - ✅ "Refatore a função X" → "Refatore a função Y" (2x 300K = $0.20)

### **Estratégia 4: Monitorar Uso Diariamente**

1. **Acesse o Dashboard:**
   - https://cursor.com/dashboard?tab=usage
   - Verifique uso diário

2. **Meta Diária:**
   - $20/mês = ~$0.67/dia
   - Se passar de $1/dia, reduza uso

3. **Alertas:**
   - Configure limite de on-demand ($5-10)
   - Receba alerta quando se aproximar

### **Estratégia 5: Configurar Limites**

1. **No Dashboard:**
   - Acesse: https://cursor.com/dashboard?tab=usage
   - Clique em "Edit Limit" no card "On-Demand Usage"
   - Defina limite de $5-10/mês
   - Isso evita surpresas

2. **No Cursor:**
   - Settings → Usage
   - Configure alertas
   - Defina limites por modelo

---

## 📋 CHECKLIST DIÁRIO

### **Antes de Usar Agent/Chat:**
- [ ] Posso usar Tab completions? (Se sim, use!)
- [ ] É uma tarefa complexa que realmente precisa de Agent?
- [ ] Estou usando o modelo mais barato (Gemini)?
- [ ] Posso dividir em requisições menores?

### **Durante o Uso:**
- [ ] Estou fazendo requisições grandes desnecessárias?
- [ ] Posso ser mais específico na pergunta?
- [ ] Estou usando o modelo correto?

### **Depois do Uso:**
- [ ] Verifiquei o uso no dashboard?
- [ ] Estou dentro da meta diária ($0.67/dia)?
- [ ] Preciso ajustar algo?

---

## 🎯 META DE USO

### **Uso Ideal:**
- **Tab Completions:** 80-90% do uso (ilimitadas)
- **Agent/Chat:** 10-20% do uso (com modelo barato)
- **Modelo:** Gemini (mais barato)
- **Tamanho das requisições:** Pequenas a médias (< 500K tokens)

### **Uso Máximo Aceitável:**
- **$0.67/dia** = $20/mês
- **$1/dia** = $30/mês (aceitável)
- **$2/dia** = $60/mês (considere upgrade)

---

## 🚨 ALERTAS E LIMITES

### **Configurar Alertas:**
1. Dashboard → Settings → Alerts
2. Configure:
   - Alerta em $15/mês (75% do crédito)
   - Alerta em $19/mês (95% do crédito)
   - Limite de on-demand: $5-10/mês

### **Quando Receber Alerta:**
1. Pare de usar Agent/Chat
2. Use apenas Tab completions
3. Aguarde renovação do crédito

---

## 💡 DICAS EXTRAS

### **1. Use Tab Completions para:**
- Completar código simples
- Sugestões de variáveis/funções
- Correções de sintaxe
- Completar linhas

### **2. Use Agent/Chat apenas para:**
- Refatorações complexas
- Explicações detalhadas
- Debugging complexo
- Planejamento de arquitetura

### **3. Modelos Recomendados:**
- **Uso diário:** Gemini ⭐
- **Tarefas médias:** GPT-4.1
- **Tarefas complexas:** Claude Sonnet 4 (use com moderação)

### **4. Evite:**
- ❌ Modelo "Auto" (escolhe modelos caros)
- ❌ Requisições muito grandes
- ❌ Usar Agent para coisas simples

---

## 📊 MONITORAMENTO

### **Verificar Uso:**
1. **Dashboard:** https://cursor.com/dashboard?tab=usage
2. **No Cursor:** Settings → Usage
3. **Tabela "All Events":** Veja cada requisição

### **O que Verificar:**
- Quantas requisições por dia?
- Qual modelo está sendo usado?
- Tamanho médio das requisições?
- Custo por requisição?
- Total diário vs. meta ($0.67/dia)

---

## ⚠️ IMPORTANTE: MUDANÇA NA POLÍTICA DO CURSOR

### **O QUE MUDOU:**
- **ANTES:** Modelo "Auto" escolhia modelos econômicos, crédito durava o mês inteiro
- **AGORA:** Modelo "Auto" escolhe modelos caros, crédito acaba rápido

### **AÇÃO URGENTE:**
1. ✅ **Contate o suporte do Cursor** (veja arquivo `REIVINDICACAO-SUPORTE-CURSOR.md`)
2. ✅ **Explique a situação** - você usava muito antes e nunca teve problema
3. ✅ **Peça revisão** - pode ser bug ou mudança de política não comunicada

---

## 🔄 RESUMO RÁPIDO

1. ✅ **Contate suporte** (URGENTE - pode ser bug)
2. ✅ **Mude o modelo para Gemini** (solução temporária)
3. ✅ **Use Tab completions** sempre que possível (ilimitadas)
4. ✅ **Use Agent/Chat** apenas quando necessário
5. ✅ **Divida requisições grandes** em menores
6. ✅ **Monitore uso diário** no dashboard
7. ✅ **Configure limites** de on-demand
8. ✅ **Meta:** $0.67/dia = $20/mês

---

## 📞 PRÓXIMOS PASSOS

1. **Agora:** Verifique qual modelo está usando
2. **Agora:** Mude para Gemini
3. **Hoje:** Configure limite de on-demand
4. **Diariamente:** Monitore uso no dashboard
5. **Sempre:** Prefira Tab completions

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0

