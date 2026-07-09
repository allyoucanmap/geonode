import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import { Gallery } from './Gallery.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
)
