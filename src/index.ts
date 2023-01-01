import { TCPHelper } from './TCPHelper';
import WhoisParser, { WhoisResult } from './WhoisParser';
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

  return new Promise<string>(async (resolve, reject) => {
    let hasError = false;
    tcp.on('error', (err) => {
      hasError = true;
      reject(err);
    });

    const data = await tcp.send(domain, true);
    if (hasError) return;

    if (!data) return reject(Error("Whois server didn't reply with any data"));

    resolve(data.toString());
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
