// Inyectar menú en todas las páginas (usa imágenes en vez de iconos)
document.addEventListener("DOMContentLoaded", () => {
  const menu = `
    <link rel="stylesheet" href="sty.css">
    <nav class="bottom-nav" id="bottomNav" role="navigation" aria-label="Menú principal">
      <a href="index.html" class="nav-item" data-name="Registrar">
        <img src="../assets/img/menu/home.png" alt="Inicio" class="nav-img">
        <span class="nav-label">Registrar</span>
      </a>

      <a href="res.html" class="nav-item" data-name="Consultas">
        <img src="../assets/img/menu/consultas.png" alt="Consultas" class="nav-img">
        <span class="nav-label">Consultas</span>
      </a>

      <button class="fab" id="fab" aria-label="Registrar rápido">
        <img src="../assets/img/menu/fab.png" alt="Registrar" class="fab-img">
      </button>

      <a href="#" class="nav-item" data-name="Reportes">
        <img src="../assets/img/menu/reportes.png" alt="Reportes" class="nav-img">
        <span class="nav-label">Reportes</span>
      </a>

      <a href="aj.html" class="nav-item" data-name="Ajustes">
        <img src="../assets/img/menu/ajustes.png" alt="Ajustes" class="nav-img">
        <span class="nav-label">Ajustes</span>
      </a>
    </nav>
  `;
  document.body.insertAdjacentHTML("beforeend", menu);

  // FAB: comportamiento (si la página tiene formulario se desplaza a él)
  const fab = document.getElementById('fab');
  if (fab) {
    fab.addEventListener('click', () => {
      // intenta enfocar el formulario principal en la página actual
      const form = document.querySelector('#consultaForm, #form-consulta, form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
        // si existe un primer input, darle foco
        const firstInput = form.querySelector('input, select, textarea, button');
        if (firstInput) firstInput.focus();
      } else {
        // si no hay formulario en la página, redirige a registrar
        window.location.href = 'home.html';
      }
    });
  }

  // Guardar consulta (si hay formulario con id consultaForm o form-consulta)
  const form = document.getElementById("consultaForm") || document.getElementById("form-consulta");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dni = (document.getElementById("dni") || {}).value || '';
      const nombre = (document.getElementById("nombre") || {}).value || '';
      const medicamento = (document.getElementById("medicamento") || {}).value || '';
      const horaEntrada = new Date().toLocaleTimeString();

      const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
      consultas.push({ dni, nombre, medicamento, horaEntrada, horaSalida: "" });
      localStorage.setItem("consultas", JSON.stringify(consultas));
      alert("Consulta registrada ✅");
      form.reset();
    });
  }

  // Rellenar tabla de consultas si existe
  const tablaBody = document.querySelector("#tablaConsultas tbody");
  if (tablaBody) {
    const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
    if (consultas.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5">No hay registros</td></tr>`;
    } else {
      tablaBody.innerHTML = consultas.map(c => `
        <tr>
          <td>${c.dni || "-"}</td>
          <td>${c.nombre || "-"}</td>
          <td>${c.medicamento || "-"}</td>
          <td>${c.horaEntrada || "-"}</td>
          <td>${c.horaSalida || "-"}</td>
        </tr>
      `).join("");
    }
  }

  // Botón vaciar datos
  const clearBtn = document.getElementById("clearData");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres eliminar todos los registros?")) {
        localStorage.removeItem("consultas");
        location.reload();
      }
    });
  }

  // Exportar a CSV
  const exportBtn = document.getElementById("exportarExcel");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
      if (consultas.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }
      let csv = "DNI,Nombre,Medicamento,Hora Entrada,Hora Salida\n";
      consultas.forEach(c => {
        // escapado simple de comas
        const esc = (s='') => `"${String(s).replace(/"/g,'""')}"`;
        csv += `${esc(c.dni)},${esc(c.nombre)},${esc(c.medicamento)},${esc(c.horaEntrada)},${esc(c.horaSalida)}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "consultas.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});