# 📌 Plano de Próximas Funcionalidades – Gestão Nutri

Documento para orientar o desenvolvimento das próximas entregas. Segue em ordem sugerida (cada passo depende do anterior ou o complementa).

---

## 1. Aba Avaliação Física (Formulário completo)
**Objetivo:** permitir que a nutricionista registre avaliações antropométricas/bioimpedância com o mesmo nível de detalhe que no consultório.

**Passos:**
1. Definir modelo de dados final (`assessments.data`) para suportar campos variados (peso, dobras, composição).
2. Criar UI com seções colapsáveis (Medidas Básicas, Circunferências, Composição, Observações).
3. Permitir salvar rascunho e finalizar (status).
4. Permitir anexar fotos/documentos (referência para evolução).
5. Atualizar comparação automática com avaliação anterior (já previsto na API).

---

## 2. Aba Histórico Timeline (Timeline visual)
**Objetivo:** dar visão cronológica com filtros rápidos para “o que aconteceu com essa cliente”.

**Passos:**
1. Consumir `/api/nutri/clientes/[id]/historico`.
2. Construir timeline com marcadores por tipo (consulta, avaliação, nota, formulário, reavaliação).
3. Adicionar filtros por tipo e busca textual.
4. Permitir criar anotações rápidas diretamente da timeline.

---

## 3. Aba Programa Atual (Plano/Protocolo)
**Objetivo:** registrar o programa que está rodando agora (plano alimentar, protocolo, desafio) e acompanhar adesão.

**Passos:**
1. Estruturar UI em cards (Resumo, Refeições/Protocolos, Materiais anexados, Adesão).
2. Permitir upload de PDFs/imagens e links externos.
3. Adicionar campo “Checklist de acompanhamento” para nutriz marcar o que já entregou.
4. Integrar com `programs` para exibir andamento (status, datas, adesão).

---

## 4. Agenda Visual Avançada
**Objetivo:** substituir agenda externa (Google/Planner) por uma visão completa no YLADA.

**Passos:**
1. Implementar calendário semanal/mensal (usar `@fullcalendar/react` ou componente próprio).
2. Adicionar arrastar/soltar de consultas para reagendamento rápido.
3. Exibir detalhes inline (cliente, link de atendimento, status).
4. Criar filtros: tipo de consulta, status, apenas pendentes.
5. Integrar com notificações simples (ex.: alerta quando consulta começa em 15 minutos).

---

## 5. Criador de Formulários Personalizados
**Objetivo:** nutriz cria anamneses/checklists no estilo dela e envia para clientes.

**Passos:**
1. Construir builder visual (componentes básicos: texto, múltipla escolha, escala, upload).
2. Salvar estrutura em `custom_forms.structure`.
3. Criar biblioteca de templates base (pré-carregados).
4. Adicionar versão “preview” igual à imagem enviada (modal de criação de pergunta).

---

## 6. Sistema de Envio de Formulários
**Objetivo:** enviar formulário direto por link, e-mail ou WhatsApp.

**Passos:**
1. Tela “Enviar” com seleção de formulário + cliente.
2. Gerar link único e copiar automaticamente.
3. Ações rápidas: “Enviar por e-mail” (Resend) e “Enviar via WhatsApp” (link `wa.me` com mensagem padrão).
4. Status de entrega e respostas (sincronizar com `form_responses`).

---

## 7. Relatórios Visuais Simples
**Objetivo:** oferecer gráficos de evolução, adesão, consultas sem sair do sistema.

**Passos:**
1. Relatório “Evolução Física”: peso, medidas, IMC.
2. Relatório “Adesão / Emoções”: humor, estresse, adesão (%).
3. Relatório “Consultas & Agenda”: atendimentos realizados, cancelamentos, próximos passos.
4. Exportar PDF/resumo para enviar à cliente.

---

## 8. Integração com Captação (leads → clientes)
**Objetivo:** fechar o ciclo entre ferramentas de captação e gestão.

**Passos:**
1. Botão “Converter para cliente” diretamente nas telas de leads.
2. Sincronizar status/etapa do Kanban com origem (ex.: leads que vieram do quiz X entram direto na coluna “Contato”).
3. Criar alertas quando lead ficar parado mais de X dias.

---

### Observações gerais
- **Prioridade sugerida:** começar pelas abas pendentes (Avaliação Física, Timeline, Programa), seguir para agenda visual e formulários, depois relatórios e integração de captação.
- **Linguagem simples:** todas as telas devem manter rótulos amigáveis (“Pré-consulta”, “Programa atual”, “Enviar formulário pelo WhatsApp”).
- **Reaproveitamento:** componentes como cards de cliente, badges de status e timeline devem ser reutilizados para manter consistência.


