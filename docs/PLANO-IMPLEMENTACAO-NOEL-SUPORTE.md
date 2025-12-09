# 🎯 Plano de Implementação: NOEL Suporte

## 📋 Visão Geral

Expandir o NOEL atual para incluir **Modo Suporte**, permitindo que a IA:
- Resolva problemas técnicos automaticamente
- Renove senhas
- Corrija problemas de assinatura
- Notifique administradores quando necessário
- Seja acessível via página pública `/suporte` (sem login)

---

## 🏗️ Arquitetura

### 1. Estrutura de Modos do NOEL

```
NOEL (Assistente Unificado)
├── Modo Mentor (existente)
│   └── Foco: Negócios, vendas, recrutamento
└── Modo Suporte (novo)
    └── Foco: Problemas técnicos, acesso, pagamentos
```

### 2. Fluxo de Detecção de Modo

```
Usuário faz pergunta
    ↓
NOEL analisa contexto
    ↓
É sobre suporte técnico? → Modo Suporte
É sobre negócios? → Modo Mentor
```

---

## 📁 Estrutura de Arquivos

### Backend (APIs)

```
src/app/api/
├── noel/
│   ├── route.ts (existente - expandir)
│   ├── suporte/
│   │   ├── route.ts (novo - chat público)
│   │   ├── identificar-usuario/route.ts (novo)
│   │   └── acoes/
│   │       ├── reset-password/route.ts (novo)
│   │       ├── corrigir-assinatura/route.ts (novo)
│   │       ├── verificar-pagamento/route.ts (novo)
│   │       └── notificar-admin/route.ts (novo)
│   └── functions/
│       └── suporte-functions.ts (novo - function calling)
```

### Frontend (Páginas e Componentes)

```
src/app/
├── suporte/
│   └── page.tsx (novo - página pública)
│
src/components/
├── wellness/
│   ├── NoelChatPage.tsx (existente - expandir)
│   └── NoelSuporteWidget.tsx (novo - widget de suporte)
└── shared/
    └── SupportChat.tsx (novo - componente reutilizável)
```

### Bibliotecas (Lógica)

```
src/lib/
├── noel-wellness/
│   ├── system-prompt-lousa7.ts (existente - expandir)
│   ├── suporte/
│   │   ├── suporte-prompt.ts (novo)
│   │   ├── contexto-suporte.ts (novo)
│   │   ├── detectar-modo.ts (novo)
│   │   └── validar-identidade.ts (novo)
│   └── function-security.ts (existente - expandir)
└── suporte/
    ├── acoes-suporte.ts (novo - funções administrativas)
    └── notificacoes-admin.ts (novo)
```

---

## 🗄️ Banco de Dados

### Novas Tabelas

```sql
-- Tabela de conversas de suporte (públicas, sem login)
CREATE TABLE suporte_conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL, -- ID de sessão anônima
  email VARCHAR(255), -- Email fornecido pelo usuário (opcional)
  telefone VARCHAR(50), -- Telefone fornecido (opcional)
  user_id UUID REFERENCES auth.users(id), -- Se identificado
  modo TEXT DEFAULT 'suporte', -- 'suporte' ou 'mentor'
  status TEXT DEFAULT 'aberta', -- 'aberta', 'resolvida', 'escalada'
  mensagens JSONB DEFAULT '[]',
  acoes_realizadas JSONB DEFAULT '[]', -- Log de ações
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de notificações para admin
CREATE TABLE admin_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL, -- 'suporte_escalado', 'acao_sensivel', 'erro_sistema'
  prioridade TEXT DEFAULT 'media', -- 'baixa', 'media', 'alta', 'urgente'
  titulo TEXT NOT NULL,
  descricao TEXT,
  user_id UUID REFERENCES auth.users(id),
  conversa_id UUID REFERENCES suporte_conversas(id),
  dados_extras JSONB,
  lida BOOLEAN DEFAULT false,
  resolvida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de ações realizadas pela IA (auditoria)
CREATE TABLE suporte_acoes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID REFERENCES suporte_conversas(id),
  acao_tipo TEXT NOT NULL, -- 'reset_password', 'corrigir_assinatura', etc.
  user_id UUID REFERENCES auth.users(id),
  dados_antes JSONB,
  dados_depois JSONB,
  resultado TEXT, -- 'sucesso', 'erro', 'requer_admin'
  mensagem_erro TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_suporte_conversas_session ON suporte_conversas(session_id);
CREATE INDEX idx_suporte_conversas_user ON suporte_conversas(user_id);
CREATE INDEX idx_admin_notificacoes_lida ON admin_notificacoes(lida, prioridade);
CREATE INDEX idx_suporte_acoes_log_user ON suporte_acoes_log(user_id);
```

### Alterações em Tabelas Existentes

```sql
-- Adicionar coluna em wellness_noel_profile para rastrear modo preferido
ALTER TABLE wellness_noel_profile 
ADD COLUMN IF NOT EXISTS modo_preferido TEXT DEFAULT 'mentor';

-- Adicionar coluna em subscriptions para rastrear problemas
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS problemas_reportados JSONB DEFAULT '[]';
```

---

## 🔧 Funções do NOEL (Function Calling)

### Funções de Suporte

```typescript
// Funções que o NOEL poderá chamar em modo suporte

1. identificarUsuario(email?: string, telefone?: string)
   → Busca usuário no banco e retorna dados básicos
   → Retorna: { encontrado: boolean, user_id?, dados_basicos? }

2. verificarStatusAssinatura(user_id: string)
   → Verifica status da assinatura
   → Retorna: { status, problemas, pode_corrigir }

3. resetarSenha(user_id: string, email: string)
   → Gera senha temporária e envia email
   → Retorna: { sucesso, senha_temporaria?, expira_em }

4. corrigirAssinatura(user_id: string, problema: string)
   → Tenta corrigir problemas comuns de assinatura
   → Retorna: { sucesso, acao_realizada, mensagem }

5. verificarPagamentoMercadoPago(email: string, telefone?: string)
   → Busca pagamentos no Mercado Pago
   → Retorna: { encontrado, status_pagamento, assinatura_criada }

6. criarContaAposPagamento(dados: { email, telefone, nome, payment_id })
   → Cria conta automaticamente após pagamento confirmado
   → Retorna: { sucesso, user_id, senha_temporaria }

7. notificarAdmin(tipo: string, dados: object)
   → Cria notificação para admin
   → Retorna: { sucesso, notificacao_id }

8. obterHistoricoProblemas(user_id: string)
   → Retorna histórico de problemas do usuário
   → Retorna: { problemas: [] }
```

---

## 🎨 Componentes Frontend

### 1. Página Pública de Suporte (`/suporte`)

```typescript
// src/app/suporte/page.tsx

Características:
- Página pública (sem autenticação)
- Header: "Precisa de ajuda? Estamos aqui!"
- Chat widget integrado
- FAQ rápida (problemas comuns)
- Link para login (se já tiver conta)
- Design responsivo e acessível
```

### 2. Widget de Suporte Reutilizável

```typescript
// src/components/shared/SupportChat.tsx

Características:
- Componente reutilizável
- Pode ser usado em qualquer página
- Suporta modo público (sem login) e autenticado
- Interface similar ao NOEL atual
- Indicador visual de modo (Suporte vs Mentor)
```

### 3. Expansão do NOEL Chat

```typescript
// src/components/wellness/NoelChatPage.tsx (expandir)

Adicionar:
- Seletor de modo (Mentor / Suporte)
- Detecção automática de modo baseado na pergunta
- Indicador visual do modo ativo
- Histórico separado por modo
```

---

## 🔐 Segurança

### Validação de Identidade

```typescript
// src/lib/noel-wellness/suporte/validar-identidade.ts

Funções:
- validarEmail(email): Verifica formato e existência
- validarTelefone(telefone): Formata e valida
- perguntasSeguranca(user_id): Gera perguntas baseadas no perfil
- verificarRespostas(user_id, respostas): Valida respostas
- rateLimitIdentificacao(session_id): Limita tentativas
```

### Níveis de Autorização

```typescript
Nível 1 - Sem Autenticação (Público):
- Ver informações básicas
- Fazer perguntas gerais
- Identificar usuário por email/telefone

Nível 2 - Identificado (Email/Telefone validado):
- Ver status de assinatura
- Solicitar reset de senha
- Verificar pagamentos

Nível 3 - Autenticado (Login):
- Todas as ações de Nível 2
- Atualizar perfil
- Corrigir problemas de assinatura

Nível 4 - Requer Admin:
- Cancelamentos
- Reembolsos
- Mudanças críticas
```

### Rate Limiting

```typescript
- Conversas públicas: 10 por hora por IP
- Identificação: 3 tentativas por hora
- Reset de senha: 1 por hora por email
- Ações administrativas: 5 por dia por usuário
```

---

## 📝 Prompts do Sistema

### Prompt de Suporte

```typescript
// src/lib/noel-wellness/suporte/suporte-prompt.ts

Conteúdo:
- Personalidade: Prestativo, técnico, eficiente
- Objetivo: Resolver problemas rapidamente
- Tom: Profissional mas amigável
- Limitações: Não inventar soluções, sempre validar
- Escalação: Quando não souber, notificar admin
```

### Detecção de Modo

```typescript
// src/lib/noel-wellness/suporte/detectar-modo.ts

Palavras-chave Suporte:
- "esqueci senha", "não consigo entrar", "problema", "erro"
- "pagamento", "assinatura", "mercado pago"
- "não funciona", "bug", "ajuda técnica"

Palavras-chave Mentor:
- "como vender", "recrutar", "equipe", "meta"
- "fluxo", "script", "ferramenta", "cliente"
```

---

## 🔄 Fluxos Principais

### Fluxo 1: Usuário Público com Problema de Acesso

```
1. Usuário acessa /suporte (sem login)
2. Chat aparece: "Olá! Como posso ajudar?"
3. Usuário: "Paguei mas não consigo entrar"
4. NOEL pede: email ou telefone
5. NOEL verifica pagamento no Mercado Pago
6. NOEL verifica se conta existe
7a. Se conta não existe: NOEL cria conta e envia senha
7b. Se conta existe: NOEL verifica problema e corrige
8. NOEL informa: "Pronto! Sua conta está ativa. Senha enviada por email."
```

### Fluxo 2: Reset de Senha

```
1. Usuário: "Esqueci minha senha"
2. NOEL pede: email cadastrado
3. NOEL valida email no banco
4. NOEL gera senha temporária
5. NOEL envia email com senha
6. NOEL registra ação no log
7. NOEL informa: "Senha temporária enviada! Verifique seu email."
```

### Fluxo 3: Problema de Assinatura

```
1. Usuário autenticado: "Minha assinatura não está funcionando"
2. NOEL verifica status da assinatura
3. NOEL identifica problema (ex: expirada, pagamento pendente)
4. NOEL tenta corrigir automaticamente
5a. Se conseguiu: "✅ Corrigido! Sua assinatura está ativa."
5b. Se não conseguiu: "Vou encaminhar para nossa equipe."
6. NOEL notifica admin se necessário
```

### Fluxo 4: Escalação para Admin

```
1. Usuário: "Quero cancelar e ter reembolso"
2. NOEL detecta: ação requer aprovação de admin
3. NOEL: "Entendi. Reembolsos precisam ser aprovados."
4. NOEL cria notificação para admin
5. NOEL informa usuário: "Sua solicitação foi encaminhada. Resposta em até 24h."
6. Admin recebe notificação no dashboard
```

---

## 📧 Integração com Email

### Email de Confirmação de Pagamento (Expandir)

```typescript
// Adicionar ao email existente:

Conteúdo adicional:
- Link direto de acesso: [Acessar Agora]
- Link de suporte: "Problemas para acessar? [Clique aqui]"
- Instruções de primeiro acesso
- Contato de suporte
```

### Email de Reset de Senha (Já existe - melhorar)

```typescript
// Expandir template existente:

Adicionar:
- Instruções claras de uso
- Link para página de suporte
- Informações de segurança
```

---

## 🎯 Ordem de Implementação

### Fase 1: Fundação (Semana 1)
1. ✅ Criar tabelas no banco de dados
2. ✅ Criar estrutura de arquivos
3. ✅ Implementar detecção de modo
4. ✅ Criar prompt de suporte

### Fase 2: Página Pública (Semana 1-2)
1. ✅ Criar `/suporte` (página pública)
2. ✅ Implementar chat público (sem login)
3. ✅ Implementar identificação de usuário
4. ✅ Integrar com NOEL API

### Fase 3: Funções de Suporte (Semana 2)
1. ✅ Implementar `identificarUsuario`
2. ✅ Implementar `verificarStatusAssinatura`
3. ✅ Implementar `verificarPagamentoMercadoPago`
4. ✅ Implementar `resetarSenha`

### Fase 4: Ações Administrativas (Semana 2-3)
1. ✅ Implementar `corrigirAssinatura`
2. ✅ Implementar `criarContaAposPagamento`
3. ✅ Implementar `notificarAdmin`
4. ✅ Sistema de logs e auditoria

### Fase 5: Integração e Testes (Semana 3)
1. ✅ Integrar funções no NOEL (function calling)
2. ✅ Testar fluxos principais
3. ✅ Ajustar prompts e respostas
4. ✅ Testes de segurança

### Fase 6: Melhorias (Semana 4)
1. ✅ Dashboard de notificações para admin
2. ✅ Métricas e analytics
3. ✅ Otimizações de performance
4. ✅ Documentação final

---

## 🧪 Testes Necessários

### Testes Funcionais
- [ ] Usuário público consegue acessar `/suporte`
- [ ] NOEL identifica usuário por email/telefone
- [ ] Reset de senha funciona corretamente
- [ ] Correção de assinatura funciona
- [ ] Notificações para admin são criadas
- [ ] Detecção de modo funciona corretamente

### Testes de Segurança
- [ ] Rate limiting funciona
- [ ] Validação de identidade é rigorosa
- [ ] Ações sensíveis requerem confirmação
- [ ] Logs são criados corretamente
- [ ] Dados sensíveis não são expostos

### Testes de Integração
- [ ] Integração com Mercado Pago funciona
- [ ] Emails são enviados corretamente
- [ ] Notificações push funcionam
- [ ] Histórico de conversas é salvo

---

## 📊 Métricas de Sucesso

### KPIs
- Taxa de resolução automática: > 70%
- Tempo médio de resposta: < 2 minutos
- Taxa de escalação para admin: < 30%
- Satisfação do usuário: > 4.5/5
- Redução de tickets manuais: > 50%

---

## 🔗 Integrações Necessárias

### APIs Externas
- ✅ Mercado Pago API (já existe - expandir uso)
- ✅ Resend API (já existe - expandir templates)
- ✅ OpenAI Assistants API (já existe - adicionar funções)

### Serviços Internos
- ✅ Supabase (banco, auth, storage)
- ✅ Sistema de notificações push (já existe)
- ✅ Sistema de logs (expandir)

---

## 📚 Documentação Adicional

### Para Desenvolvedores
- [ ] Guia de adicionar novas funções de suporte
- [ ] Guia de criação de prompts
- [ ] Guia de testes

### Para Usuários
- [ ] FAQ de suporte
- [ ] Guia de uso do chat de suporte
- [ ] Troubleshooting comum

### Para Admins
- [ ] Guia de gerenciamento de notificações
- [ ] Guia de resolução de problemas escalados
- [ ] Dashboard de métricas

---

## ⚠️ Considerações Importantes

### Segurança
- Nunca expor dados sensíveis sem validação
- Sempre logar ações administrativas
- Implementar rate limiting rigoroso
- Validar identidade antes de ações sensíveis

### Performance
- Cache de verificações de assinatura
- Limitar histórico de mensagens carregadas
- Otimizar queries ao banco
- Usar índices adequados

### UX
- Mensagens claras e objetivas
- Feedback imediato para ações
- Indicadores de progresso
- Opção de falar com humano sempre disponível

---

## 🚀 Próximos Passos

1. Revisar este plano
2. Aprovar estrutura proposta
3. Começar implementação pela Fase 1
4. Iterar baseado em feedback

---

**Status:** 📋 Plano completo - Aguardando aprovação para iniciar implementação
