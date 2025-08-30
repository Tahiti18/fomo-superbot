// src/router.ts
export type Route = { pattern: string; handler: string };

export function loadCallbackRouter() {
  const patterns: Route[] = [
    { pattern: '^ui:safety$',  handler: 'ui.open_safety' },
    { pattern: '^ui:alpha$',   handler: 'ui.open_alpha' },
    { pattern: '^ui:memes$',   handler: 'ui.open_memes' },   // <-- fixes “Memes & Stickers” no route
    { pattern: '^ui:mktg$',    handler: 'ui.open_mktg' },
    { pattern: '^ui:account$', handler: 'ui.open_account' },
  ];
  return { patterns };
}

export function matchPattern(pattern: string, data: string) {
  return new RegExp(pattern).test(data);
}
