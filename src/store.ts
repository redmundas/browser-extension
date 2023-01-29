import Dexie, { liveQuery, type PromiseExtended, type Subscription, type Table } from 'dexie';

import type { UrlData } from './state';

//
// Declare Database
//
export default class StateDatabase extends Dexie {
  public urls!: Table<UrlData, string>;

  public constructor() {
    super('StateDatabase');
    this.version(2).stores({
      urls: 'id,url',
    });
  }

  public subscribe<T = UrlData>(tableName: 'urls', callback: (values: T[]) => void): Subscription;
  public subscribe<T = UrlData>(tableName: 'urls', callback: (values: T) => void, id: string): Subscription;
  public subscribe<T = UrlData>(tableName: 'urls', callback: (values: T | T[]) => void, id?: string) {
    const table = this[tableName];

    if (id) {
      return liveQuery(() => table.get({ [table.schema.primKey.name]: id }) as PromiseExtended<T>).subscribe({
        next: callback,
      });
    }

    return liveQuery(() => table.toArray() as PromiseExtended<T[]>).subscribe({
      next: callback,
    });
  }
}
