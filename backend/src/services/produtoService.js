import prisma from "../database/prisma.js";

const produtoService = {
  create: async (data) => {
    const { nome, descricao, preco, estoque, estoqueMinimo, fornecedorId } =
      data;

    if (!nome || !preco || !fornecedorId) {
      throw new Error("Campos obrigatórios não informados");
    }

    if (preco <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    const fornecedorExiste = await prisma.fornecedor.findUnique({
      where: { id: fornecedorId },
    });

    if (!fornecedorExiste) {
      throw new Error("Fornecedor não encontrado");
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        estoque,
        estoqueMinimo,
        fornecedorId,
      },
    });

    return produto;
  },
  getAll: async () => {
    const produtos = await prisma.produto.findMany({
      include: { fornecedor: true },
      orderBy: { id: "asc" },
    });
    return produtos;
  },
  getById: async (id) => {
    if (Number.isNaN(id)) {
      throw new Error("ID inválido");
    }
    const produto = await prisma.produto.findUnique({
      where: { id: id },
      include: { fornecedor },
    });
    return produto;
  },
  update: async (id, data) => {
    if (Number.isNaN(id)) {
      throw new Error("ID inválido");
    }
    if (data.preco && data.preco <= 0) {
      throw new Error("Preço deve ser maior que zero");
    }

    if (data.fornecedorId) {
      const fornecedorExiste = await prisma.fornecedor.findUnique({
        where: { id: data.fornecedorId },
      });

      if (!fornecedorExiste) {
        throw new Error("Fornecedor não encontrado");
      }
    }

    const updated = await prisma.produto.update({
      where: {
        id: id,
      },
      data,
    });
    return updated;
  },
  disable: async (id) => {
    if (Number.isNaN(id)) {
      throw new Error("ID inválido");
    }
    const updated = await prisma.produto.update({
      where: { id: id },
      data: {
        ativo: false,
      },
    });

    return updated;
  },
  enable: async (id) => {
    if (Number.isNaN(id)) {
      throw new Error("ID inválido");
    }
    const updated = await prisma.produto.update({
      where: { id: id },
      data: {
        ativo: true,
      },
    });

    return updated;
  },
  delete: async (id) => {
    if (Number.isNaN(id)) {
      throw new Error("ID inválido");
    }
    const deleted = await prisma.produto.delete({
      where: {
        id: id,
      },
    });
    return deleted;
  },
};

export default produtoService;
