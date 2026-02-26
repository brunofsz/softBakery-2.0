import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";
import "./Clientes.css";

const initialForm = {
  nome: "",
  telefone: "",
  endereco: "",
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    clienteId: "",
    valor: "",
    formaPagamento: "AVISTA",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClientes() {
    try {
      setLoading(true);
      const data = await api.get("/clientes");
      setClientes(data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function startEdit(cliente) {
    setEditId(cliente.id);
    setForm({
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      endereco: cliente.endereco || "",
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

  function openPaymentModal(cliente) {
    setPaymentForm({
      clienteId: String(cliente.id),
      valor: "",
      formaPagamento: "AVISTA",
    });
    setIsPaymentModalOpen(true);
  }

  function closePaymentModal() {
    setPaymentForm({
      clienteId: "",
      valor: "",
      formaPagamento: "AVISTA",
    });
    setIsPaymentModalOpen(false);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (editId) {
        await api.put(`/clientes/${editId}`, form);
      } else {
        await api.post("/clientes", form);
      }
      resetForm();
      await loadClientes();
    } catch (err) {
      setError(err.message || "Erro ao salvar cliente");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Deseja remover este cliente?");
    if (!confirmed) return;

    try {
      await api.delete(`/clientes/${id}`);
      await loadClientes();
    } catch (err) {
      setError(err.message || "Erro ao remover cliente");
    }
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    try {
      await api.post("/pagamentos", {
        clienteId: Number(paymentForm.clienteId),
        valor: Number(paymentForm.valor),
        formaPagamento: paymentForm.formaPagamento,
      });
      closePaymentModal();
      await loadClientes();
    } catch (err) {
      setError(err.message || "Erro ao registrar pagamento");
    }
  }

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <div className="header-actions">
          <button type="button" className="btn-payment" onClick={() => setIsPaymentModalOpen(true)}>
            Registrar Pagamento
          </button>
          <button type="button" className="btn-novo" onClick={openCreateModal}>
            + Novo Cliente
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>{editId ? "Editar Cliente" : "Novo Cliente"}</h2>
            <form className="clientes-form" onSubmit={onSubmit}>
              <input name="nome" placeholder="Nome" value={form.nome} onChange={onChange} required />
              <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={onChange} />
              <input name="endereco" placeholder="Endereco" value={form.endereco} onChange={onChange} />
              <button type="submit" className="btn-submit">{editId ? "Atualizar" : "Criar Cliente"}</button>
              <button type="button" className="btn-cancelar" onClick={resetForm}>
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="modal-overlay" onClick={closePaymentModal}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>Registrar Pagamento</h2>
            <form className="clientes-form" onSubmit={handlePaymentSubmit}>
              <select
                value={paymentForm.clienteId}
                onChange={(event) =>
                  setPaymentForm((prev) => ({ ...prev, clienteId: event.target.value }))
                }
                required
              >
                <option value="">Selecione o cliente</option>
                {clientes
                  .filter((cliente) => Number(cliente.saldoDevedor) > 0)
                  .map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} ({formatCurrency(cliente.saldoDevedor)})
                    </option>
                  ))}
              </select>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Valor recebido"
                value={paymentForm.valor}
                onChange={(event) =>
                  setPaymentForm((prev) => ({ ...prev, valor: event.target.value }))
                }
                required
              />
              <select
                value={paymentForm.formaPagamento}
                onChange={(event) =>
                  setPaymentForm((prev) => ({ ...prev, formaPagamento: event.target.value }))
                }
              >
                <option value="AVISTA">A vista</option>
                <option value="CREDITO">Credito</option>
              </select>
              <button type="submit" className="btn-submit">Confirmar Pagamento</button>
              <button type="button" className="btn-cancelar" onClick={closePaymentModal}>
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
        <div className="clientes-lista">
          <div className="clientes-tabela-header">
            <span>Nome</span>
            <span>Telefone</span>
            <span>Endereco</span>
            <span>Saldo Devedor</span>
            <span>Acoes</span>
          </div>

          {clientes.map((cliente) => {
            const saldo = Number(cliente.saldoDevedor || 0);
            return (
              <div key={cliente.id} className="cliente-item">
                <span>{cliente.nome}</span>
                <span>{cliente.telefone || "-"}</span>
                <span>{cliente.endereco || "-"}</span>
                <span className={saldo > 0 ? "saldo negativo" : "saldo positivo"}>
                  {formatCurrency(saldo)}
                </span>
                <div className="actions">
                  <button type="button" className="btn-edit" onClick={() => startEdit(cliente)}>
                    Editar
                  </button>
                  <button type="button" className="btn-payment" onClick={() => openPaymentModal(cliente)}>
                    Pagamento
                  </button>
                  <button type="button" className="btn-danger" onClick={() => handleDelete(cliente.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
