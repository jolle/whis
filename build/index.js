"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TCPHelper_1 = require("./TCPHelper");
exports.TCPHelper = TCPHelper_1.TCPHelper;
var WhoisParser_1 = __importDefault(require("./WhoisParser"));
exports.WhoisParser = WhoisParser_1.default;
var whisData = require('whis-data');
var findWhoisServer = function (tld) {
    return tld &&
        (whisData[tld.toUpperCase()] ||
            (tld.indexOf('.') > -1 &&
                findWhoisServer(tld.substr(tld.indexOf('.') + 1))));
};
/**
 * Gets parsed WHOIS data from the given domain.
 *
 * @param {string} domain – the given domain of which the WHOIS query will be done
 * @param {boolean} [raw=false] – whether to return with raw WHOIS data or not
 * @param {string} [server] – custom WHOIS server to retrieve information from; if no server given, will get server from whis-data
 */
var whis = function (domain, raw, server) {
    var whoisServer;
    if (server) {
        whoisServer = server;
    }
    else {
        whoisServer = findWhoisServer(domain);
    }
    if (!whoisServer)
        throw Error('Whois server not found');
    var tcp = new TCPHelper_1.TCPHelper(whoisServer, 43);
    return tcp.send(domain, true).then(function (data) {
        if (!data)
            throw Error("Whois server didn't reply with any data");
        return raw ? data.toString() : WhoisParser_1.default(data.toString());
    });
};
exports.whis = whis;
exports.default = whis;
