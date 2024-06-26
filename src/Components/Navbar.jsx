import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import {AuthContext} from "../Context/AuthContext"
import { ChatContext, INITIAL_STATE } from '../Context/ChatContext';

function Navbar() {
  const {currUser, setChatSelection,setproSelected}=useContext(AuthContext);
  const {dispatch}=useContext(ChatContext)

  function handleclick(){
    setproSelected(true);
  }
  return (
    <div className='navbar'>
      <span className='logo'>Chat App</span>
      <div className='user' onClick={handleclick}>
        <img src={currUser.photoURL} alt="" />
        <span>{currUser.displayName}</span>
        <button onClick={()=>signOut(auth) && setChatSelection(false) && dispatch({type:"CHANGE_USER", payload:INITIAL_STATE})}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar