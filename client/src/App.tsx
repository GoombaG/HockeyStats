import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import {Link} from 'react-router-dom'

function App() {
  return (
    <>
      <h1>Hockey Stats</h1>
      <div><Link to="/Standings"> Standings </Link></div>
      <div><Link to="/Streaks"> Streaks </Link></div>
    </>
  )
}

export default App
