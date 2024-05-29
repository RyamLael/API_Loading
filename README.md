# API loading 

API Loading é uma API que gerencia postagens, seguindo os métodos do CRUD de criar, ler, atualizar e apagar informações do banco de dados.

## Preparando o projeto:

- Primeiro, é necessário possuir o [Node.js](https://nodejs.org/en) instalado no seu computador

- Clone o repositório em uma pasta do seu computador: `git clone https://github.com/RyamLael/API-Loading.git`

- Também é necessário ter o [yarn](https://yarnpkg.com/) instalado no computador.

### Baixando as dependências necessárias para o projeto:
Crie uma nova instancia de terminal na pasta raíz do projeto.

Baixar o [Sucrase](https://sucrase.io/) e o [Nodemon](https://sucrase.io/):
- Execute o seguinte comando no terminal: `yarn add sucrase nodemon -D`

Baixar o [Express](https://expressjs.com/):
- Execute no terminal: `yarn add express`

Baixar o [Prisma](https://www.prisma.io/): 

- Execute no terminal : `yarn add prisma` e depois o comando: `yarn add @prisma/client`

## Iniciando o servidor: 
Para conectar o prisma com o banco de dados, execute: `yarn prisma migrate dev --name init`

Por fim, basta executar o comando: `yarn dev para iniciar o servidor.`

## Consumindo a API:
Para saber como utilizar a API, basta consultar a documentação: [API Loading](https://documenter.getpostman.com/view/35177931/2sA3Qqgstc)
