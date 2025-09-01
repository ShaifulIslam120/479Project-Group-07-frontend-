import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Welcome from "../Pages/Welcome";
import SignUp from "../Authentication/SignUp";
import SignIn from "../Authentication/SignIn";
import Home from "../Pages/Home";
import PrivateRoute from "./PrivateRoute";
import FacultyDashboard from "../Pages/FacultyDashboard";
import StudentDashboard from "../Pages/StudentDashboard";
import AdminDashboard from "../Pages/AdminDashboard";
import CreateCourse from "../Pages/Faculty/CreateCourse";
import CourseDetails from "../Pages/Course/CourseDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Welcome />
      },
      {
        path: "/signup",
        element: <SignUp />
      },
      {
        path: "/signin",
        element: <SignIn />
      },
      {
        path: "/home",
        element: <Home />
      },
      // Student Dashboard Route
      {
        path: "/student/dashboard",
        element: (
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        )
      },
      // Faculty Dashboard Route
      {
        path: "/faculty/dashboard",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </PrivateRoute>
        )
      },
      // Admin Dashboard Route
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        )
      },
      // Create Course Route for Faculty
      {
        path: "/create-course",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <CreateCourse />
          </PrivateRoute>
        )
      },
      {
  path: "/courses/:courseId",
  element: (
    <PrivateRoute allowedRoles={['faculty']}>
      <CourseDetails />
    </PrivateRoute>
  )
}
    ]
  }
]);
