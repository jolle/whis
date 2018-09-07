import { TCPHelper } from './TCPHelper';
import WhoisParser from './WhoisParser';
export { TCPHelper, WhoisParser };
/**
 * Gets parsed WHOIS data from the given domain.
 *
 * @param {string} domain – the given domain of which the WHOIS query will be done
 * @param {boolean} [raw=false] – whether to return with raw WHOIS data or not
 * @param {string} [server] – custom WHOIS server to retrieve information from; if no server given, will get server from whis-data
 */
declare const whis: (domain: string, raw?: boolean | undefined, server?: string | undefined) => Promise<any>;
export default whis;
export { whis };
