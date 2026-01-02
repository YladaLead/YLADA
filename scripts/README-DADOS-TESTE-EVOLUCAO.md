# 🧪 Scripts de Dados de Teste - Evolução Física

## 📋 Visão Geral

Estes scripts permitem popular o banco de dados com **dados de teste realistas** para avaliar o sistema de evolução física com múltiplos clientes e medições ao longo do tempo.

---

## 📦 Scripts Disponíveis

### 1. `POPULAR-DADOS-TESTE-EVOLUCAO.sql`
**Cria dados de teste completos**

**O que faz:**
- ✅ Cria **5 clientes fictícios** com perfis variados
- ✅ Gera **12 medições** para cada cliente (quinzenais ao longo de 6 meses)
- ✅ Simula **60 registros de evolução** no total
- ✅ Diferentes cenários realistas (perda de peso, ganho de massa, plateau, etc.)

### 2. `LIMPAR-DADOS-TESTE-EVOLUCAO.sql`
**Remove todos os dados de teste**

**O que faz:**
- 🧹 Remove todos os clientes de teste
- 🧹 Remove todas as evoluções associadas
- 🧹 Deixa o banco limpo para novos testes

---

## 🚀 Como Usar

### Passo 1: Descubra seu User ID

1. Abra o **Supabase Dashboard** → **SQL Editor**
2. Execute esta query:
```sql
SELECT id, email FROM auth.users LIMIT 5;
```
3. **Copie seu UUID** (coluna `id`)

### Passo 2: Popular com Dados de Teste

1. Abra o arquivo `scripts/POPULAR-DADOS-TESTE-EVOLUCAO.sql`
2. Procure por `'SEU-USER-ID-AQUI'` (linha ~40)
3. **Substitua** pelo seu UUID copiado
4. Copie todo o conteúdo do arquivo
5. Cole no **SQL Editor** do Supabase
6. Clique em **Run** ▶️

**Resultado:** 5 clientes serão criados com 12 medições cada!

### Passo 2: Testar no Sistema

1. Acesse a **área de clientes** no YLADA
2. Você verá os clientes de teste:
   - Maria Silva (TESTE)
   - João Santos (TESTE)
   - Ana Costa (TESTE)
   - Carlos Mendes (TESTE)
   - Juliana Oliveira (TESTE)

3. Clique em qualquer cliente
4. Vá para a aba **"Evolução Física"**
5. Veja os gráficos, tabelas e dados completos!

### Passo 3: Limpar (quando terminar)

1. No **SQL Editor** do Supabase
2. Execute `LIMPAR-DADOS-TESTE-EVOLUCAO.sql`
3. Todos os dados de teste serão removidos

---

## 👥 Perfis de Teste Criados

### 1. **Maria Silva** 🎯
- **Objetivo:** Perda de peso
- **Evolução:** 78.5kg → 70.5kg em 6 meses
- **Cenário:** Perda gradual e saudável (-8kg)
- **Destaque:** Progresso constante e motivação alta

### 2. **João Santos** 💪
- **Objetivo:** Ganho de massa muscular
- **Evolução:** 75kg → 80kg em 6 meses
- **Cenário:** Hipertrofia limpa (+5kg de músculo)
- **Destaque:** Pratica musculação 5x/semana

### 3. **Ana Costa** 🔄
- **Objetivo:** Manutenção e recomposição
- **Evolução:** Peso estável (~65kg), mas melhor composição
- **Cenário:** Perda de gordura + ganho de músculo
- **Destaque:** % gordura diminuiu, massa muscular aumentou

### 4. **Carlos Mendes** 📊
- **Objetivo:** Perda de peso (pré-diabético)
- **Evolução:** 95kg → 87kg, com plateau
- **Cenário:** Perda rápida inicial, depois estabilizou
- **Destaque:** Bom para testar como visualizar plateaus

### 5. **Juliana Oliveira** 👶
- **Objetivo:** Recuperação pós-parto
- **Evolução:** 72kg → 67kg em 6 meses
- **Cenário:** Perda lenta e saudável (amamentando)
- **Destaque:** Progressão respeitando amamentação

---

## 📊 Dados Gerados

### Medições (12 por cliente, quinzenais):
- ✅ Peso
- ✅ Altura
- ✅ IMC (calculado)
- ✅ Circunferências (cintura, quadril, pescoço, braço, coxa)
- ✅ Composição corporal (% gordura, massa muscular, % água)
- ✅ Gordura visceral
- ✅ Observações em marcos importantes

### Total de Registros:
- **5 clientes**
- **60 evoluções** (12 × 5)
- **Período:** 6 meses (quinzenal)

---

## 🎯 O Que Testar

### Gráficos:
- ✅ Visualizar tendências ao longo do tempo
- ✅ Comparar diferentes perfis
- ✅ Ver como ficam gráficos com muitos pontos
- ✅ Testar responsividade em mobile

### Tabela:
- ✅ Indicadores de variação (setas ⬆️⬇️)
- ✅ Cálculos automáticos de percentual
- ✅ Classificação de IMC
- ✅ Ordenação por data

### Cards Estatísticos:
- ✅ Peso atual vs. peso inicial
- ✅ Variação total
- ✅ Mínimo e máximo

### Performance:
- ✅ Tempo de carregamento com muitos dados
- ✅ Scroll na tabela
- ✅ Interatividade dos gráficos

### UX:
- ✅ Facilidade de navegação
- ✅ Clareza das informações
- ✅ Utilidade dos indicadores visuais

---

## 🔒 Segurança

**Proteções implementadas:**
- ❌ Script **não executa em produção**
- ✅ Verifica nome do banco antes de executar
- ✅ Emails identificados como teste: `teste.evolucao.*@ylada.app`
- ✅ Nome dos clientes com sufixo `(TESTE)`

---

## 🎨 Variações de Teste

Quer testar cenários específicos? Edite o script e ajuste:

```sql
-- Exemplo: Cliente com perda mais agressiva
v_weight := v_weight - (1.5 + (random() * 0.3));  -- Perda maior

-- Exemplo: Cliente com ganho acelerado
v_muscle_mass := v_muscle_mass + (1.0 + (random() * 0.5));  -- Ganho maior

-- Exemplo: Mais ou menos medições
FOR i IN 0..23 LOOP  -- 24 medições (semanais por 6 meses)
```

---

## 📝 Notas

- **Dados são aleatórios mas realistas**: Usam `random()` para variação natural
- **Progressões são lógicas**: Seguem padrões de ganho/perda saudável
- **Observações contextuais**: Marcam momentos importantes da jornada
- **Todos os campos preenchidos**: Para testar visualização completa

---

## 🐛 Troubleshooting

### "Nenhum nutricionista encontrado"
**Solução:** Crie um usuário com `user_type = 'nutri'` primeiro

### "Clientes não aparecem"
**Solução:** Verifique se o script executou sem erros no SQL Editor

### "Gráficos vazios"
**Solução:** Confirme que as evoluções foram criadas:
```sql
SELECT COUNT(*) FROM client_evolution 
WHERE client_id IN (
  SELECT id FROM clients WHERE email LIKE 'teste.evolucao.%@ylada.app'
);
```

### "Muitos dados, sistema lento"
**Solução:** Reduza o número de clientes ou medições no script

---

## 🎯 Próximos Passos

Após testar com dados simulados:

1. ✅ Avaliar se a interface funciona bem com muitos dados
2. ✅ Identificar possíveis melhorias de UX
3. ✅ Testar performance em diferentes dispositivos
4. ✅ Validar cálculos e indicadores
5. ✅ Coletar feedback de usuários reais

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do SQL Editor
2. Confirme que está em ambiente de desenvolvimento
3. Execute o script de limpeza e tente novamente

---

**Bons testes! 🚀**












