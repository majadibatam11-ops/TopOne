import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import logo from './assets/logo.png'

const existingLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
const faviconLink = existingLink ?? document.createElement('link')
faviconLink.rel = 'icon'
faviconLink.type = 'image/png'
faviconLink.href = logo
if (!existingLink) {
  document.head.appendChild(faviconLink)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
