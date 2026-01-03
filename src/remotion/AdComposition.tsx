import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { VideoClip } from '@/types/creative-studio'

interface AdCompositionProps {
  clips: VideoClip[]
  script: {
    hook: string
    problem: string
    solution: string
    cta: string
  } | null
}

export const AdComposition: React.FC<AdCompositionProps> = ({ clips, script }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Encontrar clip atual baseado no frame
  const currentClip = clips.find(
    (clip) => frame >= clip.startTime * fps && frame <= clip.endTime * fps
  )

  // Encontrar texto atual baseado no script
  const getCurrentText = () => {
    if (!script) return ''
    const seconds = frame / fps
    
    if (seconds < 5) return script.hook
    if (seconds < 15) return script.problem
    if (seconds < 25) return script.solution
    return script.cta
  }

  const currentText = getCurrentText()
  const textOpacity = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 200 },
  })

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Imagem de fundo */}
      {currentClip && currentClip.type === 'image' && (
        <img
          src={currentClip.source}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Texto sobreposto */}
      {currentText && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            padding: '0 40px',
            opacity: textOpacity,
            transform: `translateY(${interpolate(textOpacity, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '20px 30px',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#fff',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {currentText}
            </p>
          </div>
        </div>
      )}

      {/* Overlay escuro para legibilidade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}

