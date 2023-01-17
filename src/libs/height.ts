export default function heightObserver(callback: (height: number) => void) {
  return new ResizeObserver(([entry]) => {
    callback(entry.target.clientHeight);
  });
}
