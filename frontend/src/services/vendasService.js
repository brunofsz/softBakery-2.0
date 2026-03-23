import request from "./api";

export async function listarVendas() {
  return request("/vendas");
}

export async function criarVenda(venda) {
  return request("/vendas", {
    method: "POST",
    body: JSON.stringify(venda),
  });
}
