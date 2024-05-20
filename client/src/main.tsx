import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './resources/pages/App.tsx'
import Home from './resources/pages/Home.tsx'

import './resources/css/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <Home />
  </React.StrictMode>,
)