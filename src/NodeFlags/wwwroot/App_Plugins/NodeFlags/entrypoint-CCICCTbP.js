import { UMB_AUTH_CONTEXT as g } from "@umbraco-cms/backoffice/auth";
import { n as u, c as p } from "./node-flags-CQwlbdJU.js";
const f = /\/section\/content\/workspace\/document\/edit\/([0-9a-f-]{36})/i;
let c, d;
const y = (e) => e.match(f)?.[1] ?? "", v = () => Array.from(
  document.querySelectorAll('a[href*="/section/content/workspace/document/edit/"]')
), b = (e, n) => {
  const s = e.closest("uui-menu-item, li, [role='treeitem'], .umb-tree-item") ?? e;
  if (s.style.removeProperty("background"), s.style.removeProperty("border-radius"), e.style.removeProperty("display"), e.style.removeProperty("align-items"), e.style.removeProperty("gap"), e.querySelectorAll(".node-flags-badge").forEach((m) => m.remove()), !n || n.activeFlags.length === 0)
    return;
  const t = n.effectiveFlag;
  if (t && (s.style.background = `color-mix(in srgb, ${t.backgroundColor} 24%, transparent)`, s.style.borderRadius = "10px"), e.style.display = "inline-flex", e.style.alignItems = "center", e.style.gap = "6px", !t)
    return;
  const o = document.createElement("span");
  o.className = "node-flags-badge", o.style.display = "inline-flex", o.style.alignItems = "center", o.style.justifyContent = "center", o.style.width = "18px", o.style.minWidth = "18px", o.style.height = "18px";
  const r = document.createElement("uui-icon");
  r.setAttribute("name", t.icon), r.style.color = t.iconColor, r.style.fontSize = "16px", o.appendChild(r), e.prepend(o);
}, h = async () => {
  const e = v(), n = e.map((t) => y(t.href)).filter((t, o, r) => t && r.indexOf(t) === o);
  if (n.length === 0)
    return;
  const i = await u.getManyNodeFlagsByKey(n), s = new Map(n.map((t, o) => [t, i[o]]));
  e.forEach((t) => {
    const o = y(t.href), r = s.get(o);
    b(t, r);
  });
}, a = () => {
  window.clearTimeout(d), d = window.setTimeout(() => {
    h().catch(() => {
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
const C = (e, n) => {
  e.consumeContext(g, async (i) => {
    const s = i?.getOpenApiConfiguration();
    p.setConfig({
      auth: s?.token ?? void 0,
      baseUrl: s?.base ?? "",
      credentials: s?.credentials ?? "same-origin"
    }), l?.(), l = w();
  });
}, A = (e, n) => {
  l?.(), l = void 0;
};
export {
  C as onInit,
  A as onUnload
};
//# sourceMappingURL=entrypoint-CCICCTbP.js.map
