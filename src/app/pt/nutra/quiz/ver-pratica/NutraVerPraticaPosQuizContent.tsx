'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { NUTRA_QUIZ_LOGIN_HREF } from '@/config/nutra-quiz-public'
import { NUTRA_DEMO_CLIENTE_NICHOS } from '@/lib/nutra-demo-cliente-data'
import {
  NUTRA_DEMO_CLIENTE_BASE_PATH,
  NUTRA_DEMO_LOCAIS,
  STORAGE_KEY_NUTRA_DEMO_LOCAL,
  STORAGE_KEY_NUTRA_DEMO_NICHO,
} from '@/lib/nutra-demo-context'

export default function NutraVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/nutra"
      loginHref={NUTRA_QUIZ_LOGIN_HREF}
      nichos={NUTRA_DEMO_CLIENTE_NICHOS}
      locais={NUTRA_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_NUTRA_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_NUTRA_DEMO_NICHO}
      exemploClienteBasePath={NUTRA_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="nutra_quiz_ver_pratica"
      areaForPayload="nutra"
      strings={{
        headerAriaBack: 'Voltar à Nutra',
        tituloLocal: 'Onde você vende ou indica?',
        textoLocalComNicho:
          'Escolha o canal principal. Em seguida você vê o fluxo como seu cliente, já no foco que você escolheu antes.',
        textoLocalSemNicho: 'Escolha o canal principal. Na próxima tela você define o nicho do exemplo.',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o cliente responderia.',
        voltarQuiz: '← Voltar ao quiz',
      }}
    />
  )
}
