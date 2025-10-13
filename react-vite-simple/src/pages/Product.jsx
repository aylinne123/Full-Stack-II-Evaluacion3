import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/xano";
import { useLocation, useNavigate } from "react-router-dom";

function esAdmin() {
  const email = localStorage.getItem("userEmail") || "";
  return email.endsWith("@duocuc.cl");
}

export default function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [busqueda, setBusqueda] = useState(params.get("search") || "");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(params.get("category") || "");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { carrito, setCarrito } = useCart();
  const [lista, setLista] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías desde Xano
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/category");
        setCategorias(res.data);
      } catch (err) {
        setCategorias([]);
      }
    }
    fetchCategorias();
  }, []);

  // Cargar productos desde Xano
  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await api.get("/product");
        setLista(res.data);
      } catch (err) {
        setLista([]);
      }
    }
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Eliminar producto del catálogo (solo admin)
  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/product/${id}`);
      const res = await api.get("/product");
      setLista(res.data);
      setMensaje("✅ Producto eliminado correctamente.");
    } catch (err) {
      setMensaje("❌ Error al eliminar producto: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  // Opciones de respaldo si la API no responde
  const categoriasFallback = [
    { id: 1, name: "Higiene" },
    { id: 2, name: "Juguetes" },
    { id: 3, name: "Coches" },
    { id: 4, name: "Comida" }
  ];

  const getCategoriaNombre = (id) => {
    const cat = categorias.find(c => c.id === id) || categoriasFallback.find(c => c.id === id);
    return cat ? cat.name : "Sin categoría";
  };

  // Filtra productos después de cargarlos
  const productosFiltrados = lista.filter(producto => {
    const matchNombre = busqueda ? producto.name.toLowerCase().includes(busqueda.toLowerCase()) : true;
    const matchCategoria = categoriaSeleccionada ? String(producto.category) === String(categoriaSeleccionada) : true;
    return matchNombre && matchCategoria;
  });

  // Buscador y filtro
  const handleBuscar = (e) => {
    e.preventDefault();
    let url = "/product";
    const params = [];
    if (busqueda.trim()) params.push(`search=${encodeURIComponent(busqueda.trim())}`);
    if (categoriaSeleccionada) params.push(`category=${encodeURIComponent(categoriaSeleccionada)}`);
    if (params.length > 0) url += "?" + params.join("&");
    navigate(url);
  };

  // Muestra mensaje si no hay resultados
  if (productosFiltrados.length === 0) {
    return (
      <div className="container py-5">
        <form className="d-flex justify-content-center mb-4" onSubmit={handleBuscar}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ maxWidth: "160px" }}
          />
          <select
            name="categoria"
            className="form-select me-2"
            style={{ maxWidth: "140px" }}
            value={categoriaSeleccionada}
            onChange={e => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {(Array.isArray(categorias) && categorias.length > 0 ? categorias : categoriasFallback).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">Buscar</button>
        </form>
        <div className="alert alert-warning text-center">
          No existe ningún producto con esos criterios.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <form className="d-flex justify-content-center mb-4" onSubmit={handleBuscar}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: "160px" }}
        />
        <select
          name="categoria"
          className="form-select me-2"
          style={{ maxWidth: "140px" }}
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {(Array.isArray(categorias) && categorias.length > 0 ? categorias : categoriasFallback).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">Buscar</button>
      </form>
      <div className="row">
        {productosFiltrados.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card h-100">
              <img
                src={producto.image && producto.image.startsWith("http") ? producto.image : "https://via.placeholder.com/180x180?text=Sin+Imagen"}
                className="card-img-top"
                alt={producto.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.name}</h5>
                <p className="card-text">
                  Categoría: {getCategoriaNombre(producto.category)}
                </p>
                <p className="fw-bold mb-2">${producto.price.toFixed(2)}</p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setProductoSeleccionado(producto)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </button>
                  {esAdmin() && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para descripción */}
      {productoSeleccionado && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          onClick={() => setProductoSeleccionado(null)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{productoSeleccionado.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProductoSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={typeof productoSeleccionado.image === "string" ? productoSeleccionado.image : productoSeleccionado.image?.url}
                  alt={productoSeleccionado.name}
                  className="img-fluid mb-3"
                />
                <p>{productoSeleccionado.description}</p>
                <p className="fw-bold">
                  Precio: ${productoSeleccionado.price.toFixed(2)}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    agregarAlCarrito(productoSeleccionado);
                    setProductoSeleccionado(null);
                  }}
                >
                  Agregar al carrito
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setProductoSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para agregar productos SOLO si es admin */}
      {esAdmin() && (
        <div className="mt-5">
          <h4 className="mb-3">Agregar nuevo producto (solo admin)</h4>
          <form
            className="card p-4"
            onSubmit={async e => {
              e.preventDefault();
              setMensaje("");
              try {
                const formData = new FormData();
                formData.append("name", e.target.name.value);
                formData.append("description", e.target.description.value);
                formData.append("price", parseFloat(e.target.price.value));
                formData.append("stock", parseInt(e.target.stock.value));
                formData.append("category", parseInt(e.target.category.value));
                formData.append("image", e.target.image.value); // Ahora es una URL

                await api.post("/product", formData);
                const resLista = await api.get("/product");
                setLista(resLista.data);
                setMensaje("✅ Producto agregado correctamente.");
                e.target.reset();
              } catch (err) {
                setMensaje("❌ Error al agregar producto: " + JSON.stringify(err.response?.data || err.message));
              }
            }}
          >
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" name="name" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea name="description" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input type="number" name="price" className="form-control" step="0.01" min="0" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" className="form-control" min="0" required />
            </div>
            <div className="mb-3">
              <label className="form-label">URL de imagen</label>
              <input type="text" name="image" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select name="category" className="form-control" required>
                <option value="">Selecciona una categoría</option>
                {(Array.isArray(categorias) && categorias.length > 0 ? categorias : categoriasFallback).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Agregar producto
            </button>
            {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
          </form>
        </div>
      )}
    </div>
  );
}