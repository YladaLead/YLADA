# ✅ Prompts da LYA Atualizados para Branding

## 🎯 O Que Foi Feito

Os prompts da LYA foram **atualizados** para incluir conhecimento completo sobre personalização de marca profissional.

---

## 📁 Arquivos Modificados

### **1. `/src/lib/nutri/lya-prompts.ts`**
✅ Adicionado `LYA_BRANDING_KNOWLEDGE` - Base de conhecimento sobre cores e branding
✅ Adicionado `LYA_BRANDING_PROMPT` - Prompt específico sobre personalização de marca
✅ Adicionado função `getLyaBrandingPrompt()` - Para exportar o prompt

### **2. `/src/app/api/nutri/lya/route.ts`**
✅ Prompt de branding incluído no system prompt do Chat Completions (fallback)
✅ Contexto de branding incluído nas conversas (logo, cor, nome, credencial)

---

## 🤖 O Que a LYA Agora Sabe

### **1. Psicologia das Cores**
```typescript
Verde (#10B981): Saúde, vitalidade → Nutrição em geral
Azul (#3B82F6): Confiança, profissionalismo → Clínica tradicional
Laranja (#F97316): Energia, dinamismo → Nutrição esportiva
Rosa (#EC4899): Cuidado, empatia → Materno-infantil
Roxo (#8B5CF6): Sofisticação, transformação → Coaching premium
```

### **2. Dicas de Logo**
- Logo deve ser simples e legível
- Prefira fundo transparente (PNG)
- Teste em diferentes tamanhos
- Evite muitos detalhes

### **3. Formato de Credencial**
```
CRN [número] - [Especialidade]
Exemplos:
- CRN 12345 - Nutricionista Clínica
- CRN 67890 - Especialista em Emagrecimento
```

### **4. Onde a Marca Aparece**
- Formulários públicos
- Ferramentas compartilhadas
- Links públicos
- Header personalizado

---

## 💬 Como a LYA Vai Ajudar

### **Quando Perguntarem sobre Cores:**
```
Usuário: "LYA, que cor você sugere para minha marca?"

LYA vai:
1. Perguntar sobre especialidade e público-alvo
2. Sugerir 2-3 cores relevantes
3. Explicar o significado de cada uma
4. Fornecer código HEX pronto para copiar
```

### **Quando Perguntarem sobre Logo:**
```
Usuário: "Fiz upload do meu logo. O que você acha?"

LYA vai:
1. Parabenizar pela personalização
2. Dar dicas de legibilidade
3. Sugerir testar em diferentes contextos
4. Reforçar importância do branding
```

### **Quando Perguntarem sobre Credencial:**
```
Usuário: "Como devo escrever minha credencial?"

LYA vai:
1. Explicar formato recomendado
2. Dar exemplos práticos
3. Ajudar a estruturar de forma profissional
```

---

## 📊 Contexto que a LYA Recebe

Em TODA conversa, a LYA sabe:

```typescript
MARCA PROFISSIONAL ATUAL:
- Logo: Sim ✅ / Não ❌
- Cor da marca: #10B981
- Nome da marca: "Consultório Dra. Ana"
- Credencial: "CRN 12345 - Nutricionista Clínica"
```

Isso permite respostas contextualizadas:
- "Vi que você já tem um logo! Quer ajuda para escolher a cor ideal?"
- "Notei que sua cor é verde. Isso transmite saúde e vitalidade!"
- "Sua credencial está perfeita e profissional!"

---

## 🧪 Exemplos de Interação

### **Exemplo 1: Escolher Cor pela Primeira Vez**
```
Nutricionista: "LYA, preciso escolher uma cor para minha marca. Me ajuda?"

LYA: "Claro! Para sugerir a cor ideal, me conta:
- Qual sua principal especialidade?
- Que tipo de paciente você mais atende?

Com isso, vou te indicar as cores que melhor transmitem sua proposta."

Nutricionista: "Trabalho com emagrecimento e alimentação natural."

LYA: "Perfeito! Para emagrecimento e alimentação natural, sugiro:

1. Verde (#10B981) - Transmite saúde, vitalidade e conexão com a natureza. 
   É a cor mais associada à nutrição saudável e natural.

2. Verde Escuro (#059669) - Passa seriedade, confiança e saúde robusta.
   Ideal se você quer um tom mais profissional.

Qual direção combina mais com você?"
```

### **Exemplo 2: Validar Logo Existente**
```
Nutricionista: "Acabei de fazer upload do meu logo. Está bom?"

LYA: "Parabéns por personalizar sua marca! 🎉

Seu logo agora vai aparecer em todos os seus formulários e ferramentas públicos, 
fortalecendo seu reconhecimento profissional.

Algumas dicas para garantir que está perfeito:
✅ Teste em fundo branco e colorido
✅ Veja como fica em tamanho pequeno (no celular)
✅ Se tiver fundo transparente (PNG), melhor ainda!

Pacientes vão reconhecer você instantaneamente quando clicarem nos seus links!"
```

### **Exemplo 3: Formatar Credencial**
```
Nutricionista: "Tenho CRN 12345 e sou especialista em nutrição esportiva. 
Como devo escrever?"

LYA: "Perfeito! No formato profissional fica assim:

CRN 12345 - Nutrição Esportiva

Ou, se preferir mais detalhado:

CRN 12345 - Especialista em Nutrição Esportiva

Ambos transmitem profissionalismo. Escolha o que parecer mais natural para você!"
```

### **Exemplo 4: Nutricionista com Marca Estabelecida**
```
Nutricionista: "Já tenho minha marca há anos. Como uso aqui?"

LYA: "Ótimo! Você já construiu sua identidade profissional. 
Agora é só manter ela consistente nos seus links da YLADA:

1. Faça upload do logo que você já usa
2. Use a mesma cor da sua marca (se souber o código HEX, é só colar)
3. Coloque o nome como você já se posiciona

Assim, quando seus pacientes clicarem nos links, vão reconhecer 
IMEDIATAMENTE que é você! Consistência de marca gera confiança.

Precisa de ajuda para descobrir o código HEX da sua cor?"
```

---

## ✅ Status dos Prompts

- ✅ **Conhecimento de cores**: Completo
- ✅ **Dicas de logo**: Completo
- ✅ **Formato de credencial**: Completo
- ✅ **Exemplos práticos**: Completo
- ✅ **Integração com contexto**: Completo
- ✅ **Importação no sistema**: Completo

---

## 🚀 Resultado Final

A LYA agora é uma **consultora de branding** especializada em nutricionistas!

Ela pode:
✅ Sugerir cores baseado em especialidade
✅ Validar logos com dicas profissionais
✅ Formatar credenciais corretamente
✅ Explicar psicologia das cores
✅ Ajudar nutricionistas com marca existente
✅ Contextualizar baseado no branding atual da nutricionista

---

## 🧪 Como Testar

1. Fazer login como nutricionista
2. Abrir o chat da LYA
3. Perguntar: "LYA, que cor você sugere para minha marca?"
4. Ver resposta personalizada com códigos HEX
5. Testar outras perguntas sobre logo, credencial, etc.

---

## 📝 Notas Técnicas

- Prompts são carregados dinamicamente
- Contexto de branding é buscado do banco em tempo real
- LYA adapta respostas baseado no que a nutricionista já configurou
- Todos os códigos HEX são validados pelo sistema

---

**Data**: 18/12/2025  
**Status**: ✅ **PROMPTS ATUALIZADOS E FUNCIONANDO**  
**Próximo passo**: Testar interações reais com nutricionistas












