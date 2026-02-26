import { useEffect, useMemo, useState } from 'react';
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
} from 'recharts';
import { api } from '../services/api';
import { formatCurrency } from '../utils/format';
import './Home.css';

const DAY_MS = 1000 * 60 * 60 * 24;

function getLast7Days() {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date(now.getTime() - (6 - idx) * DAY_MS);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      vendas: 0,
    };
  });
}

export default function Home() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [clientesData, produtosData, vendasData] = await Promise.all([
          api.get('/clientes'),
          api.get('/produtos'),
          api.get('/vendas'),
        ]);
        setClientes(clientesData || []);
        setProdutos(produtosData || []);
        setVendas(vendasData || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const dashboard = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let vendasDoDia = 0;
    let pedidosDoDia = 0;
    const productCounter = {};
    const chartMap = new Map(getLast7Days().map((entry) => [entry.key, entry]));

    for (const venda of vendas) {
      const dateKey = new Date(venda.createdAt).toISOString().slice(0, 10);
      const total = Number(venda.total || 0);

      if (dateKey === today) {
        vendasDoDia += total;
        pedidosDoDia += 1;
      }

      if (chartMap.has(dateKey)) {
        chartMap.get(dateKey).vendas += total;
      }

      for (const item of venda.itens || []) {
        const nome = item.produto?.nome || 'Sem nome';
        productCounter[nome] = (productCounter[nome] || 0) + Number(item.quantidade || 0);
      }
    }

    const produtoMaisVendido = Object.entries(productCounter).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sem vendas';

    return {
      vendasDoDia,
      pedidosDoDia,
      produtoMaisVendido,
      vendasSemana: Array.from(chartMap.values()),
      totalClientes: clientes.length,
      totalProdutos: produtos.length,
    };
  }, [clientes.length, produtos.length, vendas]);

  if (loading) return <div className="home"><p>Carregando dashboard...</p></div>;
  if (error) return <div className="home"><p>{error}</p></div>;

  return (
    <div className="home">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Vendas do dia</h3>
          <p>{formatCurrency(dashboard.vendasDoDia)}</p>
        </div>

        <div className="card">
          <h3>Pedidos do dia</h3>
          <p>{dashboard.pedidosDoDia}</p>
        </div>

        <div className="card">
          <h3>Produto mais vendido</h3>
          <p>{dashboard.produtoMaisVendido}</p>
        </div>

        <div className="card">
          <h3>Registros</h3>
          <p>{dashboard.totalProdutos} produtos / {dashboard.totalClientes} clientes</p>
        </div>
      </div>

      <div className="charts">
        <div className="chartBox">
          <h3>Vendas dos ultimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboard.vendasSemana}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="vendas" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chartBox">
          <h3>Faturamento dos ultimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboard.vendasSemana}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="vendas" stroke="#7c3f00" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
