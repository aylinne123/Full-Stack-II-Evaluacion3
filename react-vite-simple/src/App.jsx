import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { AppRoutes } from "./routes/index.jsx";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
