# 🔧 CORREÇÕES - Eficiência do NOEL

**Data:** Janeiro 2025  
**Objetivo:** Melhorar eficiência do NOEL para usar perfil automaticamente e calcular objetivos precisos

---

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. **Endpoint calcular-objetivos**
- ✅ Corrigido para aceitar `POST` (handler chama via POST)
- ✅ Busca perfil automaticamente do `wellness_noel_profile`
- ✅ Usa valores reais dos produtos do banco de dados

### 2. **Handler de Functions**
- ✅ Adicionado case para `calcularObjetivosCompletos`
- ✅ Melhorado para processar diferentes formatos de resposta
- ✅ Trata corretamente resposta com `sucesso` e `texto_formatado`

### 3. **System Prompt Atualizado**
- ✅ Adicionadas regras claras sobre quando usar `calcularObjetivosCompletos()`
- ✅ Instruções sobre NUNCA pedir informações que já estão no perfil
- ✅ Exemplos de uso correto da função
- ✅ Formato de resposta após chamar a função

### 4. **Contexto de Perfil Estratégico**
- ✅ Melhorado com estratégias específicas por tipo de trabalho
- ✅ Detalhamento dos 3 grupos:
  - `bebidas_funcionais`: serve garrafas, prioridade Kits Energia/Acelera
  - `produtos_fechados`: vende produtos fechados, foco em valor maior
  - `cliente_que_indica`: apenas indica, foco em convites

### 5. **Formatação de Cálculo**
- ✅ Personalizada baseada no `tipo_trabalho`
- ✅ Prioriza produtos corretos conforme o grupo
- ✅ Inclui ações práticas e scripts sugeridos

### 6. **Busca Automática de Perfil**
- ✅ NOEL sempre busca perfil estratégico antes de responder
- ✅ Adiciona contexto do perfil na mensagem enviada ao Assistant
- ✅ Usa informações do perfil sem pedir novamente

---

## ⚠️ AÇÃO NECESSÁRIA NO OPENAI

### Adicionar Function no Schema do Assistant

**Acesse:** https://platform.openai.com/assistants

**Assistant ID:** (verificar `OPENAI_ASSISTANT_NOEL_ID`)

**Adicionar Function:**

```json
{
  "name": "calcularObjetivosCompletos",
  "description": "Calcula objetivos precisos de vendas, recrutamento e produção da equipe para bater as metas estabelecidas. Usa valores reais dos produtos e perfil do usuário automaticamente.",
  "parameters": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

**URL do Endpoint:** (será chamado automaticamente via handler)

---

## 🧪 TESTES RECOMENDADOS

### Teste 1: Cálculo Básico
```
Usuário: "Quantos produtos preciso vender para bater minha meta financeira?"
Esperado: NOEL chama calcularObjetivosCompletos() e retorna objetivos específicos
```

### Teste 2: Plano Completo
```
Usuário: "Me dê um plano"
Esperado: NOEL chama calcularObjetivosCompletos() e monta plano baseado no tipo_trabalho
```

### Teste 3: Meta no Perfil
```
Usuário: "minha meta está no meu perfil"
Esperado: NOEL NÃO pergunta novamente, usa calcularObjetivosCompletos() diretamente
```

### Teste 4: Grupos de Trabalho
```
Usuário com tipo_trabalho = "bebidas_funcionais": "Me dê um plano"
Esperado: Plano foca em Kits Energia/Acelera primeiro, depois outras bebidas
```

---

## 📋 CHECKLIST PÓS-DEPLOY

- [ ] Executar migrações 158 e 159 no banco de dados
- [ ] Adicionar function `calcularObjetivosCompletos` no OpenAI Assistant
- [ ] Testar com usuário que tem perfil completo
- [ ] Testar com usuário que não tem perfil (deve orientar onboarding)
- [ ] Verificar logs para confirmar que função está sendo chamada
- [ ] Validar que respostas usam valores reais dos produtos

---

## 🎯 RESULTADO ESPERADO

Após essas correções, o NOEL deve:

1. ✅ Sempre buscar perfil antes de responder sobre metas/planos
2. ✅ Chamar `calcularObjetivosCompletos()` automaticamente quando pedir cálculo
3. ✅ NÃO pedir informações que já estão no perfil
4. ✅ Retornar objetivos precisos usando valores reais
5. ✅ Personalizar plano baseado no tipo_trabalho
6. ✅ Incluir scripts e ações práticas específicas por grupo

---

**Status:** ✅ Correções implementadas e commitadas  
**Próximo passo:** Adicionar function no OpenAI Assistant e testar
