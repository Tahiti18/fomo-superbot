// src/router.ts
export type Route = { pattern: RegExp | string; handler: string };

export function loadCallbackRouter() {
  const patterns: Route[] = [
    // Main sections
    { pattern: /^ui:menu$/,    handler: "ui.open_member_menu" },
    { pattern: /^ui:safety$/,  handler: "ui.open_safety" },
    { pattern: /^ui:price$/,   handler: "ui.open_price" },
    { pattern: /^ui:meme$/,    handler: "ui.open_meme" },
    { pattern: /^ui:tips$/,    handler: "ui.open_tips" },
    { pattern: /^ui:mktg$/,    handler: "ui.open_mktg" },
    { pattern: /^ui:account$/, handler: "ui.open_account" },

    // Safety actions
    { pattern: /^safety:scan$/,     handler: "safety.ask_scan" },
    { pattern: /^safety:honeypot$/, handler: "safety.ask_honeypot" },
    { pattern: /^safety:report$/,   handler: "safety.ask_report" },

    // Price & Alpha actions (stubs you can wire later)
    { pattern: /^price:chart$/,   handler: "price.ask_chart" },
    { pattern: /^price:alerts$/,  handler: "price.ask_alerts" },

    // Meme & Stickers
    { pattern: /^meme:stickers$/, handler: "meme.open_stickers" },

    // Tips & Airdrops
    { pattern: /^tips:list$/,     handler: "tips.open_list" },

    // Marketing & Raids
    { pattern: /^mktg:raid$/,     handler: "mktg.open_raid" },

    // Account
    { pattern: /^account:status$/,  handler: "account.status" },
    { pattern: /^account:upgrade$/, handler: "billing.upgrade" },
  ];
  return { patterns };
}

export function matchPattern(pat: RegExp | string, data: string) {
  return pat instanceof RegExp ? pat.test(data) : pat === data;
}
