import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

const CORRECTLY = 1;

/**
 * @todo try {} catch (err) {}
 */
async function controller(req: Request, res: Response): Promise<void> {
  if (
    typeof req.body.login === 'string' &&
    typeof req.body.password === 'string' &&
    typeof req.body.URL === 'string'
  ) {
    const { login, password, URL } = req.body as {
      login: string;
      password: string;
      URL: string;
    };
    const client = await new MongoClient(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).connect();
    const db = client.db();
    const users = db.collection('users');
    // [C]reate (insertMany, insertOne)
    // [R]ead   (find, findOne, findOneAndDelete, findOneAndReplace, findOneAndUpdate)
    // [U]pdate (updateMany, updateOne)
    // [D]elete (deleteMany, deleteOne)
    const { result } = await users.insertOne({ login, password });

    // client.close();
    res.send({ status: result.ok === CORRECTLY ? 'success' : 'unsuccess' });
  }
}

export default controller;
