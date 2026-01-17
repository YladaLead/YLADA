# 🧪 PASSO A PASSO: TESTE DO SISTEMA DE RETENÇÃO

## ✅ PASSO 1: Executar Script SQL (2 minutos)

### 1.1 Acessar Supabase
1. Abra: https://app.supabase.com
2. Faça login
3. Selecione seu projeto (o mesmo que o app usa)

### 1.2 Executar Script
1. Vá em **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Abra o arquivo: `scripts/verificar-e-corrigir-retencao.sql`
4. **Copie todo o conteúdo** e cole no editor
5. Clique em **Run** (ou `Ctrl+Enter` / `Cmd+Enter`)

### 1.3 Verificar se Funcionou
Você deve ver mensagens como:
- ✅ Campo retention_offered_at adicionado (ou já existe)
- ✅ Campo retention_attempts_count adicionado (ou já existe)
- ✅ RLS habilitado
- ✅ Políticas criadas

**Se aparecer algum erro, me avise!**

---

## 🧪 PASSO 2: Preparar Conta para Teste (3 minutos)

### Opção A: Usar Conta Existente (Mais Rápido)
1. Faça login no app com uma conta que **tenha assinatura ativa**
2. Vá em **Configurações** → **Minha Assinatura**
3. Verifique se aparece a seção de assinatura
4. **Pronto!** Pode testar

### Opção B: Criar Conta Nova (Se não tiver)
1. Acesse: `/admin/usuarios` (ou `/admin/subscriptions`)
2. Crie um usuário novo
3. Crie uma assinatura ativa para esse usuário
4. Faça login com essa conta
5. Vá em **Configurações** → **Minha Assinatura**

---

## 🎯 PASSO 3: Testar Cancelamento (5 minutos)

### 3.1 Iniciar Cancelamento
1. Na página de **Configurações** → **Minha Assinatura**
2. Role até o final da seção de assinatura
3. Clique no link **"Cancelar Assinatura"** (texto cinza, discreto)
4. **Deve abrir um modal**

### 3.2 Teste 1: Selecionar Motivo
No modal, você verá:
- **Título:** "Antes de cancelar..."
- **Pergunta:** "Conta pra gente rapidinho: por que você está cancelando?"
- **Opções:**
  - Não tive tempo de usar
  - Não entendi como funciona
  - Não vi valor ainda
  - Esqueci que o trial acabava
  - Achei muito caro
  - Encontrei uma alternativa
  - Outro motivo

**Clique em:** "Não tive tempo de usar"

### 3.3 Teste 2: Ver Oferta de Retenção
Após clicar no motivo, deve aparecer:
- **Título:** "Que tal tentar isso?"
- **Mensagem:** "Isso é super comum 😊 Quer que a gente pause sua cobrança por mais 7 dias, sem custo, pra você testar com calma?"
- **Botões:**
  - "Estender trial por 7 dias" (azul)
  - "Cancelar agora" (cinza)

**✅ Se apareceu isso, está funcionando!**

### 3.4 Teste 3: Aceitar Retenção
1. Clique em **"Estender trial por 7 dias"**
2. Deve aparecer loading/processando
3. Modal fecha automaticamente
4. **Mensagem de sucesso:** "Perfeito! Sua assinatura foi atualizada."
5. Página recarrega

**Verificar:**
- Assinatura continua ativa
- Data de expiração foi estendida em 7 dias

### 3.5 Teste 4: Rejeitar Retenção (Cancelar de Verdade)
1. Repita passos 3.1 e 3.2
2. Clique em **"Cancelar agora"** (rejeitar oferta)
3. Aparece tela de confirmação final
4. Clique em **"Confirmar Cancelamento"**
5. Modal fecha
6. **Mensagem:** "Assinatura cancelada com sucesso"
7. Redireciona para home

**Verificar:**
- Assinatura foi cancelada no banco
- Status mudou para "canceled"

---

## 🔍 PASSO 4: Verificar no Banco (Opcional)

Execute no Supabase SQL Editor:

```sql
-- Ver última tentativa de cancelamento
SELECT 
  id,
  cancel_reason,
  retention_offered,
  retention_accepted,
  final_action,
  created_at
FROM cancel_attempts 
ORDER BY created_at DESC 
LIMIT 1;

-- Ver se trial foi estendido
SELECT 
  id,
  extension_days,
  original_expiry_date,
  new_expiry_date,
  status
FROM trial_extensions 
ORDER BY created_at DESC 
LIMIT 1;

-- Ver status da subscription
SELECT 
  id,
  status,
  current_period_end,
  retention_attempts_count
FROM subscriptions 
WHERE user_id = 'SEU_USER_ID_AQUI'
ORDER BY created_at DESC 
LIMIT 1;
```

---

## ✅ CHECKLIST DE TESTE

- [ ] Script SQL executado sem erros
- [ ] Modal aparece ao clicar "Cancelar Assinatura"
- [ ] Motivos aparecem corretamente
- [ ] Oferta de retenção aparece após selecionar motivo
- [ ] Aceitar retenção funciona (trial estendido)
- [ ] Rejeitar retenção funciona (cancelamento completo)
- [ ] Mensagens de sucesso aparecem
- [ ] Dados salvos no banco corretamente

---

## 🐛 PROBLEMAS COMUNS

### Modal não aparece
- **Solução:** Verifique console do navegador (F12) para erros
- Verifique se está logado
- Verifique se tem assinatura ativa

### Erro ao selecionar motivo
- **Solução:** Verifique logs do servidor
- Verifique se tabela `cancel_attempts` existe

### Oferta não aparece
- **Solução:** Verifique se já teve retenção oferecida antes
- Verifique logs da API `/api/nutri/subscription/cancel-attempt`

### Erro ao aceitar retenção
- **Solução:** Verifique se tabela `trial_extensions` existe
- Verifique logs da API `/api/nutri/subscription/accept-retention`

---

## 📊 TESTAR TODOS OS MOTIVOS

Para testar completamente, teste cada motivo:

| Motivo | Oferta Esperada |
|--------|----------------|
| Não tive tempo | Estender trial 7 dias |
| Não entendi | Tour guiado pela LYA |
| Não vi valor | Mostrar feature |
| Esqueci trial | Adiar + estender trial |
| Muito caro | Pausar 30 dias |
| Encontrei alternativa | Sem oferta (cancelar direto) |
| Outro | Sem oferta (cancelar direto) |

**Dica:** Você pode fechar o modal sem completar o cancelamento para testar vários motivos.

---

## 🎉 PRONTO!

Se todos os testes passaram, o sistema está funcionando perfeitamente!

**Próximos passos:**
- Monitorar métricas de retenção
- Ajustar ofertas se necessário
- Coletar feedback dos usuários

---

**Dúvidas?** Me chame! 😊

