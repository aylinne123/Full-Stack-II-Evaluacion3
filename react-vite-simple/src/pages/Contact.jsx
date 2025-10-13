import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    alert(`¡Gracias, ${form.name}! Te responderemos a ${form.email}.`);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-start align-items-start">
        <div className="col-12 col-md-6 col-lg-5">
          <section className="card p-3">
            <h1 className="mb-3">Contactanos</h1>
            <form className="form" onSubmit={onSubmit}>
              <label>
                Nombre
                <input name="name" value={form.name} onChange={onChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={onChange} required />
              </label>
              <label>
                Mensaje
                <textarea name="message" rows={4} value={form.message} onChange={onChange} />
              </label>
              <button className="btn" type="submit">Enviar</button>
            </form>
          </section>
        </div>
        <div className="col-12 col-md-6 col-lg-7 d-flex flex-column align-items-center justify-content-center mt-4 mt-md-0">
          <div className="d-flex flex-column gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-link fs-4">
              <i className="bi bi-facebook" style={{fontSize: "2rem", marginRight: "8px"}}></i>
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-link fs-4">
              <i className="bi bi-instagram" style={{fontSize: "2rem", marginRight: "8px"}}></i>
              Instagram
            </a>
            <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="btn btn-link fs-4">
              <i className="bi bi-whatsapp" style={{fontSize: "2rem", marginRight: "8px"}}></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
