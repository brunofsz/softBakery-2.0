import { StatusVenda, TipoMovEstoque, TipoPagamento } from "@prisma/client";
import prisma from "../database/prisma.js";

const vendaService = {
  create: async (data) => {
    const { tipoPagamento, clienteId, itens } = data;

    if (!itens || itens.length === 0) {
      throw new Error("A venda precisa ter pelo menos um item.");
    }
    if (itens.quantidade <= 0) {
      throw new Error("Um dos itens tem quantidade invalida");
    }

    if (tipoPagamento === TipoPagamento.FIADO && !clienteId) {
      throw new Error("ID do cliente é obrigatorio para vendas fiado");
    }

    return await prisma.$transaction(async (tx) => {
      let total = 0;
      const itensProcessados = [];

      for (const item of itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado.`);
        }

        if (produto.estoque < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto ${produto.nome}.`,
          );
        }

        const subtotal = Number(produto.preco) * item.quantidade;

        total += subtotal;

        itensProcessados.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal,
        });
      }

      const status =
        tipoPagamento === TipoPagamento.FIADO
          ? StatusVenda.PENDENTE
          : StatusVenda.PAGO;
      const saldoPendente = tipoPagamento === TipoPagamento.FIADO ? total : 0;

      const venda = await tx.venda.create({
        data: {
          total,
          tipoPagamento,
          status,
          clienteId: clienteId || null,
          saldoPendente,
        },
      });

      for (const item of itensProcessados) {
        await tx.itemVenda.create({
          data: {
            vendaId: venda.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.subtotal,
          },
        });

        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });

        await tx.movimentacaoEstoque.create({
          data: {
            tipo: TipoMovEstoque.SAIDA,
            quantidade: item.quantidade,
            motivo: "Venda",
            produtoId: item.produtoId,
          },
        });
      }

      if (tipoPagamento === TipoPagamento.FIADO) {
        await tx.cliente.update({
          where: { id: clienteId },
          data: {
            saldoDevedor: {
              increment: total,
            },
          },
        });
      }
      return venda;
    });
  },
  getAll: async () => {
    const vendas = await prisma.venda.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        cliente: true, 
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    return vendas;
  },

  getById: async (id) => {
    const venda = await prisma.venda.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!venda) {
      throw new Error("Venda não encontrada.");
    }

    return venda;
  },
};

export default vendaService;
