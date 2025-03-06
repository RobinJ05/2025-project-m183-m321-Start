import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // no strict mode. Otherwise, the initialization with keycloak is run twice
  <App />
)
