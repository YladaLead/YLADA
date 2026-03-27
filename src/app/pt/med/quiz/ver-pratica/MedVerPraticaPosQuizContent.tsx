'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { MED_QUIZ_LOGIN_HREF } from '@/config/med-quiz-public'
import { MED_DEMO_CLIENTE_NICHOS } from '@/lib/med-demo-cliente-data'
import {
  MED_DEMO_CLIENTE_BASE_PATH,
  MED_DEMO_LOCAIS,
  STORAGE_KEY_MED_DEMO_LOCAL,
  STORAGE_KEY_MED_DEMO_NICHO,
} from '@/lib/med-demo-context'

export default function MedVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/med"
      loginHref={MED_QUIZ_LOGIN_HREF}
      nichos={MED_DEMO_CLIENTE_NICHOS}
      locais={MED_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_MED_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_MED_DEMO_NICHO}
      exemploClienteBasePath={MED_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="med_quiz_ver_pratica"
      areaForPayload="med"
      strings={{
        headerAriaBack: 'Voltar ao Med',
        tituloLocal: 'Onde você atende?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o paciente responderia.',
        voltarQuiz: '← Voltar',
      }}
    />
  )
}
