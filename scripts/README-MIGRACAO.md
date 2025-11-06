# 📋 GUIA DE EXECUÇÃO DOS SCRIPTS DE MIGRAÇÃO

## ⚠️ IMPORTANTE: LEIA ANTES DE EXECUTAR

Este conjunto de scripts faz a migração gradual dos templates Nutri para outras áreas (Wellness, Coach, Nutra).

**Execute na ordem especificada e nunca pule etapas!**

---

## 📅 ORDEM DE EXECUÇÃO

### **ETAPA 1: Backup e Verificação** ⚠️ CRÍTICO

```sql
-- 1. Fazer backup COMPLETO
\i scripts/01-BACKUP-PRE-MIGRACAO.sql

-- 2. Verificar estado atual
\i scripts/02-VERIFICAR-ESTADO-ATUAL.sql
```

**O que fazer:**
- ✅ Anotar quantos templates Nutri existem
- ✅ Verificar se há templates sem `profession`
- ✅ Documentar estado atual

---

### **ETAPA 2: Preparar Banco**

```sql
-- Garantir coluna profession
\i scripts/03-GARANTIR-COLUNA-PROFESSION.sql
```

**O que fazer:**
- ✅ Verificar se coluna foi criada/atualizada
- ✅ Confirmar que templates Nutri têm `profession='nutri'`

---

### **ETAPA 3: Duplicar Templates**

```sql
-- 1. Duplicar Nutri → Wellness
\i scripts/04-DUPLICAR-NUTRI-TO-WELLNESS.sql

-- 2. Duplicar Nutri → Coach e Nutra
\i scripts/05-DUPLICAR-NUTRI-TO-COACH-NUTRA.sql
```

**O que fazer:**
- ✅ Verificar contagens após cada script
- ✅ Confirmar que número de templates Wellness = Nutri
- ✅ Verificar que Coach e Nutra foram criados (mesmo que desativados)

---

### **ETAPA 4: Validação Final**

```sql
-- Verificar duplicação completa
\i scripts/06-VERIFICAR-DUPLICACAO-COMPLETA.sql
```

**O que fazer:**
- ✅ Verificar se todos os templates foram duplicados
- ✅ Confirmar que não há templates faltando
- ✅ Anotar números finais

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após executar todos os scripts:

- [ ] Backup criado com sucesso
- [ ] Coluna `profession` existe e está preenchida
- [ ] Templates Nutri mantidos (não foram alterados)
- [ ] Templates Wellness criados (mesmo número que Nutri)
- [ ] Templates Coach criados (mesmo número que Nutri, desativados)
- [ ] Templates Nutra criados (mesmo número que Nutri, desativados)
- [ ] Nenhum template foi perdido
- [ ] Verificação final passou

---

## 🚨 SE ALGO DER ERRADO

### **1. Parar imediatamente**
Não continue executando scripts se algo der errado.

### **2. Restaurar backup**
```sql
-- Restaurar templates_nutrition
DROP TABLE IF EXISTS templates_nutrition;
CREATE TABLE templates_nutrition AS 
SELECT * FROM templates_nutrition_backup_pre_migracao;

-- Restaurar user_templates
DROP TABLE IF EXISTS user_templates;
CREATE TABLE user_templates AS 
SELECT * FROM user_templates_backup_pre_migracao;
```

### **3. Documentar erro**
Anotar:
- Qual script falhou
- Mensagem de erro
- O que estava tentando fazer

---

## 📊 RESULTADO ESPERADO

Após executar todos os scripts:

```
Templates por área:
- Nutri:    38 templates (ativos)
- Wellness: 38 templates (ativos)
- Coach:    38 templates (inativos - ativar depois)
- Nutra:    38 templates (inativos - ativar depois)
```

**Total: 152 templates** (38 × 4 áreas)

---

## 🎯 PRÓXIMOS PASSOS

Após validar a duplicação no banco:

1. **Fase 3:** Separar diagnósticos (ver `PLANO-MIGRACAO-GRADUAL-SEGURA.md`)
2. **Fase 4:** Atualizar APIs e componentes
3. **Fase 5:** Validação completa

---

## 📞 DÚVIDAS?

Consulte `PLANO-MIGRACAO-GRADUAL-SEGURA.md` para detalhes completos.

**Migração gradual = Sucesso garantido!** ✅

