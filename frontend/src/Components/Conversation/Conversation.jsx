import React, { useEffect, useState } from 'react'
import './Conversation.css'
import AxiosWithAuth from "../../Axios/Axios";

function Conversation({conversation , currentUser}) {
  const [user , setUser] = useState(null);
  const axiosJWT = AxiosWithAuth();
  

  useEffect(()=>{
     const friendId = conversation.members.find(m=> m !== currentUser._id)
     const getUser = async ()=>{
        await axiosJWT.get(`users/${friendId}`).then((res) =>{
          setUser(res.data)
        }).catch((error)=>{
          console.log(error)
        })

     }
     getUser()
  },[currentUser , conversation])
  return (
    <div className='conversation'>
        {user?.profilePicture ? <img src={user.url} alt="" className="conversationImg" /> : <img src="/assets/NoPhoto.jpg" alt="" className="conversationImg" /> }
        {/* <img src={user.profilePicture ? user.url : "/assets/NoPhoto.jpg"} alt="" className="conversationImg"/> */}
        <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversation