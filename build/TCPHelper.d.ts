/// <reference types="node" />
import { Socket } from 'net';
import { EventEmitter } from 'events';
export declare class TCPHelper extends EventEmitter {
    client: Socket;
    /**
     * Creates a TCP socket to the given host and port.
     * @param {string} host
     * @param {number} port
     */
    constructor(host: string, port: number);
    /**
     * Writes a given message to the TCP stream with newline as the ending char
     * @param {message} message – the message to be written
     * @param {boolean} getResponseUntilClose – whether to respond with a promise that is resolved on socket close or not
     */
    send(message: any, getResponseUntilClose?: boolean): Promise<Buffer | null>;
}
