# 🚀 GUIA RÁPIDO - Executar Script SQL

## ✅ O QUE FAZER AGORA

### 1. **Abrir Supabase**
   - Acesse: https://supabase.com
   - Entre no seu projeto
   - Clique em **SQL Editor** (menu lateral)

### 2. **Copiar e Colar**
   - Abra o arquivo: `migrar-38-templates-wellness.sql`
   - Selecione tudo (Ctrl+A / Cmd+A)
   - Copie (Ctrl+C / Cmd+C)
   - Cole no SQL Editor do Supabase

### 3. **Executar**
   - Clique em **RUN** ou pressione `Ctrl+Enter` / `Cmd+Enter`

### 4. **Verificar Resultado**
   - O script mostra automaticamente:
     - Quantos templates foram inseridos
     - Lista completa dos templates

---

## ✅ RESULTADO ESPERADO

Após executar, você deve ver:
- **52 templates** inseridos/atualizados
- Divididos em: Calculadoras, Quizzes, Checklists, Planilhas

---

## ⚠️ SE DER ERRO

**Me avise o erro exato que apareceu** e eu ajusto o script!

Erros comuns:
- "column 'slug' does not exist" → Vou ajustar
- "column 'profession' does not exist" → Vou ajustar  
- "ON CONFLICT requires unique constraint" → Normal, ignorar

---

## 🔍 VERIFICAÇÃO MANUAL

Execute esta query no Supabase para verificar:

```sql
SELECT COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt' AND is_active = true;
```

**Deve retornar: 52**

---

**Quando executar, me avise:**
- ✅ Funcionou? → Seguimos para FASE 2
- ❌ Deu erro? → Me passa o erro e eu ajusto

