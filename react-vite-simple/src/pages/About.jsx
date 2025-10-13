import "./about.css";

export default function About() {
  return (
    <div className="container py-5">
      {/* Carrusel de imágenes de bebés */}
      <div className="mb-5">
        <h1 className="text-center mb-4">Nosotros</h1>
        <div id="babyCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner rounded shadow">
            <div className="carousel-item active">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Bebé 1" style={{height: "350px", objectFit: "cover"}} />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Bebé 2" style={{height: "350px", objectFit: "cover"}} />
            </div>
            <div className="carousel-item">
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" className="d-block w-100" alt="Bebé 3" style={{height: "350px", objectFit: "cover"}} />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#babyCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#babyCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
        <p className="mt-4 text-center">
          Somos apasionados por el bienestar de los bebés y la tranquilidad de las familias. Descubre nuestros productos y consejos para la maternidad.
        </p>
      </div>

      {/* Productos destacados */}
      <div className="mb-5">
        <h2 className="mb-4 text-center">Productos Destacados</h2>
        <div className="row justify-content-center d-flex gap-3">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow">
              <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" className="card-img-top" alt="Pañales ecológicos" style={{height: "180px", objectFit: "cover"}} />
              <div className="card-body">
                <h5 className="card-title">Pañales ecológicos</h5>
                <p className="card-text">Cuida la piel de tu bebé y el planeta con nuestros pañales biodegradables.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow">
              <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80" className="card-img-top" alt="Juguete sensorial" style={{height: "180px", objectFit: "cover"}} />
              <div className="card-body">
                <h5 className="card-title">Juguete sensorial</h5>
                <p className="card-text">Estimula el desarrollo de tu bebé con juguetes seguros y educativos.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow">
              <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" className="card-img-top" alt="Coche compacto" style={{height: "180px", objectFit: "cover"}} />
              <div className="card-body">
                <h5 className="card-title">Coche compacto</h5>
                <p className="card-text">Ideal para paseos seguros y cómodos en cualquier lugar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Noticias relevantes sobre maternidad */}
      <div className="mb-5">
        <h2 className="mb-4 text-center">Noticias sobre Maternidad</h2>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card h-100 border-info shadow">
              <div className="card-body">
                <h5 className="card-title">La importancia del apego en los primeros meses</h5>
                <p className="card-text">
                  Estudios recientes destacan cómo el contacto y el apego temprano favorecen el desarrollo emocional y físico del bebé.
                </p>
                <a href="https://www.unicef.org/parenting/child-development/attachment" target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">
                  Leer más
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card h-100 border-success shadow">
              <div className="card-body">
                <h5 className="card-title">Alimentación saludable para madres y bebés</h5>
                <p className="card-text">
                  Consejos de expertos sobre nutrición durante el embarazo y la lactancia para un crecimiento óptimo.
                </p>
                <a href="https://www.who.int/es/news-room/fact-sheets/detail/infant-and-young-child-feeding" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                  Leer más
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-3">
            <div className="card h-100 border-warning shadow">
              <div className="card-body">
                <h5 className="card-title">Tips para el sueño seguro del bebé</h5>
                <p className="card-text">
                  Descubre las mejores prácticas para crear un ambiente seguro y cómodo para el descanso de tu pequeño.
                </p>
                <a href="https://www.sleepfoundation.org/es/baby-sleep/safe-sleep-tips-for-babies" target="_blank" rel="noopener noreferrer" className="btn btn-warning btn-sm">
                  Leer más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
