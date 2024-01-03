import { assign, createActor, setup } from 'xstate';

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

function createMachine() {
  return setup({
    types: {
      context: {} as Context,
      events: {} as Event,
    },
  }).createMachine({
    initial: 'disabled',
    context: {
      urls: [],
    },
    states: {
      enabled: {
        on: {
          INSERT_URL: {
            actions: assign(({ context, event }) => {
              const { id, url } = event;
              const { urls } = context;
              return {
                ...context,
                urls: urls.concat({ id, url }),
              };
            }),
            guard: ({ context, event }) => {
              const { url } = event;
              const { urls } = context;
              return !!url && !urls.some((data) => data.url === url);
            },
          },
          REMOVE_URL: {
            actions: assign(({ context, event }) => {
              const { id } = event;
              const { urls } = context;
              return {
                ...context,
                urls: urls.filter((data) => data.id !== id),
              };
            }),
          },
          UPDATE_URL: {
            actions: assign(({ context, event }) => {
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
            actions: assign(({ context, event }) => {
              const { urls } = event;
              return { ...context, urls };
            }),
          },
          START: { target: 'enabled' },
        },
      },
    },
  });
}

export default function createStateMachine() {
  const machine = createMachine();
  const service = createActor(machine);
  service.start();
  return service;
}
