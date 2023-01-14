import EventEmitter from 'emittery';
import type { Runtime } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import logger from '../logger';

export default class ChildConnection {
  private emitter = new EventEmitter();
  private port: Runtime.Port | undefined;

  constructor(private name: string) {
    this.emitter.on('disconnected', () => {
      this.createConnection();
    });
    this.createConnection();
  }

  public postMessage(message: any) {
    this.port?.postMessage(message);
  }

  public addListener(listener: (message: any) => void) {
    this.emitter.on('message', listener);
  }

  private createConnection() {
    try {
      this.port = browser.runtime.connect({ name: this.name });
      this.emitter.emit('connected');

      this.port.onDisconnect.addListener(() => {
        logger.warn('DISCONNECTED', this.name);
        this.emitter.emit('disconnected');
      });

      this.port.onMessage.addListener((message: any) => {
        this.emitter.emit('message', message);
      });
    } catch (error) {
      logger.error('CONNECTION_ERROR', error);
    }
  }
}
