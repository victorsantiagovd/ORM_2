import { useState, useEffect } from "react";
import { get, post, put, del } from "../services/api";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock_min: 0,
  disponible: true,
  categoria_id: "",
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);

  async function cargar() {
    try {
      const [prods, cats] = await Promise.all([
        get("/products"),
        get("/categorias"),
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function guardar(e) {
    e.preventDefault();
    const cuerpo = {
      ...form,
      precio: Number(form.precio),
      stock_min: Number(form.stock_min),
      categoria_id: Number(form.categoria_id),
    };
    try {
      setError("");
      if (editandoId) {
        await put(`/products/${editandoId}`, cuerpo);
      } else {
        await post("/products", cuerpo);
      }
      cancelar();
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  function editar(p) {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock_min: p.stock_min,
      disponible: p.disponible,
      categoria_id: p.categoria_id,
    });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function eliminar(p) {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    try {
      setError("");
      await del(`/products/${p.id}`);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={guardar} className="form-grid">
        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precio"
            value={form.precio}
            onChange={cambiar}
            required
          />
        </div>
        <div>
          <label>Stock mínimo</label>
          <input
            type="number"
            min="0"
            name="stock_min"
            value={form.stock_min}
            onChange={cambiar}
            required
          />
        </div>
        <div>
          <label>Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={cambiar}
            required
          >
            <option value="">Selecciona...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="check-campo">
          <input
            type="checkbox"
            id="disponible"
            name="disponible"
            checked={form.disponible}
            onChange={cambiar}
          />
          <label htmlFor="disponible">Disponible</label>
        </div>
        <div className="form-acciones">
          <button className="btn btn-activo" type="submit">
            {editandoId ? "Actualizar" : "Crear"}
          </button>
          {editandoId && (
            <button className="btn" type="button" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="mensaje-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock mín.</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria_nombre}</td>
                  <td>${p.precio.toLocaleString("es-CO")}</td>
                  <td>{p.stock_min}</td>
                  <td>{p.disponible ? "Sí" : "No"}</td>
                  <td className="acciones">
                    <button className="btn" onClick={() => editar(p)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-peligro"
                      onClick={() => eliminar(p)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Productos;
