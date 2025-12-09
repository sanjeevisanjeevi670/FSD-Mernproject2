import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
import UserAppointments from "./components/user/UserAppointments";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/userhome"
              element={
                <ProtectedRoute>
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminhome"
              element={
                <ProtectedRoute>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userhome/userappointments/:doctorId"
              element={
                <ProtectedRoute>
                  <UserAppointments />
                </ProtectedRoute>
              }
            />

            {/* Fallback route for unmatched URLs */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3">
            © 2023 Copyright: MediCareBook
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
