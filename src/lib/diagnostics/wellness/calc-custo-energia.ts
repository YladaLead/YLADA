/**
 * DIAGNÓSTICOS: Calculadora Custo da Falta de Energia — ÁREA WELLNESS
 *
 * Textos curtos: rotina primeiro, produto como complemento (sem repetir “nutrição celular”).
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calcCustoEnergiaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    altoImpacto: {
      diagnostico:
        'Uma parte grande do seu dia útil está em ritmo reduzido por cansaço — isso pesa na sensação de “não fechar” o expediente e, se você informou valor da hora, também no bolso.',
      rotinaPrimeiro:
        'Antes de qualquer “atalho”, o que mais devolve fôlego costuma ser sono com horário mais estável, pausas reais fora da tela/cadeira, refeição com proteína nas primeiras horas do dia e água à vista. Cafeína espalhada em excesso costuma mascarar o cansaço sem resolver o fundo.',
      causaRaiz:
        'Fadiga no trabalho costuma ser combinação de demanda prolongada (mental, física ou mista) com pouca recuperação entre blocos — não só “falta de suplemento”.',
      acaoImediata:
        'Hoje: encaixe dois blocos de 10 minutos para levantar, alongar o que estiver mais tenso e beber água; evite o café “em jejum longo” só para segurar a manhã.',
      plano7Dias:
        'Nesta semana, anote em qual janela do dia você mais trava (muita gente entre 14h e 16h). Ajuste uma refeição ou lanche leve antes desse horário e teste dormir/acordar com no máximo 30 min de variação.',
      suplementacao:
        'Com a base da rotina alinhada, uma bebida funcional com cafeína moderada, complexo B, taurina e hidratação pode apoiar foco nas horas mais pesadas — como complemento, não no lugar de sono e comida.',
      alimentacao:
        'Prefira refeições que segurem a glicemia (proteína + fibra/carboidrato de boa qualidade) e distribua líquidos; isso muda o patamar de energia mais do que puxar só com estimulante.',
      proximoPasso:
        'Se quiser encaixar isso no seu caso real, vale conversar com quem te enviou o link para um próximo passo humano.',
    },
    impactoModerado: {
      diagnostico:
        'Uma fatia relevante do dia some em baixa energia — dá para recuperar ritmo com ajustes pequenos de rotina antes de pensar em “turbo”.',
      rotinaPrimeiro:
        'Pausas curtas e planejadas, luz natural pela manhã quando der, e hidratação regular costumam reduzir aquele “apagão” do meio do dia sem depender de mais uma dose de cafeína.',
      causaRaiz:
        'Quando o corpo alterna picos de atenção e quedas, muitas vezes falta estrutura de recuperação entre tarefas — não só mais esforço.',
      acaoImediata:
        'Hoje: depois de 90 min de foco intenso, faça 5 minutos de corpo ativo (subir escada, alongar). Combine com um copo de água antes do próximo café.',
      plano7Dias:
        'Teste por uma semana um “ponto de checagem” às 15h: lanche com proteína + fruta ou iogurte, e 2 minutos de ar livre se possível.',
      suplementacao:
        'Se a rotina já estiver razoável, uma bebida funcional equilibrada pode ajudar nas janelas de maior carga — especialmente em dias corridos.',
      alimentacao:
        'Evite ficar muitas horas sem comer e depois compensar com excesso de açúcar; isso costuma gerar oscilação de energia no mesmo dia.',
      proximoPasso:
        'Quem te enviou o link pode ajudar a priorizar o que mudar primeiro — sem promessa milagrosa, com conversa leve.',
    },
    baixoImpacto: {
      diagnostico:
        'Seu ritmo parece relativamente estável — dá para pensar em prevenção e em manter o pico sem “vivendo colado” em estimulantes.',
      rotinaPrimeiro:
        'Mesmo com bom desempenho, proteger sono, movimento leve e refeições regulares evita que o cansaço vire improdutividade nas próximas semanas.',
      causaRaiz:
        'Queda de energia às vezes vem antes do sintoma óbvio: desidratação leve, jejum longo ou excesso de telas sem pausa.',
      acaoImediata:
        'Mantenha água no campo de visão e faça micro-pausas de olhos/costas a cada hora em dias de tela pesada.',
      plano7Dias:
        'Escolha um dia da semana para revisar: sono (horário), cafeína depois das 14h e uma caminhada curta — pequenos freios evitam burnout silencioso.',
      suplementacao:
        'Em dias de demanda extra, uma opção funcional com nutrientes de apoio pode ser um reforço prático — sem substituir hábitos.',
      alimentacao:
        'Continue priorizando refeições completas; consistência costuma valer mais do que qualquer “extra” isolado.',
      proximoPasso:
        'Se quiser um plano fino para sua rotina, use o WhatsApp com quem compartilhou o link.',
    },
  },
}
