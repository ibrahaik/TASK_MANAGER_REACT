import TaskListPage from "./pages/TaskListPage"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-background">
          <div className="header-shape shape-1"></div>
          <div className="header-shape shape-2"></div>
          <div className="header-shape shape-3"></div>
        </div>
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-text">Spark Note</span>
          </h1>
          <p className="app-subtitle">Gestión de tareas </p>
        </div>
      </header>

      <main className="app-main">
        <TaskListPage />
      </main>

      <footer className="app-footer">
        <p>Spark Note &copy; {new Date().getFullYear()} - Productividad sin complicaciones</p>
      </footer>
    </div>
  )
}

export default App
