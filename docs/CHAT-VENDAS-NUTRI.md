# 💬 Chat de Vendas - Atendente Ana (YLADA Nutri)

## 📋 Visão Geral

O Chat de Vendas é um sistema de atendimento com IA integrado na página de vendas (`/pt/nutri`) que ajuda nutricionistas a entenderem a plataforma e converte-las em clientes.

## 🎯 Funcionalidades

- **Botão flutuante** na página de vendas
- **Atendente virtual "Ana"** com IA (OpenAI)
- **Conversação natural** focada em conversão
- **Histórico de conversa** mantido por sessão
- **CTA integrado** para checkout
- **Fallback inteligente** se IA não estiver disponível

## 🏗️ Arquitetura

### Componentes

1. **`ChatVendasButton.tsx`**
   - Botão flutuante que abre o chat
   - Posicionado no canto inferior direito
   - Indicador visual de "online"

2. **`ChatVendas.tsx`**
   - Interface do chat
   - Gerencia mensagens e estado
   - Formatação de texto (markdown simples)
   - CTA fixo para checkout

3. **`/api/chat/vendas`**
   - API que processa mensagens
   - Integração com OpenAI
   - Gerencia threads/conversas
   - Fallback se IA não disponível

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione no `.env.local`:

```env
# OpenAI (obrigatório para IA funcionar)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Opcional: ID do assistente pré-criado
OPENAI_ASSISTANT_VENDAS_ID=asst_xxxxxxxxxxxxx
```

### 2. Como Funciona

#### **Com OpenAI configurado:**
- Usa **GPT-4o-mini** (modelo econômico)
- Mantém histórico da conversa por sessão
- Respostas personalizadas e contextuais
- Focada em conversão

#### **Sem OpenAI:**
- Fallback para mensagens pré-definidas
- Chat ainda funciona, mas com respostas genéricas

### 3. Criar Assistente no OpenAI (Opcional)

Para melhor performance, crie um assistente no OpenAI Platform:

1. Acesse: https://platform.openai.com/assistants
2. Clique em "Create Assistant"
3. Configure:
   - **Name:** Ana - Atendente Vendas YLADA Nutri
   - **Model:** gpt-4o-mini
   - **Instructions:** (use o prompt do arquivo `route.ts`)
4. Copie o **Assistant ID**
5. Adicione em `.env.local` como `OPENAI_ASSISTANT_VENDAS_ID`

## 🎨 Personalização

### Prompt do Sistema

O prompt está em `src/app/api/chat/vendas/route.ts` na variável `systemPrompt`. Você pode ajustar:

- Tom da conversa
- Informações sobre a plataforma
- Estratégias de conversão
- CTAs e próximos passos

### Estilo Visual

Ajuste cores e estilo em:
- `ChatVendas.tsx` - Cores do chat
- `ChatVendasButton.tsx` - Botão flutuante

## 💰 Custos

### Modelo: GPT-4o-mini

- **Input:** ~$0.15 por 1M tokens
- **Output:** ~$0.60 por 1M tokens
- **Estimativa:** ~R$ 0,01-0,05 por conversa média

### Otimizações

- Usa `gpt-4o-mini` (mais barato)
- Limita histórico a 10 mensagens
- Max tokens: 500 por resposta
- Threads são reutilizados por sessão

## 📊 Monitoramento

### Logs

A API registra:
- Criação de threads
- Erros de API
- Uso de fallback

### Métricas Recomendadas

- Total de conversas iniciadas
- Taxa de conversão (chat → checkout)
- Mensagens por conversa
- Tempo médio de conversa

## 🔧 Troubleshooting

### Chat não abre
- Verifique se `ChatVendasButton` está importado na página
- Verifique console do navegador para erros

### IA não responde
- Verifique `OPENAI_API_KEY` no `.env.local`
- Verifique logs do servidor
- Sistema usa fallback automaticamente

### Respostas genéricas
- Verifique se o prompt do sistema está correto
- Considere criar assistente no OpenAI Platform
- Ajuste o `systemPrompt` em `route.ts`

## 🚀 Próximos Passos

1. **Analytics:** Integrar tracking de conversas
2. **A/B Testing:** Testar diferentes prompts
3. **Integração CRM:** Salvar leads do chat
4. **Horário de Atendimento:** Mostrar disponibilidade
5. **Transferência Humana:** Opção de falar com humano

## 📝 Notas

- O chat mantém contexto por sessão (até fechar)
- Threads são armazenados em memória (considerar Redis em produção)
- Fallback garante que chat sempre funcione
- CTA fixo sempre visível para conversão

