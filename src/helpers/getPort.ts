const PORT = (() => {
  const portEnv = process.env.PORT;
  const portArg = process.argv.find((arg) => arg.startsWith('--port='));

  let port: string;

  if (typeof portEnv === 'string') {
    port = portEnv;
  } else if (typeof portArg === 'string') {
    [, port] = portArg.slice(2).split('=');
  } else {
    port = '80';
  }

  return Number.parseInt(port, 10);
})();

export default PORT;
