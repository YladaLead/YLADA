# 🤖 Agente Criador de Fluxos - Configuração

## 📋 Visão Geral

O Agente Criador de Fluxos é um assistente IA especializado em criar novos fluxos e diagnósticos para a biblioteca YLADA. Ele gera automaticamente:

- Títulos e descrições
- Perguntas com opções de resposta
- Estrutura compatível com as arquiteturas do sistema
- Metadados necessários

## 🚀 Configuração Inicial

### ✅ Criação Automática (Recomendado)

O Assistant é criado **automaticamente via API** na primeira execução. Não é necessário criar manualmente!

**Como funciona:**
1. Na primeira vez que você gerar um fluxo, o sistema cria o Assistant automaticamente
2. O ID do Assistant será exibido no console/logs
3. (Opcional) Você pode adicionar o ID no `.env` para reutilizar o mesmo Assistant:
   ```bash
   OPENAI_ASSISTANT_FLUX_CREATOR_ID=asst_xxxxxxxxxxxxx
   ```

### 📝 Prompt do Assistant (Usado Automaticamente)

O sistema usa este prompt automaticamente ao criar o Assistant:

```
Você é um especialista em criar fluxos de diagnóstico para profissionais de saúde e bem-estar da plataforma YLADA.

Sua função é criar fluxos completos de diagnóstico que serão adicionados automaticamente à biblioteca do sistema.

REGRAS IMPORTANTES:
1. Sempre retorne APENAS JSON válido, sem markdown ou texto adicional
2. Use português brasileiro
3. Seja específico para o segmento solicitado
4. Perguntas devem ser práticas e acionáveis
5. Cada pergunta deve ter 3-5 opções de resposta

ESTRUTURA OBRIGATÓRIA DO JSON:
{
  "titulo": "Título atrativo e claro",
  "description": "Descrição breve (1-2 linhas)",
  "questions": [
    {
      "id": "q1",
      "label": "Texto da pergunta",
      "type": "single",
      "options": ["Opção 1", "Opção 2", "Opção 3"]
    }
  ],
  "architecture": "RISK_DIAGNOSIS" ou "BLOCKER_DIAGNOSIS" ou "PROFILE_TYPE",
  "segment_code": "código do segmento",
  "tema": "tema do diagnóstico",
  "flow_id": "diagnostico_risco" ou "diagnostico_bloqueio" ou "perfil_comportamental",
  "meta": {}
}

ARQUITETURAS:

RISK_DIAGNOSIS:
- Perguntas devem avaliar sinais, sintomas, histórico e impacto
- Resultado será nível de risco: baixo, médio ou alto
- Foco em saúde, prevenção e consequências
- flow_id: "diagnostico_risco"

BLOCKER_DIAGNOSIS:
- Perguntas devem identificar bloqueios (rotina, emocional, processo, hábitos, expectativa)
- Resultado será o principal bloqueio identificado
- Foco em destravar e primeiro passo
- flow_id: "diagnostico_bloqueio"

PROFILE_TYPE:
- Perguntas devem identificar perfil comportamental
- Resultado será um perfil (consistente, 8ou80, ansioso, analítico, improvisador)
- Foco em autoconhecimento e caminho personalizado
- flow_id: "perfil_comportamental"

SEGMENTOS DISPONÍVEIS:
- nutrition: Nutrição
- nutrition_vendedor: Vendedores Nutracêuticos
- medicine: Médicos
- psychology: Psicólogos
- dentistry: Odontologia
- aesthetics: Estética
- fitness: Fitness
- perfumaria: Perfumaria

IMPORTANTE:
- Sempre retorne JSON válido
- Não use markdown code blocks
- Não adicione texto explicativo antes ou depois do JSON
- Valide que o JSON está correto antes de retornar
```

### ⚙️ Variáveis de Ambiente (Opcionais)

#### 1. ID do Assistant (Opcional)
Se quiser usar um Assistant específico (já criado), adicione no `.env`:

```bash
OPENAI_ASSISTANT_FLUX_CREATOR_ID=asst_xxxxxxxxxxxxx
```

**Nota:** Se não configurar, o sistema criará um novo Assistant automaticamente na primeira execução.

#### 2. Modelo do Assistant (Opcional)
Escolha a qualidade do modelo para criar fluxos:

```bash
# Opções disponíveis:
OPENAI_ASSISTANT_FLUX_CREATOR_MODEL=gpt-4o-mini        # Padrão (mais barato, rápido)
OPENAI_ASSISTANT_FLUX_CREATOR_MODEL=gpt-4o            # Melhor qualidade
OPENAI_ASSISTANT_FLUX_CREATOR_MODEL=gpt-4-turbo       # Alta qualidade
OPENAI_ASSISTANT_FLUX_CREATOR_MODEL=gpt-4.1-mini      # Se disponível na sua conta
```

**Recomendações:**
- **gpt-4o-mini**: Para testes e economia (padrão)
- **gpt-4o**: Para produção com melhor qualidade
- **gpt-4-turbo**: Para máxima qualidade (mais caro)

**Importante:** O modelo precisa estar disponível na sua conta OpenAI. Se usar um modelo que não tem acesso, o sistema retornará erro.

## 📝 Como Usar

### Via Interface Admin

1. Acesse: `/admin/fluxos/gerar`
2. Preencha:
   - **Tema:** Selecione um tema da lista (ou deixe vazio para usar comando personalizado)
   - **Segmento:** Escolha o segmento (nutrition, aesthetics, etc.)
   - **Tipo de Diagnóstico:** RISK_DIAGNOSIS, BLOCKER_DIAGNOSIS ou PROFILE_TYPE
   - **Comando Personalizado:** (opcional) Descreva o que você quer criar
3. Clique em **"Gerar Fluxo"**
4. O sistema irá:
   - Chamar o agente IA
   - Gerar o fluxo completo
   - Salvar automaticamente na biblioteca
   - Retornar o resultado

### Via API

```bash
POST /api/admin/fluxos/gerar
Authorization: Bearer {token_admin}

{
  "tema": "energia",
  "segmento": "nutrition",
  "arquitetura": "RISK_DIAGNOSIS",
  "comando": "Criar diagnóstico sobre cansaço para nutricionistas"
}
```

## 🔍 Validação

O sistema valida automaticamente:

- ✅ Estrutura do JSON
- ✅ Campos obrigatórios
- ✅ Compatibilidade com arquitetura
- ✅ Formato das perguntas

## 📊 Resultado

Após gerar, o fluxo é:

1. **Validado** automaticamente
2. **Salvo** na tabela `ylada_biblioteca_itens`
3. **Disponível** imediatamente na biblioteca
4. **Ativo** por padrão (pode ser desativado depois)

## ⚠️ Troubleshooting

### Erro: "Erro ao criar Assistant"

- Verifique se `OPENAI_API_KEY` está configurada
- Verifique se a API key tem permissão para criar Assistants
- Verifique os logs do servidor para mais detalhes

### Erro: "Agente não retornou resposta"

- Verifique se o Assistant ID está correto
- Verifique se o Assistant está ativo no OpenAI
- Verifique os logs do servidor para mais detalhes

### Erro: "Não foi possível extrair o fluxo"

- O agente pode ter retornado texto em vez de JSON
- Verifique o prompt do Assistant
- Tente novamente com um comando mais específico

## 🔄 Próximos Passos

- [ ] Adicionar função de validação automática (Fase 2)
- [ ] Adicionar preview antes de salvar
- [ ] Adicionar edição manual após geração
- [ ] Adicionar histórico de fluxos gerados
