import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Fornecedores.css";

const initialForm = {
  nome: "",
  telefone: "",
  email: "",
  endereco: "",
};

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFornecedores() {
    try {
      setLoading(true);
      const data = await api.get("/fornecedores");
      setFornecedores(data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar fornecedores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFornecedores();
  }, []);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function startEdit(fornecedor) {
    setEditId(fornecedor.id);
    setForm({
      nome: fornecedor.nome || "",
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
      endereco: fornecedor.endereco || "",
    });
    setIsModalOpen(true);
  }

  function resetForm() {
    setEditId(null);
    setForm(initialForm);
    setIsModalOpen(false);
  }

  function openCreateModal() {
    setEditId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (editId) {
        await api.put(`/fornecedores/${editId}`, form);
      } else {
        await api.post("/fornecedores", form);
      }
      resetForm();
      await loadFornecedores();
    } catch (err) {
      setError(err.message || "Erro ao salvar fornecedor");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Deseja remover este fornecedor?");
    if (!confirmed) return;

    try {
      await api.delete(`/fornecedores/${id}`);
      await loadFornecedores();
    } catch (err) {
      setError(err.message || "Erro ao remover fornecedor");
    }
  }

  return (
    <div className="fornecedores-container">
      <div className="fornecedores-header">
        <h1>Fornecedores</h1>
        <button type="button" className="btn-novo" onClick={openCreateModal}>
          + Novo Fornecedor
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>{editId ? "Editar Fornecedor" : "Novo Fornecedor"}</h2>
            <form className="fornecedores-form" onSubmit={onSubmit}>
              <input name="nome" placeholder="Nome" value={form.nome} onChange={onChange} required />
              <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={onChange} />
              <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
              <input name="endereco" placeholder="Endereco" value={form.endereco} onChange={onChange} />
              <button type="submit" className="btn-submit">{editId ? "Atualizar" : "Criar Fornecedor"}</button>
              <button type="button" className="btn-cancelar" onClick={resetForm}>
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="fornecedores-lista">
          <div className="fornecedores-tabela-header">
            <span>Nome</span>
            <span>Telefone</span>
            <span>Email</span>
            <span>Endereco</span>
            <span>Acoes</span>
          </div>

          {fornecedores.map((fornecedor) => (
            <div key={fornecedor.id} className="fornecedor-item">
              <span>{fornecedor.nome}</span>
              <span>{fornecedor.telefone || "-"}</span>
              <span>{fornecedor.email || "-"}</span>
              <span>{fornecedor.endereco || "-"}</span>
              <div className="actions">
                <button type="button" className="btn-edit" onClick={() => startEdit(fornecedor)}>
                  Editar
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDelete(fornecedor.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
