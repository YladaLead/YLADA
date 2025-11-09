# 🎯 ESTRATÉGIA: Migrar Templates Hardcoded Nutri → Banco

## 📊 SITUAÇÃO

- **Nutri Hardcoded:** 38 templates (funcionando, com diagnósticos revisados)
- **Wellness Banco:** 38 templates (com `content` JSONB completo)
- **Nutri Banco:** 8 templates (incompletos)

## 🎯 ESTRATÉGIA HÍBRIDA

### **Para cada template hardcoded da Nutri:**

1. **Se existe em Wellness:**
   - ✅ Copiar `content` (JSONB) de Wellness
   - ✅ Usar nome/descrição da Nutri (hardcoded)
   - ✅ Inserir com `profession='nutri'`

2. **Se NÃO existe em Wellness:**
   - ⚠️ Criar `content` básico baseado no tipo
   - ✅ Usar nome/descrição da Nutri
   - ✅ Inserir com `profession='nutri'`

## 📋 Mapeamento de Tipos

```typescript
// Hardcoded Nutri → Tipo no banco
'Quiz' → 'quiz'
'Calculadora' → 'calculadora'
'Checklist' → 'planilha' ou 'checklist'
'Conteúdo' → 'planilha'
'Diagnóstico' → 'quiz'
```

## ✅ VANTAGENS

1. **Preserva tudo que funciona**
2. **Reutiliza content de Wellness** (quando existe)
3. **Mantém customizações da Nutri** (nome, descrição)
4. **Diagnósticos continuam funcionando**

