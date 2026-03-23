import request from "./api";

export async function listarProdutos() {
  return request("/produtos");
}

export async function criarProduto(produto) {
  return request("/produtos", {
    method: "POST",
    body: JSON.stringify(produto),
  });
}

export async function atualizarProduto(id, produto) {
  return request(`/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify(produto),
  });
}

export async function excluirProduto(id) {
  return request(`/produtos/${id}`, {
    method: "DELETE",
  });
}
