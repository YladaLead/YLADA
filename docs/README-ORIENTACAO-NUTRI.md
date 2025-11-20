# 📚 Documentação de Orientação para Nutricionistas

Este diretório contém toda a documentação necessária para orientar nutricionistas sobre o módulo de gestão da YLADA e treinar a IA assistente (Iara) para responder dúvidas.

---

## 📁 ESTRUTURA DE DOCUMENTOS

### 1. **GUIA-COMPLETO-GESTAO-NUTRI.md**
**Para:** Nutricionistas e IA Assistente
**Conteúdo:** Guia completo e detalhado sobre todas as funcionalidades do módulo de gestão
**Uso:** 
- Base de conhecimento para a IA responder dúvidas
- Referência completa para nutricionistas
- Documentação oficial do sistema

### 2. **MANUAL-IARA-GESTAO-NUTRI.md**
**Para:** IA Assistente (Iara)
**Conteúdo:** Respostas prontas organizadas por categoria para a IA usar
**Uso:**
- Treinamento da IA OpenAI Assistant
- Respostas rápidas e consistentes
- Scripts de atendimento

### 3. **FLUXO-ATENDIMENTO-NUTRI.md**
**Para:** Desenvolvedores e Product Owners
**Conteúdo:** Fluxo completo de atendimento do cliente pela nutricionista
**Uso:**
- Entender o processo completo
- Planejar novas funcionalidades
- Manter consistência no desenvolvimento

### 4. **PLANO-PROXIMAS-FUNCIONALIDADES.md**
**Para:** Desenvolvedores
**Conteúdo:** Roadmap de funcionalidades futuras
**Uso:**
- Planejamento de sprints
- Priorização de features
- Documentação técnica

---

## 🤖 COMO TREINAR A IA ASSISTENTE

### Opção 1: OpenAI Assistant (Recomendado)

1. **Acesse o OpenAI Platform**
   - Vá em https://platform.openai.com
   - Navegue até "Assistants"

2. **Crie ou Edite o Assistente Especializado**
   - Use o ID: `asst_Jafki3CmiatIkSiFSXxCEvo4` (ou crie novo)
   - Nome: "YLADA Health Specialized"

3. **Adicione os Documentos como Knowledge Base**
   - Faça upload de:
     - `GUIA-COMPLETO-GESTAO-NUTRI.md`
     - `MANUAL-IARA-GESTAO-NUTRI.md`
     - `FLUXO-ATENDIMENTO-NUTRI.md`
   - Marque como "Knowledge Base" ou "Retrieval"

4. **Configure as Instruções do Assistente**
   ```
   Você é a Iara, assistente IA especializada da YLADA Health, plataforma de gestão para nutricionistas.

   Sua personalidade:
   - Empática e acolhedora
   - Linguagem simples e clara
   - Focada em ajudar nutricionistas
   - Profissional mas acessível

   Seu conhecimento:
   - Módulo completo de gestão de clientes
   - Cadastro, Kanban, Agenda, Avaliações
   - Formulários personalizados
   - Relatórios e métricas
   - Integração com captação de leads

   Como responder:
   - Use os documentos de conhecimento como base
   - Seja específica e prática
   - Dê exemplos quando possível
   - Se não souber, seja honesta e sugira contatar suporte

   Linguagem:
   - Use emojis moderadamente (📋 📊 📅 🏥)
   - Seja clara e direta
   - Evite jargões técnicos
   - Foque em benefícios práticos
   ```

5. **Teste o Assistente**
   - Faça perguntas sobre gestão de clientes
   - Verifique se as respostas estão corretas
   - Ajuste as instruções se necessário

### Opção 2: ChatIA Local (Fallback)

O componente `ChatIA.tsx` já foi atualizado com conhecimento básico sobre gestão. Ele funciona como fallback quando a API do OpenAI não está disponível.

**Localização:** `src/components/ChatIA.tsx`

**Como funciona:**
- Respostas baseadas em palavras-chave
- Cobre as principais funcionalidades
- Resposta padrão se não encontrar match

**Limitações:**
- Não tem contexto de conversa
- Respostas mais simples
- Não aprende com interações

---

## 📖 COMO USAR OS DOCUMENTOS

### Para Nutricionistas

1. **Primeira vez usando o sistema:**
   - Leia `GUIA-COMPLETO-GESTAO-NUTRI.md`
   - Foque nas seções relevantes para você
   - Use como referência quando tiver dúvidas

2. **Dúvidas específicas:**
   - Use o botão de chat (💬) no app
   - Pergunte à IA assistente
   - Consulte o guia completo se necessário

3. **Aprender funcionalidades:**
   - Veja a seção "Fluxo Recomendado de Uso"
   - Siga os passos sugeridos
   - Adapte ao seu processo

### Para Desenvolvedores

1. **Entender o sistema:**
   - Leia `FLUXO-ATENDIMENTO-NUTRI.md`
   - Veja `PLANO-PROXIMAS-FUNCIONALIDADES.md`
   - Consulte `GUIA-COMPLETO-GESTAO-NUTRI.md` para detalhes

2. **Manter consistência:**
   - Use os documentos como referência
   - Atualize quando adicionar funcionalidades
   - Mantenha linguagem simples

3. **Melhorar a IA:**
   - Adicione novos casos ao `MANUAL-IARA-GESTAO-NUTRI.md`
   - Atualize o `GUIA-COMPLETO-GESTAO-NUTRI.md` quando necessário
   - Re-treine a IA com novos documentos

---

## 🔄 ATUALIZAÇÃO DOS DOCUMENTOS

### Quando Atualizar

1. **Adicionar nova funcionalidade:**
   - Atualize `GUIA-COMPLETO-GESTAO-NUTRI.md`
   - Adicione respostas ao `MANUAL-IARA-GESTAO-NUTRI.md`
   - Re-treine a IA

2. **Mudar fluxo existente:**
   - Atualize `FLUXO-ATENDIMENTO-NUTRI.md`
   - Atualize seções relevantes do guia
   - Atualize respostas da IA

3. **Corrigir informações:**
   - Corrija em todos os documentos relevantes
   - Verifique consistência
   - Re-treine a IA se necessário

### Processo de Atualização

1. Edite os documentos Markdown
2. Teste as mudanças localmente
3. Commit e push para o repositório
4. Re-treine a IA OpenAI Assistant (se necessário)
5. Teste a IA com perguntas relacionadas

---

## 🎯 PRÓXIMOS PASSOS

### Melhorias na IA

1. **Adicionar mais casos de uso:**
   - Perguntas frequentes reais
   - Casos específicos de nutricionistas
   - Problemas comuns e soluções

2. **Melhorar respostas:**
   - Tornar mais específicas
   - Adicionar exemplos práticos
   - Incluir screenshots ou links quando possível

3. **Integrar com sistema:**
   - IA pode sugerir ações diretas
   - Links para páginas específicas
   - Integração com funcionalidades

### Documentação Adicional

1. **Vídeos tutoriais:**
   - Criar vídeos curtos por funcionalidade
   - Embedar no guia ou criar seção separada

2. **FAQ interativo:**
   - Criar página de FAQ no app
   - Integrar com IA para respostas

3. **Onboarding:**
   - Criar fluxo de onboarding
   - Guiar nutricionista nas primeiras ações
   - Tutorial interativo

---

## 📞 SUPORTE

### Para Nutricionistas
- Use o chat da IA no app (💬)
- Consulte os guias de documentação
- Entre em contato com suporte técnico se necessário

### Para Desenvolvedores
- Consulte os documentos técnicos
- Veja o código em `src/components/ChatIA.tsx`
- Verifique a API em `src/app/api/ylada-assistant/route.ts`

---

**Última atualização:** Novembro 2024
**Versão:** 1.0
**Mantido por:** Equipe YLADA

