# ⚡ FASE 2: INSTRUÇÕES RÁPIDAS

## 🎯 OBJETIVO
Garantir coluna `profession` e duplicar templates Wellness para Nutri, Coach e Nutra.

---

## 🚀 EXECUTAR AGORA (NA ORDEM)

### **PASSO 1: Garantir Coluna Profession**
```sql
-- Executar: scripts/03-GARANTIR-COLUNA-PROFESSION-FASE2.sql
```
**O que faz:** Cria coluna `profession` se não existir em ambas as tabelas.

---

### **PASSO 2: Completar Templates Nutri**
```sql
-- Executar: scripts/04-DUPLICAR-WELLNESS-TO-NUTRI.sql
```
**O que faz:** Duplica templates Wellness → Nutri (completa Nutri).

**Resultado esperado:** Nutri terá 36 templates (igual Wellness).

---

### **PASSO 3: Criar Templates Coach e Nutra**
```sql
-- Executar: scripts/05-DUPLICAR-WELLNESS-TO-COACH-NUTRA.sql
```
**O que faz:** 
- Duplica Wellness → Coach (36 templates, desativados)
- Duplica Wellness → Nutra (36 templates, desativados)

**Resultado esperado:** Coach e Nutra terão 36 templates cada.

---

### **PASSO 4: Verificar Duplicação**
```sql
-- Executar: scripts/06-VERIFICAR-DUPLICACAO-FASE2.sql
```
**O que faz:** Valida se todos os templates foram duplicados corretamente.

---

## ✅ RESULTADO ESPERADO

Após executar todos os scripts:

| Área | Total Templates | Status |
|------|----------------|--------|
| **Nutri** | 36 | ✅ Ativos |
| **Wellness** | 36 | ✅ Ativos |
| **Coach** | 36 | ⏸️ Desativados |
| **Nutra** | 36 | ⏸️ Desativados |

**Total:** 144 templates (36 × 4 áreas)

---

## 🚨 SE ALGO DER ERRADO

- **Erro ao criar coluna:** Verificar permissões no Supabase
- **Templates não duplicados:** Verificar se já existem (evita duplicatas)
- **Números não coincidem:** Executar script de verificação

---

## 📝 APÓS EXECUTAR

Me informe:
1. ✅ Coluna profession criada?
2. ✅ Quantos templates Nutri agora? (esperado: 36)
3. ✅ Quantos templates Coach? (esperado: 36)
4. ✅ Quantos templates Nutra? (esperado: 36)

**Depois vamos para Fase 3!** 🚀

