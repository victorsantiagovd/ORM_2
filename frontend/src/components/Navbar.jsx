const SECCIONES = ["Productos", "Categorías", "Entradas"];

function Navbar({ activa, onCambiar }) {
  return (
    <nav className="navbar glass">
      <span className="navbar-logo">ORM Inventario</span>
      <div className="navbar-links">
        {SECCIONES.map((nombre) => (
          <button
            key={nombre}
            className={`btn ${activa === nombre ? "btn-activo" : ""}`}
            onClick={() => onCambiar(nombre)}
          >
            {nombre}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
