'use client'

import { useEffect, useRef } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Caption, CaptionStyleConfig } from '@/types/creative-studio'

// Configurações de estilo por tipo de caption
const captionStyles: Record<string, CaptionStyleConfig> = {
  hook: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 12,
    shadow: true,
  },
  dor: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#EF4444',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 18,
    borderRadius: 10,
    shadow: true,
    highlightColor: '#FEE2E2',
  },
  solucao: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 18,
    borderRadius: 10,
    shadow: true,
    highlightColor: '#D1FAE5',
  },
  cta: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    shadow: true,
  },
  default: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
    shadow: true,
  },
}

// Função para calcular posição do texto
function getPositionStyles(position: string, canvasWidth: number, canvasHeight: number) {
  switch (position) {
    case 'center':
      return { x: canvasWidth / 2, y: canvasHeight / 2, textAlign: 'center' as const, textBaseline: 'middle' as const }
    case 'top':
      return { x: canvasWidth / 2, y: 80, textAlign: 'center' as const, textBaseline: 'top' as const }
    case 'bottom':
      return { x: canvasWidth / 2, y: canvasHeight - 80, textAlign: 'center' as const, textBaseline: 'bottom' as const }
    case 'middle-top':
      return { x: canvasWidth / 2, y: canvasHeight * 0.3, textAlign: 'center' as const, textBaseline: 'middle' as const }
    case 'middle-bottom':
      return { x: canvasWidth / 2, y: canvasHeight * 0.7, textAlign: 'center' as const, textBaseline: 'middle' as const }
    default:
      return { x: canvasWidth / 2, y: canvasHeight / 2, textAlign: 'center' as const, textBaseline: 'middle' as const }
  }
}

// Função para aplicar animação
function getAnimationProgress(animation: string, progress: number): number {
  // progress vai de 0 a 1 (início ao fim da caption)
  switch (animation) {
    case 'fade-in':
      return Math.min(1, progress * 3) // Fade rápido no início
    case 'slide-up':
      return progress
    case 'slide-down':
      return progress
    case 'zoom':
      return 0.5 + progress * 0.5 // Começa em 50% e vai até 100%
    case 'typewriter':
      return progress
    default:
      return 1
  }
}

// Função para renderizar texto com destaque de palavras
function renderTextWithHighlights(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style: CaptionStyleConfig,
  highlightWords: string[] = [],
  animationProgress: number = 1
) {
  const words = text.split(' ')
  const fontSize = style.fontSize * animationProgress
  ctx.font = `${style.fontWeight} ${fontSize}px Arial, sans-serif`
  
  // Calcular largura total do texto
  const totalWidth = words.reduce((acc, word) => {
    ctx.font = `${style.fontWeight} ${fontSize}px Arial, sans-serif`
    return acc + ctx.measureText(word + ' ').width
  }, 0)
  
  // Desenhar fundo se tiver
  if (style.backgroundColor) {
    ctx.fillStyle = style.backgroundColor
    const padding = style.padding * animationProgress
    const borderRadius = style.borderRadius * animationProgress
    const bgX = x - totalWidth / 2 - padding
    const bgY = y - fontSize / 2 - padding
    const bgWidth = totalWidth + padding * 2
    const bgHeight = fontSize + padding * 2
    
    if (borderRadius > 0) {
      ctx.beginPath()
      // Usar método compatível (roundRect pode não estar disponível em todos os browsers)
      const r = borderRadius
      ctx.moveTo(bgX + r, bgY)
      ctx.lineTo(bgX + bgWidth - r, bgY)
      ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + r)
      ctx.lineTo(bgX + bgWidth, bgY + bgHeight - r)
      ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - r, bgY + bgHeight)
      ctx.lineTo(bgX + r, bgY + bgHeight)
      ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - r)
      ctx.lineTo(bgX, bgY + r)
      ctx.quadraticCurveTo(bgX, bgY, bgX + r, bgY)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight)
    }
  }
  
  // Desenhar sombra se tiver
  if (style.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
  }
  
  // Renderizar palavras
  let currentX = x - totalWidth / 2
  words.forEach((word) => {
    const shouldHighlight = highlightWords.some((hw) => 
      word.toLowerCase().includes(hw.toLowerCase())
    )
    
    ctx.fillStyle = shouldHighlight && style.highlightColor 
      ? style.highlightColor 
      : style.color
    
    ctx.font = `${style.fontWeight} ${fontSize}px Arial, sans-serif`
    ctx.fillText(word, currentX, y)
    
    currentX += ctx.measureText(word + ' ').width
  })
  
  // Resetar sombra
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

interface VideoRendererProps {
  videoElement: HTMLVideoElement | null
  width: number
  height: number
}

export function VideoRenderer({ videoElement, width, height }: VideoRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { captions, currentTime } = useCreativeStudioStore()
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      // Limpar canvas
      ctx.clearRect(0, 0, width, height)

      // Encontrar captions ativas no tempo atual
      const activeCaptions = captions.filter(
        (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
      )

      // Renderizar cada caption ativa
      activeCaptions.forEach((caption) => {
        const style = captionStyles[caption.style] || captionStyles.default
        const position = getPositionStyles(caption.position, width, height)
        
        // Calcular progresso da animação (0 a 1)
        const captionDuration = caption.endTime - caption.startTime
        const elapsed = currentTime - caption.startTime
        const progress = Math.max(0, Math.min(1, elapsed / captionDuration))
        const animationProgress = getAnimationProgress(
          caption.animation || 'fade-in',
          progress
        )

        // Configurar contexto
        ctx.textAlign = position.textAlign
        ctx.textBaseline = position.textBaseline

        // Renderizar texto com destaques
        renderTextWithHighlights(
          ctx,
          caption.text,
          position.x,
          position.y,
          style,
          caption.highlightWords,
          animationProgress
        )
      })

      // Continuar animação
      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [captions, currentTime, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ imageRendering: 'high-quality' }}
    />
  )
}

