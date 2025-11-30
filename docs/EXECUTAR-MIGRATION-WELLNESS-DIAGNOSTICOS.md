# 🚀 GUIA RÁPIDO - Executar Migration Wellness Diagnosticos

## ✅ O QUE FAZER AGORA

### 1. **Abrir Supabase SQL Editor**
   - Acesse: https://supabase.com/dashboard
   - Entre no seu projeto
   - Clique em **SQL Editor** (menu lateral)
   - Clique em **"New query"**

### 2. **Copiar e Colar o Script**
   - Abra o arquivo: `migrations/criar-tabela-wellness-diagnosticos.sql`
   - Selecione tudo (Ctrl+A / Cmd+A)
   - Copie (Ctrl+C / Cmd+C)
   - Cole no SQL Editor do Supabase

### 3. **Executar**
   - Clique em **RUN** ou pressione `Ctrl+Enter` / `Cmd+Enter`
   - Aguarde a execução (deve levar alguns segundos)

### 4. **Verificar Resultado**
   - Você deve ver mensagens de sucesso:
     - ✅ "CREATE TABLE"
     - ✅ "CREATE INDEX" (vários índices)
     - ✅ "COMMENT ON TABLE"

---

## ✅ RESULTADO ESPERADO

Após executar, a tabela `wellness_diagnosticos` será criada com:
- ✅ Tabela principal com todas as colunas
- ✅ 7 índices para performance
- ✅ 1 índice GIN para busca em JSONB
- ✅ Comentários de documentação

---

## 🔍 VERIFICAÇÃO MANUAL

Execute esta query no Supabase para verificar se a tabela foi criada:

```sql
-- Verificar se a tabela existe
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'wellness_diagnosticos'
ORDER BY ordinal_position;
```

**Deve retornar:** Lista com todas as colunas da tabela

---

## 📊 ESTRUTURA DA TABELA

A tabela `wellness_diagnosticos` terá as seguintes colunas:

- `id` - UUID (chave primária)
- `user_id` - UUID (referência ao usuário)
- `fluxo_id` - VARCHAR(100) (ID do fluxo)
- `fluxo_tipo` - VARCHAR(50) ('cliente' ou 'recrutamento')
- `fluxo_nome` - VARCHAR(255) (nome do fluxo)
- `respostas` - JSONB (todas as respostas)
- `perfil_identificado` - VARCHAR(255)
- `kit_recomendado` - VARCHAR(50) ('energia', 'acelera', etc.)
- `score` - INTEGER (0-100)
- `nome_lead`, `email_lead`, `telefone_lead`, `whatsapp_lead` - Dados opcionais
- `ip_address` - INET
- `user_agent` - TEXT
- `source` - VARCHAR(50)
- `conversao` - BOOLEAN
- `conversao_at` - TIMESTAMP
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

---

## ⚠️ SE DER ERRO

**Me avise o erro exato que apareceu** e eu ajusto o script!

Erros comuns:
- "relation 'users' does not exist" → A tabela users precisa existir primeiro
- "permission denied" → Verifique permissões do usuário
- "syntax error" → Verifique se copiou o script completo

---

## ✅ APÓS EXECUÇÃO BEM-SUCEDIDA

Quando a tabela for criada com sucesso:
- ✅ O sistema Wellness poderá salvar diagnósticos
- ✅ O histórico de diagnósticos funcionará
- ✅ O painel de conversões terá dados para analisar

---

## 📝 PRÓXIMOS PASSOS

Após executar a migration:
1. Teste criar um diagnóstico no sistema
2. Verifique se aparece no histórico
3. Confirme que as estatísticas estão funcionando

