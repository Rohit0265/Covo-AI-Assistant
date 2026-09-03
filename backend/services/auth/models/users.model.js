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
},{

  timestamps: true,
}

)    


const User = mongoose.model('User', UserSchema);
export default User;