import request from "./api";

export async function listarClientes() {
  return request("/clientes");
}

export async function criarCliente(cliente) {
  return request("/clientes", {
    method: "POST",
    body: JSON.stringify(cliente),
  });
}

export async function atualizarCliente(id, cliente) {
  return request(`/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(cliente),
  });
}

export async function excluirCliente(id) {
  return request(`/clientes/${id}`, {
    method: "DELETE",
  });
}
