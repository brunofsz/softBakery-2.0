import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Dashboard from './routes/Dashboard.jsx'
import Vendas from './routes/Vendas.jsx'
import Clientes from './routes/Clientes.jsx'
import Produtos from './routes/Produtos.jsx'
import Fornecedores from './routes/Fornecedores.jsx'
import Caixa from './routes/Caixa.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/caixa",
        element: <Caixa />
      },
      {
        path: "/vendas",
        element: <Vendas />
      },
      {
        path: "/clientes",
        element: <Clientes />
      },
      {
        path: "/produtos",
        element: <Produtos />
      },
      {
        path: "/fornecedores",
        element: <Fornecedores />
      }
    ]
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  </StrictMode>,
)
