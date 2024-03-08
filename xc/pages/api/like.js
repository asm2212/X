import { initMongoose } from "../../lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Like from "../../models/Like";
import Post from "../../models/Post";
import { startSession } from "mongoose";

async function updateLikesCount(postId) {
  const session = await startSession(); 
  session.startTransaction(); 

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new Error("Post not found");
    }
    const likeCount = await Like.countDocuments({ post: postId }).session(session);
    post.likesCount = likeCount;
    await post.save();

    await session.commitTransaction(); 
    session.endSession(); 
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession(); 
    throw error; 
  }
}

export default async function handle(req, res) {
  try {
    await initMongoose();
    const session = await unstable_getServerSession(req, res, authOptions);

    const postId = req.body.id;
    const userId = session.user.id;

    const existingLike = await Like.findOne({ author: userId, post: postId });

    if (existingLike) {
      await existingLike.remove();
    } else {
      await Like.create({ author: userId, post: postId });
    }

    await updateLikesCount(postId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error handling request:", error);
    // Log the error using a logging library like Winston
    res.status(500).json({ success: false, error: error.message });
  }
}