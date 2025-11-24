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
  const [imagenPrincipal, setImagenPrincipal] = useState(null); // Nueva state para la imagen principal
  const { carrito, setCarrito } = useCart();
  const [lista, setLista] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [previewImagenes, setPreviewImagenes] = useState([]);

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

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await api.get("/product");
        console.log("📋 Productos obtenidos de la API:", res.data);
        
        // Verificar el campo image de cada producto
        res.data.forEach((producto, index) => {
          console.log(`🔍 Producto ${index} (${producto.name}):`, {
            id: producto.id,
            image: producto.image,
            imageType: typeof producto.image,
            isArray: Array.isArray(producto.image),
            imageLength: Array.isArray(producto.image) ? producto.image.length : 'N/A'
          });
        });
        
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

  const eliminarProducto = async (id, nombreProducto) => {
    // Validación: Confirmar antes de eliminar
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${nombreProducto}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmacion) {
      return; // Si el usuario cancela, no hacer nada
    }
    
    try {
      await api.delete(`/product/${id}`);
      const res = await api.get("/product");
      setLista(res.data);
      setMensaje("Producto eliminado correctamente.");
    } catch (err) {
      setMensaje("Error al eliminar producto: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Agregar la nueva imagen al array
    setImagenesSeleccionadas(prev => [...prev, file]);
    
    // Crear preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImagenes(prev => [...prev, e.target.result]);
    };
    reader.readAsDataURL(file);
    
    // Limpiar el input para poder seleccionar la misma imagen de nuevo
    e.target.value = '';
  };

  const eliminarImagenPreview = (index) => {
    setImagenesSeleccionadas(prev => prev.filter((_, i) => i !== index));
    setPreviewImagenes(prev => prev.filter((_, i) => i !== index));
  };

  // Función para obtener la URL de la imagen correctamente
  // Función para obtener solo la primera imagen (para la tarjeta)
  const getImageUrl = (imageData) => {
  const placeholderUrl =
    "https://placehold.co/180x180/f8f9fa/6c757d?text=Sin+Imagen";

  if (!Array.isArray(imageData) || imageData.length === 0) {
    return placeholderUrl;
  }

  const img = imageData[0];

  // Xano siempre entrega .url → úsala primero
  if (img.url) return img.url;
  return `https://x8ki-letl-twmt.n7.xano.io${img.path}`;
};



  // NUEVO: obtener todas las imágenes
  const getAllImages = (imageData) => {
    console.log('🎨 getAllImages llamado con:', imageData);
    
    if (!Array.isArray(imageData)) {
      console.log('imageData no es un array');
      return [];
    }
    
    const urls = imageData.map((img, index) => {
      console.log(`Imagen ${index}:`, img);
      
      // Si tiene url directa, usarla
      if (img.url) {
        console.log(`Usando img.url:`, img.url);
        return img.url;
      }
      
      // Si tiene path, construir URL completa
      if (img.path) {
        const fullUrl = `https://x8ki-letl-twmt.n7.xano.io${img.path}`;
        console.log(`Construyendo URL desde path:`, fullUrl);
        return fullUrl;
      }
      
      // Si tiene meta.download_url
      if (img.meta?.download_url) {
        console.log(`Usando meta.download_url:`, img.meta.download_url);
        return img.meta.download_url;
      }
      
      console.log('No se encontró URL para esta imagen');
      return null;
    }).filter(Boolean);
    
    console.log('URLs finales:', urls);
    return urls;
  };

  const categoriasFallback = [
    { id: 4, name: "Higiene" },
    { id: 5, name: "Juguetes" },
    { id: 6, name: "Coches" },
    { id: 7, name: "Comida" }
  ];

  const getCategoriaNombre = (id) => {
    const cat = categorias.find(c => c.id === id) || categoriasFallback.find(c => c.id === id);
    return cat ? cat.name : "Sin categoría";
  };

  const productosFiltrados = lista.filter(producto => {
    const matchNombre = busqueda ? producto.name.toLowerCase().includes(busqueda.toLowerCase()) : true;
    const matchCategoria = categoriaSeleccionada ? String(producto.category_id) === String(categoriaSeleccionada) : true;
    return matchNombre && matchCategoria;
  });

  const handleBuscar = (e) => {
    e.preventDefault();
    let url = "/product";
    const params = [];
    if (busqueda.trim()) params.push(`search=${encodeURIComponent(busqueda.trim())}`);
    if (categoriaSeleccionada) params.push(`category=${encodeURIComponent(categoriaSeleccionada)}`);
    if (params.length > 0) url += "?" + params.join("&");
    navigate(url);
  };

  // Renderizar siempre el contenido, no retornar temprano
  const mostrarMensajeSinProductos = productosFiltrados.length === 0;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <form className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-4 gap-2" onSubmit={handleBuscar}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ maxWidth: "220px" }}
            />
            <select
              name="categoria"
              className="form-select"
              style={{ maxWidth: "180px" }}
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
        </div>
      </div>

      {/* Mensaje si no hay productos */}
      {mostrarMensajeSinProductos && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning text-center">
              No existe ningún producto con esos criterios.
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {productosFiltrados.map((producto) => {
          return (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={producto.id}>
            <div className="card h-100">
              <img
                src={getImageUrl(producto.image)}
                className="card-img-top"
                alt={producto.name}
                style={{ height: "180px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/180x180/f8f9fa/6c757d?text=No+Disponible";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.name}</h5>
                <p className="card-text">
                  Categoría: {getCategoriaNombre(producto.category_id)}
                </p>
                <p className="fw-bold mb-2">${producto.price.toFixed(2)}</p>
                <div className="d-flex gap-2 flex-wrap">
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
                      onClick={() => eliminarProducto(producto.id, producto.name)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {/* Modal para descripción */}
      {productoSeleccionado && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          onClick={() => {
            setProductoSeleccionado(null);
            setImagenPrincipal(null); // Reset imagen principal al cerrar
          }}
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
                  onClick={() => {
                    setProductoSeleccionado(null);
                    setImagenPrincipal(null); // Reset imagen principal al cerrar
                  }}
                ></button>
              </div>
              <div className="modal-body">

                {/* Imagen principal grande */}
                <img
                  src={imagenPrincipal || getImageUrl(productoSeleccionado.image)}
                  alt={productoSeleccionado.name}
                  className="img-fluid mb-3"
                  style={{ 
                    maxHeight: "300px", 
                    objectFit: "cover", 
                    borderRadius: "10px",
                    transition: "opacity 0.3s ease"
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300/f8f9fa/6c757d?text=No+Disponible";
                  }}
                />

                {/* Galería de miniaturas */}
                <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                  {(() => {
                    const images = getAllImages(productoSeleccionado.image);
                    console.log('🎭 Renderizando galería con', images.length, 'imágenes');
                    return images;
                  })().map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
                        border: imagenPrincipal === url ? "3px solid #0d6efd" : "3px solid transparent"
                      }}
                      onClick={() => setImagenPrincipal(url)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.2)";
                        e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
                        e.target.style.zIndex = "10";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                        e.target.style.zIndex = "1";
                      }}
                    />
                  ))}
                </div>

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
                    setImagenPrincipal(null);
                  }}
                >
                  Agregar al carrito
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setProductoSeleccionado(null);
                    setImagenPrincipal(null);
                  }}
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
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-8 col-lg-6">
            <h4 className="mb-3">Agregar nuevo producto (solo admin)</h4>
            <form
              className="card p-4"
              onSubmit={async e => {
                e.preventDefault();
                setMensaje("");
                try {
                  console.log("Imágenes seleccionadas:", imagenesSeleccionadas.length);
                  console.log("Array de imágenes:", imagenesSeleccionadas);
                  
                  // Validación: verificar que haya imágenes seleccionadas
                  if (!imagenesSeleccionadas || imagenesSeleccionadas.length === 0) {
                    alert("Por favor selecciona al menos una imagen.");
                    return;
                  }
                  
                  // 1️⃣ Subir imágenes UNA POR UNA (el foreach de Xano no funciona bien con FormData múltiple)
                  const imageArray = [];
                  
                  for (let i = 0; i < imagenesSeleccionadas.length; i++) {
                    const file = imagenesSeleccionadas[i];
                    console.log(`Subiendo imagen ${i + 1}/${imagenesSeleccionadas.length}:`, file.name);
                    
                    const formData = new FormData();
                    formData.append("content", file);
                    
                    const res = await api.post("/upload/image", formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    });
                    
                    console.log(`Imagen ${i + 1} subida:`, res.data);
                    
                    // La respuesta es un array con un elemento, tomar ese elemento
                    if (Array.isArray(res.data) && res.data.length > 0) {
                      imageArray.push(res.data[0]);
                    } else if (res.data && typeof res.data === 'object') {
                      imageArray.push(res.data);
                    }
                  }
                  
                  console.log("Total de imágenes subidas:", imageArray.length);
                  console.log("Array completo:", imageArray);
                  
                  // 2️⃣ Creas el producto enviando el array
                  const productResponse = await api.post("/product", {
                    name: e.target.name.value.trim(),
                    description: e.target.description.value.trim(),
                    price: parseFloat(e.target.price.value),
                    stock: parseInt(e.target.stock.value),
                    category_id: parseInt(e.target.category_id.value),
                    image: imageArray   // ← aquí se guardan
                  });
                  
                  console.log("Producto creado exitosamente");
                  console.log("Respuesta del servidor:", productResponse.data);
                  console.log("Campo image en la respuesta:", productResponse.data.image);
                  console.log("Longitud del campo image:", Array.isArray(productResponse.data.image) ? productResponse.data.image.length : 'No es array');
                  
                  const resLista = await api.get("/product");
                  setLista(resLista.data);
                  setMensaje(`Producto agregado correctamente con ${imageArray.length} imagen(es).`);
                  e.target.reset();
                  setImagenesSeleccionadas([]);
                  setPreviewImagenes([]);
                } catch (err) {
                  console.error("Error completo:", err);
                  console.error("Error response:", err.response?.data);
                  
                  let errorMsg = "Error desconocido";
                  if (err.response?.data) {
                    if (typeof err.response.data === 'string') {
                      errorMsg = err.response.data;
                    } else if (err.response.data.message) {
                      errorMsg = err.response.data.message;
                    } else {
                      errorMsg = JSON.stringify(err.response.data);
                    }
                  } else if (err.message) {
                    errorMsg = err.message;
                  }
                  
                  setMensaje("Error: " + errorMsg);
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
                <label className="form-label">Imágenes del producto</label>
                <div className="d-flex gap-2 align-items-start">
                  <input 
                    id="imageInput"
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={handleImagenChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => document.getElementById('imageInput').click()}
                  >
                    + Agregar imagen
                  </button>
                </div>
                <small className="form-text text-muted">
                  Haz clic en "+ Agregar imagen" para añadir cada imagen. Formatos: JPG, PNG, GIF
                </small>
                
                {/* Preview de las imágenes seleccionadas */}
                {previewImagenes.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label">Imágenes seleccionadas ({previewImagenes.length}):</label>
                    <div className="d-flex flex-wrap gap-2">
                      {previewImagenes.map((preview, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="img-thumbnail"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            style={{ transform: "translate(50%, -50%)", padding: "2px 6px" }}
                            onClick={() => eliminarImagenPreview(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select name="category_id" className="form-control" required>
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
        </div>
      )}
    </div>
  );
}