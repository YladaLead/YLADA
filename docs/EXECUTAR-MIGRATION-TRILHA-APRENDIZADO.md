# 📋 Instruções para Executar Migration da Trilha de Aprendizado

## ⚠️ IMPORTANTE: Ordem de Execução

Você **DEVE** executar as migrations na ordem correta:

1. **PRIMEIRO**: Migration principal (cria as tabelas)
2. **DEPOIS**: Scripts para popular conteúdo

---

## ✅ Passo 1: Executar Migration Principal

### No Supabase SQL Editor:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo completo do arquivo:
   ```
   migrations/criar-tabelas-trilha-aprendizado-wellness.sql
   ```
5. Clique em **Run** (ou pressione Ctrl+Enter)

### O que esta migration faz:

- Cria 8 tabelas no banco de dados
- Cria índices para performance
- Insere a trilha inicial "Distribuidor Iniciante"
- Configura todas as constraints e relacionamentos

### Verificar se funcionou:

Execute esta query para verificar:

```sql
SELECT * FROM wellness_trilhas;
```

Você deve ver 1 linha com a trilha "Distribuidor Iniciante".

---

## ✅ Passo 2: Popular Módulo 1

**SOMENTE DEPOIS** de executar a migration principal:

1. No mesmo SQL Editor
2. Copie e cole o conteúdo completo do arquivo:
   ```
   scripts/popular-modulo-1-fundamentos.sql
   ```
3. Clique em **Run**

### Verificar se funcionou:

Execute esta query:

```sql
SELECT m.nome, COUNT(a.id) as total_aulas
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id
WHERE m.ordem = 1
GROUP BY m.id, m.nome;
```

Você deve ver o Módulo 1 com 5 aulas.

---

## 🚨 Erro Comum

Se você receber o erro:
```
ERROR: relation "wellness_trilhas" does not exist
```

**Significa que você pulou o Passo 1!**

Execute a migration principal primeiro (`criar-tabelas-trilha-aprendizado-wellness.sql`).

---

## 📝 Checklist

- [ ] Migration principal executada com sucesso
- [ ] Tabela `wellness_trilhas` existe (verificar com SELECT)
- [ ] Trilha "Distribuidor Iniciante" foi criada
- [ ] Script do Módulo 1 executado com sucesso
- [ ] Módulo 1 aparece no sistema em `/pt/wellness/cursos`

