import { Request, Response } from 'express';
import { OPENEDU_LOGIN } from '../constants/constants';

const posts = [{ id: 1, title: { rendered: OPENEDU_LOGIN } }];

function getPosts(req: Request, res: Response): void {
  res.json(posts);
}

function getPost(req: Request, res: Response): void {
  const id = +req.params.id;
  const post = posts.find((item) => item.id === id);

  if (post === undefined) {
    res.sendStatus(404);

    return;
  }

  res.json(post);
}

export { getPosts, getPost };
