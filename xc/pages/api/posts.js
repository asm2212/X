import { getSession } from 'next-auth/react';
import { initMongoose } from '../../lib/mongoose';
import Post from '../../models/Post';
import Like from '../../models/Like';
import Follower from '../../models/Follower';

export default async function handler(req, res) {
  try {
    await initMongoose();
    const session = await getSession({ req });

    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const post = await Post.findById(id)
          .populate('author')
          .populate({
            path: 'parent',
            populate: 'author',
          });
        res.json({ post });
      } else {
        const parent = req.query.parent || null;
        const author = req.query.author;
        let searchFilter = {};

        if (!author && !parent) {
          const myFollows = await Follower.find({ source: session.user.id }).exec();
          const idsOfPeopleIFollow = myFollows.map((f) => f.destination);
          searchFilter.author = { $in: [...idsOfPeopleIFollow, session.user.id] };
        } else if (author) {
          searchFilter.author = author;
        } else if (parent) {
          searchFilter.parent = parent;
        }

        const posts = await Post.find(searchFilter)
          .populate('author')
          .populate({
            path: 'parent',
            populate: 'author',
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .exec();

        let postsLikedByMe = [];
        if (session) {
          const postIds = posts.map((p) => p._id);
          postsLikedByMe = await Like.find({
            author: session.user.id,
            post: { $in: postIds },
          });
        }
        const idsLikedByMe = postsLikedByMe.map((like) => like.post);

        res.json({
          posts,
          idsLikedByMe,
        });
      }
    } else if (req.method === 'POST') {
      const { text, parent, images } = req.body;
      const post = await Post.create({
        author: session.user.id,
        text,
        parent,
        images,
      });

      if (parent) {
        const parentPost = await Post.findById(parent);
        parentPost.commentsCount = await Post.countDocuments({ parent });
        await parentPost.save();
      }

      res.json(post);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


