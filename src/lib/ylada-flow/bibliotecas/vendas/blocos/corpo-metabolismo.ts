// =====================================================
// BLOCO — Corpo & Metabolismo (Lote 3 vendas, PILOTO)
// =====================================================
//
// Eixo de leitura: "meu corpo vive pesado/inchado e isso puxa minha disposição".
// Os 5 fluxos abaixo medem a MESMA coisa → compartilham UM questionário afiado e
// UMA devolutiva afiada; varia só a ABERTURA (gancho temático). É o modelo Caminho 2
// do recrutamento aplicado a vendas.
//
// Membros do bloco (flow_id = fluxos-clientes.id — NÃO renomear, é chave de lookup):
//   barriga-pesada · retencao-inchaço · desconforto-pos-refeicao · inchaço-manha · sedentarismo
// (atenção às cedilhas em `retencao-inchaço` e `inchaço-manha`.)
//
// FORA do piloto, de propósito:
//   - ansiedade-doce → leitura DIFERENTE (fome emocional/doce), não cabe nesta devolutiva.
//   - avaliacao-perfil-metabolico → avaliação especial (template próprio, alinhada na 436).
//   - metabolismo-lento → arquivado (excluído do catálogo de vendas; migration 437).
//
// Governança (régua §6): finalidade VENDAS, mas health-adjacent (corpo/inchaço).
//   → SEM promessa de saúde, SEM "desincha/emagrece/elimina toxina", SEM diagnóstico.
//   → SEM salvaguarda clínica (esfriaria um fluxo de vendas). Linguagem de bem-estar.
//
// Outcomes (eixo DOR: leve/moderado/urgente) → migration 447 (compartilhada por flow_id).
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// =====================================================

import type {
  YladaFlow,
  PerguntaYlada,
  Devolutiva,
  RegraSeparacao2080,
  Handoff,
  GanchoIndicacao,
} from '@/types/ylada-flow'
import { criarFluxoVendas, type VendasBloco, type VendasVariacao } from '../fabrica-vendas'

// --- As 5 perguntas afiadas, compartilhadas (régua §3: provoca E mede) ---
// 3 perguntas de DOR (inverter:true → pior = RISK maior → arquétipo urgente) +
// 1 de abertura + 1 de urgência (essas duas leem a PRONTIDÃO 20/80).
const PERGUNTAS_CORPO: PerguntaYlada[] = [
  {
    id: 'p1',
    texto: 'Como o seu corpo costuma se sentir durante o dia?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Pesado e estufado quase o tempo todo',
      'Estufa de vez em quando',
      'Quase sempre leve',
      'Leve e solto o dia todo',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p2',
    texto: 'E ao acordar, como você começa a manhã?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Inchada e pesada, custo a engrenar',
      'Meio travada, melhora com o tempo',
      'Normal',
      'Leve e disposta',
    ],
    papel: { alimentaLeitura: ['dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p3',
    texto: 'No seu dia a dia, você se movimenta quanto?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Quase nada, fico parada o dia todo',
      'Pouco, só o necessário',
      'Me movimento um pouco',
      'Me mexo bastante',
    ],
    papel: { alimentaLeitura: ['contexto', 'dor'], separa2080: { peso: 1, inverter: true, sinal: 'problema' } },
  },
  {
    id: 'p4',
    texto: 'Quando você pensa em se sentir mais leve, o que vem na cabeça?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Que já tentei de tudo e não muda',
      'Que dá pra melhorar, mas não sei por onde',
      'Que tô quase lá, falta pouco',
      'Que tô bem do jeito que tô',
    ],
    papel: { alimentaLeitura: ['perfil'], separa2080: { peso: 2, inverter: false, sinal: 'abertura' } },
  },
  {
    id: 'p5',
    texto: 'Olhando pros próximos dias, como tá sua vontade de cuidar disso?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Nem penso, levo como dá',
      'Sei que devia, mas não parei pra fazer',
      'Se for simples e couber na rotina, quero olhar',
      'Quero um primeiro passo claro, já',
    ],
    papel: { alimentaLeitura: ['momento'], separa2080: { peso: 3, inverter: false, sinal: 'urgencia' } },
  },
]

// --- Prontidão pelos 3 sinais (mesma régra da Aula 2 usada no recrutamento) ---
const SEPARACAO_2080_CORPO: RegraSeparacao2080 = {
  regraId: 'vendas-prontidao-aula2-v1',
}

// --- Devolutiva compartilhada por prontidão. Eixo DOR (tom) vive nos outcomes (SQL 447). ---
// Régua §4: espelho → causa → 1º passo → CTA. SEM promessa de saúde, sem termo de produto.
const DEVOLUTIVA_CORPO: Devolutiva = {
  porPerfil: {
    // PRONTA (20%) — autoridade / caminho direto
    pronto: {
      espelho: 'Você já cansou de viver com o corpo pesado e quer um caminho que funcione, não mais um "depois".',
      causa: 'O que falta não é força de vontade. É um jeito simples que caiba na sua rotina sem virar sacrifício.',
      primeiroPasso: 'O primeiro passo é uma conversa curta com quem te enviou pra montar isso do seu jeito.',
      ctaWhatsApp: 'Chama quem te mandou e diz: "quero começar a me sentir mais leve, por onde eu vou?"',
    },
    // AINDA NÃO (80%) — servir / educar
    curioso: {
      espelho: 'Seu corpo vive pesado, estufado, e isso vai puxando a sua disposição pra baixo no dia.',
      causa: 'Não é frescura nem preguiça. São coisas pequenas do dia a dia que vão se somando e deixam o corpo travado.',
      primeiroPasso: 'Dá pra começar pequeno, sem dieta radical nem virar a vida de cabeça pra baixo. Um passo só.',
      ctaWhatsApp: 'Fala com quem te mandou isso e pergunta como dar o primeiro passo pra se sentir mais leve.',
    },
  },
}

// --- Ganchos de indicação (sutil, servindo) ---
const GANCHOS_CORPO: GanchoIndicacao[] = [
  { etapa: 'follow-up', frase: 'Conhece alguém que também vive reclamando que se sente pesada e inchada?' },
  { etapa: 'compartilhar-devolutiva', frase: 'Se fez sentido pra você, manda pra quem você sabe que anda no mesmo aperto.' },
]

// --- Handoff padrão (nunca "Visitante") ---
const HANDOFF_CORPO: Handoff = {
  templateId: 'handoff-padrao',
  captacaoDados: false,
  inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
}

/** O bloco Corpo & Metabolismo, pronto pra fábrica (e pra o Energia & Foco copiar o formato). */
export const BLOCO_CORPO_METABOLISMO: VendasBloco = {
  blocoId: 'corpo-metabolismo',
  perguntas: PERGUNTAS_CORPO,
  separacao2080: SEPARACAO_2080_CORPO,
  devolutiva: DEVOLUTIVA_CORPO,
  ganchosIndicacao: GANCHOS_CORPO,
  handoff: HANDOFF_CORPO,
  governanca: ['bem-estar'],
  aberturaPadrao: {
    baixaFriccao: 'Sem cadastro · 5 perguntas · 2 min · resultado na hora',
    autoridadeSutil: 'Quem te mandou isso acompanha de perto gente que está se sentindo mais leve.',
    ctaUnico: 'Começar',
    coerenciaOrigemDefault: 'Continua o convite de quem enviou o link (sem prometer milagre).',
  },
  origemBiblioteca: 'biblioteca-vendas-corpo-metabolismo-v1',
}

const OBJETIVO_PADRAO =
  'Quem clica se vê no próprio desconforto do corpo e abre conversa com quem enviou o link.'

/** O que varia por fluxo: só identidade + gancho temático. */
const VARIACOES: VendasVariacao[] = [
  {
    id: 'barriga-pesada',
    handle: 'barriga-pesada',
    nome: 'Barriga Pesada',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Não é só o que você come. Em 5 perguntas, descubra o que deixa a sua barriga pesada o dia inteiro, e por onde começar a mudar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'corpo', 'barriga', 'inchaco'],
  },
  {
    id: 'retencao-inchaço',
    handle: 'retencao-inchaco',
    nome: 'Retenção e Inchaço',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'O anel que aperta à tarde, a perna pesada no fim do dia. Em 5 perguntas, descubra por que o seu corpo retém tanto, e o que dá pra fazer. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'corpo', 'retencao', 'inchaco'],
  },
  {
    id: 'desconforto-pos-refeicao',
    handle: 'desconforto-pos-refeicao',
    nome: 'Desconforto Depois de Comer',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Comeu e já bateu o peso e o sono? Não precisa ser assim depois de toda refeição. Em 5 perguntas, descubra o que pode estar por trás. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'corpo', 'digestao', 'refeicao'],
  },
  {
    id: 'inchaço-manha',
    handle: 'inchaco-manha',
    nome: 'Inchaço ao Acordar',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Você acorda mais inchada do que foi dormir. Em 5 perguntas, descubra o que faz a sua manhã começar pesada, e o primeiro passo pra virar isso. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'corpo', 'inchaco', 'manha'],
  },
  {
    id: 'sedentarismo',
    handle: 'sedentarismo',
    nome: 'Corpo Parado, Sem Disposição',
    objetivo: OBJETIVO_PADRAO,
    gancho: 'Cansada sem ter feito quase nada? Corpo parado cansa mais que corpo em movimento. Em 5 perguntas, descubra o primeiro passo simples pra destravar. 2 min · sem cadastro.',
    tags: ['vendas', 'pro-lideres', 'corpo', 'sedentarismo', 'disposicao'],
  },
]

/** Os 5 fluxos do bloco Corpo & Metabolismo, prontos no contrato YladaFlow. */
export const FLUXOS_VENDAS_CORPO: YladaFlow[] = VARIACOES.map((v) =>
  criarFluxoVendas(v, BLOCO_CORPO_METABOLISMO),
)

/** Lookup por flow_id. */
export const FLUXOS_VENDAS_CORPO_POR_ID: Record<string, YladaFlow> = Object.fromEntries(
  FLUXOS_VENDAS_CORPO.map((f) => [f.id, f]),
)
