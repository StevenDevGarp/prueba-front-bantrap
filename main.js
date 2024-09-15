document.addEventListener('DOMContentLoaded', () => {
    const personaSelect = document.getElementById('personaSelect');
    const facturaSelect = document.getElementById('facturaSelect');
    const cajaChicaForm = document.getElementById('cajaChicaForm');
    const cajaChicaList = document.getElementById('cajaChicaList');
    const taxesList = document.getElementById('taxesList');
    const perfectNumbersList = document.getElementById('perfectNumbersList');
    const generateReportButton = document.getElementById('generateReport');
    const reportOutput = document.getElementById('reportOutput');

    // Cargar las personas y facturas al cargar la página
    cargarPersonas();
    cargarFacturas();

    // Función para cargar las personas en el select
    function cargarPersonas() {
        fetch('http://localhost:8080/personas')
            .then(response => response.json())
            .then(data => {
                data.forEach(persona => {
                    const option = document.createElement('option');
                    option.value = persona.id_persona;
                    option.textContent = persona.nombre_persona;
                    personaSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error cargando personas:', error));
    }

    // Función para cargar las facturas en el select
    function cargarFacturas() {
        fetch('http://localhost:8080/facturas') // Ajusta la ruta del endpoint
            .then(response => response.json())
            .then(data => {
                data.forEach(factura => {
                    const option = document.createElement('option');
                    option.value = factura.id_factura;
                    option.textContent = factura.concepto_factura;
                    facturaSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error cargando facturas:', error));
    }

    // Evento para manejar el formulario de registro de caja chica
    cajaChicaForm.addEventListener('submit', event => {
        event.preventDefault();

        const registroCajaChica = {
            monto: parseFloat(document.getElementById('monto').value),
            persona: {
                id_persona: parseInt(personaSelect.value)
            },
            factura: {
                id_factura: parseInt(facturaSelect.value)
            },
            fecha: document.getElementById('fecha').value
        };

        fetch('http://localhost:8080/caja-chica', { // Ajusta la ruta del endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registroCajaChica)
        })
        .then(response => response.json())
        .then(data => {
            alert('Registro creado con éxito');
            listarRegistros();
        })
        .catch(error => console.error('Error creando registro:', error));
    });

    // Función para listar los registros de caja chica, impuestos y números perfectos
    function listarRegistros() {
        fetch('http://localhost:8080/caja-chica') // Ajusta la ruta del endpoint
            .then(response => response.json())
            .then(data => {
                cajaChicaList.innerHTML = '';
                data.forEach(registro => {
                    cajaChicaList.innerHTML += `<div>Persona: ${registro.persona.nombre_persona}, Monto: ${registro.monto}, Fecha: ${registro.fecha}</div>`;
                });
            });

        fetch('http://localhost:8080/caja-chica/taxes') // Ajusta la ruta del endpoint
            .then(response => response.json())
            .then(data => {
                taxesList.innerHTML = '';
                data.forEach(impuesto => {
                    taxesList.innerHTML += `<div>Caja Chica ID: ${impuesto.cajaChica.id_caja_chica}, Tasa: ${impuesto.tasa_impuesto}</div>`;
                });
            });

        fetch('http://localhost:8080/caja-chica/perfect-numbers') // Ajusta la ruta del endpoint
            .then(response => response.json())
            .then(data => {
                perfectNumbersList.innerHTML = '';
                data.forEach(perfecto => {
                    perfectNumbersList.innerHTML += `<div>Numero Perfecto: ${perfecto.numero_perfecto}, Persona: ${perfecto.persona.nombre_persona}</div>`;
                });
            });
    }

    // Generar reporte en formato TXT
    generateReportButton.addEventListener('click', () => {
        let reportContent = 'Registros de Caja Chica:\n';
        reportContent += cajaChicaList.textContent + '\n\n';
        reportContent += 'Registros de Impuestos:\n';
        reportContent += taxesList.textContent + '\n\n';
        reportContent += 'Registros de Números Perfectos:\n';
        reportContent += perfectNumbersList.textContent;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_caja_chica.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Cargar los registros al iniciar
    listarRegistros();
});
