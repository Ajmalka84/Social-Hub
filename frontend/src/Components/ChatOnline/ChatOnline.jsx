import React, { useContext, useEffect, useState } from 'react'
import './ChatOnline.css'
import AxiosWithAuth from "../../Axios/Axios";
import { AuthContext } from '../../context/AuthContext';
import jwtDecode from 'jwt-decode';

function ChatOnline({onlineUsers , currentId , setCurrentChat}) {
  console.log(onlineUsers , "its here..........")
  const axiosJwt = AxiosWithAuth()
  const {Auth} = useContext(AuthContext)
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [friends ,setFriends] = useState([])
  const [onlineFriends ,setOnlineFriends] = useState([])
  useEffect(()=>{
    const getFriends = async ()=>{
      const res = await axiosJwt.get(`users/friends/${decodedAuth._id}`)
      console.log(res)
      setFriends(res.data)  
    }
     getFriends()
  },[currentId])
  useEffect(()=>{
    setOnlineFriends(friends?.filter((f) => onlineUsers?.includes( f._id)))
  },[friends ,onlineUsers])

  console.log(friends, "its friends")
  console.log(onlineFriends, "its onlineFriends")
  return (
    <div className='chatOnline'>
      {onlineFriends?.map(o => (
        <div className="chatOnlineFriend">
             <div className="chatOnlineImgContainer">
                
                {o?.profilePicture ? <img src={o.url} alt=""  className='chatOnlineImg'/> : <img src="/assets/NoPhoto.jpg" alt=""  className='chatOnlineImg'/> }
                <div className="chatOnlineBadge">
                     
                </div>
             </div>
             <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatOnline