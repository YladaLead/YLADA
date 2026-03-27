'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { PERFUMARIA_QUIZ_LOGIN_HREF } from '@/config/perfumaria-quiz-public'
import { PERFUMARIA_DEMO_CLIENTE_NICHOS } from '@/lib/perfumaria-demo-cliente-data'
import {
  PERFUMARIA_DEMO_CLIENTE_BASE_PATH,
  PERFUMARIA_DEMO_LOCAIS,
  STORAGE_KEY_PERFUMARIA_DEMO_LOCAL,
  STORAGE_KEY_PERFUMARIA_DEMO_NICHO,
} from '@/lib/perfumaria-demo-context'

export default function PerfumariaVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/perfumaria"
      loginHref={PERFUMARIA_QUIZ_LOGIN_HREF}
      nichos={PERFUMARIA_DEMO_CLIENTE_NICHOS}
      locais={PERFUMARIA_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_PERFUMARIA_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_PERFUMARIA_DEMO_NICHO}
      exemploClienteBasePath={PERFUMARIA_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="perfumaria_quiz_ver_pratica"
      areaForPayload="perfumaria"
      strings={{
        headerAriaBack: 'Voltar à Perfumaria',
        tituloLocal: 'Onde você vende?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como o cliente responderia.',
      }}
    />
  )
}
