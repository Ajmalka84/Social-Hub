const AuthReducer = (state, action) =>{
    switch(action.type){
        
        case "LOGIN_SUCCESS" :
            return {
                user : action.payload, 
                isFetching : false,
                error : false
            }
        case "LOGIN_FAILURE" :
            return {
                user : null, 
                isFetching : false, 
                error : action.payload   
            }
        case "ACCESS TOKEN" :
            return {
                ...state,
                user : {
                    ...state.user,
                    accessToken : action.payload.accessToken
                }
            }
        default: 
            return state;
    }
}

export default AuthReducer;