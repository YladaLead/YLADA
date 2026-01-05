import { create } from 'zustand'
import { ScriptSegment, VideoClip, Project, Caption, AudioClip } from '@/types/creative-studio'

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
  
  // Legendas/Captions
  captions: Caption[]
  
  // Áudio/Narração
  audioClips: AudioClip[]
  
  // Undo/Redo
  history: Array<{ clips: VideoClip[]; script: ScriptSegment[]; captions: Caption[] }>
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
  duplicateClip: (id: string) => void
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
  
  // Captions Actions
  addCaption: (caption: Caption) => void
  updateCaption: (id: string, updates: Partial<Caption>) => void
  deleteCaption: (id: string) => void
  setCaptions: (captions: Caption[]) => void
  
  // Audio Actions
  addAudioClip: (audio: AudioClip) => void
  updateAudioClip: (id: string, updates: Partial<AudioClip>) => void
  deleteAudioClip: (id: string) => void
  setAudioClips: (audioClips: AudioClip[]) => void
  
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
  
  // Legendas/Captions
  captions: [],
  
  // Áudio/Narração
  audioClips: [],
  
  // Undo/Redo
  history: [{ clips: [], script: [], captions: [] }],
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
  
  duplicateClip: (id) =>
    set((state) => {
      const clipToDuplicate = state.clips.find((clip) => clip.id === id)
      if (!clipToDuplicate) return state
      
      const duration = clipToDuplicate.endTime - clipToDuplicate.startTime
      const newStartTime = clipToDuplicate.endTime
      const newEndTime = newStartTime + duration
      
      const duplicatedClip: VideoClip = {
        ...clipToDuplicate,
        id: `${clipToDuplicate.id}-copy-${Date.now()}`,
        startTime: newStartTime,
        endTime: newEndTime,
      }
      
      // Inserir após o clip original
      const clipIndex = state.clips.findIndex((clip) => clip.id === id)
      const newClips = [...state.clips]
      newClips.splice(clipIndex + 1, 0, duplicatedClip)
      
      // Recalcular timings dos próximos clips
      const adjustedClips = newClips.map((clip, idx) => {
        if (idx > clipIndex + 1) {
          const prevClip = newClips[idx - 1]
          const offset = duration
          return {
            ...clip,
            startTime: prevClip.endTime,
            endTime: prevClip.endTime + (clip.endTime - clip.startTime),
          }
        }
        return clip
      })
      
      return { clips: adjustedClips }
    }),
  
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
  
  // Captions Actions
  addCaption: (caption) =>
    set((state) => ({
      captions: [...state.captions, caption].sort((a, b) => a.startTime - b.startTime),
    })),
  
  updateCaption: (id, updates) =>
    set((state) => ({
      captions: state.captions.map((cap) =>
        cap.id === id ? { ...cap, ...updates } : cap
      ).sort((a, b) => a.startTime - b.startTime),
    })),
  
  deleteCaption: (id) =>
    set((state) => ({
      captions: state.captions.filter((cap) => cap.id !== id),
    })),
  
  setCaptions: (captions) => {
    set({ captions: captions.sort((a, b) => a.startTime - b.startTime) })
    get().saveToHistory()
  },
  
  // Audio Actions
  addAudioClip: (audio) =>
    set((state) => ({
      audioClips: [...state.audioClips, audio].sort((a, b) => a.startTime - b.startTime),
    })),
  
  updateAudioClip: (id, updates) =>
    set((state) => ({
      audioClips: state.audioClips.map((audio) =>
        audio.id === id ? { ...audio, ...updates } : audio
      ).sort((a, b) => a.startTime - b.startTime),
    })),
  
  deleteAudioClip: (id) =>
    set((state) => ({
      audioClips: state.audioClips.filter((audio) => audio.id !== id),
    })),
  
  setAudioClips: (audioClips) => {
    set({ audioClips: audioClips.sort((a, b) => a.startTime - b.startTime) })
    get().saveToHistory()
  },
  
  // Undo/Redo
  setIsUndoRedo: (value) => set({ isUndoRedo: value }),
  
  saveToHistory: () => {
    const state = get()
    if (state.isUndoRedo) return
    
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    const currentState = {
      clips: JSON.parse(JSON.stringify(state.clips)),
      script: JSON.parse(JSON.stringify(state.script)),
      captions: JSON.parse(JSON.stringify(state.captions)),
    }
    
    const lastState = newHistory[newHistory.length - 1]
    if (
      lastState &&
      JSON.stringify(lastState.clips) === JSON.stringify(currentState.clips) &&
      JSON.stringify(lastState.script) === JSON.stringify(currentState.script) &&
      JSON.stringify(lastState.captions) === JSON.stringify(currentState.captions)
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
        captions: JSON.parse(JSON.stringify(previousState.captions)),
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
        captions: JSON.parse(JSON.stringify(nextState.captions)),
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

