import minimist from 'minimist';

const envPort =
  process.env.PORT === undefined ? undefined : Number(process.env.PORT);
const args = <{ PORT?: number; port?: number }>minimist(process.argv.slice(2));
const argPort = args.PORT ?? args.port;
const defPort = 80;

export default envPort ?? argPort ?? defPort;
