# 🔄 ETAPA 2: INTEGRAÇÃO DO ENDPOINT PRINCIPAL

**Status:** 🚧 Em Progresso  
**Objetivo:** Integrar novo motor NOEL no endpoint principal `/api/wellness/noel`

---

## 📋 SITUAÇÃO ATUAL

### Endpoint Principal: `/api/wellness/noel/route.ts`
- ✅ Usa Agent Builder (se configurado)
- ✅ Fallback para sistema híbrido (knowledge base + OpenAI)
- ❌ **NÃO usa o novo motor NOEL** (scripts, objeções, modos)

### Novo Endpoint: `/api/wellness/noel/v2/route.ts`
- ✅ Usa motor NOEL completo
- ✅ Busca scripts do banco
- ✅ Detecta e trata objeções
- ✅ Usa modos de operação
- ✅ Construtor de resposta estruturado

### Frontend: `src/app/pt/wellness/noel/page.tsx`
- ✅ Chama `/api/wellness/noel` (endpoint principal)
- ✅ Espera resposta no formato: `{ response, module, source }`

---

## 🎯 ESTRATÉGIA DE INTEGRAÇÃO

### Opção A: Atualizar endpoint principal (RECOMENDADO)
**Vantagens:**
- Mantém compatibilidade com frontend existente
- Não precisa alterar frontend
- Migração gradual possível

**Implementação:**
1. Manter Agent Builder como prioridade 1
2. Se Agent Builder não disponível, usar novo motor NOEL
3. Manter fallback híbrido como última opção

### Opção B: Migrar frontend para `/v2`
**Vantagens:**
- Endpoint principal continua funcionando
- Testes isolados possíveis

**Desvantagens:**
- Precisa atualizar frontend
- Dois endpoints ativos

---

## 🔧 IMPLEMENTAÇÃO RECOMENDADA

### Fluxo Proposto:

```
1. Tentar Agent Builder (se configurado)
   ↓ (se não disponível)
2. Usar novo motor NOEL (v2)
   - Detectar objeções
   - Buscar scripts do banco
   - Selecionar modo de operação
   - Construir resposta estruturada
   ↓ (se falhar)
3. Fallback híbrido (sistema antigo)
```

---

## 📝 CHECKLIST

- [ ] Atualizar `/api/wellness/noel/route.ts` para usar novo motor
- [ ] Manter compatibilidade com formato de resposta atual
- [ ] Testar fluxo completo
- [ ] Validar que scripts são buscados do banco
- [ ] Validar que objeções são detectadas
- [ ] Validar regra fundamental (não mencionar PV)

---

## 🧪 TESTES NECESSÁRIOS

### Teste 1: Objeção de Cliente
```json
POST /api/wellness/noel
{
  "message": "Está caro",
  "conversationHistory": []
}
```
**Esperado:** Resposta usando objeção do banco (categoria: clientes, codigo: 1.1)

### Teste 2: Script de Recrutamento
```json
POST /api/wellness/noel
{
  "message": "Quero saber mais sobre o negócio",
  "conversationHistory": []
}
```
**Esperado:** 
- Modo: recrutamento
- Script do banco (categoria: recrutamento)
- **NÃO mencionar PV** (regra fundamental)

### Teste 3: Script por Tipo de Pessoa
```json
POST /api/wellness/noel
{
  "message": "Como falar com pessoas próximas?",
  "conversationHistory": []
}
```
**Esperado:** Script do banco (categoria: tipo_pessoa, subcategoria: pessoas_proximas)

---

## 📊 PRÓXIMOS PASSOS

1. ✅ Verificar seeds executados
2. ⏭️ **Atualizar endpoint principal** (AGORA)
3. ⏭️ Testar fluxo completo
4. ⏭️ Validar regra fundamental





