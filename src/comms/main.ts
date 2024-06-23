import EventEmitter from 'emittery';
import browser from 'webextension-polyfill';

import logger from '../logger';
import type { Message, MsgBody } from './types';

export default class MainConnection {
  private emitter = new EventEmitter();
  private tabs: browser.Tabs.Tab[] = [];

  constructor(private name: string) {
    this.emitter.on('connected', (sender: browser.Runtime.MessageSender) => {
      logger.debug('CONNECTED', this.name, sender.tab?.id);
      if (sender.tab) {
        this.tabs.push(sender.tab);
      }
    });
    this.emitter.on('disconnected', (sender: browser.Runtime.MessageSender) => {
      logger.debug('DISCONNECTED', this.name, sender.tab?.id);
      if (sender.tab) {
        const i = this.tabs.findIndex(({ id }) => id === sender.tab?.id);
        if (i > -1) {
          this.tabs.splice(i, 1);
        }
      }
    });

    browser.runtime.onConnect.addListener((port) => {
      if (this.name !== port.name) return;

      const tabId = port.sender?.tab?.id;
      let connected = true;
      this.emitter.emit('connected', port.sender);
      const outListener = (msg: unknown) => {
        if (!connected) return;
        port.postMessage(msg);
      };

      this.emitter.on('message_out/*', outListener);
      if (tabId) {
        this.emitter.on(`message_out/${tabId}`, outListener);
      }
      port.onMessage.addListener;

      port.onMessage.addListener((message: Message) => {
        const { type } = message;
        this.emitter.emit(`message_in/${type}`, message);
        this.emitter.emit('message_in/*', message);
      });
      port.onDisconnect.addListener(() => {
        connected = false;
        this.emitter.off('message_out/*', outListener);
        if (tabId) {
          this.emitter.off(`message_out/${tabId}`, outListener);
        }
        this.emitter.emit('disconnected', port.sender);
      });
    });
  }

  public onConnect(listener: () => void) {
    this.emitter.on('connected', listener);
  }

  public onDisconnect(listener: () => void) {
    this.emitter.on('disconnected', listener);
  }

  public postMessage(type: string, data: MsgBody = {}) {
    this.emitter.emit('message_out/*', { type, data });
  }

  public postTabMessage(tabId: number, type: string, data: MsgBody = {}) {
    this.emitter.emit(`message_out/${tabId}`, { type, data });
  }

  public addListener(listener: (message: Message) => void): void;
  public addListener(listener: (message: Message) => void, type: string): void;
  public addListener(listener: (message: Message) => void, type = '*') {
    this.emitter.on(`message_in/${type}`, listener);
  }

  public isTabConnected(tabId: number) {
    return this.tabs.some(({ id }) => id === tabId);
  }
}
