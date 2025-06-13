"use client"

import { useEffect, useState } from "react"
import { createTask, getTasks, deleteTask, updateTask } from "../services/taskServices"
import type { Task } from "../types/task"

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoDescripcion, setNuevoDescripcion] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<"pendiente" | "completada">("pendiente")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({ nombre: "", descripcion: "" })
  const [isLoading, setIsLoading] = useState(true)

  const cargarTareas = async () => {
    setIsLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error("Error al cargar tareas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task._id !== id))

      // Mostrar notificación
      showNotification("¡Tarea eliminada con éxito!", "success")
    } catch (error) {
      console.error("Error al eliminar tarea:", error)
      showNotification("Error al eliminar la tarea", "error")
    }
  }

  const handleStartEdit = (task: Task) => {
    setEditingTask(task._id)
    setEditFormData({
      nombre: task.nombre,
      descripcion: task.descripcion,
    })
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const tareaEditada = await updateTask(id, editFormData)
      setTasks((prev) => prev.map((task) => (task._id === id ? tareaEditada : task)))
      setEditingTask(null)
      showNotification("¡Tarea actualizada con éxito!", "success")
    } catch (error) {
      console.error("Error al editar tarea:", error)
      showNotification("Error al actualizar la tarea", "error")
    }
  }

  const handleToggleStatus = async (task: Task) => {
    try {
      const nuevoEstado = task.estado === "pendiente" ? "completada" : "pendiente"
      const tareaActualizada = await updateTask(task._id, { estado: nuevoEstado })
      setTasks((prev) => prev.map((t) => (t._id === task._id ? tareaActualizada : t)))

      const mensaje = nuevoEstado === "completada" ? "¡Tarea completada! 🎉" : "Tarea marcada como pendiente"
      showNotification(mensaje, "success")
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      showNotification("Error al cambiar el estado", "error")
    }
  }

  useEffect(() => {
    cargarTareas()
  }, [])

  const handleCrearTarea = async () => {
    if (!nuevoNombre) {
      showNotification("El nombre de la tarea es obligatorio", "error")
      return
    }

    try {
      const nuevaTarea = {
        nombre: nuevoNombre,
        descripcion: nuevoDescripcion,
        fecha: new Date().toISOString(),
        estado: "pendiente" as "pendiente" | "completada",
      }

      const tareaCreada = await createTask(nuevaTarea)
      setTasks((prev) => [...prev, tareaCreada])
      setNuevoNombre("")
      setNuevoDescripcion("")
      showNotification("¡Tarea creada con éxito!", "success")
    } catch (error) {
      console.error("Error al crear tarea:", error)
      showNotification("Error al crear la tarea", "error")
    }
  }

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.getElementById("notification")
    if (notification) {
      notification.textContent = message
      notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-500 translate-y-0 opacity-100 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`

      setTimeout(() => {
        notification.className =
          "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-500 translate-y-20 opacity-0"
      }, 3000)
    }
  }

  const tareasFiltradas = tasks
    .filter((task) => task.estado === filtroEstado)
    .filter(
      (task) =>
        task.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        task.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
    )

  return (
    <div className="space-y-8">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-purple-800">
              {filtroEstado === "pendiente" ? "📝 Tareas Pendientes" : "✅ Tareas Completadas"}
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {tareasFiltradas.length}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-purple-200 rounded-full w-full md:w-64 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstado("pendiente")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filtroEstado === "pendiente"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            📝 Pendientes
          </button>
          <button
            onClick={() => setFiltroEstado("completada")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filtroEstado === "completada"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            ✅ Completadas
          </button>
        </div>
      </div>

      {/* Formulario para crear tarea */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 transition-all duration-300">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="animate-pulse">✨</span> Nueva Tarea
        </h2>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="¿Qué necesitas hacer?"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm shadow-inner"
            />
          </div>

          <div>
            <textarea
              placeholder="Describe los detalles de tu tarea..."
              value={nuevoDescripcion}
              onChange={(e) => setNuevoDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-sm shadow-inner resize-none"
            ></textarea>
          </div>

          <button
            onClick={handleCrearTarea}
            className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Tarea
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-6xl mb-4">{filtroEstado === "pendiente" ? "🎯" : "🎉"}</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {filtroEstado === "pendiente" ? "¡No hay tareas pendientes!" : "¡No hay tareas completadas!"}
            </h3>
            <p className="text-gray-500">
              {filtroEstado === "pendiente"
                ? "Crea una nueva tarea para comenzar"
                : "Completa algunas tareas para verlas aquí"}
            </p>
          </div>
        ) : (
          tareasFiltradas.map((task) => (
            <div
              key={task._id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border-l-4 ${
                task.estado === "pendiente" ? "border-purple-500" : "border-green-500"
              }`}
            >
              {editingTask === task._id ? (
                // Modo edición
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editFormData.nombre}
                    onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <textarea
                    value={editFormData.descripcion}
                    onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  ></textarea>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="flex-1 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo visualización
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 break-words pr-4">{task.nombre}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(task.fecha).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 break-words">{task.descripcion}</p>

                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.estado === "pendiente" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.estado === "pendiente" ? "Pendiente" : "Completada"}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`p-2 rounded-full ${
                          task.estado === "pendiente"
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                        } transition-colors`}
                        title={task.estado === "pendiente" ? "Marcar como completada" : "Marcar como pendiente"}
                      >
                        {task.estado === "pendiente" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Editar tarea"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("¿Estás seguro de eliminar esta tarea?")) {
                            handleEliminar(task._id)
                          }
                        }}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Eliminar tarea"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Notificación */}
      <div
        id="notification"
        className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-500 translate-y-20 opacity-0"
      ></div>
    </div>
  )
}

export default TaskListPage
