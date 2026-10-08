# T5: backend (with db) + frontend

## Parte 1 (weight 3/6)

Implementar o backend, com banco, para cumprir as requisições especificadas em [`REQUESTS.http`](REQUESTS.http).

Os `endpoints` devem estar em seus arquivos _handlers_ específicos.

Use os _filters_ que já desenvolvemos.

As rotas devem ser definidas no `index.js`, como de costume.

Você pode (e deve) modificar o `server.js` para aceitar caminhos tipo `/questions/1`, mas deve ser genérico, isto é, não pode mencionar `questions`, `answers` ou outro `path` concreto.

## Parte 2 (weight 2/6)

Escrever testes para os `endpoints` com `vitest`.

## Parte 3 (weight 1/6)

Implementar o frontend, simples, sem react, css, etc, apenas HTML5 e Vanilla JS.

## Considerações

Lembre de configurar e instalar o eslint, sabendo que _errors_ ou _warnings_ excessivos baixam a grade.

Necessário enviar tudo (exceto `node_modules`, claro), inclusive o `schema.sql` para reproduzir e popular o banco de dados, assim como devolver esse `REQUESTS.http` com quaisquer experimentos que tenha adicionado.

As configurações, server, index, filters, etc, podem ser pegos dos últimos repositórios.