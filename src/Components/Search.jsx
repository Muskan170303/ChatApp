import React, { useContext, useState } from 'react'
import {collection, doc,query, where,getDoc, getDocs, setDoc, updateDoc,serverTimestamp} from "firebase/firestore"
import {db} from "../firebase"
import {AuthContext} from "../Context/AuthContext"

function Search() {
  const [username, setUsername]=useState("");
  const [user, setUser]=useState(null);
  const [err, setErr]=useState(false);
  const {currUser}=useContext(AuthContext);

  const handleSearch= async()=>{
    const q= query(collection(db,"users"),where("displayName","==",username));
    try{
      const querySnapshot=await getDocs(q);
      querySnapshot.forEach((doc)=>{
        setUser(doc.data())
      });
      {user!=undefined ? setErr(false):setErr(true)};
    }catch(err){
      setErr(true);
    }
  }
  const handleKey=(e)=>{
    e.code === "Enter" && handleSearch();
  }

  const handleSelect= async()=>{
    const combinedID=currUser.uid>user.uid ? currUser.uid+user.uid : user.uid+currUser.uid;
    try{
      const chatdb= await getDoc(doc(db,"chats",combinedID))
      if(!chatdb.exists()){
        await setDoc(doc(db,"chats",combinedID),{messages:[]});
        await updateDoc(doc(db,"userChats",currUser.uid),{
          [combinedID+".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL
          },
          [combinedID+".date"]:serverTimestamp(),
          [combinedID+".unread"]:0
        });
        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedID+".userInfo"]:{
            uid:currUser.uid,
            displayName:currUser.displayName,
            photoURL:currUser.photoURL
          },
          [combinedID+".date"]:serverTimestamp(),
          [combinedID+".unread"]:0
        });
      }
    }catch(err){
      console.log(err);
    }
    setErr(false);
    setUser(null);
    setUsername("");
  }
  
  return (
    <div className='search'>
      <div className='searchForm'>
        <input type="text" placeholder='Find a User' value={username} onKeyDown={handleKey} 
        onChange={e=>{setErr(false); setUser(null); return setUsername(e.target.value)}} />
      </div>
      {err && !user && <span className="err">User not found!!</span>}
      {user && <div className='userChat' onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className='userChatInfo'>
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search