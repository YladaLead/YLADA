# Checklist de Teste — Perfumaria

## Pré-requisitos

1. **Migrations rodadas:**
   - 248-ylada-biblioteca-universal-perfumaria.sql
   - 249-ylada-perfumaria-archetypes.sql
   - 250-ylada-perfumaria-quizzes-virais.sql
   - 251-ylada-perfumaria-archetypes-cta-forte.sql
   - 252-ylada-biblioteca-perfumaria-meta.sql
   - 253-ylada-diagnosis-metrics-perfume-usage.sql

2. **Perfil simulado ativo:** Vá em `/pt/perfis-simulados` e ative **"Vendedor de perfumes"**

---

## 1. Biblioteca

- [ ] Acessar `/pt/biblioteca`
- [ ] Com perfil "Vendedor de perfumes" ativo, o segmento **Perfumaria e fragrâncias** deve aparecer sugerido (seu perfil)
- [ ] Filtrar por segmento "Perfumaria e fragrâncias"
- [ ] Verificar se os 12 quizzes virais aparecem (Qual fragrância combina com sua personalidade?, Sua presença é suave ou marcante?, etc.)
- [ ] Cada quiz deve ter 5 perguntas

---

## 2. Criação de link

- [ ] Clicar em "Criar link" em um quiz de perfumaria (ex.: "Qual fragrância combina com sua personalidade?")
- [ ] O link deve ser criado com sucesso
- [ ] O config do link deve ter `meta.architecture: "PERFUME_PROFILE"` e `meta.segment_code: "perfumaria"`

---

## 3. Fluxo do quiz (visitante)

- [ ] Acessar o link público (ex.: `/l/[slug]`)
- [ ] Responder as 5 perguntas (q3 = "Onde você usa perfume?" → Trabalho, Eventos, Dia a dia ou Encontros)
- [ ] Submeter e ver o diagnóstico

---

## 4. Diagnóstico

- [ ] O diagnóstico deve exibir um dos 8 perfis: Elegância Natural, Presença Magnética, Leveza Floral, Sofisticação Clássica, Energia Vibrante, Sedução Sutil, Intensidade Noturna, Charme Discreto
- [ ] O texto deve incluir "Pelas suas respostas..."
- [ ] Deve ter `frase_identificacao`: "Se você se identificou com esse resultado..."
- [ ] Deve ter `growth_potential` direcionando ao clique: "Quem te enviou esse quiz pode te mostrar..."
- [ ] CTA: "Quero receber sugestões de perfumes"
- [ ] O diagnóstico deve incluir `perfume_usage` no payload (trabalho, dia_a_dia, encontros ou eventos) conforme a resposta da q3

---

## 5. Mapeamento respostas → perfil

Testar combinações para verificar se o perfil retornado faz sentido:

| q1 (personalidade) | q2 (fragrância) | Perfil esperado (exemplo) |
|--------------------|-----------------|---------------------------|
| Elegante           | Floral          | Elegância Natural ou Leveza Floral |
| Intensa            | Amadeirado      | Presença Magnética ou Intensidade Noturna |
| Alegre             | Cítrico         | Energia Vibrante |
| Discreta           | Floral          | Charme Discreto ou Leveza Floral |

---

## 6. PERFUME_USAGE

- [ ] Responder q3 = "Trabalho" → diagnóstico deve ter `perfume_usage: "trabalho"`
- [ ] Responder q3 = "Eventos" → `perfume_usage: "eventos"`
- [ ] Responder q3 = "Dia a dia" → `perfume_usage: "dia_a_dia"`
- [ ] Responder q3 = "Encontros" → `perfume_usage: "encontros"`

---

## 7. WhatsApp

- [ ] Clicar no botão CTA deve abrir WhatsApp com mensagem pré-preenchida
- [ ] A mensagem deve incluir o perfil descoberto (ex.: "descobri meu perfil: Elegância Natural")
- [ ] A mensagem deve incluir o uso principal quando respondido na q3 (ex.: "Uso principal: dia a dia")

---

## 8. Métricas (ylada_diagnosis_metrics)

- [ ] Após responder o quiz, verificar no Supabase: `ylada_diagnosis_metrics` — última linha do link usado
- [ ] A coluna `perfume_usage` deve estar preenchida (dia_a_dia, trabalho, encontros ou eventos) conforme q3

---

## 9. Página de Leads (/pt/leads)

- [ ] Acessar `/pt/leads` (menu Resultados → Leads)
- [ ] A tabela deve listar diagnósticos com Data, Link, Resultado (perfil), Uso perfume, WhatsApp (cliqueu)
- [ ] Filtro "Uso do perfume" deve permitir filtrar por Dia a dia, Trabalho, Encontros, Eventos
- [ ] Filtro "Link" deve permitir filtrar por link específico
