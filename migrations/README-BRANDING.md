# 🎨 Migration: Personalização de Marca

## ⚡ Instruções de Execução

### **1️⃣ Criar Bucket no Supabase Storage**

1. Acesse o Supabase Dashboard
2. Vá em **Storage** no menu lateral
3. Clique em **New bucket**
4. Configure:
   - **Name**: `nutri-logos`
   - **Public bucket**: ✅ **SIM** (marcar checkbox)
5. Clique em **Create bucket**

### **2️⃣ Executar Migration SQL**

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor** no menu lateral
3. Clique em **New query**
4. Copie TODO o conteúdo do arquivo `add-branding-fields.sql`
5. Cole no editor SQL
6. Clique em **RUN** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação: ✅ Success!

### **3️⃣ Verificar Execução**

Execute este SQL para verificar:

```sql
-- Verificar se colunas foram criadas
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('logo_url', 'brand_color', 'brand_name', 'professional_credential');
```

Você deve ver 4 linhas retornadas.

### **4️⃣ Testar**

1. Faça login como nutricionista
2. Vá em **Configurações**
3. Role até **🎨 Marca Profissional**
4. Faça upload de um logo de teste
5. Escolha uma cor
6. Salve

---

## ⚠️ Troubleshooting

### Erro: "bucket nutri-logos not found"
**Solução**: Volte ao passo 1 e crie o bucket.

### Erro: "column does not exist"
**Solução**: Execute a migration SQL novamente (passo 2).

### Erro ao fazer upload
**Solução**: 
1. Verifique se o bucket é público
2. Verifique as políticas de storage na migration

---

## 📊 Estrutura dos Campos

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `logo_url` | TEXT | ✅ | URL do logo no storage |
| `brand_color` | VARCHAR(7) | ✅ | Cor HEX (ex: #3B82F6) |
| `brand_name` | VARCHAR(100) | ✅ | Nome da marca |
| `professional_credential` | VARCHAR(200) | ✅ | Credencial (CRN, etc) |

---

## ✅ Checklist Pós-Execução

- [ ] Bucket `nutri-logos` criado e público
- [ ] Migration SQL executada com sucesso
- [ ] 4 colunas criadas na tabela `user_profiles`
- [ ] Políticas de storage aplicadas
- [ ] Upload de logo funcionando
- [ ] Preview da marca funcionando
- [ ] LYA respondendo sobre cores

---

**Tempo estimado**: 5 minutos  
**Complexidade**: Baixa  
**Reversível**: Sim (colunas podem ser removidas se necessário)
