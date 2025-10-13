import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/xano";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { carrito } = useCart();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleNavClick = () => setOpen(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo m-0 p-0">
          <img
            src="/logo2def.png"
            alt="Baby World Logo"
            style={{
              height: "100px",
              verticalAlign: "middle",
              marginRight: "10px",
            }}
          />
        </Link>
        <div className="header-nav-group">
          <button
            className="menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <span className="menu-icon"></span>
          </button>
          <nav className={`nav${open ? " nav--open" : ""}`}>
            {!userEmail && (
              <NavLink
                to="/home"
                end
                className={({ isActive }) =>
                  "nav__link" + (isActive ? " is-active" : "")
                }
                onClick={handleNavClick}
              >
                Login
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                "nav__link" + (isActive ? " is-active" : "")
              }
              onClick={handleNavClick}
            >
              Nosotros
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                "nav__link" + (isActive ? " is-active" : "")
              }
              onClick={handleNavClick}
            >
              Contacto
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                "nav__link" + (isActive ? " is-active" : "")
              }
              onClick={handleNavClick}
            >
              Productos
            </NavLink>
            <NavLink
              to="/cart"
              className="nav__link position-relative ms-3"
              onClick={handleNavClick}
            >
              <span style={{ fontSize: "2rem", verticalAlign: "middle" }}>🛒</span>
              {carrito.length > 0 && (
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "-8px",
                    right: "-10px",
                    fontSize: "0.8rem",
                  }}
                >
                  {carrito.length}
                </span>
              )}
            </NavLink>
            {userEmail && (
              <span className="ms-3 text-primary fw-bold">{userEmail}</span>
            )}
            {userEmail && (
              <button
                className="btn btn-outline-danger ms-3"
                onClick={() => {
                  handleSignOut();
                  handleNavClick();
                }}
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
