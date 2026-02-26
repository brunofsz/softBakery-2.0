import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";
import "./Estoque.css";

const initialForm = {
  nome: "",
  descricao: "",
  preco: "",
  estoque: "",
  estoqueMinimo: "",
  fornecedorId: "",
};

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [produtosData, fornecedoresData] = await Promise.all([
        api.get("/produtos"),
        api.get("/fornecedores"),
      ]);
      setProdutos(produtosData || []);
      setFornecedores(fornecedoresData || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar estoque");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function normalizeFormData() {
    return {
      nome: form.nome,
      descricao: form.descricao || null,
      preco: Number(form.preco),
      estoque: Number(form.estoque || 0),
      estoqueMinimo: Number(form.estoqueMinimo || 0),
      fornecedorId: Number(form.fornecedorId),
    };
  }

  function startEdit(produto) {
    setEditId(produto.id);
    setForm({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      estoque: produto.estoque ?? "",
      estoqueMinimo: produto.estoqueMinimo ?? "",
      fornecedorId: produto.fornecedorId ?? "",
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
      const payload = normalizeFormData();
      if (editId) {
        await api.put(`/produtos/${editId}`, payload);
      } else {
        await api.post("/produtos", payload);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao salvar produto");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Deseja remover este produto?");
    if (!confirmed) return;

    try {
      await api.delete(`/produtos/${id}`);
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao remover produto");
    }
  }

  async function toggleAtivo(produto) {
    try {
      await api.put(`/produtos/${produto.id}/${produto.ativo ? "disable" : "enable"}`, {});
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao atualizar status do produto");
    }
  }

  return (
    <div className="estoque-container">
      <div className="estoque-header">
        <h1>Estoque</h1>
        <button type="button" className="btn-novo" onClick={openCreateModal}>
          + Novo Produto
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>{editId ? "Editar Produto" : "Novo Produto"}</h2>
            <form className="estoque-form" onSubmit={onSubmit}>
              <input name="nome" placeholder="Nome" value={form.nome} onChange={onChange} required />
              <input name="descricao" placeholder="Descricao" value={form.descricao} onChange={onChange} />
              <input name="preco" type="number" step="0.01" min="0" placeholder="Preco" value={form.preco} onChange={onChange} required />
              <input name="estoque" type="number" min="0" placeholder="Quantidade" value={form.estoque} onChange={onChange} />
              <input name="estoqueMinimo" type="number" min="0" placeholder="Estoque minimo" value={form.estoqueMinimo} onChange={onChange} />
              <select name="fornecedorId" value={form.fornecedorId} onChange={onChange} required>
                <option value="">Selecione fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-submit">{editId ? "Atualizar" : "Criar Produto"}</button>
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
        <div className="estoque-lista">
          <div className="estoque-tabela-header">
            <span>Produto</span>
            <span>Preco</span>
            <span>Quantidade</span>
            <span>Fornecedor</span>
            <span>Status</span>
            <span>Acoes</span>
          </div>

          {produtos.map((produto) => (
            <div key={produto.id} className="estoque-item">
              <span>{produto.nome}</span>
              <span>{formatCurrency(produto.preco)}</span>
              <span>{produto.estoque}</span>
              <span>{produto.fornecedor?.nome || "-"}</span>
              <span className={produto.estoque <= produto.estoqueMinimo ? "status baixo" : "status ok"}>
                {produto.estoque <= produto.estoqueMinimo ? "Estoque baixo" : "Normal"}
              </span>
              <div className="actions">
                <button type="button" className="btn-edit" onClick={() => startEdit(produto)}>
                  Editar
                </button>
                <button type="button" className="btn-toggle" onClick={() => toggleAtivo(produto)}>
                  {produto.ativo ? "Desativar" : "Ativar"}
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDelete(produto.id)}>
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
