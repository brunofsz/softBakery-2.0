import "./Navbar.css";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaShoppingCart,
    FaBoxes,
    FaTruck,
    FaUser
} from 'react-icons/fa';


export default function Navbar() {
    return (
        <nav className="navbar">

            <img src="/logo.png" alt="SoftBakery" className="logo" />



            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}><FaHome /> Dashboard</NavLink>
                <NavLink to="/caixa" className={({ isActive }) => isActive ? "active" : ""}><FaShoppingCart /> Caixa</NavLink>
                <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}><FaUser /> Clientes</NavLink>
                <NavLink to="/estoque" className={({ isActive }) => isActive ? "active" : ""}><FaBoxes /> Estoque</NavLink>
                <NavLink to="/fornecedores" className={({ isActive }) => isActive ? "active" : ""}><FaTruck /> Fornecedores</NavLink>
            </div>
        </nav>
    );
}
