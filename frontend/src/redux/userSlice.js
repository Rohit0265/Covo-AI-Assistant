import {createSlice} from "@reduxjs/toolkit";

// const initialState = {
//     user: null,
//     loading: false,
//     error: null,
// };


const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
        }
    }
})

export const {setUserData} = userSlice.actions;
export default userSlice.reducer
