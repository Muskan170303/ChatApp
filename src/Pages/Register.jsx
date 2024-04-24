import React, { useState } from 'react'
import AddAvatar from "../images/addAvatar.png"
import {auth, storage, db} from '../firebase'
import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {ref,uploadBytesResumable,getDownloadURL,uploadBytes,} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';

function Register() {

  const navigate=useNavigate();
  const [err,setErr] = useState(false);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      const appUser = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then(async (downloadURL) => {
          console.log("Download URL", downloadURL);
          await updateProfile(appUser.user, {
            displayName,
            photoURL: downloadURL,
          });
          await setDoc(doc(db, "users", appUser.user.uid), {
            uid: appUser.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });
          await setDoc(doc(db, "userChats", appUser.user.uid), {});
        });
        setErr(false);
        navigate("/");
      }
    catch(err){
      console.log(err);
      setErr(true);
    }

  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'>Chat App</span>
            <span className='title'>Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Display Name' />
                <input type="email" placeholder='Email' />
                <input type="password" placeholder='Password' />
                <input style={{display:'none'}} type="file" id="file" />
                <label htmlFor="file">
                    <img src={AddAvatar} alt="" />
                    <span>Add an Avatar</span>
                </label>
                <button type='submit'>Sign up</button>
            </form>
            {err && <span className='err'>Something went wrong!!</span>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>

    </div>
  )
}

export default Register