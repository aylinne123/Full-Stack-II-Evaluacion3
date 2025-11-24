import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Product from "../pages/Product.jsx";
import Cart from "../pages/Cart.jsx";
import Admin from "../pages/Admin.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<About />} /> {/* Ahora About.jsx es la página principal */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
