import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initializeApp from './app';

dotenv.config();

const { DB_URL, PORT } = <{ DB_URL: string; PORT: string }>process.env;

if (typeof DB_URL === 'undefined') {
  process.stderr.write('No process.env.DB_URL parameter\n');
  process.exit(1);
}

if (typeof PORT === 'undefined') {
  process.stderr.write('No process.env.PORT parameter\n');
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    await mongoose.connect(DB_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    initializeApp().listen(Number.parseInt(PORT, 10), () => {
      process.stdout.write(`✓ http://localhost:${PORT}\n`);
    });
  } catch (err) {
    process.stderr.write('No connection to DB\n');
    process.stderr.write(err);
    process.exit(1);
  }
}

main();
