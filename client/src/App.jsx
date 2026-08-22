import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
// Auth flow (Login/Signup) commented out as requested
// import Login from './pages/Login';
// import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Calling from './pages/Calling';
import Docs from './pages/Docs';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        
        {/* Auth routes disabled
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        */}

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="calling" element={<Calling />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
