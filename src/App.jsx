import { useState } from 'react'
import './App.css'
import Button from './submodule/ui/Button/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button />
    </>
  )
}

export default App
