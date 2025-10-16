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
import AdminTreinos from './admin/AdminTreinos.tsx';          
import AdminNovoTreino from './admin/AdminNovoTreino.tsx';          
import AdminPropostas from './admin/AdminPropostas.tsx';          
import AdminCadAdmin from './admin/AdminCadAdmin.tsx';   
import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminNovoAdmin from './admin/AdminNovoAdmin.tsx'

const rotas = createBrowserRouter([

  // ----------------- Rota de login do admin (sem layout)
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // ----------------- Rotas do admin (com layout)
  {
    path: "/admin",
    element: <AdminLayout />,  // layout principal do admin com menus e outlet
    children: [
      { index: true, element: <AdminDashboard /> },          // rota /admin
      { path: "treinos", element: <AdminTreinos /> },        // lista de treinos
      { path: "treinos/novo", element: <AdminNovoTreino /> },// criar novo treino
      { path: "propostas", element: <AdminPropostas /> },    // lista de propostas
      { path: "cadAdmin", element: <AdminCadAdmin /> },      // lista/cadastro de admins
      { path: "novoAdmin", element: <AdminNovoAdmin /> },     // criar novo admin (pode ser o mesmo AdminCadAdmin com um botão "Novo")
    ],
  },

  // ----------------- Rotas do site público
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
