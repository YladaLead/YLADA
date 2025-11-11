# 🗑️ Como Remover os Diretórios Vazios

## 📝 Instruções

Abra o terminal na raiz do projeto (`/Users/air/ylada-app`) e execute:

```bash
cd src/app/pt/wellness/templates
rmdir composicao daily-wellness emotional-assessment food-diary food-tracker infographic meal-planner nutrition-assessment parasitas recipes recommendation-form results-simulator weekly-goals
```

Ou execute um por um:

```bash
cd src/app/pt/wellness/templates
rmdir composicao
rmdir daily-wellness
rmdir emotional-assessment
rmdir food-diary
rmdir food-tracker
rmdir infographic
rmdir meal-planner
rmdir nutrition-assessment
rmdir parasitas
rmdir recipes
rmdir recommendation-form
rmdir results-simulator
rmdir weekly-goals
```

## ✅ Verificação

Depois, verifique quantos diretórios restaram:

```bash
find . -type d -mindepth 1 -maxdepth 1 | wc -l
```

Deve retornar **31** (os templates que estão no banco).

