import { useEffect, useState } from 'react';
import { createTask, getTasks, deleteTask, updateTask } from '../services/taskServices';
import type { Task } from '../types/task';

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoDescripcion, setNuevoDescripcion] = useState('');
  const [busqueda, setBusqueda ] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'pendiente' | 'completada'>('pendiente');
  const tareasFiltradas = tasks.filter(task => task.estado === filtroEstado);

   const cargarTareas = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleEliminar = async (id: string) => {
  const confirmar = confirm('¿Estás seguro de eliminar esta tarea?');
  if (!confirmar) return;
  await deleteTask(id);
  setTasks(prev => prev.filter(task => task._id !== id));
};

const handleEditar = async (id: string) => {
  const nuevoNombre = prompt('Nuevo nombre de la tarea:');
  const nuevaDescripcion = prompt('Nueva descripción de la tarea:');
  if (!nuevoNombre || !nuevaDescripcion) return;

  const tareaEditada = await updateTask(id, {
    nombre: nuevoNombre,
    descripcion: nuevaDescripcion,
  });

  setTasks(prev =>
    prev.map(task => (task._id === id ? tareaEditada : task))
  );
};


  useEffect(() => {
    cargarTareas();
  }, []);

  const handleCrearTarea = async () => {
    if (!nuevoNombre) return alert('El nombre es obligatorio');
    const nuevaTarea = {
        nombre: nuevoNombre,
        descripcion: nuevoDescripcion,
        fecha: new Date().toISOString(),
        estado: 'pendiente' as 'pendiente' | 'completada',
    };

    const tareaCreada = await createTask(nuevaTarea);
    setTasks(prev => [...prev, tareaCreada]);
    setNuevoNombre('');
    setNuevoDescripcion('');
  };
  
 
  return (

    
<div className="bg-red-200 p-4 rounded-lg shadow-md">
          <h2>Lista de tareas</h2>

      <div>
  <button onClick={() => setFiltroEstado('pendiente')}>
    Ver pendientes
  </button>
  <button onClick={() => setFiltroEstado('completada')}>
    Ver completadas
  </button>
</div>

      <input
      type="text"
      placeholder="Buscar tareas..."
         value={busqueda}
     onChange={e => setBusqueda(e.target.value)}
     style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />

      <input
        type="text"
        placeholder="Nombre tarea"
        value={nuevoNombre}
        onChange={e => setNuevoNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={nuevoDescripcion}
        onChange={e => setNuevoDescripcion(e.target.value)}
      />
      <button onClick={handleCrearTarea}>[+]</button>
    
      <div>
        {tasks
  .filter(task => task.estado === filtroEstado)
  .filter(task =>
    task.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    task.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )
  .map(task => (
    <div key={task._id}>
      <h3>{task.nombre}</h3>
      <p>Estado: {task.estado}</p>
      <p>Descripción: {task.descripcion}</p>
      <p>Fecha: {new Date(task.fecha).toLocaleDateString()}</p>
      <button onClick={() => handleEditar(task._id)}>✏️</button>
      <button onClick={() => handleEliminar(task._id)}>🗑️</button>
    </div>
))}

      </div>
    </div>
  );
}

export default TaskListPage;
