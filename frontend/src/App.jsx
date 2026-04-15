import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoutes } from './components/routing/ProtectedRoutes';
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login';
import { EmpDashboard } from './pages/employee/Dashboard';
import { EmpHistory } from './pages/employee/History';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminEmployees } from './pages/admin/EmployeeList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Employee Routes */}
          <Route element={<ProtectedRoutes allowedRoles={['employee']} />}>
            <Route element={<Layout />}>
              <Route path="/employee/dashboard" element={<EmpDashboard />} />
              <Route path="/employee/history" element={<EmpHistory />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              {/* <Route path="/admin/attendances" element={<AdminAttendances />} /> */}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
