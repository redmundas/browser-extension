import browser from 'webextension-polyfill';

export function getRecentVisits(maxResults = 10) {
  return search({ text: '', maxResults });
}

export async function getTopVisits() {
  const urls = await search({ text: '', maxResults: 1000 });
  return urls
    .filter(({ url }) => !!url)
    .toSorted((a, b) => (b.visitCount ?? 0) - (a.visitCount ?? 0))
    .slice(0, 10);
}

function search(query: browser.History.SearchQueryType = { text: '', maxResults: 100 }) {
  return browser.history.search(query);
}
