import { getSession } from 'next-auth/react';
import { initMongoose } from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req, res) {
  try {
    await initMongoose();
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bio, name, username } = req.body;
    await User.findByIdAndUpdate(session.user.id, { bio, name, username });

    res.json('ok');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}