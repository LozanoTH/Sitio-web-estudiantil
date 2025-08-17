// JS robusto para index.html (no rompe en res.html)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultaForm');
  const inputHora = document.getElementById('hora');
  const inputFecha = document.getElementById('fecha');
  const modal = document.getElementById('facturaModal');
  const btnSalida = document.getElementById('btnRegistrarSalida');
  
  // Poner fecha y hora actuales si existen los campos
  const now = new Date();
  if (inputHora) inputHora.value = now.toLocaleTimeString();
  if (inputFecha) inputFecha.value = now.toLocaleDateString();
  
  // Solo si estamos en index.html (porque hay formulario)
  if (form) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nombre = (document.getElementById('nombre')?.value || '').trim();
      const grado = (document.getElementById('grado')?.value || '').trim();
      const medicamento = (document.getElementById('medicamento')?.value || '').trim();
      const fecha = inputFecha ? inputFecha.value : new Date().toLocaleDateString();
      const horaEntrada = inputHora ? inputHora.value : new Date().toLocaleTimeString();
      
      const consulta = { nombre, grado, medicamento, fecha, horaEntrada, horaSalida: null };
      
      consultas.push(consulta);
      localStorage.setItem('consultas', JSON.stringify(consultas));
      
      // Rellenar factura
      const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
      setTxt('facturaNombre', nombre);
      setTxt('facturaGrado', grado);
      setTxt('facturaMedicamento', medicamento);
      setTxt('facturaFecha', fecha);
      setTxt('facturaHora', horaEntrada);
      setTxt('facturaSalida', 'Pendiente');
      
      if (modal) modal.style.display = 'flex';
      
      if (btnSalida) {
        btnSalida.onclick = () => {
          const horaSalida = new Date().toLocaleTimeString();
          setTxt('facturaSalida', horaSalida);
          
          // Vuelve a leer por si otra pestaña cambió los datos
          consultas = JSON.parse(localStorage.getItem('consultas')) || consultas;
          consultas[consultas.length - 1].horaSalida = horaSalida;
          localStorage.setItem('consultas', JSON.stringify(consultas));
          
          alert('Salida registrada con éxito');
          if (modal) modal.style.display = 'none';
          
          form.reset();
          const now2 = new Date();
          if (inputHora) inputHora.value = now2.toLocaleTimeString();
          if (inputFecha) inputFecha.value = now2.toLocaleDateString();
        };
      }
    });
  }
});