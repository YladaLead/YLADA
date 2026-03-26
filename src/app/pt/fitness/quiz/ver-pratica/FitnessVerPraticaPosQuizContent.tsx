'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { FITNESS_QUIZ_LOGIN_HREF } from '@/config/fitness-quiz-public'
import { FITNESS_DEMO_CLIENTE_NICHOS } from '@/lib/fitness-demo-cliente-data'
import {
  FITNESS_DEMO_CLIENTE_BASE_PATH,
  FITNESS_DEMO_LOCAIS,
  STORAGE_KEY_FITNESS_DEMO_LOCAL,
  STORAGE_KEY_FITNESS_DEMO_NICHO,
} from '@/lib/fitness-demo-context'

export default function FitnessVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/fitness"
      loginHref={FITNESS_QUIZ_LOGIN_HREF}
      nichos={FITNESS_DEMO_CLIENTE_NICHOS}
      locais={FITNESS_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_FITNESS_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_FITNESS_DEMO_NICHO}
      exemploClienteBasePath={FITNESS_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="fitness_quiz_ver_pratica"
      areaForPayload="fitness"
      strings={{
        headerAriaBack: 'Voltar ao Fitness',
        tituloLocal: 'Onde você atende ou vende?',
        textoLocalComNicho:
          'Escolha o canal principal. Em seguida você vê o fluxo como seu aluno, já no foco que você escolheu antes.',
        textoLocalSemNicho: 'Escolha o canal principal. Na próxima tela você define o nicho do exemplo.',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o cliente responderia.',
        voltarQuiz: '← Voltar ao quiz',
      }}
    />
  )
}
