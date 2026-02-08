import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChat from '@/components/ylada/NoelChat'

export default function MedHomePage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor. Tire dúvidas, organize a rotina e use melhor seus links inteligentes.
        </p>
        <NoelChat area="med" className="mt-2" />
      </div>
    </YladaAreaShell>
  )
}
