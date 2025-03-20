import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import CustomerLayout from '../components/CustomerLayout';
import Home from '../pages/Home/Home';
import Vehicles from '../pages/Vehicles/Vehicles';
import VehicleForm from '../pages/Vehicles/VehicleForm';
import Transactions from '../pages/Transactions/Transactions';
import Notifications from '../pages/Notifications/Notifications';
import LiveChat from '../pages/LiveChat/LiveChat';
import AdminRoute from './AdminRoute';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageCustomers from '../pages/Admin/ManageCustomers';
import ManageVehicles from '../pages/Admin/ManageVehicles';
import AccessPoints from '../pages/Admin/AccessPoints';
import AdminNotifications from '../pages/Admin/AdminNotifications';
import AgentManagement from '../pages/Admin/AgentManagement';
import PaymentConfig from '../pages/Admin/PaymentConfig';
import ReportingModule from '../pages/Admin/ReportingModule';
import AdminTransactions from '../pages/Admin/AdminTransactions';
import Journeys from '../pages/MakeTrip/Journeys';
import Breakdowns from '../pages/Breakdowns/Breakdowns';
import Landing from '../pages/Landing/Landing';
import UpdateProfile from '../pages/UpdateProfile/UpdateProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout width="44rem">
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: '/home',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/vehicles',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Vehicles />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/vehicles/create',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <VehicleForm />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/vehicles/update/:id',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <VehicleForm />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/transactions',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Transactions />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/notifications',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Notifications />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/trips',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Journeys />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/report-breakdown',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <Breakdowns />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/chat',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <LiveChat />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/update-profile',
    element: (
      <PrivateRoute
        element={
          <CustomerLayout>
            <UpdateProfile />
          </CustomerLayout>
        }
      />
    ),
  },
  {
    path: '/admin-dashboard',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-vehicles',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <ManageVehicles />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-customers',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <ManageCustomers />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-access',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <AccessPoints />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-notifications',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <AdminNotifications />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-agents',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <AgentManagement />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-payment-config',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <PaymentConfig />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-reporting',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <ReportingModule />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: '/admin-transactions',
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <AdminTransactions />
          </AdminLayout>
        }
      />
    ),
  },
]);
