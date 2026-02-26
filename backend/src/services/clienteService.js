import prisma from "../database/prisma.js";

const clienteService = {
  create: async (data) => {
    const { nome, telefone, endereco } = data;

    if (!nome || typeof nome !== "string" || !nome.trim()) {
      throw new Error("Nome é obrigatório.");
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        telefone: telefone || null,
        endereco: endereco || null,
        // saldoDevedor NÃO vem do front (default 0 no schema)
      },
    });

    return cliente;
  },

  getAll: async () => {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        saldoDevedor: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            vendas: true,
            pagamentos: true,
          },
        },
      },
    });

    return clientes;
  },

  getById: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido.");
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        vendas: {
          orderBy: { createdAt: "desc" },
          include: {
            itens: {
              include: { produto: true },
            },
          },
        },
        pagamentos: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    return cliente;
  },

  update: async (id, data) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido.");
    }

    const { nome, telefone, endereco } = data;

    const existe = await prisma.cliente.findUnique({ where: { id } });
    if (!existe) throw new Error("Cliente não encontrado.");

    // Importante: NÃO permitir alterar saldoDevedor por aqui
    const payload = {};
    if (typeof nome === "string") payload.nome = nome.trim();
    if (telefone !== undefined) payload.telefone = telefone || null;
    if (endereco !== undefined) payload.endereco = endereco || null;

    if (Object.keys(payload).length === 0) {
      throw new Error("Nenhum campo válido para atualizar.");
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: payload,
    });

    return clienteAtualizado;
  },

  delete: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido.");
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            vendas: true,
            pagamentos: true,
          },
        },
      },
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    if (cliente._count.vendas > 0 || cliente._count.pagamentos > 0) {
      throw new Error(
        "Não é possível excluir: cliente possui vendas/pagamentos.",
      );
    }

    await prisma.cliente.delete({ where: { id } });
    return { message: "Cliente removido com sucesso." };
  },
};

export default clienteService;
