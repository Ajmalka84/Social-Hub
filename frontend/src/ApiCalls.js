// import axios from "axios";
// export const LoginCall = (userCredentials , dispatch)=>{
//     return new Promise((resolve, reject) =>{
//         axios.post("http://localhost:8000/auth/login" , userCredentials, {withCredentials : true}).then((result) => {
//             dispatch({type : "LOGIN_SUCCESS" , payload : result.data})
//             resolve({status : true ,message : "its resolved"})
//         }).catch((error)=>{
//             dispatch({type : "LOGIN_FAILURE", payload : error})
//             reject(error)
//         })
//     })
// }

