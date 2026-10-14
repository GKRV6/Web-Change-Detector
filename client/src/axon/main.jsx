import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './axon.css'
import AxonApp from './AxonApp'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AxonApp />
  </React.StrictMode>
)
