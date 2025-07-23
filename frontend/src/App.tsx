import ClassForm from "@/components/ClassForm";
import ClassList from "@/components/ClassList";
import Login from "@/components/Login";
import ParentForm from "@/components/ParentForm";
import ParentList from "@/components/ParentList";
import ProtectedRoute from "@/components/ProtectedRoute";
import Signup from "@/components/Signup";
import StudentForm from "@/components/StudentForm";
import StudentList from "@/components/StudentList";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/authHook";
import Home from "@/pages/Home";
import React from "react";
import {
  NavLink,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-primary text-white py-4 shadow-md rounded-lg mx-4 mt-4">
      <div className="container mx-auto flex space-x-2 overflow-x-auto">
        {user && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Trang Chủ
            </NavLink>

            <NavLink
              to="/parents/new"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Tạo Phụ Huynh
            </NavLink>

            <NavLink
              to="/students/new"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Tạo Học Sinh
            </NavLink>

            <NavLink
              to="/parents"
              end // 👈 chỉ active khi đúng "/parents"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Danh Sách Phụ Huynh
            </NavLink>

            <NavLink
              to="/students"
              end // 👈 chỉ active khi đúng "/students"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Danh Sách Học Sinh
            </NavLink>

            <NavLink
              to="/classes"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`
              }
            >
              Danh Sách Lớp Học
            </NavLink>

            <button
              onClick={logout}
              className="ml-auto px-3 py-2 rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Đăng Xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents/new"
            element={
              <ProtectedRoute>
                <ParentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents"
            element={
              <ProtectedRoute>
                <ParentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <ClassList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/new"
            element={
              <ProtectedRoute>
                <ClassForm />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
