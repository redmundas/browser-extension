export type Params = {
  text: string;
  trigger: 'click';
};

export function clipboard(node: HTMLElement, { trigger = 'click', text = '' } = {}) {
  const handle = async () => {
    await navigator.clipboard.writeText(text).then(
      () => node.dispatchEvent(new CustomEvent('copied', { detail: { clipboard: text } })),
      (e) => node.dispatchEvent(new CustomEvent('error', { detail: { error: e } })),
    );
  };

  node.addEventListener(trigger, handle, true);

  return {
    update: (params: Params) => {
      if (params.trigger !== undefined) trigger = params.trigger;
      if (params.text !== undefined) text = params.text;
    },
    destroy() {
      node.removeEventListener(trigger, handle, true);
    },
  };
}
