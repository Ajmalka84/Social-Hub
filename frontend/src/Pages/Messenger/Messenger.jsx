import React, { useContext, useEffect, useRef, useState } from "react";
import Topbar from "../../Components/Topbar/Topbar";
import "./Messenger.css";
import Conversation from "../../Components/Conversation/Conversation";
import Message from "../../Components/Message/Message";
import ChatOnline from "../../Components/ChatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
function Messenger() {
  const {user} = useContext(AuthContext);
  const [conversations , setConversations] = useState([])
  const [currentChat , setCurrentChat] = useState(null);
  const [messages , setMessages] = useState([]);
  const [newMessages , setNewMessages] = useState('');
  const axiosJWT = AxiosWithAuth();
  const scrollRef = useRef()

  useEffect(()=>{
     const getConversations = async ()=>{
      try {
        const res = await axiosJWT.get(`conversations/${user._doc._id}`)
        setConversations(res.data)
        
      } catch (error) {
        console.log(error)
      } 
     }
     getConversations() 
  }, [user._doc._id , ])

  useEffect(()=>{
     const getMessages = async ()=>{
      try {
        const res = await axiosJWT.get(`messages/${currentChat._id}`)
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
     }
     getMessages()
  },[currentChat])
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    const message = {
      sender : user._id,
      text : newMessages,
      conversationId : currentChat._id
    }
    try {
      const res = await axiosJWT.post('messages' , message)
      setMessages([...messages , res.data]);
      setNewMessages('');
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior : "smooth"})
  },[messages])
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input type="text" placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) =>
              <div onClick={()=>setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user}/>
              </div>
            )}  
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {
               currentChat ? 
            <>
            <div className="chatBoxTop">
              {messages.map((m)=> (
                <div ref={scrollRef}>
                <Message message={m} own={m.sender === user._id}/>
                </div>              
              ))}
            </div>
            <div className="chatBoxBottom">
                <textarea className="chatMessageInput" placeholder="write something" value={newMessages} onChange={(e)=> setNewMessages(e.target.value)}></textarea>
                <button onClick={handleSubmit} className="chatSubmitButton">Send</button>
            </div>
            </> : <span className="noConversationText">Open a conversation to start a chat</span> }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
             <ChatOnline />
             <ChatOnline />
             <ChatOnline />
             <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
