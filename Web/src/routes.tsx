import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

//Paginas
import Dashboard from "./routes/dashboard/page";
import Inventory from "./routes/inventory/page";
import Pages from "./routes/pages/page";
import Roles from "./routes/roles/page";
import Sales from "./routes/sales/page";
import Schedule from "./routes/schedule/page";
import Layout from "./components/layout/Layout";
import ProtectedModule from "./components/global/ProtectedModule";
import Stores from "./routes/stores/page";
import Staff from "./routes/staff/page";
import Clients from "./routes/clients/page";
import Home from "./routes/Home";
import DocumentRequests from "./routes/requests/page";
import ProfileInformation from "./routes/profileInformation/page";

function RequireCompletedProfile() {
  const isProfileComplete = useAuthStore((state) => state.user?.isProfileComplete)

  if (!isProfileComplete) {
    return <Navigate to="/profileInformation" replace />
  }

  return <Outlet />
}

function ProfileInformationRoute() {
  // const isProfileComplete = useAuthStore((state) => state.user?.isProfileComplete)

  // if (isProfileComplete) {
  //   return <Navigate to="/" replace />
  // }

  return <ProfileInformation />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "profileInformation",
        element: <ProfileInformationRoute />
      },
      {
        element: <RequireCompletedProfile />,
        children: [
          {
            index: true,
            element: <ProtectedModule page="Dashboard" type="read" method="block"  >
              <Dashboard />
            </ProtectedModule>,
          },
          {
            path: "roles",
            element: <ProtectedModule page="Roles" type="read" method="block" >
              <Roles />
            </ProtectedModule>,
          },
          {
            path: "pages",
            element: <ProtectedModule page="Pages" type="read" method="block" >
              <Pages />
            </ProtectedModule>,
          },
          {
            path: "stores",
            element: <ProtectedModule page="Stores" type="read" method="block" >
              <Stores />
            </ProtectedModule>,
          },
          {
            path: "staff",
            element: <ProtectedModule page="Staff" type="read" method="block" >
              <Staff />
            </ProtectedModule>,
          },
          {
            path: "clients",
            element: <ProtectedModule page="Staff" type="read" method="block" >
              <Clients />
            </ProtectedModule>,
          },
          {
            path: "inventory",
            element: <ProtectedModule page="Inventory" type="read" method="block" >
              <Inventory />
            </ProtectedModule>,
          },
          {
            path: "sales",
            element: <ProtectedModule page="Sales" type="read" method="block" >
              <Sales />
            </ProtectedModule>,
          },
          {
            path: "schedule",
            element: <ProtectedModule page="Schedule" type="read" method="block" >
              <Schedule />
            </ProtectedModule>,
          },
          {
            path: "documents",
            element: <ProtectedModule page="Documents" type="read" method="block" >
              <Home />
            </ProtectedModule>,
          },
          {
            path: "profileInformation",
            element: <ProtectedModule page="Requests" type="read" method="block" >
              <ProfileInformation />
            </ProtectedModule>,
          },
          {
            path: "requests",
            element: <ProtectedModule page="Requests" type="read" method="block" >
              <DocumentRequests />
            </ProtectedModule>,
          }
        ]
      }
    ],
  },
]);



export default function Routes() {
  return <RouterProvider router={router} />;
}