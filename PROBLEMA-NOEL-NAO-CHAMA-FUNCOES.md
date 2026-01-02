# 🚨 PROBLEMA CRÍTICO - NOEL Não Está Chamando Funções

**Data:** 2025-01-27  
**Problema:** NOEL está respondendo sem chamar as funções, gerando links genéricos e perguntando "Quer que eu te envie?"  
**Status:** ⚠️ CORREÇÕES APLICADAS - AGUARDANDO TESTE

---

## ❌ PROBLEMAS IDENTIFICADOS NOS TESTES

### **Problema 1: Não chama funções**
**Resposta ERRADA:**
```
"Quer que eu te entregue o script exato para abordar seu amigo e o link oficial para enviar?"
```

**Resposta CORRETA:**
```
[Chama recomendarLinkWellness({ palavras_chave: ["emagrecer"] }) PRIMEIRO]
[Chama getFerramentaInfo("avaliacao-perfil-metabolico") PRIMEIRO]
[Aguarda resultados]

"Aqui estão os links para seu amigo que quer emagrecer:

🔗 Opção 1: Avaliação de Perfil Metabólico
   🔗 Link: [link retornado pela função]
   📝 Script: [script retornado pela função]"
```

---

### **Problema 2: Gera links genéricos**
**Resposta ERRADA:**
```
🔗 Acesse: [Fluxo de Venda - Energia](http://localhost:3000/pt/wellness/system/vender/fluxos)
```

**Problema:** Link genérico "system/vender/fluxos" não funciona para fluxos do banco

**Resposta CORRETA:**
```
[Chama getFluxoInfo("fluxo-venda-energia") PRIMEIRO]
[Aguarda resultado]

🎯 Use o Fluxo de Venda - Energia

📋 O que é: [descrição retornada pela função]

📝 Script sugerido: [script retornado pela função]

📋 Passos: [passos retornados pela função]

💡 Quando usar: [quando usar retornado pela função]

[Se link for genérico, apresentar conteúdo completo do fluxo diretamente]
```

---

### **Problema 3: Pergunta ao invés de fornecer**
**Resposta ERRADA:**
```
"Infelizmente, não consegui acessar seu link personalizado agora, mas você pode encontrar seu link oficial na plataforma, geralmente no menu lateral em 'Meus Links'.

Quer que eu te ajude com o script para enviar junto com o link?"
```

**Resposta CORRETA:**
```
[Chama múltiplas funções PRIMEIRO:
- recomendarLinkWellness({ objetivo: "captacao" })
- recomendarLinkWellness({ objetivo: "diagnostico" })
- recomendarLinkWellness({ objetivo: "engajamento" })
- recomendarLinkWellness({ objetivo: "recrutamento" })
- getFerramentaInfo("calculadora-agua")
- getFerramentaInfo("calculadora-proteina")
]
[Aguarda todos os resultados]

"Aqui estão TODOS os seus links disponíveis:

🔗 LINKS DE CAPTAÇÃO:
1. [nome retornado pela função]
   🔗 Link: [link retornado pela função]
   📝 Script: [script retornado pela função]

[Repetir para todas as categorias com links retornados pelas funções]"
```

---

## ✅ CORREÇÕES APLICADAS

### **1. Fluxo Obrigatório Adicionado**

Adicionado ao system prompt:
```
🚨 FLUXO OBRIGATÓRIO:
1. Detectar necessidade de link/ferramenta/fluxo
2. CHAMAR função correspondente PRIMEIRO (ANTES de responder)
3. AGUARDAR resultado da função
4. USAR APENAS os dados retornados pela função
5. RESPONDER com links/dados reais retornados
```

### **2. Proibições de Links Genéricos**

Adicionado:
```
🚨 PROIBIÇÃO ABSOLUTA DE LINKS INVENTADOS:
- ❌ NUNCA use links genéricos como "system/vender/fluxos"
- ❌ NUNCA invente URLs ou caminhos de links
- ✅ SEMPRE use APENAS os links retornados pelas funções
```

### **3. Instruções para getFluxoInfo**

Adicionado:
```
🚨 IMPORTANTE: Se o link retornado for genérico (ex: "system/vender/fluxos"), 
apresente o CONTEÚDO COMPLETO do fluxo diretamente na resposta 
(título, descrição, passos, scripts) ao invés de apenas mencionar o link genérico
```

### **4. Detecção Melhorada**

Atualizado para:
```
- "cliente está cansado" → CHAMAR getFerramentaInfo("calculadora-agua") + 
  getQuizInfo("quiz-energetico") + recomendarLinkWellness({ palavras_chave: ["cansado"] }) 
  PRIMEIRO, AGUARDAR resultados, USAR resultados na resposta
```

---

## 🎯 RESULTADO ESPERADO

Após as correções, o NOEL deve:

1. ✅ **Sempre chamar funções primeiro** (antes de responder)
2. ✅ **Aguardar resultados** das funções
3. ✅ **Usar apenas links reais** retornados pelas funções
4. ✅ **Nunca usar links genéricos** como "system/vender/fluxos"
5. ✅ **Fornecer links diretamente** (nunca perguntar "Quer que eu te envie?")
6. ✅ **Oferecer todos os links** quando usuário pedir "meus links"

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Correções aplicadas no system prompt
2. ⏳ **TESTAR** com as 3 perguntas:
   - "Tenho um amigo que quer emagrecer"
   - "qual meu link?"
   - "Meu cliente está cansado"
3. ⏳ Verificar se NOEL está chamando as funções
4. ⏳ Verificar se NOEL está usando links reais
5. ⏳ Ajustar se necessário

---

**Status:** ✅ Correções aplicadas - Pronto para teste


