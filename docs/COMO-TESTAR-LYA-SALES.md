# 🧪 Como Testar a LYA Sales - Página de Vendas

## 🎯 Objetivo
Verificar se a LYA da página de vendas está funcionando corretamente para:
- ✅ Tirar dúvidas de visitantes que estão conhecendo a plataforma
- ✅ Fazer fechamento de assinaturas (conduzir para checkout)
- ✅ Responder objeções comuns
- ✅ Apresentar valor da plataforma

---

## 📋 Pré-requisitos

### 1. Verificar Configuração

#### **Variáveis de Ambiente**
Verifique se está configurado no `.env.local`:

```bash
# Opção 1: Assistant específico de vendas (RECOMENDADO)
OPENAI_ASSISTANT_LYA_SALES_ID=asst_xxxxxxxxxxxxx

# Opção 2: Fallback (usa o Assistant geral)
OPENAI_ASSISTANT_LYA_ID=asst_xxxxxxxxxxxxx
```

**Como verificar:**
1. Abra o terminal no projeto
2. Execute: `grep -E "OPENAI_ASSISTANT.*ID" .env.local`
3. Deve aparecer pelo menos um dos IDs acima

#### **Criar Assistant no OpenAI (se não tiver)**

1. Acesse: https://platform.openai.com/assistants
2. Clique em **"Create Assistant"**
3. Configure:
   - **Name:** `LYA Sales - YLADA Nutri`
   - **Model:** `gpt-4-turbo` ou `gpt-4o`
   - **Instructions:** Cole o conteúdo de `docs/LYA-SALES-PROMPT.md` (linhas 18-144)
4. Copie o **Assistant ID** (começa com `asst_`)
5. Adicione no `.env.local` como `OPENAI_ASSISTANT_LYA_SALES_ID`

---

## 🚀 Teste Passo a Passo

### **TESTE 1: Acessar Página de Vendas**

1. **Acesse:** `http://localhost:3000/pt/nutri`
   - Ou em produção: `https://www.ylada.com/pt/nutri`

2. **Verificar se o botão aparece:**
   - Deve ter um botão fixo no canto inferior direito
   - Texto: "💬 Tirar dúvida com uma consultora"
   - Cor: Azul (`#0B57FF`)

3. **Clicar no botão:**
   - Deve abrir o widget do chat
   - Header azul com "LYA - Tire suas dúvidas"
   - Mensagem inicial da LYA deve aparecer

**✅ Resultado esperado:**
```
✅ Botão visível e clicável
✅ Widget abre corretamente
✅ Mensagem inicial aparece
```

---

### **TESTE 2: Verificar Mensagem Inicial**

Ao abrir o widget, a LYA deve enviar uma mensagem de boas-vindas.

**Mensagem esperada:**
```
"Olá! Sou a LYA, mentora empresarial da YLADA Nutri. 
Estou aqui para te ajudar a entender como a plataforma 
pode transformar sua carreira como Nutri-Empresária. 
O que você gostaria de saber?"
```

**Verificar:**
- [ ] Mensagem aparece automaticamente
- [ ] Tom é acolhedor e profissional
- [ ] Menciona "Nutri-Empresária"
- [ ] Convida para fazer perguntas

---

### **TESTE 3: Testar Perguntas Básicas**

#### **3.1. "Como funciona a plataforma?"**

**Enviar:** `Como funciona a plataforma?`

**Resposta esperada deve incluir:**
- ✅ Explicação clara do que é a YLADA Nutri
- ✅ Diferenciais principais
- ✅ Como transforma a carreira
- ✅ Call-to-action (convite para checkout ou mais informações)

**Exemplo de resposta válida:**
```
"A YLADA Nutri é a plataforma completa que transforma 
nutricionistas em Nutri-Empresárias. Ela oferece:

• Ferramentas de captação automática de clientes
• Gestão profissional completa
• Formação empresarial
• Mentoria estratégica (eu, a LYA!)
• Suporte e comunidade

Tudo isso para você construir uma carreira organizada, 
lucrativa e segura. Quer que eu te mostre como começar?"
```

---

#### **3.2. "Quanto custa?"**

**Enviar:** `Quanto custa?`

**Resposta esperada deve incluir:**
- ✅ Preços dos planos (Anual e Mensal)
- ✅ Comparação de valor
- ✅ Benefícios incluídos
- ✅ Garantia de 7 dias
- ✅ Call-to-action para checkout

**Exemplo de resposta válida:**
```
"Temos dois planos:

• Plano Anual Fidelidade: 12x de R$ 197
  - Economia clara
  - Compromisso com transformação

• Plano Mensal Flexível: R$ 297/mês
  - Sem fidelização
  - Pode cancelar quando quiser

Ambos incluem tudo: ferramentas, gestão, formação 
completa e suporte. E temos garantia incondicional 
de 7 dias!

Quer que eu te ajude a escolher o melhor plano?"
```

---

#### **3.3. "Quais são os benefícios?"**

**Enviar:** `Quais são os benefícios?`

**Resposta esperada deve incluir:**
- ✅ Lista de benefícios concretos
- ✅ Transformação prometida
- ✅ Resultados reais
- ✅ Diferenciais da plataforma

---

#### **3.4. "Tenho dúvidas sobre a Formação"**

**Enviar:** `Tenho dúvidas sobre a Formação`

**Resposta esperada deve incluir:**
- ✅ Explicação sobre a Formação Empresarial
- ✅ O que está incluído
- ✅ Como funciona
- ✅ Valor agregado

---

### **TESTE 4: Testar Objeções Comuns**

#### **4.1. Objeção de Preço**

**Enviar:** `É muito caro para mim`

**Resposta esperada:**
- ✅ Não ser defensiva
- ✅ Apresentar valor (ROI)
- ✅ Comparar com alternativas
- ✅ Oferecer garantia
- ✅ Manter tom consultivo

**Exemplo válido:**
```
"Entendo sua preocupação. Vamos pensar no valor:

Por menos de R$ 200/mês no plano anual, você tem:
• Ferramentas de captação (que geram clientes)
• Gestão profissional completa
• Formação empresarial (R$ 970 sozinha)
• Suporte dedicado

É menos que uma consulta individual, mas te dá 
estrutura para crescer consistentemente. E temos 
garantia de 7 dias - se não valer a pena, 
devolvemos 100%.

Quer que eu te mostre como outras nutricionistas 
transformaram suas carreiras?"
```

---

#### **4.2. "Preciso pensar"**

**Enviar:** `Preciso pensar melhor`

**Resposta esperada:**
- ✅ Respeitar o tempo de decisão
- ✅ Oferecer informações adicionais
- ✅ Criar urgência positiva (sem pressão)
- ✅ Manter contato aberto

---

#### **4.3. "Já tenho outras ferramentas"**

**Enviar:** `Já uso outras ferramentas`

**Resposta esperada:**
- ✅ Entender o que já usa
- ✅ Apresentar diferenciais da YLADA
- ✅ Mostrar integração/complemento
- ✅ Focar em valor agregado

---

### **TESTE 5: Verificar Fechamento de Assinatura**

#### **5.1. Testar Call-to-Action**

Após algumas perguntas, a LYA deve naturalmente conduzir para o checkout.

**Verificar se a LYA:**
- [ ] Menciona checkout/compra naturalmente
- [ ] Oferece ajuda no processo
- [ ] Não é agressiva
- [ ] Cria urgência positiva (sem pressão)

**Exemplos de CTAs válidos:**
```
"Quer que eu te ajude a começar agora mesmo? 
O checkout é rápido e seguro."

"Se quiser, posso te guiar no processo de compra. 
É bem simples!"

"Quer que eu te mostre como funciona o checkout?"
```

---

#### **5.2. Testar Fluxo Completo**

1. Abrir widget
2. Fazer 3-4 perguntas
3. Verificar se LYA conduz para checkout
4. Clicar em qualquer link de checkout (se houver)
5. Verificar se redireciona para `/pt/nutri#oferta` ou checkout

---

### **TESTE 6: Verificar Console e Logs**

#### **6.1. Abrir Console do Navegador**

1. Pressione `F12` ou `Cmd+Option+I` (Mac)
2. Vá na aba **Console**
3. Envie uma mensagem no chat
4. Verifique os logs

**Logs esperados:**
```
🚀 [LYA Sales] ==========================================
🚀 [LYA Sales] ENDPOINT /api/nutri/lya/sales CHAMADO
🔍 [LYA Sales] OPENAI_ASSISTANT_LYA_SALES_ID: ✅ Configurado
📝 [LYA Sales] Mensagem recebida: ...
✅ [LYA Sales] ASSISTANTS API RETORNOU RESPOSTA
```

**Se aparecer erro:**
- Verifique se `OPENAI_ASSISTANT_LYA_SALES_ID` está configurado
- Verifique se a API key da OpenAI está válida
- Verifique logs do servidor (terminal onde roda `npm run dev`)

---

#### **6.2. Verificar Network Tab**

1. Abra **DevTools** → **Network**
2. Filtre por: `sales`
3. Envie uma mensagem
4. Clique na requisição `POST /api/nutri/lya/sales`

**Verificar:**
- [ ] Status: `200 OK`
- [ ] Response tem `response` e `threadId`
- [ ] Tempo de resposta < 10 segundos

**Se der erro 500:**
- Verifique logs do servidor
- Verifique variáveis de ambiente
- Verifique se Assistant ID está correto

---

### **TESTE 7: Testar Botões de Ação Rápida**

Ao abrir o widget, devem aparecer botões de ação rápida:

- [ ] "Como funciona a plataforma?"
- [ ] "Quais são os benefícios?"
- [ ] "Quanto custa?"
- [ ] "Tenho dúvidas sobre a Formação"

**Testar:**
1. Clicar em cada botão
2. Verificar se envia a mensagem
3. Verificar se LYA responde adequadamente

---

### **TESTE 8: Verificar Histórico de Conversa**

1. Envie 3-4 mensagens
2. Feche o widget
3. Abra novamente
4. Verificar se mantém o histórico

**Nota:** Atualmente o histórico é mantido apenas durante a sessão (até fechar o navegador). O `threadId` é usado para manter contexto.

---

## 🔍 Checklist Completo

### **Configuração**
- [ ] `OPENAI_ASSISTANT_LYA_SALES_ID` configurado OU
- [ ] `OPENAI_ASSISTANT_LYA_ID` configurado (fallback)
- [ ] Assistant criado no OpenAI com prompt correto
- [ ] Variáveis de ambiente carregadas (reiniciar servidor se necessário)

### **Interface**
- [ ] Botão aparece na página de vendas
- [ ] Widget abre ao clicar
- [ ] Cores azuis (não roxo)
- [ ] Mensagem inicial aparece
- [ ] Botões de ação rápida funcionam

### **Funcionalidade**
- [ ] LYA responde perguntas básicas
- [ ] LYA responde objeções adequadamente
- [ ] LYA conduz para checkout naturalmente
- [ ] Histórico mantido durante sessão
- [ ] Loading aparece durante processamento
- [ ] Erros são tratados graciosamente

### **Conteúdo**
- [ ] Respostas são relevantes
- [ ] Tom é consultivo (não agressivo)
- [ ] Menciona benefícios e valor
- [ ] Inclui call-to-action quando apropriado
- [ ] Respeita tempo de decisão

---

## 🐛 Troubleshooting

### **Erro: "Erro ao enviar mensagem"**

**Possíveis causas:**
1. Assistant ID não configurado
2. API key da OpenAI inválida
3. Rate limit da OpenAI atingido
4. Erro no servidor

**Solução:**
1. Verificar console do navegador (F12)
2. Verificar logs do servidor
3. Verificar variáveis de ambiente
4. Testar API key da OpenAI

---

### **LYA não responde ou demora muito**

**Possíveis causas:**
1. Assistant ID incorreto
2. Model muito lento
3. Rate limit

**Solução:**
1. Verificar logs do servidor
2. Verificar se Assistant está ativo no OpenAI
3. Considerar usar `gpt-4o-mini` para respostas mais rápidas

---

### **Respostas não estão focadas em vendas**

**Possíveis causas:**
1. Usando Assistant errado (LYA interna ao invés de Sales)
2. System prompt não configurado corretamente

**Solução:**
1. Verificar se `OPENAI_ASSISTANT_LYA_SALES_ID` está configurado
2. Verificar System Prompt do Assistant no OpenAI
3. Comparar com `docs/LYA-SALES-PROMPT.md`

---

## 📊 Métricas para Acompanhar

Após implementar, acompanhe:

1. **Taxa de abertura:** % de visitantes que abrem o chat
2. **Taxa de conversão:** % de chats que resultam em checkout
3. **Perguntas mais comuns:** Para melhorar respostas
4. **Objeções mais frequentes:** Para criar argumentações melhores
5. **Tempo médio de conversa:** Para otimizar experiência

---

## ✅ Conclusão

Se todos os testes passarem, a LYA Sales está funcionando corretamente e pronta para:
- ✅ Atender visitantes na página de vendas
- ✅ Responder dúvidas sobre a plataforma
- ✅ Conduzir naturalmente para fechamento de assinaturas
- ✅ Criar uma experiência positiva de vendas

---

**Última atualização:** 2024-12-16
**Versão:** 1.0.0




