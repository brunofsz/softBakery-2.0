import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className="appShell">
      <Sidebar />
      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  )
}

export default App
