import clienteService from "../services/clienteService.js";

const clienteController = {
  create: async (req, res) => {
    try {
      const cliente = await clienteService.create(req.body);
      return res.status(201).json(cliente);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const clientes = await clienteService.getAll();
      return res.status(200).json(clientes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const cliente = await clienteService.getById(id);
      return res.status(200).json(cliente);
    } catch (error) {
      const status = error.message === "Cliente não encontrado." ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const cliente = await clienteService.update(id, req.body);
      return res.status(200).json(cliente);
    } catch (error) {
      const status = error.message === "Cliente não encontrado." ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await clienteService.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === "Cliente não encontrado." ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },
};

export default clienteController;
