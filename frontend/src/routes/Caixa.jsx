import { useEffect, useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import "./Caixa.css";

export default function Caixa() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pagamentoVista, setPagamentoVista] = useState("AVISTA");
  const [clienteFiadoId, setClienteFiadoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [produtosData, clientesData, vendasData] = await Promise.all([
        api.get("/produtos"),
        api.get("/clientes"),
        api.get("/vendas"),
      ]);
      setProdutos((produtosData || []).filter((produto) => produto.ativo));
      setClientes(clientesData || []);
      setVendas(vendasData || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar caixa");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function clearMessages() {
    setError("");
    setMessage("");
  }

  function adicionarProduto(produto) {
    clearMessages();
    if (produto.estoque <= 0) {
      setError("Produto sem estoque.");
      return;
    }

    setCarrinho((prev) => {
      const found = prev.find((item) => item.id === produto.id);
      if (!found) {
        return [...prev, { ...produto, quantidade: 1 }];
      }
      return prev.map((item) => {
        if (item.id !== produto.id) return item;
        if (item.quantidade >= produto.estoque) return item;
        return { ...item, quantidade: item.quantidade + 1 };
      });
    });
  }

  function alterarQuantidade(id, delta) {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const max = Number(item.estoque || 0);
          const quantidade = Math.min(Math.max(item.quantidade + delta, 0), max);
          return { ...item, quantidade };
        })
        .filter((item) => item.quantidade > 0),
    );
  }

  function removerProduto(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  const total = useMemo(
    () => carrinho.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0),
    [carrinho],
  );

  async function finalizarVenda(tipoPagamento) {
    clearMessages();
    if (!carrinho.length) {
      setError("Adicione itens ao carrinho.");
      return;
    }

    if (tipoPagamento === "FIADO" && !clienteFiadoId) {
      setError("Selecione um cliente para vender fiado.");
      return;
    }

    try {
      const payload = {
        tipoPagamento: tipoPagamento === "FIADO" ? "FIADO" : pagamentoVista,
        itens: carrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
      };

      if (tipoPagamento === "FIADO") {
        payload.clienteId = Number(clienteFiadoId);
      }

      await api.post("/vendas", payload);
      setCarrinho([]);
      setClienteFiadoId("");
      setMessage("Venda registrada com sucesso.");
      await loadData();
    } catch (err) {
      setError(err.message || "Erro ao finalizar venda");
    }
  }

  if (loading) {
    return <div className="caixa-container"><p>Carregando caixa...</p></div>;
  }

  return (
    <div className="caixa-container">
      <div className="produtos">
        <h2>Produtos</h2>
        <div className="grid-produtos">
          {produtos.map((produto) => (
            <button key={produto.id} className="produto-btn" onClick={() => adicionarProduto(produto)}>
              <div className="produto-topo">
                <span className="produto-nome">{produto.nome}</span>
                <span className="produto-preco">{formatCurrency(produto.preco)}</span>
              </div>
              <div className="produto-rodape">
                <small>Estoque: {produto.estoque}</small>
                <small>{produto.estoque > 0 ? "Disponivel" : "Indisponivel"}</small>
              </div>
            </button>
          ))}
        </div>

      </div>

      <div className="carrinho">
        <h2>Venda Atual</h2>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="itens">
          {carrinho.length === 0 && <p>Nenhum item adicionado.</p>}

          {carrinho.map((item) => (
            <div key={item.id} className="item">
              <div>
                <strong>{item.nome}</strong>
                <p>
                  {item.quantidade} x {formatCurrency(item.preco)}
                </p>
              </div>

              <div className="item-actions">
                <button type="button" className="btn-qty" onClick={() => alterarQuantidade(item.id, -1)}>
                  -
                </button>
                <span>{item.quantidade}</span>
                <button type="button" className="btn-qty" onClick={() => alterarQuantidade(item.id, 1)}>
                  +
                </button>
                <button type="button" className="remove" onClick={() => removerProduto(item.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total">
          <h3>Total:</h3>
          <h2>{formatCurrency(total)}</h2>
        </div>

        <div className="acoes">
          <select value={pagamentoVista} onChange={(event) => setPagamentoVista(event.target.value)}>
            <option value="AVISTA">A vista</option>
            <option value="CREDITO">Credito</option>
          </select>
          <button className="btn finalizar" onClick={() => finalizarVenda("PAGO")}>
            Finalizar
          </button>
        </div>

        <div className="fiado-box">
          <select value={clienteFiadoId} onChange={(event) => setClienteFiadoId(event.target.value)}>
            <option value="">Cliente para fiado</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          <button className="btn fiado" onClick={() => finalizarVenda("FIADO")}>
            Vender Fiado
          </button>
        </div>

        <div className="vendas-recentes">
          <h3>Ultimas vendas</h3>
          {vendas.slice(0, 5).map((venda) => (
            <p key={venda.id}>
              #{venda.id} - {formatCurrency(venda.total)} - {venda.tipoPagamento} - {formatDate(venda.createdAt)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
