const _ = {
  bodySerializer: (e) => JSON.stringify(
    e,
    (t, r) => typeof r == "bigint" ? r.toString() : r
  )
}, G = ({
  onRequest: e,
  onSseError: t,
  onSseEvent: r,
  responseTransformer: n,
  responseValidator: o,
  sseDefaultRetryDelay: l,
  sseMaxRetryAttempts: c,
  sseMaxRetryDelay: a,
  sseSleepFn: i,
  url: f,
  ...s
}) => {
  let d;
  const x = i ?? ((u) => new Promise((y) => setTimeout(y, u)));
  return { stream: async function* () {
    let u = l ?? 3e3, y = 0;
    const j = s.signal ?? new AbortController().signal;
    for (; !j.aborted; ) {
      y++;
      const q = s.headers instanceof Headers ? s.headers : new Headers(s.headers);
      d !== void 0 && q.set("Last-Event-ID", d);
      try {
        const E = {
          redirect: "follow",
          ...s,
          body: s.serializedBody,
          headers: q,
          signal: j
        };
        let g = new Request(f, E);
        e && (g = await e(f, E));
        const p = await (s.fetch ?? globalThis.fetch)(g);
        if (!p.ok)
          throw new Error(
            `SSE failed: ${p.status} ${p.statusText}`
          );
        if (!p.body) throw new Error("No body in SSE response");
        const m = p.body.pipeThrough(new TextDecoderStream()).getReader();
        let O = "";
        const v = () => {
          try {
            m.cancel();
          } catch {
          }
        };
        j.addEventListener("abort", v);
        try {
          for (; ; ) {
            const { done: V, value: J } = await m.read();
            if (V) break;
            O += J;
            const I = O.split(`

`);
            O = I.pop() ?? "";
            for (const K of I) {
              const M = K.split(`
`), A = [];
              let B;
              for (const b of M)
                if (b.startsWith("data:"))
                  A.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  B = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  d = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const N = Number.parseInt(
                    b.replace(/^retry:\s*/, ""),
                    10
                  );
                  Number.isNaN(N) || (u = N);
                }
              let z, D = !1;
              if (A.length) {
                const b = A.join(`
`);
                try {
                  z = JSON.parse(b), D = !0;
                } catch {
                  z = b;
                }
              }
              D && (o && await o(z), n && (z = await n(z))), r?.({
                data: z,
                event: B,
                id: d,
                retry: u
              }), A.length && (yield z);
            }
          }
        } finally {
          j.removeEventListener("abort", v), m.releaseLock();
        }
        break;
      } catch (E) {
        if (t?.(E), c !== void 0 && y >= c)
          break;
        const g = Math.min(
          u * 2 ** (y - 1),
          a ?? 3e4
        );
        await x(g);
      }
    }
  }() };
}, Q = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, X = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, Y = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, W = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: n,
  value: o
}) => {
  if (!t) {
    const a = (e ? o : o.map((i) => encodeURIComponent(i))).join(X(n));
    switch (n) {
      case "label":
        return `.${a}`;
      case "matrix":
        return `;${r}=${a}`;
      case "simple":
        return a;
      default:
        return `${r}=${a}`;
    }
  }
  const l = Q(n), c = o.map((a) => n === "label" || n === "simple" ? e ? a : encodeURIComponent(a) : C({
    allowReserved: e,
    name: r,
    value: a
  })).join(l);
  return n === "label" || n === "matrix" ? l + c : c;
}, C = ({
  allowReserved: e,
  name: t,
  value: r
}) => {
  if (r == null)
    return "";
  if (typeof r == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, H = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: n,
  value: o,
  valueOnly: l
}) => {
  if (o instanceof Date)
    return l ? o.toISOString() : `${r}=${o.toISOString()}`;
  if (n !== "deepObject" && !t) {
    let i = [];
    Object.entries(o).forEach(([s, d]) => {
      i = [
        ...i,
        s,
        e ? d : encodeURIComponent(d)
      ];
    });
    const f = i.join(",");
    switch (n) {
      case "form":
        return `${r}=${f}`;
      case "label":
        return `.${f}`;
      case "matrix":
        return `;${r}=${f}`;
      default:
        return f;
    }
  }
  const c = Y(n), a = Object.entries(o).map(
    ([i, f]) => C({
      allowReserved: e,
      name: n === "deepObject" ? `${r}[${i}]` : i,
      value: f
    })
  ).join(c);
  return n === "label" || n === "matrix" ? c + a : a;
}, Z = /\{[^{}]+\}/g, ee = ({ path: e, url: t }) => {
  let r = t;
  const n = t.match(Z);
  if (n)
    for (const o of n) {
      let l = !1, c = o.substring(1, o.length - 1), a = "simple";
      c.endsWith("*") && (l = !0, c = c.substring(0, c.length - 1)), c.startsWith(".") ? (c = c.substring(1), a = "label") : c.startsWith(";") && (c = c.substring(1), a = "matrix");
      const i = e[c];
      if (i == null)
        continue;
      if (Array.isArray(i)) {
        r = r.replace(
          o,
          W({ explode: l, name: c, style: a, value: i })
        );
        continue;
      }
      if (typeof i == "object") {
        r = r.replace(
          o,
          H({
            explode: l,
            name: c,
            style: a,
            value: i,
            valueOnly: !0
          })
        );
        continue;
      }
      if (a === "matrix") {
        r = r.replace(
          o,
          `;${C({
            name: c,
            value: i
          })}`
        );
        continue;
      }
      const f = encodeURIComponent(
        a === "label" ? `.${i}` : i
      );
      r = r.replace(o, f);
    }
  return r;
}, te = ({
  baseUrl: e,
  path: t,
  query: r,
  querySerializer: n,
  url: o
}) => {
  const l = o.startsWith("/") ? o : `/${o}`;
  let c = (e ?? "") + l;
  t && (c = ee({ path: t, url: c }));
  let a = r ? n(r) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (c += `?${a}`), c;
};
function re(e) {
  const t = e.body !== void 0;
  if (t && e.bodySerializer)
    return "serializedBody" in e ? e.serializedBody !== void 0 && e.serializedBody !== "" ? e.serializedBody : null : e.body !== "" ? e.body : null;
  if (t)
    return e.body;
}
const se = async (e, t) => {
  const r = typeof t == "function" ? await t(e) : t;
  if (r)
    return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, R = ({
  allowReserved: e,
  array: t,
  object: r
} = {}) => (o) => {
  const l = [];
  if (o && typeof o == "object")
    for (const c in o) {
      const a = o[c];
      if (a != null)
        if (Array.isArray(a)) {
          const i = W({
            allowReserved: e,
            explode: !0,
            name: c,
            style: "form",
            value: a,
            ...t
          });
          i && l.push(i);
        } else if (typeof a == "object") {
          const i = H({
            allowReserved: e,
            explode: !0,
            name: c,
            style: "deepObject",
            value: a,
            ...r
          });
          i && l.push(i);
        } else {
          const i = C({
            allowReserved: e,
            name: c,
            value: a
          });
          i && l.push(i);
        }
    }
  return l.join("&");
}, ae = (e) => {
  if (!e)
    return "stream";
  const t = e.split(";")[0]?.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json"))
      return "json";
    if (t === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some(
      (r) => t.startsWith(r)
    ))
      return "blob";
    if (t.startsWith("text/"))
      return "text";
  }
}, ne = (e, t) => t ? !!(e.headers.has(t) || e.query?.[t] || e.headers.get("Cookie")?.includes(`${t}=`)) : !1, oe = async ({
  security: e,
  ...t
}) => {
  for (const r of e) {
    if (ne(t, r.name))
      continue;
    const n = await se(r, t.auth);
    if (!n)
      continue;
    const o = r.name ?? "Authorization";
    switch (r.in) {
      case "query":
        t.query || (t.query = {}), t.query[o] = n;
        break;
      case "cookie":
        t.headers.append("Cookie", `${o}=${n}`);
        break;
      default:
        t.headers.set(o, n);
        break;
    }
  }
}, P = (e) => te({
  baseUrl: e.baseUrl,
  path: e.path,
  query: e.query,
  querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : R(e.querySerializer),
  url: e.url
}), U = (e, t) => {
  const r = { ...e, ...t };
  return r.baseUrl?.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = F(e.headers, t.headers), r;
}, ie = (e) => {
  const t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}, F = (...e) => {
  const t = new Headers();
  for (const r of e) {
    if (!r)
      continue;
    const n = r instanceof Headers ? ie(r) : Object.entries(r);
    for (const [o, l] of n)
      if (l === null)
        t.delete(o);
      else if (Array.isArray(l))
        for (const c of l)
          t.append(o, c);
      else l !== void 0 && t.set(
        o,
        typeof l == "object" ? JSON.stringify(l) : l
      );
  }
  return t;
};
class T {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(t) {
    const r = this.getInterceptorIndex(t);
    this.fns[r] && (this.fns[r] = null);
  }
  exists(t) {
    const r = this.getInterceptorIndex(t);
    return !!this.fns[r];
  }
  getInterceptorIndex(t) {
    return typeof t == "number" ? this.fns[t] ? t : -1 : this.fns.indexOf(t);
  }
  update(t, r) {
    const n = this.getInterceptorIndex(t);
    return this.fns[n] ? (this.fns[n] = r, t) : !1;
  }
  use(t) {
    return this.fns.push(t), this.fns.length - 1;
  }
}
const ce = () => ({
  error: new T(),
  request: new T(),
  response: new T()
}), le = R({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), ue = {
  "Content-Type": "application/json"
}, L = (e = {}) => ({
  ..._,
  headers: ue,
  parseAs: "auto",
  querySerializer: le,
  ...e
}), fe = (e = {}) => {
  let t = U(L(), e);
  const r = () => ({ ...t }), n = (f) => (t = U(t, f), r()), o = ce(), l = async (f) => {
    const s = {
      ...t,
      ...f,
      fetch: f.fetch ?? t.fetch ?? globalThis.fetch,
      headers: F(t.headers, f.headers),
      serializedBody: void 0
    };
    s.security && await oe({
      ...s,
      security: s.security
    }), s.requestValidator && await s.requestValidator(s), s.body !== void 0 && s.bodySerializer && (s.serializedBody = s.bodySerializer(s.body)), (s.body === void 0 || s.serializedBody === "") && s.headers.delete("Content-Type");
    const d = P(s);
    return { opts: s, url: d };
  }, c = async (f) => {
    const { opts: s, url: d } = await l(f), x = {
      redirect: "follow",
      ...s,
      body: re(s)
    };
    let $ = new Request(d, x);
    for (const h of o.request.fns)
      h && ($ = await h($, s));
    const k = s.fetch;
    let u = await k($);
    for (const h of o.response.fns)
      h && (u = await h(u, $, s));
    const y = {
      request: $,
      response: u
    };
    if (u.ok) {
      const h = (s.parseAs === "auto" ? ae(u.headers.get("Content-Type")) : s.parseAs) ?? "json";
      if (u.status === 204 || u.headers.get("Content-Length") === "0") {
        let m;
        switch (h) {
          case "arrayBuffer":
          case "blob":
          case "text":
            m = await u[h]();
            break;
          case "formData":
            m = new FormData();
            break;
          case "stream":
            m = u.body;
            break;
          default:
            m = {};
            break;
        }
        return s.responseStyle === "data" ? m : {
          data: m,
          ...y
        };
      }
      let p;
      switch (h) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          p = await u[h]();
          break;
        case "stream":
          return s.responseStyle === "data" ? u.body : {
            data: u.body,
            ...y
          };
      }
      return h === "json" && (s.responseValidator && await s.responseValidator(p), s.responseTransformer && (p = await s.responseTransformer(p))), s.responseStyle === "data" ? p : {
        data: p,
        ...y
      };
    }
    const j = await u.text();
    let q;
    try {
      q = JSON.parse(j);
    } catch {
    }
    const E = q ?? j;
    let g = E;
    for (const h of o.error.fns)
      h && (g = await h(E, u, $, s));
    if (g = g || {}, s.throwOnError)
      throw g;
    return s.responseStyle === "data" ? void 0 : {
      error: g,
      ...y
    };
  }, a = (f) => (s) => c({ ...s, method: f }), i = (f) => async (s) => {
    const { opts: d, url: x } = await l(s);
    return G({
      ...d,
      body: d.body,
      headers: d.headers,
      method: f,
      onRequest: async ($, k) => {
        let u = new Request($, k);
        for (const y of o.request.fns)
          y && (u = await y(u, d));
        return u;
      },
      url: x
    });
  };
  return {
    buildUrl: P,
    connect: a("CONNECT"),
    delete: a("DELETE"),
    get: a("GET"),
    getConfig: r,
    head: a("HEAD"),
    interceptors: o,
    options: a("OPTIONS"),
    patch: a("PATCH"),
    post: a("POST"),
    put: a("PUT"),
    request: c,
    setConfig: n,
    sse: {
      connect: i("CONNECT"),
      delete: i("DELETE"),
      get: i("GET"),
      head: i("HEAD"),
      options: i("OPTIONS"),
      patch: i("PATCH"),
      post: i("POST"),
      put: i("PUT"),
      trace: i("TRACE")
    },
    trace: a("TRACE")
  };
}, w = fe(L({
  baseUrl: "https://localhost:44306"
}));
async function S(e) {
  const { data: t, error: r } = await e;
  if (r)
    throw r;
  return t;
}
const de = {
  getDefinitions() {
    return S(
      w.get({
        url: "/umbraco/nodeflags/api/v1/definitions",
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  createDefinition(e) {
    return S(
      w.post({
        url: "/umbraco/nodeflags/api/v1/definitions",
        body: e,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  updateDefinition(e, t) {
    return S(
      w.put({
        url: `/umbraco/nodeflags/api/v1/definitions/${e}`,
        body: t,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  deleteDefinition(e) {
    return S(
      w.delete({
        url: `/umbraco/nodeflags/api/v1/definitions/${e}`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  getNodeFlags(e) {
    return S(
      w.get({
        url: `/umbraco/nodeflags/api/v1/nodes/${e}/flags`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  getNodeFlagsByKey(e) {
    return S(
      w.get({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/${e}/flags`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  toggleFlag(e, t) {
    return S(
      w.post({
        url: `/umbraco/nodeflags/api/v1/nodes/${e}/flags/${t}/toggle`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  toggleFlagByKey(e, t) {
    return S(
      w.post({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/${e}/flags/${t}/toggle`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  getManyNodeFlags(e) {
    const t = new URLSearchParams();
    e.forEach((n) => t.append("nodeIds", n.toString()));
    const r = t.toString();
    return S(
      w.get({
        url: `/umbraco/nodeflags/api/v1/nodes/flags${r ? `?${r}` : ""}`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  },
  getManyNodeFlagsByKey(e) {
    const t = new URLSearchParams();
    e.forEach((n) => t.append("contentKeys", n));
    const r = t.toString();
    return S(
      w.get({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/flags${r ? `?${r}` : ""}`,
        security: [{ scheme: "bearer", type: "http" }]
      })
    );
  }
};
export {
  w as c,
  de as n
};
//# sourceMappingURL=node-flags-CQwlbdJU.js.map
