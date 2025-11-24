const fs = require('fs')
const path = require('path')

// Mapeamento das novas AÇÕES IMEDIATAS baseado nas imagens
const novasAcoesImediatas = {
  // Diagnóstico de Eletrólitos
  'diagnostico-eletrolitos': {
    'equilibrioBom': 'Mantenha hidratação adequada e alimentação natural.\nContinue observando como o corpo responde.',
    'necessidadeModerada': 'Aumente atenção à hidratação e aos minerais da dieta.\nPequenos ajustes com orientação profissional podem equilibrar eletrólitos.',
    'altaNecessidade': 'Evite suplementação por conta própria.\nProcure avaliação profissional antes de fazer qualquer ajuste.'
  },

  // Perfil Metabólico
  'perfil-metabolico': {
    'metabolismoLento': 'Observe seu padrão alimentar e períodos de jejum.\nAvaliação profissional ajuda a definir ajustes seguros.',
    'metabolismoEquilibrado': 'Mantenha rotina e atenção à hidratação e hábitos de fibra.\nPequenos ajustes com orientação profissional podem otimizar o metabolismo.',
    'metabolismoAcelerado': 'Continue mantendo hábitos regulares de alimentação.\nObserve como seu corpo responde ao longo do dia.'
  },

  // Diagnóstico de Sintomas Intestinais
  'diagnostico-sintomas-intestinais': {
    'equilibrioIntestinal': 'Mantenha hidratação e hábitos consistentes.\nObserve como seu intestino responde no dia a dia.',
    'desequilibrioModerado': 'Reflita sobre rotina alimentar e hábitos de hidratação.\nPequenos ajustes guiados por profissional podem melhorar a digestão.',
    'disfuncaoIntestinal': 'Observe seus sintomas e evite mudanças drásticas sozinho.\nProcure avaliação profissional para definir conduta e exames.'
  },

  // Avaliação do Sono e Energia
  'avaliacao-sono-energia': {
    'sonoRestaurador': 'Mantenha higiene do sono e horários consistentes.\nObserve como seu corpo responde ao descanso diário.',
    'sonoLevementePrejudicado': 'Reduza estímulos noturnos, como cafeína e telas.\nPequenos ajustes de rotina podem melhorar qualidade do sono.',
    'sonoComprometido': 'Evite mudanças drásticas sozinho.\nBusque avaliação profissional para ajustar sono e rotina de forma segura.'
  },

  // Retenção de Líquidos
  'retencao-liquidos': {
    'baixaRetencao': 'Mantenha hidratação adequada e rotina ativa.\nObserve como o corpo responde ao longo dos dias.',
    'retencaoModerada': 'Reflita sobre consumo de sal e alimentos industrializados.\nPequenos ajustes com orientação podem ajudar no equilíbrio hídrico.',
    'retencaoElevada': 'Procure avaliação profissional para identificar causas e estratégias seguras.\nEvite soluções drásticas ou restrições sem acompanhamento.'
  },

  // Fome Emocional
  'tipo-fome': {
    'relacaoSaudavel': 'Mantenha atenção plena nas refeições e nas sensações de fome e saciedade.\nContinue cultivando consciência alimentar.',
    'tendenciaFomeEmocional': 'Observe gatilhos emocionais e pratique alimentação consciente.\nPequenos ajustes guiados por profissional podem fortalecer o controle alimentar.',
    'fomeEmocionalAcentuada': 'Busque apoio nutricional e emocional para compreender os gatilhos.\nEstratégias integradas ajudam a restaurar equilíbrio e bem-estar.'
  },

  // Tipo de Metabolismo
  'perfil-metabolico': {
    'metabolismoAcelerado': 'Mantenha alimentação regular e observe sinais de energia ao longo do dia.\nAvaliações periódicas ajudam a equilibrar o ritmo metabólico.',
    'metabolismoEquilibrado': 'Preserve seus hábitos atuais e mantenha constância nas rotinas.\nPequenos ajustes com orientação profissional podem potencializar resultados.',
    'metabolismoLento': 'Observe seu padrão alimentar e nível de atividade.\nBusque avaliação profissional para identificar ajustes seguros e eficazes.'
  },

  // Disciplinado ou Emocional
  'disciplinado-emocional': {
    'perfilDisciplinado': 'Mantenha equilíbrio e flexibilidade nas escolhas alimentares.\nEvite rigidez excessiva para preservar bem-estar e prazer à mesa.',
    'perfilIntermediario': 'Busque constância na rotina alimentar.\nAcompanhamento profissional pode ajudar a fortalecer o equilíbrio.',
    'perfilEmocional': 'Observe seus gatilhos emocionais ligados à comida.\nApoio nutricional e emocional pode ajudar a restaurar o controle e a leveza.'
  },

  // Nutrido vs Alimentado
  'nutrido-vs-alimentado': {
    'bemNutrido': 'Mantenha variedade e equilíbrio nas escolhas alimentares.\nContinue observando sinais de energia e bem-estar.',
    'alimentadoCarencias': 'Reflita sobre a qualidade dos alimentos do dia a dia.\nPequenos ajustes com orientação profissional podem aumentar vitalidade e disposição.',
    'subnutridoCelularmente': 'Busque avaliação profissional para identificar e corrigir deficiências nutricionais.\nEvite suplementação sem orientação adequada.'
  },

  // Corpo Pedindo Detox
  'quiz-pedindo-detox': {
    'corpoEquilibrado': 'Mantenha sua rotina equilibrada e hábitos preventivos.\nObserve sinais do corpo e continue com constância.',
    'sinaisLevesToxinas': 'Observe sinais de retenção ou cansaço leve.\nPequenos ajustes guiados por profissional podem apoiar detox de forma segura.',
    'corpoPedindoDetox': 'Busque avaliação profissional antes de iniciar qualquer protocolo detox.\nEstratégias individualizadas garantem segurança e eficácia.'
  },

  // Alimentação conforme Rotina
  'alimentacao-rotina': {
    'alimentacaoAlinhada': 'Mantenha variedade e timing adequado nas refeições.\nContinue observando sinais de energia e bem-estar.',
    'desajusteLeve': 'Organize horários e planeje lanches saudáveis.\nPequenos ajustes guiados por profissional podem melhorar a rotina alimentar.',
    'rotinaCaotica': 'Busque avaliação profissional para iniciar reeducação alimentar segura.\nEvite mudanças drásticas sem orientação.'
  },

  // Checklist Detox
  'checklist-detox': {
    'baixaToxicidade': 'Mantenha seus hábitos equilibrados e observe como o corpo responde.\nAvaliações periódicas ajudam a sustentar bons resultados.',
    'toxicidadeModerada': 'Observe sinais como cansaço ou inchaço e evite protocolos por conta própria.\nBusque orientação profissional para um detox seguro e adequado ao seu perfil.',
    'altaToxicidade': 'Redobre o cuidado com alimentação e rotina.\nProcure avaliação profissional para um plano seguro e individualizado.'
  },

  // Checklist Alimentar
  'checklist-alimentar': {
    'alimentacaoDeficiente': 'Observe seus hábitos alimentares e evite mudanças drásticas por conta própria.\nBusque avaliação profissional para corrigir deficiências de forma segura.',
    'alimentacaoModerada': 'Reflita sobre sua rotina alimentar e identifique pequenas melhorias.\nAjustes guiados por um profissional podem maximizar resultados.',
    'alimentacaoEquilibrada': 'Mantenha seus bons hábitos e atenção ao corpo.\nAvaliações periódicas ajudam a potencializar a saúde a longo prazo.'
  },

  // Diagnóstico de Parasitose
  'diagnostico-parasitose': {
    'riscoBaixo': 'Mantenha cuidados com higiene de alimentos e água.\nObserve possíveis sintomas nos próximos dias.',
    'riscoModerado': 'Reforce hábitos de higiene alimentar.\nBusque avaliação profissional para triagem e orientação.',
    'riscoAlto': 'Procure avaliação profissional imediatamente.\nExames específicos podem ser necessários para diagnóstico seguro.'
  },

  // Calculadora de Proteína
  'calculadora-proteina': {
    'baixaProteina': 'Observe seu consumo diário de proteínas.\nBusque avaliação profissional para distribuir proteína de forma segura ao longo do dia.',
    'proteinaNormal': 'Mantenha seus hábitos atuais e observe como seu corpo responde.\nPequenos ajustes com orientação profissional podem melhorar a distribuição de proteína.',
    'altaProteina': 'Mantenha seu consumo equilibrado e atenção à variedade nutricional.\nAvaliações periódicas ajudam a otimizar a ingestão sem desequilíbrios.'
  },

  // Calculadora de Água
  'calculadora-agua': {
    'baixaHidratacao': 'Observe seu padrão de hidratação ao longo do dia.\nBusque avaliação profissional para ajustar o consumo conforme suas necessidades.',
    'hidratacaoModerada': 'Mantenha seu consumo atual e observe como o corpo reage.\nPequenos ajustes com orientação profissional podem otimizar sua hidratação.',
    'altaHidratacao': 'Continue mantendo hábitos de hidratação consistentes.\nAvaliações periódicas ajudam a identificar necessidades específicas de reposição.'
  },

  // Calculadora de Calorias
  'calculadora-calorias': {
    'deficitCalorico': 'Observe seu consumo diário e evite mudanças bruscas.\nBusque avaliação profissional para ajustar calorias de forma segura e preservar massa muscular.',
    'manutencaoCalorica': 'Mantenha seus hábitos atuais e observe como o corpo responde.\nPequenos ajustes com orientação podem otimizar a qualidade da dieta.',
    'superavitCalorico': 'Acompanhe seu consumo de forma equilibrada e consistente.\nAvaliações periódicas ajudam a ganhar massa de forma saudável e segura.'
  },

  // Perfil de Intestino
  'perfil-intestino': {
    'equilibrado': 'Mantenha sua rotina atual de alimentação e hidratação.\nContinue observando o ritmo intestinal e sinais do corpo.',
    'intestinoPresoSensivel': 'Observe relação entre alimentação, estresse e funcionamento intestinal.\nPequenos ajustes com orientação profissional podem melhorar o equilíbrio.',
    'disbioseIntestinal': 'Busque avaliação profissional para identificar causas e restaurar o equilíbrio da microbiota.\nEvite protocolos ou suplementações sem acompanhamento.'
  },

  // Avaliação de Intolerâncias
  'avaliacao-intolerancia': {
    'baixoRisco': 'Mantenha variedade alimentar e boa hidratação.\nObserve reações do corpo a novos alimentos.',
    'sensibilidadeLeveModerada': 'Registre sintomas e padrões após as refeições.\nUm acompanhamento profissional pode ajudar a identificar gatilhos.',
    'altaProbabilidadeIntolerancia': 'Busque avaliação nutricional para definir possíveis testes e ajustes alimentares.\nEvite excluir grupos de alimentos sem orientação.'
  },

  // Risco de Síndrome Metabólica
  'sindrome-metabolica': {
    'baixoRisco': 'Mantenha sua rotina saudável e hábitos equilibrados.\nContinue com acompanhamento periódico.',
    'riscoModerado': 'Reflita sobre alimentação e nível de atividade física.\nAjustes guiados por um profissional podem evitar progressão do risco.',
    'riscoElevado': 'Procure avaliação profissional o quanto antes.\nUm plano individualizado é essencial para restaurar o equilíbrio metabólico.'
  },

  // Pronto para Emagrecer
  'pronto-emagrecer': {
    'prontoParaComecar': 'Inicie mudanças graduais e saudáveis na alimentação.\nObserve como seu corpo responde às novas rotinas.',
    'quasePronto': 'Prepare sua rotina e organize hábitos com acompanhamento profissional.\nPequenos ajustes prévios facilitam a adesão ao plano de emagrecimento.',
    'precisaOrientacao': 'Busque reeducação alimentar com suporte profissional.\nEstratégias personalizadas garantem motivação e resultados sustentáveis.'
  },

  // Autoconhecimento Corporal
  'conhece-seu-corpo': {
    'altoAutoconhecimento': 'Continue cultivando consciência corporal e hábitos equilibrados.\nAcompanhamento profissional pode ajudar a aprofundar esse processo.',
    'conscienciaParcial': 'Observe sinais do corpo e busque clareza sobre suas necessidades.\nUm olhar nutricional guiado pode ampliar seu autoconhecimento.',
    'desconexaoCorporal': 'Busque reconexão corporal com suporte profissional.\nEntender os sinais do corpo é o primeiro passo para retomar o equilíbrio.'
  },

  // Quiz Detox
  'quiz-detox': {
    'baixaToxicidade': 'Mantenha seus hábitos equilibrados e atenção ao corpo.\nAvaliações periódicas ajudam a sustentar bons resultados.',
    'toxicidadeModerada': 'Observe sinais de cansaço ou inchaço e evite protocolos por conta própria.\nBusque orientação profissional para um detox adequado ao seu perfil.',
    'altaToxicidade': 'Redobre o cuidado com alimentação e rotina.\nProcure avaliação profissional para um plano seguro e individualizado.'
  },

  // Quiz Energético
  'quiz-energetico': {
    'energiaBaixa': 'Observe sua disposição ao longo do dia e evite auto suplementação.\nProcure avaliação profissional para identificar possíveis carências.',
    'energiaModerada': 'Observe como sono e rotina influenciam sua energia.\nPequenos ajustes com orientação podem otimizar seu rendimento diário.',
    'energiaAlta': 'Mantenha seus hábitos equilibrados e atenção ao descanso.\nAvaliações preventivas ajudam a manter sua vitalidade.'
  },

  // Calculadora IMC
  'calculadora-imc': {
    'baixoPeso': 'Evite aumento de calorias sem orientação.\nBusque equilíbrio entre alimentação e rotina para ganho saudável.',
    'pesoNormal': 'Mantenha seus hábitos equilibrados e ativos.\nAvaliações periódicas ajudam a preservar esse resultado.',
    'sobrepeso': 'Observe seus hábitos e ritmo de vida.\nBusque avaliação profissional para um ajuste gradual e seguro.',
    'obesidade': 'Procure acompanhamento profissional para um plano personalizado.\nEvite dietas restritivas ou soluções rápidas — cada corpo tem seu ritmo.'
  },

  // Quiz Interativo
  'quiz-interativo': {
    'metabolismoEquilibrado': 'Mantenha seus hábitos e observe como o corpo responde.\nPequenos ajustes com orientação profissional podem potencializar seus resultados.',
    'metabolismoLento': 'Observe seu nível de energia e ritmo diário.\nEvite auto-suplementação e busque avaliação para definir ajustes seguros.',
    'metabolismoAcelerado': 'Observe sinais de cansaço ou fome frequente.\nBusque orientação profissional para equilibrar energia e rotina alimentar.'
  },

  // Quiz de Bem-Estar
  'quiz-bem-estar': {
    'bemEstarBaixo': 'Observe seus níveis de energia, sono e disposição.\nBusque avaliação profissional para identificar e corrigir possíveis desequilíbrios.',
    'bemEstarModerado': 'Reflita sobre sua rotina e como ela afeta seu bem-estar.\nPequenos ajustes com orientação profissional podem gerar grande diferença.',
    'bemEstarAlto': 'Mantenha sua rotina equilibrada e o cuidado com o corpo.\nAvaliações periódicas ajudam a sustentar resultados a longo prazo.'
  },

  // Quiz de Perfil Nutricional
  'quiz-perfil-nutricional': {
    'absorcaoBaixa': 'Observe sinais como cansaço ou digestão lenta.\nBusque avaliação profissional para entender e corrigir possíveis falhas de absorção.',
    'absorcaoModerada': 'Reflita sobre sua rotina alimentar e digestiva.\nPequenos ajustes com orientação profissional podem otimizar sua absorção.',
    'absorcaoOtimizada': 'Mantenha seus hábitos e atenção ao corpo.\nAvaliações regulares ajudam a preservar o bom desempenho nutricional.'
  }
}

const nutriDiagnosticsDir = path.join(__dirname, '../src/lib/diagnostics/nutri')

console.log('🔄 Iniciando atualização das AÇÕES IMEDIATAS dos diagnósticos Nutri...\n')

// Função para atualizar um arquivo específico
function atualizarArquivo(nomeArquivo, mapeamento) {
  const filePath = path.join(nutriDiagnosticsDir, nomeArquivo)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${nomeArquivo}`)
    return false
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let mudancas = 0

  // Para cada resultado no mapeamento
  Object.keys(mapeamento).forEach(resultadoId => {
    const novaAcao = mapeamento[resultadoId]
    
    // Regex para encontrar e substituir a acaoImediata específica
    const regex = new RegExp(
      `(${resultadoId}:\\s*{[^}]*acaoImediata:\\s*')([^']*)(')`,
      'gs'
    )
    
    const novoContent = content.replace(regex, (match, antes, acaoAtual, depois) => {
      if (acaoAtual !== novaAcao) {
        mudancas++
        return `${antes}${novaAcao}${depois}`
      }
      return match
    })
    
    content = novoContent
  })

  if (mudancas > 0) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ ${nomeArquivo}: ${mudancas} ações atualizadas`)
    return true
  } else {
    console.log(`- ${nomeArquivo}: Nenhuma alteração necessária`)
    return false
  }
}

// Executar atualizações
let totalArquivos = 0
let arquivosAlterados = 0

Object.keys(novasAcoesImediatas).forEach(chave => {
  const mapeamento = novasAcoesImediatas[chave]
  
  // Mapear chave para nome do arquivo
  const nomeArquivo = `${chave}.ts`
  
  totalArquivos++
  if (atualizarArquivo(nomeArquivo, mapeamento)) {
    arquivosAlterados++
  }
})

console.log(`\n📊 Resumo:`)
console.log(`- Total de arquivos processados: ${totalArquivos}`)
console.log(`- Arquivos alterados: ${arquivosAlterados}`)
console.log(`\n✅ Atualização das AÇÕES IMEDIATAS concluída!`)
