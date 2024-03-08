import mongoose from "mongoose";
import { getSession } from "next-auth/react";
import { initMongoose } from "../../lib/mongoose";
import User from "../../models/User";
import Follower from "../../models/Follower";

export default async function handler(req, res) {
  try {
    await initMongoose();
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.method === "PUT") {
      const { username } = req.body;
      await User.findByIdAndUpdate(session.user.id, { username });
      res.json("ok");
    } else if (req.method === "GET") {
      const { id, username } = req.query;
      const user = id
        ? await User.findById(id)
        : await User.findOne({ username });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const follow = await Follower.findOne({
        source: session.user.id,
        destination: user._id,
      });

      res.json({ user, follow });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}