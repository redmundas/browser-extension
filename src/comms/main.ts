import EventEmitter from 'emittery';
import type { Runtime } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import logger from '../logger';
import type { Message } from './types';

export default class MainConnection {
  private emitter = new EventEmitter();
  private port: Runtime.Port | undefined;

  constructor(private name: string) {
    browser.runtime.onConnect.addListener((port) => {
      if (this.name !== port.name) return;

      logger.debug('CONNECTED', port.name);
      this.port = port;
      this.port.onMessage.addListener((message: Message) => {
        this.emitter.emit('message', message);
      });
      this.port.onDisconnect.addListener(() => {
        logger.debug('DISCONNECTED', this.name);
      });
    });
  }

  public postMessage(message: Message) {
    this.port?.postMessage(message);
  }

  public addListener(listener: (message: Message) => void) {
    this.emitter.on('message', listener);
  }
}
