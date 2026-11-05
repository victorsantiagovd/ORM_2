const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(ruta, opciones = {}) {
  const res = await fetch(`${BASE_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // la respuesta no trae JSON (por ejemplo, un DELETE vacío)
  }

  if (!res.ok) {
    const mensaje = data?.descripcion || data?.error || `Error ${res.status}`;
    throw new Error(mensaje);
  }

  return data;
}

export const get = (ruta) => request(ruta);

export const post = (ruta, cuerpo) =>
  request(ruta, { method: "POST", body: JSON.stringify(cuerpo) });

export const put = (ruta, cuerpo) =>
  request(ruta, { method: "PUT", body: JSON.stringify(cuerpo) });

export const del = (ruta) => request(ruta, { method: "DELETE" });
