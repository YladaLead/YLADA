# 🧪 Guia de Teste - Sistema Trial com Presidentes

## 📋 Checklist de Teste Completo

### **1. Preparação (Executar Migrations)**

Antes de testar, execute as migrations no Supabase:

1. `181-criar-tabela-presidentes-autorizados.sql`
2. `182-adicionar-nome-presidente-trial-invites.sql`
3. `183-adicionar-presidentes-iniciais.sql` (adiciona os 6 presidentes iniciais)

---

### **2. Teste: Adicionar Presidente Manualmente**

**Objetivo:** Verificar se consegue adicionar presidentes na área admin

**Passos:**
1. Acesse `/admin/presidentes`
2. Preencha o formulário:
   - Nome: `Teste Presidente`
   - Email: `teste@exemplo.com` (opcional)
   - Observações: `Presidente de teste` (opcional)
3. Clique em "Adicionar Presidente"
4. ✅ **Esperado:** Mensagem de sucesso e presidente aparece na lista

**Verificar:**
- [ ] Presidente aparece na lista
- [ ] Status está como "Ativo"
- [ ] Nome está correto

---

### **3. Teste: Dropdown de Presidentes na Página de Trial**

**Objetivo:** Verificar se o dropdown carrega os presidentes

**Passos:**
1. Acesse `/pt/wellness/trial/presidentes`
2. Verifique o campo "Selecione seu presidente"
3. ✅ **Esperado:** Dropdown mostra todos os presidentes ativos + opção "Outro"

**Verificar:**
- [ ] Dropdown carrega os presidentes
- [ ] Opção "Outro" aparece no final
- [ ] Nomes estão padronizados

---

### **4. Teste: Selecionar Presidente da Lista**

**Objetivo:** Criar conta selecionando um presidente da lista

**Passos:**
1. Acesse `/pt/wellness/trial/presidentes`
2. Selecione um presidente do dropdown (ex: "Claudinei Leite")
3. Preencha o formulário:
   - Seu Nome Completo: `João Silva Teste`
   - Email: `joao.teste@exemplo.com`
   - WhatsApp: `11999999999`
   - Senha: `123456`
   - Confirmar Senha: `123456`
4. Clique em "Começar Trial Grátis"
5. ✅ **Esperado:** Conta criada e redirecionado para área Wellness

**Verificar:**
- [ ] Conta foi criada com sucesso
- [ ] Trial de 3 dias foi ativado
- [ ] Login automático funcionou

---

### **5. Teste: Selecionar "Outro" e Digitar Nome**

**Objetivo:** Verificar se a opção "Outro" funciona corretamente

**Passos:**
1. Acesse `/pt/wellness/trial/presidentes`
2. Selecione "Outro" no dropdown
3. ✅ **Esperado:** Aparece campo de texto "Digite o nome do seu presidente"
4. Digite: `Presidente Teste Outro`
5. Preencha o restante do formulário:
   - Seu Nome Completo: `Maria Teste`
   - Email: `maria.teste@exemplo.com`
   - WhatsApp: `11888888888`
   - Senha: `123456`
   - Confirmar Senha: `123456`
6. Clique em "Começar Trial Grátis"
7. ✅ **Esperado:** Conta criada com nome do presidente digitado

**Verificar:**
- [ ] Campo de texto aparece quando seleciona "Outro"
- [ ] Validação funciona (erro se não preencher)
- [ ] Nome digitado é salvo corretamente

---

### **6. Teste: Validação de Campos**

**Objetivo:** Verificar se as validações estão funcionando

**Testes:**
1. **Sem selecionar presidente:**
   - Deixe dropdown vazio
   - Tente submeter
   - ✅ **Esperado:** Erro "Selecione o presidente"

2. **Selecionar "Outro" sem digitar:**
   - Selecione "Outro"
   - Não preencha o campo de texto
   - Tente submeter
   - ✅ **Esperado:** Erro "Digite o nome do presidente (mínimo 3 caracteres)"

3. **WhatsApp obrigatório:**
   - Deixe WhatsApp vazio
   - Tente submeter
   - ✅ **Esperado:** Erro "WhatsApp é obrigatório"

4. **Email inválido:**
   - Digite email sem @
   - Tente submeter
   - ✅ **Esperado:** Erro "Email é obrigatório e deve ser válido"

---

### **7. Teste: Área Admin - Ver Trials**

**Objetivo:** Verificar se os trials aparecem na área admin

**Passos:**
1. Acesse `/admin/trials`
2. ✅ **Esperado:** Lista de todos os trials criados

**Verificar:**
- [ ] Trials aparecem na tabela
- [ ] Nome do presidente aparece na coluna "Presidente"
- [ ] Status está correto (Ativo/Expirado)
- [ ] Dias restantes estão corretos
- [ ] Ambiente está correto (Geral/Presidentes)

---

### **8. Teste: Relatório por Presidente**

**Objetivo:** Verificar se o relatório agrupa por presidente

**Passos:**
1. Acesse `/admin/trials`
2. Role até a seção "📊 Relatório por Presidente"
3. ✅ **Esperado:** Tabela com estatísticas por presidente

**Verificar:**
- [ ] Relatório aparece (se houver trials de presidentes)
- [ ] Nome do presidente está correto
- [ ] Contadores estão corretos (Ativos, Expirados, Total)
- [ ] Ordenado por total (maior primeiro)

---

### **9. Teste: Filtros na Área Admin**

**Objetivo:** Verificar se os filtros funcionam

**Testes:**
1. **Filtro por Status:**
   - Selecione "Ativos"
   - ✅ **Esperado:** Mostra apenas trials ativos

2. **Filtro por Ambiente:**
   - Selecione "Presidentes"
   - ✅ **Esperado:** Mostra apenas trials do ambiente presidentes

3. **Busca:**
   - Digite nome, email ou WhatsApp
   - ✅ **Esperado:** Filtra resultados

---

### **10. Teste: Desativar Presidente**

**Objetivo:** Verificar se presidente desativado não aparece no dropdown

**Passos:**
1. Acesse `/admin/presidentes`
2. Encontre um presidente na lista
3. Clique em "Desativar"
4. Confirme a ação
5. ✅ **Esperado:** Status muda para "Inativo"
6. Acesse `/pt/wellness/trial/presidentes`
7. ✅ **Esperado:** Presidente desativado NÃO aparece no dropdown

**Verificar:**
- [ ] Presidente foi desativado
- [ ] Não aparece mais no dropdown
- [ ] Ainda aparece na lista admin (mas como inativo)

---

## 🐛 Problemas Comuns e Soluções

### **Dropdown não carrega presidentes:**
- Verifique se a migration `181` foi executada
- Verifique se há presidentes ativos na tabela
- Verifique console do navegador para erros

### **Erro ao criar conta:**
- Verifique se todas as migrations foram executadas
- Verifique se o email não está duplicado
- Verifique console do navegador e logs do servidor

### **Relatório não aparece:**
- Verifique se há trials do ambiente "presidentes"
- Verifique se o campo `nome_presidente` está sendo salvo
- Verifique se a migration `182` foi executada

---

## ✅ Checklist Final

Após todos os testes, verifique:

- [ ] Presidente pode ser adicionado manualmente
- [ ] Dropdown carrega presidentes corretamente
- [ ] Opção "Outro" aparece e funciona
- [ ] Campo de texto aparece quando seleciona "Outro"
- [ ] Validações funcionam corretamente
- [ ] Conta é criada com sucesso
- [ ] Trial de 3 dias é ativado
- [ ] Nome do presidente é salvo corretamente
- [ ] Trials aparecem na área admin
- [ ] Relatório por presidente funciona
- [ ] Filtros funcionam
- [ ] Desativar presidente funciona

---

## 📝 Dados de Teste Sugeridos

**Presidentes para adicionar:**
- `Claudinei Leite`
- `Andre e Deise Faula`
- `Marcelino e Valdete`

**Contas de teste:**
- Email: `teste1@exemplo.com`, WhatsApp: `11999999999`
- Email: `teste2@exemplo.com`, WhatsApp: `11888888888`
- Email: `teste3@exemplo.com`, WhatsApp: `11777777777`

---

## 🚀 Próximos Passos

Após validar todos os testes:
1. Executar migrations em produção
2. Adicionar presidentes reais
3. Compartilhar link `/pt/wellness/trial/presidentes`
4. Monitorar trials na área admin
