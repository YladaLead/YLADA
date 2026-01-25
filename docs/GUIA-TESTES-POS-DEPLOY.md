# 🧪 Guia de Testes Pós-Deploy

## ✅ Deploy Concluído

**Último deploy:** `FbeYsRzwp` - "fix: Remove seção de crons do vercel.json"  
**Status:** ✅ Ready (Production)  
**Data:** Agora

---

## 🎯 Testes Prioritários

### **1. Teste: Geração de Sessões do Workshop**

**Objetivo:** Verificar se a geração automática de sessões está funcionando.

**Passos:**
1. Acesse: `https://www.ylada.com/admin/whatsapp/workshop` (ou seu domínio)
2. Faça login como admin
3. Clique em **"🔄 Gerar Sessões Automáticas"**
4. Aguarde o processamento
5. **Verifique:**
   - ✅ Deve aparecer mensagem de sucesso
   - ✅ Deve mostrar quantas sessões foram criadas
   - ✅ As sessões devem aparecer na agenda/tabela
   - ✅ Os links do Zoom devem estar corretos (9h, 15h, 20h)

**Resultado esperado:**
- Sessões criadas com sucesso
- Links do Zoom fixos funcionando
- Sem erros no console

---

### **2. Teste: Diagnóstico de Conversas (Carol)**

**Objetivo:** Verificar se o endpoint de diagnóstico está funcionando.

**Passos:**
1. Acesse: `https://www.ylada.com/admin/whatsapp`
2. Selecione uma conversa qualquer
3. Clique no menu de ações (3 pontinhos)
4. Clique em **"🤖 Ativar Carol"**
5. **Verifique:**
   - ✅ Modal deve abrir mostrando diagnóstico
   - ✅ Deve mostrar informações da conversa:
     - Total de mensagens
     - Quem iniciou (cliente/agente)
     - Tags atuais e sugeridas
     - Se pode ativar Carol
   - ✅ Não deve aparecer erro no console

**Resultado esperado:**
- Modal abre corretamente
- Diagnóstico completo exibido
- Sem erros de autenticação

---

### **3. Teste: Ativação da Carol**

**Objetivo:** Verificar se a ativação da Carol está funcionando.

**Passos:**
1. No modal de diagnóstico (teste anterior)
2. Clique em **"✅ Ativar Carol"**
3. Aguarde o processamento
4. **Verifique:**
   - ✅ Deve aparecer mensagem de sucesso
   - ✅ Tags devem ser adicionadas à conversa
   - ✅ Conversa deve aparecer com tag `carol_ativa`
   - ✅ Não deve aparecer erro no console

**Resultado esperado:**
- Carol ativada com sucesso
- Tags adicionadas corretamente
- Sem erros de autenticação

---

### **4. Teste: Visualização da Agenda**

**Objetivo:** Verificar se a agenda semanal está funcionando.

**Passos:**
1. Acesse: `https://www.ylada.com/admin/whatsapp/workshop`
2. Clique em **"📅 Ver Agenda"**
3. **Verifique:**
   - ✅ Agenda semanal deve aparecer
   - ✅ Dias da semana como colunas
   - ✅ Horários fixos (9h, 15h, 20h) como linhas
   - ✅ Sessões aparecem nos dias/horários corretos
   - ✅ Botões "🔒 Fechar" / "✅ Abrir" funcionam
   - ✅ Navegação entre semanas funciona

**Resultado esperado:**
- Agenda renderiza corretamente
- Sessões aparecem nos lugares certos
- Interações funcionam

---

### **5. Teste: Fechar/Abrir Sessões**

**Objetivo:** Verificar se o controle de sessões está funcionando.

**Passos:**
1. Na agenda ou tabela de sessões
2. Clique em **"🔒 Fechar"** em uma sessão
3. Aguarde o processamento
4. **Verifique:**
   - ✅ Status deve mudar para "🔒 Fechada"
   - ✅ Sessão não deve aparecer para Carol
5. Clique em **"✅ Abrir"**
6. **Verifique:**
   - ✅ Status deve mudar para "✅ Aberta"
   - ✅ Sessão deve aparecer para Carol

**Resultado esperado:**
- Fechar/abrir funciona corretamente
- Status atualiza imediatamente
- Sem erros no console

---

## 🔍 Verificações Técnicas

### **Console do Navegador**

1. Abra o DevTools (F12)
2. Vá em **Console**
3. **Verifique:**
   - ❌ Não deve ter erros em vermelho
   - ❌ Não deve ter erros de autenticação
   - ❌ Não deve ter erros 401/403

### **Network (Rede)**

1. Abra o DevTools (F12)
2. Vá em **Network**
3. Execute uma ação (ex: gerar sessões)
4. **Verifique:**
   - ✅ Requisições devem retornar 200 (sucesso)
   - ❌ Não deve ter erros 401 (não autorizado)
   - ❌ Não deve ter erros 500 (erro do servidor)

---

## ⚠️ Problemas Comuns

### **Erro: "Não autorizado" (401)**

**Causa:** Problema de autenticação  
**Solução:** Verificar se está logado como admin

### **Erro: "Module not found"**

**Causa:** Deploy não incluiu as correções  
**Solução:** Verificar se o deploy `FbeYsRzwp` está ativo

### **Erro: "Cannot read property..."**

**Causa:** Código antigo ainda em cache  
**Solução:** Limpar cache do navegador (Ctrl+Shift+R)

---

## ✅ Checklist Final

- [ ] Geração de sessões funciona
- [ ] Diagnóstico de conversas funciona
- [ ] Ativação da Carol funciona
- [ ] Agenda semanal renderiza
- [ ] Fechar/abrir sessões funciona
- [ ] Sem erros no console
- [ ] Sem erros de autenticação
- [ ] Links do Zoom corretos

---

## 📝 Próximos Passos

Após confirmar que tudo funciona:

1. ✅ Testar fluxo completo da Carol
2. ✅ Testar geração de sessões em produção
3. ✅ Verificar se Carol está divulgando sessões corretamente
4. ✅ Monitorar logs da Vercel por 24h

---

**Última atualização:** Janeiro 2025
