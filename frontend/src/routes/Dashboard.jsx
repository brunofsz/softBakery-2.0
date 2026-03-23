import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdWarning,
} from 'react-icons/md'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buscarDashboard } from '../services/dashboardService'
import formatMoney from '../utils/formatMoney'
import { formatDate } from '../utils/formatDate'
import './Dashboard.css'

const PAYMENT_LABELS = {
  AVISTA: 'À vista',
  CREDITO: 'Crédito',
  FIADO: 'Fiado',
}

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const data = await buscarDashboard()
        setDashboard(data)
      } catch (error) {
        console.error(error)
        setErrorMessage(error.message || 'Não foi possível carregar o dashboard.')
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  const cards = dashboard
    ? [
        {
          title: 'Vendas hoje',
          value: dashboard.resumo.vendasHoje,
          icon: <MdShoppingCart />,
        },
        {
          title: 'Faturamento hoje',
          value: formatMoney(dashboard.resumo.faturamentoHoje),
          icon: <MdAttachMoney />,
        },
        {
          title: 'Clientes devendo',
          value: dashboard.resumo.clientesDevendo,
          icon: <MdPeople />,
        },
        {
          title: 'Estoque baixo',
          value: dashboard.resumo.estoqueBaixo,
          icon: <MdWarning />,
        },
      ]
    : []

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Dashboard</h1>
        <p>Resumo geral do sistema</p>
      </div>

      {loading && <p>Carregando dashboard...</p>}
      {!loading && errorMessage && <p>{errorMessage}</p>}

      {!loading && !errorMessage && dashboard && (
        <>
          <div className="cardsGrid">
            {cards.map((card) => (
              <div className="infoCard" key={card.title}>
                <div className="infoCardTop">
                  <span>{card.title}</span>
                  <div className="cardIcon">{card.icon}</div>
                </div>
                <h2>{card.value}</h2>
              </div>
            ))}
          </div>

          <div className="dashboardChartsGrid">
            <div className="sectionCard chartCard">
              <div className="sectionCardHeader">
                <h2>Faturamento dos últimos 7 dias</h2>
              </div>

              <div className="chartWrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboard.vendasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Bar dataKey="faturamento" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sectionCard chartCard">
              <div className="sectionCardHeader">
                <h2>Tendência de vendas</h2>
              </div>

              <div className="chartWrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dashboard.vendasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dia" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} vendas`, 'Quantidade']} />
                    <Line
                      type="monotone"
                      dataKey="vendas"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#2563eb' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dashboardTablesGrid">
            <div className="sectionCard">
              <div className="sectionCardHeader">
                <h2>Últimas vendas</h2>
                <Link to="/vendas" className="primaryBtn">
                  Ver histórico completo
                </Link>
              </div>

              <div className="tableWrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Cliente</th>
                      <th>Valor</th>
                      <th>Pagamento</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.ultimasVendas.map((sale) => (
                      <tr key={sale.id}>
                        <td>{formatDate(sale.createdAt)}</td>
                        <td>{sale.cliente}</td>
                        <td>{formatMoney(sale.total)}</td>
                        <td>{PAYMENT_LABELS[sale.tipoPagamento] || sale.tipoPagamento}</td>
                        <td>
                          <span
                            className={
                              sale.status === 'PAGO' ? 'badge success' : 'badge warning'
                            }
                          >
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="sectionCard">
              <div className="sectionCardHeader">
                <h2>Produtos com estoque baixo</h2>
                <Link to="/produtos" className="primaryBtn">
                  Ver produtos
                </Link>
              </div>

              <div className="detailsList">
                {dashboard.produtosEstoqueBaixo.length === 0 && (
                  <p>Nenhum produto com estoque baixo.</p>
                )}

                {dashboard.produtosEstoqueBaixo.map((produto) => (
                  <div className="detailsItem" key={produto.id}>
                    <div>
                      <strong>{produto.nome}</strong>
                      <p>Mínimo recomendado: {produto.estoqueMinimo}</p>
                    </div>

                    <div className="detailsValues">
                      <span>Estoque atual: {produto.estoque}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
