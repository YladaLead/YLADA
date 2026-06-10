-- Calculadora de hidratação (Pro Líderes): revisão de linguagem.
-- Contexto: o volume em litros e copos agora aparece em destaque na tela (feat da sessão 10/06/2026).
-- Os textos antigos foram escritos sem saber que o número ficaria visível,
-- então ficaram vagos. Esta migration torna o copy mais direto e útil,
-- complementando o número — não repetindo nem ignorando ele.

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'profile_title', 'Sua meta está calculada — falta só o hábito'
    )
    || jsonb_build_object(
      'main_blocker', 'O número é simples. O difícil é lembrar de beber antes da sede aparecer.'
    )
    || jsonb_build_object(
      'consequence', 'Quem fica abaixo da meta com frequência sente cansaço, foco oscilante e digestão lenta — sem saber que a causa é falta de água.'
    )
    || jsonb_build_object(
      'dica_rapida', 'Amarre o hábito a um gatilho: ao acordar, antes do almoço, antes do treino. Não espere a sede — ela é o último sinal.'
    )
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Deixe uma garrafa ou copo cheio à vista nos horários em que mais esquece de beber.',
        'Divida sua meta em partes iguais ao longo do dia — não tente compensar tudo de uma vez.',
        'Conversa com quem te enviou o link ajuda a ajustar essa meta à sua rotina real.'
      )
    )
    || jsonb_build_object(
      'whatsapp_prefill', 'Oi! Fiz a calculadora de hidratação e vi minha meta diária. Quero entender como encaixar isso na minha rotina.'
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'leve';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'profile_title', 'Sua meta é alta — e faz sentido pelo seu dia'
    )
    || jsonb_build_object(
      'main_blocker', 'Com calor ou atividade alta, o corpo perde água mais rápido do que parece. Esperar a sede não funciona nesse ritmo.'
    )
    || jsonb_build_object(
      'consequence', 'Quando a hidratação fica abaixo da meta em dias pesados, cansaço, dor de cabeça e queda de foco aparecem — e ficam fáceis de confundir com outras causas.'
    )
    || jsonb_build_object(
      'dica_rapida', 'Em dias quentes ou de treino, antecipe: beba um copo antes de sair, um durante, um depois. Não espere sentir sede para lembrar.'
    )
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Nos dias de mais calor ou esforço, aumente o volume e distribua antes de sentir sede.',
        'Evite substituir água por café ou bebida açucarada nos momentos mais pesados do dia.',
        'Conversa com quem te enviou o link ajuda a encaixar essa meta no seu expediente real.'
      )
    )
    || jsonb_build_object(
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e a minha meta saiu alta. Quero entender como bater isso no meu dia a dia.'
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'moderado';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'profile_title', 'Meta alta e rotina puxada: hidratação vira prioridade'
    )
    || jsonb_build_object(
      'main_blocker', 'Com esse perfil de atividade e clima, a conta fecha no vermelho fácil. O corpo não aguenta muito tempo abaixo disso sem cobrar.'
    )
    || jsonb_build_object(
      'consequence', 'Desidratação repetida nesse nível derruba performance física e mental — e os sintomas (cansaço, cabeça pesada, irritação) ficam tão frequentes que parecem normais.'
    )
    || jsonb_build_object(
      'dica_rapida', 'Trate água como parte da sua rotina de treino ou trabalho — não como lembrete opcional. Volume e ritmo juntos fazem a diferença.'
    )
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Beba um copo ao acordar, antes e depois de cada esforço físico — são os momentos mais críticos.',
        'Tenha sempre líquido acessível durante o trabalho ou treino, não só no intervalo.',
        'Conversa com quem te enviou o link para montar uma rotina de hidratação que você consiga sustentar.'
      )
    )
    || jsonb_build_object(
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e minha meta ficou bem alta. Quero ajuda para encaixar isso na minha rotina sem virar esforço.'
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'urgente';
