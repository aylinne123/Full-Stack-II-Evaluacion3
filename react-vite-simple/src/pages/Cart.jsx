import { useCart } from "../context/CartContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/xano";

function esAdmin() {
  const email = localStorage.getItem("userEmail") || "";
  return email.endsWith("@duocuc.cl");
}

function estaLogueado() {
  return !!localStorage.getItem("userEmail");
}

export default function Cart() {
  const { carrito, setCarrito } = useCart();
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [envio, setEnvio] = useState("retiro");
  const [direccion, setDireccion] = useState("");
  const [boleta, setBoleta] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Nuevo estado
  const navigate = useNavigate();

  // Calcula el subtotal y total
  const subtotal = carrito.reduce(
    (acc, prod) => acc + (prod.price || prod.precio),
    0
  );
  const recargoEnvio = envio === "domicilio" ? 3000 : 0;
  const total = subtotal + recargoEnvio;

  // Elimina un producto del carrito
  const eliminarDelCarrito = (idx) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(idx, 1);
    setCarrito(nuevoCarrito);
  };

  // Finalizar compra solo si usuario normal y logueado
  const puedeComprar = estaLogueado() && !esAdmin() && carrito.length > 0;

  const handleFinalizarCompra = (e) => {
    e.preventDefault();
    if (!estaLogueado()) {
      setShowPopup(true);
      return;
    }
    // Muestra la boleta
    setBoleta({
      productos: carrito,
      subtotal,
      recargoEnvio,
      total,
      metodoPago,
      envio,
      direccion: envio === "domicilio" ? direccion : "Retiro en tienda",
      fecha: new Date().toLocaleString(),
    });
    setCarrito([]);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="mb-4 text-center">🛒 Carrito de Compras</h2>
              {carrito.length === 0 ? (
                <div className="alert alert-info text-center">
                  No hay productos en el carrito.
                </div>
              ) : (
                <ul className="list-group mb-4">
                  {carrito.map((prod, idx) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={idx}
                    >
                      <div>
                        <strong>{prod.name}</strong> <br />
                        <span className="text-muted">
                          ${ (prod.price || prod.precio).toFixed(2) }
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarDelCarrito(idx)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form className="mb-4">
                <h5 className="mb-3">Método de pago</h5>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  >
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>

                <h5 className="mb-3">Opciones de entrega</h5>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="envio"
                    id="retiro"
                    value="retiro"
                    checked={envio === "retiro"}
                    onChange={() => setEnvio("retiro")}
                  />
                  <label className="form-check-label" htmlFor="retiro">
                    Retiro en tienda (sin costo)
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="envio"
                    id="domicilio"
                    value="domicilio"
                    checked={envio === "domicilio"}
                    onChange={() => setEnvio("domicilio")}
                  />
                  <label className="form-check-label" htmlFor="domicilio">
                    Envío a domicilio (+$3.000)
                  </label>
                </div>
                {envio === "domicilio" && (
                  <div className="mb-3">
                    <label className="form-label">Dirección de envío</label>
                    <input
                      type="text"
                      className="form-control"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form>

              <div className="mb-4">
                <h5 className="mb-2">Resumen</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Recargo por envío</span>
                    <span>${recargoEnvio.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              
              <button
                className="btn btn-success w-100"
                onClick={handleFinalizarCompra}
              >
                Finalizar compra
              </button>

              {/* Pop-up si no está logueado */}
              {showPopup && (
                <div
                  className="modal fade show"
                  style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                  tabIndex="-1"
                  onClick={() => setShowPopup(false)}
                >
                  <div
                    className="modal-dialog"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">¡Debes iniciar sesión!</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowPopup(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>Para finalizar la compra debes iniciar sesión.</p>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setShowPopup(false);
                            navigate("/");
                          }}
                        >
                          Ir al login
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Boleta */}
      {boleta && (
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">Boleta de compra</h4>
              </div>
              <div className="card-body">
                <p>
                  <strong>Fecha:</strong> {boleta.fecha}
                </p>
                <p>
                  <strong>Método de pago:</strong> {boleta.metodoPago}
                </p>
                <p>
                  <strong>Entrega:</strong>{" "}
                  {boleta.envio === "domicilio"
                    ? "Domicilio"
                    : "Retiro en tienda"}
                </p>
                <p>
                  <strong>Dirección:</strong> {boleta.direccion}
                </p>
                <h5>Productos comprados:</h5>
                <ul className="list-group mb-3">
                  {boleta.productos.map((prod, idx) => (
                    <li className="list-group-item" key={idx}>
                      {prod.name} - ${ (prod.price || prod.precio).toFixed(2) }
                    </li>
                  ))}
                </ul>
                <h5 className="fw-bold text-end">
                  Total pagado: ${boleta.total.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}