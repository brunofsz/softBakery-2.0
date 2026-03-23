import dashboardService from "../services/dashboardService.js";

const dashboardController = {
  getResumo: async (_req, res) => {
    try {
      const dashboard = await dashboardService.getResumo();
      return res.status(200).json(dashboard);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default dashboardController;
