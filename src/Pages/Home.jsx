import React, { useContext, useState } from 'react'
import Sidebar from "../Components/Sidebar"
import Chat from "../Components/Chat"
import Welcome from "../Components/Welcome"
import { AuthContext } from '../Context/AuthContext';
import Profile from '../Components/Profile';

function Home() {
  const {chatSelected,proSelected}= useContext(AuthContext);
  return (
    <div className='home'>
        <div className='container'>
            {proSelected? <Profile />: <Sidebar />}
            {chatSelected? <Chat />: <Welcome />}
        </div>
    </div>
  )
}

export default Home