"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var events_1 = require("events");
var TCPHelper = /** @class */ (function (_super) {
    __extends(TCPHelper, _super);
    /**
     * Creates a TCP socket to the given host and port.
     * @param {string} host
     * @param {number} port
     */
    function TCPHelper(host, port) {
        var _this = _super.call(this) || this;
        _this.client = new net_1.Socket();
        _this.client.connect(port, host, function () { return _this.emit('connect'); });
        _this.client.on('data', function (data) { return _this.emit('data', data); });
        _this.client.on('error', function (error) { return _this.emit('error', error); });
        _this.client.on('close', function () { return _this.emit('close'); });
        return _this;
    }
    /**
     * Writes a given message to the TCP stream with newline as the ending char
     * @param {message} message – the message to be written
     * @param {boolean} getResponseUntilClose – whether to respond with a promise that is resolved on socket close or not
     */
    TCPHelper.prototype.send = function (message, getResponseUntilClose) {
        var _this = this;
        if (getResponseUntilClose === void 0) { getResponseUntilClose = false; }
        if (!this.client.writable)
            throw Error('Socket is not writable');
        this.client.write(message + "\r\n");
        if (getResponseUntilClose) {
            return new Promise(function (resolve) {
                var buffer = Buffer.from([]);
                _this.on('data', function (data) { return (buffer = Buffer.concat([buffer, data])); });
                _this.on('close', function () { return resolve(buffer); });
            });
        }
        return Promise.resolve(null);
    };
    return TCPHelper;
}(events_1.EventEmitter));
exports.TCPHelper = TCPHelper;
