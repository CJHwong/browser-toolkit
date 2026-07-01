# browser-toolkit

Collection of independent, client-side browser tools. Static, deployed to GitHub Pages
from the committed `docs/` folder.

## Architecture

Each tool lives in `tools/<name>/` and is fully self-contained. Two kinds:

- **Static tool**: just `index.html` (+ optional `app.js`, `style.css`). No build. Most
  tools are this (mermaid-viewer, video-player, timer, scrum-poker).
- **React/npm tool**: has its own `package.json` and is an npm workspace. Only
  markslide-studio currently. `build.sh` builds it and copies its `build/` output.

`build.sh` decides which is which by testing for `tools/<name>/package.json`. New workspace
tools must also be added to the root `package.json` `workspaces` array.

## Build and deploy

`docs/` is **generated, never hand-edited.** `scripts/build.sh` wipes and rebuilds it:

- Auto-detects every dir under `tools/` (no manifest to update for static tools).
- Injects a per-deploy hash into every `index.html` `<head>`: cache-control meta tags plus
  a script that clears `caches` when the stored hash changes. This is why you should not
  hand-add cache-busting to a tool's `index.html` - the build owns it.
- Rewrites landing-page tool links to `?v=<hash>` and writes `docs/version.json`.

```bash
bash scripts/build.sh                 # build docs/ locally
cd docs && python -m http.server 8080 # test
bash scripts/deploy.sh "message"      # build + commit docs/ + push (do NOT run unprompted)
```

Adding a tool: create `tools/<name>/index.html`, add a card to the root `index.html`.
`build.sh` picks it up automatically.

## Zero-build single-file React tool (in-browser JSX)

For a self-contained tool that wants React ergonomics with no bundler, no npm, no build
step, load React + babel-standalone from a CDN and write JSX in a `type="text/babel"`
script. The browser ignores that script type; babel-standalone scans the DOM, transpiles
the JSX in memory, and evals it. React is the UMD global (`window.React`), so destructure
hooks off it instead of importing.

```html
<script src="https://.../react.production.min.js"></script>
<script src="https://.../react-dom.production.min.js"></script>
<script src="https://.../babel-standalone/7.26.4/babel.min.js"></script>

<div id="root">
  <div id="loading">Loading...<small id="hint"></small></div>
</div>

<!-- diagnostic: CDN globals are fragile (blocked networks, offline). Name what failed. -->
<script>
  setTimeout(function () {
    var h = document.getElementById('hint');
    if (h && document.getElementById('loading')) {
      var missing = [];
      if (typeof React === 'undefined') missing.push('React');
      if (typeof ReactDOM === 'undefined') missing.push('ReactDOM');
      if (typeof Babel === 'undefined') missing.push('Babel');
      h.textContent = missing.length
        ? 'Could not load: ' + missing.join(', ') + '. A script CDN may be blocked.'
        : 'Scripts loaded but the app did not start. Check the console.';
    }
  }, 8000);
  window.addEventListener('error', function (e) {
    var h = document.getElementById('hint');
    if (h) h.textContent = 'Error: ' + (e.message || e.error);
  });
</script>

<script type="text/babel" data-presets="react">
  const { useState } = React;
  function App() {
    const [n, setN] = useState(0);
    return <button onClick={() => setN(n + 1)}>clicked {n}</button>;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
```

**When to use:** throwaway prototypes, one-file tools you hand off directly, anything where
iteration speed beats load time. This lands as a static tool - no workspace entry needed.

**When NOT to use:** anything shipped to users on slow or locked-down networks.
babel-standalone is a ~3MB transpiler downloaded and run on every page load, with no
minification of your code, no tree-shaking, no lint, and a runtime CDN dependency. For a
lightweight build-free alternative, use `htm` (a ~2KB tagged-template lib giving JSX-like
syntax with zero transpile) plus a vendored local React, which also works fully offline.
For anything heavier, make it a real npm workspace tool instead.

## Conventions

- Client-side only. A tool may call an external service (scrum-poker uses Firebase) but the
  interface runs entirely in the browser.
- Responsive, works on desktop and mobile.
- Keep secrets out of committed config. scrum-poker ships `firebase-config.json.example`;
  the real `firebase-config.json` stays untracked.
- Lint/format: `npm run lint`, `npm run format` (eslint + prettier at the root).
