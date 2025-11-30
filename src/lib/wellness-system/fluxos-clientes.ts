/**
 * WELLNESS SYSTEM - Fluxos de Clientes
 * 
 * 20 fluxos completos para vendas de bebidas funcionais
 */

import { FluxoCliente, TipoKit } from '@/types/wellness-system'

export const fluxosClientes: FluxoCliente[] = [
  {
    id: 'energia-matinal',
    nome: 'Energia Matinal',
    objetivo: 'Identificar pessoas que acordam cansadas, sem energia e com dificuldade de começar o dia — despertando interesse imediato no kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você costuma acordar cansado(a) ou sem energia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanta dificuldade você tem para levantar da cama?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você precisa de café ou algo estimulante logo cedo?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Sente que suas manhãs rendem menos do que poderiam?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de começar o dia com mais ânimo e disposição?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Energia Matinal',
      descricao: 'Seu diagnóstico mostra que você pertence ao grupo de pessoas que precisam de uma ativação logo pela manhã.',
      sintomas: [
        'dificuldade de começar o dia',
        'sensação de lentidão nas primeiras horas',
        'dependência de café para acordar',
        'falta de foco pela manhã'
      ],
      beneficios: [
        'Uma bebida funcional matinal pode ajudar a estabilizar sua energia',
        'Melhorar foco e transformar o início do seu dia'
      ],
      mensagemPositiva: 'A boa notícia? Pequenas mudanças geram grandes resultados.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['energia', 'manhã', 'cansaço', 'foco']
  },
  {
    id: 'energia-tarde',
    nome: 'Energia da Tarde',
    objetivo: 'Identificar pessoas que sofrem com a queda de energia no meio da tarde e direcioná-las para o kit Energia ou produto fechado.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente uma queda de energia no meio da tarde?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso atrapalha seu dia?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você costuma recorrer a café, doce ou energético nesse horário?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Esse cansaço atrapalha seu trabalho, estudos ou humor?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de ter energia estável até o final do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Energia da Tarde',
      descricao: 'Seu diagnóstico mostra que você sofre com a queda de energia mais comum do dia: o "apagão das 15h".',
      sintomas: [
        'dificuldade de foco no fim da tarde',
        'sensação de peso ou lentidão',
        'vontade de comer doce para compensar',
        'cansaço acumulado do dia'
      ],
      beneficios: [
        'É possível estabilizar sua energia com algo simples, prático e diário'
      ],
      mensagemPositiva: 'A boa notícia? É possível estabilizar sua energia com algo simples, prático e diário.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['energia', 'tarde', 'queda-energia', 'produtividade']
  },
  {
    id: 'troca-cafe',
    nome: 'Troca Inteligente do Café',
    objetivo: 'Identificar pessoas que consomem café diariamente e mostrar uma alternativa mais funcional, estável e econômica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você toma café todos os dias?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'Quantas xícaras você consome por dia?',
        tipo: 'multipla_escolha',
        opcoes: ['1-2 xícaras', '3-4 xícaras', '5 ou mais xícaras']
      },
      {
        id: 'p3',
        texto: 'Você sente picos e quedas de energia depois do café?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Já tentou reduzir, mas não conseguiu?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Estaria aberto(a) a testar uma alternativa mais funcional e leve?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Troca Inteligente do Café',
      descricao: 'Seu diagnóstico mostra que você pertence ao grupo que mais se beneficia ao substituir parte ou todo o café por uma bebida funcional.',
      sintomas: [
        'picos e quedas de energia',
        'irritação ou ansiedade após excesso de café',
        'dificuldade de foco contínuo',
        'sensação de cansaço mesmo tomando café'
      ],
      beneficios: [
        'Existem soluções funcionais com energia mais estável',
        'Sem crash e com sensação melhor durante o dia'
      ],
      mensagemPositiva: 'A boa notícia? Existem soluções funcionais com energia mais estável, sem crash e com sensação melhor durante o dia.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['café', 'energia', 'substituição', 'estabilidade']
  },
  {
    id: 'anti-cansaco',
    nome: 'Anti-Cansaço Geral',
    objetivo: 'Identificar pessoas que vivem cansadas, com baixa energia ao longo do dia, e direcioná-las ao kit Energia como solução simples, leve e imediata.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente cansaço na maior parte do dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso está afetando sua rotina?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'O cansaço é maior de manhã, à tarde ou o dia todo?',
        tipo: 'multipla_escolha',
        opcoes: ['Manhã', 'Tarde', 'Dia todo']
      },
      {
        id: 'p4',
        texto: 'Você já tentou café, energético ou vitaminas sem muito resultado?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de ter mais energia e disposição para o dia inteiro?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Anti-Cansaço',
      descricao: 'Seu diagnóstico mostra que você está com sinais de cansaço contínuo — um dos motivos mais comuns pelas rotinas de hoje.',
      sintomas: [
        'falta de disposição logo cedo',
        'cansaço acumulado durante o dia',
        'dificuldade de foco',
        'sensação de peso físico ou mental'
      ],
      beneficios: [
        'Pequenas intervenções diárias com bebidas funcionais podem ajudar',
        'Melhorar sua disposição e estabilidade de energia'
      ],
      mensagemPositiva: 'A boa notícia? Pequenas intervenções diárias com bebidas funcionais podem ajudar a melhorar sua disposição e estabilidade de energia.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['cansaço', 'energia', 'disposição', 'rotina']
  },
  {
    id: 'rotina-puxada',
    nome: 'Rotina Puxada / Trabalho Intenso',
    objetivo: 'Identificar pessoas que têm uma carga de trabalho pesada, rotina intensa ou longas horas ativas — e conectá-las ao kit Energia como solução prática.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Seu dia costuma ser puxado ou acima da média?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanta energia você sente que precisa para cumprir sua rotina?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente queda de energia em algum horário específico?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Tem dificuldade de manter o foco durante a rotina intensa?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de ter mais energia e estabilidade ao longo do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Rotina Puxada',
      descricao: 'Seu diagnóstico indica que sua rotina exige mais energia do que você tem recebido naturalmente. Esse é um dos perfis mais beneficiados por bebidas funcionais.',
      sintomas: [
        'cansaço físico e mental',
        'dificuldade de foco após algumas horas',
        'sensação de desgaste antes do fim do dia',
        'necessidade de algo para sustentar a rotina'
      ],
      beneficios: [
        'Existem soluções funcionais que ajudam a manter energia estável',
        'Foco e disposição em rotinas intensas'
      ],
      mensagemPositiva: 'A boa notícia? Existem soluções funcionais que ajudam a manter energia estável, foco e disposição em rotinas intensas.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['trabalho', 'rotina', 'energia', 'produtividade']
  },
  {
    id: 'foco-concentracao',
    nome: 'Foco e Concentração',
    objetivo: 'Identificar pessoas que têm dificuldade de foco, produtividade e clareza mental, direcionando-as ao kit Energia como solução prática.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você tem dificuldade de manter o foco durante o dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso atrapalha seu trabalho ou estudos?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente a mente cansada ou pesada em algum horário?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Costuma procrastinar ou perder rendimento por falta de energia mental?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de ter mais clareza e produtividade?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Foco e Concentração',
      descricao: 'Seu diagnóstico indica sinais claros de baixa energia mental e oscilação de foco — muito comuns nas rotinas atuais.',
      sintomas: [
        'dificuldade de manter a atenção por longos períodos',
        'sensação de "mente embaralhada"',
        'cansaço mental no meio do dia',
        'perda de produtividade'
      ],
      beneficios: [
        'Bebidas funcionais podem ajudar a estabilizar energia',
        'Melhorar clareza mental'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais podem ajudar a estabilizar energia e melhorar clareza mental.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['foco', 'concentração', 'produtividade', 'clareza-mental']
  },
  {
    id: 'motoristas',
    nome: 'Motoristas / Longas Horas Dirigindo',
    objetivo: 'Identificar pessoas que passam muitas horas dirigindo (motoristas de aplicativo, caminhoneiros, entregadores, representantes) e oferecer uma solução de energia estável e segura.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você passa muitas horas dirigindo por dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto a falta de energia afeta sua direção?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente cansaço ou sonolência em algum horário específico?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Usa café, energéticos ou doces para tentar se manter alerta?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter energia mais estável durante toda a jornada?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Motorista de Longa Jornada',
      descricao: 'Seu diagnóstico mostra sinais de oscilação de energia durante a direção — algo muito comum em rotinas longas e cansativas.',
      sintomas: [
        'sensação de sonolência durante o dia',
        'dificuldade de foco em alguns trechos',
        'cansaço acumulado ao final do dia',
        'uso excessivo de café ou energéticos'
      ],
      beneficios: [
        'Bebidas funcionais podem ajudar a manter energia estável',
        'Foco por mais tempo, sem exageros nem picos'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais podem ajudar a manter energia estável e foco por mais tempo, sem exageros nem picos.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['motorista', 'direção', 'energia', 'alerta']
  },
  {
    id: 'metabolismo-lento',
    nome: 'Metabolismo Lento / Inchaço',
    objetivo: 'Identificar pessoas com sinais de metabolismo desacelerado, retenção e sensação de inchaço — direcionando-as ao kit Acelera.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente seu corpo inchado ou mais "pesado" do que o normal?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso te incomoda no dia a dia?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente que seu metabolismo está lento?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Costuma ter retenção ou sensação de estufamento?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de se sentir mais leve durante o dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Metabolismo Lento / Inchaço',
      descricao: 'Seu diagnóstico mostra sinais de retenção e lentidão metabólica — algo muito comum nas rotinas atuais.',
      sintomas: [
        'sensação de peso ou barriga estufada',
        'dificuldade de se sentir leve',
        'metabolismo mais lento pela manhã',
        'desconforto ao longo do dia'
      ],
      beneficios: [
        'Pequenas intervenções funcionais ajudam bastante',
        'Ativar o metabolismo e reduzir retenção'
      ],
      mensagemPositiva: 'A boa notícia? Pequenas intervenções funcionais ajudam bastante a ativar o metabolismo e reduzir retenção.'
    },
    kitRecomendado: 'acelera',
    cta: 'Falar agora com o Especialista',
    tags: ['metabolismo', 'inchaço', 'retenção', 'leveza']
  },
  {
    id: 'barriga-pesada',
    nome: 'Barriga Pesada / Estufa ao Longo do Dia',
    objetivo: 'Identificar pessoas que sentem desconforto abdominal, estufamento ou peso ao longo do dia — direcionando-as ao kit Acelera.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente sua barriga pesada ou estufada em algum momento do dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso te incomoda?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Isso acontece mais pela manhã, tarde ou noite?',
        tipo: 'multipla_escolha',
        opcoes: ['Manhã', 'Tarde', 'Noite']
      },
      {
        id: 'p4',
        texto: 'Você sente que isso piora após algumas refeições?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de se sentir mais leve ao longo do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Leveza e Bem‑Estar',
      descricao: 'Seu diagnóstico indica sinais de estufamento e desconforto recorrente — algo extremamente comum atualmente.',
      sintomas: [
        'sensação de barriga pesada',
        'inchaço ao longo do dia',
        'desconforto pós‑refeições',
        'dificuldade de se sentir leve'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a reduzir retenção',
        'Melhorar sensação de leveza e deixar o dia mais confortável'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a reduzir retenção, melhorar sensação de leveza e deixar o dia mais confortável.'
    },
    kitRecomendado: 'acelera',
    cta: 'Falar agora com o Especialista',
    tags: ['barriga', 'estufamento', 'leveza', 'conforto']
  },
  {
    id: 'retencao-inchaço',
    nome: 'Retenção / Inchaço nas Pernas e Rosto',
    objetivo: 'Identificar pessoas que sofrem com retenção perceptível — pernas, rosto, mãos ou corpo travado — e direcioná-las ao kit Acelera.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que seu corpo retém líquido com facilidade?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso te incomoda?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Em quais áreas você percebe mais retenção?',
        tipo: 'multipla_escolha',
        opcoes: ['Pernas', 'Barriga', 'Rosto', 'Mãos', 'Corpo todo']
      },
      {
        id: 'p4',
        texto: 'Essa sensação costuma piorar ao longo do dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de reduzir essa sensação e se sentir mais leve?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Retenção / Corpo Travado',
      descricao: 'Seu diagnóstico indica sinais de retenção — muito comum em dias quentes, longas horas sentadas/em pé ou alimentação irregular.',
      sintomas: [
        'sensação de "corpo parado"',
        'pernas ou rosto mais inchados',
        'dificuldade de se sentir leve',
        'aumento da retenção ao longo do dia'
      ],
      beneficios: [
        'Pequenos ajustes com bebidas funcionais ajudam',
        'Reduzir retenção e melhorar a sensação de leveza'
      ],
      mensagemPositiva: 'A boa notícia? Pequenos ajustes com bebidas funcionais ajudam a reduzir retenção e melhorar a sensação de leveza.'
    },
    kitRecomendado: 'acelera',
    cta: 'Falar agora com o Especialista',
    tags: ['retenção', 'inchaço', 'pernas', 'rosto', 'leveza']
  },
  {
    id: 'desconforto-pos-refeicao',
    nome: 'Desconforto Após as Refeições',
    objetivo: 'Identificar pessoas que sentem desconforto, estufamento e lentidão após as refeições — direcionando-as ao kit Acelera.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você costuma sentir estufamento depois de comer?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso atrapalha seu bem-estar?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Isso acontece após quais refeições?',
        tipo: 'multipla_escolha',
        opcoes: ['Café da manhã', 'Almoço', 'Jantar', 'Todas']
      },
      {
        id: 'p4',
        texto: 'A sensação melhora só depois de horas?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de se sentir mais leve após as refeições?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Pós-Refeição / Estufamento',
      descricao: 'Seu diagnóstico indica desconforto digestivo leve, comum em rotinas corridas e padrões alimentares irregulares.',
      sintomas: [
        'sensação de barriga "cheia" ou pesada após comer',
        'lentidão nas horas seguintes',
        'queda de energia',
        'incômodo diário'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a ativar o metabolismo',
        'Reduzir retenção e melhorar a leveza após as refeições'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a ativar o metabolismo, reduzir retenção e melhorar a leveza após as refeições.'
    },
    kitRecomendado: 'acelera',
    cta: 'Falar agora com o Especialista',
    tags: ['refeições', 'estufamento', 'leveza', 'digestão']
  },
  {
    id: 'inchaço-manha',
    nome: 'Inchaço ao Acordar / Manhã "Pesada"',
    objetivo: 'Identificar pessoas que acordam com rosto, mãos, barriga ou corpo mais inchados — direcionando-as ao kit Acelera como primeira ação do dia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você costuma acordar se sentindo inchado(a)?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso te incomoda pela manhã?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Em quais áreas você percebe mais inchaço ao acordar?',
        tipo: 'multipla_escolha',
        opcoes: ['Rosto', 'Barriga', 'Mãos', 'Corpo todo']
      },
      {
        id: 'p4',
        texto: 'Essa sensação melhora só depois de horas?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Você gostaria de acordar mais leve e disposto(a)?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Retenção Matinal / Inchaço Ao Acordar',
      descricao: 'Seu diagnóstico indica sinais de retenção e acúmulo noturno — algo extremamente comum em rotinas agitadas, estresse e alimentação irregular.',
      sintomas: [
        'rosto inchado ao acordar',
        'barriga mais estufada pela manhã',
        'corpo pesado nas primeiras horas',
        'lentidão ao iniciar o dia'
      ],
      beneficios: [
        'Uma ativação metabólica leve ao acordar ajuda muito',
        'Reduzir retenção matinal e melhorar a sensação de leveza'
      ],
      mensagemPositiva: 'A boa notícia? Uma ativação metabólica leve ao acordar ajuda muito a reduzir retenção matinal e melhorar a sensação de leveza.'
    },
    kitRecomendado: 'acelera',
    cta: 'Falar agora com o Especialista',
    tags: ['manhã', 'inchaço', 'retenção', 'acordar']
  },
  {
    id: 'ansiedade-doce',
    nome: 'Ansiedade por Doce / Fome Emocional',
    objetivo: 'Identificar pessoas que têm picos de vontade de doce, fome emocional ou queda de energia que leva ao consumo excessivo — direcionando-as ao kit Acelera ou Energia conforme o perfil.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você costuma ter vontade de comer doce ao longo do dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão forte é essa vontade quando aparece?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Isso acontece mais em qual horário?',
        tipo: 'multipla_escolha',
        opcoes: ['Manhã', 'Tarde', 'Noite']
      },
      {
        id: 'p4',
        texto: 'Você sente queda de energia antes da vontade de doce?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter mais controle e estabilidade ao longo do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Fome Emocional / Vontade de Doce',
      descricao: 'Seu diagnóstico mostra sinais de oscilação de energia e estímulos emocionais que aumentam a vontade de doce — algo extremamente comum na rotina atual.',
      sintomas: [
        'vontade de doce no meio da tarde ou à noite',
        'sensação de "preciso de algo agora"',
        'dificuldade de controlar a fome emocional',
        'energia irregular ao longo do dia'
      ],
      beneficios: [
        'Bebidas funcionais podem ajudar a estabilizar energia',
        'Reduzir picos emocionais e controlar melhor essas sensações'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais podem ajudar a estabilizar energia, reduzir picos emocionais e controlar melhor essas sensações.'
    },
    kitRecomendado: 'ambos', // Sistema escolhe automaticamente
    cta: 'Falar agora com o Especialista',
    tags: ['doce', 'fome-emocional', 'controle', 'ansiedade']
  },
  {
    id: 'mente-cansada',
    nome: 'Mente Cansada / Cabeça Pesada',
    objetivo: 'Identificar pessoas com sinais de fadiga mental, confusão, lentidão cognitiva e sensação de "cabeça pesada" — direcionando-as ao kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você costuma sentir sua mente pesada ou cansada durante o dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso afeta sua produtividade?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente dificuldade de organizar pensamentos ou manter clareza mental?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Isso piora em algum horário específico?',
        tipo: 'multipla_escolha',
        opcoes: ['Manhã', 'Tarde', 'Noite', 'Dia todo']
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter mais leveza e clareza mental ao longo do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Mente Cansada / Clareza Baixa',
      descricao: 'Seu diagnóstico revela sinais de fadiga mental, comuns em pessoas com rotina acelerada, multitarefas e excesso de responsabilidades.',
      sintomas: [
        'mente pesada ao longo do dia',
        'dificuldade de organizar pensamentos',
        'sensação de confusão mental',
        'foco limitado e produtividade reduzida'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a melhorar foco',
        'Clareza mental e estabilidade de energia'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a melhorar foco, clareza mental e estabilidade de energia.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['mente', 'clareza', 'fadiga-mental', 'produtividade']
  },
  {
    id: 'falta-disposicao-treinar',
    nome: 'Falta de Disposição para Treinar',
    objetivo: 'Identificar pessoas que querem treinar, caminhar ou fazer atividade física, mas não conseguem manter constância por falta de energia — direcionando-as ao kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente dificuldade de encontrar disposição para treinar?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto isso atrapalha sua rotina de atividade física?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Em qual horário do dia você sente mais dificuldade de treinar?',
        tipo: 'multipla_escolha',
        opcoes: ['Manhã', 'Tarde', 'Noite']
      },
      {
        id: 'p4',
        texto: 'Você costuma adiar ou desistir por falta de energia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de sentir mais disposição para treinar com regularidade?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Baixa Disposição Para Treinar',
      descricao: 'Seu diagnóstico mostra sinais de falta de energia para iniciar ou manter a rotina de atividade física — algo extremamente comum.',
      sintomas: [
        'dificuldade de iniciar os exercícios',
        'sensação de pouca energia antes do treino',
        'falta de constância por cansaço',
        'frustração por não conseguir manter ritmo'
      ],
      beneficios: [
        'Bebidas funcionais podem ajudar a aumentar disposição',
        'Foco e energia antes da atividade física'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais podem ajudar a aumentar disposição, foco e energia antes da atividade física.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['treino', 'exercício', 'disposição', 'atividade-física']
  },
  {
    id: 'trabalho-noturno',
    nome: 'Quem Trabalha à Noite / Madrugada',
    objetivo: 'Identificar pessoas que trabalham em horários invertidos (noite/madrugada) e sofrem com cansaço, sonolência e baixa energia — direcionando-as ao kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você trabalha à noite ou na madrugada?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto a falta de energia atrapalha seu desempenho?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente sonolência ou queda de foco durante o trabalho?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Você usa café, energético ou açúcar para tentar se manter acordado(a)?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter energia mais estável nesses horários?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Madrugada / Turno Invertido',
      descricao: 'Seu diagnóstico indica sinais de oscilação de energia em horários fora do padrão — algo extremamente comum para quem trabalha à noite.',
      sintomas: [
        'dificuldade de se manter acordado(a)',
        'sonolência em horários críticos',
        'baixa produtividade no fim do turno',
        'desgaste físico e mental acumulado'
      ],
      beneficios: [
        'Bebidas funcionais podem ajudar a manter energia',
        'Foco mais estáveis, mesmo em horários invertidos'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais podem ajudar a manter energia e foco mais estáveis, mesmo em horários invertidos.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['noite', 'madrugada', 'turno', 'energia']
  },
  {
    id: 'rotina-estressante',
    nome: 'Rotina Estressante / Vida no Limite',
    objetivo: 'Identificar pessoas que vivem sob estresse constante, pressão, excesso de tarefas e sensação de esgotamento — direcionando-as ao kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que sua rotina diária é estressante ou sobrecarregada?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto o estresse impacta sua energia?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente esgotamento mental ou físico ao longo do dia?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Sua cabeça parece "carregada" ou sem clareza?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter mais energia e estabilidade para lidar com o dia a dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Vida no Limite / Estresse Alto',
      descricao: 'Seu diagnóstico indica sinais de desgaste e oscilação de energia — algo extremamente comum em rotinas aceleradas.',
      sintomas: [
        'irritação ou nervosismo durante o dia',
        'cansaço mental mais forte que o físico',
        'dificuldade de tomar decisões',
        'sensação de sobrecarga constante'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a melhorar disposição',
        'Clareza e estabilidade energética mesmo em dias estressantes'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a melhorar disposição, clareza e estabilidade energética mesmo em dias estressantes.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['estresse', 'sobrecarga', 'esgotamento', 'energia']
  },
  {
    id: 'maes-ocupadas',
    nome: 'Mães Ocupadas / Rotina Intensa',
    objetivo: 'Identificar mães que lidam com cansaço, falta de tempo, múltiplas tarefas e energia irregular — direcionando-as ao kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Você sente que sua rotina é muito corrida?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto o cansaço atrapalha seu dia como mãe?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente queda de energia em algum horário específico?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Você tem dificuldade de cuidar de tudo sem se sentir esgotada?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter mais energia e leveza para sua rotina?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Mãe Ocupada / Energia Irregular',
      descricao: 'Seu diagnóstico mostra sinais de cansaço acumulado — muito comum entre mães que cuidam da casa, filhos, trabalho e tudo ao mesmo tempo.',
      sintomas: [
        'falta de energia pela manhã',
        'cansaço acumulado durante o dia',
        'irritação por sobrecarga',
        'dificuldade de manter foco ou disposição'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a melhorar energia',
        'Foco e leveza mesmo em rotinas extremamente corridas'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a melhorar energia, foco e leveza mesmo em rotinas extremamente corridas.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['mães', 'rotina', 'cansaço', 'multitarefas']
  },
  {
    id: 'fim-tarde-sem-energia',
    nome: 'Fim de Tarde sem Energia',
    objetivo: 'Identificar pessoas que chegam no fim da tarde completamente desgastadas, com baixa energia para lidar com família, responsabilidade e rotina — direcionando-as ao Kit Energia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'No fim da tarde, você sente que sua energia despenca?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quão difícil é manter disposição depois das 17h?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você sente irritação ou cansaço acumulado nesse horário?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Você costuma perder o ânimo para tarefas simples à noite?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de ter mais energia para aproveitar melhor o final do dia?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Energia Baixa no Fim da Tarde',
      descricao: 'Seu diagnóstico indica queda de energia recorrente no fim do dia — algo muito comum devido à rotina intensa, alimentação irregular e excesso de responsabilidades.',
      sintomas: [
        'sensação de estar "zerado(a)" depois das 17h',
        'falta de ânimo para cozinhar, treinar ou cuidar da casa',
        'irritação por cansaço',
        'vontade de deitar e não fazer mais nada'
      ],
      beneficios: [
        'Bebidas funcionais ajudam a manter energia mais estável',
        'Reduzir o desgaste acumulado e melhorar a qualidade do final do dia'
      ],
      mensagemPositiva: 'A boa notícia? Bebidas funcionais ajudam a manter energia mais estável, reduzindo o desgaste acumulado e melhorando a qualidade do final do dia.'
    },
    kitRecomendado: 'energia',
    cta: 'Falar agora com o Especialista',
    tags: ['fim-tarde', 'cansaço', 'desgaste', 'energia']
  },
  {
    id: 'sedentarismo',
    nome: 'Estilo de Vida Sedentário',
    objetivo: 'Identificar pessoas com rotina parada, baixa movimentação e sensação de corpo pesado — direcionando-as ao kit Energia ou Acelera como primeiro passo simples.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Sua rotina é mais parada ou sem muita atividade física?',
        tipo: 'sim_nao'
      },
      {
        id: 'p2',
        texto: 'De 0 a 10, quanto você sente que isso afeta sua disposição?',
        tipo: 'escala',
        escalaMin: 0,
        escalaMax: 10
      },
      {
        id: 'p3',
        texto: 'Você se sente cansado(a) mesmo sem fazer muito esforço?',
        tipo: 'sim_nao'
      },
      {
        id: 'p4',
        texto: 'Sente seu corpo pesado ou sem energia para começar mudanças?',
        tipo: 'sim_nao'
      },
      {
        id: 'p5',
        texto: 'Gostaria de dar um primeiro passo leve para aumentar sua disposição?',
        tipo: 'sim_nao'
      }
    ],
    diagnostico: {
      titulo: 'Perfil Sedentário / Baixa Energia',
      descricao: 'Seu diagnóstico mostra sinais clássicos de sedentarismo: baixa disposição, corpo pesado e dificuldade de iniciar mudanças.',
      sintomas: [
        'cansaço mesmo sem esforço',
        'dificuldade de começar qualquer atividade',
        'sensação de peso ao longo do dia',
        'falta de motivação para movimentar o corpo'
      ],
      beneficios: [
        'Um primeiro passo leve já muda sua energia e disposição rapidamente',
        'Bebidas funcionais tornam isso mais fácil'
      ],
      mensagemPositiva: 'A boa notícia? Um primeiro passo leve já muda sua energia e disposição rapidamente — e bebidas funcionais tornam isso mais fácil.'
    },
    kitRecomendado: 'ambos', // Sistema escolhe automaticamente
    cta: 'Falar agora com o Especialista',
    tags: ['sedentarismo', 'disposição', 'primeiro-passo', 'energia']
  }
]

export function getFluxoById(id: string): FluxoCliente | undefined {
  return fluxosClientes.find(fluxo => fluxo.id === id)
}

export function getFluxosByTag(tag: string): FluxoCliente[] {
  return fluxosClientes.filter(fluxo => fluxo.tags.includes(tag))
}

export function getFluxosByKit(kit: TipoKit): FluxoCliente[] {
  return fluxosClientes.filter(fluxo => fluxo.kitRecomendado === kit)
}

