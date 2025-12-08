# 🎯 PRÓXIMOS PASSOS - WELLNESS SYSTEM

**Data:** Janeiro 2025  
**Status Atual:** ✅ Scripts e Objeções inseridos no banco

---

## ✅ O QUE JÁ FOI FEITO

1. ✅ **Banco de Dados**
   - Tabelas criadas (`wellness_scripts`, `wellness_objecoes`, etc.)
   - Migração executada com sucesso

2. ✅ **Scripts SQL de Seed**
   - `seed-wellness-scripts-lousa-completa.sql` criado (~226 scripts)
   - `seed-wellness-objecoes-lousa-completa.sql` criado (40 objeções)
   - ✅ Objeções inseridas no banco com sucesso

3. ✅ **Motor NOEL**
   - Core (persona, missão, regras, raciocínio)
   - Modos de operação
   - Motor de scripts
   - Handler de objeções
   - Construtor de resposta

4. ✅ **APIs Criadas**
   - `/api/wellness/noel/v2` - Nova API completa
   - `/api/wellness/noel/scripts` - Buscar scripts
   - `/api/wellness/noel/objections` - Buscar objeções

---

## 🚧 PRÓXIMOS PASSOS IMEDIATOS

### 1. Executar Seed de Scripts ⏭️ **PRÓXIMO**

```sql
-- No Supabase SQL Editor:
\i scripts/seed-wellness-scripts-lousa-completa.sql
```

**Objetivo:** Popular o banco com ~226 scripts da LOUSA completa.

**Verificação:**
```sql
SELECT COUNT(*) FROM wellness_scripts WHERE ativo = true;
-- Deve retornar ~226
```

---

### 2. Verificar Integração do Endpoint Principal

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Verificar:**
- [ ] Se está usando o novo motor NOEL (`/v2`)
- [ ] Se está buscando scripts do banco
- [ ] Se está buscando objeções do banco
- [ ] Se está usando `ScriptEngine` e `ObjectionHandler`

**Ação:** Se não estiver integrado, atualizar para usar o novo sistema.

---

### 3. Testar Fluxo Completo

**Testes a realizar:**

1. **Teste de Scripts:**
   ```bash
   # Buscar script por categoria
   GET /api/wellness/noel/scripts?categoria=tipo_pessoa&subcategoria=pessoas_proximas
   ```

2. **Teste de Objeções:**
   ```bash
   # Buscar objeção por categoria
   GET /api/wellness/noel/objections?categoria=clientes&codigo=1.1
   ```

3. **Teste do NOEL V2:**
   ```bash
   POST /api/wellness/noel/v2
   {
     "mensagem": "Não tenho tempo para isso",
     "contexto": {
       "pessoa_tipo": "prospecto",
       "objetivo": "recrutamento"
     }
   }
   ```

**Verificar:**
- [ ] Scripts são buscados do banco corretamente
- [ ] Objeções são detectadas e respondidas
- [ ] Resposta segue o formato Premium Light Copy
- [ ] Regra de ouro (não mencionar PV) está funcionando

---

### 4. Integrar com Frontend

**Verificar:**
- [ ] Se o frontend está chamando `/api/wellness/noel` ou `/api/wellness/noel/v2`
- [ ] Se precisa atualizar para usar a nova API
- [ ] Se o chat widget está funcionando

**Arquivos a verificar:**
- `src/components/wellness/WellnessChatWidget.tsx`
- `src/app/pt/wellness/noel/page.tsx`

---

### 5. Validar Regra Fundamental

**Teste específico:**
```bash
POST /api/wellness/noel/v2
{
  "mensagem": "Quero saber mais sobre o negócio",
  "contexto": {
    "pessoa_tipo": "prospecto",
    "objetivo": "recrutamento",
    "is_novo_prospecto": true
  }
}
```

**Verificar:**
- [ ] Resposta NÃO menciona "PV"
- [ ] Resposta foca em "renda extra", "tempo livre", "oportunidade"
- [ ] Script de recrutamento está sendo usado corretamente

---

## 📋 CHECKLIST DE VALIDAÇÃO

### Banco de Dados
- [x] Tabelas criadas
- [x] Objeções inseridas (40)
- [ ] Scripts inseridos (~226) ⏭️ **PRÓXIMO**
- [ ] Verificar contagens

### Motor NOEL
- [x] Core implementado
- [x] Modos de operação
- [x] Motor de scripts
- [x] Handler de objeções
- [x] Construtor de resposta

### APIs
- [x] `/api/wellness/noel/v2` criada
- [x] `/api/wellness/noel/scripts` criada
- [x] `/api/wellness/noel/objections` criada
- [ ] Endpoint principal integrado
- [ ] Testes realizados

### Integração
- [ ] Frontend usando nova API
- [ ] Chat widget funcionando
- [ ] Fluxo completo testado

---

## 🎯 META ATUAL

**Objetivo:** Completar integração e validação do sistema  
**Foco:** Executar seed de scripts e testar fluxo completo  
**Prazo estimado:** Hoje

---

## 📝 NOTAS

- ✅ Objeções já estão no banco e funcionando
- ⏭️ Scripts precisam ser inseridos
- ⚠️ Verificar se endpoint principal está usando novo sistema
- ⚠️ Testar regra fundamental de recrutamento

---

## 🚀 COMANDOS ÚTEIS

### Verificar scripts no banco:
```sql
SELECT categoria, COUNT(*) 
FROM wellness_scripts 
WHERE ativo = true 
GROUP BY categoria;
```

### Verificar objeções no banco:
```sql
SELECT categoria, COUNT(*) 
FROM wellness_objecoes 
WHERE ativo = true 
GROUP BY categoria;
```

### Testar busca de script:
```sql
SELECT * FROM wellness_scripts 
WHERE categoria = 'tipo_pessoa' 
  AND subcategoria = 'pessoas_proximas' 
  AND ativo = true 
LIMIT 1;
```

### Testar busca de objeção:
```sql
SELECT * FROM wellness_objecoes 
WHERE categoria = 'clientes' 
  AND codigo = '1.1' 
  AND ativo = true;
```





