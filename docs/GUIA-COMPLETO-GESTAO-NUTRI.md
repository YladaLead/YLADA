# 📘 Guia Completo - Módulo de Gestão para Nutricionistas

Este guia serve como base de conhecimento para a IA responder dúvidas das nutricionistas sobre o módulo de gestão de clientes da YLADA.

---

## 🎯 VISÃO GERAL DO MÓDULO

O módulo de Gestão da YLADA permite que nutricionistas gerenciem todo o ciclo de vida dos seus clientes, desde a captação até o acompanhamento completo, tudo em um só lugar.

### Principais Funcionalidades

1. **Gestão de Clientes** - Cadastro completo, histórico e acompanhamento
2. **Evolução Física** - Registro de peso, medidas, IMC e composição corporal
3. **Agenda Visual** - Calendário completo com múltiplas visualizações
4. **Avaliações** - Avaliações antropométricas e reavaliações comparativas
5. **Programas** - Gestão de planos alimentares e protocolos
6. **Formulários Personalizados** - Criação e envio de anamneses
7. **Relatórios** - Análises e métricas de gestão
8. **Integração com Captação** - Conversão automática de leads em clientes

---

## 📋 1. GESTÃO DE CLIENTES

### Como Cadastrar um Novo Cliente

**Caminho:** Menu "Gestão" → "Meus Clientes" → Botão "Novo Cliente"

**Campos principais:**
- Nome completo (obrigatório)
- Email e telefone (com bandeira do país)
- Data de nascimento e gênero
- Endereço completo
- Objetivo da cliente
- Instagram (opcional)
- Status inicial (Contato, Pré-Consulta, Ativa, Pausa, Finalizada)

**Dica:** Você pode cadastrar rapidamente um cliente diretamente da agenda ao agendar uma consulta.

### Visualizações Disponíveis

1. **Lista de Clientes** - Cards visuais com busca e filtros
2. **Kanban** - Visualização por status (arrastar e soltar)
3. **Perfil Completo** - Todas as informações em abas organizadas

### Status dos Clientes (Kanban)

- **Contato** - Entrou agora, precisa de acolhimento
- **Pré-Consulta** - Já falou com você, falta agendar
- **Ativa** - Em atendimento e com plano ativo
- **Pausa** - Deu um tempo, precisa nutrir relação
- **Finalizada** - Concluiu o ciclo com você

**Como mudar status:** Arraste o card do cliente para a coluna desejada no Kanban.

---

## 📊 2. EVOLUÇÃO FÍSICA

### Como Registrar Evolução

**Caminho:** Perfil do Cliente → Aba "Evolução Física" → Botão "Nova Medição"

**Campos disponíveis:**
- Peso e altura (IMC calculado automaticamente)
- Circunferências (pescoço, tórax, cintura, quadril, braço, coxa)
- Dobras cutâneas (tricipital, bicipital, subescapular, ilíaca, abdominal, coxa)
- Composição corporal (gordura, massa muscular, massa óssea, água, gordura visceral)

**Gráficos automáticos:** O sistema gera gráficos visuais de evolução ao longo do tempo.

---

## 📅 3. AGENDA VISUAL

### Visualizações Disponíveis

1. **Semanal** - Ver a semana atual com horários
2. **Mensal** - Calendário mensal completo
3. **Lista** - Todas as consultas em formato de lista

### Como Agendar uma Consulta

**Opção 1:** Botão "Nova Consulta" no topo da agenda
**Opção 2:** Clique diretamente na data/horário desejado no calendário

**Campos:**
- Cliente (ou criar novo cliente rapidamente)
- Título da consulta
- Data e horário (início e fim)
- Tipo (consulta, retorno, avaliação, acompanhamento)
- Localização (presencial, online, domicílio)
- Descrição e notas internas

**Notificações:** O sistema avisa quando uma consulta está começando em 15 minutos.

---

## 🏥 4. AVALIAÇÕES FÍSICAS

### Como Criar uma Avaliação

**Caminho:** Perfil do Cliente → Aba "Avaliação Física" → Botão "Nova Avaliação"

**Tipos de avaliação:**
- Antropométrica
- Bioimpedância
- Anamnese
- Questionário
- Reavaliação

**Funcionalidades:**
- Salvar como rascunho e completar depois
- Comparação automática com avaliação anterior
- Criar reavaliações vinculadas
- Interpretação e recomendações

### Reavaliações

Ao criar uma reavaliação, o sistema automaticamente:
- Compara com a avaliação anterior
- Mostra diferenças e percentuais
- Gera gráficos comparativos
- Numera sequencialmente (1ª, 2ª, 3ª avaliação...)

---

## 📋 5. FORMULÁRIOS PERSONALIZADOS

### Como Criar um Formulário

**Caminho:** Menu "Formulários" → Botão "Criar Formulário"

**Tipos de campos disponíveis:**
- Texto (curto e longo)
- Seleção (dropdown)
- Múltipla escolha (radio)
- Caixas de seleção (checkbox)
- Número (com min/max e unidade)
- Data e hora
- Email e telefone
- Sim/Não
- Escala (range)
- Upload de arquivo

**Preview em tempo real:** Veja como o formulário ficará antes de salvar.

### Como Enviar um Formulário

**Caminho:** Lista de Formulários → Botão "Enviar" no formulário desejado

**Opções de envio:**
- **Link público** - Copiar e compartilhar
- **Email** - Enviar diretamente por email
- **WhatsApp** - Gerar link do WhatsApp
- **QR Code** - Para impressão ou compartilhamento

**Visualização de respostas:**
- Ver todas as respostas recebidas
- Filtrar por cliente ou período
- Exportar em CSV
- Visualizar resposta individual completa

---

## 📈 6. RELATÓRIOS DE GESTÃO

### Tipos de Relatórios Disponíveis

1. **Relatório de Evolução Física**
   - Resumo de medições por cliente
   - Médias e tendências
   - Primeira e última medição

2. **Relatório de Adesão ao Programa**
   - Taxa de adesão média
   - Programas ativos
   - Adesão máxima e mínima

3. **Relatório de Consultas**
   - Total de consultas
   - Por status (agendadas, realizadas, canceladas)
   - Por tipo (consulta, retorno, avaliação)
   - Taxa de comparecimento

4. **Relatório de Avaliações**
   - Total de avaliações
   - Avaliações iniciais vs reavaliações
   - Primeira e última avaliação

**Filtros:** Todos os relatórios podem ser filtrados por período (data início e fim).

---

## 🔄 7. INTEGRAÇÃO COM CAPTAÇÃO (LEADS → CLIENTES)

### Como Converter um Lead em Cliente

**Caminho:** Menu "Captação" → "Leads" → Botão "Converter em Cliente"

**O que acontece:**
1. Dados do lead são automaticamente preenchidos
2. Status inicial é determinado pela origem:
   - Quiz/Calculadora → "Contato"
   - Checklist/Ebook → "Pré-Consulta"
3. Opção de criar avaliação inicial automaticamente
4. Cliente aparece no Kanban na coluna correta

### Alertas de Leads Parados

O sistema alerta automaticamente quando:
- Um lead não foi convertido há 3+ dias (configurável: 1, 2, 3, 5, 7 dias)
- Aparece um banner laranja na página de leads
- Badge laranja na tabela mostra quantos dias parado

**Ação rápida:** Botão "Converter" direto do alerta.

---

## 💡 8. DICAS E BOAS PRÁTICAS

### Organização

- Use o Kanban para visualizar rapidamente o status de cada cliente
- Crie tags personalizadas para organizar por objetivo (emagrecimento, ganho de massa, etc.)
- Use notas rápidas no perfil para informações importantes

### Acompanhamento

- Registre evolução física regularmente para ver progresso
- Use a timeline para ver tudo que aconteceu com a cliente
- Configure alertas para não perder follow-ups

### Formulários

- Crie templates de formulários reutilizáveis
- Envie formulários antes da primeira consulta para otimizar tempo
- Visualize respostas antes da consulta para se preparar

### Agenda

- Use a agenda visual para ter visão completa da semana/mês
- Clique diretamente no calendário para agendar rapidamente
- Configure lembretes para consultas importantes

---

## ❓ PERGUNTAS FREQUENTES

### "Como vejo todas as respostas de um formulário?"
**Resposta:** Vá em "Formulários" → Clique no formulário → Botão "Respostas". Lá você verá todas as respostas, pode filtrar e exportar.

### "Como faço para um lead aparecer no Kanban automaticamente?"
**Resposta:** Ao converter um lead, o sistema já coloca na coluna correta baseado na origem. Quizzes vão para "Contato", checklists para "Pré-Consulta".

### "Como comparo duas avaliações?"
**Resposta:** Ao criar uma reavaliação, o sistema automaticamente compara com a anterior e mostra diferenças, percentuais e gráficos.

### "Como envio um formulário para um cliente?"
**Resposta:** Vá em "Formulários" → Clique em "Enviar" → Escolha o cliente → Copie o link ou envie por email/WhatsApp.

### "Como vejo quantos dias um lead está parado?"
**Resposta:** Na página de Leads, leads parados há 3+ dias aparecem com badge laranja mostrando os dias. Também há um banner no topo listando os que precisam de atenção.

### "Como mudo o status de um cliente?"
**Resposta:** No Kanban, arraste o card do cliente para a coluna desejada. Ou no perfil do cliente, edite o campo "Status".

### "Como agendo uma consulta rapidamente?"
**Resposta:** Na agenda, clique diretamente na data/horário desejado no calendário. O modal abrirá com a data já preenchida.

### "Como crio um novo cliente na hora de agendar?"
**Resposta:** No modal "Nova Consulta", clique no botão "Novo Cliente" ao lado do campo Cliente. Preencha nome, email e telefone, e o cliente será criado e selecionado automaticamente.

---

## 🎯 FLUXO RECOMENDADO DE USO

### Para Novas Clientes

1. **Captação** → Lead entra pelo quiz/calculadora
2. **Conversão** → Converter lead em cliente (status automático)
3. **Pré-Consulta** → Enviar formulário de anamnese
4. **Agendamento** → Agendar primeira consulta na agenda
5. **Consulta** → Registrar avaliação inicial
6. **Programa** → Criar programa/plano alimentar
7. **Acompanhamento** → Registrar evolução física regularmente
8. **Reavaliação** → Criar reavaliações periódicas

### Para Clientes Ativos

1. **Agenda** → Ver consultas da semana
2. **Evolução** → Registrar novas medições
3. **Timeline** → Ver histórico completo
4. **Programa** → Acompanhar adesão
5. **Relatórios** → Analisar progresso

---

## 🔧 FUNCIONALIDADES AVANÇADAS

### Histórico Emocional/Comportamental

Registre o estado emocional e comportamental da cliente:
- Humor e energia
- Estresse e ansiedade
- Adesão ao programa
- Gatilhos alimentares
- Observações gerais

**Caminho:** Perfil do Cliente → Aba "Emocional/Comportamental"

### Timeline (Histórico)

Veja tudo que aconteceu com a cliente em ordem cronológica:
- Consultas realizadas
- Avaliações criadas
- Evolução física registrada
- Formulários enviados
- Notas adicionadas
- Mudanças de status

**Caminho:** Perfil do Cliente → Aba "Histórico"

### Programa Atual

Gerencie o programa/plano que está ativo:
- Nome e descrição
- Conteúdo completo (JSONB flexível)
- Período (data início e fim)
- Status (ativo, pausado, finalizado)
- Adesão (percentual)
- Anexos (PDFs, imagens, links)

**Caminho:** Perfil do Cliente → Aba "Programa Atual"

---

## 📞 SUPORTE E AJUDA

### Dúvidas Técnicas
- Use o botão de chat (💬) no canto inferior direito
- A IA pode responder dúvidas sobre funcionalidades
- Para problemas técnicos, entre em contato com suporte

### Dúvidas sobre Uso
- Consulte este guia
- Use a busca na página de ajuda
- Pergunte à IA assistente

---

## 🎓 GLOSSÁRIO

- **Lead** - Contato capturado através de ferramentas (quiz, calculadora, etc.)
- **Cliente** - Pessoa que já foi convertida de lead e está em atendimento
- **Status** - Estágio atual do cliente no processo (Contato, Pré-Consulta, Ativa, etc.)
- **Kanban** - Visualização em colunas para gerenciar status
- **Reavaliação** - Avaliação vinculada a uma avaliação anterior para comparação
- **Formulário Personalizado** - Formulário criado pela nutricionista para enviar aos clientes
- **Timeline** - Histórico cronológico de todas as ações com a cliente

---

**Última atualização:** Novembro 2024
**Versão:** 1.0

