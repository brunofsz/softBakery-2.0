import { useEffect, useRef, useState } from "react"
import { MdAdd, MdDeleteOutline, MdRemove } from "react-icons/md"
import formatMoney from "../utils/formatMoney"
import { listarProdutos } from "../services/produtosService"
import { listarClientes } from "../services/clientesService"
import { criarVenda } from "../services/vendasService"
import useToast from "../hooks/useToast"
import './Caixa.css'

const Caixa = () => {
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [carrinho, setCarrinho] = useState([])
  const [tipoPagamento, setTipoPagamento] = useState('AVISTA')
  const [clienteId, setClienteId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchInputRef = useRef(null)
  const pagamentoSelectRef = useRef(null)
  const finalizarButtonRef = useRef(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const [produtosData, clientesData] = await Promise.all([
          listarProdutos(),
          listarClientes(),
        ])

        setProdutos(produtosData)
        setClientes(clientesData)
      } catch (error) {
        console.error(error)
        setErrorMessage(error.message || 'Nao foi possivel carregar os dados do caixa.')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target.tagName
      const isTypingField = targetTag === 'INPUT' || targetTag === 'TEXTAREA'

      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }

      if (event.key === 'F2') {
        event.preventDefault()
        pagamentoSelectRef.current?.focus()
      }

      if (event.key === 'F4') {
        event.preventDefault()
        finalizarButtonRef.current?.click()
      }

      if (event.key === 'Escape' && isTypingField && searchTerm) {
        setSearchTerm('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchTerm])

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getQuantidadeNoCarrinho = (produtoId) => {
    return carrinho.find((item) => item.id === produtoId)?.quantidade || 0
  }

  const adicionarAoCarrinho = (produto) => {
    const quantidadeNoCarrinho = getQuantidadeNoCarrinho(produto.id)

    if (produto.estoque <= 0) {
      useToast(`O produto ${produto.nome} esta sem estoque.`, 'error')
      return
    }

    if (quantidadeNoCarrinho >= produto.estoque) {
      useToast(`Voce ja atingiu o estoque disponivel de ${produto.nome}.`, 'error')
      return
    }

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find((item) => item.id === produto.id)

      if (itemExistente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }

      return [
        ...carrinhoAtual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco),
          quantidade: 1,
        },
      ]
    })
  }

  const alterarQuantidade = (produtoId, delta) => {
    const produto = produtos.find((item) => item.id === produtoId)

    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.id === produtoId
            ? {
              ...item,
              quantidade: produto
                ? Math.min(item.quantidade + delta, produto.estoque)
                : item.quantidade + delta,
            }
            : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== produtoId)
    )
  }

  const limparCaixa = () => {
    setCarrinho([])
    setTipoPagamento('AVISTA')
    setClienteId('')
    setSearchTerm('')
  }

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      useToast('Adicione pelo menos um produto ao carrinho.', 'error')
      return
    }

    if (tipoPagamento === 'FIADO' && !clienteId) {
      useToast('Selecione um cliente para venda fiado.', 'error')
      return
    }

    try {
      setIsSubmitting(true)

      await criarVenda({
        tipoPagamento,
        clienteId: tipoPagamento === 'FIADO' ? Number(clienteId) : null,
        itens: carrinho.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
      })

      useToast('Venda registrada com sucesso.')
      limparCaixa()

      const [produtosData, clientesData] = await Promise.all([
        listarProdutos(),
        listarClientes(),
      ])

      setProdutos(produtosData)
      setClientes(clientesData)
    } catch (error) {
      console.error(error)
      useToast(error.message || 'Nao foi possivel finalizar a venda.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = carrinho.reduce(
    (accumulator, item) => accumulator + item.quantidade * item.preco,
    0
  )

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Caixa</h1>
        <p>Registre e finalize vendas no balcao</p>
      </div>

      <div className="caixaGrid">
        <div className="sectionCard caixaProdutosCard">
          <div className="caixaTop">
            <input
              type="text"
              placeholder="Buscar produto..."
              className="searchInput"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              ref={searchInputRef}
            />
            <p className="caixaHintText">Atalhos: `Ctrl+K` busca, `F2+enter` pagamento, `F4` finalizar</p>
          </div>

          <div className="produtosLista">
            {loading && <p>Carregando produtos...</p>}

            {!loading && errorMessage && <p>{errorMessage}</p>}

            {!loading && !errorMessage && produtos.length === 0 && (
              <p>Nenhum produto encontrado.</p>
            )}

            {!loading && !errorMessage && produtosFiltrados.length === 0 && (
              <p>Nenhum produto encontrado para essa busca.</p>
            )}

            {!loading && !errorMessage && produtosFiltrados.map((produto) => (
              <div
                className={`produtoItem ${produto.estoque <= 0 ? 'semEstoque' : ''}`}
                key={produto.id}
              >
                <div className="produtoInfo">
                  <strong>{produto.nome}</strong>
                  <p>{formatMoney(produto.preco)}</p>
                  {produto.estoque <= 0 && (
                    <span className="produtoStatusText">Indisponivel</span>
                  )}
                </div>
                <button
                  className="produtoActionBtn"
                  aria-label={`Adicionar ${produto.nome}`}
                  onClick={() => adicionarAoCarrinho(produto)}
                  disabled={
                    produto.estoque <= 0 ||
                    getQuantidadeNoCarrinho(produto.id) >= produto.estoque
                  }
                >
                  <MdAdd />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sectionCard">
          <h2>Carrinho</h2>

          <div className="carrinhoLista">
            {carrinho.length === 0 && (
              <div className="estadoVazioCard">
                <strong>Carrinho vazio</strong>
                <p>Adicione produtos para comecar a venda.</p>
              </div>
            )}

            {carrinho.map((item) => (
              <div className="carrinhoItem" key={item.id}>
                <div className="carrinhoInfo">
                  <strong>{item.nome}</strong>
                  <p>{formatMoney(item.preco)} por unidade</p>
                </div>

                <div className="carrinhoControls">
                  <div className="quantidadeControl">
                    <button
                      type="button"
                      className="quantidadeBtn"
                      onClick={() => alterarQuantidade(item.id, -1)}
                    >
                      <MdRemove />
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      type="button"
                      className="quantidadeBtn"
                      onClick={() => alterarQuantidade(item.id, 1)}
                      disabled={item.quantidade >= (produtos.find((produto) => produto.id === item.id)?.estoque || 0)}
                    >
                      <MdAdd />
                    </button>
                  </div>

                  <strong>{formatMoney(item.quantidade * item.preco)}</strong>

                  <button
                    type="button"
                    className="removerItemBtn"
                    onClick={() => removerDoCarrinho(item.id)}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="caixaResumo">
            <h3>Total: {formatMoney(total)}</h3>

            <select
              className="formInput"
              value={tipoPagamento}
              ref={pagamentoSelectRef}
              onChange={(event) => {
                setTipoPagamento(event.target.value)
                if (event.target.value !== 'FIADO') {
                  setClienteId('')
                }
              }}
            >
              <option value="AVISTA">A vista</option>
              <option value="CREDITO">Credito</option>
              <option value="FIADO">Fiado</option>
            </select>

            <select
              className="formInput"
              value={clienteId}
              onChange={(event) => setClienteId(event.target.value)}
              disabled={tipoPagamento !== 'FIADO'}
            >
              <option value="">Selecionar cliente (se fiado)</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>

            <button
              className="primaryBtn fullWidth"
              onClick={finalizarVenda}
              disabled={isSubmitting || carrinho.length === 0}
              ref={finalizarButtonRef}
            >
              {isSubmitting ? 'Finalizando...' : 'Finalizar venda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Caixa
