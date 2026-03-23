import { Fragment, useEffect, useState } from 'react'
import { listarVendas } from '../services/vendasService'
import { formatDate } from '../utils/formatDate'
import formatMoney from '../utils/formatMoney'
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import './Vendas.css'


const formatTipoPagamento = (tipoPagamento) => {
  if (tipoPagamento === 'AVISTA') {
    return 'A vista'
  }

  if (tipoPagamento === 'CREDITO') {
    return 'Credito'
  }

  if (tipoPagamento === 'FIADO') {
    return 'Fiado'
  }

  return tipoPagamento
}

const Vendas = () => {
  const [vendas, setVendas] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedVendaId, setExpandedVendaId] = useState(null)

  const toggleVendaItens = (vendaId) => {
    setExpandedVendaId((currentVendaId) =>
      currentVendaId === vendaId ? null : vendaId
    )
  }

  useEffect(() => {
    const carregarVendas = async() => {
      try {
        setLoading(true)
        setErrorMessage('')

        const data = await listarVendas()
        setVendas(data)
      } catch (error) {
        console.error(error)
        setErrorMessage('Nao foi possivel carregar as vendas.')
      } finally {
        setLoading(false)
      }
    }

    carregarVendas()
  }, [])

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Historico de vendas</h1>
          <p>Consulta das vendas ja registradas no sistema</p>
        </div>
      </div>

      <div className="sectionCard">
        {loading && <p>Carregando vendas...</p>}

        {!loading && errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Valor</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <Fragment key={venda.id}>
                    <tr>
                      <td>{formatDate(venda.createdAt)}</td>
                      <td>{venda.id}</td>
                      <td>{venda.cliente ? venda.cliente.nome : ''}</td>
                      <td>{venda.itens?.length || 0}</td>
                      <td>{formatMoney(venda.total)}</td>
                      <td>{formatTipoPagamento(venda.tipoPagamento)}</td>
                      <td>
                        <span
                          className={
                            venda.status === 'PAGO' ? 'badge success' : 'badge warning'
                          }
                        >
                          {venda.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="tableBtn edit"
                          onClick={() => toggleVendaItens(venda.id)}
                        >
                          {expandedVendaId === venda.id ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                          {expandedVendaId === venda.id ? 'Ocultar itens' : 'Ver itens'}
                        </button>
                      </td>
                    </tr>

                    {expandedVendaId === venda.id && (
                      <tr className="detailsRow">
                        <td colSpan="8">
                          <div className="detailsCard">
                            <h3>Itens da venda</h3>

                            {!venda.itens || venda.itens.length === 0 ? (
                              <p>Nenhum item encontrado para esta venda.</p>
                            ) : (
                              <div className="detailsList">
                                {venda.itens.map((item) => (
                                  <div className="detailsItem" key={item.id}>
                                    <div>
                                      <strong>{item.produto?.nome || 'Produto sem nome'}</strong>
                                      <p>Quantidade: {item.quantidade}</p>
                                    </div>

                                    <div className="detailsValues">
                                      <span>Unitario: {formatMoney(item.precoUnitario)}</span>
                                      <span>Subtotal: {formatMoney(item.subtotal)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Vendas
