-- Copy visitante PT-BR mais simples (vendas wellness Pro Líderes): perfil metabólico + sono/energia.
-- Complementa o pós-processo em código (v23). PRÉ-REQUISITO: 396 (ou linhas equivalentes na tabela).

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $mleve$
{
  "profile_title": "Seu metabolismo pede organização — ainda dá para ajustar com calma",
  "profile_summary": "Pelas respostas, às vezes a energia oscila, o peso muda devagar ou o dia a dia atrapalha o que você quer fazer.",
  "frase_identificacao": "Se isso faz sentido, talvez já tenha pensado que \"é genética\" — e isso pesa.",
  "main_blocker": "O que mais aparece é sono e nervoso mexendo com disposição e com o que você vê na balança ou na roupa.",
  "consequence": "Se ficar só na força de vontade sem um plano encaixado na sua rotina, o esforço parece grande e o resultado demora — e cansa.",
  "growth_potential": "Quem te enviou pode ajudar a ordenar hábitos — comida, descanso e rotina — no passo certo.",
  "dica_rapida": "Metabolismo na vida real é conjunto de coisas: dormir, nervoso, movimento e refeição. Uma conversa ajuda a ver por onde começar.",
  "cta_text": "Quero montar um plano que faça sentido pra mim",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e apareceu um padrão leve. Quero conversar com quem me enviou este link."
}
$mleve$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'leve';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $mmod$
{
  "profile_title": "Esforço e resultado ainda não andam juntos — um plano no seu perfil ajuda",
  "profile_summary": "Pelas respostas, energia oscila bastante, o peso não responde como você quer ou sono e estresse já atrapalham quase todo dia.",
  "frase_identificacao": "Se você se reconhece aqui, \"falta de disciplina\" não explica tudo — e você sabe disso.",
  "main_blocker": "O que trava é que o que funciona pra todo mundo raramente fecha pro seu corpo no seu dia a dia.",
  "consequence": "Seguir no achismo costuma aumentar desânimo e a sensação de corpo \"teimoso\".",
  "growth_potential": "Falar com quem te enviou ajuda a priorizar o que mudar primeiro — menos tentativa e erro.",
  "dica_rapida": "Muitas vezes um ajuste pequeno no que mais pesa (sono, refeição ou nervoso) já abre espaço.",
  "cta_text": "Quero um plano mais certeiro pra mim",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e o resultado mostrou oscilação forte. Quero falar com quem me enviou este link."
}
$mmod$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'moderado';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $murg$
{
  "profile_title": "Você se esforça muito e o corpo demora a responder — vale acionar apoio",
  "profile_summary": "Pelas respostas, manter ritmo está difícil, a energia oscila muito ou sono e nervoso mandam no resultado do dia.",
  "frase_identificacao": "Se é você, culpar só a vontade já não cola — falta clareza na rotina, não caráter.",
  "main_blocker": "Muita carga emocional no meio, e sensação de que o corpo não acompanha o que você tenta fazer.",
  "consequence": "Deixar para depois costuma aumentar o cansaço e bagunçar sono, comida e horários.",
  "growth_potential": "Fale com quem te enviou: dá para montar um plano em fases, com profissional quando precisar — sustentável e no seu ritmo.",
  "dica_rapida": "Neste momento, ir com calma mas com direção costuma funcionar melhor do que mudar tudo de uma vez.",
  "cta_text": "Preciso de um plano firme e alinhado ao meu caso",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e o resultado saiu bem intenso. Quero conversar com quem me enviou este link."
}
$murg$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'urgente';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $sleve$
{
  "profile_title": "Sono e energia ainda não andam juntos — mas dá para melhorar",
  "profile_summary": "Pelas respostas, acordar cansado, horário irregular ou nervoso à noite aparecem como pequenos travamentos — com boa margem para ganho.",
  "frase_identificacao": "Se combina, você já deve ter sentido que \"dorme horas\" mas não acorda leve.",
  "main_blocker": "O que pesa é descanso que não fecha a conta: o corpo ainda pede energia de outro lugar.",
  "consequence": "Recuperação fraca puxa mais café, irritação e queda de foco no dia.",
  "growth_potential": "Quem te enviou pode ajudar a ligar sono, rotina e alimentação para a manhã ficar melhor — conversa simples.",
  "dica_rapida": "Muitas vezes o primeiro passo é horário mais estável e um ritual de fim de noite — antes de mil suplementos.",
  "cta_text": "Quero melhorar sono e energia com apoio",
  "whatsapp_prefill": "Oi! Fiz a avaliação de sono e energia e saiu um padrão leve de recuperação. Quero conversar com quem me enviou este link."
}
$sleve$::jsonb
WHERE flow_id = 'avaliacao-sono-energia'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'leve';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $smod$
{
  "profile_title": "Sono inconsistente já derruba sua energia com frequência",
  "profile_summary": "Pelas respostas, acordar mal, horários irregulares, cansaço mesmo com horas \"suficientes\" ou nervoso à noite já são recorrentes.",
  "frase_identificacao": "Se você se identificou, o dia pode estar pagando juros de uma noite mal fechada.",
  "main_blocker": "O que trava é o ciclo: dia pesado rouba a noite; noite fraca rouba o dia.",
  "consequence": "Manter assim costuma aumentar café, estimulante e sensação de \"cabeça embaçada\".",
  "growth_potential": "Falar com quem te enviou ajuda a ajustar rotina, alimentação e descanso — na ordem certa.",
  "dica_rapida": "Quando dorme bastante e acorda mal, vale olhar qualidade do sono e nervoso — não só número de horas.",
  "cta_text": "Quero quebrar esse ciclo sono–energia",
  "whatsapp_prefill": "Oi! Fiz a avaliação de sono e energia e o resultado mostrou inconsistência forte. Quero falar com quem me enviou este link."
}
$smod$::jsonb
WHERE flow_id = 'avaliacao-sono-energia'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'moderado';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $surg$
{
  "profile_title": "Recuperação no limite — a energia do dia depende de arrumar o sono",
  "profile_summary": "Pelas respostas, recuperação ruim, sono irregular, cansaço que não sai ou nervoso forte à noite atrapalham disposição e foco.",
  "frase_identificacao": "Se isso é você, \"aguentar mal dormido\" virou um padrão perigoso.",
  "main_blocker": "O que mais pesa é que o corpo não recupera direito — e você sente isso o dia inteiro.",
  "consequence": "Adiar cuidado prolonga desgaste físico e mental e atrapalha qualquer outra meta.",
  "growth_potential": "O melhor passo é falar com quem te enviou: plano de sono e energia junto — hábitos, rotina e apoio.",
  "dica_rapida": "Neste momento, priorizar sono não é luxo — é base para o resto.",
  "cta_text": "Preciso recuperar sono e energia com plano",
  "whatsapp_prefill": "Oi! Fiz a avaliação de sono e energia e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo."
}
$surg$::jsonb
WHERE flow_id = 'avaliacao-sono-energia'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'urgente';
