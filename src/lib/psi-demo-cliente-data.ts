/**
 * Perguntas de exemplo no lugar de quem busca psicologia (visão da/o psicóloga/o).
 * Tom reflexivo, sem simular diagnóstico clínico.
 */

export type PsiDemoNicho =
  | 'ansiedade_rotina'
  | 'humor_tristeza'
  | 'relacionamentos'
  | 'trabalho_burnout'
  | 'autoestima'
  | 'luto_mudanca'

export interface PsiDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface PsiDemoNichoClienteConfig {
  value: PsiDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: PsiDemoPerguntaCliente[]
}

const NICHOS: PsiDemoNichoClienteConfig[] = [
  {
    value: 'ansiedade_rotina',
    label: 'Ansiedade e rotina',
    tituloQuiz: 'Cabeça que não desliga e o corpo que cobra a conta?',
    subtitulo: 'Organize o que sente em poucos toques. Não é avaliação clínica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais pesa no seu dia a dia agora?',
        opcoes: [
          { label: 'Coração acelerado, preocupação constante', valor: 0 },
          { label: 'Dificuldade para “desligar” a cabeça', valor: 1 },
          { label: 'Irritação ou tensão sem motivo claro', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso interfere em sono, trabalho ou relações?',
        opcoes: [
          { label: 'Sim, em mais de um desses', valor: 0 },
          { label: 'Um pouco, depende do dia', valor: 1 },
          { label: 'Quero entender melhor antes de dizer', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca neste momento?',
        opcoes: [
          { label: 'Ferramentas pra lidar com a ansiedade', valor: 0 },
          { label: 'Espaço pra falar com alguém de confiança', valor: 1 },
          { label: 'Entender o que está acontecendo comigo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientação e pensar com calma', valor: 1 },
          { label: 'Agendar primeira sessão', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'humor_tristeza',
    label: 'Humor baixo ou sensação de vazio',
    tituloQuiz: 'Tristeza ou vazio que você minimiza até não dar mais?',
    subtitulo: 'Nomeie o que pesa antes da primeira conversa. Não substitui avaliação profissional.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Como você descreveria seu humor ultimamente?',
        opcoes: [
          { label: 'Tristeza frequente ou falta de ânimo', valor: 0 },
          { label: 'Vazio: nem mal, nem bem', valor: 1 },
          { label: 'Oscila muito ao longo do dia ou da semana', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Há quanto tempo você se sente assim?',
        opcoes: [
          { label: 'Algumas semanas', valor: 0 },
          { label: 'Vários meses', valor: 1 },
          { label: 'É difícil dizer; quero ajuda pra entender', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do processo terapêutico?',
        opcoes: [
          { label: 'Voltar a sentir prazer nas coisas', valor: 0 },
          { label: 'Organizar pensamentos e emoções', valor: 1 },
          { label: 'Ter um espaço seguro pra falar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com a profissional', valor: 0 },
          { label: 'Receber informações e decidir depois', valor: 1 },
          { label: 'Marcar horário', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'relacionamentos',
    label: 'Relacionamentos e vínculos',
    tituloQuiz: 'Mesma briga, mesmo silêncio — e você cansou de rodar o disco?',
    subtitulo: 'Contexto afetivo em claro — menos tempo perdido no “de onde começo”.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda nas suas relações hoje?',
        opcoes: [
          { label: 'Brigas repetidas ou comunicação difícil', valor: 0 },
          { label: 'Medo de abandono ou dependência emocional', valor: 1 },
          { label: 'Solidão mesmo perto de alguém', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Essa questão envolve principalmente:',
        opcoes: [
          { label: 'Parceiro ou família', valor: 0 },
          { label: 'Amizades ou trabalho', valor: 1 },
          { label: 'Vários contextos ao mesmo tempo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer mudar primeiro?',
        opcoes: [
          { label: 'Como eu reajo e me comunico', valor: 0 },
          { label: 'Entender padrões que se repetem', valor: 1 },
          { label: 'Decidir com mais clareza sobre vínculos', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Tirar dúvidas sobre o processo', valor: 1 },
          { label: 'Agendar sessão', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'trabalho_burnout',
    label: 'Trabalho, estudo e esgotamento',
    tituloQuiz: 'Esgotamento que parece rotina até virar seu novo normal?',
    subtitulo: 'Carga e equilíbrio em foco. Não é laudo.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais desgasta você hoje?',
        opcoes: [
          { label: 'Carga de trabalho ou prazos', valor: 0 },
          { label: 'Ambiente tóxico ou pressão constante', valor: 1 },
          { label: 'Estudo ou transição de carreira', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você nota sintomas no corpo ou na cabeça?',
        opcoes: [
          { label: 'Cansaço extremo, dificuldade de concentração', valor: 0 },
          { label: 'Irritação, insônia ou mudança de apetite', valor: 1 },
          { label: 'Um pouco de tudo, misturado', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca com apoio psicológico?',
        opcoes: [
          { label: 'Limites e organização emocional', valor: 0 },
          { label: 'Decidir mudanças com segurança', valor: 1 },
          { label: 'Alívio e espaço pra ventilar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Material e depois sessão', valor: 1 },
          { label: 'Agendar avaliação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'autoestima',
    label: 'Autoestima e autoconhecimento',
    tituloQuiz: 'Autocrítica em alta e reconhecimento em falta — mesmo tentando?',
    subtitulo: 'Diga o que quer mudar por dentro — ela já chega alinhada.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda em relação a você?',
        opcoes: [
          { label: 'Crítica interna forte', valor: 0 },
          { label: 'Comparação com os outros', valor: 1 },
          { label: 'Dificuldade de dizer não ou pedir ajuda', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso aparece mais em qual área?',
        opcoes: [
          { label: 'Corpo e aparência', valor: 0 },
          { label: 'Trabalho ou estudo', valor: 1 },
          { label: 'Relações e pertencimento', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria diferente se isso melhorasse?',
        opcoes: [
          { label: 'Mais segurança nas minhas escolhas', valor: 0 },
          { label: 'Menos culpa e mais presença', valor: 1 },
          { label: 'Quero descobrir no processo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com a profissional', valor: 0 },
          { label: 'Receber informações primeiro', valor: 1 },
          { label: 'Marcar primeira sessão', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'luto_mudanca',
    label: 'Luto, mudança ou fase nova',
    tituloQuiz: 'Mudança grande e ninguém te ensinou a atravessar isso só?',
    subtitulo: 'Dê nome ao que está vivo agora — primeiro passo mais honesto.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que está em movimento na sua vida agora?',
        opcoes: [
          { label: 'Perda de alguém ou de algo importante', valor: 0 },
          { label: 'Mudança de cidade, trabalho ou relação', valor: 1 },
          { label: 'Fase nova (filho, casamento, separação…)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como você tem lidado com isso?',
        opcoes: [
          { label: 'Me fecho ou evito sentir', valor: 0 },
          { label: 'Explodo ou oscilo muito', valor: 1 },
          { label: 'Tento segurar sozinho, mas está pesado', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do acompanhamento?',
        opcoes: [
          { label: 'Processar com alguém que escuta de verdade', valor: 0 },
          { label: 'Reorganizar minha rotina e emoções', valor: 1 },
          { label: 'Entender o que é “normal” nessa fase', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber direcionamento por escrito', valor: 1 },
          { label: 'Agendar sessão', valor: 2 },
        ],
      },
    ],
  },
]

export const PSI_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getPsiDemoClienteConfig(nicho: string | null | undefined): PsiDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isPsiDemoNicho(s: string): s is PsiDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
