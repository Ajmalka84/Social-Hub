
import React, { useContext } from 'react'
import {BrowserRouter, Routes, Route , } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Profile from './Pages/Profile/Profile'
import Login from './Pages/Login/Login'
import { AuthContext } from './context/AuthContext'
import Register from './Pages/Register/Register'
import Messenger from './Pages/Messenger/Messenger'
import EditProfile from './Components/EditProfile/EditProfile'

function App() {
  const {user} = useContext(AuthContext)
  return (  
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={ <Home/> } />
        <Route exact path='/login' element={ <Login />} />
        <Route exact path='/register' element={<Register/>} />
        <Route path='/profile/:_id' element={<Profile />} />
        <Route path='/profile/edit' element={<EditProfile />} />
        <Route path='/messenger' element={<Messenger />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App