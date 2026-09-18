import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import messageReducer from './messageSlices'

export default configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer
  },
})