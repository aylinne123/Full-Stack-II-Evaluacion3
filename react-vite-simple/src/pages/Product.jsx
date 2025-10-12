import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/xano";

function esAdmin() {
  const email = localStorage.getItem("userEmail") || "";
  return email.endsWith("@duocuc.cl");
}

export default function Product() {
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
  const eliminarProducto = (id) => {
    setLista(lista.filter((p) => p.id !== id));
  };

  // Opciones de respaldo si la API no responde
  const categoriasFallback = [
    { id: 1, name: "Higiene" },
    { id: 2, name: "Juguetes" },
    { id: 3, name: "Coches" },
    { id: 4, name: "Comida" }
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Catálogo de Productos para Bebés</h2>
      <div className="row">
        {lista.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card h-100">
              <img
                src={typeof producto.image === "string" ? producto.image : producto.image?.url}
                className="card-img-top"
                alt={producto.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.name}</h5>
                <p className="card-text">
                  {producto.description.length > 40
                    ? producto.description.slice(0, 40) + "..."
                    : producto.description}
                </p>
                <div className="mt-auto">
                  <p className="fw-bold mb-2">${producto.price.toFixed(2)}</p>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => setProductoSeleccionado(producto)}
                  >
                    Ver descripción
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Agregar al carrito
                  </button>
                  {esAdmin() && (
                    <button
                      className="btn btn-sm btn-danger ms-2"
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
                formData.append("name", e.target.nombre.value);
                formData.append("description", e.target.descripcion.value);
                formData.append("price", parseFloat(e.target.precio.value));
                formData.append("stock", parseInt(e.target.stock.value));
                formData.append("category", parseInt(e.target.category.value));
                if (e.target.imagen.files[0]) {
                  formData.append("image", e.target.imagen.files[0]);
                }
                await api.post("/product", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
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
              <input type="text" name="nombre" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input type="number" name="precio" className="form-control" step="0.01" min="0" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" className="form-control" min="0" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input type="file" name="imagen" className="form-control" accept="image/*" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select name="category" className="form-control" required>
                <option value="">Selecciona una categoría</option>
                {((Array.isArray(categorias) && categorias.length > 0) ? categorias : categoriasFallback).map(cat => (
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