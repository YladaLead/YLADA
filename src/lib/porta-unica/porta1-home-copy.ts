/**
 * Copy do HERO da Porta 1 (home `/pt` reposicionada). Planta a CATEGORIA
 * (Inteligência de Convicção = o moat) no topo, mantém o gancho travado
 * ("Explique menos. Venda mais.") e leva ao desafio → Noel. É posicionamento/
 * conversão (lane de superfícies), não a conversa do Noel. Sem I/O — testável.
 * ⚠️ 1º corte pra revisão do Andre (voz: frase curta, sem travessão, sem hype).
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md (porta 1)
 */

export type Porta1HeroCopy = {
  /** Sobrelinha: a categoria (o ativo durável / narrativa). */
  categoria: string
  /** Gancho travado (mantém o da porta única). */
  headline: string
  /** Reframe + prova, curto. */
  subheadline: string
  /** CTA que entra no desafio. */
  cta: string
}

export const PORTA1_HERO: Porta1HeroCopy = {
  categoria: 'Inteligência de Convicção',
  headline: 'Explique menos. Venda mais.',
  subheadline: '',
  cta: 'Descubra como',
}
