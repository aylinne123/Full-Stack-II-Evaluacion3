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
    <section className="card">
      <h1>Contacto</h1>
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
  );
}
