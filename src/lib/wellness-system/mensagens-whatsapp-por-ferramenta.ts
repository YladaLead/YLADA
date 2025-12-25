/**
 * Mensagens prontas do WhatsApp para cada ferramenta Wellness
 * Essas mensagens são usadas automaticamente quando o usuário clica no botão CTA
 */

export interface MensagemWhatsApp {
  mensagem: string
  botaoTexto?: string
}

/**
 * Mapeamento de mensagens por slug da ferramenta
 */
export const mensagensWhatsAppPorFerramenta: Record<string, MensagemWhatsApp> = {
  // ============================================
  // CALCULADORAS
  // ============================================
  
  'calc-agua': {
    mensagem: 'Olá! Acabei de ver meu índice de hidratação e queria saber mais sobre como melhorar minha hidratação diária.',
    botaoTexto: 'Saiba Mais sobre Hidratação'
  },
  'calculadora-agua': {
    mensagem: 'Olá! Acabei de ver meu índice de hidratação e queria saber mais sobre como melhorar minha hidratação diária.',
    botaoTexto: 'Saiba Mais sobre Hidratação'
  },
  'calc-hidratacao': {
    mensagem: 'Olá! Acabei de ver meu índice de hidratação e queria saber mais sobre como melhorar minha hidratação diária.',
    botaoTexto: 'Saiba Mais sobre Hidratação'
  },
  'calculadora-hidratacao': {
    mensagem: 'Olá! Acabei de ver meu índice de hidratação e queria saber mais sobre como melhorar minha hidratação diária.',
    botaoTexto: 'Saiba Mais sobre Hidratação'
  },
  
  'calc-imc': {
    mensagem: 'Olá! Acabei de calcular meu IMC e queria saber mais sobre como alcançar meu objetivo de forma saudável.',
    botaoTexto: 'Saiba Mais sobre IMC'
  },
  'calculadora-imc': {
    mensagem: 'Olá! Acabei de calcular meu IMC e queria saber mais sobre como alcançar meu objetivo de forma saudável.',
    botaoTexto: 'Saiba Mais sobre IMC'
  },
  
  'calc-proteina': {
    mensagem: 'Olá! Acabei de calcular minha necessidade de proteína e queria saber mais sobre como alcançar essa meta diariamente.',
    botaoTexto: 'Saiba Mais sobre Proteína'
  },
  'calculadora-proteina': {
    mensagem: 'Olá! Acabei de calcular minha necessidade de proteína e queria saber mais sobre como alcançar essa meta diariamente.',
    botaoTexto: 'Saiba Mais sobre Proteína'
  },
  
  'calc-calorias': {
    mensagem: 'Olá! Acabei de calcular minhas necessidades calóricas e queria saber mais sobre como alcançar meu objetivo.',
    botaoTexto: 'Saiba Mais sobre Calorias'
  },
  'calculadora-calorias': {
    mensagem: 'Olá! Acabei de calcular minhas necessidades calóricas e queria saber mais sobre como alcançar meu objetivo.',
    botaoTexto: 'Saiba Mais sobre Calorias'
  },
  
  // ============================================
  // QUIZZES DE BEM-ESTAR
  // ============================================
  
  'quiz-bem-estar': {
    mensagem: 'Olá! Acabei de descobrir meu perfil de bem-estar e queria saber mais sobre como otimizar minha rotina.',
    botaoTexto: 'Saiba Mais sobre Bem-Estar'
  },
  'quiz-interativo': {
    mensagem: 'Olá! Acabei de descobrir meu tipo de metabolismo e queria saber mais sobre estratégias personalizadas para mim.',
    botaoTexto: 'Saiba Mais sobre Metabolismo'
  },
  'quiz-perfil-nutricional': {
    mensagem: 'Olá! Acabei de descobrir meu perfil de absorção nutricional e queria saber mais sobre como otimizar minha nutrição.',
    botaoTexto: 'Saiba Mais sobre Nutrição'
  },
  'quiz-detox': {
    mensagem: 'Olá! Acabei de fazer a avaliação de detox e queria saber mais sobre como fazer um processo de desintoxicação seguro.',
    botaoTexto: 'Saiba Mais sobre Detox'
  },
  'quiz-energetico': {
    mensagem: 'Olá! Acabei de avaliar meu nível de energia e queria saber mais sobre como aumentar minha vitalidade.',
    botaoTexto: 'Saiba Mais sobre Energia'
  },
  
  // ============================================
  // AVALIAÇÕES
  // ============================================
  
  'avaliacao-emocional': {
    mensagem: 'Olá! Acabei de fazer a avaliação emocional e queria saber mais sobre como potencializar meu bem-estar.',
    botaoTexto: 'Saiba Mais sobre Bem-Estar Emocional'
  },
  'avaliacao-intolerancia': {
    mensagem: 'Olá! Acabei de fazer a avaliação de intolerâncias e queria saber mais sobre alimentos adequados para mim.',
    botaoTexto: 'Saiba Mais sobre Intolerâncias'
  },
  'intolerancia': {
    mensagem: 'Olá! Acabei de fazer a avaliação de intolerâncias e queria saber mais sobre alimentos adequados para mim.',
    botaoTexto: 'Saiba Mais sobre Intolerâncias'
  },
  'avaliacao-inicial': {
    mensagem: 'Olá! Acabei de fazer a avaliação inicial e queria saber mais sobre como podemos trabalhar juntos.',
    botaoTexto: 'Saiba Mais'
  },
  'perfil-metabolico': {
    mensagem: 'Olá! Acabei de descobrir meu perfil metabólico e queria saber mais sobre como otimizar meu metabolismo.',
    botaoTexto: 'Saiba Mais sobre Metabolismo'
  },
  
  // ============================================
  // DIAGNÓSTICOS
  // ============================================
  
  'diagnostico-eletrolitos': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de eletrólitos e queria saber mais sobre como melhorar meu equilíbrio.',
    botaoTexto: 'Saiba Mais sobre Eletrólitos'
  },
  'diagnostico-sintomas-intestinais': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de sintomas intestinais e queria saber mais sobre como melhorar minha saúde digestiva.',
    botaoTexto: 'Saiba Mais sobre Saúde Intestinal'
  },
  'diagnostico-parasitose': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de parasitose e queria saber mais sobre como cuidar da minha saúde.',
    botaoTexto: 'Saiba Mais sobre Parasitose'
  },
  'parasitose': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de parasitose e queria saber mais sobre como cuidar da minha saúde.',
    botaoTexto: 'Saiba Mais sobre Parasitose'
  },
  
  // ============================================
  // QUIZZES ESPECÍFICOS
  // ============================================
  
  'pronto-emagrecer': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como emagrecer com saúde.',
    botaoTexto: 'Saiba Mais sobre Emagrecimento'
  },
  'tipo-fome': {
    mensagem: 'Olá! Acabei de descobrir meu tipo de fome e queria saber mais sobre como controlá-la.',
    botaoTexto: 'Saiba Mais sobre Controle de Fome'
  },
  'quiz-fome-emocional': {
    mensagem: 'Olá! Acabei de fazer a avaliação de fome emocional e queria saber mais sobre como controlar minha relação com a comida.',
    botaoTexto: 'Saiba Mais sobre Fome Emocional'
  },
  'fome-emocional': {
    mensagem: 'Olá! Acabei de fazer a avaliação de fome emocional e queria saber mais sobre como controlar minha relação com a comida.',
    botaoTexto: 'Saiba Mais sobre Fome Emocional'
  },
  'alimentacao-saudavel': {
    mensagem: 'Olá! Acabei de fazer o quiz de alimentação saudável e queria saber mais sobre como melhorar meus hábitos alimentares.',
    botaoTexto: 'Saiba Mais sobre Alimentação Saudável'
  },
  'quiz-alimentacao-saudavel': {
    mensagem: 'Olá! Acabei de fazer o quiz de alimentação saudável e queria saber mais sobre como melhorar meus hábitos alimentares.',
    botaoTexto: 'Saiba Mais sobre Alimentação Saudável'
  },
  'sindrome-metabolica': {
    mensagem: 'Olá! Acabei de fazer a avaliação de síndrome metabólica e queria saber mais sobre como prevenir complicações.',
    botaoTexto: 'Saiba Mais sobre Síndrome Metabólica'
  },
  'retencao-liquidos': {
    mensagem: 'Olá! Acabei de fazer o teste de retenção de líquidos e queria saber mais sobre como reduzir o inchaço.',
    botaoTexto: 'Saiba Mais sobre Retenção de Líquidos'
  },
  'conhece-seu-corpo': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como conhecer melhor meu corpo.',
    botaoTexto: 'Saiba Mais sobre Autoconhecimento'
  },
  'nutrido-vs-alimentado': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como transformar alimentação em nutrição.',
    botaoTexto: 'Saiba Mais sobre Nutrição'
  },
  'alimentacao-rotina': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como adequar minha alimentação à minha rotina.',
    botaoTexto: 'Saiba Mais sobre Alimentação e Rotina'
  },
  
  // ============================================
  // QUIZZES DE CRESCIMENTO
  // ============================================
  
  'ganhos-prosperidade': {
    mensagem: 'Olá! Acabei de fazer o quiz de ganhos e prosperidade e queria saber mais sobre oportunidades de crescimento.',
    botaoTexto: 'Saiba Mais sobre Ganhos'
  },
  'quiz-ganhos': {
    mensagem: 'Olá! Acabei de fazer o quiz de ganhos e prosperidade e queria saber mais sobre oportunidades de crescimento.',
    botaoTexto: 'Saiba Mais sobre Ganhos'
  },
  'potencial-crescimento': {
    mensagem: 'Olá! Acabei de descobrir meu potencial de crescimento e queria saber mais sobre como alcançar meu máximo.',
    botaoTexto: 'Saiba Mais sobre Potencial'
  },
  'quiz-potencial': {
    mensagem: 'Olá! Acabei de descobrir meu potencial de crescimento e queria saber mais sobre como alcançar meu máximo.',
    botaoTexto: 'Saiba Mais sobre Potencial'
  },
  'quiz-potencial-crescimento': {
    mensagem: 'Olá! Acabei de descobrir meu potencial de crescimento e queria saber mais sobre como alcançar meu máximo.',
    botaoTexto: 'Saiba Mais sobre Potencial'
  },
  'proposito-equilibrio': {
    mensagem: 'Olá! Acabei de fazer o quiz de propósito e equilíbrio e queria saber mais sobre como viver meu propósito.',
    botaoTexto: 'Saiba Mais sobre Propósito'
  },
  'quiz-proposito': {
    mensagem: 'Olá! Acabei de fazer o quiz de propósito e equilíbrio e queria saber mais sobre como viver meu propósito.',
    botaoTexto: 'Saiba Mais sobre Propósito'
  },
  
  // ============================================
  // CHECKLISTS
  // ============================================
  
  'checklist-alimentar': {
    mensagem: 'Olá! Acabei de fazer o checklist alimentar e queria saber mais sobre como melhorar meus hábitos alimentares.',
    botaoTexto: 'Saiba Mais sobre Alimentação'
  },
  'checklist-detox': {
    mensagem: 'Olá! Acabei de fazer o checklist detox e queria saber mais sobre como fazer um processo de detox eficaz.',
    botaoTexto: 'Saiba Mais sobre Detox'
  },
  
  // ============================================
  // GUIAS
  // ============================================
  
  'guia-hidratacao': {
    mensagem: 'Olá! Acabei de ver o guia de hidratação e queria saber mais sobre como otimizar meu consumo de água.',
    botaoTexto: 'Saiba Mais sobre Hidratação'
  },
  'guia-nutraceutico': {
    mensagem: 'Olá! Acabei de ver o guia nutracêutico e queria saber mais sobre como escolher e usar suplementos.',
    botaoTexto: 'Saiba Mais sobre Nutracêuticos'
  },
  'guia-proteico': {
    mensagem: 'Olá! Acabei de ver o guia proteico e queria saber mais sobre proteínas e como incluí-las na minha rotina.',
    botaoTexto: 'Saiba Mais sobre Proteínas'
  },
  
  // ============================================
  // DESAFIOS
  // ============================================
  
  'desafio-7-dias': {
    mensagem: 'Olá! Acabei de ver o desafio de 7 dias e queria saber mais sobre como participar e transformar meus hábitos.',
    botaoTexto: 'Quero Participar do Desafio'
  },
  'desafio-21-dias': {
    mensagem: 'Olá! Acabei de ver o desafio de 21 dias e queria saber mais sobre como participar e transformar minha vida.',
    botaoTexto: 'Quero Participar do Desafio'
  },
  
  // ============================================
  // FLUXOS DE RECRUTAMENTO / NEGÓCIO
  // ============================================
  
  'renda-extra-imediata': {
    mensagem: 'Olá! Acabei de fazer a avaliação de renda extra e queria saber mais sobre essa oportunidade simples e duplicável.',
    botaoTexto: 'Quero Conhecer a Oportunidade'
  },
  'maes-trabalhar-casa': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como trabalhar de casa com flexibilidade total.',
    botaoTexto: 'Quero Conhecer Essa Oportunidade'
  },
  'ja-consome-bem-estar': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como transformar meu consumo de produtos saudáveis em renda.',
    botaoTexto: 'Quero Saber Mais sobre Essa Oportunidade'
  },
  'trabalhar-apenas-links': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre esse modelo 100% digital, sem estoque e só com links.',
    botaoTexto: 'Quero Conhecer Esse Modelo Digital'
  },
  'ja-usa-energia-acelera': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como transformar meu consumo de Energia e Acelera em renda extra.',
    botaoTexto: 'Quero Ver Como Funciona a Oportunidade'
  },
  'cansadas-trabalho-atual': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre essa oportunidade de renda paralela com liberdade e flexibilidade.',
    botaoTexto: 'Quero Conhecer Essa Oportunidade'
  },
  'ja-tentaram-outros-negocios': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre esse modelo diferente, simples e com suporte completo.',
    botaoTexto: 'Quero Conhecer Esse Modelo Diferente'
  },
  'querem-trabalhar-digital': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como trabalhar 100% digital, sem exposição e só com links.',
    botaoTexto: 'Quero Conhecer Esse Modelo Digital'
  },
  'ja-empreendem': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre essa renda complementar que se integra ao meu negócio atual.',
    botaoTexto: 'Quero Conhecer Essa Renda Complementar'
  },
  'querem-emagrecer-renda': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como emagrecer com resultados rápidos e ainda gerar renda extra.',
    botaoTexto: 'Quero Conhecer Essa Oportunidade'
  },
  'boas-venda-comercial': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como usar minha comunicação para gerar renda extra de forma simples.',
    botaoTexto: 'Quero Conhecer Essa Oportunidade'
  },
  'perderam-emprego-transicao': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre essa oportunidade acessível para recomeçar e gerar renda.',
    botaoTexto: 'Quero Ver Como Funciona'
  },
  'transformar-consumo-renda': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como transformar meu consumo em economia, cashback e renda extra.',
    botaoTexto: 'Quero Ver Como Funciona'
  },
  'jovens-empreendedores': {
    mensagem: 'Olá! Acabei de fazer a avaliação e queria saber mais sobre como começar cedo nesse negócio digital simples e moderno.',
    botaoTexto: 'Quero Começar Cedo'
  },
  
  // ============================================
  // FLUXOS DE VENDAS (CLIENTES)
  // ============================================
  
  'energia-matinal': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de energia matinal e queria saber mais sobre como começar o dia com mais disposição e foco.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'energia-tarde': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de energia da tarde e queria saber mais sobre como evitar a queda de energia no meio do dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'troca-cafe': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico sobre troca inteligente do café e queria saber mais sobre alternativas mais funcionais e estáveis.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'anti-cansaco': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de anti-cansaço e queria saber mais sobre como ter mais energia ao longo do dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'rotina-puxada': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de rotina puxada e queria saber mais sobre como manter energia e foco durante toda a jornada.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'foco-concentracao': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de foco e concentração e queria saber mais sobre como melhorar minha produtividade e clareza mental.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'motoristas': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico para motoristas e queria saber mais sobre como manter energia estável durante longas horas dirigindo.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'metabolismo-lento': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de metabolismo lento e queria saber mais sobre como acelerar meu metabolismo e reduzir o inchaço.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'barriga-pesada': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de barriga pesada e queria saber mais sobre como me sentir mais leve ao longo do dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'retencao-inchaço': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de retenção e inchaço e queria saber mais sobre como reduzir a retenção de líquidos e me sentir mais leve.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'desconforto-pos-refeicao': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de desconforto pós-refeição e queria saber mais sobre como me sentir mais leve após as refeições.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'inchaço-manha': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de inchaço matinal e queria saber mais sobre como acordar mais leve e disposto(a).',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'ansiedade-doce': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de ansiedade por doce e queria saber mais sobre como ter mais controle e estabilidade ao longo do dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'mente-cansada': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de mente cansada e queria saber mais sobre como ter mais clareza mental e produtividade.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'falta-disposicao-treinar': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de falta de disposição para treinar e queria saber mais sobre como ter mais energia para atividades físicas.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'trabalho-noturno': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico para trabalho noturno e queria saber mais sobre como manter energia estável durante a madrugada.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'rotina-estressante': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de rotina estressante e queria saber mais sobre como ter mais energia e estabilidade para lidar com o dia a dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'maes-ocupadas': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico para mães ocupadas e queria saber mais sobre como ter mais energia e leveza para minha rotina intensa.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'fim-tarde-sem-energia': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de fim de tarde sem energia e queria saber mais sobre como manter disposição até o final do dia.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  'sedentarismo': {
    mensagem: 'Olá! Acabei de fazer o diagnóstico de estilo de vida sedentário e queria saber mais sobre como começar a ter mais disposição e movimento.',
    botaoTexto: 'Falar Agora com o Especialista'
  },
  
  // ============================================
  // FLUXOS HYPE DRINK
  // ============================================
  
  'energia-foco': {
    mensagem: 'Olá! Acabei de descobrir meu perfil de energia e foco e queria saber mais sobre como ter mais energia estável ao longo do dia, sem os picos e quedas do café excessivo.',
    botaoTexto: 'Quero Saber Mais sobre Energia'
  },
  'quiz-energia-foco': {
    mensagem: 'Olá! Acabei de descobrir meu perfil de energia e foco e queria saber mais sobre como ter mais energia estável ao longo do dia, sem os picos e quedas do café excessivo.',
    botaoTexto: 'Quero Saber Mais sobre Energia'
  },
  
  'pre-treino': {
    mensagem: 'Olá! Acabei de descobrir qual é o pré-treino ideal para mim e queria saber mais sobre uma alternativa leve e natural que não causa ansiedade ou taquicardia.',
    botaoTexto: 'Quero Conhecer o Pré-Treino Ideal'
  },
  'quiz-pre-treino': {
    mensagem: 'Olá! Acabei de descobrir qual é o pré-treino ideal para mim e queria saber mais sobre uma alternativa leve e natural que não causa ansiedade ou taquicardia.',
    botaoTexto: 'Quero Conhecer o Pré-Treino Ideal'
  },
  
  'rotina-produtiva': {
    mensagem: 'Olá! Acabei de fazer o quiz de rotina produtiva e queria saber mais sobre como manter energia e foco constantes para aumentar minha produtividade ao longo do dia.',
    botaoTexto: 'Quero Melhorar Minha Produtividade'
  },
  'quiz-rotina-produtiva': {
    mensagem: 'Olá! Acabei de fazer o quiz de rotina produtiva e queria saber mais sobre como manter energia e foco constantes para aumentar minha produtividade ao longo do dia.',
    botaoTexto: 'Quero Melhorar Minha Produtividade'
  },
  
  'constancia': {
    mensagem: 'Olá! Acabei de fazer o quiz de constância e rotina e queria saber mais sobre como facilitar meus hábitos diários e manter uma rotina mais constante.',
    botaoTexto: 'Quero Manter Minha Rotina'
  },
  'quiz-constancia': {
    mensagem: 'Olá! Acabei de fazer o quiz de constância e rotina e queria saber mais sobre como facilitar meus hábitos diários e manter uma rotina mais constante.',
    botaoTexto: 'Quero Manter Minha Rotina'
  },
  
  'consumo-cafeina': {
    mensagem: 'Olá! Acabei de calcular meu consumo de cafeína e descobri que está acima do recomendado. Queria saber mais sobre alternativas mais equilibradas que não causam ansiedade ou dependência.',
    botaoTexto: 'Quero Equilibrar Meu Consumo'
  },
  'calc-consumo-cafeina': {
    mensagem: 'Olá! Acabei de calcular meu consumo de cafeína e descobri que está acima do recomendado. Queria saber mais sobre alternativas mais equilibradas que não causam ansiedade ou dependência.',
    botaoTexto: 'Quero Equilibrar Meu Consumo'
  },
  'calculadora-consumo-cafeina': {
    mensagem: 'Olá! Acabei de calcular meu consumo de cafeína e descobri que está acima do recomendado. Queria saber mais sobre alternativas mais equilibradas que não causam ansiedade ou dependência.',
    botaoTexto: 'Quero Equilibrar Meu Consumo'
  },
  
  'custo-energia': {
    mensagem: 'Olá! Acabei de calcular quanto a falta de energia está custando para minha produtividade e queria saber mais sobre como recuperar essas horas e aumentar minha performance.',
    botaoTexto: 'Quero Aumentar Minha Produtividade'
  },
  'calc-custo-energia': {
    mensagem: 'Olá! Acabei de calcular quanto a falta de energia está custando para minha produtividade e queria saber mais sobre como recuperar essas horas e aumentar minha performance.',
    botaoTexto: 'Quero Aumentar Minha Produtividade'
  },
  'calculadora-custo-energia': {
    mensagem: 'Olá! Acabei de calcular quanto a falta de energia está custando para minha produtividade e queria saber mais sobre como recuperar essas horas e aumentar minha performance.',
    botaoTexto: 'Quero Aumentar Minha Produtividade'
  },
  
  // ============================================
  // OUTROS
  // ============================================
  
  'mini-ebook': {
    mensagem: 'Olá! Acabei de ver o mini e-book e queria saber mais sobre nutrição e bem-estar.',
    botaoTexto: 'Saiba Mais'
  },
  'wellness-profile': {
    mensagem: 'Olá! Acabei de descobrir meu perfil de bem-estar e queria saber mais sobre como otimizar minha rotina.',
    botaoTexto: 'Saiba Mais sobre Bem-Estar'
  },
}

/**
 * Obtém mensagem personalizada para uma ferramenta baseada no slug
 */
export function obterMensagemWhatsApp(slug: string | null | undefined): MensagemWhatsApp | null {
  if (!slug) return null
  
  const slugNormalizado = slug.toLowerCase().trim()
  
  // Tentar match exato primeiro
  if (mensagensWhatsAppPorFerramenta[slugNormalizado]) {
    return mensagensWhatsAppPorFerramenta[slugNormalizado]
  }
  
  // Tentar match parcial (ex: 'quiz-bem-estar' contém 'bem-estar')
  for (const [key, value] of Object.entries(mensagensWhatsAppPorFerramenta)) {
    if (slugNormalizado.includes(key) || key.includes(slugNormalizado)) {
      return value
    }
  }
  
  return null
}

/**
 * Mensagem padrão quando não há mensagem específica
 */
export const mensagemPadraoWhatsApp: MensagemWhatsApp = {
  mensagem: 'Olá! Gostaria de saber mais sobre como posso melhorar minha saúde e bem-estar.',
  botaoTexto: 'Saiba Mais'
}

