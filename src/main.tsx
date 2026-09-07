import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './routes/index.tsx'
import { ConfirmDialogProvider } from './contexts/ConfirmDialogContext.tsx'
import { toastConfig } from './lib/config/toast.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfirmDialogProvider>
      <RouterProvider router={Routes}/>
      <Toaster {...toastConfig.toaster} />
    </ConfirmDialogProvider>
  </StrictMode>
)
