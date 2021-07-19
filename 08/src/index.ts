import dotenv from 'dotenv';
import initializeApp from './app';

dotenv.config();

const { PORT } = process.env;

if (typeof PORT !== 'string') {
  process.stderr.write('No process.env.PORT parameter\n');
  process.exit(1);
}

initializeApp().listen(Number.parseInt(PORT, 10), () => {
  process.stdout.write(`http://localhost:${PORT}\n`);
});
