import { TCPHelper } from './TCPHelper';
import WhoisParser, { WhoisResult } from './WhoisParser';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const whisData = require('whis-data');

export { TCPHelper, WhoisParser, WhoisResult };

const findWhoisServer = (tld: string): string | undefined =>
  tld &&
  (whisData[tld.toUpperCase()] ||
    (tld.indexOf('.') > -1 &&
      findWhoisServer(tld.substr(tld.indexOf('.') + 1))));

/**
 * Gets the raw WHOIS response from the given domain.
 *
 * @param {string} domain – the given domain of which the WHOIS query will be done
 * @param {string} [server] – custom WHOIS server to retrieve information from; if no server given, will get server from whis-data
 */
const getRaw = async (domain: string, server?: string) => {
  const whoisServer = server ?? findWhoisServer(domain);
  if (!whoisServer) throw Error('Whois server not found');

  const tcp = new TCPHelper(whoisServer, 43);

  return new Promise<string>((resolve, reject) => {
    let hasError = false;
    tcp.on('error', (err) => {
      hasError = true;
      reject(err);
    });

    tcp
      .send(domain, true)
      .then((buffer) => {
        if (hasError) return;

        if (!buffer) {
          reject(Error('Domain not found'));
          return;
        }

        resolve(buffer.toString());
      })
      .catch((error) => !hasError && reject(error));
  });
};

/**
 * Gets parsed WHOIS data from the given domain.
 *
 * @param {string} domain – the given domain of which the WHOIS query will be done
 * @param {string} [server] – custom WHOIS server to retrieve information from; if no server given, will get server from whis-data
 */
const whis = async (domain: string, server?: string) =>
  WhoisParser(await getRaw(domain, server));

export default whis;
export { whis, getRaw };
