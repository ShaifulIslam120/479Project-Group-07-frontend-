import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import Welcome from "../Pages/Welcome";
import SignUp from "../Authentication/SignUp";
import SignIn from "../Authentication/SignIn";
import Home from "../Pages/Home";
import PrivateRoute from "./PrivateRoute";

// Dashboards
import FacultyDashboard from "../Pages/FacultyDashboard";
import StudentDashboard from "../Pages/StudentDashboard";
import AdminDashboard from "../Pages/AdminDashboard";

// Faculty Pages
import CreateCourse from "../Pages/Faculty/CreateCourse";
import CourseDetails from "../Pages/Course/CourseDetails";
import ManageStudents from "../Pages/ManageStudents";

// Student Pages
import CourseView from "../Pages/CourseView";
import EnrolledCourse from "../Pages/EnrolledCourse";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/home", element: <Home /> },

      // ------------------ Student Routes ------------------
      {
        path: "/student/dashboard",
        element: (
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        )
      },
      {
        path: "/student/enrolled-courses",
        element: (
          <PrivateRoute allowedRoles={['student']}>
            <EnrolledCourse />
          </PrivateRoute>
        )
      },
      {
        path: "/course/:courseId",
        element: (
          <PrivateRoute allowedRoles={['student']}>
            <CourseView />
          </PrivateRoute>
        )
      },

      // ------------------ Faculty Routes ------------------
      {
        path: "/faculty/dashboard",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </PrivateRoute>
        )
      },
      {
        path: "/create-course",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <CreateCourse />
          </PrivateRoute>
        )
      },
      {
        path: "/manage-students",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <ManageStudents />
          </PrivateRoute>
        )
      },
      {
        path: "/faculty/courses/:courseId",
        element: (
          <PrivateRoute allowedRoles={['faculty']}>
            <CourseDetails />
          </PrivateRoute>
        )
      },

      // ------------------ Admin Routes ------------------
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        )
      }
    ]
  }
]);
