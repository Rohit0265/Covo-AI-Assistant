import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    firebaseUid:{
    type: String,
    unique: true,
    },

  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },  
  avatar:{
    type: String,
  },
  plan:{
    type:String,
    default:"free"
  },
  credits:{
    type:Number,
    default:100
  },
  totalCredits:{
        type:Number,
    default:100
  },
  planExpireAt:Date
},{

  timestamps: true,
}

)    


const User = mongoose.model('User', UserSchema);
export default User;