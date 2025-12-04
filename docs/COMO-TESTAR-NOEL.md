# 🧪 Como Testar o NOEL Wellness

## 🎯 Formas de Acessar o NOEL

### **1. Página Dedicada (Recomendado para Testes)**

**URL:** `/pt/wellness/noel`

**Acesso:**
- Faça login na área Wellness
- Acesse diretamente: `https://seu-dominio.com/pt/wellness/noel`
- Ou navegue pelo menu (se houver link)

**Características:**
- Página completa dedicada ao NOEL
- Interface limpa e focada
- Mostra metadata das respostas (módulo, fonte, tokens, etc.)
- Ideal para testes e desenvolvimento

---

### **2. Chat Widget Flutuante (Uso Normal)**

O NOEL está integrado no `WellnessChatWidget` que aparece em várias páginas:

**Páginas onde o widget aparece:**
- `/pt/wellness/dashboard` - Widget sem chatbot pré-selecionado (mostra seleção inicial)
- `/pt/wellness/system` - Widget com chatbot "Mentor" pré-selecionado
- `/pt/wellness/suporte` - Widget com chatbot "Noel" (suporte) pré-selecionado

**Como usar:**
1. Faça login na área Wellness
2. Acesse qualquer uma das páginas acima
3. Clique no botão flutuante de chat (canto inferior direito)
4. Selecione o chatbot desejado:
   - **Mentor** - Estratégias, vendas, motivação
   - **Suporte (Noel)** - Instruções técnicas

---

## 🔐 Requisitos para Acessar

### **Autenticação:**
- ✅ Deve estar logado na área Wellness
- ✅ Deve ter perfil `wellness` ou `admin`
- ✅ Protegido por `ProtectedRoute`

### **Assinatura:**
- Algumas funcionalidades podem exigir assinatura ativa
- Verifique se o usuário tem `subscription_status = 'active'`

---

## 🧪 Como Testar

### **Teste 1: Página Dedicada**

1. **Acesse:** `http://localhost:3000/pt/wellness/noel` (dev) ou `https://seu-dominio.com/pt/wellness/noel` (prod)

2. **Teste básico:**
   - Digite uma mensagem
   - Verifique se recebe resposta
   - Veja metadata (módulo detectado, fonte, tokens)

3. **Teste de módulos:**
   - Pergunta sobre vendas → Deve detectar módulo "mentor"
   - Pergunta sobre plataforma → Deve detectar módulo "suporte"
   - Pergunta sobre bebidas → Deve detectar módulo "tecnico"

### **Teste 2: Chat Widget**

1. **Acesse:** `/pt/wellness/dashboard`
2. **Clique no botão flutuante** (canto inferior direito)
3. **Selecione um chatbot:**
   - Teste "Mentor"
   - Teste "Suporte (Noel)"
4. **Envie mensagens** e verifique respostas

### **Teste 3: Integração com Base de Conhecimento**

1. **Envie perguntas que devem ter scripts:**
   - "Como fazer um convite?"
   - "Script de follow-up"
   - "Como preparar bebida funcional?"

2. **Verifique:**
   - Se usa script da base de conhecimento
   - Se personaliza com contexto do consultor
   - Se complementa com IA quando necessário

### **Teste 4: Análise de Histórico**

1. **Faça várias perguntas** (mínimo 5-10)
2. **Verifique se:**
   - Perfil do consultor é atualizado
   - Tópicos frequentes são identificados
   - Desafios são detectados
   - Estágio da carreira é calculado

---

## 🐛 Troubleshooting

### **Erro: "Não autorizado"**
- ✅ Verifique se está logado
- ✅ Verifique se tem perfil `wellness` ou `admin`
- ✅ Verifique token de autenticação

### **Erro: "Erro ao processar mensagem"**
- ✅ Verifique se `OPENAI_API_KEY` está configurada
- ✅ Verifique logs do servidor
- ✅ Verifique se base de conhecimento está populada

### **Respostas genéricas**
- ✅ Verifique se base de conhecimento tem scripts
- ✅ Verifique se embeddings foram gerados
- ✅ Verifique se consultor tem perfil criado

### **Widget não aparece**
- ✅ Verifique se está em página que tem o widget
- ✅ Verifique console do navegador para erros
- ✅ Verifique se componente está importado

---

## 📊 O Que Verificar nos Testes

### **Funcionalidades Básicas:**
- [ ] Mensagens são enviadas
- [ ] Respostas são recebidas
- [ ] Histórico é mantido
- [ ] Módulos são detectados corretamente

### **Integração:**
- [ ] Base de conhecimento é consultada
- [ ] Scripts são usados quando disponíveis
- [ ] Contexto do consultor é usado
- [ ] Análise de histórico funciona

### **Performance:**
- [ ] Respostas em < 3 segundos
- [ ] Sem erros no console
- [ ] Interface responsiva

---

## 🔗 Links Úteis

- **API NOEL:** `/api/wellness/noel`
- **API NOEL Responder:** `/api/wellness/noel/responder`
- **Página de Teste:** `/pt/wellness/noel`
- **Dashboard:** `/pt/wellness/dashboard`

---

**Status:** ✅ Pronto para testes!

