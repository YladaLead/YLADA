# 💆 Demo Estética — perfil preenchido

## Conta para teste/demo na área Estética

Para entrar na área Estética **com o perfil empresarial já preenchido** (ideal para demonstrações e testes):

- **Email:** `demo.estetica@ylada.app`
- **Senha:** `Demo@2025!`

Após o login você será redirecionado para a área Estética. No menu, acesse **Perfil** para ver o perfil completo (área de atuação, dores, metas, etc.) já preenchido.

## Como criar/atualizar a conta demo

Execute no projeto:

```bash
node scripts/criar-contas-demo-videos.js
```

Esse script:

- Cria ou atualiza o usuário `demo.estetica@ylada.app`
- Cria/atualiza o registro em `user_profiles` (perfil = estetica)
- Insere o perfil Noel em `ylada_noel_profile` (segment = estetica) com dados de clínica de estética (pele, skincare, autocuidado, agenda, captação)

Se você usa outra conta de teste (ex.: seu próprio e-mail com perfil estética) e o **perfil ainda está vazio**, é porque não existe registro em `ylada_noel_profile` para esse usuário com `segment = 'estetica'`. Nesse caso você precisa preencher o perfil pela tela **Perfil** (formulário em etapas) ou rodar o script acima para usar a conta `demo.estetica@ylada.app`.

## Resumo

| Situação | O que fazer |
|----------|-------------|
| Quero testar com perfil já preenchido | Use `demo.estetica@ylada.app` / `Demo@2025!` (após rodar o script) |
| Minha conta está com perfil vazio | Acesse **Perfil** no menu e preencha área de atuação e as etapas |
| Conta demo não existe ou perfil sumiu | Rode `node scripts/criar-contas-demo-videos.js` |
