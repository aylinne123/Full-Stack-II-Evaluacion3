import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/xano";

export default function Home() {
  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); // Nuevo hook

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:os3AMWEA/auth/signup",
        {
          name: nombre,
          email: email,
          password: password,
        }
      );
      if (res.data) {
        setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
        setModo("login");
      }
    } catch (err) {
      setMensaje(
        "Error al registrarse: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:os3AMWEA/auth/login",
        {
          email,
          password,
        }
      );
      // Si el login fue exitoso, Xano responde con un token o usuario
      if (res.data && res.data.authToken) {
        setMensaje('Bienvenido');
        localStorage.setItem("userEmail", email); // Guarda el email
        navigate("/product"); // Redirige a productos
      } else {
        setMensaje("Credenciales incorrectas.");
      }
    } catch (err) {
      // Muestra el error real para depuración
      setMensaje(
        "Error al iniciar sesión: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="text-center mb-4">BabyWorld</h1>
              <h2 className="text-center mb-4">
                {modo === "login" ? "Iniciar Sesión" : "Registrarse"}
              </h2>
              <form onSubmit={modo === "login" ? handleLogin : handleRegistro}>
                {modo === "registro" && (
                  <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <br />
                  <label className="form-label">Correo:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <br />
                <div className="mb-3">
                  <label className="form-label">Contraseña:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <br />
                  <small className="text-muted">
                    Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
                  </small>
                </div>
                <br />
                <button
                  type="submit"
                  className="btn btn-pink w-100"
                  style={{ background: "#f48fb1", color: "white" }}
                >
                  {modo === "login" ? "Iniciar sesión" : "Registrarse"}
                </button>
              </form>
              <br />
              <div className="text-center mt-3">
                {modo === "login" ? (
                  <>
                    ¿No tienes cuenta?{" "}
                    <button
                      onClick={() => setModo("registro")}
                      className="btn btn-link p-0"
                      style={{ color: "#007bff" }}
                    >
                      Regístrate aquí
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{" "}
                    <button
                      onClick={() => setModo("login")}
                      className="btn btn-link p-0"
                      style={{ color: "#007bff" }}
                    >
                      Inicia sesión
                    </button>
                  </>
                )}
              </div>
              {mensaje && (
                <div className="alert alert-info mt-3 text-center">{mensaje}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
