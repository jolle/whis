import { Socket } from 'net';
import { EventEmitter } from 'events';

export class TCPHelper extends EventEmitter {
  client: Socket;

  /**
   * Creates a TCP socket to the given host and port.
   * @param {string} host
   * @param {number} port
   */
  constructor(host: string, port: number) {
    super();

    this.client = new Socket();

    this.client.connect(port, host, () => this.emit('connect'));

    this.client.on('data', (data) => this.emit('data', data));
    this.client.on('error', (error) => this.emit('error', error));
    this.client.on('close', () => this.emit('close'));
  }

  /**
   * Writes a given message to the TCP stream with newline as the ending char
   * @param {message} message – the message to be written
   * @param {boolean} getResponseUntilClose – whether to respond with a promise that is resolved on socket close or not
   */
  send(
    message: any,
    getResponseUntilClose: boolean = false,
  ): Promise<Buffer | null> {
    if (!this.client.writable) throw Error('Socket is not writable');
    this.client.write(`${message}\r\n`);

    if (getResponseUntilClose) {
      return new Promise((resolve) => {
        let buffer = Buffer.from([]);
        this.on('data', (data) => (buffer = Buffer.concat([buffer, data])));
        this.on('close', () => resolve(buffer));
      });
    }

    return Promise.resolve(null);
  }
}
