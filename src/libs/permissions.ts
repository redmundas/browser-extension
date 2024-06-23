import browser from 'webextension-polyfill';

export async function getPermissions(names: string[]) {
  const { permissions = [] } = await browser.permissions.getAll();
  return names.reduce(
    (result, name) => {
      return { ...result, [name]: permissions.includes(name) };
    },
    {} as Record<string, boolean>,
  );
}

export function removePermissions(permissions: browser.Permissions.Permissions) {
  return browser.permissions.remove(permissions);
}

export function requestPermissions(permissions: browser.Permissions.Permissions) {
  return browser.permissions.request(permissions);
}
