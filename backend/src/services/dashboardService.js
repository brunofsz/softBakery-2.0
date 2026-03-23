import prisma from "../database/prisma.js";

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const diaKey = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const formatDia = (date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};

const dashboardService = {
  getResumo: async (dias = 7) => {
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const inicioPeriodo = startOfDay(
      new Date(hoje.getTime() - (dias - 1) * 24 * 60 * 60 * 1000),
    );

    const [
      vendasHoje,
      clientesDevendo,
      produtosResumo,
      ultimasVendas,
      vendasPeriodo,
      vendasPorPagamento,
    ] = await Promise.all([
      prisma.venda.findMany({
        where: {
          createdAt: {
            gte: inicioHoje,
          },
        },
        select: {
          total: true,
        },
      }),
      prisma.cliente.count({
        where: {
          saldoDevedor: {
            gt: 0,
          },
        },
      }),
      prisma.produto.findMany({
        select: {
          id: true,
          nome: true,
          estoque: true,
          estoqueMinimo: true,
        },
      }),
      prisma.venda.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          cliente: true,
        },
      }),
      prisma.venda.findMany({
        where: {
          createdAt: {
            gte: inicioPeriodo,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          createdAt: true,
          total: true,
        },
      }),
      prisma.venda.groupBy({
        by: ["tipoPagamento"],
        _count: {
          id: true,
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    const produtosEstoqueBaixo = produtosResumo
      .filter((produto) => produto.estoque <= produto.estoqueMinimo)
      .sort((produtoA, produtoB) => produtoA.estoque - produtoB.estoque);

    const seriesMap = new Map();

    for (let index = 0; index < dias; index += 1) {
      const date = new Date(inicioPeriodo);
      date.setDate(inicioPeriodo.getDate() + index);

      seriesMap.set(diaKey(date), {
        dia: formatDia(date),
        vendas: 0,
        faturamento: 0,
      });
    }

    vendasPeriodo.forEach((venda) => {
      const key = diaKey(venda.createdAt);
      const current = seriesMap.get(key);

      if (!current) {
        return;
      }

      current.vendas += 1;
      current.faturamento += Number(venda.total);
    });

    return {
      resumo: {
        vendasHoje: vendasHoje.length,
        faturamentoHoje: vendasHoje.reduce(
          (accumulator, venda) => accumulator + Number(venda.total),
          0,
        ),
        clientesDevendo,
        estoqueBaixo: produtosEstoqueBaixo.length,
      },
      vendasPorDia: Array.from(seriesMap.values()),
      vendasPorPagamento: vendasPorPagamento.map((item) => ({
        tipo: item.tipoPagamento,
        quantidade: item._count.id,
        total: Number(item._sum.total || 0),
      })),
      ultimasVendas: ultimasVendas.map((venda) => ({
        id: venda.id,
        cliente: venda.cliente?.nome || "Balcao",
        total: Number(venda.total),
        tipoPagamento: venda.tipoPagamento,
        status: venda.status,
        createdAt: venda.createdAt,
      })),
      produtosEstoqueBaixo: produtosEstoqueBaixo.slice(0, 5),
    };
  },
};

export default dashboardService;
