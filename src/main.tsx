import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MinhasPropostas from './MinhasPropostas.tsx'

// ----------------- Rotas de Admin
import AdminLayout from './admin/AdminLayout.tsx';
import AdminLogin from './admin/AdminLogin.tsx';            
import AdminDashboard from './admin/AdminDashboard.tsx';    
import AdminCarros from './admin/AdminTreinos.tsx';          
import AdminNovoCarro from './admin/AdminNovoTreino.tsx';          
import AdminPropostas from './admin/AdminPropostas.tsx';          
import AdminCadAdmin from './admin/AdminCadAdmin.tsx';   

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const rotas = createBrowserRouter([

   {
    path: "/admin/login",
    element: <AdminLogin />,   // rota do form de login sem o Layout da Área Administrativa
  },
  {
    path: "/admin",
    element: <AdminLayout />,  // layout principal do admin com menus e outlet
    children: [
      { index: true, element: <AdminDashboard /> },          // rota /admin
      { path: "carros", element: <AdminCarros /> },          // rota /admin/carros
      { path: "carros/novo", element: <AdminNovoCarro /> },  // ...
      { path: "propostas", element: <AdminPropostas /> },  // ...
      { path: "cadAdmin", element: <AdminCadAdmin /> },  // ...
    ],
  },
  
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:treinoId', element: <Detalhes /> },
      { path: 'minhasPropostas', element: <MinhasPropostas /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)