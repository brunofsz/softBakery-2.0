import request from "./api";

export const criarPagamento = async (pagamento) => {
  return request("/pagamentos", {
    method: "POST",
    body: JSON.stringify(pagamento),
  });
}
