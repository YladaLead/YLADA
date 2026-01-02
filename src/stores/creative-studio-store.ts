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
  
  // Sugestões dinâmicas da conversa (atualizam conforme o chat)
  dynamicSuggestions: Array<{
    id: string
    title: string
    description: string
    type: 'cut' | 'image' | 'video' | 'text' | 'general'
    timestamp?: number
    createdAt: number
  }>
  
  // Cortes sugeridos (ainda não aplicados) para visualização
  suggestedCuts: Array<{
    timestamp: number
    description?: string
  }>
  
  // Resultados de busca (imagens e vídeos)
  searchResults: {
    images: Array<{ id: string; url: string; thumbnail: string; source: string }>
    videos: Array<{ id: string; url: string; thumbnail: string; source: string; duration?: number }>
    isSearching: boolean
    searchQuery: string | null
    lastSearchType: 'images' | 'videos' | null
  }
  
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
  
  // Sugestões dinâmicas
  addDynamicSuggestion: (suggestion: Omit<CreativeStudioState['dynamicSuggestions'][0], 'id' | 'createdAt'>) => void
  removeDynamicSuggestion: (id: string) => void
  clearDynamicSuggestions: () => void
  
  // Cortes sugeridos
  addSuggestedCut: (timestamp: number, description?: string) => void
  removeSuggestedCut: (timestamp: number) => void
  clearSuggestedCuts: () => void
  
  // Resultados de busca
  setSearchResults: (results: Partial<CreativeStudioState['searchResults']>) => void
  addSearchImages: (images: Array<{ id: string; url: string; thumbnail: string; source: string }>) => void
  addSearchVideos: (videos: Array<{ id: string; url: string; thumbnail: string; source: string; duration?: number }>) => void
  clearSearchResults: () => void
  setSearching: (isSearching: boolean, type?: 'images' | 'videos', query?: string) => void
  
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
  dynamicSuggestions: [],
  suggestedCuts: [],
  searchResults: {
    images: [],
    videos: [],
    isSearching: false,
    searchQuery: null,
    lastSearchType: null,
  },
  
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
  
  addDynamicSuggestion: (suggestion) =>
    set((state) => ({
      dynamicSuggestions: [
        ...state.dynamicSuggestions,
        {
          ...suggestion,
          id: `sug-${Date.now()}-${Math.random()}`,
          createdAt: Date.now(),
        },
      ],
    })),
  removeDynamicSuggestion: (id) =>
    set((state) => ({
      dynamicSuggestions: state.dynamicSuggestions.filter((s) => s.id !== id),
    })),
  clearDynamicSuggestions: () => set({ dynamicSuggestions: [] }),
  
  addSuggestedCut: (timestamp, description) =>
    set((state) => {
      // Evitar duplicatas
      if (state.suggestedCuts.some(c => Math.abs(c.timestamp - timestamp) < 0.1)) {
        return state
      }
      return {
        suggestedCuts: [...state.suggestedCuts, { timestamp, description }].sort((a, b) => a.timestamp - b.timestamp),
      }
    }),
  removeSuggestedCut: (timestamp) =>
    set((state) => ({
      suggestedCuts: state.suggestedCuts.filter(c => Math.abs(c.timestamp - timestamp) >= 0.1),
    })),
  clearSuggestedCuts: () => set({ suggestedCuts: [] }),
  
  // Resultados de busca
  setSearchResults: (results) =>
    set((state) => ({
      searchResults: { ...state.searchResults, ...results },
    })),
  addSearchImages: (images) =>
    set((state) => ({
      searchResults: {
        ...state.searchResults,
        images: [...state.searchResults.images, ...images],
      },
    })),
  addSearchVideos: (videos) =>
    set((state) => ({
      searchResults: {
        ...state.searchResults,
        videos: [...state.searchResults.videos, ...videos],
      },
    })),
  clearSearchResults: () =>
    set({
      searchResults: {
        images: [],
        videos: [],
        isSearching: false,
        searchQuery: null,
        lastSearchType: null,
      },
    }),
  setSearching: (isSearching, type, query) =>
    set((state) => ({
      searchResults: {
        ...state.searchResults,
        isSearching,
        lastSearchType: type || null,
        searchQuery: query || state.searchResults.searchQuery,
      },
    })),
  
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

