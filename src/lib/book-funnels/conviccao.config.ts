import { BookFunnelConfig } from './types'

export const conviccaoConfig: BookFunnelConfig = {
  slug: 'conviccao',
  lang: 'pt',

  hero: {
    bookTitle: 'Inteligência de Convicção',
    bookSubtitle: 'A convicção que gera performance',
    headline: 'Você leu o livro. Agora vem a pergunta real.',
    subheadline:
      'Responda três perguntas rápidas e entenda exatamente onde a convicção está travando na sua realidade, e qual é o próximo passo.',
    ctaLabel: 'Fazer o diagnóstico →',
  },

  questions: [
    {
      id: 'q1',
      text: 'Como você atua hoje?',
      options: [
        { id: 'empresa', label: 'Dirijo uma empresa ou lidero uma equipe' },
        { id: 'rede', label: 'Lidero uma rede de vendedores ou distribuidores' },
        { id: 'autonomo', label: 'Atuo sozinho: profissional liberal ou autônomo' },
      ],
    },
    {
      id: 'q2',
      text: 'Qual é o maior travamento que você enxerga hoje?',
      options: [
        { id: 'sabem_nao_fazem', label: 'As pessoas sabem o que fazer, mas não fazem' },
        { id: 'conversa_nao_avanca', label: 'As conversas não avançam para o sim' },
        { id: 'nao_escala', label: 'O que funciona comigo não escala para os outros' },
      ],
    },
    {
      id: 'q3',
      text: 'Quando você pensa em convicção, na sua equipe ou em você mesmo: como é?',
      options: [
        { id: 'falta_clareza', label: 'Falta clareza sobre o próximo passo' },
        { id: 'tem_clareza_falta_acao', label: 'Tem clareza, mas falta a ação acontecer' },
        { id: 'tem_acao_sem_resultado', label: 'Tem ação, mas o resultado não aparece' },
      ],
    },
  ],

  // Perfil por combinação de respostas (q1-q2-q3)
  // Qualquer combinação com q1=empresa → método
  // Qualquer combinação com q1=rede → campo
  // Qualquer combinação com q1=autonomo → pergunta
  profileMap: {
    'empresa-sabem_nao_fazem-falta_clareza': 'metodo',
    'empresa-sabem_nao_fazem-tem_clareza_falta_acao': 'metodo',
    'empresa-sabem_nao_fazem-tem_acao_sem_resultado': 'metodo',
    'empresa-conversa_nao_avanca-falta_clareza': 'metodo',
    'empresa-conversa_nao_avanca-tem_clareza_falta_acao': 'metodo',
    'empresa-conversa_nao_avanca-tem_acao_sem_resultado': 'metodo',
    'empresa-nao_escala-falta_clareza': 'metodo',
    'empresa-nao_escala-tem_clareza_falta_acao': 'metodo',
    'empresa-nao_escala-tem_acao_sem_resultado': 'metodo',
    'rede-sabem_nao_fazem-falta_clareza': 'campo',
    'rede-sabem_nao_fazem-tem_clareza_falta_acao': 'campo',
    'rede-sabem_nao_fazem-tem_acao_sem_resultado': 'campo',
    'rede-conversa_nao_avanca-falta_clareza': 'campo',
    'rede-conversa_nao_avanca-tem_clareza_falta_acao': 'campo',
    'rede-conversa_nao_avanca-tem_acao_sem_resultado': 'campo',
    'rede-nao_escala-falta_clareza': 'campo',
    'rede-nao_escala-tem_clareza_falta_acao': 'campo',
    'rede-nao_escala-tem_acao_sem_resultado': 'campo',
    'autonomo-sabem_nao_fazem-falta_clareza': 'pergunta',
    'autonomo-sabem_nao_fazem-tem_clareza_falta_acao': 'pergunta',
    'autonomo-sabem_nao_fazem-tem_acao_sem_resultado': 'pergunta',
    'autonomo-conversa_nao_avanca-falta_clareza': 'pergunta',
    'autonomo-conversa_nao_avanca-tem_clareza_falta_acao': 'pergunta',
    'autonomo-conversa_nao_avanca-tem_acao_sem_resultado': 'pergunta',
    'autonomo-nao_escala-falta_clareza': 'pergunta',
    'autonomo-nao_escala-tem_clareza_falta_acao': 'pergunta',
    'autonomo-nao_escala-tem_acao_sem_resultado': 'pergunta',
  },
  defaultProfileId: 'metodo',

  profiles: [
    {
      id: 'metodo',
      title: 'O gap está no método, não nas pessoas',
      subtitle: 'Para quem lidera equipes e já deu tudo: treinamento, processo, metas',
      body: 'Você já investiu no conhecimento. O time sabe o que é esperado. Mas no momento da ação, algo trava. Você não consegue nomear o quê.\n\nO que falta não é mais informação. É convicção instalada: um caminho para conduzir isso de forma sistemática, conversa por conversa.\n\nEsse é exatamente o trabalho que André faz com líderes e empresas.',
      cta: 'Quero entender como isso se aplica à minha realidade',
    },
    {
      id: 'campo',
      title: 'A convicção está travada no campo',
      subtitle: 'Para quem lidera rede de vendas e vê o mesmo ciclo se repetir',
      body: 'Você conhece o problema: alguns avançam, a maioria trava. E quando você tenta ajudar, a explicação entra por um ouvido e sai pelo outro.\n\nO que falta não é motivação, não é um novo script. É a pergunta certa, feita para a pessoa certa na hora certa, que faz ela mesma enxergar o caminho.\n\nEssa é a diferença entre liderar com pressão e liderar com convicção.',
      cta: 'Quero conversar sobre isso',
    },
    {
      id: 'pergunta',
      title: 'A pergunta certa muda tudo',
      subtitle: 'Para profissionais que têm o expertise mas não conseguem fazer a conversa avançar',
      body: 'Você tem o conhecimento. Sabe que pode ajudar. Mas na hora da conversa, ou você explica demais e o cliente se afasta, ou fica aguardando uma abertura que não vem.\n\nO que muda não é o que você sabe. É como você abre a conversa. Uma pergunta que serve antes de vender faz o cliente caminhar sozinho para o sim.\n\nIsso é o que André ensina há 30 anos no campo.',
      cta: 'Quero entender como aplicar isso',
    },
  ],

  form: {
    intro: 'Fale um pouco do seu caso e o time Ylada entra em contato para uma orientação.',
    namePlaceholder: 'Seu nome',
    whatsappPlaceholder: 'WhatsApp com DDD',
    challengeLabel: 'Quem você é, qual é o seu problema hoje e o que quer alcançar?',
    challengePlaceholder: 'Ex: Lidero uma equipe de 12 vendedores. A maioria sabe o processo mas não bate meta. Quero entender o que está travando e como reverter isso nos próximos 90 dias.',
    submitLabel: 'Quero orientação do time Ylada →',
  },

  confirmation: {
    headline: 'Recebido.',
    body: 'O time Ylada vai entrar em contato pelo WhatsApp em breve.\n\nA conversa não vai ser um pitch. Vai ser uma pergunta. A mesma lógica do livro, aplicada ao seu caso.',
  },
}
