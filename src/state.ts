import { assign, createMachine, interpret } from 'xstate';

import logger from './logger';

export type TabData = {
  url?: string;
};

type Context = {
  tabs: Record<number, Partial<TabData>>;
};

type CreateTabEvent = {
  type: 'CREATE_TAB';
  tabId: number;
};
type RemoveTabEvent = {
  type: 'REMOVE_TAB';
  tabId: number;
};
type UpdateTabEvent = {
  type: 'UPDATE_TAB';
  tabId: number;
  url?: string;
};
type RestoreStateEvent = {
  type: 'RESTORE_STATE';
  tabs: (TabData & { id: number })[];
};

type Event =
  | CreateTabEvent
  | RemoveTabEvent
  | RestoreStateEvent
  | UpdateTabEvent
  | { type: 'PAUSE' }
  | { type: 'START' };

const machine = createMachine<Context, Event>({
  predictableActionArguments: true,
  initial: 'disabled',
  context: {
    tabs: {},
  },
  states: {
    enabled: {
      on: {
        CREATE_TAB: {
          actions: assign((context, event) => {
            const { tabId } = event;
            return {
              ...context,
              tabs: {
                ...context.tabs,
                [tabId]: {},
              },
            };
          }),
        },
        REMOVE_TAB: {
          actions: assign((context, event) => {
            const { tabId } = event;
            delete context.tabs[tabId];
            return context;
          }),
        },
        RESTORE_STATE: {
          actions: assign((context, event) => {
            const { tabs } = event;
            return {
              ...context,
              tabs: Object.fromEntries(tabs.map(({ id, ...tab }) => [id, tab])),
            };
          }),
        },
        UPDATE_TAB: {
          actions: assign((context, event) => {
            const { tabId, url } = event;
            return {
              ...context,
              tabs: {
                ...context.tabs,
                [tabId]: {
                  ...context.tabs[tabId],
                  url,
                },
              },
            };
          }),
        },
        PAUSE: { target: 'disabled' },
      },
    },
    disabled: {
      on: {
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
