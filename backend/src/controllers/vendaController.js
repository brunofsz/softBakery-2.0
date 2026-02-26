import vendaService from "../services/vendaService.js";

const vendaController = {
  create: async (req, res) => { 
    try {
      const venda = await vendaService.create(req.body);
      res.status(201).json(venda);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const vendas = await vendaService.getAll();
      res.status(200).json(vendas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const venda = await vendaService.getById(id);
      res.status(200).json(venda);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },  
};

export default vendaController;
