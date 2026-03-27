'use client'

import MatrixVerPraticaAfterQuizContent from '@/components/ylada/MatrixVerPraticaAfterQuizContent'
import { SELLER_QUIZ_LOGIN_HREF } from '@/config/seller-quiz-public'
import { SELLER_DEMO_CLIENTE_NICHOS } from '@/lib/seller-demo-cliente-data'
import {
  SELLER_DEMO_CLIENTE_BASE_PATH,
  SELLER_DEMO_LOCAIS,
  STORAGE_KEY_SELLER_DEMO_LOCAL,
  STORAGE_KEY_SELLER_DEMO_NICHO,
} from '@/lib/seller-demo-context'

export default function SellerVerPraticaPosQuizContent() {
  return (
    <MatrixVerPraticaAfterQuizContent
      pathPrefix="/pt/seller"
      loginHref={SELLER_QUIZ_LOGIN_HREF}
      nichos={SELLER_DEMO_CLIENTE_NICHOS}
      locais={SELLER_DEMO_LOCAIS}
      storageLocalKey={STORAGE_KEY_SELLER_DEMO_LOCAL}
      storageNichoKey={STORAGE_KEY_SELLER_DEMO_NICHO}
      exemploClienteBasePath={SELLER_DEMO_CLIENTE_BASE_PATH}
      analyticsVerPratica="seller_quiz_ver_pratica"
      areaForPayload="seller"
      strings={{
        headerAriaBack: 'Voltar aos Vendedores',
        tituloLocal: 'Onde você mais fala com cliente ou fecha venda?',
        textoLocalComNicho: '',
        textoLocalSemNicho: '',
        tituloNicho: 'Qual cenário no exemplo?',
        textoNicho: 'Demonstração genérica. Vale para vários tipos de venda.',
      }}
    />
  )
}
