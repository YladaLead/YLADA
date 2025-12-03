# 💬 Exemplo de Integração no Chat de Suporte

## Como Integrar o Sistema de Orientação no Chat

### **1. No Componente de Chat:**

```typescript
// src/components/wellness/WellnessSupportChat.tsx

import { useState } from 'react'
import OrientacaoTecnica from './OrientacaoTecnica'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

export default function WellnessSupportChat() {
  const [mensagens, setMensagens] = useState([])
  const [mostrarOrientacao, setMostrarOrientacao] = useState(false)
  const [orientacao, setOrientacao] = useState(null)
  const authenticatedFetch = useAuthenticatedFetch()

  const enviarMensagem = async (texto: string) => {
    // 1. PRIMEIRO: Tentar buscar orientação técnica
    const responseOrientacao = await authenticatedFetch(
      `/api/wellness/orientation?pergunta=${encodeURIComponent(texto)}`
    )
    
    const dataOrientacao = await responseOrientacao.json()
    
    if (dataOrientacao.tipo === 'tecnica' && dataOrientacao.item) {
      // Encontrou orientação técnica!
      setOrientacao(dataOrientacao)
      setMostrarOrientacao(true)
      return
    }
    
    // 2. SEGUNDO: Se não encontrou, usar OpenAI
    const responseIA = await authenticatedFetch('/api/wellness/support/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: texto })
    })
    
    const dataIA = await responseIA.json()
    // Adicionar resposta da IA ao chat
  }

  return (
    <div>
      {/* Chat normal */}
      
      {/* Mostrar orientação técnica quando encontrada */}
      {mostrarOrientacao && orientacao?.item && (
        <OrientacaoTecnica
          item={orientacao.item}
          mentor={orientacao.mentor}
          sugestaoMentor={orientacao.sugestaoMentor}
        />
      )}
    </div>
  )
}
```

### **2. Na API de Chat de Suporte:**

```typescript
// src/app/api/wellness/support/chat/route.ts

export async function POST(request: NextRequest) {
  const { mensagem } = await request.json()
  
  // 1. PRIMEIRO: Tentar orientação técnica
  const orientacao = await buscarOrientacaoTecnica(mensagem)
  
  if (orientacao) {
    return NextResponse.json({
      tipo: 'tecnica',
      orientacao
    })
  }
  
  // 2. SEGUNDO: Usar OpenAI para dúvidas conceituais
  const respostaIA = await gerarRespostaComIA(mensagem)
  
  return NextResponse.json({
    tipo: 'conceitual',
    resposta: respostaIA
  })
}
```

---

## ✅ Pronto para Usar!

O sistema está funcional e pode ser integrado no chat de suporte quando você criar o componente.

