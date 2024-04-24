import React, { useContext, useState } from 'react'
import Sidebar from "../Components/Sidebar"
import Chat from "../Components/Chat"
import Welcome from "../Components/Welcome"
import { AuthContext } from '../Context/AuthContext';

function Home() {
  const {chatSelected}= useContext(AuthContext);
  return (
    <div className='home'>
        <div className='container'>
            <Sidebar />
            {chatSelected? <Chat />: <Welcome />}
        </div>
    </div>
  )
}

export default Home