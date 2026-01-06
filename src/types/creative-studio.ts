// Types for Creative Studio - Editor de Vídeo

export interface ScriptSegment {
  id: string
  text: string
  duration: number
  timestamp: number
  type: 'intro' | 'content' | 'outro' | 'transition'
}

export interface VideoClip {
  id: string
  startTime: number
  endTime: number
  source: string
  type: 'video' | 'image' | 'text' | 'audio'
  effects?: string[]
  speed?: number
  rotation?: number
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
  colorAdjustments?: {
    brightness: number
    contrast: number
    saturation: number
  }
}

export interface AudioClip {
  id: string
  startTime: number
  endTime: number
  source: string // URL ou data URL do áudio
  text: string // Texto que foi narrado
  voice: string // Voz usada (alloy, echo, etc)
  duration: number // Duração em segundos
  volume?: number // Volume (0-1)
}

// Sistema de Legendas/Captions
export interface Caption {
  id: string
  text: string
  startTime: number
  endTime: number
  style: CaptionStyle
  position: CaptionPosition
  animation?: CaptionAnimation
  highlightWords?: string[] // Palavras para destacar
}

export type CaptionStyle = 'hook' | 'dor' | 'solucao' | 'cta' | 'default'
export type CaptionPosition = 'center' | 'top' | 'bottom' | 'middle-top' | 'middle-bottom'
export type CaptionAnimation = 'fade-in' | 'slide-up' | 'slide-down' | 'zoom' | 'typewriter' | 'none'

export interface CaptionStyleConfig {
  fontSize: number
  fontWeight: string
  color: string
  backgroundColor?: string
  padding: number
  borderRadius: number
  shadow?: boolean
  highlightColor?: string
}

export interface Project {
  id: string
  name: string
  script: ScriptSegment[]
  clips: VideoClip[]
  area: 'nutri' | 'wellness' | 'coach'
  createdAt: Date
  updatedAt: Date
}


