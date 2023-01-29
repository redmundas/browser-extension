import { assign, createMachine, interpret } from 'xstate';

import logger from './logger';

export type UrlData = {
  id: string;
  url: string;
};

type Context = {
  urls: UrlData[];
};

type InsertUrlEvent = {
  type: 'INSERT_URL';
  id: string;
  url: string;
};
type RemoveUrlEvent = {
  type: 'REMOVE_URL';
  id: string;
};
type UpdateUrlEvent = {
  type: 'UPDATE_URL';
  id: string;
  url: string;
};
type RestoreStateEvent = {
  type: 'RESTORE_STATE';
  urls: UrlData[];
};

type Event =
  | InsertUrlEvent
  | RemoveUrlEvent
  | UpdateUrlEvent
  | RestoreStateEvent
  | { type: 'PAUSE' }
  | { type: 'START' };

const machine = createMachine<Context, Event>({
  predictableActionArguments: true,
  initial: 'disabled',
  context: {
    urls: [],
  },
  states: {
    enabled: {
      on: {
        INSERT_URL: {
          actions: assign((context, event) => {
            const { id, url } = event;
            const { urls } = context;
            return {
              ...context,
              urls: urls.concat({ id, url }),
            };
          }),
          cond: ({ urls }, { url }) => {
            return !!url && !urls.some((data) => data.url === url);
          },
        },
        REMOVE_URL: {
          actions: assign((context, event) => {
            const { id } = event;
            const { urls } = context;
            return {
              ...context,
              urls: urls.filter((data) => data.id !== id),
            };
          }),
        },
        UPDATE_URL: {
          actions: assign((context, event) => {
            const { id, url } = event;
            const { urls } = context;
            return {
              ...context,
              urls: urls.map((data) => {
                if (data.id === id) {
                  return {
                    ...data,
                    url,
                  };
                }
                return data;
              }),
            };
          }),
        },
        PAUSE: { target: 'disabled' },
      },
    },
    disabled: {
      on: {
        RESTORE_STATE: {
          actions: assign((context, event) => {
            const { urls } = event;
            return { ...context, urls };
          }),
        },
        START: { target: 'enabled' },
      },
    },
  },
});

export default function createStateMachine() {
  const service = interpret(machine);
  service.onEvent((event) => {
    logger.debug('STATE_EVENT', event);
  });
  service.start();
  return service;
}
