# 📋 INSTRUÇÕES: Como Popular Dados de Teste

## 🚀 Passo a Passo Rápido

### **1️⃣ Descubra seu User ID**

No **Supabase Dashboard** → **SQL Editor**, execute:

```sql
SELECT id, email FROM auth.users LIMIT 5;
```

**Resultado:**
```
id                                    | email
--------------------------------------|------------------
abc12345-6789-0123-4567-890abcdef123  | seu@email.com
```

✅ **Copie o UUID** da coluna `id` (o seu user_id)

---

### **2️⃣ Edite o Script**

1. Abra: `scripts/POPULAR-DADOS-TESTE-EVOLUCAO.sql`
2. Procure a linha ~40:
```sql
v_user_id UUID := 'SEU-USER-ID-AQUI'::uuid;  -- ⚠️ SUBSTITUA AQUI
```
3. **Substitua** `SEU-USER-ID-AQUI` pelo seu UUID:
```sql
v_user_id UUID := 'abc12345-6789-0123-4567-890abcdef123'::uuid;  -- ✅ SEU UUID
```

---

### **3️⃣ Execute o Script**

1. Copie **TODO** o conteúdo do arquivo `POPULAR-DADOS-TESTE-EVOLUCAO.sql`
2. Cole no **SQL Editor** do Supabase
3. Clique em **Run** ▶️

---

### **4️⃣ Veja o Resultado**

```
✅ Cliente 1 criado: Maria Silva
✅ Cliente 2 criado: João Santos
✅ Cliente 3 criado: Ana Costa
✅ Cliente 4 criado: Carlos Mendes
✅ Cliente 5 criado: Juliana Oliveira

🎉 5 clientes criados
🎉 60 medições de evolução criadas
```

---

## ✅ Verificar se Funcionou

Execute no SQL Editor:

```sql
-- Ver clientes de teste criados
SELECT name, email, status 
FROM clients 
WHERE email LIKE 'teste.evolucao.%@ylada.app';

-- Ver quantidade de evoluções
SELECT 
  c.name,
  COUNT(e.id) as total_medicoes
FROM clients c
LEFT JOIN client_evolution e ON e.client_id = c.id
WHERE c.email LIKE 'teste.evolucao.%@ylada.app'
GROUP BY c.name
ORDER BY c.name;
```

**Resultado esperado:**
```
name                  | total_medicoes
----------------------|---------------
Ana Costa (TESTE)     | 12
Carlos Mendes (TESTE) | 12
João Santos (TESTE)   | 12
Juliana Oliveira...   | 12
Maria Silva (TESTE)   | 12
```

---

## 🎯 Agora Teste no Sistema

1. Acesse: **Área Nutri** → **Clientes**
2. Veja os 5 clientes com `(TESTE)` no nome
3. Clique em qualquer um
4. Vá para aba **"Evolução Física"** 📈
5. Veja os gráficos, tabelas e estatísticas!

---

## 🧹 Limpar Dados de Teste

Quando terminar de testar, execute:

```sql
-- Remove evoluções de teste
DELETE FROM client_evolution 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE email LIKE 'teste.evolucao.%@ylada.app'
);

-- Remove clientes de teste
DELETE FROM clients 
WHERE email LIKE 'teste.evolucao.%@ylada.app';
```

Ou use o arquivo: `scripts/LIMPAR-DADOS-TESTE-EVOLUCAO.sql`

---

## ❓ Problemas Comuns

### ❌ "UUID inválido"
**Solução:** Você não substituiu `SEU-USER-ID-AQUI` corretamente. Volte ao passo 1.

### ❌ "relation auth.users does not exist"
**Solução:** Execute no Supabase Dashboard, não localmente.

### ❌ "Clientes não aparecem no sistema"
**Solução:** Verifique se usou o UUID correto executando:
```sql
SELECT id, email FROM auth.users WHERE id = 'seu-uuid-aqui';
```

### ❌ "Nenhuma medição criada"
**Solução:** Execute a query de verificação acima para confirmar que os dados foram criados.

---

## 💡 Dica Pro

**Quer criar mais medições?**

No script, mude de:
```sql
FOR i IN 0..11 LOOP  -- 12 medições (quinzenais por 6 meses)
```

Para:
```sql
FOR i IN 0..23 LOOP  -- 24 medições (semanais por 6 meses)
```

E ajuste o intervalo:
```sql
v_measurement_date := v_base_date + (i * 7);  -- Semanal ao invés de quinzenal
```

---

## 📞 Precisa de Ajuda?

1. Confirme que executou TODOS os passos acima
2. Verifique se está no Supabase Dashboard (não terminal local)
3. Confirme que o UUID está correto
4. Execute as queries de verificação

---

**Pronto! 🎉 Agora você pode testar o sistema com dados realistas!**












