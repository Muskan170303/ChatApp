import React, { useContext } from 'react'
import Back from '../images/back2.png'
import Me from '../images/me_emoji.webp'
import Pen from '../images/pen.png'
import { AuthContext } from '../Context/AuthContext';

function Profile() {
    const {currUser,setproSelected}=useContext(AuthContext);
    function handleclick(){
        setproSelected(false);
    }
  return (
    <div className='profile'>
        <div className='header'>
            <img className='back' onClick={handleclick} src={Back} alt="" />
            <h3>Profile</h3>
        </div>
        <img src={currUser.photoURL} alt="" className='pic' />
        <div className='display'>
            <h3>Your Name</h3>
            <div>
                <input type="text" id="dname" placeholder={currUser.displayName}/>
                <label htmlFor="dname"><img src={Pen} alt="" /></label>
            </div>
        </div>
        <p className='note'>This is not your user name. This is just the display name.</p>
        <div className='about'>
            <h3>About</h3>
            <div>
                <input type="text" id="desc" placeholder="Desciption about you"/>
                <label htmlFor="desc"><img src={Pen} alt="" /></label>
            </div>
        </div>
    </div>
  )
}

export default Profile