import { Request, Response, NextFunction } from 'express';
import finalhandler from 'finalhandler';
import { chromium } from 'playwright-chromium';

export default function testController(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { URL } = req.query;

  if (typeof URL !== 'string') {
    res.status(400);
    finalhandler(req, res)('Bad Request');
    return;
  }

  (async () => {
    try {
      const browser = await chromium.launch({ args: ['--no-sandbox'] });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(URL);

      const value = await page.evaluate(() => {
        const $button = <HTMLButtonElement>document.querySelector('#bt');
        const $input = <HTMLInputElement>document.querySelector('#inp');

        if (
          !($button instanceof HTMLButtonElement) ||
          !($input instanceof HTMLInputElement)
        ) {
          throw new Error('no HTMLElement');
        }

        $button.click();

        return $input.value;
      });

      res.set('Content-Type', 'text/plain').send(value);
    } catch (err) {
      next(err);
    }
  })();
}
