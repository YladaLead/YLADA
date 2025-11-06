# 📋 GUIA DE EXECUÇÃO - FASE 1: BACKUP E VERIFICAÇÃO

## 🎯 OBJETIVO
Verificar o estado atual do banco de dados antes de iniciar a migração.

---

## 📝 PASSO 1: BACKUP DO BANCO

### **Onde executar:**
Supabase Dashboard → SQL Editor

### **Script a executar:**
```sql
-- Executar: scripts/01-BACKUP-PRE-MIGRACAO.sql
```

### **Como executar:**
1. Abrir Supabase Dashboard
2. Ir em **SQL Editor**
3. Criar nova query
4. Copiar e colar o conteúdo de `scripts/01-BACKUP-PRE-MIGRACAO.sql`
5. Executar
6. Verificar se apareceu mensagem de sucesso

### **O que verificar:**
- ✅ Mensagem: "Backup concluído!"
- ✅ Tabelas criadas: `templates_nutrition_backup_pre_migracao` e `user_templates_backup_pre_migracao`

---

## 📝 PASSO 2: VERIFICAR ESTADO ATUAL

### **Script a executar:**
```sql
-- Executar: scripts/02-VERIFICAR-ESTADO-ATUAL.sql
```

### **Resultados esperados:**

#### **1. Templates por profession:**
```
profession        | total_templates
------------------|----------------
nutri             | 38
wellness          | X
SEM_PROFESSION    | Y
```

#### **2. Templates sem profession:**
Lista de templates que precisam ser atualizados.

#### **3. Links criados por profession:**
Quantos links existem em cada área.

#### **4. Lista de templates Nutri:**
Lista completa dos 38 templates para duplicar.

---

## 📊 RESULTADOS A DOCUMENTAR

Após executar os scripts, anotar:

1. **Total de templates Nutri:** _____
2. **Templates sem profession:** _____
3. **Total de links Wellness:** _____
4. **Total de links Nutri:** _____
5. **Backup criado com sucesso:** ✅ / ❌

---

## ✅ VALIDAÇÃO

Antes de prosseguir para Fase 2, verificar:

- [ ] Backup criado com sucesso
- [ ] Templates Nutri identificados (esperado: ~38)
- [ ] Templates sem profession identificados
- [ ] Estado atual documentado

---

## 🚨 SE ALGO DER ERRADO

- **Erro ao criar backup:** Verificar permissões no Supabase
- **Nenhum template encontrado:** Verificar se está na tabela correta
- **Erro de sintaxe SQL:** Verificar se copiou o script completo

---

**Próximo passo:** Após validar, vamos para **Fase 2: Duplicar Templates**

