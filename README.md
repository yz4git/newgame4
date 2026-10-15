# RELIC DELVE — 崩落の遺跡

A terrain-tactics roguelite RPG. Walk through ancient underground chambers, break walls to create your own routes, and turn heavy rocks, explosive barrels, water gates and lava reservoirs into weapons. Connected mineral veins power four elemental spells.

Play: https://drill-delve.yzgame.chatgpt.site

## The exploration loop

Six ruins contain three chambers each. Activate seals, defeat marked sentries, collect fragments while evading a pursuer, or steal a relic and return to the entrance. Complete each room's objective to open its portal, then choose the next encounter. The second, fourth and sixth ruins end in a guardian fight: disable its seals, exploit its attack window, and use the arena's destructible traps.

The explorer moves in all four directions with no automatic falling or oxygen timer. Natural dungeon rock stays fixed; only heavy rocks fall when their supports are removed. Rock falls, barrels and lava bypass enemy armor and give bonus rewards for environmental kills. Water slows enemies. Terrain can hurt the explorer too, and attacks are telegraphed before impact.

## Controls

- Touch: hold a direction to walk, mine a wall or attack an adjacent enemy. Select one of four colored tabs, then hold the large spell button to cast in your facing direction. Independent pointer capture supports simultaneous movement and casting.
- Keyboard: arrows / WASD to walk and mine; Space to cast; 1–4 to select an element; X for the free pulse; C for a healing potion; Esc to pause.
- Green heals and binds enemies; orange blasts walls and foes; blue pierces and freezes; purple chains lightning between enemies and mineral veins. Spells consume crystals acquired by mining connected veins. Pulse uses a cooldown and requires no crystals.

Choose one of three perks when leveling up. Compare equipment from chests. Use camp shops between ruins. Ended runs award permanent upgrade cores. Local base upgrades from the original game are retained, including conversion of oxygen-tank upgrades into crystal capacity. New-format exploration saves use a separate storage key; the earlier run record is not overwritten.

## Development

The game has no runtime packages, external assets, CDN or server requirement. Canvas art and Web Audio are generated locally. The engine is independent of the renderer and DOM input. Responsive layouts support portrait and landscape; PWA caching supports offline play after a successful first visit.

```sh
npm test
npm run build
```

Serve the repository root or `dist/` on a static host. `.openai/hosting.json` retains the existing Sites project. The service worker uses network-first retrieval to expose published updates promptly. Save data belongs to the current browser and origin.

`src/engine.mjs` contains generation, objectives, tactics and progression; `src/render.mjs` renders the ruins; `src/app.mjs` handles input, UI and storage; `src/audio.mjs` synthesizes sound. Tests cover generation/reachability, terrain tactics, elemental effects, objectives, equipment, saves and complete normal-input runs. `scripts/render-check.mjs` is an optional host-runtime Canvas inspection utility.
