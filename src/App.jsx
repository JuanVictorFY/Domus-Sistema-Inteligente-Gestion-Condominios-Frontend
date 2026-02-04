import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  // Controla el scroll general y los enlaces con hash (#)
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Usamos setTimeout corto para dar tiempo a que React renderice si venimos desde Login
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <div className="app-wrapper bg-dark overflow-x-hidden">
      {!isDashboard && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isDashboard && <Footer />}

      {/* Botón Flotante WhatsApp */}
      {!isDashboard && (
        <div 
          className="position-fixed bottom-0 end-0 p-4" 
          style={{ zIndex: 2000 }}
          data-aos="fade-left"
          data-aos-delay="1000"
        >
          <a 
            href="https://wa.me/51928799314?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20Domus" 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-lg border-2 border-white btn-whatsapp-custom"
            style={{ width: '65px', height: '65px' }}
          >
            <i className="bi bi-whatsapp fs-2"></i>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;