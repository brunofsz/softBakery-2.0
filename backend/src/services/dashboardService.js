import prisma from "../database/prisma.js";

function diaKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

const dashboardService = {
  getResumo: async (dias = 7) => {
    const dataInicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

    const vendas = await prisma.venda.findMany({
      where: {
        createdAt: {
          gte: dataInicio,
        },
      },
    });

    const porDia = {};

    for (const venda of vendas) {
      const dia = diaKey(venda.createdAt);

      if (!porDia[dia]) {
        porDia[dia] = {
          vendas: 0,
          faturamento: 0,
        };
      }

      porDia[dia].vendas += 1;
      porDia[dia].faturamento += Number(venda.total);
    }

    const series = [];

    for (const dia in porDia) {
      series.push({
        dia,
        vendas: porDia[dia].vendas,
        faturamento: porDia[dia].faturamento,
      });
    }

    return series;
  },
};

export default dashboardService;
