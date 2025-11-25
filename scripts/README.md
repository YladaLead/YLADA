# 🎬 Scripts de Demonstração YLADA

Scripts para criar contas de demonstração com dados fictícios para gravar vídeos de divulgação.

## 🚀 Como usar

### 1. Instalar dependências
```bash
cd scripts
npm install
```

### 2. Configurar variáveis de ambiente
Certifique-se de que as variáveis estão configuradas no arquivo `.env` da raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 3. Executar o script
```bash
# Na pasta scripts
npm run create-demo

# Ou diretamente
node create-demo-accounts.js
```

## 📋 O que será criado

### 🥗 Conta Demo Nutri
- **Email:** `demo.nutri@ylada.com`
- **Senha:** `DemoYlada2024!`
- **Perfil:** Dra. Ana Nutricionista
- **Formulários:**
  - Anamnese Nutricional Completa (10 campos)
  - Questionário de Hábitos Alimentares (4 campos)
- **Respostas:** 3 respostas fictícias realistas
- **Quizzes:** 2 quizzes interativos com dados de visualizações

### 🏃 Conta Demo Coach
- **Email:** `demo.coach@ylada.com`
- **Senha:** `DemoYlada2024!`
- **Perfil:** Carlos Coach Wellness
- **Formulários:**
  - Avaliação de Bem-Estar Inicial (6 campos)
  - Questionário de Metas e Objetivos (4 campos)
- **Respostas:** 3 respostas fictícias realistas
- **Quizzes:** 1 quiz interativo com dados de visualizações

## 🎯 Dados Incluídos

### Formulários Realistas
- Campos variados: texto, email, telefone, select, textarea, checkbox
- Placeholders e validações apropriadas
- Estrutura profissional para cada área

### Respostas Fictícias
- Nomes e dados brasileiros realistas
- Informações coerentes com cada área
- Datas distribuídas nos últimos 30 dias

### Quizzes Interativos
- Configurações completas de entrega
- Cores e estilos personalizados
- Dados de performance (views, leads)
- Slugs únicos para cada quiz

## 🎬 Para Gravação de Vídeos

### URLs de Acesso
- **Nutri:** `http://localhost:3000/pt/nutri`
- **Coach:** `http://localhost:3000/pt/coach`

### Funcionalidades Demonstráveis
1. **Dashboard:** Visão geral com métricas
2. **Formulários:** Criação, edição, visualização de respostas
3. **Quizzes:** Configuração e resultados
4. **Leads:** Lista de contatos capturados
5. **Páginas de Captura:** Formulários públicos funcionais

### Cenários de Demonstração
1. **Login** com as credenciais demo
2. **Visão geral** do dashboard com dados
3. **Criação** de novo formulário
4. **Visualização** de respostas existentes
5. **Configuração** de quiz
6. **Análise** de leads capturados

## 🔧 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o Supabase está acessível

### Usuários já existem
- O script tentará criar novos usuários
- Se já existirem, você pode usar as credenciais existentes
- Para recriar, delete os usuários no Supabase Admin

### Tabelas não encontradas
- Verifique se todas as migrações do banco foram executadas
- Confirme se as tabelas `user_profiles`, `custom_forms`, `form_responses`, `quizzes` existem

## 📞 Suporte

Se encontrar problemas, verifique:
1. Conexão com internet
2. Variáveis de ambiente configuradas
3. Permissões do Supabase Service Role
4. Estrutura do banco de dados atualizada
