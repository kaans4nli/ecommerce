import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

function ResponsiveToaster(){
  const [pos, setPos] = React.useState(typeof window !== 'undefined' && window.innerWidth < 640 ? 'top-center' : 'top-right')
  React.useEffect(()=>{
    const onResize = () => setPos(window.innerWidth < 640 ? 'top-center' : 'top-right')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <Toaster
      position={pos}
      toastOptions={{
        duration: 2500,
        style: {
          maxWidth: '90%',
          margin: '12px',
          background: '#1c1917',
          color: '#fafaf9',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          borderRadius: '0px',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: '#f59e0b', secondary: '#1c1917' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        // ensure toasts don't stack too much on mobile
        containerStyle: { padding: 0 }
      }}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ResponsiveToaster />
  </React.StrictMode>,
)