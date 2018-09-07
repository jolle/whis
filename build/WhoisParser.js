"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dateModifier = function () { return function (input) {
    return input instanceof Array
        ? input.map(function (a) { return dateModifier()(a); })
        : isNaN(+new Date(input))
            ? input
            : new Date(input);
}; };
var aliasKeys = [
    {
        from: ['domain name', 'domain'],
        to: 'domain'
    },
    {
        from: ['expiry date', 'registry expiry date'],
        to: 'expiration',
        modifier: dateModifier()
    },
    {
        from: ['created', 'creation date'],
        to: 'created',
        modifier: dateModifier()
    },
    {
        from: ['updated date', 'last-update'],
        to: 'updated',
        modifier: dateModifier()
    },
    {
        from: ['status', 'domain status'],
        to: 'status'
    },
    {
        from: ['registrar'],
        to: 'registrar'
    },
    {
        from: ['registrar iana id'],
        to: 'registrarIANAId'
    },
    {
        from: ['registrar abuse contact email'],
        to: 'registrarAbuseContactEmail'
    },
    {
        from: ['registrar abuse contact phone'],
        to: 'registrarAbuseContactEmail'
    },
    {
        from: ['name server', 'nserver'],
        to: 'nameServer'
    },
    {
        from: ['dnssec'],
        to: 'DNSSEC'
    }
];
var parseWhois = function (data) {
    return data
        .split('\n')
        .filter(function (line) { return line.length > 0 && !line.startsWith('%'); })
        .map(function (line) { return line.split(/:\s+/); })
        .map(function (line) { return ({
        key: line[0].trim(),
        value: line
            .slice(1)
            .join(': ') // if there happens to be `: ` somewhere in the property value, this will restore them (not accounting for extra spaces)
            .trim()
    }); })
        .reduce(function (previous, _a) {
        var key = _a.key, value = _a.value;
        return (__assign({}, previous, (_b = {},
            _b[key] = previous[key] // if there is already a property using the same key, create an array containing all values.
                ? (previous[key] instanceof Array
                    ? previous[key]
                    : [previous[key]]).concat([
                    value
                ]) : value,
            _b)));
        var _b;
    }, {});
};
var findAliasByKey = function (key) { return (__assign({ modifier: function (a) { return a; } }, (aliasKeys.find(function (_a) {
    var from = _a.from;
    return from.includes(key.toLowerCase());
}) || {
    notFound: true
}))); };
/**
 * Parses given raw WHOIS data to JS object form
 *
 * @param {string} data – raw WHOIS data to parse from
 */
exports.default = (function (data) {
    var whoisData = parseWhois(data);
    return __assign({}, Object.keys(whoisData)
        .map(function (key) { return ({ key: key, alias: findAliasByKey(key) }); })
        .filter(function (_a) {
        var alias = _a.alias;
        return !alias.notFound;
    })
        .map(function (_a) {
        var key = _a.key, alias = _a.alias;
        return (_b = {},
            _b[alias.to] = alias.modifier(whoisData[key]),
            _b);
        var _b;
    })
        .reduce(function (p, n) { return (__assign({}, p, n)); }, {}), { raw: whoisData });
});
