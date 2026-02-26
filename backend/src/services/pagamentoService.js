import { StatusVenda } from "@prisma/client";
import prisma from "../database/prisma.js";

const pagamentoService = {
  create: async (data) => {
    const { clienteId, valor, formaPagamento } = data;

    if (valor <= 0) {
      throw new Error("Valor invalido");
    }

    return await prisma.$transaction(async (tx) => {
      const cliente = await tx.cliente.findUnique({
        where: { id: clienteId },
      });

      if (!cliente) {
        throw new Error("Este cliente não existe");
      }

      if (Number(cliente.saldoDevedor) <= 0) {
        throw new Error("Este cliente não está devendo");
      }

      if (valor > Number(cliente.saldoDevedor)) {
        throw new Error("O valor pago é maior que a divida");
      }

      const pagamento = await tx.pagamento.create({
        data: { clienteId, valor, formaPagamento },
      });

      const clienteUpdated = await tx.cliente.update({
        where: { id: clienteId },
        data: { saldoDevedor: { decrement: valor } },
      });

      //Quitando vendas pendentes
      const vendasPendentes = await tx.venda.findMany({
        where: { clienteId: clienteId, status: StatusVenda.PENDENTE },
        orderBy: { createdAt: "asc" },
      });

      let valorRestante = valor;
      const vendasQuitadas = [];
      for (const venda of vendasPendentes) {
        if (Number(venda.saldoPendente) <= valorRestante) {
          const updated = await tx.venda.update({
            where: { id: venda.id },
            data: {
              status: StatusVenda.PAGO,
              saldoPendente: 0,
            },
          });
          valorRestante -= Number(venda.saldoPendente);
          vendasQuitadas.push(updated.id);
        } else {
          if (valorRestante) {
            await tx.venda.update({
              where: { id: venda.id },
              data: {
                saldoPendente: { decrement: valorRestante },
              },
            });
            valorRestante = 0;
          }
          break;
        }
      }

      return { pagamento, clienteUpdated, vendasQuitadas };
    });
  },
};

export default pagamentoService;
