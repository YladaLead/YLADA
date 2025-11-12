# 📋 Instruções: Importação de Usuários Migrados

## 📊 Resumo da Importação

- **Total de usuários:** 34
- **Mensais:** 25
- **Anuais:** 1
- **Gratuitos anuais:** 8

---

## 🚀 Como Importar

### **Opção 1: Via Interface Admin (Recomendado)**

1. Acesse `/admin/subscriptions`
2. Vá até a seção "Importação em Massa"
3. Cole o conteúdo do arquivo `scripts/import-users-migration.json`
4. Clique em "Importar"

### **Opção 2: Via API Direta**

```bash
# No terminal, execute:
curl -X POST http://localhost:3000/api/admin/subscriptions/import \
  -H "Content-Type: application/json" \
  -H "Cookie: [seu-cookie-de-sessao]" \
  -d @scripts/import-users-migration.json
```

### **Opção 3: Via Código (Teste)**

```typescript
// Em um script temporário ou console do navegador
const response = await fetch('/api/admin/subscriptions/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    subscriptions: [/* conteúdo do JSON */]
  })
})
```

---

## ✅ O que será criado

Para cada usuário:

1. **Conta de usuário** (se não existir)
   - E-mail como login
   - Senha temporária gerada automaticamente

2. **Perfil de usuário** (`user_profiles`)
   - Nome completo
   - Área: `wellness`
   - Perfil: `wellness`

3. **Assinatura migrada** (`subscriptions`)
   - `plan_type`: `monthly`, `annual` ou `free`
   - `area`: `wellness`
   - `status`: `active`
   - `current_period_end`: Data de vencimento
   - `is_migrated`: `true`
   - `migrated_from`: `herbalead`
   - `requires_manual_renewal`: `true`
   - `original_expiry_date`: Data de vencimento original

---

## 📧 E-mails de Boas-Vindas

Após a importação, os usuários receberão:

- **E-mail de boas-vindas** com:
  - Link de acesso ao sistema
  - Instruções para definir senha
  - Informações sobre o plano migrado
  - Data de vencimento
  - Instruções para renovação

---

## ⚠️ Importante

1. **Duplicatas:** Carol Garcia e Jorge Mattar aparecem apenas uma vez (única assinatura)

2. **Renovação Manual:** Todos os usuários migrados precisarão refazer o checkout quando o plano vencer

3. **Valores:** Planos gratuitos têm `amount: 0`. Planos pagos precisam ter o valor correto (não incluído no JSON, será necessário ajustar)

4. **Teste Primeiro:** Recomendo importar 1-2 usuários primeiro para testar antes de importar todos

---

## 🔍 Verificação Pós-Importação

Após importar, verifique:

1. **Usuários criados:**
   ```sql
   SELECT email, nome_completo FROM user_profiles WHERE perfil = 'wellness';
   ```

2. **Assinaturas criadas:**
   ```sql
   SELECT 
     u.email,
     s.plan_type,
     s.current_period_end,
     s.is_migrated,
     s.requires_manual_renewal
   FROM subscriptions s
   JOIN auth.users u ON u.id = s.user_id
   WHERE s.is_migrated = true;
   ```

3. **Dashboard Admin:** Verifique se os números estão corretos em `/admin`

---

## 📝 Próximos Passos

1. ✅ Importar usuários
2. ✅ Enviar e-mails de boas-vindas
3. ⏳ Configurar notificações de renovação (30 dias antes)
4. ⏳ Bloquear acesso quando plano vencer
5. ⏳ Permitir renovação via checkout

