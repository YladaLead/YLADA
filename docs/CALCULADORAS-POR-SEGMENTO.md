# Calculadoras por segmento (Biblioteca YLADA)

Resumo do que existe hoje na biblioteca (`ylada_biblioteca_itens` com `tipo = 'calculadora'`).  
As únicas calculadoras cadastradas são as **4** da migration 236: **Água**, **Calorias**, **IMC** e **Proteína**.

---

## Segmentos que **têm** calculadora(s)

| Segmento (código) | Área/rota | Calculadoras disponíveis |
|-------------------|-----------|---------------------------|
| **Nutrição** (nutrition) | nutri | Água, Calorias, IMC, Proteína (4) |
| **Vendedor nutra/suplementos** (nutrition_vendedor) | nutra, seller | Água, Calorias, IMC, Proteína (4) |
| **Medicina** (medicine) | med | Água, Calorias, IMC, Proteína (4) |
| **Fitness** (fitness) | fitness, coach | Água, Calorias, IMC, Proteína (4) |
| **Estética** (aesthetics) | estetica | **Só IMC** (1) — Água, Calorias e Proteína não estão no segmento |

---

## Segmentos que **não têm** nenhuma calculadora

| Segmento (código) | Área/rota | Situação |
|-------------------|-----------|----------|
| **Psicologia** (psychology) | psi | Nenhuma calculadora na biblioteca |
| **Odontologia** (dentistry) | odonto | Nenhuma calculadora na biblioteca |
| **Perfumaria** (perfumaria) | perfumaria | Nenhuma calculadora na biblioteca |

---

## Resumo para você criar novas calculadoras

- **Psi** – hoje só há quizzes (estresse, mente acelerada, sobrecarga emocional, relaxar). Uma calculadora poderia ser, por exemplo: “Calculadora de horas de sono recomendadas”, “Calculadora de nível de estresse” (escore), ou algo que gere engajamento e lead (ex.: “Quantas horas você realmente descansa?”).
- **Odonto** – só há quizzes (saúde bucal, etc.). Possíveis calculadoras: “Calculadora de risco de cárie” (baseada em hábitos), “Quantas escovações por dia você faz vs. recomendado”, ou “Calculadora de custo de tratamento preventivo”.
- **Perfumaria** – hoje não há calculadoras. Ideias: “Calculadora de intensidade de fragrância” (por ocasião/ambiente), “Quantos ml de perfume dura X tempo”, ou “Quiz/calculadora de perfil olfativo” (já existe quiz; uma versão calculadora poderia dar um “número” ou score).

---

## Onde está definido no código

- **Templates de calculadora:** `ylada_link_templates` (type `calculator`) — IDs das 4 atuais: `b1000025` (água), `b1000026` (calorias), `b1000027` (IMC), `b1000028` (proteína).
- **Vínculo com segmentos:** `ylada_biblioteca_itens` (coluna `segment_codes` — array de códigos, ex.: `ARRAY['psychology']` para psi, `ARRAY['dentistry']` para odonto, `ARRAY['perfumaria']` para perfumaria).
- **Migration de referência:** `migrations/236-ylada-templates-calculadoras-biblioteca-nutri.sql`.

Para **adicionar** uma nova calculadora a um segmento que não tem:

1. Criar o template em `ylada_link_templates` (type `calculator`, `schema_json` com `fields`, `formula`, `resultLabel`, etc.).
2. Inserir (ou atualizar) um registro em `ylada_biblioteca_itens` com `tipo = 'calculadora'`, `template_id` = id do template e `segment_codes` incluindo o código do segmento (ex.: `'psychology'`, `'dentistry'`, `'perfumaria'`).

Com isso você sabe exatamente **quem tem** e **quem não tem** calculadora e em quais segmentos vale a pena criar uma.
