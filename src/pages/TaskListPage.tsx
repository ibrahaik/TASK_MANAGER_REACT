"use client"

import { useEffect, useState } from "react"
import { createTask, getTasks, deleteTask, updateTask } from "../services/taskServices"
import type { Task } from "../types/task"
import "./TaskListPage.css"

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

      const mensaje = nuevoEstado === "completada" ? "¡Tarea completada!" : "Tarea marcada como pendiente"
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

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.getElementById("notification")
    if (notification) {
      notification.textContent = message
      notification.className = `notification ${type}`

      setTimeout(() => {
        notification.className = `notification hidden`
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="task-list-container">
      {/* Filtros y búsqueda */}
      <div className="filter-section">
        <div className="filter-header">
          <div className="filter-title">
            <h2 className="section-title">
              {filtroEstado === "pendiente" ? " Tareas Pendientes" : "✅ Tareas Completadas"}
            </h2>
            <span className="task-count">{tareasFiltradas.length}</span>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon"
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

        <div className="filter-buttons">
          <button
            onClick={() => setFiltroEstado("pendiente")}
            className={`filter-button ${filtroEstado === "pendiente" ? "active-pending" : ""}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFiltroEstado("completada")}
            className={`filter-button ${filtroEstado === "completada" ? "active-completed" : ""}`}
          >
            Completadas
          </button>
        </div>
      </div>

      {/* Formulario para crear tarea */}
      <div className="create-task-form">
        <h2 className="form-title">
          <span className="form-icon">+</span> Nueva Tarea
        </h2>

        <div className="form-fields">
          <div className="form-field">
            <input
              type="text"
              placeholder="¿Qué necesitas hacer?"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="task-input"
            />
          </div>

          <div className="form-field">
            <textarea
              placeholder="Describe los detalles de tu tarea..."
              value={nuevoDescripcion}
              onChange={(e) => setNuevoDescripcion(e.target.value)}
              rows={3}
              className="task-textarea"
            ></textarea>
          </div>

          <button onClick={handleCrearTarea} className="create-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="button-icon"
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
      <div className="tasks-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{filtroEstado === "pendiente" ? "📋" : "✅"}</div>
            <h3 className="empty-title">
              {filtroEstado === "pendiente" ? "No hay tareas pendientes" : "No hay tareas completadas"}
            </h3>
            <p className="empty-message">
              {filtroEstado === "pendiente"
                ? "Crea una nueva tarea para comenzar"
                : "Completa algunas tareas para verlas aquí"}
            </p>
          </div>
        ) : (
          tareasFiltradas.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.estado === "pendiente" ? "task-pending" : "task-completed"}`}
            >
              {editingTask === task._id ? (
                // Modo edición
                <div className="edit-form">
                  <input
                    type="text"
                    value={editFormData.nombre}
                    onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                    className="edit-input"
                  />

                  <textarea
                    value={editFormData.descripcion}
                    onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                    rows={3}
                    className="edit-textarea"
                  ></textarea>

                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(task._id)} className="save-button">
                      Guardar
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo visualización
                <div className="task-content">
                  <div className="task-header">
                    <h3 className="task-title">{task.nombre}</h3>
                    <span className="task-date">{formatDate(task.fecha)}</span>
                  </div>

                  <p className="task-description">{task.descripcion}</p>

                  <div className="task-footer">
                    <div className="task-status">
                      <span
                        className={`status-badge ${task.estado === "pendiente" ? "status-pending" : "status-completed"}`}
                      >
                        {task.estado === "pendiente" ? "Pendiente" : "Completada"}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`action-button ${
                          task.estado === "pendiente" ? "toggle-complete" : "toggle-pending"
                        }`}
                        title={task.estado === "pendiente" ? "Marcar como completada" : "Marcar como pendiente"}
                      >
                        {task.estado === "pendiente" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="action-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="action-icon"
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
                        className="action-button edit-button"
                        title="Editar tarea"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="action-icon"
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
                        className="action-button delete-button"
                        title="Eliminar tarea"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="action-icon"
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
      <div id="notification" className="notification hidden"></div>
    </div>
  )
}

export default TaskListPage
