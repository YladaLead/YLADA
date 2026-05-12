/**
 * DIAGNÓSTICOS: Avaliação do Perfil Metabólico - ÁREA WELLNESS
 *
 * Textos pós-resultado: priorizam leitura educativa do padrão (energia, fome, rotina).
 * Convite a falar com quem acompanha aparece de forma única, sem lista repetitiva de produtos.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const perfilMetabolicoDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    metabolismoLento: {
      diagnostico:
        '⚡ DIAGNÓSTICO: Pelo conjunto de sinais (energia irregular, fome intensa, corpo “pesado” ou sono/estresse desalinhados), seu perfil se aproxima de um metabolismo mais lento ou sob pressão — ou seja, o corpo parece estar economizando ou reagindo ao ambiente, não “falhando”.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Metabolismo “lento” na vivência costuma misturar sono, estresse, padrão de refeições, digestão e nível de movimento. Não dá para reduzir a um único vilão; o valor está em ver o padrão que você acabou de descrever e testar pequenos ajustes com método (horários, proteína, descanso, hidratação) antes de qualquer promessa milagrosa.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Por uma semana, anote só três coisas: horário em que a energia cai, o que comeu antes e como dormiu. Esse triângulo costuma mostrar onde mexer primeiro. Se algo do histórico de saúde te preocupa, procure um profissional habilitado — o questionário não substitui avaliação individual.',
      plano7Dias:
        '📅 PLANO 7 DIAS: (1) Escolher horário fixo para café e almoço em 5 dias úteis. (2) Incluir fonte de proteína na refeição em que a fome costuma “explodir”. (3) Caminhada leve ou alongamento em dias de maior inchaço. (4) Uma meta de sono: desligar telas 30 minutos antes. (5) No fim da semana, reler suas anotações e decidir um único ajuste para manter.',
      suplementacao:
        '💊 SUPLEMENTAÇÃO: Suplementos ou “aceleradores” só fazem sentido depois que sono, refeições e digestão estão minimamente organizados — e com orientação de quem conhece seu caso. Evite combinar vários produtos por conta própria.',
      alimentacao:
        '🍎 ALIMENTAÇÃO: Priorize refeições completas em horários previsíveis, fibra e água ao longo do dia, e perceba se doces refinados aparecem mais em dias de cansaço ou estresse. O objetivo é estabilizar energia, não passar fome “de prova”.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Use este resultado como mapa na conversa com quem te acompanha (nutrição, bem-estar ou médico): ele resume o que você sente hoje, não um rótulo definitivo. Juntos dá para priorizar 1–2 mudanças pequenas e mensuráveis.',
    },
    metabolismoModerado: {
      diagnostico:
        '⚡ DIAGNÓSTICO: Seu perfil está no meio do espectro: há sinais de que dá para afinar energia, digestão ou rotina, mas sem o “modo emergência” do extremo lento. É um bom lugar para aprender o que mais pesa para você — sono, fome ou estresse.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Metabolismo moderado na prática significa que alguns pilares já funcionam e outros oscilam. Pequenos desvios (noite mal dormida, dia sem proteína, muito estímulo de cafeína) podem ser o suficiente para sentir queda de rendimento sem que nada “grave” apareça nos exames.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Escolha **um** eixo para observar 10 dias: ou sono, ou horário da janta, ou lanche da tarde. Mudar tudo de uma vez esconde o que realmente ajuda. Se quiser ir além do autoconhecimento, leve essas observações para quem te orienta.',
      plano7Dias:
        '📅 PLANO 7 DIAS: Mantenha o resto da rotina e teste só o eixo escolhido (ex.: jantar 1h mais cedo, ou lanche com proteína às 16h). No fim, avalie: energia, fome à noite e sensação abdominal. Um ajuste que “bate” vale mais que cinco meia-boca.',
      suplementacao:
        '💊 SUPLEMENTAÇÃO: Se já usa algo, revise com profissional se ainda combina com seu sono e digestão **agora**. Novidades de suplemento entram depois de hábito — não antes.',
      alimentacao:
        '🍎 ALIMENTAÇÃO: Reforce o que já funciona e corrija só o ponto fraco (por exemplo, pular almoço em dias corridos ou jantar muito tarde). Metabolismo “no meio” responde bem a consistência moderada.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Traga este perfil para quem te acompanha e peça ajuda para validar **uma** hipótese por vez — assim o próximo passo fica claro e mensurável.',
    },
    metabolismoRapido: {
      diagnostico:
        '⚡ DIAGNÓSTICO: Pelas respostas, seu dia a dia parece mais estável: menos travamentos clássicos de energia, fome ou corpo. Isso sugere um perfil mais favorável no agora — com o cuidado de não confundir “bem hoje” com “imune” a mudanças de rotina.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Quem se sente mais “rápido” ou equilibrado ainda pode perder o fio se sono piorar, treino aumentar sem refeição adequada ou o estresse subir. Metabolismo é dinâmico; o que você descreveu é uma fotografia.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Proteja o básico: não ficar longas horas sem comer se você já sente queda brusca de energia, e mantenha hidratação em dias quentes ou de muito café. São os primeiros pontos a ruir quando a agenda aperta.',
      plano7Dias:
        '📅 PLANO 7 DIAS: Use a semana para **consolidar** hábitos que sustentam esse bom padrão (proteína nas refeições principais, janela de sono, pausa real no almoço). Prevenção aqui é manter o que funciona visível — não buscar “otimização” por ansiedade.',
      suplementacao:
        '💊 SUPLEMENTAÇÃO: Sem necessidade aparente de “empurrar” o metabolismo. Se usar algo esportivo ou energético, confira periodicamente com profissional se ainda faz sentido para seu sono e estômago.',
      alimentacao:
        '🍎 ALIMENTAÇÃO: Continue com variedade e refeições regulares; se a rotina mudar (viagem, turno, mais treino), planeje onde encaixar proteína e refeição completa antes de cortar calorias por impulso.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Guarde este resultado como linha de base. Se a vida mudar bastante, refaça a avaliação e compare — é a forma mais honesta de ver se o perfil acompanhou você ou se pediu ajuste.',
    },
  },
}
