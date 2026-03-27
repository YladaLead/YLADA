'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { COACH_QUIZ_LOGIN_HREF } from '@/config/coach-quiz-public'
import { COACH_DEMO_CLIENTE_NICHOS } from '@/lib/coach-demo-cliente-data'
import {
  COACH_DEMO_CLIENTE_BASE_PATH,
  COACH_DEMO_LOCAIS,
  STORAGE_KEY_COACH_DEMO_LOCAL,
  STORAGE_KEY_COACH_DEMO_NICHO,
} from '@/lib/coach-demo-context'

export default function CoachVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/coach"
      loginHref={COACH_QUIZ_LOGIN_HREF}
      nichos={COACH_DEMO_CLIENTE_NICHOS}
      locais={COACH_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_COACH_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_COACH_DEMO_NICHO}
      exemploClienteBasePath={COACH_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="coach_quiz_ver_pratica"
      areaForPayload="coach"
      strings={{
        headerAriaBack: 'Voltar ao Coach',
        tituloLocal: 'Onde você atende?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como a pessoa responderia.',
        voltarQuiz: '← Voltar',
      }}
    />
  )
}
