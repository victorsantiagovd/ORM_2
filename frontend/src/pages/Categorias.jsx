import { useState, useEffect } from "react";
import { get, post, put, del } from "../services/api";

const VACIO = { nombre: "", descripcion: "" };

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);

  async function cargar() {
    try {
      const data = await get("/categorias");
      setCategorias(data);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      setError("");
      if (editandoId) {
        await put(`/categorias/${editandoId}`, form);
      } else {
        await post("/categorias", form);
      }
      cancelar();
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  function editar(c) {
    setEditandoId(c.id);
    setForm({ nombre: c.nombre, descripcion: c.descripcion });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function eliminar(c) {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    try {
      setError("");
      await del(`/categorias/${c.id}`);
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
            placeholder="Ej: Electrónica"
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            placeholder="Breve descripción"
            required
          />
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
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td className="acciones">
                    <button className="btn" onClick={() => editar(c)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-peligro"
                      onClick={() => eliminar(c)}
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

export default Categorias;
