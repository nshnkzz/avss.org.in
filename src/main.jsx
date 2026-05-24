import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { A11yProvider } from './context/A11yContext'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/a11y.css'
import './styles/utils.css'

// Restore lang body class on first load
const savedLang = localStorage.getItem('avss-lang') || 'en'
if (savedLang === 'hi') document.body.classList.add('lang-hi')
document.documentElement.lang = savedLang

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <A11yProvider>
          <App />
        </A11yProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
)
