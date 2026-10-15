# RELIC DELVE — 崩落の遺跡

A cascade-mining roguelite. Drill through connected mineral masses, fall through the space you open, and read the falling terrain above you. Unsupported stone and mineral clusters shake before dropping; matching minerals that join on landing trigger another rewarded cascade.

Play: https://drill-delve.yzgame.chatgpt.site

## The core loop

Choose a path through a vertical mineral field. Connected colors break together. Digging removes your footing, so gravity moves you deeper; horizontal movement lets you escape falling masses or set up the next chain. Stone has a natural, inlaid-mineral appearance. An overhead cave-in follows spatially through the shaft and punishes getting stuck behind it. Mining starts its approach; pause and reward screens freeze it.

Crystals earned by mining power four support abilities: green heals and slows the cave-in; orange blasts a passage ahead; blue freezes falling masses and pierces stone; purple chains through nearby veins and enemies. With insufficient crystals, the resonance button produces a free small pulse instead. The main action always remains fast drilling.

Six regions contain three strata each. Choose the next stratum's tradeoff at safe exits: resonant seams, richer side deposits, heavy-rock layers or a faster collapse. The second, fourth and sixth regions end at a guardian core; destroying its mineral pillars damages it, and falling stone is another way to break it. Missing a pillar never locks the exit permanently.

Each stratum has eight nests of six or eight enemies along the descent route (48 early, 64 in deeper regions, plus heavy-rock sentries). Nearby reinforcement waves hatch from glowing cracks after a warning, refilling sparse encounters with fast flying moths. A finite stratum budget and local crowd limit keep the swarm bounded. Emergence rechecks the explorer, falling masses, resources and guardian before opening stone; hatching cannot deal immediate contact damage. Fragile creatures remain vulnerable to falling terrain and area resonance, so crowds preserve continuous mining. Existing active saves gain denser nests in the unexplored depth ahead and nearby reinforcement waves without restarting.

Six specialist creatures mix into nests from the first stratum and join reinforcement waves: rush scarabs telegraph a three-cell charge; burrowers open mineral tunnels; spore flowers fire straight volleys stopped by terrain; split jellies divide unless killed with cold or terrain; blast ticks detonate into nearby stone and creatures; shield turtles guard their facing, with flanking, cold, terrain and repeated front hits as counters. Each has a distinct animated silhouette and visible attack tells. The field guide lists their counters. Saves retain charges, fuses, frozen states and broken shields; earlier saves change only untouched creatures ahead.

XP levels accumulate while drilling. Perk choices and equipment comparisons are held for safe stratum exits, preserving continuous excavation and cascades. Camp shops and permanent upgrades support different builds. The earlier game's base upgrades and active exploration build are retained when migrating into the new shafts.

## Controls

- Touch: hold a direction to move and mine. Hold **掘る** for fast drilling. Up performs a one-cell hop from supported ground and mines overhead rock. Independent pointer capture supports movement plus drilling together.
- Select an elemental tab, then tap the smaller resonance button. It uses crystals when available, with a cooldown; otherwise it uses the free small pulse. The healing button consumes a potion.
- Keyboard: arrows / WASD to move and mine, Space for fast drilling, 1–4 to select an element, X for resonance, C for healing, Esc to pause.

## Development

No runtime dependencies, external assets or server are required. Canvas art and Web Audio are generated locally. The simulation is independent from the renderer and touch UI. Portrait/landscape layouts and a network-first PWA cache are included.

```sh
npm test
npm run build
```

Serve the repository root or `dist/` on a static host. `.openai/hosting.json` retains the existing Sites project identity. Save data is local to the browser and origin. Save format 3 restores moving masses, collapse position and queued exit rewards; format 2 migrates the character's equipment, growth and region into a newly generated shaft without overwriting the old record.

`src/engine.mjs`: mining, gravity, support, cascades and progression. `src/render.mjs`: Canvas world. `src/app.mjs`: input, UI and storage. `src/audio.mjs`: sound synthesis. Tests cover gravity, landing chains, uninterrupted drilling, mobile pointer input and save migration.
