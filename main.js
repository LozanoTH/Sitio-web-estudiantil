// Menú lateral
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Registro de consulta
document.getElementById("formConsulta").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value || "No especificado";
  const sexo = document.getElementById("sexo").value;
  const sintomas = document.getElementById("sintomas").value || "No registrado";
  const medicamento = document.getElementById("medicamento").value;
  const cantidad = document.getElementById("cantidad").value || "No especificado";
  
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();
  
  const consulta = { nombre, dni, sexo, sintomas, medicamento, cantidad, fecha, hora, salida: "" };
  
  // Guardar en localStorage
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  consultas.push(consulta);
  localStorage.setItem("consultas", JSON.stringify(consultas));
  
  mostrarToast("✅ Consulta registrada con éxito");
  e.target.reset();
});

// Toast bonito
function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.textContent = mensaje;
  toast.className = "toast";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}