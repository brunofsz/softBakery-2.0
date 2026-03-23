import { NavLink } from 'react-router-dom'
import {
  MdDashboard,
  MdBakeryDining,
  MdPeople,
  MdLocalShipping,
  MdPointOfSale,
  MdMailOutline,
} from 'react-icons/md'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sideBar">
      <div className="sideBarTop">
        <img src="/logoCortada.png" alt="SoftBakery" className="sideBarLogo" />
        <div>
          <h2>SoftBakery</h2>
          <span>2.0</span>
        </div>
      </div>

      <nav className="sideBarNav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'sideBarLink active' : 'sideBarLink'
          }
        >
          <MdDashboard />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/caixa"
          className={({ isActive }) =>
            isActive ? 'sideBarLink active' : 'sideBarLink'
          }
        >
          <MdPointOfSale />
          <span>Caixa</span>
        </NavLink>

        <NavLink
          to="/produtos"
          className={({ isActive }) =>
            isActive ? 'sideBarLink active' : 'sideBarLink'
          }
        >
          <MdBakeryDining />
          <span>Produtos</span>
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            isActive ? 'sideBarLink active' : 'sideBarLink'
          }
        >
          <MdPeople />
          <span>Clientes</span>
        </NavLink>

        <NavLink
          to="/fornecedores"
          className={({ isActive }) =>
            isActive ? 'sideBarLink active' : 'sideBarLink'
          }
        >
          <MdLocalShipping />
          <span>Fornecedores</span>
        </NavLink>
      </nav>

      <div className="sideBarFooter">
        <a
          className="supportButton"
          href="https://mail.google.com/mail/?view=cm&to=brunofrancisco.souza2@gmail.com"
          target="_blank"
        >
          <MdMailOutline />
          <span>Suporte</span>
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
