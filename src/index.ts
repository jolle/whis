import { TCPHelper } from './TCPHelper';
import WhoisParser from './WhoisParser';
const whisData = require('whis-data');

export { TCPHelper, WhoisParser };

const findWhoisServer = (tld: string): string | undefined =>
    tld &&
    (whisData[tld.toUpperCase()] ||
        (tld.indexOf('.') > -1 &&
            findWhoisServer(tld.substr(tld.indexOf('.') + 1))));

/**
 * Gets parsed WHOIS data from the given domain.
 *
 * @param {string} domain – the given domain of which the WHOIS query will be done
 * @param {boolean} [raw=false] – whether to return with raw WHOIS data or not
 * @param {string} [server] – custom WHOIS server to retrieve information from; if no server given, will get server from whis-data
 */
const whis = (domain: string, raw?: boolean, server?: string) => {
    let whoisServer;
    if (server) {
        whoisServer = server;
    } else {
        whoisServer = findWhoisServer(domain);
    }
    if (!whoisServer) throw Error('Whois server not found');

    const tcp = new TCPHelper(whoisServer, 43);
    return tcp.send(domain, true).then(data => {
        if (!data) throw Error("Whois server didn't reply with any data");
        return raw ? data.toString() : WhoisParser(data.toString());
    });
};

export default whis;
export { whis };
