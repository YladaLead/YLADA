'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { JOIAS_LINHA_QUERY_KEY, isValidJoiasLinhaProduto } from '@/config/joias-linha-produto'
import { JOIAS_QUIZ_LOGIN_HREF } from '@/config/joias-quiz-public'
import { JOIAS_DEMO_CLIENTE_NICHOS } from '@/lib/joias-demo-cliente-data'
import {
  JOIAS_DEMO_CLIENTE_BASE_PATH,
  JOIAS_DEMO_LOCAIS,
  STORAGE_KEY_JOIAS_DEMO_LOCAL,
  STORAGE_KEY_JOIAS_DEMO_NICHO,
} from '@/lib/joias-demo-context'

export default function JoiasVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/joias"
      loginHref={JOIAS_QUIZ_LOGIN_HREF}
      nichos={JOIAS_DEMO_CLIENTE_NICHOS}
      locais={JOIAS_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_JOIAS_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_JOIAS_DEMO_NICHO}
      exemploClienteBasePath={JOIAS_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="joias_quiz_ver_pratica"
      areaForPayload="joias"
      strings={{
        headerAriaBack: 'Voltar a Joias e bijuterias',
        tituloLocal: 'Onde você atende ou vende?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual foco do exemplo?',
        textoNicho: 'Fluxo curto só para demonstração. Depois você vê como a pessoa responderia.',
      }}
      linhaQueryKey={JOIAS_LINHA_QUERY_KEY}
      isValidLinha={isValidJoiasLinhaProduto}
    />
  )
}
