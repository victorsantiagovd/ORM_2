const API = "http://127.0.0.1:5000";

// --- Cambiar de pestaña ---
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function mostrarError(msg) {
  document.getElementById("mensaje").textContent = msg;
  setTimeout(() => (document.getElementById("mensaje").textContent = ""), 4000);
}

// ---------- CATEGORÍAS ----------
async function cargarCategorias() {
  const res = await fetch(`${API}/categorias`);
  const datos = await res.json();
  const tbody = document.getElementById("tabla-categorias");
  tbody.innerHTML = "";
  datos.forEach((c) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.descripcion}</td>
        <td><button class="btn-eliminar" onclick="eliminarCategoria(${c.id})">Eliminar</button></td>
      </tr>`;
  });
}

document
  .getElementById("form-categoria")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      nombre: document.getElementById("cat-nombre").value,
      descripcion: document.getElementById("cat-descripcion").value,
    };
    const res = await fetch(`${API}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      mostrarError(err.error || "Error al crear la categoría");
      return;
    }
    e.target.reset();
    cargarCategorias();
  });

async function eliminarCategoria(id) {
  const res = await fetch(`${API}/categorias/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    mostrarError(
      err.error || "No se pudo eliminar (puede tener productos asociados)",
    );
    return;
  }
  cargarCategorias();
}

// ---------- PRODUCTOS ----------
async function cargarProductos() {
  const res = await fetch(`${API}/products`);
  const datos = await res.json();
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";
  datos.forEach((p) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.categoria_nombre ?? p.categoria_id}</td>
        <td><button class="btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button></td>
      </tr>`;
  });
}

document
  .getElementById("form-producto")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      nombre: document.getElementById("prod-nombre").value,
      descripcion: document.getElementById("prod-descripcion").value,
      precio: parseFloat(document.getElementById("prod-precio").value),
      stock_min: parseInt(document.getElementById("prod-stock").value),
      categoria_id: parseInt(document.getElementById("prod-categoria").value),
    };
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      mostrarError(err.error || err.mensaje || "Error al crear el producto");
      return;
    }
    e.target.reset();
    cargarProductos();
  });

async function eliminarProducto(id) {
  const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    mostrarError(
      err.error || "No se pudo eliminar (puede tener entradas asociadas)",
    );
    return;
  }
  cargarProductos();
}

// ---------- ENTRADAS ----------
async function cargarEntradas() {
  const res = await fetch(`${API}/entradas`);
  const datos = await res.json();
  const tbody = document.getElementById("tabla-entradas");
  tbody.innerHTML = "";
  datos.forEach((en) => {
    tbody.innerHTML += `
      <tr>
        <td>${en.id}</td>
        <td>${en.producto_nombre ?? en.producto_id}</td>
        <td>${en.cantidad}</td>
        <td>${en.factura}</td>
        <td><button class="btn-eliminar" onclick="eliminarEntrada(${en.id})">Eliminar</button></td>
      </tr>`;
  });
}

document
  .getElementById("form-entrada")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      entra_producto_id: parseInt(
        document.getElementById("entrada-producto").value,
      ),
      entra_cantidad: parseInt(
        document.getElementById("entrada-cantidad").value,
      ),
      entra_factura: document.getElementById("entrada-factura").value,
      entra_stand: document.getElementById("entrada-stand").value,
      entra_ubicacion: document.getElementById("entrada-ubicacion").value,
    };
    const res = await fetch(`${API}/entradas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      mostrarError(err.error || "Error al crear la entrada");
      return;
    }
    e.target.reset();
    cargarEntradas();
  });

async function eliminarEntrada(id) {
  const res = await fetch(`${API}/entradas/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    mostrarError(err.error || "No se pudo eliminar la entrada");
    return;
  }
  cargarEntradas();
}

// ---------- Carga inicial ----------
cargarCategorias();
cargarProductos();
cargarEntradas();
