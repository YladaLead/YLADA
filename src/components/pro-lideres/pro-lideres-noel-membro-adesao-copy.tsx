/**
 * Só para **membro** em `/pro-lideres/membro/noel-membro` (antes de aderir).
 * Benefícios diretos — sem parágrafo introdutório. Não usar na UI do líder.
 */
const ADESAO_ITENS = [
  {
    title: 'Disciplina e lista do dia',
    detail: 'Quem abordar, geração de contato e rotina alinhada às tarefas do seu líder.',
  },
  {
    title: 'O que falar e mensagem pronta',
    detail: 'Orientação + texto curto para usar no WhatsApp (você envia; não é automação).',
  },
  {
    title: 'Qual link enviar',
    detail: 'Indica o link certo em Meus links e por quê naquele momento.',
  },
  {
    title: 'Objeções e convites',
    detail: 'Postura consultiva, sem pressão nem promessa de ganho.',
  },
  {
    title: 'O que postar',
    detail: 'Ideia e tom para story/post do dia.',
  },
] as const

export function ProLideresNoelMembroAdesaoPitch({ brlMensal }: { brlMensal: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold leading-snug text-gray-900">
        Com o Noel você conta com apoio para:
      </p>
      <ul className="space-y-3 text-sm text-gray-800" aria-label="O que a adesão ao Noel oferece">
        {ADESAO_ITENS.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 font-bold text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>
              <strong className="font-semibold text-gray-900">{item.title}</strong>
              <span className="text-gray-700">: {item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-gray-500">R$ {brlMensal}/mês · cancela quando quiser</p>
    </div>
  )
}
