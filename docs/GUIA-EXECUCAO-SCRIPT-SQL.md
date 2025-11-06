# 📋 GUIA DE EXECUÇÃO - Script SQL de Migração

## ✅ FASE 1 - PARTE 2: EXECUTAR SCRIPT NO SUPABASE

### 📝 Passo a Passo

#### 1. **Abrir Supabase SQL Editor**
   - Acesse seu projeto no Supabase
   - Vá para **SQL Editor** (no menu lateral)

#### 2. **Copiar o Script**
   - Abra o arquivo `migrar-38-templates-wellness.sql`
   - Copie TODO o conteúdo (Ctrl+A / Cmd+A, depois Ctrl+C / Cmd+C)

#### 3. **Executar no Supabase**
   - Cole o script no SQL Editor do Supabase
   - Clique em **RUN** ou pressione `Ctrl+Enter` / `Cmd+Enter`

#### 4. **Verificar Resultado**
   - O script inclui queries de verificação ao final
   - Você verá:
     - Total de templates por categoria
     - Lista completa dos templates inseridos

---

## ⚠️ POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "ON CONFLICT requires a unique constraint"
**Solução**: O script ainda funciona, mas pode criar duplicatas. Isso é normal se não houver constraint única.

### Erro: "column 'slug' does not exist"
**Solução**: A tabela pode não ter a coluna `slug`. Nesse caso, precisamos ajustar o script.

### Erro: "column 'profession' does not exist"
**Solução**: A tabela pode não ter a coluna `profession`. Nesse caso, precisamos ajustar o script.

---

## 📊 VERIFICAÇÃO PÓS-EXECUÇÃO

Após executar, execute estas queries no Supabase:

```sql
-- Ver quantos templates wellness existem
SELECT COUNT(*) as total_wellness
FROM templates_nutrition
WHERE profession = 'wellness'
AND language = 'pt'
AND is_active = true;

-- Listar todos os templates wellness
SELECT slug, name, categoria, type, is_active
FROM templates_nutrition
WHERE profession = 'wellness'
AND language = 'pt'
ORDER BY categoria, type, name;
```

**Resultado esperado**: 52 templates ativos

---

## 🔄 SE DER ERRO

**Me avise qual erro apareceu** e eu ajusto o script imediatamente!

Possíveis ajustes necessários:
- Adicionar colunas faltantes
- Ajustar nomes de colunas
- Modificar sintaxe SQL

---

## ✅ APÓS EXECUÇÃO BEM-SUCEDIDA

Quando tiver 52 templates no banco:
1. ✅ Me avise que funcionou
2. ✅ Podemos seguir para **FASE 2**: Remover fallbacks hardcoded
3. ✅ Depois você pode desativar os templates que não quiser

---

**Pronto para executar?** Me avise quando executar e se deu algum erro!

