import { useState } from "react";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Entradas from "./pages/Entradas";

function App() {
  const [seccion, setSeccion] = useState("Productos");

  return (
    <div className="contenedor">
      <Navbar activa={seccion} onCambiar={setSeccion} />
      <main className="glass contenido">
        <h2>{seccion}</h2>
        {seccion === "Productos" && <Productos />}
        {seccion === "Categorías" && <Categorias />}
        {seccion === "Entradas" && <Entradas />}
      </main>
    </div>
  );
}

export default App;
