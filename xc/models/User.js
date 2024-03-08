import { model, modelNames, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  cover: String,
  bio: String,
  username: String,
});

const modelName = 'User';
const User = modelNames().includes(modelName) ? model(modelName) : model(modelName, UserSchema);

export default User;