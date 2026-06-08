import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1c1917',
          color: '#fafaf9',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          borderRadius: '0px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#f59e0b', secondary: '#1c1917' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  </React.StrictMode>,
)