import util from 'util';
import { gzip } from 'zlib';

export default util.promisify(gzip);
