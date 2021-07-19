import { promises as fsPromises } from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import axios from 'axios';
import { OPENEDU_LOGIN } from '../constants/constants';
import handleError from '../helpers/handleError';

function controller(req: Request, res: Response): void {
  const [addr, random2, random3] = [
    req.query.addr,
    req.body.random2,
    req.body.random3,
  ];

  if (
    typeof addr !== 'string' ||
    random2 === undefined ||
    random3 === undefined
  ) {
    res.sendStatus(400);

    return;
  }

  (async () => {
    try {
      const templateName = '__template__';
      const templatePath = path.join(
        __dirname,
        `../../views/${templateName}.pug`
      );
      const { data: template } = await axios.get<string>(addr);

      await fsPromises.writeFile(templatePath, template);
      res.render(`${templateName}`, {
        login: OPENEDU_LOGIN,
        random2,
        random3,
      });
      await fsPromises.unlink(templatePath);
    } catch (error) {
      handleError(error, req, res);
    }
  })();
}

export default controller;
