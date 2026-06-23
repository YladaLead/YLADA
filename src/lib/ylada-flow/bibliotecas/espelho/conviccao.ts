// =====================================================
// BIBLIOTECA — ESPELHO (autodiagnóstico de CONVICÇÃO) como caso do contrato YladaFlow
// =====================================================
//
// Resolve a NUANCE deixada aberta no Chat 2 §"Pendências": "encaixar o autodiagnóstico
// de onboarding (mede convicção do PROFISSIONAL, Sujeito A) como caso do contrato".
//
// O QUE É: o Espelho é o autodiagnóstico do DONO (Sujeito A), não do lead (Sujeito B).
// Ele mede a convicção do profissional em 3 níveis (travada/oscilante/construção) e
// alimenta o Noel modo Espelho. É a base da corrente C → C → P (sem convicção, o
// profissional não usa nada).
//
// RECONCILIAÇÃO (não duplicar): a FONTE DA VERDADE das perguntas, da pontuação e das
// devolutivas continua em `@/lib/conviccao/conviccao-autodiagnostico` (já no ar, com
// tabela `ylada_conviccao_diagnostico` e o modo_espelho da rota do Noel lendo dela).
// Este arquivo é só a VISTA no contrato: envolve aquela fonte num YladaFlow para que o
// Recomendador/Motor tratem o Espelho de forma uniforme com os demais fluxos. Mexeu lá,
// reflete aqui sem editar (importa em runtime, não copia texto).
//
// EXCEÇÕES DE SUJEITO A (declaradas, não disfarçadas):
//  - dimensoes.frente: 'espelho' (o profissional lê a si mesmo) — membro aditivo do contrato.
//  - dimensoes.finalidade: 'autodiagnostico-conviccao' — membro aditivo do contrato.
//  - separacao2080: NÃO se aplica (não há 20/80 de lead). regraId marca isso.
//  - handoff: NÃO se aplica (não há lead pra entregar). O contrato força a forma
//    ('handoff-padrao' + inclui literais); o Motor deve PULAR handoff quando
//    finalidade === 'autodiagnostico-conviccao'.
//  - ganchosIndicacao: vazio (Sujeito A não compartilha o próprio espelho com leads).
//  - devolutiva.porPerfil: o contrato exige as chaves 'pronto'/'curioso' (eixo 20/80
//    do lead). O Espelho NÃO tem esse eixo — tem 3 níveis de convicção. Mantemos os 3
//    níveis nativos (travada/oscilante/construcao) E preenchemos 'pronto'/'curioso' como
//    ALIASES honestos dos extremos (construcao→pronto, travada→curioso) só pra satisfazer
//    o contrato. Quem renderiza o Espelho deve ler por `calcularConviccaoPerfil` (3 níveis),
//    não por 20/80.
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero. Inerte até o
// Recomendador/Motor serem ligados (atrás de flag, como todo o Chat 4+).
// =====================================================

import type {
  YladaFlow,
  PerguntaYlada,
  BlocoDevolutiva,
  Devolutiva,
  PapelDaPergunta,
} from '@/types/ylada-flow'
import {
  CONVICCAO_PERGUNTAS,
  CONVICCAO_DEVOLUTIVAS,
  type ConviccaoDevolutiva,
  type ConviccaoPerfilCode,
} from '@/lib/conviccao/conviccao-autodiagnostico'

// -----------------------------------------------------
// 1. Papel de cada pergunta (regra dura: toda pergunta declara o que faz).
//    No Espelho todas leem o PERFIL de convicção do profissional; não há 20/80
//    (separa2080 fica de fora). As que olham a leitura da falha / o gap também
//    alimentam 'contexto' (mercado × sistema de comunicação — Cap 3 do livro).
// -----------------------------------------------------
const PAPEL_POR_ID: Record<string, PapelDaPergunta> = {
  q1_abordagem: { alimentaLeitura: ['perfil'] }, //         evita agir (Cap 1)
  q2_sabe_nao_faz: { alimentaLeitura: ['perfil'] }, //      a ilusão do conhecimento (Cap 1)
  q3_leitura_da_falha: { alimentaLeitura: ['perfil', 'contexto'] }, // lê a falha como incapacidade × método (Cap 3)
  q4_sistema: { alimentaLeitura: ['perfil'] }, //           tem caminho ou improvisa (Cap 6)
  q5_repeticao: { alimentaLeitura: ['perfil'] }, //         constância por método (Cap 5)
  q6_o_gap: { alimentaLeitura: ['perfil', 'contexto'] }, // o gap: mercado × sistema de comunicação (Cap 3)
  q7_movimento_antes: { alimentaLeitura: ['perfil'] }, //   movimento antes da certeza (Cap 4/5)
  q8_sem_resultado: { alimentaLeitura: ['perfil'] }, //     o ciclo vicioso quando o resultado tarda (Cap 4)
}

const PAPEL_PADRAO: PapelDaPergunta = { alimentaLeitura: ['perfil'] }

/** As 8 perguntas do Espelho mapeadas pro contrato (multipla_escolha + papel). Fonte: conviccao-autodiagnostico. */
export const PERGUNTAS_ESPELHO: PerguntaYlada[] = CONVICCAO_PERGUNTAS.map((p) => ({
  id: p.id,
  texto: p.texto,
  tipo: 'multipla_escolha' as const,
  opcoes: p.opcoes.map((o) => o.label),
  papel: PAPEL_POR_ID[p.id] ?? PAPEL_PADRAO,
}))

// -----------------------------------------------------
// 2. Devolutiva: 3 níveis nativos + aliases pronto/curioso (ver cabeçalho).
//    Mapeia ConviccaoDevolutiva (rica: titulo/fraseEspelho/oCiclo/oGap/primeiroAto/noelSeed)
//    pra BlocoDevolutiva (espelho/causa/primeiroPasso/ctaWhatsApp). Os campos que o bloco
//    não comporta (titulo/fraseEspelho/noelSeed) seguem vivos na fonte — usados pelo
//    render do Espelho e pelo modo_espelho do Noel.
// -----------------------------------------------------
function paraBloco(dev: ConviccaoDevolutiva): BlocoDevolutiva {
  return {
    espelho: dev.fraseEspelho ? `${dev.fraseEspelho} ${dev.oCiclo}` : dev.oCiclo,
    causa: dev.oGap,
    primeiroPasso: dev.primeiroAto,
    // Sujeito A não tem WhatsApp de lead. O "CTA" do Espelho é o próximo passo interno:
    // continuar a conversa com o Noel modo Espelho. (Repurpose declarado.)
    ctaWhatsApp: 'Continuar com o Noel: dar esse primeiro passo agora.',
  }
}

const BLOCO_POR_PERFIL: Record<ConviccaoPerfilCode, BlocoDevolutiva> = {
  travada: paraBloco(CONVICCAO_DEVOLUTIVAS.travada),
  oscilante: paraBloco(CONVICCAO_DEVOLUTIVAS.oscilante),
  construcao: paraBloco(CONVICCAO_DEVOLUTIVAS.construcao),
}

export const DEVOLUTIVA_ESPELHO: Devolutiva = {
  porPerfil: {
    // 3 níveis nativos (o eixo REAL do Espelho — ler por calcularConviccaoPerfil):
    travada: BLOCO_POR_PERFIL.travada,
    oscilante: BLOCO_POR_PERFIL.oscilante,
    construcao: BLOCO_POR_PERFIL.construcao,
    // aliases exigidos pelo contrato (extremos da convicção):
    curioso: BLOCO_POR_PERFIL.travada, //   destravar/servir
    pronto: BLOCO_POR_PERFIL.construcao, // escalar/autoridade
  },
  empacotadaId: 'espelho-conviccao-v1',
}

// -----------------------------------------------------
// 3. O Espelho como YladaFlow (a vista no contrato).
// -----------------------------------------------------
export const FLUXO_ESPELHO_CONVICCAO: YladaFlow = {
  id: 'espelho-conviccao',
  // handle distinto de propósito: `ylada.com/conviccao` já é o FUNIL DO LIVRO (ativo vivo).
  // O Espelho é onboarding interno (Sujeito A), não rota pública de lead.
  handle: 'autodiagnostico-conviccao',
  nome: 'Autodiagnóstico de Convicção',
  objetivo:
    'O profissional vê o próprio ciclo (onde evita agir, onde lê a falha como incapacidade) e dá um primeiro passo. Base do C → C → P.',
  tenantId: '<owner é tenant de si — Sujeito A>',
  ownerId: '<o próprio profissional>',
  idiomaPadrao: 'pt',
  dimensoes: {
    frente: 'espelho', //              Sujeito A: lê a si mesmo
    nicho: 'todos', //                 deliberadamente neutro de nicho (serve estética, líder, liberal, B2B)
    regiao: 'BR',
    funil: 'marketing', //             servir antes; o "lead" aqui é o próprio dono
    tipo: 'quiz',
    finalidade: 'autodiagnostico-conviccao',
    governanca: ['nenhuma'],
  },
  abertura: {
    gancho: 'Antes de falar do seu cliente, vamos olhar pra você. Em 8 perguntas, o que está prendendo o seu crescimento hoje.',
    baixaFriccao: 'Sem cadastro · 8 perguntas · 2 min · sobre você, não sobre o cliente',
    autoridadeSutil: 'A maioria acha que o problema é o mercado. Quase sempre não é.',
    ctaUnico: 'Começar',
    coerenciaOrigem: 'Onboarding da plataforma — o primeiro passo é o Espelho (Etapa 1).',
  },
  origemEsperada: { canal: 'online_outro', funil: 'marketing', temperatura: 'quente' },
  perguntas: PERGUNTAS_ESPELHO,
  // N/A para Sujeito A: não há separação 20/80 de lead. O perfil sai de calcularConviccaoPerfil (3 níveis).
  separacao2080: { regraId: 'nao-se-aplica-sujeito-a' },
  devolutiva: DEVOLUTIVA_ESPELHO,
  // Sujeito A não compartilha o próprio espelho com leads.
  ganchosIndicacao: [],
  // N/A para Sujeito A (não há lead pra entregar). O contrato força a forma; o Motor
  // deve PULAR handoff quando finalidade === 'autodiagnostico-conviccao'.
  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false,
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
  },
  origemBiblioteca: 'biblioteca-espelho-conviccao-v1',
  tags: ['espelho', 'conviccao', 'onboarding', 'sujeito-a', 'autodiagnostico'],
}

export default FLUXO_ESPELHO_CONVICCAO
