# 📋 GUIA: Copiar Content Wellness → Nutri

## 🎯 Objetivo

Copiar o campo `content` (sequência de perguntas) dos templates **Wellness** para os templates **Nutri** correspondentes, aproveitando o trabalho já feito.

---

## 📝 Passo a Passo

### **1. Verificação Prévia (OBRIGATÓRIO)**

Execute a **Query #1** do arquivo `copiar-content-wellness-para-nutri.sql`:

```sql
-- Ver quais templates serão afetados
SELECT 
  w.slug,
  w.name as nome_wellness,
  ...
```

**O que verificar:**
- ✅ Templates Wellness que têm `content` completo
- ✅ Templates Nutri correspondentes (mesmo `slug`)
- ⚠️ Templates Nutri que já têm `content` (serão sobrescritos)
- ❌ Templates Wellness sem `content` (não serão copiados)

---

### **2. Contagem (OBRIGATÓRIO)**

Execute a **Query #2** para ver quantos templates serão atualizados:

```sql
-- Quantos templates serão atualizados
SELECT 
  COUNT(*) as total_wellness_com_content,
  ...
```

**Resultado esperado:**
- Total de templates Wellness com `content`
- Total de templates Nutri correspondentes
- Total que será copiado

---

### **3. Backup (RECOMENDADO)**

Execute a **Query #3** para criar backup:

```sql
-- Criar tabela de backup
CREATE TABLE IF NOT EXISTS templates_nutrition_backup_content AS
...
```

**Por que fazer backup:**
- Se algo der errado, você pode restaurar
- Permite comparar antes/depois
- Segurança extra

---

### **4. Copiar Content (CUIDADO!)**

Execute a **Query #4** para copiar:

```sql
-- COPIAR CONTENT: Wellness → Nutri
UPDATE templates_nutrition n
SET 
  content = w.content,
  updated_at = NOW()
FROM templates_nutrition w
WHERE ...
```

**⚠️ ATENÇÃO:**
- Esta query **SOBRESCREVE** o `content` dos templates Nutri
- Execute apenas após verificar as queries anteriores
- Certifique-se de que o backup foi criado

---

### **5. Verificação Pós-Atualização (OBRIGATÓRIO)**

Execute a **Query #5** para confirmar:

```sql
-- Verificar se foi copiado corretamente
SELECT 
  n.slug,
  n.name as nome_nutri,
  ...
```

**O que verificar:**
- ✅ Todos os templates Nutri agora têm `content`
- ✅ O `content` é idêntico ao Wellness
- ✅ Número de perguntas/itens está correto

---

### **6. Templates Sem Correspondente**

Execute as **Queries #6 e #7** para identificar:

- **Query #6:** Templates Nutri sem correspondente Wellness (precisam de atenção)
- **Query #7:** Templates Wellness sem correspondente Nutri (podem precisar ser criados)

---

## 📊 Resultado Esperado

Após executar o script:

✅ **Templates Nutri terão:**
- `content` completo (sequência de perguntas)
- Mesma estrutura dos templates Wellness
- Prontos para usar no preview

⚠️ **Próximos passos:**
- Criar diagnósticos Nutri específicos para cada template
- Ajustar linguagem se necessário (foco em nutricionista)
- Testar previews no frontend

---

## 🔧 Troubleshooting

### **Erro: "column 'profession' does not exist"**

Se a coluna `profession` não existir na tabela, você precisa:
1. Adicionar a coluna `profession` na tabela `templates_nutrition`
2. Ou ajustar o script para não usar `profession`

### **Templates Nutri não encontrados**

Se alguns templates Nutri não existem:
1. Verifique a Query #7 (templates Wellness sem correspondente Nutri)
2. Crie os templates Nutri faltantes primeiro
3. Depois execute o script novamente

### **Content não foi copiado**

Se o `content` não foi copiado:
1. Verifique se os `slug` são idênticos entre Wellness e Nutri
2. Verifique se `profession` está correto ('wellness' e 'nutri')
3. Verifique se `language` está correto ('pt')
4. Verifique se `is_active = true`

---

## 📋 Checklist Final

- [ ] Executei Query #1 (verificação prévia)
- [ ] Executei Query #2 (contagem)
- [ ] Executei Query #3 (backup criado)
- [ ] Revisei os resultados antes de copiar
- [ ] Executei Query #4 (copiar content)
- [ ] Executei Query #5 (verificação pós-atualização)
- [ ] Verifiquei que todos os templates têm content
- [ ] Executei Queries #6 e #7 (templates sem correspondente)
- [ ] Próximo passo: Criar diagnósticos Nutri

---

## 🎯 Próximos Passos Após Copiar

1. **Criar diagnósticos Nutri específicos**
   - Focar em linguagem profissional/nutricionista
   - Adaptar textos para área Nutri
   - Manter estrutura (6 seções)

2. **Testar previews**
   - Verificar se perguntas aparecem corretamente
   - Verificar se diagnósticos aparecem no final
   - Ajustar se necessário

3. **Limpar código duplicado**
   - Remover templates incompletos
   - Consolidar duplicados
   - Otimizar código

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique os logs do Supabase
2. Compare com o backup criado
3. Execute as queries de verificação novamente









