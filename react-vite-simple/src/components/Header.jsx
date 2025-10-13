import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/xano";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { carrito } = useCart();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías para el select
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/category");
        setCategorias(res.data);
      } catch {
        setCategorias([]);
      }
    }
    fetchCategorias();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const query = busqueda.trim();
    const categoria = e.target.categoria.value;
    let url = "/product";
    const params = [];
    if (query) params.push(`search=${encodeURIComponent(query)}`);
    if (categoria) params.push(`category=${encodeURIComponent(categoria)}`);
    if (params.length > 0) url += "?" + params.join("&");
    navigate(url);
  };

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
        <nav className={`nav ${open ? "nav--open" : ""}`}>
          {!userEmail && (
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                "nav__link" + (isActive ? " is-active" : "")
              }
            >
              Login
            </NavLink>
          )}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
          >
            Nosotros
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
          >
            Contacto
          </NavLink>
          <NavLink
            to="/product"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
          >
            Productos
          </NavLink>
          <NavLink to="/cart" className="nav__link position-relative ms-3">
            🛒
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
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
