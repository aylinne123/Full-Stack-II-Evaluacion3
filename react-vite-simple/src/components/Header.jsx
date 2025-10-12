import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { carrito } = useCart();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo">MiSitio</Link>

        <button className="btn btn--ghost md-hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          ☰
        </button>

        <nav className={`nav ${open ? "nav--open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}>Login</NavLink>
          <NavLink to="/about" className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}>Nosotros</NavLink>
          <NavLink to="/contact" className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}>Contacto</NavLink>
          <NavLink to="/product" className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}>Productos</NavLink>
          <NavLink to="/cart" className="nav__link position-relative ms-3">
            🛒
            {carrito.length > 0 && (
              <span
                className="badge bg-danger position-absolute"
                style={{ top: "-8px", right: "-10px", fontSize: "0.8rem" }}
              >
                {carrito.length}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
