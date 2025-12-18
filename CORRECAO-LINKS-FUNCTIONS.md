# 🔧 CORREÇÃO - Links das Functions

**Data:** 2025-01-27  
**Status:** ✅ Correções aplicadas

---

## ❌ PROBLEMAS IDENTIFICADOS

### **1. Link do Fluxo:**
- ❌ Gerado: `https://www.ylada.com/pt/wellness/system/acompanhamento/fluxos/fluxo-retencao-cliente`
- ❌ Problemas:
  - Categoria "acompanhamento" não existe como rota (só "vender" e "recrutar")
  - Está usando `codigo` mas a rota espera `id` (UUID)

### **2. Link da Calculadora:**
- ❌ Gerado: `https://www.ylada.com/pt/wellness/andre/calculadora-agua`
- ⚠️ Pode não existir se:
  - O `user_slug` "andre" não existe
  - A ferramenta não foi criada para esse usuário

---

## ✅ CORREÇÕES APLICADAS

### **1. getFluxoInfo - Link Corrigido:**

**Antes:**
```typescript
const categoria = fluxo.categoria || 'vender'
const link = `${baseUrl}/pt/wellness/system/${categoria}/fluxos/${fluxo.codigo}`
```

**Depois:**
```typescript
// Mapear categoria para rota válida (vender ou recrutar)
let categoriaRota = 'vender' // padrão
if (fluxo.categoria === 'recrutamento' || fluxo.categoria === 'apresentacao') {
  categoriaRota = 'recrutar'
} else if (fluxo.categoria === 'vendas' || fluxo.categoria === 'acompanhamento' || fluxo.categoria === 'acao-diaria') {
  categoriaRota = 'vender'
}

// Usar ID do fluxo (UUID) ao invés de código
const link = `${baseUrl}/pt/wellness/system/${categoriaRota}/fluxos/${fluxo.id}`
```

**Mudanças:**
- ✅ Mapeia categoria para rota válida ("vender" ou "recrutar")
- ✅ Usa `fluxo.id` (UUID) ao invés de `fluxo.codigo`
- ✅ Logs detalhados para debug

---

### **2. getFerramentaInfo - Fallback Melhorado:**

**Antes:**
```typescript
if (!link) {
  link = `${baseUrl}/pt/wellness/ferramenta/${templateBase.slug}`
}
```

**Depois:**
```typescript
if (!link) {
  // Tentar buscar ferramenta genérica no banco
  const { data: ferramentaGenerica } = await supabaseAdmin
    .from('wellness_ferramentas')
    .select('id, slug')
    .eq('template_slug', ferramenta_slug)
    .eq('status', 'active')
    .maybeSingle()
  
  if (ferramentaGenerica?.id) {
    link = `${baseUrl}/pt/wellness/ferramenta/${ferramentaGenerica.id}`
  } else {
    link = `${baseUrl}/pt/wellness/ferramenta/${templateBase.slug}`
  }
}
```

**Mudanças:**
- ✅ Tenta buscar ferramenta genérica no banco primeiro
- ✅ Usa ID da ferramenta se encontrar
- ✅ Fallback para slug do template se não encontrar

---

## 🧪 TESTE APÓS CORREÇÕES

### **TESTE 1: Reativação de Cliente**
```
Preciso reativar um cliente que sumiu
```
**Esperado:**
- ✅ Link gerado: `https://www.ylada.com/pt/wellness/system/vender/fluxos/[UUID-do-fluxo]`
- ✅ Link deve funcionar (não 404)

---

### **TESTE 2: Calculadora de Água**
```
Quero enviar a calculadora de água para um cliente
```
**Esperado:**
- ✅ Se tiver `user_slug`: `https://www.ylada.com/pt/wellness/[user-slug]/calculadora-agua`
- ✅ Se não tiver: `https://www.ylada.com/pt/wellness/ferramenta/[id-ou-slug]`
- ✅ Link deve funcionar (não 404)

---

## 📋 VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar se os Links Funcionam:**

**Após fazer deploy, teste:**
1. Acesse o link do fluxo retornado
2. Acesse o link da calculadora retornado
3. **Me avise se algum link ainda não funciona**

---

### **2. Verificar user_slug:**

**Se o link da calculadora não funcionar, pode ser que:**
- O `user_slug` não existe no banco
- A ferramenta não foi criada para esse usuário

**Como verificar:**
```sql
SELECT user_slug FROM user_profiles WHERE user_id = '[seu-user-id]';
```

---

## ✅ RESULTADO ESPERADO

Após essas correções:

1. ✅ **Links de fluxos** usam rota correta e ID válido
2. ✅ **Links de calculadoras** têm fallback melhor
3. ✅ **Logs detalhados** para debug
4. ✅ **Links devem funcionar** (não retornar 404)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Fazer deploy** das correções
2. ⏳ **Testar os links** retornados
3. ⏳ **Verificar se funcionam** (não 404)
4. ⏳ **Me avisar** se algum link ainda não funcionar

---

**✅ Correções aplicadas! Faça deploy e teste os links!**
















