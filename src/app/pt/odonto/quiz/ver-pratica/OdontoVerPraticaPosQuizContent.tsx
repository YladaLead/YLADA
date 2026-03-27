'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { ODONTO_QUIZ_LOGIN_HREF } from '@/config/odonto-quiz-public'
import { ODONTO_DEMO_CLIENTE_NICHOS } from '@/lib/odonto-demo-cliente-data'
import {
  ODONTO_DEMO_CLIENTE_BASE_PATH,
  ODONTO_DEMO_LOCAIS,
  STORAGE_KEY_ODONTO_DEMO_LOCAL,
  STORAGE_KEY_ODONTO_DEMO_NICHO,
} from '@/lib/odonto-demo-context'

export default function OdontoVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/odonto"
      loginHref={ODONTO_QUIZ_LOGIN_HREF}
      nichos={ODONTO_DEMO_CLIENTE_NICHOS}
      locais={ODONTO_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_ODONTO_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_ODONTO_DEMO_NICHO}
      exemploClienteBasePath={ODONTO_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="odonto_quiz_ver_pratica"
      areaForPayload="odonto"
      strings={{
        headerAriaBack: 'Voltar à Odonto',
        tituloLocal: 'Onde você atende em odontologia?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o paciente responderia.',
        voltarQuiz: '← Voltar',
      }}
    />
  )
}
