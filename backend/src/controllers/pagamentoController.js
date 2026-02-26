import pagamentoService from "../services/pagamentoService.js";

const pagamentoController = {
  create: async (req, res) => {
    try {
      const pagamento = await pagamentoService.create(req.body);
      res.status(200).json(pagamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default pagamentoController;
