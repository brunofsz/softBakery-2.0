import {
  PrismaClient,
  Prisma,
  TipoPagamento,
  StatusVenda,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa (ordem importa por FK)
  await prisma.itemVenda.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.pagamento.deleteMany();
  await prisma.movimentacaoEstoque.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.fornecedor.deleteMany(); 
  await prisma.cliente.deleteMany();

  // Fornecedores
  const fornecedores = await prisma.fornecedor.createMany({
    data: [
      {
        nome: "Distribuidora Central",
        telefone: "11999999999",
        email: "contato@central.com",
        endereco: "Rua das Indústrias, 100",
      },
      {
        nome: "Laticínios Vale Leite",
        telefone: "11988887777",
        email: "vendas@valeleite.com",
        endereco: "Av. Leiteira, 250",
      },
      {
        nome: "Padaria Atacadão (Insumos)",
        telefone: "11977776666",
        email: "comercial@atacadaoinsumos.com",
        endereco: "Rod. Principal, km 12",
      },
      {
        nome: "Bebidas & Cia",
        telefone: "11966665555",
        email: "pedido@bebidasecia.com",
        endereco: "Rua dos Refrigerantes, 45",
      },
      {
        nome: "Doces Premium",
        telefone: "11955554444",
        email: "contato@docespremium.com",
        endereco: "Rua dos Confeiteiros, 88",
      },
    ],
  });

  // Buscar ids (createMany não retorna ids)
  const fornecedoresDb = await prisma.fornecedor.findMany({
    orderBy: { id: "asc" },
  });

  // Clientes (pra testar fiado)
  await prisma.cliente.createMany({
    data: [
      { nome: "João Silva", telefone: "19999990001", endereco: "Rua A, 10" },
      { nome: "Maria Souza", telefone: "19999990002", endereco: "Rua B, 20" },
      {
        nome: "Empresa XPTO",
        telefone: "19333330003",
        endereco: "Av. Central, 500",
      },
    ],
  });

  // Produtos (25+)
  const f1 = fornecedoresDb[0].id;
  const f2 = fornecedoresDb[1].id;
  const f3 = fornecedoresDb[2].id;
  const f4 = fornecedoresDb[3].id;
  const f5 = fornecedoresDb[4].id;

  await prisma.produto.createMany({
    data: [
      {
        nome: "Pão Francês",
        descricao: "Pão tradicional",
        preco: 0.8,
        estoque: 300,
        estoqueMinimo: 50,
        fornecedorId: f3,
      },
      {
        nome: "Pão de Leite",
        descricao: "Macio e levemente doce",
        preco: 1.2,
        estoque: 120,
        estoqueMinimo: 20,
        fornecedorId: f3,
      },
      {
        nome: "Pão de Queijo (un)",
        descricao: "Unidade",
        preco: 1.5,
        estoque: 200,
        estoqueMinimo: 30,
        fornecedorId: f3,
      },
      {
        nome: "Bolo de Chocolate (fat)",
        descricao: "Fatia",
        preco: 6.5,
        estoque: 40,
        estoqueMinimo: 10,
        fornecedorId: f5,
      },
      {
        nome: "Bolo de Cenoura (fat)",
        descricao: "Fatia",
        preco: 6.0,
        estoque: 35,
        estoqueMinimo: 10,
        fornecedorId: f5,
      },
      {
        nome: "Sonho",
        descricao: "Recheado",
        preco: 5.5,
        estoque: 25,
        estoqueMinimo: 8,
        fornecedorId: f5,
      },
      {
        nome: "Coxinha",
        descricao: "Frango",
        preco: 6.9,
        estoque: 60,
        estoqueMinimo: 15,
        fornecedorId: f3,
      },
      {
        nome: "Esfiha",
        descricao: "Carne",
        preco: 7.5,
        estoque: 50,
        estoqueMinimo: 12,
        fornecedorId: f3,
      },
      {
        nome: "Empada",
        descricao: "Palmito",
        preco: 7.9,
        estoque: 30,
        estoqueMinimo: 10,
        fornecedorId: f3,
      },
      {
        nome: "Croissant",
        descricao: "Manteiga",
        preco: 8.9,
        estoque: 20,
        estoqueMinimo: 8,
        fornecedorId: f3,
      },

      {
        nome: "Leite 1L",
        descricao: "Integral",
        preco: 5.8,
        estoque: 50,
        estoqueMinimo: 10,
        fornecedorId: f2,
      },
      {
        nome: "Manteiga 200g",
        descricao: "Com sal",
        preco: 9.9,
        estoque: 35,
        estoqueMinimo: 8,
        fornecedorId: f2,
      },
      {
        nome: "Queijo Mussarela (100g)",
        descricao: "Fatiado",
        preco: 6.5,
        estoque: 80,
        estoqueMinimo: 15,
        fornecedorId: f2,
      },
      {
        nome: "Presunto (100g)",
        descricao: "Fatiado",
        preco: 5.9,
        estoque: 70,
        estoqueMinimo: 15,
        fornecedorId: f2,
      },

      {
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante",
        preco: 10.5,
        estoque: 40,
        estoqueMinimo: 8,
        fornecedorId: f4,
      },
      {
        nome: "Guaraná 2L",
        descricao: "Refrigerante",
        preco: 9.5,
        estoque: 35,
        estoqueMinimo: 8,
        fornecedorId: f4,
      },
      {
        nome: "Água 500ml",
        descricao: "Sem gás",
        preco: 2.75,
        estoque: 80,
        estoqueMinimo: 20,
        fornecedorId: f4,
      },
      {
        nome: "Suco 1L",
        descricao: "Uva",
        preco: 8.9,
        estoque: 25,
        estoqueMinimo: 6,
        fornecedorId: f4,
      },

      {
        nome: "Café Expresso",
        descricao: "Pequeno",
        preco: 4.5,
        estoque: 999,
        estoqueMinimo: 0,
        fornecedorId: f1,
      },
      {
        nome: "Cappuccino",
        descricao: "Crema",
        preco: 7.9,
        estoque: 999,
        estoqueMinimo: 0,
        fornecedorId: f1,
      },

      {
        nome: "Brigadeiro (un)",
        descricao: "Unidade",
        preco: 2.5,
        estoque: 80,
        estoqueMinimo: 20,
        fornecedorId: f5,
      },
      {
        nome: "Beijinho (un)",
        descricao: "Unidade",
        preco: 2.5,
        estoque: 80,
        estoqueMinimo: 20,
        fornecedorId: f5,
      },
      {
        nome: "Pudim (fat)",
        descricao: "Fatia",
        preco: 7.5,
        estoque: 18,
        estoqueMinimo: 6,
        fornecedorId: f5,
      },
      {
        nome: "Torta Holandesa (fat)",
        descricao: "Fatia",
        preco: 9.5,
        estoque: 15,
        estoqueMinimo: 5,
        fornecedorId: f5,
      },
      {
        nome: "Donut",
        descricao: "Cobertura",
        preco: 6.0,
        estoque: 22,
        estoqueMinimo: 8,
        fornecedorId: f5,
      },
      {
        nome: "Pão Integral",
        descricao: "Fatiado",
        preco: 12.9,
        estoque: 12,
        estoqueMinimo: 4,
        fornecedorId: f3,
      },
    ],
  });

  // (Opcional) criar 1 venda de exemplo
  const cliente = await prisma.cliente.findFirst({ orderBy: { id: "asc" } });
  const produtos = await prisma.produto.findMany({
    take: 3,
    orderBy: { id: "asc" },
  });

  // venda avista simples com 2 itens
  await prisma.venda.create({
    data: {
      tipoPagamento: TipoPagamento.AVISTA,
      status: StatusVenda.PAGO,
      total: new Prisma.Decimal(
        Number(produtos[0].preco) * 2 + Number(produtos[1].preco) * 1,
      ),
      clienteId: null,
      itens: {
        create: [
          {
            produtoId: produtos[0].id,
            quantidade: 2,
            precoUnitario: produtos[0].preco,
            subtotal: produtos[0].preco.mul(2),
          },
          {
            produtoId: produtos[1].id,
            quantidade: 1,
            precoUnitario: produtos[1].preco,
            subtotal: produtos[1].preco.mul(1),
          },
        ],
      },
    },
  });

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
