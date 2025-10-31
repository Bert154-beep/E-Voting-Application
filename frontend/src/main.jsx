import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/route.jsx'
import { Toaster } from 'react-hot-toast'
import AuthContextProvider from './Contexts/AuthContext.jsx'
import AdminContextProvider from './Contexts/AdminContext.jsx'
import VotingContextProvider from './Contexts/VotingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <AdminContextProvider>
        <VotingContextProvider>
          <Toaster position="bottom-right" />
          <RouterProvider router={router} />
        </VotingContextProvider>
      </AdminContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
