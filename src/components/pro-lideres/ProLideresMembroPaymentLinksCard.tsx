type ProLideresMembroPaymentLinksCardProps = {
  cardUrl: string | null
  pixUrl: string | null
  leaderWaUrl?: string | null
  emptyMessage?: string
}

export function ProLideresMembroPaymentLinksCard({
  cardUrl,
  pixUrl,
  leaderWaUrl,
  emptyMessage = 'Não encontramos link de pagamento configurado para esta equipe. Fale com quem te convidou para combinar o pagamento; depois o acesso é liberado pelo líder.',
}: ProLideresMembroPaymentLinksCardProps) {
  const hasPayment = Boolean(cardUrl || pixUrl)

  if (!hasPayment) {
    return (
      <div className="space-y-3">
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-700">
          {emptyMessage}
        </p>
        {leaderWaUrl ? (
          <a
            href={leaderWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-green-600 bg-green-50 px-4 text-sm font-semibold text-green-900 hover:bg-green-100"
          >
            Falar com minha equipe no WhatsApp
          </a>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-gray-800">Escolha como pagar</p>
      {pixUrl ? (
        <a
          href={pixUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Pix
        </a>
      ) : null}
      {cardUrl ? (
        <a
          href={cardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Cartão ou Mercado Pago
        </a>
      ) : null}
      {leaderWaUrl ? (
        <a
          href={leaderWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Dúvidas? Falar no WhatsApp
        </a>
      ) : null}
    </div>
  )
}
