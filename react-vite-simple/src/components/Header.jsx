import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

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
        </nav>
      </div>
    </header>
  );
}
