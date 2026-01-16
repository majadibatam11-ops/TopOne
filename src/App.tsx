import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Navigation />
      <main className="flex-grow pt-16">
        <Home />
      </main>
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="font-bold text-lg mb-4 text-primary">Top One Construction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner for quality sands, aggregates, and construction materials.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#why" className="hover:text-primary transition-colors">Why Us</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+27 13 170 5511</li>
                <li>admin@toponemining.co.za</li>
                <li>N11 Keeromaspruit</li>
                <li>Middleburg, Mpumalanga 1050</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4 text-white">Hours</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Mon-Fri: 7:00 AM - 4:00 PM</li>
                <li>Sat: 7:00 AM - 1:00 PM</li>
                <li>Sun: Closed</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
            <p>&copy; {new Date().getFullYear()} Top One Construction and General Service CC. All rights reserved.</p>
            <a href="/login" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Admin Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
