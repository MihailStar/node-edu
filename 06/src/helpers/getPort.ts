import parseArgs from 'minimist';

function getPort(): number {
  const args = (parseArgs(process.argv.slice(2), {
    alias: { PORT: 'port' },
    default: { PORT: '80' },
    string: 'PORT',
  }) as unknown) as { PORT: string };
  const port = process.env.PORT ?? args.PORT;

  return Number.parseInt(port, 10);
}

if (require.main === module) {
  process.stdout.write(getPort().toString(10));
  process.exit(0);
}

export default getPort;
