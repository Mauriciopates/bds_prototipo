# BDS · Blue Digital Store — site (fase 1)

Site estático (HTML, CSS e JavaScript), sem servidor. Nesta fase as encomendas são feitas por **pedido de orçamento**, sem pagamento online.

## Estrutura
- `index.html` — páginas do site
- `style.css` — estilos (cores e letras do logótipo)
- `script.js` — funcionamento (catálogo, personalizador 3D, orçamento, páginas legais)
- `img/` — fotografias, logótipo e `livro_reclamacoes.png`
- `videos/` — vídeos dos Reels (ver `videos/LEIA-ME.txt`)
- `vendor/three.min.js` — biblioteca 3D

## Configuração rápida (início do `script.js`)
- `MODO` — `'orcamento'` (fase 1) ou `'completo'` (com pagamentos Viva)
- `VIDEOS` — lista de vídeos dos Reels
- `PROMOS` — campanhas do quadro de promoções
- `EMPRESA` (secção de informação legal) — NIF, código postal e outros dados da empresa

## Publicar no GitHub Pages
1. Enviar estes ficheiros para a raiz do repositório.
2. Em **Settings → Pages**, escolher o ramo `main` e a pasta `/ (root)`.
3. Os nomes dos ficheiros distinguem maiúsculas de minúsculas: manter `img/livro_reclamacoes.png` exatamente assim.
