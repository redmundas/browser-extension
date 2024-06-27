export function getHostname(href: string) {
  const url = new URL(href);
  return url.hostname;
}
