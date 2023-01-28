import Dexie, { liveQuery, type PromiseExtended, type Table } from 'dexie';

interface TabData {
  id: number;
  url?: string;
}

//
// Declare Database
//
export default class StateDatabase extends Dexie {
  public tabs!: Table<TabData, number>;

  public constructor() {
    super('StateDatabase');
    this.version(1).stores({
      tabs: 'id,url',
    });
  }

  public subscribe<T = TabData>(tableName: 'tabs', id: string | number, callback: (objects: T) => void) {
    const table = this[tableName];

    return liveQuery(() => table.get({ [table.schema.primKey.name]: id }) as PromiseExtended<T>).subscribe({
      next: (value) => callback(value),
    });
  }
}
