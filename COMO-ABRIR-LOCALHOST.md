# Se o app não abre no navegador

## Você está no Cursor com conexão remota (SSH)?

Se o projeto abre no Cursor por SSH ou em outra máquina, **localhost no seu PC não enxerga o servidor**. Use o encaminhamento de portas do Cursor:

1. No Cursor, vá no menu **View (Ver)** → **Ports** (ou na barra inferior, aba **PORTS**).
2. Na lista, procure a porta **3001** (ou **3000**). Se não aparecer, o servidor pode ter parado — rode no terminal: `npm run dev`.
3. Na linha da porta 3001, clique em **Open in Browser** (ou no ícone de globo/link).
4. O Cursor abre a URL correta pelo túnel; a página deve carregar.

## Servidor no seu próprio Mac (não remoto)

1. Abra **Chrome** ou **Safari**.
2. Na barra de endereços digite: `http://127.0.0.1:3001`
3. Enter.

Se der “conexão recusada”, a porta pode ter mudado. No terminal onde rodou `npm run dev`, veja a linha que diz **Local:** e use essa URL.

## Garantir porta fixa 3001

Para o app subir sempre na porta 3001:

```bash
npm run dev:port
```

Depois use **Ports** no Cursor (se remoto) ou `http://127.0.0.1:3001` no navegador.
