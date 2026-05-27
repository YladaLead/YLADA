import { ProLideresCatalogToolPicker } from '@/components/pro-lideres/ProLideresCatalogToolPicker'

export default function ProJoiasCatalogoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Catálogo</h1>
        <p className="text-gray-500 text-sm mt-1">
          Organize e compartilhe seu catálogo de joias, semijoias e bijuterias.
        </p>
      </div>
      <ProLideresCatalogToolPicker />
    </div>
  )
}
