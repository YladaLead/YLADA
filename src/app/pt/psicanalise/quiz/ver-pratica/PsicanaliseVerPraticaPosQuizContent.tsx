'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { PSICANALISE_QUIZ_LOGIN_HREF } from '@/config/psicanalise-quiz-public'
import { PSICANALISE_DEMO_CLIENTE_NICHOS } from '@/lib/psicanalise-demo-cliente-data'
import {
  PSICANALISE_DEMO_CLIENTE_BASE_PATH,
  PSICANALISE_DEMO_LOCAIS,
  STORAGE_KEY_PSICANALISE_DEMO_LOCAL,
  STORAGE_KEY_PSICANALISE_DEMO_NICHO,
} from '@/lib/psicanalise-demo-context'

export default function PsicanaliseVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/psicanalise"
      loginHref={PSICANALISE_QUIZ_LOGIN_HREF}
      nichos={PSICANALISE_DEMO_CLIENTE_NICHOS}
      locais={PSICANALISE_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_PSICANALISE_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_PSICANALISE_DEMO_NICHO}
      exemploClienteBasePath={PSICANALISE_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="psicanalise_quiz_ver_pratica"
      areaForPayload="psicanalise"
      strings={{
        headerAriaBack: 'Voltar à Psicanálise',
        tituloLocal: 'Onde você atende?',
        textoLocalComNicho:
          'Escolha o canal principal. Em seguida você vê o fluxo como sua pessoa, já no foco que você escolheu antes.',
        textoLocalSemNicho: 'Escolha o canal principal. Na próxima tela você define o nicho do exemplo.',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o cliente responderia.',
        voltarQuiz: '← Voltar ao quiz',
      }}
    />
  )
}
