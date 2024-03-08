import mongoose, { model, modelNames, Schema } from 'mongoose';

const PostSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  text: String,
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  parent: { type: mongoose.Types.ObjectId, ref: 'Post' },
  images: { type: [String] },
}, {
  timestamps: true,
});

const modelName = 'Post';
const Post = modelNames().includes(modelName) ? model(modelName) : model(modelName, PostSchema);

export default Post;