export default function ProLideresScriptsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-blue-600">Conteúdo</p>
      <h1 className="text-2xl font-bold text-gray-900">Scripts</h1>
      <p className="max-w-2xl text-gray-600">
        Apenas <strong className="text-gray-800">roteiros de conversa</strong> partilhados com a equipe — gerados ou refinados com o{' '}
        <strong className="text-gray-800">Noel</strong>. PDFs e materiais de apoio ficam no canal do grupo (WhatsApp, etc.);
        aqui concentramos sequências de fala para o dia a dia.
      </p>
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Tipos previstos (em construção)</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Gerar / retomar contato</li>
          <li>Usar a ferramenta (explicar o link)</li>
          <li>Pedir permissão antes de enviar o link</li>
          <li>Atender no WhatsApp</li>
        </ul>
      </div>
      <p className="max-w-2xl text-sm text-gray-500">
        O acesso segue a mesma regra do resto do painel: só quem pertence ao teu espaço Pro Líderes vê estes scripts.
      </p>
    </div>
  )
}
