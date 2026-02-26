import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './routes/Home.jsx'
import Caixa from './routes/Caixa.jsx'
import Clientes from './routes/Clientes.jsx'
import Estoque from './routes/Estoque.jsx'
import Fornecedores from './routes/Fornecedores.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/caixa",
        element: <Caixa />
      },
      {
        path: "/clientes",
        element: <Clientes />
      },
      {
        path: "/estoque",
        element: <Estoque />
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
  </StrictMode>,
)
