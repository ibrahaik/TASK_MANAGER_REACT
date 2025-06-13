import TaskListPage from "./pages/TaskListPage"
import "./index.css"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-800 font-sans">
      <header className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 shadow-lg py-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
          <div className="absolute top-10 right-10 w-16 h-16 bg-white rounded-full mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white rounded-full translate-y-1/2 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white drop-shadow-md tracking-wide flex items-center justify-center gap-3">
            <span className="animate-bounce">✨</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">Spark Note</span>
            <span className="animate-pulse">🚀</span>
          </h1>
          <p className="text-center text-purple-100 mt-2 font-medium">Organiza tus ideas brillantes</p>
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <TaskListPage />
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-purple-500">
        <p>Spark Note &copy; {new Date().getFullYear()} - Haz brillar tus tareas</p>
      </footer>
    </div>
  )
}

export default App
