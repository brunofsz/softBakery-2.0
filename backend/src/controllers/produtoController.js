import produtoService from "../services/produtoService.js";

const produtoController = {
  create: async (req, res) => {
    try {
      const produto = await produtoService.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const produtos = await produtoService.getAll();
      res.status(200).json(produtos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },
  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.getById(id);
      res.status(200).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  },
  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const produto = await produtoService.update(id, data);
      res.status(200).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao editar produto" });
    }
  },
  disable: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.disable(id);
      res.status(200).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao desativar produto" });
    }
  },
  enable: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.enable(id);
      res.status(200).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao ativar produto" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.delete(id);
      res.status(200).json(produto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao desativar produto" });
    }
  },
};

export default produtoController;
