/**
 * Cenários do laboratório da condução (matriz). Cada cenário é um desafio da porta +
 * uma sequência de falas do PROFISSIONAL (simulando a pessoa que conversa com o Noel),
 * pra a página `/pt/noel-lab` rodar a condução de ponta a ponta contra `/api/ylada/noel`
 * e mostrar a conversa + o link real gerado. Permite testar líder E usuário final em
 * lote, sem cadastrar conta a cada teste.
 *
 * As falas terminam aprovando o rascunho e passando um WhatsApp, pra disparar a geração
 * do link real (deveGerarNaConducao). Voz sem travessão (régua GUIA_DE_VOZ). Puro, sem
 * I/O, testável em `noel-lab-cenarios.casos.ts`.
 * @see blueprint-plataforma/Conducao_Noel_Lider_Funil_Marketing_Aprendizados.md
 */
import type { DesafioKey } from './desafio'

export type LabCenario = {
  /** chave estável (não exibida). */
  id: string
  /** rótulo do cartão no laboratório. */
  label: string
  /** o papel testado, só pra organizar a UI. */
  papel: 'liberal' | 'lider'
  /** o desafio que a porta gravaria (vai no body como `desafio`). */
  desafio: { key: DesafioKey; texto: string | null }
  /** falas do profissional, em ordem; a última traz o WhatsApp pra disparar a geração. */
  turns: string[]
}

/** WhatsApps fictícios por cenário (com DDD), só pra disparar o handoff no teste. */
export const NOEL_LAB_CENARIOS: readonly LabCenario[] = [
  {
    id: 'atrair-estetica-facial',
    label: 'Atrair · clínica de estética (facial/rejuvenescimento)',
    papel: 'liberal',
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'tenho uma clínica de estética',
      'facial, foco em rejuvenescimento',
      'quero atrair gente nova',
      'faz sentido, pode montar',
      'ficou ótimo',
      'meu whatsapp é 19 98186-8000',
    ],
  },
  {
    id: 'vender-semijoias',
    label: 'Vender · revendedora de semijoias',
    papel: 'liberal',
    desafio: { key: 'vender', texto: null },
    turns: [
      'vamos',
      'vendo semijoias',
      'quero vender mais pras minhas clientes que já me seguem',
      'pode montar',
      'ficou bom assim',
      '19 98888-7777',
    ],
  },
  {
    id: 'equipe-lider-herbalife',
    label: 'Equipe · líder com time de vendedores',
    papel: 'lider',
    desafio: { key: 'equipe', texto: null },
    turns: [
      'vamos',
      'tenho uma equipe de vendedores e muitos não produzem',
      'o que faz a equipe ganhar é gerar contato, mas eles geram pouco',
      'quero ativar quem não se mexe',
      'faz sentido, como seria',
      'ficou ótimo, pode gerar',
      '19 97777-6666',
    ],
  },
  {
    id: 'atrair-dentista-implante',
    label: 'Atrair · dentista (nicho amplo, testa pergunta de foco)',
    papel: 'liberal',
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'sou dentista',
      'meu foco é implante',
      'quero atrair pacientes novos',
      'pode montar',
      'ficou ótimo',
      '19 96666-5555',
    ],
  },
  {
    id: 'outro-agenda-vazia',
    label: 'Outro · "minha agenda vive vazia"',
    papel: 'liberal',
    desafio: { key: 'outro', texto: 'minha agenda vive vazia' },
    turns: [
      'vamos',
      'sou personal trainer',
      'quero encher minha agenda com aluno novo',
      'pode montar',
      'ficou bom',
      '19 95555-4444',
    ],
  },
  {
    id: 'indicacoes-estetica',
    label: 'Indicações · estética (testa viral, não formulário de nomes)',
    papel: 'liberal',
    desafio: { key: 'atrair', texto: null },
    turns: [
      'vamos',
      'tenho um espaço de estética corporal',
      'queria mais indicações das minhas clientes atuais',
      'pode montar',
      'gostei',
      '19 94444-3333',
    ],
  },
] as const
