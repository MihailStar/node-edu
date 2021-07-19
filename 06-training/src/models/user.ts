import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: [true, 'Login required'],
      unique: true,
      minlength: [4, 'Login length from 4 chars'],
      maxlength: [20, 'Login length to 20 chars'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      minlength: [8, 'Password length from 8 chars'],
      maxlength: [20, 'Password length to 20 chars'],
    },
  },
  { versionKey: false }
);
const User = mongoose.model('User', userSchema);

export default User;
