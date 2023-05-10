import React, { useContext, useEffect, useState } from 'react'
import './ChatOnline.css'
import AxiosWithAuth from "../../Axios/Axios";
import { AuthContext } from '../../context/AuthContext';
import jwtDecode from 'jwt-decode';

function ChatOnline({onlineUsers , currentId , setCurrentChat ,setConversations}) {
 
  const axiosJwt = AxiosWithAuth()
  const {Auth} = useContext(AuthContext)
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [friends ,setFriends] = useState([])
  const [onlineFriends ,setOnlineFriends] = useState([])
  useEffect(()=>{
    const getFriends = async ()=>{
      const res = await axiosJwt.get(`users/friends/${decodedAuth._id}`)
      setFriends(res.data)  
    }
    getFriends()
  },[currentId])
  
  useEffect(()=>{
    setOnlineFriends(friends?.filter((f) => onlineUsers?.some((u) => u.userId === f._id)))
  },[friends ,onlineUsers])
  
  const handleClick = async (user) => {
     try {
      const res = await axiosJwt.get(`conversations/find/${currentId}/${user._id}`)
      if(res.data == null){
        await axiosJwt.get(`conversations/${decodedAuth._id}`).then(async (result)=>{
          const createNewConversation = await axiosJwt.post('conversations' , {senderId : currentId , recieverId : user._id})
          setCurrentChat(createNewConversation.data)
          setConversations(result.data)
        })
      }else{
        setCurrentChat(res.data)
      }
     } catch (error) {
      console.log(error)
     }
  }
  
  return (
    <div className='chatOnline'>
      {onlineFriends?.map(o => 
        <div className="chatOnlineFriend" onClick={ () => handleClick(o)}>
             <div className="chatOnlineImgContainer">
                {o?.profilePicture ? <img src={o.url} alt=""  className='chatOnlineImg'/> : <img src="/assets/NoPhoto.jpg" alt=""  className='chatOnlineImg'/> }
                <div className="chatOnlineBadge">
                     
                </div>
             </div>
             <span className="chatOnlineName">{o?.username ? o.username : "some problem"}</span>
        </div>
      )}
    </div>
  )
}

export default ChatOnline