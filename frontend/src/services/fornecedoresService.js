import request from "./api";

export async function listarFornecedores() {
  return request("/fornecedores");
}

export async function criarFornecedor(fornecedor) {
  return request("/fornecedores", {
    method: "POST",
    body: JSON.stringify(fornecedor),
  });
}

export async function atualizarFornecedor(id, fornecedor) {
  return request(`/fornecedores/${id}`, {
    method: "PUT",
    body: JSON.stringify(fornecedor),
  });
}

export async function excluirFornecedor(id) {
  return request(`/fornecedores/${id}`, {
    method: "DELETE",
  });
}
