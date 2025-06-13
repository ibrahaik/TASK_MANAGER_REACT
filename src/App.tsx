import TaskListPage from './pages/TaskListPage';
import './index.css';
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
     <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg py-6">
  <h1 className="text-center text-4xl font-extrabold text-white drop-shadow-md tracking-wide">
    🚀 Task Manager Pro
  </h1>
</header>


      <main className="p-4 max-w-3xl mx-auto">
        <TaskListPage />
      </main>
    </div>
  );
}


export default App
