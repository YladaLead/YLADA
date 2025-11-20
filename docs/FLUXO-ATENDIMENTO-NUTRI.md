# 📘 Fluxo de Atendimento Nutri — Documento Guia

Este guia transforma os aprendizados do módulo de gestão em um fluxo claro para orientar:
- **Nutricionistas usuárias** (como conduzir o atendimento dentro do sistema)
- **Time interno/Iara** (como responder dúvidas e manter consistência)
- **Próximos passos de produto** (o que precisa ser construído em cada fase)

---

## 1. Entrada / Captação
**Objetivo:** acolher o contato e entender rapidamente o contexto.

| O que registrar | Por quê | Próximos passos do produto |
|-----------------|---------|----------------------------|
| Origem do contato (quiz, link, indicação) | Personaliza a abordagem e mede canais | Exibir origem e CTA direto no card do lead/cliente |
| Dados essenciais (nome, telefone com DDI, email, cidade/UF) | Facilita contato e humaniza | Validação de telefone com `PhoneInputWithCountry` em todo o fluxo |
| Objetivo declarado (ex.: “perder 8kg”) | Ponto de partida para plano | Campo obrigatório nos cadastros e cartões |
| Status inicial (Contato/Pré-Consulta) | Define prioridade | Criar automações simples (ex.: novo lead = coluna “Contato” no Kanban) |
| Próximo passo/agendamento | Para não perder o timing | Botão “Agendar agora” direto do card + lembretes |

---

## 2. Pré-consulta / Onboarding
**Objetivo:** preparar tudo antes do primeiro atendimento.

| O que registrar | Por quê | Próximos passos do produto |
|-----------------|---------|----------------------------|
| Checklist pré-consulta (documentos, formulários enviados, confirmação do horário) | Evita idas e vindas | Mini-checklist por cliente (feito/pendente) |
| Formulários personalizados / anamneses | Mantém o “jeito dela” | Integração com criador de formulários e status de resposta |
| Observações rápidas (dor principal, limitações) | Ajuda a quebrar o gelo | Campos de “Notas rápidas” visíveis no topo do perfil |
| Materiais a enviar (quiz, ebook, protocolo inicial) | Mantém relacionamento antes da consulta | Seção “Materiais pendentes” no perfil |

---

## 3. Consulta & Programa Ativo
**Objetivo:** conduzir o atendimento, registrar evolução e indicar o programa da nutricionista.

| O que registrar | Por quê | Próximos passos do produto |
|-----------------|---------|----------------------------|
| Agenda completa (passado/futuro, links) | visão 360 do atendimento | Timeline de consultas + botão “Abrir Meet/WhatsApp” |
| Plano/Programa atual (metodologia própria) | nutricionista vê “o que entregou” | Aba “Programa Atual” com estrutura flexível (planos alimentares, protocolos, anexos) |
| Evolução física (peso, medidas, gráficos, fotos) | mostrar progresso | Simplificar gráficos + upload de fotos direto no card |
| Evolução emocional/comportamental (humor, adesão, gatilhos) | entender travas e adaptar plano | Formulário rápido com sliders e frases em linguagem simples |
| Tarefas combinadas (ex.: “enviar lista de compras”) | garante acompanhamento | Tabela de tarefas com responsáveis e data |

---

## 4. Acompanhamento Contínuo
**Objetivo:** enxergar tudo o que está acontecendo e não perder follow-ups.

| O que registrar | Por quê | Próximos passos do produto |
|-----------------|---------|----------------------------|
| Timeline unificada (consulta, avaliação, nota, mensagem) | recupera contexto em segundos | Melhorar aba “Histórico” com filtros e tags |
| Alertas automáticos (cliente sem contato há X dias, retorno pendente) | reduz abandono | Lógica simples de alertas + e-mail/WhatsApp interno |
| Reaproveitamento de formulários | agiliza checagens periódicas | Botão “Reenviar formulário” com link pronto |
| Kanban / status visual | prioriza quem está parado | Finalizar interações drag & drop com mensagens de confirmação |

---

## 5. Reavaliação & Encerramento
**Objetivo:** comparar resultados e definir próximo ciclo.

| O que registrar | Por quê | Próximos passos do produto |
|-----------------|---------|----------------------------|
| Comparativos (antes/depois de medidas, fotos, humor) | celebra resultados e ajusta metas | Dashboard simples de comparação + exportável |
| Status final (concluiu, pausa, novo programa) | mantém CRM limpo | Ações rápidas no perfil (ex.: “Finalizar ciclo” → move para coluna “Finalizada”) |
| Lições aprendidas / depoimento | vira prova social e insight | Campo “O que aprendi com essa cliente” + link para depoimento |

---

## Próximos Documentos
1. **Guia Rápido para Nutricionistas** — passo a passo dentro do site (para base de dúvidas).
2. **Manual da Iara** — respostas prontas por fluxo (ex.: “Como envio um novo formulário para cliente em pausa?”).
3. **Documento Alicerce** — visão macro do ecossistema (APIs, páginas e status dos módulos) para manter o time alinhado.

> **Status:** este documento serve como referência para continuar o desenvolvimento das abas pendentes (Avaliação Física, Timeline, Programa, Fóruns de formulários) e como base para os manuais mencionados acima.


