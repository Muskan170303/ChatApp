import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import {auth} from "../firebase"

export const AuthContext=createContext();

export const AuthContextProvider=({children})=>{
    const [currUser,setCurrUser]= useState({})
    const [chatSelected, setChatSelection]= useState(false);
    const [proSelected,setproSelected]=useState(false);
    useEffect(()=>{
        const unSub=onAuthStateChanged(auth,(user)=>{
            setCurrUser(user);
        })
        return()=>{unSub()};
    },[]);

    return(
        <AuthContext.Provider value={{currUser, chatSelected, setChatSelection,proSelected,setproSelected}}>
            {children}
        </AuthContext.Provider>
    )
}