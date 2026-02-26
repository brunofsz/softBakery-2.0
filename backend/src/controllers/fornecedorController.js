import fornecedorService from "../services/fornecedorService.js";

const fornecedorController = {
  create: async (req, res) => {
    try {
      const fornecedor = await fornecedorService.create(req.body);
      res.status(201).json(fornecedor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const fornecedores = await fornecedorService.getAll();
      res.status(200).json(fornecedores);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const fornecedor = await fornecedorService.getById(id);
      res.status(200).json(fornecedor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await fornecedorService.update(id, data);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      res.status(200).json(await fornecedorService.delete(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default fornecedorController;
