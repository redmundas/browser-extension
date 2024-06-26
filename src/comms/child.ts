import EventEmitter from 'emittery';
import type { Runtime } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import logger from '../logger';
import type { Message, MsgBody } from './types';

export default class ChildConnection {
  private emitter = new EventEmitter();
  private port: Runtime.Port | undefined;

  constructor(private name: string) {
    this.emitter.on('disconnected', () => {
      logger.debug('DISCONNECTED', this.name);
      setTimeout(() => {
        this.createConnection();
      }, 100);
    });
    this.createConnection();
  }

  public postMessage(type: string, data: MsgBody = {}) {
    try {
      this.port?.postMessage({ type, data });
    } catch (error) {
      logger.error('MESSAGE_ERROR', error);
    }
  }

  public addListener(listener: (message: Message) => void): void;
  public addListener(listener: (message: Message) => void, type: string): void;
  public addListener(listener: (message: Message) => void, type = '*') {
    this.emitter.on(`message/${type}`, listener);
  }

  private createConnection() {
    try {
      this.port = browser.runtime.connect({ name: this.name });

      this.port.onDisconnect.addListener(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const err = browser.runtime.lastError;

        this.emitter.emit('disconnected');
        this.port = undefined;
      });

      this.port.onMessage.addListener((message: Message) => {
        const { type } = message;
        this.emitter.emit(`message/${type}`, message);
        this.emitter.emit('message/*', message);
      });

      this.emitter.emit('connected');
    } catch (error) {
      logger.error('CONNECTION_ERROR', error);
    }
  }
}
