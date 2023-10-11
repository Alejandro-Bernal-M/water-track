import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: [true, "Email is required"],
    match: /.+\@.+\..+/,
  },
  age: {
    type: Number,
    required: true,
    min: [8, "Age must be 8 or older"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
})

const User = models.User ||  model("User", UserSchema);
export default User;