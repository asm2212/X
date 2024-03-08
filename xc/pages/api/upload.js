import multiparty from 'multiparty';
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
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

    const s3Client = new S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw err;
      }
      const type = Object.keys(files)[0];
      const fileInfo = files[type][0];
      const filename = fileInfo.path.split('/').slice(-1)[0];
      const fileContent = fs.readFileSync(fileInfo.path);

      const uploadParams = {
        Bucket: 'asmare-x-clone',
        Body: fileContent,
        ACL: 'public-read',
        Key: filename,
        ContentType: fileInfo.headers['content-type'],
      };

      s3Client.upload(uploadParams, async (err, data) => {
        if (err) {
          throw err;
        }

        if (type === 'cover' || type === 'image') {
          await User.findByIdAndUpdate(session.user.id, {
            [type]: data.Location,
          });
        }

        fs.unlinkSync(fileInfo.path);
        res.json({ files, err, data, fileInfo, src: data.Location });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};