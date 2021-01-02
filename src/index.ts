import dotenv from 'dotenv';
import getPort from './helpers/getPort';
import initializeApp from './app';

dotenv.config();

const PORT = getPort();
const app = initializeApp();

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`http://localhost:${PORT}\n`);
  }
});

export default app;
