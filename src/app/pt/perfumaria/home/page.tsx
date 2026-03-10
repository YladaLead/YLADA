import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChat from '@/components/ylada/NoelChat'

export default function PerfumariaHomePage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para perfumaria. Tire dúvidas, organize a rotina e use melhor seus links inteligentes de fragrâncias.
        </p>
        <NoelChat area="perfumaria" className="mt-2" />
      </div>
    </YladaAreaShell>
  )
}
