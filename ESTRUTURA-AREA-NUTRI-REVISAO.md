# 📋 ESTRUTURA ÁREA NUTRI - REVISÃO PARA AJUSTES FINOS

**Data:** Hoje  
**Objetivo:** Mapear estrutura completa para ajustes finos antes da apresentação

---

## 🎯 ESTRUTURA PRINCIPAL

### **1. PÁGINAS PRINCIPAIS** (`/src/app/pt/nutri/`)

#### **Área Protegida** (`(protected)/`)
- ✅ `/home` - Home principal (revelação progressiva por dia)
- ✅ `/dashboard` - Dashboard (redireciona para home)
- ✅ `/onboarding` - Onboarding inicial
- ✅ `/diagnostico` - Diagnóstico estratégico
- ✅ `/leads` - Gestão de leads
- ✅ `/clientes` - Lista de clientes
- ✅ `/clientes/kanban` - Kanban visual
- ✅ `/clientes/novo` - Cadastrar cliente
- ✅ `/clientes/[id]` - Perfil do cliente
- ✅ `/agenda` - Agenda de consultas
- ✅ `/acompanhamento` - Acompanhamento de clientes
- ✅ `/formularios` - Formulários
- ✅ `/formularios/novo` - Criar formulário
- ✅ `/formularios/[id]` - Ver formulário
- ✅ `/formularios/[id]/enviar` - Enviar formulário
- ✅ `/formularios/[id]/respostas` - Ver respostas
- ✅ `/gsal` - Painel GSAL
- ✅ `/relatorios-gestao` - Relatórios de gestão
- ✅ `/configuracao` - Configurações
- ✅ `/anotacoes` - Minhas anotações
- ✅ `/cursos` - Cursos e trilhas
- ✅ `/cursos/[trilhaId]` - Detalhes da trilha
- ✅ `/cursos/[trilhaId]/[moduloId]` - Detalhes do módulo
- ✅ `/metodo/pilares` - Os 5 Pilares
- ✅ `/portals` - Portais (listagem)
- ✅ `/portals/novo` - Criar portal
- ✅ `/portals/[id]/editar` - Editar portal
- ✅ `/quizzes` - Quizzes criados

#### **Área Pública**
- ✅ `/ferramentas` - Lista de ferramentas
- ✅ `/ferramentas/nova` - Criar ferramenta
- ✅ `/ferramentas/[id]/editar` - Editar ferramenta
- ✅ `/ferramentas/templates` - Templates disponíveis
- ✅ `/ferramentas/manual-tecnico` - Manual técnico
- ✅ `/quiz-personalizado` - Criar quiz personalizado
- ✅ `/metodo/jornada` - Jornada 30 Dias
- ✅ `/metodo/jornada/dia/[numero]` - Dia específico
- ✅ `/metodo/jornada/concluida` - Jornada concluída
- ✅ `/metodo/biblioteca` - Biblioteca de materiais
- ✅ `/metodo/exercicios` - Exercícios práticos
- ✅ `/metodo/exercicios/[id]` - Exercício específico
- ✅ `/metodo/painel/diario` - Painel diário
- ✅ `/metodo/painel/agenda` - Painel agenda
- ✅ `/login` - Login
- ✅ `/configuracoes` - Configurações (alternativa)
- ✅ `/suporte` - Suporte
- ✅ `/suporte/tickets` - Tickets
- ✅ `/suporte/tickets/[id]` - Ver ticket
- ✅ `/suporte/atendente` - Atendente

#### **Rotas Dinâmicas Públicas**
- ✅ `/[user-slug]/[tool-slug]` - Ferramenta pública
- ✅ `/[user-slug]/quiz/[slug]` - Quiz público
- ✅ `/[user-slug]/formulario/[slug]` - Formulário público
- ✅ `/portal/[slug]` - Portal público

---

## 🧩 COMPONENTES PRINCIPAIS (`/src/components/nutri/`)

### **Navegação**
- ✅ `NutriSidebar.tsx` - Sidebar principal (com fases progressivas)
- ✅ `NutriNavBar.tsx` - NavBar (usado em algumas páginas)

### **Home**
- ✅ `home/WelcomeCard.tsx` - Card de boas-vindas
- ✅ `home/JornadaBlock.tsx` - Bloco Jornada 30 Dias
- ✅ `home/PilaresBlock.tsx` - Bloco Pilares do Método
- ✅ `home/FerramentasBlock.tsx` - Bloco Ferramentas
- ✅ `home/GSALBlock.tsx` - Bloco GSAL
- ✅ `home/BibliotecaBlock.tsx` - Bloco Biblioteca
- ✅ `home/AnotacoesBlock.tsx` - Bloco Anotações

### **LYA (Mentora)**
- ✅ `LyaChatWidget.tsx` - Widget de chat com LYA
- ✅ `LyaSalesWidget.tsx` - Widget de vendas LYA
- ✅ `LyaAnaliseHoje.tsx` - Análise diária da LYA

### **Clientes**
- ✅ `GraficoEvolucaoPeso.tsx` - Gráfico de evolução
- ✅ `TabelaEvolucao.tsx` - Tabela de evolução
- ✅ `ListaAvaliacoes.tsx` - Lista de avaliações
- ✅ `ComparacaoAvaliacoes.tsx` - Comparação de avaliações
- ✅ `NovaAvaliacaoModal.tsx` - Modal nova avaliação
- ✅ `NovaEvolucaoModal.tsx` - Modal nova evolução
- ✅ `NovaReavaliacaoModal.tsx` - Modal reavaliação
- ✅ `ImportPatientsModal.tsx` - Modal importar pacientes
- ✅ `KanbanConfigModal.tsx` - Modal configurar Kanban
- ✅ `DocumentosTab.tsx` - Tab de documentos

### **Outros**
- ✅ `RotinaMinimaChecklist.tsx` - Checklist rotina mínima
- ✅ `ScriptsNutriModal.tsx` - Modal scripts
- ✅ `BrandingPreview.tsx` - Preview de branding
- ✅ `PublicBrandingHeader.tsx` - Header público com branding
- ✅ `WhatsAppFloatingButton.tsx` - Botão flutuante WhatsApp
- ✅ `CancelRetentionModal.tsx` - Modal retenção cancelamento
- ✅ `ConditionalSidebar.tsx` - Sidebar condicional
- ✅ `ConditionalWidget.tsx` - Widget condicional
- ✅ `NutriChatWidget.tsx` - Widget de chat

### **Suporte**
- ✅ `support/SupportChatWidget.tsx` - Widget chat suporte
- ✅ `support/SupportMenu.tsx` - Menu suporte
- ✅ `support/FAQResponse.tsx` - Resposta FAQ

---

## 🔌 APIs (`/src/app/api/nutri/`)

### **Dashboard e Perfil**
- ✅ `/dashboard/route.ts` - Dados do dashboard
- ✅ `/lya/getUserProfile/route.ts` - Perfil do usuário (LYA)
- ✅ `/lya/getNutriContext/route.ts` - Contexto Nutri (LYA)
- ✅ `/lya/analise/route.ts` - Análise da LYA
- ✅ `/lya/saveInteraction/route.ts` - Salvar interação (LYA)

### **Ferramentas**
- ✅ `/ferramentas/route.ts` - CRUD ferramentas
- ✅ `/ferramentas/by-url/route.ts` - Buscar por URL
- ✅ `/ferramentas/check-slug/route.ts` - Validar slug
- ✅ `/templates/route.ts` - Listar templates

### **Portais**
- ✅ `/portals/route.ts` - CRUD portais
- ✅ `/portals/check-slug/route.ts` - Validar slug

### **Quizzes**
- ✅ `/quizzes/route.ts` - Listar quizzes
- ✅ `/check-short-code/route.ts` - Validar short code

### **Formulários**
- ✅ `/formularios/route.ts` - CRUD formulários
- ✅ `/formularios/[id]/route.ts` - Formulário específico
- ✅ `/formularios/[id]/enviar/route.ts` - Enviar formulário
- ✅ `/formularios/[id]/respostas/route.ts` - Respostas

### **Clientes**
- ✅ `/clientes/route.ts` - CRUD clientes
- ✅ `/clientes/[id]/route.ts` - Cliente específico
- ✅ `/clientes/[id]/evolucao/route.ts` - Evolução do cliente
- ✅ `/clientes/[id]/avaliacoes/route.ts` - Avaliações

### **Leads**
- ✅ `/leads/route.ts` - CRUD leads

### **Outros**
- ✅ `/diagnostico/route.ts` - Salvar diagnóstico
- ✅ `/anotacoes/route.ts` - CRUD anotações

---

## 📚 BIBLIOTECAS E UTILITÁRIOS (`/src/lib/`)

### **Nutri Específicos**
- ✅ `nutri-orientation.ts` - Sistema de orientação técnica
- ✅ `nutri-chatbots.ts` - Configuração de chatbots
- ✅ `nutri/sidebar-phases.ts` - Sistema de fases do sidebar
- ✅ `nutri/sidebar-microcopy.ts` - Microcopy do sidebar
- ✅ `template-slug-map-nutri.ts` - Mapeamento de slugs de templates

### **Diagnósticos**
- ✅ `diagnostics/nutri/` - Diagnósticos específicos Nutri
  - `checklist-alimentar.ts`
  - `nutrido-vs-alimentado.ts`
  - `alimentacao-saudavel.ts`
  - `guia-proteico.ts`
  - `guia-nutraceutico.ts`
  - E outros...

### **Tipos**
- ✅ `types/nutri-diagnostico.ts` - Tipos de diagnóstico
- ✅ `types/nutri-lya.ts` - Tipos LYA

---

## 🎨 ESTRUTURA DE DADOS

### **Tabelas Principais**
- `user_profiles` - Perfis de usuários (nutri)
- `user_templates` - Ferramentas criadas
- `templates_nutrition` - Templates base (38 templates)
- `leads` - Leads captados
- `clients` - Clientes
- `client_evolutions` - Evoluções de clientes
- `client_assessments` - Avaliações de clientes
- `forms` - Formulários
- `form_responses` - Respostas de formulários
- `jornada_progress` - Progresso da jornada
- `notes` - Anotações

---

## 🔍 PONTOS PARA AJUSTES FINOS

### **1. Consistência de Nomenclatura**
- ⚠️ Verificar se todas as rotas estão consistentes
- ⚠️ Verificar se componentes seguem padrão de nomenclatura
- ⚠️ Verificar se APIs seguem padrão REST

### **2. Navegação**
- ⚠️ Verificar se sidebar está completo
- ⚠️ Verificar se todas as rotas estão acessíveis
- ⚠️ Verificar se breadcrumbs estão corretos

### **3. Componentes**
- ⚠️ Verificar se componentes estão reutilizáveis
- ⚠️ Verificar se há duplicação de código
- ⚠️ Verificar se estilos estão consistentes

### **4. APIs**
- ⚠️ Verificar se todas as APIs estão funcionando
- ⚠️ Verificar se validações estão corretas
- ⚠️ Verificar se tratamento de erros está adequado

### **5. Performance**
- ⚠️ Verificar se há queries otimizadas
- ⚠️ Verificar se há cache onde necessário
- ⚠️ Verificar se há lazy loading

### **6. UX/UI**
- ⚠️ Verificar se feedback visual está adequado
- ⚠️ Verificar se mensagens de erro são claras
- ⚠️ Verificar se loading states estão presentes

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Estrutura mapeada
2. ⏳ Revisar cada seção para ajustes finos
3. ⏳ Testar fluxos principais
4. ⏳ Verificar consistência visual
5. ⏳ Preparar para apresentação

---

**Última atualização:** Hoje  
**Status:** ✅ Estrutura mapeada - Pronto para ajustes finos
