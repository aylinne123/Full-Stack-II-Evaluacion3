import { useCart } from "../context/CartContext.jsx";
import { useState, useEffect } from "react";
import api from "../api/xano";

export default function Cart() {
  const { carrito, setCarrito } = useCart();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [envio, setEnvio] = useState("retiro");
  const [direccion, setDireccion] = useState("");
  const recargoEnvio = envio === "domicilio" ? 3000 : 0;

  const total = carrito.reduce((acc, prod) => acc + prod.precio, 0) + recargoEnvio;

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

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envía el nuevo producto a Xano
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    try {
      const res = await api.post("/product", {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image,
        category: parseInt(form.category),
      });
      setMensaje("✅ Producto agregado correctamente.");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "",
      });
    } catch (err) {
      setMensaje(
        "❌ Error al agregar producto: " +
          (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // Elimina un producto del carrito
  const eliminarDelCarrito = (idx) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(idx, 1);
    setCarrito(nuevoCarrito);
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
                        <span className="text-muted">${prod.price.toFixed(2)}</span>
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
                    onChange={e => setMetodoPago(e.target.value)}
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
                      onChange={e => setDireccion(e.target.value)}
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
                    <span>${carrito.reduce((acc, prod) => acc + prod.precio, 0).toFixed(2)}</span>
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

              <button className="btn btn-success w-100" disabled={carrito.length === 0}>
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}