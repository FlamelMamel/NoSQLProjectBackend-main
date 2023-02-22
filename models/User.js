import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
     email: {
          type: String,
          required: true
     },
     username: {
          type: String,
          required: true
     },
     hashedPassword: {
          type: String,
          required: true,
     },
},
{
     timestamps: true
}
);

export default mongoose.model('User', UserSchema);