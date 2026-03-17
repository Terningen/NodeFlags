import { UMB_AUTH_CONTEXT as g } from "@umbraco-cms/backoffice/auth";
import { n as f, c as m } from "./node-flags-CQwlbdJU.js";
const p = /\/section\/content\/workspace\/document\/edit\/([0-9a-f-]{36})/i;
let c, d;
const y = (e) => e.match(p)?.[1] ?? "", u = () => Array.from(
  document.querySelectorAll('a[href*="/section/content/workspace/document/edit/"]')
), v = (e, n) => {
  const s = e.closest("uui-menu-item, li, [role='treeitem'], .umb-tree-item") ?? e;
  if (s.style.removeProperty("background"), s.style.removeProperty("border-radius"), e.style.removeProperty("display"), e.style.removeProperty("align-items"), e.style.removeProperty("gap"), e.querySelectorAll(".node-flags-badge").forEach((r) => r.remove()), !n || n.activeFlags.length === 0)
    return;
  const o = n.effectiveFlag;
  o && (s.style.background = `color-mix(in srgb, ${o.backgroundColor} 24%, transparent)`, s.style.borderRadius = "10px"), e.style.display = "inline-flex", e.style.alignItems = "center", e.style.gap = "6px", n.activeFlags.forEach((r) => {
    const t = document.createElement("span");
    t.className = "node-flags-badge", t.textContent = r.icon, t.style.display = "inline-flex", t.style.alignItems = "center", t.style.justifyContent = "center", t.style.padding = "2px 6px", t.style.borderRadius = "999px", t.style.fontSize = "10px", t.style.fontWeight = "700", t.style.color = "#ffffff", t.style.background = r.iconColor, e.appendChild(t);
  });
}, b = async () => {
  const e = u(), n = e.map((o) => y(o.href)).filter((o, r, t) => o && t.indexOf(o) === r);
  if (n.length === 0)
    return;
  const i = await f.getManyNodeFlagsByKey(n), s = new Map(n.map((o, r) => [o, i[r]]));
  e.forEach((o) => {
    const r = y(o.href), t = s.get(r);
    v(o, t);
  });
}, a = () => {
  window.clearTimeout(d), d = window.setTimeout(() => {
    b().catch(() => {
    });
  }, 150);
}, w = () => {
  a(), c = new MutationObserver(() => {
    a();
  }), c.observe(document.body, {
    childList: !0,
    subtree: !0
  });
  const e = () => a();
  return window.addEventListener("node-flags-changed", e), () => {
    c?.disconnect(), c = void 0, window.removeEventListener("node-flags-changed", e), window.clearTimeout(d);
  };
};
let l;
const T = (e, n) => {
  e.consumeContext(g, async (i) => {
    const s = i?.getOpenApiConfiguration();
    m.setConfig({
      auth: s?.token ?? void 0,
      baseUrl: s?.base ?? "",
      credentials: s?.credentials ?? "same-origin"
    }), l?.(), l = w();
  });
}, C = (e, n) => {
  l?.(), l = void 0;
};
export {
  T as onInit,
  C as onUnload
};
//# sourceMappingURL=entrypoint-CJ3bi_k7.js.map
