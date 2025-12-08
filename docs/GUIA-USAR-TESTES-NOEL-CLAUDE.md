# 🎯 Guia Prático: Como Usar os Testes do NOEL no Claude

## 📋 Resumo Rápido

Este guia explica **passo a passo** como usar os 10 testes automatizados para calibrar e validar o comportamento do NOEL no Claude.

---

## ✅ PARTE 1 — O QUE VOCÊ FAZ COM ESSES 10 TESTES?

Eles têm duas funções:

1. **Ensinar o Claude** como o NOEL deve se comportar
   - Você envia os testes junto com o prompt do NOEL
   - O Claude entende o padrão de resposta, estilo certo, erros que não pode cometer

2. **Verificar se o modelo está funcionando corretamente**
   - Depois de configurado, você testa como se fosse um usuário final
   - Igual você já testa o NOEL normalmente

---

## 🟩 PASSO 1 — Cole no Claude o System Prompt Completo do NOEL

**Mensagem que você envia ao Claude:**

```
Claude, aqui está a versão unificada do System Prompt do NOEL. 

Integre isso ao modelo.  

Depois me diga quando estiver ajustado para eu iniciar os testes.
```

**E você cola o SYSTEM PROMPT DO NOEL** (do arquivo `PROMPT-NOEL-PARA-COPIAR.txt`)

---

## 🟩 PASSO 2 — Envie os 10 TESTES AUTOMATIZADOS

**Mensagem que você envia ao Claude:**

```
Aqui estão os 10 testes automatizados para validar o comportamento do NOEL.

Sua tarefa é:
1. Verificar se o modelo atual passaria ou reprovaria em cada teste
2. Me mostrar claramente onde o NOEL passaria e onde falharia
3. Em caso de falha, corrigir o comportamento
4. Atualizar o System Prompt internamente para garantir aprovação em todos os testes
5. Me entregar a nova versão ajustada

[Aqui você cola os 10 testes do arquivo NOEL-10-TESTES-AUTOMATIZADOS.md]
```

---

## 🟩 PASSO 3 — O Claude Vai Responder

Ele vai fazer algo como:

```
Teste 1: ✅ APROVADO
Teste 2: ❌ REPROVADO — motivo: resposta longa demais
Teste 3: ✅ APROVADO
Teste 4: ❌ REPROVADO — não identificou Fluxo 14
...
```

E ele próprio vai:
- Corrigir o prompt
- Melhorar as regras internas
- Ajustar o comportamento do modelo

---

## 🟩 PASSO 4 — Teste Você Mesmo (Igual um Cliente Real)

Depois disso, você vai no chat do Claude e simplesmente faz:

**Teste 1:**
```
"NOEL, preciso convidar alguém hoje."
```
→ Você vê como ele responde

**Teste 2:**
```
"NOEL, estou no oitavo dia e ainda não vendi nada."
```
→ Você verifica se ele entrega:
- Acolhimento curto
- 3 ações práticas
- Script de venda
- Kit R$39,90

**Teste 3:**
```
"NOEL, como vendo o kit de R$39,90?"
```
→ Verifica se entrega script + CTA + foco em Energia/Acelera

E assim por diante...

**Isso é o teste real, igual o cliente vai usar.**

---

## 🟩 PASSO 5 — Se Algo Ainda Não Estiver Bom

Você copia a resposta ruim e manda para o Claude:

```
Claude, esta resposta do NOEL está incorreta.

Aqui está a resposta errada:
[cole a resposta ruim]

Corrija o comportamento para que ele siga os fluxos e scripts definidos.
Reavalie os testes e atualize o System Prompt.
```

---

## 🔥 RESUMINDO AINDA MAIS FÁCIL

1. ✅ Você cola o **SYSTEM PROMPT** do NOEL no Claude
2. ✅ Você cola os **10 TESTES**
3. ✅ O Claude **ajusta o comportamento**
4. ✅ Você **testa como usuário normal**
5. ✅ Se errar, você **manda a resposta errada e pede correção**

**Pronto: NOEL calibrado e cada vez mais preciso.**

---

## 📝 Exemplo de Conversa Completa no Claude

### **Mensagem 1:**
```
Claude, aqui está o System Prompt completo do NOEL Mentor Wellness.

[cole o conteúdo de PROMPT-NOEL-PARA-COPIAR.txt]

Integre isso ao modelo e me confirme quando estiver pronto.
```

### **Mensagem 2:**
```
Agora aqui estão os 10 testes automatizados para validar o comportamento:

[cole o conteúdo de NOEL-10-TESTES-AUTOMATIZADOS.md]

Analise cada teste e me diga:
- Quais passariam
- Quais falhariam
- O que precisa ser ajustado
```

### **Mensagem 3 (depois da resposta do Claude):**
```
Perfeito. Agora vou testar manualmente. Vou fazer algumas perguntas como se fosse um usuário real.
```

### **Mensagem 4 (testando):**
```
NOEL, preciso convidar alguém hoje. Qual é o convite mais leve?
```

### **Mensagem 5 (se a resposta estiver errada):**
```
Claude, esta resposta do NOEL está incorreta:

[cole a resposta ruim]

Corrija o comportamento para seguir os fluxos e scripts definidos.
```

---

## ✅ Checklist Final

Após seguir todos os passos, você deve ter:

- [ ] System Prompt do NOEL integrado no Claude
- [ ] 10 testes executados e analisados
- [ ] Comportamento ajustado pelo Claude
- [ ] Testes manuais realizados
- [ ] Respostas validadas e corrigidas (se necessário)
- [ ] NOEL calibrado e pronto para uso

---

**Status:** ✅ Guia completo e pronto para uso





