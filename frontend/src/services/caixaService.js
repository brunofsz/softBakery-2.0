import request from "./api";

export async function buscarProdutosParaCaixa() {
  return request("/produtos");
}
