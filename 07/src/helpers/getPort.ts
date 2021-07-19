import parseArgs from 'minimist';
import { DEFAULT_PORT } from '../constants/constants';

function getPort(): number {
  const args = <{ PORT: number }>(<unknown>parseArgs(process.argv.slice(2), {
    alias: { PORT: 'port' },
    default: { PORT: DEFAULT_PORT },
  }));
  const port = process.env.PORT
    ? Number.parseInt(process.env.PORT, 10)
    : args.PORT;

  return port;
}

if (require.main === module) {
  process.stdout.write(getPort().toString(10));
  process.exit(0);
}

export default getPort;
