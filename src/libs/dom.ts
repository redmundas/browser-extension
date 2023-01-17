export function setAttributes(elem: HTMLElement, props: Record<string, string>) {
  Object.entries(props).forEach(([key, val]) => {
    elem.setAttribute(key, val);
  });
}

export function assignStyles(elem: HTMLElement, styles: Record<string, string>) {
  Object.assign(elem.style, styles);
}
