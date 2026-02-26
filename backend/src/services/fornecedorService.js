import prisma from "../database/prisma.js";

const fornecedorService = {
  create: async (data) => {
    const { nome, telefone, email, endereco } = data;

    if (!nome) {
      throw new Error("Nome é obrigatório.");
    }

    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        telefone,
        email,
        endereco,
      },
    });
    return fornecedor;
  },
  getAll: async () => {
    const fornecedores = await prisma.fornecedor.findMany({
      orderBy: {
        produtos: {
          _count: "desc",
        },
      },
    });
    return fornecedores;
  },
  getById: async (id) => {
    return await prisma.fornecedor.findUnique({
      where: {
        id: id,
      },
      include: {
        produtos: true,
      },
    });
  },
  update: async (id, data) => {
    if (Number.isNaN(id)) {
      throw new Error("ID Invalido");
    }
    const updated = await prisma.fornecedor.update({
      where: {
        id: id,
      },
      data,
    });
    return updated;
  },
  delete: async (id) => {
    const fornecedor = await prisma.fornecedor.findUnique({
      where: { id: id },
      include: { produtos: true },
    });

    if (fornecedor.produtos && fornecedor.produtos.length > 0) {
      throw new Error("Não é possivel excluir um fornecedor com produtos");
    }

    await prisma.fornecedor.delete({
      where: { id: id },
    });

    return true;
  },
};

export default fornecedorService;
