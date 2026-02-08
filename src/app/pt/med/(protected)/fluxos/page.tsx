import YladaAreaShell from '@/components/ylada/YladaAreaShell'

export default function MedFluxosPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Links inteligentes</h1>
        <p className="text-gray-600 mb-2">
          Seus links. Crie quiz personalizado e diagnóstico; acompanhe por link:
        </p>
        <ul className="text-gray-600 text-sm list-disc list-inside space-y-1 mb-4">
          <li>visualizações (quem abriu o link)</li>
          <li>leads (quem preencheu)</li>
          <li>cliques no WhatsApp</li>
        </ul>
        <p className="text-sm text-gray-500">(Implementação em breve.)</p>
      </div>
    </YladaAreaShell>
  )
}
