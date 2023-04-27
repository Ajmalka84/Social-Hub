const io = require("socket.io")(8900,{
    cors : {
        origin : 'http://localhost:3000',
    }
})

let users = []
const addUser = (userId, socketId)=>{
    !users.some(user=>user.userId === userId) &&
    users.push({userId , socketId})
}
const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId)
    console.log(users)
}
const getUser = (recieverId)=>{
    return users.find((user)=> user.userId === recieverId);
}
io.on('connection', (socket)=>{
    //On connection
    console.log("a user connected")
    
    //take userId and socketId from the user
    socket.on("addUser" , userId =>{
      addUser(userId , socket.id)
      io.emit("getUsers" , users )
    })    

    //send and get message
    socket.on("sendMessage" , ({senderId} , {recieverId} , {text})=>{
        console.log( senderId,  recieverId , text, "recieverId")
        const user = getUser(recieverId);
        io.to(user?.socketId).emit("getMessage" , {senderId , text})
    })

    //On disconnect
    socket.on("disconnect" , ()=>{
      console.log("a user is disconnected")
      removeUser(socket.id)
      io.emit("getUsers" , users )
    })    
})