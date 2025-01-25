import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import {Link} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)
  const [player, setPlayer] = useState(
    {
      firstName: {
        default: '',
      },
      lastName: {
        default: '',
      },
    }
  )

  return (
    <>
      <h1>Hockey Stats</h1>
      <Link to="/Standings"> Standings </Link>
    </>
  )
}

export default App
