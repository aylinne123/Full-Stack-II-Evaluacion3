import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/xano";

function esAdmin() {
  const email = localStorage.getItem("userEmail") || "";
  return email && email.endsWith("@duocuc.cl");
}

function estaLogueado() {
  return !!localStorage.getItem("userEmail");
}

export default function Admin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si es admin al cargar el componente
  useEffect(() => {
    // Primero verificar si está logueado
    if (!estaLogueado()) {
      setMensaje("Debes iniciar sesión para acceder a esta página.");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      return;
    }
    
    // Luego verificar si es admin
    if (!esAdmin()) {
      setMensaje("Acceso denegado. Solo administradores pueden acceder a esta página.");
      setTimeout(() => {
        navigate("/product");
      }, 2000);
      return;
    }
    
    fetchUsuarios();
  }, [navigate]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      console.log("📤 Intentando obtener usuarios de /user...");
      
      // Nota: Este endpoint debe existir en Xano como GET /user
      const res = await api.get("/user");
      
      console.log("Respuesta recibida:", res);
      console.log("Datos de usuarios:", res.data);
      console.log("Cantidad de usuarios:", Array.isArray(res.data) ? res.data.length : 'No es array');
      console.log("Tipo de datos:", typeof res.data);
      
      setUsuarios(res.data || []);
      setMensaje("");
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      console.error("Detalles del error:", err.response);
      console.error("Status:", err.response?.status);
      console.error("Mensaje:", err.response?.data);
      
      setMensaje("No se pudieron cargar los usuarios. Error: " + (err.response?.data?.message || err.message));
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    try {
      await api.delete(`/user/${id}`);
      setMensaje("✅ Usuario eliminado correctamente.");
      fetchUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setMensaje("Error al eliminar usuario: " + (err.response?.data?.message || err.message));
    }
  };

  const abrirEdicion = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModoEdicion(true);
  };

  const cerrarEdicion = () => {
    setUsuarioSeleccionado(null);
    setModoEdicion(false);
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = {
        name: e.target.name.value,
        email: e.target.email.value,
      };

      // Solo incluir password si se ingresó uno nuevo
      if (e.target.password.value) {
        datosActualizados.password = e.target.password.value;
      }

      await api.patch(`/user/${usuarioSeleccionado.id}`, datosActualizados);
      setMensaje("Usuario actualizado correctamente.");
      cerrarEdicion();
      fetchUsuarios();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setMensaje("Error al actualizar usuario: " + (err.response?.data?.message || err.message));
    }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      const nuevoUsuario = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      };

      // Usar el endpoint de signup para crear usuarios
      await api.post("/auth/signup", nuevoUsuario);
      setMensaje("Usuario creado correctamente.");
      e.target.reset();
      fetchUsuarios();
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setMensaje("Error al crear usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const searchTerm = busqueda.toLowerCase();
    return (
      usuario.name?.toLowerCase().includes(searchTerm) ||
      usuario.email?.toLowerCase().includes(searchTerm)
    );
  });

  // Si no está logueado o no es admin, mostrar mensaje de acceso denegado
  if (!estaLogueado() || !esAdmin()) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Acceso Denegado</h4>
          {!estaLogueado() ? (
            <>
              <p>Debes iniciar sesión para acceder a esta página.</p>
              <p>Redirigiendo al login...</p>
            </>
          ) : (
            <>
              <p>Solo los administradores con email @duocuc.cl pueden acceder a esta página.</p>
              <p>Redirigiendo a productos...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          {mensaje && (
            <div className={`alert ${mensaje.includes("✅") ? "alert-success" : mensaje.includes("❌") ? "alert-danger" : "alert-warning"} alert-dismissible fade show`} role="alert">
              {mensaje}
              <button type="button" className="btn-close" onClick={() => setMensaje("")}></button>
            </div>
          )}

          {/* Buscador */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Buscar por nombre o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <span className="text-muted">
                    Total de usuarios: <strong>{usuariosFiltrados.length}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-table me-2"></i>
                Lista de Usuarios
              </h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando usuarios...</p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="alert alert-info m-3">
                  {busqueda ? "No se encontraron usuarios con ese criterio de búsqueda." : "No hay usuarios registrados."}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Fecha de Registro</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>
                            <strong>{usuario.name || "Sin nombre"}</strong>
                          </td>
                          <td>
                            <span className="text-muted">{usuario.email}</span>
                          </td>
                          <td>
                            {usuario.email?.endsWith("@duocuc.cl") ? (
                              <span className="badge bg-danger">Admin</span>
                            ) : (
                              <span className="badge bg-success">Usuario</span>
                            )}
                          </td>
                          <td>
                            {usuario.created_at
                              ? new Date(usuario.created_at).toLocaleDateString("es-CL")
                              : "N/A"}
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => abrirEdicion(usuario)}
                                title="Editar usuario"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => eliminarUsuario(usuario.id)}
                                title="Eliminar usuario"
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario para crear nuevo usuario */}
      <div className="row mt-5">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-person-plus-fill me-2"></i>
                Crear Nuevo Usuario
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={crearUsuario}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                  <small className="form-text text-muted">
                    Los emails @duocuc.cl tendrán permisos de administrador.
                  </small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength="8"
                  />
                  <small className="form-text text-muted">
                    Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
                  </small>
                </div>
                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Usuario
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="col-lg-6">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Estadísticas
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-primary mb-1">{usuarios.length}</h3>
                    <p className="text-muted mb-0">Total Usuarios</p>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-danger mb-1">
                      {usuarios.filter((u) => u.email?.endsWith("@duocuc.cl")).length}
                    </h3>
                    <p className="text-muted mb-0">Administradores</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-success mb-1">
                      {usuarios.filter((u) => !u.email?.endsWith("@duocuc.cl")).length}
                    </h3>
                    <p className="text-muted mb-0">Usuarios Normales</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-info mb-1">{usuariosFiltrados.length}</h3>
                    <p className="text-muted mb-0">En búsqueda</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>   

      {/* Modal para editar usuario */}
      {modoEdicion && usuarioSeleccionado && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          onClick={cerrarEdicion}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={cerrarEdicion}
                ></button>
              </div>
              <form onSubmit={actualizarUsuario}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      defaultValue={usuarioSeleccionado.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      defaultValue={usuarioSeleccionado.email}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña (opcional)</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Dejar en blanco para mantener la actual"
                      minLength="8"
                    />
                    <small className="form-text text-muted">
                      Solo completa este campo si deseas cambiar la contraseña.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cerrarEdicion}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
