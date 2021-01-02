import { Request, Response } from 'express';

function handleOther(req: Request, res: Response): void {
  res.status(404).json({ message: 'Not found' });
}

export default handleOther;
