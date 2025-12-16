# 🔒 PLANO COMPLETO DE PROTEÇÃO DE DADOS - LGPD/GDPR

## 📋 RESUMO EXECUTIVO

Este documento detalha **TODAS as ações necessárias** para tornar o sistema YLADA totalmente compatível com a **Lei Geral de Proteção de Dados (LGPD)** e o **General Data Protection Regulation (GDPR)**.

**Status Atual:** ⚠️ **NÃO CONFORME** - Faltam implementações críticas

**Prioridade:** 🔴 **ALTA** - Necessário para operação legal

---

## 🎯 1. PÁGINAS LEGAIS OBRIGATÓRIAS

### ✅ **1.1 Política de Privacidade** (`/pt/politica-de-privacidade`)

**Status:** ❌ Não implementada

**O que precisa conter:**
- Como coletamos dados pessoais
- Quais dados coletamos (nome, email, telefone, CPF, endereço, etc.)
- Finalidade do tratamento de dados
- Base legal para processamento
- Como armazenamos os dados
- Com quem compartilhamos dados (Stripe, Mercado Pago, Supabase)
- Tempo de retenção dos dados
- Direitos do titular (acesso, correção, exclusão, portabilidade)
- Como exercer os direitos
- Contato do Encarregado de Dados (DPO)
- Uso de cookies e tecnologias similares
- Transferência internacional de dados (se aplicável)
- Medidas de segurança implementadas

**Ação:** Criar página React em `/src/app/pt/politica-de-privacidade/page.tsx`

---

### ✅ **1.2 Termos de Uso** (`/pt/termos-de-uso`)

**Status:** ❌ Não implementada

**O que precisa conter:**
- Aceitação dos termos
- Descrição dos serviços
- Responsabilidades do usuário
- Propriedade intelectual
- Limitação de responsabilidade
- Política de cancelamento
- Reembolsos (se aplicável)
- Modificações dos termos
- Lei aplicável e foro

**Ação:** Criar página React em `/src/app/pt/termos-de-uso/page.tsx`

---

### ✅ **1.3 Política de Cookies** (`/pt/politica-de-cookies`)

**Status:** ❌ Não implementada

**O que precisa conter:**
- O que são cookies
- Quais cookies usamos
- Cookies essenciais vs. opcionais
- Como gerenciar cookies
- Cookies de terceiros (Stripe, Mercado Pago, analytics)

**Ação:** Criar página React em `/src/app/pt/politica-de-cookies/page.tsx`

---

### ✅ **1.4 Política de Reembolso** (`/pt/politica-de-reembolso`)

**Status:** ❌ Não implementada

**O que precisa conter:**
- Prazo para solicitar reembolso (7 dias conforme CDC)
- Condições para reembolso
- Processo de solicitação
- Forma de reembolso
- Exceções (se houver)

**Ação:** Criar página React em `/src/app/pt/politica-de-reembolso/page.tsx`

---

## 🍪 2. BANNER DE CONSENTIMENTO DE COOKIES

**Status:** ❌ Não implementado

**O que precisa:**
- Banner que aparece na primeira visita
- Opções: "Aceitar Todos", "Rejeitar Todos", "Personalizar"
- Armazenar preferência do usuário (localStorage + cookie)
- Não carregar cookies não essenciais até consentimento
- Link para política de cookies

**Ação:** 
1. Criar componente `/src/components/legal/CookieConsentBanner.tsx`
2. Adicionar ao layout principal (`/src/app/layout.tsx`)
3. Criar hook para gerenciar consentimento (`/src/lib/hooks/useCookieConsent.ts`)

---

## 📝 3. REGISTRO DE CONSENTIMENTO

**Status:** ❌ Não implementado

**O que precisa:**
- Tabela no banco para registrar consentimentos
- Registrar quando usuário aceita termos/política
- Registrar versão da política aceita
- Registrar data/hora do consentimento
- Permitir revogação de consentimento

**Ação:** 
1. Criar migration: `migrations/create-consent-records-table.sql`
2. Criar API: `/src/app/api/consent/route.ts`
3. Atualizar fluxo de cadastro para coletar consentimento

**Estrutura da tabela:**
```sql
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL, -- 'privacy_policy', 'terms_of_use', 'cookies', 'marketing'
  version VARCHAR(20) NOT NULL, -- Versão do documento aceito
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45), -- Para auditoria
  user_agent TEXT, -- Para auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 4. DIREITOS DO TITULAR (LGPD/GDPR)

### ✅ **4.1 Direito de Acesso aos Dados**

**Status:** ⚠️ Parcialmente implementado (apenas para admin)

**O que precisa:**
- Endpoint para usuário exportar seus próprios dados
- Retornar todos os dados em formato estruturado (JSON)
- Incluir: perfil, clientes, leads, templates, conversões, assinaturas, etc.

**Ação:** 
1. Criar API: `/src/app/api/user/data-export/route.ts`
2. Criar página: `/src/app/pt/configuracao/exportar-dados/page.tsx`
3. Adicionar botão na página de configurações

---

### ✅ **4.2 Direito de Correção**

**Status:** ✅ Implementado (usuário pode editar perfil)

**O que precisa:**
- Garantir que todos os campos editáveis funcionem
- Validar dados antes de salvar
- Registrar histórico de alterações (opcional, mas recomendado)

**Ação:** Verificar se todas as áreas permitem edição correta

---

### ✅ **4.3 Direito de Exclusão (Direito ao Esquecimento)**

**Status:** ⚠️ Parcialmente implementado

**O que precisa:**
- Endpoint completo para deletar TODOS os dados do usuário
- Deletar de TODAS as tabelas relacionadas:
  - `user_profiles`
  - `clients` / `coach_clients`
  - `leads` / `coach_leads`
  - `user_templates` / `coach_user_templates`
  - `wellness_noel_profile`
  - `wellness_subscriptions`
  - `wellness_conversions`
  - `push_subscriptions`
  - `user_consents`
  - Históricos, avaliações, documentos, etc.
- Deletar usuário do Supabase Auth
- Confirmar exclusão por email antes de executar
- Manter registro de exclusão (anônimo) para auditoria

**Ação:** 
1. Criar API completa: `/src/app/api/user/delete-account/route.ts`
2. Criar página: `/src/app/pt/configuracao/excluir-conta/page.tsx`
3. Implementar confirmação por email antes de deletar

---

### ✅ **4.4 Direito de Portabilidade**

**Status:** ❌ Não implementado

**O que precisa:**
- Exportar dados em formato estruturado (JSON)
- Permitir download do arquivo
- Formato legível e estruturado

**Ação:** Mesma implementação do item 4.1 (exportação de dados)

---

### ✅ **4.5 Direito de Revogação de Consentimento**

**Status:** ❌ Não implementado

**O que precisa:**
- Permitir usuário revogar consentimentos
- Atualizar registro na tabela `user_consents`
- Parar processamento baseado no consentimento revogado
- Notificar usuário sobre consequências da revogação

**Ação:** 
1. Criar API: `/src/app/api/consent/revoke/route.ts`
2. Adicionar opção na página de configurações

---

## 📊 5. AUDITORIA E LOGS

**Status:** ❌ Não implementado

**O que precisa:**
- Registrar acessos a dados pessoais
- Registrar alterações em dados sensíveis
- Registrar exclusões de dados
- Manter logs por período determinado (ex: 2 anos)
- Logs devem incluir: quem, o quê, quando, IP, user agent

**Ação:** 
1. Criar tabela: `data_access_logs`
2. Criar triggers no banco para registrar alterações
3. Criar middleware para registrar acessos via API

**Estrutura da tabela:**
```sql
CREATE TABLE IF NOT EXISTS data_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- 'read', 'update', 'delete', 'export'
  table_name VARCHAR(100),
  record_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔒 6. SEGURANÇA DE DADOS

### ✅ **6.1 Criptografia**

**Status:** ⚠️ Verificar

**O que precisa:**
- Dados em trânsito: HTTPS (já implementado via Vercel)
- Dados em repouso: Verificar se Supabase criptografa
- Dados sensíveis (CPF, senhas): Devem estar criptografados
- Senhas: Hash seguro (Supabase já faz)

**Ação:** Verificar configurações do Supabase

---

### ✅ **6.2 Controle de Acesso**

**Status:** ✅ Implementado (RLS no Supabase)

**O que precisa:**
- Garantir que RLS está ativo em todas as tabelas
- Verificar políticas de acesso
- Garantir que usuários só acessam seus próprios dados

**Ação:** Revisar todas as políticas RLS

---

### ✅ **6.3 Backup e Recuperação**

**Status:** ⚠️ Verificar

**O que precisa:**
- Backup automático configurado no Supabase
- Plano de recuperação em caso de perda de dados
- Testes periódicos de restauração

**Ação:** Verificar configurações de backup no Supabase

---

## 📧 7. NOTIFICAÇÕES E COMUNICAÇÃO

**Status:** ❌ Não implementado

**O que precisa:**
- Notificar usuário em caso de vazamento de dados (obrigatório por lei)
- Notificar mudanças na política de privacidade
- Notificar sobre uso de dados para novos fins
- Canal de comunicação para questões de privacidade

**Ação:** 
1. Criar template de email para notificações de privacidade
2. Criar API: `/src/app/api/privacy/notify/route.ts`
3. Criar página de contato: `/src/app/pt/privacidade/contato/page.tsx`

---

## 🗄️ 8. RETENÇÃO DE DADOS

**Status:** ❌ Não implementado

**O que precisa:**
- Definir período de retenção para cada tipo de dado
- Implementar rotina de exclusão automática após período
- Documentar política de retenção na política de privacidade

**Exemplos:**
- Dados de conta inativa: 2 anos após último acesso
- Dados de assinatura cancelada: 1 ano após cancelamento
- Logs de acesso: 2 anos
- Dados de leads não convertidos: 1 ano

**Ação:** 
1. Criar script SQL para limpeza automática
2. Configurar job no Supabase (cron job)
3. Documentar na política de privacidade

---

## 👤 9. ENCARREGADO DE DADOS (DPO)

**Status:** ❌ Não designado

**O que precisa:**
- Designar pessoa responsável pela proteção de dados
- Criar canal de contato (email, página)
- Documentar na política de privacidade

**Ação:** 
1. Designar DPO
2. Criar email: `privacidade@ylada.com` (ou similar)
3. Criar página: `/src/app/pt/privacidade/contato/page.tsx`

---

## 🔄 10. TRANSFERÊNCIA INTERNACIONAL DE DADOS

**Status:** ⚠️ Verificar

**O que precisa:**
- Identificar se há transferência internacional (Supabase pode estar em servidores fora do Brasil)
- Documentar na política de privacidade
- Garantir que provedor (Supabase) está em conformidade
- Verificar cláusulas contratuais padrão (SCCs)

**Ação:** 
1. Verificar localização dos servidores do Supabase
2. Verificar termos de serviço do Supabase
3. Documentar na política de privacidade

---

## 📋 11. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Documentação Legal (Prioridade ALTA)
- [ ] Criar Política de Privacidade
- [ ] Criar Termos de Uso
- [ ] Criar Política de Cookies
- [ ] Criar Política de Reembolso
- [ ] Adicionar links no footer de todas as páginas

### Fase 2: Consentimento (Prioridade ALTA)
- [ ] Criar tabela `user_consents`
- [ ] Criar banner de cookies
- [ ] Implementar coleta de consentimento no cadastro
- [ ] Criar API de gerenciamento de consentimento
- [ ] Adicionar opção de revogação

### Fase 3: Direitos do Titular (Prioridade ALTA)
- [ ] Implementar exportação completa de dados
- [ ] Implementar exclusão completa de conta
- [ ] Criar páginas na área de configurações
- [ ] Implementar confirmação por email antes de exclusão

### Fase 4: Auditoria (Prioridade MÉDIA)
- [ ] Criar tabela `data_access_logs`
- [ ] Implementar logging de acessos
- [ ] Implementar logging de alterações
- [ ] Criar dashboard de auditoria (admin)

### Fase 5: Segurança e Retenção (Prioridade MÉDIA)
- [ ] Revisar políticas RLS
- [ ] Verificar criptografia
- [ ] Implementar rotina de limpeza automática
- [ ] Configurar backups

### Fase 6: Comunicação (Prioridade BAIXA)
- [ ] Criar templates de notificação
- [ ] Criar página de contato DPO
- [ ] Implementar notificações de mudanças

---

## 🚨 PRIORIDADES CRÍTICAS (FAZER PRIMEIRO)

1. **Política de Privacidade** - Obrigatória por lei
2. **Termos de Uso** - Obrigatório por lei
3. **Banner de Cookies** - Obrigatório se usar cookies não essenciais
4. **Exportação de Dados** - Direito do titular
5. **Exclusão de Conta** - Direito do titular

---

## 📚 REFERÊNCIAS LEGAIS

- **LGPD (Lei 13.709/2018)** - Brasil
- **GDPR (Regulation EU 2016/679)** - Europa
- **CDC (Código de Defesa do Consumidor)** - Brasil (reembolsos)

---

## ⏱️ ESTIMATIVA DE TEMPO

- **Fase 1 (Documentação):** 2-3 dias
- **Fase 2 (Consentimento):** 2-3 dias
- **Fase 3 (Direitos):** 3-4 dias
- **Fase 4 (Auditoria):** 2-3 dias
- **Fase 5 (Segurança):** 1-2 dias
- **Fase 6 (Comunicação):** 1 dia

**Total estimado:** 11-16 dias de desenvolvimento

---

## ✅ PRÓXIMOS PASSOS

1. Revisar este documento
2. Priorizar fases
3. Começar pela Fase 1 (Documentação Legal)
4. Implementar Fase 2 (Consentimento)
5. Implementar Fase 3 (Direitos do Titular)

---

**Última atualização:** 2024-12-XX
**Responsável:** [Nome do DPO/Responsável]














