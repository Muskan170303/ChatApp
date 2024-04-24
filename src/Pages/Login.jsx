import React,{useState} from 'react'
import {useNavigate, Link} from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {

  const navigate=useNavigate();
  const [err,setErr] = useState(false);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
      setErr(false)
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
            <span className='title'>Login</span>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='Email' />
                <input type="password" placeholder='Password' />
                <button>Login</button>
            </form>
            {err && <span className='err'>Something went wrong!!</span>}
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}

export default Login