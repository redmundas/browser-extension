export type Bookmark = {
  id: string;
  title?: string;
  url: string;
};
export type Component = 'badge' | 'menu' | 'panel' | 'widget';
export type Components = Partial<Record<Component, boolean>>;
export type Permission = 'history';
export type Permissions = Partial<Record<Permission, boolean>>;
export type Settings = Partial<{
  privacy: boolean;
}>;
export type Snippet = {
  id: string;
  title?: string;
  content: string;
  url?: string;
};
