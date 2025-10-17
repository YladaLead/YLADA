'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, FileText, CheckCircle } from 'lucide-react'

interface MaterialUploadProps {
  moduleId: string
  onUploadComplete: () => void
}

export default function MaterialUpload({ moduleId, onUploadComplete }: MaterialUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setUploadedFile(file)
    setUploadProgress(0)

    try {
      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não suportado. Use PDF, TXT, MD, DOC ou DOCX.')
      }

      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 10MB.')
      }

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `course-materials/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('herbalead-public')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      setUploadProgress(50)

      // Salvar metadados no banco
      const { error: dbError } = await supabase
        .from('course_materials')
        .insert({
          module_id: moduleId,
          title: file.name,
          file_path: filePath,
          file_type: fileExt || 'unknown',
          file_size: file.size,
          is_active: true
        })

      if (dbError) throw dbError

      setUploadProgress(100)
      onUploadComplete()
      
      // Reset após 2 segundos
      setTimeout(() => {
        setUploading(false)
        setUploadedFile(null)
        setUploadProgress(0)
      }, 2000)

    } catch (error) {
      console.error('Erro no upload:', error)
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload do arquivo')
      setUploading(false)
      setUploadedFile(null)
      setUploadProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          uploading 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50'
        }`}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-emerald-600">
                Enviando {uploadedFile?.name}...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {uploadProgress}% concluído
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Enviar Material do Curso
              </p>
              <p className="text-sm text-gray-500">
                Arraste um arquivo aqui ou clique para selecionar
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <FileText className="w-4 h-4" />
              <span>PDF, TXT, MD, DOC, DOCX (máx. 10MB)</span>
            </div>
            <input
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivo
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
