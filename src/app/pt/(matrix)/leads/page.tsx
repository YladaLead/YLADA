import YladaAreaShell from '@/components/ylada/YladaAreaShell'

export default function MatrixLeadsPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Leads</h1>
        <p className="text-gray-600">
          Captação possível: quem preencheu o fluxo e quem clicou no WhatsApp. Lista e filtros em breve.
        </p>
      </div>
    </YladaAreaShell>
  )
}
