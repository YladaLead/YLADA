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
        textoLocalComNicho:
          'Escolha o canal principal. Na sequência você vê o fluxo como seu comprador, no cenário que você já escolheu no quiz.',
        textoLocalSemNicho:
          'Escolha o canal principal. Depois o tipo de exemplo (muitas opções, marca própria, serviço ou digital).',
        tituloNicho: 'Qual cenário no exemplo?',
        textoNicho: 'Demonstração genérica — vale para vários tipos de venda.',
        voltarQuiz: '← Voltar ao quiz',
      }}
    />
  )
}
