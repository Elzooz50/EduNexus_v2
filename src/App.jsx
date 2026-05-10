// src/App.jsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ROLES } from './services/authStorage.js';
import Settings from './pages/Settings/Settings.jsx';
// Public Pages
import Home from './pages/Home/Home.jsx';
import Get_Started from './pages/Get_Started/Get_Started.jsx';
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/Sign_Up/Sign_Up.jsx';
import Forget_Password from './pages/Forget_Password/Forget_Password.jsx';
import Verification_Code from './pages/Verification_Code/Verify_Code.jsx';
import New_Password from './pages/New_Password/New_Password.jsx';
import Features from './pages/Features_Page/Features.jsx';
import How_It_Works from './pages/How_It_Works/How_It_Works.jsx';
import About_Us from './pages/About_Us/About_Us.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

// Super Admin Pages
import SuperAdminDashboard from './pages/Super_Admin/Super_Admin_Dashboard.jsx';
import Institutionas from './pages/Super_Admin/Institutionas.jsx';
import UserAccess from './pages/Super_Admin/User_Access.jsx';

// Institutional Admin Pages
import InstAdminDashboard from './pages/Institutional_Admin/Inst_Admin_Dashboard.jsx';
import InstStudents from './pages/Institutional_Admin/Inst_Students.jsx';
import InstInstructors from './pages/Institutional_Admin/Inst_Instructors.jsx';
import InstCourses from './pages/Institutional_Admin/Inst_Courses.jsx';

// Instructor Pages
import Instructor_Home from './pages/Instructor_Home/Instructor_Home.jsx';

// Student Pages
import Student_Home from './pages/Student_Home/Student_Home.jsx';

// Shared Protected Pages

import ChangePassword from './pages/Change_Password/Change_Password.jsx';
import Logout from './pages/Logout/Logout.jsx';

const router = createBrowserRouter([
  // ─────────── PUBLIC ROUTES ───────────
  { path: '/', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/get-started', element: <Get_Started /> },
  { path: '/features', element: <Features /> },
  { path: '/how-it-works', element: <How_It_Works /> },
  { path: '/about-us', element: <About_Us /> },
  { path: '/login', element: <Login /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/register', element: <SignUp /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/forget-password', element: <Forget_Password /> },
  { path: '/verification-code', element: <Verification_Code /> },
  { path: '/new-password', element: <New_Password /> },
  {
  path: '/settings',
  element: (
    <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
      <Settings />
    </ProtectedRoute>
  ),
  },

  // ─────────── SUPER ADMIN (roleId: 1) ───────────
  {
    path: '/Super_Admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Super_Admin/Institutionas',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
        <Institutionas />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Super_Admin/User_Access',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
        <UserAccess />
      </ProtectedRoute>
    ),
  },

  // ─────────── INSTITUTIONAL ADMIN (roleId: 2) ───────────
  {
    path: '/Inst_Admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.INST_ADMIN]}>
        <InstAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Inst_Admin/Students',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.INST_ADMIN]}>
        <InstStudents />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Inst_Admin/Instructors',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.INST_ADMIN]}>
        <InstInstructors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Inst_Admin/Courses',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.INST_ADMIN]}>
        <InstCourses />
      </ProtectedRoute>
    ),
  },

  // ─────────── INSTRUCTOR (roleId: 3) ───────────
  {
    path: '/Instructor_Home',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
        <Instructor_Home />
      </ProtectedRoute>
    ),
  },

  // ─────────── STUDENT (roleId: 4) ───────────
  {
    path: '/Student_Home',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
        <Student_Home />
      </ProtectedRoute>
    ),
  },

  // ─────────── SHARED PROTECTED (any role) ───────────
  {

  },
  {
    path: '/change-password',
    element: (
      <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: '/logout',
    element: (
      <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
        <Logout />
      </ProtectedRoute>
    ),
  },

  // ─────────── 404 ───────────
  { path: '*', element: <NotFound /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;