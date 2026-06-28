import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/Home';
import { ServicesPage } from '@/pages/Services';
import { AttractionsPage } from '@/pages/Attractions';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { DashboardPage } from '@/pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'servicos', element: <ServicesPage /> },
      { path: 'atracoes', element: <AttractionsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
