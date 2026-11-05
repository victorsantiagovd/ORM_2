import { useState, useEffect } from "react";
import { get, post, put, del } from "../services/api";

const VACIO = {
  producto_id: "",
  cantidad: "",
  factura: "",
  stand: "",
  ubicacion: "",
};

function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);

  async function cargar() {
    try {
      setCargando(true);
      const [ents, prods] = await Promise.all([
        get("/entradas"),
        get("/products"),
      ]);
      setEntradas(ents);
      setProductos(prods);
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
    const cuerpo = {
      entra_cantidad: Number(form.cantidad),
      entra_factura: form.factura,
      entra_stand: form.stand,
      entra_ubicacion: form.ubicacion,
    };
    try {
      setError("");
      if (editandoId) {
        await put(`/entradas/${editandoId}`, cuerpo);
      } else {
        await post("/entradas", {
          ...cuerpo,
          entra_producto_id: Number(form.producto_id),
        });
      }
      cancelar();
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  function editar(en) {
    setEditandoId(en.id);
    setForm({
      producto_id: en.producto_id,
      cantidad: en.cantidad,
      factura: en.factura,
      stand: en.stand,
      ubicacion: en.ubicacion,
    });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function eliminar(en) {
    if (!window.confirm(`¿Eliminar la entrada ${en.factura}?`)) return;
    try {
      setError("");
      await del(`/entradas/${en.id}`);
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={guardar} className="form-grid">
        <div>
          <label>Producto</label>
          <select
            name="producto_id"
            value={form.producto_id}
            onChange={cambiar}
            disabled={editandoId !== null}
            required
          >
            <option value="">Selecciona...</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            min="1"
            name="cantidad"
            value={form.cantidad}
            onChange={cambiar}
            required
          />
        </div>
        <div>
          <label>Factura</label>
          <input
            name="factura"
            value={form.factura}
            onChange={cambiar}
            placeholder="FAC-011"
            required
          />
        </div>
        <div>
          <label>Stand</label>
          <input
            name="stand"
            value={form.stand}
            onChange={cambiar}
            placeholder="A1"
            required
          />
        </div>
        <div>
          <label>Ubicación</label>
          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={cambiar}
            placeholder="Bodega Principal"
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
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Factura</th>
                <th>Stand</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((en) => (
                <tr key={en.id}>
                  <td>{en.id}</td>
                  <td>{en.producto_nombre}</td>
                  <td>{en.cantidad}</td>
                  <td>{en.factura}</td>
                  <td>{en.stand}</td>
                  <td>{en.ubicacion}</td>
                  <td>{en.fecha}</td>
                  <td className="acciones">
                    <button className="btn" onClick={() => editar(en)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-peligro"
                      onClick={() => eliminar(en)}
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

export default Entradas;
