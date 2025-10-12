import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const productos = [
  {
    id: 1,
    nombre: "Pañales Hipoalergénicos",
    descripcion: "Pañales suaves y absorbentes para piel sensible.",
    precio: 12.99,
    imagen: "https://images.unsplash.com/photo-1519864600265-abb23843a6c1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    nombre: "Biberón Anticólicos",
    descripcion: "Biberón con sistema anticólicos y fácil limpieza.",
    precio: 8.5,
    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    nombre: "Juguete Mordedor",
    descripcion: "Juguete seguro para aliviar la dentición.",
    precio: 5.99,
    imagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    nombre: "Toallitas Húmedas",
    descripcion: "Toallitas suaves y sin fragancia para bebés.",
    precio: 3.99,
    imagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Product() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { carrito, setCarrito } = useCart();

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Catálogo de Productos para Bebés</h2>
      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card h-100">
              <img
                src={producto.imagen}
                className="card-img-top"
                alt={producto.nombre}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">
                  {producto.descripcion.length > 40
                    ? producto.descripcion.slice(0, 40) + "..."
                    : producto.descripcion}
                </p>
                <div className="mt-auto">
                  <p className="fw-bold mb-2">${producto.precio.toFixed(2)}</p>
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
                <h5 className="modal-title">{productoSeleccionado.nombre}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProductoSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={productoSeleccionado.imagen}
                  alt={productoSeleccionado.nombre}
                  className="img-fluid mb-3"
                />
                <p>{productoSeleccionado.descripcion}</p>
                <p className="fw-bold">
                  Precio: ${productoSeleccionado.precio.toFixed(2)}
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

      {/* Carrito */}
      <div className="mt-5">
        <h4>Carrito</h4>
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <ul className="list-group">
            {carrito.map((prod, idx) => (
              <li className="list-group-item" key={idx}>
                {prod.nombre} - ${prod.precio.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}