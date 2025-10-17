export const toolMessages = {
  'imc': {
    title: 'Calculadora de IMC Profissional',
    description: 'Calcule seu Índice de Massa Corporal com nossa calculadora especializada e receba orientações personalizadas.',
    shortMessage: 'Calcule seu IMC com nossa calculadora profissional 🏥',
    image: 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
  },
  'proteina': {
    title: 'Calculadora de Proteína Diária',
    description: 'Descubra exatamente quanta proteína você precisa por dia baseado no seu perfil e objetivos.',
    shortMessage: 'Descubra sua necessidade diária de proteína 💪',
    image: 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
  },
  'hidratacao': {
    title: 'Calculadora de Hidratação Ideal',
    description: 'Calcule sua necessidade diária de água para manter-se hidratado e saudável.',
    shortMessage: 'Calcule sua hidratação ideal 💧',
    image: 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg'
  },
  'nutricao': {
    title: 'Avaliação Nutricional Completa',
    description: 'Faça uma avaliação completa da sua alimentação com nosso especialista em nutrição.',
    shortMessage: 'Avalie sua alimentação com nosso especialista 🥗',
    image: 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
  },
  'bmi': {
    title: 'Calculadora de IMC Profissional',
    description: 'Calcule seu Índice de Massa Corporal com nossa calculadora especializada e receba orientações personalizadas.',
    shortMessage: 'Calcule seu IMC com nossa calculadora profissional 🏥',
    image: 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
  },
  'protein': {
    title: 'Calculadora de Proteína Diária',
    description: 'Descubra exatamente quanta proteína você precisa por dia baseado no seu perfil e objetivos.',
    shortMessage: 'Descubra sua necessidade diária de proteína 💪',
    image: 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
  },
  'hydration': {
    title: 'Calculadora de Hidratação Ideal',
    description: 'Calcule sua necessidade diária de água para manter-se hidratado e saudável.',
    shortMessage: 'Calcule sua hidratação ideal 💧',
    image: 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg'
  },
  'nutrition-assessment': {
    title: 'Avaliação Nutricional Completa',
    description: 'Faça uma avaliação completa da sua alimentação com nosso especialista em nutrição.',
    shortMessage: 'Avalie sua alimentação com nosso especialista 🥗',
    image: 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
  },
  'meal-planner': {
    title: 'Planejador de Refeições Inteligente',
    description: 'Crie um plano alimentar personalizado baseado nas suas necessidades nutricionais.',
    shortMessage: 'Crie seu plano alimentar personalizado 🍽️',
    image: 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
  },
  'calorie-calculator': {
    title: 'Calculadora de Calorias Diárias',
    description: 'Descubra quantas calorias você precisa consumir por dia para atingir seus objetivos.',
    shortMessage: 'Calcule suas calorias diárias ideais 🔥',
    image: 'https://www.herbalead.com/logos/herbalead/nutricao-og-image.jpg'
  },
  'body-fat': {
    title: 'Calculadora de Gordura Corporal',
    description: 'Estime seu percentual de gordura corporal com nossa calculadora especializada.',
    shortMessage: 'Estime seu percentual de gordura corporal 📊',
    image: 'https://www.herbalead.com/logos/herbalead/imc-og-image.jpg'
  },
  'macros': {
    title: 'Calculadora de Macronutrientes',
    description: 'Calcule a distribuição ideal de carboidratos, proteínas e gorduras para sua dieta.',
    shortMessage: 'Calcule seus macronutrientes ideais ⚖️',
    image: 'https://www.herbalead.com/logos/herbalead/proteina-og-image.jpg'
  },
  'water-intake': {
    title: 'Calculadora de Consumo de Água',
    description: 'Descubra quanta água você deve beber por dia para manter-se hidratado.',
    shortMessage: 'Calcule seu consumo ideal de água 💧',
    image: 'https://www.herbalead.com/logos/herbalead/hidratacao-og-image.jpg'
  }
}

export const getToolMessage = (toolName: string) => {
  return toolMessages[toolName as keyof typeof toolMessages] || {
    title: 'Ferramenta de Saúde e Bem-estar',
    description: 'Acesse nossa ferramenta especializada para cuidar da sua saúde.',
    shortMessage: 'Acesse nossa ferramenta de saúde 🏥',
    image: 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
  }
}
