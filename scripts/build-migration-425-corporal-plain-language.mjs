/**
 * Gera migrations/425-pro-estetica-corporal-diagnosis-plain-language-refresh.sql
 * a partir de 401–405 + substituições de tom (linguagem leiga, menos “venda” no diagnóstico).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const migDir = path.join(root, 'migrations')
const outPath = path.join(migDir, '425-pro-estetica-corporal-diagnosis-plain-language-refresh.sql')

function getValuesTuples(sql) {
  const i = sql.indexOf('VALUES')
  if (i < 0) throw new Error('VALUES not found')
  const rest = sql.slice(i + 'VALUES'.length).trimStart()
  const end = rest.lastIndexOf(');')
  if (end < 0) throw new Error('); not found')
  // Incluir o `)` que fecha o último tuplo (`  );` no ficheiro fonte — senão o INSERT fica inválido.
  return rest.slice(0, end + 1).trimEnd()
}

const files = [
  '401-pro-estetica-corporal-packaged-diagnosis-bloco-estrategico.sql',
  '402-pro-estetica-corporal-packaged-diagnosis-bloco-tecnicas.sql',
  '403-pro-estetica-corporal-packaged-diagnosis-captacao-mapa-massagem.sql',
  '404-pro-estetica-corporal-packaged-diagnosis-quizzes-biblioteca-mista.sql',
  '405-pro-estetica-corporal-packaged-diagnosis-calculadoras.sql',
]

const tuples = files
  .map((f) => getValuesTuples(fs.readFileSync(path.join(migDir, f), 'utf8')))
  .join(',\n')

/** Ordem importa: substituir frases mais longas primeiro. */
const replacements = [
  // Duplicata 402 / 404 (moderado retenção & drenagem)
  [
    `'Protocolo isolado sem hábito alinhado costuma dar resultado fraco ou oscilante.'`,
    `'Tratamentos só na clínica, sem olhar sono, líquidos e rotina, costumam dar alívio que não se mantém.'`,
  ],
  [
    `'Protocolo isolado sem hábito alinhado costuma dar resultado fraco ou instável.'`,
    `'Tratamentos só na clínica, sem olhar sono, líquidos e rotina, costumam dar alívio que não se mantém.'`,
  ],
  [
    `'Protocolo isolado de hábito costuma dar resultado frustrante.'`,
    `'Só contar com a clínica, sem ajustar o que você faz em casa, costuma manter a mesma sensação voltando.'`,
  ],
  [
    `'main_blocker', 'Protocolo avulso sem hábito alinhado costuma dar resultado fraco ou instável.'`,
    `'main_blocker', 'Só ir à clínica de vez em quando, sem encaixar sono, líquidos e rotina, costuma deixar o inchaço voltando ao mesmo padrão.'`,
  ],
  [
    `'consequence', 'Sem plano, tende a repetir alívio pontual e volta da mesma sensação.'`,
    `'consequence', 'Sem uma linha que una rotina e orientação profissional, tende a repetir alívio pontual e a mesma sensação volta.'`,
  ],
  [
    `'frase_identificacao', 'Se você se reconhece aqui, precisa de escuta ativa e plano claro, não improviso.'`,
    `'frase_identificacao', 'Se você se reconhece aqui, precisa de escuta ativa e próximos passos claros, não improviso.'`,
  ],
  // b1000038 moderado (título + dica + CTA + WhatsApp)
  [
    `'profile_title', 'Padrão de inchaço mais frequente — vale fechar plano com profissional'`,
    `'profile_title', 'Inchaço que volta com frequência — faz sentido olhar rotina e corpo com calma'`,
  ],
  [
    `'Menos sessões bem espaçadas com direção costumam vencer maratona sem critério.'`,
    `'Às vezes menos idas à clínica, mas com uma linha clara, ajudam mais do que muitas idas sem norte.'`,
  ],
  [
    `'cta_text', 'Quero plano de drenagem / hábitos na consulta'`,
    `'cta_text', 'Quero entender meu inchaço e próximos passos'`,
  ],
  [
    `'Oi! Fiz o questionário sobre retenção; o perfil saiu moderado. Quero avaliação para combinar protocolo corporal, ritmo e o que fazer entre sessões.'`,
    `'Oi! Fiz o questionário sobre retenção; o perfil saiu moderado. Quero conversar com vocês para entender o que combina com meu caso e como encaixar rotina e cuidados.'`,
  ],
  // b1000038 leve — menos “pacote”
  [
    `'frase_identificacao', 'Se você se identificou, quer perceber se o que sente “combina” com protocolo corporal antes de fechar pacote.'`,
    `'frase_identificacao', 'Se você se identificou, quer entender melhor o que o corpo está sinalizando antes de decidir qualquer coisa.'`,
  ],
  [
    `'cta_text', 'Quero avaliar inchaço e possível protocolo'`,
    `'cta_text', 'Quero tirar dúvidas sobre essa sensação de inchaço'`,
  ],
  [
    `'Oi! Fiz o questionário sobre retenção ou inchaço. O resultado saiu exploratório — quero marcar avaliação corporal para alinhar hábitos, drenagem ou próximo passo com vocês.'`,
    `'Oi! Fiz o questionário sobre retenção ou inchaço. O resultado saiu exploratório — quero marcar um horário para conversar e entender o que faz sentido no meu caso.'`,
  ],
  // b1000121 moderado
  [
    `'profile_title', 'Indecisão com impacto no dia a dia — vale travar com plano'`,
    `'profile_title', 'Indecisão que já pesa no dia a dia — faz sentido ter uma leitura clara'`,
  ],
  [
    `'profile_summary', 'As respostas mostram que a dúvida entre abordagens já pesa no espelho, na roupa ou na confiança. Um direcionamento profissional costuma poupar tempo e sessões mal encaixadas.'`,
    `'profile_summary', 'As respostas mostram que a dúvida entre abordagens já pesa no espelho, na roupa ou na confiança. Uma conversa guiada costuma trazer clareza sobre por onde começar — sem empilhar tudo de uma vez.'`,
  ],
  [
    `'main_blocker', 'O custo é oscilação: melhora pontual sem critério — o padrão corporal volta ao mesmo ponto.'`,
    `'main_blocker', 'O que cansa é a oscilação: melhora um pouco e a sensação volta, porque falta uma linha que una rotina, descanso e o que você faz no corpo.'`,
  ],
  [
    `'growth_potential', 'Use o resultado para pedir uma avaliação que una objetivo, região e sensibilidade — e só então fechar frequência e combinação de procedimentos.'`,
    `'growth_potential', 'Use o resultado para pedir uma conversa que una objetivo, região e sensibilidade — e só depois pensar em frequência ou combinações, com calma.'`,
  ],
  [
    `'dica_rapida', 'Evite fechar pacote grande antes de alinhar sequência; ordem correta costuma importar mais que volume.'`,
    `'dica_rapida', 'Antes de assumir muitos compromissos de uma vez, alinhar a sequência costuma importar mais que “volume” de coisas diferentes.'`,
  ],
  [
    `'Oi! Fiz o questionário sobre prioridade corporal (drenagem/modeladora/tecnologia). O resultado indica que preciso alinhar sequência e frequência com avaliação — podemos agendar?'`,
    `'Oi! Fiz o questionário sobre prioridade no corpo (drenagem/modeladora/tecnologia). O resultado mostra que preciso de clareza na sequência — podemos marcar um horário para conversar?'`,
  ],
  // b1000121 leve CTA
  [
    `'cta_text', 'Quero alinhar por onde começar no protocolo'`,
    `'cta_text', 'Quero entender por onde começar no meu caso'`,
  ],
  [
    `'Oi! Fiz o questionário sobre drenagem, modeladora ou tecnologia corporal. O resultado saiu no tom exploratório e quero marcar avaliação para definir ordem e protocolo com vocês.'`,
    `'Oi! Fiz o questionário sobre drenagem, modeladora ou tecnologia. O resultado saiu exploratório — quero marcar um horário para definir ordem e próximos passos com vocês.'`,
  ],
  // b1000121 urgente — menos “plano claro” repetido
  [
    `'Oi! Fiz o questionário de prioridade corporal e o resultado saiu com tom de urgência em ter plano claro. Quero agendar avaliação o quanto antes para não improvisar procedimentos.'`,
    `'Oi! Fiz o questionário de prioridade no corpo e o resultado saiu urgente. Quero agendar avaliação o quanto antes para não improvisar com procedimentos.'`,
  ],
  // b1000122 moderado — “plano com profissional”
  [
    `'profile_summary', 'As respostas indicam que a decisão não é só técnica — afeta como você se sente no corpo no dia a dia. Um plano com profissional costuma reduzir ansiedade e “comparação mental” entre procedimentos.'`,
    `'profile_summary', 'As respostas indicam que a decisão não é só técnica — afeta como você se sente no corpo no dia a dia. Ter uma leitura profissional costuma reduzir ansiedade e a “comparação mental” entre procedimentos.'`,
  ],
  [
    `'main_blocker', 'Sem critério, o risco é trocar de estratégia antes do tempo de resposta do protocolo.'`,
    `'main_blocker', 'Sem critério, o risco é trocar de estratégia antes do corpo ter tempo de responder ao que já foi feito.'`,
  ],
  // b1000122 urgente
  [
    `'profile_title', 'Necessidade forte de definir tecnologia e protocolo — priorize avaliação'`,
    `'profile_title', 'Necessidade forte de definir tecnologia — priorize uma conversa presencial ou por vídeo'`,
  ],
  [
    `'dica_rapida', 'Protocolo corporal sério combina intervalos e preparação de tecido; “sessão única milagrosa” costuma ser narrativa arriscada.'`,
    `'dica_rapida', 'Tratamento sério combina intervalos e preparação da pele; promessa de “sessão única milagrosa” costuma ser narrativa arriscada.'`,
  ],
  [
    `'Oi! Fiz o questionário sobre tecnologia corporal; o resultado indica alta necessidade de definir protocolo com segurança. Quero avaliação prioritária — qual o próximo horário?'`,
    `'Oi! Fiz o questionário sobre tecnologia corporal; o resultado indica que preciso definir próximos passos com segurança. Quero avaliação prioritária — qual o próximo horário?'`,
  ],
  // b1000124 leve — “protocolo em camadas” título
  [
    `'profile_title', 'Protocolo em camadas: ainda dá para simplificar antes de empilhar'`,
    `'profile_title', 'Muitas frentes ao mesmo tempo — ainda dá para simplificar antes de empilhar'`,
  ],
  [
    `'growth_potential', 'Na avaliação, peça um plano em fases com marcos simples (ex.: 30 / 60 dias) — sem promessa de milagre.'`,
    `'growth_potential', 'Na avaliação, peça uma organização em fases com marcos simples (ex.: 30 / 60 dias) — sem promessa de milagre.'`,
  ],
  [
    `'cta_text', 'Quero um plano em fases na avaliação'`,
    `'cta_text', 'Quero organizar por fases na avaliação'`,
  ],
  [
    `'Oi! Fiz o questionário sobre camadas do protocolo corporal. O resultado sugere organizar frentes em sequência — quero avaliação para montar plano em fases.'`,
    `'Oi! Fiz o questionário sobre camadas de cuidado no corpo. O resultado sugere organizar frentes em sequência — quero avaliação para montar isso em fases.'`,
  ],
  // b1000124 urgente
  [
    `'profile_title', 'Momento de travar plano — evite mais uma rodada de tentativa e erro'`,
    `'profile_title', 'Hora de parar e reorganizar — evite mais uma rodada de tentativa e erro'`,
  ],
  [
    `'cta_text', 'Quero reavaliar protocolo com urgência'`,
    `'cta_text', 'Quero reavaliar o que estou fazendo no corpo'`,
  ],
  // b1000126 leve/moderado
  [
    `'profile_title', 'Inchaço ou “corpo pesado”: hábitos e protocolo ainda alinháveis com calma'`,
    `'profile_title', 'Inchaço ou “corpo pesado”: hábitos e cuidados ainda dá para alinhar com calma'`,
  ],
  [
    `'cta_text', 'Quero alinhar hábitos e protocolo corporal'`,
    `'cta_text', 'Quero alinhar hábitos e o que faço no corpo'`,
  ],
  [
    `'Oi! Fiz o questionário sobre inchaço e sensação de corpo pesado. O resultado está no tom leve — quero avaliação para alinhar hábitos com o protocolo de vocês.'`,
    `'Oi! Fiz o questionário sobre inchaço e sensação de corpo pesado. O resultado está no tom leve — quero avaliação para alinhar hábitos com o que vocês indicarem.'`,
  ],
  [
    `'growth_potential', 'Peça plano que una duas frentes: clínica + ajustes realistas em casa — sem culpa, com critério.'`,
    `'growth_potential', 'Peça uma proposta que una duas frentes: o que faz sentido na clínica + ajustes realistas em casa — sem culpa, com critério.'`,
  ],
  [
    `'cta_text', 'Quero plano que una hábito e tratamento'`,
    `'cta_text', 'Quero ver como unir hábito e tratamento'`,
  ],
  [
    `'Oi! Fiz o questionário inchaço e hábitos. O resultado indica que preciso integrar rotina com protocolo — quero marcar avaliação para montar isso com vocês.'`,
    `'Oi! Fiz o questionário inchaço e hábitos. O resultado indica que preciso integrar rotina com cuidado profissional — quero marcar avaliação para montar isso com vocês.'`,
  ],
  // 404 b1000044 moderado
  [
    `'profile_title', 'Rotina e tratamento corporal — hora de fechar combinação segura'`,
    `'profile_title', 'Rotina e cuidados no corpo — faz sentido cruzar tudo com calma'`,
  ],
  [
    `'cta_text', 'Quero consulta para rotina + protocolo corporal'`,
    `'cta_text', 'Quero consulta para rotina e cuidados no corpo'`,
  ],
  [
    `'Oi! Fiz o questionário de cuidados com a pele; o perfil saiu moderado. Quero avaliação para combinar rotina em casa com o protocolo corporal de forma segura.'`,
    `'Oi! Fiz o questionário de cuidados com a pele; o perfil saiu moderado. Quero avaliação para combinar rotina em casa com o que vocês indicarem, de forma segura.'`,
  ],
  // 404 b1000044 leve
  [
    `'profile_title', 'Cuidados com a pele do corpo — explorar antes de intensificar protocolo'`,
    `'profile_title', 'Cuidados com a pele do corpo — explorar antes de intensificar tratamentos'`,
  ],
  [
    `'cta_text', 'Quero alinhar rotina com o protocolo corporal'`,
    `'cta_text', 'Quero alinhar rotina com os cuidados no corpo'`,
  ],
  // CTAs genéricos “protocolo corporal” → variantes
  [
    `'cta_text', 'Quero alinhar hidratação com protocolo corporal'`,
    `'cta_text', 'Quero alinhar hidratação com meus cuidados no corpo'`,
  ],
  [
    `'cta_text', 'Quero consulta para plano de textura / celulite'`,
    `'cta_text', 'Quero consulta para entender textura e celulite no meu caso'`,
  ],
  [
    `'profile_title', 'Flacidez ou contorno a incomodar — fechar eixo com a profissional'`,
    `'profile_title', 'Flacidez ou contorno a incomodar — faz sentido definir um eixo com a profissional'`,
  ],
  [
    `'frase_identificacao', 'Se te identificas, queres confirmar estágio antes de fechar pacote grande.'`,
    `'frase_identificacao', 'Se te identificas, queres confirmar estágio antes de assumir muitos compromissos.'`,
  ],
  // 402 — massagem modeladora moderado
  [
    `'cta_text', 'Quero consulta para fechar pacote com critério'`,
    `'cta_text', 'Quero consulta para decidir com critério'`,
  ],
  [
    `'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora; o perfil saiu moderado. Quero consulta para definir técnica, frequência e pacote com critério profissional.'`,
    `'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora; o perfil saiu moderado. Quero consulta para definir técnica e frequência com critério profissional.'`,
  ],
  [
    `'main_blocker', 'Fechar pacote só por preço sem alinhar técnica e frequência costuma gerar desalinhamento.'`,
    `'main_blocker', 'Escolher só por preço, sem alinhar técnica e frequência, costuma gerar desalinhamento.'`,
  ],
  [
    `'frase_identificacao', 'Se você se identificou, provavelmente quer perceber se drenagem faz sentido antes de fechar pacote.'`,
    `'frase_identificacao', 'Se você se identificou, provavelmente quer perceber se drenagem faz sentido antes de decidir qualquer pacote.'`,
  ],
  [
    `'cta_text', 'Quero plano de drenagem e hábitos na consulta'`,
    `'cta_text', 'Quero entender drenagem e hábitos na consulta'`,
  ],
  [
    `'Oi! Fiz o questionário sobre drenagem e pernas pesadas; o perfil saiu moderado. Quero avaliação para combinar drenagem, ritmo e o que fazer em casa entre sessões.'`,
    `'Oi! Fiz o questionário sobre drenagem e pernas pesadas; o perfil saiu moderado. Quero avaliação para combinar drenagem, ritmo e o que fazer em casa no dia a dia.'`,
  ],
  [
    `'dica_rapida', 'Menos sessões bem espaçadas costumam vencer maratona sem direção.'`,
    `'dica_rapida', 'Às vezes menos idas, mas com direção clara, ajudam mais do que muitas idas sem norte.'`,
  ],
  // 403 b1000119 moderado
  [
    `'profile_title', 'Prontidão em construção — hora de travar prioridade com a profissional'`,
    `'profile_title', 'Prontidão em construção — faz sentido definir prioridade com a profissional'`,
  ],
  [
    `'main_blocker', 'Fechar pacote antes de alinhar meta visível em 4–8 semanas costuma gerar desalinhamento depois.'`,
    `'main_blocker', 'Assumir muitos compromissos antes de alinhar uma meta visível em 4–8 semanas costuma gerar desalinhamento depois.'`,
  ],
  [
    `'cta_text', 'Quero avaliação para fechar prioridade e frequência'`,
    `'cta_text', 'Quero avaliação para definir prioridade e frequência'`,
  ],
  [
    `'Oi! Fiz o questionário de prontidão para protocolo corporal; o perfil saiu moderado. Quero consulta para alinhar prioridade, expectativa de prazo e frequência realista com a equipe.'`,
    `'Oi! Fiz o questionário de prontidão para cuidar do corpo; o perfil saiu moderado. Quero consulta para alinhar prioridade, expectativa de prazo e frequência realista com a equipe.'`,
  ],
  // 405 — reduzir “protocolo corporal” em CTAs / prefills (substituições parciais em strings longas)
  [
    `'cta_text', 'Quero alinhar hidratação com meu protocolo corporal'`,
    `'cta_text', 'Quero alinhar hidratação com meus cuidados no corpo'`,
  ],
  [
    `'Oi! Usei a calculadora de água no link de vocês. O resultado é estimativa — quero marcar avaliação para alinhar hidratação com hábito e protocolo corporal.'`,
    `'Oi! Usei a calculadora de água no link de vocês. O resultado é estimativa — quero marcar avaliação para alinhar hidratação com hábito e com o que faço no corpo.'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — hidratação e protocolo'`,
    `'cta_text', 'Quero avaliação prioritária — hidratação e cuidados no corpo'`,
  ],
  [
    `'Oi! Usei a calculadora de água e o perfil saiu com alerta de meta agressiva. Quero avaliação prioritária para ritmo seguro de hidratação junto do protocolo corporal.'`,
    `'Oi! Usei a calculadora de água e o perfil saiu com alerta de meta agressiva. Quero avaliação prioritária para ritmo seguro de hidratação junto dos meus cuidados no corpo.'`,
  ],
  [
    `'cta_text', 'Quero alinhar resultado da calculadora com protocolo'`,
    `'cta_text', 'Quero alinhar resultado da calculadora com meus cuidados'`,
  ],
  [
    `'Oi! Fiz a calculadora de calorias no link. Quero avaliação para alinhar esse referencial com hábito e protocolo corporal com vocês.'`,
    `'Oi! Fiz a calculadora de calorias no link. Quero avaliação para alinhar esse referencial com hábito e com o que faço no corpo.'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — meta e protocolo corporal'`,
    `'cta_text', 'Quero avaliação prioritária — meta e cuidados no corpo'`,
  ],
  [
    `'Oi! A calculadora de calorias acusou meta agressiva; quero avaliação prioritária para ritmo seguro com protocolo corporal e acompanhamento adequado.'`,
    `'Oi! A calculadora de calorias acusou meta agressiva; quero avaliação prioritária para ritmo seguro com acompanhamento adequado no corpo.'`,
  ],
  [
    `'cta_text', 'Quero avaliação corporal além do IMC'`,
    `'cta_text', 'Quero conversar sobre meu corpo além do IMC'`,
  ],
  [
    `'Oi! Calculei meu IMC no link. Quero marcar avaliação corporal para alinhar expectativa, zonas e protocolo com vocês — além do número.'`,
    `'Oi! Calculei meu IMC no link. Quero marcar avaliação corporal para alinhar expectativa e zonas com vocês — além do número.'`,
  ],
  [
    `'main_blocker', 'Fechar pacote só por “preciso baixar IMC” ignora ordem de protocolo (hábito, pele, tecnologia).'`,
    `'main_blocker', 'Focar só em “preciso baixar IMC” sem olhar hábito, pele e o que faz sentido primeiro pode desorganizar o próximo passo.'`,
  ],
  [
    `'cta_text', 'Quero consulta para plano corporal com contexto do IMC'`,
    `'cta_text', 'Quero consulta para próximos passos com contexto do IMC'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — IMC e protocolo'`,
    `'cta_text', 'Quero avaliação prioritária — IMC e próximos passos'`,
  ],
  [
    `'Oi! A calculadora colocou meu IMC/projeção em alerta de meta agressiva; quero avaliação prioritária para plano corporal seguro e realista.'`,
    `'Oi! A calculadora colocou meu IMC/projeção em alerta de meta agressiva; quero avaliação prioritária para próximos passos seguros e realistas.'`,
  ],
  [
    `'cta_text', 'Quero alinhar proteína com treino e protocolo'`,
    `'cta_text', 'Quero alinhar proteína com treino e corpo'`,
  ],
  [
    `'Oi! Usei a calculadora de proteína. Quero avaliação para alinhar gramas com treino, rotina e protocolo corporal com vocês.'`,
    `'Oi! Usei a calculadora de proteína. Quero avaliação para alinhar gramas com treino e rotina com vocês.'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — proteína e protocolo'`,
    `'cta_text', 'Quero avaliação prioritária — proteína e corpo'`,
  ],
  [
    `'Oi! A calculadora de proteína apontou meta agressiva; quero avaliação prioritária para ritmo seguro com protocolo corporal.'`,
    `'Oi! A calculadora de proteína apontou meta agressiva; quero avaliação prioritária para ritmo seguro com o que faço no corpo.'`,
  ],
  [
    `'cta_text', 'Quero alinhar hidratação com treino e protocolo'`,
    `'cta_text', 'Quero alinhar hidratação com treino e rotina'`,
  ],
  [
    `'Oi! Usei a calculadora de hidratação avançada. Quero marcar avaliação para alinhar copos/dia com treino, clima e protocolo corporal.'`,
    `'Oi! Usei a calculadora de hidratação avançada. Quero marcar avaliação para alinhar copos/dia com treino, clima e rotina.'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — sessões e protocolo'`,
    `'cta_text', 'Quero avaliação prioritária — sessões e próximos passos'`,
  ],
  [
    `'Oi! A calculadora de expectativa de sessões saiu com ritmo intenso; quero avaliação prioritária para calibrar série segura, intervalos e expectativa com a profissional.'`,
    `'Oi! A calculadora de expectativa de sessões saiu com ritmo intenso; quero avaliação prioritária para calibrar intervalos e expectativa com a profissional.'`,
  ],
  [
    `'cta_text', 'Quero avaliação prioritária — protocolo corporal'`,
    `'cta_text', 'Quero avaliação prioritária — cuidados no corpo'`,
  ],
  [
    `'Oi! Fiz o questionário sobre cuidados com a pele; preciso avaliação prioritária para alinhar rotina com o protocolo corporal sem irritar mais a pele.'`,
    `'Oi! Fiz o questionário sobre cuidados com a pele; preciso avaliação prioritária para alinhar rotina com os cuidados indicados sem irritar mais a pele.'`,
  ],
  [
    `'Oi! Fiz o questionário sobre hidratação; o resultado saiu urgente. Quero avaliação prioritária para estabilizar a pele e só então retomar protocolo corporal com segurança.'`,
    `'Oi! Fiz o questionário sobre hidratação; o resultado saiu urgente. Quero avaliação prioritária para estabilizar a pele e só então retomar cuidados com segurança.'`,
  ],
  [
    `'Oi! Calculei minha meta de água; quero consulta para calibrar com rotina, treino e o protocolo corporal que estou fazendo ou pretendo fazer.'`,
    `'Oi! Calculei minha meta de água; quero consulta para calibrar com rotina, treino e o que estou fazendo ou pretendo fazer no corpo.'`,
  ],
  [
    `'profile_summary', 'Pelos dados, há combinação de prazo curto ou salto grande que puxa o alerta do planeamento. Para protocolo corporal, mudanças bruscas em líquidos sem orientação podem ser contraproducentes — a avaliação prioritariza segurança e ritmo sustentável.'`,
    `'profile_summary', 'Pelos dados, há combinação de prazo curto ou salto grande que puxa o alerta do planeamento. Para quem faz tratamentos corporais, mudanças bruscas em líquidos sem orientação podem ser contraproducentes — a avaliação prioritariza segurança e ritmo sustentável.'`,
  ],
  [
    `'profile_title', 'Meta de proteína como referência — encaixar no protocolo corporal'`,
    `'profile_title', 'Meta de proteína como referência — encaixar na rotina e no corpo'`,
  ],
  [
    `'profile_summary', 'A projeção indica combinação exigente (muita proteína ou objetivo intenso em pouco tempo). Para protocolo corporal, subir carga proteica sem triagem pode sobrecarregar — priorize conversa para ritmo seguro e sustentável.'`,
    `'profile_summary', 'A projeção indica combinação exigente (muita proteína ou objetivo intenso em pouco tempo). Para quem faz tratamentos corporais, subir carga proteica sem triagem pode sobrecarregar — priorize conversa para ritmo seguro e sustentável.'`,
  ],
  [
    `'profile_title', 'Meta de hidratação organizada — bom alinhamento com corpo e protocolo'`,
    `'profile_title', 'Meta de hidratação organizada — bom alinhamento com corpo e rotina'`,
  ],
  [
    `'growth_potential', 'Use o print ou o resultado na avaliação para cruzar com protocolo que vocês fecharem.'`,
    `'growth_potential', 'Use o print ou o resultado na avaliação para cruzar com o que vocês combinarem.'`,
  ],
  [
    `'profile_summary', 'Pelas respostas, há urgência em tratar zona específica. Antes de fechar pacote grande, avaliação prioritária define candidatura real, série e cuidados — protege expectativa e segurança.'`,
    `'profile_summary', 'Pelas respostas, há urgência em tratar zona específica. Antes de assumir muitos compromissos de uma vez, avaliação prioritária define candidatura real, série e cuidados — protege expectativa e segurança.'`,
  ],
  [
    `'profile_summary', 'Pelas respostas, há hesitação (tempo, investimento, medo ou prioridade baixa) sem pressão extrema. Um bom passo é conversa inicial com a profissional para traduzir intenção em plano mínimo viável, sem fechar pacote longo de imediato.'`,
    `'profile_summary', 'Pelas respostas, há hesitação (tempo, investimento, medo ou prioridade baixa) sem pressão extrema. Um bom passo é conversa inicial com a profissional para traduzir intenção em um começo mínimo viável, sem assumir um pacote longo de imediato.'`,
  ],
  [
    `'profile_summary', 'A combinação de prazo curto com muitas idas por semana acende o alerta de planeamento. Antes de fechar pacote, avaliação prioritária alinha expectativa realista, recuperação da pele e intervalos seguros.'`,
    `'profile_summary', 'A combinação de prazo curto com muitas idas por semana acende o alerta de planeamento. Antes de fechar qualquer pacote, avaliação prioritária alinha expectativa realista, recuperação da pele e intervalos seguros.'`,
  ],
  [
    `'dica_rapida', 'Evite fechar pacote fechado online antes da primeira consulta presencial.'`,
    `'dica_rapida', 'Evite fechar qualquer pacote online antes da primeira consulta presencial.'`,
  ],
  [
    `-- b1000025 — água (apoio a hábito + protocolo corporal)`,
    `-- b1000025 — água (apoio a hábito / corpo)`,
  ],
  [
    `'Oi! Fiz o questionário sobre retenção/inchaço; o resultado saiu urgente. Quero avaliação prioritária para protocolo seguro e orientação profissional.'`,
    `'Oi! Fiz o questionário sobre retenção/inchaço; o resultado saiu urgente. Quero avaliação prioritária para orientação segura e próximos passos com vocês.'`,
  ],
  [
    `'profile_summary', 'Pelas respostas, o incômodo parece forte ou muito frequente. Uma conversa presencial ajuda a alinhar protocolo estético seguro e, quando necessário, o encaminhamento correto se algo não for só “retenção estética”.'`,
    `'profile_summary', 'Pelas respostas, o incômodo parece forte ou muito frequente. Uma conversa presencial ajuda a alinhar cuidados seguros e, quando necessário, o encaminhamento correto se algo não for só “retenção estética”.'`,
  ],
]

const CORPORAL_RISK_TEMPLATE_IDS = [
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
  'b1000142-0142-4000-8000-000000000142',
  'b1000143-0143-4000-8000-000000000143',
  'b1000144-0144-4000-8000-000000000144',
  'b1000145-0145-4000-8000-000000000145',
  'b1000146-0146-4000-8000-000000000146',
  'b1000147-0147-4000-8000-000000000147',
  'b1000148-0148-4000-8000-000000000148',
  'b1000149-0149-4000-8000-000000000149',
  'b1000150-0150-4000-8000-000000000150',
  'b1000151-0151-4000-8000-000000000151',
  'b1000119-0119-4000-8000-000000000119',
  'b1000120-0120-4000-8000-000000000120',
  'b1000127-0127-4000-8000-000000000127',
  'b1000038-0038-4000-8000-000000000038',
  'b1000044-0044-4000-8000-000000000044',
  'b1000046-0046-4000-8000-000000000046',
  'b1000048-0048-4000-8000-000000000048',
  'b1000050-0050-4000-8000-000000000050',
]

const CORPORAL_CALC_TEMPLATE_IDS = [
  'b1000025-0025-4000-8000-000000000025',
  'b1000026-0026-4000-8000-000000000026',
  'b1000027-0027-4000-8000-000000000027',
  'b1000028-0028-4000-8000-000000000028',
  'b1000031-0031-4000-8000-000000000031',
  'b1000123-0123-4000-8000-000000000123',
]

const CORPORAL_ALL_PACK_TEMPLATE_IDS = [...CORPORAL_RISK_TEMPLATE_IDS, ...CORPORAL_CALC_TEMPLATE_IDS]

let body = tuples
for (const [a, b] of replacements) {
  if (!body.includes(a)) {
    // não falhar: algumas frases podem já ter sido alteradas ou não existir em todos os lotes
    continue
  }
  body = body.split(a).join(b)
}

const riskUuidList = CORPORAL_RISK_TEMPLATE_IDS.map((id) => `          '${id}'::uuid`).join(',\n')
const calcUuidList = CORPORAL_CALC_TEMPLATE_IDS.map((id) => `          '${id}'::uuid`).join(',\n')
const allPackUuidList = CORPORAL_ALL_PACK_TEMPLATE_IDS.map((id) => `    '${id}'::uuid`).join(',\n')

const header = `-- Pro Estética Corporal — refresh de copy (linguagem leiga; diagnóstico útil antes do convite).
-- Substitui pacotes corporais das migrações 401–405. Idempotente: DELETE + INSERT.
-- Limpa \`ylada_diagnosis_cache\` destes \`template_id\` para não servir texto antigo (v28).
-- @see src/config/ylada-diagnosis-result-standard.ts

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE diagnosis_vertical = 'corporal'
  AND (
    (
      architecture = 'RISK_DIAGNOSIS'
      AND template_id = ANY (
        ARRAY[
${riskUuidList}
        ]
      )
    )
    OR (
      architecture = 'PROJECTION_CALCULATOR'
      AND template_id = ANY (
        ARRAY[
${calcUuidList}
        ]
      )
    )
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
`

const cacheFooter = `
-- Cache: forçar regeneração do diagnóstico visitante após mudança de \`content_json\`.
DELETE FROM ylada_diagnosis_cache c
USING ylada_links y
WHERE c.link_id = y.id
  AND y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND y.template_id = ANY (
    ARRAY[
${allPackUuidList}
    ]
  );
`

const sql = `${header}${body}
;
${cacheFooter}`

fs.writeFileSync(outPath, sql, 'utf8')
console.log('Wrote', outPath, 'bytes', sql.length)
