__d(
  "LegacyHidden",
  ["react"],
  function (a, b, c, d, e, f, g) {
    "use strict";
    var h = d("react"),
      i = h.unstable_LegacyHidden;
    function a(a, b) {
      var c = a.children,
        d = a.htmlAttributes,
        e = a.mode;
      a = a.suppressHydrationWarning;
      return h.jsx(
        "div",
        babelHelpers["extends"]({}, d, {
          hidden: e === "hidden" ? !0 : void 0,
          ref: b,
          suppressHydrationWarning: a,
          children: h.jsx(i, {
            mode: e === "hidden" ? "unstable-defer-without-hiding" : e,
            children: c,
          }),
        })
      );
    }
    a.displayName = a.name + " [from " + f.id + "]";
    a.displayName = "LegacyHidden";
    b = h.forwardRef(a);
    g["default"] = b;
  },
  98
);
