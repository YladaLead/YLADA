# 🚀 INSTRUÇÕES PARA PUSH DO YLADA

## ✅ Status Atual
- ✅ Código 100% pronto e testado
- ✅ Build funcionando perfeitamente  
- ✅ 3 commits prontos para push
- ✅ Repositório configurado: https://github.com/portalmagra/ylada.git

## 🔑 SOLUÇÃO: Token de Acesso Pessoal

### Passo 1: Criar Token no GitHub
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome: "YLADA Push Token"
4. Selecione escopo: ✅ **repo** (acesso completo aos repositórios)
5. Clique "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)

### Passo 2: Fazer Push
```bash
cd /Users/air/ylada-app

# Opção A: Push com token
git push https://portalmagra:SEU_TOKEN_AQUI@github.com/portalmagra/ylada.git main

# Opção B: Configurar credenciais
git config credential.helper store
git push origin main
# Quando pedir:
# Username: portalmagra
# Password: SEU_TOKEN_AQUI
```

### Passo 3: Verificar
- Acesse: https://github.com/portalmagra/ylada
- Deve aparecer todo o código do YLADA

## 🎯 O que será enviado:
- ✅ Projeto Next.js completo
- ✅ Calculadoras (IMC, Composição Corporal, Proteína)
- ✅ Quiz de avaliação de saúde
- ✅ Dashboard profissional
- ✅ Sistema Stripe integrado
- ✅ Suporte PWA e multi-idioma

## 🚀 Próximos Passos (após push):
1. **Deploy no Vercel**: Conectar repositório GitHub
2. **Configurar variáveis**: Stripe keys, domínio
3. **Testar**: Todas as funcionalidades online
4. **Domínio**: Configurar domínio personalizado

---
**💡 Dica**: O token é mais seguro que senha e funciona perfeitamente!
