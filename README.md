# [Soft Bakery 2.0](https://soft-bakery-2-0.vercel.app/)

Soft Bakery 2.0 é um sistema full stack de gestão para padaria, desenvolvido com foco em simular um ambiente real de negócio, aplicando boas práticas de arquitetura, regras de negócio e integração entre frontend e backend.

O projeto surgiu após a análise do sistema desenvolvido como TCC no meu curso técnico, que apresentava limitações estruturais e de lógica. A partir disso, foi tomada a decisão de reconstruí-lo do zero, com o objetivo de validar conhecimentos, evoluir tecnicamente e aproximar a aplicação de um cenário profissional.

## Visão Geral

A aplicação permite o gerenciamento completo de uma padaria, incluindo controle de produtos, fornecedores, clientes e vendas, além de regras de negócio relacionadas a estoque, pagamentos e vendas fiado.


## Funcionalidades

- Cadastro e gerenciamento de produtos
- Controle de estoque com estoque mínimo
- Cadastro de fornecedores
- Cadastro de clientes
- Registro de vendas
- Venda com ou sem cliente
- Regra de venda fiado (exige cliente cadastrado)
- Controle de saldo pendente
- Validação de estoque:
  - Permite venda com estoque baixo 
  - Bloqueia venda sem estoque suficiente
- Dashboard com métricas
- Listagem e detalhamento de vendas


## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Frontend
- React
- React Router
- React Toastify
- Recharts
- React Icons


## Arquitetura

O backend segue uma separação clara de responsabilidades:

- Controllers: responsáveis por lidar com requisições e respostas HTTP
- Services: responsáveis pelas regras de negócio e acesso ao banco de dados
- Prisma: utilizado como ORM para comunicação com o banco PostgreSQL

Essa abordagem facilita manutenção, escalabilidade e organização do código.


## Estrutura do Projeto

```

softBakery
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── routes
│   │   └── database
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── routes
│   │   ├── services
│   │   ├── hooks
│   │   └── utils
│   ├── index.html
│   └── package.json
│
└── softbakery.sql

````


## Como Executar o Projeto

### Backend

```bash
cd backend
npm install
````

Configurar o arquivo `.env` com a URL do banco PostgreSQL.

```bash
npx prisma db push
npm run start
```



### Frontend

```bash
cd frontend
npm install
npm run dev
```


## Deploy

* Backend: [https://softbakery-backend-production.up.railway.app](https://softbakery-backend-production.up.railway.app)
* Frontend: [https://soft-bakery-2-0.vercel.app/](https://soft-bakery-2-0.vercel.app/)



## Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

* Evolução técnica em desenvolvimento full stack
* Aplicação de regras de negócio reais
* Estruturação de backend profissional
* Integração entre frontend e backend
* Criação de um projeto sólido para portfólio

