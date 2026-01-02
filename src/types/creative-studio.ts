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
  type: 'video' | 'image' | 'text'
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

export interface Project {
  id: string
  name: string
  script: ScriptSegment[]
  clips: VideoClip[]
  area: 'nutri' | 'wellness' | 'coach'
  createdAt: Date
  updatedAt: Date
}


