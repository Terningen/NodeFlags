import { nodeFlagsApi, type NodeFlagsForNode } from "../api/node-flags.js";

const HREF_PATTERN = /\/section\/content\/workspace\/document\/edit\/([0-9a-f-]{36})/i;

type DecoratedAnchor = HTMLAnchorElement;

let observer: MutationObserver | undefined;
let refreshTimeout: number | undefined;

const parseContentKey = (value: string) => {
  const match = value.match(HREF_PATTERN);
  return match?.[1] ?? "";
};

const collectAnchors = () => {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href*="/section/content/workspace/document/edit/"]')
  );
};

const applyNodeState = (anchor: DecoratedAnchor, state?: NodeFlagsForNode) => {
  const row = anchor.closest("uui-menu-item, li, [role='treeitem'], .umb-tree-item") as HTMLElement | null;
  const target = row ?? anchor;

  target.style.removeProperty("background");
  target.style.removeProperty("border-radius");
  anchor.style.removeProperty("display");
  anchor.style.removeProperty("align-items");
  anchor.style.removeProperty("gap");

  anchor.querySelectorAll(".node-flags-badge").forEach((element) => element.remove());

  if (!state || state.activeFlags.length === 0) {
    return;
  }

  const effective = state.effectiveFlag;
  if (effective) {
    target.style.background = `color-mix(in srgb, ${effective.backgroundColor} 24%, transparent)`;
    target.style.borderRadius = "10px";
  }

  anchor.style.display = "inline-flex";
  anchor.style.alignItems = "center";
  anchor.style.gap = "6px";

  state.activeFlags.forEach((flag) => {
    const badge = document.createElement("span");
    badge.className = "node-flags-badge";
    badge.textContent = flag.icon;
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.style.padding = "2px 6px";
    badge.style.borderRadius = "999px";
    badge.style.fontSize = "10px";
    badge.style.fontWeight = "700";
    badge.style.color = "#ffffff";
    badge.style.background = flag.iconColor;
    anchor.appendChild(badge);
  });
};

const refreshTreeStyles = async () => {
  const anchors = collectAnchors();
  const keys = anchors
    .map((anchor) => parseContentKey(anchor.href))
    .filter((value, index, array) => value && array.indexOf(value) === index);

  if (keys.length === 0) {
    return;
  }

  const states = await nodeFlagsApi.getManyNodeFlagsByKey(keys);
  const stateByKey = new Map(keys.map((key, index) => [key, states[index]]));

  anchors.forEach((anchor) => {
    const contentKey = parseContentKey(anchor.href);
    const state = stateByKey.get(contentKey);
    applyNodeState(anchor, state);
  });
};

const scheduleRefresh = () => {
  window.clearTimeout(refreshTimeout);
  refreshTimeout = window.setTimeout(() => {
    void refreshTreeStyles().catch(() => undefined);
  }, 150);
};

export const startNodeFlagsTreeDecorator = () => {
  scheduleRefresh();

  observer = new MutationObserver(() => {
    scheduleRefresh();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const onFlagsChanged = () => scheduleRefresh();
  window.addEventListener("node-flags-changed", onFlagsChanged);

  return () => {
    observer?.disconnect();
    observer = undefined;
    window.removeEventListener("node-flags-changed", onFlagsChanged);
    window.clearTimeout(refreshTimeout);
  };
};
