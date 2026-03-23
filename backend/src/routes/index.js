import { Router } from "express";
import {
  fornecedorController,
  produtoController,
  vendaController,
  clienteController,
  pagamentoController,
  dashboardController,
} from "../controllers/index.js";

const router = Router();

router.post("/clientes", clienteController.create);

router.get("/clientes", clienteController.getAll);

router.get("/clientes/:id", clienteController.getById);

router.put("/clientes/:id", clienteController.update);

router.delete("/clientes/:id", clienteController.delete);

router.post("/produtos", produtoController.create);

router.get("/produtos", produtoController.getAll);

router.get("/produtos/:id", produtoController.getById);

router.put("/produtos/:id", produtoController.update);

router.put("/produtos/:id/enable", produtoController.enable);

router.put("/produtos/:id/disable", produtoController.disable);

router.delete("/produtos/:id", produtoController.delete);

router.post("/fornecedores", fornecedorController.create);

router.get("/fornecedores", fornecedorController.getAll);

router.get("/fornecedores/:id", fornecedorController.getById);

router.put("/fornecedores/:id", fornecedorController.update);

router.delete("/fornecedores/:id", fornecedorController.delete);

router.post("/vendas", vendaController.create);

router.get("/vendas", vendaController.getAll);

router.get("/vendas/:id", vendaController.getById);

router.post("/pagamentos", pagamentoController.create);

router.get("/dashboard", dashboardController.getResumo);

export default router;
