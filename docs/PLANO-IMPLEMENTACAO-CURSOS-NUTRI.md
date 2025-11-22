# 📋 PLANO DE IMPLEMENTAÇÃO - ÁREA DE CURSOS NUTRI
## Formação Empresarial ILADA

> **Data de Criação:** 2024  
> **Status:** Planejamento  
> **Prioridade:** Alta  
> **Estimativa Total:** 5-7 dias de desenvolvimento

---

## 🎯 OBJETIVO

Implementar área completa de cursos profissionalizantes para Nutri, seguindo a estrutura existente, sem quebrar funcionalidades atuais, pensando em escala a longo prazo.

---

## 📊 VISÃO GERAL DAS FASES

```
FASE 0: Preparação e Validação (1h)
FASE 1: Estrutura de Banco de Dados (2h)
FASE 2: APIs Backend (4h)
FASE 3: Componentes Frontend Base (6h)
FASE 4: Funcionalidades Avançadas (8h)
FASE 5: Integração e Validação (4h)
FASE 6: População de Dados (2h)
FASE 7: Testes e Ajustes Finais (3h)
```

**Total Estimado:** ~30 horas (5-7 dias úteis)

---

## 🔍 FASE 0: PREPARAÇÃO E VALIDAÇÃO

**Objetivo:** Validar estrutura existente e preparar ambiente

### ✅ Tarefas

1. **Validar Tabelas Existentes**
   ```sql
   -- Verificar se todas as tabelas existem
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'cursos_%';
   ```

2. **Validar APIs Existentes**
   - ✅ `/api/nutri/cursos` existe
   - ✅ `/pt/nutri/cursos` existe
   - ✅ Estrutura de progresso existe

3. **Validar Sistema de Assinaturas**
   - ✅ `subscriptions` table existe
   - ✅ `hasActiveSubscription()` helper existe
   - ✅ Verificar se `plan_type = 'annual'` funciona

4. **Criar Branch de Desenvolvimento**
   ```bash
   git checkout -b feature/cursos-nutri-formacao
   ```

5. **Instalar Dependências Necessárias**
   ```bash
   npm install react-player react-pdf qrcode
   ```

### ✅ Validações

- [ ] Todas as tabelas `cursos_*` existem
- [ ] API `/api/nutri/cursos` retorna dados
- [ ] Página `/pt/nutri/cursos` carrega sem erros
- [ ] Helper de assinatura funciona
- [ ] Dependências instaladas

### 🔄 Rollback

Se algo falhar: apenas não prosseguir para Fase 1.

---

## 🗄️ FASE 1: ESTRUTURA DE BANCO DE DADOS

**Objetivo:** Criar novas tabelas necessárias sem quebrar existentes

### ✅ Tarefas

1. **Criar Tabela `cursos_checklist`**
   ```sql
   -- migrations/add-cursos-checklist.sql
   CREATE TABLE IF NOT EXISTS cursos_checklist (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     modulo_id UUID NOT NULL REFERENCES cursos_modulos(id) ON DELETE CASCADE,
     item_text VARCHAR(500) NOT NULL,
     ordem INTEGER NOT NULL DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE INDEX IF NOT EXISTS idx_cursos_checklist_modulo_id 
     ON cursos_checklist(modulo_id);
   CREATE INDEX IF NOT EXISTS idx_cursos_checklist_ordem 
     ON cursos_checklist(modulo_id, ordem);
   ```

2. **Criar Tabela `cursos_checklist_progresso`**
   ```sql
   CREATE TABLE IF NOT EXISTS cursos_checklist_progresso (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     checklist_id UUID NOT NULL REFERENCES cursos_checklist(id) ON DELETE CASCADE,
     completed BOOLEAN DEFAULT false,
     completed_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, checklist_id)
   );
   
   CREATE INDEX IF NOT EXISTS idx_cursos_checklist_progresso_user 
     ON cursos_checklist_progresso(user_id);
   CREATE INDEX IF NOT EXISTS idx_cursos_checklist_progresso_checklist 
     ON cursos_checklist_progresso(checklist_id);
   ```

3. **Criar Tabela `cursos_tarefas`**
   ```sql
   CREATE TABLE IF NOT EXISTS cursos_tarefas (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     aula_id UUID NOT NULL REFERENCES cursos_aulas(id) ON DELETE CASCADE,
     descricao TEXT NOT NULL,
     obrigatoria BOOLEAN DEFAULT true,
     ordem INTEGER NOT NULL DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_aula_id 
     ON cursos_tarefas(aula_id);
   CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_ordem 
     ON cursos_tarefas(aula_id, ordem);
   ```

4. **Criar Tabela `cursos_tarefas_progresso`**
   ```sql
   CREATE TABLE IF NOT EXISTS cursos_tarefas_progresso (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     tarefa_id UUID NOT NULL REFERENCES cursos_tarefas(id) ON DELETE CASCADE,
     completed BOOLEAN DEFAULT false,
     resposta TEXT, -- Resposta do usuário (opcional)
     completed_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, tarefa_id)
   );
   
   CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_progresso_user 
     ON cursos_tarefas_progresso(user_id);
   CREATE INDEX IF NOT EXISTS idx_cursos_tarefas_progresso_tarefa 
     ON cursos_tarefas_progresso(tarefa_id);
   ```

5. **Adicionar Campos em Tabelas Existentes (se necessário)**
   ```sql
   -- Adicionar video_url em cursos_aulas (se não existir)
   ALTER TABLE cursos_aulas 
   ADD COLUMN IF NOT EXISTS video_url TEXT;
   
   -- Adicionar certificate_code em cursos_certificados
   ALTER TABLE cursos_certificados 
   ADD COLUMN IF NOT EXISTS certificate_code VARCHAR(100) UNIQUE;
   ```

6. **Configurar RLS (Row Level Security)**
   ```sql
   ALTER TABLE cursos_checklist ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cursos_checklist_progresso ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cursos_tarefas ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cursos_tarefas_progresso ENABLE ROW LEVEL SECURITY;
   
   -- Policies para checklist
   CREATE POLICY "Users can view checklist of published modules"
     ON cursos_checklist FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM cursos_modulos
         JOIN cursos_trilhas ON cursos_trilhas.id = cursos_modulos.trilha_id
         WHERE cursos_modulos.id = cursos_checklist.modulo_id
         AND (cursos_trilhas.status = 'published' OR cursos_trilhas.user_id = auth.uid())
       )
     );
   
   -- Policies para checklist_progresso
   CREATE POLICY "Users can manage own checklist progress"
     ON cursos_checklist_progresso FOR ALL
     USING (user_id = auth.uid());
   
   -- Policies para tarefas
   CREATE POLICY "Users can view tarefas of published aulas"
     ON cursos_tarefas FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM cursos_aulas
         JOIN cursos_modulos ON cursos_modulos.id = cursos_aulas.modulo_id
         JOIN cursos_trilhas ON cursos_trilhas.id = cursos_modulos.trilha_id
         WHERE cursos_aulas.id = cursos_tarefas.aula_id
         AND (cursos_trilhas.status = 'published' OR cursos_trilhas.user_id = auth.uid())
       )
     );
   
   -- Policies para tarefas_progresso
   CREATE POLICY "Users can manage own tarefas progress"
     ON cursos_tarefas_progresso FOR ALL
     USING (user_id = auth.uid());
   ```

7. **Criar Bucket no Supabase Storage**
   - Nome: `materiais_curso`
   - Público: Não (requer autenticação)
   - Política: Usuários autenticados podem ler/escrever

### ✅ Validações

- [ ] Todas as tabelas criadas sem erros
- [ ] Índices criados
- [ ] RLS habilitado e policies criadas
- [ ] Bucket de storage criado
- [ ] Testar inserção manual de dados

### 🔄 Rollback

```sql
-- Se necessário reverter
DROP TABLE IF EXISTS cursos_tarefas_progresso CASCADE;
DROP TABLE IF EXISTS cursos_tarefas CASCADE;
DROP TABLE IF EXISTS cursos_checklist_progresso CASCADE;
DROP TABLE IF EXISTS cursos_checklist CASCADE;
```

---

## 🔌 FASE 2: APIs BACKEND

**Objetivo:** Criar endpoints necessários para funcionalidades

### ✅ Tarefas

1. **Criar API: `/api/nutri/cursos/[trilhaId]/route.ts`**
   - GET: Buscar trilha completa com módulos, aulas, checklist, tarefas
   - Validar acesso (plano anual)
   - Calcular progresso do usuário

2. **Criar API: `/api/nutri/cursos/[trilhaId]/modulos/[moduloId]/route.ts`**
   - GET: Buscar módulo completo
   - Validar liberação linear
   - Retornar status de conclusão

3. **Criar API: `/api/nutri/cursos/progresso/route.ts`**
   - GET: Buscar progresso geral do usuário
   - POST: Atualizar progresso (vídeo, checklist, tarefa)

4. **Criar API: `/api/nutri/cursos/checklist/route.ts`**
   - POST: Marcar item do checklist como concluído
   - GET: Buscar progresso do checklist de um módulo

5. **Criar API: `/api/nutri/cursos/tarefas/route.ts`**
   - POST: Marcar tarefa como concluída (com resposta opcional)
   - GET: Buscar tarefas de uma aula

6. **Criar API: `/api/nutri/cursos/certificado/[trilhaId]/route.ts`**
   - GET: Gerar/baixar certificado
   - Validar se todas as trilhas foram concluídas
   - Gerar PDF com react-pdf

7. **Criar API: `/api/nutri/cursos/liberacao/route.ts`**
   - GET: Verificar se módulo está liberado
   - Validar: vídeo + checklist + tarefas obrigatórias

8. **Criar Helper: `src/lib/cursos-helpers.ts`**
   - `checkAnnualPlan(userId, area)`: Verificar plano anual
   - `calculateModuleProgress(userId, moduleId)`: Calcular progresso
   - `checkModuleUnlocked(userId, moduleId)`: Verificar liberação
   - `generateCertificateCode()`: Gerar código único

### ✅ Validações

- [ ] Todas as APIs retornam dados corretos
- [ ] Validação de plano anual funciona
- [ ] Liberação linear funciona
- [ ] Progresso calculado corretamente
- [ ] Certificado gerado sem erros

### 🔄 Rollback

Reverter commits da Fase 2 se necessário.

---

## 🎨 FASE 3: COMPONENTES FRONTEND BASE

**Objetivo:** Criar componentes reutilizáveis

### ✅ Tarefas

1. **Criar Componente: `VideoPlayer.tsx`**
   - Usar `react-player`
   - Salvar timestamp em localStorage
   - Botão "Marcar como concluído"
   - Fallback se vídeo não carregar

2. **Criar Componente: `Checklist.tsx`**
   - Lista de itens marcáveis
   - Salvar progresso em tempo real
   - Indicador visual de conclusão

3. **Criar Componente: `TarefaCard.tsx`**
   - Exibir tarefa
   - Campo de resposta (se necessário)
   - Botão "Marcar como concluída"

4. **Criar Componente: `PDFViewer.tsx`**
   - Visualizar PDF inline
   - Botão de download
   - Suporte a Supabase Storage

5. **Criar Componente: `ProgressBar.tsx`**
   - Barra de progresso visual
   - Mostrar porcentagem
   - Cores por status

6. **Criar Componente: `ModuleCard.tsx`**
   - Card de módulo
   - Indicador de conclusão
   - Status de liberação

7. **Criar Componente: `UpgradePrompt.tsx`**
   - Mensagem para upgrade
   - CTA para checkout
   - Bloqueio visual

### ✅ Validações

- [ ] Todos os componentes renderizam sem erros
- [ ] VideoPlayer funciona com URLs HeyGen
- [ ] Checklist salva progresso
- [ ] PDFViewer carrega arquivos
- [ ] ProgressBar atualiza corretamente

### 🔄 Rollback

Reverter commits se componentes quebrarem algo.

---

## 🚀 FASE 4: FUNCIONALIDADES AVANÇADAS

**Objetivo:** Implementar funcionalidades completas

### ✅ Tarefas

1. **Atualizar Página: `/pt/nutri/cursos/page.tsx`**
   - Dashboard de progresso geral
   - Lista de trilhas
   - Botão "Continuar de onde parei"
   - Filtros e busca

2. **Criar Página: `/pt/nutri/cursos/[trilhaId]/page.tsx`**
   - Detalhes da trilha
   - Lista de módulos
   - Progresso por módulo
   - Indicadores visuais

3. **Criar Página: `/pt/nutri/cursos/[trilhaId]/[moduloId]/page.tsx`**
   - Player de vídeo no topo
   - Materiais complementares
   - Checklist
   - Tarefas
   - Botão "Marcar como concluído"
   - Botão "Próximo módulo"

4. **Criar Página: `/pt/nutri/cursos/certificado/[trilhaId]/page.tsx`**
   - Visualizar certificado
   - Download PDF
   - Validar código

5. **Implementar Liberação Linear**
   - Bloquear módulos não liberados
   - Mensagem explicativa
   - Validação no backend

6. **Implementar Restrição por Plano**
   - Verificar plano anual em todas as páginas
   - Mostrar `UpgradePrompt` se mensal
   - Bloquear acesso a vídeos

7. **Implementar Sistema de Certificado**
   - Gerar PDF com react-pdf
   - Template vertical
   - QR code para validação
   - Código único

### ✅ Validações

- [ ] Todas as páginas carregam sem erros
- [ ] Liberação linear funciona
- [ ] Restrição por plano funciona
- [ ] Certificado gera corretamente
- [ ] Progresso atualiza em tempo real

### 🔄 Rollback

Reverter commits se funcionalidades quebrarem.

---

## 🔗 FASE 5: INTEGRAÇÃO E VALIDAÇÃO

**Objetivo:** Integrar tudo e validar fluxo completo

### ✅ Tarefas

1. **Integrar com Sistema de Assinaturas**
   - Usar `hasActiveSubscription()` helper
   - Verificar `plan_type = 'annual'`
   - Testar com usuários mensais e anuais

2. **Integrar com Supabase Storage**
   - Upload de materiais
   - URLs públicas/privadas
   - Permissões corretas

3. **Testar Fluxo Completo**
   - Usuário anual acessa trilha
   - Completa módulo (vídeo + checklist + tarefa)
   - Próximo módulo libera
   - Completa todas as trilhas
   - Recebe certificado

4. **Testar Casos de Erro**
   - Usuário mensal tenta acessar
   - Módulo não liberado
   - Vídeo não carrega
   - PDF não encontrado

5. **Otimizar Performance**
   - Lazy loading de componentes
   - Cache de progresso
   - Otimizar queries

### ✅ Validações

- [ ] Fluxo completo funciona
- [ ] Casos de erro tratados
- [ ] Performance aceitável
- [ ] Sem quebras em outras áreas

### 🔄 Rollback

Se houver problemas críticos, reverter até Fase 4.

---

## 📚 FASE 6: POPULAÇÃO DE DADOS

**Objetivo:** Popular trilhas e módulos oficiais

### ✅ Tarefas

1. **Criar Script SQL: `populate-trilhas-nutri.sql`**
   - Inserir 5 trilhas
   - Inserir módulos de cada trilha
   - Inserir aulas de cada módulo
   - Estrutura vazia (sem vídeos ainda)

2. **Criar Script de Migração: `scripts/populate-cursos-nutri.js`**
   - Popular via API ou direto no banco
   - Validar dados inseridos
   - Criar checklists básicos

3. **Validar Estrutura**
   - Verificar ordem dos módulos
   - Verificar links entre tabelas
   - Verificar status 'published'

### ✅ Validações

- [ ] Todas as trilhas criadas
- [ ] Módulos na ordem correta
- [ ] Aulas vinculadas corretamente
- [ ] Status 'published' configurado

### 🔄 Rollback

```sql
-- Remover dados de teste
DELETE FROM cursos_aulas WHERE trilha_id IN (SELECT id FROM cursos_trilhas WHERE title LIKE '%Test%');
DELETE FROM cursos_modulos WHERE trilha_id IN (SELECT id FROM cursos_trilhas WHERE title LIKE '%Test%');
DELETE FROM cursos_trilhas WHERE title LIKE '%Test%';
```

---

## 🧪 FASE 7: TESTES E AJUSTES FINAIS

**Objetivo:** Testar tudo e fazer ajustes finais

### ✅ Tarefas

1. **Testes Manuais**
   - [ ] Acessar como usuário anual
   - [ ] Acessar como usuário mensal
   - [ ] Completar módulo completo
   - [ ] Verificar liberação linear
   - [ ] Gerar certificado
   - [ ] Testar em mobile

2. **Testes de Performance**
   - [ ] Tempo de carregamento
   - [ ] Queries otimizadas
   - [ ] Cache funcionando

3. **Ajustes de UI/UX**
   - [ ] Responsividade
   - [ ] Acessibilidade
   - [ ] Feedback visual

4. **Documentação**
   - [ ] Atualizar README
   - [ ] Documentar APIs
   - [ ] Guia de uso

5. **Deploy em Staging**
   - [ ] Testar em ambiente de staging
   - [ ] Validar com usuários reais
   - [ ] Coletar feedback

### ✅ Validações

- [ ] Todos os testes passam
- [ ] Performance aceitável
- [ ] UI/UX polida
- [ ] Documentação completa
- [ ] Staging validado

### 🔄 Rollback

Se problemas críticos, reverter até Fase 5.

---

## 📋 CHECKLIST FINAL

Antes de fazer merge para `main`:

- [ ] Todas as fases completas
- [ ] Testes passando
- [ ] Sem erros no console
- [ ] Performance validada
- [ ] Documentação atualizada
- [ ] Code review feito
- [ ] Staging testado
- [ ] Backup do banco feito

---

## 🚨 PONTOS DE ATENÇÃO

### ⚠️ Não Quebrar

1. **APIs Existentes**
   - `/api/nutri/cursos` deve continuar funcionando
   - Não remover campos usados por outras áreas

2. **Tabelas Existentes**
   - Não modificar estrutura de `cursos_*` existentes
   - Apenas adicionar novas tabelas

3. **Páginas Existentes**
   - `/pt/nutri/cursos` deve continuar funcionando
   - Adicionar funcionalidades sem remover existentes

### 🔒 Segurança

1. **RLS em todas as tabelas novas**
2. **Validação de plano anual em todas as APIs**
3. **Sanitização de inputs**
4. **Rate limiting nas APIs**

### 📈 Escalabilidade

1. **Índices em todas as foreign keys**
2. **Cache de progresso**
3. **Lazy loading de componentes**
4. **Paginação em listas grandes**

---

## 📝 NOTAS DE IMPLEMENTAÇÃO

### Estrutura de Arquivos

```
src/
├── app/
│   └── pt/
│       └── nutri/
│           └── cursos/
│               ├── page.tsx (dashboard)
│               ├── [trilhaId]/
│               │   ├── page.tsx (detalhes trilha)
│               │   └── [moduloId]/
│               │       └── page.tsx (player + conteúdo)
│               └── certificado/
│                   └── [trilhaId]/
│                       └── page.tsx
├── components/
│   └── cursos/
│       ├── VideoPlayer.tsx
│       ├── Checklist.tsx
│       ├── TarefaCard.tsx
│       ├── PDFViewer.tsx
│       ├── ProgressBar.tsx
│       ├── ModuleCard.tsx
│       └── UpgradePrompt.tsx
├── lib/
│   ├── cursos-helpers.ts
│   └── certificate-generator.ts
└── app/
    └── api/
        └── nutri/
            └── cursos/
                ├── [trilhaId]/
                │   └── route.ts
                ├── progresso/
                │   └── route.ts
                ├── checklist/
                │   └── route.ts
                ├── tarefas/
                │   └── route.ts
                └── certificado/
                    └── [trilhaId]/
                        └── route.ts
```

### Dependências Necessárias

```json
{
  "react-player": "^2.13.0",
  "react-pdf": "^7.5.1",
  "qrcode": "^1.5.3",
  "@react-pdf/renderer": "^3.1.14"
}
```

---

## 🎯 PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. **Popular Vídeos HeyGen**
   - Adicionar URLs dos vídeos nas aulas
   - Testar player com vídeos reais

2. **Upload de Materiais**
   - Fazer upload de PDFs para Supabase Storage
   - Vincular nas aulas

3. **Criar Checklists Reais**
   - Adicionar itens de checklist em cada módulo
   - Validar com conteúdo oficial

4. **Criar Tarefas Reais**
   - Adicionar tarefas práticas
   - Validar com conteúdo oficial

5. **Testes com Usuários Reais**
   - Beta testing
   - Coletar feedback
   - Ajustar conforme necessário

---

## ✅ CONCLUSÃO

Este plano garante:
- ✅ Implementação incremental e segura
- ✅ Não quebra funcionalidades existentes
- ✅ Pensado para escala
- ✅ Fácil rollback se necessário
- ✅ Testável em cada fase
- ✅ Documentado e organizado

**Boa implementação! 🚀**

