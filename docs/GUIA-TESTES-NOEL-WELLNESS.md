# 🧪 GUIA DE TESTES - NOEL WELLNESS SYSTEM

**Status:** ✅ Pronto para Testar  
**Scripts únicos:** 368  
**Objeções:** 40

---

## 🎯 COMO TESTAR

### Opção 1: Via Interface Web (Recomendado)

1. Acesse: `/pt/wellness/noel` ou clique em "Peça Ajuda ao NOEL" na home
2. Envie as mensagens de teste abaixo
3. Verifique as respostas

### Opção 2: Via API Direta

Use Postman, curl ou qualquer cliente HTTP:

```bash
POST https://seu-dominio.com/api/wellness/noel
Headers:
  Authorization: Bearer {seu_token}
  Content-Type: application/json

Body:
{
  "message": "Está caro",
  "conversationHistory": []
}
```

---

## 📋 TESTES ESSENCIAIS

### ✅ Teste 1: Objeção de Cliente

**Mensagem:** `"Está caro"`

**O que verificar:**
- [ ] Resposta vem do banco (objeção 1.1)
- [ ] Resposta contém "🙏" (emoji da objeção)
- [ ] Resposta menciona "kit" e "teste"
- [ ] Resposta é leve e natural (Premium Light Copy)

**Resposta esperada (exemplo):**
> "Entendo totalmente, [nome]. 🙏 A ideia aqui não é pesar pra você. O kit é só uma forma leve de você sentir o efeito em 5 dias antes de decidir qualquer coisa maior..."

---

### ✅ Teste 2: Regra Fundamental - Recrutamento

**Mensagem:** `"Quero saber mais sobre o negócio"`

**O que verificar:**
- [ ] **NÃO menciona "PV"**
- [ ] **NÃO menciona "pontos de volume"**
- [ ] Menciona "renda extra" ou "oportunidade"
- [ ] Resposta é leve e natural
- [ ] Usa script de recrutamento do banco

**Resposta esperada (exemplo):**
> "Oi, [nome]! Vi que você curtiu a ideia das bebidas. Tem um projeto de renda extra bem leve que combina com isso. Quer que eu te explique rapidinho?"

**❌ NÃO DEVE CONTER:**
- "PV"
- "pontos de volume"
- "volume de pontos"
- Qualquer referência a PV

---

### ✅ Teste 3: Script por Tipo de Pessoa

**Mensagem:** `"Como falar com pessoas próximas?"`

**O que verificar:**
- [ ] Resposta usa script do banco
- [ ] Script é da categoria `tipo_pessoa`, subcategoria `pessoas_proximas`
- [ ] Resposta é formatada corretamente

**Resposta esperada (exemplo):**
> "Oi, [nome]! 😊 Tô testando umas bebidas de bem-estar aqui e lembrei de você. Posso te mandar rapidinho o que achei legal?"

---

### ✅ Teste 4: Objeção de Recrutamento

**Mensagem:** `"Eu não tenho tempo para isso"`

**O que verificar:**
- [ ] Detecta objeção de recrutamento (3.1)
- [ ] Resposta do banco
- [ ] **NÃO menciona PV**
- [ ] Resposta é empática e leve

---

### ✅ Teste 5: Script por Objetivo

**Mensagem:** `"Preciso de mais energia no dia"`

**O que verificar:**
- [ ] Usa script de objetivo (energia)
- [ ] Resposta é relevante ao objetivo
- [ ] Formato Premium Light Copy

---

## 🔍 VERIFICAÇÕES NO BANCO

### Verificar se objeção foi detectada:
```sql
-- Ver última interação salva
SELECT 
  mensagem_usuario,
  resposta_noel,
  objeção_tratada_id,
  script_usado_id
FROM wellness_consultant_interactions
ORDER BY created_at DESC
LIMIT 1;
```

### Verificar scripts usados:
```sql
-- Ver scripts mais usados
SELECT 
  s.categoria,
  s.subcategoria,
  s.nome,
  COUNT(i.id) as vezes_usado
FROM wellness_scripts s
LEFT JOIN wellness_consultant_interactions i ON i.script_usado_id = s.id
WHERE s.ativo = true
GROUP BY s.id, s.categoria, s.subcategoria, s.nome
ORDER BY vezes_usado DESC
LIMIT 10;
```

### Verificar objeções tratadas:
```sql
-- Ver objeções mais tratadas
SELECT 
  o.categoria,
  o.codigo,
  o.objeção,
  COUNT(i.id) as vezes_tratada
FROM wellness_objecoes o
LEFT JOIN wellness_consultant_interactions i ON i.objeção_tratada_id = o.id
WHERE o.ativo = true
GROUP BY o.id, o.categoria, o.codigo, o.objeção
ORDER BY vezes_tratada DESC
LIMIT 10;
```

---

## ⚠️ PROBLEMAS COMUNS

### Problema 1: Resposta não vem do banco
**Sintoma:** Resposta parece gerada por IA, não usa scripts/objeções

**Solução:**
- Verificar logs do console (deve mostrar "✅ NOEL usando novo motor (v2)")
- Verificar se Agent Builder está configurado (pode estar interceptando)
- Verificar se scripts estão no banco

### Problema 2: Objeção não detectada
**Sintoma:** Mensagem "Está caro" não detecta objeção

**Solução:**
- Verificar se objeção existe no banco
- Verificar logs do `ObjectionMatcher`
- Verificar palavras-chave na mensagem

### Problema 3: Script não encontrado
**Sintoma:** Resposta genérica, não usa script específico

**Solução:**
- Verificar se script existe no banco com categoria/subcategoria correta
- Verificar logs do `ScriptSelector`
- Verificar se modo de operação está correto

---

## 📊 MÉTRICAS DE SUCESSO

### Taxa de Uso de Scripts/Objeções
- **Meta:** > 70% das respostas devem usar scripts/objeções do banco
- **Verificar:** Contar `source: 'knowledge_base'` vs `source: 'ia_generated'`

### Regra Fundamental
- **Meta:** 100% das respostas de recrutamento NÃO mencionam PV
- **Verificar:** Buscar por "PV" nas respostas de recrutamento

### Qualidade das Respostas
- **Meta:** Todas as respostas seguem Premium Light Copy
- **Verificar:** Tom leve, natural, sem pressão

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Duplicatas removidas
2. ⏭️ **Executar testes acima** (AGORA)
3. ⏭️ Validar regra fundamental
4. ⏭️ Ajustar se necessário
5. ⏭️ Documentar resultados

---

## 📝 CHECKLIST FINAL

- [ ] Teste 1: Objeção de cliente funciona
- [ ] Teste 2: Regra fundamental validada (NÃO menciona PV)
- [ ] Teste 3: Scripts por tipo de pessoa funcionam
- [ ] Teste 4: Objeções de recrutamento funcionam
- [ ] Teste 5: Scripts por objetivo funcionam
- [ ] Verificações no banco confirmam uso
- [ ] Logs mostram "✅ NOEL usando novo motor (v2)"
- [ ] Respostas seguem Premium Light Copy





