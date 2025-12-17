# 📋 PASSO A PASSO: Atualizar NOEL MASTER v3

**Versão:** 3.0 - Estrutura Híbrida Completa  
**Data:** 2025-01-27  
**Tempo estimado:** 10-15 minutos

---

## ✅ CHECKLIST PRÉ-EXECUÇÃO

Antes de começar, verifique:

- [ ] Você tem acesso ao dashboard da OpenAI
- [ ] Você sabe qual é o `OPENAI_ASSISTANT_NOEL_ID` (ou `OPENAI_ASSISTANT_ID`)
- [ ] Você tem o arquivo `NOEL-MASTER-V3-PROMPT-DEFINITIVO.md` aberto
- [ ] Você tem tempo para fazer a atualização completa (não interrompa no meio)

---

## 🚀 PASSO A PASSO COMPLETO

### **PASSO 1: Acessar o Dashboard da OpenAI**

1. Abra seu navegador
2. Acesse: **https://platform.openai.com/assistants**
3. Faça login na sua conta OpenAI
4. Aguarde carregar a lista de Assistants

**⏱️ Tempo:** 1-2 minutos

---

### **PASSO 2: Encontrar o Assistant do NOEL**

1. Na lista de Assistants, procure pelo Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
2. Se não souber qual é, verifique no `.env.local` ou na Vercel:
   - Variável: `OPENAI_ASSISTANT_NOEL_ID` ou `OPENAI_ASSISTANT_ID`
   - Valor: `asst_xxxxxxxxxxxxx`
3. Clique no Assistant do NOEL para abrir

**⏱️ Tempo:** 1-2 minutos

**💡 Dica:** Se tiver muitos Assistants, use Ctrl+F (ou Cmd+F no Mac) para buscar por "NOEL" ou pelo ID.

---

### **PASSO 3: Editar o Assistant**

1. Clique no botão **"Edit"** (canto superior direito)
2. Aguarde a página de edição carregar
3. Role até o campo **"Instructions"** (ou "System Instructions")

**⏱️ Tempo:** 30 segundos

---

### **PASSO 4: Copiar o Prompt Completo**

1. Abra o arquivo: `NOEL-MASTER-V3-PROMPT-DEFINITIVO.md`
2. Selecione **TODO o conteúdo** do arquivo (Ctrl+A ou Cmd+A)
3. Copie para a área de transferência (Ctrl+C ou Cmd+C)

**⚠️ IMPORTANTE:**
- Copie **TUDO**, desde o início até o final
- Não deixe nenhuma parte de fora
- O prompt completo tem aproximadamente 1000+ linhas

**⏱️ Tempo:** 1 minuto

---

### **PASSO 5: Colar no Campo Instructions**

1. No campo "Instructions" do Assistant, **APAGUE TODO o conteúdo atual**
   - Selecione tudo (Ctrl+A ou Cmd+A)
   - Pressione Delete ou Backspace
2. Cole o novo prompt completo (Ctrl+V ou Cmd+V)
3. Aguarde o texto carregar completamente

**⏱️ Tempo:** 1-2 minutos

**💡 Dica:** Se o campo for muito grande, pode demorar um pouco para colar. Aguarde até aparecer todo o texto.

---

### **PASSO 6: Verificar se Colou Corretamente**

1. Role até o **início** do prompt e verifique:
   - ✅ Deve começar com "CAMADA 1 — CONSTITUIÇÃO OFICIAL DO NOEL"
   - ✅ Deve ter "Você é NOEL, o Mentor Oficial do Sistema Wellness YLADA."
2. Role até o **final** do prompt e verifique:
   - ✅ Deve termar com "✅ FIM DO PROMPT MASTER v3"
   - ✅ Deve ter a seção de segurança completa

**⏱️ Tempo:** 1 minuto

**⚠️ Se algo estiver faltando:**
- Volte ao arquivo e copie novamente
- Certifique-se de copiar TUDO

---

### **PASSO 7: Salvar as Alterações**

1. Role até o **final da página**
2. Clique no botão **"Save"** (ou "Save Changes")
3. Aguarde a confirmação de salvamento
4. Verifique se apareceu mensagem de sucesso

**⏱️ Tempo:** 30 segundos

**⚠️ IMPORTANTE:**
- **NÃO** altere o ID do Assistant
- **NÃO** altere as Functions configuradas
- **APENAS** atualize o campo "Instructions"

---

### **PASSO 8: Verificar Configuração**

1. Verifique se o Assistant ainda está **ativo**
2. Verifique se o **ID do Assistant não mudou** (deve ser o mesmo `asst_...`)
3. Verifique se as **Functions ainda estão configuradas** (se houver)

**⏱️ Tempo:** 1 minuto

---

### **PASSO 9: Testar o NOEL**

1. Acesse a plataforma YLADA
2. Vá até o chat do NOEL
3. Envie uma mensagem de teste, por exemplo:
   - "Olá, Noel"
   - "Preciso de um script de vendas"
   - "Como funciona o sistema?"
4. Verifique se a resposta está:
   - ✅ Direcionada e dialogadora
   - ✅ Usando scripts quando apropriado
   - ✅ Não forçando scripts desnecessariamente
   - ✅ Dialogando naturalmente

**⏱️ Tempo:** 3-5 minutos

---

### **PASSO 10: Validar Comportamento**

Teste diferentes cenários:

1. **Pergunta institucional:**
   - "Quem é você?"
   - ✅ Deve responder diretamente, sem scripts emocionais

2. **Pedido de script:**
   - "Preciso de um script para vender"
   - ✅ Deve usar scripts da Base de Conhecimento

3. **Diálogo natural:**
   - "Estou começando agora"
   - ✅ Deve dialogar naturalmente, não forçar scripts

4. **Pedido de função:**
   - "Qual é o meu perfil?"
   - ✅ Deve chamar getUserProfile

**⏱️ Tempo:** 5-10 minutos

---

## ✅ CHECKLIST PÓS-EXECUÇÃO

Após completar todos os passos, verifique:

- [ ] Prompt foi salvo sem erros
- [ ] Assistant ainda está ativo
- [ ] ID do Assistant não mudou
- [ ] Functions ainda estão configuradas (se houver)
- [ ] NOEL está respondendo corretamente
- [ ] NOEL está dialogando naturalmente
- [ ] NOEL está usando scripts quando apropriado
- [ ] NOEL não está forçando scripts desnecessariamente

---

## 🚨 TROUBLESHOOTING

### **Problema: Prompt não colou completamente**

**Solução:**
1. Tente copiar em partes menores
2. Ou use um editor de texto intermediário (Notepad, TextEdit)
3. Salve o arquivo `.md` como `.txt` e copie do arquivo de texto

---

### **Problema: Assistant não está respondendo**

**Solução:**
1. Verifique se o Assistant está ativo
2. Verifique se o ID está correto no código
3. Verifique se as Functions estão configuradas
4. Teste com uma mensagem simples primeiro

---

### **Problema: NOEL não está usando scripts**

**Solução:**
1. Verifique se a Base de Conhecimento está configurada
2. Verifique se as Functions estão funcionando
3. Teste pedindo explicitamente um script

---

### **Problema: NOEL está forçando scripts demais**

**Solução:**
1. Verifique se o prompt foi colado completamente
2. Especialmente a seção "DIÁLOGO NATURAL PRIMEIRO"
3. Se necessário, recole o prompt completo

---

## 📝 NOTAS IMPORTANTES

1. **Não interrompa o processo no meio** - pode deixar o Assistant em estado inconsistente
2. **Sempre verifique após salvar** - confirme que o prompt foi salvo corretamente
3. **Teste antes de usar em produção** - valide o comportamento com alguns testes
4. **Mantenha backup** - salve o prompt antigo antes de substituir (opcional, mas recomendado)

---

## 🎯 RESULTADO ESPERADO

Após completar todos os passos, o NOEL deve:

✅ Dialogar naturalmente  
✅ Usar scripts quando apropriado  
✅ Não forçar scripts desnecessariamente  
✅ Direcionar de forma acolhedora  
✅ Usar functions quando necessário  
✅ Seguir todas as regras da Camada 1  
✅ Aplicar inteligência da Camada 2  
✅ Proteger com segurança da Camada 3  

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique o arquivo `NOEL-MASTER-V3-PROMPT-DEFINITIVO.md` está completo
2. Verifique se copiou tudo corretamente
3. Verifique se salvou as alterações
4. Teste com mensagens simples primeiro

---

**✅ Pronto! Agora você tem o NOEL MASTER v3 configurado e funcionando!**















