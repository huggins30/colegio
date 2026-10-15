// Variables globales
let estudiantes = [];
let editingId = null;

// Elementos del DOM
const registroForm = document.getElementById('registroForm');
const tablaBody = document.querySelector('#tablaResultados tbody');

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    loadEstudiantes();
    registroForm.addEventListener('submit', handleSubmit);
});

// Cargar estudiantes desde Supabase
async function loadEstudiantes() {
    try {
        // Reemplaza con tu cliente de Supabase
        const { data, error } = await supabase
            .from('estudiantes')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        estudiantes = data || [];
        renderTable();
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        alert('Error al cargar los datos');
    }
}

// Renderizar tabla
function renderTable() {
    if (estudiantes.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="7" class="empty-message">No hay registros</td></tr>';
        return;
    }

    tablaBody.innerHTML = estudiantes.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td>${e.apellido}</td>
            <td>${e.cedula}</td>
            <td>${e.edad}</td>
            <td>${e.genero}</td>
            <td>
                <div class="acciones-cell">
                    <button class="icon-btn ver" onclick="verEstudiante(${e.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn modificar" onclick="editarEstudiante(${e.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn eliminar" onclick="eliminarEstudiante(${e.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Manejar envío del formulario
function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(registroForm);
    const estudiante = {
        nombre: formData.get('nombre').trim(),
        apellido: formData.get('apellido').trim(),
        cedula: formData.get('cedula').trim(),
        edad: parseInt(formData.get('edad')),
        genero: formData.get('genero')
    };

    if (editingId) {
        updateEstudiante(editingId, estudiante);
    } else {
        createEstudiante(estudiante);
    }
}

// Crear estudiante
async function createEstudiante(estudiante) {
    try {
        const { data, error } = await supabase
            .from('estudiantes')
            .insert([estudiante])
            .select();

        if (error) throw error;

        estudiantes.unshift(data[0]);
        renderTable();
        limpiarForm();
        alert('Estudiante registrado correctamente');
    } catch (error) {
        console.error('Error al crear:', error);
        alert('Error al registrar estudiante');
    }
}

// Actualizar estudiante
async function updateEstudiante(id, estudiante) {
    try {
        const { data, error } = await supabase
            .from('estudiantes')
            .update(estudiante)
            .eq('id', id)
            .select();

        if (error) throw error;

        const index = estudiantes.findIndex(e => e.id === id);
        if (index !== -1) {
            estudiantes[index] = data[0];
        }
        renderTable();
        limpiarForm();
        alert('Estudiante actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar estudiante');
    }
}

// Eliminar estudiante
async function eliminarEstudiante(id) {
    if (!confirm('¿Está seguro de eliminar este estudiante?')) return;

    try {
        const { error } = await supabase
            .from('estudiantes')
            .delete()
            .eq('id', id);

        if (error) throw error;

        estudiantes = estudiantes.filter(e => e.id !== id);
        renderTable();
        alert('Estudiante eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar estudiante');
    }
}

// Ver estudiante (mostrar detalles)
function verEstudiante(id) {
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) return;

    alert(`
        Detalles del Estudiante:
        
        ID: ${estudiante.id}
        Nombre: ${estudiante.nombre}
        Apellidos: ${estudiante.apellido}
        Cédula: ${estudiante.cedula}
        Edad: ${estudiante.edad}
        Género: ${estudiante.genero}
    `);
}

// Editar estudiante (llenar formulario)
function editarEstudiante(id) {
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) return;

    editingId = id;
    document.getElementById('nombre').value = estudiante.nombre;
    document.getElementById('apellido').value = estudiante.apellido;
    document.getElementById('cedula').value = estudiante.cedula;
    document.getElementById('edad').value = estudiante.edad;
    document.getElementById('genero').value = estudiante.genero;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Limpiar formulario
function limpiarForm() {
    registroForm.reset();
    editingId = null;
}


const supabaseUrl = 'https://hoorgudzssnwsmvlhtnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvb3JndWR6c3Nud3NtdmxodG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTEwMDIsImV4cCI6MjEwNjg4NzAwMn0.NEmEGpgfaitwJz5poW-dEb-eTvDk29TMRlTCM8Rek1g';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
