export default function ProJoiasContaOutraEdicaoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Conta em outro produto</h1>
        <p className="text-gray-600 mb-6">
          Seu e-mail já está associado a outro produto YLADA (ex: Pro Líderes ou Pro Estética).
          Cada produto usa uma conta separada.
        </p>
        <p className="text-sm text-gray-500">
          Dúvidas? Fale com o suporte em{' '}
          <a href="mailto:contato@ylada.com" className="text-amber-700 hover:underline">
            contato@ylada.com
          </a>
        </p>
      </div>
    </div>
  )
}
