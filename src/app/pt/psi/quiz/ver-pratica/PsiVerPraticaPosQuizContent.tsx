'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { PSI_QUIZ_LOGIN_HREF } from '@/config/psi-quiz-public'
import { PSI_DEMO_CLIENTE_NICHOS } from '@/lib/psi-demo-cliente-data'
import {
  PSI_DEMO_CLIENTE_BASE_PATH,
  PSI_DEMO_LOCAIS,
  STORAGE_KEY_PSI_DEMO_LOCAL,
  STORAGE_KEY_PSI_DEMO_NICHO,
} from '@/lib/psi-demo-context'

export default function PsiVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/psi"
      loginHref={PSI_QUIZ_LOGIN_HREF}
      nichos={PSI_DEMO_CLIENTE_NICHOS}
      locais={PSI_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_PSI_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_PSI_DEMO_NICHO}
      exemploClienteBasePath={PSI_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="psi_quiz_ver_pratica"
      areaForPayload="psi"
      strings={{
        headerAriaBack: 'Voltar ao Psi',
        tituloLocal: 'Onde você atende?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como a pessoa responderia.',
      }}
    />
  )
}
