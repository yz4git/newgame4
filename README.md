# RELIC DELVE — 崩落の遺跡

A cascade-mining roguelite. Drill through connected mineral masses, fall through the space you open, and read the falling terrain above you. Unsupported stone and mineral clusters shake before dropping; matching minerals that join on landing trigger another rewarded cascade.

Play: https://drill-delve.yzgame.chatgpt.site

## The core loop

Choose a path through a vertical mineral field. Connected colors break together. Digging removes your footing, so gravity moves you deeper; horizontal movement lets you escape falling masses or set up the next chain. Stone has a natural, inlaid-mineral appearance. An overhead cave-in follows spatially through the shaft and punishes getting stuck behind it. The entire world waits for the first movement or resonance input. Pause and reward screens freeze simulation. Explorer and creature gravity stop at occupied actor cells, so landing on a foe leaves it visible and available to drill. Older saves repair existing explorer/creature overlaps without rewarding a kill.

Crystals earned by mining power four support abilities: green heals and slows the cave-in; orange blasts a passage ahead; blue freezes falling masses and pierces stone; purple chains through nearby veins and enemies. With insufficient crystals, the resonance button produces a free small pulse instead. The main action always remains fast drilling.

Six regions contain three strata each. Choose the next stratum's tradeoff at safe exits: resonant seams, richer side deposits, heavy-rock layers or a faster collapse. The second, fourth and sixth regions end at a guardian core; each guardian has three shell sections. Warned columns strike before the core opens; move into an unlit column, then attack. Breaking mineral pillars stores a large hit for the next exposed core, and falling stone accelerates the attack cycle and stores extra damage. Damage cannot skip shell sections, and ordinary attacks always get recurring openings. The overhead cave-in stops above an active guardian arena. Missing a pillar never locks the exit permanently.

Each stratum has eight nests of six or eight enemies along the descent route (48 early, 64 in deeper regions, plus heavy-rock sentries). Nearby reinforcements hatch from glowing cracks after a warning, with a 3.5-second opening grace period and at least 5.5 seconds between waves. Each wave has at most three creatures and prioritizes the six specialist types; a single flying moth may join alternate waves, with no more than two moths alive per stratum. Fixed nests remain dense. Connected mineral lintels rest on side posts, keeping unopened nests intact until their supports are mined. Specialists wait for a visible approach (burrowers can sense nearby miners through stone), then react quickly. Earlier saves reinforce only untouched nests far ahead, preserving explored terrain and the current build. A finite stratum budget and local crowd limit keep the swarm bounded. Emergence rechecks the explorer, falling masses, resources and guardian before opening stone; hatching cannot deal immediate contact damage. Fragile creatures remain vulnerable to falling terrain and area resonance, so crowds preserve continuous mining. Existing active saves gain denser nests in the unexplored depth ahead and nearby reinforcement waves without restarting.

Six specialist creatures mix into nests from the first stratum and join reinforcement waves: rush scarabs telegraph a three-cell charge; burrowers open mineral tunnels; spore flowers fire straight volleys stopped by terrain; split jellies divide unless killed with cold or terrain; blast ticks detonate into nearby stone and creatures; shield turtles guard their facing, with flanking, cold, terrain and repeated front hits as counters. Each has a distinct animated silhouette and visible attack tells. The field guide lists their counters. Saves retain charges, fuses, frozen states and broken shields; earlier saves change only untouched creatures ahead.

XP levels accumulate while drilling. Perk choices and equipment comparisons are held for safe stratum exits, preserving continuous excavation and cascades. Camp shops and permanent upgrades support different builds. The earlier game's base upgrades and active exploration build are retained when migrating into the new shafts.

## Turn mode

Choose **ターン制** on the title screen for a new expedition, or switch the current expedition from the pause screen. **リアルタイム** retains continuous play. The choice for new expeditions is remembered, and each saved expedition retains its own mode and turn count. Existing saves continue in real time until switched.

One direction tap performs one move, mining hit or attack. The large action button becomes **待つ**, advancing the world without choosing a movement direction. Resonance and a usable potion each cost one turn; element selection, menus, impossible movement and unavailable abilities cost none. A held direction repeats after 450 ms, then every 240 ms; waiting is tap-only. A direction takes priority when held together with the large action button, in either press order, without adding a wait turn. Nearby visible creatures, falling stone, hatching or attack warnings, an approaching cave-in, damage and shield consumption suspend the directional hold. Release and press again to choose the next action; combat never continues automatically through the warning. Missed frames never produce catch-up turns. Space, period or 5 waits on keyboard. Quick taps are queued even if released before the next animation frame.

Enemies, player gravity, falling groups, fluids, reinforcements, attack warnings, overhead collapse and cooldowns advance only on accepted actions. A falling group gets a whole decision of warning, then falls one cell per action. New creatures wait before acting. Ordinary creatures approach or attack, and a drill hit interrupts the target's response. Damage and shield consumption protect the explorer for the next two accepted turns, leaving time to retreat, attack or heal without taking damage on every input. The HUD shows remaining protected actions; realtime damage intervals, creature counts and specialist varieties are unchanged. Guardian column warnings allow two moves before striking. Freeze and resonance cooldowns count turns; equipment/perk speed bonuses become attack strength. Visual flashes can fade while the world clock is stopped. Saves preserve the pending warnings and timers without advancing a turn or adding invulnerability on resume.

## Terrain tactics (v2.6)

Horizontal movement pushes a neighboring round boulder into an empty cell and follows it; upward/downward drilling still breaks it, and a blocked push falls back to mining. The same directions push frozen creatures with **氷棺の印**. Pushes never overwrite enemies, falling masses, fixtures, treasures or the gate. Dotted paths and landing outlines show where a moving mass, or an adjacent boulder after a push, would land in the current terrain; other future actions may change that projection.

Ordinary melee creatures mark a fixed target cell before striking. One accepted turn (0.65 seconds in real time) gives the explorer a chance to dodge or interrupt. A missed attack leaves an **OPEN** recovery window. Scarab charges break soft/hard seams and strike other creatures; spore volleys hit the first creature, barrel or blocking terrain on their line. A barrel or blast tick can then trigger a chain explosion. These kills retain rewards and terrain synergies, and guardian shell gates still prevent skipping encounters.

Four nests in each stratum mix three short setups: a boulder beside a drop shaft, explosives guarded by blast ticks and shield turtles, and a side passage with healing behind a shield. Their order and side vary by seed and stratum. Dense nests, all six specialists and the two-moth cap remain. Earlier saves gain setups only in untouched depth at least ten rows beyond the explored area.

Three new checkpoint perks change how terrain is used:

- **震地の楔**: after a fall of at least two cells, landing masses send a horizontal shockwave. Hard walls block it; multiple tiles in one mass do not hit the same foe repeatedly.
- **氷棺の印**: frozen creatures can be pushed, and frozen kills leave movable ice blocks as shields and footholds. Ice lasts eight accepted turns or eight real-time seconds, with longer duration on repeat upgrades. The saved world clock determines expiry; thinking and menus freeze it.
- **鉱脈の余韻**: a chain of at least eight colored minerals stores one wider resonance or fallback pulse. It consumes no extra crystals, and cooldowns remain in force. The HUD marks the stored charge; repeat upgrades enlarge its range further.

The first checkpoint always offers one of these tactics alongside two other choices. Existing equipment, upgrades, mode selection and saves are retained.

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

`src/engine.mjs`: mining, gravity, support, cascades and progression. `src/turn-input.mjs`: deliberate taps and held-input repetition. `src/boss.mjs`: guardian shells, warnings and core openings. `src/render.mjs`: Canvas world. `src/app.mjs`: input, UI and storage. `src/audio.mjs`: sound synthesis. Tests cover initial world suspension, actor collisions, supported nests, specialist actions, three-part guardian encounters and dodges, landing chains, uninterrupted drilling, mobile pointer input and save migration. The automated pilot uses ordinary movement, mining and resonance inputs, including stepping out of warned guardian columns.
