import { create } from 'zustand'
import { ScriptSegment, VideoClip, Project } from '@/types/creative-studio'

interface CreativeStudioState {
  // Projeto atual
  currentProject: Project | null
  
  // Roteiro
  script: ScriptSegment[]
  isGeneratingScript: boolean
  
  // Vídeo
  clips: VideoClip[]
  currentTime: number
  isPlaying: boolean
  duration: number
  
  // UI
  activePanel: 'script' | 'editor' | 'preview' | 'templates'
  selectedClipId: string | null
  
  // Análise de vídeo
  uploadedVideo: File | null
  videoAnalysis: {
    transcription: string
    scriptStructure: any[]
    suggestions: any[]
  } | null
  
  // Undo/Redo
  history: Array<{ clips: VideoClip[]; script: ScriptSegment[] }>
  historyIndex: number
  maxHistorySize: number
  isUndoRedo: boolean
  
  // Actions
  setCurrentProject: (project: Project | null) => void
  setScript: (script: ScriptSegment[]) => void
  addScriptSegment: (segment: ScriptSegment) => void
  updateScriptSegment: (id: string, updates: Partial<ScriptSegment>) => void
  deleteScriptSegment: (id: string) => void
  
  addClip: (clip: VideoClip) => void
  updateClip: (id: string, updates: Partial<VideoClip>) => void
  deleteClip: (id: string) => void
  setClips: (clips: VideoClip[]) => void
  
  setCurrentTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  setDuration: (duration: number) => void
  setActivePanel: (panel: 'script' | 'editor' | 'preview' | 'templates') => void
  setSelectedClipId: (id: string | null) => void
  setIsGeneratingScript: (generating: boolean) => void
  
  setUploadedVideo: (file: File | null) => void
  setVideoAnalysis: (analysis: { transcription: string; scriptStructure: any[]; suggestions: any[] } | null) => void
  
  // Undo/Redo Actions
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  setIsUndoRedo: (value: boolean) => void
}

export const useCreativeStudioStore = create<CreativeStudioState>((set, get) => ({
  // Estado inicial
  currentProject: null,
  script: [],
  clips: [],
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  activePanel: 'editor',
  selectedClipId: null,
  isGeneratingScript: false,
  uploadedVideo: null,
  videoAnalysis: null,
  
  // Undo/Redo
  history: [{ clips: [], script: [] }],
  historyIndex: 0,
  maxHistorySize: 50,
  isUndoRedo: false,
  
  // Actions
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setScript: (script) => {
    set({ script })
    get().saveToHistory()
  },
  
  addScriptSegment: (segment) =>
    set((state) => {
      const newScript = [...state.script, segment]
      setTimeout(() => get().saveToHistory(), 0)
      return { script: newScript }
    }),
  
  updateScriptSegment: (id, updates) =>
    set((state) => {
      const newScript = state.script.map((seg) =>
        seg.id === id ? { ...seg, ...updates } : seg
      )
      setTimeout(() => get().saveToHistory(), 0)
      return { script: newScript }
    }),
  
  deleteScriptSegment: (id) =>
    set((state) => {
      const newScript = state.script.filter((seg) => seg.id !== id)
      setTimeout(() => get().saveToHistory(), 0)
      return { script: newScript }
    }),
  
  addClip: (clip) =>
    set((state) => ({
      clips: [...state.clips, clip],
    })),
  
  updateClip: (id, updates) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id ? { ...clip, ...updates } : clip
      ),
    })),
  
  deleteClip: (id) =>
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
    })),
  
  setClips: (clips) => {
    set({ clips })
    get().saveToHistory()
  },
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setIsGeneratingScript: (generating) => set({ isGeneratingScript: generating }),
  setUploadedVideo: (file) => set({ uploadedVideo: file }),
  setVideoAnalysis: (analysis) => set({ videoAnalysis: analysis }),
  
  // Undo/Redo
  setIsUndoRedo: (value) => set({ isUndoRedo: value }),
  
  saveToHistory: () => {
    const state = get()
    if (state.isUndoRedo) return
    
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    const currentState = {
      clips: JSON.parse(JSON.stringify(state.clips)),
      script: JSON.parse(JSON.stringify(state.script)),
    }
    
    const lastState = newHistory[newHistory.length - 1]
    if (
      lastState &&
      JSON.stringify(lastState.clips) === JSON.stringify(currentState.clips) &&
      JSON.stringify(lastState.script) === JSON.stringify(currentState.script)
    ) {
      return
    }
    
    newHistory.push(currentState)
    
    if (newHistory.length > state.maxHistorySize) {
      newHistory.shift()
    } else {
      if (state.historyIndex < newHistory.length - 1) {
        newHistory.splice(state.historyIndex + 1)
      }
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },
  
  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      set({ isUndoRedo: true })
      const previousState = state.history[state.historyIndex - 1]
      set({
        clips: JSON.parse(JSON.stringify(previousState.clips)),
        script: JSON.parse(JSON.stringify(previousState.script)),
        historyIndex: state.historyIndex - 1,
        isUndoRedo: false,
      })
    }
  },
  
  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      set({ isUndoRedo: true })
      const nextState = state.history[state.historyIndex + 1]
      set({
        clips: JSON.parse(JSON.stringify(nextState.clips)),
        script: JSON.parse(JSON.stringify(nextState.script)),
        historyIndex: state.historyIndex + 1,
        isUndoRedo: false,
      })
    }
  },
  
  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },
  
  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },
}))

