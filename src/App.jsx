import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-2xl font-bold mb-4 text-cyan-400'>Asistente Virtual Inteligente</h1>
      </div>
    </>
  )
}

export default App
