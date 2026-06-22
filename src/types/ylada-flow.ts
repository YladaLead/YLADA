// =====================================================
// YLADA FLOW — CONTRATO ÚNICO (tipo canônico)
// =====================================================
//
// Fonte: blueprint-plataforma/Chat2_Contrato_Unico.md §2 (design no papel)
//        + Spec_Fundacao_Ylada_Grau1.md §4, §5, §12, §13
//
// O QUE É: a planta única de "conversa que diagnostica" para QUALQUER nicho.
// Substitui os três sistemas separados por finalidade (diagnóstico/calculadora,
// vendas, recrutamento) por UM tipo só, onde finalidade vira etiqueta (dimensão),
// não árvore de código.
//
// STATUS: adição pura. Nada importa este arquivo ainda — risco zero.
// É a fundação de que o resto do Chat 4 depende (Motor, render, catálogo).
//
// MIGRAÇÃO: reaproveita `PerguntaFluxoCliente` de `wellness-system` ESTENDIDO.
// Ao renomear a base `wellness-system` → `ylada-flow` (Chat 4, passo 3), trocar
// o import abaixo para o novo caminho neutro. Ver mapa campo-a-campo no Chat 2 §4.
//
// REMOVIDO do FluxoCliente legado: `kitRecomendado: TipoKit` (termo Herbalife).
// =====================================================

import type { PerguntaFluxoCliente } from '@/types/ylada-flow-legacy'

// -----------------------------------------------------
// 1. DIMENSÕES (etiquetas — substituem os "três blocos") — Chat 2 §2.1 / Spec §4.4
// -----------------------------------------------------

/** Onde a conversa acontece — muda o OBJETO da leitura (Spec §5). */
export type Frente = 'campo' | 'digital' | 'rede'
//  campo   = um a um    → lê a pessoa
//  digital = um a muitos → lê o mercado
//  rede    = muitos      → lê a ativação da rede

/** Nicho é só configuração (vocabulário + biblioteca). Aberto por design. */
export type Nicho = string
// 'pro-lideres' | 'estetica-corporal' | 'estetica-capilar' | 'coach-bem-estar'
// | 'nutri' | 'medico' | 'advogado' | ... (cresce sem novo construtor)

/** Região determina governança + fórmulas + unidades (Spec §12.2/§12.3). NÃO é idioma. */
export type Regiao = string // 'BR' | 'US' | 'ES' | ... (ISO-3166-1 alfa-2)

/** De onde a conversa parte — muda a regra do 20/80 (Spec §4.1). */
export type Funil =
  | 'vendas' //    ofereceu direto → lê prontidão pela reação à oferta
  | 'marketing' // serviu primeiro → lê prontidão pelo jeito que engaja

/** Como o lead responde. */
export type TipoFluxo = 'quiz' | 'calculadora'

/** O objetivo do fluxo — governança muda por aqui (Spec §4.4). */
export type Finalidade =
  | 'diagnostico-servico' // servir/educar (calc. de água, IMC) — saúde: sempre orientativo
  | 'vendas' //             produto/serviço
  | 'recrutamento' //       convite ao negócio/renda — o mais sensível (nunca constranger)

/** Governança aplicável (deriva de região × nicho × finalidade). */
export type Governanca = 'bem-estar' | 'CFM' | 'ANVISA' | 'OAB' | 'CVM' | 'nenhuma'

export interface DimensoesFluxo {
  frente: Frente
  nicho: Nicho
  regiao: Regiao
  funil: Funil
  tipo: TipoFluxo
  finalidade: Finalidade
  governanca: Governanca[] // pode acumular (ex.: ['CFM','ANVISA'])
}

// -----------------------------------------------------
// 2. ORIGEM/CONTEXTO (campo NOVO) — Chat 2 §2.2 / Spec §4.2 item 2
// -----------------------------------------------------
// Hoje só aparece em tabelas de DB depois do fato. No contrato vira a entrada
// que alimenta a Leitura e, com ela, o 20/80.

export type Canal = 'presencial' | 'whatsapp' | 'instagram' | 'trafego_pago' | 'online_outro'
export type Temperatura = 'frio' | 'morno' | 'quente'

/** Preenchido em runtime quando o lead chega (UTM, link de origem, contexto do anúncio). */
export interface OrigemContexto {
  canal: Canal
  /** Herda da dimensão do fluxo, mas pode ser sobrescrito pela origem real. */
  funil: Funil
  temperatura: Temperatura
  /** utm_campaign / id do anúncio — liga com a inteligência de Divulgação. */
  campanha?: string
  /** handle de quem compartilhou (atribuição). */
  referenciaProfissional?: string
}

// -----------------------------------------------------
// 3. PERGUNTAS COM PESO INVISÍVEL — Chat 2 §2.3 / Spec §4.2 item 3
// -----------------------------------------------------
// REGRA DURA: sem declarar o que faz, a pergunta NÃO entra. É o que impede o
// fluxo de virar "só um quiz". O score que hoje nasce no adaptador em runtime
// (meta.invert_risk_mcq_score) passa a viver na pergunta.

/** O que uma pergunta faz na mecânica do método. Toda pergunta declara ≥1. */
export interface PapelDaPergunta {
  /** Qual eixo de leitura esta pergunta alimenta (dor, momento, perfil, contexto). */
  alimentaLeitura?: ('dor' | 'momento' | 'perfil' | 'contexto')[]
  /** Se contribui para a separação 20/80 e com que peso (invisível ao lead). */
  separa2080?: {
    /** contribuição ao score de prontidão. */
    peso: number
    /** herda o caso meta.invert_risk_mcq_score. */
    inverter?: boolean
    /** mapa opção→peso para múltipla escolha; escala usa o valor direto×peso. */
    pesosPorOpcao?: Record<string, number>
    /**
     * Qual sinal do método da Aula 2 esta pergunta alimenta (Chat5 Fase2 §4/§5).
     * A prontidão PRONTA (20%) exige os três sinais positivos; faltou um → AINDA NÃO (80%).
     * É o que separa a leitura de DOR (RISK/arquétipo) da leitura de PRONTIDÃO.
     */
    sinal?: 'problema' | 'urgencia' | 'abertura'
  }
}

/** Pergunta = a de hoje + o papel declarado + chave i18n. */
export type PerguntaYlada = PerguntaFluxoCliente & {
  /** OBRIGATÓRIO — sem isso a pergunta não entra. */
  papel: PapelDaPergunta
  /** chave de tradução; `texto` vira fallback. */
  i18nKey?: string
}

// -----------------------------------------------------
// 4. SEPARAÇÃO 20/80 POR FUNIL (campo NOVO) — Chat 2 §2.4 / Spec §4.1
// -----------------------------------------------------
// A mesma régua de prontidão, lida diferente conforme o funil. A regra mora na
// Biblioteca 20/80 (ver Regra2080); o fluxo só aponta qual usar e o corte.

export interface RegraSeparacao2080 {
  /** id da regra na Biblioteca 20/80 (varia por funil). */
  regraId: string
  /** score ≥ corte ⇒ "pronto" (20%); abaixo ⇒ "curioso" (80%). Default da biblioteca. */
  corte?: number
}

// -----------------------------------------------------
// 5. DEVOLUTIVA QUE SERVE — Chat 2 §2.5 / Spec §4.2 item 5
// -----------------------------------------------------
// Estrutura fixa: espelho → causa → 1º passo → CTA WhatsApp, variando por perfil/
// prontidão. Reaproveita as 142 devolutivas empacotadas (lib/diagnostics) como conteúdo.

export interface BlocoDevolutiva {
  espelho: string //       "isto é o que você vive hoje"
  causa: string //         a causa-raiz (sem culpar a pessoa)
  primeiroPasso: string
  ctaWhatsApp: string //   texto do CTA que leva à conversa
  i18nKey?: string
}

/** Variação opcional do bloco por sexo — Decisão B do IMC (Chat5 Calculadoras).
 *  O sexo NÃO muda o número; sobrepõe só os campos de TEXTO informados. */
export interface BlocoPorSexo {
  M?: Partial<BlocoDevolutiva>
  F?: Partial<BlocoDevolutiva>
}

/** Leitura de CALCULADORA por faixa de resultado (Spec §12.2 / Chat5 Calculadoras).
 *  Calculadora lê pela FAIXA do valor calculado, não por prontidão. */
export interface FaixaDevolutiva {
  /** id da faixa (ex.: 'normal' | 'sobrepeso' | 'perder' | 'ganhar'). */
  id: string
  /** rótulo curto exibível (ex.: 'Peso normal'). */
  rotulo?: string
  /** faixa por range sobre o valor calculado [min, max). Use min/max OU `quando`. */
  min?: number
  max?: number
  /** casa quando um campo nomeado do resultado bater (ex.: classificacao OMS, objetivo escolhido). */
  quando?: string
  bloco: BlocoDevolutiva
  /** Decisão B: variação por sexo (sobrepõe campos do bloco). IMC usa; demais ignoram. */
  porSexo?: BlocoPorSexo
}

export interface Devolutiva {
  /** QUIZ: uma versão por perfil de prontidão; no mínimo 'pronto' e 'curioso'. */
  porPerfil: {
    pronto: BlocoDevolutiva //  20% → autoridade
    curioso: BlocoDevolutiva // 80% → servir/educar
    [perfil: string]: BlocoDevolutiva
  }
  /** CALCULADORA: leitura por faixa de resultado (IMC, calorias, proteína). Aditivo. */
  porFaixa?: FaixaDevolutiva[]
  /** id da devolutiva empacotada na biblioteca, quando for lookup puro (Spec §7.3). */
  empacotadaId?: string
}

// -----------------------------------------------------
// 6. GANCHOS DE INDICAÇÃO (campo NOVO) — Chat 2 §2.6 / Spec §2 (transversal)
// -----------------------------------------------------
// Pontos sutis de coleta, sempre servindo. Os 80% também indicam.

export interface GanchoIndicacao {
  etapa: 'conducao' | 'follow-up' | 'compartilhar-devolutiva'
  frase: string //  "conhece alguém que também anda sem energia?"
  i18nKey?: string
}

// -----------------------------------------------------
// 7. HANDOFF AO PROFISSIONAL (campo NOVO) — Chat 2 §2.7 / Spec §4.2 item 7 + §11.4
// -----------------------------------------------------
// Nunca mais "Visitante". Substitui o WhatsApp prefill genérico de hoje.
// Dois templates padronizados (lead→profissional e handoff), parametrizados
// pelo vocabulário do nicho. Número/destino resolvido pelo tenant, não pelo fluxo.

export interface Handoff {
  /** template do contrato; vocabulário vem do nicho. */
  templateId: 'handoff-padrao'
  /**
   * Captação/armazenamento da lead (Chat5 Fase2 §7/§10.3). Padrão Pró-Líderes: false.
   * MARCADOR de intenção do fluxo — a FONTE DA VERDADE dos flags (captaProprios /
   * permiteLiderados / flag do liderado) é a config do owner/tenant, não o fluxo.
   * O "time" da lead (pronta × ainda-não) chega NOS DOIS modos: desligado → no prefill;
   * ligado → carimbo no painel do liderado e do líder.
   */
  captacaoDados?: boolean
  inclui: {
    resumoRespostas: true //  sempre
    classificacao2080: true // sempre
    scriptSugerido: true //   autoridade (pronto) / serviço (curioso)
  }
}

// -----------------------------------------------------
// 8. ABERTURA (campo NOVO) — Chat 2 §2.8 / Spec §12.1
// -----------------------------------------------------
// O gancho do 1º clique. A primeira tela NÃO é formulário; é um convite com um
// único objetivo: o primeiro clique. A abertura SERVE (promete descoberta), não vende.

export interface Abertura {
  /** o que a pessoa vai DESCOBRIR sobre si (não o que você vende). */
  gancho: string
  /** "sem cadastro · 5 perguntas · 2 min · resultado na hora". */
  baixaFriccao: string
  autoridadeSutil?: string
  /** um botão só. */
  ctaUnico: string
  /** continua a promessa do anúncio/post (liga com a inteligência de Divulgação). */
  coerenciaOrigem?: string
  i18nKey?: string
}

// -----------------------------------------------------
// 9. CALCULADORA ASSERTIVA (quando tipo === 'calculadora') — Chat 2 §2.9 / Spec §12.2
// -----------------------------------------------------
// A IA NÃO inventa fórmula; monta a partir da base de fórmulas validadas por
// nicho × região (com fonte). Corrige o bug de unidade/formatação (ex.: 13,00).

export interface ConfigCalculadora {
  /** id na base de fórmulas validadas — com fonte. */
  formulaId: string
  inputs: { id: string; unidade: string; min?: number; max?: number }[]
  /** ex.: 'ml'. */
  unidadeSaida: string
  /** ex.: 'copos de 250ml' (corrige o bug 13,00). */
  sufixoSaida?: string
  /** ex.: 0. */
  casasDecimais: number
  faixaSegura: { min: number; max: number }
  /** "caráter orientativo, não substitui avaliação profissional". */
  salvaguarda: string
}

// -----------------------------------------------------
// 10. O CONTRATO COMPLETO — Chat 2 §2.10
// -----------------------------------------------------

export interface YladaFlow {
  // --- Identidade ---
  id: string
  /** slug do fluxo na URL ylada.com/[perfil]/[handle] (Chat 3 §1). */
  handle?: string
  nome: string
  objetivo: string
  /** rede/empresa; liberal = tenant de si mesmo (Spec §11.2 / Chat 3 §2). */
  tenantId: string
  /** o profissional dono. */
  ownerId: string

  // --- Dimensões (etiquetas) ---
  dimensoes: DimensoesFluxo

  // --- Idioma/Região (i18n desde o nascimento, Spec §12.3) ---
  /** 'pt' | 'en' | 'es' (texto é chaveado; região ≠ idioma). */
  idiomaPadrao: string

  // --- As peças da planta ---
  abertura: Abertura
  /** o que o fluxo assume; runtime completa com a OrigemContexto real. */
  origemEsperada: Partial<OrigemContexto>
  /** cada uma com papel declarado (regra dura). */
  perguntas: PerguntaYlada[]
  separacao2080: RegraSeparacao2080
  /** só quando dimensoes.tipo === 'calculadora'. */
  calculadora?: ConfigCalculadora
  devolutiva: Devolutiva
  ganchosIndicacao: GanchoIndicacao[]
  handoff: Handoff

  // --- Catálogo/curadoria ---
  /** id do fluxo-base curado de onde este nasceu (biblioteca por segmento). */
  origemBiblioteca?: string
  tags: string[]
}

// -----------------------------------------------------
// 11. BIBLIOTECAS-BASE (a inteligência compartilhada) — Chat 2 §3 / Spec §4.1
// -----------------------------------------------------
// Existem UMA vez e são reusadas por todo nicho. A maioria dos usos é LOOKUP
// (recomendar pronto), não geração — base da economia de token (Spec §7).

/** Biblioteca de Separação 20/80 — regra que MUDA por funil. Determinística (pontuação). */
export interface Regra2080 {
  id: string
  funil: Funil
  corteDefault: number
  /** como ler o engajamento conforme o funil. */
  leitura:
    | {
        funil: 'vendas'
        /** "quanto é?", "como faço?". */
        sinaisPronto: string[]
        /** "depois", "sem tempo", some. */
        sinaisCurioso: string[]
      }
    | {
        funil: 'marketing'
        /** responde, pergunta de volta, pede mais. */
        sinaisPronto: string[]
        /** não responde → nutrir. */
        sinaisCurioso: string[]
      }
}
