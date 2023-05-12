import React, { useContext, useEffect, useRef, useState } from "react";
import Topbar from "../../Components/Topbar/Topbar";
import "./Messenger.css";
import Conversation from "../../Components/Conversation/Conversation";
import Message from "../../Components/Message/Message";
import ChatOnline from "../../Components/ChatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
import { Toaster, toast } from "react-hot-toast";
import { io } from "socket.io-client";
function Messenger() {
  const { Auth,DP, setDP, conversations, setConversations, currentChat, setCurrentChat } =
    useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [toChat , setToChat] = useState(null)
  // const [currentChat , setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const socket = useRef();
  const axiosJWT = AxiosWithAuth();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessages({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(()=> {
    const toChatDetails = async ()=>{
      if(currentChat !== null){
        const ToChat = currentChat.members.filter((c)=> c !== decodedAuth._id)[0]
         await axiosJWT.get(`users/${ToChat}`).then((result)=>{
          console.log(result)
          setToChat(result.data)
         }).catch((error)=>{
          console.log(error)
         })
      }
    }
    toChatDetails()
  },[currentChat])
  useEffect(() => {
    arrivalMessages &&
      currentChat?.members.includes(arrivalMessages.sender) &&
      setMessages((prev) => [...prev, arrivalMessages]);
  }, [arrivalMessages, currentChat]);

  useEffect(() => {
    let mainUser;
    const fetchMainUser = async () => {
      const User = await axiosJWT.get(`users/get-main-user/${decodedAuth._id}`);
      mainUser = User.data;
      socket.current.emit("addUser", decodedAuth._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          mainUser.followings.filter((f) =>
            users.some((u) => u.userId === f.userId)
          )
        );
      });
    };
    fetchMainUser();
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosJWT.get(`conversations/${decodedAuth._id}`);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [decodedAuth._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosJWT.get(`messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let string = newMessages;
    let regex = /^\s*([^\s].*?[^\s])\s*$/;
    if (regex.test(string)) {
      const message = {
        sender: decodedAuth._id,
        text: newMessages,
        conversationId: currentChat._id,
      };
      const usersOnline = onlineUsers  
      console.log(onlineUsers)
      let recieverId = currentChat.members.find(
        (member) => member !== decodedAuth._id
      );
      socket.current.emit(
        "sendMessage",
        { senderId: decodedAuth._id },
        { recieverId: recieverId },
        { text: newMessages }
      );
      try {
        const res = await axiosJWT.post("messages", {message : message , onlineUsers : usersOnline});
        setMessages([...messages, res.data]);
        setNewMessages("");
      } catch (error) {
        console.log(error);
      }
    }else{
      toast.error("Comment is empty");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Topbar profilePicture={DP} setProfilePicture={setDP}/>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuInput"
            />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={decodedAuth} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          {  currentChat && 
            <div className="chatTo">
          {toChat?.profilePicture ? <img src={toChat.url} alt="" className="conversationImg" style={{marginLeft : "20px"}}/> : <img src="/assets/NoPhoto.jpg" alt="" className="conversationImg" style={{marginLeft : "20px"}}/> }
          <span className="conversationName">{toChat?.username}</span>
          </div> 
          }
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === decodedAuth._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something"
                    value={newMessages}
                    onChange={(e) => setNewMessages(e.target.value)}
                  ></textarea>
                  <button onClick={handleSubmit} className="chatSubmitButton">
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {onlineUsers ? (
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={decodedAuth._id}
                setCurrentChat={setCurrentChat}
                setConversations={setConversations}
              />
            ) : <p>No online Friends</p>}
          </div>
        </div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default Messenger;
