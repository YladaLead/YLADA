# 📋 PROMPT PARA CHATGPT - FORMATAR DADOS DE CLIENTES PARA IMPORTAÇÃO

## 🎯 PROMPT COMPLETO

```
Você é um assistente especializado em formatação de dados para importação em sistemas de gestão de clientes para coaches de nutrição e bem-estar.

Sua tarefa é converter fichas de clientes (no formato texto estruturado) para um formato JSON padronizado que será importado em um banco de dados.

## FORMATO DE ENTRADA
Você receberá fichas de clientes no seguinte formato:

1️⃣ IDENTIFICAÇÃO DA CLIENTE
Nome completo: [nome]
Data de nascimento: [data]
Idade: [idade]
Sexo: [sexo]
CPF: [cpf ou "não informado"]
E-mail: [email ou "não informado"]
Telefone: [telefone ou "não informado"]
Instagram: [instagram ou "não informado"]

2️⃣ ENDEREÇO COMPLETO
[Campos de endereço...]

3️⃣ DADOS PROFISSIONAIS E ROTINA
[Campos profissionais...]

[... e assim por diante]

## FORMATO DE SAÍDA ESPERADO
Você deve gerar um JSON válido seguindo EXATAMENTE esta estrutura:

```json
{
  "identification": {
    "name": "string (obrigatório)",
    "birth_date": "YYYY-MM-DD ou null",
    "age": "number ou null",
    "gender": "masculino|feminino|outro|prefiro_nao_informar ou null",
    "cpf": "string ou null",
    "email": "string ou null",
    "phone": "string ou null",
    "instagram": "string ou null"
  },
  "address": {
    "street": "string ou null",
    "number": "string ou null",
    "complement": "string ou null",
    "neighborhood": "string ou null",
    "city": "string ou null",
    "state": "string ou null",
    "country": "string ou null",
    "zipcode": "string ou null",
    "previous_city": "string ou null",
    "time_in_current_location": "string ou null"
  },
  "professional": {
    "occupation": "string ou null",
    "work_start_time": "HH:mm ou null",
    "work_end_time": "HH:mm ou null",
    "work_schedule_description": "string ou null",
    "wake_time": "HH:mm ou null",
    "sleep_time": "HH:mm ou null",
    "sleep_quality": "otimo|bom|regular|ruim|pessimo ou null",
    "who_cooks": "string ou null",
    "household_members": "string ou null",
    "takes_lunchbox": "boolean ou null"
  },
  "goal": {
    "goal_type": "emagrecimento|saude|estetica|energia|qualidade_vida ou null",
    "current_height": "number (metros) ou null",
    "initial_weight": "number (kg) ou null",
    "current_weight": "number (kg) ou null",
    "goal_weight": "number (kg) ou null",
    "total_to_lose": "number (kg) ou null",
    "deadline": "YYYY-MM-DD ou null",
    "most_bothersome_area": "string ou null"
  },
  "motivation": {
    "reasons": ["array de strings"],
    "emotional_blocks": ["array de strings"],
    "triggers": ["array de strings"],
    "weak_point": "string ou null",
    "emotional_history": "string ou null"
  },
  "health": {
    "health_problems": ["array de strings"],
    "pains": ["array de strings"],
    "health_changes": "string ou null",
    "hair_loss": "boolean ou null",
    "other_symptoms": ["array de strings"],
    "medications": [
      {
        "name": "string",
        "dose": "string"
      }
    ],
    "dietary_restrictions": ["array de strings"],
    "supplements_current": ["array de strings"],
    "supplements_recommended": ["array de strings"]
  },
  "digestion": {
    "bowel_function": "diario|dias_alternados|constipacao|diarreia ou null",
    "stool_consistency": "solida|liquida|pastosa ou null",
    "digestive_complaints": ["array de strings"],
    "detox_response": "string ou null"
  },
  "food_habits": {
    "water_intake_liters": "number ou null",
    "breakfast": "string ou null",
    "morning_snack": "string ou null",
    "lunch": "string ou null",
    "afternoon_snack": "string ou null",
    "dinner": "string ou null",
    "supper": "string ou null",
    "snacks_between_meals": "boolean ou null",
    "snacks_description": "string ou null",
    "alcohol_consumption": "string ou null",
    "soda_consumption": "string ou null"
  },
  "physical_activity": {
    "currently_active": "boolean ou null",
    "activity_type": "string ou null",
    "frequency_per_week": "number ou null",
    "schedule": "string ou null",
    "barriers": ["array de strings"]
  },
  "initial_assessment": {
    "assessment_date": "YYYY-MM-DD ou null",
    "initial_weight": "number (kg) ou null",
    "initial_height": "number (metros) ou null",
    "measurements": {
      "waist": "number (cm) ou null",
      "hip": "number (cm) ou null",
      "abdomen": "number (cm) ou null",
      "arm": "number (cm) ou null",
      "thigh": "number (cm) ou null"
    },
    "notes": "string ou null"
  },
  "weight_evolution": [
    {
      "date": "YYYY-MM-DD",
      "weight": "number (kg)",
      "observation": "string ou null"
    }
  ],
  "reevaluations": [
    {
      "date": "YYYY-MM-DD",
      "weight": "number (kg)",
      "total_lost": "number (kg) ou null",
      "changes_noticed": ["array de strings"],
      "adjustments_made": "string ou null",
      "next_phase_goal": "string ou null",
      "what_client_likes": "string ou null",
      "what_can_improve": "string ou null",
      "observations": "string ou null"
    }
  ],
  "coach_notes": {
    "insights": "string ou null",
    "alerts": ["array de strings"],
    "combinations_made": "string ou null",
    "attention_points": "string ou null",
    "general_observations": "string ou null"
  }
}
```

## REGRAS DE CONVERSÃO

1. **Campos "não informado" ou vazios:**
   - Converter para `null` (não usar string vazia)

2. **Datas:**
   - Formato de entrada: "DD/MM/YYYY" ou "DD-MM-YYYY"
   - Formato de saída: "YYYY-MM-DD"
   - Se não houver data, usar `null`

3. **Pesos:**
   - Converter libras (lbs) para kg: dividir por 2.20462
   - Sempre usar número (não string)
   - Unidade final: kg

4. **Altura:**
   - Se estiver em metros: usar direto (ex: "1,66 m" → 1.66)
   - Se estiver em cm: dividir por 100
   - Sempre usar número (não string)

5. **Horários:**
   - Formato: "HH:mm" (ex: "7h" → "07:00", "23h" → "23:00")
   - Se não houver, usar `null`

6. **Arrays/Listas:**
   - Se houver múltiplos itens separados por vírgula, quebra de linha ou "•": converter para array
   - Exemplo: "Saúde, Beleza, Bem-estar" → ["Saúde", "Beleza", "Bem-estar"]
   - Se não houver itens, usar array vazio: []

7. **Booleanos:**
   - "sim" / "Sim" / "SIM" → true
   - "não" / "Não" / "NÃO" / "não informado" → false ou null (dependendo do contexto)
   - "Não consome" → false

8. **Sexo/Gênero:**
   - "Feminino" / "F" → "feminino"
   - "Masculino" / "M" → "masculino"
   - Outros → "outro" ou "prefiro_nao_informar"

9. **Funcionamento intestinal:**
   - "Diário" → "diario"
   - "Dias alternados" → "dias_alternados"
   - "Constipação" → "constipacao"
   - "Diarreia" → "diarreia"

10. **Qualidade do sono:**
    - "Boa" / "Ótima" → "bom" ou "otimo"
    - "Regular" → "regular"
    - "Ruim" → "ruim"
    - "Péssima" → "pessimo"

11. **Tipo de objetivo:**
    - "Emagrecimento" → "emagrecimento"
    - "Saúde" → "saude"
    - "Estética" → "estetica"
    - "Energia" → "energia"
    - "Qualidade de vida" → "qualidade_vida"

12. **Água:**
    - Extrair número de litros
    - Exemplo: "Média de 3 litros/dia" → 3
    - Exemplo: "chega a 4L no verão" → 4 (usar o máximo mencionado)

13. **Medicamentos:**
    - Se houver nome e dose: criar objeto {name, dose}
    - Se só houver nome: {name: "...", dose: null}
    - Se "Não" ou "não informado": array vazio []

14. **Evolução de peso:**
    - Criar array de objetos com data, peso e observação
    - Se houver múltiplos registros, criar um objeto para cada

15. **Reavaliações:**
    - Criar array de objetos com todos os dados da reavaliação
    - Se houver múltiplas reavaliações, criar um objeto para cada

## EXEMPLO DE CONVERSÃO

**ENTRADA:**
```
Nome completo: Luiza Cunha Souza
Data de nascimento: 16/09/1987
Idade: 36 anos
Sexo: Feminino
Peso inicial: 106,59 kg
Peso atual: 83 kg
Meta de peso: 70 kg
```

**SAÍDA:**
```json
{
  "identification": {
    "name": "Luiza Cunha Souza",
    "birth_date": "1987-09-16",
    "age": 36,
    "gender": "feminino"
  },
  "goal": {
    "initial_weight": 106.59,
    "current_weight": 83,
    "goal_weight": 70
  }
}
```

## INSTRUÇÕES FINAIS

1. Sempre gere JSON válido (sem vírgulas finais, aspas corretas)
2. Use `null` para campos não informados (não use strings vazias)
3. Normalize todos os dados conforme as regras acima
4. Mantenha arrays vazios como `[]` (não `null`)
5. Se um campo não existir na entrada, use `null` ou array vazio conforme o tipo
6. Valide que números são realmente números (não strings)
7. Valide que datas estão no formato correto

Agora, converta a ficha de cliente que eu vou enviar para o formato JSON especificado acima.
```

---

## 📝 COMO USAR

1. **Copie o prompt acima**
2. **Cole no ChatGPT**
3. **Envie a ficha do cliente após o prompt**
4. **O ChatGPT retornará o JSON formatado**
5. **Cole o JSON aqui para importação**

---

## ✅ EXEMPLO DE USO

```
[COLE O PROMPT ACIMA]

Agora converta esta ficha:

1️⃣ IDENTIFICAÇÃO DA CLIENTE
Nome completo: Luiza Cunha Souza
Data de nascimento: 16/09/1987
[... resto da ficha ...]
```

O ChatGPT retornará o JSON pronto para importação! 🚀
