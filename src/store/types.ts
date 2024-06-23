export type Component = 'panel' | 'widget';
export type Components = Partial<Record<Component, boolean>>;
export type Permission = 'history';
export type Permissions = Partial<Record<Permission, boolean>>;
export type Bookmark = {
  id: string;
  title?: string;
  url: string;
};
