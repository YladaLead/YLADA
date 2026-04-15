import { ProEsteticaJornadaIntro } from '@/components/pro-estetica-corporal/ProEsteticaJornadaIntro'

const PRO_ESTETICA_CORPORAL_FECHAR = {
  eyebrow: 'Jornada do cliente · Fechar clientes',
  title: 'Conduzir conversa ate o fechamento',
  lead:
    'Nesta etapa, o objetivo e transformar interesse em sessao marcada com seguranca: proposta clara, tratamento de objecao e chamada para acao.',
  bullets: [
    'Usar roteiro curto de fechamento com foco em problema, plano e proximo passo.',
    'Tratar objecoes de preco e tempo sem perder posicionamento.',
    'Confirmar a primeira sessao com orientacoes praticas.',
    'Registrar no painel quais conversas fecharam e quais precisam de retorno.',
  ],
  nextHint: 'Depois do fechamento, o foco passa para manter clientes em Retencao.',
} as const

export default function ProEsteticaCorporalFecharPage() {
  return <ProEsteticaJornadaIntro {...PRO_ESTETICA_CORPORAL_FECHAR} />
}
