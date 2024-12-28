import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Lobby from './Pages/Lobby'
import Room from './Pages/Room'

function App() {
  return (
    <>
      <div className='flex justify-center align-middle p-12 text-2xl text-blue-300 font-bold'>Front-end of Vaari Calling</div>
      <Routes>
        <Route path='/' element={<Lobby/>}/>
        <Route path='/room/:roomId' element={<Room/>}/> 
      </Routes>
    </>
  )
}

export default App