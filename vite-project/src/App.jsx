import { useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header/Header.jsx"
import Sidebar from "./components/Sidebar/Sidebar.jsx"
import Footer from "./components/Footer/Footer.jsx"
import styles from "./App.module.css"
import IntegratedDashboard from "../../integrated/src/App"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const isDashboardRoute = location.pathname === "/reports-dashboard"

  return (
    <div className={styles.app}>
      {!isDashboardRoute && <Header onMenuClick={handleSidebarToggle} />}

      <main className={styles.main}>
        <Routes>
          <Route path="/reports-dashboard" element={<IntegratedDashboard />} />
          {/* Add more routes here if needed */}
        </Routes>
      </main>

      {!isDashboardRoute && <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />}
      {!isDashboardRoute && <Footer />}
    </div>
  )
}

export default App