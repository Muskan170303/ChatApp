import React, { useContext } from 'react'
import {auth, db, storage} from './firebase'
import Register from './Pages/Register'
import Login from './Pages/Login'
import "./style.scss"
import Home from './Pages/Home'
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'
import { AuthContext } from './Context/AuthContext'

const App = () => {
  const {currUser}=useContext(AuthContext);
  const ProtectedRoute=({children})=>{
    if(!currUser){
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>   
  )
}

export default App