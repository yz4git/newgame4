# DRILL DELVE — 深層の探掘者

An original, touch-first mining roguelite RPG. Drill through connected colored mineral seams, dodge falling clusters, manage oxygen and build a new character each run. Six procedurally generated biomes lead to the Astral Core at 1,200m.

## Play

- Touch: hold a direction to move and drill. Hold the large drill button for faster drilling. Multitouch works across the pad and action buttons.
- Keyboard: arrows / WASD to move and drill, Space to drill faster, X for pulse, C for healing, Esc to pause.
- Matching colors break as a connected group. Groups of five or more earn chain rewards. Unsupported groups shake before falling, and can trigger landing chains.
- O₂ restores oxygen; hard rock costs oxygen; chests offer equipment. Choose one of three perks when leveling up. The second, fourth and sixth floors have bosses; their cores are exposed just before they attack.
- Camp shops between floors offer supplies and equipment. A completed run awards permanent upgrade cores. Runs and camp progress save locally in the browser.

## Development

No runtime packages, CDN, account or server are required. The engine is independent from the Canvas renderer and DOM controls. Audio is synthesized after the first user gesture. The game supports portrait/landscape layouts and installation as a PWA.

```sh
npm test
npm run build
```

`index.html` at the repository root is playable on a static server (including GitHub Pages). `dist/` contains the same production site for Sites. `.openai/hosting.json` retains the Sites project identity. The service worker fetches from the network first to avoid stale deployments, and supplies cached assets offline after a successful initial visit. Save data is tied to the current browser and origin.

Files: `src/engine.mjs` simulation/generation; `src/render.mjs` Canvas art; `src/app.mjs` UI/input/storage; `src/audio.mjs` Web Audio; `test/` deterministic engine tests.
